import React from 'react';
import { Compass, Sparkles, Layers, Info, ShieldCheck, Play } from 'lucide-react';
import { VirtualFarmScene } from '../components/3d/VirtualFarmScene';
import { useAppStore } from '../store/appStore';

export function VirtualFarmPage() {
  const { setRoute, setActiveTrainingId } = useAppStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#09220e] to-agri-darkest">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-agri-accent animate-spin-slow" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Virtual Farm 3D Simulation (VR Environment)
            </h1>
          </div>
          <p className="text-xs text-gray-300 font-mono mt-0.5">
            Explore the digital twin agronomy landscape • Interactive 3D hotspots trigger specialized training modules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-agri-accent/20 text-agri-accent text-xs font-mono px-3 py-1.5 rounded-xl border border-agri-accent/30 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browser VR / 3D Simulation</span>
          </span>
        </div>
      </div>

      {/* 3D Full Farm Viewport */}
      <div className="w-full h-[620px]">
        <VirtualFarmScene />
      </div>

      {/* 4 Interactive Zone Cards Guide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => {
            setActiveTrainingId('module-crop-planting');
            setRoute('training-experience');
          }}
          className="glass-panel p-4 border-agri-accent/30 cursor-pointer glass-card-hover group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🌱</span>
            <span className="text-[10px] font-mono text-agri-accent uppercase font-bold">Zone 1</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-agri-accent transition-colors">
            Crop & Agronomy Zone
          </h4>
          <p className="text-xs text-gray-300 mt-1 leading-snug">
            Soil moisture testing, seedbed compaction, and foliar disease scouting.
          </p>
        </div>

        <div 
          onClick={() => {
            setActiveTrainingId('module-tractor-safety');
            setRoute('training-experience');
          }}
          className="glass-panel p-4 border-sky-500/30 cursor-pointer glass-card-hover group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🚜</span>
            <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">Zone 2</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
            Machinery & Tractor Hub
          </h4>
          <p className="text-xs text-gray-300 mt-1 leading-snug">
            Tractor pre-operation safety checklist, engine oil, brakes, and PTO shaft.
          </p>
        </div>

        <div 
          onClick={() => {
            setActiveTrainingId('module-irrigation-basics');
            setRoute('training-experience');
          }}
          className="glass-panel p-4 border-cyan-500/30 cursor-pointer glass-card-hover group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">💧</span>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Zone 3</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
            Irrigation & Water Station
          </h4>
          <p className="text-xs text-gray-300 mt-1 leading-snug">
            Smart Center Pivot telemetry calibration and Variable Rate Irrigation.
          </p>
        </div>

        <div 
          onClick={() => {
            setActiveTrainingId('module-disease-identification');
            setRoute('training-experience');
          }}
          className="glass-panel p-4 border-amber-500/30 cursor-pointer glass-card-hover group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🛡️</span>
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Zone 4</span>
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
            Biosecurity & Safety Station
          </h4>
          <p className="text-xs text-gray-300 mt-1 leading-snug">
            Field sanitation protocols, chemical safety PPE, and quarantine procedures.
          </p>
        </div>

      </div>

    </div>
  );
}
