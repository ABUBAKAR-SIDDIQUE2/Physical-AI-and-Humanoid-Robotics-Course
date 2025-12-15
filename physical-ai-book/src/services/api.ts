import siteConfig from '@generated/docusaurus.config';
import { authClient } from './auth-client';

// Access config from the generated file since we are not in a React component
const { PUBLIC_API_URL } = siteConfig.customFields as { PUBLIC_API_URL?: string };

export const API_BASE_URL = PUBLIC_API_URL;

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

  const response = await fetch(`${API_BASE_URL}/api/query`, {
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