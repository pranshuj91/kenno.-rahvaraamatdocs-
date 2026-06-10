import React, {useState} from 'react';
import styles from './styles.module.css';

const VALID_ID = 'admin';
const VALID_PASSWORD = '1712787@Gaincafe.Admin';
const AUTH_STORAGE_KEY = 'gaincafe-docs-authenticated';

export function isAuthenticated() {
  if (typeof window === 'undefined') {
    return false;
  }

  return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
}

export function setAuthenticated() {
  sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
}

export default function LoginGate({onSuccess}) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (userId === VALID_ID && password === VALID_PASSWORD) {
      setAuthenticated();
      onSuccess();
      return;
    }

    setError('Invalid ID or password. Please try again.');
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <img
          className={styles.logo}
          src="/img/logo-main-new-cvi.webp"
          alt="Gaincafe"
        />
        <h1 className={styles.title}>Documentation Access</h1>
        <p className={styles.subtitle}>Sign in to view the developer guide</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error ? <p className={styles.error}>{error}</p> : null}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-id">
              ID
            </label>
            <input
              id="login-id"
              className={styles.input}
              type="text"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className={styles.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
