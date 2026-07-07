import React, { useState } from 'react';
import { criminalNetwork, accusedProfiles, financialTransactions, mockFIRs } from '../data/mockData';

// Custom SVG Icons
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const IconFileText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

const IconLink = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
);

export default function NetworkPanel({ addAuditLog }) {
  const [selectedFirNo, setSelectedFirNo] = useState("10443"); // Default: Jayanagar Extortion FIR
  const [selectedNodeId, setSelectedNodeId] = useState("off_01"); // Default: Rowdy Raju
  const [searchQuery, setSearchQuery] = useState("");

  const nodes = criminalNetwork.nodes;

  // Selected FIR info
  const activeFIR = mockFIRs.find(f => f.caseNo === selectedFirNo) || mockFIRs[0];
  const selectedSuspect = accusedProfiles[selectedNodeId] || accusedProfiles["off_01"];

  // Filter FIR list based on search query
  const filteredFIRs = mockFIRs.filter(fir => 
    fir.caseNo.includes(searchQuery) || 
    fir.crimeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fir.accused.some(acc => acc.toLowerCase().includes(searchQuery.toLowerCase())) ||
    fir.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic Case-Centered Graph calculations
  // Nodes generated dynamically based on active FIR connections
  const generateCaseNodes = (fir) => {
    const caseNodes = [];
    
    // 1. Center node: the FIR Case Node itself
    caseNodes.push({
      id: `case_${fir.caseNo}`,
      name: `FIR ${fir.caseNo}`,
      label: fir.crimeNo,
      type: "case",
      color: "hsl(var(--color-indigo))",
      x: 230,
      y: 200,
      size: 24
    });

    const peripheralNodes = [];

    // 2. Accused/Offender Nodes
    fir.accused.forEach(accName => {
      // Find matching profile in profiles list
      const profile = Object.values(accusedProfiles).find(p => p.name.includes(accName.split(" ")[0]));
      if (profile) {
        peripheralNodes.push({
          id: profile.id,
          name: profile.name,
          label: profile.alias,
          type: "accused",
          color: profile.riskScore > 85 ? "hsl(var(--color-rose))" : "hsl(var(--color-amber))",
          riskScore: profile.riskScore,
          size: 18
        });

        // 3. Connected Financial Account Nodes
        if (profile.bankAccounts) {
          profile.bankAccounts.forEach(acc => {
            peripheralNodes.push({
              id: `acc_${acc.accNo}`,
              name: acc.bank,
              label: `A/C: ${acc.accNo.split("-")[1]}`,
              type: "account",
              color: acc.flag === 'High Risk' ? 'hsl(var(--color-rose))' : 'hsl(var(--color-teal))',
              size: 14
            });
          });
        }
      }
    });

    // 4. Victim Nodes
    fir.victims.forEach(vicName => {
      peripheralNodes.push({
        id: `vic_${vicName.replace(/\s+/g, '')}`,
        name: vicName,
        label: "Victim",
        type: "victim",
        color: "hsl(var(--color-cyan))",
        size: 16
      });
    });

    // 5. Police Station Node
    peripheralNodes.push({
      id: `station_${fir.policeStation.replace(/\s+/g, '')}`,
      name: fir.policeStation,
      label: fir.district,
      type: "station",
      color: "hsl(var(--color-teal))",
      size: 16
    });

    // Layout peripheral nodes in a radial ring around center node
    const count = peripheralNodes.length;
    peripheralNodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / count;
      const radius = 110;
      node.x = 230 + Math.cos(angle) * radius;
      node.y = 200 + Math.sin(angle) * radius;
      caseNodes.push(node);
    });

    return caseNodes;
  };

  const caseNodesList = generateCaseNodes(activeFIR);

  // Generate dynamic links from case node to all peripheral nodes
  const generateCaseLinks = (nodesList) => {
    const caseLinks = [];
    const centerNode = nodesList.find(n => n.type === "case");
    if (!centerNode) return caseLinks;

    nodesList.forEach(node => {
      if (node.id === centerNode.id) return;
      
      // Suspect-to-FIR link
      if (node.type === "accused" || node.type === "victim" || node.type === "station") {
        caseLinks.push({
          source: centerNode.id,
          target: node.id,
          type: node.type === "accused" ? "Suspect" : node.type === "victim" ? "Victim" : "Registered Location",
          color: node.type === "accused" ? "hsla(var(--color-rose), 0.4)" : "rgba(255,255,255,0.15)",
          isDashed: node.type === "station"
        });
      }

      // Suspect-to-Account link
      if (node.type === "account") {
        // Find corresponding accused profile owner
        Object.values(accusedProfiles).forEach(profile => {
          if (profile.bankAccounts?.some(acc => `acc_${acc.accNo}` === node.id)) {
            const accNode = nodesList.find(n => n.id === profile.id);
            if (accNode) {
              caseLinks.push({
                source: accNode.id,
                target: node.id,
                type: "Bank Audited",
                color: "hsla(var(--color-teal), 0.4)",
                isDashed: true
              });
            }
          }
        });
      }
    });

    return caseLinks;
  };

  const caseLinksList = generateCaseLinks(caseNodesList);

  const handleFirSelect = (firNo) => {
    setSelectedFirNo(firNo);
    const fir = mockFIRs.find(f => f.caseNo === firNo);
    addAuditLog(`Switched network graph context to FIR: ${firNo}`);
    
    // Automatically select the first accused in this FIR for dossier preview
    if (fir && fir.accused.length > 0) {
      const matchAcc = Object.values(accusedProfiles).find(p => p.name.includes(fir.accused[0].split(" ")[0]));
      if (matchAcc) {
        setSelectedNodeId(matchAcc.id);
      }
    }
  };

  const handleNodeClick = (node) => {
    if (node.type === "accused") {
      setSelectedNodeId(node.id);
      addAuditLog(`Inspected criminal profile: ${node.name}`);
    } else if (node.type === "case") {
      const caseNo = node.id.split("_")[1];
      handleFirSelect(caseNo);
    }
  };

  const getRiskColor = (score) => {
    if (score > 85) return 'hsl(var(--color-rose))';
    if (score > 65) return 'hsl(var(--color-amber))';
    return 'hsl(var(--color-teal))';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1.2fr 1fr', gap: '1.25rem', height: 'calc(100vh - 120px)', minHeight: '520px' }}>
      
      {/* Far Left Pane: Scrollable List of All FIRs */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', overflow: 'hidden' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)' }}>FIR Case Files</h3>
          <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>Select case to draw dynamic networks</span>
        </div>

        {/* Search Box */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search FIR, suspect..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ padding: '0.35rem 0.5rem 0.35rem 1.8rem', fontSize: '0.72rem', width: '100%' }}
          />
          <span style={{ position: 'absolute', left: '8px', top: '7px', color: 'hsl(var(--text-muted))' }}>
            <IconSearch />
          </span>
        </div>

        {/* FIR Items */}
        <div style={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingRight: '2px' }}>
          {filteredFIRs.map(fir => (
            <div
              key={fir.caseNo}
              onClick={() => handleFirSelect(fir.caseNo)}
              style={{
                background: selectedFirNo === fir.caseNo ? 'hsla(var(--color-indigo), 0.15)' : 'hsla(var(--bg-card-hover), 0.3)',
                border: selectedFirNo === fir.caseNo ? '1px solid hsl(var(--color-indigo))' : '1px solid hsl(var(--border-color))',
                padding: '0.65rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', marginBottom: '2px', fontWeight: 'bold' }}>
                <span style={{ color: 'white' }}>FIR {fir.caseNo}</span>
                <span className="badge badge-indigo" style={{ fontSize: '0.55rem', padding: '0px 4px' }}>{fir.status.split(" ")[0]}</span>
              </div>
              <span style={{ display: 'block', color: 'hsl(var(--text-muted))', fontSize: '0.68rem' }}>{fir.policeStation}</span>
              <span style={{ display: 'block', color: 'hsl(var(--text-secondary))', fontSize: '0.68rem', marginTop: '2px', fontWeight: '500' }}>Suspect: {fir.accused.join(", ")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Pane: Network SVG Canvas */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', padding: '1rem' }}>
        
        {/* Panel Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>FIR Relationship Model</h3>
            <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>Click center folder or peripheral circles to inspect</span>
          </div>
          <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>FIR Centered</span>
        </div>

        {/* Network SVG Canvas */}
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyItems: 'center', background: 'rgba(5, 8, 15, 0.4)', borderRadius: '12px', padding: '0.5rem', border: '1px solid hsl(var(--border-color))' }}>
          <svg viewBox="0 0 460 400" style={{ width: '100%', height: '100%', maxHeight: '340px' }}>
            
            {/* Draw Links/Lines */}
            {caseLinksList.map((link, idx) => {
              const startNode = caseNodesList.find(n => n.id === link.source);
              const endNode = caseNodesList.find(n => n.id === link.target);
              
              if (!startNode || !endNode) return null;

              return (
                <g key={`link-${idx}`}>
                  <line
                    x1={startNode.x}
                    y1={startNode.y}
                    x2={endNode.x}
                    y2={endNode.y}
                    stroke={link.color}
                    strokeWidth={1.5}
                    strokeDasharray={link.isDashed ? '3 3' : '0'}
                  />
                  {/* Link type tag */}
                  <text
                    x={(startNode.x + endNode.x) / 2}
                    y={(startNode.y + endNode.y) / 2 - 3}
                    fill="hsl(var(--text-muted))"
                    textAnchor="middle"
                    style={{ fontSize: '0.5rem', pointerEvents: 'none' }}
                  >
                    {link.type}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {caseNodesList.map((node) => {
              const isCenter = node.type === "case";
              const isSelectedAccused = node.id === selectedNodeId;
              
              let borderStroke = isCenter ? 'hsl(var(--color-indigo))' : 'rgba(255,255,255,0.2)';
              let filterGlow = 'none';

              if (isSelectedAccused) {
                borderStroke = 'white';
                filterGlow = 'drop-shadow(0 0 6px hsla(var(--color-indigo), 0.5))';
              }

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`} 
                  onClick={() => handleNodeClick(node)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {/* Main Circle */}
                  <circle
                    r={node.size}
                    fill="hsl(var(--bg-card))"
                    stroke={isCenter ? "white" : isSelectedAccused ? "white" : node.color}
                    strokeWidth={isSelectedAccused || isCenter ? 2.5 : 1.25}
                    style={{ filter: filterGlow }}
                  />

                  {/* Icon/Letter Label */}
                  <text
                    textAnchor="middle"
                    dy=".3em"
                    fill="white"
                    style={{ fontSize: isCenter ? '0.78rem' : '0.62rem', fontWeight: 'bold', pointerEvents: 'none' }}
                  >
                    {isCenter ? "📂" : node.type === 'account' ? "💳" : node.type === 'station' ? "🏢" : node.name[0]}
                  </text>

                  {/* Label Text */}
                  <text
                    y={node.size + 11}
                    textAnchor="middle"
                    fill={isCenter ? 'hsl(var(--color-cyan))' : 'hsl(var(--text-secondary))'}
                    style={{ fontSize: '0.62rem', fontWeight: isCenter || isSelectedAccused ? 'bold' : '500', pointerEvents: 'none' }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}

          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.75rem', fontSize: '0.7rem', color: 'hsl(var(--text-muted))', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: '8px', height: '8px', background: 'hsl(var(--bg-card))', border: '1.5px solid hsl(var(--color-indigo))', borderRadius: '50%' }} /> FIR File</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: '8px', height: '8px', background: 'hsl(var(--bg-card))', border: '1.5px solid hsl(var(--color-rose))', borderRadius: '50%' }} /> Suspect</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: '8px', height: '8px', background: 'hsl(var(--bg-card))', border: '1.5px solid hsl(var(--color-cyan))', borderRadius: '50%' }} /> Victim</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: '8px', height: '8px', background: 'hsl(var(--bg-card))', border: '1.5px solid hsl(var(--color-teal))', borderRadius: '50%' }} /> Police Station</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><span style={{ width: '8px', height: '8px', background: 'hsl(var(--bg-card))', border: '1.5px solid hsl(var(--color-amber))', borderRadius: '50%' }} /> A/C Audits</div>
        </div>
      </div>

      {/* Right Pane: Suspect Dossier Profile */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', overflowY: 'auto', padding: '1.25rem' }}>
        
        {/* Dossier Header */}
        <div style={{ borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'hsl(var(--color-rose))', fontWeight: 'bold' }}>🔒 CONFIDENTIAL • DOSSIER LINK</span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
            <h2 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>{selectedSuspect.name}</h2>
            <span className={`badge badge-${selectedSuspect.status === 'Active' ? 'rose' : 'teal'}`} style={{ fontSize: '0.6rem' }}>{selectedSuspect.status}</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', marginTop: '2px' }}>
            Alias: <strong>{selectedSuspect.alias}</strong> • {selectedSuspect.age} Yrs old • {selectedSuspect.gender}
          </p>
        </div>

        {/* Risk progress */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', background: 'hsl(var(--bg-primary))', padding: '0.75rem', borderRadius: '10px', border: '1px solid hsl(var(--border-color))' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: getRiskColor(selectedSuspect.riskScore) }}>{selectedSuspect.riskScore}%</span>
            <span style={{ fontSize: '0.6rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Risk Index</span>
          </div>
          <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div><span style={{ color: 'hsl(var(--text-muted))' }}>Grading:</span> <strong style={{ color: getRiskColor(selectedSuspect.riskScore) }}>{selectedSuspect.recidivismTier}</strong></div>
            <div style={{ marginTop: '2px' }}><span style={{ color: 'hsl(var(--text-muted))' }}>Arrests:</span> <strong style={{ color: 'white' }}>{selectedSuspect.arrestsCount} times</strong></div>
          </div>
        </div>

        {/* Modus Operandi & Profile details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.78rem' }}>
          <div>
            <strong style={{ color: 'hsl(var(--color-indigo))', display: 'block', marginBottom: '2px' }}>Modus Operandi</strong>
            <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.35', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '6px', border: '1px solid hsl(var(--border-color))' }}>
              {selectedSuspect.modusOperandi}
            </p>
          </div>

          <div>
            <strong style={{ color: 'hsl(var(--color-cyan))', display: 'block', marginBottom: '2px' }}>Behavioral Profile Assessment</strong>
            <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.35', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '6px', border: '1px solid hsl(var(--border-color))' }}>
              {selectedSuspect.behavioralProfile}
            </p>
          </div>
        </div>

        {/* Active Accounts */}
        {selectedSuspect.bankAccounts && (
          <div>
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '4px' }}>Audited Bank Accounts</span>
            {selectedSuspect.bankAccounts.map((acc, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', background: 'hsla(var(--bg-card-hover), 0.2)', padding: '6px 8px', borderRadius: '6px', border: '1px solid hsl(var(--border-color))', fontSize: '0.72rem', marginBottom: '4px' }}>
                <div>
                  <strong style={{ color: 'white' }}>{acc.bank}</strong>
                  <span style={{ display: 'block', color: 'hsl(var(--text-muted))', fontSize: '0.62rem' }}>A/C: {acc.accNo} ({acc.branch})</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 'bold', color: 'white' }}>₹{acc.balance.toLocaleString()}</span>
                  <span className={`badge badge-${acc.flag === 'High Risk' ? 'rose' : 'teal'}`} style={{ display: 'block', fontSize: '0.55rem', padding: '0px 4px', marginTop: '2px' }}>{acc.flag}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leads */}
        <div style={{ borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'hsl(var(--color-amber))', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>TACTICAL DETECTIVE LEADS</span>
          <p style={{ fontSize: '0.75rem', color: 'white', background: 'hsla(var(--color-amber), 0.08)', border: '1px dashed hsla(var(--color-amber), 0.3)', padding: '6px 10px', borderRadius: '6px', lineHeight: '1.3' }}>
            {selectedSuspect.tacticalLeads}
          </p>
        </div>

      </div>

    </div>
  );
}
