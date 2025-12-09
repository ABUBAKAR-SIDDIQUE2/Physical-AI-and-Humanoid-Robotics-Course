# Feature Specification: Auth & Personalization

**Feature Branch**: `003-auth-personalization`  
**Created**: 2025-12-09  
**Status**: Draft  
**Input**: User description: "Req-3: Auth & Personalization"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Signup & Login (Priority: P1)

As a user, I want to sign up via Email/Password so I can save my progress.

**Why this priority**: Core prerequisite for identity and personalization.

**Independent Test**: Can create an account and log in successfully without interacting with the chatbot.

**Acceptance Scenarios**:

1. **Given** I am on the homepage, **When** I click "Login", **Then** I see a login/signup modal or page.
2. **Given** I enter valid email/password credentials, **When** I submit, **Then** I am authenticated and redirected to the dashboard/home.
3. **Given** I enter invalid credentials, **When** I submit, **Then** I see an error message.

---

### User Story 2 - Onboarding Flow (Priority: P1)

As a new user, I MUST be asked about my "Software Experience" (Beginner/Expert) and "Hardware Experience" (Arduino/PCB) immediately after signup so that the system understands my background.

**Why this priority**: Essential data collection for the personalization feature.

**Independent Test**: After signup, the onboarding modal appears and saves data to the user profile.

**Acceptance Scenarios**:

1. **Given** I have just signed up, **When** the process completes, **Then** I am immediately presented with an Onboarding Modal.
2. **Given** the Onboarding Modal, **When** I select "Beginner" for Software and "Arduino" for Hardware and submit, **Then** these values are stored in my profile.
3. **Given** an existing user with missing profile data, **When** I log in, **Then** I see the Onboarding Modal.

---

### User Story 3 - Personalized Answers (Priority: P2)

As a user, if I am an "Expert", the chatbot should use technical jargon. If "Beginner", it should explain concepts simply.

**Why this priority**: Delivers the core value proposition of the "Personalization" feature.

**Independent Test**: Send the same query from two different user accounts (Expert vs Beginner) and observe different responses.

**Acceptance Scenarios**:

1. **Given** I am an "Expert" user, **When** I ask "What is a GPIO?", **Then** the response uses technical embedded systems terminology.
2. **Given** I am a "Beginner" user, **When** I ask "What is a GPIO?", **Then** the response explains the concept simply, possibly using analogies.

### Edge Cases

- What happens if the Auth Service is down? (Frontend should handle gracefully, Chatbot might fail or degrade to generic mode).
- What happens if a user has a profile in Auth Service but not in the Chatbot's context? (Chatbot should lazy-load or default to generic).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Auth Service)**: System MUST expose authentication endpoints (`/api/auth/*`) to handle signup, login, and session management.
- **FR-002 (Database)**: System MUST store `software_bg` and `hardware_bg` attributes in the user profile.
- **FR-003 (Frontend)**: System MUST display an "Onboarding Modal" if the authenticated user's profile fields (`software_bg`, `hardware_bg`) are null/empty.
- **FR-004 (Personalization)**: The Chatbot Backend MUST retrieve the user's profile context (software/hardware level) and inject it into the AI model's system prompt.
- **FR-005 (Middleware)**: The Chatbot Backend MUST reject requests to personalized endpoints that lack a valid Auth header or token.

### Key Entities *(include if feature involves data)*

- **User**: Represents the identity, holds credentials (managed by Auth) and profile metadata (`software_bg`, `hardware_bg`).
- **Session**: Represents an active user login state.

## System Architecture & Technical Constraints

*As requested by the architect:*

- **Architecture Pattern**: Sidecar / Microservice.
- **Auth Service**: Node.js/Hono hosting "Better Auth". Manages `users` table in Neon Postgres.
- **Chatbot Backend**: Existing Python FastAPI service. Validates tokens via API call to Auth Service (or DB check).
- **Frontend**: Docusaurus using `@better-auth/react`.
- **Database**: Neon Serverless Postgres (Shared or separate schemas).
- **Deployment**: Render (separate services).

## API Specifications

- **Auth Service**:
    - Standard Better Auth routes (`/api/auth/*`).
    - `GET /internal/user/{id}`: Internal endpoint for Python backend to fetch user profile.
- **Chatbot Backend**:
    - `POST /api/query`: Updated to accept `Authorization: Bearer <token>`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can sign up and complete onboarding in under 2 minutes.
- **SC-002**: 100% of queries from authenticated users trigger the personalized system prompt logic.
- **SC-003**: System handles concurrent auth requests with <200ms latency.