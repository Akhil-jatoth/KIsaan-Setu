import React from 'react';
import { 
  GraduationCap, 
  Clock, 
  Award, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Compass
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { TrainingModule } from '../types';

export function TrainingHubPage() {
  const { trainingModules, setActiveTrainingId, setRoute, progress } = useAppStore();

  const handleLaunch = (modId: string) => {
    setActiveTrainingId(modId);
    setRoute('training-experience');
  };

  const getModuleProgress = (id: string) => {
    return progress?.moduleProgress?.[id] || { completed: false, score: 0, completedSteps: 0, timeSpent: '00:00' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#0a2612] to-agri-darkest">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-agri-accent" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Virtual Agriculture Training Hub
            </h1>
          </div>
          <p className="text-xs text-gray-300 font-mono mt-1">
            Interactive 3D simulations, real-time safety validation, and agronomist-certified quizzes
          </p>
        </div>

        <button
          onClick={() => setRoute('virtual-farm')}
          className="bg-agri-card hover:bg-agri-cardLight text-white border border-white/15 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
        >
          <Compass className="w-4 h-4 text-agri-accent" />
          <span>Enter 3D Virtual Farm VR</span>
        </button>
      </div>

      {/* Training Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingModules.map(mod => {
          const modProg = getModuleProgress(mod.id);
          const percent = modProg.completed ? 100 : Math.round((modProg.completedSteps / mod.steps.length) * 100);

          return (
            <div
              key={mod.id}
              className="glass-panel p-5 border-agri-accent/20 flex flex-col justify-between glass-card-hover group"
            >
              <div className="space-y-3">
                
                {/* Difficulty & Duration Badges */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className={`px-2.5 py-0.5 rounded-full border font-bold ${
                    mod.difficulty === 'Beginner'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : mod.difficulty === 'Intermediate'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}>
                    {mod.difficulty}
                  </span>

                  <span className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    {mod.duration}
                  </span>
                </div>

                {/* Title & Category */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-agri-accent transition-colors">
                    {mod.title}
                  </h3>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{mod.category}</div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed line-clamp-2">
                  {mod.description}
                </p>

                {/* Badge reward preview */}
                <div className="flex items-center gap-2 bg-black/40 p-2 rounded-xl border border-white/5 text-xs font-mono text-amber-300">
                  <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="truncate">Unlock: {mod.badge}</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-agri-accent font-bold">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-agri-accent transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <div className="pt-4 mt-2 border-t border-white/10">
                <button
                  onClick={() => handleLaunch(mod.id)}
                  className="w-full bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-glow-accent transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{modProg.completed ? 'Replay Training' : percent > 0 ? 'Continue Training' : 'Start Module'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
