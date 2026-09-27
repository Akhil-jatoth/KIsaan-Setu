import React, { useState } from 'react';
import { Settings, Volume2, Globe, Wifi, Trash2, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function SettingsPage() {
  const { copilotLanguage, setCopilotLanguage, addToast, isOnline } = useAppStore();
  const [speechOn, setSpeechOn] = useState(true);
  const [highResCam, setHighResCam] = useState(true);

  const handleClearCache = () => {
    localStorage.removeItem('agrilens_scans');
    localStorage.removeItem('agrilens_progress');
    addToast({
      type: 'info',
      title: 'Local Cache Reset',
      message: 'Local storage state restored to initial demo defaults.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <div className="glass-panel p-6 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#09220e] to-agri-darkest">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-agri-accent" />
          <h1 className="text-2xl font-extrabold text-white">System Settings & Preferences</h1>
        </div>
        <p className="text-xs text-gray-300 font-mono mt-1">
          Configure WebAR camera parameters, voice synthesis, and offline cache storage
        </p>
      </div>

      <div className="space-y-4">
        
        {/* Language & Voice */}
        <div className="glass-panel p-5 border-white/10 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase font-mono flex items-center gap-2">
            <Globe className="w-4 h-4 text-agri-accent" />
            <span>AI Copilot Language & Speech Synthesis</span>
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'en', label: 'English (US/UK)' },
              { id: 'hi', label: 'हिंदी (Hindi)' },
              { id: 'te', label: 'తెలుగు (Telugu)' }
            ].map(l => (
              <button
                key={l.id}
                onClick={() => setCopilotLanguage(l.id as any)}
                className={`p-3 rounded-2xl border text-xs font-mono font-bold transition-all ${
                  copilotLanguage === l.id
                    ? 'bg-agri-accent text-black border-agri-accent shadow-glow-accent'
                    : 'bg-black/50 text-gray-300 border-white/10'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <span className="text-xs text-gray-300">Enable Voice Speech Synthesis</span>
            <input
              type="checkbox"
              checked={speechOn}
              onChange={(e) => setSpeechOn(e.target.checked)}
              className="w-4 h-4 accent-agri-accent"
            />
          </div>
        </div>

        {/* Camera Resolution */}
        <div className="glass-panel p-5 border-white/10 space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase font-mono">
            Camera & WebAR Optimization
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span>Request 1080p HD Video Stream where available</span>
            <input
              type="checkbox"
              checked={highResCam}
              onChange={(e) => setHighResCam(e.target.checked)}
              className="w-4 h-4 accent-agri-accent"
            />
          </div>
        </div>

        {/* Offline Cache & Diagnostics */}
        <div className="glass-panel p-5 border-white/10 space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase font-mono flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>Offline-First Storage Engine</span>
          </h3>
          <p className="text-xs text-gray-400">
            Status: {isOnline ? 'Connected to Cloud API' : 'Operating in Standalone Offline Demo Mode'}.
          </p>
          <button
            onClick={handleClearCache}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Demo Local Storage Cache</span>
          </button>
        </div>

      </div>

    </div>
  );
}
