import React, { useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Investigator');
  const [error, setError] = useState('');
  const [pwdStrength, setPwdStrength] = useState(0);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Logged in:", user.displayName, user.email, user.photoURL);
      
      onLogin({
        username: user.displayName || user.email.split('@')[0],
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: role, // Use selected role from dropdown
        token: `__Host-Session-OAuth-${Math.random().toString(36).substring(2)}`
      });
    } catch (err) {
      console.error("Login failed", err);
      setError(`Google Authentication failed: ${err.message}`);
    }
  };


  const checkPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setPwdStrength(score);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    checkPasswordStrength(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    setError('');
    // Simulate server response and credential verification
    onLogin({
      username: username.trim(),
      role: role,
      token: `__Host-Session-${Math.random().toString(36).substring(2)}` // Mocking secure Host- prefixed cookie
    });
  };

  return (
    <div className="login-wrapper" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'hsl(var(--bg-primary))',
      zIndex: 1000,
      overflowY: 'auto',
      padding: '2rem 1.5rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '450px',
        width: '100%',
        margin: 'auto',
        padding: '2rem 2rem',
        textAlign: 'center',
        border: '1px solid hsla(var(--color-indigo), 0.2)',
        boxShadow: 'var(--shadow-glow-indigo)'
      }}>
        {/* State emblem placeholder */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, hsl(var(--color-indigo)), hsl(var(--color-cyan)))',
          margin: '0 auto 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          boxShadow: '0 0 15px hsla(var(--color-indigo), 0.4)'
        }}>
          KSP
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          SCRB Intelligence Portal
        </h2>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Karnataka State Crime Records Bureau • Secure Login
        </p>

        {error && (
          <div style={{
            background: 'hsla(var(--color-rose), 0.15)',
            border: '1px solid hsla(var(--color-rose), 0.3)',
            color: 'hsl(var(--color-rose))',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            textAlign: 'left',
            marginBottom: '1rem'
          }}>
            <strong>Access Denied:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem', fontWeight: '500' }}>
              Officer Username / IP Number
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Patil_3840"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem', fontWeight: '500' }}>
              Security Password
            </label>
            <input
              type="password"
              className="input-control"
              placeholder="••••••••••••"
              value={password}
              onChange={handlePasswordChange}
              style={{ width: '100%', marginBottom: '0.5rem' }}
              required
            />
            {password.length > 0 && (
              <div>
                <div style={{ display: 'flex', gap: '4px', height: '4px', marginBottom: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      style={{
                        flex: 1,
                        borderRadius: '2px',
                        background: level <= pwdStrength 
                          ? pwdStrength <= 2 ? 'hsl(var(--color-rose))' : pwdStrength <= 4 ? 'hsl(var(--color-amber))' : 'hsl(var(--color-teal))' 
                          : 'hsla(var(--text-muted), 0.2)'
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
                  Password Strength: {pwdStrength <= 2 ? 'Weak' : pwdStrength <= 4 ? 'Moderate' : 'Strong (Recommended)'}
                </span>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginBottom: '0.5rem', fontWeight: '500' }}>
              Assigned Access Role
            </label>
            <select
              className="input-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', background: 'hsl(var(--bg-secondary))' }}
            >
              <option value="Investigator">Investigator (Conversational AI focus)</option>
              <option value="Analyst">Crime Analyst (Hotspots & Map focus)</option>
              <option value="Supervisor / Policymaker">Supervisor / Policymaker (Governance focus)</option>
              <option value="Administrator">Administrator (Audit logs & Security)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Authenticate Credentials
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', color: 'hsl(var(--text-muted))', fontSize: '0.8rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'hsla(var(--text-muted), 0.2)' }}></div>
          <span style={{ padding: '0 0.75rem' }}>OR SINGLE SIGN-ON</span>
          <div style={{ flex: 1, height: '1px', background: 'hsla(var(--text-muted), 0.2)' }}></div>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: 'transparent',
            border: '1px solid hsla(var(--text-muted), 0.3)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderColor = 'hsla(var(--color-indigo), 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'hsla(var(--text-muted), 0.3)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ display: 'block' }}>
            <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.47h4.84c-.21 1.12-.84 2.07-1.79 2.7v2.24h2.9c1.69-1.55 2.69-3.84 2.69-6.57z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.23l-2.9-2.24c-.8.54-1.84.87-3.06.87-2.35 0-4.34-1.59-5.05-3.73H.91v2.3C2.39 15.93 5.43 18 9 18z"/>
            <path fill="#FBBC05" d="M3.95 10.67a5.4 5.4 0 0 1 0-3.34V5.03H.91a8.99 8.99 0 0 0 0 7.94l3.04-2.3z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.47.87 11.43 0 9 0 5.43 0 2.39 2.07.91 5.03l3.04 2.3c.71-2.14 2.7-3.73 5.05-3.73z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
          This system is subject to monitoring. Unauthorized access attempts will be audited under IPC Sec 43/66. 
          <br /><strong style={{ color: 'hsl(var(--color-amber))' }}>Authentication System:</strong> Supports secure smart-card or Google Single Sign-on.
        </div>
      </div>
    </div>
  );
}

