import { createAuthClient } from "better-auth/react";
import siteConfig from '@generated/docusaurus.config';

const { VITE_AUTH_URL } = siteConfig.customFields as { VITE_AUTH_URL?: string };

export const authClient = createAuthClient({
  baseURL: VITE_AUTH_URL || "http://localhost:4000", // Fallback to local auth default
});
