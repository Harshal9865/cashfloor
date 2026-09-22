'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Zap, 
  AlertTriangle, 
  Sparkles, 
  Lock, 
  ArrowRight,
  Info,
  CheckCircle2,
  Sliders
} from 'lucide-react';

/* ── Scenario Definitions ── */
export type ScenarioId = 'baseline' | 'drought' | 'churn' | 'windfall';

interface MonthData {
  month: string;
  invoiced: number;
}

interface ScenarioConfig {
  id: ScenarioId;
  label: string;
  icon: React.ElementType;
  badge: string;
  tagline: string;
  data: MonthData[];
  floor: number;
  runwayMonths: number;
  bufferReserve: number;
  taxProtected: number;
  safeDraw: number;
  color: string;
}

const MONTH_NAMES = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const SCENARIOS: Record<ScenarioId, ScenarioConfig> = {
  baseline: {
    id: 'baseline',
    label: 'Standard Freelance Flow',
    icon: Zap,
    badge: 'Baseline Variance',
    tagline: 'Typical irregular freelance income. Volatile peaks, lean troughs, floor stays impenetrable.',
    data: [
      { month: 'Jul', invoiced: 5400 },
      { month: 'Aug', invoiced: 6800 },
      { month: 'Sep', invoiced: 4100 },
      { month: 'Oct', invoiced: 2100 }, // Lean
      { month: 'Nov', invoiced: 4900 },
      { month: 'Dec', invoiced: 8900 }, // Peak
      { month: 'Jan', invoiced: 5200 },
      { month: 'Feb', invoiced: 5800 },
      { month: 'Mar', invoiced: 4400 },
      { month: 'Apr', invoiced: 6600 },
      { month: 'May', invoiced: 7200 },
      { month: 'Jun', invoiced: 6100 },
    ],
    floor: 3200,
    runwayMonths: 5.6,
    bufferReserve: 11400,
    taxProtected: 7800,
    safeDraw: 3200,
    color: '#3DE8C8',
  },
  drought: {
    id: 'drought',
    label: '90-Day Summer Drought',
    icon: AlertTriangle,
    badge: 'Stress Test: Lean Valley',
    tagline: 'Three back-to-back sluggish months. Buffer auto-deploys $3,100 without touching credit cards.',
    data: [
      { month: 'Jul', invoiced: 4900 },
      { month: 'Aug', invoiced: 1950 }, // Drought 1
      { month: 'Sep', invoiced: 1400 }, // Drought 2
      { month: 'Oct', invoiced: 1850 }, // Drought 3
      { month: 'Nov', invoiced: 4200 },
      { month: 'Dec', invoiced: 8400 },
      { month: 'Jan', invoiced: 5100 },
      { month: 'Feb', invoiced: 5400 },
      { month: 'Mar', invoiced: 4300 },
      { month: 'Apr', invoiced: 6200 },
      { month: 'May', invoiced: 6700 },
      { month: 'Jun', invoiced: 6100 },
    ],
    floor: 2800,
    runwayMonths: 3.9,
    bufferReserve: 7200,
    taxProtected: 5600,
    safeDraw: 2800,
    color: '#F5C97A',
  },
  churn: {
    id: 'churn',
    label: 'Lost 40% Retainer Client',
    icon: TrendingDown,
    badge: 'Stress Test: Client Churn',
    tagline: 'Top client pauses retainer in Nov. Conservative floor recalibrates draw instantly to prevent panic.',
    data: [
      { month: 'Jul', invoiced: 7200 },
      { month: 'Aug', invoiced: 7600 },
      { month: 'Sep', invoiced: 7100 },
      { month: 'Oct', invoiced: 3400 }, // Retainer lost
      { month: 'Nov', invoiced: 3100 },
      { month: 'Dec', invoiced: 3600 },
      { month: 'Jan', invoiced: 3300 },
      { month: 'Feb', invoiced: 3700 },
      { month: 'Mar', invoiced: 3500 },
      { month: 'Apr', invoiced: 3900 },
      { month: 'May', invoiced: 4200 },
      { month: 'Jun', invoiced: 4400 },
    ],
    floor: 3100,
    runwayMonths: 4.2,
    bufferReserve: 8900,
    taxProtected: 6200,
    safeDraw: 3100,
    color: '#FF8A70',
  },
  windfall: {
    id: 'windfall',
    label: 'Q4 Enterprise Windfall',
    icon: Sparkles,
    badge: 'Surplus Routing Protocol',
    tagline: 'Enterprise contract lands with $13k milestone. Tax escrow locks 28% so you do not overspend.',
    data: [
      { month: 'Jul', invoiced: 5200 },
      { month: 'Aug', invoiced: 5800 },
      { month: 'Sep', invoiced: 4900 },
      { month: 'Oct', invoiced: 6400 },
      { month: 'Nov', invoiced: 11800 }, // Surge
      { month: 'Dec', invoiced: 13900 }, // Peak
      { month: 'Jan', invoiced: 8200 },
      { month: 'Feb', invoiced: 6700 },
      { month: 'Mar', invoiced: 5900 },
      { month: 'Apr', invoiced: 7200 },
      { month: 'May', invoiced: 7800 },
      { month: 'Jun', invoiced: 6900 },
    ],
    floor: 4200,
    runwayMonths: 9.4,
    bufferReserve: 24800,
    taxProtected: 14200,
    safeDraw: 3900,
    color: '#3DE8C8',
  },
};

/* ── Smooth Spline Generator for SVG ── */
function buildSmoothSpline(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export default function LivingFloorVisual() {
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('baseline');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentScenario = SCENARIOS[activeScenario];

  // Max value calculation for scaling
  const maxVal = useMemo(() => {
    return Math.max(...currentScenario.data.map(d => d.invoiced), 15000);
  }, [currentScenario]);

  // Coordinate dimensions in SVG space (1000 x 420)
  const svgW = 1000;
  const svgH = 420;
  const padX = 50;
  const padTop = 40;
  const padBottom = 50;
  const graphH = svgH - padTop - padBottom;
  const graphW = svgW - padX * 2;

  // Convert month data to SVG points
  const points = useMemo(() => {
    return currentScenario.data.map((item, idx) => {
      const x = padX + (idx / (currentScenario.data.length - 1)) * graphW;
      const normY = item.invoiced / maxVal;
      const y = padTop + (1 - normY) * graphH;
      return { x, y, ...item };
    });
  }, [currentScenario, maxVal, graphW, graphH, padX, padTop]);

  // Calculate Y position for the Floor line
  const floorY = useMemo(() => {
    const normFloor = currentScenario.floor / maxVal;
    return padTop + (1 - normFloor) * graphH;
  }, [currentScenario.floor, maxVal, graphH, padTop]);

  // Main spline curve paths
  const linePath = useMemo(() => buildSmoothSpline(points), [points]);
  
  const areaPath = useMemo(() => {
    if (points.length === 0) return '';
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = padTop + graphH;
    return `${linePath} L ${lastX.toFixed(1)} ${bottomY} L ${firstX.toFixed(1)} ${bottomY} Z`;
  }, [linePath, points, padTop, graphH]);

  // Bedrock floor area (below the floor line)
  const bedrockPath = useMemo(() => {
    const bottomY = padTop + graphH;
    const firstX = padX;
    const lastX = padX + graphW;
    return `M ${firstX} ${floorY.toFixed(1)} L ${lastX} ${floorY.toFixed(1)} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [floorY, padX, graphW, padTop, graphH]);

  /* ── Interactive Pointer / Touch Scrubber ── */
  const updatePointerIndex = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, (relX - (padX / svgW) * rect.width) / ((graphW / svgW) * rect.width)));
    const targetIdx = Math.round(pct * (currentScenario.data.length - 1));
    setHoverIndex(Math.max(0, Math.min(currentScenario.data.length - 1, targetIdx)));
  }, [currentScenario.data.length, graphW, padX, svgW]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    updatePointerIndex(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isScrubbing || e.pointerType === 'mouse') {
      updatePointerIndex(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsScrubbing(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerLeave = () => {
    if (!isScrubbing) {
      setHoverIndex(null);
    }
  };

  /* ── Lightweight Canvas Cash Flow Micro-Particles ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isVisible = true;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    // Particle pool (<40 particles for 120 FPS performance)
    const count = 32;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * svgW,
      t: Math.random(),
      speed: 0.0015 + Math.random() * 0.002,
      size: 1.2 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.6,
      branchToFloor: Math.random() > 0.45,
    }));

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, svgW, svgH);

      particles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.branchToFloor = Math.random() > 0.45;
        }

        const pointIndex = p.t * (points.length - 1);
        const idxLow = Math.floor(pointIndex);
        const idxHigh = Math.min(points.length - 1, idxLow + 1);
        const fraction = pointIndex - idxLow;

        const p1 = points[idxLow] || points[0];
        const p2 = points[idxHigh] || points[points.length - 1];

        // Interpolate position along wave
        const waveX = p1.x + (p2.x - p1.x) * fraction;
        const waveY = p1.y + (p2.y - p1.y) * fraction;

        let targetY = waveY;
        if (p.branchToFloor && p.t > 0.25 && p.t < 0.85) {
          // Gently guide particle toward the Floor laser line
          targetY = waveY + (floorY - waveY) * Math.sin((p.t - 0.25) * Math.PI / 0.6);
        }

        ctx.beginPath();
        ctx.arc(waveX, targetY, p.size, 0, Math.PI * 2);
        
        // Color based on whether above or below floor
        if (targetY > floorY + 4) {
          ctx.fillStyle = `rgba(245, 201, 122, ${p.alpha * 0.8})`; // Warm amber buffer
        } else {
          ctx.fillStyle = `rgba(61, 232, 200, ${p.alpha})`; // Emerald cash stream
        }
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [points, floorY, svgW, svgH]);

  // Active inspect item
  const inspectedPoint = hoverIndex !== null ? points[hoverIndex] : null;
  const isInspectedLean = inspectedPoint ? inspectedPoint.invoiced < currentScenario.floor : false;
  const deficitAmount = inspectedPoint ? Math.max(0, currentScenario.floor - inspectedPoint.invoiced) : 0;
  const surplusAmount = inspectedPoint ? Math.max(0, inspectedPoint.invoiced - currentScenario.floor) : 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6 my-4 select-none">
      {/* ── Outer Terminal Frame ── */}
      <div 
        className="relative rounded-3xl border overflow-hidden backdrop-blur-xl transition-all duration-500 shadow-2xl"
        style={{
          background: 'var(--cf-surface)',
          borderColor: 'var(--cf-border)',
          boxShadow: 'var(--cf-shadow-lg)',
        }}
      >
        {/* Subtle top glow bar */}
        <div 
          className="absolute top-0 inset-x-0 h-[2px] transition-colors duration-500"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${currentScenario.color} 50%, transparent 100%)`,
          }}
        />

        {/* ── Top Header & Scenario Cockpit ── */}
        <div className="p-4 sm:p-6 md:p-8 border-b border-[var(--cf-border-soft)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Left: Product Value Indicator */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span 
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: currentScenario.color }}
                  />
                  <span 
                    className="relative inline-flex rounded-full h-2.5 w-2.5"
                    style={{ background: currentScenario.color }}
                  />
                </span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--cf-text-muted)]">
                  Live Interactive Stress Lab
                </span>
                <span 
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border"
                  style={{
                    background: `${currentScenario.color}15`,
                    borderColor: `${currentScenario.color}40`,
                    color: currentScenario.color,
                  }}
                >
                  {currentScenario.badge}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif text-[var(--cf-text)] font-semibold flex items-center gap-2">
                <span>The Living Floor Engine</span>
                <span className="text-xs font-mono font-normal text-[var(--cf-text-faint)] hidden sm:inline">
                  (20th-Percentile Bedrock Math)
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-[var(--cf-text-muted)] mt-1 max-w-xl leading-relaxed">
                {currentScenario.tagline}
              </p>
            </div>

            {/* Right: 1-Click Scenario Preset Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[var(--cf-bg-deep)] border border-[var(--cf-border)]">
              {(Object.keys(SCENARIOS) as ScenarioId[]).map((key) => {
                const sc = SCENARIOS[key];
                const Icon = sc.icon;
                const isActive = activeScenario === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveScenario(key)}
                    className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer"
                    style={{
                      background: isActive ? 'var(--cf-surface)' : 'transparent',
                      color: isActive ? 'var(--cf-text)' : 'var(--cf-text-muted)',
                      boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    }}
                  >
                    <Icon 
                      className="w-3.5 h-3.5 transition-transform" 
                      style={{ color: isActive ? sc.color : 'inherit' }} 
                    />
                    <span className="hidden sm:inline font-mono">{sc.label}</span>
                    <span className="sm:hidden font-mono">{key.toUpperCase()}</span>

                    {isActive && (
                      <motion.div
                        layoutId="activeScenarioPill"
                        className="absolute inset-0 rounded-xl border pointer-events-none"
                        style={{ borderColor: `${sc.color}60` }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Key Live Telemetry Ribbon ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-[var(--cf-border-soft)]">
            {/* Guaranteed Runway */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-faint)] block">
                Guaranteed Runway
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[var(--cf-text)]">
                  {currentScenario.runwayMonths}
                </span>
                <span className="text-xs font-mono text-[var(--cf-text-muted)]">Months</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--cf-accent)] mt-0.5 block flex items-center gap-1">
                <Shield className="w-3 h-3" /> Zero panic barrier
              </span>
            </div>

            {/* Conservative Floor */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-faint)] block">
                Conservative Floor
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-serif font-bold" style={{ color: currentScenario.color }}>
                  ${currentScenario.floor.toLocaleString()}
                </span>
                <span className="text-xs font-mono text-[var(--cf-text-muted)]">/mo</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)] mt-0.5 block">
                20th-percentile anchor
              </span>
            </div>

            {/* Tax Escrow Shield */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-faint)] block">
                Tax Escrow Shield
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[var(--cf-text)]">
                  ${currentScenario.taxProtected.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#3DE8C8] mt-0.5 block flex items-center gap-1">
                <Lock className="w-3 h-3" /> 25% Auto-Partitioned
              </span>
            </div>

            {/* Liquid Buffer Reserve */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-faint)] block">
                Liquid Panic Buffer
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-serif font-bold text-[var(--cf-text)]">
                  ${currentScenario.bufferReserve.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)] mt-0.5 block">
                Self-insuring lean dips
              </span>
            </div>
          </div>
        </div>

        {/* ── Interactive Wave Visualizer ── */}
        <div 
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          className="relative w-full h-[360px] sm:h-[420px] cursor-crosshair touch-none overflow-hidden"
          style={{ background: 'var(--cf-bg)' }}
        >
          {/* Subtle Coordinate Grid Lines */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: 'linear-gradient(to right, var(--cf-border-soft) 1px, transparent 1px), linear-gradient(to bottom, var(--cf-border-soft) 1px, transparent 1px)',
              backgroundSize: '8.33% 25%',
            }}
          />

          {/* Background Canvas Particles */}
          <canvas
            ref={canvasRef}
            width={svgW}
            height={svgH}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
          />

          {/* SVG Vector Wave & Floor */}
          <svg 
            viewBox={`0 0 ${svgW} ${svgH}`} 
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              {/* Surplus Fill Gradient */}
              <linearGradient id="cfSurplusGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3DE8C8" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#2F6F62" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#2F6F62" stopOpacity="0.0" />
              </linearGradient>

              {/* Bedrock Shield Pattern / Fill */}
              <linearGradient id="cfBedrockGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2F6F62" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#2F6F62" stopOpacity="0.04" />
              </linearGradient>

              {/* Laser Floor Glow Filter */}
              <filter id="floorLaserGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Bedrock Shield Fill (Region below the floor line) */}
            <path
              d={bedrockPath}
              fill="url(#cfBedrockGrad)"
              className="transition-all duration-700 ease-out"
            />

            {/* Main Income Volatility Area */}
            <path
              d={areaPath}
              fill="url(#cfSurplusGrad)"
              className="transition-all duration-700 ease-out"
            />

            {/* Glowing Main Curve Stroke */}
            <path
              d={linePath}
              fill="none"
              stroke="#3DE8C8"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-700 ease-out"
            />

            {/* ── THE CONSERVATIVE CASH FLOOR LASER LINE ── */}
            <g className="transition-all duration-700 ease-out">
              {/* Outer halo */}
              <line
                x1={padX}
                y1={floorY}
                x2={padX + graphW}
                y2={floorY}
                stroke={currentScenario.color}
                strokeWidth="6"
                strokeOpacity="0.25"
                filter="url(#floorLaserGlow)"
              />
              {/* Core laser beam */}
              <line
                x1={padX}
                y1={floorY}
                x2={padX + graphW}
                y2={floorY}
                stroke={currentScenario.color}
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />

              {/* Floor Marker Tag on Right */}
              <g transform={`translate(${padX + graphW - 14}, ${floorY})`}>
                <circle r="4" fill={currentScenario.color} className="animate-ping opacity-75" />
                <circle r="3" fill={currentScenario.color} />
              </g>
            </g>

            {/* Month Data Nodes */}
            {points.map((pt, i) => {
              const isBelow = pt.invoiced < currentScenario.floor;
              const isInspected = hoverIndex === i;

              return (
                <g key={pt.month} className="transition-all duration-500">
                  {/* Deficit Alert Rings for Lean Months */}
                  {isBelow && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isInspected ? "14" : "10"}
                      fill="none"
                      stroke="#FF8A70"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                      className="animate-spin opacity-80 origin-center"
                      style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                    />
                  )}

                  {/* Base Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isInspected ? "7" : (isBelow ? "5" : "4")}
                    fill={isBelow ? "#FF8A70" : (isInspected ? "#FFFFFF" : "#3DE8C8")}
                    stroke={isBelow ? "#B4573F" : "#2F6F62"}
                    strokeWidth="2"
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}

            {/* Vertical Laser Scrubber Beam when Hovering */}
            {inspectedPoint && (
              <g className="transition-all duration-150">
                <line
                  x1={inspectedPoint.x}
                  y1={padTop}
                  x2={inspectedPoint.x}
                  y2={padTop + graphH}
                  stroke="var(--cf-text)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeOpacity="0.4"
                />
                {/* Intersection beacon with floor */}
                <circle
                  cx={inspectedPoint.x}
                  cy={floorY}
                  r="5"
                  fill="none"
                  stroke={currentScenario.color}
                  strokeWidth="2"
                />
              </g>
            )}
          </svg>

          {/* ── Floor Label Badge (Positioned directly on the laser) ── */}
          <div 
            className="absolute left-6 pointer-events-none transition-all duration-700 -translate-y-1/2 flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-mono shadow-md backdrop-blur-md"
            style={{
              top: `${(floorY / svgH) * 100}%`,
              background: 'var(--cf-surface)',
              borderColor: `${currentScenario.color}60`,
              color: currentScenario.color,
            }}
          >
            <Shield className="w-3 h-3" />
            <span className="font-semibold">20th % Floor: ${currentScenario.floor.toLocaleString()}/mo</span>
            <span className="text-[9px] opacity-70 uppercase tracking-widest hidden sm:inline">· Unshakeable</span>
          </div>

          {/* ── Month Ticks Along Bottom Axis ── */}
          <div className="absolute bottom-3 inset-x-0 flex justify-between px-10 pointer-events-none">
            {points.map((pt, i) => (
              <span
                key={pt.month}
                className={`text-[10px] font-mono tracking-wider transition-colors duration-200 ${
                  hoverIndex === i ? 'text-[var(--cf-text)] font-bold scale-110' : 'text-[var(--cf-text-faint)]'
                }`}
              >
                {pt.month}
              </span>
            ))}
          </div>

          {/* ── Live Interactive Inspector Tooltip ── */}
          <AnimatePresence>
            {inspectedPoint && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-[115%]"
                style={{
                  left: `${(inspectedPoint.x / svgW) * 100}%`,
                  top: `${Math.min((inspectedPoint.y / svgH) * 100, 75)}%`,
                }}
              >
                <div 
                  className="p-3 sm:p-4 rounded-2xl border shadow-xl backdrop-blur-xl w-[90vw] max-w-[240px] sm:w-[240px]"
                  style={{
                    background: 'var(--cf-surface)',
                    borderColor: isInspectedLean ? '#FF8A70' : 'var(--cf-border)',
                    boxShadow: 'var(--cf-shadow-md)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[var(--cf-border-soft)] pb-2 mb-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--cf-text)]">
                      {inspectedPoint.month} Timeline
                    </span>
                    <span 
                      className="text-[9px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase"
                      style={{
                        background: isInspectedLean ? 'rgba(255,138,112,0.15)' : 'rgba(61,232,200,0.15)',
                        color: isInspectedLean ? '#FF8A70' : '#3DE8C8',
                      }}
                    >
                      {isInspectedLean ? 'Lean Month ⚠️' : 'Surplus Month ✓'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--cf-text-muted)]">Invoiced:</span>
                      <span className="font-semibold text-[var(--cf-text)]">
                        ${inspectedPoint.invoiced.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-[var(--cf-text-muted)]">Conservative Floor:</span>
                      <span className="font-semibold" style={{ color: currentScenario.color }}>
                        ${currentScenario.floor.toLocaleString()}
                      </span>
                    </div>

                    {isInspectedLean ? (
                      <div className="flex justify-between items-center text-[#FF8A70] pt-1 border-t border-[var(--cf-border-soft)]">
                        <span>Deficit Injected:</span>
                        <span className="font-bold">+${deficitAmount.toLocaleString()}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center text-[#3DE8C8] pt-1 border-t border-[var(--cf-border-soft)]">
                        <span>Surplus To Buffer:</span>
                        <span className="font-bold">+${surplusAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[10px] text-[var(--cf-text-faint)] pt-1">
                      <span>Safe Owner Draw:</span>
                      <span>${currentScenario.safeDraw.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Touch / Mouse Prompt (fades out on interaction) */}
          {hoverIndex === null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 right-6 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cf-surface)] border border-[var(--cf-border)] text-xs font-mono text-[var(--cf-text-muted)] shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
              <span>Hover or scrub timeline to inspect</span>
            </motion.div>
          )}
        </div>

        {/* ── Footer Strategy Explainer & Quick Action ── */}
        <div className="p-4 sm:p-6 bg-[var(--cf-surface-alt)] border-t border-[var(--cf-border-soft)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-[var(--cf-text-muted)] max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-[var(--cf-accent)]/10 flex items-center justify-center shrink-0 border border-[var(--cf-accent)]/20">
              <Shield className="w-4 h-4 text-[var(--cf-accent)]" />
            </div>
            <span>
              <strong className="text-[var(--cf-text)] font-medium">Why the 20th percentile matters:</strong> Standard budget apps average your income ($6,100/mo). When a dry spell hits ($1,950/mo), averages fail you. CashFloor budgets for reality.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all duration-200 shadow-md hover:opacity-95 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)',
              }}
            >
              <span>Test Your Real Numbers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
