import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardPanel from './components/DashboardPanel';
import GISMapPanel from './components/GISMapPanel';
import ChatbotPanel from './components/ChatbotPanel';
import NetworkPanel from './components/NetworkPanel';
import AuditPanel from './components/AuditPanel';
import { auditTrail } from './data/mockData';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [logs, setLogs] = useState(auditTrail);
  const [isLocked, setIsLocked] = useState(false);
  const [sessionTime, setSessionTime] = useState(1800); // 30 minutes in seconds
  const [unlockPassword, setUnlockPassword] = useState('');
  const [lockError, setLockError] = useState('');

  // Session timer countdown effect
  useEffect(() => {
    if (!user || isLocked) return;

    const timer = setInterval(() => {
      setSessionTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsLocked(true); // Lock screen when session expires
          addAuditLog("Session auto-locked due to inactivity timeout");
          return 1800;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, isLocked]);

  const handleLogin = (authenticatedUser) => {
    setUser(authenticatedUser);
    setSessionTime(1800); // Reset timer on login
    setIsLocked(false);
    
    // Add audit log for login
    const newLog = {
      id: `a_${Date.now()}`,
      user: authenticatedUser.username,
      role: authenticatedUser.role,
      action: 'User authenticated successfully (Session Opened)',
      ip: '10.140.24.89',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    if (user) {
      addAuditLog("User logged out session successfully");
    }
    setUser(null);
    setIsLocked(false);
    setSessionTime(1800);
    setCurrentTab('dashboard');
  };

  const addAuditLog = (actionDescription) => {
    // Fallback if user is null during auto-lock trigger
    const username = user ? user.username : 'SYSTEM';
    const role = user ? user.role : 'SystemDaemon';

    const newLog = {
      id: `a_${Date.now()}`,
      user: username,
      role: role,
      action: actionDescription,
      ip: '10.140.24.89',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (unlockPassword.length >= 8) {
      setIsLocked(false);
      setSessionTime(1800); // Reset timer
      setUnlockPassword('');
      setLockError('');
      addAuditLog("Session unlocked via password verification");
    } else {
      setLockError("Invalid credentials. Please enter your 8+ character password.");
    }
  };

  const onNavigateToTab = (tabId) => {
    setCurrentTab(tabId);
    addAuditLog(`Navigated to dashboard shortcut: ${tabId}`);
  };

  // Secure Lock Screen view
  if (user && isLocked) {
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
        <div className="glass-panel animate-pulse-border" style={{
          maxWidth: '420px',
          width: '100%',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          border: '1px solid hsla(var(--color-rose), 0.3)',
          boxShadow: 'var(--shadow-glow-rose)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'hsla(var(--color-rose), 0.1)',
            color: 'hsl(var(--color-rose))',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 'bold',
            boxShadow: '0 0 15px hsla(var(--color-rose), 0.2)'
          }}>
            🔒
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Terminal Locked
          </h2>
          <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Officer: <strong>{user.username}</strong> ({user.role}) <br/>
            Enter your credentials to resume session.
          </p>

          {lockError && (
            <div style={{
              background: 'hsla(var(--color-rose), 0.15)',
              border: '1px solid hsla(var(--color-rose), 0.3)',
              color: 'hsl(var(--color-rose))',
              padding: '0.6rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.78rem',
              textAlign: 'left',
              marginBottom: '1rem'
            }}>
              {lockError}
            </div>
          )}

          <form onSubmit={handleUnlock} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                className="input-control"
                placeholder="Enter password..."
                value={unlockPassword}
                onChange={(e) => setUnlockPassword(e.target.value)}
                style={{ width: '100%' }}
                required
                autoFocus
              />
            </div>

            <button type="submit" className="btn btn-danger" style={{ width: '100%' }}>
              Unlock Secure Session
            </button>
          </form>

          <button 
            onClick={handleLogout} 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.5rem' }}
          >
            Switch User Account
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      {/* Navigation sidebar */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        user={user} 
        onLogout={handleLogout} 
        sessionTime={sessionTime}
        onLock={() => {
          setIsLocked(true);
          addAuditLog("Session locked manually by investigator");
        }}
      />

      {/* Main content body */}
      <main className="main-content">
        
        {/* Navigation router views */}
        {currentTab === 'dashboard' && (
          <DashboardPanel onNavigateToTab={onNavigateToTab} />
        )}
        
        {currentTab === 'gis' && (
          <GISMapPanel addAuditLog={addAuditLog} />
        )}
        
        {currentTab === 'chatbot' && (
          <ChatbotPanel user={user} addAuditLog={addAuditLog} />
        )}
        
        {currentTab === 'network' && (
          <NetworkPanel addAuditLog={addAuditLog} />
        )}
        
        {currentTab === 'audit' && (
          <AuditPanel logs={logs} addAuditLog={addAuditLog} setLogs={setLogs} />
        )}

      </main>
    </div>
  );
}
