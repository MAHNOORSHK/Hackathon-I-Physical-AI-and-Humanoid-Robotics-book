import React, { useState, useEffect, useRef } from 'react';
import { HtmlClassNameProvider } from '@docusaurus/theme-common';
import { DocProvider } from '@docusaurus/plugin-content-docs/client';
import DocItemMetadata from '@theme-original/DocItem/Metadata';
import DocItemLayout from '@theme-original/DocItem/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation, useHistory } from '@docusaurus/router';

// Floating Action Buttons Styles
const floatingContainerStyle: React.CSSProperties = {
  position: 'fixed',
  right: '30px',
  bottom: '95px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  zIndex: 1000,
};

const floatingButtonStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
};

const tooltipStyle: React.CSSProperties = {
  position: 'absolute',
  right: '60px',
  backgroundColor: '#333',
  color: 'white',
  padding: '8px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  whiteSpace: 'nowrap',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  pointerEvents: 'none',
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '24px',
  maxWidth: '80%',
  maxHeight: '80vh',
  overflow: 'auto',
  position: 'relative',
  boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
};

// Floating Action Buttons Component
const FloatingActionButtons = ({ chapterPath }: { chapterPath: string }) => {
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState<string | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<string | null>(null);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl;
  const API_BASE_URL = siteConfig.customFields?.apiBaseUrl || 'http://localhost:8000';

  useEffect(() => {
    if (chapterPath) {
      const relativeDocPath = chapterPath.startsWith('/docs') ? chapterPath.substring(1) : chapterPath;
      const rawPath = `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/${relativeDocPath}.md`;
      fetch(rawPath)
        .then(res => res.ok ? res.text() : null)
        .then(content => setOriginalContent(content))
        .catch(() => setOriginalContent(null));
    }
  }, [chapterPath, baseUrl]);

  const handlePersonalize = async () => {
    if (!originalContent) {
      setError("Content not available");
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError("Please login first");
      return;
    }

    setIsPersonalizing(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/personalize/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: originalContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to personalize');
      }

      const data = await response.json();
      setPersonalizedContent(data.personalized_content);
      setShowPersonalizeModal(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPersonalizing(false);
    }
  };

  const handleTranslate = async () => {
    if (!originalContent) {
      setError("Content not available");
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      setError("Please login first");
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/translate/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: originalContent, target_language: "Urdu" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to translate');
      }

      const data = await response.json();
      setTranslatedContent(data.translated_content);
      setShowTranslateModal(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <>
      <div style={floatingContainerStyle}>
        {/* Personalize Button */}
        <div style={{ position: 'relative' }}>
          <div style={{ ...tooltipStyle, opacity: hoveredButton === 'personalize' ? 1 : 0 }}>
            Personalize Content
          </div>
          <button
            onClick={handlePersonalize}
            disabled={isPersonalizing}
            onMouseEnter={() => setHoveredButton('personalize')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              ...floatingButtonStyle,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transform: hoveredButton === 'personalize' ? 'scale(1.1)' : 'scale(1)',
            }}
            title="Personalize Content"
          >
            {isPersonalizing ? (
              <span style={{ fontSize: '20px' }}>...</span>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
          </button>
        </div>

        {/* Translate Button */}
        <div style={{ position: 'relative' }}>
          <div style={{ ...tooltipStyle, opacity: hoveredButton === 'translate' ? 1 : 0 }}>
            Translate to Urdu
          </div>
          <button
            onClick={handleTranslate}
            disabled={isTranslating}
            onMouseEnter={() => setHoveredButton('translate')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              ...floatingButtonStyle,
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              color: 'white',
              transform: hoveredButton === 'translate' ? 'scale(1.1)' : 'scale(1)',
            }}
            title="Translate to Urdu"
          >
            {isTranslating ? (
              <span style={{ fontSize: '20px' }}>...</span>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#dc3545',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 3000,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: '12px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Personalize Modal */}
      {showPersonalizeModal && personalizedContent && (
        <div style={modalOverlayStyle} onClick={() => setShowPersonalizeModal(false)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowPersonalizeModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              ×
            </button>
            <h2 style={{ marginTop: 0, color: '#667eea' }}>Personalized Content</h2>
            <div style={{ lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: personalizedContent.replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      )}

      {/* Translate Modal */}
      {showTranslateModal && translatedContent && (
        <div style={modalOverlayStyle} onClick={() => setShowTranslateModal(false)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowTranslateModal(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              ×
            </button>
            <h2 style={{ marginTop: 0, color: '#11998e' }}>Urdu Translation</h2>
            <div style={{ lineHeight: 1.8, direction: 'rtl', textAlign: 'right' }} dangerouslySetInnerHTML={{ __html: translatedContent.replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      )}
    </>
  );
};


// Auth Protection Component
const AuthProtection = ({ children, pageTitle, pagePath }: { children: React.ReactNode, pageTitle: string, pagePath: string }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = siteConfig.customFields?.apiBaseUrl || 'http://localhost:8000';

  const startTimeRef = useRef<number>(Date.now());
  const lastTrackRef = useRef<number>(Date.now());

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.ok) {
          setIsAuthenticated(true);
          trackReading(0);
        } else {
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    startTimeRef.current = Date.now();
    lastTrackRef.current = Date.now();

    const trackInterval = setInterval(() => {
      if (isAuthenticated) {
        const timeSpent = Math.floor((Date.now() - lastTrackRef.current) / 1000);
        trackReading(timeSpent);
        lastTrackRef.current = Date.now();
      }
    }, 30000);

    const handleBeforeUnload = () => {
      if (isAuthenticated) {
        const timeSpent = Math.floor((Date.now() - lastTrackRef.current) / 1000);
        trackReading(timeSpent);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(trackInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [API_BASE_URL, isAuthenticated]);

  const trackReading = async (timeSpentSeconds: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/api/v1/reading/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          page_path: pagePath,
          page_title: pageTitle,
          time_spent_seconds: timeSpentSeconds,
        }),
      });
    } catch (error) {
      console.error('Failed to track reading:', error);
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
      }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '500px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
          <h2 style={{ color: '#856404', marginBottom: '15px' }}>Login Required</h2>
          <p style={{ color: '#856404', marginBottom: '24px' }}>
            Please login or create an account to read the textbook content.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => history.push('/login')}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              Login
            </button>
            <button
              onClick={() => history.push('/signup')}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '500',
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};


export default function DocItem(props) {
  const docHtmlClassName = `docs-doc-id-${props.content.metadata.id}`;
  const MDXComponent = props.content;
  const location = useLocation();
  const chapterPath = location.pathname;
  const pageTitle = props.content.metadata.title || 'Unknown Page';

  return (
    <DocProvider content={props.content}>
      <HtmlClassNameProvider className={docHtmlClassName}>
        <DocItemMetadata />
        <AuthProtection pageTitle={pageTitle} pagePath={chapterPath}>
          <DocItemLayout>
            <MDXComponent />
          </DocItemLayout>
          <FloatingActionButtons chapterPath={chapterPath} />
        </AuthProtection>
      </HtmlClassNameProvider>
    </DocProvider>
  );
}
