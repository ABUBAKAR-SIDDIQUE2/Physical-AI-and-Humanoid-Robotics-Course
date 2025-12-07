import React, { useState } from 'react';
import { ChatPanel } from './ChatPanel';
import styles from './ChatWidget.module.css';
import { useSelection } from './useSelection';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const selectedText = useSelection();

  return (
    <>
      {!isOpen && (
        <button 
          className={styles.floatingButton} 
          onClick={() => setIsOpen(true)}
          title="Ask AI Assistant"
        >
          💬
        </button>
      )}
      
      {isOpen && (
        <ChatPanel 
          onClose={() => setIsOpen(false)} 
          selectedText={selectedText}
        />
      )}
    </>
  );
}
