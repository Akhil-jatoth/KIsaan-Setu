import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';

interface Plant3DViewerProps {
  onSelectNode?: (nodeId: string) => void;
  selectedNodeId?: string | null;
  targetNodeId?: string;
  isTrainingMode?: boolean;
}

function PlantModel({ 
  onSelectNode, 
  selectedId, 
  targetNodeId 
}: { 
  onSelectNode: (id: string) => void;
  selectedId: string | null;
  targetNodeId?: string;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pulseRef.current) {
      const s = 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.2;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, -0.8, 0]}>
      {/* Pot / Base */}
      <Cylinder args={[0.7, 0.5, 0.8, 16]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </Cylinder>
      {/* Soil */}
      <Cylinder args={[0.68, 0.68, 0.05, 16]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#27180e" roughness={0.95} />
      </Cylinder>

      {/* Main Stem */}
      <group onClick={(e) => { e.stopPropagation(); onSelectNode('stem'); }}>
        <Cylinder args={[0.06, 0.08, 2.2, 12]} position={[0, 1.9, 0]}>
          <meshStandardMaterial 
            color={selectedId === 'stem' ? '#38bdf8' : '#15803d'} 
            roughness={0.4} 
          />
        </Cylinder>
      </group>

      {/* Lower Leaf Tier (Infected with target spots) */}
      <group 
        position={[-0.4, 1.4, 0.2]} 
        rotation={[0.3, 0.4, -0.6]}
        onClick={(e) => { e.stopPropagation(); onSelectNode('leaf-lower'); }}
      >
        {/* Leaf blade */}
        <mesh>
          <sphereGeometry args={[0.45, 12, 12]} />
          <meshStandardMaterial 
            color={selectedId === 'leaf-lower' ? '#eab308' : '#4d7c0f'} 
            roughness={0.4} 
          />
        </mesh>
        {/* Target Board Fungal Lesion */}
        <mesh position={[0, 0.05, 0.35]}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color="#713f12" />
        </mesh>
        <mesh position={[0, 0.05, 0.35]}>
          <ringGeometry args={[0.08, 0.12, 16]} />
          <meshBasicMaterial color="#eab308" />
        </mesh>
      </group>

      {/* Leaf Underside Tier */}
      <group 
        position={[0.45, 1.7, -0.2]} 
        rotation={[-0.2, -0.5, 0.7]}
        onClick={(e) => { e.stopPropagation(); onSelectNode('leaf-underside'); }}
      >
        <mesh>
          <sphereGeometry args={[0.4, 12, 12]} />
          <meshStandardMaterial 
            color={selectedId === 'leaf-underside' ? '#38bdf8' : '#65a30d'} 
          />
        </mesh>
        {/* Fungal Downy Mold Spot */}
        <mesh position={[0, -0.05, 0.3]} rotation={[Math.PI, 0, 0]}>
          <circleGeometry args={[0.12, 12]} />
          <meshBasicMaterial color="#f1f5f9" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Top Healthy Leaves */}
      <group position={[0, 2.8, 0]}>
        <mesh position={[0.2, 0.2, 0]} rotation={[0, 0, 0.4]}>
          <sphereGeometry args={[0.3, 10, 10]} />
          <meshStandardMaterial color="#84cc16" />
        </mesh>
        <mesh position={[-0.2, 0.2, 0]} rotation={[0, 0, -0.4]}>
          <sphereGeometry args={[0.3, 10, 10]} />
          <meshStandardMaterial color="#84cc16" />
        </mesh>
      </group>

      {/* Interactive Floating Hotspots */}
      <Html position={[-0.5, 1.5, 0.3]}>
        <div 
          onClick={() => onSelectNode('leaf-lower')}
          className={`cursor-pointer px-2 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap shadow-lg ${
            targetNodeId === 'leaf-lower' 
              ? 'bg-agri-accent text-black animate-bounce ring-2 ring-white' 
              : 'bg-black/80 text-amber-300 border border-amber-400/40'
          }`}
        >
          🔍 Lower Canopy Lesion
        </div>
      </Html>

      <Html position={[0.5, 1.8, -0.3]}>
        <div 
          onClick={() => onSelectNode('leaf-underside')}
          className={`cursor-pointer px-2 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap shadow-lg ${
            targetNodeId === 'leaf-underside' 
              ? 'bg-agri-accent text-black animate-bounce ring-2 ring-white' 
              : 'bg-black/80 text-sky-300 border border-sky-400/40'
          }`}
        >
          🔬 Leaf Underside Spores
        </div>
      </Html>

      <Html position={[0.2, 2.1, 0]}>
        <div 
          onClick={() => onSelectNode('stem')}
          className={`cursor-pointer px-2 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap shadow-lg ${
            targetNodeId === 'stem' 
              ? 'bg-agri-accent text-black animate-bounce ring-2 ring-white' 
              : 'bg-black/80 text-emerald-300 border border-emerald-400/40'
          }`}
        >
          ✂️ Stem Prune Point
        </div>
      </Html>
    </group>
  );
}

export function Plant3DViewer({
  onSelectNode,
  selectedNodeId,
  targetNodeId,
  isTrainingMode = false
}: Plant3DViewerProps) {
  const [internalNode, setInternalNode] = useState<string | null>(selectedNodeId || 'leaf-lower');
  const activeNode = selectedNodeId !== undefined ? selectedNodeId : internalNode;
  const controlsRef = useRef<any>(null);

  const handleSelect = (id: string) => {
    setInternalNode(id);
    if (onSelectNode) onSelectNode(id);
  };

  return (
    <div className="w-full h-full min-h-[440px] relative rounded-3xl overflow-hidden glass-panel border border-agri-accent/20 bg-agri-darkest">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => controlsRef.current?.reset()}
          className="bg-black/70 hover:bg-black/90 text-gray-300 hover:text-white p-2 rounded-xl border border-white/10 backdrop-blur-md text-xs flex items-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Angle</span>
        </button>
      </div>

      <Canvas
        camera={{ position: [2.5, 2.0, 3.2], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 10, 6]} intensity={1.5} />
        <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#7ED957" />

        <PlantModel 
          onSelectNode={handleSelect}
          selectedId={activeNode}
          targetNodeId={targetNodeId}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          minDistance={1.8}
          maxDistance={6.0}
        />
      </Canvas>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-[11px] font-mono text-gray-400 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
        🖱️ Rotate & Zoom to inspect foliar pathogen morphology
      </div>
    </div>
  );
}
