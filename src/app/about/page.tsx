import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';
import CashFloorLogo from '@/components/CashFloorLogo';
import { 
  ShieldCheck, 
  TrendingUp, 
  Lock, 
  Database, 
  Cpu, 
  ArrowRight, 
  FileSpreadsheet, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Scale,
  Building2,
  Users,
  Compass,
  ArrowDown
} from 'lucide-react';

import P20InteractiveSandbox from '@/components/about/P20InteractiveSandbox';

export const metadata: Metadata = {
  title: 'About & Methodology | The Sovereign Financial Manifesto',
  description: 'Learn why CashFloor was built: empirical 20th-percentile cash flow engineering, zero bank surveillance, and the 5-pillar capital partition system.',
};

export default function AboutPage() {
  const PILLARS = [
    {
      num: '01',
      title: 'Tax Escrow Escrow Vault',
      pct: '25% - 30%',
      desc: 'The second an invoice payment clears, your quarterly estimated tax percentage is immediately partitioned. You never treat pre-tax business receipts as personal liquidity.',
      color: '#C98A3E',
    },
    {
      num: '02',
      title: 'Survival Floor Paycheck',
      pct: 'Fixed Monthly Draw',
      desc: 'Calculated strictly against your empirical 20th-percentile income. Covers essential living expenses, rent, groceries, and healthcare even during seasonal dry spells.',
      color: '#2F6F62',
    },
    {
      num: '03',
      title: 'Liquid Runway Buffer',
      pct: '3.5 - 6 Months',
      desc: 'Maintained in ultra-safe high-yield cash equivalents. Protects your studio against sudden client churn, 60-day invoice delays, and unexpected health emergencies.',
      color: '#3DE8C8',
    },
    {
      num: '04',
      title: 'Studio Reinvestment',
      pct: '10% - 15%',
      desc: 'Reserved for specialized software tooling, continuing education, hardware upgrades, and subcontractors needed to scale your consulting rate.',
      color: '#6366F1',
    },
    {
      num: '05',
      title: 'Sovereign Wealth',
      pct: 'Surplus Capital',
      desc: 'Permanent capital compounding in tax-advantaged accounts (Solo 401k, SEP-IRA, index funds). Only funded when the liquid runway buffer is 100% full.',
      color: '#10B981',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300 font-sans flex flex-col">
      <MarketingNav />

      <main className="flex-1 pt-32 pb-24 px-4 sm:px-6 md:px-8 max-w-6xl mx-auto w-full space-y-24 relative overflow-hidden">
        {/* Ambient background glow */}
        <div 
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[140px] opacity-15 pointer-events-none" 
          style={{ background: 'radial-gradient(circle, var(--cf-accent) 0%, transparent 70%)' }} 
        />

        {/* ── 1. Hero / Manifesto Header ── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Sovereign Financial Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[var(--cf-text)] leading-tight">
            Stop budgeting on hope. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-accent)] to-emerald-500">
              Engineer for survival.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--cf-text-muted)] leading-relaxed max-w-2xl mx-auto font-sans">
            Traditional consumer finance apps were designed for salaried W-2 employees with predictable bi-weekly paychecks. Freelancers and consultants operate under high variance. CashFloor provides mathematical certainty for irregular income.
          </p>
        </section>

        {/* ── 2. The Core Problems We Solve ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="p-7 rounded-3xl bg-[var(--cf-surface)] border border-[var(--cf-border)] space-y-4 shadow-sm hover:border-[var(--cf-accent)]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--cf-text)]">
              The Average Income Illusion
            </h3>
            <p className="text-xs sm:text-sm text-[var(--cf-text-muted)] leading-relaxed">
              If you invoice $12,000 in December and $2,000 in January, your average is $7,000. If you budget spending $7,000 every month, you face cash crunches during dry spells. CashFloor replaces crude averages with statistical 20th-percentile floors.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[var(--cf-surface)] border border-[var(--cf-border)] space-y-4 shadow-sm hover:border-[var(--cf-accent)]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--cf-text)]">
              The Surveillance Economy
            </h3>
            <p className="text-xs sm:text-sm text-[var(--cf-text-muted)] leading-relaxed">
              Modern fintech tools demand bank passwords, harvest transaction histories, and sell credit telemetry to third-party data brokers. CashFloor executes 100% locally in your browser with zero telemetry and zero third-party logins.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-[var(--cf-surface)] border border-[var(--cf-border)] space-y-4 shadow-sm hover:border-[var(--cf-accent)]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[var(--cf-text)]">
              April Tax Panic
            </h3>
            <p className="text-xs sm:text-sm text-[var(--cf-text-muted)] leading-relaxed">
              Freelancers frequently get caught off guard by quarterly IRS vouchers and self-employment tax. CashFloor partitions tax obligations the moment funds clear, ensuring you are always liquid when tax deadlines arrive.
            </p>
          </div>
        </section>

        {/* ── 3. The 20th Percentile Mathematical Rule ── */}
        <section className="p-8 sm:p-12 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-8 shadow-md">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--cf-accent)] font-semibold flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Empirical Quantitative Solvency
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--cf-text)]">
              The 20th-Percentile (P20) Baseline
            </h2>
            <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed">
              In probability theory and financial risk management, the 20th percentile identifies the threshold that historical cash flow exceeded in <strong>80% of all recorded periods</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--cf-border-soft)]">
            <div className="p-6 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] space-y-3">
              <span className="text-xs font-mono text-red-500 uppercase tracking-wider font-semibold block">
                ✕ The Naive Approach
              </span>
              <div className="font-serif text-lg font-bold text-[var(--cf-text)]">
                &quot;I average $8,500/mo, so I can spend $6,500/mo.&quot;
              </div>
              <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
                Fails immediately when an enterprise client delays an invoice by 45 days, creating temporary artificial insolvency and forcing high-interest credit card debt.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--cf-surface-alt)] border border-emerald-500/30 space-y-3">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-semibold block">
                ✓ The CashFloor Approach
              </span>
              <div className="font-serif text-lg font-bold text-[var(--cf-text)]">
                &quot;My 20th-percentile floor is $3,200/mo. All surplus builds buffer.&quot;
              </div>
              <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
                Personal living expenses are budgeted strictly within the baseline floor. Every dollar earned above the floor automatically funds tax escrow and multi-month buffer reserves.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3b. Interactive P20 Methodology Sandbox ── */}
        <section className="relative z-10">
          <P20InteractiveSandbox />
        </section>

        {/* ── 4. The 5-Pillar Capital Partition Architecture ── */}
        <section className="space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--cf-accent)] font-semibold">
              System Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--cf-text)]">
              The 5-Pillar Capital Partition
            </h2>
            <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed">
              Every invoice payment that clears into your business account is immediately divided into five purposeful compartments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PILLARS.map((p) => (
              <div
                key={p.num}
                className="p-6 rounded-3xl bg-[var(--cf-surface)] border border-[var(--cf-border)] flex flex-col justify-between gap-4 shadow-sm hover:border-[var(--cf-accent)]/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold" style={{ color: p.color }}>
                      Pillar {p.num}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text-muted)]">
                      {p.pct}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[var(--cf-text)]">
                    {p.title}
                  </h4>
                  <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. Zero-Surveillance Pledge ── */}
        <section className="p-8 sm:p-12 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[var(--cf-text)]">
                Our Zero-Surveillance Pledge
              </h3>
              <p className="text-xs font-mono text-emerald-700 dark:text-emerald-300">
                Local-First · Zero Plaid · Zero Data Resale
              </p>
            </div>
          </div>

          <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed max-w-3xl">
            We believe your cash flow, invoice rates, and personal savings are sovereign business intelligence. CashFloor was engineered so that you can copy-paste CSV rows or enter invoice records without transmitting your credentials to external servers. If you choose our encrypted cloud backup, your data is isolated with PostgreSQL Row-Level Security and AES-256 encryption.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2 text-[var(--cf-text)]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              No Bank Login Screens
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Works 100% Offline
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Export Clean CSV Anytime
            </span>
          </div>
        </section>

        {/* ── 6. Direct CTA ── */}
        <section className="text-center space-y-6 pt-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--cf-text)]">
            Ready to calculate your true cash floor?
          </h2>
          <p className="text-sm text-[var(--cf-text-muted)] max-w-md mx-auto leading-relaxed">
            Calibrate your survival floor in under 60 seconds. No credit card, no bank logins, zero surveillance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-xs font-semibold text-white transition-all shadow-lg hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Studio Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-mono border border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors"
            >
              <span>Read Quantitative Guides</span>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
