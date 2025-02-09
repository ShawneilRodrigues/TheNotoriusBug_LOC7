from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.googlecalendar import GoogleCalendarTools
import datetime
import os
from tzlocal import get_localzone_name
import os
from dotenv import load_dotenv
load_dotenv()
os.environ['GOOGLE_API_KEY'] =os.environ.get('GOOGLE_API_KEY') 

agent = Agent(
     model=Gemini(id="gemini-2.0-flash-exp"),
    tools=[GoogleCalendarTools(credentials_path="LOC7.0\LOC\google_calender\client_secret_3975652732-0vl14higi5628u9vcsv78uqubrrarh50.apps.googleusercontent.com.json")],
    show_tool_calls=True,
    instructions=[
        f"""
        You are scheduling assistant . Today is {datetime.datetime.now()} and the users timezone is {get_localzone_name()}.
        You should help users to perform these actions in their Google calendar:
            - get their scheduled events from a certain date and time
            - create events based on provided details
        """
    ],
    add_datetime_to_instructions=True,
)

agent.print_response("Give me the list of todays events", markdown=True)


