#!/bin/bash
set -e

# Create directories
mkdir -p chatbot-backend/app/db
mkdir -p chatbot-backend/app/services
mkdir -p chatbot-backend/app/routers
mkdir -p chatbot-backend/tests

# Create empty files to ensure they exist
touch chatbot-backend/app/__init__.py
touch chatbot-backend/app/db/__init__.py
touch chatbot-backend/app/services/__init__.py
touch chatbot-backend/app/routers/__init__.py

# Create requirements.txt
cat > chatbot-backend/requirements.txt <<EOF
fastapi==0.115.6
uvicorn==0.32.1
python-dotenv==1.0.1
qdrant-client==1.12.1
openai==1.57.2
psycopg[binary]==3.2.3
SQLAlchemy==2.0.36
asyncpg==0.30.0
tiktoken==0.8.0
chainlit==1.3.2
httpx==0.28.1
EOF

# Create .env.example
cat > chatbot-backend/.env.example <<EOF
# API Keys
OPENAI_API_KEY=sk-...

# Qdrant
# Use http://localhost:6333 for local docker
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# Postgres (Neon)
NEON_CONN_STRING=postgresql+asyncpg://user:password@host/dbname

# App
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
CORS_ORIGINS=["http://localhost:3000","https://abubakar-siddique2.github.io"]
EOF

# Create docker-compose.yml for Qdrant
cat > chatbot-backend/docker-compose.yml <<EOF
version: '3.8'
services:
  qdrant:
    image: qdrant/qdrant:v1.12.1
    ports:
      - "6333:6333"
    volumes:
      - ./qdrant_storage:/qdrant/storage:z
EOF

# Create dev.sh
cat > chatbot-backend/dev.sh <<EOF
#!/bin/bash
uvicorn app.main:app --reload --port 8000
EOF
chmod +x chatbot-backend/dev.sh

echo "Setup complete. Run 'cd chatbot-backend && pip install -r requirements.txt' to install dependencies."
