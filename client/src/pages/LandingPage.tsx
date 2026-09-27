import React from 'react';
import { 
  Leaf, 
  Camera, 
  GraduationCap, 
  Sparkles, 
  Cpu, 
  Compass, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Smartphone, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Play,
  Layers,
  Activity,
  Award,
  Globe2
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Hero3DScene } from '../components/3d/Hero3DScene';
import { SUPPORTED_LANGUAGES, AppLanguage } from '../i18n/translations';

export function LandingPage() {
  const { user, setRoute, startJudgeDemo, addToast, language, setLanguage, t } = useAppStore();

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

  const stats = [
    { value: '4+', label: t('statCrops', 'Supported Crops'), detail: 'Tomato, Potato, Corn, Rice' },
    { value: '96%', label: t('statAccuracy', 'AI Accuracy'), detail: 'Edge Computer Vision' },
    { value: '5+', label: t('statTraining', '3D Training Modules'), detail: 'Pre-op, Safety, Agronomy' },
    { value: '100%', label: t('statOffline', 'Offline Ready'), detail: 'Zero Connectivity Lock' }
  ];

  const features = [
    {
      icon: Camera,
      title: t('launchAR', 'Real WebAR Field Assistant'),
      desc: t('launchARDesc', 'Live camera stream with holographic bounding boxes, lesion detection pins, and AR Ghost Guide plant comparison.')
    },
    {
      icon: Cpu,
      title: 'Edge AI Diagnostic Engine',
      desc: 'Lightweight computer vision model detects foliar diseases like Early Blight, Late Blight, and Rice Blast in milliseconds.'
    },
    {
      icon: Compass,
      title: t('machineryTwins', '3D Equipment Digital Twins'),
      desc: 'Rotatable, inspectable 3D models of tractors, sprayers, drones, and pivot rigs with interactive safety hotspots.'
    },
    {
      icon: GraduationCap,
      title: t('virtualFarm', 'Interactive Virtual Farm VR'),
      desc: 'Immersive 3D field simulation with interactive exploration zones, step-by-step training, and verified quizzes.'
    },
    {
      icon: Activity,
      title: 'Predictive Outbreak Radar',
      desc: '7-day disease risk forecasting based on real-time microclimate, humidity, and crop developmental stage.'
    },
    {
      icon: Users,
      title: 'Community Field Network',
      desc: 'Crowdsourced farmer photo observations with agronomist-verified answers and localized disease alerts.'
    }
  ];

  const steps = [
    {
      num: '01',
      title: t('step1Title', 'Capture or Scan'),
      desc: t('step1Desc', 'Point your phone camera at an affected plant leaf or select a field area.')
    },
    {
      num: '02',
      title: t('step2Title', 'Instant Neural Analysis'),
      desc: t('step2Desc', 'Our AI model identifies the crop, classifies foliar pathogens, and gauges severity.')
    },
    {
      num: '03',
      title: t('step3Title', 'Holographic AR Guidance'),
      desc: t('step3Desc', 'Follow interactive 5-step agronomic pruning, mulching, and biosecurity protocols.')
    },
    {
      num: '04',
      title: t('step4Title', '3D Virtual Training & Mastery'),
      desc: t('step4Desc', 'Level up farm skills with interactive 3D machinery checklists, quizzes, and badges.')
    }
  ];

  return (
    <div className="min-h-screen bg-[#061208] text-gray-100 flex flex-col">
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-12 pt-6 pb-16 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-agri-accent/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Entry Page Prominent Language Selector Bar */}
        <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 glass-panel p-3 border-agri-accent/30 bg-gradient-to-r from-agri-darkest via-[#0a2310] to-agri-darkest">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-agri-accent animate-pulse" />
            <span className="text-xs font-mono font-bold text-agri-accent">
              {t('chooseLanguage', 'Select Language / భాష / भाषा')}:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                  language === l.code
                    ? 'bg-agri-accent text-agri-darkest shadow-glow-accent scale-105'
                    : 'bg-black/50 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.nativeName}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-agri-card border border-agri-accent/30 px-3.5 py-1.5 rounded-full text-xs font-mono text-agri-accent shadow-glow-accent">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              <span>{t('landingHeroBadge', 'NEXT-GEN AI & AR SMART AGRICULTURE')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              {t('landingHeroTitle1', 'See. Understand.')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-accent via-emerald-300 to-lime-400">
                {t('landingHeroTitle2', 'Grow Smarter.')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t('landingHeroDesc', 'AI-powered AR field diagnostics, holographic 3D equipment inspection, and immersive virtual farm training for the next generation of agriculture.')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={handleLaunchAR}
                className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-6 py-3.5 rounded-2xl flex items-center gap-2.5 shadow-glow-accent transform hover:scale-105 active:scale-95 transition-all text-sm"
              >
                <Camera className="w-4 h-4" />
                <span>{t('launchAR', 'Launch AR Field Assistant')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setRoute('virtual-farm')}
                className="bg-agri-card hover:bg-agri-cardLight text-white font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2.5 border border-white/15 hover:border-agri-accent transition-all text-sm"
              >
                <Compass className="w-4 h-4 text-agri-accent" />
                <span>{t('exploreVRBtn', 'Explore Virtual Farm VR')}</span>
              </button>

              <button
                onClick={startJudgeDemo}
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg text-xs"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>{t('judgeDemoBtn', 'Judge 10-Step Demo')}</span>
              </button>
            </div>

            {/* Micro Badge Checklist */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-agri-accent" /> WebAR Camera</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-agri-accent" /> 3D Digital Twin</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-agri-accent" /> Offline First</span>
            </div>
          </div>

          {/* Right Hero 3D Digital Twin Scene */}
          <div className="lg:col-span-6 w-full">
            <Hero3DScene />
          </div>

        </div>

        {/* Animated Statistics Bar */}
        <div className="max-w-7xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((st, i) => (
            <div key={i} className="glass-panel p-5 text-center border-agri-accent/20">
              <div className="text-3xl sm:text-4xl font-extrabold text-agri-accent font-mono">{st.value}</div>
              <div className="text-sm font-bold text-white mt-1">{st.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{st.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 bg-gradient-to-b from-transparent via-agri-dark/30 to-transparent">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-agri-accent uppercase tracking-widest">WHY KISANSETU</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Bridging the Agricultural Skill & Diagnostic Gap</h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Traditional field training requires expensive machinery and physical agronomist visits. KisanSetu democratizes precision agronomy via browser-based AR and 3D digital twins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Problem Card */}
            <div className="glass-panel p-8 border-red-500/20 bg-red-950/15">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold mb-4">
                ⚠️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The Field Challenge</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Late Disease Diagnosis:</strong> Foliar blights spread silently, destroying up to 40% of crop yield before identification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Machinery Accidents:</strong> Lack of accessible pre-operation training causes thousands of tractor & PTO entanglement injuries.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Hardware Barrier:</strong> Proprietary agronomy tools cost thousands of dollars and mandate constant cloud connectivity.</span>
                </li>
              </ul>
            </div>

            {/* Solution Card */}
            <div className="glass-panel p-8 border-agri-accent/30 bg-emerald-950/20">
              <div className="w-12 h-12 rounded-2xl bg-agri-accent/20 text-agri-accent flex items-center justify-center font-bold mb-4">
                🌿
              </div>
              <h3 className="text-xl font-bold text-white mb-3">The KisanSetu Solution</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-agri-accent flex-shrink-0 mt-0.5" />
                  <span><strong>Real WebAR Camera AI:</strong> Instant leaf scanning with visual holographic bounding boxes and risk ratings on any smartphone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-agri-accent flex-shrink-0 mt-0.5" />
                  <span><strong>Interactive 3D Digital Twins:</strong> Risk-free machinery training with clickable checkpoints (Engine, Brake, PTO, ROPS).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-agri-accent flex-shrink-0 mt-0.5" />
                  <span><strong>Offline-First Architecture:</strong> Complete diagnostic capability, crop library, and 3D modules work with zero internet.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* How It Works 4-Step */}
      <section className="px-4 sm:px-6 lg:px-12 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-agri-accent uppercase tracking-widest">{t('howItWorks', 'How KisanSetu Works')}</span>
            <h2 className="text-3xl font-extrabold text-white">{t('howItWorks', 'How KisanSetu Operates')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => (
              <div key={i} className="glass-panel p-6 relative border-agri-accent/20 group hover:border-agri-accent transition-all">
                <div className="text-3xl font-black text-agri-accent/30 font-mono group-hover:text-agri-accent transition-colors">
                  {st.num}
                </div>
                <h4 className="text-base font-bold text-white mt-2 mb-1.5">{st.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6 Core Feature Grid */}
      <section className="px-4 sm:px-6 lg:px-12 py-16 bg-gradient-to-b from-transparent via-agri-dark/40 to-transparent">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-agri-accent uppercase tracking-widest">{t('featuresTitle', 'PLATFORM CAPABILITIES')}</span>
            <h2 className="text-3xl font-extrabold text-white">{t('featuresSubtitle', 'Comprehensive Agricultural Suite')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="glass-panel p-6 border-white/10 hover:border-agri-accent transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-agri-dark flex items-center justify-center text-agri-accent border border-agri-accent/30 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Final Section */}
      <section className="px-4 sm:px-6 lg:px-12 py-20">
        <div className="max-w-4xl mx-auto glass-panel p-8 sm:p-12 text-center border-agri-accent/40 relative overflow-hidden bg-gradient-to-br from-agri-dark via-[#0a2310] to-agri-darkest shadow-2xl">
          <div className="space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              {t('readyToTransform', 'Ready to Experience KisanSetu?')}
            </h2>
            <p className="text-sm text-gray-300">
              {t('joinThousands', 'Launch the interactive AR camera assistant or enter the 3D Virtual Farm training hub directly in your browser.')}
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setRoute('dashboard')}
                className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-glow-accent transition-all"
              >
                {t('dashboard', 'Go to Dashboard')}
              </button>
              <button
                onClick={startJudgeDemo}
                className="bg-black/60 hover:bg-black/80 text-amber-300 border border-amber-400/50 font-mono font-bold px-6 py-3.5 rounded-2xl text-sm transition-all"
              >
                ⭐ {t('judgeDemoBtn', 'Launch Judge Demo Mode')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-4 py-8 border-t border-white/10 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-agri-accent" />
            <span className="font-bold text-gray-300">KisanSetu AR Intelligence Platform</span>
          </div>
          <div>Built for AR/VR Smart Agriculture Training & Field Assistance</div>
          <div>v2.4 Production Prototype</div>
        </div>
      </footer>

    </div>
  );
}
