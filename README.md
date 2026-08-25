# KSP Crime Intelligence

### Intelligent Conversational AI & Analytics for Karnataka State Police Crime Database
*Built for the SCRB Datathon Challenge 01 | Team Prism Talons*

---

## 🚨 Problem Statement
The State Crime Records Bureau (SCRB) manages crime data from 1100+ police stations across Karnataka. Investigators today rely on static dashboards and manual tabular queries, making it challenging to quickly surface real-time patterns, criminal networks, or predictive correlations. 

There is a critical need for an intuitive, secure interface that allows officers to query the crime database using natural language and instantly receive explainable intelligence, interactive maps, and relationship matrices.

---

## 💡 Solution: KSP Analytical Nexus
**KSP Crime Intelligence** is a browser-native analytical portal that lets investigators query simulated CCTNS databases in plain English or Kannada. The application instantly processes inputs to surface:

1. **Natural Language Answers** grounded in KSP crime data.
2. **Visualized Crime Trends** and interactive street-level hotspot maps.
3. **Dynamic Criminal Network Graphs** mapping case files, suspects, victims, bank accounts, and stations.
4. **Predictive Early Warnings** regarding regional anomalies.
5. **Printable PDF Dossiers** with a tamper-resistant activity audit trail.

---

## ✨ Key Features
| Feature | Description |
| :--- | :--- |
| 🗣️ **Bilingual Natural Language Chat** | Query crime databases in plain English or Kannada. |
| 🕵️ **Contextual Pronoun Resolution** | Context tracking engine that resolves follow-up queries containing pronouns (e.g., "his timeline", "their balance"). |
| 🎙️ **Voice Input & Synthesis** | Speak queries and receive audio feedback powered by native browser Web Speech APIs. |
| 🗺️ **Interactive GIS Hotspot Map** | Zoomable Leaflet.js map with OSM Nominatim API geocoding search and simulated *Preventive Patrol Dispatch* commands. |
| 🕸️ **Custom Relationship Network** | Native SVG-rendered node-link diagram mapping cases, suspects, victims, bank accounts, and stations. |
| 📈 **Socio-Demographic Correlations** | Multi-variable X-Y scatter plots graphing youth unemployment and literacy rates against district risk profiles. |
| 🧾 **Explainable AI (XAI) Pathway** | Displays NLP intent validation, relational SQL schema queries, confidence metrics, and audited tables behind every response. |
| 🔐 **CCTNS Security Compliance** | Features secure Google SSO (mocked), role-based viewports (Investigator, Analyst, Admin, Supervisor), and 30-minute idle session auto-locks. |
| 📄 **Native PDF Export** | Optimized `@media print` layout styles to export clean, watermark-certified intelligence reports via browser print (`window.print()`). |

---

## 🆕 Latest Updates

### v2.0 — Pre-Submission Build

1. **Firebase Google SSO** — Real Google Authentication via Firebase Auth. 
   Investigators authenticate with real Google credentials; display name, 
   photo and email appear in the dashboard header and sidebar.

2. **Live Gemini AI Integration** — Interactive chat with live Gemini API. 
   Officers configure their own API key (saved in localStorage or loaded 
   via .env). Includes animated typing indicator and error overlays.

3. **Criminal Network CRUD** — Full Add/Edit/Remove operations on suspect 
   nodes and link connections in the SVG network graph, with input 
   validation and real-time success alerts.

4. **Build Configuration** — Fixed base routing in vite.config.js for 
   correct deployment across environments.

---

## 🏗️ Architecture & Data Flow
```
User (Voice/Text)
       ↓
React 19 Frontend (Vite 8 + CSS variables for dark-mode glassmorphism)
       ↓
CCTNS-NLPE Mock Routing Engine & Context Stack Resolver
  ← Synthetic KSP Dataset (mirrors CCTNS ER Schema: CaseMaster, Accused, Victim, etc.) →
       ↓
Interactive SVG Visualizations, Leaflet GIS Maps, & Print Engine
```

The database is built on a synthetic dataset modeled after the official **KSP FIR Entity-Relationship (ER) Diagram** released by the SCRB, including:
* **CaseMaster:** FIR records with coordinates, crime type, gravity, and status.
* **Accused / Victim:** Demographics linked to cases.
* **BankAccounts & Transactions:** Auditable transaction ledgers for tracking money laundering trails.
* **Lookup Tables:** Districts, Units, and Employees mapped across Karnataka's 31 districts.

---

## 🛠️ Technology Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19.x & Vite 8.x |
| **Styling & Aesthetics** | Vanilla CSS (HSL custom color system, glassmorphism, responsive grids) |
| **GIS Mapping** | Leaflet.js (via OpenStreetMap & CartoDB Dark Matter tile CDN) |
| **Geocoding Search** | OpenStreetMap Nominatim API |
| **Visualizations** | High-performance inline SVG (dials, scatter plots, trend lines, node graphs) |
| **Voice Processing** | Web Speech API (`SpeechSynthesis` & Web `SpeechRecognition`) |
| **Dossier Export** | Browser Print Engine (CSS `@media print` optimized template) |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** v18 or higher installed on your local machine.

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/prajval26112005-arch/ksp-crime-intelligence.git
   cd ksp-crime-intelligence
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗂️ Dataset Schema Coverage
The simulated dataset mimics real-world database schemas, supporting mock SQL logging:
* `CaseMaster` — Case details, dates, IPC sections, and beats.
* `Accused / Victim` — Profiles with recidivism risk indices.
* `ActSectionAssociation` — IPC section mappings (e.g. IPC 379 - Theft, IPC 302 - Murder).
* `District / Unit / Employee` — Station registries for all 31 districts.

*⚠️ **Disclaimer:** All data in this application is synthetically generated for demonstration purposes. No real citizen or confidential KSP case records are used.*

---

## 🔮 Future Scope
* **Live Database Integration:** Connect to CCTNS/SCRB production tables through a secure, encrypted API gateway.
* **Mobile Field App:** Mobile-optimized viewports with local database synchronization and offline capabilities for beat officers.
* **Machine Learning Pipeline:** Implement predictive ML models (like XGBoost or Random Forests) to forecast crime hotspots on weekly indices.
* **Handwritten OCR Integration:** Scan physical Kannada/English FIR documents to auto-ingest text fields.

---

## 👥 Team Prism Talons
*Sapthagiri NPS University, Bangalore*
* **Prajval** — AI Integration & Architecture
* **Poorvik Rawath** — Frontend Development
* **Pragathi Gowda** — Data & Visualization
* **Prateek Salien** — Backend & Dataset
* **Prem H R** — UI/UX & Presentation

---
<p align="center">Built with ❤️ by Team Prism Talons for the SCRB Datathon Challenge</p>
