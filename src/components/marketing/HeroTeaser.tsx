'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import LivingFloorVisual from './LivingFloorVisual';

/* ── Animated counter ── */
function AnimatedNumber({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [target]);
  return <>{prefix}{display.toLocaleString()}{suffix}</>;
}

export default function HeroTeaser() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const { left, top } = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen overflow-hidden flex flex-col"
      style={{ background: 'var(--cf-bg)' }}
    >
      {/* ── Interactive cursor spotlight ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: useTransform(
            [smoothX, smoothY],
            ([x, y]) => `radial-gradient(700px circle at ${x}px ${y}px, var(--cf-accent-bg), transparent 75%)`
          ),
        }}
      />

      {/* ── Ambient grid ── */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      {/* ── HERO CONTENT ── */}
      <div className="relative z-10 flex-1 flex flex-col">

        {/* Top section: text copy */}
        <div className="max-w-7xl mx-auto w-full px-4 md:px-10 pt-28 pb-8">
          <div className="max-w-2xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-6 overflow-hidden relative border"
              style={{ 
                background: 'var(--cf-accent-bg)', 
                borderColor: 'var(--cf-border)' 
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--cf-accent)] dark:bg-[#3DE8C8] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-[var(--cf-accent)] dark:text-[#3DE8C8] font-semibold uppercase">
                The Freelancer&apos;s Financial Floor
              </span>
            </motion.div>

            {/* Headline — bold and clear */}
            <h1 className="font-serif tracking-tight leading-[1.06]">
              <motion.span
                className="block text-4xl sm:text-5xl md:text-[clamp(3rem,6vw,4.5rem)] text-[var(--cf-text)]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                Stop guessing
              </motion.span>
              <motion.span
                className="block text-4xl sm:text-5xl md:text-[clamp(3rem,6vw,4.5rem)] text-[var(--cf-text)]"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                how long you&apos;ll last.
              </motion.span>
              <motion.span
                className="block text-4xl sm:text-5xl md:text-[clamp(3rem,6vw,4.5rem)] gradient-text italic mt-1 sm:mt-2"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                Know your number.
              </motion.span>
            </h1>

            {/* Sub copy */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-6 text-lg md:text-xl leading-relaxed max-w-lg text-[var(--cf-text-muted)]"
            >
              CashFloor uses the <strong className="text-[var(--cf-text)] font-semibold">20th percentile</strong> of your income — not the average — to calculate a survival floor that holds even in your worst months.
            </motion.p>

            {/* Stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {[
                { icon: TrendingUp, label: '20th Percentile Math', color: 'var(--cf-accent)' },
                { icon: Zap, label: 'Instant Stress Tests', color: 'var(--cf-warm)' },
                { icon: ShieldCheck, label: 'Your data stays private', color: 'var(--cf-text-muted)' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border"
                  style={{
                    background: 'var(--cf-surface)',
                    borderColor: 'var(--cf-border)',
                    color: 'var(--cf-text-muted)',
                  }}
                >
                  <Icon className="w-3 h-3" style={{ color }} />
                  {label}
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3 mt-8"
            >
              <Link
                href="/dashboard"
                className="relative group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold overflow-hidden text-white transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)',
                  boxShadow: '0 0 0 1px rgba(47,111,98,0.5), 0 8px 32px rgba(47,111,98,0.3)',
                }}
              >
                <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative">Calculate my runway — free</span>
                <ArrowRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium transition-all duration-200 border"
                style={{
                  background: 'var(--cf-surface)',
                  borderColor: 'var(--cf-border)',
                  color: 'var(--cf-text-muted)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--cf-accent)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cf-text)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--cf-border)';
                  (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cf-text-muted)';
                }}
              >
                See how it works
              </a>
            </motion.div>

          </div>
        </div>

        {/* ── Living Floor Engine Interactive Visual ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full z-20"
        >
          <LivingFloorVisual />
        </motion.div>

        {/* ── Social proof bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="relative z-10 max-w-7xl mx-auto w-full px-4 md:px-10 pb-10"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-xs font-mono py-4 border-t"
            style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-text-faint)' }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-semibold text-[var(--cf-text)]">
                <AnimatedNumber target={4} suffix=".2" />
              </span>
              <span>avg. months runway found</span>
            </div>
            <div className="w-px h-6 bg-[var(--cf-border)] hidden md:block" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-semibold text-[var(--cf-text)]">
                <AnimatedNumber target={2400} prefix="" />
              </span>
              <span>freelancers using it</span>
            </div>
            <div className="w-px h-6 bg-[var(--cf-border)] hidden md:block" />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-semibold" style={{ color: 'var(--cf-accent)' }}>$0</span>
              <span>to get started</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-0.5 h-6 rounded-full"
          style={{ background: 'linear-gradient(180deg, var(--cf-accent), transparent)' }}
        />
      </motion.div>
    </section>
  );
}
