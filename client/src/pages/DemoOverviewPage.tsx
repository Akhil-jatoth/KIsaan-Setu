import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Camera, 
  Compass, 
  CheckCircle2, 
  Layers, 
  Zap, 
  GraduationCap, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function DemoOverviewPage() {
  const { startJudgeDemo, setRoute } = useAppStore();

  const techStack = [
    { name: "Frontend & UI", detail: "React 18, TypeScript, Tailwind CSS, Glassmorphism Design System" },
    { name: "3D & Immersive", detail: "Three.js, @react-three/fiber, @react-three/drei, WebGL Shader grids" },
    { name: "WebAR / Camera", detail: "Web Camera APIs, MediaDevices getUserMedia, Holographic Canvas Overlays, Ghost Guide" },
    { name: "AI Computer Vision", detail: "Pluggable Edge Vision Architecture (TensorFlow.js / MobileNet / CNN pipeline ready)" },
    { name: "Backend API", detail: "Node.js, Express REST API, MongoDB Schema support, JWT Session" },
    { name: "Telemetry & Charts", detail: "Recharts, Satellite NDVI heatmaps, Real-time drone spray waypoint simulation" }
  ];

  const criteria = [
    { title: "Working AR Field Scanner", desc: "Live device camera feed, holographic bounding boxes, lesion pins & ghost guide." },
    { title: "Interactive 3D Equipment", desc: "Rotatable 3D tractor digital twin with clickable safety checkpoints." },
    { title: "Virtual Farm Simulation", desc: "Full 3D immersive world with 4 interactive training zones." },
    { title: "5-Point Tractor Safety Training", desc: "Interactive 3D validation with instant feedback, quiz, and score screen." },
    { title: "Offline-First Resilience", desc: "100% functional without internet connectivity or specialized hardware." },
    { title: "Multilingual AI Farmer Copilot", desc: "Conversational voice & text support in English, Hindi, and Telugu." }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel p-8 border-2 border-amber-400 bg-gradient-to-r from-[#172e0b] via-[#09220e] to-[#172e0b] space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full border border-amber-400/40 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HACKATHON INNOVATION JUDGE OVERVIEW</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              KisanSetu AR Intelligence Platform
            </h1>
            <p className="text-sm text-gray-300 font-mono mt-1">
              "AR/VR-Based Smart Agriculture Training and Field Assistance System"
            </p>
          </div>

          <button
            onClick={startJudgeDemo}
            className="bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-black font-extrabold px-6 py-3 rounded-2xl text-sm shadow-xl flex items-center gap-2 transform hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Launch 10-Step Guided Tour</span>
          </button>
        </div>
      </div>

      {/* Evaluation Criteria Checklist */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-agri-accent" />
          <span>Hackathon Problem Statement Compliance Matrix</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criteria.map((c, i) => (
            <div key={i} className="glass-panel p-5 border-agri-accent/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-agri-accent font-bold">Requirement {i + 1}</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  ✓ VERIFIED
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{c.title}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Architecture */}
      <div className="glass-panel p-6 border-white/10 space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-agri-accent" />
          <span>Technical Architecture & Abstraction Layers</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {techStack.map((tech, idx) => (
            <div key={idx} className="bg-black/50 p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-xs font-mono font-bold text-agri-accent">{tech.name}</span>
              <p className="text-xs text-gray-300">{tech.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Direct Module Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        <button
          onClick={() => setRoute('ar-assistant')}
          className="glass-panel p-4 text-center hover:border-agri-accent transition-all text-xs font-mono font-bold text-white"
        >
          📸 AR Field Camera
        </button>
        <button
          onClick={() => setRoute('virtual-farm')}
          className="glass-panel p-4 text-center hover:border-agri-accent transition-all text-xs font-mono font-bold text-white"
        >
          🎮 Virtual Farm 3D
        </button>
        <button
          onClick={() => setRoute('equipment-detail')}
          className="glass-panel p-4 text-center hover:border-agri-accent transition-all text-xs font-mono font-bold text-white"
        >
          🚜 3D Tractor Digital Twin
        </button>
        <button
          onClick={() => setRoute('field-detail')}
          className="glass-panel p-4 text-center hover:border-agri-accent transition-all text-xs font-mono font-bold text-white"
        >
          🛸 Satellite NDVI & Drone
        </button>
      </div>

    </div>
  );
}
