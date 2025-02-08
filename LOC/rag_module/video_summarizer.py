import os
import time
import tempfile
from pathlib import Path
from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.duckduckgo import DuckDuckGo
from google.generativeai import upload_file, get_file
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

if API_KEY:
    import google.generativeai as genai
    genai.configure(api_key=API_KEY)

# Initialize AI Agent
video_agent = Agent(
    name="Video AI Summarizer",
    model=Gemini(id="gemini-2.0-flash-exp"),
    tools=[DuckDuckGo()],
    markdown=True,
)

def process_video(file_path: str, user_query: str) -> str:
    """
    Uploads a video, processes it using Gemini, and returns the AI-generated summary.
    """
    try:
        # Upload video file to Gemini
        processed_video = upload_file(file_path)
        
        # Wait for processing
        while processed_video.state.name == "PROCESSING":
            time.sleep(1)
            processed_video = get_file(processed_video.name)

        # Generate prompt for analysis
        analysis_prompt = (
            f"Analyze the uploaded video for content and context.\n"
            f"Respond to the following query using video insights and supplementary web research:\n"
            f"{user_query}\n"
            f"Provide a detailed, user-friendly, and actionable response."
        )

        # AI processing
        response = video_agent.run(analysis_prompt, videos=[processed_video])

        return response.content

    except Exception as e:
        return f"Error processing video: {str(e)}"

