import React, { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Investigator');
  const [error, setError] = useState('');
  const [pwdStrength, setPwdStrength] = useState(0);

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
      minHeight: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'hsl(var(--bg-primary))',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '450px',
        width: '100%',
        padding: '2.5rem 2rem',
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
          margin: '0 auto 1.5rem',
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

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
          SCRB Intelligence Portal
        </h2>
        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.875rem', marginBottom: '2rem' }}>
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
            marginBottom: '1.5rem'
          }}>
            <strong>Access Denied:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.25rem' }}>
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

          <div style={{ marginBottom: '1.25rem' }}>
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

          <div style={{ marginBottom: '2rem' }}>
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

        <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
          This system is subject to monitoring. Unauthorized access attempts will be audited under IPC Sec 43/66. 
          <br /><strong style={{ color: 'hsl(var(--color-amber))' }}>TODO(security):</strong> Replace with actual multi-factor authentication (MFA) and OAuth provider.
        </div>
      </div>
    </div>
  );
}
