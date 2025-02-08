from gtts import gTTS
from deep_translator import GoogleTranslator
import os

# Create a directory to store generated audio files
OUTPUT_FOLDER = "document_store/audio/"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def text_to_speech(text: str, target_lang: str = "en") -> tuple:
    """
    Translates the input text into the target language, converts it to speech, 
    and saves the audio file.
    
    Returns:
        - Translated text
        - Path to the generated MP3 file
    """
    # Translate text if needed
    translated_text = GoogleTranslator(source="auto", target=target_lang).translate(text)

    # Generate file path
    file_path = os.path.join(OUTPUT_FOLDER, f"speech_{target_lang}.mp3")

    # Delete old file if exists
    if os.path.exists(file_path):
        os.remove(file_path)

    # Generate speech
    tts = gTTS(text=translated_text, lang=target_lang)
    tts.save(file_path)

    return translated_text, file_path  # Returns both translated text & audio path
