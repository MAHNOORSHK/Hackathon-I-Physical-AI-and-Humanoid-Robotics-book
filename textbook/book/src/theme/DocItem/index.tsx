import React, { useState, useEffect } from 'react';
import { HtmlClassNameProvider } from '@docusaurus/theme-common';
import { DocProvider } from '@docusaurus/plugin-content-docs/client';
import DocItemMetadata from '@theme-original/DocItem/Metadata';
import DocItemLayout from '@theme-original/DocItem/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router'; // To get current page path

// Component for Personalization
const PersonalizationButton = ({ chapterPath }: { chapterPath: string }) => {
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;

  const fetchRawContent = async (path: string) => {
    const rawPath = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${path}.md`;
    try {
      const response = await fetch(rawPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch raw content from ${rawPath}`);
      }
      return await response.text();
    } catch (err) {
      console.error("Error fetching raw content:", err);
      setError("Could not fetch original chapter content for personalization.");
      return null;
    }
  };

  useEffect(() => {
    setPersonalizedContent(null);
    if (chapterPath) {
      const relativeDocPath = chapterPath.startsWith('/docs') ? chapterPath.substring(1) : chapterPath;
      fetchRawContent(relativeDocPath).then(content => {
        setOriginalContent(content);
      });
    }
  }, [chapterPath, baseUrl]);

  const handlePersonalize = async () => {
    setIsLoading(true);
    setError(null);
    setPersonalizedContent(null);
    
    if (!originalContent) {
      setError("Original content not available for personalization.");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("Please log in to personalize content.");
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/personalize/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: originalContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to personalize content.');
      }

      const data = await response.json();
      setPersonalizedContent(data.personalized_content);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during personalization.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!originalContent && !error) {
    return <p>Loading chapter content for personalization...</p>;
  }

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <button
        onClick={handlePersonalize}
        disabled={isLoading || !originalContent}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginRight: '10px'
        }}
      >
        {isLoading ? 'Personalizing...' : 'Personalize Content'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
      {personalizedContent && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <h3>Personalized Content:</h3>
          <div dangerouslySetInnerHTML={{ __html: personalizedContent }} />
          <button
            onClick={() => setPersonalizedContent(null)}
            style={{
              marginTop: '10px',
              padding: '8px 15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Show Original
          </button>
        </div>
      )}
    </div>
  );
};


// Component for Translation
const TranslationButton = ({ chapterPath }: { chapterPath: string }) => {
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;

  const fetchRawContent = async (path: string) => {
    const rawPath = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}${path}.md`;
    try {
      const response = await fetch(rawPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch raw content from ${rawPath}`);
      }
      return await response.text();
    } catch (err) {
      console.error("Error fetching raw content:", err);
      setError("Could not fetch original chapter content for translation.");
      return null;
    }
  };

  useEffect(() => {
    setTranslatedContent(null);
    if (chapterPath) {
      const relativeDocPath = chapterPath.startsWith('/docs') ? chapterPath.substring(1) : chapterPath;
      fetchRawContent(relativeDocPath).then(content => {
        setOriginalContent(content);
      });
    }
  }, [chapterPath, baseUrl]);

  const handleTranslate = async () => {
    setIsLoading(true);
    setError(null);
    setTranslatedContent(null);
    
    if (!originalContent) {
      setError("Original content not available for translation.");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("Please log in to translate content.");
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/v1/translate/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: originalContent,
          target_language: "Urdu" // Hardcoded as per spec
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to translate content.');
      }

      const data = await response.json();
      setTranslatedContent(data.translated_content);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during translation.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!originalContent && !error) {
    return <p>Loading chapter content for translation...</p>;
  }

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <button
        onClick={handleTranslate}
        disabled={isLoading || !originalContent}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745', // Green color for translate button
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          marginRight: '10px'
        }}
      >
        {isLoading ? 'Translating...' : 'Translate to Urdu'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
      {translatedContent && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          <h3>Translated Content (Urdu):</h3>
          <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
          <button
            onClick={() => setTranslatedContent(null)}
            style={{
              marginTop: '10px',
              padding: '8px 15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Show Original
          </button>
        </div>
      )}
    </div>
  );
};


export default function DocItem(props) {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;
  const location = useLocation(); // Hook to get current URL path

  // The path for the current chapter, e.g., /docs/intro
  const chapterPath = location.pathname;

  return (
    <DocProvider content={props.content}>
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata />
        <DocItemLayout>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {/* Render personalization button */}
            <PersonalizationButton chapterPath={chapterPath} />
            {/* Render translation button */}
            <TranslationButton chapterPath={chapterPath} />
          </div>
          {/* Render the actual chapter content. */}
          <MDXComponent />
        </DocItemLayout>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}