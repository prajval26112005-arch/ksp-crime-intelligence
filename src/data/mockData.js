// Karnataka State Police Relational Crime Database
// Covers all 31 districts of Karnataka with station directories, active suspects and FIR complaints

export const districtsData = {
  "Bagalkote": {
    name: "Bagalkote", kannadaName: "ಬಾಗಲಕೋಟೆ", crimes2025: 4120, crimes2026: 4300, solvedRate: 84.1, activeOffenders: 120, riskScore: 52, literacyRate: 68.8, unemploymentRate: 5.1, populationDensity: 230, migrationIndex: 3.2, urbanizationIndex: 4.8,
    stations: ["Bagalkote Town PS", "Badami PS", "Ilkal PS"],
    hotspots: [{ name: "Badami Caves road", type: "Tourist Pickpocketing", level: "Low", coords: { lat: 15.9181, lng: 75.6794 } }],
    trends: [{ month: "Jan", count: 320, property: 120, cyber: 30, violent: 170 }, { month: "Jun", count: 340, property: 130, cyber: 40, violent: 170 }]
  },
  "Ballari": {
    name: "Ballari", kannadaName: "ಬಳ್ಳಾರಿ", crimes2025: 7800, crimes2026: 8200, solvedRate: 79.5, activeOffenders: 280, riskScore: 78, literacyRate: 67.4, unemploymentRate: 7.2, populationDensity: 290, migrationIndex: 6.2, urbanizationIndex: 6.8,
    stations: ["Ballari Fort PS", "Sandur PS", "Siruguppa PS"],
    hotspots: [{ name: "Sandur Mining Belt", type: "Illegal Mineral Smuggling", level: "High", coords: { lat: 15.0833, lng: 76.5500 } }],
    trends: [{ month: "Jan", count: 620, property: 250, cyber: 50, violent: 320 }, { month: "Jun", count: 680, property: 280, cyber: 60, violent: 340 }]
  },
  "Belagavi": {
    name: "Belagavi", kannadaName: "ಬೆಳಗಾವಿ", crimes2025: 14300, crimes2026: 13800, solvedRate: 86.4, activeOffenders: 480, riskScore: 58, literacyRate: 73.9, unemploymentRate: 4.9, populationDensity: 285, migrationIndex: 3.1, urbanizationIndex: 5.6,
    stations: ["Khade Bazar PS", "Sankeshwar Border Checkpost", "Gokak PS"],
    hotspots: [{ name: "Sankeshwar Checkpost", type: "Illicit Liquor Smuggling", level: "High", coords: { lat: 16.2625, lng: 74.4842 } }],
    trends: [{ month: "Jan", count: 1150, property: 500, cyber: 150, violent: 500 }, { month: "Jun", count: 1050, property: 450, cyber: 130, violent: 470 }]
  },
  "Bengaluru Rural": {
    name: "Bengaluru Rural", kannadaName: "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ", crimes2025: 8900, crimes2026: 9400, solvedRate: 82.3, activeOffenders: 310, riskScore: 68, literacyRate: 77.9, unemploymentRate: 5.2, populationDensity: 431, migrationIndex: 5.9, urbanizationIndex: 6.2,
    stations: ["Doddaballapur PS", "Devanahalli Airport Road PS", "Hosakote PS"],
    hotspots: [{ name: "Hosakote Toll Plaza", type: "Cargo Hijacking & Theft", level: "High", coords: { lat: 13.0722, lng: 77.7981 } }],
    trends: [{ month: "Jan", count: 720, property: 300, cyber: 110, violent: 310 }, { month: "Jun", count: 790, property: 340, cyber: 130, violent: 320 }]
  },
  "Bengaluru Urban": {
    name: "Bengaluru Urban", kannadaName: "ಬೆಂಗಳೂರು ನಗರ", crimes2025: 42150, crimes2026: 45680, solvedRate: 78.5, activeOffenders: 1240, riskScore: 92, literacyRate: 88.4, unemploymentRate: 5.8, populationDensity: 4380, migrationIndex: 8.5, urbanizationIndex: 9.2,
    stations: ["Jayanagar PS", "Whitefield Cyber Crime PS", "Majestic Bus Stand Outpost", "Indiranagar PS", "Sadashivanagar PS"],
    hotspots: [
      { name: "Majestic Area", type: "Pickpocketing & Theft", level: "High", coords: { lat: 12.9779, lng: 77.5724 } },
      { name: "Jayanagar 4th Block", type: "Chain Snatching", level: "Medium", coords: { lat: 12.9279, lng: 77.5904 } },
      { name: "Whitefield Tech Corridor", type: "Cyber Fraud & Phishing", level: "High", coords: { lat: 12.9698, lng: 77.7499 } },
      { name: "Indiranagar 100ft Rd", type: "Nuisance & DUI", level: "Medium", coords: { lat: 12.9631, lng: 77.6397 } }
    ],
    trends: [
      { month: "Jan", count: 3200, property: 1200, cyber: 800, violent: 1200 },
      { month: "Feb", count: 3400, property: 1300, cyber: 900, violent: 1200 },
      { month: "Mar", count: 3800, property: 1400, cyber: 1100, violent: 1300 },
      { month: "Apr", count: 4100, property: 1550, cyber: 1250, violent: 1300 },
      { month: "May", count: 4500, property: 1800, cyber: 1400, violent: 1300 },
      { month: "Jun", count: 4200, property: 1500, cyber: 1300, violent: 1400 }
    ]
  },
  "Bidar": {
    name: "Bidar", kannadaName: "ಬೀದರ್", crimes2025: 5200, crimes2026: 5500, solvedRate: 77.6, activeOffenders: 180, riskScore: 71, literacyRate: 70.5, unemploymentRate: 6.9, populationDensity: 310, migrationIndex: 5.1, urbanizationIndex: 4.8,
    stations: ["Bidar Town PS", "Bhalki PS", "Aurad Checkpost"],
    hotspots: [{ name: "Bidar Fort outskirts", type: "Rivalry Disputes", level: "Medium", coords: { lat: 17.9262, lng: 77.5186 } }],
    trends: [{ month: "Jan", count: 410, property: 170, cyber: 30, violent: 210 }, { month: "Jun", count: 450, property: 190, cyber: 40, violent: 220 }]
  },
  "Chamarajanagar": {
    name: "Chamarajanagar", kannadaName: "ಚಾಮರಾಜನಗರ", crimes2025: 3100, crimes2026: 2900, solvedRate: 88.2, activeOffenders: 90, riskScore: 42, literacyRate: 61.4, unemploymentRate: 3.9, populationDensity: 180, migrationIndex: 2.1, urbanizationIndex: 3.5,
    stations: ["Chamarajanagar Town PS", "Kollegal PS", "Gundlupet Border PS"],
    hotspots: [{ name: "Gundlupet Forest Checkpost", type: "Wildlife Poaching & Smuggling", level: "High", coords: { lat: 11.8086, lng: 76.6908 } }],
    trends: [{ month: "Jan", count: 220, property: 80, cyber: 10, violent: 130 }, { month: "Jun", count: 240, property: 90, cyber: 15, violent: 135 }]
  },
  "Chikballapur": {
    name: "Chikballapur", kannadaName: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ", crimes2025: 4600, crimes2026: 4800, solvedRate: 82.5, activeOffenders: 140, riskScore: 61, literacyRate: 69.8, unemploymentRate: 4.8, populationDensity: 298, migrationIndex: 4.2, urbanizationIndex: 5.1,
    stations: ["Chikballapur Town PS", "Chintamani PS", "Sidlaghatta PS"],
    hotspots: [{ name: "Nandi Hills turnoff", type: "High-speed Dueling & DUI", level: "Medium", coords: { lat: 13.3702, lng: 77.6835 } }],
    trends: [{ month: "Jan", count: 360, property: 150, cyber: 40, violent: 170 }, { month: "Jun", count: 390, property: 160, cyber: 50, violent: 180 }]
  },
  "Chikkamagaluru": {
    name: "Chikkamagaluru", kannadaName: "ಚಿಕ್ಕಮಗಳೂರು", crimes2025: 3900, crimes2026: 3750, solvedRate: 87.1, activeOffenders: 110, riskScore: 48, literacyRate: 79.2, unemploymentRate: 4.1, populationDensity: 158, migrationIndex: 2.8, urbanizationIndex: 4.2,
    stations: ["Chikkamagaluru Town PS", "Mullayanagiri Ghat PS", "Kadur PS"],
    hotspots: [{ name: "Mullayanagiri Viewpoint", type: "Theft from Vehicles", level: "Medium", coords: { lat: 13.4208, lng: 75.7592 } }],
    trends: [{ month: "Jan", count: 290, property: 120, cyber: 20, violent: 150 }, { month: "Jun", count: 310, property: 130, cyber: 30, violent: 150 }]
  },
  "Chitradurga": {
    name: "Chitradurga", kannadaName: "ಚಿತ್ರದುರ್ಗ", crimes2025: 5800, crimes2026: 6050, solvedRate: 83.0, activeOffenders: 190, riskScore: 64, literacyRate: 73.8, unemploymentRate: 5.5, populationDensity: 197, migrationIndex: 3.8, urbanizationIndex: 4.9,
    stations: ["Chitradurga Fort PS", "Challakere PS", "Hiriyur PS"],
    hotspots: [{ name: "Hiriyur NH-48 junction", type: "Highway Cargo Robbery", level: "High", coords: { lat: 13.9456, lng: 76.6200 } }],
    trends: [{ month: "Jan", count: 480, property: 200, cyber: 50, violent: 230 }, { month: "Jun", count: 510, property: 220, cyber: 60, violent: 230 }]
  },
  "Dakshina Kannada": {
    name: "Dakshina Kannada", kannadaName: "ದಕ್ಷಿಣ ಕನ್ನಡ", crimes2025: 9800, crimes2026: 10400, solvedRate: 83.6, activeOffenders: 320, riskScore: 65, literacyRate: 88.6, unemploymentRate: 3.8, populationDensity: 320, migrationIndex: 4.8, urbanizationIndex: 7.8,
    stations: ["Hampankatta PS", "Panambur Beach Port Checkpost", "Ullal PS", "Kadri PS"],
    hotspots: [
      { name: "Hampankatta Commercial St", type: "Merchant Extortion", level: "Medium", coords: { lat: 12.8732, lng: 74.8433 } },
      { name: "Panambur Beach Road", type: "Sand Theft & Smuggling", level: "High", coords: { lat: 12.9348, lng: 74.7963 } }
    ],
    trends: [{ month: "Jan", count: 820, property: 310, cyber: 160, violent: 350 }, { month: "Jun", count: 890, property: 340, cyber: 190, violent: 360 }]
  },
  "Davanagere": {
    name: "Davanagere", kannadaName: "ದಾವಣಗೆರೆ", crimes2025: 6900, crimes2026: 7200, solvedRate: 82.8, activeOffenders: 220, riskScore: 67, literacyRate: 75.7, unemploymentRate: 5.9, populationDensity: 302, migrationIndex: 4.5, urbanizationIndex: 5.8,
    stations: ["Davanagere Town PS", "Harihar PS", "Honnali PS"],
    hotspots: [{ name: "Mandipet Market", type: "Store Burglary", level: "Medium", coords: { lat: 14.4644, lng: 75.9217 } }],
    trends: [{ month: "Jan", count: 560, property: 220, cyber: 70, violent: 270 }, { month: "Jun", count: 610, property: 250, cyber: 80, violent: 280 }]
  },
  "Dharwad": {
    name: "Dharwad", kannadaName: "ಧಾರವಾಡ", crimes2025: 15600, crimes2026: 16200, solvedRate: 81.0, activeOffenders: 580, riskScore: 72, literacyRate: 80.3, unemploymentRate: 6.1, populationDensity: 395, migrationIndex: 5.8, urbanizationIndex: 7.2,
    stations: ["CBT Bus Stand Outpost", "Gokul Road PS", "Vidyanagar PS", "Dharwad Suburban PS"],
    hotspots: [
      { name: "CBT Terminus", type: "Pickpocketing & Snatching", level: "High", coords: { lat: 15.3524, lng: 75.1384 } },
      { name: "Gokul Road Industrial Hub", type: "Vehicle Grand Theft", level: "Medium", coords: { lat: 15.3642, lng: 75.0931 } }
    ],
    trends: [{ month: "Jan", count: 1300, property: 600, cyber: 200, violent: 500 }, { month: "Jun", count: 1520, property: 720, cyber: 240, violent: 560 }]
  },
  "Gadag": {
    name: "Gadag", kannadaName: "ಗದಗ", crimes2025: 3400, crimes2026: 3600, solvedRate: 85.0, activeOffenders: 95, riskScore: 49, literacyRate: 75.1, unemploymentRate: 4.8, populationDensity: 210, migrationIndex: 2.8, urbanizationIndex: 4.5,
    stations: ["Gadag Town PS", "Mulgund PS", "Ron PS"],
    hotspots: [{ name: "Gadag Railway Station road", type: "Bicycle Theft", level: "Low", coords: { lat: 15.4283, lng: 75.6267 } }],
    trends: [{ month: "Jan", count: 270, property: 110, cyber: 20, violent: 140 }, { month: "Jun", count: 290, property: 120, cyber: 25, violent: 145 }]
  },
  "Hassan": {
    name: "Hassan", kannadaName: "ಹಾಸನ", crimes2025: 6400, crimes2026: 6200, solvedRate: 86.8, activeOffenders: 180, riskScore: 51, literacyRate: 76.1, unemploymentRate: 4.3, populationDensity: 261, migrationIndex: 3.1, urbanizationIndex: 4.8,
    stations: ["Hassan Town PS", "Arsikere PS", "Sakleshpur Ghat PS"],
    hotspots: [{ name: "Sakleshpur Highway Bend", type: "Tourist Luggage Theft", level: "Medium", coords: { lat: 12.9442, lng: 75.7861 } }],
    trends: [{ month: "Jan", count: 490, property: 180, cyber: 40, violent: 270 }, { month: "Jun", count: 520, property: 200, cyber: 50, violent: 270 }]
  },
  "Haveri": {
    name: "Haveri", kannadaName: "ಹಾವೇರಿ", crimes2025: 4800, crimes2026: 5100, solvedRate: 84.5, activeOffenders: 130, riskScore: 56, literacyRate: 77.4, unemploymentRate: 5.0, populationDensity: 220, migrationIndex: 3.0, urbanizationIndex: 4.1,
    stations: ["Haveri Town PS", "Ranebennur PS", "Shiggaon PS"],
    hotspots: [{ name: "Ranebennur Seed Market", type: "Produce Theft", level: "Low", coords: { lat: 14.6231, lng: 75.6253 } }],
    trends: [{ month: "Jan", count: 390, property: 160, cyber: 30, violent: 200 }, { month: "Jun", count: 430, property: 180, cyber: 40, violent: 210 }]
  },
  "Kalaburagi": {
    name: "Kalaburagi", kannadaName: "ಕಲಬುರಗಿ", crimes2025: 16800, crimes2026: 18100, solvedRate: 74.2, activeOffenders: 790, riskScore: 81, literacyRate: 64.9, unemploymentRate: 8.2, populationDensity: 230, migrationIndex: 6.9, urbanizationIndex: 5.2,
    stations: ["Super Market PS", "Afzalpur Cross Station", "Chincholi PS", "Kalaburagi Suburban PS"],
    hotspots: [
      { name: "Super Market Road", type: "Robbery & Extortion", level: "High", coords: { lat: 17.3308, lng: 76.8375 } },
      { name: "Afzalpur Cross Checkpoint", type: "Faction Clash Violence", level: "High", coords: { lat: 17.3622, lng: 76.7911 } }
    ],
    trends: [{ month: "Jan", count: 1450, property: 700, cyber: 100, violent: 650 }, { month: "Jun", count: 1720, property: 830, cyber: 120, violent: 770 }]
  },
  "Kodagu": {
    name: "Kodagu", kannadaName: "ಕೊಡಗು", crimes2025: 2300, crimes2026: 2100, solvedRate: 91.2, activeOffenders: 60, riskScore: 31, literacyRate: 82.6, unemploymentRate: 3.1, populationDensity: 135, migrationIndex: 1.8, urbanizationIndex: 3.8,
    stations: ["Madikeri Town PS", "Kushalnagar PS", "Gonikoppal PS"],
    hotspots: [{ name: "Abbey Falls Junction", type: "Tourist Vandalism", level: "Low", coords: { lat: 12.4542, lng: 75.7214 } }],
    trends: [{ month: "Jan", count: 160, property: 50, cyber: 10, violent: 100 }, { month: "Jun", count: 180, property: 60, cyber: 15, violent: 105 }]
  },
  "Kolar": {
    name: "Kolar", kannadaName: "ಕೋಲಾರ", crimes2025: 6100, crimes2026: 6300, solvedRate: 80.6, activeOffenders: 200, riskScore: 69, literacyRate: 74.3, unemploymentRate: 6.2, populationDensity: 386, migrationIndex: 5.1, urbanizationIndex: 5.4,
    stations: ["Kolar Town PS", "KGF Champion Reef PS", "Mulbagal Border PS"],
    hotspots: [{ name: "KGF Mines perimeter", type: "Copper Cable Theft", level: "High", coords: { lat: 12.9592, lng: 78.2725 } }],
    trends: [{ month: "Jan", count: 490, property: 210, cyber: 50, violent: 230 }, { month: "Jun", count: 530, property: 230, cyber: 60, violent: 240 }]
  },
  "Koppal": {
    name: "Koppal", kannadaName: "ಕೊಪ್ಪಳ", crimes2025: 3800, crimes2026: 4100, solvedRate: 83.2, activeOffenders: 110, riskScore: 54, literacyRate: 68.2, unemploymentRate: 5.4, populationDensity: 250, migrationIndex: 3.5, urbanizationIndex: 4.1,
    stations: ["Koppal Town PS", "Gangavathi PS", "Kanakagiri PS"],
    hotspots: [{ name: "Gangavathi Paddy Yards", type: "Grain Cargo Stealing", level: "Medium", coords: { lat: 15.4322, lng: 76.5312 } }],
    trends: [{ month: "Jan", count: 310, property: 120, cyber: 20, violent: 170 }, { month: "Jun", count: 350, property: 140, cyber: 30, violent: 180 }]
  },
  "Mandya": {
    name: "Mandya", kannadaName: "ಮಂಡ್ಯ", crimes2025: 6900, crimes2026: 6600, solvedRate: 87.3, activeOffenders: 170, riskScore: 53, literacyRate: 70.4, unemploymentRate: 4.5, populationDensity: 366, migrationIndex: 3.2, urbanizationIndex: 4.9,
    stations: ["Mandya Town PS", "Maddur Highway PS", "Srirangapatna PS"],
    hotspots: [{ name: "Maddur sugarcane yard", type: "Labor Clashes", level: "Medium", coords: { lat: 12.5844, lng: 77.0453 } }],
    trends: [{ month: "Jan", count: 520, property: 200, cyber: 50, violent: 270 }, { month: "Jun", count: 560, property: 220, cyber: 60, violent: 280 }]
  },
  "Mysuru": {
    name: "Mysuru", kannadaName: "ಮೈಸೂರು", crimes2025: 12450, crimes2026: 11980, solvedRate: 85.2, activeOffenders: 410, riskScore: 54, literacyRate: 82.1, unemploymentRate: 4.2, populationDensity: 476, migrationIndex: 3.4, urbanizationIndex: 6.5,
    stations: ["Devaraja Market PS", "Chamundi Hill Outpost", "Lashkar PS", "Kuuempunagar PS"],
    hotspots: [
      { name: "Devaraja Market Area", type: "Shoplifting & Pickpocket", level: "Medium", coords: { lat: 12.3106, lng: 76.6508 } },
      { name: "Chamundi Hill Footpath", type: "Late Night Racing", level: "Low", coords: { lat: 12.2742, lng: 76.6711 } }
    ],
    trends: [{ month: "Jan", count: 980, property: 400, cyber: 180, violent: 400 }, { month: "Jun", count: 990, property: 410, cyber: 180, violent: 400 }]
  },
  "Raichur": {
    name: "Raichur", kannadaName: "ರಾಯಚೂರು", crimes2025: 6400, crimes2026: 6750, solvedRate: 78.4, activeOffenders: 230, riskScore: 73, literacyRate: 59.6, unemploymentRate: 7.8, populationDensity: 244, migrationIndex: 6.0, urbanizationIndex: 5.1,
    stations: ["Raichur Town PS", "Manvi PS", "Raichur Thermal Power Plant PS"],
    hotspots: [{ name: "RTPS Industrial Zone", type: "Industrial Scrap Pilferage", level: "High", coords: { lat: 16.3533, lng: 77.3492 } }],
    trends: [{ month: "Jan", count: 520, property: 220, cyber: 40, violent: 260 }, { month: "Jun", count: 570, property: 240, cyber: 50, violent: 280 }]
  },
  "Ramanagara": {
    name: "Ramanagara", kannadaName: "ರಾಮನಗರ", crimes2025: 4900, crimes2026: 5200, solvedRate: 83.8, activeOffenders: 150, riskScore: 60, literacyRate: 69.2, unemploymentRate: 4.6, populationDensity: 303, migrationIndex: 4.8, urbanizationIndex: 5.5,
    stations: ["Ramanagara Town PS", "Channapatna Toy City PS", "Magadi PS"],
    hotspots: [{ name: "Channapatna Craft market", type: "Fake Handicrafts Fraud", level: "Medium", coords: { lat: 12.6517, lng: 77.2025 } }],
    trends: [{ month: "Jan", count: 390, property: 160, cyber: 40, violent: 190 }, { month: "Jun", count: 430, property: 180, cyber: 50, violent: 200 }]
  },
  "Shivamogga": {
    name: "Shivamogga", kannadaName: "ಶಿವಮೊಗ್ಗ", crimes2025: 8400, crimes2026: 8100, solvedRate: 85.6, activeOffenders: 250, riskScore: 59, literacyRate: 80.5, unemploymentRate: 5.2, populationDensity: 207, migrationIndex: 3.5, urbanizationIndex: 5.8,
    stations: ["Shivamogga Town PS", "Bhadravathi PS", "Sagar Taluk PS"],
    hotspots: [{ name: "Bhadravathi Iron scrap market", type: "Industrial Theft", level: "Medium", coords: { lat: 13.8402, lng: 75.7022 } }],
    trends: [{ month: "Jan", count: 660, property: 270, cyber: 90, violent: 300 }, { month: "Jun", count: 690, property: 280, cyber: 100, violent: 310 }]
  },
  "Tumakuru": {
    name: "Tumakuru", kannadaName: "ತುಮಕೂರು", crimes2025: 9100, crimes2026: 9500, solvedRate: 82.1, activeOffenders: 290, riskScore: 66, literacyRate: 75.1, unemploymentRate: 5.4, populationDensity: 253, migrationIndex: 4.2, urbanizationIndex: 5.9,
    stations: ["Tumakuru Town PS", "Kyathsandra Highway PS", "Sira PS", "Tiptur PS"],
    hotspots: [
      { name: "Kyathsandra Toll plaza", type: "Highway Theft & DUI", level: "Medium", coords: { lat: 13.3283, lng: 77.1352 } },
      { name: "Tiptur Coconut APMC", type: "Merchant Extortion", level: "Medium", coords: { lat: 13.2642, lng: 76.4756 } }
    ],
    trends: [{ month: "Jan", count: 760, property: 310, cyber: 120, violent: 330 }, { month: "Jun", count: 810, property: 340, cyber: 130, violent: 340 }]
  },
  "Udupi": {
    name: "Udupi", kannadaName: "ಉಡುಪಿ", crimes2025: 4100, crimes2026: 3950, solvedRate: 89.6, activeOffenders: 90, riskScore: 38, literacyRate: 86.2, unemploymentRate: 3.4, populationDensity: 304, migrationIndex: 2.5, urbanizationIndex: 6.9,
    stations: ["Udupi Town PS", "Manipal Police Station", "Malpe Harbour Outpost"],
    hotspots: [{ name: "Manipal University block", type: "Cyber Phishing Scams", level: "Medium", coords: { lat: 13.3533, lng: 74.7867 } }],
    trends: [{ month: "Jan", count: 310, property: 110, cyber: 80, violent: 120 }, { month: "Jun", count: 330, property: 120, cyber: 90, violent: 120 }]
  },
  "Uttara Kannada": {
    name: "Uttara Kannada", kannadaName: "ಉತ್ತರ ಕನ್ನಡ", crimes2025: 4600, crimes2026: 4400, solvedRate: 88.0, activeOffenders: 120, riskScore: 45, literacyRate: 84.1, unemploymentRate: 4.0, populationDensity: 140, migrationIndex: 2.1, urbanizationIndex: 4.8,
    stations: ["Karwar PS", "Gokarna Temple Town PS", "Dandeli Forest PS"],
    hotspots: [{ name: "Gokarna Beach Road", type: "Tourist Property Theft", level: "Medium", coords: { lat: 14.5422, lng: 74.3167 } }],
    trends: [{ month: "Jan", count: 340, property: 120, cyber: 40, violent: 180 }, { month: "Jun", count: 370, property: 130, cyber: 50, violent: 190 }]
  },
  "Vijayapura": {
    name: "Vijayapura", kannadaName: "ವಿಜಯಪುರ", crimes2025: 8400, crimes2026: 8900, solvedRate: 77.2, activeOffenders: 270, riskScore: 74, literacyRate: 67.2, unemploymentRate: 7.1, populationDensity: 231, migrationIndex: 5.8, urbanizationIndex: 5.2,
    stations: ["Vijayapura Town PS", "Gol Gumbaz PS", "Indi Border Post"],
    hotspots: [{ name: "Gol Gumbaz parking area", type: "Vehicle Vandalism & Theft", level: "Medium", coords: { lat: 16.8302, lng: 75.7362 } }],
    trends: [{ month: "Jan", count: 680, property: 270, cyber: 50, violent: 360 }, { month: "Jun", count: 740, property: 300, cyber: 60, violent: 380 }]
  },
  "Yadgir": {
    name: "Yadgir", kannadaName: "ಯಾದಗಿರಿ", crimes2025: 4100, crimes2026: 4450, solvedRate: 75.1, activeOffenders: 160, riskScore: 76, literacyRate: 51.8, unemploymentRate: 8.5, populationDensity: 223, migrationIndex: 6.8, urbanizationIndex: 4.2,
    stations: ["Yadgir Town PS", "Shorapur PS", "Shahapur PS"],
    hotspots: [{ name: "Yadgir Bus Stand", type: "Pickpocketing & Nuisance", level: "High", coords: { lat: 16.7644, lng: 77.1356 } }],
    trends: [{ month: "Jan", count: 330, property: 150, cyber: 20, violent: 160 }, { month: "Jun", count: 370, property: 170, cyber: 25, violent: 175 }]
  },
  "Vijayanagara": {
    name: "Vijayanagara", kannadaName: "ವಿಜಯನಗರ", crimes2025: 4200, crimes2026: 4400, solvedRate: 84.8, activeOffenders: 130, riskScore: 50, literacyRate: 68.1, unemploymentRate: 5.6, populationDensity: 218, migrationIndex: 3.4, urbanizationIndex: 4.9,
    stations: ["Hampi PS", "Hosapete Town PS", "Kottur PS"],
    hotspots: [{ name: "Hampi Bazaar Ruins", type: "Tourist Harassment & Pickpocket", level: "Medium", coords: { lat: 15.3350, lng: 76.4600 } }],
    trends: [{ month: "Jan", count: 320, property: 130, cyber: 30, violent: 160 }, { month: "Jun", count: 350, property: 150, cyber: 35, violent: 165 }]
  }
};

// Default totals for dashboard
export const crimeStatsOverview = {
  totalCrimes2026: 284100,
  solvedRate: 82.1,
  activeOffenders: 7420,
  hotspotsDetected: 58,
  crimeTypeDistribution: [
    { type: "Theft & Robbery", count: 98400, percentage: 34, color: "#3B82F6" },
    { type: "Assault & Violent Crimes", count: 65100, percentage: 23, color: "#EF4444" },
    { type: "Cyber Crime", count: 48900, percentage: 17, color: "#10B981" },
    { type: "Financial Fraud", count: 36200, percentage: 13, color: "#F59E0B" },
    { type: "Narcotics", count: 21400, percentage: 8, color: "#8B5CF6" },
    { type: "Others", count: 14100, percentage: 5, color: "#6B7280" }
  ]
};

// Accused profiles with behavioral profiling & risk indexes
// Contains specific charges of theft, burglary, murder, extortion
export const accusedProfiles = {
  "off_01": {
    id: "off_01", name: "Rowdy Raju", alias: "ರಾಜು", age: 42, gender: "Male", role: "Gang Leader", status: "Active", riskScore: 95, photoColor: "#EF4444", lastSeen: "Bengaluru South", activeArea: "Jayanagar, Majestic", arrestsCount: 14,
    modusOperandi: "Night-time extortion of gold merchants, utilizing coercive threats and physical enforcers.",
    behavioralProfile: "Recidivist gang organizer. Deploys enforcers for violent assaults and handles fencing operations.",
    bankAccounts: [{ accNo: "AXIS-4009-122", bank: "Axis Bank", branch: "Jayanagar", balance: 1450000, flag: "Suspicious" }],
    tacticalLeads: "Monitor transaction links to Sunil 'Fence'. Wiretap calls placed near Jayanagar 4th Block.",
    recidivismTier: "Tier 1 - Extreme Risk"
  },
  "off_02": {
    id: "off_02", name: "Nagaraja 'Tiger'", alias: "ಟೈಗರ್ ನಾಗ", age: 34, gender: "Male", role: "Enforcer", status: "Under Custody", riskScore: 84, photoColor: "#F59E0B", lastSeen: "Parappana Agrahara Central Jail", activeArea: "Bengaluru Central", arrestsCount: 8,
    modusOperandi: "Physical assault, extortion, and armed robbery using lethal weapons.",
    behavioralProfile: "Violent offender with low impulse control. Acts strictly as execution hand for Rowdy Raju.",
    bankAccounts: [{ accNo: "CANARA-7788-99", bank: "Canara Bank", branch: "Gandhinagar", balance: 48000, flag: "Verified" }],
    tacticalLeads: "Verify communications in jail logs. Monitor associates attempting visits.",
    recidivismTier: "Tier 2 - High Risk"
  },
  "off_03": {
    id: "off_03", name: "Sunil 'Fence'", alias: "ಸುನಿಲ್", age: 48, gender: "Male", role: "Receiver of Stolen Property", status: "Out on Bail", riskScore: 68, photoColor: "#10B981", lastSeen: "Malleshwaram Jewellery Market", activeArea: "Bengaluru, Tumakuru", arrestsCount: 5,
    modusOperandi: "Fencing gold ornaments stolen by Raju's gang through jewelry stores.",
    behavioralProfile: "Socio-economic schemer. Filters funds, handles physical gold melting and digital transfers.",
    bankAccounts: [{ accNo: "HDFC-8809-543", bank: "HDFC Bank", branch: "Malleshwaram", balance: 3420000, flag: "Suspicious" }],
    tacticalLeads: "Audit shop invoice logs on dates coinciding with Jayanagar chain snatchings.",
    recidivismTier: "Tier 3 - Moderate Risk"
  },
  "off_04": {
    id: "off_04", name: "Manjunath", alias: "ಮಂಜ", age: 29, gender: "Male", role: "Driver & Logistic Planner", status: "Active", riskScore: 72, photoColor: "#3B82F6", lastSeen: "Kengeri Toll Plaza", activeArea: "Bengaluru Outskirts", arrestsCount: 4,
    modusOperandi: "Conducts daytime recce of jewelry houses and drives getaway vehicles.",
    behavioralProfile: "Follower personality. Accomplice driver in house burglaries.",
    bankAccounts: [{ accNo: "KGB-8811-002", bank: "Karnataka Gramin Bank", branch: "Kengeri", balance: 12000, flag: "Verified" }],
    tacticalLeads: "Monitor silver Mahindra Bolero (KA-05-MJ-4809). Check cell tower logs near Jayanagar.",
    recidivismTier: "Tier 2 - High Risk"
  },
  "off_05": {
    id: "off_05", name: "Sameer 'Chhota'", alias: "ಸಮೀರ್", age: 26, gender: "Male", role: "Pickpocket Coordinator", status: "Active", riskScore: 60, photoColor: "#8B5CF6", lastSeen: "Kalaburagi Bus Stand", activeArea: "Kalaburagi, Hubballi", arrestsCount: 9,
    modusOperandi: "Coordinates pickpocket rings in CBT Dharwad and Super Market Kalaburagi.",
    behavioralProfile: "Opportunist thief. Organizes pickpockets and sells stolen smart devices.",
    bankAccounts: [{ accNo: "SBI-4433-221", bank: "State Bank of India", branch: "Kalaburagi", balance: 34000, flag: "Verified" }],
    tacticalLeads: "Liaise with Hubballi police. Track IMEI registrations of phones stolen at CBT Dharwad.",
    recidivismTier: "Tier 1 - Extreme Risk"
  },
  "off_06": {
    id: "off_06", name: "Kiran 'Tech'", alias: "ಕಿರಣ್", age: 31, gender: "Male", role: "Cyber Fraud Specialist", status: "Active", riskScore: 78, photoColor: "#0D9488", lastSeen: "Whitefield Tech Park", activeArea: "Bengaluru, Mysuru", arrestsCount: 2,
    modusOperandi: "Aadhaar spoofing (AePS), phishing links, and bank OTP spoofing.",
    behavioralProfile: "Sophisticated digital hacker. Uses fake merchant identities to layer stolen funds.",
    bankAccounts: [{ accNo: "PAYTM-9090-111", bank: "Paytm Payments Bank", branch: "Digital", balance: 5600000, flag: "High Risk" }],
    tacticalLeads: "Trace cell tower telemetry of SIM cards registered under fictitious names in Whitefield.",
    recidivismTier: "Tier 3 - Moderate Risk"
  },
  "off_07": {
    id: "off_07", name: "Dreaded Deva", alias: "ದೇವ", age: 38, gender: "Male", role: "Contract Homicide Specialist", status: "Active", riskScore: 98, photoColor: "#EC4899", lastSeen: "Kalaburagi Outskirts", activeArea: "Kalaburagi, Vijayapura", arrestsCount: 6,
    modusOperandi: "Targeted contract killings (murder, IPC Sec 302) using localized faction gangs and crude weapons.",
    behavioralProfile: "Extremely violent and hostile homicide suspect. Recruits rural youth into contract gang rackets.",
    bankAccounts: [{ accNo: "BOB-9080-776", bank: "Bank of Baroda", branch: "Kalaburagi", balance: 950000, flag: "High Risk" }],
    tacticalLeads: "Coordinate with border checkposts in Bidar and Yadgir. Check hideout properties in Afzalpur.",
    recidivismTier: "Tier 1 - Extreme Risk"
  },
  "off_08": {
    id: "off_08", name: "Chori Chandru", alias: "ಚಂದ್ರು", age: 41, gender: "Male", role: "Master Housebreaker", status: "Under Custody", riskScore: 80, photoColor: "#06B6D4", lastSeen: "Mysuru Central Prison", activeArea: "Mysuru, Mandya", arrestsCount: 11,
    modusOperandi: "Night-time burglaries of locked residences using specialized lock-breaking instruments.",
    behavioralProfile: "Habitual property offender. Conducts detailed scouting of locked locks before breaking.",
    bankAccounts: [{ accNo: "CANARA-9001-22", bank: "Canara Bank", branch: "Mysuru Town", balance: 140000, flag: "Suspicious" }],
    tacticalLeads: "Verify pawn transactions at gold dealers in Mandya. Track associates in local scrap yards.",
    recidivismTier: "Tier 2 - High Risk"
  }
};

// Relational links
export const criminalNetwork = {
  nodes: Object.values(accusedProfiles),
  links: [
    { source: "off_01", target: "off_02", type: "Leader-Enforcer", strength: "High", amount: 450000, date: "2026-06-15" },
    { source: "off_01", target: "off_03", type: "Fencing Network", strength: "High", amount: 1200000, date: "2026-06-20" },
    { source: "off_01", target: "off_04", type: "Driver / Accomplice", strength: "Medium", amount: 80000, date: "2026-06-25" },
    { source: "off_02", target: "off_05", type: "Extortion Partners", strength: "Medium", amount: 150000, date: "2026-05-10" },
    { source: "off_03", target: "off_06", type: "Money Laundering Link", strength: "High", amount: 2800000, date: "2026-06-10" },
    { source: "off_07", target: "off_05", type: "Rival Recruitment Attempt", strength: "Low", amount: 0, date: "2026-04-18" },
    { source: "off_07", target: "off_02", type: "Hostile / Rivalry", strength: "High", amount: 0, date: "2026-03-01" },
    { source: "off_04", target: "off_08", type: "Logistical Support", strength: "Low", amount: 20000, date: "2026-05-22" }
  ]
};

// Suspicious Financial Transactions Table
export const financialTransactions = [
  { id: "tx_01", source: "Rowdy Raju", sourceAcc: "AXIS-4009-122", target: "Sunil 'Fence'", targetAcc: "HDFC-8809-543", amount: 1200000, type: "Gold Liquidation Settlement", flag: "Suspicious", date: "2026-06-20" },
  { id: "tx_02", source: "Sunil 'Fence'", sourceAcc: "HDFC-8809-543", target: "Kiran 'Tech'", targetAcc: "PAYTM-9090-111", amount: 2800000, type: "Digital Launder Transfer", flag: "High Risk", date: "2026-06-10" },
  { id: "tx_03", source: "Rowdy Raju", sourceAcc: "AXIS-4009-122", target: "Nagaraja 'Tiger'", targetAcc: "CANARA-7788-99", amount: 450000, type: "Enforcement Commission", flag: "Suspicious", date: "2026-06-15" },
  { id: "tx_04", source: "Dreaded Deva", sourceAcc: "BOB-9080-776", target: "Sameer 'Chhota'", targetAcc: "SBI-4433-221", amount: 200000, type: "Faction Murder Contract Pay", flag: "High Risk", date: "2026-06-02" }
];

// Database of First Information Reports (FIRs)
export const mockFIRs = [
  {
    id: "FIR_10443",
    caseNo: "10443",
    crimeNo: "CR-120/2026",
    district: "Bengaluru Urban",
    policeStation: "Jayanagar PS",
    sections: ["IPC 384 (Extortion)", "IPC 506 (Criminal Intimidation)", "IPC 120B (Criminal Conspiracy)"],
    accused: ["Rowdy Raju", "Nagaraja 'Tiger'"],
    victims: ["Anand Kumar (Shopkeeper)"],
    status: "Chargesheet Filed",
    date: "2026-03-12",
    briefFacts: "The complainant Anand Kumar reported receiving phone threats demanding protection money of ₹5,00,000. Under threat of physical harm, Tiger Nagaraja visited the store and extorted ₹1,00,000 cash. Raju coordinates. getaway vehicle: silver Bolero.",
    timeline: [
      { date: "2026-03-12", title: "FIR Registered", desc: "Complainant Anand Kumar filed statements at Jayanagar PS." },
      { date: "2026-03-15", title: "CCTV Trailed", desc: "Bolero spotted at Jayanagar signal." },
      { date: "2026-04-02", title: "Tiger Apprehended", desc: "Nagaraja Tiger arrested near Majestic." },
      { date: "2026-05-18", title: "Chargesheet Submitted", desc: "Investigating Officer submitted complete evidence logs." }
    ],
    similarCases: ["10405", "10280"],
    investigationLeads: ["Audit accounts of Sunil 'Fence' for gold transactions on March 13.", "Conduct night patrol surveillance near Jayanagar Station."]
  },
  {
    id: "FIR_20261",
    caseNo: "20261",
    crimeNo: "CR-42/2026",
    district: "Bengaluru Urban",
    policeStation: "Whitefield Cyber Crime PS",
    sections: ["IT Act Sec 66D (Cheating by Personation)", "IPC 420 (Cheating)"],
    accused: ["Kiran 'Tech'"],
    victims: ["Suresh Shenoy (Senior Citizen)"],
    status: "Under Investigation",
    date: "2026-05-02",
    briefFacts: "Complainant reported receiving a spoofed call requesting OTP verification. Following OTP transmission, ₹5,00,000 was debited and layered to digital wallets. IP address traced to Whitefield.",
    timeline: [
      { date: "2026-05-02", title: "Complaint Logged", desc: "Senior citizen files digital complaint." },
      { date: "2026-05-04", title: "Fund Trail Discovered", desc: "Moneys debited traced to Paytm Bank A/C PAYTM-9090-111." }
    ],
    similarCases: ["20188", "19942"],
    investigationLeads: ["Request KYC data from Paytm Bank.", "Track cell tower logs in Whitefield."]
  },
  {
    id: "FIR_30810",
    caseNo: "30810",
    crimeNo: "CR-95/2026",
    district: "Kalaburagi",
    policeStation: "Super Market PS",
    sections: ["IPC 379 (Theft)", "IPC 356 (Assault in theft)"],
    accused: ["Sameer 'Chhota'"],
    victims: ["Deepa Gowda (Commuter)"],
    status: "Under Investigation",
    date: "2026-06-18",
    briefFacts: "Victim's gold chain snatched by a pillion rider on a black motorcycle while she was shopping in Super Market Road, Kalaburagi. Offender fled toward Afzalpur Cross.",
    timeline: [
      { date: "2026-06-18", title: "Crime Committed", desc: "Victim's gold chain snatched during festive market hours." },
      { date: "2026-06-19", title: "FIR Filed", desc: "Victim provided description of motorcycle and rider alias 'Sameer'." }
    ],
    similarCases: ["30111", "30045"],
    investigationLeads: ["Review traffic camera footage at Afzalpur Cross.", "Check local gold pawn shops in Kalaburagi."]
  },
  {
    id: "FIR_40912",
    caseNo: "40912",
    crimeNo: "CR-88/2026",
    district: "Kalaburagi",
    policeStation: "Afzalpur Cross Station",
    sections: ["IPC 302 (Murder)", "IPC 120B (Criminal Conspiracy)"],
    accused: ["Dreaded Deva"],
    victims: ["Basavaraj Patil (Local rival contractor)"],
    status: "Under Active Investigation",
    date: "2026-06-01",
    briefFacts: "Local contractor Basavaraj Patil hacked to death in open daylight near Afzalpur border checkpost by three masked assailants. Suspicion points to contract contract murder ordered by Dreaded Deva.",
    timeline: [
      { date: "2026-06-01", title: "FIR Registered", desc: "Basavaraj Patil found dead. Eye witness statements registered." },
      { date: "2026-06-03", title: "Bank Trail Discovered", desc: "Suspicious ₹2,00,000 cash transfer made from Deva's account to pickpocket Sameer." }
    ],
    similarCases: ["38902", "37440"],
    investigationLeads: ["Interrogate Sameer regarding cash payload source.", "Surveillance on border checkposts between Kalaburagi and Yadgir."]
  },
  {
    id: "FIR_50112",
    caseNo: "50112",
    crimeNo: "CR-12/2026",
    district: "Mysuru",
    policeStation: "Devaraja Market PS",
    sections: ["IPC 380 (House Theft)", "IPC 457 (Lurking House Trespass)"],
    accused: ["Chori Chandru"],
    victims: ["Krishna Rao (Retired Bank Manager)"],
    status: "Solved",
    date: "2026-04-10",
    briefFacts: "The locked residence of Krishna Rao in Devaraja Market area broken into at night. Gold ornaments worth ₹3,50,000 stolen. Fingerprints matched Chori Chandru.",
    timeline: [
      { date: "2026-04-10", title: "FIR Logged", desc: "Complainant Rao reports burglary upon returning from travel." },
      { date: "2026-04-15", title: "Suspect Arrested", desc: "Chandru apprehended at pawn shop with stolen gold items." }
    ],
    similarCases: ["48900", "45901"],
    investigationLeads: ["Audit inventory logs of jewel dealers in Mandya.", "Trace accomplice fence operators associated with Chandru."]
  }
];

// Predictive warnings
export const predictiveWarnings = [
  { id: "w_01", district: "Bengaluru Urban", area: "Whitefield", message: "Phishing & SIM swapping anomaly detected. 35% spike in complaints.", type: "High Risk", time: "Just Now", rawRisk: 94 },
  { id: "w_02", district: "Kalaburagi", area: "Super Market Road", message: "Potential gang rivalry clash predicted based on repeat offender activity.", type: "Medium Risk", time: "2 hours ago", rawRisk: 72 },
  { id: "w_03", district: "Dharwad", area: "CBT Area", message: "Theft hotspot alert triggered. Higher incidence expected between 18:00 - 22:00.", type: "High Risk", time: "4 hours ago", rawRisk: 86 },
  { id: "w_04", district: "Mysuru", area: "Devaraja Market", message: "Low-level pickpocketing uptick detected due to tourist season arrival.", type: "Low Risk", time: "1 day ago", rawRisk: 45 }
];

// Conversational AI Answers Mapping
export const mockChatBotResponses = [
  {
    keywords: ["rowdy raju", "raju", "gang", "network"],
    englishResponse: "Rowdy Raju is a registered Category 'A' rowdy-sheeter in Bengaluru (Jayanagar Police Station). He runs an organized extortion and housebreaking network. Key gang members include Nagaraja 'Tiger' (Enforcer), Sunil 'Fence' (Receives goods), and Manjunath (Driver). There is a documented hostile rivalry with Prakash's gang in Hubballi.",
    kannadaResponse: "ರೌಡಿ ರಾಜು ಬೆಂಗಳೂರಿನ (ಜಯನಗರ ಪೊಲೀಸ್ ಠಾಣೆ) ವರ್ಗ 'ಎ' ರೌಡಿ-ಶೀಟರ್ ಆಗಿದ್ದಾನೆ. ಈತ ಸುಲಿಗೆ ಮತ್ತು ಮನೆಗಳ್ಳತನದ ಗ್ಯಾಂಗ್ ನಡೆಸುತ್ತಿದ್ದಾನೆ. ಪ್ರಮುಖ ಗ್ಯಾಂಗ್ ಸದಸ್ಯರಲ್ಲಿ ನಾಗರಾಜ 'ಟೈಗರ್' (ಸುಲಿಗೆದಾರ), ಸುನಿಲ್ 'ಫೆನ್ಸ್' (ಕದ್ದ ವಸ್ತುಗಳ ಸ್ವೀಕೃತಿದಾರ) ಮತ್ತು ಮಂಜುನಾಥ್ (ಚಾಲಕ) ಸೇರಿದ್ದಾರೆ. ಹುಬ್ಬಳ್ಳಿಯ ಪ್ರಕಾಶ್ ಗ್ಯಾಂಗ್ ಜೊತೆಗೆ ವೈಷಮ್ಯ ಹೊಂದಿರುವ ಬಗ್ಗೆ ದಾಖಲೆಗಳಿವೆ.",
    explainableAI: {
      sqlQuery: `SELECT cm.CaseNo, acc.AccusedName, acc.AgeYear, act.ShortName, sec.SectionCode, u.UnitName, emp.FirstName AS IO_Name 
FROM CaseMaster cm 
JOIN Accused acc ON cm.CaseMasterID = acc.CaseMasterID 
JOIN ActSectionAssociation asa ON cm.CaseMasterID = asa.CaseMasterID 
JOIN Act act ON asa.ActID = act.ActCode 
JOIN Section sec ON asa.SectionID = sec.SectionCode 
JOIN Unit u ON cm.PoliceStationID = u.UnitID 
JOIN Employee emp ON cm.PolicePersonID = emp.EmployeeID 
WHERE acc.AccusedName LIKE '%Raju%' OR cm.CrimeNo LIKE '10443%';`,
      confidenceScore: 0.96,
      rulesTriggered: "NER (Named Entity Recognition) -> Entity: 'Rowdy Raju'; Relationship Mapping Rule [R-04]",
      sourcesAudited: "CaseMaster, Accused, ActSectionAssociation, Act, Section, Unit, Employee",
      executionTimeMs: 14
    }
  },
  {
    keywords: ["bengaluru", "bangalore", "hotspot", "hotspots", "urban"],
    englishResponse: "In Bengaluru Urban, four critical hotspots have been detected: 1. Majestic Area (Pickpocketing, High severity), 2. Whitefield (Cyber Fraud & Phishing, High severity), 3. Jayanagar (Chain Snatching, Medium severity), and 4. Indiranagar (Nuisance & DUI, Medium severity). Predictive logs indicate an upward trend in cyber frauds.",
    kannadaResponse: "ಬೆಂಗಳೂರು ನಗರದಲ್ಲಿ ನಾಲ್ಕು ನಿರ್ಣಾಯಕ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ: 1. ಮೆಜೆಸ್ಟಿಕ್ ಏರಿಯಾ (ಜೇಬುಗಳ್ಳತನ, ಹೆಚ್ಚಿನ ತೀವ್ರತೆ), 2. ವೈಟ್‌ಫೀಲ್ಡ್ (ಸೈಬರ್ ವಂಚನೆ, ಹೆಚ್ಚಿನ ತೀವ್ರತೆ), 3. ಜಯನಗರ (ಸರಗಳ್ಳತನ, ಮಧ್ಯಮ ತೀವ್ರತೆ), ಮತ್ತು 4. ಇಂದಿರಾನಗರ (ನ್ಯೂಸೆನ್ಸ್ ಮತ್ತು ಮದ್ಯಪಾನ ಚಾಲನೆ, ಮಧ್ಯಮ ತೀವ್ರತೆ).",
    explainableAI: {
      sqlQuery: `SELECT d.DistrictName, u.UnitName, cm.latitude, cm.longitude, ch.CrimeGroupName, COUNT(cm.CaseMasterID) AS IncidentCount
FROM CaseMaster cm 
JOIN Unit u ON cm.PoliceStationID = u.UnitID 
JOIN District d ON u.DistrictID = d.DistrictID 
JOIN CrimeHead ch ON cm.CrimeMajorHeadID = ch.CrimeHeadID 
WHERE d.DistrictName = 'Bengaluru Urban' AND cm.CrimeRegisteredDate >= '2026-01-01'
GROUP BY d.DistrictName, u.UnitName, cm.latitude, cm.longitude, ch.CrimeGroupName
ORDER BY IncidentCount DESC;`,
      confidenceScore: 0.92,
      rulesTriggered: "Geospatial Boundary Rule -> District: 'Bengaluru Urban'; Severity Aggregation Rule",
      sourcesAudited: "CaseMaster, Unit, District, CrimeHead",
      executionTimeMs: 22
    }
  },
  {
    keywords: ["unemployment", "socio", "economic", "correlation", "demographic", "factor", "literacy"],
    englishResponse: "Analysis reveals a positive correlation (r = 0.74) between youth unemployment rates and property-related offenses (theft, robbery) in northern and eastern districts of Karnataka. Districts like Kalaburagi, with higher unemployment (8.2%), exhibit higher crime rates compared to Udupi or Mysuru. Conversely, cyber crime correlates positive with high literacy areas like Whitefield (88.4% literacy).",
    kannadaResponse: "ಯುವ ನಿರುದ್ಯೋಗ ದರಗಳು ಮತ್ತು ಆಸ್ತಿ ಸಂಬಂಧಿತ ಅಪರಾಧಗಳ (ಕಳ್ಳತನ, ದರೋಡೆ) ನಡುವೆ ಸಕಾರಾತ್ಮಕ ಸಂಬಂಧವಿರುವುದು (r = 0.74) ವಿಶ್ಲೇಷಣೆಯಿಂದ ತಿಳಿದುಬಂದಿದೆ. ಹೆಚ್ಚಿನ ನಿರುದ್ಯೋಗ ದರ (8.2%) ಹೊಂದಿರುವ ಕಲಬುರಗಿ ಜಿಲ್ಲೆಯು ಉಡುಪಿ ಅಥವಾ ಮೈಸೂರಿಗೆ ಹೋಲಿಸಿದರೆ ಹೆಚ್ಚಿನ ಅಪರಾಧ ದರವನ್ನು ಹೊಂದಿದೆ. ವೈಟ್‌ಫೀಲ್ಡ್‌ನಂತಹ ಹೆಚ್ಚಿನ ಸಾಕ್ಷರತೆಯಿರುವ ಪ್ರದೇಶಗಳಲ್ಲಿ ಸೈಬರ್ ಅಪರಾಧ ಹೆಚ್ಚಾಗಿರುವುದು ಕಂಡುಬಂದಿದೆ.",
    explainableAI: {
      sqlQuery: `SELECT d.DistrictName, d.UnemploymentRate, d.LiteracyRate, COUNT(cm.CaseMasterID) AS CrimeCount 
FROM District d 
LEFT JOIN Unit u ON d.DistrictID = u.DistrictID 
LEFT JOIN CaseMaster cm ON u.UnitID = cm.PoliceStationID 
GROUP BY d.DistrictName, d.UnemploymentRate, d.LiteracyRate 
ORDER BY d.UnemploymentRate DESC;`,
      confidenceScore: 0.88,
      rulesTriggered: "Statistical Correlation Parser -> Variables: ['unemployment_rate', 'crime_count']; Correlation coefficient calculator",
      sourcesAudited: "District, Unit, CaseMaster",
      executionTimeMs: 35
    }
  },
  {
    keywords: ["cyber", "fraud", "phishing", "online", "kiran", "tech"],
    englishResponse: "Cyber crimes have surged by 18% in the current quarter, primarily driven by SIM-swapping and Aadhaar Enabled Payment System (AePS) scams in Tech corridors. Offender Kiran 'Tech' is identified as an active coordinator. He was last traced near Whitefield, Bengaluru and is suspected of laundering ₹28,00000 via Sunil 'Fence' and digital Paytm escrow accounts.",
    kannadaResponse: "ಪ್ರಸ್ತುತ ತ್ರೈಮಾಸಿಕದಲ್ಲಿ ಸೈಬರ್ ಅಪರಾಧಗಳು ಶೇಕಡಾ 18 ರಷ್ಟು ಹೆಚ್ಚಾಗಿದೆ. ಮುಖ್ಯವಾಗಿ ಸಿಮ್-ಸ್ವಾಪಿಂಗ್ ಮತ್ತು ಆಧಾರ್ ಪಾವತಿ ಹಗರಣಗಳು ಹೆಚ್ಚಾಗಿವೆ. ಅಪರಾಧಿ ಕಿರಣ್ 'ಟೆಕ್' ಸಕ್ರಿಯ ಸಂಯೋಜಕನೆಂದು ಗುರುತಿಸಲಾಗಿದೆ. ಈತ ಸುನಿಲ್ ಸಹಾಯದಿಂದ ₹೨೮ ಲಕ್ಷ ಹಣ ವರ್ಗಾವಣೆ ಮಾಡಿದ ದಾಖಲೆಗಳಿವೆ.",
    explainableAI: {
      sqlQuery: `SELECT cm.CaseNo, acc.AccusedName, ch.CrimeGroupName, csh.CrimeHeadName, cm.BriefFacts 
FROM CaseMaster cm 
JOIN Accused acc ON cm.CaseMasterID = acc.CaseMasterID 
JOIN CrimeHead ch ON cm.CrimeMajorHeadID = ch.CrimeHeadID 
JOIN CrimeSubHead csh ON cm.CrimeMinorHeadID = csh.CrimeSubHeadID 
WHERE ch.CrimeGroupName = 'Cyber Crime' AND acc.AccusedName LIKE '%Kiran%';`,
      confidenceScore: 0.94,
      rulesTriggered: "Keyword Router -> Category: 'Cyber Crime'; Entity extraction: 'Kiran Tech'",
      sourcesAudited: "CaseMaster, Accused, CrimeHead, CrimeSubHead",
      executionTimeMs: 18
    }
  },
  {
    keywords: ["fir 10443", "case 10443", "extortion case"],
    englishResponse: "FIR Case No: 10443 (Jayanagar Police Station, Case No. CR-120/2026). Charge: Extortion (IPC Sec 384) & Conspiracy. Accused: Rowdy Raju and Nagaraja 'Tiger'. Victim: Anand Kumar. Status: Chargesheet Filed on 2026-05-18. Investigating Officer: Inspector Gowda.",
    kannadaResponse: "ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ: 10443 (ಜಯನಗರ ಪೊಲೀಸ್ ಠಾಣೆ, ಪ್ರಕರಣ ಸಂಖ್ಯೆ CR-120/2026). ಆರೋಪ: ಸುಲಿಗೆ (IPC Sec 384) ಮತ್ತು ಪಿತೂರಿ. ಆರೋಪಿಗಳು: ರೌಡಿ ರಾಜು ಮತ್ತು ಟೈಗರ್ ನಾಗರಾಜ. ಬಲಿಪಶು: ಆನಂದ್ ಕುಮಾರ್. ಸ್ಥಿತಿ: ಚಾರ್ಜ್ ಶೀಟ್ ಸಲ್ಲಿಸಲಾಗಿದೆ.",
    explainableAI: {
      sqlQuery: `SELECT * FROM CaseMaster WHERE CaseNo = '10443';`,
      confidenceScore: 0.99,
      rulesTriggered: "Direct Case ID Match Rule",
      sourcesAudited: "CaseMaster, Accused, Victim",
      executionTimeMs: 6
    }
  },
  {
    keywords: ["fir 20261", "case 20261", "cyber case"],
    englishResponse: "FIR Case No: 20261 (Whitefield Cyber Crime PS, Case No. CR-42/2026). Charge: Cheating by Personation (IT Act Sec 66D). Accused: Kiran 'Tech'. Victim: Suresh Shenoy. Status: Under Active Investigation. OTP Fraud involving ₹5,00,000.",
    kannadaResponse: "ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ: 20261 (ವೈಟ್‌ಫೀಲ್ಡ್ ಸೈಬರ್ ಕ್ರೈಮ್ ಠಾಣೆ). ಆರೋಪ: ಐಟಿ ಕಾಯ್ದೆ ಸೆಕ್ಷನ್ 66ಡಿ. ಆರೋಪಿ: ಕಿರಣ್ 'ಟೆಕ್'. ಬಲಿಪಶು: ಸುರೇಶ್ ಶೆಣೈ. ಸ್ಥಿತಿ: ತನಿಖೆಯಲ್ಲಿದೆ.",
    explainableAI: {
      sqlQuery: `SELECT * FROM CaseMaster WHERE CaseNo = '20261';`,
      confidenceScore: 0.99,
      rulesTriggered: "Direct Case ID Match Rule",
      sourcesAudited: "CaseMaster, Accused, Victim",
      executionTimeMs: 8
    }
  },
  {
    keywords: ["financial trail", "money trail", "laundering", "transaction", "transactions"],
    englishResponse: "Financial linkages analysis reveals a total of ₹5,100,000 flowing in suspicious trails. Key flows: 1. Rowdy Raju (AXIS-4009-122) transferred ₹1,200,000 to Sunil 'Fence' (HDFC-8809-543) flagged as Stolen Gold Liquidation. 2. Sunil 'Fence' routed ₹2,800,000 to Kiran 'Tech' (PAYTM-9090-111) flagged as High Risk digital escrow layering.",
    kannadaResponse: "ಹಣಕಾಸು ವರ್ಗಾವಣೆ ವಿಶ್ಲೇಷಣೆಯು ಒಟ್ಟು ₹೫೧,೦೦,೦೦೦ ಅನುಮಾನಾಸ್ಪದ ವಹಿವಾಟುಗಳನ್ನು ತೋರಿಸುತ್ತದೆ: ೧. ರೌಡಿ ರಾಜು ಜ್ಯುವೆಲ್ಲರಿ ವ್ಯಾಪಾರಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ ಸುನಿಲ್ ಫೆನ್ಸ್‌ಗೆ ₹೧೨ ಲಕ್ಷ ವರ್ಗಾವಣೆ ಮಾಡಿದ್ದಾನೆ. ೨. ಸುನಿಲ್ ಕಿರಣ್ ಟೆಕ್‌ಗೆ ₹೨೮ ಲಕ್ಷ ಹಣ ವರ್ಗಾಯಿಸಿದ್ದಾನೆ.",
    explainableAI: {
      sqlQuery: `SELECT * FROM FinancialTransaction WHERE Severity = 'High' OR Status = 'Suspicious';`,
      confidenceScore: 0.95,
      rulesTriggered: "Financial Transaction Linkage Rule [FT-08]",
      sourcesAudited: "FinancialTransaction, BankAccount",
      executionTimeMs: 25
    }
  }
];

// Fallback response generator if no query matches
export const getFallbackResponse = (query) => {
  return {
    englishResponse: `I searched the KSP crime records database for "${query}". No direct record matching this name or keyword was found in the active investigation index. However, generalized analytics show steady patrol effectiveness across 1100+ police stations. Try querying about:
1. Rowdy Raju's criminal network
2. Bengaluru crime hotspots
3. Unemployment and literacy crime correlation
4. Case 10443 or Case 20261 details
5. Suspicious money trails or transaction trails.`,
    kannadaResponse: `ನಾನು "${query}" ಗಾಗಿ ಕೆಎಸ್‌ಪಿ ಅಪರಾಧ ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿದೆ. ಸಕ್ರಿಯ ತನಿಖಾ ಸೂಚ್ಯಂಕದಲ್ಲಿ ಈ ಹೆಸರಿಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ನೇರ ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ. ಇವುಗಳ ಬಗ್ಗೆ ಪ್ರಶ್ನಿಸಿ: ೧. ರೌಡಿ ರಾಜು ಗ್ಯಾಂಗ್, ೨. ಬೆಂಗಳೂರು ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು, ೩. ನಿರುದ್ಯೋಗ ಮತ್ತು ಅಪರಾಧದ ಸಂಬಂಧ, ೪. ಪ್ರಕರಣ ೧೦೪೪೩ ರ ವಿವರ.`,
    explainableAI: {
      sqlQuery: `SELECT cm.CaseNo, cm.BriefFacts 
FROM CaseMaster cm 
WHERE cm.BriefFacts LIKE '%${query}%' OR cm.CrimeNo = '${query}'; -- Returned 0 rows`,
      confidenceScore: 0.50,
      rulesTriggered: "Fallback Search Engine; Pattern matching failed",
      sourcesAudited: "CaseMaster",
      executionTimeMs: 40
    }
  };
};

// Simulated Audit Trail Logger
export const auditTrail = [
  { id: "a_01", user: "Investigator Patil", role: "Investigator", action: "Queried intelligence dossier: Rowdy Raju", ip: "10.140.24.11", timestamp: "2026-07-05 20:02:15" },
  { id: "a_02", user: "Analyst Gowda", role: "Analyst", action: "Accessed Bengaluru Urban Hotspots GIS mapping overlay", ip: "10.140.24.45", timestamp: "2026-07-05 19:48:32" },
  { id: "a_03", user: "Admin Kumar", role: "Administrator", action: "Downloaded complete state crime trend PDF summary", ip: "10.140.24.2", timestamp: "2026-07-05 18:30:10" }
];
