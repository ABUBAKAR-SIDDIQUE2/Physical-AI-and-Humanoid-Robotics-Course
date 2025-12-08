# Physical AI & Humanoid Robotics Course

Welcome to the **Physical AI & Humanoid Robotics Course** repository. This project is a comprehensive educational platform that combines a modern, interactive textbook with an intelligent, context-aware AI teaching assistant.

## 📚 Project Overview

The goal of this project is to democratize knowledge about Embodied Intelligence, covering topics from ROS 2 and Nvidia Isaac Sim to Vision-Language-Action (VLA) models and humanoid hardware.

The platform consists of two main components:
1.  **The Textbook (Frontend):** A Docusaurus-based documentation site containing the course curriculum, tutorials, and an integrated chat interface.
2.  **The AI Assistant (Backend):** A RAG (Retrieval-Augmented Generation) powered backend using FastAPI, Qdrant, and Google Gemini to answer student questions based strictly on the course material.

## 🏗️ Architecture

```mermaid
flowchart LR
    User[Student] -->|Reads and Chats| FE[Frontend (Docusaurus)]
    FE -->|API Calls| BE[Backend (FastAPI)]
    
    subgraph Backend_Services
        BE -->|Chat History| PG[(PostgreSQL)]
        BE -->|Vector Search| VDB[(Qdrant)]
        BE -->|LLM Inference| AI[Google Gemini]
    end
    
    subgraph Data_Pipeline
        Docs[Course Markdown] -->|Ingestion Script| VDB
    end
```

## 🚀 Quick Start

### Prerequisites
*   **Node.js** (v18+)
*   **Python** (v3.10+)
*   **PostgreSQL** (or a cloud instance like Neon)
*   **Qdrant** (Docker container or cloud cloud instance)
*   **Google Gemini API Key**

### 1. Repository Setup
Clone the repository:
```bash
git clone https://github.com/ABUBAKAR-SIDDIQUE2/Physical-AI-and-Humanoid-Robotics-Course.git
cd Physical-AI-and-Humanoid-Robotics-Course
```

### 2. Backend Setup
Navigate to the backend directory and follow the instructions to set up the API and vector database.
👉 **[Read the Backend README](./chatbot-backend/README.md)**

### 3. Frontend Setup
Navigate to the frontend directory to launch the textbook and chat UI.
👉 **[Read the Frontend README](./physical-ai-book/README.md)**

## 🤝 Contribution Guidelines

We welcome contributions to both the course content and the platform code!

1.  **Fork** the repository.
2.  **Create a Branch** for your feature or content update (`git checkout -b feature/new-chapter`).
3.  **Commit** your changes with clear messages.
4.  **Push** to your fork and submit a **Pull Request**.

### Content Contributions
*   All course content is located in `physical-ai-book/docs`.
*   Use Markdown/MDX.
*   Place images in `physical-ai-book/static/img`.

## 📄 License
[MIT License](LICENSE) (or appropriate license)
