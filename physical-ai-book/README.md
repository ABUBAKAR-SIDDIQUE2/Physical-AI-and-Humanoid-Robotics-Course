# Course Textbook & Chat UI (Frontend)

This directory contains the source code for the **Physical AI & Humanoid Robotics** textbook website. It is built using [Docusaurus](https://docusaurus.io/), allowing for easy writing of documentation in Markdown/MDX while providing a custom React environment for the AI Chat Widget.

## ✨ Features

*   **Documentation First:** Structured learning paths for physical AI topics.
*   **Integrated Chatbot:** A persistent chat widget that floats on the UI, allowing students to ask questions about the current page or the entire course.
*   **Custom React Components:** Interactive elements embedded directly into the learning material.

## 📂 Structure

*   `docs/`: The core course content (Markdown/MDX files).
*   `src/components/ChatWidget/`: The React code for the floating chat interface.
*   `src/services/api.ts`: API client connecting to the Python backend.
*   `docusaurus.config.js`: Main site configuration.

## 🚀 Setup & Installation

### Prerequisites
*   Node.js version 18 or higher.

### 1. Installation
Install the project dependencies:
```bash
npm install
# or
yarn install
```

### 2. Configuration
The frontend communicates with the backend via the API URL defined in `src/services/api.ts`.
Ensure the backend is running (default `http://localhost:8000`).

*Note: If deploying, ensure the `API_BASE_URL` in `api.ts` points to your production backend.*

### 3. Local Development
Start the local development server:
```bash
npm start
# or
yarn start
```
The site will open at `http://localhost:3000`.

## ✍️ Writing Content

1.  Create a new file in the `docs/` directory (e.g., `docs/my-new-topic.md`).
2.  Add frontmatter to the top of the file:
    ```markdown
    ---
    id: my-new-topic
    title: My New Topic
    sidebar_label: New Topic
    ---
    ```
3.  Write your content using Markdown.
4.  The sidebar structure is managed in `sidebars.js`.

## 🚢 Building for Production

To build the static files for deployment:
```bash
npm run build
```
The output will be in the `build/` directory.

## 🔧 Chat Widget Configuration

The chat widget is mounted in `src/theme/Root.tsx` (or similar layout wrapper) to ensure it persists across page navigation.
Key logic resides in `src/components/ChatWidget/ChatPanel.tsx`.