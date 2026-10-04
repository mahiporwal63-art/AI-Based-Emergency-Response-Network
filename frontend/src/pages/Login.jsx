import { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

export default function Login({ requestedRole, onAuthenticated }) {
  const [role, setRole] = useState(requestedRole);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [officerInviteCode, setOfficerInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const credentials = { email, password, role };
      const auth = isRegistering
        ? await registerUser({
          ...credentials,
          ...(role === 'Control Officer'
            ? { officer_invite_code: officerInviteCode }
            : {}),
        })
        : await loginUser(credentials);
      onAuthenticated(auth);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  function changeMode(registering) {
    setError('');
    setIsRegistering(registering);
  }

  return (
    <main className="page-section narrow login-page">
      <div className="page-title">
        <span className="eyebrow">Secure account access</span>
        <h1>{isRegistering ? 'Create your account.' : 'Welcome back.'}</h1>
        <p>
          {isRegistering
            ? 'Choose the account type you need. Control Officer accounts require an invite code.'
            : 'Sign in to report an emergency or access the control room.'}
        </p>
      </div>
      <div className="auth-role-tabs" aria-label="Choose account type">
        {['Citizen', 'Control Officer'].map((option) => (
          <button
            className={role === option ? 'selected' : ''}
            type="button"
            onClick={() => {
              setRole(option);
              setError('');
            }}
            key={option}
          >
            {option}
          </button>
        ))}
      </div>
      <form className="panel login-card" onSubmit={submit}>
        <div className="form-intro">
          <span className="form-symbol" aria-hidden="true">{role === 'Citizen' ? 'C' : 'O'}</span>
          <div>
            <span className="eyebrow">{role} account</span>
            <h2>{isRegistering ? 'Register with email' : 'Sign in with email'}</h2>
          </div>
        </div>
        <label>
          Email address
          <input
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={10}
            maxLength={128}
            autoComplete={isRegistering ? 'new-password' : 'current-password'}
            placeholder={isRegistering ? 'At least 10 characters' : 'Your password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {isRegistering && <span className="field-hint">Use at least 10 characters.</span>}
        </label>
        {isRegistering && role === 'Control Officer' && (
          <label>
            Officer invite code
            <input
              type="password"
              required
              autoComplete="off"
              placeholder="Ask your system administrator"
              value={officerInviteCode}
              onChange={(event) => setOfficerInviteCode(event.target.value)}
            />
            <span className="field-hint">Officer registration is restricted to authorized invite codes.</span>
          </label>
        )}
        {error && <div className="error-box" role="alert">{error}</div>}
        <button className="primary-button submit-button" type="submit" disabled={loading}>
          {loading
            ? (isRegistering ? 'Creating account…' : 'Signing in…')
            : (isRegistering ? 'Create account' : `Sign in as ${role}`)}
          <span aria-hidden="true">→</span>
        </button>
        <div className="auth-switch">
          <span>{isRegistering ? 'Already registered?' : 'New to the network?'}</span>
          <button type="button" onClick={() => changeMode(!isRegistering)}>
            {isRegistering ? 'Sign in' : 'Create account'}
          </button>
        </div>
        <p className="small-note">Use a unique password. This prototype stores authentication data locally in this browser session.</p>
      </form>
    </main>
  );
}
