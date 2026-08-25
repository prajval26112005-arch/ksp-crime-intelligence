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
  const [firs, setFirs] = useState(mockFIRs);
  const [profiles, setProfiles] = useState(accusedProfiles);
  const [networkLinks, setNetworkLinks] = useState(criminalNetwork.links);

  const [selectedFirNo, setSelectedFirNo] = useState("10443"); // Default: Jayanagar Extortion FIR
  const [selectedNodeId, setSelectedNodeId] = useState("off_01"); // Default: Rowdy Raju
  const [searchQuery, setSearchQuery] = useState("");

  // States for interactive graph mechanics
  const [nodePositions, setNodePositions] = useState({});
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  // Modal, Form, and Toast States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [successNotification, setSuccessNotification] = useState("");

  const [formCriminalName, setFormCriminalName] = useState("");
  const [formAlias, setFormAlias] = useState("");
  const [formAge, setFormAge] = useState("");
  const [formGender, setFormGender] = useState("Unknown");
  const [formRelatedTo, setFormRelatedTo] = useState("");
  const [formRelationshipType, setFormRelationshipType] = useState("Associate");
  const [formCustomRelationship, setFormCustomRelationship] = useState("");
  const [formRelationshipDetails, setFormRelationshipDetails] = useState("");
  const [suspectSearch, setSuspectSearch] = useState("");
  const [errors, setErrors] = useState({});

  const handleMouseDown = (e, nodeId) => {
    e.preventDefault();
    setDraggingNodeId(nodeId);
  };

  const handleMouseMove = (e) => {
    if (!draggingNodeId) return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 460;
    const y = ((e.clientY - rect.top) / rect.height) * 400;
    
    const constrainedX = Math.max(20, Math.min(440, x));
    const constrainedY = Math.max(20, Math.min(380, y));

    setNodePositions(prev => ({
      ...prev,
      [draggingNodeId]: { x: constrainedX, y: constrainedY }
    }));
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const resetGraphLayout = () => {
    setNodePositions({});
    addAuditLog("Reset criminal relationship network graph layout");
  };

  const nodes = networkLinks;

  // Selected FIR info
  const activeFIR = firs.find(f => f.caseNo === selectedFirNo) || firs[0];
  const selectedSuspect = profiles[selectedNodeId] || profiles["off_01"];

  // Filter FIR list based on search query
  const filteredFIRs = firs.filter(fir => 
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
      const profile = Object.values(profiles).find(p => p.name.includes(accName.split(" ")[0]));
      if (profile && !profile.relatedTo) {
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

    // 6. Add newly created custom criminals associated with this FIR
    const newCriminals = Object.values(profiles).filter(p => p.firId === fir.caseNo && p.relatedTo);
    newCriminals.forEach(profile => {
      // Transitively position from parent if exists
      const parentNode = caseNodes.find(n => n.id === profile.relatedTo);
      let parentX = 230;
      let parentY = 200;
      if (parentNode) {
        parentX = parentNode.x;
        parentY = parentNode.y;
      }
      
      // Calculate an offset position
      const offsetAngle = (caseNodes.length * 45) * (Math.PI / 180);
      const childX = parentX + Math.cos(offsetAngle) * 55;
      const childY = parentY + Math.sin(offsetAngle) * 55;

      caseNodes.push({
        id: profile.id,
        name: profile.name,
        label: profile.alias || "No Alias",
        type: "new-criminal",
        color: "hsl(var(--color-rose))",
        riskScore: profile.riskScore || 50,
        size: 18,
        x: childX,
        y: childY
      });
    });

    return caseNodes;
  };

  const baseNodesList = generateCaseNodes(activeFIR);
  const caseNodesList = baseNodesList.map(node => {
    if (nodePositions[node.id]) {
      return { ...node, x: nodePositions[node.id].x, y: nodePositions[node.id].y };
    }
    return node;
  });

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
        Object.values(profiles).forEach(profile => {
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

    // 3. New Criminal to Related Suspect Link
    const newCriminalNodes = nodesList.filter(n => n.type === "new-criminal");
    newCriminalNodes.forEach(node => {
      const profile = profiles[node.id];
      if (profile && profile.relatedTo) {
        caseLinks.push({
          source: profile.relatedTo,
          target: node.id,
          type: profile.relationshipType,
          color: "hsl(var(--color-rose))",
          isNewRelationship: true
        });
      }
    });

    return caseLinks;
  };

  const caseLinksList = generateCaseLinks(caseNodesList);

  const isNodeHighlighted = (nodeId) => {
    if (!hoveredNodeId) return true;
    if (hoveredNodeId === nodeId) return true;
    return caseLinksList.some(link => 
      (link.source === hoveredNodeId && link.target === nodeId) ||
      (link.source === nodeId && link.target === hoveredNodeId)
    );
  };

  const isLinkHighlighted = (link) => {
    if (!hoveredNodeId) return true;
    return link.source === hoveredNodeId || link.target === hoveredNodeId;
  };

  const handleFirSelect = (firNo) => {
    setSelectedFirNo(firNo);
    const fir = firs.find(f => f.caseNo === firNo);
    addAuditLog(`Switched network graph context to FIR: ${firNo}`);
    
    // Reset positions on FIR selection change
    setNodePositions({});
    
    // Automatically select the first accused in this FIR for dossier preview
    if (fir && fir.accused.length > 0) {
      const matchAcc = Object.values(profiles).find(p => p.name.includes(fir.accused[0].split(" ")[0]));
      if (matchAcc) {
        setSelectedNodeId(matchAcc.id);
      }
    }
  };

  const handleNodeClick = (node) => {
    if (node.type === "accused" || node.type === "new-criminal") {
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

  const handleOpenAddModal = () => {
    setModalMode("add");
    setFormCriminalName("");
    setFormAlias("");
    setFormAge("");
    setFormGender("Unknown");
    
    // Automatically pre-fill 'Related To' with the selected suspect if they exist
    const initialRelation = selectedNodeId && selectedNodeId !== `case_${selectedFirNo}` && !selectedNodeId.startsWith("acc_") && !selectedNodeId.startsWith("vic_") && !selectedNodeId.startsWith("station_") ? selectedNodeId : "";
    setFormRelatedTo(initialRelation);
    setFormRelationshipType("Associate");
    setFormCustomRelationship("");
    setFormRelationshipDetails("");
    setSuspectSearch("");
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (suspect) => {
    setModalMode("edit");
    setFormCriminalName(suspect.name);
    setFormAlias(suspect.alias || "");
    setFormAge(suspect.age && suspect.age !== "Not provided" ? suspect.age.toString() : "");
    setFormGender(suspect.gender || "Unknown");
    setFormRelatedTo(suspect.relatedTo || "");
    
    const standardTypes = ["Associate", "Accomplice", "Gang Member", "Leader", "Follower", "Family", "Financial Associate", "Weapon Supplier", "Victim", "Witness", "Rival", "Unknown"];
    if (standardTypes.includes(suspect.relationshipType)) {
      setFormRelationshipType(suspect.relationshipType);
      setFormCustomRelationship("");
    } else {
      setFormRelationshipType("Other");
      setFormCustomRelationship(suspect.relationshipType);
    }
    setFormRelationshipDetails(suspect.relationshipDetails && suspect.relationshipDetails !== "Not provided" ? suspect.relationshipDetails : "");
    setSuspectSearch("");
    setErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formCriminalName.trim()) {
      tempErrors.name = "Criminal name is required.";
    }
    if (!formRelatedTo) {
      tempErrors.relatedTo = "Please select a related suspect.";
    }
    if (!formRelationshipType) {
      tempErrors.relationshipType = "Please select a relationship type.";
    } else if (formRelationshipType === "Other" && !formCustomRelationship.trim()) {
      tempErrors.customRelationship = "Please enter a custom relationship.";
    }
    if (formAge && (isNaN(formAge) || parseInt(formAge) < 0 || parseInt(formAge) > 120)) {
      tempErrors.age = "Please enter a valid age (0-120).";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSaveCriminal = () => {
    if (!validateForm()) return;

    const finalRelationship = formRelationshipType === "Other" ? formCustomRelationship : formRelationshipType;

    if (modalMode === "add") {
      const newId = `new_off_${Date.now()}`;
      const newCriminalProfile = {
        id: newId,
        name: formCriminalName,
        alias: formAlias || "Not provided",
        age: formAge ? parseInt(formAge) : "Not provided",
        gender: formGender,
        firId: selectedFirNo,
        relatedTo: formRelatedTo,
        relatedToName: profiles[formRelatedTo]?.name || "Unknown",
        relationshipType: finalRelationship,
        relationshipDetails: formRelationshipDetails || "Not provided",
        status: "Active",
        riskScore: 50,
        recidivismTier: "Tier 3 - Moderate Risk",
        modusOperandi: "Not provided",
        behavioralProfile: "Not provided",
        tacticalLeads: "Not provided",
        photoColor: "#EF4444"
      };

      const newLink = {
        source: formRelatedTo,
        target: newId,
        type: finalRelationship,
        strength: "Medium",
        amount: 0,
        date: new Date().toISOString().split("T")[0]
      };

      // Update global module imports so other views also see it
      accusedProfiles[newId] = newCriminalProfile;
      criminalNetwork.links.push(newLink);

      // Add to FIR accused list if not already
      const targetFir = mockFIRs.find(f => f.caseNo === selectedFirNo);
      if (targetFir && !targetFir.accused.includes(formCriminalName)) {
        targetFir.accused.push(formCriminalName);
      }

      // Sync state
      setProfiles({ ...accusedProfiles });
      setNetworkLinks([...criminalNetwork.links]);
      setFirs([...mockFIRs]);
      setSelectedNodeId(newId);

      setSuccessNotification("Criminal added to network successfully.");
      setTimeout(() => setSuccessNotification(""), 3000);
      addAuditLog(`Added new criminal: ${formCriminalName} linked to ${newCriminalProfile.relatedToName}`);
    } else {
      // Edit Mode
      const targetProfile = accusedProfiles[selectedNodeId];
      if (targetProfile) {
        const oldName = targetProfile.name;
        targetProfile.name = formCriminalName;
        targetProfile.alias = formAlias || "Not provided";
        targetProfile.age = formAge ? parseInt(formAge) : "Not provided";
        targetProfile.gender = formGender;
        targetProfile.relatedTo = formRelatedTo;
        targetProfile.relatedToName = profiles[formRelatedTo]?.name || "Unknown";
        targetProfile.relationshipType = finalRelationship;
        targetProfile.relationshipDetails = formRelationshipDetails || "Not provided";

        // Update active FIR's accused array if name changed
        const targetFir = mockFIRs.find(f => f.caseNo === selectedFirNo);
        if (targetFir && oldName !== formCriminalName) {
          targetFir.accused = targetFir.accused.map(acc => acc === oldName ? formCriminalName : acc);
        }

        // Update corresponding link
        const targetLink = criminalNetwork.links.find(l => l.target === selectedNodeId);
        if (targetLink) {
          targetLink.source = formRelatedTo;
          targetLink.type = finalRelationship;
        }

        setProfiles({ ...accusedProfiles });
        setNetworkLinks([...criminalNetwork.links]);
        setFirs([...mockFIRs]);

        setSuccessNotification("Criminal details updated successfully.");
        setTimeout(() => setSuccessNotification(""), 3000);
        addAuditLog(`Updated criminal link: ${formCriminalName}`);
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteCriminal = () => {
    const profileToDelete = accusedProfiles[selectedNodeId];
    if (!profileToDelete) return;
    
    const profileName = profileToDelete.name;

    // 1. Remove profile from accusedProfiles
    delete accusedProfiles[selectedNodeId];
    
    // 2. Remove links from criminalNetwork.links
    const updatedLinks = criminalNetwork.links.filter(l => l.target !== selectedNodeId && l.source !== selectedNodeId);
    criminalNetwork.links.length = 0; // Clear array
    updatedLinks.forEach(link => criminalNetwork.links.push(link)); // Re-populate
    
    // 3. Remove name from active FIR's accused array
    const targetFir = mockFIRs.find(f => f.caseNo === selectedFirNo);
    if (targetFir) {
      targetFir.accused = targetFir.accused.filter(acc => acc !== profileName);
    }

    // 4. Update state
    setProfiles({ ...accusedProfiles });
    setNetworkLinks([...criminalNetwork.links]);
    setFirs([...mockFIRs]);

    // 5. Select default node
    if (targetFir && targetFir.accused.length > 0) {
      const matchAcc = Object.values(accusedProfiles).find(p => p.name.includes(targetFir.accused[0].split(" ")[0]));
      if (matchAcc) {
        setSelectedNodeId(matchAcc.id);
      } else {
        setSelectedNodeId("off_01");
      }
    } else {
      setSelectedNodeId("off_01");
    }

    setIsDeleteConfirmOpen(false);
    setSuccessNotification("Criminal removed from network successfully.");
    setTimeout(() => setSuccessNotification(""), 3000);
    addAuditLog(`Removed criminal profile: ${profileName}`);
  };

  // Lists for Related To suspect options
  const availableRelations = caseNodesList.filter(n => n.type === "accused" || n.type === "new-criminal");
  const filteredRelations = availableRelations.filter(n => n.id !== selectedNodeId);
  const matchingRelations = filteredRelations.filter(n => 
    n.name.toLowerCase().includes(suspectSearch.toLowerCase()) ||
    (n.label && n.label.toLowerCase().includes(suspectSearch.toLowerCase()))
  );

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
            <span style={{ fontSize: '0.72rem', color: 'hsl(var(--text-muted))' }}>Click and drag circles to adjust layout. Hover to highlight connections.</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => handleOpenAddModal()}
              className="btn btn-primary"
              style={{ 
                padding: '4px 8px', 
                fontSize: '0.65rem', 
                borderRadius: '4px',
                background: 'hsl(var(--color-indigo))',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontWeight: 'bold'
              }}
            >
              <span>+ Add Criminal</span>
            </button>
            <button 
              onClick={resetGraphLayout}
              className="btn btn-secondary"
              style={{ padding: '4px 8px', fontSize: '0.65rem', borderRadius: '4px', border: '1px solid hsl(var(--border-color))' }}
            >
              Align Rings
            </button>
          </div>
        </div>

        {/* Network SVG Canvas */}
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyItems: 'center', background: 'rgba(5, 8, 15, 0.4)', borderRadius: '12px', padding: '0.5rem', border: '1px solid hsl(var(--border-color))' }}>
          <svg 
            viewBox="0 0 460 400" 
            style={{ width: '100%', height: '100%', maxHeight: '340px' }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            
            {/* Draw Links/Lines */}
            {caseLinksList.map((link, idx) => {
              const startNode = caseNodesList.find(n => n.id === link.source);
              const endNode = caseNodesList.find(n => n.id === link.target);
              
              if (!startNode || !endNode) return null;

              const isHighlighted = isLinkHighlighted(link);
              const isAccountLink = link.target.startsWith('acc_');
              const isNewRelationship = link.isNewRelationship;

              return (
                <g key={`link-${idx}`} style={{ transition: 'opacity 0.2s' }} opacity={isHighlighted ? 1 : 0.15}>
                  <line
                    x1={startNode.x}
                    y1={startNode.y}
                    x2={endNode.x}
                    y2={endNode.y}
                    stroke={link.color}
                    strokeWidth={isNewRelationship ? 2 : 1.5}
                    strokeDasharray={link.isDashed ? '3 3' : '0'}
                  />
                  
                  {/* Glowing animated flows for Audited Accounts */}
                  {isAccountLink && isHighlighted && (
                    <line
                      x1={startNode.x}
                      y1={startNode.y}
                      x2={endNode.x}
                      y2={endNode.y}
                      stroke="hsl(var(--color-teal))"
                      strokeWidth={2.5}
                      strokeDasharray="6 6"
                      strokeDashoffset="12"
                      style={{
                        animation: 'dash 1s linear infinite',
                        filter: 'drop-shadow(0 0 3px hsl(var(--color-teal)))'
                      }}
                    />
                  )}
                  
                  {/* Link type tag */}
                  <text
                    x={(startNode.x + endNode.x) / 2}
                    y={(startNode.y + endNode.y) / 2 - 4}
                    fill="hsl(var(--text-muted))"
                    textAnchor="middle"
                    style={{ fontSize: '0.48rem', pointerEvents: 'none', fontWeight: '500' }}
                  >
                    {link.type}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {caseNodesList.map((node) => {
              const isCenter = node.type === "case";
              const isNewCriminal = node.type === "new-criminal";
              const isSelectedAccused = node.id === selectedNodeId;
              const isHighlighted = isNodeHighlighted(node.id);
              
              let borderStroke = isCenter ? 'hsl(var(--color-indigo))' : 'rgba(255,255,255,0.2)';
              let filterGlow = 'none';

              if (isSelectedAccused) {
                borderStroke = 'white';
                filterGlow = 'drop-shadow(0 0 6px hsla(var(--color-indigo), 0.5))';
              } else if (isNewCriminal) {
                borderStroke = 'hsl(var(--color-rose))';
                filterGlow = 'drop-shadow(0 0 4px hsla(var(--color-rose), 0.3))';
              }

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`} 
                  onClick={() => handleNodeClick(node)}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  style={{ cursor: 'pointer', transition: 'transform 0.1s, opacity 0.2s' }}
                  opacity={isHighlighted ? 1 : 0.2}
                >
                  <title>
                    {isNewCriminal ? (
                      `${node.name}\nAlias: ${node.label}\nRelationship: ${profiles[node.id]?.relationshipType}\nRelated to: ${profiles[node.id]?.relatedToName}\nFIR: ${profiles[node.id]?.firId}`
                    ) : (
                      `${node.name}${node.label ? ` (${node.label})` : ""}`
                    )}
                  </title>
                  
                  {/* Main Circle */}
                  <circle
                    r={node.size}
                    fill="hsl(var(--bg-card))"
                    stroke={isCenter ? "white" : isSelectedAccused ? "white" : borderStroke}
                    strokeWidth={isSelectedAccused || isCenter ? 2.5 : 1.25}
                    strokeDasharray={isNewCriminal ? "3 1" : "0"}
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

        {/* Relationship Details Display */}
        {selectedSuspect.relatedTo && (
          <div style={{ borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--color-rose))', fontWeight: 'bold', display: 'block' }}>RELATIONSHIP DOSSIER LINK</span>
            <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div><span style={{ color: 'hsl(var(--text-muted))' }}>Relationship:</span> <strong style={{ color: 'white' }}>{selectedSuspect.relationshipType}</strong></div>
              <div><span style={{ color: 'hsl(var(--text-muted))' }}>Related To:</span> <strong style={{ color: 'white' }}>{selectedSuspect.relatedToName}</strong></div>
              <div><span style={{ color: 'hsl(var(--text-muted))' }}>FIR Case:</span> <strong style={{ color: 'white' }}>FIR {selectedSuspect.firId}</strong></div>
            </div>
            <div>
              <strong style={{ color: 'hsl(var(--color-rose))', display: 'block', fontSize: '0.72rem', marginBottom: '2px' }}>Relationship Details</strong>
              <p style={{ color: 'hsl(var(--text-secondary))', lineHeight: '1.35', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '6px', border: '1px solid hsl(var(--border-color))', fontSize: '0.75rem' }}>
                {selectedSuspect.relationshipDetails || "Not provided"}
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button
                onClick={() => handleOpenEditModal(selectedSuspect)}
                className="btn btn-secondary"
                style={{ flexGrow: 1, padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid hsl(var(--border-color))', cursor: 'pointer', background: 'hsla(var(--bg-card-hover), 0.5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                ✏️ Edit Link
              </button>
              <button
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid hsla(var(--color-rose), 0.3)', color: 'hsl(var(--color-rose))', cursor: 'pointer', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add/Edit Criminal Modal Overlay */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'hsl(var(--bg-card))',
            border: '1px solid hsl(var(--border-color))',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.5rem', display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'white', margin: 0 }}>
                {modalMode === "add" ? "Add Criminal to Network" : "Edit Criminal Network Link"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'hsl(var(--text-muted))', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              
              {/* FIR Case (Read-Only) */}
              <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>FIR Case (Read-Only)</span>
                <input
                  type="text"
                  readOnly
                  value={`FIR ${selectedFirNo} (${activeFIR.crimeNo})`}
                  className="input-control"
                  style={{ fontSize: '0.75rem', padding: '6px 8px', background: 'rgba(255,255,255,0.03)', color: 'hsl(var(--text-muted))', border: '1px solid hsl(var(--border-color))', borderRadius: '6px' }}
                />
              </label>

              {/* Criminal Name */}
              <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Criminal Name *</span>
                <input
                  type="text"
                  placeholder="Enter criminal name (e.g. Ramesh Kumar)"
                  value={formCriminalName}
                  onChange={(e) => setFormCriminalName(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.75rem', padding: '6px 8px', border: errors.name ? '1px solid hsl(var(--color-rose))' : '1px solid hsl(var(--border-color))', borderRadius: '6px', background: 'hsl(var(--bg-primary))', color: 'white' }}
                />
                {errors.name && <span style={{ color: 'hsl(var(--color-rose))', fontSize: '0.65rem' }}>{errors.name}</span>}
              </label>

              {/* Alias */}
              <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Alias</span>
                <input
                  type="text"
                  placeholder="Enter alias (e.g. Ramu)"
                  value={formAlias}
                  onChange={(e) => setFormAlias(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.75rem', padding: '6px 8px', border: '1px solid hsl(var(--border-color))', borderRadius: '6px', background: 'hsl(var(--bg-primary))', color: 'white' }}
                />
              </label>

              {/* Age & Gender */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Age</span>
                  <input
                    type="number"
                    placeholder="e.g. 28"
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    className="input-control"
                    style={{ fontSize: '0.75rem', padding: '6px 8px', border: errors.age ? '1px solid hsl(var(--color-rose))' : '1px solid hsl(var(--border-color))', borderRadius: '6px', background: 'hsl(var(--bg-primary))', color: 'white' }}
                  />
                  {errors.age && <span style={{ color: 'hsl(var(--color-rose))', fontSize: '0.65rem' }}>{errors.age}</span>}
                </label>

                <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Gender</span>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="input-control"
                    style={{ fontSize: '0.75rem', padding: '6px 8px', border: '1px solid hsl(var(--border-color))', borderRadius: '6px', background: 'hsl(var(--bg-primary))', color: 'white' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </label>
              </div>

              {/* Related To (Searchable Dropdown) */}
              <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Related To *</span>
                <input
                  type="text"
                  placeholder="🔍 Search suspect in active network..."
                  value={suspectSearch}
                  onChange={(e) => setSuspectSearch(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.75rem', padding: '5px 8px', border: '1px solid hsl(var(--border-color))', borderRadius: '6px', background: 'hsl(var(--bg-primary))', color: 'white', marginBottom: '2px' }}
                />
                <select
                  value={formRelatedTo}
                  onChange={(e) => setFormRelatedTo(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.75rem', padding: '6px 8px', border: errors.relatedTo ? '1px solid hsl(var(--color-rose))' : '1px solid hsl(var(--border-color))', borderRadius: '6px', background: 'hsl(var(--bg-primary))', color: 'white' }}
                >
                  <option value="">-- Select Related Suspect --</option>
                  {matchingRelations.map(n => (
                    <option key={n.id} value={n.id}>
                      {n.name} {n.label ? `(${n.label})` : ""}
                    </option>
                  ))}
                </select>
                {errors.relatedTo && <span style={{ color: 'hsl(var(--color-rose))', fontSize: '0.65rem' }}>{errors.relatedTo}</span>}
              </label>

              {/* Relationship Type */}
              <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Relationship Type *</span>
                <select
                  value={formRelationshipType}
                  onChange={(e) => setFormRelationshipType(e.target.value)}
                  className="input-control"
                  style={{ fontSize: '0.75rem', padding: '6px 8px', border: errors.relationshipType ? '1px solid hsl(var(--color-rose))' : '1px solid hsl(var(--border-color))', borderRadius: '6px', background: 'hsl(var(--bg-primary))', color: 'white' }}
                >
                  <option value="Associate">Associate</option>
                  <option value="Accomplice">Accomplice</option>
                  <option value="Gang Member">Gang Member</option>
                  <option value="Leader">Leader</option>
                  <option value="Follower">Follower</option>
                  <option value="Family">Family</option>
                  <option value="Financial Associate">Financial Associate</option>
                  <option value="Weapon Supplier">Weapon Supplier</option>
                  <option value="Victim">Victim</option>
                  <option value="Witness">Witness</option>
                  <option value="Rival">Rival</option>
                  <option value="Unknown">Unknown</option>
                  <option value="Other">Other (Custom)...</option>
                </select>
                {errors.relationshipType && <span style={{ color: 'hsl(var(--color-rose))', fontSize: '0.65rem' }}>{errors.relationshipType}</span>}
              </label>

              {/* Custom Relationship Type (If Other selected) */}
              {formRelationshipType === "Other" && (
                <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>Custom Relationship Type *</span>
                  <input
                    type="text"
                    placeholder="Enter custom relationship (e.g. Weapon Supplier)"
                    value={formCustomRelationship}
                    onChange={(e) => setFormCustomRelationship(e.target.value)}
                    className="input-control"
                    style={{ fontSize: '0.75rem', padding: '6px 8px', border: errors.customRelationship ? '1px solid hsl(var(--color-rose))' : '1px solid hsl(var(--border-color))', borderRadius: '6px', background: 'hsl(var(--bg-primary))', color: 'white' }}
                  />
                  {errors.customRelationship && <span style={{ color: 'hsl(var(--color-rose))', fontSize: '0.65rem' }}>{errors.customRelationship}</span>}
                </label>
              )}

              {/* Relationship Details */}
              <label style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>Relationship Details</span>
                <textarea
                  placeholder="Describe how this person is connected to the selected suspect..."
                  value={formRelationshipDetails}
                  onChange={(e) => setFormRelationshipDetails(e.target.value)}
                  className="input-control"
                  rows="3"
                  style={{ fontSize: '0.75rem', padding: '6px 8px', border: '1px solid hsl(var(--border-color))', borderRadius: '6px', background: 'hsl(var(--bg-primary))', color: 'white', resize: 'vertical' }}
                />
              </label>

            </div>

            {/* Modal Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid hsl(var(--border-color))', cursor: 'pointer', background: 'transparent', color: 'white' }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSaveCriminal}
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px', background: 'hsl(var(--color-indigo))', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {modalMode === "add" ? "Add Criminal" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Overlay */}
      {isDeleteConfirmOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050
        }}>
          <div style={{
            background: 'hsl(var(--bg-card))',
            border: '1px solid hsla(var(--color-rose), 0.3)',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '380px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.15s ease-out'
          }}>
            <h4 style={{ fontSize: '1rem', color: 'hsl(var(--color-rose))', margin: 0, fontWeight: 'bold' }}>
              ⚠️ Remove Criminal?
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', margin: 0, lineHeight: '1.4' }}>
              Are you sure you want to remove <strong>{selectedSuspect.name}</strong> and their relationship from the selected FIR network?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.72rem', borderRadius: '6px', border: '1px solid hsl(var(--border-color))', cursor: 'pointer', background: 'transparent', color: 'white' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCriminal}
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.72rem', borderRadius: '6px', background: 'hsl(var(--color-rose))', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Alert */}
      {successNotification && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'hsl(var(--color-teal))',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          zIndex: 1100,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.3s ease-in-out',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>✓</span>
          <span>{successNotification}</span>
        </div>
      )}

    </div>
  );
}
