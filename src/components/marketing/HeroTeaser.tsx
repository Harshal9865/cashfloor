'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

/* ── Floating particle dot ── */
function Particle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: '10%',
        background: `radial-gradient(circle, rgba(61,232,200,0.8), rgba(47,111,98,0.2))`,
        animation: `particle-drift ${6 + delay}s ${delay}s ease-in-out infinite`,
      }}
    />
  );
}

/* ── Animated counter ── */
function AnimatedNumber({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

/* ── 3D Tilt Card ── */
function TiltCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const ySpring = useSpring(y, { stiffness: 200, damping: 25 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ['12deg', '-12deg']);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ['-12deg', '12deg']);
  const glossX = useTransform(xSpring, [-0.5, 0.5], ['0%', '100%']);
  const glossY = useTransform(ySpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="perspective-1500 w-full max-w-lg mx-auto lg:mx-0">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Gloss overlay */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(circle at ${glossX} ${glossY}, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Card body */}
        <div
          className="relative p-6"
          style={{
            background: 'linear-gradient(145deg, #0E1A24 0%, #091219 60%, #0A1520 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(47,111,98,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {/* Top chrome bar */}
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/8">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#B4573F]/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#C98A3E]/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#2F6F62]/70" />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[#4A6070] uppercase">
              Live Simulation
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DE8C8] animate-pulse" />
              <span className="text-[10px] font-mono text-[#3DE8C8]">Synced</span>
            </div>
          </div>

          {/* Runway hero metric */}
          <div className="text-center mb-6">
            <div className="inline-block text-[9px] uppercase tracking-widest text-[#3DE8C8] bg-[#3DE8C8]/10 border border-[#3DE8C8]/20 px-3 py-1 rounded-full font-mono mb-3">
              Conservative Survival Horizon
            </div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#4A6070] mb-2">
              Zero-Income Exhaustion Date
            </div>
            <div className="text-5xl font-serif text-white tracking-tight leading-none mb-1" style={{ textShadow: '0 0 40px rgba(61,232,200,0.15)' }}>
              Nov 18, 2025
            </div>
            <div className="text-xs font-mono text-[#4A6070]">
              <AnimatedNumber target={4} suffix=" mo buffer" /> · <AnimatedNumber prefix="$" target={3300} suffix="/mo floor" />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: 'Daily Burn', value: '$76', color: '#C98A3E' },
              { label: 'Tax Reserve', value: '25%', color: '#2F6F62' },
              { label: 'P20 Floor', value: '$3.3k', color: '#3DE8C8' },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-lg p-2.5 text-center">
                <div className="text-[9px] font-mono uppercase tracking-wider text-[#4A6070] mb-1">{s.label}</div>
                <div className="text-sm font-mono font-semibold" style={{ color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Mini chart */}
          <div className="relative h-14 overflow-hidden rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="w-full h-full">
              {/* Fill */}
              <motion.path
                d="M0,35 Q20,20 40,22 T80,15 T120,18 T160,8 T200,5 L200,40 L0,40 Z"
                fill="url(#grad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />
              {/* Line */}
              <motion.path
                d="M0,35 Q20,20 40,22 T80,15 T120,18 T160,8 T200,5"
                fill="none"
                stroke="#3DE8C8"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
              />
              {/* Floor line */}
              <line x1="0" y1="28" x2="200" y2="28" stroke="#2F6F62" strokeWidth="0.8" strokeDasharray="4 3" opacity="0.5" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3DE8C8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3DE8C8" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/8 text-[10px] font-mono">
            <span className="text-[#4A6070]">Audited · Balanced</span>
            <span className="text-[#3DE8C8] font-semibold">20th Percentile Safe ✓</span>
          </div>
        </div>

        {/* 3D depth shadow layer */}
        <div
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{
            transform: 'translateZ(-8px)',
            background: 'linear-gradient(135deg, rgba(47,111,98,0.2), transparent)',
          }}
        />
      </motion.div>
    </div>
  );
}

const WORDS = ['Know', 'your', 'numbers.', 'Not', 'the', 'average.'];

export default function HeroTeaser() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    delay: (i * 0.7) % 5,
    x: (i * 13 + 7) % 90,
    size: 2 + (i % 3),
  }));

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #080C10 0%, #0A1018 40%, #060E14 100%)' }}>

      {/* ── Ambient orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full animate-orb-pulse"
          style={{ background: 'radial-gradient(circle, rgba(47,111,98,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full animate-orb-pulse"
          style={{ background: 'radial-gradient(circle, rgba(61,232,200,0.08) 0%, transparent 70%)', animationDelay: '3s' }} />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full animate-float-medium"
          style={{ background: 'radial-gradient(circle, rgba(201,138,62,0.06) 0%, transparent 70%)', animationDelay: '1.5s' }} />
      </div>

      {/* ── Grid lines (subtle) ── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }} />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => <Particle key={i} {...p} />)}
      </div>

      {/* ── Main content ── */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-10 pt-28 pb-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left copy ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-7"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full w-fit overflow-hidden"
              style={{
                background: 'rgba(47,111,98,0.15)',
                border: '1px solid rgba(47,111,98,0.35)',
              }}
            >
              {/* Badge shine sweep */}
              <span className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                <span className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ animation: 'badge-shine 3s 1s ease-in-out infinite', left: '-100%' }} />
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DE8C8] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-[#3DE8C8] uppercase">
                The Freelancer&apos;s Edge
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl leading-[1.04] tracking-tight font-serif">
              <motion.span
                className="block text-white"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                Stop guessing
              </motion.span>
              <motion.span
                className="block text-white"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                your runway.
              </motion.span>
              <motion.span
                className="block gradient-text italic"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                Know your numbers.
              </motion.span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg text-[#7A8B96] leading-relaxed max-w-lg"
            >
              A professional ledger for irregular income. Calculate your conservative survival floor,
              auto-partition reserves, and stress-test cash flow before disaster strikes.
            </motion.p>

            {/* Stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { icon: TrendingUp, label: '20th Percentile Math', color: '#3DE8C8' },
                { icon: Zap, label: 'Instant Stress Tests', color: '#C98A3E' },
                { icon: ShieldCheck, label: '100% Client-Side', color: '#2F6F62' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color }}>
                  <Icon className="w-3 h-3" />
                  <span className="text-[#9BAFBC]">{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95 }}
              className="flex flex-col sm:flex-row gap-3 pt-1"
            >
              <Link
                href="/dashboard"
                className="relative group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold overflow-hidden transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)',
                  boxShadow: '0 0 0 1px rgba(47,111,98,0.5), 0 8px 32px rgba(47,111,98,0.3)',
                }}
              >
                <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative text-white">Enter the Ledger</span>
                <ArrowRight className="relative w-4 h-4 text-[#3DE8C8] group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <a
                href="/blog/the-20th-percentile-math"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#9BAFBC',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              >
                How It Works
              </a>
            </motion.div>

            {/* Trust line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex items-center gap-2 text-[#4A6070] text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#2F6F62]" />
              <span>Zero server ingestion. No bank logins. Privacy by design.</span>
            </motion.div>
          </motion.div>

          {/* ── Right 3D card ── */}
          <TiltCard />
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-mono tracking-widest text-[#3A5060] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-0.5 h-6 rounded-full"
            style={{ background: 'linear-gradient(180deg, #2F6F62, transparent)' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
