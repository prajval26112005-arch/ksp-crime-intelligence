import React, { useState, useRef, useEffect } from 'react';
import { mockChatBotResponses, getFallbackResponse, accusedProfiles, mockFIRs, districtsData, financialTransactions } from '../data/mockData';

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
  
  // Sliding Context Stack: type = 'offender' | 'case' | 'location', name = '...', id = '...'
  const [activeContext, setActiveContext] = useState(null);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    
    // Cancel current speaking
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'Kannada') {
      utterance.lang = 'kn-IN';
    } else {
      utterance.lang = 'en-IN'; // Indian-English accent
    }
    window.speechSynthesis.speak(utterance);
  };

  const handleSearch = (queryText) => {
    if (!queryText.trim()) return;

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

    // AI Logic search
    setTimeout(() => {
      const lowerResolved = contextResolvedQuery.toLowerCase();
      let matchedResponse = null;
      let newContext = null;

      // 1. Check for specific Case IDs
      if (lowerResolved.includes("10443") || lowerResolved.includes("extortion case")) {
        matchedResponse = mockChatBotResponses.find(r => r.keywords.includes("fir 10443"));
        newContext = { type: 'case', name: '10443', id: 'FIR_10443' };
      } else if (lowerResolved.includes("20261") || lowerResolved.includes("cyber case")) {
        matchedResponse = mockChatBotResponses.find(r => r.keywords.includes("fir 20261"));
        newContext = { type: 'case', name: '20261', id: 'FIR_20261' };
      } else if (lowerResolved.includes("30810") || lowerResolved.includes("chain snatching")) {
        // Build a dynamic response for Case 30810 from FIR list
        const caseObj = mockFIRs.find(f => f.caseNo === "30810");
        matchedResponse = {
          englishResponse: `FIR Case No: 30810 (Super Market Police Station, Case No. CR-95/2026). Charge: Chain Snatching (IPC Sec 379). Accused: Sameer 'Chhota'. Victim: Deepa Gowda. Status: Under Active Investigation. Getaway getaway motorcycle fleeing to Afzalpur Cross.`,
          kannadaResponse: `ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ: ೩೦೮೧೦ (ಸೂಪರ್ ಮಾರ್ಕೆಟ್ ಠಾಣೆ). ಆರೋಪ: ಸರಗಳ್ಳತನ (IPC Sec 379). ಆರೋಪಿ: ಸಮೀರ್ ಚೋಟಾ. ಬಲಿಪಶು: ದೀಪಾ ಗೌಡ. ಸ್ಥಿತಿ: ತನಿಖೆಯಲ್ಲಿದೆ.`,
          explainableAI: {
            sqlQuery: `SELECT * FROM CaseMaster WHERE CaseNo = '30810';`,
            confidenceScore: 0.98,
            rulesTriggered: "Direct Case ID Match Rule",
            sourcesAudited: "CaseMaster, Accused, Victim",
            executionTimeMs: 5
          }
        };
        newContext = { type: 'case', name: '30810', id: 'FIR_30810' };
      }
      
      // 2. Case contextual details lookup
      if (!matchedResponse && activeContext && activeContext.type === 'case') {
        const activeCase = mockFIRs.find(f => f.caseNo === activeContext.name);
        if (activeCase) {
          if (lowerResolved.includes("status")) {
            matchedResponse = {
              englishResponse: `Investigation Status for Case ${activeContext.name}: "${activeCase.status}". Detailed briefs: ${activeCase.briefFacts}`,
              kannadaResponse: `ಪ್ರಕರಣ ${activeContext.name} ನ ತನಿಖಾ ಸ್ಥಿತಿ: "${activeCase.status}".`,
              explainableAI: {
                sqlQuery: `SELECT Status, BriefFacts FROM CaseMaster WHERE CaseNo = '${activeContext.name}';`,
                confidenceScore: 0.98,
                rulesTriggered: "Context-Aware Column Lookup [Case.Status]",
                sourcesAudited: "CaseMaster",
                executionTimeMs: 12
              }
            };
          } else if (lowerResolved.includes("timeline")) {
            const timelineStr = activeCase.timeline.map(t => `• [${t.date}] ${t.title}: ${t.desc}`).join("\n");
            matchedResponse = {
              englishResponse: `Timeline of events for Case ${activeContext.name}:\n${timelineStr}`,
              kannadaResponse: `ಪ್ರಕರಣ ${activeContext.name} ನ ತನಿಖಾ ಪ್ರಗತಿಯ ಸಮಯಸೂಚಿ ಲಭ್ಯವಿದೆ.`,
              explainableAI: {
                sqlQuery: `SELECT * FROM CaseTimeline WHERE CaseMasterID = '${activeCase.id}' ORDER BY EventDate ASC;`,
                confidenceScore: 0.95,
                rulesTriggered: "Context-Aware Timeline Builder",
                sourcesAudited: "CaseTimeline",
                executionTimeMs: 15
              }
            };
          } else if (lowerResolved.includes("leads") || lowerResolved.includes("lead")) {
            const leadsStr = activeCase.investigationLeads.map((l, i) => `${i + 1}. ${l}`).join("\n");
            matchedResponse = {
              englishResponse: `Investigation leads recommended for Case ${activeContext.name}:\n${leadsStr}`,
              kannadaResponse: `ಪ್ರಕರಣ ${activeContext.name} ಗೆ ತನಿಖಾ ಶಿಫಾರಸುಗಳು ಲಭ್ಯವಿದೆ.`,
              explainableAI: {
                sqlQuery: `SELECT RecommendationText, Confidence FROM AIML_InvestigationLeads WHERE CaseMasterID = '${activeCase.id}';`,
                confidenceScore: 0.91,
                rulesTriggered: "Decision Support Rule -> Leads Engine V2",
                sourcesAudited: "AIML_InvestigationLeads, ModusOperandiIndex",
                executionTimeMs: 28
              }
            };
          } else if (lowerResolved.includes("similar")) {
            const similarStr = activeCase.similarCases.join(", ");
            matchedResponse = {
              englishResponse: `Identified similar past cases based on matching modus operandi: Case IDs [${similarStr}]. Outcomes: Case ${activeCase.similarCases[0]} resulted in convict sentencing.`,
              kannadaResponse: `ಇದೇ ರೀತಿಯ ಹಳೆಯ ಪ್ರಕರಣಗಳು ಕಂಡುಬಂದಿವೆ: [${similarStr}].`,
              explainableAI: {
                sqlQuery: `SELECT TargetCaseNo, SimilarityScore FROM CaseSimilarityMatrix WHERE SourceCaseNo = '${activeContext.name}' AND SimilarityScore > 0.80;`,
                confidenceScore: 0.93,
                rulesTriggered: "Modus Operandi Similarity Matcher",
                sourcesAudited: "CaseSimilarityMatrix, CaseMaster",
                executionTimeMs: 31
              }
            };
          }
        }
      }

      // 3. Offender Contextual details lookup
      if (!matchedResponse && activeContext && activeContext.type === 'offender') {
        const profile = accusedProfiles[activeContext.id];
        if (profile) {
          if (lowerResolved.includes("age") || lowerResolved.includes("profile") || lowerResolved.includes("dossier")) {
            matchedResponse = {
              englishResponse: `Dossier overview for ${profile.name} (${profile.alias}):\n• Age: ${profile.age}\n• Gender: ${profile.gender}\n• Risk Index: ${profile.riskScore}/100 (${profile.recidivismTier})\n• Total Arrests: ${profile.arrestsCount} times\n• Modus Operandi: ${profile.modusOperandi}\n• Behavioral Profiling: ${profile.behavioralProfile}`,
              kannadaResponse: `${profile.name}ನ ವಿವರಗಳು:\n• ವಯಸ್ಸು: ${profile.age}\n• ತೀವ್ರತೆ: ${profile.riskScore}/100\n• ಇತಿಹಾಸ: ${profile.modusOperandi}`,
              explainableAI: {
                sqlQuery: `SELECT * FROM AccusedDossier WHERE AccusedID = '${profile.id}';`,
                confidenceScore: 0.99,
                rulesTriggered: "Contextual Profiler Routing",
                sourcesAudited: "AccusedDossier, RecidivismAudit",
                executionTimeMs: 10
              }
            };
          } else if (lowerResolved.includes("financial") || lowerResolved.includes("bank") || lowerResolved.includes("transaction")) {
            const accounts = profile.bankAccounts.map(a => `• Bank: ${a.bank} (${a.branch}), Account: ${a.accNo}, Balance: ₹${a.balance.toLocaleString()}, Flag: ${a.flag}`).join("\n");
            matchedResponse = {
              englishResponse: `Financial accounts audited for suspect ${profile.name}:\n${accounts}`,
              kannadaResponse: `ಆರೋಪಿ ${profile.name} ನ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳ ವಿವರ ಲಭ್ಯವಿದೆ.`,
              explainableAI: {
                sqlQuery: `SELECT * FROM BankAccounts WHERE OwnerName = '${profile.name}';`,
                confidenceScore: 0.97,
                rulesTriggered: "Financial Audit Trail Query [FT-03]",
                sourcesAudited: "BankAccounts, FinancialTransactionLedger",
                executionTimeMs: 14
              }
            };
          }
        }
      }

      // 4. Fallback to keyword matching responses
      if (!matchedResponse) {
        matchedResponse = mockChatBotResponses.find(resp => 
          resp.keywords.some(kw => lowerResolved.includes(kw))
        );
      }

      // If still not matched, trigger standard fallback
      if (!matchedResponse) {
        matchedResponse = getFallbackResponse(queryText);
      }

      // Detect and set context from response keywords/contents
      if (!newContext) {
        if (lowerResolved.includes("raju") || lowerResolved.includes("rowdy")) {
          newContext = { type: 'offender', name: 'Rowdy Raju', id: 'off_01' };
        } else if (lowerResolved.includes("kiran") || lowerResolved.includes("tech")) {
          newContext = { type: 'offender', name: 'Kiran Tech', id: 'off_06' };
        } else if (lowerResolved.includes("sunil") || lowerResolved.includes("fence")) {
          newContext = { type: 'offender', name: 'Sunil Fence', id: 'off_03' };
        } else if (lowerResolved.includes("tiger") || lowerResolved.includes("naga")) {
          newContext = { type: 'offender', name: "Tiger Naga", id: 'off_02' };
        } else if (lowerResolved.includes("bengaluru") || lowerResolved.includes("bangalore")) {
          newContext = { type: 'location', name: 'Bengaluru Urban', id: 'Bengaluru Urban' };
        } else if (lowerResolved.includes("kalaburagi")) {
          newContext = { type: 'location', name: 'Kalaburagi', id: 'Kalaburagi' };
        }
      }

      if (newContext) {
        setActiveContext(newContext);
      }

      const botMessage = {
        sender: 'bot',
        textEnglish: matchedResponse.englishResponse,
        textKannada: matchedResponse.kannadaResponse,
        explainableAI: matchedResponse.explainableAI
      };

      setMessages(prev => [...prev, botMessage]);
      setSelectedAIExplain(matchedResponse.explainableAI);

      // Trigger Speech synthesis of the response text
      const speakTextStr = language === 'English' ? matchedResponse.englishResponse : matchedResponse.kannadaResponse;
      speakText(speakTextStr);

    }, 800);
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
    
    // Inject print metadata info block temporarily in print DOM
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', height: 'calc(100vh - 120px)', minHeight: '520px' }}>
      
      {/* Left Pane: Chat Window */}
      <div className="glass-panel print-area" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.25rem', overflow: 'hidden' }}>
        
        {/* Chat Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid hsl(var(--border-color))', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Conversational Crime Intelligence
              <span className="badge badge-indigo" style={{ fontSize: '0.65rem', padding: '2px 8px' }}>v3.5 Active</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>Integrated natural language parsing & case dossier extraction</span>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            
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

        {/* Conversation Logs */}
        <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  <span style={{ fontSize: '0.7rem', color: 'hsl(var(--color-cyan))', margin: '0 4px 2px 0', opacity: 0.8, fontStyle: 'italic' }}>
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

          <input
            type="text"
            className="input-control"
            placeholder={isListening ? 'Listening...' : activeContext ? `Ask follow-up details about ${activeContext.name}...` : 'Search FIR cases, offenders, hotspots, or economic correlations...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isListening}
            style={{ flexGrow: 1 }}
          />

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
