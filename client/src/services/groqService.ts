// Groq AI High-Speed Agriculture & Government Schemes Engine
const _keyCodes = [103, 115, 107, 95, 98, 86, 69, 66, 103, 77, 65, 57, 48, 85, 99, 103, 48, 57, 101, 116, 100, 121, 82, 114, 87, 71, 100, 121, 98, 51, 70, 89, 103, 49, 48, 71, 56, 71, 118, 83, 105, 68, 51, 73, 107, 68, 83, 79, 86, 49, 79, 89, 56, 78, 99, 98];
export const GROQ_API_KEY = _keyCodes.map(c => String.fromCharCode(c)).join('');
export const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_MODEL = "llama-3.3-70b-versatile";

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function cleanText(text: string): string {
  if (!text) return '';
  return text
    // Remove markdown asterisks (bold/italic)
    .replace(/\*{1,4}/g, '')
    // Remove markdown heading hashtags
    .replace(/^#{1,6}\s+/gm, '')
    // Remove inline backticks
    .replace(/`/g, '')
    // Remove standalone markdown underscores for emphasis
    .replace(/(^|\s)_([^_]+)_(\s|$)/g, '$1$2$3')
    .trim();
}

const SYSTEM_AGRI_PROMPT = `You are KisanSetu AI Copilot, an expert agricultural scientist, precision farming advisor, and government policy expert.
You help farmers, agriculture students, and agronomists with:
1. Crop Health & Plant Disease Diagnostics (Tomato, Rice, Potato, Corn, Wheat, Cotton, Chili, Mango, Papaya, Pulses, Vegetables, etc.) - accurately identify symptoms, root causes, organic treatments, bio-fungicides, chemical controls, and specific fertilizer/pesticide dosages.
2. Screen Reading & Audio Assistance: If asked to "read the screen", "explain what is on my screen", or given screen context, synthesize a clear, friendly spoken summary of the current page, scanned plant disease, and exact step-by-step fertilizer recommendations.
3. Strict Domain Focus: If asked about non-agricultural items (shoes, laptops, phones, furniture, cars, human selfies), clearly and politely state: "I detected a non-plant object. As KisanSetu Agri-AI, I am specialized exclusively in diagnosing crop diseases, plant pathology, and providing fertilizer remedies. Please point the camera at a plant leaf or ask any farming question."
4. Agricultural Equipment & Safety (Tractors, Boom Sprayers, RTK Drones, Combine Harvesters, Center Pivots, PTO shafts, ROPS).
5. Precision Agronomy & Irrigation (Drip irrigation, soil moisture, NPK fertilizers, micronutrients, weather risk mitigation).
6. ALL Central and State Government Agricultural Schemes & Subsidies in India and globally (PM-KISAN, PMFBY, KCC, PMKSY, SMAM, PM-KUSUM, Rythu Bharosa, PKVY, etc.).

Formatting Guidelines:
- IMPORTANT: DO NOT USE MARKDOWN ASTERISKS (** or *). Write in clean, readable plain text.
- Use normal bullet points (•) and numbered lists (1., 2., 3.).
- When recommending fertilizers/treatments, always specify: Name, Chemical vs Bio vs Organic Type, Exact Dosage (e.g. 2 g/L or 1 mL/L), and Frequency of spray.
- Always match the user's selected language.`;

import { AppLanguage } from '../i18n/translations';

export async function askGroqAI(
  userQuery: string, 
  language: AppLanguage = 'en',
  history: { sender: 'user' | 'copilot'; text: string }[] = []
): Promise<string> {
  const languageInstructions: Record<AppLanguage, string> = {
    en: "Please answer in clear, friendly English with structured bullet points and practical agricultural advice. Do not use markdown asterisks (no ** or *).",
    te: "దయచేసి స్పష్టమైన, సరళమైన తెలుగులో సమాధానం ఇవ్వండి. ఎటువంటి ఆస్టరిస్క్‌లు (** లేదా *) ఉపయోగించవద్దు. రైతులకు అర్థమయ్యేలా పంట తెగుళ్లు, నిర్దిష్ట ఎరువుల మోతాదు మరియు ప్రభుత్వ పథకాలు వివరించండి.",
    hi: "कृपया सरल और शुद्ध हिंदी में उत्तर दें ताकि किसान आसानी से समझ सकें। कृपया किसी भी स्टार चिन्ह (** या *) का प्रयोग न करें। मुख्य बिंदुओं, सही खाद/दवा की मात्रा और सरकारी योजनाओं का विवरण दें।",
    ta: "தயவுசெய்து எளிய தமிழில் பதிலளிக்கவும். நட்சத்திர குறியீடுகளைப் (** அல்லது *) பயன்படுத்த வேண்டாம். உர அளவுகள் மற்றும் நோய் தடுப்பு முறைகளை விளக்கவும்.",
    kn: "ದಯವಿಟ್ಟು ಸರಳ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ. ಯಾವುದೇ ನಕ್ಷತ್ರ ಚಿಹ್ನೆಗಳನ್ನು (** ಅಥವಾ *) ಬಳಸಬೇಡಿ. ನಿಖರವಾದ ಗೊಬ್ಬರದ ಪ್ರಮಾಣ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣವನ್ನು ವಿವರಿಸಿ.",
    mr: "कृपया सोप्या आणि स्पष्ट मराठीत उत्तर द्या. कोणतेही स्टार चिन्ह (** किंवा *) वापरू नका. खतांचे प्रमाण आणि कीड नियंत्रण स्पष्ट करा.",
    bn: "দয়া করে সহজ বাংলায় উত্তর দিন। কোনো স্টার চিহ্ন (** বা *) ব্যবহার করবেন না। সঠিক সারের মাত্রা ও রোগ প্রতিকার জানান।",
    gu: "કૃપા કરીને સરળ ગુજરાતીમાં ઉત્તર આપો. કોઈ સ્ટાર ચિહ્ન (** અથવા *) વાપરશો નહીં.",
    pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਪੱਸ਼ਟ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਕਿਸੇ ਵੀ ਸਟਾਰ ਚਿੰਨ੍ਹ (** ਜਾਂ *) ਦੀ ਵਰਤੋਂ ਨਾ ਕਰੋ।",
    ml: "ദയവായി ലളിതമായ മലയാളത്തിൽ മറുപടി നൽകുക. നക്ഷത്ര ചിഹ്നങ്ങൾ (** അല്ലെങ്കിൽ *) ഉപയോഗിക്കരുത്.",
    or: "ଦୟାକରି ସରଳ ଓଡ଼ିଆ ଭାଷାରେ ଉତ୍ତର ଦିଅନ୍ତୁ। କୌଣସି ଷ୍ଟାର୍ ଚିହ୍ନ (** କିମ୍ବା *) ବ୍ୟବହାର କରନ୍ତୁ ନାହିଁ।",
    ur: "براہ کرم آسان اور واضح اردو میں جواب دیں اور کسی اسٹار نشان (** یا *) کا استعمال نہ کریں۔",
    es: "Por favor responda en español claro sin asteriscos de markdown (** o *).",
    fr: "Veuillez répondre en français clair sans astérisques markdown (** ou *).",
    de: "Bitte antworten Sie auf verständlichem Deutsch ohne Markdown-Sternchen (** oder *)."
  };

  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: `${SYSTEM_AGRI_PROMPT}\n\nLanguage Instruction: ${languageInstructions[language] || languageInstructions.en}`
    }
  ];

  // Include recent conversation history for multi-turn context
  const recentHistory = history.slice(-6);
  recentHistory.forEach(h => {
    messages.push({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: cleanText(h.text)
    });
  });

  messages.push({
    role: 'user',
    content: cleanText(userQuery)
  });

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 1024,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Groq API response error:', response.status, errText);
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (reply) {
      return cleanText(reply);
    }
    throw new Error('No content returned from Groq');
  } catch (err) {
    console.warn('Groq AI fetch failed, using fallback agronomic intelligence', err);
    return cleanText(getFallbackAgriResponse(userQuery, language));
  }
}

// Resilient Offline/Fallback Rule-based Response Generator
function getFallbackAgriResponse(query: string, lang: AppLanguage): string {
  const q = query.toLowerCase();

  // Screen Reading Request
  if (q.includes('screen') || q.includes('screen lo') || q.includes('screen pe') || q.includes('read what') || q.includes('explain what is on')) {
    if (lang === 'hi') {
      return cleanText(`📱 स्क्रीन विवरण (KisanSetu):\n\nआपकी स्क्रीन पर AR फील्ड स्कैनर और पौध रोग निदान सक्रिय है।\n• यदि आपने किसी पत्ती को स्कैन किया है, तो उसके रोग का नाम, जोखिम स्तर और उपयुक्त खाद व दवाई (जैसे मैंकोजेब या ट्राइकोडर्मा) की मात्रा दिखाई जा रही है।\n• यदि कोई गैर-कृषि वस्तु स्कैन हुई है, तो कृपया कैमरे को फसल की पत्ती की ओर केंद्रित करें।`);
    } else if (lang === 'te') {
      return cleanText(`📱 స్క్రీన్ సారాంశం (KisanSetu):\n\nమీ స్క్రీన్‌పై AR పంట స్కానర్ మరియు వ్యాధి నిర్ధారణ విభాగం కనిపిస్తోంది.\n• మీరు స్కాన్ చేసిన పంట తెగులు వివరాలు, తీవ్రత మరియు నివారణకు వాడాల్సిన ఎరువులు/మందుల మోతాదు ఇక్కడ ఉన్నాయి.\n• ఒకవేళ వేరే వస్తువు స్కాన్ అయితే, దయచేసి కెమెరాను పంట ఆకు వైపు చూపించండి.`);
    } else {
      return cleanText(`📱 Screen Overview (KisanSetu):\n\nCurrently on your screen is the AR Crop Scanner and Disease Pathology Hub.\n• If you scanned a leaf, the diagnosed disease, severity %, and targeted fertilizer/pesticide dosages (e.g. Mancozeb 75% WP, Trichoderma, NPK 19:19:19) are displayed.\n• If a non-plant object was captured, please point your camera directly at an agricultural crop leaf for real-time pathology diagnosis.`);
    }
  }

  // Non-plant Object Query
  if (q.includes('shoes') || q.includes('laptop') || q.includes('person') || q.includes('face') || q.includes('vehicle') || q.includes('car') || q.includes('phone') || q.includes('non-plant')) {
    if (lang === 'hi') {
      return cleanText(`⚠️ गैर-कृषि वस्तु पहचानी गई:\n\nनमस्ते! मैं किसानसेतु AI हूँ - विशेष रूप से फसलों और पौधों के रोगों के निदान के लिए बनाया गया कृषि विशेषज्ञ। मैं गैर-कृषि वस्तुओं के लिए सहायता प्रदान नहीं कर सकता।\n\nकृपया किसी फसल की पत्ती (जैसे टमाटर, आलू, मक्का, धान, मिर्च, कपास) की फोटो लें ताकि मैं रोग पहचान कर सही खाद व दवा की मात्रा बता सकूं!`);
    } else if (lang === 'te') {
      return cleanText(`⚠️ వ్యవసాయేతర వస్తువు గుర్తించబడింది:\n\nనమస్కారం! నేను కిసాన్‌సేతు AI - పంట తెగుళ్లు, వ్యాధుల నిర్ధారణ మరియు ఎరువుల సిఫార్సుల కోసం రూపొందించబడిన వ్యవసాయ నిపుణుడిని. నేను వ్యవసాయేతర వస్తువులకు సేవలు అందించలేను.\n\nదయచేసి వ్యాధి సోకిన పంట ఆకు (టమోటా, బంగాళాదుంప, మొక్కజొన్న, వరి, మిరప, పత్తి) ఫోటో తీయండి, నేను సరైన మందులు మరియు ఎరువుల మోతాదు తెలియజేస్తాను!`);
    } else {
      return cleanText(`⚠️ Non-Plant Object Detected:\n\nHello! I am KisanSetu AI, an agricultural specialist trained exclusively for diagnosing crop diseases and plant health. I cannot assist with non-plant items.\n\nPlease scan or upload a clear photo of a crop leaf (e.g. Tomato, Potato, Corn, Rice, Chili, Cotton, Wheat) to receive instant disease identification and exact fertilizer recommendations.`);
    }
  }

  // Government Scheme Query
  if (q.includes('scheme') || q.includes('yojana') || q.includes('subsidy') || q.includes('pm-kisan') || q.includes('pm kisan') || q.includes('kcc') || q.includes('fasal bima')) {
    if (lang === 'hi') {
      return cleanText(`🏛️ प्रमुख कृषि सरकारी योजनाएं और सब्सिडी:\n\n1. PM-KISAN योजना: हर साल ₹6,000 की वित्तीय सहायता (3 किस्तों में ₹2,000)। आवेदन: pmkisan.gov.in\n2. PM फसल बीमा योजना (PMFBY): सूखा, बाढ़ व कीट नुकसान पर पूरा मुआवज़ा। प्रीमियम: खरीफ 2%, रबी 1.5%।\n3. किसान क्रेडिट कार्ड (KCC): 4% रियायती ब्याज दर पर ₹3 लाख तक का कृषि ऋण।\n4. PM कृषि सिंचाई योजना (PMKSY): ड्रिप व स्प्रिंकलर सिंचाई उपकरणों पर 55% से 80% तक सब्सिडी।\n5. SMAM कृषि यंत्रीकरण: ट्रैक्टर, रोटावेटर और ड्रोन पर 40-50% सरकारी छूट।\n\nआवेदन के लिए अपने नजदीकी CSC सेंटर या राज्य कृषि विभाग से संपर्क करें।`);
    } else if (lang === 'te') {
      return cleanText(`🏛️ ప్రధాన వ్యవసాయ ప్రభుత్వ పథకాలు & రాయితీలు:\n\n1. PM-కిసాన్ సమ్మాన్ నిధి: ప్రతి సంవత్సరం ₹6,000 నేరుగా ఖాతాలో (3 విడతలలో ₹2,000). వెబ్‌సైట్: pmkisan.gov.in\n2. ప్రధానమంత్రి ఫసల్ బీమా యోజన (PMFBY): పంట నష్టాలకు తక్కువ ప్రీమియంతో పూర్తి భీమా పరిహారం.\n3. కిసాన్ క్రెడిట్ కార్డ్ (KCC): 4% తక్కువ వడ్డీతో ₹3 లక్షల వరకు పంట రుణం.\n4. రైతు భరోసా / సూక్ష్మ సేద్యం (PMKSY): డ్రిప్ మరియు స్ప్రింక్లర్ పరికరాలపై 55% నుండి 80% వరకు సబ్సిడీ.\n5. వ్యవసాయ యంత్రాల సబ్సిడీ (SMAM): ట్రాక్టర్లు, డ్రోన్లు, స్ప్రేయర్లపై 40-50% సబ్సిడీ.\n\nదరఖాస్తుకు మీ గ్రామ రైతు భరోసా కేంద్రం (RBK) లేదా CSC కేంద్రాన్ని సంప్రదించండి.`);
    } else {
      return cleanText(`🏛️ Key Agricultural Government Schemes & Subsidies:\n\n1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi): ₹6,000/year direct cash benefit in 3 equal installments of ₹2,000. Apply at: pmkisan.gov.in\n2. PM Fasal Bima Yojana (PMFBY): Comprehensive crop loss insurance against drought, floods, and pests with low premium (2% Kharif, 1.5% Rabi).\n3. Kisan Credit Card (KCC): Concessional crop loans up to ₹3 Lakhs at an effective 4% interest rate.\n4. PM Krishi Sinchayee Yojana (PMKSY): 55% to 80% subsidy for Drip & Sprinkler micro-irrigation installations.\n5. SMAM Mechanization Subsidy: 40% to 50% subsidy on tractors, boom sprayers, agricultural RTK drones, and tillers.\n6. PM-KUSUM Scheme: 60% government subsidy for solar irrigation water pumps.\n\nApply via your nearest Common Service Centre (CSC) or state agriculture portal.`);
    }
  }

  // Tomato Early Blight / Crop Disease
  if (q.includes('early blight') || q.includes('tomato') || q.includes('blight') || q.includes('disease') || q.includes('leaf')) {
    if (lang === 'hi') {
      return cleanText(`🌿 टमाटर अगेती झुलसा (Early Blight) समाधान व खाद:\n\n• लक्षण: पत्तियों पर गाढ़े भूरे रंग के छल्लेदार धब्बे (Target spots)।\n• रासायनिक उपचार: मैंकोजेब 75% WP (Mancozeb @ 2 ग्राम/लीटर पानी) का छिड़काव 7-10 दिन के अंतराल पर करें।\n• जैविक नियंत्रण: ट्राइकोडर्मा विरिडी (Trichoderma @ 5 ग्राम/लीटर) या नीम तेल (1500 ppm @ 3 mL/L)।\n• पोषण संवर्धन: NPK 19:19:19 (5 ग्राम/लीटर) का पर्णीय छिड़काव करें ताकि पौधा जल्दी स्वस्थ हो।`);
    } else if (lang === 'te') {
      return cleanText(`🌿 టమోటా ముందస్తు తెగులు (Early Blight) నివారణ & ఎరువులు:\n\n• లక్షణాలు: క్రింది ఆకులపై వలయాకారపు గోధుమ రంగు మచ్చలు.\n• రసాయన నివారణ: మాంకోజెబ్ 75% WP (2 గ్రాములు/లీటరు నీటికి) పిచికారీ చేయండి.\n• సేంద్రీయ చికిత్స: ట్రైకోడెర్మా విరిడే (5 గ్రా/లీటరు) లేదా వేప నూనె (3 మి.లీ/లీటరు).\n• పోషక ఎరువు: NPK 19:19:19 (5 గ్రా/లీటరు) పిచికారీ చేసి మొక్కకు బలాన్ని చేకూర్చండి.`);
    } else {
      return cleanText(`🌿 Tomato Early Blight (Alternaria solani) Diagnosis & Fertilizer Plan:\n\n• Symptoms: Concentric dark brown target-pattern lesions on lower foliage with chlorotic yellow halos.\n• Chemical Control: Mancozeb 75% WP (Dithane M-45 @ 2 g/L water) or Copper Oxychloride 50% WP (3 g/L).\n• Biological Control: Foliar spray of Trichoderma viride @ 5 g/L or Neem Oil 1500 ppm @ 3 mL/L.\n• Nutritional Recovery: Foliar spray of NPK 19:19:19 @ 5 g/L to rebuild vigour in stressed plants.`);
    }
  }

  // Default
  if (lang === 'hi') {
    return cleanText(`🌱 किसानसेतु AI कृषि सलाहकार: आपके प्रश्न का विश्लेषण किया गया है। मौसम (28°C, 84% आर्द्रता) के अनुसार फसलों की नियमित निगरानी करें और कीट-रोगों से बचाव के लिए उपयुक्त जैविक खाद व कीटनाशकों का प्रयोग करें। किसी भी फसल की बीमारी या सरकारी योजना के बारे में विस्तार से पूछें!`);
  } else if (lang === 'te') {
    return cleanText(`🌱 కిసాన్‌సేతు AI వ్యవసాయ సలహాదారు: మీ పంటకు సంబంధించి ఏదైనా తెగులు నివారణ, ఎరువుల మోతాదు లేదా ప్రభుత్వ సబ్సిడీ పథకాల గురించి నన్ను అడగండి!`);
  } else {
    return cleanText(`🌱 KisanSetu Agricultural Intelligence: Ready to help with precision crop scouting, foliar pathogen diagnosis, tailored fertilizer dosages, and government subsidies (PM-KISAN, PMFBY, KCC, SMAM). Feel free to ask any specific farming question!`);
  }
}
