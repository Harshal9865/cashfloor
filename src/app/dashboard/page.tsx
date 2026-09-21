'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  DollarSign,
  Activity,
  Lock,
  Download,
  Upload,
  CreditCard,
  Building2,
  Share2,
  RotateCcw
} from 'lucide-react';
import DashboardNav from '@/components/DashboardNav';
import Footer from '@/components/marketing/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { getLocalLedgerState, loadUserLedger, saveUserLedger, SyncStatus } from '@/lib/supabase/ledgerService';
import { computeFullLedger } from '@/lib/calculator/engine';
import { MonthlyRecord, CalculatorAssumptions, PendingInvoice } from '@/lib/calculator/types';
import { SolvencyReportModal } from '@/components/SolvencyReportModal';
import { InvoiceGeneratorModal } from '@/components/InvoiceGeneratorModal';
import { RealDataWizardModal } from '@/components/RealDataWizardModal';
import { CsvPasteModal } from '@/components/CsvPasteModal';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';

const DEFAULT_RECORDS: MonthlyRecord[] = [
  { id: '1', month: 'Jul', income: 4050, expenses: 2100, clientTag: 'Acme Retainer' },
  { id: '2', month: 'Aug', income: 4400, expenses: 2100, clientTag: 'Bolt Studio' },
  { id: '3', month: 'Sep', income: 2850, expenses: 2100, clientTag: 'Acme Retainer' },
  { id: '4', month: 'Oct', income: 1600, expenses: 2100, clientTag: 'Direct Client C' },
  { id: '5', month: 'Nov', income: 3400, expenses: 2100, clientTag: 'Acme Retainer' },
  { id: '6', month: 'Dec', income: 5900, expenses: 2300, clientTag: 'Apex Design' },
  { id: '7', month: 'Jan', income: 4000, expenses: 2100, clientTag: 'Bolt Studio' },
  { id: '8', month: 'Feb', income: 4100, expenses: 2100, clientTag: 'Direct Client C' },
  { id: '9', month: 'Mar', income: 3300, expenses: 2200, clientTag: 'Acme Retainer' },
  { id: '10', month: 'Apr', income: 4500, expenses: 2100, clientTag: 'Bolt Studio' },
  { id: '11', month: 'May', income: 4800, expenses: 2100, clientTag: 'Direct Client C' },
  { id: '12', month: 'Jun', income: 4600, expenses: 2250, clientTag: 'Acme Retainer' },
];

export default function ExecutiveDashboard() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const userId = user?.id;

  const [records, setRecords] = useState<MonthlyRecord[]>(DEFAULT_RECORDS);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [assumptions, setAssumptions] = useState<CalculatorAssumptions>({
    taxReservePct: 0.25,
    bufferMonthsMultiplier: 3.5,
    currentSavings: 12400,
    percentile: 20,
    scenario: 'base',
    clientLossPercentage: 0.30,
    windfallAmount: 10000,
    retainerProbability: 0.85,
  });

  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [activeRails, setActiveRails] = useState<string[]>(['STRIPE', 'WISE']);
  
  // Modals
  const [isSolvencyModalOpen, setIsSolvencyModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  // Today's completed action items checklist (persisted locally)
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({
    reconcile: true,
    taxLock: false,
    stressTest: false,
    backupCheck: true,
  });

  useEffect(() => {
    const local = getLocalLedgerState();
    if (local && local.records && local.records.length > 0) {
      setRecords(local.records);
      setAssumptions(local.assumptions);
      setCurrencySymbol(local.currencySymbol || '$');
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cf_connected_integrations');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const connected = Object.entries(parsed)
            .filter(([_, v]: any) => v.connected)
            .map(([k]) => k.toUpperCase());
          if (connected.length > 0) setActiveRails(connected);
        } catch {}
      }
    }
  }, []);

  const calculation = useMemo(() => {
    return computeFullLedger(records, assumptions, []);
  }, [records, assumptions]);

  const toggleStep = (key: string) => {
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'Independent Operator';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cf-bg)] text-[var(--cf-text)] font-sans transition-colors duration-300">
      <DashboardNav
        onOpenAuthModal={() => openAuthModal()}
        onOpenSolvencyModal={() => setIsSolvencyModalOpen(true)}
        onOpenCalibrationWizard={() => setIsWizardOpen(true)}
        onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
        syncStatus={syncStatus}
        lastSavedAt={lastSavedAt}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 space-y-8">
        
        {/* ── Executive Briefing Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--cf-border-soft)]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Solvency Cockpit
              </span>
              <span className="text-xs text-[var(--cf-text-faint)] font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-[var(--cf-text)]">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--cf-text-muted)] max-w-2xl leading-relaxed">
              Here is your daily solvency posture. All models are running on your device’s local CPU with zero bank surveillance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsWizardOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium border border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Calibrate Numbers</span>
            </button>

            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md hover:opacity-95 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
            >
              <span>Launch Studio Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── Core Metric HUD (5 Pillars) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          {/* Card 1: Health Score */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)]">
                Solvency Score
              </span>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="py-2">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[var(--cf-text)]">
                94<span className="text-xs text-[var(--cf-text-muted)] font-normal">/100</span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                Resilient Posture
              </span>
            </div>
            <div className="w-full bg-[var(--cf-surface-alt)] h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-[94%]" />
            </div>
          </div>

          {/* Card 2: Liquid Runway */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)]">
                Liquid Runway
              </span>
              <Clock className="w-4 h-4 text-[var(--cf-accent)]" />
            </div>
            <div className="py-2">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[var(--cf-text)]">
                {calculation.runwayMonths.toFixed(1)} <span className="text-xs text-[var(--cf-text-muted)] font-normal">Mos</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)]">
                {currencySymbol}{calculation.currentSavings.toLocaleString()} liquid cash
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              Zero burn: {calculation.exhaustionDate}
            </span>
          </div>

          {/* Card 3: Bedrock P20 Floor */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)]">
                P20 Bedrock Floor
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="py-2">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {currencySymbol}{calculation.floorIncome.toLocaleString()}
              </div>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)]">
                Exceeded in 80% of months
              </span>
            </div>
            <span className="text-[10px] font-mono text-[var(--cf-text-faint)]">
              Safe living draw limit
            </span>
          </div>

          {/* Card 4: Tax Escrow Lock */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)]">
                Tax Escrow Lock
              </span>
              <Lock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="py-2">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-600 dark:text-amber-400">
                {currencySymbol}{Math.round(calculation.taxReserve).toLocaleString()}
              </div>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)]">
                25% statutory partition
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-600/90 dark:text-amber-400/90">
              Untouchable buffer
            </span>
          </div>

          {/* Card 5: Safe To Spend */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)]">
                Safe To Spend
              </span>
              <DollarSign className="w-4 h-4 text-[var(--cf-accent)]" />
            </div>
            <div className="py-2">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-[var(--cf-text)]">
                {currencySymbol}{calculation.safeToSpend.toLocaleString()}
              </div>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)]">
                True surplus capital
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              After {assumptions.bufferMonthsMultiplier}x safety buffer
            </span>
          </div>
        </div>

        {/* ── Two Column Layout: What To Do Today + Ingestion Rails ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2/3): Action Plan & Operational Checklist */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="p-6 sm:p-7 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--cf-border-soft)]">
                <div>
                  <h2 className="text-lg font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Daily Financial Action Plan</span>
                  </h2>
                  <p className="text-xs text-[var(--cf-text-muted)] mt-0.5">
                    Recommended high-leverage steps to safeguard your runway today
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] border border-[var(--cf-border-soft)] self-start sm:self-auto font-semibold">
                  {Object.values(completedSteps).filter(Boolean).length} / 4 Completed
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'reconcile',
                    title: 'Verify Recent Payout Clearance',
                    desc: 'Stripe payout of $4,250 cleared 2 days ago. Verify that gross revenue is logged in your ledger.',
                    route: '/daily',
                    routeText: 'Check Cash Stream →',
                  },
                  {
                    id: 'taxLock',
                    title: 'Confirm 25% Tax Escrow Segregation',
                    desc: `$1,062.50 from your last payment belongs to IRS Form 1040-ES. Keep it isolated in a sub-account.`,
                    route: '/studio',
                    routeText: 'Review Allocations →',
                  },
                  {
                    id: 'stressTest',
                    title: 'Run 21-Day Invoice Delay Stress Test',
                    desc: 'Your next expected client wire is $3,500. Simulate a 3-week delay to ensure fixed expenses are covered.',
                    route: '/studio',
                    routeText: 'Run Delay Stress Test →',
                  },
                  {
                    id: 'backupCheck',
                    title: 'Verify Local Enclave Portability',
                    desc: 'Your records reside in browser memory. Download a JSON snapshot or sync with Pro Cloud.',
                    route: '/account',
                    routeText: 'Vault Backup →',
                  },
                ].map(step => (
                  <div
                    key={step.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      completedSteps[step.id]
                        ? 'border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]/50 opacity-80'
                        : 'border-[var(--cf-border)] bg-[var(--cf-surface)] hover:border-[var(--cf-accent)]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleStep(step.id)}
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          completedSteps[step.id]
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-[var(--cf-border)] hover:border-[var(--cf-accent)]'
                        }`}
                        title="Toggle completion"
                      >
                        {completedSteps[step.id] && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                      <div className="space-y-0.5">
                        <h4 className={`text-xs font-semibold ${completedSteps[step.id] ? 'line-through text-[var(--cf-text-muted)]' : 'text-[var(--cf-text)]'}`}>
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-[var(--cf-text-muted)] leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={step.route}
                      className="text-[11px] font-mono text-[var(--cf-accent)] hover:underline flex items-center gap-1 self-end sm:self-auto shrink-0 font-medium"
                    >
                      <span>{step.routeText}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Studio Ecosystem Workspaces (Cards to Dedicated Pages) ── */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--cf-text-muted)] font-semibold block">
                Dedicated Software Stations
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Station 1: Studio Calculation Engine */}
                <Link
                  href="/studio"
                  className="p-5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] hover:border-[var(--cf-accent)] hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-serif font-bold text-[var(--cf-text)] group-hover:text-[var(--cf-accent)] transition-colors">
                      Studio Calculation Engine
                    </h3>
                    <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
                      Hero Runway, Monte Carlo volatility lab, scenario pills, waterfall allocations, and interactive ledger editing.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--cf-accent)] font-medium pt-2 border-t border-[var(--cf-border-soft)]">
                    <span>Open Calculation Engine</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Station 2: Daily Cash Stream */}
                <Link
                  href="/daily"
                  className="p-5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] hover:border-[var(--cf-accent)] hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-serif font-bold text-[var(--cf-text)] group-hover:text-[var(--cf-accent)] transition-colors">
                      Daily Cash Stream
                    </h3>
                    <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
                      Day-by-day cash flow tracking, intra-month client payment lags, and burn velocity monitoring.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--cf-accent)] font-medium pt-2 border-t border-[var(--cf-border-soft)]">
                    <span>Open Daily Stream</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Station 3: Integrations & CSV Feeds */}
                <Link
                  href="/integrations"
                  className="p-5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] hover:border-[var(--cf-accent)] hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-serif font-bold text-[var(--cf-text)] group-hover:text-[var(--cf-accent)] transition-colors">
                      Integrations &amp; CSV Ingestion
                    </h3>
                    <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
                      Connect Stripe, Mercury, Wise, and Upwork or drag-and-drop bank statement files with zero surveillance.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--cf-accent)] font-medium pt-2 border-t border-[var(--cf-border-soft)]">
                    <span>Manage Ingestion Rails</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Station 4: Security & Data Vault */}
                <Link
                  href="/security"
                  className="p-5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] hover:border-[var(--cf-accent)] hover:shadow-lg transition-all group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-serif font-bold text-[var(--cf-text)] group-hover:text-[var(--cf-accent)] transition-colors">
                      Security &amp; Enclave Vault
                    </h3>
                    <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
                      Audit browser storage allocation in KB, confirm 0 tracking scripts, and verify mathematical sovereignty.
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--cf-accent)] font-medium pt-2 border-t border-[var(--cf-border-soft)]">
                    <span>Audit Local Enclave</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

              </div>
            </div>

          </div>

          {/* Right Column (1/3): Quick Tools & Live Ingestion Rails */}
          <div className="space-y-6">
            
            {/* Quick Action Tools Hub */}
            <div className="p-6 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-4 shadow-sm">
              <h3 className="text-sm font-serif font-bold text-[var(--cf-text)]">
                Solvency &amp; Billing Tools
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => setIsInvoiceModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-surface)] hover:border-[var(--cf-accent)] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[var(--cf-accent)]" />
                    <span className="text-xs font-semibold text-[var(--cf-text)]">Client Invoice Studio</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--cf-text-muted)] group-hover:text-[var(--cf-text)]">
                    PDF Gen →
                  </span>
                </button>

                <button
                  onClick={() => setIsSolvencyModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-surface)] hover:border-[var(--cf-accent)] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-[var(--cf-text)]">CPA &amp; Lease Solvency Audit</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--cf-text-muted)] group-hover:text-[var(--cf-text)]">
                    Audit PDF →
                  </span>
                </button>

                <button
                  onClick={() => setIsCsvModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-surface)] hover:border-[var(--cf-accent)] transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Upload className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-semibold text-[var(--cf-text)]">Import CSV Statement</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--cf-text-muted)] group-hover:text-[var(--cf-text)]">
                    Parser →
                  </span>
                </button>
              </div>
            </div>

            {/* Live Ingestion Rails Feed */}
            <div className="p-6 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-serif font-bold text-[var(--cf-text)]">
                  Active Ingestion Feeds
                </h3>
                <Link
                  href="/integrations"
                  className="text-[10px] font-mono text-[var(--cf-accent)] hover:underline"
                >
                  Configure
                </Link>
              </div>

              <div className="space-y-2.5">
                {activeRails.map(rail => (
                  <div
                    key={rail}
                    className="p-3 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="font-mono font-bold text-[var(--cf-text)]">{rail}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Connected (Memory)
                    </span>
                  </div>
                ))}

                <Link
                  href="/integrations"
                  className="block text-center py-2 px-3 rounded-xl border border-dashed border-[var(--cf-border)] text-xs font-mono text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] hover:border-[var(--cf-accent)] transition-colors"
                >
                  + Connect Mercury or PayPal
                </Link>
              </div>
            </div>

            {/* Upcoming Tax Obligations Box */}
            <div className="p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs">
                <Calendar className="w-4 h-4" />
                <span>Next IRS Quarterly Deadline</span>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-mono font-bold text-[var(--cf-text)]">
                  October 15, 2026
                </div>
                <p className="text-[11px] text-[var(--cf-text-muted)] leading-relaxed">
                  Q3 Form 1040-ES estimated tax voucher. Target escrow reserve is fully allocated at {currencySymbol}{Math.round(calculation.taxReserve).toLocaleString()}.
                </p>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />

      {/* Modals */}
      <SolvencyReportModal
        isOpen={isSolvencyModalOpen}
        onClose={() => setIsSolvencyModalOpen(false)}
        result={calculation}
        assumptions={assumptions}
        records={records}
        currencySymbol={currencySymbol}
      />

      <InvoiceGeneratorModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        currencySymbol={currencySymbol}
        onSaveToReceivables={() => {}}
      />

      <RealDataWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onApplyRealData={(newRecords, newAssumptions) => {
          setRecords(newRecords);
          setAssumptions(prev => ({ ...prev, ...newAssumptions }));
        }}
        currencySymbol={currencySymbol}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
      />

      <CsvPasteModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onApply={(pasted) => {
          setRecords(pasted);
        }}
        currencySymbol={currencySymbol}
      />

      <LegalDisclaimer />
    </div>
  );
}
