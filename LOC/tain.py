import os
import json
import shutil
import tempfile
from enum import Enum
from pathlib import Path
from typing import Optional, Union, Dict, Any
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File, Form, Query, HTTPException
from fastapi.responses import FileResponse
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# Import your functionality
from rag_module.rag import process_pdf, query_rag
from websearch.websearch import search_web
from rag_module.video_summarizer import process_video
from image_chat.image_chat import describe_image

# Environment setup
from dotenv import load_dotenv
load_dotenv()

# Initialize Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-pro')



# Constants
class FileType(str, Enum):
    PDF = "pdf"
    VIDEO = ["mp4", "mov", "avi"]
    IMAGE = ["jpg", "jpeg", "png"]
    NONE = "none"

class ActionType(str, Enum):
    PDF_QUERY = "pdf_query"
    VIDEO_SUMMARIZATION = "video_summarization"
    IMAGE_DESCRIPTION = "image_description"
    WEB_SEARCH = "web_search"
    DIRECT_QUERY = "direct_query"

# Request/Response Models
class ProcessResponse(BaseModel):
    action: ActionType
    result: Dict[str, Any]
    error: Optional[str] = None

class StorageConfig:
    UPLOAD_BASE = "document_store"
    PDF_FOLDER = f"{UPLOAD_BASE}/pdfs/"
    VIDEO_FOLDER = f"{UPLOAD_BASE}/videos/"
    IMAGE_FOLDER = f"{UPLOAD_BASE}/images/"

    @classmethod
    def initialize(cls):
        for folder in [cls.PDF_FOLDER, cls.VIDEO_FOLDER, cls.IMAGE_FOLDER]:
            os.makedirs(folder, exist_ok=True)

app = FastAPI()
StorageConfig.initialize()

# ✅ Enable CORS (for frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestRouter:
    @staticmethod
    def get_file_type(file: Optional[UploadFile]) -> FileType:
        if not file:
            return FileType.NONE
        extension = file.filename.split('.')[-1].lower()
        if extension == FileType.PDF:
            return FileType.PDF
        if extension in FileType.VIDEO:
            return FileType.VIDEO
        if extension in FileType.IMAGE:
            return FileType.IMAGE
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {extension}")

    @staticmethod
    def determine_action(file_type: FileType, text: str) -> ActionType:
        if file_type == FileType.PDF:
            return ActionType.PDF_QUERY
        if file_type == FileType.VIDEO:
            return ActionType.VIDEO_SUMMARIZATION
        if file_type == FileType.IMAGE:
            return ActionType.IMAGE_DESCRIPTION
        if file_type == FileType.NONE:
            return ActionType.DIRECT_QUERY
        return ActionType.WEB_SEARCH

class ActionHandler:
    @staticmethod
    async def handle_pdf_query(file: UploadFile, text: str) -> Dict[str, Any]:
        pdf_path = os.path.join(StorageConfig.PDF_FOLDER, file.filename)
        try:
            with open(pdf_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            process_pdf(pdf_path)
            answer = query_rag(text)
            return {"answer": answer}
        finally:
            Path(pdf_path).unlink(missing_ok=True)

    @staticmethod
    async def handle_video_summarization(file: UploadFile, text: str) -> Dict[str, Any]:
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file.filename.split('.')[-1]}") as temp_video:
            shutil.copyfileobj(file.file, temp_video)
            video_path = temp_video.name
        try:
            summary = process_video(video_path, text)
            return {"summary": summary}
        finally:
            Path(video_path).unlink(missing_ok=True)

    @staticmethod
    async def handle_image_description(file: UploadFile) -> Dict[str, Any]:
        image_path = os.path.join(StorageConfig.IMAGE_FOLDER, file.filename)
        try:
            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            description = describe_image(image_path)
            return {"description": description}
        finally:
            Path(image_path).unlink(missing_ok=True)

    @staticmethod
    async def handle_web_search(text: str) -> Dict[str, Any]:
        result = search_web(text)
        return {"result": result}

    @staticmethod
    async def handle_direct_query(text: str) -> Dict[str, Any]:
        response = model.generate_content(text)
        return {"response": response.text}

@app.post("/process-request/", response_model=ProcessResponse)
async def process_request(
    file: Optional[UploadFile] = File(None),
    text: str = Form(...)
) -> ProcessResponse:
    try:
        # Determine file type and action
        file_type = RequestRouter.get_file_type(file)
        action = RequestRouter.determine_action(file_type, text)

        # Handle the action
        handler = ActionHandler()
        result = {}

        if action == ActionType.PDF_QUERY:
            result = await handler.handle_pdf_query(file, text)
        elif action == ActionType.VIDEO_SUMMARIZATION:
            result = await handler.handle_video_summarization(file, text)
        elif action == ActionType.IMAGE_DESCRIPTION:
            result = await handler.handle_image_description(file)
        elif action == ActionType.WEB_SEARCH:
            result = await handler.handle_web_search(text)
        elif action == ActionType.DIRECT_QUERY:
            result = await handler.handle_direct_query(text)

        return ProcessResponse(action=action, result=result)

    except Exception as e:
        return ProcessResponse(
            action=action,
            result={},
            error=str(e)
        )