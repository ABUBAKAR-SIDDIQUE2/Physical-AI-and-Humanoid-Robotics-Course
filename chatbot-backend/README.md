# RAG Chatbot Backend

This directory contains the backend services for the Physical AI course chatbot. It is a FastAPI application that implements a Retrieval-Augmented Generation (RAG) pipeline to provide accurate, context-aware answers using the course material.

## 🛠️ Tech Stack

*   **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
*   **LLM:** Google Gemini (`gemini-2.5-flash-lite`, `text-embedding-004`)
*   **Vector Database:** [Qdrant](https://qdrant.tech/)
*   **Application Database:** PostgreSQL (Async SQLAlchemy)
*   **Package Manager:** `pip` / `venv`

## 📂 Structure

*   `app/main.py`: Application entry point and configuration.
*   `app/routers/`: API route handlers (`chat.py`, `session.py`).
*   `app/services/`: Business logic (`rag_engine.py`, `embeddings.py`).
*   `app/db/`: Database connections and models (`postgres.py`, `qdrant.py`).
*   `ingest.py`: Script to process documentation and populate the vector database.
*   `alembic/`: Database migrations.

## 🚀 Setup & Installation

### 1. Environment
Create a virtual environment:
```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 2. Configuration (.env)
Create a `.env` file in the `chatbot-backend` directory with the following variables:

```ini
# Core
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
CORS_ORIGINS=["http://localhost:3000"]

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Qdrant (Vector DB)
# Use URL/Key for Cloud, or Path for local persistence
QDRANT_URL=http://localhost:6333
# Qdrant API KEY if using Qdrant Cloud
QDRANT_API_KEY=
# QDRANT_PATH=./qdrant_storage (Optional: for local file-based storage)

# PostgreSQL (Chat History)
NEON_CONN_STRING=postgresql+psycopg://user:password@host/dbname
```

### 3. Database Migration
Initialize the PostgreSQL tables:
```bash
alembic upgrade head
```

### 4. Data Ingestion
Before the chatbot can answer questions, you must ingest the course content into Qdrant:
```bash
python ingest.py --reset
```
*   `--reset`: Clears the existing collection before ingesting.

## 🏃 Running the Server

Start the development server:
```bash
python run_app.py
# OR
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
Docs are available at `http://localhost:8000/docs`.

## 🧪 API Endpoints

*   `POST /api/chat`: Send a message and get a RAG-generated response.
*   `POST /api/session`: Create a new chat session.
*   `GET /api/session/{session_id}`: Retrieve chat history.
