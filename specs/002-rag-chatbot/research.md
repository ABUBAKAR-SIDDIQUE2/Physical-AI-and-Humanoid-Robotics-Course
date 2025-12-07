# Research & Decisions: RAG Chatbot

**Feature**: `002-rag-chatbot`
**Status**: Phase 0 Complete

## 1. Architecture Decisions

### Backend Framework: FastAPI vs. Chainlit-only
- **Decision**: **FastAPI** as the main entry point, wrapping the RAG logic.
- **Rationale**: We need custom REST endpoints (`/api/select-query`) for the Docusaurus text-selection widget which standard Chainlit doesn't natively expose easily for external "headless" calls. Chainlit can be mounted or run as a separate service for the "Full Page" chat experience if needed, but the widget needs a raw API.
- **Alternatives**: Pure Chainlit. Rejected because integrating the "Select Text" popup via standard Chainlit UI protocols is complex/hacky.

### Frontend Integration: Iframe vs. Custom React Widget
- **Decision**: **Custom React Widget** (`/src/components/ChatWidget`) talking to FastAPI.
- **Rationale**: Better UX. We want a "Medium-like" floating button when text is selected. An iframe is too heavy and isolates the selection context.
- **Alternatives**: Iframe to Chainlit. Rejected for the main reading experience, though might be used for a full "Chat" page.

### Database: Neon Serverless Postgres
- **Decision**: Use **Neon** via `psycopg` (async).
- **Rationale**: Fits the "Serverless" requirement. Good for handling intermittent traffic of a textbook site.
- **Schema**: `sessions` (uuid, user_id), `chat_messages` (id, session_id, role, content, created_at).

### Vector DB: Qdrant
- **Decision**: **Qdrant Cloud**.
- **Rationale**: Best performance/cost ratio for free tier. Excellent Python client.
- **Collection**: `physical_ai_book` with Cosine distance.

## 2. Unknowns & Clarifications

### "ADK" Clarification
- **Item**: Prompt mentions "Chainlit/ADK".
- **Assumption**: Refers to **Agent Development Kit** or similar patterns. We will use **LangChain** or **LlamaIndex** (or raw OpenAI client) as the "ADK" logic layer.
- **Resolution**: Will use standard Python OpenAI/Gemini clients wrapped in a modular `RagEngine` class.

### Text Selection Logic
- **Challenge**: Getting the precise text + context from Docusaurus.
- **Solution**: Use `window.getSelection()` in React.
  - `selection.toString()` (The text).
  - `window.location.pathname` (The chapter).

## 3. Best Practices Checklist
- [x] **Secrets**: `.env` file for all keys.
- [x] **CORS**: Whitelist the GitHub Pages domain.
- [x] **Rate Limiting**: Basic in-memory limit.

## 4. Dependencies
- **fastapi**: Web framework.
- **uvicorn**: ASGI server.
- **chainlit**: UI (optional/admin).
- **httpx**: Async HTTP client.
- **qdrant-client**: Vector DB client.
- **psycopg**: Postgres adapter.
- **sqlalchemy**: ORM.
- **python-dotenv**: Config management.
- **tiktoken**: Tokenization.