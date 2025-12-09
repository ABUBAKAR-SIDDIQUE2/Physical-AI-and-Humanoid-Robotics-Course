# Tasks: Auth & Personalization

**Input**: Design documents from `/specs/003-auth-personalization/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Includes exact file paths in descriptions

## Path Conventions

- **Auth Service**: `auth-service/src/`
- **Frontend**: `physical-ai-book/src/`
- **Backend**: `chatbot-backend/app/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the new Auth Service project and dependencies

- [X] T001 Create `auth-service` directory and initialize TypeScript project
- [X] T002 Install dependencies in `auth-service/`: `hono`, `better-auth`, `better-sqlite3`, `dotenv`
- [X] T003 [P] Setup `auth-service/tsconfig.json` and `package.json` scripts
- [X] T004 Configure `auth-service/.env.example` and `.env` (BETTER_AUTH_SECRET, DATABASE_URL)
- [X] T005 Install `@better-auth/react` in `physical-ai-book/` frontend
- [X] T006 Add `httpx` to `chatbot-backend/requirements.txt`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Setup SQLite database connection in `auth-service/src/db.ts`
- [X] T008 Define Better Auth configuration with custom fields in `auth-service/src/auth.ts`
- [X] T009 Create main Hono app entry point in `auth-service/src/index.ts` mounting auth routes
- [X] T010 Implement internal user fetch endpoint `GET /internal/user/:id` in `auth-service/src/routes/internal.ts`
- [X] T011 [P] Create auth client configuration in `physical-ai-book/src/services/auth.ts`
- [X] T012 Run database migrations for `auth-service` to create User/Session tables

**Checkpoint**: Auth Service is running on port 4000, database is ready, and frontend client is configured.

---

## Phase 3: User Story 1 - Signup & Login (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to sign up via Email/Password so I can save my progress.

**Independent Test**: Can create an account and log in successfully via the frontend UI.

### Implementation for User Story 1

- [X] T013 [P] [US1] Create Login/Signup page component in `physical-ai-book/src/pages/login.tsx`
- [X] T014 [P] [US1] Create Auth Button component (Login/Logout) in `physical-ai-book/src/components/Auth/AuthButton.tsx`
- [X] T015 [US1] Integrate Auth Button into Navbar in `physical-ai-book/docusaurus.config.js` (or verify where navbar items are managed)
- [X] T016 [US1] Implement login/signup form logic using `auth-client` in `physical-ai-book/src/components/Auth/LoginForm.tsx`
- [X] T017 [US1] Add "Logout" functionality to the Auth Button

**Checkpoint**: User can sign up, log in, and see their session state change in the UI.

---

## Phase 4: User Story 2 - Onboarding Flow (Priority: P1)

**Goal**: As a new user, I MUST be asked about my "Software Experience" and "Hardware Experience" immediately after signup.

**Independent Test**: After signup, the onboarding modal appears and saves data to the user profile in the local DB.

### Implementation for User Story 2

- [X] T018 [P] [US2] Create Onboarding Modal component in `physical-ai-book/src/components/Onboarding/OnboardingModal.tsx`
- [X] T019 [US2] Implement logic to check if `software_bg` or `hardware_bg` is null in `physical-ai-book/src/theme/Root.tsx` (or layout wrapper)
- [X] T020 [US2] Create API call to update user profile fields in `physical-ai-book/src/services/auth.ts`
- [X] T021 [US2] Wire up Onboarding Modal to submit profile update on save
- [X] T022 [US2] Ensure Modal closes and state updates locally after submission

**Checkpoint**: New users are forced to complete onboarding; data persists in SQLite.

---

## Phase 5: User Story 3 - Personalized Answers (Priority: P2)

**Goal**: As a user, if I am an "Expert", the chatbot should use technical jargon. If "Beginner", it should explain concepts simply.

**Independent Test**: Send the same query from two different user accounts (Expert vs Beginner) and observe different responses.

### Implementation for User Story 3

- [X] T023 [P] [US3] Create auth middleware in `chatbot-backend/app/routers/auth_middleware.py` to validate Bearer token via Auth Service
- [X] T024 [P] [US3] Update `chatbot-backend/app/services/rag_engine.py` to accept user profile context
- [X] T025 [US3] Modify `RagEngine.generate_response` to inject `software_bg`/`hardware_bg` into the System Prompt
- [X] T026 [US3] Update `POST /api/chat` endpoint in `chatbot-backend/app/routers/chat.py` to use auth middleware and pass profile to RAG engine
- [X] T027 [US3] Update Frontend Chat Client in `physical-ai-book/src/services/api.ts` to send `Authorization` header with session token

**Checkpoint**: Chatbot responses change based on the logged-in user's profile settings.

---

## Phase 6: Deployment Preparation (Cross-Cutting)

**Purpose**: Prepare the full stack for Render deployment

- [X] T028 [P] Create `render.yaml` blueprint in root defining `auth-service` and `chatbot-backend` services
- [X] T029 Update `auth-service/package.json` with `start` command for production
- [X] T030 Verify environment variable loading in `chatbot-backend` for `AUTH_SERVICE_URL`
- [X] T031 [P] Update `physical-ai-book` build script to accept `API_URL` and `AUTH_URL`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Phase 1. BLOCKS all stories.
- **US1 (Signup)**: Depends on Phase 2.
- **US2 (Onboarding)**: Depends on US1 (need a user to onboard).
- **US3 (Personalization)**: Depends on Phase 2 (Backend integration) AND US2 (Need profile data).

### Parallel Opportunities

- Frontend components (T013, T014, T018) can be built while Backend logic (T023, T024) is being written.
- Auth Service internal API (T010) and Frontend Client (T011) can be done in parallel.

---

## Implementation Strategy

### MVP First (US1 & US2)

1.  Get the Auth Service running (Phase 1 & 2).
2.  Implement Signup/Login (US1).
3.  Implement Onboarding (US2) - *Essential data collection*.
4.  **Validate**: Can I sign up and save my profile?

### Incremental Delivery (US3)

1.  Modify Python Backend to accept the token.
2.  Inject the prompt logic.
3.  **Validate**: Do answers change?

### Team Strategy

- **Dev A (Full Stack/Node)**: Phase 1, Phase 2, US1, US2 (Auth Service & Frontend).
- **Dev B (Python Backend)**: US3 (Chatbot Backend integration & Prompt Engineering).
