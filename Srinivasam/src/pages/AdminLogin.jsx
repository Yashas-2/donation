import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Hardcoded admin credentials (frontend-gated; replace with backend auth for production)
const ADMIN_EMAIL = 'admin@srinivasam.org';
const ADMIN_PASSWORD = 'Admin@2026!';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail(ADMIN_EMAIL);
    setPassword(ADMIN_PASSWORD);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter admin email and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (
        email.trim().toLowerCase() === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {
        sessionStorage.setItem('srinivasam_admin', 'true');
        navigate('/admin/dashboard');
      } else {
        setErrorMsg('Invalid admin credentials. Please try again.');
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-brand">
          <div
            className="auth-brand-logo"
            style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}
            aria-hidden="true"
          >
            ?
          </div>
          <h1 className="auth-title">Admin Portal</h1>
          <p className="auth-subtitle">Secure Access — Srinivasam Operations Staff</p>
        </div>

        {/* Info badge with quick fill */}
        <div
          style={{
            background: 'var(--primary-50)',
            border: '1px solid var(--primary-100)',
            borderRadius: '12px',
            padding: '1rem',
            fontSize: '0.85rem',
            color: 'var(--primary-700)',
            marginBottom: '1.5rem',
            lineHeight: '1.5',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div>
            <strong>Demo Admin Account</strong><br />
            Email: <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>admin@srinivasam.org</code><br />
            Password: <code style={{ background: 'white', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>Admin@2026!</code>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-xs btn-outline"
            style={{ alignSelf: 'flex-start', marginTop: '0.25rem', background: 'white' }}
          >
             Auto-Fill Credentials
          </button>
        </div>

        {errorMsg && (
          <div className="alert alert-error mb-md" role="alert">{errorMsg}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="admin-email" className="form-label">Admin Email</label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              placeholder="admin@srinivasam.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password" className="form-label">Password</label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            style={{ background: '#0f172a', borderColor: '#0f172a' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying Credentials…' : '? Access Admin Dashboard'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
          <Link to="/login">📍 Back to Donor Sign In</Link>
        </div>
      </div>
    </div>
  );
}
