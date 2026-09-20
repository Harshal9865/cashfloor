'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, TrendingUp, Zap } from 'lucide-react';

export default function ScrollAnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Scale and opacity transformations for the main text
  const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6], [1, 1, 0, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.5]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -100]);

  // Transform for the dashboard mockups
  const card1Y = useTransform(scrollYProgress, [0.1, 0.5], [200, 0]);
  const card1Opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  const card2Y = useTransform(scrollYProgress, [0.3, 0.7], [200, 0]);
  const card2Opacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  const card3Y = useTransform(scrollYProgress, [0.5, 0.9], [200, 0]);
  const card3Opacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-[var(--cf-bg)]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Fading Background Glow */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, var(--cf-accent-bg) 0%, transparent 60%)',
            opacity: useTransform(scrollYProgress, [0, 0.5], [0.3, 0]),
          }}
        />

        {/* Central Text that scales and fades */}
        <motion.div 
          className="relative z-10 text-center max-w-4xl px-4"
          style={{
            opacity: textOpacity,
            scale: textScale,
            y: textY,
          }}
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-[var(--cf-text)] tracking-tight leading-tight">
            Stop guessing your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-steady)] to-[var(--cf-warm)]">
              financial future.
            </span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-[var(--cf-text-muted)] font-mono">
            Scroll to see how CashFloor re-engineers certainty.
          </p>
        </motion.div>

        {/* Floating Feature Cards */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 gap-4 md:gap-8 px-4 flex-wrap max-w-6xl mx-auto">
          
          <motion.div 
            className="w-full md:w-80 p-6 rounded-3xl bg-[var(--cf-surface)] border border-[var(--cf-border)] shadow-2xl backdrop-blur-xl"
            style={{ y: card1Y, opacity: card1Opacity }}
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--cf-steady-light)] text-[var(--cf-steady)] flex items-center justify-center mb-4 border border-[var(--cf-steady)]/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[var(--cf-text)] mb-2">20th Percentile Floor</h3>
            <p className="text-sm text-[var(--cf-text-muted)]">
              We calculate your runway based on your worst months, not a naive average. You will never be caught off-guard.
            </p>
          </motion.div>

          <motion.div 
            className="w-full md:w-80 p-6 rounded-3xl bg-[var(--cf-surface)] border border-[var(--cf-border)] shadow-2xl backdrop-blur-xl"
            style={{ y: card2Y, opacity: card2Opacity }}
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--cf-warm-light)] text-[var(--cf-warm)] flex items-center justify-center mb-4 border border-[var(--cf-warm)]/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[var(--cf-text)] mb-2">6-Scenario Stress Tests</h3>
            <p className="text-sm text-[var(--cf-text-muted)]">
              Instantly simulate what happens if your biggest client churns, or if an invoice is delayed by 60 days.
            </p>
          </motion.div>

          <motion.div 
            className="w-full md:w-80 p-6 rounded-3xl bg-[var(--cf-surface)] border border-[var(--cf-border)] shadow-2xl backdrop-blur-xl"
            style={{ y: card3Y, opacity: card3Opacity }}
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] flex items-center justify-center mb-4 border border-[var(--cf-accent)]/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[var(--cf-text)] mb-2">Local-First Vault</h3>
            <p className="text-sm text-[var(--cf-text-muted)]">
              Your data stays encrypted in your browser. We never harvest your financial history. Zero surveillance.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
