import React from 'react';
import { Camera, Calendar, CheckCircle2, ArrowRight, Download, Filter, MapPin } from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function HistoryPage() {
  const { scans, setRoute, setActiveDiseaseId } = useAppStore();

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Crop,Condition,Confidence,Risk,Location\n"
      + scans.map(s => `"${s.date}","${s.crop}","${s.condition}","${Math.round(s.confidence * 100)}%","${s.riskLevel}","${s.location}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agrilens_scan_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-5 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#09220e] to-agri-darkest">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-6 h-6 text-agri-accent" />
            <h1 className="text-2xl font-extrabold text-white">
              AI Foliar Scan & Diagnosis Log
            </h1>
          </div>
          <p className="text-xs text-gray-300 font-mono mt-0.5">
            Historical computer vision records, confidence telemetry, and field intervention logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-black/60 hover:bg-black/90 text-gray-200 border border-white/15 px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-agri-accent" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setRoute('ar-assistant')}
            className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-glow-accent transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>New AR Scan</span>
          </button>
        </div>
      </div>

      {/* Scans List / Cards */}
      <div className="space-y-3">
        {scans.length > 0 ? (
          scans.map(scan => (
            <div
              key={scan.id}
              className="glass-panel p-4 border-white/10 glass-card-hover flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <img
                  src={scan.image}
                  alt={scan.crop}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/15 group-hover:scale-105 transition-transform"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-white">
                      {scan.crop}
                    </h3>
                    <span className="text-xs text-gray-400 italic font-mono hidden sm:inline">
                      ({scan.scientificName})
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
                      scan.riskLevel === 'Low'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : scan.riskLevel === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border-red-500/30'
                    }`}>
                      {scan.riskLevel} Risk
                    </span>
                  </div>

                  <div className="text-xs text-amber-300 font-bold">
                    {scan.condition}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(scan.date).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {scan.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Confidence Score & Action */}
              <div className="flex items-center justify-between w-full md:w-auto gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                <div className="text-left md:text-right">
                  <div className="text-xl font-extrabold text-agri-accent font-mono">
                    {Math.round(scan.confidence * 100)}%
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono">AI CONFIDENCE</div>
                </div>

                <button
                  onClick={() => {
                    setActiveDiseaseId(scan.diseaseId || 'tomato-early-blight');
                    setRoute('guidance');
                  }}
                  className="bg-agri-card hover:bg-agri-accent hover:text-black text-agri-accent font-bold px-4 py-2 rounded-xl text-xs border border-agri-accent/30 flex items-center gap-1.5 transition-all"
                >
                  <span>Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-panel p-12 text-center border-white/10 space-y-3">
            <Camera className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No Scan Records Yet</h3>
            <p className="text-xs text-gray-400">Launch the AR Assistant to capture your first crop leaf diagnosis.</p>
          </div>
        )}
      </div>

    </div>
  );
}
