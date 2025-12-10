import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatWidget.module.css';
import { sendQuery } from '../../services/api';

const { siteConfig } = useDocusaurusContext();
console.log("API URL (ChatPanel) =", siteConfig.customFields.PUBLIC_API_URL);
console.log("AUTH URL (ChatPanel) =", siteConfig.customFields.PUBLIC_AUTH_URL);

interface Message {
  role: 'user' | 'ai';
  content: string;
  citations?: any[];
}

interface ChatPanelProps {
  onClose: () => void;
  selectedText: string | null;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ onClose, selectedText }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendQuery({
        query: userMessage.content,
        selected_text: selectedText,
        session_id: sessionId
      });

      setSessionId(response.session_id);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: response.answer,
        citations: response.citations
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Sorry, I encountered an error.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.header}>
        <span>AI Assistant</span>
        <button className={styles.closeButton} onClick={onClose}>×</button>
      </div>
      
      <div className={styles.messages}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--ifm-color-emphasis-600)', marginTop: '20px' }}>
            Hello! Ask me anything about the book content.
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
            {msg.content}
            {msg.citations && msg.citations.length > 0 && (
               <div style={{ fontSize: '0.8em', marginTop: '8px', opacity: 0.8, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '4px' }}>
                 <strong>Sources:</strong>
                 <ul style={{ paddingLeft: '20px', margin: '4px 0' }}>
                   {msg.citations.map((c, i) => (
                     <li key={i}>{c.source}</li>
                   ))}
                 </ul>
               </div>
            )}
          </div>
        ))}
        {loading && <div className={`${styles.message} ${styles.aiMessage}`}>Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputArea} onSubmit={handleSubmit}>
        {selectedText && (
          <div className={styles.selectionPreview}>
            Selected: "{selectedText}"
          </div>
        )}
        <div className={styles.inputRow}>
            <input
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={selectedText ? "Ask about selection..." : "Ask a question..."}
            disabled={loading}
            />
            <button type="submit" className={styles.sendButton} disabled={loading || !input.trim()}>
            Send
            </button>
        </div>
      </form>
    </div>
  );
};
