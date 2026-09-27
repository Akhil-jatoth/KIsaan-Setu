import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  SwitchCamera, 
  Upload, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Volume2, 
  BookOpen, 
  Layers, 
  Eye, 
  ArrowRight, 
  Image as ImageIcon,
  Activity,
  FlaskConical,
  MessageSquareCode
} from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { aiService, AIDetectionResult, DEMO_PRESET_SAMPLES, DemoSample } from '../services/aiService';

export function ARAssistantPage() {
  const { 
    user,
    setRoute, 
    saveScanFromAI, 
    addToast, 
    speakText, 
    setActiveDiseaseId, 
    setActiveCropId,
    judgeDemoStep,
    nextJudgeDemoStep,
    setCopilotOpen,
    sendCopilotMessage
  } = useAppStore();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<AIDetectionResult | null>(null);
  const [showGhostGuide, setShowGhostGuide] = useState(true);
  const [selectedCropFilter, setSelectedCropFilter] = useState<'Tomato' | 'Potato' | 'Corn' | 'Rice'>('Tomato');

  // Guard against unauthenticated access
  useEffect(() => {
    if (!user) {
      addToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in or register to access the AR Field Assistant.'
      });
      setRoute('login');
    }
  }, [user, setRoute, addToast]);

  // Open Phone Native Camera Directly
  const openNativePhoneCamera = () => {
    setCameraError(null);
    if (nativeCameraInputRef.current) {
      nativeCameraInputRef.current.click();
    }
  };

  // Start Camera with Mobile Native Fallback
  const startCamera = async () => {
    setCameraError(null);

    // If getUserMedia is not supported (e.g. Insecure HTTP on mobile Chrome), open phone camera
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      openNativePhoneCamera();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
        setCapturedImage(null);
        addToast({
          type: 'success',
          title: 'AR Camera Active',
          message: 'WebAR camera initialized with edge inference overlay.'
        });
      }
    } catch (err: any) {
      console.warn('Camera stream notice:', err);
      setIsCameraActive(false);
      openNativePhoneCamera();
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    // Only clean up camera on unmount – do NOT auto-scan on load
    return () => {
      stopCamera();
    };
  }, []);

  // Flip Camera Front / Back
  const toggleFacingMode = async () => {
    stopCamera();
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
    setTimeout(() => {
      startCamera();
    }, 200);
  };

  // Capture frame from live video
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      stopCamera();
      handleAnalyzeImage(dataUrl, selectedCropFilter);
    }
  };

  // Image Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setCapturedImage(result);
      stopCamera();
      handleAnalyzeImage(result, selectedCropFilter);
    };
    reader.readAsDataURL(file);
  };

  // Run AI analysis
  const handleAnalyzeImage = async (imgSource: string, cropHint?: 'Tomato' | 'Potato' | 'Corn' | 'Rice') => {
    setIsAnalyzing(true);
    try {
      const result = await aiService.detectPlant(imgSource, cropHint);
      setDetectionResult(result);
      await saveScanFromAI(result, imgSource);
      setActiveDiseaseId(result.diseaseId);
      setActiveCropId(result.crop.toLowerCase());
      addToast({
        type: 'success',
        title: 'Neural Detection Complete',
        message: `${result.crop}: ${result.disease} (${Math.round(result.confidence * 100)}% confidence)`
      });
    } catch (e) {
      console.error('Detection error', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Select Demo Preset Leaf
  const handleSelectPreset = (sample: DemoSample) => {
    setCapturedImage(sample.imageUrl);
    setSelectedCropFilter(sample.crop);
    stopCamera();
    handleAnalyzeImage(sample.imageUrl, sample.crop);

    if (judgeDemoStep === 2) {
      nextJudgeDemoStep();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Title & Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-agri-accent animate-pulse" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">AR Field Assistant</h1>
            <span className="bg-agri-accent/20 text-agri-accent text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-agri-accent/30">
              WebAR + AI 2.4
            </span>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Real-time camera foliar scanner with holographic bounding boxes, lesion tracking & AR Ghost Guide
          </p>
        </div>

        {/* Ghost Guide & Crop Selector Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowGhostGuide(!showGhostGuide)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
              showGhostGuide
                ? 'bg-agri-accent text-agri-darkest font-bold border-agri-accent shadow-glow-accent'
                : 'bg-black/50 text-gray-300 border-white/10 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>AR Ghost Guide: {showGhostGuide ? 'ON' : 'OFF'}</span>
          </button>

          {/* Quick Crop Filter */}
          <div className="flex bg-black/60 rounded-xl p-1 border border-white/10 text-xs font-mono">
            {(['Tomato', 'Potato', 'Corn', 'Rice'] as const).map(crop => (
              <button
                key={crop}
                onClick={() => {
                  setSelectedCropFilter(crop);
                  if (capturedImage) handleAnalyzeImage(capturedImage, crop);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedCropFilter === crop
                    ? 'bg-agri-accent text-black font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main AR Viewport & Diagnosis Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: AR Camera Viewport HUD (7-Columns) */}
        <div className="lg:col-span-7 glass-panel p-3 bg-black/80 border-agri-accent/30 shadow-2xl space-y-3">
          
          {/* Viewport Frame */}
          <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#051408] rounded-2xl overflow-hidden flex items-center justify-center border border-white/10">
            
            {/* Live Camera Video Feed */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
            />

            {/* Static Image Display when camera is paused/sample loaded */}
            {!isCameraActive && capturedImage && (
              <img
                src={capturedImage}
                alt="Leaf scan subject"
                className="w-full h-full object-cover"
              />
            )}

            {/* Empty State Fallback when neither camera nor image is active */}
            {!isCameraActive && !capturedImage && (
              <div className="text-center p-6 space-y-3">
                <Camera className="w-12 h-12 text-agri-accent mx-auto animate-pulse" />
                <p className="text-xs text-gray-300">Click "Start Live Camera" or select a sample leaf below.</p>
              </div>
            )}

            {/* Hidden Canvas for Frame Capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* AR HUD OVERLAY ELEMENTS */}
            <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between select-none">
              
              {/* Top AR Status Pill */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-agri-accent/40 text-[11px] font-mono text-agri-accent">
                  <span className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-amber-400 animate-ping' : 'bg-agri-accent animate-pulse'}`} />
                  <span>{isAnalyzing ? 'NEURAL CV INFERENCE...' : isCameraActive ? 'LIVE WEBAR TRACKING' : 'TARGET LOCKED'}</span>
                </div>

                <div className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-mono text-gray-300">
                  {selectedCropFilter.toUpperCase()} • 30 FPS
                </div>
              </div>

              {/* AR Corner Brackets & Laser Scan Line */}
              <div className="relative w-3/4 h-3/4 mx-auto my-auto flex items-center justify-center">
                <div className="ar-corner ar-corner-tl" />
                <div className="ar-corner ar-corner-tr" />
                <div className="ar-corner ar-corner-bl" />
                <div className="ar-corner ar-corner-br" />

                {/* Animated Laser Scanning Line */}
                {(isCameraActive || isAnalyzing) && (
                  <div className="absolute inset-x-0 h-1 scan-laser-line animate-scan-line" />
                )}

                {/* Holographic Bounding Box (When AI result available) */}
                {detectionResult && !isAnalyzing && (
                  <div 
                    className="absolute border-2 border-agri-accent bg-agri-accent/10 rounded-xl shadow-glow-accent transition-all animate-pulse"
                    style={{
                      left: `${detectionResult.boundingBox.x}%`,
                      top: `${detectionResult.boundingBox.y}%`,
                      width: `${detectionResult.boundingBox.width}%`,
                      height: `${detectionResult.boundingBox.height}%`
                    }}
                  >
                    {/* Bounding Box Floating Label */}
                    <div className="absolute -top-7 left-0 bg-black/85 text-agri-accent px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold border border-agri-accent/40 whitespace-nowrap shadow-lg flex items-center gap-1">
                      <Zap className="w-3 h-3 text-agri-accent" />
                      {detectionResult.boundingBox.label}
                    </div>

                    {/* Lesion Hotspot Pins */}
                    {detectionResult.lesionCoordinates.map((pin, idx) => (
                      <div
                        key={idx}
                        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/80 border-2 border-white animate-ping"
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      />
                    ))}
                  </div>
                )}

                {/* AR Ghost Guide (Translucent Ideal Plant Comparison Silhouette) */}
                {showGhostGuide && (
                  <div className="absolute right-2 bottom-2 w-28 h-28 border border-dashed border-emerald-400/50 rounded-2xl bg-emerald-950/40 backdrop-blur-xs p-2 flex flex-col items-center justify-between text-center">
                    <span className="text-[9px] font-mono text-emerald-300 uppercase">Ghost Guide</span>
                    <div className="w-12 h-12 rounded-full border border-emerald-400/60 flex items-center justify-center text-emerald-300">
                      🌿
                    </div>
                    <span className="text-[8px] font-mono text-gray-400">Ideal Leaf Canopy</span>
                  </div>
                )}
              </div>

              {/* Bottom Holographic Coordinates */}
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>LAT: 17.3850° N • LON: 78.4867° E</span>
                <span>INFERENCE: {detectionResult?.inferenceTimeMs || 420}ms</span>
              </div>
            </div>

          </div>

          {/* Camera Permission Alert Message */}
          {cameraError && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Camera Notice:</span> {cameraError}
              </div>
            </div>
          )}

          {/* Primary Viewport Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              {!isCameraActive ? (
                <>
                  <button
                    onClick={openNativePhoneCamera}
                    className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-glow-accent transition-all cursor-pointer"
                    title="Open your smartphone's camera to snap a live plant leaf photo"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Snap with Phone Camera</span>
                  </button>

                  <button
                    onClick={startCamera}
                    className="bg-black/60 hover:bg-black/90 text-gray-200 border border-agri-accent/40 font-bold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Start continuous WebAR video feed"
                  >
                    <Activity className="w-3.5 h-3.5 text-agri-accent" />
                    <span>Live WebAR Feed</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={captureFrame}
                  className="bg-red-500 hover:bg-red-400 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-glow-danger transition-all animate-pulse"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture & Diagnose</span>
                </button>
              )}

              {isCameraActive && (
                <>
                  <button
                    onClick={toggleFacingMode}
                    className="bg-black/50 hover:bg-black/80 text-gray-300 p-2.5 rounded-xl border border-white/10"
                    title="Switch Camera (Front / Back)"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-black/50 hover:bg-red-950 text-gray-300 hover:text-red-400 px-3 py-2.5 rounded-xl border border-white/10 text-xs"
                  >
                    Stop
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Native smartphone camera capture */}
              <input
                type="file"
                ref={nativeCameraInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* File upload from gallery */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-agri-card hover:bg-agri-cardLight text-gray-200 border border-white/15 px-3 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <Upload className="w-4 h-4 text-agri-accent" />
                <span>Gallery</span>
              </button>
            </div>
          </div>

          {/* Quick Preset Sample Thumbnails */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-[11px] font-mono text-gray-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-agri-accent" />
              <span>Instant Judge Demo Leaf Presets:</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {DEMO_PRESET_SAMPLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => handleSelectPreset(s)}
                  className={`p-1.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                    capturedImage === s.imageUrl
                      ? 'border-agri-accent bg-agri-accent/20 ring-2 ring-agri-accent/50'
                      : 'border-white/10 bg-black/40 hover:border-white/30'
                  }`}
                >
                  <img src={s.imageUrl} alt={s.title} className="w-full h-12 object-cover rounded-lg mb-1" />
                  <span className="text-[10px] font-bold text-white truncate w-full">{s.crop}</span>
                  <span className="text-[9px] text-gray-400 truncate w-full">{s.condition.split('(')[0]}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: Real-time AI Diagnostic Result Card (5-Columns) */}
        <div className="lg:col-span-5 space-y-4">
          
          {detectionResult ? (
            detectionResult.isPlant === false ? (
              /* NON-PLANT OBJECT DETECTED CARD */
              <div className="glass-panel p-5 border-amber-500/40 bg-gradient-to-br from-[#1a1408] via-[#241708] to-agri-darkest space-y-4 shadow-2xl animate-fade-in">
                
                {/* Non-Plant Header */}
                <div className="flex items-start justify-between gap-3 border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 animate-pulse" />
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase block">
                        Non-Plant Subject
                      </span>
                      <span className="text-base font-extrabold text-white">
                        {detectionResult.objectCategory || 'Non-Agricultural Object'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border border-amber-500/40 text-amber-300 font-bold bg-amber-500/10">
                      Non-Plant
                    </span>
                  </div>
                </div>

                {/* Friendly AI Notice */}
                <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs leading-relaxed space-y-2">
                  <p className="font-medium">
                    {detectionResult.summary}
                  </p>
                </div>

                {/* Key Guidance */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-gray-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>How to get plant disease diagnosis:</span>
                  </div>
                  <div className="space-y-1 text-xs text-gray-300">
                    <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Aim camera directly at an agricultural crop leaf or foliage</span>
                    </div>
                    <div className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>Ensure clear lighting without heavy motion blur</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
                  <button
                    onClick={openNativePhoneCamera}
                    className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-glow-accent transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Scan Crop Leaf</span>
                  </button>

                  <button
                    onClick={() => {
                      const q = "I accidentally scanned a non-plant object. What crops and plant diseases can KisanSetu diagnose and provide fertilizers for?";
                      setCopilotOpen(true);
                      setTimeout(() => sendCopilotMessage(q), 300);
                    }}
                    className="bg-black/60 hover:bg-black/80 text-white font-bold py-2.5 px-3 rounded-xl text-xs border border-white/15 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <MessageSquareCode className="w-4 h-4 text-agri-accent" />
                    <span>Ask Copilot</span>
                  </button>
                </div>

              </div>
            ) : (
              /* PLANT DISEASE DIAGNOSIS CARD */
              <div className="glass-panel p-5 border-agri-accent/40 bg-gradient-to-br from-agri-dark via-[#0a2612] to-agri-darkest space-y-4 shadow-2xl">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-agri-accent uppercase">
                        Detected Crop:
                      </span>
                      <span className="text-base font-extrabold text-white">
                        {detectionResult.crop}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 italic font-mono">
                      {detectionResult.scientificName}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-agri-accent font-mono">
                      {Math.round(detectionResult.confidence * 100)}%
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono">CONFIDENCE</div>
                  </div>
                </div>

                {/* Diagnosis Alert Banner */}
                <div className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                  detectionResult.riskLevel === 'Low' 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : detectionResult.riskLevel === 'Medium'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}>
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-white">
                        {detectionResult.disease}
                      </span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border border-current font-bold">
                        {detectionResult.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      {detectionResult.summary}
                    </p>
                  </div>
                </div>

                {/* Key Visual Symptoms */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-gray-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-agri-accent" />
                    <span>Key Symptoms Detected:</span>
                  </div>
                  <div className="space-y-1">
                    {detectionResult.keySymptoms.map((sym, idx) => (
                      <div key={idx} className="text-xs text-gray-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-agri-accent" />
                        <span>{sym}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Immediate Agronomic Action */}
                <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                  <div className="text-[11px] font-mono text-agri-accent font-bold uppercase">
                    Immediate Recommended Action:
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {detectionResult.immediateAction}
                  </p>
                </div>

                {/* ─── Fertilizer & Treatment Recommendations ─── */}
                {detectionResult.fertilizerRecommendations && detectionResult.fertilizerRecommendations.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-agri-accent font-bold uppercase flex items-center gap-1.5">
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Recommended Fertilizers &amp; Treatments:</span>
                    </div>
                    <div className="space-y-1.5">
                      {detectionResult.fertilizerRecommendations.map((f, idx) => {
                        const typeColors: Record<string, string> = {
                          'Chemical':    'bg-red-500/20 text-red-300 border-red-500/30',
                          'Bio-fungicide': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                          'Organic':     'bg-amber-500/20 text-amber-300 border-amber-500/30',
                          'Nutrient':    'bg-sky-500/20 text-sky-300 border-sky-500/30',
                          'Preventive':  'bg-purple-500/20 text-purple-300 border-purple-500/30'
                        };
                        return (
                          <div key={idx} className="bg-black/50 border border-white/8 rounded-xl p-2.5 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-white leading-tight">{f.name}</span>
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border flex-shrink-0 ${typeColors[f.type] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                                {f.type}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] font-mono text-gray-400">
                              <span>📏 {f.dosage}</span>
                              <span>🔁 {f.frequency}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 leading-snug">{f.purpose}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <p className="text-[10px] text-gray-500 italic">
                  * Note: Model limitation demo. Follow product labels and local certified agronomic advisory before chemical treatment.
                </p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setActiveDiseaseId(detectionResult.diseaseId);
                      setRoute('guidance');
                    }}
                    className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-glow-accent transition-all cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Step Guidance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveDiseaseId(detectionResult.diseaseId);
                      setRoute('disease-analysis');
                    }}
                    className="bg-black/60 hover:bg-black/80 text-white font-bold py-2.5 px-3 rounded-xl text-xs border border-white/15 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Activity className="w-4 h-4 text-agri-accent" />
                    <span>In-Depth Specs</span>
                  </button>
                </div>

                {/* Ask Copilot button */}
                <button
                  onClick={() => {
                    const q = `I scanned my ${detectionResult.crop} plant and detected ${detectionResult.disease}. What fertilizers and treatments should I use? What is the dosage and how do I apply them?`;
                    setCopilotOpen(true);
                    setTimeout(() => sendCopilotMessage(q), 300);
                  }}
                  className="w-full bg-black/60 hover:bg-agri-accent/20 border border-agri-accent/40 text-agri-accent font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquareCode className="w-4 h-4" />
                  <span>Ask Copilot about this disease &amp; fertilizers</span>
                </button>

              </div>
            )
          ) : (
            <div className="glass-panel p-8 text-center border-white/10 space-y-3">
              <Activity className="w-10 h-10 text-gray-500 mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-white">Awaiting Visual Input</h3>
              <p className="text-xs text-gray-400">Position a crop leaf inside the AR crosshair to generate real-time AI diagnosis.</p>
            </div>
          )}

          {/* Quick Help Card */}
          <div className="glass-panel p-4 border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-agri-accent" />
              <div className="text-xs">
                <div className="font-bold text-white">Have Questions?</div>
                <div className="text-gray-400">Ask Farmer Copilot in English/Hindi/Telugu</div>
              </div>
            </div>
            <button
              onClick={() => speakText(detectionResult?.summary || "Point camera at plant to detect.")}
              className="bg-agri-card text-agri-accent hover:bg-agri-accent hover:text-black px-3 py-1.5 rounded-xl border border-agri-accent/30 text-xs font-mono font-bold transition-all"
            >
              Read Aloud
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
