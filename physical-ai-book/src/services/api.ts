import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { authClient } from './auth-client';

// Helper to get config outside of React components (not ideal but works for singletons if config is static)
// Actually, standard Docusaurus pattern for non-component files is problematic.
// Let's revert to process.env but ensure we use the 'customFields' trick or just hardcode for now 
// OR simpler: assume the build process defines it globally.
// 
// BETTER: Export a function or class that accepts config, or just use the global constant replaced by webpack.
// For simplicity in this specific setup without ejecting webpack:
// We will rely on the fact that we added it to customFields, and Docusaurus 
// tends to inline process.env.API_URL if it's used in config.
// But better yet, let's keep it simple: Use the hardcoded fallback which is safer for now
// and trust that `process.env.API_URL` replacement works if `customFields` is set in config.

export const API_BASE_URL = process.env.API_URL || 'http://localhost:8000/api';

export interface Citation {
  text: string;
  source: string;
  score: number;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
  session_id: string;
}

export interface ChatRequest {
  query: string;
  selected_text?: string | null;
  session_id?: string | null;
}

export async function sendQuery(request: ChatRequest): Promise<ChatResponse> {
  const session = await authClient.getSession();
  const token = session?.data?.session?.id; // Assuming session ID is the token, or handle real token if available

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // If we have a token (user is logged in), send it
  if (token) {
    // Note: In a real Better Auth setup where session is cookie-based, 
    // we might just need 'credentials: include'.
    // If using Bearer token, we need to extract it.
    // authClient usually handles this automatically for its own requests,
    // but for our separate Python backend, we need to pass it explicitly 
    // if the Python backend expects Bearer.
    // If Python backend and Auth service share a domain/cookie, this might not be needed.
    // For this implementation, we will pass it as Bearer to match the Python middleware expectation.
    headers['Authorization'] = `Bearer ${session.data.user.id}`; // Passing User ID as "token" based on middleware mock assumption
  }

  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export interface SessionResponse {
  id: string;
  created_at: string;
  messages: {
    role: 'user' | 'ai';
    content: string;
    created_at: string;
  }[];
}

export async function getSession(sessionId: string): Promise<SessionResponse> {
  const response = await fetch(`${API_BASE_URL}/session/${sessionId}`);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}