import io
from fastapi import FastAPI, File, UploadFile,HTTPException,Form,Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from groq import Groq
from tools.speech2text import transcribe_audio
from tools.fileupload import upload_file_to_supabase
from tools.createmail import generate_email, EmailRequest
from tools.emailsend import send_email_logic
from tools.pdfsumutil import download_pdf, summarize_pdf_logic
from tools.zoom import get_zoom_response, agent
from tools.websearch import search_web
from tools.image_chat import describe_image
from tools.text2speech import text_to_speech
from tools.graphdb import generate_cypher_query
from tools.sms_agent import send_sms, SMSRequest
# ✅ Initialize FastAPI
app = FastAPI()


# ✅ Enable CORS (for frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ FastAPI Endpoint to Transcribe Audio
@app.post("/transcribe-audio/")
async def transcribe_audio_endpoint(file: UploadFile = File(...)):
    """
    API endpoint to transcribe an audio file using Groq Whisper.

    Args:
        file (UploadFile): The uploaded audio file.

    Returns:
        JSON: Transcription result.
    """
    try:
        # Convert uploaded file to BytesIO
        file_content = await file.read()
        file_io = io.BytesIO(file_content)

        # Transcribe audio
        result = transcribe_audio(file_io, file.filename)

        return result

    except Exception as e:
        return {"status": "error", "message": str(e)}

# ✅ FastAPI Endpoint to Upload File
@app.post("/upload-file/")
async def upload_file_endpoint(file: UploadFile = File(...)):
    """
    API endpoint to upload a file to Supabase Storage.

    Args:
        file (UploadFile): The uploaded file.

    Returns:
        JSON: Upload result.
    """
    try:
        # Convert uploaded file to BytesIO
        file_content = await file.read()
        file_io = io.BytesIO(file_content)

        # Upload file
        result = upload_file_to_supabase(file_io, file.filename)

        return result

    except Exception as e:
        return {"status": "error", "message": str(e)}

# ✅ FastAPI Endpoint
@app.post("/generate-email/")
async def generate_email_endpoint(request: EmailRequest):
    """
    API endpoint to generate a professional email.

    Args:
        request (EmailRequest): Request body containing API key, topic, and context.

    Returns:
        JSON: Generated email.
    """
    try:
        email_content = generate_email(request.api_key, request.topic, request.context)
        return {"status": "success", "email": email_content}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/send-email/")
async def send_email_from_app(email_data: EmailRequest):
    """
    API Endpoint to send an email.

    Args:
        email_data (EmailRequest): Email details.

    Returns:
        dict: Email sending status.
    """
    return send_email_logic(email_data)

@app.post("/summarize-pdf-url/")
async def summarize_pdf_from_url(pdf_url: str):
    """
    API Endpoint to fetch and summarize a PDF from a given URL.
    Return a text summary and a tables summary
    """
    try:
        # Download the PDF
        downloaded_pdf_path = download_pdf(pdf_url)
        if isinstance(downloaded_pdf_path, dict):  # Handle download error
            raise HTTPException(status_code=400, detail=downloaded_pdf_path["message"])

        # Call summarization logic
        summary = summarize_pdf_logic(downloaded_pdf_path)

        return summary

    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/get_response_zoom")
def get_response(request: str):
    """FastAPI endpoint to process prompts using the agent."""
    return get_zoom_response(agent, request)

@app.post("/describe-image/")
async def describe_image_endpoint(request: str):
    """
    Describe the content of an image given its path.
    """
    try:
        description = describe_image(request)
        return JSONResponse(content={"description": description})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.post("/text-to-speech/")
async def text_to_speech_endpoint(text: str = Form(...), target_lang: str = Form("en")):
    """
    Converts text to speech and returns audio as a streaming response.
    """
    try:
        translated_text, audio_bytes = text_to_speech(text, target_lang)
        audio_buffer = io.BytesIO(audio_bytes)
        return StreamingResponse(audio_buffer, media_type="audio/mpeg", headers={"Content-Disposition": "inline; filename=speech.mp3"})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


@app.get("/search-web/")
async def search_web_endpoint(query: str = Query(..., description="Search query")):
    """
    Search the web and return AI-enhanced results.
    """
    try:
        result = search_web(query)
        return JSONResponse(content={"result": result})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/generate-cypher-query/")
async def generate_cypher_query_endpoint(request: dict):
    """
    Generate a Cypher query based on the input parameters.
    """
    try:
        query = generate_cypher_query(request)
        return JSONResponse(content={"query": query})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)



@app.post("/send-sms/")
async def send_sms_endpoint(request: SMSRequest):
    """
    Send an SMS using Twilio and format the message using Gemini.

    Args:
        request (SMSRequest): Request body containing text, recipient number, Twilio SID, Twilio Auth Token, Gemini API key, and optional from number.

    Returns:
        JSON: Message SID if successful, error message otherwise.
    """
    try:
        message_sid = send_sms(
            text=request.text,
            recipient_number=request.recipient_number,
            twilio_sid=request.twilio_sid,
            twilio_auth_token=request.twilio_auth_token,
            gemini_api_key=request.gemini_api_key,
            from_number=request.from_number
        )
        return JSONResponse(content={"message_sid": message_sid})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
