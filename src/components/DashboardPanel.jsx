import React, { useState } from 'react';
import { districtsData, crimeStatsOverview, predictiveWarnings, mockFIRs, accusedProfiles } from '../data/mockData';

// Custom SVG Icons
const IconAlert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

const IconFileText = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

const IconClose = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export default function DashboardPanel({ onNavigateToTab, user }) {
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [dashboardTab, setDashboardTab] = useState('telemetry'); // 'telemetry' | 'sociological' | 'investigator'
  const [selectedCaseId, setSelectedCaseId] = useState('10443'); // Default case for investigator portal
  const [hoveredScatterPoint, setHoveredScatterPoint] = useState(null);
  
  // State for active KPI modal details
  const [activeKpiModal, setActiveKpiModal] = useState(null); // 'crimes' | 'solved' | 'offenders' | 'hotspots' | null

  const districts = Object.keys(districtsData);

  const handleDistrictSelect = (name) => {
    setFilterDistrict(name);
  };

  // Compute metrics based on filter
  const displayedMetrics = filterDistrict === 'All' 
    ? {
        totalCrimes: crimeStatsOverview.totalCrimes2026,
        solvedRate: crimeStatsOverview.solvedRate,
        activeOffenders: crimeStatsOverview.activeOffenders,
        hotspots: crimeStatsOverview.hotspotsDetected
      }
    : {
        totalCrimes: districtsData[filterDistrict].crimes2026,
        solvedRate: districtsData[filterDistrict].solvedRate,
        activeOffenders: districtsData[filterDistrict].activeOffenders,
        hotspots: districtsData[filterDistrict].hotspots.length
      };

  const activeCaseInfo = mockFIRs.find(f => f.caseNo === selectedCaseId) || mockFIRs[0];

  // Get stations, complaints, and suspects for the active district
  const getDistrictStations = (dist) => {
    if (dist === 'All') return ["Statewide Patrol Teams", "1100+ Regional Police Stations"];
    return districtsData[dist]?.stations || ["Local Beat Outpost"];
  };

  const getDistrictFIRs = (dist) => {
    if (dist === 'All') return mockFIRs;
    const filtered = mockFIRs.filter(f => f.district === dist);
    if (filtered.length > 0) return filtered;

    // Dynamic generation of 2 realistic cases for districts without hardcoded mock cases
    return [
      {
        id: `FIR_GEN_${dist}_1`,
        caseNo: `FIR-${Math.floor(11000 + (dist.charCodeAt(0) * 123) % 8000)}`,
        crimeNo: `CR-04/${Math.floor(2025 + (dist.charCodeAt(1) % 2))}`,
        district: dist,
        policeStation: districtsData[dist]?.stations?.[0] || `${dist} Town PS`,
        sections: ["IPC 379 (Theft)", "IPC 411 (Fencing recovery)"],
        accused: [`Lokesh Naik (${dist})`],
        victims: [`Shivaraj Gowda (Store manager)`],
        status: "Under Investigation",
        briefFacts: `Complainant reported break-in at a retail warehouse in ${dist}. Agricultural tools and seeds worth ₹85,000 were stolen. Suspect spotted on local toll feed.`
      },
      {
        id: `FIR_GEN_${dist}_2`,
        caseNo: `FIR-${Math.floor(21000 + (dist.charCodeAt(2) * 234) % 8000)}`,
        crimeNo: `CR-19/${Math.floor(2025 + (dist.charCodeAt(0) % 2))}`,
        district: dist,
        policeStation: districtsData[dist]?.stations?.[1] || `${dist} Rural PS`,
        sections: ["IPC 324 (Voluntarily causing hurt)", "IPC 506 (Intimidation)"],
        accused: [`Ramesh Murthy`],
        victims: [`Kalyani Devi (Resident)`],
        status: "Chargesheet Pending",
        briefFacts: `Boundary altercation reported at a village border in ${dist}. Verbal insults escalated to minor physical assault. Beat police dispatched.`
      }
    ];
  };

  const getDistrictSuspects = (dist) => {
    const matchingFIRs = getDistrictFIRs(dist);
    const suspectNames = new Set();
    matchingFIRs.forEach(f => f.accused.forEach(acc => suspectNames.add(acc)));
    
    // Fallback based on activeArea mapping if no FIR matches
    if (suspectNames.size === 0 && dist !== 'All') {
      Object.values(accusedProfiles).forEach(acc => {
        if (acc.activeArea.toLowerCase().includes(dist.toLowerCase())) {
          suspectNames.add(`${acc.name} (${acc.role})`);
        }
      });
    }

    return Array.from(suspectNames);
  };

  const activeStations = getDistrictStations(filterDistrict);
  const activeFIRs = getDistrictFIRs(filterDistrict);
  const activeSuspects = getDistrictSuspects(filterDistrict);

  // Statewide monthly counts for trend line chart
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const getMonthlyTotal = (month, type) => {
    return Object.values(districtsData).reduce((sum, d) => {
      const trend = d.trends?.find(t => t.month === month);
      if (trend) {
        return sum + (type ? (trend[type] || 0) : (trend.count || 0));
      }
      return sum;
    }, 0);
  };

  // Draw pure SVG seasonal trend lines
  const propertyTrendPoints = months.map((m, i) => ({ x: 60 + i * 70, y: 150 - (getMonthlyTotal(m, "property") / 120) }));
  const cyberTrendPoints = months.map((m, i) => ({ x: 60 + i * 70, y: 150 - (getMonthlyTotal(m, "cyber") / 120) }));
  const violentTrendPoints = months.map((m, i) => ({ x: 60 + i * 70, y: 150 - (getMonthlyTotal(m, "violent") / 120) }));

  const buildSvgPath = (points) => {
    return points.reduce((path, p, i) => i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`, "");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
      
      {/* Top Navigation Row */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user?.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid hsl(var(--color-indigo))', objectFit: 'cover' }} 
            />
          )}
          <div>
            <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>KSP Analytical Nexus</h2>
            <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))' }}>
              Welcome back, <strong>{user?.displayName || user?.username}</strong> {user?.email && `(${user.email})`}
            </p>
          </div>
        </div>

        {/* Inner Tab Controllers */}
        <div style={{ display: 'flex', gap: '0.4rem', background: 'hsl(var(--bg-primary))', padding: '4px', borderRadius: '10px', border: '1px solid hsl(var(--border-color))' }}>
          {[
            { id: "telemetry", label: "Crime Telemetry" },
            { id: "sociological", label: "Sociological Lens" },
            { id: "investigator", label: "Investigator Support" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setDashboardTab(tab.id)}
              style={{
                padding: '6px 14px',
                fontSize: '0.78rem',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                background: dashboardTab === tab.id ? 'hsl(var(--color-indigo))' : 'transparent',
                color: dashboardTab === tab.id ? 'white' : 'hsl(var(--text-secondary))',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER VIEW 1: CRIME TELEMETRY */}
      {dashboardTab === 'telemetry' && (
        <>
          {/* Filters Area */}
          <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', fontWeight: '500' }}>
              Active District Focus: <strong style={{ color: 'white' }}>{filterDistrict === 'All' ? 'Statewide (All 31 Districts)' : filterDistrict}</strong>
            </span>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>Select Focus Area:</label>
              <select
                className="input-control"
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                style={{ background: 'hsl(var(--bg-secondary))', padding: '0.4rem 1.8rem 0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                <option value="All">Statewide (All 31 Districts)</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clickable Stats Cards Row */}
          <div className="stats-grid">
            <div 
              className="glass-panel stat-card clickable-card-hover" 
              onClick={() => setActiveKpiModal('crimes')}
              style={{ borderLeft: '4px solid hsl(var(--color-indigo))', cursor: 'pointer' }}
            >
              <div className="stat-card-header">
                <span>Total Logged Crimes (YTD)</span>
                <span className="badge badge-indigo" style={{ fontSize: '0.6rem' }}>View Cases</span>
              </div>
              <div className="stat-card-value" style={{ fontSize: '2rem' }}>{displayedMetrics.totalCrimes.toLocaleString()}</div>
              <div className="stat-card-footer">
                <span className="stat-trend-up">↑ 4.2%</span> click to view case names
              </div>
            </div>

            <div 
              className="glass-panel stat-card clickable-card-hover" 
              onClick={() => setActiveKpiModal('solved')}
              style={{ borderLeft: '4px solid hsl(var(--color-teal))', cursor: 'pointer' }}
            >
              <div className="stat-card-header">
                <span>Case Solved Rate</span>
                <span className="badge badge-teal" style={{ fontSize: '0.6rem' }}>View Solved</span>
              </div>
              <div className="stat-card-value" style={{ fontSize: '2rem' }}>{displayedMetrics.solvedRate}%</div>
              <div className="stat-card-footer">
                <span className="stat-trend-up">↑ 1.8%</span> click to view resolved cases
              </div>
            </div>

            <div 
              className="glass-panel stat-card clickable-card-hover" 
              onClick={() => setActiveKpiModal('offenders')}
              style={{ borderLeft: '4px solid hsl(var(--color-amber))', cursor: 'pointer' }}
            >
              <div className="stat-card-header">
                <span>Tracked Repeat Offenders</span>
                <span className="badge badge-amber" style={{ fontSize: '0.6rem' }}>View Dossiers</span>
              </div>
              <div className="stat-card-value" style={{ fontSize: '2rem' }}>{displayedMetrics.activeOffenders}</div>
              <div className="stat-card-footer">
                click to view active suspect names
              </div>
            </div>

            <div 
              className="glass-panel stat-card clickable-card-hover" 
              onClick={() => setActiveKpiModal('hotspots')}
              style={{ borderLeft: '4px solid hsl(var(--color-rose))', cursor: 'pointer' }}
            >
              <div className="stat-card-header">
                <span>Hotspots Registered</span>
                <span className="badge badge-rose" style={{ fontSize: '0.6rem' }}>View Sectors</span>
              </div>
              <div className="stat-card-value" style={{ fontSize: '2rem' }}>{displayedMetrics.hotspots}</div>
              <div className="stat-card-footer">
                click to view coordinates & areas
              </div>
            </div>
          </div>

          {/* District Station & Accused Detail Nexus */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
            
            {/* Left side: Trend line charts */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Seasonal Crime Trend Analytics</span>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Monthly Telemetry</span>
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', marginBottom: '1rem' }}>
                Statewide trends demonstrating Property crimes (blue), Cyber frauds (green) and Violent crimes (yellow). Note the summer property crime peak.
              </p>

              <div style={{ flexGrow: 1, position: 'relative', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 450 170" style={{ width: '100%', height: '100%', maxHeight: '150px' }}>
                  <line x1="50" y1="20" x2="420" y2="20" stroke="rgba(255,255,255,0.04)" />
                  <line x1="50" y1="60" x2="420" y2="60" stroke="rgba(255,255,255,0.04)" />
                  <line x1="50" y1="100" x2="420" y2="100" stroke="rgba(255,255,255,0.04)" />
                  <line x1="50" y1="140" x2="420" y2="140" stroke="rgba(255,255,255,0.08)" />

                  <path d={buildSvgPath(propertyTrendPoints)} fill="none" stroke="hsl(var(--color-indigo))" strokeWidth="2.5" />
                  <path d={buildSvgPath(cyberTrendPoints)} fill="none" stroke="hsl(var(--color-teal))" strokeWidth="2.5" strokeDasharray="3 3" />
                  <path d={buildSvgPath(violentTrendPoints)} fill="none" stroke="hsl(var(--color-amber))" strokeWidth="2.5" />

                  {months.map((m, i) => (
                    <g key={i}>
                      <text x={60 + i * 70} y="158" fill="hsl(var(--text-secondary))" textAnchor="middle" style={{ fontSize: '0.65rem' }}>{m}</text>
                      <circle cx={60 + i * 70} cy={150 - (getMonthlyTotal(m, "property") / 120)} r="3.5" fill="hsl(var(--color-indigo))" />
                      <circle cx={60 + i * 70} cy={150 - (getMonthlyTotal(m, "cyber") / 120)} r="3.5" fill="hsl(var(--color-teal))" />
                      <circle cx={60 + i * 70} cy={150 - (getMonthlyTotal(m, "violent") / 120)} r="3.5" fill="hsl(var(--color-amber))" />
                    </g>
                  ))}

                  <text x="40" y="24" fill="hsl(var(--text-muted))" textAnchor="end" style={{ fontSize: '0.55rem' }}>15,000</text>
                  <text x="40" y="64" fill="hsl(var(--text-muted))" textAnchor="end" style={{ fontSize: '0.55rem' }}>8,000</text>
                  <text x="40" y="104" fill="hsl(var(--text-muted))" textAnchor="end" style={{ fontSize: '0.55rem' }}>4,000</text>
                  <text x="40" y="144" fill="hsl(var(--text-muted))" textAnchor="end" style={{ fontSize: '0.55rem' }}>0</text>
                </svg>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.7rem', color: 'hsl(var(--text-muted))', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: 'hsl(var(--color-indigo))', borderRadius: '50%' }} /> Property Crimes</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: 'hsl(var(--color-teal))', borderRadius: '50%' }} /> Cyber Frauds</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: 'hsl(var(--color-amber))', borderRadius: '50%' }} /> Violent Crimes</div>
              </div>
            </div>

            {/* Right side: Selected District Command Dossier */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>District Command Dossier</span>
                <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>{filterDistrict}</span>
              </h3>

              {/* Station Directory */}
              <div>
                <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '4px' }}>Local Police Stations</span>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {activeStations.map(st => (
                    <span key={st} style={{ background: 'hsla(var(--bg-card-hover), 0.5)', border: '1px solid hsl(var(--border-color))', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', color: 'white' }}>
                      🏢 {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Complaints with Case Names! */}
              <div>
                <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '4px' }}>Currently Registered Complaints / Cases List</span>
                {activeFIRs.length === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', fontStyle: 'italic' }}>No active FIR alerts registered in this district.</span>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {activeFIRs.map(fir => (
                      <div key={fir.caseNo} style={{ background: 'hsl(var(--bg-primary))', border: '1px solid hsl(var(--border-color))', borderRadius: '6px', padding: '6px 10px', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 'bold' }}>
                          <span>FIR: {fir.caseNo}</span>
                          <span style={{ color: 'hsl(var(--color-cyan))' }}>{fir.policeStation}</span>
                        </div>
                        <div style={{ margin: '2px 0', fontSize: '0.72rem' }}>
                          <strong style={{ color: 'hsl(var(--color-rose))' }}>Case: {fir.sections?.join(", ") || "Crime Complaint"}</strong>
                        </div>
                        <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.7rem', margin: '2px 0 4px 0', lineHeight: '1.3' }}>{fir.briefFacts}</p>
                        <div style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', display: 'flex', gap: '8px' }}>
                          <span>Suspect: <b style={{ color: 'white' }}>{fir.accused?.join(", ") || "Unknown"}</b></span>
                          <span>Victim: <b style={{ color: 'white' }}>{fir.victims?.join(", ") || "Citizen"}</b></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Suspects */}
              <div>
                <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '4px' }}>Active Suspects under Surveillance</span>
                {activeSuspects.length === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', fontStyle: 'italic' }}>No registered profiles under active surveillance here.</span>
                ) : (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {activeSuspects.map(sus => (
                      <span key={sus} style={{ background: 'hsla(var(--color-rose), 0.1)', border: '1px solid hsla(var(--color-rose), 0.3)', borderRadius: '6px', padding: '4px 8px', fontSize: '0.72rem', color: 'hsl(var(--color-rose))', fontWeight: '600' }}>
                        👤 {sus}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* District Rankings Table (Scrollable containing all 31 districts) */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Karnataka State District Directory (Click Row to Select)</h3>
            <div style={{ overflowY: 'auto', maxHeight: '250px', border: '1px solid hsl(var(--border-color))', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                <thead style={{ position: 'sticky', top: 0, background: 'hsl(var(--bg-secondary))', zIndex: 10 }}>
                  <tr style={{ borderBottom: '1px solid hsl(var(--border-color))', color: 'hsl(var(--text-muted))' }}>
                    <th style={{ padding: '0.5rem 0.75rem' }}>District Name (ಜಿಲ್ಲೆ)</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Active Stations</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Literacy Rate</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Total Crime Count</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Case Solved Rate</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Risk Grading</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(districtsData).map(([key, item]) => (
                    <tr 
                      key={key} 
                      onClick={() => handleDistrictSelect(item.name)}
                      style={{ 
                        borderBottom: '1px solid hsl(var(--border-color))', 
                        transition: 'background-color 0.2s',
                        cursor: 'pointer',
                        background: filterDistrict === item.name ? 'hsla(var(--color-indigo), 0.12)' : 'transparent'
                      }}
                      onMouseEnter={(e) => { if(filterDistrict !== item.name) e.currentTarget.style.backgroundColor = 'hsla(var(--bg-card-hover), 0.2)'; }}
                      onMouseLeave={(e) => { if(filterDistrict !== item.name) e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <td style={{ padding: '0.75rem', fontWeight: '600', color: 'white' }}>
                        {item.name} <br />
                        <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>{item.kannadaName}</span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{item.stations?.length || 3} units</td>
                      <td style={{ padding: '0.75rem' }}>{item.literacyRate}%</td>
                      <td style={{ padding: '0.75rem' }}>{item.crimes2026.toLocaleString()}</td>
                      <td style={{ padding: '0.75rem', color: item.solvedRate >= 80 ? 'hsl(var(--color-teal))' : 'hsl(var(--color-amber))' }}>
                        <strong>{item.solvedRate}%</strong>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          color: item.riskScore > 75 ? 'hsl(var(--color-rose))' : item.riskScore > 50 ? 'hsl(var(--color-amber))' : 'hsl(var(--color-teal))',
                          fontWeight: 'bold'
                        }}>
                          {item.riskScore > 75 ? 'Severe' : item.riskScore > 50 ? 'Elevated' : 'Moderate'} ({item.riskScore})
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* RENDER VIEW 2: SOCIOLOGICAL LENS & SCATTER PLOTS */}
      {dashboardTab === 'sociological' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          
          {/* Interactive Scatter Plot */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Socio-Demographic Correlation Model</h3>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', marginBottom: '1rem' }}>
              Hover points to analyze the correlation (r = 0.74) between <strong>Youth Unemployment</strong> (X-axis, %) and <strong>District Risk Score</strong> (Y-axis) across 31 districts.
            </p>

            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 8, 15, 0.4)', borderRadius: '12px', padding: '1rem', position: 'relative' }}>
              <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%', maxHeight: '210px' }}>
                <line x1="40" y1="30" x2="380" y2="30" stroke="rgba(255,255,255,0.03)" />
                <line x1="40" y1="80" x2="380" y2="80" stroke="rgba(255,255,255,0.03)" />
                <line x1="40" y1="130" x2="380" y2="130" stroke="rgba(255,255,255,0.03)" />
                <line x1="40" y1="180" x2="380" y2="180" stroke="rgba(255,255,255,0.03)" />
                <line x1="40" y1="210" x2="380" y2="210" stroke="rgba(255,255,255,0.08)" />
                <line x1="40" y1="30" x2="40" y2="210" stroke="rgba(255,255,255,0.08)" />

                <text x="32" y="34" fill="hsl(var(--text-muted))" textAnchor="end" style={{ fontSize: '0.55rem' }}>100</text>
                <text x="32" y="84" fill="hsl(var(--text-muted))" textAnchor="end" style={{ fontSize: '0.55rem' }}>75</text>
                <text x="32" y="134" fill="hsl(var(--text-muted))" textAnchor="end" style={{ fontSize: '0.55rem' }}>50</text>
                <text x="32" y="184" fill="hsl(var(--text-muted))" textAnchor="end" style={{ fontSize: '0.55rem' }}>25</text>

                <text x="40" y="222" fill="hsl(var(--text-muted))" textAnchor="middle" style={{ fontSize: '0.55rem' }}>0%</text>
                <text x="125" y="222" fill="hsl(var(--text-muted))" textAnchor="middle" style={{ fontSize: '0.55rem' }}>3%</text>
                <text x="210" y="222" fill="hsl(var(--text-muted))" textAnchor="middle" style={{ fontSize: '0.55rem' }}>6%</text>
                <text x="295" y="222" fill="hsl(var(--text-muted))" textAnchor="middle" style={{ fontSize: '0.55rem' }}>9%</text>
                <text x="380" y="222" fill="hsl(var(--text-muted))" textAnchor="middle" style={{ fontSize: '0.55rem' }}>12%</text>

                <text x="210" y="235" fill="hsl(var(--text-secondary))" textAnchor="middle" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>Unemployment Rate (%)</text>
                <text x="12" y="120" fill="hsl(var(--text-secondary))" textAnchor="middle" transform="rotate(-90, 12, 120)" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>Risk Severity Index</text>

                {Object.values(districtsData).map((d) => {
                  const cx = 40 + (d.unemploymentRate / 12) * 340;
                  const cy = 210 - (d.riskScore / 100) * 180;
                  const isHovered = hoveredScatterPoint && hoveredScatterPoint.name === d.name;

                  return (
                    <g 
                      key={d.name} 
                      onMouseEnter={() => setHoveredScatterPoint(d)}
                      onMouseLeave={() => setHoveredScatterPoint(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={isHovered ? 8 : 5} 
                        fill={d.riskScore > 75 ? 'hsl(var(--color-rose))' : d.riskScore > 50 ? 'hsl(var(--color-amber))' : 'hsl(var(--color-teal))'}
                        stroke="white"
                        strokeWidth={isHovered ? 1.5 : 0.75}
                        style={{ filter: isHovered ? 'drop-shadow(0 0 5px white)' : 'none', transition: 'all 0.15s' }}
                      />
                    </g>
                  );
                })}
              </svg>

              {hoveredScatterPoint && (
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'hsl(var(--bg-secondary))',
                  border: '1px solid hsl(var(--border-color))',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  maxWidth: '180px',
                  boxShadow: 'var(--shadow-lg)'
                }}>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '2px' }}>{hoveredScatterPoint.name}</strong>
                  Unemployment: <span style={{ color: 'hsl(var(--color-amber))' }}>{hoveredScatterPoint.unemploymentRate}%</span> <br/>
                  Risk Index: <span style={{ color: 'hsl(var(--color-rose))' }}>{hoveredScatterPoint.riskScore}/100</span> <br/>
                  Literacy Level: <span style={{ color: 'hsl(var(--color-teal))' }}>{hoveredScatterPoint.literacyRate}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem' }}>Criminological Risk Factors</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: 'hsl(var(--text-muted))' }}>District Unemployment Index</span>
                <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.4', marginTop: '2px' }}>
                  Districts exceeding <strong>6.0% youth unemployment</strong> (e.g. Kalaburagi, Hubballi) show a <strong>2.8x higher incident velocity</strong> of chain snatching, robbery, and physical extortion.
                </p>
              </div>

              <div>
                <span style={{ color: 'hsl(var(--text-muted))' }}>Urbanization & Migration Impacts</span>
                <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.4', marginTop: '2px' }}>
                  High migration cities (Bengaluru Urban: 8.5/10 index) display intense anonymous crowding, reducing local surveillance and boosting cyber fraud vectors (SIM swap scams) by <strong>35% year-on-year</strong>.
                </p>
              </div>

              <div>
                <span style={{ color: 'hsl(var(--text-muted))' }}>Education & Crime Paradox</span>
                <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.4', marginTop: '2px' }}>
                  High literacy rates skews crime toward white-collar fraud, Aadhaar spoofing, and tech-layered money laundering (Whitefield Tech corridor).
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* RENDER VIEW 3: INVESTIGATOR DECISION SUPPORT PORTAL */}
      {dashboardTab === 'investigator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '1.5rem' }}>
          
          {/* Active Case Selector */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Investigation Dossiers</h3>
              <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>Select an active FIR case record below to inspect decision timelines.</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {mockFIRs.map(fir => (
                <div
                  key={fir.caseNo}
                  onClick={() => {
                    setSelectedCaseId(fir.caseNo);
                  }}
                  style={{
                    background: selectedCaseId === fir.caseNo ? 'hsla(var(--color-indigo), 0.15)' : 'hsla(var(--bg-card-hover), 0.3)',
                    border: selectedCaseId === fir.caseNo ? '1px solid hsl(var(--color-indigo))' : '1px solid hsl(var(--border-color))',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <strong style={{ color: 'white' }}>FIR {fir.caseNo} ({fir.crimeNo})</strong>
                    <span className="badge badge-indigo" style={{ fontSize: '0.58rem', padding: '0px 6px' }}>{fir.status}</span>
                  </div>
                  <span style={{ display: 'block', color: 'hsl(var(--text-secondary))', fontSize: '0.75rem' }}>Station: {fir.policeStation} ({fir.district})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Case summaries & timelines */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
            <div style={{ borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'hsl(var(--color-indigo))', fontWeight: 'bold' }}>AUTOMATED DECISION TIMELINE</span>
              <h2 style={{ fontSize: '1.25rem', color: 'white', marginTop: '2px' }}>FIR Case No. {activeCaseInfo.caseNo} ({activeCaseInfo.crimeNo})</h2>
              <p style={{ fontSize: '0.78rem', color: 'hsl(var(--text-secondary))', marginTop: '2px' }}>
                Victim: <strong>{activeCaseInfo.victims[0]}</strong> • Suspects: <strong>{activeCaseInfo.accused.join(", ")}</strong>
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '4px' }}>Brief Facts of Case</span>
              <p style={{ fontSize: '0.8rem', color: 'white', lineHeight: '1.4', background: 'hsl(var(--bg-primary))', padding: '10px 12px', borderRadius: '8px', border: '1px solid hsl(var(--border-color))' }}>
                {activeCaseInfo.briefFacts}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '8px' }}>Action Log & Timeline Stream</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '2px solid hsl(var(--border-color))', marginLeft: '6px', paddingLeft: '1rem' }}>
                {activeCaseInfo.timeline?.map((step, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-22px',
                      top: '2px',
                      width: '10px',
                      height: '10px',
                      background: 'hsl(var(--color-indigo))',
                      borderRadius: '50%',
                      border: '2px solid hsl(var(--bg-card))',
                      boxShadow: '0 0 5px hsl(var(--color-indigo))'
                    }} />

                    <div style={{ fontSize: '0.78rem' }}>
                      <span style={{ color: 'hsl(var(--color-cyan))', fontSize: '0.7rem', fontWeight: 'bold' }}>{step.date} • {step.title}</span>
                      <p style={{ color: 'hsl(var(--text-secondary))', marginTop: '2px', lineHeight: '1.3' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '6px' }}>Modus Operandi Similar Case Matching</span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {activeCaseInfo.similarCases?.map(sc => (
                  <span 
                    key={sc}
                    style={{
                      background: 'hsla(var(--color-cyan), 0.1)',
                      border: '1px solid hsla(var(--color-cyan), 0.3)',
                      color: 'hsl(var(--color-cyan))',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}
                  >
                    Match: FIR {sc} (Guilty Verdict)
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '6px' }}>Suggested Investigation Leads checklist</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem' }}>
                {activeCaseInfo.investigationLeads?.map((lead, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'hsla(var(--color-amber), 0.05)', padding: '6px 10px', borderRadius: '6px', border: '1px solid hsla(var(--color-amber), 0.1)' }}>
                    <span style={{ color: 'hsl(var(--color-amber))', fontWeight: 'bold' }}>⚡</span>
                    <span style={{ color: 'white', lineHeight: '1.3' }}>{lead}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* GLASSMORPHIC MODAL DRAWER OVERLAYS FOR THE 4 KPI CARDS */}
      {/* ========================================================================= */}
      {activeKpiModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 8, 15, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1.5rem',
            boxShadow: '0 0 25px rgba(0,0,0,0.5)',
            border: '1px solid hsl(var(--border-color))'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-display)' }}>
                  {activeKpiModal === 'crimes' && "Logged Crime Incident Directory"}
                  {activeKpiModal === 'solved' && "Recently Solved & Convicted Cases"}
                  {activeKpiModal === 'offenders' && "Tracked Repeat Offenders Dossiers"}
                  {activeKpiModal === 'hotspots' && "Registered High-Risk Hotspots"}
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>
                  {activeKpiModal === 'crimes' && "Statewide catalog of registered cases and complainants"}
                  {activeKpiModal === 'solved' && "Audit logs of resolved cases and judicial outcomes"}
                  {activeKpiModal === 'offenders' && "Recidivism profiling dossiers under active surveillance"}
                  {activeKpiModal === 'hotspots' && "GIS targeted surveillance zones and sectors"}
                </span>
              </div>
              <button 
                onClick={() => setActiveKpiModal(null)} 
                className="btn btn-secondary btn-icon"
                style={{ width: '28px', height: '28px', borderRadius: '4px' }}
              >
                <IconClose />
              </button>
            </div>

            {/* Modal Content Scroll */}
            <div style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '4px' }}>
              
              {/* CRIMES MODAL LIST */}
              {activeKpiModal === 'crimes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {mockFIRs.map(fir => (
                    <div key={fir.caseNo} style={{ background: 'hsl(var(--bg-primary))', border: '1px solid hsl(var(--border-color))', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'white' }}>
                        <span>FIR {fir.caseNo} ({fir.crimeNo})</span>
                        <span style={{ color: 'hsl(var(--color-indigo))' }}>{fir.district}</span>
                      </div>
                      <p style={{ margin: '4px 0', color: 'white' }}><b>Charge:</b> {fir.sections.join(", ")}</p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '0.72rem', color: 'hsl(var(--text-secondary))' }}>{fir.briefFacts}</p>
                      <div style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))', display: 'flex', gap: '10px' }}>
                        <span>Suspect: <b style={{ color: 'white' }}>{fir.accused.join(", ")}</b></span>
                        <span>Victim: <b style={{ color: 'white' }}>{fir.victims.join(", ")}</b></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SOLVED MODAL LIST */}
              {activeKpiModal === 'solved' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {mockFIRs.filter(f => f.status === 'Solved' || f.status.includes('Chargesheet')).map(fir => (
                    <div key={fir.caseNo} style={{ background: 'hsl(var(--bg-primary))', border: '1px solid hsl(var(--border-color))', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'white' }}>
                        <span>FIR {fir.caseNo} ({fir.crimeNo})</span>
                        <span style={{ color: 'hsl(var(--color-teal))' }}>Resolved</span>
                      </div>
                      <p style={{ margin: '4px 0', color: 'white' }}><b>Incident:</b> {fir.sections.join(", ")}</p>
                      <div style={{ fontSize: '0.72rem', color: 'hsl(var(--text-secondary))', borderLeft: '2px solid hsl(var(--color-teal))', paddingLeft: '8px', margin: '4px 0' }}>
                        <b>IO Assessment:</b> Resolved. Conviction trails and evidence logs submitted to Judicial Magistrate.
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'hsl(var(--text-muted))' }}>
                        Assigned Station: <b>{fir.policeStation} ({fir.district})</b>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* REPEAT OFFENDERS MODAL LIST */}
              {activeKpiModal === 'offenders' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {Object.values(accusedProfiles).map(acc => (
                    <div key={acc.id} style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', background: 'hsl(var(--bg-primary))', border: '1px solid hsl(var(--border-color))', padding: '10px', borderRadius: '8px', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', padding: '6px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: acc.riskScore > 85 ? 'hsl(var(--color-rose))' : 'hsl(var(--color-amber))' }}>{acc.riskScore}%</span>
                        <span style={{ fontSize: '0.55rem', color: 'hsl(var(--text-muted))' }}>Threat index</span>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'white' }}>
                          <span>{acc.name} (Alias: {acc.alias})</span>
                          <span className={`badge badge-${acc.status === 'Active' ? 'rose' : 'teal'}`} style={{ fontSize: '0.55rem', padding: '0px 4px' }}>{acc.status}</span>
                        </div>
                        <span style={{ display: 'block', fontSize: '0.72rem', color: 'hsl(var(--color-cyan))', margin: '2px 0' }}>Role: {acc.role} • Active Area: {acc.activeArea}</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '0.72rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.3' }}><b>Modus Operandi:</b> {acc.modusOperandi}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* HOTSPOTS MODAL LIST */}
              {activeKpiModal === 'hotspots' && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid hsl(var(--border-color))', color: 'hsl(var(--text-muted))' }}>
                        <th style={{ padding: '6px 8px' }}>Hotspot Area</th>
                        <th style={{ padding: '6px 8px' }}>District</th>
                        <th style={{ padding: '6px 8px' }}>Crime Type</th>
                        <th style={{ padding: '6px 8px' }}>Coordinates</th>
                        <th style={{ padding: '6px 8px' }}>Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(districtsData).flatMap(d => d.hotspots.map(hot => ({ ...hot, district: d.name }))).map((hot, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid hsl(var(--border-color))' }}>
                          <td style={{ padding: '8px', color: 'white', fontWeight: 'bold' }}>{hot.name}</td>
                          <td style={{ padding: '8px', color: 'hsl(var(--text-secondary))' }}>{hot.district}</td>
                          <td style={{ padding: '8px', color: 'hsl(var(--text-secondary))' }}>{hot.type}</td>
                          <td style={{ padding: '8px', fontFamily: 'monospace', color: 'hsl(var(--color-cyan))' }}>{hot.coords.lat.toFixed(4)}, {hot.coords.lng.toFixed(4)}</td>
                          <td style={{ padding: '8px' }}>
                            <span className={`badge badge-${hot.level === 'High' ? 'rose' : hot.level === 'Medium' ? 'amber' : 'teal'}`} style={{ fontSize: '0.55rem', padding: '0px 4px' }}>
                              {hot.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
