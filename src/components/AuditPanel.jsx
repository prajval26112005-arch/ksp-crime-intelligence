import React, { useState } from 'react';

// Custom SVG Icons
const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

const IconFileText = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

export default function AuditPanel({ logs, addAuditLog, setLogs }) {
  const [auditTab, setAuditTab] = useState("stream"); // "stream" | "governance" | "compliance"
  const [logFilter, setLogFilter] = useState("ALL"); // "ALL" | "AUTH" | "INVESTIGATION"
  
  // State for mock users in governance matrix
  const [officers, setOfficers] = useState([
    { username: "Investigator Patil", role: "Investigator", department: "Jayanagar District Division", status: "Active", clearance: "Tier-2 Clearance" },
    { username: "Analyst Gowda", role: "Analyst", department: "State Data Telemetry Center", status: "Active", clearance: "Tier-3 Clearance" },
    { username: "Admin Kumar", role: "Administrator", department: "System Integrity Bureau", status: "Active", clearance: "Tier-5 Clearance" },
    { username: "Special Officer Roy", role: "Investigator", department: "CCB Crime Branch", status: "Suspended", clearance: "Tier-2 Clearance" },
    { username: "Supervisor Ramya", role: "Supervisor / Policymaker", department: "SCRB Headquarters", status: "Active", clearance: "Tier-4 Clearance" }
  ]);

  const handleToggleStatus = (username) => {
    let targetStatus = 'Active';
    setOfficers(prev => prev.map(off => {
      if (off.username === username) {
        targetStatus = off.status === 'Active' ? 'Suspended' : 'Active';
        return { ...off, status: targetStatus };
      }
      return off;
    }));
    addAuditLog(`Security Governance: Modified access credentials for ${username} to [${targetStatus}]`);
  };

  const handleChangeRole = (username, newRole) => {
    setOfficers(prev => prev.map(off => {
      if (off.username === username) {
        const clearanceLevel = newRole === 'Administrator' ? 'Tier-5 Clearance' : newRole === 'Supervisor / Policymaker' ? 'Tier-4 Clearance' : newRole === 'Analyst' ? 'Tier-3 Clearance' : 'Tier-2 Clearance';
        return { ...off, role: newRole, clearance: clearanceLevel };
      }
      return off;
    }));
    addAuditLog(`Security Governance: Elevated role clearance of ${username} to [${newRole}]`);
  };

  // Filter logs based on category
  const filteredLogs = logs.filter(log => {
    if (logFilter === "ALL") return true;
    if (logFilter === "AUTH") {
      return log.action.toLowerCase().includes("auth") || log.action.toLowerCase().includes("session") || log.action.toLowerCase().includes("lock");
    }
    // Otherwise filter investigation queries and patrol dispatches
    return log.action.toLowerCase().includes("query") || log.action.toLowerCase().includes("patrol") || log.action.toLowerCase().includes("dossier") || log.action.toLowerCase().includes("shortcut");
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header Info */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.5rem', borderLeft: '4px solid hsl(var(--color-rose))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'hsla(var(--color-rose), 0.15)',
            color: 'hsl(var(--color-rose))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <IconLock />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)' }}>Security Audit & Governance</h2>
            <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))' }}>
              Compliant user provisioning, audit telemetry stream, and CCTNS credential logs
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'hsl(var(--bg-primary))', padding: '4px', borderRadius: '10px', border: '1px solid hsl(var(--border-color))' }}>
          {[
            { id: "stream", label: "Audit Logs Stream" },
            { id: "governance", label: "User Governance Matrix" },
            { id: "compliance", label: "Cryptographic Telemetry" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setAuditTab(t.id)}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                background: auditTab === t.id ? 'hsl(var(--color-indigo))' : 'transparent',
                color: auditTab === t.id ? 'white' : 'hsl(var(--text-secondary))',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER VIEW 1: AUDIT LOGS STREAM */}
      {auditTab === "stream" && (
        <div style={{ display: 'grid', gridTemplateColumns: '3.2fr 1fr', gap: '1.5rem' }}>
          
          {/* Table of logs */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconFileText />
                System Activity Log
              </h3>

              {/* Log filter buttons */}
              <div style={{ display: 'flex', gap: '4px', background: 'hsl(var(--bg-primary))', padding: '2px', borderRadius: '6px', border: '1px solid hsl(var(--border-color))' }}>
                {["ALL", "AUTH", "INVESTIGATION"].map(f => (
                  <button
                    key={f}
                    onClick={() => setLogFilter(f)}
                    style={{
                      padding: '3px 8px',
                      fontSize: '0.65rem',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      background: logFilter === f ? 'hsl(var(--color-indigo))' : 'transparent',
                      color: logFilter === f ? 'white' : 'hsl(var(--text-secondary))'
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ overflowX: 'auto', flexGrow: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid hsl(var(--border-color))', color: 'hsl(var(--text-muted))' }}>
                    <th style={{ padding: '0.6rem 0.85rem' }}>User / Officer</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Access Role</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Action Performed</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>IP Address</th>
                    <th style={{ padding: '0.6rem 0.85rem' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      style={{ borderBottom: '1px solid hsl(var(--border-color))', transition: 'background-color 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsla(var(--bg-card-hover), 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '0.75rem 0.85rem', fontWeight: '600', color: 'white' }}>
                        {log.user}
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem' }}>
                        <span className={`badge badge-${log.role === 'Administrator' ? 'rose' : log.role.includes('Supervisor') ? 'cyan' : log.role === 'Analyst' ? 'amber' : 'indigo'}`} style={{ fontSize: '0.6rem', padding: '0px 6px' }}>
                          {log.role.split(" ")[0]}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', color: 'white' }}>
                        {log.action}
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', fontFamily: 'monospace', color: 'hsl(var(--color-cyan))' }}>
                        {log.ip}
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', color: 'hsl(var(--text-muted))' }}>
                        {log.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats sidebar */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.05rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem' }}>Integrity Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.78rem' }}>
              <div style={{ background: 'hsl(var(--bg-primary))', padding: '8px 12px', borderRadius: '8px', border: '1px solid hsl(var(--border-color))' }}>
                <span style={{ color: 'hsl(var(--text-muted))', display: 'block', fontSize: '0.68rem' }}>Failed Authentication Locks</span>
                <strong style={{ fontSize: '1.1rem', color: 'hsl(var(--color-teal))' }}>0 Events</strong>
              </div>
              <div style={{ background: 'hsl(var(--bg-primary))', padding: '8px 12px', borderRadius: '8px', border: '1px solid hsl(var(--border-color))' }}>
                <span style={{ color: 'hsl(var(--text-muted))', display: 'block', fontSize: '0.68rem' }}>Decryption Keys Healthy</span>
                <strong style={{ fontSize: '1.1rem', color: 'hsl(var(--color-teal))' }}>100% Secure</strong>
              </div>
              <div style={{ background: 'hsl(var(--bg-primary))', padding: '8px 12px', borderRadius: '8px', border: '1px solid hsl(var(--border-color))' }}>
                <span style={{ color: 'hsl(var(--text-muted))', display: 'block', fontSize: '0.68rem' }}>MFA Enforcement Index</span>
                <strong style={{ fontSize: '1.1rem', color: 'hsl(var(--color-cyan))' }}>98.5% Active</strong>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* RENDER VIEW 2: USER GOVERNANCE MATRIX */}
      {auditTab === "governance" && (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconUsers />
            User Clearance & Access Matrices
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
            Verify registered police units, change permissions, or revoke session authorizations in real-time compliance loops.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid hsl(var(--border-color))', color: 'hsl(var(--text-muted))' }}>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Officer Name</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Division / Station</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Clearance Grading</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Clearance Role</th>
                  <th style={{ padding: '0.6rem 0.85rem' }}>Credential Status</th>
                  <th style={{ padding: '0.6rem 0.85rem', textAlign: 'right' }}>Administrative Commands</th>
                </tr>
              </thead>
              <tbody>
                {officers.map(off => (
                  <tr 
                    key={off.username}
                    style={{ borderBottom: '1px solid hsl(var(--border-color))', transition: 'background-color 0.2s' }}
                  >
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 'bold', color: 'white' }}>{off.username}</td>
                    <td style={{ padding: '0.75rem 0.85rem', color: 'hsl(var(--text-secondary))' }}>{off.department}</td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: '600', color: 'hsl(var(--color-cyan))' }}>{off.clearance}</td>
                    <td style={{ padding: '0.75rem 0.85rem' }}>
                      <select
                        className="input-control"
                        value={off.role}
                        onChange={(e) => handleChangeRole(off.username, e.target.value)}
                        style={{ padding: '2px 8px', fontSize: '0.7rem', background: 'hsl(var(--bg-secondary))', border: '1px solid hsl(var(--border-color))' }}
                      >
                        <option value="Investigator">Investigator</option>
                        <option value="Analyst">Analyst</option>
                        <option value="Supervisor / Policymaker">Supervisor</option>
                        <option value="Administrator">Administrator</option>
                      </select>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem' }}>
                      <span className={`badge badge-${off.status === 'Active' ? 'teal' : 'rose'}`} style={{ fontSize: '0.55rem', padding: '0px 6px' }}>
                        {off.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleStatus(off.username)}
                        className={`btn ${off.status === 'Active' ? 'btn-danger' : 'btn-teal'}`}
                        style={{ padding: '3px 8px', fontSize: '0.68rem', borderRadius: '4px' }}
                      >
                        {off.status === 'Active' ? 'Revoke / Suspend' : 'Activate Credentials'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER VIEW 3: SYSTEM COMPLIANCE POLICY */}
      {auditTab === "compliance" && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconShield />
              Compliance Guidelines & Standards
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8rem', lineHeight: '1.5' }}>
              <div>
                <strong style={{ color: 'hsl(var(--color-teal))', display: 'block', marginBottom: '2.5px' }}>AES-256-GCM Data Seal</strong>
                <p style={{ color: 'hsl(var(--text-secondary))' }}>
                  All database transaction traces and FIR timelines are cryptographically sealed at rest using AES-256-GCM symmetric block ciphers. Decryption keys are rotated every 90 days.
                </p>
              </div>

              <div>
                <strong style={{ color: 'hsl(var(--color-indigo))', display: 'block', marginBottom: '2.5px' }}>Write-Once Read-Many (WORM) Stream</strong>
                <p style={{ color: 'hsl(var(--text-secondary))' }}>
                  Audit streams are pushed immediately to a decentralized WORM database log. Any modification attempts will trigger an immediate automatic system lockdown and security alarm.
                </p>
              </div>

              <div>
                <strong style={{ color: 'hsl(var(--color-amber))', display: 'block', marginBottom: '2.5px' }}>CCTNS Compliance Framework</strong>
                <p style={{ color: 'hsl(var(--text-secondary))' }}>
                  Complies fully with the guidelines issued by the Ministry of Home Affairs (MHA) regarding roles, session locks (30-minute timeouts), and audit history retention (minimum 5 years).
                </p>
              </div>
            </div>
          </div>

          {/* Simulated Cryptographic Keys Telemetry */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem' }}>Crypto Logs</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.75rem', fontFamily: 'monospace' }}>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'hsl(var(--text-muted))' }}>Active Algorithm:</span>
                <strong style={{ color: 'white' }}>AES-256-GCM / SHA3-512</strong>
              </div>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'hsl(var(--text-muted))' }}>Key Rotation cycle:</span>
                <strong style={{ color: 'hsl(var(--color-teal))' }}>84 days remaining</strong>
              </div>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'hsl(var(--text-muted))' }}>MFA Token validation:</span>
                <strong style={{ color: 'hsl(var(--color-teal))' }}>Passed (TOTP-SHA1)</strong>
              </div>
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: 'hsl(var(--text-muted))' }}>Client TLS link:</span>
                <strong style={{ color: 'white' }}>TLSv1.3 (ECDHE-ECDSA)</strong>
              </div>
              
              <div style={{
                background: 'hsla(var(--color-teal), 0.1)',
                border: '1px solid hsla(var(--color-teal), 0.2)',
                borderRadius: '8px',
                padding: '8px',
                color: 'hsl(var(--color-teal))',
                fontSize: '0.7rem',
                lineHeight: '1.3',
                fontFamily: 'var(--font-sans)',
                marginTop: '0.5rem'
              }}>
                <strong>System Daemon Status:</strong> Firewalls active. Integrity seals audited and verified at 12:00:00 (Local telemetry checked successfully).
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
