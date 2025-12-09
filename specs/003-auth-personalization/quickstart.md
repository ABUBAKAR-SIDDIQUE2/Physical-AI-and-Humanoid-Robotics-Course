# Quickstart: Auth & Personalization

## Prerequisites
- Node.js v20+
- Python 3.12+

## 1. Setup Auth Service
Navigate to `auth-service`:
```bash
cd auth-service
npm install
cp .env.example .env
npm run db:migrate # Setup SQLite
npm run dev
```
*Runs on http://localhost:4000*

## 2. Update Chatbot Backend
Navigate to `chatbot-backend`:
```bash
# Ensure venv is active
pip install -r requirements.txt # (If new deps added)
# Set AUTH_SERVICE_URL=http://localhost:4000 in .env
uvicorn app.main:app --reload --port 8000
```

## 3. Run Frontend
Navigate to `physical-ai-book`:
```bash
npm install
npm start
```
*Runs on http://localhost:3000*

## 4. Verification
1.  Open http://localhost:3000.
2.  Click "Login" in navbar.
3.  Create an account.
4.  Complete the "Onboarding" modal.
5.  Ask the chatbot "How do I start?".
6.  Check backend logs to see if `software_bg` was retrieved.
