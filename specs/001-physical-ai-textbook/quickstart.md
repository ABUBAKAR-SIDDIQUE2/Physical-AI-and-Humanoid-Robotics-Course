# Quickstart: Physical AI & Humanoid Robotics Textbook

## Prerequisites

- **Node.js**: v18 or later (LTS recommended)
- **Gemini CLI**: Installed and configured (`npm install -g @google/gemini-cli` or equivalent if applicable)
- **Spec-Kit Plus**: Tools available in `.specify/`

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd physical-ai-book
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Development

1.  **Start the local development server**:
    ```bash
    npm start
    ```
    The site will be available at `http://localhost:3000`.

## Content Generation

1.  **Generate a Chapter Spec**:
    ```bash
    # Example command (adjust based on actual scripts)
    ./scripts/generate-spec.sh --chapter "robotic-nervous-system-ros2"
    ```

2.  **Generate Chapter Content**:
    ```bash
    # Example command
    ./scripts/generate-content.sh --spec specs/001-physical-ai-textbook/chapters/ros2.spec.md
    ```

## Deployment

1.  **Build the static site**:
    ```bash
    npm run build
    ```

2.  **Test the build locally**:
    ```bash
    npm run serve
    ```

3.  **Deploy to GitHub Pages**:
    (Automatic via GitHub Actions on push to `main`)
    OR
    ```bash
    GIT_USER=<username> npm run deploy
    ```
