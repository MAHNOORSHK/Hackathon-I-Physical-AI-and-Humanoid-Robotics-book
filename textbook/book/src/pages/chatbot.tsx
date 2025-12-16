import React, { useState, useRef, useEffect, useCallback } from 'react';
import Layout from '@theme/Layout';
import styles from './chatbot.module.css'; // Will create this CSS module
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'; // Import useDocusaurusContext
import { useLocation } from '@docusaurus/router'; // Import useLocation

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotPage(): JSX.Element {
  const { siteConfig } = useDocusaurusContext(); // Get siteConfig from context
  const API_BASE_URL = siteConfig.customFields?.apiBaseUrl || 'http://localhost:8000'; // Access apiBaseUrl
  const location = useLocation(); // Get location object

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async (userQuery = input, context = '') => {
    if (userQuery.trim() === '' && context.trim() === '') return;

    const messageToSend = userQuery.trim();
    const userMessage: Message = { text: messageToSend, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput(''); // Clear input after sending

    setIsLoading(true);

    try {
      const token = localStorage.getItem('access_token');

      let endpoint = '';
      let body = {};

      if (context) {
        endpoint = `${API_BASE_URL}/api/v1/chat/query_context`;
        body = { query: messageToSend, context: context };
      } else {
        endpoint = `${API_BASE_URL}/api/v1/chat/query`;
        body = { query: messageToSend };
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add auth header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response from chatbot.');
      }

      const data = await response.json();
      const botMessage: Message = { text: data.response, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { text: `Error: ${error.message}`, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, input]); // Dependencies for useCallback

  // Handle contextual query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const context = params.get('context');
    if (context) {
      const query = `Explain this: "${context}"`;
      setInput(query);
      // Automatically send the query
      handleSendMessage(query, context); // Pass query and context
      // Clear the context from the URL to avoid re-triggering
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.search, handleSendMessage, setInput]); // Re-run when URL search changes and handleSendMessage changes (though it's stable)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendMessage(); // Call without arguments to use current input state
    }
  };

  return (
    <Layout title="Chatbot" description="Chat with the AI about the textbook content.">
      <div className={styles.chatbotContainer}>
        <h1>Textbook AI Chatbot</h1>
        <div className={styles.chatWindow}>
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
              {msg.text}
            </div>
          ))}
          {isLoading && (
            <div className={`${styles.message} ${styles.bot}`}>
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputArea}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the textbook..."
            disabled={isLoading}
          />
          <button onClick={() => handleSendMessage()} disabled={isLoading}> {/* Call with no args */}
            Send
          </button>
        </div>
      </div>
    </Layout>
  );
}
