import React, { useState } from 'react';
import { 
  ChevronLeft, 
  Wrench, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  ArrowRight,
  Eye
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Tractor3DViewer } from '../components/3d/Tractor3DViewer';

export function EquipmentDetailPage() {
  const { activeEquipment, setRoute, setActiveTrainingId, judgeDemoStep, nextJudgeDemoStep } = useAppStore();
  const [selectedComponentId, setSelectedComponentId] = useState<string>('engine');

  const eq = activeEquipment || {
    id: 'tractor-x900',
    name: 'AgriPro X-900 Smart Tractor',
    category: 'Heavy Field Traction & Power Unit',
    description: 'Next-gen 120 HP agricultural power unit equipped with GPS autosteer and telemetry sensors.',
    specs: {
      "Engine Power": "120 HP @ 2200 RPM",
      "PTO Speed": "540 / 1000 Dual RPM",
      "Hydraulic Lift": "4500 kg Capacity",
      "Fuel Tank": "180 Liters Bio-Diesel Ready"
    },
    components: [
      {
        id: "engine",
        name: "Turbocharged Diesel Engine Bay",
        position: [0, 0.4, 1.2] as [number, number, number],
        description: "High-efficiency common-rail diesel engine with pre-cleaner air intake and dual fuel water separators.",
        safetyChecklist: [
          "Check engine oil dipstick level before cold startup",
          "Inspect radiator coolant level and debris screen",
          "Ensure turbo air filter indicator is not red"
        ],
        maintenanceCycle: "Every 250 operational hours"
      },
      {
        id: "brake",
        name: "Dual Wet-Disc Brake Interlock",
        position: [-0.6, -0.2, -0.4] as [number, number, number],
        description: "Independent left/right steering brakes with master highway interlock latch.",
        safetyChecklist: [
          "ALWAYS engage the brake pedal interlock lock-pin for road transport",
          "Test parking handbrake hold on 15% incline",
          "Verify hydraulic brake fluid reservoir is between Min and Max"
        ],
        maintenanceCycle: "Every 500 operational hours"
      },
      {
        id: "pto",
        name: "Power Take-Off (PTO) & 3-Point Hitch",
        position: [0, 0.1, -1.8] as [number, number, number],
        description: "Heavy rotational power shaft (540/1000 RPM) for driving rotavators, balers, and sprayers.",
        safetyChecklist: [
          "NEVER step over or reach near an active rotating PTO shaft",
          "Ensure full 360° PTO master shield and implement guard are securely latched",
          "Always disengage PTO clutch before dismounting the cab"
        ],
        maintenanceCycle: "Grease universal joints every 50 hours"
      },
      {
        id: "cab",
        name: "ROPS Certified Operator Cockpit",
        position: [0, 1.1, -0.3] as [number, number, number],
        description: "Roll-Over Protective Structure (ROPS) cab with air suspension seat and multi-function telemetry touch terminal.",
        safetyChecklist: [
          "Fasten seatbelt whenever ROPS structure is upright",
          "Keep cabin glass clean and side mirrors aligned",
          "Verify emergency hazard flashers and beacon lights"
        ],
        maintenanceCycle: "Clean cabin air microfilter monthly"
      }
    ],
    safetyProtocols: [
      "Always engage parking brake and shut off engine before inspection",
      "Wear snug-fitting clothing with no dangling cords near shafts",
      "Keep bystanders at least 15 meters clear during implement operation"
    ]
  };

  const currentComponent = eq.components.find(c => c.id === selectedComponentId) || eq.components[0];

  const handleStartTraining = () => {
    setActiveTrainingId('module-tractor-safety');
    setRoute('training-experience');
    if (judgeDemoStep === 7) {
      nextJudgeDemoStep();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Back Button */}
      <button
        onClick={() => setRoute('equipment')}
        className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Equipment Center</span>
      </button>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#09220e] to-agri-darkest">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-agri-accent/20 text-agri-accent px-2 py-0.5 rounded-full border border-agri-accent/30 font-bold">
              3D TWIN ACTIVE
            </span>
            <span className="text-xs text-gray-400 font-mono">{eq.category}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">{eq.name}</h1>
        </div>

        <button
          onClick={handleStartTraining}
          className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-glow-accent transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch 3D Inspection Training</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Model Viewport & Hotspot Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 3D Interactive Viewer (7-Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <Tractor3DViewer
            selectedComponentId={selectedComponentId}
            onSelectHotspot={(id) => setSelectedComponentId(id)}
          />

          {/* Hotspot Quick Select Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {eq.components.map(comp => (
              <button
                key={comp.id}
                onClick={() => setSelectedComponentId(comp.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedComponentId === comp.id
                    ? 'bg-sky-500 text-black shadow-lg'
                    : 'bg-black/50 text-gray-300 border border-white/10 hover:text-white'
                }`}
              >
                {comp.name.split('(')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Selected Component Details & Specs (5-Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Component Inspection Card */}
          <div className="glass-panel p-5 border-sky-500/40 bg-gradient-to-br from-[#091b24] via-agri-dark to-agri-darkest space-y-4 shadow-2xl">
            
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">
                  Selected Hotspot Area:
                </span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">
                  {currentComponent.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-200 leading-relaxed">
              {currentComponent.description}
            </p>

            {/* Safety Checklist for this part */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-gray-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-agri-accent" />
                <span>Mandatory Pre-Op Safety Checklist:</span>
              </span>
              <div className="space-y-1.5">
                {currentComponent.safetyChecklist.map((chk, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-200 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-agri-accent flex-shrink-0 mt-0.5" />
                    <span>{chk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance Interval */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-amber-300">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Maintenance Cycle: {currentComponent.maintenanceCycle}</span>
            </div>

          </div>

          {/* Machine Engineering Specs Card */}
          <div className="glass-panel p-5 border-white/10 space-y-3">
            <h4 className="text-xs font-mono text-agri-accent uppercase font-bold">
              AgriPro X-900 Technical Specifications
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {Object.entries(eq.specs).map(([key, val]) => (
                <div key={key} className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <div className="text-[10px] text-gray-400">{key}</div>
                  <div className="font-bold text-white mt-0.5 truncate">{val}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
