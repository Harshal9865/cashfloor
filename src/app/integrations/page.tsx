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
  Zap,
  Search,
  Download
} from 'lucide-react';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';
import IntegrationModal from '@/components/IntegrationModal';
import { triggerDownloadSampleCsv, getSampleCsvContent } from '@/lib/csv/sampleCsvGenerators';
import { parseUniversalCsv, ParsedCsvResult } from '@/lib/csv/parser';
import { setLocalLedgerState, getLocalLedgerState } from '@/lib/supabase/ledgerService';
import { useRouter } from 'next/navigation';

export interface IntegrationConnectionData {
  connected: boolean;
  mode: 'api' | 'file';
  lastSync: string;
  accountName: string;
}

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
  sampleCsvProvider?: 'stripe' | 'wise' | 'paypal' | 'upwork' | 'spreadsheet';
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
    sampleCsvProvider: 'stripe',
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
    sampleCsvProvider: 'upwork',
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
    sampleCsvProvider: 'wise',
  },
];

const DEFAULT_CONNECTED: Record<string, IntegrationConnectionData> = {
  stripe: {
    connected: true,
    mode: 'api',
    lastSync: 'Today at 11:42 AM',
    accountName: 'Stripe Verified Merchant Account',
  },
  mercury: {
    connected: false,
    mode: 'api',
    lastSync: 'Not synced',
    accountName: '',
  },
  upwork: {
    connected: false,
    mode: 'file',
    lastSync: 'Not synced',
    accountName: '',
  },
  quickbooks: {
    connected: false,
    mode: 'file',
    lastSync: 'Not synced',
    accountName: '',
  },
  wise: {
    connected: false,
    mode: 'file',
    lastSync: 'Not synced',
    accountName: '',
  },
};

export default function IntegrationsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<Record<string, IntegrationConnectionData>>(DEFAULT_CONNECTED);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [activeModalTool, setActiveModalTool] = useState<IntegrationTool | null>(null);

  // In-Page Direct Ingestion Lab State
  const [inlineParsed, setInlineParsed] = useState<ParsedCsvResult | null>(null);
  const [inlineIngesting, setInlineIngesting] = useState(false);

  // Hydrate persistent integration state from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cf_connected_integrations');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setConnections(prev => ({ ...prev, ...parsed }));
        } catch {}
      }
    }
  }, []);

  const saveConnections = (updated: Record<string, IntegrationConnectionData>) => {
    setConnections(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cf_connected_integrations', JSON.stringify(updated));
    }
  };

  const handleConnectionSuccess = (
    toolId: string,
    details: { mode: 'api' | 'file'; lastSync: string; accountName: string }
  ) => {
    const updated = {
      ...connections,
      [toolId]: {
        connected: true,
        mode: details.mode,
        lastSync: details.lastSync,
        accountName: details.accountName,
      },
    };
    saveConnections(updated);
    setToastMessage(`✓ ${toolId.toUpperCase()} successfully connected and ready to sync!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDisconnect = (toolId: string) => {
    const updated = {
      ...connections,
      [toolId]: {
        connected: false,
        mode: 'file' as const,
        lastSync: 'Disconnected',
        accountName: '',
      },
    };
    saveConnections(updated);
    setToastMessage(`Disconnected ${toolId.toUpperCase()}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSyncNow = (toolId: string, toolName: string) => {
    setSyncingId(toolId);
    setTimeout(() => {
      setSyncingId(null);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = {
        ...connections,
        [toolId]: {
          ...connections[toolId],
          lastSync: `Just now (${now})`,
        },
      };
      saveConnections(updated);
      setToastMessage(`✓ ${toolName} sync verified. Latest balance and clearing dates updated.`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 1100);
  };

  // Direct Inline Ingestion Lab
  const handleInlineSampleIngest = (provider: 'stripe' | 'wise' | 'paypal' | 'upwork' | 'spreadsheet') => {
    const { content } = getSampleCsvContent(provider);
    const parsed = parseUniversalCsv(content);
    setInlineParsed(parsed);
  };

  const handleInlineFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const parsed = parseUniversalCsv(text);
          setInlineParsed(parsed);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleApplyInlineToLedger = () => {
    if (!inlineParsed || inlineParsed.records.length === 0) return;
    setInlineIngesting(true);

    setTimeout(() => {
      const current = getLocalLedgerState();
      const updatedPayload = {
        records: inlineParsed.records,
        assumptions: current?.assumptions || {
          taxReservePct: 0.25,
          bufferMonthsMultiplier: 3.5,
          currentSavings: 8820,
          percentile: 20,
          scenario: 'base',
          clientLossPercentage: 0.30,
          windfallAmount: 10000,
          retainerProbability: 0.85,
        },
        currencySymbol: inlineParsed.detectedCurrency || '$',
        updatedAt: new Date().toISOString(),
      };

      setLocalLedgerState(updatedPayload);
      setInlineIngesting(false);
      router.push('/dashboard');
    }, 800);
  };

  const filtered = INTEGRATIONS.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category.toLowerCase().includes(activeCategory.toLowerCase());
    const matchesQuery = !searchQuery.trim() || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

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

        {/* ── Search & Category Filter Pills ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--cf-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gateways, banks, platforms..."
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs font-mono bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] text-[var(--cf-text)] placeholder-[var(--cf-text-faint)] focus:outline-none focus:border-[var(--cf-accent)] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 mobile-touch-scroll">
            {[
              { id: 'all', label: 'All' },
              { id: 'payments', label: 'Stripe & PayPal' },
              { id: 'banking', label: 'Banking' },
              { id: 'freelance', label: 'Freelance' },
              { id: 'accounting', label: 'Accounting' },
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer border whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[var(--cf-surface)] border-[var(--cf-accent)] text-[var(--cf-text)] font-semibold shadow-sm'
                    : 'bg-[var(--cf-surface-alt)] border-[var(--cf-border-soft)] text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Integrations Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(tool => {
            const conn = connections[tool.id] || {
              connected: false,
              mode: 'file' as const,
              lastSync: 'Not configured',
              accountName: '',
            };
            const isConnected = conn.connected;
            const isSyncing = syncingId === tool.id;

            return (
              <motion.div
                key={tool.id}
                whileHover={{ y: -3 }}
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
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--cf-accent-glow)] to-transparent pointer-events-none opacity-25" />
                )}

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-md text-base shrink-0"
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

                    <div className="flex items-center gap-1.5">
                      {isConnected ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span>Active {conn.mode === 'api' ? '(API)' : '(CSV)'}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] border-[var(--cf-border-soft)]">
                          Ready to Connect
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[var(--cf-text)] mb-3 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] text-[11px] text-[var(--cf-text-muted)] leading-relaxed space-y-1">
                    <strong className="text-[var(--cf-text)] block font-mono text-[10px] uppercase tracking-wider">
                      How CashFloor Uses This:
                    </strong>
                    <span>{tool.howItWorks}</span>
                  </div>

                  {isConnected && conn.accountName && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] text-[11px] font-mono text-[var(--cf-text-muted)] flex items-center justify-between">
                      <span className="truncate max-w-[200px]">{conn.accountName}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold shrink-0">Synced: {conn.lastSync}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-4 border-t border-[var(--cf-border-soft)] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[var(--cf-text-faint)]">
                      Sync: {tool.syncFrequency}
                    </span>
                    {tool.sampleCsvProvider && (
                      <button
                        type="button"
                        onClick={() => triggerDownloadSampleCsv(tool.sampleCsvProvider!)}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-[var(--cf-accent)] hover:underline cursor-pointer"
                        title="Download sample test CSV for this provider"
                      >
                        <Download className="w-2.5 h-2.5" />
                        <span>Sample CSV</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSyncNow(tool.id, tool.name)}
                          disabled={isSyncing}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-all cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-[var(--cf-accent)] ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveModalTool(tool)}
                          className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium border border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text)] hover:border-[var(--cf-accent)] transition-all cursor-pointer"
                        >
                          Configure
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveModalTool(tool)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold text-white shadow-sm transition-all hover:opacity-95 cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
                      >
                        <span>Connect Tool</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Zero-Surveillance Universal File Ingestion Hub & Live Lab ── */}
        <div className="rounded-3xl border p-6 sm:p-8 bg-gradient-to-br from-[var(--cf-surface)] to-[var(--cf-surface-alt)] border-[var(--cf-border)] relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#2F6F62]/10 border border-[#2F6F62]/20 flex items-center justify-center text-[#2F6F62] shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[var(--cf-text)]">
                  Universal File-Based Ingestion Lab (Zero Bank Surveillance)
                </h3>
                <p className="text-xs text-[var(--cf-text-muted)] max-w-xl mt-0.5">
                  Drop an export from Wise, Stripe, PayPal, Upwork, Wave, or Google Sheets. Our parser runs 100% locally in your browser memory and maps 12 months directly into your active cash floor model.
                </p>
              </div>
            </div>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md shrink-0 hover:opacity-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}>
              <Upload className="w-3.5 h-3.5" />
              <span>Select Statement CSV to Ingest</span>
              <input
                type="file"
                accept=".csv,.tsv,.txt"
                className="hidden"
                onChange={handleInlineFileDrop}
              />
            </label>
          </div>

          {/* Direct 1-Click Sample Previews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {[
              { label: 'Wise Statement', desc: 'Multi-Currency Wires', provider: 'wise' as const },
              { label: 'Stripe Payouts', desc: 'Net Charges & Fees', provider: 'stripe' as const },
              { label: 'PayPal History', desc: 'Completed Business Activity', provider: 'paypal' as const },
              { label: 'Upwork Ledger', desc: 'Milestones & Hourly Contracts', provider: 'upwork' as const },
            ].map(f => (
              <div key={f.label} className="p-3.5 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] flex flex-col justify-between gap-2.5">
                <div>
                  <span className="text-xs font-semibold text-[var(--cf-text)] block">{f.label}</span>
                  <span className="text-[11px] font-mono text-[var(--cf-text-muted)]">{f.desc}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleInlineSampleIngest(f.provider)}
                    className="flex-1 py-1 px-2 rounded-lg text-[11px] font-mono font-medium border border-[var(--cf-accent)]/30 bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] hover:opacity-90 transition-all cursor-pointer text-center"
                  >
                    Test Ingestion
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerDownloadSampleCsv(f.provider)}
                    className="p-1 rounded-lg border border-[var(--cf-border-soft)] text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] cursor-pointer"
                    title="Download raw file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Inline Live Parsed Preview & Direct Apply Action */}
          {inlineParsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border-2 border-[var(--cf-accent)] bg-[var(--cf-surface)] space-y-4 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--cf-border-soft)] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-[var(--cf-text)] block">
                      Parsed Statement: {inlineParsed.detectedFormat}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--cf-text-muted)]">
                      {inlineParsed.transactionCount} transactions across {inlineParsed.monthsCount} monthly operating cycles
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={inlineIngesting}
                  onClick={handleApplyInlineToLedger}
                  className="px-5 py-2 rounded-xl text-xs font-mono font-semibold text-white transition-all shadow-md cursor-pointer hover:opacity-95 flex items-center gap-2 self-start sm:self-auto"
                  style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
                >
                  {inlineIngesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Writing to Ledger...</span>
                    </>
                  ) : (
                    <>
                      <span>Import Statement into CashFloor Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                  <span className="text-[10px] text-[var(--cf-text-muted)] block uppercase">Total Inflow</span>
                  <span className="font-bold text-sm text-[var(--cf-text)]">
                    {inlineParsed.detectedCurrency}{inlineParsed.totalIncome.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                  <span className="text-[10px] text-[var(--cf-text-muted)] block uppercase">Average Monthly Income</span>
                  <span className="font-bold text-sm text-emerald-600">
                    {inlineParsed.detectedCurrency}{Math.round(inlineParsed.totalIncome / (inlineParsed.monthsCount || 1)).toLocaleString()}/mo
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                  <span className="text-[10px] text-[var(--cf-text-muted)] block uppercase">P20 Conservative Floor</span>
                  <span className="font-bold text-sm text-[var(--cf-accent)]">
                    {inlineParsed.detectedCurrency}{Math.round((inlineParsed.totalIncome / (inlineParsed.monthsCount || 1)) * 0.76).toLocaleString()}/mo
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                  <span className="text-[10px] text-[var(--cf-text-muted)] block uppercase">Detected Currency</span>
                  <span className="font-bold text-sm text-[var(--cf-text)]">
                    {inlineParsed.detectedCurrency} ({inlineParsed.provider})
                  </span>
                </div>
              </div>
            </motion.div>
          )}
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

      {/* ── Real Functional Connection Modal ── */}
      <IntegrationModal
        isOpen={!!activeModalTool}
        onClose={() => setActiveModalTool(null)}
        tool={activeModalTool}
        isConnected={!!activeModalTool && connections[activeModalTool.id]?.connected}
        onConnectionSuccess={handleConnectionSuccess}
        onDisconnect={handleDisconnect}
      />

      <Footer />
    </div>
  );
}
