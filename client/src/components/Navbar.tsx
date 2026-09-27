import React from 'react';
import { 
  Leaf, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  MessageSquareCode, 
  Award, 
  User as UserIcon,
  LogOut,
  ChevronDown,
  Globe2
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { AppRoute } from '../types';
import { SUPPORTED_LANGUAGES, AppLanguage } from '../i18n/translations';

export function Navbar() {
  const { 
    currentRoute, 
    setRoute, 
    user, 
    setUser, 
    language,
    setLanguage,
    t,
    isPhoneFrameMode, 
    togglePhoneFrame,
    isOnline,
    isCopilotOpen,
    setCopilotOpen,
    startJudgeDemo,
    addToast
  } = useAppStore();

  const navLinks: { route: AppRoute; label: string }[] = [
    { route: 'dashboard', label: t('dashboard', 'Dashboard') },
    { route: 'ar-assistant', label: t('arAssistant', 'AR Field Assistant') },
    { route: 'kisan-suvidha', label: '🏛️ Kisan Suvidha & Mandi' },
    { route: 'crops', label: t('crops', 'Crops') },
    { route: 'equipment', label: t('equipment', '3D Equipment') },
    { route: 'training', label: t('training', 'Training Hub') },
    { route: 'virtual-farm', label: t('virtualFarm', 'Virtual Farm VR') },
    { route: 'field-detail', label: t('fieldDetail', 'Field Satellite') },
    { route: 'community', label: t('community', 'Community') },
    { route: 'progress', label: t('progress', 'Progress') }
  ];

  const handleNavClick = (route: AppRoute) => {
    if (route === 'ar-assistant' && !user) {
      addToast({
        type: 'info',
        title: 'Sign In / Register Required',
        message: 'Please create an account or sign in to access the AR Field Assistant.'
      });
      setRoute('register');
      return;
    }
    setRoute(route);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#061208]/90 backdrop-blur-xl border-b border-agri-accent/20 px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setRoute('landing')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-agri-accent to-emerald-700 flex items-center justify-center shadow-glow-accent group-hover:scale-105 transition-transform flex-shrink-0">
            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-agri-darkest" />
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-agri-accent transition-colors">
                Kisan<span className="text-agri-accent">Setu</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold bg-agri-accent/20 text-agri-accent px-1.5 py-0.5 rounded border border-agri-accent/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-mono hidden sm:block">AI + AR SMART AGRICULTURE</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-black/30 p-1 rounded-2xl border border-white/5">
          {navLinks.map(link => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-agri-accent text-agri-darkest font-bold shadow-glow-accent'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          
          {/* Global Language Selector Dropdown */}
          <div className="flex items-center bg-black/50 border border-agri-accent/30 rounded-xl px-2 py-1 gap-1">
            <Globe2 className="w-3.5 h-3.5 text-agri-accent flex-shrink-0" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as AppLanguage)}
              className="bg-transparent text-white text-[11px] font-mono font-bold focus:outline-none cursor-pointer pr-1"
              title="Select Application Language"
            >
              {SUPPORTED_LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="bg-[#09220e] text-white">
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          {/* Offline / Online Status Indicator */}
          <div 
            title={isOnline ? "Connected to KisanSetu Cloud Engine" : "Offline Demo Mode Active (Full Local Capability)"}
            className={`hidden sm:flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono border backdrop-blur-md ${
              isOnline 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" /> : <WifiOff className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />}
            <span className="hidden md:inline">{isOnline ? t('online', 'Online') : t('offlineDemo', 'Offline Demo')}</span>
          </div>

          {/* Judge Demo Walkthrough Button */}
          <button
            onClick={startJudgeDemo}
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs shadow-lg transform hover:scale-105 transition-all"
            title={t('judgeDemoDesc', 'Start Guided 10-Step Hackathon Judge Demo')}
          >
            <Sparkles className="w-3.5 h-3.5 fill-current flex-shrink-0" />
            <span className="font-mono hidden md:inline">{t('judgeDemo', 'Judge Demo')}</span>
            <span className="font-mono md:hidden">{t('judgeDemo', 'Demo')}</span>
          </button>

          {/* Farmer Copilot Trigger */}
          <button
            onClick={() => setCopilotOpen(!isCopilotOpen)}
            className={`p-1.5 sm:p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isCopilotOpen 
                ? 'bg-agri-accent text-agri-darkest border-agri-accent shadow-glow-accent' 
                : 'bg-agri-card text-agri-accent border-agri-accent/30 hover:bg-agri-accent/20'
            }`}
            title="AI Farmer Copilot"
          >
            <MessageSquareCode className="w-4 h-4" />
            <span className="hidden lg:inline font-mono font-bold">{t('copilot', 'Copilot')}</span>
          </button>

          {/* Phone Mockup Frame Toggle (Visible only on desktop screens) */}
          <button
            onClick={togglePhoneFrame}
            className={`hidden md:flex p-2 rounded-xl border text-xs transition-all ${
              isPhoneFrameMode
                ? 'bg-agri-accent text-black border-agri-accent font-bold shadow-glow-accent'
                : 'bg-black/40 text-gray-300 border-white/10 hover:text-white hover:bg-white/10'
            }`}
            title={isPhoneFrameMode ? t('responsiveFullscreen', 'Switch to Responsive Fullscreen') : t('mobileMockup', 'Switch to Mobile 390px Mockup Frame')}
          >
            {isPhoneFrameMode ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* User Profile or Login/Register Buttons */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-1">
              <div 
                onClick={() => setRoute('dashboard')}
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer bg-agri-card px-2 sm:px-2.5 py-1 rounded-2xl border border-agri-accent/20 hover:border-agri-accent transition-all max-w-[130px] sm:max-w-[180px]"
              >
                <img 
                  src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
                  alt={user.name} 
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-agri-accent flex-shrink-0" 
                />
                <div className="text-left text-xs min-w-0">
                  <div className="font-bold text-white leading-tight truncate text-[11px] sm:text-xs">{user.name}</div>
                  <div className="text-[9px] sm:text-[10px] text-agri-accent leading-none font-mono truncate">{t(user.role)}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setUser(null);
                  setRoute('landing');
                }}
                className="text-gray-400 hover:text-red-400 p-1.5 transition-colors"
                title={t('logout', 'Log Out')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setRoute('login')}
                className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-glow-accent whitespace-nowrap transition-all"
              >
                {t('signIn', 'Sign In')}
              </button>
              <button
                onClick={() => setRoute('register')}
                className="hidden sm:inline-block bg-agri-card hover:bg-agri-cardLight text-white border border-agri-accent/40 font-bold text-xs px-3 py-2 rounded-xl whitespace-nowrap transition-all"
              >
                {t('register', 'Register')}
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
