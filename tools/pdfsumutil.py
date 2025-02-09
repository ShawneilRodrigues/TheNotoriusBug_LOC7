import os
import requests
import pdfplumber
import pandas as pd
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain.chains.summarize import load_summarize_chain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain import PromptTemplate
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def download_pdf(url, save_path="downloads/temp.pdf"):
    """
    Downloads a PDF from a given URL and saves it locally.
    """
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()

        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        with open(save_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=1024):
                file.write(chunk)

        return save_path
    except requests.exceptions.RequestException as e:
        return {"status": "error", "message": f"Failed to download PDF: {str(e)}"}

def extract_text_pdfplumber(pdf_path):
    """
    Extracts text from a PDF using pdfplumber.
    """
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""  # Handle None case
    return text.strip()

def extract_tables_pdfplumber(pdf_path):
    """
    Extracts tables from a PDF and converts them into Pandas DataFrames.
    """
    with pdfplumber.open(pdf_path) as pdf:
        all_tables = []
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                df = pd.DataFrame(table)
                all_tables.append(df)
    return all_tables

def summarize_pdf_logic(pdf_path):
    """
    Handles the core PDF summarization logic.
    """
    try:
        os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")
        if not os.environ["GOOGLE_API_KEY"]:
            raise ValueError("Missing GOOGLE_API_KEY in .env file")

        # Load the document
        loader = PyPDFLoader(pdf_path)
        docs = loader.load_and_split()
        
        # Extract tables
        tables = extract_tables_pdfplumber(pdf_path)
        tables_text = "\n\n".join([df.to_markdown() for df in tables]) if tables else "No tables found."

        # Initialize LLM
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash")

        # Split documents into chunks
        final_documents = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=100).split_documents(docs)

        # Summarization chain
        chain = load_summarize_chain(llm=llm, chain_type="refine")

        # Generate textual summary
        document_summary = chain.run(final_documents)

        # Table summary
        if not tables:
            table_summary = "No tables found."
        else:
            table_summary_prompt = PromptTemplate(
                input_variables=["tables"],
                template="""
                You are an expert data analyst. Given the extracted tables from a document, provide a structured summary highlighting key insights.
                Explain trends, comparisons, and any notable data points present in the tables.
                Tables: {tables}
                Summary:
                """
            )
            table_summary = llm.invoke(table_summary_prompt.format(tables=tables_text))

        return {
            "document_summary": document_summary,
            "table_summary": table_summary
        }
    
    except Exception as e:
        return {"status": "error", "message": str(e)}
