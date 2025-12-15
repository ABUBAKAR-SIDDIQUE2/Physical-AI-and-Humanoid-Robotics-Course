// ✅ CORRECT IMPORT: Use better-auth/react
import { createAuthClient } from "better-auth/react"; 
import siteConfig from '@generated/docusaurus.config';

const { PUBLIC_AUTH_URL } = siteConfig.customFields as { PUBLIC_AUTH_URL?: string };

export const authClient = createAuthClient({
  baseURL: PUBLIC_AUTH_URL || "http://localhost:3001",
});