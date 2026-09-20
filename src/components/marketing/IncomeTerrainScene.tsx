'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/* ─────────────────────────────────────────────
   Income data — 12 months, normalised 0 → 1
───────────────────────────────────────────── */
const MONTHS = [
  { label: 'Jul', v: 0.45 }, { label: 'Aug', v: 0.52 }, { label: 'Sep', v: 0.34 },
  { label: 'Oct', v: 0.18 }, { label: 'Nov', v: 0.41 }, { label: 'Dec', v: 0.74 },
  { label: 'Jan', v: 0.48 }, { label: 'Feb', v: 0.50 }, { label: 'Mar', v: 0.39 },
  { label: 'Apr', v: 0.55 }, { label: 'May', v: 0.58 }, { label: 'Jun', v: 0.56 },
];

const FLOOR_PCT = 0.20;
const sorted = [...MONTHS.map(m => m.v)].sort((a, b) => a - b);
const FLOOR_VAL = sorted[Math.ceil(FLOOR_PCT * sorted.length) - 1]; // ≈ 0.34
const MAX_H = 4.2;
const FLOOR_Y = FLOOR_VAL * MAX_H;

/* ─────────────────────────────────────────────
   Crystal pillar — glass material + emissive glow
───────────────────────────────────────────── */
function CrystalPillar({
  x, height, isAbove, index,
}: {
  x: number; height: number; isAbove: boolean; index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0);
  const startDelay = index * 0.07;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const elapsed = Math.max(0, t - startDelay);
    const arrive = Math.min(1, elapsed / 0.6);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - arrive, 3);
    const currentH = eased * height;
    scaleRef.current = currentH;

    if (!meshRef.current) return;
    meshRef.current.scale.y = currentH;
    meshRef.current.position.y = (currentH * height) / 2;

    // Subtle breathing after arrival
    if (elapsed > 0.7 && glowRef.current) {
      const breathe = Math.sin(t * 1.2 + index * 0.5) * 0.04;
      glowRef.current.scale.y = currentH + breathe;
      glowRef.current.position.y = ((currentH + breathe) * height) / 2;
    }
  });

  const color = isAbove ? '#2F6F62' : '#C98A3E';
  const emissive = isAbove ? '#1AFFB2' : '#FFAA44';

  return (
    <group position={[x, 0, 0]}>
      {/* Core crystal */}
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.32, 1, 0.32]} />
        <MeshTransmissionMaterial
          color={color}
          thickness={0.6}
          roughness={0.05}
          transmission={0.88}
          ior={1.5}
          chromaticAberration={0.04}
          backside
          backsideThickness={0.3}
          envMapIntensity={2}
          emissive={emissive}
          emissiveIntensity={isAbove ? 0.15 : 0.25}
        />
      </mesh>

      {/* Inner glow core */}
      <mesh ref={glowRef}>
        <boxGeometry args={[0.14, 1, 0.14]} />
        <meshStandardMaterial
          color={emissive}
          emissive={emissive}
          emissiveIntensity={2.5}
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Animated floor plane — pulse + ripple
───────────────────────────────────────────── */
function FloorGlow() {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (matRef.current) {
      matRef.current.opacity = 0.45 + Math.sin(t * 1.8) * 0.15;
      matRef.current.emissiveIntensity = 0.8 + Math.sin(t * 1.8) * 0.3;
    }
    if (meshRef.current) {
      meshRef.current.scale.x = 1 + Math.sin(t * 0.6) * 0.01;
    }
  });

  return (
    <group position={[0, FLOOR_Y, 0]}>
      {/* Main floor plane */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 3, 1, 1]} />
        <meshStandardMaterial
          ref={matRef}
          color="#3DE8C8"
          emissive="#3DE8C8"
          emissiveIntensity={1.0}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer diffuse halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 5]} />
        <meshStandardMaterial
          color="#3DE8C8"
          emissive="#3DE8C8"
          emissiveIntensity={0.3}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────
   Floating ambient particles
───────────────────────────────────────────── */
function Particles() {
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = Math.random() * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.012;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#3DE8C8"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

/* ─────────────────────────────────────────────
   Reflective ground plane
───────────────────────────────────────────── */
function Ground() {
  const ref = useRef<THREE.Mesh>(null);
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[30, 12]} />
      <meshStandardMaterial
        color="#050C12"
        metalness={0.8}
        roughness={0.4}
        envMapIntensity={0.5}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────
   Smooth parallax camera rig
───────────────────────────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  const targetX = useRef(0);
  const targetY = useRef(5.5);
  const mouse = useRef({ x: 0, y: 0 });

  // Listen to mouse globally
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__cfMouse = mouse;
  }

  useFrame(() => {
    const mx = mouse.current.x;
    const my = mouse.current.y;
    targetX.current += (mx * 1.5 - targetX.current) * 0.035;
    targetY.current += (my * 0.8 + 5.5 - targetY.current) * 0.035;

    camera.position.x += (targetX.current - camera.position.x) * 0.06;
    camera.position.y += (targetY.current - camera.position.y) * 0.06;
    camera.position.z += (11 - camera.position.z) * 0.04;
    camera.lookAt(0, 2, 0);
  });

  return null;
}

/* ─────────────────────────────────────────────
   Main scene
───────────────────────────────────────────── */
function Scene() {
  return (
    <>
      {/* Environment & lighting */}
      <Environment preset="city" environmentIntensity={0.4} />
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, FLOOR_Y + 0.5, 0]} intensity={3} color="#3DE8C8" distance={8} />
      <pointLight position={[-7, 4, 2]} intensity={0.8} color="#2F6F62" distance={12} />
      <pointLight position={[7, 4, 2]} intensity={0.6} color="#1a3040" distance={12} />

      <CameraRig />
      <Ground />
      <Particles />
      <FloorGlow />

      {/* Crystal pillars */}
      {MONTHS.map((m, i) => {
        const x = (i - 5.5) * 1.15;
        const h = m.v * MAX_H;
        return (
          <CrystalPillar
            key={m.label}
            x={x}
            height={h}
            isAbove={m.v >= FLOOR_VAL}
            index={i}
          />
        );
      })}

      {/* Stars far background */}
      <Stars radius={60} depth={30} count={800} factor={3} fade speed={0.3} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.6}
          intensity={1.4}
          blendFunction={BlendFunction.ADD}
          mipmapBlur
          radius={0.6}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0008, 0.0008) as any}
        />
      </EffectComposer>

      {/* Fog for atmospheric depth */}
      <fog attach="fog" args={['#050C12', 18, 38]} />
    </>
  );
}

/* ─────────────────────────────────────────────
   Export — canvas + mouse bridge
───────────────────────────────────────────── */
export default function IncomeTerrainScene() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2;
    const y = -((e.clientY - top) / height - 0.5) * 2;
    if (typeof window !== 'undefined' && (window as any).__cfMouse) {
      (window as any).__cfMouse.current = { x, y };
    }
  };

  return (
    <div
      className="w-full h-full absolute inset-0"
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ fov: 42, position: [0, 5.5, 11] }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        shadows
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* HUD legend */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#2F6F62', boxShadow: '0 0 8px #3DE8C8' }} />
          <span className="text-[11px] font-mono text-[#5A7080] tracking-widest uppercase">Above floor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-px" style={{ background: '#3DE8C8', boxShadow: '0 0 6px #3DE8C8' }} />
          <span className="text-[11px] font-mono text-[#3DE8C8] tracking-widest uppercase">Income floor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: '#C98A3E', boxShadow: '0 0 8px #FFAA44' }} />
          <span className="text-[11px] font-mono text-[#5A7080] tracking-widest uppercase">Below floor</span>
        </div>
      </div>
    </div>
  );
}
