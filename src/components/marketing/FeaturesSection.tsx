'use client';

import { motion } from 'framer-motion';
import { BarChart3, Shield, Zap, Globe, TrendingDown, FileText } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Conservative Floor Math',
    description: 'We use your 20th percentile income — not averages — to calculate a runway that holds even in lean cycles.',
    color: '#3DE8C8',
    delay: 0.1,
  },
  {
    icon: Shield,
    title: 'Capital Partitioning',
    description: 'Auto-route gross payments into 5 strict reserve pillars: Taxes, Buffer, Stipend, Deficits, and Growth.',
    color: '#2F6F62',
    delay: 0.2,
  },
  {
    icon: Zap,
    title: 'Stress-Test Lab',
    description: 'Simulate losing your biggest client, a 90-day late invoice, or 3 months of $0 income in one click.',
    color: '#C98A3E',
    delay: 0.3,
  },
  {
    icon: TrendingDown,
    title: 'Exhaustion Forecasting',
    description: 'Know your exact zero-income exhaustion date based on real burn rate and liquid reserves.',
    color: '#B4573F',
    delay: 0.4,
  },
  {
    icon: Globe,
    title: 'Multi-Currency',
    description: 'Live exchange rates for USD, EUR, GBP, INR, CAD, and AUD — auto-converted across all records.',
    color: '#7FCBB8',
    delay: 0.5,
  },
  {
    icon: FileText,
    title: 'Cloud Sync & Export',
    description: 'Sign in to sync your ledger across devices. Export a double-entry CSV for your accountant.',
    color: '#9B7BE8',
    delay: 0.6,
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative w-full py-28 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #080C10 0%, #060E18 50%, #080C10 100%)' }}
    >
      {/* Subtle horizontal divider glow */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(47,111,98,0.4), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-block text-[10px] uppercase tracking-widest text-[#3DE8C8] font-mono bg-[#3DE8C8]/10 border border-[#3DE8C8]/20 px-4 py-1.5 rounded-full mb-4">
            Built for the Real Freelance Economy
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white tracking-tight mb-4">
            Everything you need to{' '}
            <span className="gradient-text italic">never panic</span>
            {' '}about money
          </h2>
          <p className="text-[#7A8B96] text-lg max-w-xl mx-auto leading-relaxed">
            CashFloor replaces spreadsheet chaos with a single, conservative source of financial truth.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: f.delay, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="group relative glass-card glass-card-hover rounded-xl p-6 cursor-default transition-all duration-300"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Icon */}
              <div className="mb-4 inline-flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                <f.icon className="w-5 h-5" style={{ color: f.color }} />
              </div>

              {/* Text */}
              <h3 className="text-white font-semibold text-base mb-2 leading-snug">{f.title}</h3>
              <p className="text-[#6A7D8A] text-sm leading-relaxed">{f.description}</p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${f.color}40, transparent)` }} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(47,111,98,0.4), transparent)' }} />
    </section>
  );
}
