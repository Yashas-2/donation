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

export function Signup() {
  const [accountType, setAccountType] = useState('donor'); // 'donor' | 'orphanage'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) { setErrorMsg('Please enter your full name.'); return; }
    if (!email.trim()) { setErrorMsg('Please enter your email address.'); return; }
    if (password.length < 6) { setErrorMsg('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setErrorMsg('Passwords do not match.'); return; }

    try {
      setIsSubmitting(true);
      const res = await signUp(email.trim(), password, fullName.trim(), accountType);

      if (res?.user && !res?.session) {
        setSuccessMsg(
          accountType === 'orphanage'
            ? 'Account created successfully! Please check your email inbox to confirm your account. Once confirmed, sign in to complete your orphanage registration.'
            : 'Account created successfully! Please check your email inbox to confirm your account, then sign in.'
        );
      } else if (accountType === 'orphanage') {
        navigate('/orphanage/register');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setErrorMsg('');
      await signInWithGoogle();
    } catch (err) {
      setErrorMsg(err.message || 'Could not start Google sign-up. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: '460px' }}>
        <div className="auth-brand">
          <div className="auth-brand-logo" aria-hidden="true">??</div>
          <h1 className="auth-title">Join Srinivasam</h1>
          <p className="auth-subtitle">Start making a meaningful difference today</p>
        </div>

        {/* Account type selector */}
        <div className="signup-type-selector">
          <button
            type="button"
            className={`signup-type-btn${accountType === 'donor' ? ' active' : ''}`}
            onClick={() => setAccountType('donor')}
          >
            <span className="signup-type-icon"></span>
            <span className="signup-type-label">I'm a Donor</span>
            <span className="signup-type-desc">Support causes &amp; orphanages</span>
          </button>
          <button
            type="button"
            className={`signup-type-btn${accountType === 'orphanage' ? ' active' : ''}`}
            onClick={() => setAccountType('orphanage')}
          >
            <span className="signup-type-icon">?</span>
            <span className="signup-type-label">I'm an Orphanage</span>
            <span className="signup-type-desc">Register your NGO / Home</span>
          </button>
        </div>

        {/* Orphanage info hint */}
        {accountType === 'orphanage' && (
          <div
            style={{
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-100)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              fontSize: '0.82rem',
              color: 'var(--primary-700)',
              marginBottom: '1.25rem',
              lineHeight: '1.6',
            }}
          >
            Create an account below. After signing up you'll be taken to the{' '}
            <strong>orphanage registration form</strong> to complete your NGO profile and
            submit documents for verification.
          </div>
        )}

        {errorMsg && <div className="alert alert-error mb-md" role="alert">{errorMsg}</div>}
        {successMsg && <div className="alert alert-success mb-md" role="status">{successMsg}</div>}

        {!successMsg && (
          <>
            {accountType === 'donor' && (
              <>
                <button type="button" onClick={handleGoogle} className="btn-google mb-md">
                  <GoogleIcon />
                  Continue with Google
                </button>
                <div className="divider mb-md">
                  <span>or register with email</span>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="form-group">
                <label htmlFor="signup-name" className="form-label">
                  {accountType === 'orphanage' ? 'Contact Person Name' : 'Full name'}
                </label>
                <input
                  id="signup-name"
                  type="text"
                  className="form-input"
                  placeholder={accountType === 'orphanage' ? 'e.g. Ramesh Kumar (Manager)' : 'e.g. Shobhitha Sharma'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email" className="form-label">
                  {accountType === 'orphanage' ? 'Official Email Address' : 'Email address'}
                </label>
                <input
                  id="signup-email"
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
                <label htmlFor="signup-password" className="form-label">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  className="form-input"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm" className="form-label">Confirm password</label>
                <input
                  id="signup-confirm"
                  type="password"
                  className="form-input"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Creating account…'
                  : accountType === 'orphanage'
                    ? 'Create Account & Register NGO →'
                    : 'Create account'}
              </button>
            </form>
          </>
        )}

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
