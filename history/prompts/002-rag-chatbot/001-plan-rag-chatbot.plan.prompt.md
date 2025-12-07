---
id: 001
title: plan-rag-chatbot
stage: plan
date: 2025-12-07
surface: agent
model: gemini-2.0-flash-exp
feature: 002-rag-chatbot
branch: 002-rag-chatbot
user: user
command: /sp.plan
labels: ["planning", "rag", "chatbot", "design"]
links:
  spec: specs/002-rag-chatbot/spec.md
  plan: specs/002-rag-chatbot/plan.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/002-rag-chatbot/plan.md
 - specs/002-rag-chatbot/research.md
 - specs/002-rag-chatbot/data-model.md
 - specs/002-rag-chatbot/contracts/api.yaml
 - specs/002-rag-chatbot/quickstart.md
tests: []
---

## Prompt

/sp.plan ✅ SP.PLAN PROMPT (Req-2: RAG Chatbot)

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
Each phase should include sub-steps, expected files, example commands, env vars, and verification checks.

### Phase 1 — Environment & Backend Initialization
- Create `/chatbot-backend/` with a Python project (recommend Poetry or venv + pip). Provide commands:
  - Example: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`
  - Or `poetry init` instructions.
- Provide `pyproject.toml` / `requirements.txt` with explicit deps: `fastapi`, `uvicorn`, `chainlit`, `httpx`, `qdrant-client`, `psycopg[binary]` or `asyncpg`, `sqlalchemy` (or `orm`), `python-dotenv`, `tiktoken`/embedding library (as needed).
- Create `Dockerfile` and `docker-compose.yml` skeleton for local testing (the plan should include Docker images for the backend and a local Qdrant dev instance).
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
  - `/chatbot-backend/db/` : Neon Postgres models for sessions and message history (store user_id, timestamp, user_input, response, vectors returned).
  - `chainlit` integration: chainlit app config that can use the same rag orchestrator or be proxied by FastAPI.
- Implement “Selected Text” flow:
  - If `selected_text` present, then bypass retrieval step for selected_text-only answer OR use a hybrid prompt that biases to selected_text + top-k retrieval.
  - Provide prompt templates: one for full-document RAG, one for selected-text-only mode (explicit instruction: "Answer using only the provided text. Do not use external knowledge.").
- Provide retries, timeouts, and fallback strategies.
- Provide provenance: return chunk ids and source file paths alongside answers.
- Verification:
  - Unit test for `rag.query()` to ensure it returns results and attaches provenance.
  - Integration test: `POST /api/query` returns an answer within 5s (locally) and includes `[sources]`.

### Phase 4 — Docusaurus Integration (Embed)
- Provide options and recommended approach:
  - Option A (recommended): React widget in `/physical-ai-book/src/components/ChatWidget/` that opens a sidebar/iframe and talks to backend via REST.
  - Option B: iframe that points to a hosted Chainlit UI.
- Include JS snippet to detect text selection:
  - `document.addEventListener('selectionchange', ...)` to capture selection; show floating “Ask AI” button near selection bounding rect.
  - On click, call `/api/select-query` with `selected_text` and the current page URL as `context`.
- CORS and authentication:
  - Explain how to set `CORS_ORIGINS` to allow `https://<your-gh-pages-domain>`.
  - Suggest ephemeral tokens or signed requests if exposing endpoints publicly.
- Verification:
  - Locally serve Docusaurus and the widget; selecting text and clicking Ask should show a response in the panel.

### Phase 5 — Deployment Strategy
- Backend: Dockerize FastAPI + Chainlit (or run Chainlit as a separate process). Provide example `Dockerfile` and `deploy.yml` for Render, Railway or GitHub Actions with Docker to a cloud host.
- Qdrant: Use Qdrant Cloud Free Tier; record connection steps and namespace strategy.
- Neon: Use connection string with SSL; explain migrations for session schema (Alembic recommended).
- CI/CD:
  - Provide GitHub Action templates:
    - `ci/test-backend.yml` to run unit tests.
    - `deploy/backend-deploy.yml` to build and push Docker image to host.
- Security & CORS: Document allowed origins and secrets usage (GitHub Secrets).
- Monitoring: simple health endpoint and basic logging; recommend Sentry or Perf logs.
- Verification:
  - Live smoke test: call `/api/query` against deployed backend and ensure successful response.

## NON-FUNCTIONAL REQUIREMENTS & ACCEPTANCE CRITERIA
- The chatbot must return provenance metadata for each answer (doc path + chunk id).
- The "selected-text only" mode must (when requested) produce answers strictly sourced from the provided selection.
- Sessions must persist in Neon and be retrievable.
- Ingestion must be idempotent and re-runnable without duplicating vectors (use consistent chunk ids / keys).
- Provide clear roll-back instructions for ingestion (namespace delete or collection wipe).

## DELIVERABLES (place under `specs/002-rag-chatbot/`)
- `plan.md` (this document)
- `spec.md` (system spec to be generated next)
- `tasks.md` (task breakdown for implementation)
- Example `ingest.py` pseudocode + CLI
- `api-contract.md` describing endpoints and payloads
- `deployment.md` describing Docker + hosting steps
- `.env.example`

## NEXT STEPS (explicit sequence for Spec-Kit)
1. Run `/sp.spec` to transform this plan into a formal spec (endpoints, data models, prompt templates).  
2. Run `/sp.tasks` to generate atomic tasks (ingestion, backend, integration, tests, CI).  
3. Run `/sp.implement` or `/sp.code` per task.

**End of Plan.**

## Response snapshot

Executed implementation planning workflow.
- Populated `specs/002-rag-chatbot/plan.md` with detailed phases and deliverables.
- Updated `specs/002-rag-chatbot/research.md` with architecture decisions (FastAPI, Qdrant, Neon).
- Created `specs/002-rag-chatbot/data-model.md` with Postgres and Vector schemas.
- Created `specs/002-rag-chatbot/contracts/api.yaml` with OpenAPI definitions.
- Created `specs/002-rag-chatbot/quickstart.md`.
- Updated agent context (`GEMINI.md`).

## Outcome

- ✅ Plan: Complete.
- 📁 Files: `plan.md`, `research.md`, `data-model.md`, `api.yaml`, `quickstart.md`.
- 🔁 Next: `/sp.spec`.
