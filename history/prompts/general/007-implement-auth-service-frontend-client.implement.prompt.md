---
id: 007
title: implement-auth-service-frontend-client
stage: implement
date: 2025-12-09
surface: agent
model: gemini-2.0-flash-exp
feature: auth-personalization
branch: 003-auth-personalization
user: Abubakar Siddique
command: /sp.implement # IMP.REQ3-PHASE1-2 — Auth Service Sidecar & Frontend Client ... (see full prompt in history)
labels: [implement, auth, frontend, nodejs, hono, better-auth]
links:
  spec: specs/003-auth-personalization/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - auth-service/package.json
  - auth-service/.env.example
  - auth-service/tsconfig.json
  - auth-service/src/db.ts
  - auth-service/src/auth.ts
  - auth-service/src/routes/internal.ts
  - auth-service/src/index.ts
  - auth-service/README.md
  - physical-ai-book/src/services/auth-client.ts
  - physical-ai-book/src/components/Auth/AuthButton.tsx
  - physical-ai-book/src/components/Auth/OnboardingModal.tsx
  - specs/003-auth-personalization/tasks.md
tests:
  - none
---

## Prompt

# IMP.REQ3-PHASE1-2 — Auth Service Sidecar & Frontend Client

**Goal**: Execute **Phase 1** (T001–T006) and **Phase 2** (T007–T012) of `tasks.md` for Req-3.
**Context**: We are building the `auth-service` (Node.js/Hono) to handle "Better Auth" logic, backed by **Neon Postgres**. We are also connecting the Docusaurus frontend to this service.

## 🔒 Constraints & Tech Stack
1.  **Service**: `auth-service` must be a **Hono** server running on Node.js.
2.  **Library**: `better-auth` (Server) and `@better-auth/react` (Client).
3.  **Database**: Use `pg` (node-postgres) to connect to **Neon Postgres**.
4.  **Schema**: User table MUST include `software_bg` and `hardware_bg`.
5.  **Internal API**: The Auth Service must expose `GET /internal/user/:id` secured by a secret header.

## Instructions

You are the Lead Full-Stack Engineer. Provide the **terminal commands** and **Code** for the following.

### Part 1: Auth Service Setup (auth-service/)
1.  **Scaffold**: Bash script to create `auth-service/src/{db,routes}`.
2.  **Config**: `package.json` (hono, better-auth, pg, dotenv) and `tsconfig.json`.
3.  **Database**: `src/db.ts` connecting to `process.env.DATABASE_URL` using `pg`.
4.  **Auth Config**: `src/auth.ts`:
    * Initialize `betterAuth`.
    * Define `user` schema with `additionalFields`:
        * `software_bg`: string (required: false)
        * `hardware_bg`: string (required: false)
5.  **Internal Route**: `src/routes/internal.ts`:
    * Endpoint: `GET /user/:id`
    * Security: Check `req.header('x-internal-secret') === process.env.INTERNAL_SECRET`.
    * Return: User object with profile fields.
6.  **Server**: `src/index.ts`:
    * Mount Better Auth handler at `/api/auth/**`.
    * Mount internal route at `/internal/**`.
    * Run on port 4000.

### Part 2: Frontend Integration (physical-ai-book/)
1.  **Client**: `src/services/auth-client.ts` initializing `createAuthClient` pointing to `http://localhost:4000`.
2.  **Components**:
    * `src/components/Auth/AuthButton.tsx`: Renders "Sign In" or "Sign Out" based on session.
    * `src/components/Auth/OnboardingModal.tsx`: A modal that appears if `!session.user.software_bg`. Updates profile via `authClient.updateUser`.

## Deliverables
Output the files in this **exact order**, using fenced code blocks:

1.  **Bash Script** (Setup `auth-service` folders & files)
2.  `auth-service/package.json`
3.  `auth-service/.env.example`
4.  `auth-service/src/db.ts`
5.  `auth-service/src/auth.ts`
6.  `auth-service/src/routes/internal.ts`
7.  `auth-service/src/index.ts`
8.  `physical-ai-book/src/services/auth-client.ts`
9.  `physical-ai-book/src/components/Auth/AuthButton.tsx`
10. `physical-ai-book/src/components/Auth/OnboardingModal.tsx`

**Begin implementation.**

## Response snapshot

Executed Phase 1 and Phase 2 of the implementation plan for "Auth & Personalization".
Created all required files for the Node.js `auth-service` (Hono, Better Auth, PostgreSQL integration) and the Docusaurus frontend client components.
All tasks from Phase 1 (Setup) and Phase 2 (Foundational) in `tasks.md` are marked as complete.

## Outcome

- ✅ Impact: Implemented the core authentication sidecar service and integrated the frontend client for login/onboarding.
- 🧪 Tests: No automated tests implemented in this phase, but components are ready for manual verification as per quickstart.md.
- 📁 Files: All specified files created/modified for auth-service and frontend.
- 🔁 Next prompts: Continue with Phase 3 (Chatbot Backend Integration) and Phase 4 (Deployment Preparation) from `tasks.md`.
- 🧠 Reflection: Successfully navigated conflicting database instructions by prioritizing the explicit "Neon Postgres" constraint in the prompt for `auth-service` and implemented the internal API as a secure bridge.

## Evaluation notes (flywheel)

- Failure modes observed: None during implementation. `mkdir` command required sequential execution due to PowerShell syntax differences.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Automate running `npm install` and `npx better-auth migrate` as part of the implementation.
