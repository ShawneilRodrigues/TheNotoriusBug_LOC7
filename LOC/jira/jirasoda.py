from transformers import pipeline
import os
from langchain.agents import AgentType, initialize_agent
from langchain_community.agent_toolkits.jira.toolkit import JiraToolkit
from langchain_community.utilities.jira import JiraAPIWrapper
from langchain_google_genai import ChatGoogleGenerativeAI

def analyze_sentiment(text):
    """Analyze sentiment using a pre-trained model."""
    sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
    result = sentiment_pipeline(text)
    return result[0]

def create_jira_issue(summary, description):
    """Create a Jira issue if frustration is detected."""
    os.environ["JIRA_API_TOKEN"] = "ATATT3xFfGF02VWRAB8A748WyoYkeg7iqCZr5fAB6t9y42immM8qIWdbeHUmjYmnIYNnHyGDdokLbSGBM7JN9R1OvV4a4uFRb5Jwqn_AcDTN2K-nTSFqxvjMjDdJD3ffy-V4RA3lzDrQF5VO0FqZhtnk9LE7UqGKOJUEVxN7Oc2t4R7BXFH3Ftg=BE79AE1F"
    os.environ["JIRA_USERNAME"] = "lilob4373@gmail.com"
    os.environ["JIRA_INSTANCE_URL"] = "https://locnotoriusbug.atlassian.net"
    os.environ["GOOGLE_API_KEY"] = "AIzaSyDaRLxg355SXAXYhCu7V5PbowTbSV5c_wY"
    os.environ["JIRA_CLOUD"] = "true"  # Add this line to indicate it's a Jira Cloud instance
    
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
    jira = JiraAPIWrapper()
    toolkit = JiraToolkit.from_jira_api_wrapper(jira)
    agent = initialize_agent(toolkit.get_tools(), llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True)
    
    response = agent.run(f"Create a new issue in project NOTR with the summary '{summary}' and description '{description}'. Issue-type 'Bug'")
    return response

def escalate_if_frustrated(text):
    """Escalates to Jira if frustration is detected."""
    sentiment = analyze_sentiment(text)
    if sentiment['label'] == 'NEGATIVE' and sentiment['score'] > 0.75:
        jira_response = create_jira_issue("Frustrated User Issue", text)
        return f"Escalated to Jira: {jira_response}"
    return f"Sentiment: {sentiment['label']} (Confidence: {sentiment['score']:.2f})"
