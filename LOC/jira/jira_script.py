from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.jira_tools import JiraTools

import os
from dotenv import load_dotenv
load_dotenv()
os.environ['GOOGLE_API_KEY'] =os.environ.get('GOOGLE_API_KEY') 
JIRA_SERVER_URL = os.getenv("JIRA_SERVER_URL")
JIRA_USERNAME = os.getenv("JIRA_USERNAME")
JIRA_API_TOKEN = os.getenv("JIRA_API_TOKEN")
JIRA_PROJECT_KEY = os.getenv("JIRA_PROJECT_KEY")

agent = Agent(tools=[JiraTools()],model=Gemini(id="gemini-2.0-flash-exp"))
agent.print_response("Find all issues in project NOT", markdown=True)
