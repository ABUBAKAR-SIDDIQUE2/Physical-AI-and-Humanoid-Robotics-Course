# Quickstart: RAG Chatbot Development

## Prerequisites

- Python 3.11+
- Docker & Docker Compose
- Node.js 18+ (for Docusaurus)
- Qdrant Cloud Account (Free Tier)
- Neon DB Account (Free Tier)
- OpenAI or Gemini API Key

## Environment Setup

1. **Clone & Install Backend**
   ```bash
   cd chatbot-backend
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   Copy `.env.example` to `.env` and fill in API keys:
   ```bash
   cp .env.example .env
   ```

3. **Start Local Dependencies (if not using Cloud)**
   ```bash
   docker-compose up -d qdrant
   ```

## Ingestion (Run once or on content change)

```bash
python ingest.py --docs-path ../physical-ai-book/docs --reset
```

## Running the Chatbot

```bash
uvicorn app.main:app --reload --port 8000
```
Check health: `http://localhost:8000/health`

## Running Docusaurus with Widget

```bash
cd physical-ai-book
npm install
npm start
```
Go to `http://localhost:3000`. Select text to see the widget.
