from fastapi import FastAPI, UploadFile, File, Form
from fastapi import Query
import shutil
from rag_module.rag import process_pdf, query_rag
from websearch.websearch import search_web
import tempfile
from pathlib import Path
from rag_module.video_summarizer import process_video
import os

app = FastAPI()
UPLOAD_FOLDER = "document_store/pdfs/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload/")
def upload_pdf(file: UploadFile = File(...)):
    file_path = UPLOAD_FOLDER + file.filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    doc_count = process_pdf(file_path)
    return {"message": "Document processed successfully!", "chunks": doc_count}

@app.get("/query/")
def get_answer(query: str = Query(..., title="User Query")):
    response = query_rag(query)
    return {"answer": response}



@app.get("/websearch/")
def get_websearch_results(query: str = Query(..., title="Search Query")):
    csv_result = search_web(query)
    return {"csv_data": csv_result}



UPLOAD_FOLDER = "document_store/videos/"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/summarize-video/")
def summarize_video(file: UploadFile = File(...), query: str = Form(...)):
    """
    Uploads a video and returns a summary based on user queries.
    """
    try:
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp_video:
            shutil.copyfileobj(file.file, temp_video)
            video_path = temp_video.name

        # Process the video
        summary = process_video(video_path, query)

        # Cleanup
        Path(video_path).unlink(missing_ok=True)

        return {"summary": summary}

    except Exception as e:
        return {"error": str(e)}
