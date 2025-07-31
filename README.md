# OmniBot: Agentic AI for Enterprise Automation

[![View on GitHub](https://img.shields.io/badge/View%20on-GitHub-blue?logo=github)](https://github.com/ShawneilRodrigues/OmnoBot)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-000000?style=flat&logo=chainlink)](https://langchain.com/)
[![PhiData](https://img.shields.io/badge/PhiData-AI%20Agents-green)](https://www.phidata.com/)

## 🤖 Overview

OmniBot is an advanced agentic AI platform designed to automate enterprise workflows and streamline business operations. Built with cutting-edge technologies including **LangChain**, **PhiData**, and **Generative AI**, this platform autonomously executes tasks by integrating with external APIs such as Jira, Zoom, and more to enhance operational efficiency and reduce manual administrative effort.

## ✨ Key Features

### 🔧 **Agentic AI Automation**
- **Autonomous Task Execution**: Leverages LLMs to understand, plan, and execute complex business workflows
- **Multi-Modal Processing**: Handles text, images, videos, and audio for comprehensive data analysis
- **RAG (Retrieval-Augmented Generation)**: Advanced document processing and querying capabilities

### 🔗 **Enterprise Integrations**
- **📊 Jira Integration**: Automated project management and issue tracking
- **🎥 Zoom Integration**: Meeting management and scheduling automation  
- **📄 Document Processing**: PDF analysis and intelligent querying
- **🌐 Web Search**: Real-time information retrieval and processing
- **🗓️ Google Calendar**: Schedule management and coordination

### 🚀 **Advanced Capabilities**
- **Video Summarization**: AI-powered video content analysis and summarization
- **Image Analysis**: Computer vision for image description and processing
- **Text-to-Speech**: Voice synthesis for accessibility and automation
- **RESTful API**: FastAPI-based endpoints for seamless integration

## 🏗️ Architecture

```
OmnoBot/
├── LOC/                    # Main application directory
│   ├── app.py             # Enhanced FastAPI application
│   ├── main.py            # Core FastAPI server
│   ├── requirements.txt   # Project dependencies
│   │
│   ├── rag_module/        # RAG & Document Processing
│   │   ├── rag.py         # PDF processing and querying
│   │   └── video_summarizer.py
│   │
│   ├── jira/              # Jira Integration
│   │   ├── jira_script.py # Jira API automation
│   │   └── jirasoda.py    # Extended Jira functionality
│   │
│   ├── zoom_agent/        # Zoom Integration
│   │   └── zoom_agent.py  # Zoom meeting automation
│   │
│   ├── google_calender/   # Google Calendar Integration
│   │   └── google_calender.py
│   │
│   ├── image_chat/        # Computer Vision
│   │   └── image_chat.py  # Image analysis and description
│   │
│   ├── tts_module/        # Text-to-Speech
│   │   └── text_to_speech.py
│   │
│   ├── websearch/         # Web Search
│   │   └── websearch.py   # Real-time web information retrieval
│   │
│   └── document_store/    # File Storage
│       ├── audio/         # Audio files
│       └── images/        # Image assets
```

## 🛠️ Technology Stack

- **🧠 AI/ML**: LangChain, PhiData, Generative AI, RAG
- **🌐 Backend**: FastAPI, Python 3.12+
- **🔌 Integrations**: Jira API, Zoom API, Google Calendar API
- **📊 Data Processing**: PDFPlumber, OpenCV, Audio Processing
- **☁️ Infrastructure**: RESTful APIs, Containerized Deployment

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- API credentials for Jira, Zoom, and Google Calendar
- Required API keys (OpenAI, Google, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShawneilRodrigues/OmnoBot.git
   cd OmnoBot
   ```

2. **Install dependencies**
   ```bash
   cd LOC
   pip install -r requirements.txt
   ```

3. **Environment Setup**
   Create a `.env` file with your API credentials:
   ```env
   # AI Models
   GOOGLE_API_KEY=your_google_api_key
   OPENAI_API_KEY=your_openai_api_key
   
   # Jira Configuration
   JIRA_SERVER_URL=your_jira_url
   JIRA_USERNAME=your_username
   JIRA_API_TOKEN=your_api_token
   JIRA_PROJECT_KEY=your_project_key
   
   # Zoom Configuration
   ZOOM_ACCOUNT_ID=your_account_id
   ZOOM_CLIENT_ID=your_client_id
   ZOOM_CLIENT_SECRET=your_client_secret
   ```

4. **Run the application**
   ```bash
   uvicorn main:app --reload
   ```

## 📚 API Endpoints

### Document Processing
- `POST /upload/` - Upload and process PDF documents
- `POST /query/` - Query processed documents using RAG

### Media Processing
- `POST /video/summarize/` - Video content summarization
- `POST /image/describe/` - Image analysis and description
- `POST /text-to-speech/` - Convert text to audio

### External Integrations
- `GET /websearch/` - Real-time web search
- Integration endpoints for Jira, Zoom, and Calendar operations

## 🎯 Use Cases

### Business Automation
- **Project Management**: Automated Jira ticket creation, status updates, and reporting
- **Meeting Coordination**: Zoom meeting scheduling and management
- **Document Analysis**: Intelligent PDF processing and information extraction
- **Content Summarization**: Video and document summarization for quick insights

### Operational Efficiency
- **Workflow Automation**: End-to-end business process automation
- **Information Retrieval**: Quick access to enterprise knowledge bases
- **Multi-modal Communication**: Text, voice, and visual communication processing
- **Real-time Data Integration**: Live web search and external API data aggregation

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- [Repository](https://github.com/ShawneilRodrigues/OmnoBot)
- [Documentation](docs/)
- [Issues](https://github.com/ShawneilRodrigues/OmnoBot/issues)

---

**Built with ❤️ using PhiData, LangChain, and FastAPI**
