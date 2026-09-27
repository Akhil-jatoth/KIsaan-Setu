import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Box, Cylinder, Ring } from '@react-three/drei';
import * as THREE from 'three';

function HolographicFieldGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={gridRef} position={[0, -1.2, 0]}>
      {/* Agricultural Terrain Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14, 32, 32]} />
        <meshStandardMaterial
          color="#0d2818"
          roughness={0.8}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>

      {/* Hologram Scanner Grid */}
      <gridHelper args={[14, 28, '#7ED957', '#1b4d2e']} position={[0, 0.01, 0]} />

      {/* Crop Rows */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <group key={`row-${i}`} position={[x, 0, 0]}>
          {[-4, -2.5, -1, 0.5, 2, 3.5].map((z, j) => (
            <group key={`plant-${i}-${j}`} position={[0, 0.25, z]}>
              <Cylinder args={[0.04, 0.04, 0.5, 8]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#2d6a4f" />
              </Cylinder>
              <Sphere args={[0.22, 8, 8]} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#7ED957" roughness={0.3} metalness={0.1} />
              </Sphere>
            </group>
          ))}
        </group>
      ))}

      {/* Stylized Miniature Smart Tractor */}
      <group position={[1.5, 0.35, 1.2]} rotation={[0, 0.4, 0]}>
        {/* Chassis */}
        <Box args={[1.2, 0.5, 0.7]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#22c55e" metalness={0.6} roughness={0.3} />
        </Box>
        {/* Engine Hood */}
        <Box args={[0.6, 0.4, 0.6]} position={[0.5, 0.15, 0]}>
          <meshStandardMaterial color="#15803d" />
        </Box>
        {/* Cabin Glass */}
        <Box args={[0.5, 0.5, 0.6]} position={[-0.2, 0.55, 0]}>
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} roughness={0.1} />
        </Box>
        {/* Wheels */}
        <Cylinder args={[0.28, 0.28, 0.18, 16]} position={[-0.4, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </Cylinder>
        <Cylinder args={[0.28, 0.28, 0.18, 16]} position={[-0.4, 0, -0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </Cylinder>
        <Cylinder args={[0.18, 0.18, 0.14, 16]} position={[0.5, -0.1, 0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </Cylinder>
        <Cylinder args={[0.18, 0.18, 0.14, 16]} position={[0.5, -0.1, -0.38]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </Cylinder>
      </group>
    </group>
  );
}

function FloatingDataRings() {
  const ring1 = useRef<THREE.Group>(null);
  const ring2 = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.2;
      ring1.current.rotation.y = t * 0.3;
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.25;
      ring2.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group position={[0, 0.5, 0]}>
      <group ref={ring1}>
        <Ring args={[2.2, 2.25, 64]}>
          <meshBasicMaterial color="#7ED957" side={THREE.DoubleSide} transparent opacity={0.6} />
        </Ring>
      </group>
      <group ref={ring2}>
        <Ring args={[2.8, 2.84, 64]}>
          <meshBasicMaterial color="#38bdf8" side={THREE.DoubleSide} transparent opacity={0.4} />
        </Ring>
      </group>
    </group>
  );
}

export function Hero3DScene() {
  return (
    <div className="w-full h-full min-h-[420px] lg:min-h-[540px] relative rounded-3xl overflow-hidden glass-panel">
      {/* Top Floating HUD Tag */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-agri-dark/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-agri-accent/30 text-xs font-mono text-agri-accent">
        <span className="w-2 h-2 rounded-full bg-agri-accent animate-ping" />
        LIVE 3D DIGITAL TWIN • AR GRID ACTIVE
      </div>

      {/* Right Hologram Stat Box */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex flex-col gap-1 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs font-mono">
        <div className="text-gray-400">TELEMETRY NDVI</div>
        <div className="text-agri-accent text-sm font-bold">0.84 • OPTIMAL</div>
        <div className="text-[10px] text-gray-500">GPS RTK: ±1.2cm ACCURACY</div>
      </div>

      <Canvas
        camera={{ position: [4.5, 3.2, 5.5], fov: 45 }}
        shadows
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 8]} intensity={1.5} castShadow />
        <pointLight position={[-5, 5, -5]} color="#7ED957" intensity={2} />
        
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <HolographicFieldGrid />
          <FloatingDataRings />
        </Float>

        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
