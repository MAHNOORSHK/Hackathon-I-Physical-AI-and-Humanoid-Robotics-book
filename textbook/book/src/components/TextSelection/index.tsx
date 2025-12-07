import React, { useEffect, useState } from 'react';

interface TextSelectionProps {
  onSelectText: (selectedText: string) => void;
}

const TextSelection: React.FC<TextSelectionProps> = ({ onSelectText }) => {
  const [selection, setSelection] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  const handleSelection = () => {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText && selectedText.length > 0) {
      setSelection(selectedText);
      const range = window.getSelection()?.getRangeAt(0);
      if (range) {
        const rect = range.getBoundingClientRect();
        setPosition({
          x: rect.right + window.scrollX - 20, // Adjust position as needed
          y: rect.top + window.scrollY - 50, // Adjust position as needed
        });
      }
    } else {
      setSelection(null);
      setPosition(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  if (!selection || !position) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        background: '#333',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 1000,
      }}
      onClick={() => {
        onSelectText(selection);
        setSelection(null); // Clear selection after action
      }}
    >
      Ask Chatbot
    </div>
  );
};

export default TextSelection;
