import React from 'react';
import { 
  Home, 
  Building2, 
  Camera, 
  Users, 
  GraduationCap, 
  Scan
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { AppRoute } from '../types';

export function BottomNav() {
  const { currentRoute, setRoute, user, addToast, t } = useAppStore();

  const items = [
    { id: 'dashboard' as AppRoute, label: t('dashboard', 'Home'), icon: Home },
    { id: 'kisan-suvidha' as AppRoute, label: 'Suvidha', icon: Building2 },
    { id: 'ar-assistant' as AppRoute, label: t('arAssistant', 'AR Scan'), icon: Scan, isAction: true },
    { id: 'community' as AppRoute, label: t('community', 'Community'), icon: Users },
    { id: 'training' as AppRoute, label: t('training', 'Training'), icon: GraduationCap },
  ];

  const handleActionClick = (route: AppRoute) => {
    if (route === 'ar-assistant' && !user) {
      addToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in or register to use the AR Scanner.'
      });
      setRoute('login');
      return;
    }
    setRoute(route);
  };

  return (
    <div className="sticky bottom-0 z-40 w-full px-3 pb-3 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto bg-[#081f0d]/90 backdrop-blur-2xl border border-agri-accent/30 rounded-3xl p-1.5 shadow-2xl flex items-center justify-around relative">
        
        {items.map((item) => {
          const isActive = currentRoute === item.id;
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <div key={item.id} className="relative -top-5 flex flex-col items-center">
                <button
                  onClick={() => handleActionClick(item.id)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-glow-accent transform active:scale-95 transition-all ${
                    isActive 
                      ? 'bg-lime-400 text-black ring-4 ring-agri-accent/50 scale-105' 
                      : 'bg-agri-accent text-agri-darkest hover:scale-105'
                  }`}
                  title="Launch AR Field Assistant"
                >
                  <Camera className="w-7 h-7 stroke-[2.4]" />
                </button>
                <span className="text-[10px] font-bold text-agri-accent mt-0.5 font-mono">AR SCAN</span>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'text-agri-accent font-bold scale-105'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-agri-accent' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}

      </div>
    </div>
  );
}
