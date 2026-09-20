'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section
      id="how-it-works"
      className="relative w-full py-32 overflow-hidden"
      style={{ background: '#060A0F' }}
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
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, #060A0F 100%)',
          }} />
      </div>

      {/* Central glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[300px] rounded-full animate-orb-pulse"
          style={{ background: 'radial-gradient(ellipse, rgba(47,111,98,0.15) 0%, transparent 70%)' }} />
      </div>

      {/* Horizontal accent lines */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(61,232,200,0.3), transparent)' }} />
      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(61,232,200,0.3), transparent)' }} />

      <div className="relative max-w-4xl mx-auto px-4 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Overline */}
          <div className="inline-block text-[10px] uppercase tracking-widest text-[#3DE8C8] font-mono bg-[#3DE8C8]/10 border border-[#3DE8C8]/20 px-4 py-1.5 rounded-full">
            Free · No Bank Login · Privacy First
          </div>

          {/* Headline */}
          <h2 className="text-5xl md:text-6xl font-serif text-white tracking-tight leading-tight">
            Your financial floor,<br />
            <span className="gradient-text italic">calculated in seconds.</span>
          </h2>

          {/* Subtext */}
          <p className="text-[#7A8B96] text-lg max-w-lg mx-auto leading-relaxed">
            Join thousands of freelancers who stopped guessing and started knowing.
            No spreadsheets. No bank surveillance. Just clarity.
          </p>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-left">
            {[
              { step: '01', label: 'Enter 12 months of invoices', desc: 'Past income and expenses, month by month' },
              { step: '02', label: 'Set your assumptions', desc: 'Tax rate, savings buffer, and scenario mode' },
              { step: '03', label: 'Know your real runway', desc: 'Conservative floor, exhaustion date, and stress tests' },
            ].map((s) => (
              <div key={s.step} className="glass-card rounded-xl p-5">
                <div className="text-[10px] font-mono text-[#3DE8C8] tracking-widest mb-2">{s.step}</div>
                <div className="text-white font-semibold text-sm mb-1 leading-tight">{s.label}</div>
                <div className="text-[#6A7D8A] text-xs leading-relaxed">{s.desc}</div>
              </div>
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
              <ArrowRight className="relative w-4 h-4 text-[#3DE8C8] group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="/blog/the-20th-percentile-math"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-all duration-200 text-[#9BAFBC]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Read: The 20th Percentile Rule
            </a>
          </div>

          {/* Fine print */}
          <p className="text-[#3A5060] text-xs">
            No signup required to get started. Create an account to save your ledger to the cloud.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
