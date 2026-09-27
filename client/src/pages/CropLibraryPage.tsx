import React, { useState } from 'react';
import { Search, BookOpen, Droplets, Thermometer, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Crop } from '../types';

export function CropLibraryPage() {
  const { crops, setActiveCropId, setRoute } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCrops = crops.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category.includes(selectedCategory);
    return matchesSearch && matchesCat;
  });

  const handleOpenDetail = (cropId: string) => {
    setActiveCropId(cropId);
    setRoute('crop-detail');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-agri-accent" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Crop Knowledge Library</h1>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Comprehensive agronomic profiles, phenology growth stages, and disease management
          </p>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crops, scientific names..."
            className="w-full bg-black/60 border border-white/15 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agri-accent"
          />
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto text-xs font-mono pb-1">
        {['All', 'Solanaceae', 'Poaceae', 'Tubers', 'Cereal'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl border transition-all ${
              selectedCategory === cat
                ? 'bg-agri-accent text-black font-bold border-agri-accent'
                : 'bg-black/40 text-gray-300 border-white/10 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCrops.map(crop => (
          <div
            key={crop.id}
            onClick={() => handleOpenDetail(crop.id)}
            className="glass-panel overflow-hidden cursor-pointer glass-card-hover border-agri-accent/20 group flex flex-col justify-between"
          >
            <div>
              {/* Image & Category Badge */}
              <div className="h-44 w-full relative overflow-hidden">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-agri-accent border border-white/10">
                  {crop.category.split('(')[0]}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-agri-accent transition-colors">
                    {crop.name}
                  </h3>
                  <div className="text-xs text-gray-400 italic font-mono">
                    {crop.scientificName}
                  </div>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {crop.description}
                </p>

                {/* Quick specs */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[11px] font-mono text-gray-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <Thermometer className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{crop.optimalTemp.split('(')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Droplets className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                    <span className="truncate">{crop.waterRequirement.split(';')[0]}</span>
                  </div>
                </div>

                {/* Common Diseases Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {crop.commonDiseases.slice(0, 2).map((d, i) => (
                    <span key={i} className="text-[9px] font-mono bg-red-500/10 text-red-300 border border-red-500/30 px-1.5 py-0.5 rounded">
                      {d}
                    </span>
                  ))}
                  {crop.commonDiseases.length > 2 && (
                    <span className="text-[9px] font-mono text-gray-400 px-1 py-0.5">
                      +{crop.commonDiseases.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 pt-0">
              <button className="w-full bg-agri-card hover:bg-agri-accent hover:text-black text-agri-accent font-bold py-2 rounded-xl border border-agri-accent/30 text-xs flex items-center justify-center gap-1.5 transition-all">
                <span>View Full Agronomy Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
