---
id: 002
title: amend-physical-ai-robotics-constitution
stage: constitution
date: 2025-12-07
surface: agent
model: gemini-2.0-flash-exp
feature: 001-physical-ai-textbook
branch: 001-physical-ai-textbook
user: user
command: /sp.constitution
labels: ["constitution", "amendment"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - (none)
---

## Prompt

Please formally amend the "Physical AI & Humanoid Robotics" Constitution to Version 1.1.0. 

The specific changes required are:

1. **Update Section 12 (File & Folder Structure)**: 
   Replace the previous short folder names with the following verbose, descriptive naming convention:
   - `introduction` → `introduction-to-physical-ai`
   - `ros2` → `robotic-nervous-system-ros2`
   - `simulation` → `digital-twin-gazebo-unity`
   - `isaac` → `ai-robot-brain-nvidia-isaac`
   - `humanoids` → `humanoid-robot-development`
   - `vla` → `vision-language-action-vla`
   - `conversational` → `conversational-robotics`
   - `capstone` → `capstone-autonomous-humanoid`
   - `hardware` → `hardware-requirements`

2. **Update Governance Section**: 
   - Bump Version to 1.1.0.
   - Update "Last Amended" date to today.
   - Note this as a "Minor Revision" in the change log.

Keep all other sections unchanged. Output the fully updated text of Section 12 and the Governance/Header section only.

## Response snapshot

Amended constitution to v1.1.0.

## Outcome

- ✅ Impact: Constitution updated with new folder naming and governance.
- 🧪 Tests: N/A
- 📁 Files: constitution.md
- 🔁 Next prompts: Commit changes.
- 🧠 Reflection: Successfully applied specific amendments and updated versioning.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): default
- Next experiment (smallest change to try): None
