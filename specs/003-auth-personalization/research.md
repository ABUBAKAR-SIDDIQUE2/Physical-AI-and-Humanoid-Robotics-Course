# Research: Auth & Personalization

**Goal**: Determine the best integration path for Better Auth (Node.js) with Python FastAPI and Docusaurus.

## 1. Auth Service Framework
**Decision**: Use **Hono** (Node.js adapter).
**Rationale**: Hono is extremely lightweight, fast, and has first-class support for Better Auth. It's simpler than Express for this microservice use case.
**Alternatives**:
- *Express*: Heavier, older patterns.
- *Fastify*: Good, but Hono is currently the "go-to" for modern lightweight TS servers.

## 2. Database Strategy
**Decision**: **SQLite** (Local) / **Postgres** (Production).
**Rationale**: The prompt explicitly requested "local SQLite file" for the auth service.
- **Implication**: Since `chatbot-backend` cannot easily read a locked SQLite file owned by another process (reliably), we **must** use an HTTP API bridge.
- **Bridge**: The `auth-service` will expose an endpoint (e.g., `GET /internal/user`) protected by an internal secret or just validate the session cookie passed from the frontend.

## 3. Better Auth Custom Fields
**Decision**: Use Better Auth's `additionalFields` configuration.
**Schema**:
```typescript
user: {
  additionalFields: {
    software_bg: { type: "string", required: false },
    hardware_bg: { type: "string", required: false }
  }
}
```

## 4. Python <-> Node.js Communication
**Decision**: API Call (Sidecar pattern).
**Flow**:
1. Frontend sends request to FastAPI with `Cookie` or `Bearer Token`.
2. FastAPI extracts token.
3. FastAPI makes HTTP GET to `http://localhost:4000/api/auth/get-session` (Better Auth standard endpoint) passing the headers.
4. `auth-service` returns User object (including custom fields).
5. FastAPI caches this (optional) and proceeds.

## 5. Frontend Integration
**Decision**: Use `@better-auth/react` client.
- Docusaurus is React-based. The library provides hooks like `useSession`.
- We need to wrap the Docusaurus root in the Auth Provider (if applicable) or just use the hooks in components.

## 6. Unknowns Resolved
- **Can Python verify Better Auth tokens?** Yes, by calling the Better Auth server or implementing the verification logic (JWT/Database lookup) manually. Calling the server is stricter and easier to maintain.
- **How to store profile data?** `additionalFields` in Better Auth schema.
