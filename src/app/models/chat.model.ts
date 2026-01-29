export interface ChatRequest {
  message: string;
  history?: ChatHistoryItem[];
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  toolsUsed?: string[];
  timestamp: Date;
}

export interface ChatMessage {
  id: number;
  type: 'user' | 'assistant';
  content: string;
  time: string;
  toolsUsed?: string[];
}
