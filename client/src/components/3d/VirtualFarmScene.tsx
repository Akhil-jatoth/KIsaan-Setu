import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Sky, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { Sprout, Wrench, Droplets, ShieldCheck, Compass, Play, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

interface FarmZoneProps {
  id: string;
  name: string;
  icon: any;
  color: string;
  position: [number, number, number];
  moduleId: string;
  description: string;
  onClick: (zone: any) => void;
  isSelected: boolean;
}

function FarmZoneHotspot({ id, name, icon: Icon, color, position, moduleId, description, onClick, isSelected }: FarmZoneProps) {
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 3 + position[0]) * 0.2;
      pulseRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      {/* Base ring */}
      <mesh ref={pulseRef} onClick={(e) => { e.stopPropagation(); onClick({ id, name, moduleId, description, color }); }}>
        <cylinderGeometry args={[0.9, 0.9, 0.1, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Floating beacon light */}
      <mesh position={[0, 0.4, 0]} onClick={(e) => { e.stopPropagation(); onClick({ id, name, moduleId, description, color }); }}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
      </mesh>

      {/* 2D HTML Card */}
      <Html distanceFactor={14} position={[0, 0.9, 0]}>
        <div
          onClick={() => onClick({ id, name, moduleId, description, color })}
          className={`cursor-pointer px-3.5 py-1.5 rounded-2xl flex items-center gap-2 border shadow-2xl backdrop-blur-md transition-all transform hover:scale-110 whitespace-nowrap font-mono text-xs font-bold ${
            isSelected
              ? 'bg-agri-accent text-black border-white ring-4 ring-agri-accent/40'
              : 'bg-black/85 text-white border-white/20 hover:border-agri-accent'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          {name}
        </div>
      </Html>
    </group>
  );
}

function FarmEnvironment() {
  return (
    <group>
      {/* Ground Terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 60, 32, 32]} />
        <meshStandardMaterial color="#0c2613" roughness={0.9} />
      </mesh>

      {/* Farm Roads & Cross Paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[4, 60]} />
        <meshStandardMaterial color="#3b3226" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[60, 4]} />
        <meshStandardMaterial color="#3b3226" roughness={0.95} />
      </mesh>

      {/* Zone 1: Crop Field (Top-Left) */}
      <group position={[-12, 0, -12]}>
        {/* Soil plot */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[18, 18]} />
          <meshStandardMaterial color="#2d2013" />
        </mesh>
        {/* Crop rows */}
        {[-7, -4.5, -2, 0.5, 3, 5.5].map((x, i) => (
          <group key={`field-row-${i}`} position={[x, 0, 0]}>
            {[-7, -4.5, -2, 0.5, 3, 5.5].map((z, j) => (
              <group key={`p-${i}-${j}`} position={[0, 0.3, z]}>
                <Cylinder args={[0.04, 0.04, 0.6, 6]} position={[0, 0, 0]}>
                  <meshStandardMaterial color="#166534" />
                </Cylinder>
                <Sphere args={[0.3, 8, 8]} position={[0, 0.35, 0]}>
                  <meshStandardMaterial color="#7ED957" roughness={0.3} />
                </Sphere>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* Zone 2: Machinery Shed & Equipment (Top-Right) */}
      <group position={[12, 0, -12]}>
        {/* Concrete Pad */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[18, 18]} />
          <meshStandardMaterial color="#334155" roughness={0.7} />
        </mesh>
        {/* Equipment Shed Building */}
        <Box args={[12, 5, 8]} position={[0, 2.5, -4]}>
          <meshStandardMaterial color="#1e293b" />
        </Box>
        {/* Shed Roof */}
        <Box args={[13, 0.4, 9]} position={[0, 5.2, -4]}>
          <meshStandardMaterial color="#0f172a" />
        </Box>
        {/* Parked Tractor */}
        <group position={[0, 0.7, 2]}>
          <Box args={[2.5, 1.2, 1.6]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#22c55e" metalness={0.6} />
          </Box>
          <Box args={[1.2, 1.2, 1.5]} position={[-0.4, 1.3, 0]}>
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.5} />
          </Box>
        </group>
      </group>

      {/* Zone 3: Water Reservoir & Center Pivot (Bottom-Left) */}
      <group position={[-12, 0, 12]}>
        {/* Water Pond */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <circleGeometry args={[7, 32]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Center Pivot Rig */}
        <group position={[3, 0, 3]}>
          <Cylinder args={[0.4, 0.5, 4, 16]} position={[0, 2, 0]}>
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
          </Cylinder>
          <Cylinder args={[0.08, 0.08, 10, 8]} position={[4, 3.8, 0]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </Cylinder>
        </group>
      </group>

      {/* Zone 4: Biosecurity & Safety Station (Bottom-Right) */}
      <group position={[12, 0, 12]}>
        {/* Base Pad */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[18, 18]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>
        {/* Agronomy Field Lab */}
        <Box args={[8, 3.5, 6]} position={[0, 1.75, 0]}>
          <meshStandardMaterial color="#0f766e" />
        </Box>
        <Cylinder args={[0.1, 0.1, 8, 8]} position={[4, 4, 3]}>
          <meshStandardMaterial color="#f8fafc" />
        </Cylinder>
      </group>

      {/* Perimeter Trees */}
      {[-24, -18, -12, -6, 0, 6, 12, 18, 24].map((coord, i) => (
        <React.Fragment key={`trees-${i}`}>
          <group position={[coord, 0, -26]}>
            <Cylinder args={[0.3, 0.4, 3, 8]} position={[0, 1.5, 0]}>
              <meshStandardMaterial color="#451a03" />
            </Cylinder>
            <Sphere args={[1.6, 8, 8]} position={[0, 3.8, 0]}>
              <meshStandardMaterial color="#14532d" />
            </Sphere>
          </group>
          <group position={[26, 0, coord]}>
            <Cylinder args={[0.3, 0.4, 3, 8]} position={[0, 1.5, 0]}>
              <meshStandardMaterial color="#451a03" />
            </Cylinder>
            <Sphere args={[1.6, 8, 8]} position={[0, 3.8, 0]}>
              <meshStandardMaterial color="#14532d" />
            </Sphere>
          </group>
        </React.Fragment>
      ))}
    </group>
  );
}

export function VirtualFarmScene() {
  const { setRoute, setActiveTrainingId } = useAppStore();
  const [selectedZone, setSelectedZone] = useState<any>(null);

  const zones = [
    {
      id: 'crop-zone',
      name: '🌱 Crop & Agronomy Zone',
      icon: Sprout,
      color: '#7ED957',
      position: [-12, 0.8, -12] as [number, number, number],
      moduleId: 'module-crop-planting',
      description: 'Precision seedbed moisture testing, planting calibration, and foliar disease scouting.'
    },
    {
      id: 'equipment-zone',
      name: '🚜 Machinery & Tractor Hub',
      icon: Wrench,
      color: '#38bdf8',
      position: [12, 0.8, -12] as [number, number, number],
      moduleId: 'module-tractor-safety',
      description: 'Pre-operation inspection, 5-point safety checklist, engine bay, brake interlock, and PTO.'
    },
    {
      id: 'irrigation-zone',
      name: '💧 Irrigation & Water Station',
      icon: Droplets,
      color: '#06b6d4',
      position: [-12, 0.8, 12] as [number, number, number],
      moduleId: 'module-irrigation-basics',
      description: 'Smart Center Pivot calibration, Variable Rate Irrigation (VRI), and soil capacitance telemetry.'
    },
    {
      id: 'safety-zone',
      name: '🛡️ Biosecurity & Safety Station',
      icon: ShieldCheck,
      color: '#f59e0b',
      position: [12, 0.8, 12] as [number, number, number],
      moduleId: 'module-disease-identification',
      description: 'Field sanitation protocols, chemical PPE verification, and early epidemic containment.'
    }
  ];

  const handleLaunchTraining = (moduleId: string) => {
    setActiveTrainingId(moduleId);
    setRoute('training-experience');
  };

  return (
    <div className="w-full h-full min-h-[580px] lg:min-h-[680px] relative rounded-3xl overflow-hidden glass-panel border border-agri-accent/20 bg-agri-darkest">
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <span className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-agri-accent/40 text-xs font-mono text-agri-accent flex items-center gap-2 shadow-lg">
          <Compass className="w-4 h-4 animate-spin-slow text-agri-accent" />
          IMMERSIVE VIRTUAL FARM SIMULATION (VR READY)
        </span>
      </div>

      {/* Selected Zone Bottom Drawer */}
      {selectedZone && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-lg glass-panel p-5 border border-agri-accent/40 shadow-2xl animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedZone.color }} />
                <h3 className="text-base font-bold text-white">{selectedZone.name}</h3>
              </div>
              <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">{selectedZone.description}</p>
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-black/40"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              onClick={() => handleLaunchTraining(selectedZone.moduleId)}
              className="w-full sm:w-auto bg-agri-accent hover:bg-lime-400 text-agri-darkest font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-glow-accent transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              Enter Interactive Training
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 22, 34], fov: 48 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Sky sunPosition={[100, 40, 100]} turbidity={8} rayleigh={2} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[20, 30, 20]} intensity={1.6} castShadow />

        <FarmEnvironment />

        {zones.map(z => (
          <FarmZoneHotspot
            key={z.id}
            {...z}
            isSelected={selectedZone?.id === z.id}
            onClick={(zone) => setSelectedZone(zone)}
          />
        ))}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={10}
          maxDistance={65}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 6}
        />
      </Canvas>

      {/* Bottom Floating Exploration Hint */}
      {!selectedZone && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-xs font-mono text-gray-300 bg-black/75 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-lg flex items-center gap-2">
          <span>🎮 Orbit camera to explore • Tap glowing beacons (🌱 🚜 💧 🛡️) to launch training</span>
        </div>
      )}
    </div>
  );
}
