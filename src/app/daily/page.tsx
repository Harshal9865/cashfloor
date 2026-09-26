'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Calendar,
  ArrowLeft,
  Sparkles,
  Zap,
  DollarSign,
  Clock,
  Activity
} from 'lucide-react';
import DashboardNav from '@/components/DashboardNav';
import Footer from '@/components/marketing/Footer';
import DailyPaymentLog, { DailyTransaction } from '@/components/DailyPaymentLog';
import { MonthlyRecord, CalculatorAssumptions } from '@/lib/calculator/types';
import { getLocalLedgerState } from '@/lib/supabase/ledgerService';
import { computeFullLedger } from '@/lib/calculator/engine';

const CashFlowChart = dynamic(
  () => import('@/components/CashFlowChart'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] rounded-2xl bg-[var(--cf-surface-alt)]/40 animate-pulse flex items-center justify-center text-xs font-mono text-[var(--cf-text-muted)]">
        Synchronizing Solvency Stream...
      </div>
    ),
  }
);

const SAMPLE_MONTHS: MonthlyRecord[] = [
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

export default function DailyPage() {
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [horizon, setHorizon] = useState<'7_days' | '14_days' | '30_days' | '90_days'>('30_days');
  const [simulateDelay, setSimulateDelay] = useState(false);
  const [months, setMonths] = useState<MonthlyRecord[]>(SAMPLE_MONTHS);
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
  const [isDemo, setIsDemo] = useState(true);

  // Load real data from localStorage
  React.useEffect(() => {
    const local = getLocalLedgerState();
    if (local && local.records && local.records.length > 0) {
      setMonths(local.records);
      setAssumptions(local.assumptions);
      setCurrencySymbol(local.currencySymbol || '$');
      setIsDemo(false);
    }
  }, []);

  const displayedMonths = simulateDelay
    ? months.map((m, i) => i === 0 ? { ...m, income: Math.round(m.income * 0.27) } : m)
    : months;

  // Compute real ledger values from current months
  const ledger = React.useMemo(() => computeFullLedger(displayedMonths, assumptions, []), [displayedMonths, assumptions]);
  const dailyBurn = ledger.avgMonthlyExpenses / 30.5;
  const todayInflow = displayedMonths.length > 0
    ? (simulateDelay ? Math.round(displayedMonths[0].income * 0.27) : Math.round(displayedMonths[0].income / 30.5 * 1.2))
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300">
      <DashboardNav />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-10 space-y-10 lg:space-y-12">
        
        {/* Navigation Breadcrumbs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Monthly Dashboard</span>
            </Link>

            <span className="text-[var(--cf-text-faint)]">·</span>

            <span className="text-xs font-mono text-[var(--cf-text-faint)]">
              Daily Granularity Mode
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSimulateDelay(!simulateDelay)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer shadow-sm ${
                simulateDelay
                  ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                  : 'border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text)] hover:border-[var(--cf-accent)]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
              <span>{simulateDelay ? '⚠️ Delay Active (21-Day Lag)' : 'Simulate Client Payment Delay'}</span>
            </button>

            <Link
              href="/integrations"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono border transition-all hover:border-[var(--cf-accent)]"
              style={{
                background: 'var(--cf-surface)',
                borderColor: 'var(--cf-border)',
                color: 'var(--cf-text)',
              }}
            >
              <Zap className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
              <span>Sync Stripe & Mercury</span>
            </Link>
          </div>
        </div>

        {/* ── Daily Top KPI Metric Chips ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div 
            className="p-5 sm:p-6 rounded-3xl border flex items-center gap-5 transition-all"
            style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
              simulateDelay
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            }`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)] block">
                Today&apos;s Cleared Inflow
              </span>
              <div className="text-xl font-bold font-mono tabular-nums text-[var(--cf-text)]">
                {currencySymbol}{todayInflow.toLocaleString()}
              </div>
              <span className={`text-[10px] font-mono ${simulateDelay ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {simulateDelay ? `⚠️ ${currencySymbol}${Math.round(displayedMonths[0]?.income - todayInflow).toLocaleString()} payment delayed` : '+2 transactions logged'}
              </span>
            </div>
          </div>

          <div 
            className="p-5 sm:p-6 rounded-3xl border flex items-center gap-5 transition-all"
            style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
              simulateDelay
                ? 'bg-red-500/10 text-rose-600 dark:text-rose-400 border-red-500/20'
                : 'bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] border-[var(--cf-accent)]/20'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)] block">
                Intra-Month Lag Risk
              </span>
              <div className={`text-xl font-bold font-mono ${simulateDelay ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {simulateDelay ? '14-Day Danger Gap' : 'Protected (0 Days)'}
              </div>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)]">
                {simulateDelay ? 'Day-1 rent requires buffer draw' : 'Buffer shields Day 1 rent'}
              </span>
            </div>
          </div>

          <div 
            className="p-5 sm:p-6 rounded-3xl border flex items-center gap-5 transition-all"
            style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)] block">
                Daily Burn Velocity
              </span>
              <div className="text-xl font-bold font-mono tabular-nums text-[var(--cf-text)]">
                {currencySymbol}{dailyBurn.toFixed(0)}<span className="text-xs font-normal text-[var(--cf-text-muted)]">/day</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)]">
                Baseline fixed survival burn
              </span>
            </div>
          </div>
        </div>

        {/* ── Horizon Range Selector Pills ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
          <span className="text-xs font-mono text-[var(--cf-text-muted)] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
            <span>Active Forecast Granularity:</span>
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto mobile-touch-scroll">
            {[
              { id: '7_days', label: '7-Day Micro' },
              { id: '14_days', label: '14-Day Payroll Run' },
              { id: '30_days', label: '30-Day Stream' },
              { id: '90_days', label: '90-Day Trajectory' },
            ].map(pill => (
              <button
                key={pill.id}
                type="button"
                onClick={() => setHorizon(pill.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap border ${
                  horizon === pill.id
                    ? 'bg-[var(--cf-surface)] border-[var(--cf-accent)] text-[var(--cf-text)] font-semibold shadow-sm'
                    : 'border-transparent text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Daily Cash Flow Chart Section ── */}
        <div 
          className="dash-card rounded-3xl border overflow-hidden shadow-sm p-5 sm:p-7"
          style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
        >
          <CashFlowChart
            records={displayedMonths}
            floorIncome={ledger.floorIncome}
            avgExpenses={ledger.avgMonthlyExpenses}
            currentSavings={assumptions.currentSavings}
            bufferTarget={ledger.bufferTarget}
            taxReservePct={assumptions.taxReservePct}
            currencySymbol={currencySymbol}
            initialViewMode={horizon === '90_days' ? '90_drought' : '30_days'}
          />
        </div>

        {/* ── Daily Inflow & Payment Ledger ── */}
        <DailyPaymentLog
          currencySymbol={currencySymbol}
        />

        {/* ── Strategy Callout for Daily Tracking ── */}
        <div 
            className="p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}
        >
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-[var(--cf-text)]">
              Why Day-by-Day Tracking Saves Freelancers from Cash Crunches
            </h3>
            <p className="text-xs text-[var(--cf-text-muted)] max-w-2xl leading-relaxed">
              Rent and software bills hit on Day 1. If your $4,500 invoice doesn&apos;t clear until Day 22, a monthly average makes you look profitable while your bank account is overdrawn. CashFloor models the intra-month gap so you know your true buffer.
            </p>
          </div>

          <Link
            href="/subscription"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-md shrink-0 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unlock Pro Daily Feeds</span>
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
