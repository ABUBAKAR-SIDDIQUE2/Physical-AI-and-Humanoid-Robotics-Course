# Data Model: Physical AI & Humanoid Robotics Textbook

**Feature**: `001-physical-ai-textbook`
**Date**: 2025-12-07

## Entities

### 1. Textbook Structure (FileSystem)
The core entity is the file system structure which maps directly to the Docusaurus content model.

| Field/Path | Type | Description |
|------------|------|-------------|
| `/docs/` | Directory | Root content directory. |
| `introduction-to-physical-ai/` | Directory | Chapter 1 content. |
| `robotic-nervous-system-ros2/` | Directory | Chapter 2 content. |
| `digital-twin-gazebo-unity/` | Directory | Chapter 3 content. |
| `ai-robot-brain-nvidia-isaac/` | Directory | Chapter 4 content. |
| `humanoid-robot-development/` | Directory | Chapter 5 content. |
| `vision-language-action-vla/` | Directory | Chapter 6 content. |
| `conversational-robotics/` | Directory | Chapter 7 content. |
| `capstone-autonomous-humanoid/` | Directory | Chapter 8 content. |
| `hardware-requirements/` | Directory | Appendix/Hardware content. |
| `index.mdx` | File | Overview file for each chapter. |
| `/static/img/diagrams/` | Directory | Storage for diagram assets. |
| `/examples/` | Directory | Storage for code example files. |

### 2. Chapter Metadata (Frontmatter)
Each `index.mdx` file represents a Chapter and must contain the following metadata.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Kebab-case identifier (e.g., `introduction-to-physical-ai`). Unique. |
| `title` | String | Display title of the chapter. |
| `sidebar_label` | String | Short label for sidebar navigation. |
| `sidebar_position` | Integer | 1-based index defining the order (1-9). |
| `description` | String | 1-2 sentence summary for SEO/preview. |
| `keywords` | Array<String> | SEO keywords. |

### 3. Configuration (Docusaurus)
Key configuration entities in `docusaurus.config.js`.

| Field | Type | Value/Constraint |
|-------|------|------------------|
| `title` | String | "Physical AI & Humanoid Robotics" |
| `url` | String | `https://<username>.github.io` |
| `baseUrl` | String | `/<repo-name>/` |
| `projectName` | String | Repository name |
| `organizationName` | String | GitHub username/org |
| `themeConfig.navbar` | Object | Standard navigation links. |
| `themeConfig.footer` | Object | Standard footer links. |

### 4. Sidebar Configuration
The `sidebars.js` entity explicitly defines the navigation order.

```javascript
// Logic structure
module.exports = {
  tutorialSidebar: [
    'introduction-to-physical-ai/index',
    'robotic-nervous-system-ros2/index',
    'digital-twin-gazebo-unity/index',
    'ai-robot-brain-nvidia-isaac/index',
    'humanoid-robot-development/index',
    'vision-language-action-vla/index',
    'conversational-robotics/index',
    'capstone-autonomous-humanoid/index',
    'hardware-requirements/index',
  ],
};
```

## Relationships

- **Chapter -> Topic**: One-to-Many (A chapter folder contains multiple `.md` or `.mdx` files).
- **Chapter -> Diagram**: Many-to-Many (Chapters reference diagrams in static assets).
- **Chapter -> Example**: Many-to-Many (Chapters reference code files in `/examples`).
