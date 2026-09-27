import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquareCode,
  X,
  Send,
  Volume2,
  Mic,
  Bot,
  User,
  Square,
  Maximize2,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { SUPPORTED_LANGUAGES, AppLanguage } from '../i18n/translations';
import { cleanText } from '../services/groqService';

// Panel state
type PanelState = 'closed' | 'mini' | 'full';

export function FarmerCopilot() {
  const {
    isCopilotOpen,
    setCopilotOpen,
    language,
    setLanguage,
    copilotMessages,
    sendCopilotMessage,
    speakText,
    stopSpeech,
    speakingMessageId,
    readCurrentScreen,
    t
  } = useAppStore();

  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [panelState, setPanelState] = useState<PanelState>('mini');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Drag state
  const dragStartY = useRef<number | null>(null);
  const dragStartState = useRef<PanelState>('mini');
  const isDraggingRef = useRef(false);

  const quickPrompts = [
    { label: '📖 Read Screen', prompt: '__READ_SCREEN__', isAction: true },
    { label: '🏛️ Govt Schemes', prompt: 'What are the latest government agriculture schemes and subsidies available for farmers (PM-KISAN, PMFBY, KCC, Solar pump)?' },
    { label: '🍅 Early Blight Fix', prompt: 'How do I identify and treat Early Blight on my tomato plants? Which fertilizers should I use?' },
    { label: '🌿 Best Fertilizers', prompt: 'What are the best organic and chemical fertilizers I can use to treat plant diseases and improve crop health?' },
    { label: '🚜 Tractor Subsidy', prompt: 'How can I apply for 50% subsidy on tractors and farm machinery under the SMAM scheme?' },
    { label: '💧 Drip Irrigation', prompt: 'What is the subsidy percentage and application process for drip irrigation under PMKSY?' }
  ];

  // Sync open state
  useEffect(() => {
    if (isCopilotOpen) {
      setPanelState('mini');
    } else {
      setPanelState('closed');
    }
  }, [isCopilotOpen]);

  // Auto-scroll messages
  useEffect(() => {
    if (panelState !== 'closed') {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 150);
    }
  }, [copilotMessages, panelState]);

  // Clean up voice recognition
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, [language]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputVal.trim();
    if (!text) return;
    
    const lower = text.toLowerCase();
    if (lower.includes('read screen') || lower.includes('what is on my screen') || lower.includes('explain screen') || lower.includes('screen lo') || lower.includes('screen pe')) {
      readCurrentScreen();
      setInputVal('');
      return;
    }

    sendCopilotMessage(text);
    setInputVal('');
  };

  const handleVoiceInput = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      alert('Voice recognition is not supported in this browser.\nPlease use Chrome on Android or Desktop.\nYou can still type your question!');
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;
      const langObj = SUPPORTED_LANGUAGES.find(l => l.code === language);
      recognition.lang = langObj?.bcp47 ?? 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        let fullTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript;
        }
        if (fullTranscript) setInputVal(cleanText(fullTranscript));
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          alert('Microphone permission denied.\nPlease allow microphone access in your browser settings and try again.');
        } else if (e.error === 'network') {
          alert('Network error for speech recognition. Check your internet connection.');
        }
      };

      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      console.warn('Could not initialize speech recognition', err);
      setIsListening(false);
    }
  }, [isListening, language]);

  // ── Drag Handlers ────────────────────────────────────────────
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartY.current = e.clientY;
    dragStartState.current = panelState;
    isDraggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || dragStartY.current === null) return;
    isDraggingRef.current = false;
    const delta = dragStartY.current - e.clientY; // positive = dragged UP
    if (dragStartState.current === 'mini' && delta > 55) {
      setPanelState('full');
    } else if (dragStartState.current === 'full' && delta < -55) {
      setPanelState('mini');
    }
    dragStartY.current = null;
  };

  // ── Closed → floating FAB ────────────────────────────────────
  if (!isCopilotOpen || panelState === 'closed') {
    return (
      <div className="fixed bottom-20 right-5 z-40">
        <button
          onClick={() => { setCopilotOpen(true); setPanelState('mini'); }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-agri-accent to-emerald-400 text-agri-darkest shadow-glow-accent flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all border-2 border-white/40 cursor-pointer"
          title="Open AI Farmer Copilot"
        >
          <MessageSquareCode className="w-6 h-6 stroke-[2.2]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-lime-400 rounded-full border-2 border-agri-darkest animate-pulse" />
        </button>
      </div>
    );
  }

  const isFull = panelState === 'full';

  return (
    <div
      className={`fixed z-50 glass-panel border border-agri-accent/40 shadow-2xl flex flex-col overflow-hidden animate-fade-in bg-[#07190b]/96 transition-all duration-300 ease-in-out ${
        isFull
          ? 'inset-0 rounded-none'
          : 'bottom-5 right-5 w-[94vw] max-w-md h-[560px] rounded-2xl'
      }`}
    >
      {/* ── Drag Handle ─────────────────────────────────────── */}
      <div
        className="flex justify-center items-center pt-2 pb-1 cursor-grab active:cursor-grabbing select-none flex-shrink-0 touch-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        title={isFull ? 'Drag down to shrink' : 'Drag up for fullscreen'}
      >
        <div className="w-10 h-1.5 rounded-full bg-white/25 hover:bg-agri-accent/60 transition-colors" />
      </div>

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="px-4 py-2.5 bg-agri-darkest/90 border-b border-white/10 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-agri-accent text-agri-darkest flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">KisanSetu Copilot</span>
              <span className="text-[10px] bg-agri-accent/20 text-agri-accent px-1.5 py-0.5 rounded font-mono font-bold">AI PRO</span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono">Agricultural Voice &amp; Text Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Read Screen button */}
          <button
            onClick={readCurrentScreen}
            className="bg-agri-accent/20 hover:bg-agri-accent hover:text-black text-agri-accent border border-agri-accent/40 rounded-lg px-2 py-1 text-[11px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
            title="AI Copilot reads and explains what is currently on your screen"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Read Screen</span>
          </button>

          {/* Language select */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as AppLanguage)}
            className="bg-black/60 text-agri-accent border border-agri-accent/30 rounded-lg px-2 py-1 text-[11px] font-mono font-bold focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-black text-white">
                {lang.flag} {lang.nativeName}
              </option>
            ))}
          </select>

          {/* Expand / collapse */}
          <button
            onClick={() => setPanelState(isFull ? 'mini' : 'full')}
            className="text-gray-400 hover:text-agri-accent p-1.5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
            title={isFull ? 'Shrink to mini' : 'Expand fullscreen'}
          >
            {isFull ? <ChevronDown className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={() => { stopSpeech(); setCopilotOpen(false); setPanelState('closed'); }}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Messages Scroll Area ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0">
        {copilotMessages.map(msg => {
          const isUser = msg.sender === 'user';
          const isSpeakingThis = speakingMessageId === msg.id;
          return (
            <div key={msg.id} className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                isUser ? 'bg-sky-600 text-white' : 'bg-agri-accent text-agri-darkest'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                isUser
                  ? 'bg-sky-600/90 text-white rounded-tr-none'
                  : 'bg-agri-card text-gray-100 border border-agri-accent/20 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap">{cleanText(msg.text)}</p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[10px] text-gray-400 font-mono">
                  <span>{msg.time}</span>
                  {!isUser && msg.audioAvailable && (
                    <button
                      onClick={() => isSpeakingThis ? stopSpeech() : speakText(cleanText(msg.text), msg.id)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border font-mono font-bold transition-all cursor-pointer ${
                        isSpeakingThis
                          ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                          : 'bg-agri-accent/15 text-agri-accent border-agri-accent/30 hover:bg-agri-accent hover:text-black'
                      }`}
                      title={isSpeakingThis ? 'Stop Audio' : 'Listen in Selected Language'}
                    >
                      {isSpeakingThis
                        ? <><Square className="w-3 h-3 fill-current" /><span>{t('stop', 'Stop')}</span></>
                        : <><Volume2 className="w-3 h-3" /><span>{t('speak', 'Speak')}</span></>
                      }
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Prompts ────────────────────────────────────── */}
      <div className="px-3 py-1.5 bg-black/40 border-t border-white/5 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar flex-shrink-0">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (qp.isAction) {
                readCurrentScreen();
              } else {
                sendCopilotMessage(qp.prompt);
              }
            }}
            className={`flex-shrink-0 px-2.5 py-1 rounded-full border transition-all font-medium cursor-pointer ${
              qp.isAction
                ? 'bg-agri-accent text-agri-darkest font-bold border-agri-accent shadow-glow-accent'
                : 'bg-agri-card hover:bg-agri-accent hover:text-black text-gray-300 border-agri-accent/20'
            }`}
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* ── Live Listening Status ────────────────────────────── */}
      {isListening && (
        <div className="px-3.5 py-1.5 bg-red-500/20 border-t border-red-500/30 text-red-300 text-[11px] flex items-center justify-between font-mono animate-pulse flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="font-bold">🎙️ Listening live... Speak now</span>
          </div>
          <button
            type="button"
            onClick={handleVoiceInput}
            className="text-xs bg-red-500/40 hover:bg-red-500 text-white px-2 py-0.5 rounded font-bold transition-all cursor-pointer"
          >
            Stop
          </button>
        </div>
      )}

      {/* ── Input Box ───────────────────────────────────────── */}
      <form onSubmit={handleSend} className="p-3 bg-agri-darkest border-t border-white/10 flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex-shrink-0 ${
            isListening
              ? 'bg-red-500 text-white border-red-400 shadow-lg shadow-red-500/50 animate-bounce'
              : 'bg-black/50 text-agri-accent border-agri-accent/30 hover:bg-agri-accent/20'
          }`}
          title={isListening ? 'Tap to stop recording' : 'Tap mic to speak – voice types automatically'}
        >
          <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={isListening
            ? '🎙️ Speaking... Text appears here live'
            : t('copilotPlaceholder', 'Ask about diseases, fertilizers, schemes...')}
          className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agri-accent"
        />

        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="p-2.5 bg-agri-accent hover:bg-lime-400 disabled:opacity-40 text-agri-darkest font-bold rounded-xl shadow-glow-accent transition-all cursor-pointer flex-shrink-0"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
