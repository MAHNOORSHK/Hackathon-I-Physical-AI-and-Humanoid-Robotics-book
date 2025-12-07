import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from '../css/auth.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';

export default function Login() {
  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = siteConfig.customFields?.apiBaseUrl || 'http://localhost:8000';
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2PasswordRequestForm expects 'username'
    formData.append('password', password);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Important for OAuth2PasswordRequestForm
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed.');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      alert('Login successful!');
      history.push('/'); // Redirect to home page or dashboard
    } catch (err: any) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login">
      <div className={styles.authContainer}>
        <div className={styles.authForm}>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            <button type="submit" className={styles.authButton} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
