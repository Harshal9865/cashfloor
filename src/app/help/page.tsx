'use client';

import React from 'react';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';
import Link from 'next/link';
import { 
  HelpCircle, 
  Mail, 
  BookOpen, 
  FileSpreadsheet, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HelpPage() {
  const FAQS = [
    {
      q: 'How does CashFloor parse my bank statement CSV?',
      a: 'Our universal parser processes your statement 100% locally in your browser. It automatically detects dates, transaction descriptions, single-amount or dual-column credits/debits, and currency symbols ($ , € , £ , ₹ , C$ , A$), aggregating deposits into monthly cash flow bins without any data leaving your device.'
    },
    {
      q: 'What is the 20th Percentile (P20) cash floor?',
      a: 'Rather than misleading you with an "average" income that masks dry cycles, the 20th percentile calculates the empirical baseline revenue your business historically matched or exceeded in 80% of all operating cycles. Budgeting personal draws against this baseline guarantees structural solvency.'
    },
    {
      q: 'How do I backup my ledger across my phone and laptop?',
      a: 'Click "Sign In" in the navigation bar to enable automatic encrypted cloud sync powered by Supabase. Your workspace will seamlessly mirror across all your devices in real time with Row-Level Security.'
    },
    {
      q: 'Can I export my double-entry ledger for my CPA?',
      a: 'Yes. At any time in the Studio Dashboard, click "Export CSV" to download a complete, audit-grade financial spreadsheet containing your historical receipts, tax escrow balances, buffer allocations, and runway horizons.'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--cf-bg)] flex flex-col font-sans transition-colors duration-300">
      <MarketingNav />
      
      <main className="flex-1 flex flex-col items-center justify-start pt-6 pb-24 px-4 sm:px-6 md:px-8 relative z-10 overflow-hidden">
        {/* Ambient background glow */}
        <div 
          className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[140px] opacity-15 pointer-events-none" 
          style={{ background: 'radial-gradient(circle, var(--cf-accent) 0%, transparent 70%)' }} 
        />

        <div className="w-full max-w-5xl mx-auto space-y-16 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>CashFloor Knowledge &amp; Support Hub</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[var(--cf-text)]"
            >
              How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-accent)] to-emerald-500">help you?</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-base text-[var(--cf-text-muted)] leading-relaxed font-sans"
            >
              Explore our mathematical documentation, learn how to calibrate your cash floor, or connect with our financial advisory research desk.
            </motion.p>
          </div>

          {/* Quick Action Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <HelpCard 
              icon={<BookOpen className="w-6 h-6 text-emerald-600" />}
              title="Mathematical Journal &amp; Guides"
              description="Read our 7 in-depth financial engineering guides covering P20 formulas, quarterly tax escrow, S-Corp draws, and FX haircuts."
              actionText="Browse Guides"
              href="/blog"
            />
            <HelpCard 
              icon={<FileSpreadsheet className="w-6 h-6 text-emerald-600" />}
              title="Studio Runway Dashboard"
              description="Jump directly into your live workspace to paste your monthly invoices, import statements, and stress-test contract loss."
              actionText="Open Workspace"
              href="/dashboard"
            />
            <HelpCard 
              icon={<Layers className="w-6 h-6 text-emerald-600" />}
              title="Universal Bank Integrations"
              description="Learn how to export and sync transactions from Mercury, Chase, Wise, Stripe, PayPal, Upwork, and spreadsheets."
              actionText="View Integrations"
              href="/integrations"
            />
            <HelpCard 
              icon={<Mail className="w-6 h-6 text-emerald-600" />}
              title="Direct Advisory &amp; Support Desk"
              description="Have questions regarding an edge case or multi-currency ledger setup? Reach out directly to our engineering team."
              actionText="Contact Support"
              href="mailto:support@cashfloor.app"
              isExternal
            />
          </motion.div>

          {/* Frequently Asked Questions */}
          <div className="space-y-6 pt-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-serif font-bold text-[var(--cf-text)]">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-[var(--cf-text-muted)]">
                Everything you need to know about CashFloor’s client-side financial engine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAQS.map((faq, idx) => (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-2.5 shadow-sm hover:border-[var(--cf-accent)]/40 transition-colors"
                >
                  <h3 className="text-sm font-serif font-bold text-[var(--cf-text)]">
                    {faq.q}
                  </h3>
                  <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function HelpCard({ 
  icon, 
  title, 
  description, 
  actionText, 
  href, 
  isExternal 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  actionText: string; 
  href: string;
  isExternal?: boolean;
}) {
  const content = (
    <div className="p-7 rounded-3xl bg-[var(--cf-surface)] border border-[var(--cf-border)] flex flex-col justify-between gap-5 shadow-sm hover:shadow-xl hover:border-[var(--cf-accent)]/50 transition-all duration-300 group h-full">
      <div className="space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[var(--cf-surface-alt)] flex items-center justify-center border border-[var(--cf-border-soft)] group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <h3 className="text-lg font-serif font-bold text-[var(--cf-text)] group-hover:text-[var(--cf-accent)] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
          {description}
        </p>
      </div>

      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cf-accent)] group-hover:translate-x-1 transition-transform">
        <span>{actionText}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} className="block h-full focus:outline-none">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="block h-full focus:outline-none">
      {content}
    </Link>
  );
}
