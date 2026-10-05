import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
  );
}

/** Tab IDs */
const TABS = [
  { id: 'donor', label: ' Donor', subtitle: 'Sign in to your giving account' },
  { id: 'orphanage', label: '? Orphanage', subtitle: 'Orphanage / NGO portal access' },
  { id: 'admin', label: '? Admin', subtitle: 'Staff-only secure access' },
];

export function Login() {
  const [activeTab, setActiveTab] = useState('donor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signInWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const currentTab = TABS.find((t) => t.id === activeTab);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
  };

  const handleTabSwitch = (tabId) => {
    setActiveTab(tabId);
    resetForm();
    // Admin tab → redirect to dedicated admin login
    if (tabId === 'admin') {
      navigate('/admin/login');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter your email address and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithPassword(email.trim(), password);
      // PublicOnlyLayout will automatically re-render and route the user
      // to their respective dashboard based on their profile.role.
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials')) {
        setErrorMsg('Incorrect email or password. Please try again.');
      } else if (msg.includes('Email not confirmed')) {
        setErrorMsg('Your email address has not been confirmed yet. Please check your inbox for the confirmation link.');
      } else {
        setErrorMsg(msg || 'Sign in failed. Please check your credentials and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setErrorMsg('');
      await signInWithGoogle();
    } catch (err) {
      setErrorMsg(err.message || 'Could not start Google sign-in. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '460px' }}>
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-logo" aria-hidden="true">??</div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">{currentTab.subtitle}</p>
        </div>

        {/* Role Tabs */}
        <div className="login-tabs" role="tablist" aria-label="Login type">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`login-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => handleTabSwitch(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div className="alert alert-error mb-md" role="alert">{errorMsg}</div>
        )}

        {/* Donor tab — Google + email */}
        {activeTab === 'donor' && (
          <>
            <button type="button" onClick={handleGoogle} className="btn-google mb-md">
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="divider mb-md">
              <span>or sign in with email</span>
            </div>
          </>
        )}

        {/* Orphanage tab — info note */}
        {activeTab === 'orphanage' && (
          <div
            style={{
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-100)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              fontSize: '0.82rem',
              color: 'var(--primary-700)',
              marginBottom: '1.25rem',
              lineHeight: '1.5',
            }}
          >
            Use the email you registered your orphanage with. If you haven't registered yet,{' '}
            <Link to="/orphanage/register" style={{ fontWeight: 700 }}>
              register your orphanage here →
            </Link>
          </div>
        )}

        {/* Shared email/password form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="login-password" className="form-label">Password</label>
              {activeTab === 'donor' && (
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: 500 }}
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <input
              id="login-password"
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : `Sign in${activeTab === 'orphanage' ? ' to Orphanage Portal' : ''}`}
          </button>
        </form>

        <div className="auth-footer">
          {activeTab === 'orphanage' ? (
            <>
              Not registered yet?{' '}
              <Link to="/orphanage/register">Register your orphanage</Link>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <Link to="/signup">Create one — it's free</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
