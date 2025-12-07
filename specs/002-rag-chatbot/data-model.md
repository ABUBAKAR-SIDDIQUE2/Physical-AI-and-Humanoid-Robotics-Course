# Data Model: RAG Chatbot

## Database Schema (Postgres/Neon)

### Table: `sessions`
Tracks user conversation sessions.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: `gen_random_uuid()` | Unique Session ID |
| `user_id` | VARCHAR(255) | Index | Anonymous user ID (fingerprint) or Auth ID |
| `created_at` | TIMESTAMPTZ | Default: `now()` | |
| `metadata` | JSONB | | Browser info, referrer |

### Table: `messages`
Stores the actual chat history.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PK, Default: `gen_random_uuid()` | Unique Message ID |
| `session_id` | UUID | FK -> `sessions.id` | |
| `role` | VARCHAR(50) | `user` \| `assistant` | |
| `content` | TEXT | Not Null | The message text |
| `sources` | JSONB | | Array of source chunks used (for citations) |
| `created_at` | TIMESTAMPTZ | Default: `now()` | |

## Vector Schema (Qdrant)

### Collection: `physical_ai_book`
- **Vector Size**: 1536 (OpenAI) or 768 (Gemini)
- **Distance**: Cosine

### Payload (Metadata)
| Field | Type | Description |
| :--- | :--- | :--- |
| `source_doc` | Keyword | Filename (e.g., `01-introduction.md`) |
| `chapter` | Keyword | Chapter Title |
| `chunk_id` | Integer | Sequential ID within doc |
| `text` | Text | The actual chunk content |
| `url_slug` | Keyword | Docusaurus slug (e.g., `/docs/introduction`) |
| `char_start`| Integer | Start index in source file |
| `char_end`  | Integer | End index in source file |