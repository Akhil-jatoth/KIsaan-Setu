import React from 'react';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  Camera, 
  GraduationCap, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar, Legend } from 'recharts';
import { useAppStore } from '../store/appStore';

export function ProgressPage() {
  const { progress, setRoute, user } = useAppStore();

  const prog = progress || {
    userId: "usr-demo",
    totalScans: 8,
    completedTrainings: 3,
    averageScore: 92,
    learningStreakDays: 5,
    cropsIdentifiedCount: 4,
    diseasesDiagnosedCount: 6,
    badges: [
      { id: "b1", title: "AR Pioneer", icon: "Camera", unlockedAt: "2026-09-20" },
      { id: "b2", title: "Master Inspector", icon: "Wrench", unlockedAt: "2026-09-22" },
      { id: "b3", title: "Pathology Scout", icon: "ShieldAlert", unlockedAt: "2026-09-24" }
    ],
    moduleProgress: {}
  };

  const scoreData = [
    { module: 'Tractor Safety', score: 95, fill: '#7ED957' },
    { module: 'Crop Planting', score: 90, fill: '#38bdf8' },
    { module: 'Disease Scout', score: 92, fill: '#f59e0b' },
    { module: 'Irrigation', score: 85, fill: '#06b6d4' },
    { module: 'Harvesting', score: 88, fill: '#a855f7' }
  ];

  const leaderboard = [
    { rank: 1, name: 'Dr. Arjun Patel', role: 'Lead Agronomist', score: 4850, streak: '14 Days', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80' },
    { rank: 2, name: 'Ramesh Patel', role: 'Progressive Farmer', score: 4620, streak: '9 Days', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { rank: 3, name: 'Priya Sundaram', role: 'Student Researcher', score: 4310, streak: '5 Days', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
    { rank: 4, name: 'Harpreet Singh', role: 'Agronomist', score: 3980, streak: '7 Days', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#0a2612] to-agri-darkest">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white">
              Training Progress & Gamification
            </h1>
          </div>
          <p className="text-xs text-gray-300 font-mono mt-1">
            Skill metrics, accuracy scores, learning streaks, and agronomy badges
          </p>
        </div>

        {/* Learning Streak Pill */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 rounded-2xl border border-amber-500/40 text-amber-300 font-mono">
          <Flame className="w-5 h-5 text-orange-400 animate-bounce" />
          <div>
            <div className="text-sm font-extrabold">{prog.learningStreakDays} Days</div>
            <div className="text-[10px] text-gray-400">ACTIVE STREAK</div>
          </div>
        </div>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 border-agri-accent/20">
          <div className="text-gray-400 text-xs font-mono mb-1">Average Training Score</div>
          <div className="text-3xl font-extrabold text-agri-accent font-mono">{prog.averageScore}%</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Top 5% Performance</span>
          </div>
        </div>

        <div className="glass-panel p-4 border-agri-accent/20">
          <div className="text-gray-400 text-xs font-mono mb-1">Modules Mastered</div>
          <div className="text-3xl font-extrabold text-sky-400 font-mono">{prog.completedTrainings} / 5</div>
          <div className="text-[11px] text-gray-400 mt-1">
            <span>60% Total Curriculum</span>
          </div>
        </div>

        <div className="glass-panel p-4 border-agri-accent/20">
          <div className="text-gray-400 text-xs font-mono mb-1">Total AR Scans</div>
          <div className="text-3xl font-extrabold text-amber-400 font-mono">{prog.totalScans}</div>
          <div className="text-[11px] text-amber-400 mt-1">
            <span>{prog.diseasesDiagnosedCount} Pathogens Identified</span>
          </div>
        </div>

        <div className="glass-panel p-4 border-agri-accent/20">
          <div className="text-gray-400 text-xs font-mono mb-1">Badges Earned</div>
          <div className="text-3xl font-extrabold text-purple-400 font-mono">{prog.badges.length}</div>
          <div className="text-[11px] text-purple-300 mt-1">
            <span>Master Inspector</span>
          </div>
        </div>

      </div>

      {/* Charts & Badges Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recharts Training Score Breakdown (7-Cols) */}
        <div className="lg:col-span-7 glass-panel p-5 border-agri-accent/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Module Score Performance</h3>
            <span className="text-xs font-mono text-gray-400">Score per Scenario</span>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="module" stroke="#9ca3af" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#07190b', borderColor: '#7ED957', fontSize: '11px' }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Unlocked Badges Showcase (5-Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 border-agri-accent/20 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Earned Mastery Badges</span>
          </h3>

          <div className="space-y-3">
            {[
              { title: "AR Pioneer", desc: "First 5 real-time camera plant scans", icon: "📸", unlocked: true },
              { title: "Master Inspector", desc: "100% on 3D Tractor Safety Inspection", icon: "🚜", unlocked: true },
              { title: "Pathology Scout", desc: "Correctly classified 4 foliar diseases", icon: "🔬", unlocked: true },
              { title: "Hydro Specialist", desc: "Calibrated Center Pivot VRI telemetry", icon: "💧", unlocked: false },
            ].map((b, i) => (
              <div 
                key={i} 
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  b.unlocked 
                    ? 'bg-black/50 border-amber-500/30' 
                    : 'bg-black/20 border-white/5 opacity-50'
                }`}
              >
                <div className="text-2xl">{b.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-xs text-white">{b.title}</h5>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                      b.unlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {b.unlocked ? 'UNLOCKED' : 'LOCKED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Regional Leaderboard Table */}
      <div className="glass-panel p-6 border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white">Agronomy Training Leaderboard</h3>
            <p className="text-xs text-gray-400 font-mono">Regional peer ranking based on module score & field scouting</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {leaderboard.map(lb => (
            <div 
              key={lb.rank}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                lb.rank === 1 
                  ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/30' 
                  : 'bg-black/40 border-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <span className={`w-7 h-7 rounded-xl font-bold font-mono text-xs flex items-center justify-center ${
                  lb.rank === 1 ? 'bg-amber-400 text-black' : 'bg-black/60 text-gray-400'
                }`}>
                  #{lb.rank}
                </span>
                <img src={lb.avatar} alt={lb.name} className="w-9 h-9 rounded-full object-cover border border-white/20" />
                <div>
                  <div className="font-bold text-xs text-white">{lb.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{lb.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right font-mono text-xs">
                <div className="hidden sm:block text-amber-400">{lb.streak}</div>
                <div className="font-extrabold text-agri-accent">{lb.score} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
