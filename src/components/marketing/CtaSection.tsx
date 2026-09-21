'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section
      id="how-it-works"
      className="relative w-full py-32 overflow-hidden bg-[var(--cf-bg-deep)]"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(47,111,98,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(47,111,98,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            animation: 'grid-scroll 8s linear infinite',
          }}
        />
        {/* Radial mask to fade grid edges */}
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, var(--cf-bg-deep) 100%)',
          }} />
      </div>

      {/* Central glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[300px] rounded-full animate-orb-pulse"
          style={{ background: 'radial-gradient(ellipse, var(--cf-accent-bg) 0%, transparent 70%)' }} />
      </div>

      {/* Horizontal accent lines */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--cf-accent), transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--cf-accent), transparent)' }} />

      <div className="relative max-w-4xl mx-auto px-4 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Overline */}
          <div className="inline-block text-[10px] uppercase tracking-widest text-[var(--cf-accent-bright)] font-mono bg-[var(--cf-accent-bg)] border border-[var(--cf-accent)]/20 px-4 py-1.5 rounded-full">
            Free · No Bank Login · Privacy First
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl font-serif text-[var(--cf-text)] tracking-tight leading-tight">
            Your financial floor,<br />
            <span className="gradient-text italic">calculated in seconds.</span>
          </h2>

          {/* Subtext */}
          <p className="text-[var(--cf-text-muted)] text-lg max-w-lg mx-auto leading-relaxed">
            Join thousands of freelancers who stopped guessing and started knowing.
            No spreadsheets. No bank surveillance. Just clarity.
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 text-left">
            {[
              { step: '01', label: 'Connect Your Data', desc: 'Import a CSV from Upwork, Stripe, or your bank, or enter manually.' },
              { step: '02', label: 'Set Assumptions', desc: 'Dial in your tax rate, savings buffer, and custom scenario testing.' },
              { step: '03', label: 'Know Your Runway', desc: 'Get your conservative financial floor and exact zero-income date.' },
            ].map((s, i) => (
              <motion.div 
                key={s.step} 
                className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                style={{
                  background: 'var(--cf-surface)',
                  border: '1px solid var(--cf-border)',
                  boxShadow: 'var(--cf-shadow-sm)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ 
                  boxShadow: '0 20px 40px -10px rgba(47,111,98,0.2)',
                  borderColor: 'var(--cf-accent)' 
                }}
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--cf-accent-bg)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="relative z-10 flex items-center justify-between mb-4">
                  <div className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text-muted)] group-hover:text-[var(--cf-accent)] group-hover:border-[var(--cf-accent)]/30 transition-colors">
                    {s.step}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] group-hover:bg-[var(--cf-accent)] group-hover:border-[var(--cf-accent)] flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--cf-text-faint)] group-hover:text-[var(--cf-bg)] transition-colors" />
                  </div>
                </div>
                <div className="relative z-10 text-[var(--cf-text)] font-serif text-lg font-bold mb-2 leading-tight group-hover:text-[var(--cf-accent)] transition-colors">
                  {s.label}
                </div>
                <div className="relative z-10 text-[var(--cf-text-muted)] text-sm leading-relaxed">
                  {s.desc}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/dashboard"
              className="relative group inline-flex items-center justify-center gap-2.5 px-10 py-4 rounded-full text-base font-semibold overflow-hidden transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)',
                boxShadow: '0 0 0 1px rgba(47,111,98,0.5), 0 12px 40px rgba(47,111,98,0.35)',
              }}
            >
              <span className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-white">Start for Free</span>
              <ArrowRight className="relative w-4 h-4 text-[var(--cf-accent-bright)] group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="/blog/the-20th-percentile-math"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-all duration-200 text-[var(--cf-text-muted)] border border-[var(--cf-border)] bg-[var(--cf-surface)]/40 hover:border-[var(--cf-accent)]/40 hover:text-[var(--cf-text)]"
            >
              Read: The 20th Percentile Rule
            </a>
          </div>

          {/* Fine print */}
          <p className="text-[var(--cf-text-faint)] text-xs">
            No signup required to get started. Create an account to save your ledger to the cloud.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
