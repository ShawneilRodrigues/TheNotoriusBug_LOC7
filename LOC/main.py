from fastapi import FastAPI, UploadFile, File, Form
from fastapi import Query
import shutil
import tempfile
from pathlib import Path
import os

# Import custom RAG and Web Search functions
from rag_module.rag import process_pdf, query_rag
from websearch.websearch import search_web
from rag_module.video_summarizer import process_video

app = FastAPI()

# Upload folders for PDFs and Videos
PDF_UPLOAD_FOLDER = "document_store/pdfs/"
VIDEO_UPLOAD_FOLDER = "document_store/videos/"

os.makedirs(PDF_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(VIDEO_UPLOAD_FOLDER, exist_ok=True)


# 📌 Upload and Process PDF
@app.post("/upload/")
def upload_pdf(file: UploadFile = File(...)):
    file_path = os.path.join(PDF_UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    doc_count = process_pdf(file_path)
    return {"message": "Document processed successfully!", "chunks": doc_count}


# 📌 Query RAG Model
@app.post("/query/")
def get_answer(query: str = Query(..., title="User Query")):
    response = query_rag(query)
    return {"answer": response}


# 📌 Web Search Endpoint
@app.get("/websearch/")
def get_websearch_results(query: str = Query(..., title="Search Query")):
    csv_result = search_web(query)
    return {"csv_data": csv_result}


# 📌 Video Summarization Endpoint
@app.post("/summarize-video/")
def summarize_video(file: UploadFile = File(...), query: str = Form(...)):
    """
    Uploads a video and returns a summary based on user queries.
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
            shutil.copyfileobj(file.file, temp_video)
            video_path = temp_video.name
        
        # Close the file before processing
        temp_video.close()

        # Process video for summarization
        summary = process_video(video_path, query)

        # Cleanup temporary file
        Path(video_path).unlink(missing_ok=True)

        return {"summary": summary}

    except Exception as e:
        return {"error": str(e)}
