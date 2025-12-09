# Auth Service

This `auth-service` acts as a dedicated sidecar for handling user authentication and personalization data within the Physical AI & Humanoid Robotics Course project. It uses the `better-auth` library, which is a Node.js/TypeScript-based solution, effectively bridging the frontend (Docusaurus) and the Python `chatbot-backend`.

## ✨ Features

*   **User Authentication**: Provides standard signup and login functionalities via email/password.
*   **User Profiles**: Stores additional user metadata (`software_bg`, `hardware_bg`) for personalization.
*   **Internal API**: Exposes a secured internal endpoint for the Python backend to fetch user profiles.
*   **PostgreSQL Backend**: Utilizes Neon Postgres for user and session data persistence.

## 🛠️ Tech Stack

*   **Framework**: [Hono](https://hono.dev/) (a lightweight, fast web framework for Node.js)
*   **Authentication**: [Better Auth](https://better-auth.com/)
*   **Database**: PostgreSQL (specifically designed for [Neon Serverless Postgres](https://neon.tech/))
*   **Language**: TypeScript
*   **Runtime**: Node.js

## 📂 Structure

*   `src/index.ts`: Main entry point for the Hono server, sets up CORS and mounts routes.
*   `src/auth.ts`: Configures `better-auth` with the database pool and defines the custom user schema.
*   `src/db.ts`: Handles PostgreSQL database connection using `node-postgres` (`pg`).
*   `src/routes/internal.ts`: Defines internal API routes, including the secured endpoint for fetching user profiles.
*   `.env.example`: Template for environment variables.

## 🚀 Setup & Installation

### Prerequisites
*   Node.js (v20 or higher)
*   PostgreSQL database (e.g., a Neon Postgres instance)

### 1. Navigate to the Service Directory
```bash
cd auth-service
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configuration (`.env`)
Create a `.env` file in the `auth-service/` directory based on `.env.example`.

```ini
# Database Connection String (Neon Postgres recommended)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Secret key for Better Auth (MUST be a long, random string)
BETTER_AUTH_SECRET=your_better_auth_secret_key

# URL where this Auth Service will be accessible (e.g., http://localhost:4000)
BETTER_AUTH_URL=http://localhost:4000

# Secret key for internal API calls (shared with chatbot-backend)
INTERNAL_SECRET=your_internal_shared_secret

# Comma-separated list of allowed frontend origins (e.g., http://localhost:3000,https://your-frontend.com)
ALLOWED_ORIGINS=http://localhost:3000
```
**Important**: Ensure `DATABASE_URL` points to your PostgreSQL instance.

### 4. Database Migrations
Run `better-auth`'s migration command to set up the user and session tables in your PostgreSQL database:
```bash
npx better-auth migrate
```

## 🏃 Running the Service

### Development Mode
To run the service with hot-reloading:
```bash
npm run dev
```
The service will typically start on `http://localhost:4000`.

### Production Mode
For production, you should build the TypeScript code and then run the compiled JavaScript:
```bash
npm run build
npm start
```

## 🔐 Internal API Endpoint

The `auth-service` exposes an internal endpoint to allow the `chatbot-backend` to fetch user profile details securely.

*   **Endpoint**: `GET /internal/user/:id`
*   **Authentication**: Requires an `x-internal-secret` header with the value matching `INTERNAL_SECRET` configured in the `.env` file.
*   **Response**: Returns the user object, including `software_bg` and `hardware_bg` fields.

---
