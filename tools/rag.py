import requests
from langchain_community.document_loaders import PDFPlumberLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.vectorstores import InMemoryVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini API
os.environ['GOOGLE_API_KEY'] = os.environ.get('GEMINI_API_KEY')  # Replace with your actual API key
genai.configure(api_key=os.environ['GOOGLE_API_KEY'])

# Setup models
EMBEDDING_MODEL = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
DOCUMENT_VECTOR_DB = InMemoryVectorStore(EMBEDDING_MODEL)
LANGUAGE_MODEL = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", temperature=0)

PROMPT_TEMPLATE = """
You are an expert research assistant. Use the provided context to answer the query. 
If unsure, state that you don't know. Be concise and factual (max 3 sentences).

Query: {user_query}

Context: {document_context}

Answer: """

def fetch_pdf_from_url(pdf_url):
    """Fetches the PDF from a given URL and saves it temporarily."""
    response = requests.get(pdf_url)
    
    if response.status_code != 200:
        raise Exception(f"Failed to fetch PDF: {response.status_code}")
    
    temp_pdf_path = "temp_downloaded.pdf"
    
    with open(temp_pdf_path, "wb") as f:
        f.write(response.content)

    return temp_pdf_path

def process_pdf(pdf_url):
    """
    Fetches the PDF from the given URL, extracts text, and stores embeddings.
    """
    file_path = fetch_pdf_from_url(pdf_url)  # Fetch and save temporarily

    document_loader = PDFPlumberLoader(file_path)
    raw_documents = document_loader.load()
    
    text_processor = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    document_chunks = text_processor.split_documents(raw_documents)
    
    DOCUMENT_VECTOR_DB.add_documents(document_chunks)
    
    # Clean up the temporary file
    os.remove(file_path)
    
    return len(document_chunks)

def query_rag(user_query):
    """
    Performs a similarity search and generates a response using RAG.
    """
    relevant_docs = DOCUMENT_VECTOR_DB.similarity_search(user_query)
    context_text = "\n\n".join([doc.page_content for doc in relevant_docs])
    
    conversation_prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    response_chain = conversation_prompt | LANGUAGE_MODEL
    
    return response_chain.invoke({"user_query": user_query, "document_context": context_text})
