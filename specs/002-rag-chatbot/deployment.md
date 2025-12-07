# Deployment Guide for RAG Chatbot

## Overview
The chatbot backend is a FastAPI application containerized with Docker. It connects to:
- **Qdrant Cloud** (Vector DB)
- **Neon Postgres** (Chat History)
- **Google Gemini API** (LLM)

## Prerequisites
- Docker & Docker Compose (for local testing)
- A cloud hosting provider (Render, Railway, AWS App Runner, or DigitalOcean App Platform)

## Docker Build
To build the image locally:
```bash
cd chatbot-backend
docker build -t physical-ai-chatbot .
```

## Environment Variables
The following environment variables must be set in your production environment (do NOT commit `.env`):

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API Key |
| `QDRANT_URL` | URL of your Qdrant cluster (e.g., `https://xyz.qdrant.tech`) |
| `QDRANT_API_KEY` | API Key for Qdrant |
| `NEON_CONN_STRING` | Postgres connection string (starts with `postgresql+asyncpg://`) |
| `BACKEND_HOST` | Set to `0.0.0.0` |
| `BACKEND_PORT` | Set to `8000` (or match your provider's port) |
| `CORS_ORIGINS` | JSON list of allowed origins, e.g., `["https://your-docusaurus-site.com"]` |

## Deployment Options

### Option 1: Render / Railway (Easiest)
1. Connect your GitHub repository.
2. Point the service to the `chatbot-backend/` directory.
3. Add the environment variables listed above.
4. The service should auto-detect the `Dockerfile` and build.

### Option 2: GitHub Container Registry (GHCR)
The repository includes a GitHub Action (`.github/workflows/backend-deploy.yml`) that pushes the image to GHCR on every merge to `main`.
1. Pull the image: `docker pull ghcr.io/<your-username>/<repo-name>-backend:latest`
2. Run it on any VPS or Container Service.

## Database Migrations
On the first deployment, you must apply the database schema.
**Command:** `alembic upgrade head`

*Note: Some platforms allow specifying a "Build Command" or "Pre-Deploy Command" where you can add this.*

## Frontend Integration
Once the backend is live:
1. Update `physical-ai-book/src/services/api.ts` (or use a build-time env var) to point `API_BASE_URL` to your production backend URL (e.g., `https://my-chatbot.onrender.com/api`).
2. Rebuild and deploy the Docusaurus site.
