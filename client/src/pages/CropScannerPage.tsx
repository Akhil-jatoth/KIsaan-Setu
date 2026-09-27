import React, { useState } from 'react';
import { Camera, Upload, Sparkles, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { aiService, DEMO_PRESET_SAMPLES } from '../services/aiService';

export function CropScannerPage() {
  const { setRoute, saveScanFromAI, setActiveDiseaseId, addToast } = useAppStore();
  const [selectedCrop, setSelectedCrop] = useState<'Tomato' | 'Potato' | 'Corn' | 'Rice'>('Tomato');
  const [selectedImage, setSelectedImage] = useState<string>(DEMO_PRESET_SAMPLES[0].imageUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const res = await aiService.detectPlant(selectedImage, selectedCrop);
      setResult(res);
      await saveScanFromAI(res, selectedImage);
      setActiveDiseaseId(res.diseaseId);
      addToast({
        type: 'success',
        title: 'Foliar Diagnosis Complete',
        message: `${res.crop}: ${res.disease} (${Math.round(res.confidence * 100)}% confidence)`
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <div className="glass-panel p-6 border-agri-accent/30 bg-gradient-to-r from-agri-dark via-[#09220e] to-agri-darkest">
        <h1 className="text-2xl font-extrabold text-white">Dedicated Crop & Disease Scanner</h1>
        <p className="text-xs text-gray-300 font-mono mt-1">
          High-throughput computer vision workstation for foliar pathogen classification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Input Selection */}
        <div className="glass-panel p-5 border-white/10 space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Select Target Crop Category</label>
            <div className="grid grid-cols-4 gap-2 text-xs font-mono">
              {(['Tomato', 'Potato', 'Corn', 'Rice'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCrop(c)}
                  className={`py-2 rounded-xl border transition-all ${
                    selectedCrop === c ? 'bg-agri-accent text-black font-bold' : 'bg-black/40 text-gray-300 border-white/10'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Sample Leaf Preset</label>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_PRESET_SAMPLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedImage(s.imageUrl);
                    setSelectedCrop(s.crop);
                  }}
                  className={`p-1.5 rounded-xl border ${
                    selectedImage === s.imageUrl ? 'border-agri-accent bg-agri-accent/20' : 'border-white/10 bg-black/40'
                  }`}
                >
                  <img src={s.imageUrl} alt={s.title} className="w-full h-14 object-cover rounded-lg mb-1" />
                  <span className="text-[10px] font-bold text-white block truncate">{s.crop}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-48 rounded-2xl overflow-hidden border border-white/15 relative">
            <img src={selectedImage} alt="Selected Leaf" className="w-full h-full object-cover" />
            {isScanning && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <div className="text-center space-y-2">
                  <span className="w-8 h-8 rounded-full border-2 border-agri-accent border-t-transparent animate-spin inline-block" />
                  <div className="text-xs font-mono text-agri-accent">Processing Neural Inference...</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              id="crop-scanner-native-cam"
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const res = ev.target?.result as string;
                    setSelectedImage(res);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('crop-scanner-native-cam')?.click()}
              className="flex-1 bg-black/60 hover:bg-black/90 text-gray-200 border border-agri-accent/40 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-agri-accent" />
              <span>Camera Snap</span>
            </button>

            <input
              type="file"
              id="crop-scanner-gallery"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const res = ev.target?.result as string;
                    setSelectedImage(res);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('crop-scanner-gallery')?.click()}
              className="flex-1 bg-black/60 hover:bg-black/90 text-gray-200 border border-white/10 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-sky-400" />
              <span>Gallery</span>
            </button>
          </div>

          <button
            onClick={handleScan}
            disabled={isScanning}
            className="w-full bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-glow-accent cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isScanning ? 'Diagnosing...' : 'Run Neural AI Scan'}</span>
          </button>
        </div>

        {/* Right: Results */}
        <div className="glass-panel p-5 border-agri-accent/30 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase font-mono">
            Diagnostic Analysis Report
          </h3>

          {result ? (
            result.isPlant === false ? (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
                    <div>
                      <div className="text-xs text-amber-400 font-mono font-bold">NON-PLANT OBJECT DETECTED</div>
                      <div className="text-base font-bold text-white mt-0.5">{result.objectCategory || 'Non-Agricultural Item'}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-amber-500/40 text-amber-300 font-bold bg-amber-500/10">
                    Non-Plant
                  </span>
                </div>

                <p className="text-xs text-amber-200 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-amber-500/20">
                  {result.summary}
                </p>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-gray-300 font-bold">Instruction:</span>
                  <div className="text-xs text-gray-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span>Please capture an agricultural crop leaf for disease and fertilizer advice.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-black/60 border border-agri-accent/30 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-agri-accent font-mono font-bold">CLASSIFIED CONDITION</div>
                    <div className="text-lg font-bold text-white mt-0.5">{result.disease}</div>
                    <div className="text-xs text-gray-400 italic font-mono">{result.scientificName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-agri-accent font-mono">
                      {Math.round(result.confidence * 100)}%
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">CONFIDENCE</div>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/5">
                  {result.summary}
                </p>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono text-gray-300 font-bold">Pathological Indicators:</span>
                  {result.keySymptoms.map((k: string, i: number) => (
                    <div key={i} className="text-xs text-gray-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-agri-accent flex-shrink-0" />
                      <span>{k}</span>
                    </div>
                  ))}
                </div>

                {/* Fertilizer Recommendations */}
                {result.fertilizerRecommendations && result.fertilizerRecommendations.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-agri-accent font-bold uppercase block">
                      Recommended Fertilizers &amp; Dosages:
                    </span>
                    <div className="space-y-1.5 max-h-44 overflow-y-auto">
                      {result.fertilizerRecommendations.map((f: any, i: number) => (
                        <div key={i} className="bg-black/50 border border-white/8 rounded-xl p-2 text-xs space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">{f.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-agri-accent/15 text-agri-accent border border-agri-accent/30 font-bold">
                              {f.type}
                            </span>
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono">📏 {f.dosage} • 🔁 {f.frequency}</div>
                          <p className="text-[10px] text-gray-500">{f.purpose}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setRoute('guidance')}
                  className="w-full bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-glow-accent cursor-pointer"
                >
                  <span>Open Step-by-Step Field Guidance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )
          ) : (
            <div className="text-center p-12 text-gray-400 text-xs">
              Click "Run Neural AI Scan" to generate instant classification.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
