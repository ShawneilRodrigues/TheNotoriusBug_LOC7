from phi.agent import Agent
from phi.model.google import Gemini
import os
from dotenv import load_dotenv
load_dotenv()
os.environ['GOOGLE_API_KEY'] =os.environ.get('GOOGLE_API_KEY') 

def describe_image(image_path: str) -> str:
    """
    Describe the content of an image using Phidata's Agent.

    Parameters:
    - image_path (str): The file path to the image to describe.

    Returns:
    - str: Description of the image.
    """
    # Initialize the AI agent
    agent = Agent(
       model=Gemini(id="gemini-2.0-flash-exp"),
        markdown=True,
    )

    # Get description from the AI model
    response = agent.get_response(
        "Describe the content of the image.",
        images=[image_path],
    )

    return response.content  # Extract text response
