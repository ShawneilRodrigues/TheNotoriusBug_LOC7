from gtts import gTTS
from deep_translator import GoogleTranslator
import io

def text_to_speech(text: str, target_lang: str = "en") -> tuple:
    """
    Translates the input text into the target language, converts it to speech, 
    and returns the generated audio as bytes.
    
    Returns:
        - Translated text
        - Audio as bytes
    """
    # Translate text if needed
    translated_text = GoogleTranslator(source="auto", target=target_lang).translate(text)

    # Generate speech
    tts = gTTS(text=translated_text, lang=target_lang)
    
    # Store audio in a memory buffer instead of a file
    audio_buffer = io.BytesIO()
    tts.save(audio_buffer)
    audio_buffer.seek(0)  # Reset buffer position

    return translated_text, audio_buffer.getvalue()  # Returns text and raw audio bytes
