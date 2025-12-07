# Specification: Integrated RAG Chatbot

### 1. Metadata
- **Feature:** Integrated RAG Chatbot
- **Version:** 1.0.0
- **Status:** Draft
- **Owner:** Chatbot Backend Team
- **Dependencies:** Docusaurus site, Constitution v1.1.0, Qdrant Cloud, Neon DB

---

### 2. System Architecture

The system consists of a decoupled Python backend and a React frontend widget embedded in the static site.

- **FastAPI Backend Service**: The core application server handling API requests, orchestration, and database interactions. Hosted on a container platform (e.g., Render/Railway).
- **Chainlit/ADK LLM Orchestrator**: A modular `RagEngine` class (implementing the "ADK" pattern) that manages the retrieval and generation loop, wrapping OpenAI/Gemini clients.
- **RAG Pipeline**:
  - **Ingestion**: A script (`ingest.py`) that parses local `.mdx` files, chunks them, and upserts embeddings.
  - **Retriever**: Queries Qdrant for semantic similarity.
  - **Generator**: Uses LLM to synthesize answers from retrieved context.
- **Qdrant Collection Schema**: Stores vector embeddings of the book content with metadata for filtering (chapter, source file).
- **Neon Postgres Tables**: Persists user session history and chat logs for continuity and analysis.
- **Docusaurus Integration Component**: A custom React component (`ChatWidget`) in the frontend that communicates with the backend via REST.
- **Selected Text Listener**: A client-side event listener that detects text selection and triggers the "Ask AI" context menu.

**Deployment Topology**:
- Frontend: GitHub Pages (Static JS/HTML).
- Backend: Docker container on Cloud PaaS.
- Data: Qdrant Cloud (Vectors) + Neon (Relational).

---

### 3. User Stories

**US1 — General Q&A (Full RAG)**
- **Given** a user is reading the textbook
- **When** they open the chat widget and ask "How does ROS 2 communication work?"
- **Then** the system retrieves relevant sections from the ROS 2 chapter
- **And** generates a concise answer citing the source chapters.

**US2 — Selected Text Inquiry**
- **Given** a user highlights a paragraph about "Inverse Kinematics"
- **When** they click the floating "Ask AI" button
- **Then** the chat widget opens with the selected text as context
- **And** the AI explains the concept specifically using the highlighted text.

**US3 — Chat Session Persistence**
- **Given** a user has asked multiple questions
- **When** they reload the page
- **Then** their previous chat history is restored in the widget (based on local storage session ID).

**US4 — Frontend Embedded Widget**
- **Given** any page on the textbook
- **When** the user loads the site
- **Then** a floating chat icon is visible in the bottom-right corner.

**US5 — Cross-Origin Access**
- **Given** the frontend is hosted on `github.io` and backend on a PaaS
- **When** the widget makes an API call
- **Then** the backend accepts the request (CORS headers configured) and returns data.

---

### 4. Functional Requirements (FRs)

- **FR-001: FastAPI REST Endpoints**: The backend must expose `POST /api/query`, `POST /api/select-query`, and `GET /api/session/{id}`.
- **FR-002: Chainlit/ADK for LLM calls**: The system must use a dedicated orchestration layer for LLM interaction, supporting model switching via env vars.
- **FR-003: Qdrant Vector Store**: The system must query Qdrant Cloud for embeddings using Cosine similarity.
- **FR-004: Neon DB for persistence**: Chat messages must be stored in Neon Postgres `messages` table linked to `sessions`.
- **FR-005: Ingestion from Docusaurus**: The `ingest.py` script must recursively parse `docs/` and be idempotent (re-running updates/overwrites without duplication).
- **FR-006: Selected-Text Input Mode**: The API must accept `selected_text` and prioritize it in the prompt context.
- **FR-007: Chat Widget Component**: A React component must be added to `src/components/` that manages chat state and API calls.
- **FR-008: CORS + Env Vars**: Backend must accept `CORS_ORIGINS` from env and use `OPENAI_API_KEY`/`QDRANT_API_KEY` securely.
- **FR-009: Return Source Citations**: Every RAG response must include a `sources` array with file paths and similarity scores.

---

### 5. Non-Functional Requirements (NFRs)

- **NFR-001: Latency**: API response time (TTFT) should be under 5 seconds for standard queries.
- **NFR-002: Availability**: The backend should target 99% uptime during reading hours.
- **NFR-003: Security**: No API keys shall be exposed in the frontend bundle. All keys stay server-side.
- **NFR-004: Provenance**: The system must explicitly cite which chapter/file contributed to an answer.
- **NFR-005: Scalability**: The ingestion pipeline must handle the entire book (approx 50-100 pages) without memory errors.

---

### 6. API Specifications

**Endpoint**: `POST /api/query`
- **Description**: Standard RAG query against the full corpus.
- **Request**:
  ```json
  {
    "query": "What is Isaac Sim?",
    "user_id": "anon-123",
    "session_id": "uuid-optional"
  }
  ```
- **Response**:
  ```json
  {
    "answer": "Isaac Sim is...",
    "sources": [{"doc": "04-isaac.md", "score": 0.92}],
    "session_id": "uuid-assigned"
  }
  ```

**Endpoint**: `POST /api/select-query`
- **Description**: Context-aware query based on user selection.
- **Request**:
  ```json
  {
    "selected_text": "Code snippet...",
    "query": "Explain this",
    "context": "/docs/ros2",
    "user_id": "anon-123"
  }
  ```

**Endpoint**: `GET /api/session/{id}`
- **Description**: Retrieve chat history.
- **Response**: `{"id": "...", "messages": [...]}`

---

### 7. Data Models

#### Neon Postgres Schema
- **Table `sessions`**:
  - `id`: UUID (PK)
  - `user_id`: VARCHAR(255) (Index)
  - `created_at`: TIMESTAMPTZ
  - `metadata`: JSONB

- **Table `messages`**:
  - `id`: UUID (PK)
  - `session_id`: UUID (FK -> sessions.id)
  - `role`: VARCHAR(50) ('user'|'assistant')
  - `content`: TEXT
  - `sources`: JSONB
  - `created_at`: TIMESTAMPTZ

#### Qdrant Collection (`physical_ai_book`)
- **Vector Size**: 1536 (OpenAI) or 768 (Gemini)
- **Distance**: Cosine
- **Payload/Metadata**:
  - `source_doc`: Keyword (e.g., `01-introduction.md`)
  - `chapter`: Keyword
  - `chunk_id`: Integer
  - `text`: Text (The chunk content)
  - `url_slug`: Keyword

---

### 8. UI/UX Specification

**Chat Widget**:
- **Location**: Fixed floating button (bottom-right). Expands to a 350px wide sidebar/panel on click.
- **Behavior**:
  - Default state: Icon only.
  - Active state: Chat interface with input, history, and "Thinking..." indicator.
- **Loading**: Show typing dots or skeleton loader during API wait.
- **Dark Mode**: Must inherit Docusaurus theme class (light/dark).

**Selected-Text Tooltip**:
- **Trigger**: `selectionchange` event with non-empty string.
- **Positioning**: Calculated `getBoundingClientRect` of selection + offset.
- **Action**: Clicking "Ask AI" opens the Chat Widget and auto-sends the `select-query`.

---

### 9. Prompt Templates

**RAG Base Prompt**:
```text
You are an expert teaching assistant for the Physical AI Textbook.
Answer the user's question using ONLY the following context snippets.
If the answer is not in the context, say "I don't have that information in the textbook."

Context:
{context_chunks}

Question: {query}
```

**Selected-Text Only Prompt**:
```text
You are explaining a specific excerpt from the Physical AI Textbook.
Focus strictly on the provided text.

Excerpt:
"{selected_text}"

User Question: {query}
```

---

### 10. Constraints

- **MUST NOT** modify existing files in `docs/` (read-only).
- **MUST** only index `.mdx` files from the defined constitution folders.
- **MUST** use FastAPI for the API layer (Chainlit can be used for internal logic/types).
- **MUST** use Qdrant Cloud (Free Tier) for vectors.
- **MUST** use Neon Serverless Postgres for relational data.
- **MUST** implement both general RAG and specific selection workflows.

---

### 11. Acceptance Tests

1. **Ingestion Test**: Run `ingest.py` and verify Qdrant collection count > 0.
2. **Idempotency Test**: Run `ingest.py` twice; verify count remains stable (no duplicates).
3. **Retrieval Test**: Query "ROS 2"; verify results contain `02-ros2.md`.
4. **API Connectivity**: `POST /api/query` returns 200 OK with JSON body.
5. **Selection Flow**: `POST /api/select-query` with dummy text returns an explanation of that text.
6. **Persistence**: Send a message, restart server, call `GET /api/session/{id}` and see the message.
7. **CORS Check**: call API from a different localhost port; verify 200 OK (with valid Origin).
8. **Invalid Auth**: Call API without keys (if auth implemented) -> 401/403 (Optional for MVP, but good practice).
9. **Citation Check**: Verify response JSON includes `sources` list.
10. **Frontend Load**: Verify Chat Widget renders on the Docusaurus homepage without errors.