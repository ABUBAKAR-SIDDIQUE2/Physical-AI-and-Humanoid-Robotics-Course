---
description: "Task list template for feature implementation"
---

# Tasks: Create Physical AI & Humanoid Robotics Textbook

**Input**: Design documents from `/specs/001-physical-ai-textbook/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Docusaurus build validation is included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project Root**: `physical-ai-book/`
- **Specs**: `specs/001-physical-ai-textbook/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Docusaurus project structure in `physical-ai-book/`
- [x] T002 Initialize Node.js project with Docusaurus Classic dependencies in `physical-ai-book/package.json`
- [x] T003 [P] Install MermaidJS support (`@docusaurus/theme-mermaid`)
- [x] T004 Clean up default tutorial and blog content from `physical-ai-book/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create top-level docs folder `physical-ai-book/docs/introduction-to-physical-ai`
- [x] T006 [P] Create top-level docs folder `physical-ai-book/docs/robotic-nervous-system-ros2`
- [x] T007 [P] Create top-level docs folder `physical-ai-book/docs/digital-twin-gazebo-unity`
- [x] T008 [P] Create top-level docs folder `physical-ai-book/docs/ai-robot-brain-nvidia-isaac`
- [x] T009 [P] Create top-level docs folder `physical-ai-book/docs/humanoid-robot-development`
- [x] T010 [P] Create top-level docs folder `physical-ai-book/docs/vision-language-action-vla`
- [x] T011 [P] Create top-level docs folder `physical-ai-book/docs/conversational-robotics`
- [x] T012 [P] Create top-level docs folder `physical-ai-book/docs/capstone-autonomous-humanoid`
- [x] T013 [P] Create top-level docs folder `physical-ai-book/docs/hardware-requirements`
- [x] T014 [P] Create static asset directory `physical-ai-book/static/img/diagrams`
- [x] T015 [P] Create examples directory `physical-ai-book/examples`
- [x] T016 Configure Docusaurus title and Mermaid plugin in `physical-ai-book/docusaurus.config.js`
- [x] T017 Create strict sidebar configuration in `physical-ai-book/sidebars.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Access Online Textbook (Priority: P1) 🎯 MVP

**Goal**: Verify Docusaurus structure allows accessing the textbook online in a structured format.

**Independent Test**: Verify the Docusaurus site loads and displays content.

### Implementation for User Story 1

- [x] T018 [US1] Draft spec for Introduction chapter in `specs/001-physical-ai-textbook/chapters/01-introduction.spec.md`
- [x] T019 [US1] Generate Introduction content using Gemini CLI to `physical-ai-book/docs/introduction-to-physical-ai/index.mdx`
- [x] T020 [P] [US1] Verify local build success with `npm run build`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Generate Content via CLI (Priority: P1)

**Goal**: Populate the textbook efficiently using Spec-Kit and Gemini CLI.

**Independent Test**: Run the generation scripts and verify markdown files are created.

### Implementation for User Story 2

- [x] T021 [US2] Draft spec for ROS 2 chapter in `specs/001-physical-ai-textbook/chapters/02-ros2.spec.md`
- [x] T022 [US2] Generate ROS 2 content using Gemini CLI to `physical-ai-book/docs/robotic-nervous-system-ros2/index.mdx`
- [x] T023 [US2] Draft spec for Digital Twin chapter in `specs/001-physical-ai-textbook/chapters/03-simulation.spec.md`
- [x] T024 [US2] Generate Digital Twin content using Gemini CLI to `physical-ai-book/docs/digital-twin-gazebo-unity/index.mdx`
- [x] T025 [US2] Draft spec for Isaac chapter in `specs/001-physical-ai-textbook/chapters/04-isaac.spec.md`
- [x] T026 [US2] Generate Isaac content using Gemini CLI to `physical-ai-book/docs/ai-robot-brain-nvidia-isaac/index.mdx`
- [x] T027 [US2] Draft spec for Humanoids chapter in `specs/001-physical-ai-textbook/chapters/05-humanoids.spec.md`
- [x] T028 [US2] Generate Humanoids content using Gemini CLI to `physical-ai-book/docs/humanoid-robot-development/index.mdx`
- [x] T029 [US2] Draft spec for VLA chapter in `specs/001-physical-ai-textbook/chapters/06-vla.spec.md`
- [x] T030 [US2] Generate VLA content using Gemini CLI to `physical-ai-book/docs/vision-language-action-vla/index.mdx`
- [x] T031 [US2] Draft spec for Conversational chapter in `specs/001-physical-ai-textbook/chapters/07-conversational.spec.md`
- [x] T032 [US2] Generate Conversational content using Gemini CLI to `physical-ai-book/docs/conversational-robotics/index.mdx`
- [x] T033 [US2] Draft spec for Capstone chapter in `specs/001-physical-ai-textbook/chapters/08-capstone.spec.md`
- [x] T034 [US2] Generate Capstone content using Gemini CLI to `physical-ai-book/docs/capstone-autonomous-humanoid/index.mdx`
- [x] T035 [US2] Draft spec for Hardware chapter in `specs/001-physical-ai-textbook/chapters/09-hardware.spec.md`
- [x] T036 [US2] Generate Hardware content using Gemini CLI to `physical-ai-book/docs/hardware-requirements/index.mdx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Deploy to GitHub Pages (Priority: P2)

**Goal**: Site is deployed to GitHub Pages so that it is publicly accessible.

**Independent Test**: Push to `gh-pages` branch or run deploy workflow and check URL.

### Implementation for User Story 3

- [x] T037 [P] [US3] Configure GitHub Actions deploy workflow in `.github/workflows/deploy.yml`
- [x] T038 [US3] Configure deployment settings in `physical-ai-book/docusaurus.config.js`
- [x] T039 [US3] Verify successful deployment to GitHub Pages branch
- [x] T040 [P] Validate sidebar navigation order locally
- [x] T041 Run final broken link check (`npm run build`)

**Checkpoint**: All user stories should now be independently functional

---

- [x] T040 [P] Validate sidebar navigation order locally
- [x] T041 Run final broken link check (`npm run build`)
- [x] T042 [Fix] Restore `src/pages/index.tsx` to fix root 404 errors

**Status**: Project is fully implemented, built, and ready for deployment.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- Folder creation tasks (T006-T013) can run in parallel.
- Content generation tasks (T021-T036) can technically run in parallel if specs are ready, but are sequential in logical order.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Introduction Chapter)
4. **STOP and VALIDATE**: Test site builds and Introduction is visible.

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 (Intro) -> Verify
3. Add User Story 2 (All other chapters) -> Verify content and sidebar order
4. Add User Story 3 (Deployment) -> Verify public URL
