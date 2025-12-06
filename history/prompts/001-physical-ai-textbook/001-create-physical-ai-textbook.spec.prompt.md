---
id: 001
title: create-physical-ai-textbook
stage: spec
date: 2025-12-07
surface: agent
model: gemini-2.0-flash-exp
feature: 001-physical-ai-textbook
branch: 001-physical-ai-textbook
user: user
command: /sp.specify
labels: ["spec", "docusaurus", "setup"]
links:
  spec: specs/001-physical-ai-textbook/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/001-physical-ai-textbook/spec.md
 - specs/001-physical-ai-textbook/checklists/requirements.md
tests:
 - (none)
---

## Prompt

Here is the fully aligned Specification, updated to match your Constitution's folder structure and including the missing Hardware and Sidebar requirements. Markdown # Specification: “Physical AI & Humanoid Robotics Textbook” (Task 1 Only) ## 1. Project Goal Create a complete, structured textbook website using **Docusaurus**, written with **Spec-Kit Plus** and **Gemini CLI**, and deployed publicly to **GitHub Pages**. --- ## 2. Deliverables 1. A fully generated **Docusaurus website** containing the entire textbook. 2. Textbook content generated using **Spec-Kit Plus** specifications and **Gemini CLI** writing tasks. 3. A working GitHub repository with: - `/docs` folder containing all book chapters (structure matching Constitution). - Configured `sidebars.js` (ordered by learning progression). - Configured `docusaurus.config.js` (metadata and settings). 4. Automatic or manual deployment to **GitHub Pages**, publicly accessible. --- ## 3. Technical Requirements ### 3.1 Docusaurus Setup - Must use **Docusaurus v2/v3**. - Must use classic template: ```bash npx create-docusaurus@latest physical-ai-book classic Docs mode enabled (docsOnly: false or standard mode with docs as home). Sidebar navigation must strictly mirror the book chapters defined in the Constitution. 3.2 Documentation Structure (Synced with Constitution) The folder layout must exactly match Constitution Section 12: Plaintext /docs /introduction # Weeks 1-2 (Foundations) /ros2 # Weeks 3-5 (The Robotic Nervous System) /simulation # Weeks 6-7 (Gazebo & Unity) /isaac # Weeks 8-10 (NVIDIA Isaac & Sim-to-Real) /humanoids # Weeks 11-12 (Kinematics & Dynamics) /vla # Module 4 (Vision-Language-Action) /conversational # Week 13 (Whisper & GPT Integration) /capstone # Final Project (The Autonomous Humanoid) /hardware # Hardware Requirements & Setup Each folder must contain an index.mdx (Overview) and supporting .md files for sub-topics. 4. Content Requirements 4.1 Source of Content Content MUST be derived from: Course Description: Weekly breakdown and Learning Outcomes. Hardware List: Specifics on RTX 4070+, Jetson Orin, Unitree Go2/G1, and RealSense. Constitution: Style guides and canonical definitions. 4.2 Content Style Clear educational textbook workflow. Include MermaidJS diagrams for architecture (as per Constitution Sec 13). Include code examples (Python/ROS 2, C#/Unity, Bash). Modular, structured chapters. Learning outcomes must appear at the start of each chapter. 5. Spec-Kit Plus Requirements 5.1 Specs to Write Spec-Kit must generate the following specifications: Spec 1: Project Structure Spec Defines the folder hierarchy listed in Section 3.2. Generates sidebars.js to ensure chapters appear in the correct pedagogical order (Introduction -> Hardware -> ROS 2 -> etc.). Generates docusaurus.config.js with project title and tagline. Spec 2: Hardware & Lab Setup Spec Generates the /hardware directory content. Must distinguish between: The Sim Rig: (RTX Workstation setup). The Edge Brain: (Jetson Orin setup). The Robot: (Unitree/RealSense setup). Spec 3: Chapter Content Specs (Modules) Generates specifications for each core module (ROS 2, Simulation, Isaac, Humanoids, VLA). Each chapter spec must include: Summary & Concepts. Code Examples (e.g., "Write a ROS 2 Subscriber"). Exercises. Verification Checklist (Constitution Sec 7). Spec 4: Deployment Spec Includes GitHub Pages configuration instructions. Deployment checklist. 6. Gemini CLI Requirements Gemini CLI will be used to: Expand each chapter specification into full text. Generate educational content suitable for engineering students. Produce .md or .mdx files under relevant /docs/<chapter> folders. Gemini Workflow: Input = Chapter Spec + Constitution (Context). Output = Markdown file. 7. GitHub Pages Deployment Requirements Deploy using GitHub Actions or the docusaurus deploy command. Repository must include: gh-pages branch (if manual). .github/workflows/deploy.yml (if automatic). Website must be publicly available at: https://<username>.github.io/<repo-name>/ 8. Completion Criteria Task 1 is complete when: All book chapters are generated and populated with text/code. Sidebar navigation works and matches the Constitution's order. Content is strictly derived from Spec-Kit specs + Gemini generation. GitHub Pages deployment is live and accessible. Repository contains all source docs and configs.

## Response snapshot

Created spec and checklist for Physical AI Textbook.

## Outcome

- ✅ Impact: Specification created.
- 🧪 Tests: N/A
- 📁 Files: spec.md, requirements.md
- 🔁 Next prompts: /sp.plan
- 🧠 Reflection: Successfully parsed detailed user input into structured spec.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): default
- Next experiment (smallest change to try): None
