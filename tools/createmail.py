import os
from datetime import datetime
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class EmailRequest(BaseModel):
    topic: str
    context: str

os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

def generate_email(topic: str, context: str) -> str:
    """
    Generates a professional email based on a given topic and context.

    Args:
        topic (str): The email topic or subject.
        context (str): Additional details to include in the email.

    Returns:
        str: Generated email content.
    """
    # ✅ Get current date and time
    current_datetime = datetime.now().strftime("%A, %B %d, %Y - %I:%M %p")

    # ✅ Initialize Gemini LLM
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")

    # ✅ Define Email Prompt Template
    email_prompt = PromptTemplate(
        input_variables=["topic", "context", "datetime"],
        template="""You are an expert email writer. Stick to the topic and draft the email in a professional tone that is suitable for everyone.

        **DO NOT INCLUDE any placeholders like [Your Name], [Recipient Name], or similar.** Ensure that the email is complete.

        Generate a professional email based on the given **topic and context** with the following format:

        **Date:** {datetime}

        **Subject:** (A clear and concise subject line)
        **Greeting:** (Appropriate greeting based on context)
        **Body:** (A well-structured message with a polite and professional tone)
        **Closing:** (A professional closing)

        Topic: `{topic}`
        Context: `{context}`

        **Generated Email:**
        """
    )

    # ✅ Define Chain
    chain = LLMChain(llm=llm, prompt=email_prompt)

    # ✅ Run the chain to generate email
    response = chain.invoke({"topic": topic, "context": context, "datetime": current_datetime})
    return response['text']
