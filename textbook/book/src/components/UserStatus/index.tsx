import React, { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

interface UserInfo {
  email: string;
  is_active: boolean;
}

export default function UserStatus(): JSX.Element | null {
  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = siteConfig.customFields?.apiBaseUrl || 'http://localhost:8000';

  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to show/hide login/signup links
  const updateAuthLinks = (isLoggedIn: boolean) => {
    if (typeof document !== 'undefined') {
      const loginLinks = document.querySelectorAll('.navbar-login-link');
      const signupLinks = document.querySelectorAll('.navbar-signup-link');

      loginLinks.forEach(link => {
        (link as HTMLElement).style.display = isLoggedIn ? 'none' : '';
      });
      signupLinks.forEach(link => {
        (link as HTMLElement).style.display = isLoggedIn ? 'none' : '';
      });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setLoading(false);
        updateAuthLinks(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          updateAuthLinks(true);
        } else {
          // Token invalid, remove it
          localStorage.removeItem('access_token');
          updateAuthLinks(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        updateAuthLinks(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (login/logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab login/logout
    const handleAuthChange = () => checkAuth();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [API_BASE_URL]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    updateAuthLinks(false);
    window.dispatchEvent(new Event('authChange'));
    window.location.href = '/';
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return null; // Show nothing - Login/Signup buttons are already in navbar config
  }

  return (
    <div className={styles.userStatus}>
      <div className={styles.userInfo}>
        <span className={styles.userEmail}>{user.email}</span>
      </div>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}
