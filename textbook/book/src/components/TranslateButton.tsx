import React, { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDoc } from '@docusaurus/theme-common/internal'; // Import useDoc

interface TranslateButtonProps {
  onTranslate: (translatedContent: string) => void;
}

const TranslateButton: React.FC<TranslateButtonProps> = ({ onTranslate }) => {
  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = siteConfig.customFields?.apiBaseUrl || 'http://localhost:8000';
  const { metadata } = useDoc(); // Get metadata from useDoc
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (metadata && metadata.source) {
        const filePath = metadata.source.replace('@site', ''); // Remove @site alias
        
        try {
          const response = await fetch(filePath); // Fetch the raw markdown file
          if (!response.ok) {
            throw new Error(`Failed to fetch original content: ${response.statusText}`);
          }
          const text = await response.text();
          setOriginalContent(text);
        } catch (err: any) {
          console.error("Error fetching original content for translation:", err);
          setError(`Failed to load content: ${err.message}`);
        }
      }
    };
    fetchContent();
  }, [metadata]);


  const handleTranslate = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please log in to translate content.');
      return;
    }

    if (!originalContent) {
      setError("Document content not available for translation.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/translate/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: originalContent, target_language: "Urdu" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to translate content.');
      }

      const data = await response.json();
      onTranslate(data.translated_content);
    } catch (err: any) {
      setError(err.message);
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!localStorage.getItem('access_token')) {
    return null; // Don't show button if not logged in
  }

  return (
    <div style={{ marginBottom: '20px', textAlign: 'right', marginLeft: '10px' }}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <button onClick={handleTranslate} disabled={loading} style={{
        padding: '10px 15px',
        backgroundColor: 'var(--ifm-color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}>
        {loading ? 'Translating...' : 'Translate to Urdu'}
      </button>
    </div>
  );
};

export default TranslateButton;
