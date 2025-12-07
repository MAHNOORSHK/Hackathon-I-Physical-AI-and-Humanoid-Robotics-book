import React, { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useDoc } from '@docusaurus/theme-common/internal'; // Import useDoc

interface PersonalizeButtonProps {
  onPersonalize: (personalizedContent: string) => void;
}

const PersonalizeButton: React.FC<PersonalizeButtonProps> = ({ onPersonalize }) => {
  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = siteConfig.customFields?.apiBaseUrl || 'http://localhost:8000';
  const { metadata } = useDoc(); // Get metadata from useDoc
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (metadata && metadata.source) {
        // Construct the path to the raw markdown file
        // metadata.source typically looks like '@site/docs/modules/module-1-ros2.md'
        // We need to fetch the raw file. This path is relative to the project root.
        // For Docusaurus dev server, files in `docs` folder are often directly accessible.
        // Let's assume a direct path for now. This might need adjustment based on deployment.
        const filePath = metadata.source.replace('@site', ''); // Remove @site alias
        
        try {
          const response = await fetch(filePath); // Fetch the raw markdown file
          if (!response.ok) {
            throw new Error(`Failed to fetch original content: ${response.statusText}`);
          }
          const text = await response.text();
          setOriginalContent(text);
        } catch (err: any) {
          console.error("Error fetching original content:", err);
          setError(`Failed to load content: ${err.message}`);
        }
      }
    };
    fetchContent();
  }, [metadata]);


  const handlePersonalize = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please log in to personalize content.');
      return;
    }

    if (!originalContent) {
      setError("Document content not available for personalization.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/personalize/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: originalContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to personalize content.');
      }

      const data = await response.json();
      onPersonalize(data.personalized_content);
    } catch (err: any) {
      setError(err.message);
      console.error('Personalization error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!localStorage.getItem('access_token')) {
    return null; // Don't show button if not logged in
  }

  return (
    <div style={{ marginBottom: '20px', textAlign: 'right' }}>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <button onClick={handlePersonalize} disabled={loading} style={{
        padding: '10px 15px',
        backgroundColor: 'var(--ifm-color-primary)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}>
        {loading ? 'Personalizing...' : 'Personalize Content'}
      </button>
    </div>
  );
};

export default PersonalizeButton;
