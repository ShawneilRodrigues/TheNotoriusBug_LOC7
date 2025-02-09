import os
import time
import requests
import base64
from typing import Optional
from phi.model.google import Gemini
from phi.utils.log import logger
from phi.agent import Agent
from phi.tools.zoom import ZoomTool
from dotenv import load_dotenv

load_dotenv()
os.environ['GOOGLE_API_KEY'] = os.environ.get('GOOGLE_API_KEY')

class CustomZoomTool(ZoomTool):
    def __init__(
        self,
        account_id: Optional[str] = None,
        client_id: Optional[str] = None,
        client_secret: Optional[str] = None,
        name: str = "zoom_tool",
    ):
        super().__init__(account_id=account_id, client_id=client_id, client_secret=client_secret, name=name)
        self.token_url = "https://zoom.us/oauth/token"
        self.access_token = None
        self.token_expires_at = 0

    def get_access_token(self) -> str:
        """
        Obtain or refresh the access token for Zoom API using Server-to-Server OAuth.
        Returns:
            str: The access token or an empty string if token retrieval fails.
        """
        if self.access_token and time.time() < self.token_expires_at:
            return str(self.access_token)

        # Create base64 encoded authorization header
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_bytes = auth_string.encode('ascii')
        auth_b64 = base64.b64encode(auth_bytes).decode('ascii')

        headers = {
            "Authorization": f"Basic {auth_b64}",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        # Use account_credentials grant type for Server-to-Server OAuth
        data = {
            "grant_type": "account_credentials",
            "account_id": self.account_id
        }

        try:
            response = requests.post(
                self.token_url,
                headers=headers,
                data=data
            )
            
            # Log detailed error information
            if not response.ok:
                logger.error(f"Token request failed with status {response.status_code}")
                logger.error(f"Response content: {response.text}")
                logger.error(f"Request headers: {headers}")
                logger.error(f"Request data: {data}")
                return ""

            token_info = response.json()
            self.access_token = token_info["access_token"]
            expires_in = token_info["expires_in"]
            self.token_expires_at = time.time() + expires_in - 60

            self._set_parent_token(str(self.access_token))
            logger.debug("Successfully obtained new access token")
            return str(self.access_token)
            
        except requests.RequestException as e:
            logger.error(f"Error fetching access token: {e}")
            logger.error(f"Response content: {e.response.content if hasattr(e, 'response') else 'No response content'}")
            return ""

    def _set_parent_token(self, token: str) -> None:
        """Helper method to set the token in the parent ZoomTool class"""
        if token:
            self._ZoomTool__access_token = token


# Get environment variables
ACCOUNT_ID = os.getenv("ZOOM_ACCOUNT_ID")
CLIENT_ID = os.getenv("ZOOM_CLIENT_ID")
CLIENT_SECRET = os.getenv("ZOOM_CLIENT_SECRET")

# Initialize the custom Zoom tool
zoom_tools = CustomZoomTool(account_id=ACCOUNT_ID, client_id=CLIENT_ID, client_secret=CLIENT_SECRET)

# Create the agent
agent = Agent(
    name="Zoom Meeting Manager",
    agent_id="zoom-meeting-manager",
    model=Gemini(id="gemini-2.0-flash-exp"),
    tools=[zoom_tools],
    markdown=True,
    debug_mode=True,
    show_tool_calls=True,
    instructions=[
        "You are an expert at managing Zoom meetings using the Zoom API.",
        "You can:",
        "1. Schedule new meetings (schedule_meeting)",
        "2. Get meeting details (get_meeting)",
        "3. List all meetings (list_meetings)",
        "4. Get upcoming meetings (get_upcoming_meetings)",
        "5. Delete meetings (delete_meeting)",
        "6. Get meeting recordings (get_meeting_recordings)",
        "",
        "For recordings, you can:",
        "- Retrieve recordings for any past meeting using the meeting ID",
        "- Include download tokens if needed",
        "- Get recording details like duration, size, download link and file types",
        "",
        "Guidelines:",
        "- Use ISO 8601 format for dates (e.g., '2024-12-28T10:00:00Z')",
        "- Ensure meeting times are in the future",
        "- Provide meeting details after scheduling (ID, URL, time)",
        "- Handle errors gracefully",
        "- Confirm successful operations",
    ],
)

#agent.print_response("Schedule a meeting titled 'Team Sync' 8th december at 2 PM UTC for 45 minutes")
#agent.print_response("delete a meeting titled 'Team Sync' which scheduled tomorrow at 2 PM UTC for 45 minutes")
#agent.print_response("List all my scheduled meetings")



def get_agent_response(agent: Agent, prompt: str) -> dict:
    """
    Run the agent with the given prompt and return a structured response.
    
    Args:
        agent (Agent): The initialized agent instance
        prompt (str): The prompt/command to send to the agent
        
    Returns:
        dict: A dictionary containing the response details with the following structure:
            {
                'status': str,  # 'success' or 'error'
                'message': str,  # The agent's response message
                'error': str,    # Error message if any (None if successful)
                'tool_calls': list,  # List of tool calls made (if show_tool_calls is True)
            }
    """
    try:
        # Run the agent with the prompt
        response = agent.run(prompt)
        
        # Initialize the result dictionary
        result = {
            'status': 'success',
            'message': response,
            'error': None,
            'tool_calls': []
        }
        
        # If show_tool_calls is enabled and tool calls are available
        if agent.show_tool_calls and hasattr(agent, '_Agent__tool_calls'):
            result['tool_calls'] = agent._Agent__tool_calls
            
        return result
        
    except Exception as e:
        # Handle any errors that occur during execution
        error_message = str(e)
        logger.error(f"Error running agent: {error_message}")
        
        return {
            'status': 'error',
            'message': None,
            'error': error_message,
            'tool_calls': []
        }
    
print(get_agent_response(agent, "Schedule a meeting titled 'Team Sync' 8th december at 2 PM UTC for 45 minutes"))