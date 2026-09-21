'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Building2,
  Globe,
  FileSpreadsheet,
  Check,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
  HelpCircle,
  Upload,
  Lock,
  Zap
} from 'lucide-react';
import MarketingNav from '@/components/MarketingNav';

interface IntegrationTool {
  id: string;
  name: string;
  category: 'Payments' | 'Banking' | 'Freelance Platforms' | 'Accounting';
  logoText: string;
  badge: string;
  description: string;
  howItWorks: string;
  syncFrequency: string;
  status: 'available' | 'connected' | 'coming_soon';
  color: string;
}

const INTEGRATIONS: IntegrationTool[] = [
  {
    id: 'stripe',
    name: 'Stripe & Stripe Invoicing',
    category: 'Payments',
    logoText: 'S',
    badge: 'Direct Payout Sync',
    description: 'Pulls cleared customer invoices and platform payouts directly into your daily cash stream.',
    howItWorks: 'Every Stripe payout automatically triggers CashFloor’s 5-pillar partition: 25% tax escrow is locked away before you can overspend.',
    syncFrequency: 'Real-Time Webhook',
    status: 'connected',
    color: '#635BFF',
  },
  {
    id: 'mercury',
    name: 'Mercury & Relay Financial',
    category: 'Banking',
    logoText: 'M',
    badge: 'Business Checking',
    description: 'Syncs your real-time liquid operating balance and ACH wire deposits with zero bank surveillance.',
    howItWorks: 'Reads end-of-day checking balances to compute your exact zero-income exhaustion countdown.',
    syncFrequency: 'Daily Nightly Sync',
    status: 'available',
    color: '#0A85EA',
  },
  {
    id: 'upwork',
    name: 'Upwork, Fiverr & Deel',
    category: 'Freelance Platforms',
    logoText: 'U',
    badge: 'Escrow Milestone Feeds',
    description: 'Imports funded milestone contracts and international contractor payouts.',
    howItWorks: 'Models Net-14 platform security delays to ensure pending earnings don’t artificially inflate immediate living draws.',
    syncFrequency: 'On Milestone Release',
    status: 'available',
    color: '#14A800',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks & Xero',
    category: 'Accounting',
    logoText: 'Q',
    badge: 'Two-Way Reconciliation',
    description: 'Export clean double-entry journal entries directly to your CPA at tax time.',
    howItWorks: 'QuickBooks is historical (what you spent). CashFloor is forward-looking (how long you survive). Together, they give total financial control.',
    syncFrequency: 'Monthly Export',
    status: 'available',
    color: '#2CA01C',
  },
  {
    id: 'wise',
    name: 'Wise (TransferWise) & PayPal',
    category: 'Payments',
    logoText: 'W',
    badge: 'Global FX Wires',
    description: 'Multi-currency conversion for foreign client contracts (USD, EUR, GBP, CAD, AUD).',
    howItWorks: 'Normalizes foreign invoices into your home currency baseline using live exchange rate buffers.',
    syncFrequency: 'On Payout',
    status: 'available',
    color: '#00B9FF',
  },
];

export default function IntegrationsPage() {
  const [connectedState, setConnectedState] = useState<Record<string, boolean>>({
    stripe: true,
    mercury: false,
    upwork: false,
    quickbooks: false,
    wise: false,
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleConnect = (id: string, name: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setConnectedState(prev => {
        const isNowConnected = !prev[id];
        if (isNowConnected) {
          setToastMessage(`Successfully connected to ${name}!`);
          setTimeout(() => setToastMessage(null), 3000);
        }
        return { ...prev, [id]: isNowConnected };
      });
      setSyncingId(null);
    }, 1200);
  };

  const filtered = activeCategory === 'all' 
    ? INTEGRATIONS 
    : INTEGRATIONS.filter(t => t.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300">
      <MarketingNav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 pt-28 pb-20 space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <span className="text-xs font-mono text-[var(--cf-text-faint)]">
            Ecosystem Integrations &amp; Payment Feeds
          </span>
        </div>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-24 left-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--cf-surface)] border border-[var(--cf-accent)] shadow-[0_8px_32px_var(--cf-accent-glow)] text-[var(--cf-text)] font-semibold text-sm"
            >
              <Check className="w-5 h-5 text-[var(--cf-accent)]" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono bg-[var(--cf-accent-bg)] border-[var(--cf-accent)]/20 text-[var(--cf-accent)]">
            <Zap className="w-3.5 h-3.5" />
            <span>Unified Payment Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-serif font-semibold tracking-tight text-[var(--cf-text)] leading-[1.12]">
            Connect the tools you already use to get paid.
          </h1>

          <p className="text-base sm:text-lg text-[var(--cf-text-muted)] max-w-2xl mx-auto leading-relaxed">
            QuickBooks tells you what you spent last month. Mercury holds your cash today. CashFloor is the <strong className="text-[var(--cf-text)]">forward-looking survival brain</strong> that tells you how long you survive if clients freeze payments.
          </p>
        </div>

        {/* ── Category Filter Pills ── */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Tools' },
            { id: 'payments', label: 'Stripe & PayPal' },
            { id: 'banking', label: 'Business Banking' },
            { id: 'freelance', label: 'Upwork & Platforms' },
            { id: 'accounting', label: 'Accounting / CPA' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                activeCategory === cat.id
                  ? 'bg-[var(--cf-surface)] border-[var(--cf-accent)] text-[var(--cf-text)] font-semibold shadow-sm'
                  : 'bg-[var(--cf-surface-alt)] border-[var(--cf-border-soft)] text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Integrations Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(tool => {
            const isConnected = connectedState[tool.id];
            const isSyncing = syncingId === tool.id;

            return (
              <motion.div
                key={tool.id}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="rounded-3xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative overflow-hidden"
                style={{
                  background: 'var(--cf-surface)',
                  borderColor: isConnected ? 'var(--cf-accent)' : 'var(--cf-border)',
                  boxShadow: isConnected 
                    ? '0 0 0 1px var(--cf-accent), 0 8px 32px var(--cf-accent-glow)' 
                    : 'var(--cf-shadow-sm)',
                }}
              >
                {/* Glowing Background Overlay when connected */}
                {isConnected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--cf-accent-glow)] to-transparent pointer-events-none opacity-20" />
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-md text-base"
                        style={{ background: tool.color }}
                      >
                        {tool.logoText}
                      </div>
                      <div>
                        <h2 className="text-base font-serif font-bold text-[var(--cf-text)]">
                          {tool.name}
                        </h2>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-faint)]">
                          {tool.category} · {tool.badge}
                        </span>
                      </div>
                    </div>

                    <span 
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                        isConnected
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] border-[var(--cf-border-soft)]'
                      }`}
                    >
                      {isConnected ? 'Connected ✓' : 'Ready to Connect'}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--cf-text)] mb-3 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] text-[11px] text-[var(--cf-text-muted)] leading-relaxed space-y-1">
                    <strong className="text-[var(--cf-text)] block font-mono text-[10px] uppercase tracking-wider">
                      How CashFloor Uses This:
                    </strong>
                    <span>{tool.howItWorks}</span>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-[var(--cf-border-soft)] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[var(--cf-text-faint)]">
                    Sync: {tool.syncFrequency}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleConnect(tool.id, tool.name)}
                    disabled={isSyncing}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                      isConnected
                        ? 'border-red-500/30 text-rose-500 hover:bg-rose-500/5'
                        : 'text-white shadow-sm hover:opacity-95'
                    }`}
                    style={
                      !isConnected
                        ? { background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }
                        : {}
                    }
                  >
                    {isSyncing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : isConnected ? (
                      <span>Disconnect</span>
                    ) : (
                      <>
                        <span>Connect Tool</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Zero-Surveillance Universal File Ingestion Hub ── */}
        <div className="rounded-3xl border p-6 sm:p-8 bg-gradient-to-br from-[var(--cf-surface)] to-[var(--cf-surface-alt)] border-[var(--cf-border)] relative overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#2F6F62]/10 border border-[#2F6F62]/20 flex items-center justify-center text-[#2F6F62] shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[var(--cf-text)]">
                  Universal File-Based Ingestion (Zero Bank Surveillance)
                </h3>
                <p className="text-xs text-[var(--cf-text-muted)] max-w-xl mt-0.5">
                  Don&apos;t want to connect your live bank credentials? Simply export a CSV from Wise, Stripe, PayPal, Upwork, Wave, or Notion and drop it into CashFloor. Our engine auto-detects column headers and aggregates 12 months in 1 click.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md shrink-0 hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Launch Ingestion on Dashboard</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {[
              { label: 'Wise (TransferWise)', desc: 'Multi-Currency Statement' },
              { label: 'Stripe Invoicing', desc: 'Balance Activity CSV' },
              { label: 'PayPal Activity', desc: 'Completed Gross/Net CSV' },
              { label: 'Upwork & Freelance', desc: 'Contract Payouts CSV' },
            ].map(f => (
              <div key={f.label} className="p-3 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
                <span className="text-xs font-semibold text-[var(--cf-text)] block">{f.label}</span>
                <span className="text-[11px] font-mono text-[var(--cf-text-muted)]">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Competitive Strategic Positioning Card ── */}
        <div 
          className="rounded-3xl border p-6 sm:p-8 space-y-4"
          style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] flex items-center justify-center border border-[var(--cf-accent)]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[var(--cf-text)]">
                Why CashFloor Complements (Rather Than Replaces) Your Finance Stack
              </h3>
              <p className="text-xs text-[var(--cf-text-muted)]">
                The difference between backward-looking bookkeeping and forward-looking survival
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-[var(--cf-text-muted)]">
            <div className="p-4 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] space-y-1">
              <strong className="text-[var(--cf-text)] font-semibold font-mono block">1. QuickBooks / Xero</strong>
              <p className="leading-relaxed">
                Records history for the government. Tells your tax preparer what you wrote off in March. Zero predictive survival runway modeling.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] space-y-1">
              <strong className="text-[var(--cf-text)] font-semibold font-mono block">2. Mercury / Bank Accounts</strong>
              <p className="leading-relaxed">
                A dumb bucket for dollars. Shows you have $22k today without revealing that $8k belongs to future taxes and $6k covers next month&apos;s retainer delay.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] space-y-1">
              <strong className="text-[var(--cf-accent)] font-semibold font-mono block">3. CashFloor (The Cockpit)</strong>
              <p className="leading-relaxed">
                The mathematical command center. Uses 20th-percentile bedrock math to guarantee you never overspend or panic about money again.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
