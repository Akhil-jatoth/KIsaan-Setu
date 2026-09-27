import React from 'react';
import { ShieldAlert, AlertTriangle, BookOpen, CheckCircle2, ArrowRight, Camera, ChevronLeft } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function DiseaseAnalysisPage() {
  const { activeDisease, setRoute } = useAppStore();

  const d = activeDisease || {
    id: 'tomato-early-blight',
    name: 'Early Blight',
    crop: 'Tomato',
    scientificName: 'Alternaria solani',
    riskLevel: 'Medium',
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    symptoms: [
      'Concentric dark brown rings (target board pattern) on older lower leaves',
      'Yellow chlorotic halo surrounding necrotic spots',
      'Premature leaf drop exposing fruits to sunscald',
      'Dark sunken collar rot lesions on lower stems'
    ],
    causes: [
      'Fungal spores splashing from infected soil during heavy rain or sprinkler irrigation',
      'Prolonged leaf wetness combined with warm temperatures (24-29°C)'
    ],
    prevention: [
      'Apply drip irrigation instead of overhead sprayers',
      'Practice 3-year crop rotation away from solanaceous species',
      'Apply organic straw mulch to block soil spore splash'
    ],
    expertAdvisory: 'Always follow product labels and local agricultural extension guidelines.'
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <button
        onClick={() => setRoute('ar-assistant')}
        className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to AR Assistant</span>
      </button>

      <div className="glass-panel p-6 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#09220e] to-agri-darkest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white">{d.name} Pathology Dossier</h1>
          </div>
          <p className="text-xs text-gray-300 font-mono mt-0.5">
            Pathogen: {d.scientificName} • Host: {d.crop} • Risk: {d.riskLevel}
          </p>
        </div>

        <button
          onClick={() => setRoute('guidance')}
          className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-glow-accent"
        >
          <BookOpen className="w-4 h-4" />
          <span>Launch Step-by-Step Guidance</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Symptoms */}
        <div className="glass-panel p-6 border-white/10 space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Foliar & Stem Symptoms</span>
          </h3>
          <div className="space-y-2 text-xs text-gray-300">
            {d.symptoms.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prevention & Integrated Pest Management */}
        <div className="glass-panel p-6 border-white/10 space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-agri-accent" />
            <span>Preventative Cultural Controls</span>
          </h3>
          <div className="space-y-2 text-xs text-gray-300">
            {d.prevention.map((p, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-agri-accent mt-0.5 flex-shrink-0" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Expert Disclaimer */}
      <div className="glass-panel p-4 border-amber-500/30 text-xs text-amber-200 bg-amber-950/20">
        📢 <strong>Agronomic Extension Advisory:</strong> {d.expertAdvisory}
      </div>

    </div>
  );
}
