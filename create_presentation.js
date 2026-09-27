const pptxgen = require('./client/node_modules/pptxgenjs');
const path = require('path');
const fs = require('fs');

async function createPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'KisanSetu Team';
  pptx.company = 'KisanSetu Smart Agriculture';
  pptx.title = 'KisanSetu - AI-Powered Smart Agriculture Assistant';

  // Define Theme Colors (Matching PDF style: Clean White/Minimal with Deep Purple & Emerald Green accents)
  const COLOR_PRIMARY = '4A3B69'; // Deep Slate Purple (PDF Header bar style)
  const COLOR_TEXT_DARK = '1E293B';
  const COLOR_TEXT_MUTED = '64748B';
  const COLOR_ACCENT = '16A34A'; // Emerald Green
  const COLOR_CARD_BG = 'F8FAFC';
  const COLOR_CARD_BORDER = 'E2E8F0';

  // Helper to add header bar and pin icon matching PDF
  function addSlideHeader(slide, titleText, slideNumber) {
    // Title
    slide.addText(titleText, {
      x: 0.8,
      y: 0.6,
      w: 11.5,
      h: 0.8,
      fontSize: 28,
      bold: true,
      color: '000000',
      fontFace: 'Arial'
    });

    // Decorative bottom bar matching PDF
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 7.1,
      w: 13.33,
      h: 0.4,
      fill: { color: '4A3B69' }
    });

    // Slide Number
    if (slideNumber) {
      slide.addText(slideNumber.toString(), {
        x: 12.5,
        y: 7.15,
        w: 0.6,
        h: 0.3,
        fontSize: 12,
        color: 'FFFFFF',
        align: 'right'
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // SLIDE 1: Title Slide (Team Name)
  // ─────────────────────────────────────────────────────────────
  const slide1 = pptx.addSlide();
  slide1.addText('Team Name', {
    x: 0.8,
    y: 0.6,
    w: 11.5,
    h: 0.9,
    fontSize: 40,
    bold: true,
    color: '000000',
    fontFace: 'Georgia'
  });

  const teamDetailsText = [
    { text: 'Project: ', options: { bold: true, color: '16A34A', fontSize: 18 } },
    { text: 'KisanSetu — AI-Powered Smart Agriculture & Pathology Platform\n\n', options: { bold: true, fontSize: 18 } },
    { text: 'Team Leader Name: ', options: { bold: true } },
    { text: '[Your Name]\n' },
    { text: 'Team Leader Mobile Number: ', options: { bold: true } },
    { text: '[Your Mobile Number]\n' },
    { text: 'Team Leader Email: ', options: { bold: true } },
    { text: '[Your Email]\n' },
    { text: 'No. of Team Members: ', options: { bold: true } },
    { text: '4\n' },
    { text: 'Mentor Name (if any): ', options: { bold: true } },
    { text: '[Mentor / Faculty Advisor Name]\n' },
    { text: 'Team Members Details: ', options: { bold: true } },
    { text: '[Member 1, Member 2, Member 3, Member 4]\n' },
    { text: 'College Name: ', options: { bold: true } },
    { text: '[Your College / University Name]' }
  ];

  slide1.addText(teamDetailsText, {
    x: 1.2,
    y: 1.8,
    w: 10.5,
    h: 4.8,
    fontSize: 16,
    color: '2D3748',
    lineSpacing: 26,
    fontFace: 'Arial'
  });

  slide1.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.1,
    w: 13.33,
    h: 0.4,
    fill: { color: '4A3B69' }
  });
  slide1.addText('1', { x: 12.5, y: 7.15, w: 0.6, h: 0.3, fontSize: 12, color: 'FFFFFF', align: 'right' });

  // ─────────────────────────────────────────────────────────────
  // SLIDE 2: Domain and Problem Statement
  // ─────────────────────────────────────────────────────────────
  const slide2 = pptx.addSlide();
  addSlideHeader(slide2, 'Domain and Problem Statement', 2);

  slide2.addText('Domain: Smart Agriculture, Computer Vision (AI/ML) & Precision Agronomy', {
    x: 1.0,
    y: 1.6,
    w: 11.3,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: '15803D',
    fontFace: 'Arial'
  });

  const problemPoints = [
    { text: 'Delayed Pathogen Identification: ', options: { bold: true } },
    { text: 'Fungal, bacterial, and viral crop diseases are identified too late, destroying 20% to 40% of seasonal yield for smallholder farmers.\n\n' },
    { text: 'Uncalibrated Chemical & Fertilizer Usage: ', options: { bold: true } },
    { text: 'Farmers lack accessible knowledge on exact chemical/bio-fungicide dosages, leading to excessive chemical toxicity or ineffective disease control.\n\n' },
    { text: 'Severe Language & Literacy Barriers: ', options: { bold: true } },
    { text: 'Existing advisory apps rely on dense English/Hindi text, excluding millions of vernacular-speaking farmers.\n\n' },
    { text: 'Welfare Information Gap: ', options: { bold: true } },
    { text: 'Eligible farmers miss out on crucial central & state government welfare schemes (PM-KISAN, PMFBY insurance, SMAM 50% machinery subsidies) due to lack of awareness.' }
  ];

  slide2.addText(problemPoints, {
    x: 1.0,
    y: 2.3,
    w: 11.3,
    h: 4.5,
    fontSize: 15,
    color: '1E293B',
    lineSpacing: 22,
    bullet: true,
    fontFace: 'Arial'
  });

  // ─────────────────────────────────────────────────────────────
  // SLIDE 3: Idea / Solution
  // ─────────────────────────────────────────────────────────────
  const slide3 = pptx.addSlide();
  addSlideHeader(slide3, 'Idea/Solution', 3);

  slide3.addText('Core Concept: An AI-Powered Agronomist & Pathology Doctor in Every Farmer’s Pocket', {
    x: 1.0,
    y: 1.6,
    w: 11.3,
    h: 0.5,
    fontSize: 16,
    bold: true,
    color: '15803D',
    fontFace: 'Arial'
  });

  const solutionPoints = [
    { text: '1-Click AR Camera Diagnosis: ', options: { bold: true } },
    { text: 'Farmers snap a photo of any crop leaf; edge vision AI instantly classifies the disease, calculates severity (%), and tracks lesion hotspots in < 2 seconds.\n\n' },
    { text: 'Tailored Fertilizer & Treatment Prescriptions: ', options: { bold: true } },
    { text: 'Delivers calibrated chemical controls (e.g. Mancozeb 75% WP @ 2g/L), bio-fungicides (Trichoderma), and recovery nutrients (NPK 19:19:19) with exact mixing dosages.\n\n' },
    { text: 'Voice Copilot with "Read Screen" Engine: ', options: { bold: true } },
    { text: 'Draggable multilingual AI assistant (Groq Llama-3.3) that reads aloud and explains screen content in 14+ Indian regional languages (Telugu, Hindi, Tamil, Kannada, etc.).\n\n' },
    { text: 'Intelligent Non-Plant Guardrails: ', options: { bold: true } },
    { text: 'Automatically recognizes and filters non-plant objects (shoes, electronics, furniture) with friendly guidance, preventing false diagnoses.' }
  ];

  slide3.addText(solutionPoints, {
    x: 1.0,
    y: 2.3,
    w: 11.3,
    h: 4.5,
    fontSize: 15,
    color: '1E293B',
    lineSpacing: 22,
    bullet: true,
    fontFace: 'Arial'
  });

  // ─────────────────────────────────────────────────────────────
  // SLIDE 4: Existing Vs Proposed System
  // ─────────────────────────────────────────────────────────────
  const slide4 = pptx.addSlide();
  addSlideHeader(slide4, 'Existing Vs Proposed System', 4);

  const tableRows = [
    [
      { text: 'Key Feature', options: { bold: true, fill: { color: '4A3B69' }, color: 'FFFFFF', fontSize: 13, align: 'center' } },
      { text: 'Existing Traditional Solutions', options: { bold: true, fill: { color: '4A3B69' }, color: 'FFFFFF', fontSize: 13, align: 'center' } },
      { text: 'KisanSetu (Proposed Solution)', options: { bold: true, fill: { color: '15803D' }, color: 'FFFFFF', fontSize: 13, align: 'center' } }
    ],
    [
      { text: 'Disease Diagnosis', options: { bold: true, fill: { color: 'F1F5F9' } } },
      { text: 'Slow manual lab visits or generic photo uploads with hours of delay.', options: { fill: { color: 'F1F5F9' } } },
      { text: 'Real-time Edge/WebAR inference in < 2 seconds with severity %.', options: { fill: { color: 'DCFCE7' }, bold: true } }
    ],
    [
      { text: 'Fertilizer Advice', options: { bold: true } },
      { text: 'Vague suggestions ("spray fungicide") without specific dosages.' },
      { text: '3-tier calibrated dosage (Chemical, Bio-fungicide, NPK) with exact g/L.', options: { fill: { color: 'DCFCE7' }, bold: true } }
    ],
    [
      { text: 'Voice & Language', options: { bold: true, fill: { color: 'F1F5F9' } } },
      { text: 'Text-heavy English/Hindi interfaces requiring high literacy.', options: { fill: { color: 'F1F5F9' } } },
      { text: '14+ Indian regional languages + Voice input + "Read Screen" audio.', options: { fill: { color: 'DCFCE7' }, bold: true } }
    ],
    [
      { text: 'Non-Plant Guardrails', options: { bold: true } },
      { text: 'Hallucinates and gives false disease outputs for non-plant images.' },
      { text: 'Pixel & feature filter detects non-plant items and guides the user.', options: { fill: { color: 'DCFCE7' }, bold: true } }
    ],
    [
      { text: 'Govt. Subsidies', options: { bold: true, fill: { color: 'F1F5F9' } } },
      { text: 'Scattered across unnavigable government websites.', options: { fill: { color: 'F1F5F9' } } },
      { text: 'Direct integrated advice on PM-KISAN, PMFBY, KCC & SMAM subsidies.', options: { fill: { color: 'DCFCE7' }, bold: true } }
    ]
  ];

  slide4.addTable(tableRows, {
    x: 0.8,
    y: 1.6,
    w: 11.7,
    h: 5.0,
    colW: [2.5, 4.6, 4.6],
    border: { pt: 1, color: 'CBD5E1' },
    fontSize: 12,
    fontFace: 'Arial',
    align: 'left',
    valign: 'middle'
  });

  // ─────────────────────────────────────────────────────────────
  // SLIDE 5: Innovation & USP
  // ─────────────────────────────────────────────────────────────
  const slide5 = pptx.addSlide();
  addSlideHeader(slide5, 'Innovation & USP', 5);

  const uspCards = [
    {
      title: '🎙️ Voice-First "Read Screen" Agronomist',
      desc: 'Farmers can listen to complete diagnostic summaries and dosage steps in their native dialect by tapping one button or using voice input.'
    },
    {
      title: '⚡ Dual AI Architecture Pipeline',
      desc: 'Seamlessly couples real-time Computer Vision for foliar lesion mapping with Groq-accelerated Llama-3.3 70B for agricultural reasoning.'
    },
    {
      title: '🛡️ Intelligent Non-Plant Guardrails',
      desc: 'Eliminates AI hallucinations by inspecting leaf chlorophyll and rejecting non-agricultural items (electronics, clothing, shoes).'
    },
    {
      title: '🌱 Integrated Pest & Nutrient Strategy',
      desc: 'Provides balanced 3-tier prescriptions: Emergency Chemical Cure + Organic Bio-fungicide + Restorative NPK Micronutrients.'
    }
  ];

  uspCards.forEach((card, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const xPos = 1.0 + col * 5.8;
    const yPos = 1.8 + row * 2.5;

    slide5.addShape(pptx.ShapeType.roundRect, {
      x: xPos,
      y: yPos,
      w: 5.4,
      h: 2.2,
      fill: { color: 'F8FAFC' },
      line: { color: 'CBD5E1', width: 1.5 },
      rectRadius: 0.2
    });

    slide5.addText(card.title, {
      x: xPos + 0.25,
      y: yPos + 0.2,
      w: 4.9,
      h: 0.45,
      fontSize: 15,
      bold: true,
      color: '15803D',
      fontFace: 'Arial'
    });

    slide5.addText(card.desc, {
      x: xPos + 0.25,
      y: yPos + 0.7,
      w: 4.9,
      h: 1.3,
      fontSize: 13,
      color: '334155',
      lineSpacing: 18,
      fontFace: 'Arial'
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SLIDE 6: Objective & Scope of Solution
  // ─────────────────────────────────────────────────────────────
  const slide6 = pptx.addSlide();
  addSlideHeader(slide6, 'Objective & Scope of Solution', 6);

  slide6.addText('Key Objectives:', {
    x: 1.0,
    y: 1.5,
    w: 5.4,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: '15803D',
    fontFace: 'Arial'
  });

  const objectives = [
    { text: 'Instant Field Diagnosis: ', options: { bold: true } },
    { text: 'Provide zero-friction plant disease detection on mobile devices without lab dependency.\n\n' },
    { text: 'Precision Chemical Dosage: ', options: { bold: true } },
    { text: 'Reduce input costs and environmental toxicity through calibrated chemical & bio-fungicide ratios.\n\n' },
    { text: 'Universal Vernacular Access: ', options: { bold: true } },
    { text: 'Break the literacy barrier using spoken voice output in 14+ Indian languages.' }
  ];

  slide6.addText(objectives, {
    x: 1.0,
    y: 2.0,
    w: 5.4,
    h: 4.6,
    fontSize: 14,
    color: '1E293B',
    lineSpacing: 20,
    bullet: true,
    fontFace: 'Arial'
  });

  slide6.addText('Scope of Solution:', {
    x: 6.9,
    y: 1.5,
    w: 5.4,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: '4A3B69',
    fontFace: 'Arial'
  });

  const scopePoints = [
    { text: 'Current Scope: ', options: { bold: true } },
    { text: 'Field pathology for Tomato, Potato, Corn, Rice, Wheat, Cotton, and Chili; Multilingual voice Copilot; Government scheme advisories; Web PWA & Flutter mobile client.\n\n' },
    { text: 'Future Roadmap: ', options: { bold: true } },
    { text: 'Multispectral drone scouting integration, IoT soil moisture/NPK telemetry, and direct marketplace linkage for fair mandi prices.' }
  ];

  slide6.addText(scopePoints, {
    x: 6.9,
    y: 2.0,
    w: 5.4,
    h: 4.6,
    fontSize: 14,
    color: '1E293B',
    lineSpacing: 20,
    bullet: true,
    fontFace: 'Arial'
  });

  // ─────────────────────────────────────────────────────────────
  // SLIDE 7: System Architecture
  // ─────────────────────────────────────────────────────────────
  const slide7 = pptx.addSlide();
  addSlideHeader(slide7, 'System Architecture', 7);

  // Check if architecture image exists and embed
  const archImagePath = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\066c3867-f9b9-4642-8040-33c70db98e23\\kisansetu_detailed_arch_1790485768932.jpg';
  if (fs.existsSync(archImagePath)) {
    slide7.addImage({
      path: archImagePath,
      x: 0.8,
      y: 1.6,
      w: 6.8,
      h: 5.1
    });
  }

  const archBullets = [
    { text: '1. Presentation Layer:\n', options: { bold: true, color: '15803D' } },
    { text: 'Flutter App + React PWA with WebAR camera stream and Web Speech voice input.\n\n' },
    { text: '2. Application Core:\n', options: { bold: true, color: '15803D' } },
    { text: 'Real-time pixel analyzer, lesion hotspot pin mapper, and Zustand state store.\n\n' },
    { text: '3. Dual AI Processing Engine:\n', options: { bold: true, color: '15803D' } },
    { text: '• Vision Model: Pathogen classification & fertilizer dosage mapping.\n• Groq Llama-3.3 70B: Multilingual conversational agronomist & scheme intelligence.\n\n' },
    { text: '4. Backend & Cloud:\n', options: { bold: true, color: '15803D' } },
    { text: 'Node.js REST API + Firebase Cloud Firestore for historical health tracking.' }
  ];

  slide7.addText(archBullets, {
    x: 7.9,
    y: 1.6,
    w: 4.7,
    h: 5.1,
    fontSize: 12,
    color: '1E293B',
    lineSpacing: 16,
    fontFace: 'Arial'
  });

  // ─────────────────────────────────────────────────────────────
  // SLIDE 8: Resources Required
  // ─────────────────────────────────────────────────────────────
  const slide8 = pptx.addSlide();
  addSlideHeader(slide8, 'Resources Required', 8);

  const resourceCategories = [
    {
      title: '💻 Technologies & Frameworks',
      items: '• Frontend: React 18, TypeScript, Vite, TailwindCSS, Flutter (Dart), Three.js\n• Backend: Node.js, Express REST API, Firebase Firestore & Auth\n• AI/ML: Groq Cloud (Llama-3.3 70B), Web Speech API, Computer Vision Pipeline'
    },
    {
      title: '📊 Datasets & Agronomic Repositories',
      items: '• PlantVillage Dataset: 50,000+ curated leaf images of diseased & healthy crops\n• ICAR & Agri University Standards: Calibrated chemical/bio-fungicide dosage formulas\n• Government Welfare Portals: Data on PM-KISAN, PMFBY, KCC, and SMAM subsidies'
    },
    {
      title: '📱 Hardware & Deployment Resources',
      items: '• User Hardware: Any smartphone with 5MP+ camera & web browser / Android OS\n• Cloud Infrastructure: Serverless cloud functions, Firebase DB, and edge neural caching'
    }
  ];

  resourceCategories.forEach((res, idx) => {
    const yPos = 1.6 + idx * 1.75;
    slide8.addShape(pptx.ShapeType.roundRect, {
      x: 1.0,
      y: yPos,
      w: 11.3,
      h: 1.55,
      fill: { color: 'F8FAFC' },
      line: { color: 'CBD5E1', width: 1.2 },
      rectRadius: 0.15
    });

    slide8.addText(res.title, {
      x: 1.2,
      y: yPos + 0.15,
      w: 10.8,
      h: 0.35,
      fontSize: 15,
      bold: true,
      color: '15803D',
      fontFace: 'Arial'
    });

    slide8.addText(res.items, {
      x: 1.2,
      y: yPos + 0.55,
      w: 10.8,
      h: 0.9,
      fontSize: 13,
      color: '334155',
      lineSpacing: 18,
      fontFace: 'Arial'
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SLIDE 9: Thank You!
  // ─────────────────────────────────────────────────────────────
  const slide9 = pptx.addSlide();
  slide9.addText('Thank You!', {
    x: 0.8,
    y: 1.8,
    w: 11.5,
    h: 1.2,
    fontSize: 52,
    bold: true,
    color: '000000',
    fontFace: 'Georgia'
  });

  const thankYouText = [
    { text: 'KisanSetu — Empowering Every Farmer with Accessible AI Intelligence 🌱\n\n', options: { bold: true, fontSize: 18, color: '16A34A' } },
    { text: 'Live Application: ', options: { bold: true } },
    { text: 'http://localhost:5173\n' },
    { text: 'GitHub Repository: ', options: { bold: true } },
    { text: 'https://github.com/your-team/kisansetu\n\n' },
    { text: 'Open for Questions & Discussion with the Jury.', options: { italic: true, color: '64748B' } }
  ];

  slide9.addText(thankYouText, {
    x: 0.8,
    y: 3.2,
    w: 11.5,
    h: 3.0,
    fontSize: 16,
    color: '2D3748',
    lineSpacing: 26,
    fontFace: 'Arial'
  });

  slide9.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 7.1,
    w: 13.33,
    h: 0.4,
    fill: { color: '4A3B69' }
  });
  slide9.addText('9', { x: 12.5, y: 7.15, w: 0.6, h: 0.3, fontSize: 12, color: 'FFFFFF', align: 'right' });

  // Save PPTX
  const outputPath = path.join(__dirname, 'KisanSetu_Presentation.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`✅ PowerPoint presentation created successfully at: ${outputPath}`);
}

createPresentation().catch(err => {
  console.error('Error generating presentation:', err);
});
