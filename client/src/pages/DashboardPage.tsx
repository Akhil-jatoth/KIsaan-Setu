import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  GraduationCap, 
  Wrench, 
  BookOpen, 
  MapPin, 
  CloudRain, 
  Wind, 
  Droplets, 
  Sun, 
  CloudSun,
  CloudLightning,
  Cloud,
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Plane,
  ChevronRight,
  RefreshCw,
  Cpu,
  Building2
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { AppRoute } from '../types';
import { weatherService, LiveWeatherData } from '../services/weatherService';

export function DashboardPage() {
  const { user, setRoute, startJudgeDemo, setActiveCropId, setActiveTrainingId, setActiveEquipmentId, scans, addToast, t } = useAppStore();
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const userName = user?.name || (user?.phone ? `+91 ${user.phone}` : (user?.email ? user.email.split('@')[0] : 'Farmer'));

  const fetchLiveWeather = async () => {
    setLoadingWeather(true);
    try {
      const data = await weatherService.getLiveWeather();
      setWeather(data);
    } catch (e) {
      console.warn('Weather load error:', e);
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
  }, []);

  const getWeatherIcon = (code: number, isDay = true) => {
    if (code >= 95) return <CloudLightning className="w-5 h-5 text-amber-400 animate-pulse" />;
    if (code >= 51 && code <= 82) return <CloudRain className="w-5 h-5 text-sky-400" />;
    if (code === 1 || code === 2) return <CloudSun className="w-5 h-5 text-amber-300" />;
    if (code === 3 || code === 45 || code === 48) return <Cloud className="w-5 h-5 text-gray-300" />;
    return <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />;
  };

  const handleLaunchAR = () => {
    if (!user) {
      addToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in or register to access the AR Field Assistant.'
      });
      setRoute('login');
    } else {
      setRoute('ar-assistant');
    }
  };

  const activeFields = [
    {
      id: 'field-1',
      name: 'North Tomato Canopy (Block A)',
      crop: 'Tomato',
      area: '4.2 Acres',
      healthStatus: 'Moderate',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      ndviScore: '0.78',
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
      lastScanned: '2 hrs ago (Early Blight)'
    },
    {
      id: 'field-2',
      name: 'South Paddy Basin #4',
      crop: 'Rice',
      area: '6.0 Acres',
      healthStatus: 'Good',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      ndviScore: '0.92',
      image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=600&q=80',
      lastScanned: 'Yesterday'
    },
    {
      id: 'field-3',
      name: 'East Potato Ridge (Sector 3)',
      crop: 'Potato',
      area: '2.5 Acres',
      healthStatus: 'Good',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      ndviScore: '0.86',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
      lastScanned: '3 days ago'
    },
    {
      id: 'field-4',
      name: 'West Corn Plateau',
      crop: 'Corn',
      area: '3.8 Acres',
      healthStatus: 'Attention',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      ndviScore: '0.64',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
      lastScanned: '4 days ago'
    }
  ];

  const recentActivities = [
    {
      id: 'act-1',
      title: 'AR Foliar Scan: Tomato Early Blight',
      detail: 'Confidence 91% • Isolation guidance initiated',
      time: '2 hours ago',
      type: 'scan',
      icon: Camera,
      tag: 'Scouted',
      tagColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30'
    },
    {
      id: 'act-2',
      title: 'Tractor Safety Inspection 3D Module',
      detail: 'Completed 5/5 checkpoints • Knowledge score 95%',
      time: '5 hours ago',
      type: 'training',
      icon: GraduationCap,
      tag: 'Passed',
      tagColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    },
    {
      id: 'act-3',
      title: 'RTK Drone Precision Spray Scheduled',
      detail: 'Waypoint corridor #2 • 16L Bio-fungicide barrier',
      time: 'Yesterday',
      type: 'drone',
      icon: Plane,
      tag: 'Automated',
      tagColor: 'text-sky-400 bg-sky-400/10 border-sky-400/30'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Greeting Header & Live Weather Widget */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 glass-panel p-5 bg-gradient-to-r from-agri-dark via-[#09220e] to-agri-dark border-agri-accent/30 rounded-2xl">
        <div className="flex items-center gap-3.5">
          <img 
            src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
            alt={userName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-agri-accent shadow-glow-accent" 
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                {t('hi', 'Hi')}, {userName} 👋
              </h1>
              <span className="text-[10px] font-mono bg-agri-accent/20 text-agri-accent px-2 py-0.5 rounded-full border border-agri-accent/30">
                {t(user?.role || 'Farmer')}
              </span>
            </div>
            <p className="text-xs text-gray-300 font-mono mt-0.5">
              {user?.email ? `${user.email} • ` : ''}{t('fieldStation', 'Field Station')}: Block A • {t('telemetryLive', 'Telemetry Live')}
            </p>
          </div>
        </div>

        {/* Real Live Weather Widget with Refresh */}
        <div className="flex flex-wrap items-center gap-3 bg-black/50 px-4 py-2.5 rounded-2xl border border-agri-accent/20 text-xs font-mono w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5">
            {getWeatherIcon(weather?.weatherCode || 0, weather?.isDay ?? true)}
            <div>
              <div className="font-extrabold text-white text-base">
                {weather ? `${weather.temperature}°C` : '28°C'}
              </div>
              <div className="text-[10px] text-agri-accent font-semibold truncate max-w-[140px]">
                {weather?.condition || 'Live Weather Syncing...'}
              </div>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-white/15 hidden sm:block" />
          <div className="space-y-0.5 text-[11px] text-gray-300">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('humidity', 'Humidity')}: {weather?.humidity ?? 78}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('wind', 'Wind')}: {weather?.windSpeed ?? 12} km/h</span>
            </div>
          </div>
          <button
            onClick={fetchLiveWeather}
            disabled={loadingWeather}
            title="Refresh Live Weather Telemetry"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-agri-accent hover:text-black text-gray-400 transition-all border border-white/10 ml-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingWeather ? 'animate-spin text-agri-accent' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI Weather Agronomy Guess & Live Advisory Banner */}
      {weather && (
        <div className="p-4 rounded-2xl border border-agri-accent/30 bg-gradient-to-r from-[#0a2712] via-[#09200e] to-[#061208] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-agri-accent/20 text-agri-accent flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono text-xs font-bold text-agri-accent uppercase tracking-wider">
                {t('aiWeatherTitle', 'AI Weather Agronomy Intelligence')} ({weather.locationName})
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-gray-400">{t('spraySuitability', 'Spray Suitability')}:</span>
              <span className={`px-2 py-0.5 rounded-full font-bold border ${
                weather.sprayCondition === 'Optimal' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : weather.sprayCondition === 'Caution'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {t(weather.sprayCondition.toLowerCase(), weather.sprayCondition)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-300 font-sans">
            <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
              <Cpu className="w-4 h-4 text-agri-accent flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-[11px]">Microclimate AI Guess:</strong>
                <p className="text-gray-300 text-xs mt-0.5">{weather.aiAgronomyGuess}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
              <Droplets className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-mono text-[11px]">Precision Irrigation Action:</strong>
                <p className="text-gray-300 text-xs mt-0.5">{weather.irrigationAdvice}</p>
              </div>
            </div>
          </div>

          {weather.riskAlert && (
            <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{weather.riskAlert}</span>
            </div>
          )}
        </div>
      )}

      {/* 2x2 Metric Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 border-agri-accent/20">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1 font-mono">
            <span>{t('totalArea', 'Total Cultivated Area')}</span>
            <MapPin className="w-4 h-4 text-agri-accent" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">16.5 <span className="text-xs font-normal text-gray-400">{t('acres', 'Acres')}</span></div>
          <div className="text-[11px] text-agri-accent mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>4 {t('managedBlocks', 'Managed Blocks')}</span>
          </div>
        </div>

        <div className="glass-panel p-4 border-agri-accent/20">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1 font-mono">
            <span>{t('activeCrops', 'Active Monitored Crops')}</span>
            <BookOpen className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">4 <span className="text-xs font-normal text-gray-400">{t('varieties', 'Varieties')}</span></div>
          <div className="text-[11px] text-sky-400 mt-1 flex items-center gap-1">
            <span>{t('tomato')}, {t('rice')}, {t('potato')}, {t('corn')}</span>
          </div>
        </div>

        <div className="glass-panel p-4 border-agri-accent/20">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1 font-mono">
            <span>{t('fieldHealth', 'Field Health Index (NDVI)')}</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">92% <span className="text-xs font-normal text-gray-400">{t('optimal', 'Optimal')}</span></div>
          <div className="text-[11px] text-emerald-300 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>+3.2% vs last week</span>
          </div>
        </div>

        <div className="glass-panel p-4 border-agri-accent/20">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1 font-mono">
            <span>{t('estimatedYield', 'Estimated Season Yield')}</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">34.2 <span className="text-xs font-normal text-gray-400">{t('tons', 'Tons')}</span></div>
          <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
            <span>+12% {t('projectedYield', 'Projected Yield')}</span>
          </div>
        </div>

      </div>

      {/* Kisan Suvidha & Mandi Services Banner */}
      <div 
        onClick={() => setRoute('kisan-suvidha')}
        className="glass-panel p-5 cursor-pointer glass-card-hover border-emerald-500/40 bg-gradient-to-r from-[#072410] via-[#051a0b] to-[#041208] relative overflow-hidden rounded-2xl group shadow-lg"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-black flex items-center justify-center shadow-glow-accent group-hover:scale-110 transition-transform flex-shrink-0">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white group-hover:text-agri-accent transition-colors">
                  Kisan Suvidha Govt Schemes &amp; Live Mandi Hub
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                  NEW
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5 leading-snug">
                Check PM-KISAN ₹6,000 status, calculate PMFBY crop insurance, view AGMARKNET mandi rates, and apply for SMAM 50% machinery grants.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-agri-accent bg-black/40 px-3.5 py-2 rounded-xl border border-agri-accent/30 flex-shrink-0">
            <span>Explore Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Main Action Banner Cards (4-Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Start AR Field Scan */}
        <div 
          onClick={handleLaunchAR}
          className="glass-panel p-5 cursor-pointer glass-card-hover border-agri-accent/40 bg-gradient-to-br from-agri-dark via-[#0d3316] to-[#07190b] relative overflow-hidden group"
        >
          <div className="w-12 h-12 rounded-2xl bg-agri-accent text-agri-darkest flex items-center justify-center shadow-glow-accent mb-4 group-hover:scale-110 transition-transform">
            <Camera className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-extrabold text-white group-hover:text-agri-accent transition-colors">
            {t('arScanner', 'Launch AR Field Assistant')}
          </h3>
          <p className="text-xs text-gray-300 mt-1 leading-snug">
            Real-time camera scanner with holographic bounding boxes and lesion overlays.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-agri-accent">
            <span>{t('startScan', 'Open Camera')}</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Continue 3D Training */}
        <div 
          onClick={() => {
            setActiveTrainingId('module-tractor-safety');
            setRoute('training-experience');
          }}
          className="glass-panel p-5 cursor-pointer glass-card-hover border-sky-500/30 bg-gradient-to-br from-[#0a232f] via-[#091b24] to-[#061208] relative overflow-hidden group"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-500 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-extrabold text-white group-hover:text-sky-400 transition-colors">
            {t('trainingHub', 'Continue 3D Training')}
          </h3>
          <p className="text-xs text-gray-300 mt-1 leading-snug">
            Tractor Safety 5-point inspection scenario • 60% in progress.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-sky-400">
            <span>Resume (3/5 Steps)</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: 3D Equipment Digital Twins */}
        <div 
          onClick={() => {
            setActiveEquipmentId('tractor-x900');
            setRoute('equipment-detail');
          }}
          className="glass-panel p-5 cursor-pointer glass-card-hover border-amber-500/30 bg-gradient-to-br from-[#281f08] via-[#1b1505] to-[#061208] relative overflow-hidden group"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Wrench className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
            {t('machinery3d', '3D Machinery Digital Twins')}
          </h3>
          <p className="text-xs text-gray-300 mt-1 leading-snug">
            Interactive 360° inspection of AgriPro X-900 Tractor and Boom Sprayers.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-amber-300">
            <span>Inspect Models</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Crop Knowledge Library */}
        <div 
          onClick={() => setRoute('crops')}
          className="glass-panel p-5 cursor-pointer glass-card-hover border-emerald-500/30 bg-gradient-to-br from-[#0c2a15] via-[#081f0e] to-[#061208] relative overflow-hidden group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
            {t('cropLibrary', 'Crop Knowledge Library')}
          </h3>
          <p className="text-xs text-gray-300 mt-1 leading-snug">
            Pathogen identification guides, growth stage schedules, and bio-nutrients.
          </p>
          <div className="mt-4 flex items-center text-xs font-bold text-emerald-300">
            <span>Browse 4 Crops</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* Active Fields Horizontal Scroll Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold text-white">Active Farm Fields</h2>
            <span className="text-xs font-mono text-gray-400">({activeFields.length} active plots)</span>
          </div>
          <button 
            onClick={() => setRoute('field-detail')}
            className="text-xs font-mono text-agri-accent hover:underline flex items-center gap-1"
          >
            <span>Satellite Heatmap View</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeFields.map(f => (
            <div 
              key={f.id}
              onClick={() => setRoute('field-detail')}
              className="glass-panel overflow-hidden cursor-pointer glass-card-hover border-white/10 group"
            >
              <div className="h-32 w-full relative overflow-hidden">
                <img 
                  src={f.image} 
                  alt={f.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${f.badgeColor}`}>
                    {f.healthStatus}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-mono text-agri-accent border border-white/10">
                  NDVI {f.ndviScore}
                </div>
              </div>

              <div className="p-3.5 space-y-1">
                <div className="font-bold text-sm text-white truncate">{f.name}</div>
                <div className="text-xs text-gray-400 flex items-center justify-between">
                  <span>{f.crop} • {f.area}</span>
                  <span className="text-[10px] font-mono text-gray-500">{f.lastScanned}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: 7-Day Predictive Risk Radar & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 7-Day Predictive Risk Radar */}
        <div className="lg:col-span-6 glass-panel p-5 border-amber-500/30 bg-gradient-to-br from-[#1c1809] via-agri-dark to-[#07190b] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">7-Day Predictive Risk Radar</h3>
                <p className="text-[11px] text-gray-400 font-mono">Microclimate Pathogen Outbreak Forecast</p>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full animate-pulse">
              HIGH RISK (48h)
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/10">
            ⚠️ <strong>Early Blight Warning:</strong> Forecasted rain on Tuesday combined with 90% humidity creates prime conditions for Alternaria spore germination. Recommend preventative bio-fungicide barrier application.
          </p>

          {/* 7-Day Risk Chart Mini Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono pt-1">
            {[
              { day: 'Mon', score: 78, color: 'bg-amber-500' },
              { day: 'Tue', score: 88, color: 'bg-red-500' },
              { day: 'Wed', score: 62, color: 'bg-amber-500' },
              { day: 'Thu', score: 45, color: 'bg-lime-500' },
              { day: 'Fri', score: 30, color: 'bg-emerald-500' },
              { day: 'Sat', score: 25, color: 'bg-emerald-500' },
              { day: 'Sun', score: 28, color: 'bg-emerald-500' },
            ].map((d, i) => (
              <div key={i} className="bg-black/50 p-2 rounded-xl border border-white/5 space-y-1.5">
                <span className="text-gray-400 text-[10px]">{d.day}</span>
                <div className="w-full h-12 bg-black/60 rounded-lg flex items-end p-1">
                  <div 
                    className={`w-full rounded-md ${d.color}`} 
                    style={{ height: `${d.score}%` }} 
                  />
                </div>
                <span className="text-[10px] font-bold text-white">{d.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recent Field & Training Activities */}
        <div className="lg:col-span-6 glass-panel p-5 border-agri-accent/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-agri-accent" />
              <span>Recent Activity & Scouting Logs</span>
            </h3>
            <button 
              onClick={() => setRoute('history')}
              className="text-xs text-agri-accent font-mono hover:underline"
            >
              View Full History
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.map(act => {
              const Icon = act.icon;
              return (
                <div 
                  key={act.id} 
                  className="p-3 bg-black/40 rounded-2xl border border-white/5 flex items-start gap-3 hover:border-agri-accent/30 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-agri-card border border-agri-accent/20 flex items-center justify-center text-agri-accent flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-xs text-white truncate">{act.title}</div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${act.tagColor}`}>
                        {act.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{act.detail}</p>
                    <div className="text-[10px] text-gray-500 font-mono mt-1">{act.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
