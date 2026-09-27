import React from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Camera, 
  Search, 
  AlertTriangle, 
  Layers, 
  BookOpen, 
  Wrench, 
  GraduationCap, 
  Trophy 
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function JudgeDemoModal() {
  const { 
    isJudgeDemoActive, 
    judgeDemoStep, 
    nextJudgeDemoStep, 
    endJudgeDemo, 
    setRoute,
    setActiveEquipmentId,
    setActiveTrainingId 
  } = useAppStore();

  if (!isJudgeDemoActive) return null;

  const demoSteps = [
    {
      step: 1,
      title: "Step 1: Launch AR Field Assistant",
      desc: "Open camera view with real-time AR HUD overlay and scan brackets.",
      icon: Camera,
      action: () => setRoute('ar-assistant')
    },
    {
      step: 2,
      title: "Step 2: Load Sample Tomato Leaf",
      desc: "Select the demo tomato leaf preset or turn on your live camera.",
      icon: Search,
      action: () => setRoute('ar-assistant')
    },
    {
      step: 3,
      title: "Step 3: Run Neural Computer Vision",
      desc: "AI executes inference pipeline to identify foliar condition.",
      icon: Layers,
      action: () => setRoute('crop-scanner')
    },
    {
      step: 4,
      title: "Step 4: AI Prediction Verification",
      desc: "Detected: Tomato • Early Blight (Alternaria solani) • 91% Confidence • Medium Risk.",
      icon: AlertTriangle,
      action: () => setRoute('disease-analysis')
    },
    {
      step: 5,
      title: "Step 5: AR Information & Ghost Guide",
      desc: "Inspect holographic bounding boxes and ideal plant comparison silhouette.",
      icon: Layers,
      action: () => setRoute('ar-assistant')
    },
    {
      step: 6,
      title: "Step 6: Step-by-Step Field Guidance",
      desc: "Swipe through 5 agronomic isolation, pruning, and mulching steps.",
      icon: BookOpen,
      action: () => setRoute('guidance')
    },
    {
      step: 7,
      title: "Step 7: 3D Equipment Digital Twin",
      desc: "Explore the interactive 3D AgriPro X-900 Smart Tractor with 360° orbit.",
      icon: Wrench,
      action: () => {
        setActiveEquipmentId('tractor-x900');
        setRoute('equipment-detail');
      }
    },
    {
      step: 8,
      title: "Step 8: Interactive Tractor Training",
      desc: "Start the 5-point daily pre-operation safety inspection scenario.",
      icon: GraduationCap,
      action: () => {
        setActiveTrainingId('module-tractor-safety');
        setRoute('training-experience');
      }
    },
    {
      step: 9,
      title: "Step 9: Complete 3D Checkpoints & Quiz",
      desc: "Tap target hotspots (Engine, Brake, PTO, ROPS) and answer safety questions.",
      icon: CheckCircle2,
      action: () => setRoute('training-experience')
    },
    {
      step: 10,
      title: "Step 10: Progress & Judge Overview",
      desc: "Review overall knowledge score, badge unlocks, and system telemetry.",
      icon: Trophy,
      action: () => setRoute('progress')
    }
  ];

  const currentInfo = demoSteps[Math.min(judgeDemoStep - 1, demoSteps.length - 1)] || demoSteps[0];
  const Icon = currentInfo.icon;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl bg-gradient-to-r from-[#0b2e13] via-[#09220e] to-[#0b2e13] p-4 rounded-2xl border-2 border-amber-400 shadow-2xl backdrop-blur-xl animate-fade-in">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-xl bg-amber-400 text-black flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 fill-current" />
          </span>
          <div>
            <h4 className="font-extrabold text-sm text-amber-300 font-mono tracking-wide">
              HACKATHON JUDGE GUIDED TOUR
            </h4>
            <p className="text-[11px] text-gray-300">
              Milestone {judgeDemoStep} of 10
            </p>
          </div>
        </div>

        <button
          onClick={endJudgeDemo}
          className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          title="Exit Judge Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden my-3 border border-white/10">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 to-agri-accent transition-all duration-300"
          style={{ width: `${(judgeDemoStep / 10) * 100}%` }}
        />
      </div>

      {/* Step Info */}
      <div className="flex items-start gap-3 py-1">
        <div className="w-10 h-10 rounded-2xl bg-agri-card border border-agri-accent/30 flex items-center justify-center flex-shrink-0 text-agri-accent">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm text-white">{currentInfo.title}</div>
          <p className="text-xs text-gray-300 mt-0.5">{currentInfo.desc}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3 mt-3 pt-2.5 border-t border-white/10">
        <button
          onClick={endJudgeDemo}
          className="text-xs text-gray-400 hover:text-gray-200 px-3 py-1.5"
        >
          Exit Tour
        </button>

        <div className="flex items-center gap-2">
          {currentInfo.action && (
            <button
              onClick={currentInfo.action}
              className="bg-black/50 hover:bg-black/80 text-agri-accent border border-agri-accent/30 text-xs px-3 py-1.5 rounded-xl font-mono"
            >
              Jump To View
            </button>
          )}

          <button
            onClick={nextJudgeDemoStep}
            className="bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-400/20 transition-all"
          >
            <span>{judgeDemoStep >= 10 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
