import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function MobileFrameWrapper({ children }: { children: React.ReactNode }) {
  const { isPhoneFrameMode } = useAppStore();

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (!isPhoneFrameMode) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#030a04] flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      {/* Phone Hardware Mockup */}
      <div className="phone-mockup-frame flex flex-col relative">
        {/* Dynamic Island / Speaker Notch & Status Bar */}
        <div className="w-full bg-[#061208] px-6 pt-3 pb-2 flex items-center justify-between z-50 select-none border-b border-white/5">
          <span className="text-xs font-semibold text-gray-200 font-mono">{currentTime}</span>
          
          {/* Dynamic Pill Notch */}
          <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-1 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
          </div>

          <div className="flex items-center gap-1.5 text-gray-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-agri-accent fill-agri-accent" />
          </div>
        </div>

        {/* Inner Phone Viewport */}
        <div className="flex-1 overflow-y-auto relative bg-[#061208]">
          {children}
        </div>
      </div>
    </div>
  );
}
