import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from pydantic import BaseModel
from twilio.rest import Client
from dotenv import load_dotenv
load_dotenv()
class SMSRequest(BaseModel):
    text: str
    recipient_number: str
    twilio_sid: str = os.getenv("TWILIO_SID")
    twilio_auth_token: str = os.getenv("TWILIO_AUTH_TOKEN")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY")
    from_number: str = "+12763228897"


# ✅ Initialize Gemini Model (API key should be passed dynamically)
def generate_sms_format(api_key: str, text: str) -> str:
    """
    Generates a formatted SMS with a title and body using Gemini 1.5 Flash.

    :param api_key: Google API key for authentication
    :param text: The input text to be formatted
    :return: Formatted SMS message
    """
    os.environ['GOOGLE_API_KEY'] = api_key  # Dynamically set API key

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

    text_sms = PromptTemplate(
        input_variables=['text'],
        template="""
        You are a helpful assistant that drafts company SMS.
        Given the text, please format it in such a way that it has:
        - **Title**
        - **Body content** (in an alert tone)

        Input text:
        `{text}`
        **Formatted Output:**
        """
    )
    chain = LLMChain(llm=llm, prompt=text_sms)
    return chain.invoke({"text": text})

def send_sms(text, recipient_number, twilio_sid, twilio_auth_token, gemini_api_key, from_number="+12763228897"):
    """Formats text using Gemini and sends it via Twilio SMS."""
    formatted_sms = generate_sms_format(api_key=gemini_api_key,text=text)

    client = Client(twilio_sid, twilio_auth_token)
    message = client.messages.create(
        from_=from_number,
        to=recipient_number,
        body=formatted_sms,
    )

    return message.sid
