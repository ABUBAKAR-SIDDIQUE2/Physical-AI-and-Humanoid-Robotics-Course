import { createAuthClient } from "better-auth/react";
import siteConfig from '@generated/docusaurus.config';

const { AUTH_URL } = siteConfig.customFields as { AUTH_URL?: string };

export const authClient = createAuthClient({
  baseURL: AUTH_URL || "http://localhost:4000", // Fallback to local auth default
});
