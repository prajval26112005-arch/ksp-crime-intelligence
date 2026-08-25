import React, { useState, useRef, useEffect } from 'react';

// Custom SVG Icons
const IconMic = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
);

const IconSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const IconPrint = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
);

const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

const IconVolume2 = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
);

const IconVolumeX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
);

export default function ChatbotPanel({ user, addAuditLog }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      textEnglish: 'Welcome to SCRB Conversational AI. Enter a query to scan the Karnataka Crime Database. I can respond in English and Kannada.',
      textKannada: 'ಕೆಎಸ್‌ಪಿ ಸಂಭಾಷಣಾ ಎಐಗೆ ಸುಸ್ವಾಗತ. ಕರ್ನಾಟಕ ಅಪರಾಧ ದಾಖಲೆಗಳ ಡೇಟಾಬೇಸ್ ಅನ್ನು ಹುಡುಕಲು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ.',
      explainableAI: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState('English'); // English or Kannada
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingEnabled, setIsSpeakingEnabled] = useState(false);
  const [selectedAIExplain, setSelectedAIExplain] = useState(null);
  const [voiceError, setVoiceError] = useState('');
  const [apiError, setApiError] = useState('');
  const [activeContext, setActiveContext] = useState(null);
  
  // API Key states
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('VITE_GEMINI_API_KEY') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showKeyText, setShowKeyText] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isBotTyping]);

  // Clean up any active speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const presetSuggestions = [
    { text: 'Rowdy Raju network', query: 'rowdy raju gang network' },
    { text: 'Bengaluru hotspots', query: 'bengaluru hotspots' },
    { text: 'Unemployment correlation', query: 'unemployment correlation' },
    { text: 'Extortion case details', query: 'show case 10443' },
    { text: 'Laundering money trails', query: 'financial money trails' }
  ];

  // Helper to trigger Text-to-Speech
  const speakText = (text) => {
    if (!isSpeakingEnabled || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'Kannada') {
      utterance.lang = 'kn-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    window.speechSynthesis.speak(utterance);
  };

  const callGeminiAPI = async (resolvedQuery) => {
    const startTime = Date.now();
    const systemPrompt = `
You are the Karnataka State Police (KSP) Crime Intelligence Assistant.
You have access to a simulated CCTNS (Crime and Criminal Tracking Network & Systems) relational database.

DATABASE SCHEMA:
1. CaseMaster (CaseNo, CrimeNo, District, UnitName, Sections, Accused, Victims, Status, BriefFacts)
2. Accused (AccusedID, AccusedName, AgeYear, Gender, Alias, ArrestsCount, ModusOperandi, RiskScore, RecidivismTier, ActiveArea)
3. BankAccounts (BankName, BranchName, AccountNo, Balance, RiskFlag, OwnerName)

KNOWN DATA INSIGHTS (Grounded Entities):
- Rowdy Raju: Real Name: Raju Gowda. Alias: "Rowdy Raju". Age: 34. Modus Operandi: Violent Extortion. Risk: 88 (Critical). Active Area: Bengaluru Urban (Majestic). Arrests: 14. Accounts: SBI Majestic (Bal: ₹2,500,000, Flag: RED). Case: FIR 10443 (CR-14/2026, Jayanagar PS).
- Kiran Tech: Real Name: Kiran Kumar. Alias: "Kiran Tech". Age: 26. Modus Operandi: Cyber Phishing & Money Laundering. Risk: 40 (Low). Active Area: Bengaluru Urban (Whitefield). Arrests: 1. Accounts: HDFC Whitefield (Bal: ₹7,800,000, Flag: RED). Case: FIR 20261 (CR-32/2026, Whitefield Cyber PS).
- Tiger Naga: Real Name: Nagaraj Naik. Alias: "Tiger Naga". Age: 45. Modus Operandi: Armed Robbery. Risk: 95 (Critical). Active Area: Mysuru & Kalaburagi. Arrests: 22. Case: FIR 10444 (CR-88/2025).
- Sunil Fence: Real Name: Sunil Gowda. Alias: "Sunil Fence". Age: 41. Modus Operandi: Burglary & Fencing Stolen Goods. Risk: 62 (High). Active Area: Tumakuru (Kyathsandra). Arrests: 7. Case: FIR 10445 (CR-12/2026).
- Sameer: Real Name: Sameer Khan. Alias: "Sameer Chhota". Age: 29. Modus Operandi: Chain Snatching. Risk: 78 (High). Active Area: Kalaburagi (Super Market). Arrests: 9. Case: FIR 30810 (CR-95/2026, Super Market PS).

INSTRUCTIONS:
1. Answer the user's query in both English (textEnglish) and Kannada (textKannada).
2. The response must sound professional, administrative, and helpful to a police investigator.
3. Translate names and technical terms accurately in Kannada (e.g. Rowdy Raju -> ರೌಡಿ ರಾಜು, Extortion -> ಸುಲಿಗೆ/ಬೆದರಿಕೆ, Active Investigation -> ಸಕ್ರಿಯ ತನಿಖೆ).
4. Provide a valid SQL query that would retrieve the relevant data (sqlQuery) based on the schemas above.
5. Provide a confidence score (confidenceScore) between 0.0 and 1.0.
6. List the tables queried in sourcesAudited (e.g. "CaseMaster, Accused").
7. Name the rules or logical paths evaluated in rulesTriggered (e.g. "Semantic Offender Lookup").

Return EXACTLY a JSON object with these keys:
{
  "textEnglish": "string response",
  "textKannada": "ಕನ್ನಡದಲ್ಲಿ ಪ್ರತಿಕ್ರಿಯೆ",
  "sqlQuery": "SELECT ...",
  "confidenceScore": 0.95,
  "rulesTriggered": "rules evaluated description",
  "sourcesAudited": "tables audited"
}
Do not wrap in markdown block, return raw JSON string. Do not include any text before or after the JSON.
`;

    const prompt = `${systemPrompt}\nUser Query: ${resolvedQuery}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );
    const data = await response.json();

    // Safe parsing with error checking
    if (data.error) {
      throw new Error(data.error.message);
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response from Gemini");
    }

    const reply = data.candidates[0].content.parts[0].text;

    let cleanedReply = reply.trim();
    if (cleanedReply.startsWith("```")) {
      cleanedReply = cleanedReply.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const jsonParsed = JSON.parse(cleanedReply);
    const executionTimeMs = Date.now() - startTime;

    return {
      sender: 'bot',
      textEnglish: jsonParsed.textEnglish,
      textKannada: jsonParsed.textKannada,
      explainableAI: {
        sqlQuery: jsonParsed.sqlQuery || '-- No Query Generated',
        confidenceScore: typeof jsonParsed.confidenceScore === 'number' ? jsonParsed.confidenceScore : 0.9,
        rulesTriggered: jsonParsed.rulesTriggered || 'Generative NLP Inference',
        sourcesAudited: jsonParsed.sourcesAudited || 'CCTNS Database Schema',
        executionTimeMs: executionTimeMs
      }
    };
  };

  const handleSearch = (queryText) => {
    if (!queryText.trim()) return;
    setApiError('');

    const originalQuery = queryText;
    let processedQuery = queryText.toLowerCase();

    // Context Resolution Engine
    let contextResolvedQuery = originalQuery;
    let contextResolutionMessage = "";

    if (activeContext) {
      const pronouns = ["he", "his", "him", "she", "her", "they", "them", "status", "timeline", "similar", "leads", "profile", "network", "there"];
      const containsPronouns = pronouns.some(p => processedQuery.split(/\s+/).includes(p));

      if (containsPronouns) {
        if (activeContext.type === 'offender') {
          // Resolve pronouns to the active offender
          contextResolvedQuery = originalQuery.replace(/\b(he|his|him|profile|network)\b/gi, activeContext.name);
          contextResolutionMessage = `Resolved "he/his/profile" to active context: ${activeContext.name}`;
        } else if (activeContext.type === 'case') {
          // Resolve pronouns to the active case
          contextResolvedQuery = originalQuery + ` for case ${activeContext.name}`;
          contextResolutionMessage = `Resolved follow-up query to active case context: ${activeContext.name}`;
        } else if (activeContext.type === 'location') {
          // Resolve pronouns to the active location
          contextResolvedQuery = originalQuery.replace(/\b(there|location|hotspots)\b/gi, activeContext.name);
          contextResolutionMessage = `Resolved "there/location" to active area context: ${activeContext.name}`;
        }
      }
    }

    // User message
    const newMessages = [...messages, {
      sender: 'user',
      textEnglish: originalQuery,
      textKannada: originalQuery,
      contextNotification: contextResolutionMessage
    }];
    setMessages(newMessages);
    setInputValue('');

    addAuditLog(`Chatbot query: "${originalQuery}" (Context Resolved: "${contextResolvedQuery}")`);

    setIsBotTyping(true);
    callGeminiAPI(contextResolvedQuery)
      .then((botMessage) => {
        setIsBotTyping(false);
        setMessages(prev => [...prev, botMessage]);
        if (botMessage.explainableAI) {
          setSelectedAIExplain(botMessage.explainableAI);
        }

        // Context detection
        let newContext = null;
        const lowerResponse = botMessage.textEnglish.toLowerCase();
        if (lowerResponse.includes("raju") || lowerResponse.includes("rowdy")) {
          newContext = { type: 'offender', name: 'Rowdy Raju', id: 'off_01' };
        } else if (lowerResponse.includes("kiran") || lowerResponse.includes("tech")) {
          newContext = { type: 'offender', name: 'Kiran Tech', id: 'off_06' };
        } else if (lowerResponse.includes("sunil") || lowerResponse.includes("fence")) {
          newContext = { type: 'offender', name: 'Sunil Fence', id: 'off_03' };
        } else if (lowerResponse.includes("tiger") || lowerResponse.includes("naga")) {
          newContext = { type: 'offender', name: "Tiger Naga", id: 'off_02' };
        } else if (lowerResponse.includes("sameer") || lowerResponse.includes("chhota")) {
          newContext = { type: 'offender', name: "Sameer 'Chhota'", id: 'off_05' };
        } else if (lowerResponse.includes("bengaluru") || lowerResponse.includes("bangalore")) {
          newContext = { type: 'location', name: 'Bengaluru Urban', id: 'Bengaluru Urban' };
        } else if (lowerResponse.includes("kalaburagi")) {
          newContext = { type: 'location', name: 'Kalaburagi', id: 'Kalaburagi' };
        }

        if (newContext) {
          setActiveContext(newContext);
        }

        const speakTextStr = language === 'English' ? botMessage.textEnglish : botMessage.textKannada;
        speakText(speakTextStr);
      })
      .catch((err) => {
        console.error("Gemini API error:", err);
        setApiError(`Gemini API Error: ${err.message}`);
        setIsBotTyping(false);
      });
  };

  const handleVoiceSearch = () => {
    setVoiceError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = language === 'English' ? 'en-IN' : 'kn-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setInputValue(speechToText);
        handleSearch(speechToText);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone access denied. Please allow microphone permission.');
        } else {
          setVoiceError(`Voice input issue: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setVoiceError('Failed to initialize speech recognition.');
      setIsListening(false);
    }
  };

  const handlePrint = () => {
    addAuditLog(`Exported Chatbot Dossier Report as PDF`);
    
    const printInfoDiv = document.createElement("div");
    printInfoDiv.id = "print-ksp-meta";
    printInfoDiv.style.display = "none";
    printInfoDiv.innerHTML = `
      <div style="text-align: center; border-bottom: 2px double #000; padding-bottom: 10px; margin-bottom: 20px;">
        <h1 style="font-size: 20px; font-weight: bold; text-transform: uppercase;">Karnataka State Police</h1>
        <h2 style="font-size: 14px; font-weight: bold; margin-top: 5px;">State Crime Records Bureau (SCRB) - Intelligence Assessment</h2>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 10px; font-family: monospace;">
          <span>Officer: ${user.username} (${user.role})</span>
          <span>Date Executed: ${new Date().toLocaleString()}</span>
          <span>Classification: SECURE/CONFIDENTIAL</span>
        </div>
      </div>
    `;
    
    document.body.prepend(printInfoDiv);
    window.print();
    document.getElementById("print-ksp-meta")?.remove();
  };

  const hasApiKey = apiKey || (import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== 'PASTE_YOUR_KEY_HERE');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', height: 'calc(100vh - 120px)', minHeight: '520px' }}>
      
      {/* Left Pane: Chat Window */}
      <div className="glass-panel print-area" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.25rem', overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '0.75rem', borderBottom: '1px solid hsl(var(--border-color))', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              Conversational Crime Intelligence
              <span className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>v3.5 Active</span>
            </h3>
            <span style={{ display: 'block', fontSize: '0.75rem', color: 'hsl(var(--text-muted))', marginTop: '4px' }}>Integrated natural language parsing & case dossier extraction</span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            
            {/* API Key Toggle Button */}
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="btn btn-secondary"
              style={{
                padding: '4px 8px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: hasApiKey ? '1px solid hsla(var(--color-teal), 0.5)' : '1px solid hsl(var(--border-color))',
                background: hasApiKey ? 'hsla(var(--color-teal), 0.1)' : 'transparent',
                color: hasApiKey ? 'hsl(var(--color-teal))' : 'hsl(var(--text-primary))'
              }}
              title="Configure Gemini API Key"
            >
              <span>🔑</span>
              <span>{hasApiKey ? 'Live AI Mode' : 'Configure Key'}</span>
            </button>

            {/* Audio Feedback Toggle */}
            <button
              onClick={() => {
                const newState = !isSpeakingEnabled;
                setIsSpeakingEnabled(newState);
                if (!newState && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`btn btn-secondary`}
              style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Toggle Audio Voice Response"
            >
              {isSpeakingEnabled ? <IconVolume2 style={{ color: 'hsl(var(--color-teal))' }} /> : <IconVolumeX />}
              <span>Voice</span>
            </button>

            {/* Language Toggle */}
            <div style={{ display: 'inline-flex', background: 'hsl(var(--bg-primary))', borderRadius: '8px', padding: '2px', border: '1px solid hsl(var(--border-color))' }}>
              {['English', 'ಕನ್ನಡ'].map((lang) => {
                const isSelected = (lang === 'English' && language === 'English') || (lang === 'ಕನ್ನಡ' && language === 'Kannada');
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang === 'English' ? 'English' : 'Kannada');
                      addAuditLog(`Switched Chatbot language to: ${lang}`);
                    }}
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: isSelected ? 'hsl(var(--color-indigo))' : 'transparent',
                      color: isSelected ? 'white' : 'hsl(var(--text-secondary))',
                      fontWeight: isSelected ? '600' : '400',
                      transition: 'all 0.2s'
                    }}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>

            {/* Print/PDF button */}
            <button 
              className="btn btn-secondary" 
              onClick={handlePrint}
              style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
              title="Print / Export Chat as PDF"
            >
              <IconPrint />
              PDF Export
            </button>
          </div>
        </div>

        {/* API Key Configuration Dropdown */}
        {showApiKeyInput && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            background: 'hsla(var(--bg-card-hover), 0.2)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid hsl(var(--border-color))',
            marginBottom: '1rem',
            animation: 'fadeIn 0.2s ease-in-out'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))', whiteSpace: 'nowrap' }}>Gemini Key:</span>
            <input
              type={showKeyText ? 'text' : 'password'}
              placeholder="Paste Gemini API Key (saved in browser local storage or read from .env)..."
              value={apiKey}
              onChange={(e) => {
                const val = e.target.value.trim();
                setApiKey(val);
                if (val) {
                  localStorage.setItem('VITE_GEMINI_API_KEY', val);
                } else {
                  localStorage.removeItem('VITE_GEMINI_API_KEY');
                }
              }}
              style={{
                flexGrow: 1,
                background: 'hsl(var(--bg-primary))',
                border: '1px solid hsl(var(--border-color))',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.75rem',
                color: 'white'
              }}
            />
            {apiKey && (
              <span style={{ fontSize: '0.65rem', color: 'hsl(var(--color-teal))', whiteSpace: 'nowrap', padding: '2px 4px', background: 'hsla(var(--color-teal), 0.1)', borderRadius: '4px', border: '1px solid hsla(var(--color-teal), 0.2)' }}>
                ✓ Auto-Saved
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowKeyText(!showKeyText)}
              className="btn btn-secondary"
              style={{ padding: '2px 8px', fontSize: '0.7rem' }}
            >
              {showKeyText ? 'Hide' : 'Show'}
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={() => {
                  setApiKey('');
                  localStorage.removeItem('VITE_GEMINI_API_KEY');
                  addAuditLog('Cleared Gemini API Key');
                }}
                className="btn btn-secondary"
                style={{ padding: '2px 8px', fontSize: '0.7rem', color: 'hsl(var(--color-rose))', border: '1px solid hsla(var(--color-rose), 0.3)' }}
              >
                Clear
              </button>
            )}
          </div>
        )}

        {apiError && (
          <div style={{
            color: 'hsl(var(--color-rose))',
            fontSize: '0.75rem',
            marginBottom: '1rem',
            padding: '8px 12px',
            background: 'hsla(var(--color-rose), 0.1)',
            borderRadius: '8px',
            border: '1px solid hsla(var(--color-rose), 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            animation: 'fadeIn 0.2s'
          }}>
            <span>⚠️ {apiError}</span>
            <button 
              onClick={() => setApiError('')} 
              style={{ background: 'none', border: 'none', color: 'hsl(var(--text-secondary))', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Conversation Logs */}
        <div style={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, index) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isBot ? 'flex-start' : 'flex-end'
              }}>
                {/* Context notification bubble if pronoun resolved */}
                {!isBot && msg.contextNotification && (
                  <span style={{ fontSize: '0.75rem', color: 'hsl(var(--color-cyan))', margin: '0 4px 2px 0', opacity: 0.8, fontStyle: 'italic' }}>
                    🕵️ {msg.contextNotification}
                  </span>
                )}
                
                <div style={{
                  maxWidth: '80%',
                  background: isBot ? 'hsla(var(--bg-card-hover), 0.5)' : 'hsl(var(--color-indigo))',
                  border: isBot ? '1px solid hsl(var(--border-color))' : 'none',
                  borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  padding: '0.85rem 1.1rem',
                  boxShadow: 'var(--shadow-sm)'
                }} className="message">
                  {/* Sender Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', fontSize: '0.75rem', color: isBot ? 'hsl(var(--color-cyan))' : 'rgba(255,255,255,0.7)', fontWeight: '600' }}>
                    <span>{isBot ? 'KSP Intelligence Assistant' : `${user.username} (${user.role})`}</span>
                    {isBot && msg.explainableAI && (
                      <button 
                        onClick={() => setSelectedAIExplain(msg.explainableAI)}
                        style={{ background: 'none', border: 'none', color: 'hsl(var(--text-muted))', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
                        title="View Explainable AI details"
                      >
                        <IconInfo />
                        Explain
                      </button>
                    )}
                  </div>

                  {/* Message Content */}
                  <p style={{ fontSize: '0.92rem', lineHeight: '1.5', color: isBot ? 'hsl(var(--text-primary))' : 'white', whiteSpace: 'pre-wrap' }}>
                    {language === 'English' ? msg.textEnglish : msg.textKannada}
                  </p>
                </div>
              </div>
            );
          })}
          {isBotTyping && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', animation: 'fadeIn 0.2s ease-in-out' }}>
              <div style={{
                maxWidth: '80%',
                background: 'hsla(var(--bg-card-hover), 0.5)',
                border: '1px dashed hsl(var(--border-color))',
                borderRadius: '16px 16px 16px 4px',
                padding: '0.85rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--color-cyan))', fontWeight: '600' }}>KSP AI Assistant is scanning CCTNS...</span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Floating Context Status Tracker */}
        {activeContext && (
          <div style={{
            background: 'hsla(var(--color-indigo), 0.08)',
            border: '1px dashed hsla(var(--color-indigo), 0.3)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            marginBottom: '0.75rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-rose" style={{ width: '6px', height: '6px', background: 'hsl(var(--color-indigo))' }} />
              Active Context Tracking: <strong style={{ color: 'white' }}>{activeContext.name}</strong> ({activeContext.type.toUpperCase()})
            </span>
            <button 
              onClick={() => {
                setActiveContext(null);
                addAuditLog('Cleared Chatbot context tracking');
              }}
              style={{ background: 'none', border: 'none', color: 'hsl(var(--color-rose))', cursor: 'pointer', fontWeight: 'bold' }}
              title="Reset query context"
            >
              Clear Context [Reset]
            </button>
          </div>
        )}

        {/* Preset Suggestions */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {presetSuggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSearch(item.query)}
              style={{
                background: 'hsla(var(--bg-card-hover), 0.3)',
                border: '1px solid hsl(var(--border-color))',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                color: 'hsl(var(--text-secondary))',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'hsl(var(--color-indigo))'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'hsl(var(--border-color))'; e.currentTarget.style.color = 'hsl(var(--text-secondary))'; }}
            >
              {item.text}
            </button>
          ))}
        </div>

        {/* Voice Error/Status Alert */}
        {voiceError && (
          <div style={{
            color: 'hsl(var(--color-rose))',
            fontSize: '0.75rem',
            marginBottom: '0.5rem',
            padding: '6px 10px',
            background: 'hsla(var(--color-rose), 0.1)',
            borderRadius: '6px',
            border: '1px solid hsla(var(--color-rose), 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>⚠️ {voiceError}</span>
            <button 
              onClick={() => setVoiceError('')} 
              style={{ background: 'none', border: 'none', color: 'hsl(var(--text-secondary))', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(inputValue); }} style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="input-control"
            placeholder={isListening ? 'Listening...' : activeContext ? `Ask follow-up details about ${activeContext.name}...` : 'Search FIR cases, offenders, hotspots, or economic correlations...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isListening}
            style={{ flexGrow: 1 }}
          />

          {/* Voice Mic Button */}
          <button
            type="button"
            className={`btn ${isListening ? 'btn-danger' : 'btn-secondary'} btn-icon`}
            onClick={handleVoiceSearch}
            style={{ width: '44px', height: '44px', flexShrink: 0 }}
            title="Voice recognition input"
          >
            {isListening ? (
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
              </div>
            ) : (
              <IconMic />
            )}
          </button>

          <button 
            type="submit" 
            className="btn btn-primary btn-icon" 
            style={{ width: '44px', height: '44px', flexShrink: 0 }}
            title="Submit Query"
          >
            <IconSend />
          </button>
        </form>

      </div>

      {/* Right Pane: Explainable AI details */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', borderBottom: '1px solid hsl(var(--border-color))', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconInfo />
          Explainable AI Reasoning Pathway
        </h3>

        {selectedAIExplain ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '0.82rem' }}>
            
            {/* Visual Reasoning Node Tree */}
            <div>
              <span style={{ color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '0.4rem' }}>Reasoning Validation Path</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'hsla(var(--color-indigo), 0.1)', padding: '6px 10px', borderRadius: '6px', border: '1px solid hsla(var(--color-indigo), 0.2)' }}>
                  <span style={{ color: 'hsl(var(--color-indigo))', fontWeight: 'bold' }}>1</span>
                  <span><strong>NLP Intent Parser:</strong> Extracted Named Entities & parameters</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'hsla(var(--color-cyan), 0.1)', padding: '6px 10px', borderRadius: '6px', border: '1px solid hsla(var(--color-cyan), 0.2)' }}>
                  <span style={{ color: 'hsl(var(--color-cyan))', fontWeight: 'bold' }}>2</span>
                  <span><strong>Database Router:</strong> Routed to: {selectedAIExplain.sourcesAudited.split(', ')[0]} table</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'hsla(var(--color-teal), 0.1)', padding: '6px 10px', borderRadius: '6px', border: '1px solid hsla(var(--color-teal), 0.2)' }}>
                  <span style={{ color: 'hsl(var(--color-teal))', fontWeight: 'bold' }}>3</span>
                  <span><strong>Logic Rule Validation:</strong> {selectedAIExplain.rulesTriggered.split(' -> ')[0]}</span>
                </div>
              </div>
            </div>

            <div>
              <span style={{ color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '0.25rem' }}>Calculated Confidence Metric</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ flexGrow: 1, height: '8px', background: 'hsl(var(--bg-primary))', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: 'hsl(var(--color-teal))', width: `${selectedAIExplain.confidenceScore * 100}%` }} />
                </div>
                <span style={{ fontWeight: 'bold', color: 'hsl(var(--color-teal))' }}>{(selectedAIExplain.confidenceScore * 100).toFixed(0)}% Confidence</span>
              </div>
            </div>

            <div>
              <span style={{ color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '0.25rem' }}>KSP Relational Schema Query</span>
              <pre style={{
                background: 'hsl(var(--bg-primary))',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid hsl(var(--border-color))',
                color: 'hsl(var(--color-cyan))',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedAIExplain.sqlQuery}
              </pre>
            </div>

            <div>
              <span style={{ color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '0.25rem' }}>Evaluated Context Rules</span>
              <p style={{ color: 'white', fontWeight: '500' }}>
                {selectedAIExplain.rulesTriggered}
              </p>
            </div>

            <div>
              <span style={{ color: 'hsl(var(--text-muted))', display: 'block', marginBottom: '0.25rem' }}>Audited Sources (Traceability Trail)</span>
              <p style={{ fontFamily: 'monospace', color: 'hsl(var(--color-amber))', fontWeight: '600' }}>
                {selectedAIExplain.sourcesAudited}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid hsl(var(--border-color))', paddingTop: '0.75rem', fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
              <span>Execution Time: <strong>{selectedAIExplain.executionTimeMs} ms</strong></span>
              <span>Standard: <strong>KSP-XAI-v3.0 (Strict Compliance)</strong></span>
            </div>
          </div>
        ) : (
          <div style={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: 'hsl(var(--text-muted))',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <IconInfo style={{ width: '40px', height: '40px', opacity: 0.3, marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.85rem' }}>Select the <strong>"Explain"</strong> link on any response bubble to load the complete intelligence path auditing trail here.</p>
          </div>
        )}
      </div>

    </div>
  );
}
