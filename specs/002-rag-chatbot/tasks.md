---
description: "Task list for Feature 002-rag-chatbot"
---

# Tasks: Integrated RAG Chatbot

**Input**: Design documents from `specs/002-rag-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project Root**: `physical-ai-book/`
- **Specs**: `specs/002-rag-chatbot/`
- **Backend**: `chatbot-backend/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create backend project structure and venv script in `chatbot-backend/`
- [ ] T002 Initialize `pyproject.toml` and `requirements.txt` (FastAPI, Qdrant, Neon, etc) in `chatbot-backend/`
- [ ] T003 [P] Create `.env.example` with placeholders for API keys in `chatbot-backend/.env.example`
- [ ] T004 [P] Create `Dockerfile` and `docker-compose.yml` for local dev in `chatbot-backend/`
- [ ] T005 [P] Create local dev script (`Makefile` or `dev.sh`) in `chatbot-backend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Set up Qdrant connection and collection initialization in `chatbot-backend/app/db/qdrant.py` (FR-003)
- [ ] T007 Set up Neon DB connection and SQLAlchemy/AsyncPG setup in `chatbot-backend/app/db/postgres.py` (FR-004)
- [ ] T008 Create ingestion script skeleton `chatbot-backend/ingest.py` (FR-005)
- [ ] T009 Implement text chunking and cleaning logic in `chatbot-backend/app/services/ingestion.py` (FR-005)
- [ ] T010 Implement embedding generation using ADK/OpenAI in `chatbot-backend/app/services/embeddings.py` (FR-002)
- [ ] T011 Update `ingest.py` to upsert vectors to Qdrant with metadata (FR-005)
- [ ] T012 Verify ingestion by running script against `physical-ai-book/docs/` (NFR-005)
- [ ] T013 Create FastAPI application entry point in `chatbot-backend/app/main.py` (FR-001)

**Checkpoint**: Foundation ready - Ingestion works, DBs connected, App starts.

---

## Phase 3: User Story 1 - General Q&A (Full RAG) (Priority: P1)

**Goal**: Users can ask general questions and get answers based on the book content.

**Independent Test**: `POST /api/query` returns answer with citations.

### Implementation for User Story 1

- [ ] T014 [US1] Create RAG orchestrator service in `chatbot-backend/app/services/rag_engine.py` (FR-002)
- [ ] T015 [US1] Implement retrieval logic (query embedding + Qdrant search) in `chatbot-backend/app/services/rag_engine.py` (FR-003)
- [ ] T016 [US1] Implement LLM generation with context assembly in `chatbot-backend/app/services/rag_engine.py` (FR-002)
- [ ] T017 [US1] Create `POST /api/query` endpoint in `chatbot-backend/app/routers/chat.py` (FR-001)
- [ ] T018 [P] [US1] Add unit tests for RAG pipeline in `chatbot-backend/tests/test_rag.py` (NFR-005)
- [ ] T019 [US1] Verify `POST /api/query` returns source citations (FR-009)

**Checkpoint**: Backend RAG is fully functional via API.

---

## Phase 4: User Story 2 - Selected Text Inquiry (Priority: P1)

**Goal**: Users can select text and ask questions specifically about it.

**Independent Test**: `POST /api/select-query` prioritizes selected text in answer.

### Implementation for User Story 2

- [ ] T020 [US2] Update `RagEngine` to handle `selected_text` context in `chatbot-backend/app/services/rag_engine.py` (FR-006)
- [ ] T021 [US2] Implement prompt template for selected-text mode in `chatbot-backend/app/prompts.py` (FR-006)
- [ ] T022 [US2] Create `POST /api/select-query` endpoint in `chatbot-backend/app/routers/chat.py` (FR-001)
- [ ] T023 [P] [US2] Add unit tests for selected-text mode in `chatbot-backend/tests/test_selection.py`

**Checkpoint**: Backend supports both general and specific queries.

---

## Phase 5: User Story 3 - Chat Session Persistence (Priority: P2)

**Goal**: Chat history is saved and retrievable.

**Independent Test**: `GET /api/session/{id}` returns previous messages.

### Implementation for User Story 3

- [ ] T024 [US3] Create DB models for `Session` and `Message` in `chatbot-backend/app/models.py` (FR-004)
- [ ] T025 [US3] Create Alembic migration script for schema in `chatbot-backend/alembic/` (FR-004)
- [ ] T026 [US3] Update `POST /api/query` to save messages to Neon in `chatbot-backend/app/routers/chat.py` (FR-004)
- [ ] T027 [US3] Create `GET /api/session/{id}` endpoint in `chatbot-backend/app/routers/session.py` (FR-001)

**Checkpoint**: Backend now has persistent memory.

---

## Phase 6: User Story 4 & 5 - Frontend Widget & Integration (Priority: P2)

**Goal**: Frontend widget is embedded, detects selection, and talks to backend.

**Independent Test**: Widget appears, works on selection, and receives API responses.

### Implementation for User Stories 4 & 5

- [ ] T028 [US4] Create React component structure `physical-ai-book/src/components/ChatWidget/` (FR-007)
- [ ] T029 [US4] Implement floating button UI in `physical-ai-book/src/components/ChatWidget/index.tsx` (FR-007)
- [ ] T030 [US4] Implement chat panel UI (input, messages) in `physical-ai-book/src/components/ChatWidget/ChatPanel.tsx`
- [ ] T031 [US2] Implement `selectionchange` listener hook in `physical-ai-book/src/components/ChatWidget/useSelection.ts` (FR-006)
- [ ] T032 [US5] Implement API client service in `physical-ai-book/src/services/api.ts`
- [ ] T033 [US5] Configure CORS in `chatbot-backend/app/main.py` (FR-008)
- [ ] T034 [US4] Integrate Widget into Docusaurus Layout or Root in `physical-ai-book/src/theme/Root.js`

**Checkpoint**: Full end-to-end feature complete locally.

---

## Phase 7: Deployment & Polish

**Purpose**: Production readiness

- [ ] T035 [P] Create GitHub Actions for Backend CI in `.github/workflows/backend-ci.yml`
- [ ] T036 [P] Create Backend Deploy workflow in `.github/workflows/backend-deploy.yml`
- [ ] T037 Add roll-back instructions for ingestion to `specs/002-rag-chatbot/plan.md` (NFR-004)
- [ ] T038 Verify 5-second latency requirement (NFR-001)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Phase 1
- **User Story 1 (Phase 3)**: Depends on Phase 2
- **User Story 2 (Phase 4)**: Depends on Phase 3 (extends RAG engine)
- **User Story 3 (Phase 5)**: Depends on Phase 2 (DB setup), can run parallel to Phase 3/4
- **Frontend (Phase 6)**: Depends on Phase 3 (API availability)

### Parallel Opportunities

- **Backend / Frontend**: Once API spec is final (Phase 3 complete), Frontend (Phase 6) can proceed in parallel with Persistence (Phase 5).
- **Tests**: Unit tests (T018, T023) can be written in parallel with implementation if using TDD.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup + Foundational (Ingestion + Basic RAG)
2. Verify API works via Curl/Postman
3. Skip persistence initially if needed to speed up.

### Incremental Delivery

1. Backend RAG API (US1) -> Verify
2. Backend Selection API (US2) -> Verify
3. Frontend Widget (US4) -> Connect to API
4. Add Persistence (US3) -> Deploy
