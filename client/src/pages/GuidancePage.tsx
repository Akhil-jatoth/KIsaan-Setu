import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  ShieldAlert, 
  Scissors, 
  Droplets, 
  Users, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/appStore';

export function GuidancePage() {
  const { activeDisease, setRoute, speakText, judgeDemoStep, nextJudgeDemoStep, addToast } = useAppStore();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const disease = activeDisease || {
    id: 'tomato-early-blight',
    name: 'Early Blight',
    crop: 'Tomato',
    riskLevel: 'Medium',
    stepByStepGuidance: [
      {
        step: 1,
        title: "Inspect & Isolate Affected Canopy",
        instruction: "Carefully inspect lower tier leaves. Identify target-board brown lesions. Do not work in wet fields to prevent spore transfer on hands/tools.",
        urgency: "Immediate",
        illustrationType: "isolate" as const
      },
      {
        step: 2,
        title: "Sanitize & Prune Diseased Foliage",
        instruction: "Sterilize pruning shears in 70% isopropyl alcohol. Remove infected bottom leaves and drop them directly into a disposal bag.",
        urgency: "High Priority",
        illustrationType: "prune" as const
      },
      {
        step: 3,
        title: "Improve Field Hygiene & Mulching",
        instruction: "Layer clean straw or biodegradable mulch 5cm thick over bare soil beneath the canopy to seal splashing fungal pathogens.",
        urgency: "Medium Priority",
        illustrationType: "hygiene" as const
      },
      {
        step: 4,
        title: "Monitor Surrounding Rows & Adjust Irrigation",
        instruction: "Switch irrigation timers to early morning drip cycles so any accidental leaf splash evaporates rapidly under sunlight.",
        urgency: "Ongoing",
        illustrationType: "monitor" as const
      },
      {
        step: 5,
        title: "Consult Certified Agronomist for Control",
        instruction: "Follow certified organic copper or bio-fungicide label guidelines if severity exceeds 15% threshold. Follow product label and local agricultural expert guidance.",
        urgency: "Expert Advisory",
        illustrationType: "expert" as const
      }
    ],
    expertAdvisory: "Always follow product labels and local agricultural extension guidelines."
  };

  const steps = disease.stepByStepGuidance;
  const currentStep = steps[currentStepIndex] || steps[0];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      addToast({
        type: 'success',
        title: 'Guidance Complete',
        message: 'You have reviewed all 5 agronomic containment steps.'
      });
      if (judgeDemoStep === 6) {
        nextJudgeDemoStep();
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'isolate': return <ShieldAlert className="w-8 h-8 text-amber-400" />;
      case 'prune': return <Scissors className="w-8 h-8 text-rose-400" />;
      case 'hygiene': return <Droplets className="w-8 h-8 text-emerald-400" />;
      case 'expert': return <Users className="w-8 h-8 text-sky-400" />;
      default: return <BookOpen className="w-8 h-8 text-agri-accent" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#09220e] to-agri-darkest">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-agri-accent uppercase">
              {disease.crop} GUIDANCE
            </span>
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-mono">
              {disease.riskLevel} Risk
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            {disease.name} Field Treatment Protocol
          </h1>
        </div>

        <button
          onClick={() => speakText(`Step ${currentStep.step}: ${currentStep.title}. ${currentStep.instruction}`)}
          className="bg-black/50 hover:bg-black/80 text-agri-accent border border-agri-accent/30 px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all"
        >
          <Volume2 className="w-4 h-4" />
          <span>Read Aloud</span>
        </button>
      </div>

      {/* Progress Dots / Stepper Header */}
      <div className="flex items-center justify-between gap-2 px-2">
        {steps.map((st, idx) => (
          <button
            key={idx}
            onClick={() => { setCurrentStepIndex(idx); setIsCompleted(false); }}
            className={`flex-1 py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
              currentStepIndex === idx
                ? 'bg-agri-accent text-agri-darkest border-agri-accent shadow-glow-accent'
                : idx < currentStepIndex
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                : 'bg-black/40 text-gray-400 border-white/10'
            }`}
          >
            Step {st.step}
          </button>
        ))}
      </div>

      {/* Step Card View */}
      {!isCompleted ? (
        <div className="glass-panel p-6 sm:p-8 border-agri-accent/40 bg-[#081e0e] shadow-2xl space-y-6">
          
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/15 flex items-center justify-center">
                {getStepIcon(currentStep.illustrationType)}
              </div>
              <div>
                <span className="text-[11px] font-mono text-agri-accent font-bold uppercase">
                  Step {currentStep.step} of {steps.length} • {currentStep.urgency}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {currentStep.title}
                </h3>
              </div>
            </div>

            <span className="text-xs font-mono text-gray-400">
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
            </span>
          </div>

          {/* Main Instruction Text */}
          <div className="p-5 rounded-2xl bg-black/50 border border-white/10 leading-relaxed text-sm text-gray-200">
            {currentStep.instruction}
          </div>

          {/* Safety Notice Callout */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Agronomic Safety Principle:</span> Do not apply uncertified pesticide dosages. For chemical treatment, always follow the registered product label and local agricultural extension officer guidance.
            </div>
          </div>

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-white/15 text-xs font-bold text-gray-300 disabled:opacity-30 hover:text-white flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-glow-accent transition-all"
            >
              <span>{currentStepIndex === steps.length - 1 ? 'Complete Guidance' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Completion Summary Card */
        <div className="glass-panel p-8 text-center border-agri-accent/40 bg-gradient-to-b from-agri-dark to-agri-darkest space-y-6 shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-agri-accent text-agri-darkest mx-auto flex items-center justify-center shadow-glow-accent">
            <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">Treatment Protocol Completed!</h2>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              You have completed all 5 steps for {disease.name} on {disease.crop}. Logged to your field history.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => { setCurrentStepIndex(0); setIsCompleted(false); }}
              className="px-4 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-gray-300 hover:text-white"
            >
              Review Steps Again
            </button>

            <button
              onClick={() => setRoute('training')}
              className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-glow-accent"
            >
              <span>Take Training Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setRoute('dashboard')}
              className="bg-black/60 hover:bg-black/80 text-white font-bold px-4 py-2.5 rounded-xl text-xs border border-white/10"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
