import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from '../css/auth.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useHistory } from '@docusaurus/router';

export default function Signup() {
  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = siteConfig.customFields?.apiBaseUrl || 'http://localhost:8000';
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [softwareBackground, setSoftwareBackground] = useState('beginner');
  const [hardwareBackground, setHardwareBackground] = useState('no_rtx');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          software_background: softwareBackground,
          hardware_background: hardwareBackground,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed.');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access_token);
      alert('Registration successful! You are now logged in.');
      history.push('/'); // Redirect to home page or dashboard
    } catch (err: any) {
      setError(err.message);
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Signup">
      <div className={styles.authContainer}>
        <div className={styles.authForm}>
          <h2>Create an Account</h2>
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
            <div className={styles.formGroup}>
              <label htmlFor="software-background">Software Background</label>
              <select
                id="software-background"
                name="software-background"
                value={softwareBackground}
                onChange={(e) => setSoftwareBackground(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="none">None</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="hardware-background">Hardware Access</label>
              <select
                id="hardware-background"
                name="hardware-background"
                value={hardwareBackground}
                onChange={(e) => setHardwareBackground(e.target.value)}
              >
                <option value="no_rtx">Standard Laptop/PC (No NVIDIA RTX GPU)</option>
                <option value="rtx_workstation">Workstation with NVIDIA RTX GPU</option>
                <option value="jetson_kit">I have a Jetson Kit</option>
                <option value="full_robot_lab">Access to a robotics lab</option>
                <option value="none">None</option>
              </select>
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            <button type="submit" className={styles.authButton} disabled={loading}>
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
