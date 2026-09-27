import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Layers, 
  Plane, 
  Droplets, 
  TrendingUp, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAppStore } from '../store/appStore';

export function FieldDetailPage() {
  const { setRoute, addToast } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'ndvi' | 'drone' | 'scouting'>('ndvi');
  
  // Drone Spray Simulation state
  const [droneFlying, setDroneFlying] = useState(false);
  const [droneProgress, setDroneProgress] = useState(35);
  const [droneBattery, setDroneBattery] = useState(82);

  useEffect(() => {
    let timer: any;
    if (droneFlying) {
      timer = setInterval(() => {
        setDroneProgress(prev => {
          if (prev >= 100) {
            setDroneFlying(false);
            addToast({
              type: 'success',
              title: 'Drone Spray Mission Complete',
              message: '16L Bio-fungicide barrier applied over Block A.'
            });
            return 100;
          }
          return prev + 2;
        });
        setDroneBattery(prev => Math.max(10, prev - 0.2));
      }, 300);
    }
    return () => clearInterval(timer);
  }, [droneFlying]);

  const ndviTrendData = [
    { date: 'Sep 01', ndvi: 0.68 },
    { date: 'Sep 05', ndvi: 0.72 },
    { date: 'Sep 10', ndvi: 0.76 },
    { date: 'Sep 15', ndvi: 0.81 },
    { date: 'Sep 20', ndvi: 0.85 },
    { date: 'Sep 25', ndvi: 0.84 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#09220e] to-agri-darkest">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-agri-accent" />
            <h1 className="text-2xl font-extrabold text-white">
              North Tomato Canopy (Field Block A)
            </h1>
            <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
              Moderate Attention
            </span>
          </div>
          <p className="text-xs text-gray-300 font-mono mt-1">
            Area: 4.2 Acres • GPS Bounds: [17.3850° N, 78.4867° E] • RTK Multispectral Scouting
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex bg-black/60 p-1 rounded-2xl border border-white/10 text-xs font-mono">
          {[
            { id: 'ndvi', label: '🛰️ Satellite NDVI' },
            { id: 'drone', label: '🛸 Drone Spray View' },
            { id: 'overview', label: '📊 Field Sensors' },
            { id: 'scouting', label: '📸 Scouting Log' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-agri-accent text-black font-bold shadow-glow-accent'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Satellite NDVI Heatmap */}
      {activeTab === 'ndvi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* NDVI Visual Satellite Map Canvas (7-Cols) */}
          <div className="lg:col-span-7 glass-panel p-4 border-agri-accent/30 bg-black/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-agri-accent font-bold">MULTISPECTRAL SATELLITE NDVI HEATMAP</span>
              <span className="text-gray-400">RESOLUTION: 10cm / PIXEL</span>
            </div>

            {/* Satellite Map with Heatmap Gradient Overlay */}
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/15">
              <img
                src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=80"
                alt="Satellite Field"
                className="w-full h-full object-cover filter contrast-125"
              />

              {/* NDVI Heatmap Shader Overlay (Red/Yellow/Green spectrum) */}
              <div 
                className="absolute inset-0 opacity-70 mix-blend-color pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 35% 40%, rgba(239, 68, 68, 0.8) 0%, rgba(234, 179, 8, 0.7) 35%, rgba(34, 197, 94, 0.7) 70%, rgba(22, 101, 52, 0.8) 100%)'
                }}
              />

              {/* Holographic HUD Grid */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 border border-agri-accent/30 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border border-agri-accent/15 p-1">
                    <span className="text-[9px] font-mono text-agri-accent/70">A-{i + 1}</span>
                  </div>
                ))}
              </div>

              {/* Anomaly Pin on Affected Section */}
              <div className="absolute top-[38%] left-[32%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
                <div className="w-7 h-7 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold animate-ping" />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/90 text-red-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap border border-red-500/40">
                  ⚠️ Early Blight Zone (NDVI 0.42)
                </div>
              </div>

              {/* Bottom Legend */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10 flex items-center justify-between text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">NDVI Scale:</span>
                  <div className="w-32 h-2.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-500" />
                </div>
                <div className="flex gap-3 text-gray-300">
                  <span className="text-red-400">0.2 (Stressed)</span>
                  <span className="text-amber-400">0.5 (Moderate)</span>
                  <span className="text-emerald-400">0.9 (Vigorous)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: NDVI Trend & Action Panel (5-Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Trend Chart */}
            <div className="glass-panel p-5 border-agri-accent/20 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white">Field Health Index Trend</h3>
                <span className="text-xs font-mono text-agri-accent font-bold">NDVI 0.84 Avg</span>
              </div>
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ndviTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} />
                    <YAxis domain={[0.5, 1.0]} stroke="#9ca3af" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: '#07190b', borderColor: '#7ED957', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="ndvi" stroke="#7ED957" strokeWidth={2.5} dot={{ r: 4, fill: '#7ED957' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="glass-panel p-5 border-agri-accent/30 space-y-3">
              <h4 className="text-xs font-mono text-agri-accent font-bold uppercase">
                Recommended Precision Action
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Zone A-3 exhibits severe foliar stress. Launch the automated RTK spray drone to apply a 16L bio-fungicide protective barrier over this sector.
              </p>
              <button
                onClick={() => setActiveTab('drone')}
                className="w-full bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-glow-accent transition-all"
              >
                <Plane className="w-4 h-4" />
                <span>Open Drone Command View</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Tab: Drone Spray Command View */}
      {activeTab === 'drone' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-7 glass-panel p-4 border-sky-500/40 bg-black/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-sky-400 font-bold flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${droneFlying ? 'bg-sky-400 animate-ping' : 'bg-gray-500'}`} />
                AEROCROP DRONE RTK TELEMETRY FEED
              </span>
              <span className="text-gray-400">ALTITUDE: 2.8m • SPEED: 14 km/h</span>
            </div>

            {/* Live Drone Simulation Canvas */}
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/15">
              <img
                src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=80"
                alt="Drone Live Stream"
                className="w-full h-full object-cover"
              />

              {/* Waypoint S-Curve Spray Flight Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d="M 50,80 L 450,80 Q 480,110 450,140 L 50,140 Q 20,170 50,200 L 450,200"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                />
              </svg>

              {/* Floating Animated Drone Icon on Path */}
              <div 
                className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-sky-500 text-black rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300"
                style={{
                  left: `${20 + (droneProgress * 0.6)}%`,
                  top: `${30 + Math.sin(droneProgress * 0.2) * 20}%`
                }}
              >
                <Plane className={`w-6 h-6 ${droneFlying ? 'animate-spin-slow' : ''}`} />
              </div>

              {/* Spray Droplet Fog Simulation */}
              {droneFlying && (
                <div 
                  className="absolute w-24 h-24 rounded-full bg-cyan-400/30 blur-md -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-ping"
                  style={{
                    left: `${20 + (droneProgress * 0.6)}%`,
                    top: `${30 + Math.sin(droneProgress * 0.2) * 20}%`
                  }}
                />
              )}
            </div>

            {/* Drone Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDroneFlying(!droneFlying)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all ${
                    droneFlying
                      ? 'bg-amber-500 text-black shadow-lg'
                      : 'bg-sky-500 hover:bg-sky-400 text-black shadow-lg'
                  }`}
                >
                  {droneFlying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{droneFlying ? 'Pause Mission' : 'Start Spray Mission'}</span>
                </button>

                <button
                  onClick={() => { setDroneProgress(0); setDroneFlying(false); }}
                  className="bg-black/50 text-gray-300 p-2.5 rounded-xl border border-white/10"
                  title="Reset Waypoints"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right text-xs font-mono text-gray-300">
                <span>Coverage: <strong className="text-sky-400">{droneProgress}%</strong></span>
              </div>
            </div>
          </div>

          {/* Right: Telemetry Specs (5-Cols) */}
          <div className="lg:col-span-5 glass-panel p-5 border-sky-500/30 space-y-4">
            <h3 className="text-sm font-extrabold text-white">Drone Mission Telemetry</h3>
            
            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400">Chemical Tank Payload:</span>
                <span className="font-bold text-white">16.0 Liters (Bio-fungicide)</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400">Battery Level:</span>
                <span className="font-bold text-emerald-400">{Math.round(droneBattery)}% (LiPo 6S)</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400">RTK Accuracy:</span>
                <span className="font-bold text-sky-400">±1.4 cm GPS Fix</span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                <span className="text-gray-400">Target Spray Rate:</span>
                <span className="font-bold text-white">1.8 L / Minute PWM</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-xs text-sky-200">
              💡 <strong>Autonomous Safety:</strong> Ultrasonic auto-height sensors maintain 2.8m constant canopy clearance without drift.
            </div>
          </div>

        </div>
      )}

      {/* Tab: Field Sensors & Moisture */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 border-white/10 space-y-1">
            <span className="text-xs font-mono text-gray-400">Soil Moisture (Depth 15cm)</span>
            <div className="text-2xl font-extrabold text-white font-mono">22.4%</div>
            <div className="text-[11px] text-agri-accent">Field Capacity Optimal</div>
          </div>
          <div className="glass-panel p-5 border-white/10 space-y-1">
            <span className="text-xs font-mono text-gray-400">Canopy Temperature</span>
            <div className="text-2xl font-extrabold text-white font-mono">26.8°C</div>
            <div className="text-[11px] text-amber-400">Normal Range</div>
          </div>
          <div className="glass-panel p-5 border-white/10 space-y-1">
            <span className="text-xs font-mono text-gray-400">Soil Electrical Conductivity (EC)</span>
            <div className="text-2xl font-extrabold text-white font-mono">1.4 dS/m</div>
            <div className="text-[11px] text-emerald-400">Balanced Salinity</div>
          </div>
          <div className="glass-panel p-5 border-white/10 space-y-1">
            <span className="text-xs font-mono text-gray-400">Solar Radiation</span>
            <div className="text-2xl font-extrabold text-white font-mono">840 W/m²</div>
            <div className="text-[11px] text-sky-400">High Photosynthesis</div>
          </div>
        </div>
      )}

      {/* Tab: Scouting Log */}
      {activeTab === 'scouting' && (
        <div className="glass-panel p-6 border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white">Scouting Observations for Block A</h3>
            <button
              onClick={() => setRoute('ar-assistant')}
              className="bg-agri-accent text-agri-darkest px-4 py-2 rounded-xl text-xs font-bold"
            >
              Add New AR Scan
            </button>
          </div>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-4">
              <img
                src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=200&q=80"
                alt="Leaf scan"
                className="w-16 h-16 object-cover rounded-xl border border-white/10"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-white">Tomato: Early Blight (Alternaria solani)</div>
                  <span className="text-[10px] font-mono text-amber-400">91% Confidence</span>
                </div>
                <p className="text-xs text-gray-300 mt-1">Concentric brown lesions identified on lower leaf tier. Lower canopy pruned.</p>
                <div className="text-[10px] text-gray-500 font-mono mt-1">Scouted Today 10:42 AM by Dr. Arjun Patel</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
