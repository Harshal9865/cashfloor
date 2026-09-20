'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

/* ── Animated income bar ── */
function IncomeBar({ x, z, height, color, delay }: {
  x: number; z: number; height: number; color: string; delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetHeight = height;
  const startTime = useRef(Date.now() + delay * 1000);

  useFrame(() => {
    if (!meshRef.current) return;
    const elapsed = (Date.now() - startTime.current) / 1000;
    const t = Math.max(0, Math.min(1, elapsed));
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // ease in-out quad
    const animatedH = eased * targetHeight;

    // Gentle hover animation after arrival
    const hover = elapsed > 1 ? Math.sin(elapsed * 0.8 + delay) * 0.05 : 0;

    meshRef.current.scale.y = animatedH;
    meshRef.current.position.y = (animatedH * targetHeight) / 2 + hover;
  });

  return (
    <mesh ref={meshRef} position={[x, 0, z]}>
      <boxGeometry args={[0.35, 1, 0.35]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

/* ── Glowing floor plane ── */
function FloorLine({ floorY }: { floorY: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.opacity = 0.6 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
  });

  return (
    <mesh ref={ref} position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[14, 5]} />
      <meshStandardMaterial
        color="#3DE8C8"
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ── Floating number label as a 3D plane ── */
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 6, 12);
    camera.lookAt(0, 1.5, 0);
  }, [camera]);

  useFrame(({ clock, mouse }) => {
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 1.5 + 5 - camera.position.y) * 0.02;
    camera.lookAt(0, 1.5, 0);
  });

  return null;
}

/* ── Main 3D scene ── */
function Scene() {
  // Simulated 12 months of freelance income (normalized 0→1)
  const months = useMemo(() => [
    { income: 0.45, label: 'Jul' },
    { income: 0.52, label: 'Aug' },
    { income: 0.32, label: 'Sep' },  // lean month
    { income: 0.18, label: 'Oct' },  // very lean
    { income: 0.41, label: 'Nov' },
    { income: 0.72, label: 'Dec' },  // peak
    { income: 0.48, label: 'Jan' },
    { income: 0.50, label: 'Feb' },
    { income: 0.39, label: 'Mar' },
    { income: 0.55, label: 'Apr' },
    { income: 0.58, label: 'May' },
    { income: 0.56, label: 'Jun' },
  ], []);

  const floorPct = 0.20; // 20th percentile floor
  const sorted = [...months.map(m => m.income)].sort((a, b) => a - b);
  const floorValue = sorted[Math.ceil(floorPct * sorted.length) - 1]; // ~0.32

  const maxH = 3.5;
  const floorY = floorValue * maxH;

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-3, 4, 2]} intensity={0.5} color="#3DE8C8" />
      <pointLight position={[6, 2, -2]} intensity={0.3} color="#2F6F62" />

      <CameraRig />

      {/* Income bars */}
      {months.map((m, i) => {
        const x = (i - 5.5) * 1.1;
        const h = m.income * maxH;
        // Above floor = teal, below floor = amber/brick
        const isAboveFloor = m.income >= floorValue;
        const color = isAboveFloor ? '#2F6F62' : '#C98A3E';
        return (
          <IncomeBar
            key={m.label}
            x={x}
            z={0}
            height={h}
            color={color}
            delay={i * 0.06}
          />
        );
      })}

      {/* The floor line — the core concept */}
      <FloorLine floorY={floorY} />

      {/* Subtle grid underneath */}
      <gridHelper
        args={[16, 20, '#1a3040', '#0e1e2a']}
        position={[0, -0.01, 0]}
      />

      {/* Fog for depth */}
      <fog attach="fog" args={['#080C10', 15, 30]} />
    </>
  );
}

export default function IncomeTerrainScene() {
  return (
    <div className="w-full h-full absolute inset-0" style={{ cursor: 'none' }}>
      <Canvas
        camera={{ fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
      {/* Overlay legend */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#2F6F62' }} />
          <span className="text-xs font-mono text-[#7A8B96]">Above floor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#C98A3E' }} />
          <span className="text-xs font-mono text-[#7A8B96]">Below floor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5" style={{ background: '#3DE8C8' }} />
          <span className="text-xs font-mono text-[#3DE8C8]">Your floor</span>
        </div>
      </div>
    </div>
  );
}
