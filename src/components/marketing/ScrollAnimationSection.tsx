'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ScrollAnimationSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // The container is 400vh tall. We start animation when the top hits the top of viewport,
    // and end when the bottom hits the bottom of viewport.
    offset: ['start start', 'end end'],
  });

  // We want to translate the horizontal track from 0% to -66.66% 
  // (since we have 3 screens, and 1 screen is always visible, we move by 2 screens)
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.6666%']);

  // Parallax background elements
  const bgMove = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-[var(--cf-bg)]">
      {/* Sticky container that holds the viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        
        {/* Subtle dynamic background */}
        <motion.div 
          className="absolute inset-0 z-0 opacity-30 pointer-events-none"
          style={{ 
            background: 'radial-gradient(ellipse at center, var(--cf-accent-bg) 0%, transparent 70%)',
            x: bgMove 
          }}
        />

        {/* Horizontal Scrolling Track */}
        <motion.div 
          className="relative z-10 flex w-[300vw] h-full"
          style={{ x }}
        >
          {/* Vignette 1: The Intro */}
          <div className="w-[100vw] h-full shrink-0 flex flex-col items-center justify-center px-4 md:px-20 relative">
            <div className="max-w-4xl text-center">
              <h2 className="font-serif text-5xl md:text-7xl font-bold text-[var(--cf-text)] tracking-tight leading-tight mb-6">
                Stop guessing your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-steady)] to-[var(--cf-warm)]">
                  financial future.
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-[var(--cf-text-muted)] font-mono max-w-2xl mx-auto">
                Scroll to see how CashFloor re-engineers certainty through conservative math and automated stress testing.
              </p>
              <div className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--cf-border)] bg-[var(--cf-surface)]/50 text-[var(--cf-text-faint)] text-sm animate-pulse">
                Scroll down to explore <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Vignette 2: The Core Tech */}
          <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-4 md:px-20 relative">
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="p-8 md:p-12 rounded-[2rem] border border-[var(--cf-border)] bg-[var(--cf-surface)]/60 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--cf-steady)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="w-14 h-14 rounded-2xl bg-[var(--cf-steady-light)] text-[var(--cf-steady)] flex items-center justify-center mb-6 border border-[var(--cf-steady)]/20 shadow-lg">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-4xl font-bold text-[var(--cf-text)] mb-4">The 20th Percentile Floor</h3>
                  <p className="text-lg text-[var(--cf-text-muted)] leading-relaxed">
                    We calculate your runway based on your worst months, not a naive average. By automatically partitioning your taxes and buffer, you will never be caught off-guard by a slow month.
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2 flex flex-col justify-center">
                <h2 className="font-serif text-5xl md:text-6xl font-bold text-[var(--cf-text)] tracking-tight mb-6">
                  Engineered for <br /><span className="text-[var(--cf-steady)] italic">resilience.</span>
                </h2>
                <p className="text-xl text-[var(--cf-text-muted)] leading-relaxed">
                  Traditional budgeting fails when income is irregular. We built a mathematical engine specifically for the volatility of freelance cash flow.
                </p>
              </div>
            </div>
          </div>

          {/* Vignette 3: The Lab & Privacy */}
          <div className="w-[100vw] h-full shrink-0 flex items-center justify-center px-4 md:px-20 relative">
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col justify-center">
                <h2 className="font-serif text-5xl md:text-6xl font-bold text-[var(--cf-text)] tracking-tight mb-6">
                  Stress test reality.<br /><span className="text-[var(--cf-warm)] italic">Zero surveillance.</span>
                </h2>
                <p className="text-xl text-[var(--cf-text-muted)] leading-relaxed mb-8">
                  Instantly simulate what happens if your biggest client churns or an invoice is delayed by 60 days. All calculated locally in your browser.
                </p>
                <Link href="/dashboard" className="inline-flex items-center gap-2 w-max px-8 py-4 rounded-full text-white font-medium shadow-xl hover:shadow-2xl transition-all bg-[var(--cf-text)] hover:bg-[var(--cf-text-faint)]">
                  Launch the Lab <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex flex-col gap-6">
                <div className="p-8 rounded-[2rem] border border-[var(--cf-border)] bg-[var(--cf-surface)]/60 backdrop-blur-2xl shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--cf-warm)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:scale-110" />
                  <div className="w-12 h-12 rounded-xl bg-[var(--cf-warm-light)] text-[var(--cf-warm)] flex items-center justify-center mb-4 border border-[var(--cf-warm)]/20 shadow-md">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[var(--cf-text)] mb-2">6-Scenario Stress Tests</h3>
                  <p className="text-[var(--cf-text-muted)]">
                    Visualize the impact of catastrophic events before they happen.
                  </p>
                </div>
                <div className="p-8 rounded-[2rem] border border-[var(--cf-border)] bg-[var(--cf-surface)]/60 backdrop-blur-2xl shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--cf-accent)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:scale-110" />
                  <div className="w-12 h-12 rounded-xl bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] flex items-center justify-center mb-4 border border-[var(--cf-accent)]/30 shadow-md">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[var(--cf-text)] mb-2">Local-First Vault</h3>
                  <p className="text-[var(--cf-text-muted)]">
                    Your data stays encrypted. We never harvest your financial history.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
