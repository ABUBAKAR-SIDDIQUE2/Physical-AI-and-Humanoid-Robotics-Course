export const API_BASE_URL = 'http://localhost:8000/api';

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
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
