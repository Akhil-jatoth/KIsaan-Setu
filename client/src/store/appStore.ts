import { useState, useEffect, useCallback } from 'react';
import { 
  AppRoute, 
  User, 
  Crop, 
  Disease, 
  Equipment, 
  TrainingModule, 
  ScanResult, 
  UserProgress, 
  ToastMessage 
} from '../types';
import { apiService } from '../services/apiService';
import { aiService, AIDetectionResult, DEMO_PRESET_SAMPLES } from '../services/aiService';

import { askGroqAI, cleanText } from '../services/groqService';

import { AppLanguage, SUPPORTED_LANGUAGES, getTranslation } from '../i18n/translations';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  time: string;
  audioAvailable?: boolean;
}

// Restore persistent session from localStorage on boot
function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem('kisansetu_user') || localStorage.getItem('agrilens_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStoredLanguage(): AppLanguage {
  try {
    const raw = localStorage.getItem('kisansetu_language');
    if (raw && SUPPORTED_LANGUAGES.some(l => l.code === raw)) {
      return raw as AppLanguage;
    }
  } catch {}
  return 'en';
}

const initialLang = getStoredLanguage();

// Global Store State Singleton
let globalState = {
  currentRoute: 'landing' as AppRoute,
  user: getStoredUser(),
  language: initialLang,
  speakingMessageId: null as string | null,
  activeCropId: 'tomato',
  activeDiseaseId: 'tomato-early-blight',
  activeEquipmentId: 'tractor-x900',
  activeTrainingId: 'module-tractor-safety',
  latestScan: null as ScanResult | null,
  scans: [] as ScanResult[],
  crops: [] as Crop[],
  diseases: [] as Disease[],
  equipmentList: [] as Equipment[],
  trainingModules: [] as TrainingModule[],
  progress: null as UserProgress | null,
  isPhoneFrameMode: false,
  isOnline: true,
  toasts: [] as ToastMessage[],
  isCopilotOpen: false,
  copilotLanguage: initialLang,
  copilotMessages: [
    {
      id: 'm-welcome',
      sender: 'copilot' as const,
      text: cleanText(getTranslation(initialLang, 'copilotWelcome', 'Namaste! I am your KisanSetu AI Copilot. Ask me about crop diseases, tractor safety, government schemes, or subsidies!')),
      time: 'Just now',
      audioAvailable: true
    }
  ] as CopilotMessage[],
  judgeDemoStep: 0,
  isJudgeDemoActive: false,
  speechEnabled: true
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(l => l());
}

export function useAppStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick(t => t + 1);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Initial loader
  useEffect(() => {
    async function initData() {
      // Restore persisted session from localStorage
      const savedUser = getStoredUser();
      if (savedUser) {
        globalState.user = savedUser;
      }

      // Load initial crops, diseases, equipment, modules
      const [crops, diseases, eq, modules, scans, progress, isOnline] = await Promise.all([
        apiService.getCrops(),
        apiService.getDiseases(),
        apiService.getEquipment(),
        apiService.getTrainingModules(),
        apiService.getScans(),
        apiService.getProgress(),
        apiService.checkHealth()
      ]);

      globalState.crops = crops;
      globalState.diseases = diseases;
      globalState.equipmentList = eq;
      globalState.trainingModules = modules;
      globalState.scans = scans;
      globalState.latestScan = scans[0] || null;
      globalState.progress = progress;
      globalState.isOnline = isOnline;
      notify();
    }

    initData();
  }, []);

  const setRoute = useCallback((route: AppRoute) => {
    globalState.currentRoute = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    notify();
  }, []);

  const setUser = useCallback((user: User | null) => {
    globalState.user = user;
    if (user) {
      localStorage.setItem('kisansetu_user', JSON.stringify(user));
      localStorage.setItem('agrilens_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('kisansetu_user');
      localStorage.removeItem('kisansetu_token');
      localStorage.removeItem('agrilens_user');
      localStorage.removeItem('agrilens_token');
    }
    notify();
  }, []);

  const setLanguage = useCallback((lang: AppLanguage) => {
    globalState.language = lang;
    globalState.copilotLanguage = lang;
    localStorage.setItem('kisansetu_language', lang);

    // Stop any currently playing audio immediately
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    globalState.speakingMessageId = null;

    // Reset copilot messages cleanly so the chatbot starts from the beginning in the new language
    const welcomeText = getTranslation(
      lang,
      'copilotWelcome',
      'Namaste! I am your KisanSetu AI Copilot. Ask me about crop diseases, tractor safety, government schemes, or subsidies!'
    );

    globalState.copilotMessages = [
      {
        id: `m-welcome-${Date.now()}`,
        sender: 'copilot',
        text: cleanText(welcomeText),
        time: 'Just now',
        audioAvailable: true
      }
    ];

    notify();
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastMessage = { ...toast, id };
    globalState.toasts = [...globalState.toasts, newToast];
    notify();

    setTimeout(() => {
      globalState.toasts = globalState.toasts.filter(t => t.id !== id);
      notify();
    }, toast.duration || 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    globalState.toasts = globalState.toasts.filter(t => t.id !== id);
    notify();
  }, []);

  const togglePhoneFrame = useCallback(() => {
    globalState.isPhoneFrameMode = !globalState.isPhoneFrameMode;
    notify();
  }, []);

  const setCopilotOpen = useCallback((open: boolean) => {
    globalState.isCopilotOpen = open;
    notify();
  }, []);

  const setCopilotLanguage = useCallback((lang: AppLanguage) => {
    setLanguage(lang);
  }, [setLanguage]);

  const stopSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    globalState.speakingMessageId = null;
    notify();
  }, []);

  const speakText = useCallback((text: string, msgId?: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      // Toggle off if currently speaking this same message
      if (globalState.speakingMessageId === msgId && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        globalState.speakingMessageId = null;
        notify();
        return;
      }

      window.speechSynthesis.cancel();
      const sanitized = cleanText(text);
      const utterance = new SpeechSynthesisUtterance(sanitized);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const langObj = SUPPORTED_LANGUAGES.find(l => l.code === globalState.language);
      if (langObj) {
        utterance.lang = langObj.bcp47;
      } else {
        utterance.lang = 'en-US';
      }

      if (msgId) {
        globalState.speakingMessageId = msgId;
        notify();
      }

      utterance.onend = () => {
        globalState.speakingMessageId = null;
        notify();
      };

      utterance.onerror = () => {
        globalState.speakingMessageId = null;
        notify();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
      globalState.speakingMessageId = null;
      notify();
    }
  }, []);

  const sendCopilotMessage = useCallback(async (text: string) => {
    const cleanedUserText = cleanText(text);
    if (!cleanedUserText) return;

    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: cleanedUserText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    globalState.copilotMessages = [...globalState.copilotMessages, userMsg];
    notify();

    // Generate real-time Groq AI response in selected language
    try {
      const reply = await askGroqAI(cleanedUserText, globalState.language, globalState.copilotMessages);

      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'copilot',
        text: cleanText(reply),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioAvailable: true
      };

      globalState.copilotMessages = [...globalState.copilotMessages, aiMsg];
      notify();
      // Chatbot remains normal/silent until user taps the speak button
    } catch (e) {
      console.warn('AI copilot error', e);
    }
  }, []);

  const saveScanFromAI = useCallback(async (detection: AIDetectionResult, imageUrl: string, location = 'Field Plot #1') => {
    const scanData = aiService.convertToScanResult(detection, imageUrl, location);
    const saved = await apiService.saveScan(scanData);
    globalState.latestScan = saved;
    globalState.scans = [saved, ...globalState.scans];
    
    // update progress scans count
    if (globalState.progress) {
      globalState.progress.totalScans += 1;
    }
    notify();
    return saved;
  }, []);

  const setActiveCropId = useCallback((id: string) => {
    globalState.activeCropId = id;
    notify();
  }, []);

  const setActiveDiseaseId = useCallback((id: string) => {
    globalState.activeDiseaseId = id;
    notify();
  }, []);

  const setActiveEquipmentId = useCallback((id: string) => {
    globalState.activeEquipmentId = id;
    notify();
  }, []);

  const setActiveTrainingId = useCallback((id: string) => {
    globalState.activeTrainingId = id;
    notify();
  }, []);

  const startJudgeDemo = useCallback(() => {
    globalState.isJudgeDemoActive = true;
    globalState.judgeDemoStep = 1;
    globalState.currentRoute = 'ar-assistant';
    notify();
  }, []);

  const setJudgeDemoStep = useCallback((step: number) => {
    globalState.judgeDemoStep = step;
    notify();
  }, []);

  const nextJudgeDemoStep = useCallback(() => {
    const next = globalState.judgeDemoStep + 1;
    globalState.judgeDemoStep = next;

    // Route transitions based on demo step
    if (next === 1) globalState.currentRoute = 'ar-assistant';
    else if (next === 6) globalState.currentRoute = 'guidance';
    else if (next === 7) {
      globalState.activeEquipmentId = 'tractor-x900';
      globalState.currentRoute = 'equipment-detail';
    }
    else if (next === 8) {
      globalState.activeTrainingId = 'module-tractor-safety';
      globalState.currentRoute = 'training-experience';
    }
    else if (next >= 10) {
      globalState.currentRoute = 'progress';
    }
    notify();
  }, []);

  const readCurrentScreen = useCallback(async () => {
    let screenContext = '';
    const route = globalState.currentRoute;

    if (route === 'ar-assistant' || route === 'crop-scanner') {
      if (globalState.latestScan) {
        const isNonPlant = globalState.latestScan.condition.toLowerCase().includes('non-plant');
        if (isNonPlant) {
          screenContext = `The user is on the AR Field Scanner. A non-agricultural object was detected. Please announce in a clear spoken voice that a non-plant object was detected and remind the farmer to point the camera at a crop leaf (e.g. tomato, potato, corn, rice, chili) for disease diagnosis and fertilizer advice.`;
        } else {
          screenContext = `The user is viewing the AR Crop Scanner result for ${globalState.latestScan.crop}. Diagnosed condition: ${globalState.latestScan.condition} with ${Math.round(globalState.latestScan.confidence * 100)}% confidence (${globalState.latestScan.riskLevel} risk). Read out the diagnosis, key symptoms, and specify the recommended fertilizers and dosages to treat and reduce this disease.`;
        }
      } else {
        screenContext = `The user is on the AR Field Scanner page awaiting photo input. Instruct them to tap 'Snap with Phone Camera' or pick a leaf from the gallery to diagnose plant health.`;
      }
    } else if (route === 'dashboard') {
      screenContext = `The user is on the KisanSetu Smart Dashboard. Read out the farm status, current weather (28°C, 84% humidity), regional disease alerts, and invite them to scan a crop leaf or check government schemes.`;
    } else if (route === 'guidance' || route === 'disease-analysis') {
      const d = globalState.diseases.find(x => x.id === globalState.activeDiseaseId) || globalState.diseases[0];
      if (d) {
        screenContext = `The user is on the Step Guidance page for ${d.name} affecting ${d.crop}. Expert advisory: ${d.expertAdvisory}. Prevention tips: ${d.prevention.join(', ')}.`;
      }
    } else if (route === 'kisan-suvidha') {
      screenContext = `The user is on the Kisan Suvidha Government & Mandi Hub. This includes PM-KISAN ₹6,000 installment tracking, PMFBY crop insurance premium calculator, live AGMARKNET daily mandi commodity prices, Soil Health card 12-parameter analyzer, and SMAM 40-50% machinery subsidies. Explain these services clearly.`;
    } else if (route === 'virtual-farm') {
      screenContext = `The user is on the 3D Virtual Farm Simulator viewing field layout, crop vegetative indices, and soil sensor nodes.`;
    } else if (route === 'equipment' || route === 'equipment-detail') {
      const eq = globalState.equipmentList.find(e => e.id === globalState.activeEquipmentId) || globalState.equipmentList[0];
      if (eq) {
        screenContext = `The user is viewing agricultural machinery details for ${eq.name} (${eq.category}). Highlight key safety protocols and 40-50% government subsidy under the SMAM mechanization scheme.`;
      }
    } else {
      screenContext = `The user is on the KisanSetu agricultural platform. Provide a brief friendly greeting and explain how to scan crops or ask about government subsidies.`;
    }

    globalState.isCopilotOpen = true;
    notify();

    const userPrompt = `Please read and explain what is on my screen right now: ${screenContext}`;
    
    // Add user message asking to read screen
    const userMsg: CopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: "📖 Read what is on my screen",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    globalState.copilotMessages = [...globalState.copilotMessages, userMsg];
    notify();

    try {
      const reply = await askGroqAI(userPrompt, globalState.language, globalState.copilotMessages);
      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: CopilotMessage = {
        id: aiMsgId,
        sender: 'copilot',
        text: cleanText(reply),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioAvailable: true
      };
      globalState.copilotMessages = [...globalState.copilotMessages, aiMsg];
      notify();

      // Automatically speak aloud the screen reading in the user's selected language
      speakText(cleanText(reply), aiMsgId);
    } catch (e) {
      console.warn('Read screen error', e);
    }
  }, [speakText]);

  const endJudgeDemo = useCallback(() => {
    globalState.isJudgeDemoActive = false;
    globalState.judgeDemoStep = 0;
    notify();
  }, []);

  return {
    ...globalState,
    setRoute,
    setUser,
    setLanguage,
    addToast,
    removeToast,
    togglePhoneFrame,
    setCopilotOpen,
    setCopilotLanguage,
    sendCopilotMessage,
    speakText,
    stopSpeech,
    readCurrentScreen,
    saveScanFromAI,
    setActiveCropId,
    setActiveDiseaseId,
    setActiveEquipmentId,
    setActiveTrainingId,
    startJudgeDemo,
    setJudgeDemoStep,
    nextJudgeDemoStep,
    endJudgeDemo,
    t: (key: string, fallback?: string) => getTranslation(globalState.language, key, fallback),
    activeCrop: globalState.crops.find(c => c.id === globalState.activeCropId) || globalState.crops[0],
    activeDisease: globalState.diseases.find(d => d.id === globalState.activeDiseaseId) || globalState.diseases[0],
    activeEquipment: globalState.equipmentList.find(e => e.id === globalState.activeEquipmentId) || globalState.equipmentList[0],
    activeTraining: globalState.trainingModules.find(t => t.id === globalState.activeTrainingId) || globalState.trainingModules[0],
    demoPresets: DEMO_PRESET_SAMPLES
  };
}
