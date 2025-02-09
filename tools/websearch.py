from phi.agent import Agent
from phi.model.google import Gemini
from phi.tools.duckduckgo import DuckDuckGo

import os
from dotenv import load_dotenv
load_dotenv()
os.environ['GOOGLE_API_KEY'] = os.getenv('GEMINI_API_KEY')

web_search_agent = Agent(
    name="web search agent",
    role="search the web for the information",
    model=Gemini(id="gemini-1.5-flash"),
    tools=[DuckDuckGo()],
    instructions=["Always include the sources"],
    show_tool_calls=True,
    markdown=True,
)

def search_web(query):
    response = web_search_agent.run(query)
    # Extract relevant information from RunResponse
    result = {
        "query": query,
        "response": response.content,  # Assuming response has a content attribute
        # "messages": [msg.content for msg in response.messages],  # Extract messages content
        # "references": [ref for msg in response.messages for ref in (msg.references or [])]  # Extract references from all messages
    }
    return result

# Example usage
if __name__ == "__main__":
    query = "What are the latest anime news in the last 24 hours?"
    result = search_web(query)
    print(result)