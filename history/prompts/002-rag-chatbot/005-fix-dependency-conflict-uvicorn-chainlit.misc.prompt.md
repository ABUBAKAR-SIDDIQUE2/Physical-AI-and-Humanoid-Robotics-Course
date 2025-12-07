---
id: "005"
title: "Fix Dependency Conflict Uvicorn Chainlit"
stage: "misc"
date: "2025-12-07"
surface: "agent"
model: "gemini-2.0-flash-exp"
feature: "rag-chatbot"
branch: "main"
user: "Abubakar Siddique"
command: "pip install -r requirements.txt"
labels: ["dependency-conflict", "bugfix", "python"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "chatbot-backend/requirements.txt"
tests:
  - "pip install -r chatbot-backend/requirements.txt"
---

# Prompt

ERROR: Cannot install -r requirements.txt (line 10) and uvicorn==0.32.1 because these package versions have conflicting dependencies.

The conflict is caused by:
    The user requested uvicorn==0.32.1
    chainlit 1.3.2 depends on uvicorn<0.26.0 and >=0.25.0

To fix this you could try to:
1. loosen the range of package versions you've specified
2. remove package versions to allow pip to attempt to solve the dependency conflict

# Response

Identified dependency conflict between `uvicorn==0.32.1` and `chainlit==1.3.2`.
`chainlit 1.3.2` requires `uvicorn<0.26.0`.
Downgraded `uvicorn` to `0.25.0` in `chatbot-backend/requirements.txt` to satisfy the requirement.
Verified the fix by running `pip install -r chatbot-backend/requirements.txt` successfully.
