# Research: Create Physical AI & Humanoid Robotics Textbook

**Feature**: `001-physical-ai-textbook`
**Date**: 2025-12-07

## Decision: Docusaurus v3

**Rationale**:
Docusaurus v3 is the current standard for documentation websites, offering improved performance (MDX v3), better build speeds, and a robust plugin ecosystem. It natively supports the "classic" preset required by the spec.

**Alternatives Considered**:
- **Docusaurus v2**: Older, less performant, but stable. v3 is backward compatible for most use cases and future-proofs the book.
- **MkDocs/Jekyll**: Simpler, but lacks the rich React component integration and specific ecosystem support (like easy Mermaid integration and versioning) that Docusaurus provides out of the box.

## Decision: MermaidJS for Diagrams

**Rationale**:
MermaidJS allows diagrams to be defined as code within Markdown, making them version-controllable, easy to edit, and consistent in style. Docusaurus has built-in support for Mermaid via the `@docusaurus/theme-mermaid` plugin.

**Alternatives Considered**:
- **Static Images (PNG/SVG)**: Harder to maintain and update. Accepted as a fallback for complex visuals but not preferred for architecture diagrams.

## Decision: GitHub Actions for Deployment

**Rationale**:
GitHub Actions offers a seamless CI/CD pipeline integrated directly into the repository. It can automatically build and deploy the Docusaurus site to the `gh-pages` branch upon push to `main`, ensuring the live site is always up-to-date.

**Alternatives Considered**:
- **Manual Deployment**: Prone to human error and becoming out-of-sync.
- **Netlify/Vercel**: Good options, but GitHub Pages is explicitly requested in the specification and keeps everything within the GitHub ecosystem.

## Decision: Spec-Kit Plus & Gemini CLI Workflow

**Rationale**:
This is a mandated requirement of the project. The workflow involves:
1.  **Spec Creation**: Using Spec-Kit to define the structure and requirements for each chapter.
2.  **Content Generation**: Using Gemini CLI to process these specs and the Constitution to generate the actual Markdown content.
This ensures all content is structurally consistent and adheres to the project's specific pedagogical and tone guidelines.
