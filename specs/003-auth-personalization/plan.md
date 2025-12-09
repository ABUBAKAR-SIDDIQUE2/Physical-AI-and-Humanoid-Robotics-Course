# Implementation Plan: Auth & Personalization

**Branch**: `003-auth-personalization` | **Date**: 2025-12-09 | **Spec**: `specs/003-auth-personalization/spec.md`

## Summary

We will implement authentication and personalization by adding a sidecar Node.js `auth-service` using **Better Auth**. This service will handle user signup, login, and profile management (Software/Hardware experience). The Docusaurus frontend will interface with this service. The existing Python `chatbot-backend` will accept user tokens, validate them against the `auth-service` (or shared DB), and use the user's profile to customize the System Prompt for RAG responses.

## Technical Context

**Language/Version**: 
- **Auth Service**: Node.js v20+ / TypeScript
- **Chatbot**: Python 3.12 (Existing)
- **Frontend**: React / Docusaurus (Existing)

**Primary Dependencies**:
- **Auth Service**: `better-auth`, `hono` (or Express), `better-sqlite3` (or `pg` if using Neon)
- **Frontend**: `better-auth/react` client
- **Chatbot**: `httpx` (to call auth service) or `sqlalchemy` (to read shared DB)

**Storage**:
- **Auth Service**: SQLite (local dev) or Postgres (Neon production)
- **Chatbot**: Qdrant (Vector), Postgres (Chat History)

**Testing**:
- **Auth Service**: `vitest`
- **Frontend**: Manual verification
- **Chatbot**: `pytest`

**Constraints**:
- **Better Auth**: Must run in Node.js environment.
- **Integration**: Python backend needs access to user metadata managed by Node.js service.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

1.  **Smallest Viable Change**: We are adding a service, which increases complexity. However, it is required because the auth library is Node-only.
2.  **No Magic**: Code must be explicit.
3.  **Testable**: Auth flows and personalization logic must be testable.

## Project Structure

### Documentation (this feature)

```text
specs/003-auth-personalization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
auth-service/           # [NEW]
├── src/
│   ├── index.ts        # Entry point
│   ├── auth.ts         # Better Auth config
│   ├── db.ts           # Database connection
│   └── routes/         # API routes
├── package.json
└── tsconfig.json

chatbot-backend/        # [EXISTING]
├── app/
│   ├── routers/
│   │   └── auth_middleware.py # [NEW] Token validation
│   └── services/
│       └── rag_engine.py      # [UPDATE] Personalization logic

physical-ai-book/       # [EXISTING]
├── src/
│   ├── components/
│   │   ├── Auth/       # [NEW] Login/Signup components
│   │   └── Onboarding/ # [NEW] Profile questions
│   └── services/
│       └── auth.ts     # [NEW] Better Auth client
```

**Structure Decision**: We are introducing a microservices pattern (Sidecar) by adding `auth-service` to handle the Node.js requirement of Better Auth, while keeping the core AI logic in Python.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Adding a new Service (`auth-service`) | Better Auth library is Node.js only; our backend is Python. | Rewriting backend in Node.js is too costly; using a different Python auth lib (e.g., FastAPI Users) lacks the specific features/DX of Better Auth requested. |
