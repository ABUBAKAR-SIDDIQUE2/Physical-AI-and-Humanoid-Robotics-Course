# Data Model

## 1. User (Better Auth)
The `User` table is managed by Better Auth but extended with our custom fields.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Unique ID (UUID) |
| `email` | String | Yes | User's email |
| `name` | String | Yes | Display name |
| `emailVerified` | Boolean | Yes | Email verification status |
| `image` | String | No | Avatar URL |
| `createdAt` | Date | Yes | Creation timestamp |
| `updatedAt` | Date | Yes | Update timestamp |
| **`software_bg`** | Enum | No | "Beginner", "Intermediate", "Expert" |
| **`hardware_bg`** | Enum | No | "None", "Arduino", "PCB Design" |

## 2. Session (Better Auth)
Standard session management.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Session Token/ID |
| `userId` | String | FK to User |
| `expiresAt` | Date | Expiration time |
| `ipAddress` | String | IP (Optional) |
| `userAgent` | String | User Agent (Optional) |

## 3. ChatSession (Existing - Python)
This resides in Postgres (managed by Python). We need to link it to the Auth User ID.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Session ID |
| `user_id` | String | **New**: Store the Better Auth User ID here for history persistence. |
| `created_at` | DateTime | ... |

## 4. Validation Rules
- `software_bg`: Must be one of `['Beginner', 'Intermediate', 'Expert']`.
- `hardware_bg`: Must be one of `['None', 'Arduino', 'PCB Design']`.
