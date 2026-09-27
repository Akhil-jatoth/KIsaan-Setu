import React from 'react';
import { 
  ChevronLeft, 
  Droplets, 
  Thermometer, 
  Sprout, 
  Layers, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Camera
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Plant3DViewer } from '../components/3d/Plant3DViewer';

export function CropDetailPage() {
  const { activeCrop, setRoute, setActiveDiseaseId } = useAppStore();

  if (!activeCrop) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-400">Crop not found.</p>
        <button onClick={() => setRoute('crops')} className="mt-4 text-agri-accent underline">
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Back Button */}
      <button
        onClick={() => setRoute('crops')}
        className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Crop Knowledge Library</span>
      </button>

      {/* Main Crop Hero Header */}
      <div className="glass-panel overflow-hidden border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#0a2612] to-agri-darkest">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
          
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-agri-accent/20 text-agri-accent px-2.5 py-0.5 rounded-full border border-agri-accent/30 font-bold">
                {activeCrop.category}
              </span>
              <span className="text-xs text-gray-400 font-mono">ID: {activeCrop.id}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {activeCrop.name}
            </h1>
            <p className="text-sm text-gray-300 italic font-mono">
              Scientific Classification: {activeCrop.scientificName}
            </p>

            <p className="text-sm text-gray-200 leading-relaxed pt-1">
              {activeCrop.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setRoute('ar-assistant')}
                className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-glow-accent transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>Scan {activeCrop.name} in Field</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-4 h-52 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src={activeCrop.image} 
              alt={activeCrop.name} 
              className="w-full h-full object-cover" 
            />
          </div>

        </div>
      </div>

      {/* Environmental & Nutrient Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-panel p-5 border-agri-accent/20 space-y-2">
          <div className="flex items-center gap-2 text-agri-accent font-mono text-xs font-bold uppercase">
            <Layers className="w-4 h-4" />
            <span>Ideal Soil & pH</span>
          </div>
          <p className="text-xs text-gray-200 leading-relaxed">{activeCrop.idealSoil}</p>
        </div>

        <div className="glass-panel p-5 border-agri-accent/20 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
            <Thermometer className="w-4 h-4" />
            <span>Optimal Temperatures</span>
          </div>
          <p className="text-xs text-gray-200 leading-relaxed">{activeCrop.optimalTemp}</p>
        </div>

        <div className="glass-panel p-5 border-agri-accent/20 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase">
            <Droplets className="w-4 h-4" />
            <span>Water Requirements</span>
          </div>
          <p className="text-xs text-gray-200 leading-relaxed">{activeCrop.waterRequirement}</p>
        </div>

      </div>

      {/* Growth Stages Timeline (Phenology) */}
      <div className="glass-panel p-6 border-agri-accent/20 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-agri-accent" />
            <span>Growth Stages & Phenology Timeline</span>
          </h2>
          <span className="text-xs font-mono text-gray-400">4 Major Phases</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeCrop.growthStages.map((st, i) => (
            <div key={i} className="bg-black/50 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-agri-accent">Stage {i + 1}</span>
                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-gray-300">
                  {st.duration}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{st.stage}</h4>
              <p className="text-xs text-gray-300 leading-relaxed">{st.description}</p>
              
              <div className="pt-2 border-t border-white/5 space-y-1">
                {st.keyCareTips.map((tip, idx) => (
                  <div key={idx} className="text-[11px] text-gray-400 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-agri-accent flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutritional Balance & Harvesting Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* N-P-K Nutritional Needs */}
        <div className="glass-panel p-6 border-agri-accent/20 space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase font-mono tracking-wide">
            Nutritional N-P-K Dynamics
          </h3>
          <div className="space-y-2.5 text-xs text-gray-300">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="font-bold text-sky-400 font-mono">Nitrogen (N): </span>
              <span>{activeCrop.nutritionalNeeds.nitrogen}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="font-bold text-amber-400 font-mono">Phosphorus (P): </span>
              <span>{activeCrop.nutritionalNeeds.phosphorus}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
              <span className="font-bold text-emerald-400 font-mono">Potassium (K): </span>
              <span>{activeCrop.nutritionalNeeds.potassium}</span>
            </div>
          </div>
        </div>

        {/* Harvesting Guidelines */}
        <div className="glass-panel p-6 border-agri-accent/20 space-y-3">
          <h3 className="text-sm font-extrabold text-white uppercase font-mono tracking-wide">
            Harvesting & Maturity Indicators
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
            {activeCrop.harvestingGuidelines}
          </p>

          <div className="pt-2">
            <span className="text-xs font-mono text-gray-400 block mb-2">Common Field Pathogens:</span>
            <div className="flex flex-wrap gap-2">
              {activeCrop.commonDiseases.map((d, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveDiseaseId('tomato-early-blight');
                    setRoute('guidance');
                  }}
                  className="bg-red-500/15 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-2.5 py-1 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{d}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
