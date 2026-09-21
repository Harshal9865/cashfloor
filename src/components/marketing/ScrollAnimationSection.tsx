'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, TrendingUp, Zap, BarChart, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ScrollAnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Ultra-smooth physics for luxurious parallax
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 40, damping: 25, restDelta: 0.001 });

  // Parallax transforms constrained to card container bounds to prevent text collision
  const y1 = useTransform(smoothProgress, [0, 1], [40, -80]);
  const y2 = useTransform(smoothProgress, [0, 1], [60, -90]);
  const y3 = useTransform(smoothProgress, [0, 1], [20, -70]);
  const y4 = useTransform(smoothProgress, [0, 1], [50, -85]);
  
  // Subtle scaling and opacity for the center card to give a "breathing" effect
  const scaleCenter = useTransform(smoothProgress, [0.2, 0.5, 0.8], [0.96, 1.02, 0.96]);
  
  // Mouse tilt effect physics
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });
  
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    
    // Calculate relative mouse position (0 to 1)
    const relX = (clientX - left) / width;
    const relY = (clientY - top) / height;
    
    // Set 3D rotation (max 15 degrees)
    mouseX.set((relY - 0.5) * -15);
    mouseY.set((relX - 0.5) * 15);
    
    // Set glare position for holographic effect
    setGlarePosition({ x: relX * 100, y: relY * 100 });
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <section ref={containerRef} className="relative py-32 md:py-44 overflow-hidden bg-[var(--cf-bg)] border-y border-[var(--cf-border)]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--cf-accent)]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
        
        {/* Header with high-craft typography */}
        <div className="text-center mb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Algorithmic Solvency Engine</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--cf-text)] tracking-tight leading-[1.12] mb-6"
          >
            Engineered for <br />
            <span className="italic font-serif bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-600 dark:from-[#3DE8C8] dark:via-emerald-300 dark:to-[#F5C97A]">
              absolute certainty.
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-[var(--cf-text-muted)] max-w-2xl mx-auto leading-relaxed font-sans"
          >
            Interactive financial modeling that turns unpredictable freelance income into a mathematically secure runway.
          </motion.p>
        </div>

        {/* Interactive 3D Card Area */}
        <div className="relative w-full max-w-4xl h-[600px] flex items-center justify-center perspective-[2000px]">
          
          {/* Floating Element 1 */}
          <motion.div 
            style={{ y: y1 }} 
            className="absolute top-10 left-0 md:-left-10 p-4 rounded-2xl bg-[var(--cf-surface)]/80 backdrop-blur border border-[var(--cf-border)] shadow-xl hidden md:flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-[#B4573F]/20 flex items-center justify-center text-[#B4573F]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[var(--cf-text-muted)] font-mono">Tax Escrow</p>
              <p className="text-sm font-bold text-[var(--cf-text)]">Automatically Partitioned</p>
            </div>
          </motion.div>

          {/* Floating Element 2 */}
          <motion.div 
            style={{ y: y2 }} 
            className="absolute bottom-10 left-10 md:left-20 p-4 rounded-2xl bg-[var(--cf-surface)]/80 backdrop-blur border border-[var(--cf-border)] shadow-xl hidden md:flex items-center gap-3 z-20"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--cf-steady)]/20 flex items-center justify-center text-[var(--cf-steady)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[var(--cf-text-muted)] font-mono">Runway Floor</p>
              <p className="text-sm font-bold text-[var(--cf-text)]">20th Percentile Safe</p>
            </div>
          </motion.div>

          {/* Floating Element 3 */}
          <motion.div 
            style={{ y: y3 }} 
            className="absolute top-20 right-0 md:-right-10 p-4 rounded-2xl bg-[var(--cf-surface)]/80 backdrop-blur border border-[var(--cf-border)] shadow-xl hidden md:flex items-center gap-3 z-20"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--cf-warm)]/20 flex items-center justify-center text-[var(--cf-warm)]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[var(--cf-text-muted)] font-mono">Stress Test</p>
              <p className="text-sm font-bold text-[var(--cf-text)]">Client Churn Scenario</p>
            </div>
          </motion.div>

          {/* Floating Element 4 */}
          <motion.div 
            style={{ y: y4 }} 
            className="absolute bottom-32 right-10 md:right-0 p-4 rounded-2xl bg-[var(--cf-surface)]/80 backdrop-blur border border-[var(--cf-border)] shadow-xl hidden md:flex items-center gap-3 z-20"
          >
            <div className="w-10 h-10 rounded-full bg-[var(--cf-text-faint)]/20 flex items-center justify-center text-[var(--cf-text)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-[var(--cf-text-muted)] font-mono">Privacy</p>
              <p className="text-sm font-bold text-[var(--cf-text)]">Local-First Vault</p>
            </div>
          </motion.div>

          {/* The Main Interactive Holographic Card */}
          <motion.div
            style={{ 
              scale: scaleCenter,
              rotateX: mouseX,
              rotateY: mouseY,
            }}
            className="relative z-10 w-full md:w-[700px] h-[450px] rounded-[2rem] bg-[var(--cf-surface)] border border-[var(--cf-border)] p-[2px] cursor-crosshair shadow-2xl transition-shadow duration-300 hover:shadow-[0_0_80px_rgba(47,111,98,0.3)]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none">
              {/* Dynamic holographic glare effect */}
              <div 
                className="absolute inset-0 opacity-40 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 600px at ${glarePosition.x}% ${glarePosition.y}%, rgba(47,111,98,0.4), transparent 40%)`,
                  mixBlendMode: 'screen'
                }}
              />
              <div 
                className="absolute inset-0 opacity-20 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 400px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.2), transparent 40%)`,
                  mixBlendMode: 'overlay'
                }}
              />
            </div>
            
            <div className="w-full h-full rounded-[1.9rem] bg-[#0A100D] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
              {/* Decorative engineering grid */}
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }} />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(47,111,98,0.2)] relative group">
                  <div className="absolute inset-0 bg-[var(--cf-accent)] opacity-20 blur-xl group-hover:opacity-40 transition-opacity rounded-3xl" />
                  <BarChart className="w-10 h-10 text-[var(--cf-accent)] relative z-10" />
                </div>
                <h3 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  The CashFlow Engine
                </h3>
                <p className="text-[var(--cf-text-muted)] text-lg leading-relaxed mb-10 max-w-md mx-auto">
                  Runway calculated at 60fps. The engine automatically recalculates your entire financial posture on every keystroke.
                </p>
                
                <div className="flex items-center gap-6 w-full max-w-sm mx-auto p-4 rounded-2xl bg-[var(--cf-surface)]/50 border border-[var(--cf-border)] backdrop-blur-md">
                  <div className="flex-1 h-3 bg-[var(--cf-surface-alt)] rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[var(--cf-steady)] to-[#4cd964]"
                      initial={{ width: 0 }}
                      whileInView={{ width: '85%' }}
                      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} // smooth apple-like ease
                    />
                  </div>
                  <span className="font-mono text-sm text-[#4cd964] font-bold">12 Mo</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-16 text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-medium shadow-xl hover:shadow-2xl transition-all" style={{ background: 'linear-gradient(135deg, var(--cf-accent) 0%, #1a4f45 100%)' }}>
            Open the Studio <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
