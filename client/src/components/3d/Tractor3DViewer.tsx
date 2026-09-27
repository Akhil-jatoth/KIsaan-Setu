import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { Shield, CheckCircle2, AlertTriangle, Eye, RotateCcw } from 'lucide-react';

interface HotspotProps {
  id: string;
  position: [number, number, number];
  name: string;
  isSelected: boolean;
  isCorrectTarget?: boolean;
  onClick: (id: string) => void;
}

function HotspotMarker({ id, position, name, isSelected, isCorrectTarget, onClick }: HotspotProps) {
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.25;
      pulseRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      {/* Outer Pulse */}
      <mesh ref={pulseRef} onClick={(e) => { e.stopPropagation(); onClick(id); }}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial
          color={isCorrectTarget ? "#7ED957" : isSelected ? "#38bdf8" : "#FBBF24"}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Core Dot */}
      <mesh onClick={(e) => { e.stopPropagation(); onClick(id); }}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color={isCorrectTarget ? "#7ED957" : isSelected ? "#38bdf8" : "#FBBF24"}
          emissive={isCorrectTarget ? "#7ED957" : isSelected ? "#38bdf8" : "#FBBF24"}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* 2D Label Overlay */}
      <Html distanceFactor={10} position={[0, 0.25, 0]}>
        <div 
          onClick={() => onClick(id)}
          className={`cursor-pointer px-2.5 py-1 rounded-full text-xs font-mono font-bold whitespace-nowrap shadow-lg transition-all transform hover:scale-105 ${
            isSelected 
              ? 'bg-sky-500 text-black border border-white' 
              : isCorrectTarget
              ? 'bg-agri-accent text-black border border-white animate-bounce'
              : 'bg-black/80 text-amber-300 border border-amber-400/40 backdrop-blur-md'
          }`}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

function TractorModel({ 
  onSelectComponent, 
  selectedId 
}: { 
  onSelectComponent: (id: string) => void;
  selectedId: string | null;
}) {
  return (
    <group>
      {/* Ground Shadow Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.85, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#0b170e" roughness={0.9} />
      </mesh>
      <gridHelper args={[10, 20, '#7ED957', '#17381e']} position={[0, -0.84, 0]} />

      {/* Main Tractor Body */}
      <group position={[0, 0, 0]}>
        {/* Chassis Frame */}
        <Box args={[1.4, 0.6, 2.8]} position={[0, -0.2, 0]}>
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </Box>

        {/* Engine Bay & Front Hood */}
        <group 
          onClick={(e) => { e.stopPropagation(); onSelectComponent('engine'); }}
        >
          <Box args={[1.2, 0.8, 1.4]} position={[0, 0.2, 0.9]}>
            <meshStandardMaterial 
              color={selectedId === 'engine' ? '#22c55e' : '#15803d'} 
              metalness={0.6} 
              roughness={0.3} 
            />
          </Box>
          {/* Front Grille */}
          <Box args={[1.0, 0.6, 0.1]} position={[0, 0.18, 1.62]}>
            <meshStandardMaterial color="#0f172a" roughness={0.9} wireframe={false} />
          </Box>
          {/* Dual LED Headlights */}
          <Sphere args={[0.08, 12, 12]} position={[0.4, 0.35, 1.62]}>
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.2} />
          </Sphere>
          <Sphere args={[0.08, 12, 12]} position={[-0.4, 0.35, 1.62]}>
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1.2} />
          </Sphere>
          {/* Exhaust Pipe */}
          <Cylinder args={[0.05, 0.05, 1.1, 16]} position={[0.5, 0.85, 0.5]}>
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </Cylinder>
        </group>

        {/* Operator Cab & ROPS Frame */}
        <group 
          onClick={(e) => { e.stopPropagation(); onSelectComponent('cab'); }}
        >
          {/* Cab Posts */}
          <Box args={[1.3, 1.1, 1.2]} position={[0, 0.85, -0.4]}>
            <meshStandardMaterial 
              color="#38bdf8" 
              transparent 
              opacity={0.35} 
              roughness={0.1} 
              metalness={0.1} 
            />
          </Box>
          {/* Cab Roof */}
          <Box args={[1.45, 0.15, 1.35]} position={[0, 1.45, -0.4]}>
            <meshStandardMaterial color={selectedId === 'cab' ? '#22c55e' : '#15803d'} />
          </Box>
          {/* Amber Warning Beacon on Roof */}
          <Cylinder args={[0.08, 0.08, 0.15, 12]} position={[0, 1.58, -0.4]}>
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.5} />
          </Cylinder>
          {/* Steering Wheel & Seat */}
          <Cylinder args={[0.15, 0.15, 0.03, 16]} position={[0, 0.65, -0.2]} rotation={[Math.PI / 4, 0, 0]}>
            <meshStandardMaterial color="#0f172a" />
          </Cylinder>
          <Box args={[0.5, 0.6, 0.45]} position={[0, 0.55, -0.6]}>
            <meshStandardMaterial color="#1e293b" />
          </Box>
        </group>

        {/* Brake System & Foot Station */}
        <group 
          onClick={(e) => { e.stopPropagation(); onSelectComponent('brake'); }}
        >
          <Box args={[0.3, 0.1, 0.4]} position={[-0.6, -0.1, -0.3]}>
            <meshStandardMaterial 
              color={selectedId === 'brake' ? '#38bdf8' : '#eab308'} 
              metalness={0.8} 
            />
          </Box>
          <Cylinder args={[0.03, 0.03, 0.3, 8]} position={[-0.55, 0.05, -0.2]}>
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </Cylinder>
        </group>

        {/* Rear PTO & 3-Point Hitch */}
        <group 
          onClick={(e) => { e.stopPropagation(); onSelectComponent('pto'); }}
        >
          {/* PTO Shaft Guard */}
          <Cylinder args={[0.14, 0.14, 0.35, 16]} position={[0, -0.2, -1.5]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial 
              color={selectedId === 'pto' ? '#ef4444' : '#dc2626'} 
              metalness={0.5} 
            />
          </Cylinder>
          {/* Hitch Lift Arms */}
          <Box args={[0.1, 0.1, 0.8]} position={[0.4, -0.25, -1.6]} rotation={[0.2, 0, 0]}>
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </Box>
          <Box args={[0.1, 0.1, 0.8]} position={[-0.4, -0.25, -1.6]} rotation={[0.2, 0, 0]}>
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </Box>
        </group>

        {/* Large Rear Wheels */}
        <group position={[0.85, 0, -0.7]}>
          <Cylinder args={[0.65, 0.65, 0.4, 24]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </Cylinder>
          {/* Rim */}
          <Cylinder args={[0.4, 0.4, 0.42, 16]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.4} />
          </Cylinder>
        </group>

        <group position={[-0.85, 0, -0.7]}>
          <Cylinder args={[0.65, 0.65, 0.4, 24]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </Cylinder>
          {/* Rim */}
          <Cylinder args={[0.4, 0.4, 0.42, 16]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.4} />
          </Cylinder>
        </group>

        {/* Smaller Front Wheels */}
        <group position={[0.7, -0.3, 1.0]}>
          <Cylinder args={[0.45, 0.45, 0.3, 20]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </Cylinder>
          <Cylinder args={[0.26, 0.26, 0.32, 16]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.4} />
          </Cylinder>
        </group>

        <group position={[-0.7, -0.3, 1.0]}>
          <Cylinder args={[0.45, 0.45, 0.3, 20]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#111827" roughness={0.9} />
          </Cylinder>
          <Cylinder args={[0.26, 0.26, 0.32, 16]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#eab308" metalness={0.5} roughness={0.4} />
          </Cylinder>
        </group>
      </group>
    </group>
  );
}

interface Tractor3DViewerProps {
  onSelectHotspot?: (componentId: string) => void;
  selectedComponentId?: string | null;
  targetComponentId?: string; // If in step-by-step training mode
  isTrainingMode?: boolean;
}

export function Tractor3DViewer({
  onSelectHotspot,
  selectedComponentId = 'engine',
  targetComponentId,
  isTrainingMode = false
}: Tractor3DViewerProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(selectedComponentId || 'engine');
  const controlsRef = useRef<any>(null);

  const activeId = selectedComponentId !== undefined ? selectedComponentId : internalSelected;

  const handleSelect = (id: string) => {
    setInternalSelected(id);
    if (onSelectHotspot) {
      onSelectHotspot(id);
    }
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const hotspots = [
    { id: 'engine', name: '1. Engine Bay', pos: [0, 0.4, 1.2] as [number, number, number] },
    { id: 'brake', name: '2. Brake Interlock', pos: [-0.65, -0.05, -0.3] as [number, number, number] },
    { id: 'pto', name: '3. PTO Safety Shaft', pos: [0, -0.15, -1.6] as [number, number, number] },
    { id: 'cab', name: '4. ROPS Operator Cab', pos: [0, 1.1, -0.4] as [number, number, number] }
  ];

  return (
    <div className="w-full h-full min-h-[460px] relative rounded-3xl overflow-hidden glass-panel border border-agri-accent/20 bg-agri-darkest">
      {/* Top HUD Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <span className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono text-agri-accent flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-agri-accent" />
          3D INTERACTIVE TWIN
        </span>
        {isTrainingMode && targetComponentId && (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-mono animate-pulse">
            TARGET: TAP THE {targetComponentId.toUpperCase()}
          </span>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={handleResetCamera}
          className="bg-black/70 hover:bg-black/90 text-gray-300 hover:text-white p-2 rounded-xl border border-white/10 backdrop-blur-md text-xs flex items-center gap-1.5 transition-all"
          title="Reset Camera Angle"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset View</span>
        </button>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [3.8, 2.5, 4.2], fov: 42 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 12, 6]} intensity={1.5} castShadow />
        <directionalLight position={[-10, 8, -6]} intensity={0.6} color="#7ED957" />

        <TractorModel
          onSelectComponent={handleSelect}
          selectedId={activeId}
        />

        {hotspots.map((h) => (
          <HotspotMarker
            key={h.id}
            id={h.id}
            position={h.pos}
            name={h.name}
            isSelected={activeId === h.id}
            isCorrectTarget={isTrainingMode && targetComponentId === h.id}
            onClick={handleSelect}
          />
        ))}

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={9.0}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[11px] font-mono text-gray-400 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
        🖱️ Drag to rotate • Pinch / Scroll to zoom • Click hotspots to inspect
      </div>
    </div>
  );
}
