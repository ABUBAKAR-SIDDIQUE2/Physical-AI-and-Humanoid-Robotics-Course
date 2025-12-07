import { useState, useEffect, useCallback } from 'react';

export function useSelection() {
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setSelectedText(null);
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 0) {
      // Optional: Check if selection is inside the chat widget and ignore it
      // For now, we accept any selection, but the UI might show it differently
      setSelectedText(text);
    } else {
      setSelectedText(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleSelectionChange]);

  return selectedText;
}
