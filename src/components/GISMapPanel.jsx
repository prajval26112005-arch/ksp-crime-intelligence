import React, { useState, useEffect, useRef } from 'react';
import { districtsData, mockFIRs, accusedProfiles } from '../data/mockData';

// Custom SVG Icons
const IconMapPin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

export default function GISMapPanel({ addAuditLog }) {
  const [selectedDistrict, setSelectedDistrict] = useState("Bengaluru Urban");
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchPin, setSearchPin] = useState(null);

  // Track simulated active patrols and cooled down risk scores
  const [dispatchedPatrols, setDispatchedPatrols] = useState({});
  const [districtRiskScores, setDistrictRiskScores] = useState({
    "Bengaluru Urban": districtsData["Bengaluru Urban"].riskScore,
    "Mysuru": districtsData["Mysuru"].riskScore,
    "Dharwad": districtsData["Dharwad"].riskScore,
    "Dakshina Kannada": districtsData["Dakshina Kannada"].riskScore,
    "Belagavi": districtsData["Belagavi"].riskScore,
    "Kalaburagi": districtsData["Kalaburagi"].riskScore,
  });

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const activeDistrictInfo = districtsData[selectedDistrict] || districtsData["Bengaluru Urban"];
  const currentRiskScore = districtRiskScores[selectedDistrict] || activeDistrictInfo.riskScore;

  // Active district coordinate pointers
  const districtCenters = {
    "Bengaluru Urban": [12.9716, 77.5946],
    "Mysuru": [12.2958, 76.6394],
    "Dharwad": [15.3524, 75.1384],
    "Dakshina Kannada": [12.8732, 74.8433],
    "Belagavi": [15.8497, 74.4977],
    "Kalaburagi": [17.3308, 76.8375]
  };

  // Detailed street-level hotspots coordinates inside Bengaluru
  const bengaluruHotspots = [
    { name: "Majestic Bus Stand Area", type: "Pickpocketing & Transit Theft", lat: 12.9779, lng: 77.5724, cases: ["Wallet theft rings", "Device stealing"], suspects: ["Sameer 'Chhota'"] },
    { name: "Jayanagar 4th Block", type: "Armed Chain Snatching & Extortion", lat: 12.9279, lng: 77.5904, cases: ["FIR 10443 (Protection money)"], suspects: ["Rowdy Raju", "Nagaraja 'Tiger'"] },
    { name: "Whitefield Tech Corridor", type: "Cyber Fraud & AePS Phishing", lat: 12.9698, lng: 77.7499, cases: ["FIR 20261 (OTP Spoofing)"], suspects: ["Kiran 'Tech'"] },
    { name: "Indiranagar 100ft Road", type: "Public Nuisance & DUI", lat: 12.9631, lng: 77.6397, cases: ["Late night racing", "DUI logs"], suspects: ["Local accomplices"] }
  ];

  // Initialize Leaflet map (Once)
  useEffect(() => {
    if (!mapContainerRef.current || !window.L || mapInstanceRef.current) return;

    try {
      // Centered on Karnataka, zoom 7 with hardware acceleration and dragging enabled
      mapInstanceRef.current = window.L.map(mapContainerRef.current, {
        dragging: true,
        zoomControl: true,
        scrollWheelZoom: true,
        touchZoom: true,
        fadeAnimation: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
        inertia: true
      }).setView([15.3173, 75.7139], 7);
      
      // Load dark mode tile layer for premium look
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapInstanceRef.current);

      setIsMapLoaded(true);
      addAuditLog("Initialized Interactive Leaflet GIS mapping projection");
    } catch (e) {
      console.error("Failed to initialize Leaflet Map:", e);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Invalidate size to ensure dragging and panning works perfectly immediately
  useEffect(() => {
    if (isMapLoaded && mapInstanceRef.current) {
      const timer = setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isMapLoaded]);

  // Render Markers on selected district or zoom changes
  useEffect(() => {
    if (!isMapLoaded || !mapInstanceRef.current || !window.L) return;

    // Clear existing markers (excluding the search pin if active)
    markersRef.current.forEach(marker => {
      if (marker !== searchPin) marker.remove();
    });
    markersRef.current = searchPin ? [searchPin] : [];

    // Redraw District Markers
    Object.entries(districtCenters).forEach(([name, coords]) => {
      const isSelected = selectedDistrict === name;
      const risk = districtRiskScores[name] || districtsData[name].riskScore;
      const patrolled = dispatchedPatrols[name];

      const color = patrolled ? 'teal' : risk > 75 ? 'rose' : risk > 50 ? 'orange' : 'green';

      const customIcon = window.L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: ${isSelected ? 'white' : 'transparent'}; border: 2.5px solid ${color === 'rose' ? '#F43F5E' : color === 'orange' ? '#F59E0B' : color === 'teal' ? '#0D9488' : '#10B981'}; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px ${color === 'rose' ? '#F43F5E' : '#10B981'};"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = window.L.marker(coords, { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .on('click', () => {
          handleDistrictSelect(name);
        });

      const localPS = districtsData[name]?.stations?.join(", ") || "Local Outposts";
      marker.bindPopup(`
        <div style="color: black; font-family: sans-serif; font-size: 11px;">
          <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold;">${name} District</h4>
          <span style="font-weight: bold; color: ${risk > 75 ? '#F43F5E' : '#0D9488'}">Threat Risk: ${risk}%</span><br/>
          <span style="display: block; margin-top: 4px;"><b>Police Stations:</b> ${localPS}</span>
          ${patrolled ? '<span style="color: #0D9488; font-weight: bold; display: block; margin-top: 4px;">🛡️ Preventive Patrol Force Active</span>' : ''}
        </div>
      `);

      markersRef.current.push(marker);
    });

    // Draw street level hotspots if selected Bengaluru Urban
    if (selectedDistrict === "Bengaluru Urban") {
      bengaluruHotspots.forEach(hot => {
        const customIcon = window.L.divIcon({
          className: 'custom-street-marker',
          html: `<div style="border: 2px solid #EF4444; background: rgba(239, 68, 68, 0.4); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; box-shadow: 0 0 12px #EF4444;" class="pulse-marker-anim">🚨</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });

        const marker = window.L.marker([hot.lat, hot.lng], { icon: customIcon })
          .addTo(mapInstanceRef.current);

        marker.bindPopup(`
          <div style="color: black; font-family: sans-serif; font-size: 11px; width: 180px;">
            <h4 style="margin: 0 0 4px 0; color: #EF4444; font-size: 12px; font-weight: bold;">🚨 ${hot.name}</h4>
            <b>Threat MO:</b> ${hot.type}<br/>
            <b>Complaints:</b> ${hot.cases.join(", ")}<br/>
            <span style="color: #EF4444; font-weight: bold;">Suspects: ${hot.suspects.join(", ")}</span>
          </div>
        `);

        markersRef.current.push(marker);
      });
    }

  }, [isMapLoaded, selectedDistrict, districtRiskScores, dispatchedPatrols, searchPin]);

  const handleDistrictSelect = (name) => {
    setSelectedDistrict(name);
    addAuditLog(`Focused GIS viewport coordinates to district: ${name}`);

    const coords = districtCenters[name];
    if (coords && mapInstanceRef.current) {
      const zoom = name === "Bengaluru Urban" ? 13 : 9; // Zoom deep to show streets
      mapInstanceRef.current.setView(coords, zoom, { animate: true, duration: 1.2 });
    }
  };

  // geocode search via OSM Nominatim API
  const handleGeocodeSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    addAuditLog(`Initiated Nominatim geocode search for: "${searchQuery}"`);

    try {
      // Append Karnataka to query to keep search focused locally
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}+Karnataka&format=json&limit=1`;
      const res = await fetch(url);
      const results = await res.json();

      if (results && results.length > 0) {
        const { lat, lon, display_name } = results[0];
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        addAuditLog(`OSM Geocoder resolved "${searchQuery}" to [${latitude}, ${longitude}]`);

        if (mapInstanceRef.current) {
          // Fly to the coordinates smoothly
          mapInstanceRef.current.flyTo([latitude, longitude], 14, { duration: 1.5 });

          // Remove old search pin if it exists
          if (searchPin) {
            searchPin.remove();
          }

          // Create new search pin
          const pinIcon = window.L.divIcon({
            className: 'custom-search-pin',
            html: `<div style="border: 2.5px solid #3B82F6; background: rgba(59, 130, 246, 0.4); width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; box-shadow: 0 0 12px #3B82F6;">📍</div>`,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });

          const newSearchPin = window.L.marker([latitude, longitude], { icon: pinIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`
              <div style="color: black; font-family: sans-serif; font-size: 11px; width: 190px;">
                <h4 style="margin: 0 0 4px 0; color: #3B82F6; font-size: 12px; font-weight: bold;">📍 Search Marker</h4>
                <p style="margin: 0; line-height: 1.35;">${display_name}</p>
              </div>
            `)
            .openPopup();

          setSearchPin(newSearchPin);
        }
      } else {
        alert(`No coordinates found in Karnataka for "${searchQuery}". Please specify with taluk or district.`);
        addAuditLog(`OSM Geocoder failed to find results for: "${searchQuery}"`);
      }
    } catch (err) {
      console.error("Geocoding search failed:", err);
      alert("Failed to search geolocations. Please check network connection.");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleZoomToBengaluruStreets = () => {
    handleDistrictSelect("Bengaluru Urban");
  };

  const handleResetPatrols = () => {
    const resetScores = {};
    Object.keys(districtCenters).forEach(k => {
      resetScores[k] = districtsData[k]?.riskScore || 50;
    });
    setDistrictRiskScores(resetScores);
    setDispatchedPatrols({});
    setSearchQuery("");
    if (searchPin) {
      searchPin.remove();
      setSearchPin(null);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([15.3173, 75.7139], 7);
    }
    addAuditLog("Reset all district patrol deployments and returned map to home projections.");
  };

  const handleDispatchPatrol = () => {
    if (isDispatching || dispatchedPatrols[selectedDistrict]) return;

    setIsDispatching(true);
    addAuditLog(`Initiated emergency patrol dispatch request for: ${selectedDistrict}`);

    setTimeout(() => {
      setIsDispatching(false);
      setDispatchedPatrols(prev => ({ ...prev, [selectedDistrict]: true }));
      
      // Cooldown risk score simulatedly
      setDistrictRiskScores(prev => {
        const original = prev[selectedDistrict] || districtsData[selectedDistrict].riskScore;
        const reduced = Math.max(original - 25, 30);
        return { ...prev, [selectedDistrict]: reduced };
      });

      addAuditLog(`Patrol team deployed successfully to ${selectedDistrict}. Risk score lowered.`);
    }, 1500);
  };

  // Dial needle calculations
  const getDialNeedleAngle = (score) => {
    const percentage = score / 100;
    const angleRad = Math.PI * (percentage - 1);
    const length = 28;
    return {
      x: 40 + Math.cos(angleRad) * length,
      y: 40 + Math.sin(angleRad) * length
    };
  };

  const needleTarget = getDialNeedleAngle(currentRiskScore);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', height: 'calc(100vh - 120px)', minHeight: '520px' }}>
      
      {/* Left Pane: Interactive Leaflet Map div */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', padding: '0.75rem' }}>
        
        {/* Map Header Overlay */}
        <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 1000, background: 'rgba(7, 11, 19, 0.85)', padding: '6px 12px', borderRadius: '8px', border: '1px solid hsl(var(--border-color))' }}>
          <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', color: 'white' }}>Spatial Hotspots Map</h3>
          <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>OpenStreetMap Telemetry Projection</span>
        </div>

        {/* Nominatim Search Input Overlay */}
        <form 
          onSubmit={handleGeocodeSearch}
          style={{ 
            position: 'absolute', 
            top: '4.8rem', 
            left: '1.25rem', 
            zIndex: 1000, 
            display: 'flex', 
            gap: '6px',
            background: 'rgba(7, 11, 19, 0.85)',
            padding: '6px',
            borderRadius: '8px',
            border: '1px solid hsl(var(--border-color))'
          }}
        >
          <input
            type="text"
            placeholder="Search village, temple, street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ 
              padding: '4px 10px', 
              fontSize: '0.75rem', 
              background: 'rgba(7, 11, 19, 0.9)', 
              color: 'white',
              border: '1px solid hsl(var(--border-color))',
              borderRadius: '6px',
              width: '180px'
            }}
          />
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '4px 12px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '3px' }}
            disabled={searchLoading}
          >
            <IconSearch />
            {searchLoading ? "..." : "Search"}
          </button>
        </form>

        {/* Action Controls Overlay */}
        <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', zIndex: 1000, display: 'flex', gap: '6px' }}>
          <button 
            className="btn btn-secondary"
            onClick={handleZoomToBengaluruStreets}
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
            title="Zoom down to street-level hotspots in Bengaluru"
          >
            🔍 Zoom Bengaluru Streets
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={handleResetPatrols}
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
            title="Reset map views"
          >
            Reset
          </button>
        </div>

        {/* Map container DOM element */}
        <div 
          ref={mapContainerRef} 
          style={{ 
            height: '100%',
            minHeight: '380px',
            borderRadius: '12px', 
            background: 'hsl(var(--bg-primary))',
            zIndex: 1
          }} 
        />

        {/* Map Legend */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.72rem', color: 'hsl(var(--text-muted))', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', background: '#F43F5E', borderRadius: '50%' }} /> Severe Threats (&gt;75)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', background: '#F59E0B', borderRadius: '50%' }} /> Elevated Concern
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', background: '#0D9488', borderRadius: '50%' }} /> Patrolled/Safe Area
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>🚨</span> Street Hotspots
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>📍</span> Search Pin
          </div>
        </div>

      </div>

      {/* Right Pane: District Details & Anomaly Telemetry */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', padding: '1.25rem' }}>
        
        {/* District Title */}
        <div style={{ borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'hsl(var(--color-indigo))', fontWeight: 'bold' }}>GIS SPATIAL FOCUS</span>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', margin: '0.15rem 0' }}>
            {activeDistrictInfo.name}
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'hsl(var(--text-secondary))' }}>
            {activeDistrictInfo.kannadaName} District Command
          </p>
        </div>

        {/* Quick select list of active districts */}
        <div>
          <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '4px' }}>District Hotspots Selector</span>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {Object.keys(districtCenters).map(d => (
              <button
                key={d}
                onClick={() => handleDistrictSelect(d)}
                style={{
                  background: selectedDistrict === d ? 'hsl(var(--color-indigo))' : 'hsla(var(--bg-card-hover), 0.3)',
                  border: '1px solid hsl(var(--border-color))',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  color: selectedDistrict === d ? 'white' : 'hsl(var(--text-secondary))',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Threat Dial Gauge */}
        <div style={{ background: 'hsl(var(--bg-primary))', padding: '0.85rem', borderRadius: '12px', border: '1px solid hsl(var(--border-color))', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ position: 'relative', width: '80px', height: '48px', overflow: 'hidden' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', top: '0px' }}>
              <path
                d="M 10 40 A 30 30 0 0 1 70 40"
                fill="none"
                stroke="#17243B"
                strokeWidth="6"
              />
              <path
                d="M 10 40 A 30 30 0 0 1 70 40"
                fill="none"
                stroke={currentRiskScore > 75 ? 'hsl(var(--color-rose))' : currentRiskScore > 45 ? 'hsl(var(--color-amber))' : 'hsl(var(--color-teal))'}
                strokeWidth="6"
                strokeDasharray={`${(currentRiskScore / 100) * 94.2}, 188.4`}
              />
              <circle cx="40" cy="40" r="4" fill="white" />
              <line
                x1="40"
                y1="40"
                x2={needleTarget.x}
                y2={needleTarget.y}
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ transition: 'all 0.4s' }}
              />
            </svg>
          </div>

          <div style={{ fontSize: '0.8rem' }}>
            <span style={{ color: 'hsl(var(--text-muted))', display: 'block', fontSize: '0.7rem' }}>Model Threat Index</span>
            <strong style={{ fontSize: '1.1rem', color: currentRiskScore > 75 ? 'hsl(var(--color-rose))' : currentRiskScore > 45 ? 'hsl(var(--color-amber))' : 'hsl(var(--color-teal))' }}>
              {currentRiskScore}% Severity
            </strong>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'hsl(var(--text-secondary))' }}>
              {currentRiskScore > 75 ? '🔥 Severe Hazard Level' : currentRiskScore > 45 ? '⚠️ Elevated Concern' : '🛡️ Secured Level'}
            </span>
          </div>
        </div>

        {/* Preventative Patrol Dispatch */}
        <div style={{ background: 'hsla(var(--bg-card-hover), 0.2)', padding: '0.85rem', borderRadius: '10px', border: '1px solid hsl(var(--border-color))' }}>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '0.4rem', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconShield style={{ color: 'hsl(var(--color-indigo))' }} />
            Preventive Patrol Deployments
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.35', marginBottom: '0.75rem' }}>
            Deploy targeted law enforcement force. Lowers risk index dynamically based on deterrence index forecasting.
          </p>

          {dispatchedPatrols[selectedDistrict] ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'hsl(var(--color-teal))', fontSize: '0.78rem', background: 'hsla(var(--color-teal), 0.1)', border: '1px solid hsla(var(--color-teal), 0.2)', padding: '6px 10px', borderRadius: '6px' }}>
              <span>🛡️ Patrol deployed successfully. Risk cooled by 25 points.</span>
            </div>
          ) : (
            <button
              onClick={handleDispatchPatrol}
              disabled={isDispatching}
              className={`btn ${isDispatching ? 'btn-secondary' : 'btn-primary'}`}
              style={{ width: '100%', padding: '6px 12px', fontSize: '0.78rem', borderRadius: '6px' }}
            >
              {isDispatching ? 'Dispatching patrol units...' : '⚡ Dispatch Preventive Patrol Force'}
            </button>
          )}
        </div>

        {/* Hotspots list */}
        <div>
          <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconMapPin />
            Local Registered Hotspots
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {activeDistrictInfo.hotspots.map((hot, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'hsla(var(--bg-card-hover), 0.2)',
                  border: '1px solid hsl(var(--border-color))',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.78rem'
                }}
              >
                <div>
                  <span style={{ fontWeight: '600', color: 'white' }}>{hot.name}</span>
                  <span style={{ display: 'block', fontSize: '0.68rem', color: 'hsl(var(--text-muted))' }}>Type: {hot.type}</span>
                </div>
                <span className={`badge badge-${hot.level === 'High' ? 'rose' : hot.level === 'Medium' ? 'amber' : 'teal'}`} style={{ fontSize: '0.58rem', padding: '0px 4px' }}>
                  {hot.level}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
