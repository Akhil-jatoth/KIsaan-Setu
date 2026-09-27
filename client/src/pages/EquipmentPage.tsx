import React from 'react';
import { Wrench, Eye, ShieldCheck, ArrowRight, Zap, Play } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Equipment } from '../types';

export function EquipmentPage() {
  const { equipmentList, setActiveEquipmentId, setRoute, setActiveTrainingId } = useAppStore();

  const handleOpenDetail = (id: string) => {
    setActiveEquipmentId(id);
    setRoute('equipment-detail');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-6 h-6 text-agri-accent" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">3D Equipment & Machinery Center</h1>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Interactive 3D Digital Twins, component safety inspections, and maintenance checklists
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTrainingId('module-tractor-safety');
            setRoute('training-experience');
          }}
          className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-glow-accent transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Launch Tractor 3D Safety Training</span>
        </button>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {equipmentList.map(eq => (
          <div
            key={eq.id}
            onClick={() => handleOpenDetail(eq.id)}
            className="glass-panel overflow-hidden cursor-pointer glass-card-hover border-agri-accent/20 group flex flex-col justify-between"
          >
            <div>
              {/* Image */}
              <div className="h-44 w-full relative overflow-hidden">
                <img
                  src={eq.image}
                  alt={eq.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-agri-accent border border-white/10 flex items-center gap-1.5">
                  <Eye className="w-3 h-3" />
                  <span>3D Digital Twin</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-agri-accent transition-colors">
                    {eq.name}
                  </h3>
                  <div className="text-[11px] text-gray-400 font-mono">
                    {eq.category}
                  </div>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {eq.description}
                </p>

                {/* Hotspot count */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 pt-2 border-t border-white/10">
                  <ShieldCheck className="w-3.5 h-3.5 text-agri-accent" />
                  <span>{eq.components.length} Interactive Inspection Hotspots</span>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="p-4 pt-0">
              <button className="w-full bg-agri-card hover:bg-agri-accent hover:text-black text-agri-accent font-bold py-2 rounded-xl border border-agri-accent/30 text-xs flex items-center justify-center gap-1.5 transition-all">
                <span>Inspect 3D Digital Twin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
