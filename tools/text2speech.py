from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from gtts import gTTS
from deep_translator import GoogleTranslator
import io
from supabase import create_client, Client

app = FastAPI()

# ✅ Supabase Credentials
SUPABASE_URL = "https://vfjlbmvuxkijzhcsmimc.supabase.co"
SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmamxibXZ1eGtpanpoY3NtaW1jIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODk4OTEzMywiZXhwIjoyMDU0NTY1MTMzfQ.2htuscBsRBqSxp0_u4rChMycbhFS3f0J0FtIucQf0uQ"
STORAGE_BUCKET = "files"

# ✅ Initialize Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def text_to_speech(text: str, target_lang: str = "en") -> tuple:
    """
    Converts text to speech and returns translated text with an audio file as BytesIO.
    """
    translated_text = GoogleTranslator(source="auto", target=target_lang).translate(text)

    # Generate speech and store in memory
    audio_buffer = io.BytesIO()
    tts = gTTS(text=translated_text, lang=target_lang)
    tts.save(audio_buffer)
    audio_buffer.seek(0)  # Move cursor to the start

    return translated_text, audio_buffer  # Returns text and audio as BytesIO


def upload_file_to_supabase(file_obj: io.BytesIO, file_name: str):
    """
    Uploads a file to Supabase Storage.
    """
    storage_path = f"uploads/{file_name}"  # Define storage path

    try:
        file_obj.seek(0)  # Reset file pointer

        # ✅ Upload file object with correct format
        response = supabase.storage.from_(STORAGE_BUCKET).upload(
            storage_path, file_obj.read(), file_options={"content-type": "audio/mpeg"}
        )

        # ✅ Check if the upload was successful
        if response:
            public_url = supabase.storage.from_(STORAGE_BUCKET).get_public_url(storage_path)
            return {
                "status": "success",
                "uploaded_as": storage_path,
                "url": public_url,
                "resource_url": f"{SUPABASE_URL}/storage/v1/object/public/{storage_path}"
            }
        else:
            return {"status": "error", "message": "Upload failed."}

    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/text-to-speech/")
async def text_to_speech_endpoint(text: str = Form(...), target_lang: str = Form("en")):
    """
    Converts text to speech, saves it in Supabase Storage, and returns the file URL.
    """
    try:
        translated_text, audio_buffer = text_to_speech(text, target_lang)

        # Generate a unique file name
        file_name = f"tts_{target_lang}_{hash(text)}.mp3"

        # Upload the file to Supabase
        upload_result = upload_file_to_supabase(audio_buffer, file_name)

        if upload_result["status"] == "success":
            return JSONResponse(
                content={
                    "translated_text": translated_text,
                    "file_url": upload_result["url"]
                },
                status_code=200
            )
        else:
            return JSONResponse(content={"error": upload_result["message"]}, status_code=500)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
