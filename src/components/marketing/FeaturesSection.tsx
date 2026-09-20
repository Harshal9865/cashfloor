'use client';

import { motion } from 'framer-motion';
import { BarChart3, Shield, Zap, Globe, TrendingDown, FileText } from 'lucide-react';
import { useState } from 'react';

const features = [
  {
    icon: BarChart3,
    title: 'Conservative Floor Math',
    description: 'We use your 20th percentile income — not averages — to calculate a runway that holds even in lean cycles. Stop guessing your safety margin.',
    color: '#3DE8C8',
    visualCode: `const p20Income = calculateP20(monthlyRecords);\nif (expenses > p20Income) {\n  triggerConservationProtocol();\n}`,
  },
  {
    icon: Shield,
    title: 'Capital Partitioning',
    description: 'Auto-route gross payments into strict reserve pillars: Taxes, Buffer, Stipend, Deficits, and Growth. Never mix your tax money with your operating capital.',
    color: '#2F6F62',
    visualCode: `// Incoming $10,000 Invoice\nTax Escrow (25%) -> $2,500\nOperating Buffer -> $5,000\nOwner's Draw -> $2,500`,
  },
  {
    icon: Zap,
    title: 'Stress-Test Lab',
    description: 'Simulate losing your biggest client, a 90-day late invoice, or 3 months of $0 income in one click. See the impact before it happens.',
    color: '#C98A3E',
    visualCode: `> RUN: Client_Churn_Simulation\n> TARGET: Acme Corp (40% MRR)\n> RESULT: Runway drops to 2.4 mos.\n! WARNING: Below 3.0 mo threshold.`,
  },
  {
    icon: TrendingDown,
    title: 'Exhaustion Forecasting',
    description: 'Know your exact zero-income exhaustion date based on real burn rate and liquid reserves. The dashboard updates daily.',
    color: '#B4573F',
    visualCode: `Current Liquid Reserves: $18,400\nAvg Daily Burn Rate: $142\n---------------------------------\nZero-Income Date: Jan 18, 2026`,
  },
];

export default function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="features"
      className="relative w-full overflow-hidden bg-[var(--cf-bg)] py-24 md:py-32"
    >
      {/* Subtle horizontal divider glow */}
      <div className="absolute top-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(47,111,98,0.4), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        
        <div className="text-center mb-20 md:mb-32">
          <div className="inline-block text-[10px] uppercase tracking-widest text-[var(--cf-accent-bright)] font-mono bg-[var(--cf-accent)]/10 border border-[var(--cf-accent)]/20 px-4 py-1.5 rounded-full mb-4">
            Built for the Real Freelance Economy
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--cf-text)] tracking-tight mb-6 max-w-3xl mx-auto">
            Everything you need to{' '}
            <span className="gradient-text italic">never panic</span>
            {' '}about money
          </h2>
        </div>

        {/* Scrollytelling Layout */}
        <div className="flex flex-col lg:flex-row relative items-start gap-12 lg:gap-20">
          
          {/* Left Column: Text (Scrolling) */}
          <div className="w-full lg:w-1/2 relative pb-[50vh]">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="min-h-[50vh] flex flex-col justify-center"
                initial={{ opacity: 0.3 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: '-40% 0px -40% 0px' }}
                onViewportEnter={() => setActiveIndex(i)}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                  <f.icon className="w-7 h-7" style={{ color: f.color }} />
                </div>
                <h3 className="text-3xl md:text-4xl font-serif font-semibold text-[var(--cf-text)] mb-4 leading-snug">
                  {f.title}
                </h3>
                <p className="text-lg md:text-xl text-[var(--cf-text-muted)] leading-relaxed max-w-lg">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Visual (Sticky) */}
          <div className="hidden lg:flex w-full lg:w-1/2 sticky top-32 h-[60vh] items-center justify-center perspective-1000">
            <motion.div 
              className="relative w-full h-full max-h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-[var(--cf-border)]"
              style={{ background: 'var(--cf-surface-alt)' }}
              animate={{ 
                boxShadow: `0 20px 60px -10px ${features[activeIndex].color}40` 
              }}
              transition={{ duration: 0.8 }}
            >
              {/* Dynamic Header */}
              <div className="flex items-center gap-2 p-4 border-b border-[var(--cf-border)] bg-[var(--cf-bg)]">
                <div className="w-3 h-3 rounded-full bg-[var(--cf-caution)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--cf-warm)]" />
                <div className="w-3 h-3 rounded-full bg-[var(--cf-accent)]" />
                <div className="ml-4 font-mono text-xs text-[var(--cf-text-muted)] opacity-70">
                  terminal - {features[activeIndex].title.toLowerCase().replace(/ /g, '_')}
                </div>
              </div>

              {/* Dynamic Body */}
              <div className="p-8 font-mono text-sm md:text-base leading-relaxed text-[var(--cf-text-muted)] whitespace-pre-wrap">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <span style={{ color: features[activeIndex].color }}>$</span> {features[activeIndex].visualCode}
                </motion.div>
              </div>

              {/* Decorative Mesh background behind the code */}
              <motion.div 
                className="absolute inset-0 z-[-1] opacity-20 pointer-events-none transition-all duration-1000"
                style={{ 
                  background: `radial-gradient(circle at 80% 80%, ${features[activeIndex].color}, transparent 60%)` 
                }}
              />
            </motion.div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(47,111,98,0.4), transparent)' }} />
    </section>
  );
}
