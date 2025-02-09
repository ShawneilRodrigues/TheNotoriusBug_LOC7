from groq import Groq
import os
import dotenv
dotenv.load_dotenv()
# ✅ Groq API Key (Keep this secret)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def transcribe_audio(file_obj, file_name: str):
    """
    Transcribes an audio file using Groq Whisper.

    Args:
        file_obj (BytesIO): The file object in memory.
        file_name (str): The name of the file.

    Returns:
        dict: Status, filename, and transcription.
    """
    try:
        # Transcribe using Groq API
        transcription = client.audio.transcriptions.create(
            file=(file_name, file_obj.read()),  # Read file content
            model="whisper-large-v3",
            response_format="json",
            language="en",
            temperature=0.0
        )

        return {
            "status": "success",
            "filename": file_name,
            "transcription": transcription.text
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

