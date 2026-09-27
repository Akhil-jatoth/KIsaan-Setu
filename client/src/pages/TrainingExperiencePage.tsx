import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  HelpCircle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../store/appStore';
import { Tractor3DViewer } from '../components/3d/Tractor3DViewer';
import { Plant3DViewer } from '../components/3d/Plant3DViewer';
import { apiService } from '../services/apiService';

export function TrainingExperiencePage() {
  const { activeTraining, setRoute, addToast, judgeDemoStep, nextJudgeDemoStep } = useAppStore();

  const module = activeTraining || {
    id: "module-tractor-safety",
    title: "Tractor Safety Inspection & Pre-Op Check",
    category: "Equipment Operation",
    difficulty: "Beginner",
    duration: "5 min",
    badge: "Master Inspector",
    description: "Master the mandatory 5-point daily pre-operation checklist on the AgriPro X-900 tractor before turning the ignition key.",
    learningObjectives: [
      "Identify the 4 key safety zones on a utility tractor",
      "Inspect engine oil and cooling system for field readiness",
      "Verify brake interlock lock-pin for road transport",
      "Demonstrate zero-contact safety protocol around PTO shafts"
    ],
    interactive3DType: "tractor" as const,
    steps: [
      {
        stepNumber: 1,
        title: "Locate & Inspect Engine Bay",
        targetComponentId: "engine",
        instruction: "Click or tap on the FRONT ENGINE BAY of the 3D tractor to inspect oil level, air filter, and coolant reservoir.",
        feedbackSuccess: "Engine Bay verified! Dipstick level is full and radiator screen is clean of chaff.",
        feedbackError: "That is not the engine bay. Look near the front hood of the tractor.",
        hint: "The engine is located under the front hood of the tractor."
      },
      {
        stepNumber: 2,
        title: "Inspect Dual Brake Interlock",
        targetComponentId: "brake",
        instruction: "Click or tap on the BRAKE SYSTEM pedals on the right side of the operator station.",
        feedbackSuccess: "Brakes verified! The interlock latch is securely locked for transport stability.",
        feedbackError: "Not the brake pedals. Look near the side foot controls of the operator cab.",
        hint: "Check near the lower right side beneath the operator seat."
      },
      {
        stepNumber: 3,
        title: "Verify PTO Shaft & Safety Guard",
        targetComponentId: "pto",
        instruction: "Click or tap on the REAR PTO (Power Take-Off) shaft and verify the 360° shield.",
        feedbackSuccess: "PTO Safety Shield confirmed! Master shield is in place with zero rotation play.",
        feedbackError: "Not the PTO. The PTO shaft is located at the very rear between the 3-point hitch arms.",
        hint: "Navigate to the back of the tractor to inspect the power take-off shaft."
      },
      {
        stepNumber: 4,
        title: "Verify ROPS Cab & Operator Seat",
        targetComponentId: "cab",
        instruction: "Click or tap on the ROPS CABIN to inspect the seatbelt and emergency beacon lights.",
        feedbackSuccess: "Operator Cabin verified! Seatbelt retractor and emergency beacons are functional.",
        feedbackError: "Look at the main operator cabin in the upper center.",
        hint: "Tap on the enclosed operator cockpit on top."
      },
      {
        stepNumber: 5,
        title: "Complete Pre-Operation Safety Checklist",
        targetComponentId: "engine",
        instruction: "Tap the ENGINE one last time to confirm ignition clear zone protocol.",
        feedbackSuccess: "All 5 safety inspection zones cleared! Tractor is approved for field deployment.",
        feedbackError: "Confirm the ignition master switch at the front.",
        hint: "Click the engine unit to finalize the checklist."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Why MUST the brake pedal interlock latch be connected when driving a tractor on public roads?",
        options: [
          "To save fuel and reduce engine RPM",
          "To ensure both wheels brake evenly and prevent rollover from sudden swerves",
          "To allow tighter turning circles around sharp corners",
          "To disengage the rear PTO automatically"
        ],
        correctIndex: 1,
        explanation: "If individual brake pedals are pressed at high road speeds without being locked together, one wheel will lock up, causing the tractor to violently spin and roll over."
      },
      {
        id: "q2",
        question: "What is the primary danger associated with an exposed rotating PTO shaft?",
        options: [
          "Electrical shock from the alternator",
          "Rapid entanglement of loose clothing leading to severe or fatal injury",
          "Overheating of hydraulic fluid",
          "Damage to tire tread"
        ],
        correctIndex: 1,
        explanation: "A PTO shaft rotating at 540 RPM completes 9 revolutions per second. It can entangle clothing faster than human reaction time."
      },
      {
        id: "q3",
        question: "When should the operator fasten their seatbelt on a tractor?",
        options: [
          "Only when driving above 30 km/h",
          "Never, so they can jump off in an emergency",
          "Whenever the ROPS (Roll-Over Protective Structure) is in the locked upright position",
          "Only when operating with a heavy rear plow"
        ],
        correctIndex: 2,
        explanation: "ROPS and seatbelts work together as a survival capsule. The seatbelt holds the operator within the protected zone during an overturn."
      },
      {
        id: "q4",
        question: "How often should you inspect the tractor engine oil and cooling screens during heavy harvest season?",
        options: [
          "Daily before starting the engine",
          "Once a month",
          "Only when the engine warning light stays on",
          "Once every 500 hours"
        ],
        correctIndex: 0,
        explanation: "Daily pre-op checks catch chaff buildup and oil leaks early, preventing catastrophic engine fires and mechanical seizures."
      }
    ]
  };

  // Phase: '3d-steps' | 'quiz' | 'result'
  const [phase, setPhase] = useState<'3d-steps' | 'quiz' | 'result'>('3d-steps');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);
  
  // Quiz states
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isOptionSubmitted, setIsOptionSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState('00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const sec = Math.floor((Date.now() - startTime) / 1000);
      const m = Math.floor(sec / 60).toString().padStart(2, '0');
      const s = (sec % 60).toString().padStart(2, '0');
      setElapsedTime(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const currentStep = module.steps[currentStepIndex] || module.steps[0];
  const currentQuiz = module.quiz[quizQuestionIndex] || module.quiz[0];

  // 3D Hotspot click handler
  const handleComponentClick = (clickedId: string) => {
    if (phase !== '3d-steps') return;

    if (clickedId === currentStep.targetComponentId) {
      setFeedback({
        isSuccess: true,
        text: currentStep.feedbackSuccess
      });
      addToast({
        type: 'success',
        title: `Checkpoint ${currentStep.stepNumber} Verified!`,
        message: currentStep.feedbackSuccess
      });

      setTimeout(() => {
        if (currentStepIndex < module.steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
          setFeedback(null);
        } else {
          // Finish 3D steps -> Transition to Quiz
          setPhase('quiz');
          setFeedback(null);
          addToast({
            type: 'info',
            title: '3D Checklist Completed!',
            message: 'Starting agricultural mastery quiz.'
          });
        }
      }, 1200);
    } else {
      setFeedback({
        isSuccess: false,
        text: `${currentStep.feedbackError} (Hint: ${currentStep.hint})`
      });
      addToast({
        type: 'warning',
        title: 'Incorrect Hotspot',
        message: currentStep.hint
      });
    }
  };

  // Quiz Option Click
  const handleOptionSelect = (idx: number) => {
    if (isOptionSubmitted) return;
    setSelectedOption(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setIsOptionSubmitted(true);
    const isCorrect = selectedOption === currentQuiz.correctIndex;
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizQuestionIndex < module.quiz.length - 1) {
      setQuizQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsOptionSubmitted(false);
    } else {
      // Complete module
      const finalScore = Math.round(((correctAnswersCount + (selectedOption === currentQuiz.correctIndex ? 1 : 0)) / module.quiz.length) * 100);
      apiService.recordTrainingComplete(module.id, finalScore, module.steps.length, elapsedTime);
      setPhase('result');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
      if (judgeDemoStep === 8 || judgeDemoStep === 9) {
        nextJudgeDemoStep();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Back Button & Top Status */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setRoute('training')}
          className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Training Hub</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-gray-400">
            <Clock className="w-3.5 h-3.5 text-agri-accent" />
            <span>Time: {elapsedTime}</span>
          </span>
          <span className="bg-agri-card px-2.5 py-1 rounded-full border border-agri-accent/30 text-agri-accent font-bold">
            {phase === '3d-steps' ? `Step ${currentStep.stepNumber}/${module.steps.length}` : phase === 'quiz' ? `Quiz ${quizQuestionIndex + 1}/${module.quiz.length}` : 'Completed'}
          </span>
        </div>
      </div>

      {/* Main Training Container */}
      {phase === '3d-steps' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Interactive 3D Model with Hotspot Trigger (7-Cols) */}
          <div className="lg:col-span-7 space-y-3">
            {module.interactive3DType === 'plant' ? (
              <Plant3DViewer
                targetNodeId={currentStep.targetComponentId}
                onSelectNode={handleComponentClick}
                isTrainingMode={true}
              />
            ) : (
              <Tractor3DViewer
                targetComponentId={currentStep.targetComponentId}
                onSelectHotspot={handleComponentClick}
                isTrainingMode={true}
              />
            )}

            {/* Step Progress Bar */}
            <div className="p-3 glass-panel border-white/10 flex items-center justify-between gap-3 text-xs font-mono">
              <span className="text-gray-300 font-bold">Inspection Progress:</span>
              <div className="flex-1 h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-agri-accent transition-all duration-300"
                  style={{ width: `${(currentStep.stepNumber / module.steps.length) * 100}%` }}
                />
              </div>
              <span className="text-agri-accent font-bold">{currentStep.stepNumber} / {module.steps.length}</span>
            </div>
          </div>

          {/* Right: Step Instruction & Validation Panel (5-Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="glass-panel p-6 border-agri-accent/40 bg-gradient-to-br from-agri-dark via-[#0a2612] to-agri-darkest space-y-4 shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[11px] font-mono text-agri-accent font-bold uppercase">
                  Step {currentStep.stepNumber}: Active Objective
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  Target: {currentStep.targetComponentId.toUpperCase()}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white">
                {currentStep.title}
              </h3>

              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-gray-200 leading-relaxed">
                👉 {currentStep.instruction}
              </div>

              {/* Dynamic Feedback Banner */}
              {feedback && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 animate-fade-in ${
                  feedback.isSuccess 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                }`}>
                  {feedback.isSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block mb-0.5">
                      {feedback.isSuccess ? '✓ Correct Checkpoint' : '✕ Try Again'}
                    </span>
                    {feedback.text}
                  </div>
                </div>
              )}

              {/* Fast Skip / Advance (For Quick Judge Testing) */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <span className="text-[10px] text-gray-400 font-mono">Tap the 3D model hotspot directly</span>
                <button
                  onClick={() => handleComponentClick(currentStep.targetComponentId)}
                  className="bg-black/60 hover:bg-black/90 text-agri-accent border border-agri-accent/30 text-[11px] font-mono px-3 py-1.5 rounded-xl transition-all"
                >
                  Auto-Verify Step
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* Phase 2: Interactive Quiz System */}
      {phase === 'quiz' && (
        <div className="max-w-3xl mx-auto glass-panel p-6 sm:p-8 border-agri-accent/40 bg-[#081e0e] shadow-2xl space-y-6 animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-agri-accent" />
              <h3 className="text-base font-extrabold text-white">
                Knowledge Verification Quiz
              </h3>
            </div>
            <span className="text-xs font-mono text-gray-400">
              Question {quizQuestionIndex + 1} of {module.quiz.length}
            </span>
          </div>

          <h4 className="text-lg font-bold text-white leading-snug">
            {currentQuiz.question}
          </h4>

          {/* 4 Options Grid */}
          <div className="space-y-2.5">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuiz.correctIndex;

              let optionStyle = 'bg-black/50 text-gray-200 border-white/10 hover:border-agri-accent/40';

              if (isOptionSubmitted) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-500/20 text-rose-300 border-rose-500/50';
                }
              } else if (isSelected) {
                optionStyle = 'bg-agri-accent/20 text-agri-accent border-agri-accent font-bold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isOptionSubmitted}
                  className={`w-full p-4 rounded-2xl border text-left text-xs leading-relaxed flex items-start gap-3 transition-all ${optionStyle}`}
                >
                  <span className="w-6 h-6 rounded-full bg-black/60 border border-white/10 flex items-center justify-center font-mono font-bold flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Banner when submitted */}
          {isOptionSubmitted && (
            <div className="p-4 rounded-2xl bg-black/60 border border-agri-accent/30 text-xs text-gray-200 leading-relaxed space-y-1 animate-fade-in">
              <span className="text-agri-accent font-mono font-bold uppercase block">
                Agronomic Explanation:
              </span>
              <p>{currentQuiz.explanation}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            {!isOptionSubmitted ? (
              <button
                onClick={handleQuizSubmit}
                disabled={selectedOption === null}
                className="bg-agri-accent hover:bg-lime-400 disabled:opacity-40 text-agri-darkest font-extrabold px-6 py-2.5 rounded-xl text-xs shadow-glow-accent transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuiz}
                className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-glow-accent transition-all"
              >
                <span>{quizQuestionIndex < module.quiz.length - 1 ? 'Next Question' : 'View Final Score'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      )}

      {/* Phase 3: Final Completion & Score Screen */}
      {phase === 'result' && (
        <div className="max-w-2xl mx-auto glass-panel p-8 text-center border-agri-accent/40 bg-gradient-to-b from-agri-dark via-[#09220e] to-agri-darkest space-y-6 shadow-2xl animate-fade-in">
          
          <div className="w-20 h-20 rounded-full bg-agri-accent text-agri-darkest mx-auto flex items-center justify-center shadow-glow-accent">
            <Award className="w-10 h-10 stroke-[2.2]" />
          </div>

          <div>
            <span className="text-xs font-mono text-agri-accent uppercase font-bold tracking-wider">
              TRAINING MODULE COMPLETE
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-1">
              {module.title}
            </h2>
          </div>

          {/* Score Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
              <div className="text-2xl font-extrabold text-agri-accent font-mono">
                {Math.round((correctAnswersCount / module.quiz.length) * 100)}%
              </div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">FINAL SCORE</div>
            </div>

            <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
              <div className="text-2xl font-extrabold text-white font-mono">
                {module.steps.length}/{module.steps.length}
              </div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">3D STEPS</div>
            </div>

            <div className="bg-black/50 p-4 rounded-2xl border border-white/10">
              <div className="text-2xl font-extrabold text-white font-mono">
                {elapsedTime}
              </div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">TIME TAKEN</div>
            </div>
          </div>

          {/* Unlocked Badge */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-3 text-xs font-mono text-amber-300">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin-slow" />
            <span className="font-bold">Badge Unlocked: "{module.badge}"</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/10">
            <button
              onClick={() => {
                setPhase('3d-steps');
                setCurrentStepIndex(0);
                setQuizQuestionIndex(0);
                setSelectedOption(null);
                setIsOptionSubmitted(false);
                setCorrectAnswersCount(0);
              }}
              className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Module</span>
            </button>

            <button
              onClick={() => setRoute('progress')}
              className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-glow-accent"
            >
              <span>View Progress Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
