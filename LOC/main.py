from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi import Query
import shutil
import tempfile
from pathlib import Path
import os

# Import custom RAG and Web Search functions
from rag_module.rag import process_pdf, query_rag
from websearch.websearch import search_web
from rag_module.video_summarizer import process_video
from tts_module.text_to_speech import text_to_speech
from image_chat.image_chat import describe_image

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


# 📌 Text-to-Speech Endpoint
@app.get("/translate-and-speak/")
def translate_and_speak(text: str = Query(..., title="Text to Convert"), lang: str = Query("en", title="Target Language")):
    """
    Translates the given text into the specified language and generates speech.
    
    Returns:
        - Translated text
        - MP3 file containing speech
    """
    try:
        translated_text, file_path = text_to_speech(text, lang)
        return {
            "translated_text": translated_text,
            "audio_file": f"http://127.0.0.1:8000/download-audio/?file_path={file_path}"
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/download-audio/")
def download_audio(file_path: str):
    """
    Allows the user to download the generated MP3 file.
    """
    return FileResponse(file_path, media_type="audio/mpeg", filename=file_path.split("/")[-1])



# 📌 Image Description Endpoint
# Create a directory for storing images
IMAGE_UPLOAD_FOLDER = "document_store/images/"
os.makedirs(IMAGE_UPLOAD_FOLDER, exist_ok=True)

@app.post("/describe-image/")
async def upload_and_describe_image(file: UploadFile = File(...)):
    """
    Uploads an image and returns a description of its content.
    """
    try:
        # Save the uploaded file
        file_path = os.path.join(IMAGE_UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process the image with AI model
        description = describe_image(file_path)

        # Cleanup (optional)
        Path(file_path).unlink(missing_ok=True)

        return {"description": description}

    except Exception as e:
        return {"error": str(e)}