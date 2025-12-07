# SP.PLAN — Execution Plan for “Req-2: Integrated RAG Chatbot”

**Goal:** Generate a comprehensive execution plan for Feature Branch `002-rag-chatbot`.  
**Objective:** Build a RAG (Retrieval-Augmented Generation) chatbot using FastAPI, Chainlit/ADK, Neon Serverless Postgres, and Qdrant, and embed it into the existing Docusaurus textbook so users can ask questions about book content or selected text.

**Context:**
- Current state: A Docusaurus v3 site exists with content in `docs/` following Constitution v1.1.0 folder structure.
- New requirement: Chatbot must answer questions based on book content and support "Select Text → Ask AI".
- Project root: existing repository with `physical-ai-book/` at root.

## MANDATORY RULES (MUST FOLLOW)
1. **Do not modify existing `docs/` content or structure.** Only read files under `docs/`.
2. **All chatbot code must live in a new top-level directory**: `/chatbot-backend` (or `/rag-engine`). No changes to other top-level folders unless strictly for integration (e.g., a small `web-widget/` in the frontend).
3. **Technology stack is fixed:** Chainlit/ADK, FastAPI, Qdrant Cloud (Free Tier), Neon Serverless Postgres, OpenAI/Gemini (via ADK). Do not substitute other vector DBs or DB providers.
4. **Security & secrets:** Plan must use environment variables for all keys and connection strings. Provide an `.env.example` to document required variables.
5. **Deliverable:** Produce `specs/002-rag-chatbot/plan.md` (this file), plus clear acceptance criteria and verification steps.

## KEY PHASES & DELIVERABLES

### Phase 1 — Environment & Backend Initialization
- Create `/chatbot-backend/` with a Python project (recommend Poetry or venv + pip). Provide commands:
  - Example: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
- Provide `pyproject.toml` / `requirements.txt` with explicit deps: `fastapi`, `uvicorn`, `chainlit`, `httpx`, `qdrant-client`, `psycopg[binary]`, `sqlalchemy`, `python-dotenv`, `tiktoken`.
- Create `Dockerfile` and `docker-compose.yml` skeleton for local testing.
- Provide `.env.example` listing:
  - `OPENAI_API_KEY` or `GOOGLE_GEMINI_KEY`
  - `QDRANT_URL`, `QDRANT_API_KEY`
  - `NEON_CONN_STRING`
  - `CHAINLIT_API_KEY` (if applicable)
  - `BACKEND_HOST`, `BACKEND_PORT`, `CORS_ORIGINS`
- Verification: `uvicorn app.main:app --reload` should start and expose `/health` returning 200.

### Phase 2 — RAG Ingestion Pipeline
- Add `/chatbot-backend/ingest.py` that:
  1. Recursively reads `.md`/`.mdx` from `../physical-ai-book/docs/` using folder names from Constitution v1.1.0.
  2. Cleans HTML/MDX (strip codeblocks when appropriate, keep inline selections), normalizes whitespace.
  3. Breaks content into chunks (configurable chunk size + overlap).
  4. Generates embeddings (via ADK/embedding client or OpenAI/Gemini embeddings).
  5. Upserts vectors to Qdrant with metadata: `source_doc`, `chapter`, `file_path`, `chunk_id`, `char_range`.
- Provide ingestion CLI example:
  - `python ingest.py --docs-path ../physical-ai-book/docs --qdrant-url $QDRANT_URL --namespace physical-ai-book-v1`
- Provide schema for vector metadata and Qdrant collection config (distance metric, shards, replicas).
- Verification:
  - Script prints summary counts.
  - Upserted vectors can be queried; sample query returns top-k results for a short prompt.

### Phase 3 — Chatbot Logic (FastAPI + Chainlit)
- Design service components:
  - `/chatbot-backend/app/main.py`: FastAPI app with routes:
    - `GET /health`
    - `POST /api/query` — body: `{ "query": "...", "user_id":"...", "contextual": false, "selected_text": null }`
    - `POST /api/select-query` — body: `{ "selected_text":"...", "context":"...", "user_id":"..." }`
    - `GET /api/session/{id}` — session history
  - `/chatbot-backend/rag.py`: RAG orchestrator (query Qdrant -> assemble context -> call LLM via ADK -> return answer + provenance)
  - `/chatbot-backend/db/` : Neon Postgres models for sessions and message history.
  - `chainlit` integration: chainlit app config.
- Implement “Selected Text” flow:
  - If `selected_text` present, use hybrid prompt biasing to selected_text + top-k retrieval.
- Provide retries, timeouts, and fallback strategies.
- Provide provenance: return chunk ids and source file paths alongside answers.
- Verification:
  - Unit test for `rag.query()` to ensure it returns results and attaches provenance.
  - Integration test: `POST /api/query` returns an answer within 5s (locally) and includes `[sources]`.

### Phase 4 — Docusaurus Integration (Embed)
- Option A (recommended): React widget in `/physical-ai-book/src/components/ChatWidget/`.
- JS snippet to detect text selection (`document.addEventListener('selectionchange', ...)`).
- CORS and authentication:
  - `CORS_ORIGINS` to allow `https://<your-gh-pages-domain>`.
- Verification:
  - Locally serve Docusaurus and the widget; selecting text and clicking Ask should show a response in the panel.

### Phase 5 — Deployment Strategy
- Backend: Dockerize FastAPI + Chainlit.
- Qdrant: Use Qdrant Cloud Free Tier.
- Neon: Use connection string with SSL; Alembic migrations.
- CI/CD: `ci/test-backend.yml`, `deploy/backend-deploy.yml`.
- Security & CORS: Document allowed origins and secrets usage.
- Verification:
      - Live smoke test: call `/api/query` against deployed backend.
  
  ### Ingestion Rollback Strategy (Added T037)
  
  If ingestion fails or introduces corrupt data, perform the following steps to rollback:
  1. **Identify the batch**: If specific files were ingested, identify their filenames.
  2. **Delete by Filter**: Use Qdrant API to delete points where `payload.source_file` matches the affected files.
     ```bash
     curl -X POST "http://localhost:6333/collections/physical_ai_book/points/delete" \
          -H "Content-Type: application/json" \
          -d '{ "filter": { "must": [ { "key": "source_file", "match": { "value": "path/to/file.md" } } ] } }'
     ```
  3. **Full Reset**: If the entire collection is corrupted, delete and recreate the collection using the Qdrant dashboard or API.
     ```bash
     curl -X DELETE "http://localhost:6333/collections/physical_ai_book"
     # Then re-run ingest.py
     ```
  
  ## NON-FUNCTIONAL REQUIREMENTS & ACCEPTANCE CRITERIA
  - The chatbot must return provenance metadata for each answer (doc path + chunk id).
  - The "selected-text only" mode must produce answers strictly sourced from the provided selection (when requested).
  - Sessions must persist in Neon and be retrievable.
  - Ingestion must be idempotent and re-runnable without duplicating vectors.
  - Provide clear roll-back instructions for ingestion.
  
  ## DELIVERABLES (place under `specs/002-rag-chatbot/`)
  - `plan.md` (this document)
  - `spec.md` (system spec to be generated next)
  - `tasks.md` (task breakdown for implementation)
  - `api-contract.md` describing endpoints and payloads
  - `deployment.md` describing Docker + hosting steps
  - `.env.example`
  
  ## NEXT STEPS
  1. Run `/sp.spec` to transform this plan into a formal spec.
  2. Run `/sp.tasks` to generate atomic tasks.
  3. Run `/sp.implement` or `/sp.code` per task.