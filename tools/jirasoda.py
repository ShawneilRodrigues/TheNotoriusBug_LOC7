from transformers import pipeline
import os
from langchain.agents import AgentType, initialize_agent
from langchain_community.agent_toolkits.jira.toolkit import JiraToolkit
from langchain_community.utilities.jira import JiraAPIWrapper
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
load_dotenv()
def analyze_sentiment(text):
    """Analyze sentiment using a pre-trained model."""
    sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    result = sentiment_pipeline(text)
    return result[0]

def create_jira_issue(summary, description):
    """Create a Jira issue if frustration is detected."""
    os.environ["JIRA_API_TOKEN"] = os.getenv("JIRA_API_TOKEN")
    os.environ["JIRA_USERNAME"] = os.getenv("JIRA_USERNAME")
    os.environ["JIRA_INSTANCE_URL"] = os.getenv("JIRA_INSTANCE_URL")
    os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")
    os.environ["JIRA_CLOUD"] = "true"  # Add this line to indicate it's a Jira Cloud instance
    
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
    jira = JiraAPIWrapper()
    toolkit = JiraToolkit.from_jira_api_wrapper(jira)
    agent = initialize_agent(toolkit.get_tools(), llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
    
    response = agent.run(f"Create a new issue in project NOTR with the summary '{summary}' and description '{description}'. Issue-type Epic")
    return response

def escalate_if_frustrated(text):
    """Escalates to Jira if frustration is detected."""
    sentiment = analyze_sentiment(text)
    if sentiment['label'] == 'NEGATIVE' and sentiment['score'] > 0.75:
        jira_response = create_jira_issue("Frustrated User Issue", text)
        return f"Escalated to Jira: {jira_response}"
    return f"Sentiment: {sentiment['label']} (Confidence: {sentiment['score']:.2f})"
