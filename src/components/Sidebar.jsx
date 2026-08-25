import React from 'react';

// Custom SVG Icons
const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
);

const IconMap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
);

const IconChat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

const IconNetwork = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><circle cx="6" cy="18" r="3"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="6" y1="9" x2="6" y2="15"/><line x1="18" y1="9" x2="18" y2="15"/></svg>
);

const IconAudit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

export default function Sidebar({ currentTab, setCurrentTab, user, onLogout, sessionTime, onLock }) {
  
  // Format MM:SS helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard />, roles: ['Investigator', 'Analyst', 'Supervisor / Policymaker', 'Administrator'] },
    { id: 'gis', label: 'GIS & Hotspots', icon: <IconMap />, roles: ['Analyst', 'Supervisor / Policymaker', 'Administrator'] },
    { id: 'chatbot', label: 'Conversational AI', icon: <IconChat />, roles: ['Investigator', 'Analyst', 'Supervisor / Policymaker', 'Administrator'] },
    { id: 'network', label: 'Criminal Network', icon: <IconNetwork />, roles: ['Investigator', 'Analyst', 'Supervisor / Policymaker', 'Administrator'] },
    { id: 'audit', label: 'Audit Logs', icon: <IconAudit />, roles: ['Supervisor / Policymaker', 'Administrator'] }
  ];

  const getRoleBadgeClass = (role) => {
    if (role === 'Administrator') return 'rose';
    if (role === 'Supervisor / Policymaker') return 'cyan';
    if (role === 'Analyst') return 'amber';
    return 'indigo';
  };

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      background: 'hsl(var(--bg-secondary))',
      borderRight: '1px solid hsl(var(--border-color))',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem',
      zIndex: 100
    }}>
      <div>
        {/* Brand Identity */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid hsl(var(--border-color))'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, hsl(var(--color-indigo)), hsl(var(--color-teal)))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '14px',
            color: 'white'
          }}>
            KSP
          </div>
          <div>
            <h2 style={{ fontSize: '0.95rem', fontWeight: 'bold', lineHeight: '1.1' }}>
              SCRB Nexus
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>
              Crime Intelligence
            </span>
          </div>
        </div>

        {/* Security Session Timer Widget */}
        <div style={{
          background: 'rgba(5, 8, 15, 0.4)',
          border: '1px solid hsl(var(--border-color))',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.7rem' }}>
            <span style={{ color: 'hsl(var(--text-muted))', display: 'block', fontSize: '0.65rem' }}>Session Limit</span>
            <strong style={{ fontFamily: 'monospace', color: sessionTime < 180 ? 'hsl(var(--color-rose))' : 'white', fontSize: '0.85rem' }}>
              {formatTime(sessionTime)}
            </strong>
          </div>

          <button
            onClick={onLock}
            className="btn btn-secondary btn-icon"
            style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid hsl(var(--border-color))' }}
            title="Lock terminal screen immediately"
          >
            <IconLock />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {menuItems.map((item) => {
            const hasAccess = item.roles.includes(user.role);
            if (!hasAccess) return null;

            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: isActive ? 'hsla(var(--color-indigo), 0.15)' : 'transparent',
                  color: isActive ? 'hsl(var(--text-primary))' : 'hsl(var(--text-secondary))',
                  cursor: 'pointer',
                  fontWeight: isActive ? '600' : '400',
                  textAlign: 'left',
                  borderLeft: isActive ? '3px solid hsl(var(--color-indigo))' : '3px solid transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span style={{ color: isActive ? 'hsl(var(--color-indigo))' : 'inherit', display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile & Logout */}
      <div style={{
        borderTop: '1px solid hsl(var(--border-color))',
        paddingTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || user.username} 
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid hsl(var(--color-indigo))', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'hsl(var(--bg-card-hover))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'hsl(var(--color-indigo))',
              fontSize: '0.9rem'
            }}>
              {user.displayName ? user.displayName[0].toUpperCase() : (user.username ? user.username[0].toUpperCase() : 'O')}
            </div>
          )}
          <div style={{ overflow: 'hidden' }}>
            <h4 style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }} title={user.displayName || user.username}>
              {user.displayName || user.username}
            </h4>
            <span 
              className={`badge badge-${getRoleBadgeClass(user.role)}`}
              style={{ padding: '0px 6px', fontSize: '0.6rem', marginTop: '2px' }}
            >
              {user.role}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            width: '100%',
            padding: '0.5rem',
            background: 'hsla(var(--color-rose), 0.1)',
            color: 'hsl(var(--color-rose))',
            border: '1px solid hsla(var(--color-rose), 0.2)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: '600',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'hsl(var(--color-rose))';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'hsla(var(--color-rose), 0.1)';
            e.currentTarget.style.color = 'hsl(var(--color-rose))';
          }}
        >
          <IconLogout />
          Logout Session
        </button>
      </div>
    </aside>
  );
}
