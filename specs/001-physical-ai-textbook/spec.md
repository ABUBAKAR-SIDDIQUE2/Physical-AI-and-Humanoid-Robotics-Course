# Feature Specification: Create Physical AI & Humanoid Robotics Textbook

**Feature Branch**: `001-physical-ai-textbook`
**Created**: 2025-12-07
**Status**: Draft
**Input**: User description provided in prompt.

## User Scenarios & Testing

### User Story 1 - Access Online Textbook (Priority: P1)

As a student, I want to access the "Physical AI & Humanoid Robotics" textbook online so that I can read the course material in a structured format.

**Why this priority**: This is the primary product artifact.

**Independent Test**: Verify the Docusaurus site loads and displays content.

**Acceptance Scenarios**:
1. **Given** the website is deployed, **When** I navigate to the home page, **Then** I see the landing page for the textbook.
2. **Given** I am reading, **When** I use the sidebar, **Then** I can navigate through chapters in the correct pedagogical order (Introduction -> Hardware -> ROS 2 -> ...).

### User Story 2 - Generate Content via CLI (Priority: P1)

As an author, I want to use Spec-Kit and Gemini CLI to generate chapter content so that the textbook is populated efficiently and adheres to the style guide.

**Why this priority**: Necessary to create the content for the book.

**Independent Test**: Run the generation scripts and verify markdown files are created.

**Acceptance Scenarios**:
1. **Given** a chapter spec, **When** I run the Gemini CLI task, **Then** a `.md` or `.mdx` file is generated in the correct `/docs` subdirectory.
2. **Given** the generated content, **When** I inspect it, **Then** it includes learning outcomes, diagrams, and code examples.

### User Story 3 - Deploy to GitHub Pages (Priority: P2)

As a maintainer, I want the site to be deployed to GitHub Pages so that it is publicly accessible.

**Why this priority**: Public availability requirement.

**Independent Test**: Push to `gh-pages` branch or run deploy workflow and check URL.

**Acceptance Scenarios**:
1. **Given** the repository is pushed to GitHub, **When** the deploy action runs, **Then** the site is live at `https://<username>.github.io/<repo-name>/`.

### Edge Cases

- **Empty Chapters**: If a chapter has no content yet, it should still appear in the folder structure (possibly with a "Coming Soon" placeholder).
- **Build Failures**: If invalid markdown or broken links are generated, the build should fail with clear errors (Docusaurus standard behavior).

## Requirements

### Functional Requirements

- **FR-001**: System MUST use Docusaurus v2 or v3 with the 'classic' template.
- **FR-002**: The repository MUST contain a `/docs` directory with subdirectories exactly matching (in order): `introduction`, `ros2`, `simulation`, `isaac`, `humanoids`, `vla`, `conversational`, `capstone`, `hardware`.
- **FR-003**: The `sidebars.js` configuration MUST enforce the order matching FR-002: `Introduction`, `ROS 2`, `Simulation`, `Isaac`, `Humanoids`, `VLA`, `Conversational`, `Capstone`, `Hardware`.
- **FR-004**: Each chapter directory MUST contain an `index.mdx` overview file, including `title` and `sidebar_position` in its YAML frontmatter. Only `index.mdx` should be generated initially, without automatic subtopic files.
- **FR-005**: Content generation MUST utilize Spec-Kit Plus for specs and Gemini CLI for text expansion.
- **FR-006**: The project MUST include a `docusaurus.config.js` with correct metadata (title, tagline, url).
- **FR-007**: The project MUST include deployment configuration for GitHub Pages (either `deploy.yml` workflow or `gh-pages` branch setup).
- **FR-008**: Content MUST include MermaidJS diagrams where architectural concepts are described.
- **FR-009**: Content MUST include code examples in Python/ROS 2, C#/Unity, or Bash as appropriate for the module.
- **FR-010**: All chapter folders and supporting folders MUST use kebab-case for their names.
- **FR-011**: Supporting asset folders (e.g., for images and code examples) MUST be located at the project root level (e.g., `/static/img`, `/examples`).

### Key Entities

- **Textbook**: The overall Docusaurus site.
- **Chapter**: A module of the course (e.g., "The Robotic Nervous System"), represented by a folder.
- **Topic**: A specific subject within a chapter, represented by a markdown file.
- **Spec**: A definition file used by Spec-Kit to generate content.

## Success Criteria

### Measurable Outcomes

- **SC-001**: The Docusaurus build command (`npm run build`) completes with exit code 0.
- **SC-002**: The website is publicly accessible via a GitHub Pages URL (HTTP 200 OK).
- **SC-003**: The sidebar contains exactly the 9 specified top-level categories in the defined order.
- **SC-004**: 100% of the chapter directories specified in FR-002 exist in the file system.

## Clarifications

### Session 2025-12-07

- Q: What naming convention should be applied to chapter folders and any future supporting folders within the `/docs` directory? → A: Kebab-case (e.g., `folder-name`)
- Q: Should dedicated supporting folders for assets (like images, diagrams, and code examples) be located directly under the project root, or within the `/docs` directory structure? → A: Project root level (`/static/img`, `/examples`)
- Q: Which of these orders is the definitive, canonical order that should be applied to both the folder structure within `/docs` and the sidebar navigation? (FR-002: `introduction`, `ros2`, ..., `hardware`; FR-003: `Introduction`, `Hardware`, `ROS 2`, ...) → A: FR-002 order (folders first: introduction, ros2, ..., hardware last)
- Q: Should the `index.mdx` file for each chapter include specific YAML frontmatter, and if so, what fields should it contain to ensure correct Docusaurus behavior (e.g., displaying titles, ordering in sidebar)? → A: Yes, include `title` and `sidebar_position`
- Q: For each chapter, beyond the `index.mdx` overview file, should additional placeholder files for subtopics (e.g., `topic-1.mdx`, `topic-2.mdx`) be automatically generated in the chapter directory, or should only the `index.mdx` be created initially? → A: No, generate only the `index.mdx` file per chapter