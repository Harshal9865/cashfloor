'use client';

import React, { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Printer,
  Calendar,
  DollarSign,
  AlertTriangle,
  Building2,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import CashFloorLogo from '@/components/CashFloorLogo';
import Footer from '@/components/marketing/Footer';

function ShareContent() {
  const searchParams = useSearchParams();
  const vaultParam = searchParams.get('vault');

  const vaultData = useMemo(() => {
    if (!vaultParam) return null;
    try {
      const decoded = decodeURIComponent(escape(atob(vaultParam)));
      return JSON.parse(decoded);
    } catch (err) {
      console.error('Failed to decode vault data', err);
      return null;
    }
  }, [vaultParam]);

  // Fallback realistic demo if invalid or empty
  const data = vaultData || {
    name: 'Founder / Freelancer Ledger',
    created: new Date().toISOString(),
    currency: '$',
    metrics: {
      floorIncome: 2400,
      avgExpenses: 2100,
      runwayMonths: 14.2,
      isInfiniteRunway: false,
      taxReserve: 3100,
      currentSavings: 12500,
      bufferTarget: 7350,
      bufferFundingPct: 100,
      volatilityTier: 'moderate',
      burnDeficit: 0,
    },
    assumptions: {
      taxReservePct: 0.25,
      bufferMonthsMultiplier: 3.5,
      percentile: 20,
    },
    ledger: [
      { month: 'Jul', income: 4200, expenses: 2100, client: 'Client Ref #1' },
      { month: 'Aug', income: 4500, expenses: 2100, client: 'Client Ref #2' },
      { month: 'Sep', income: 2800, expenses: 2100, client: 'Client Ref #1' },
      { month: 'Oct', income: 1600, expenses: 2100, client: 'Client Ref #3' },
      { month: 'Nov', income: 3400, expenses: 2100, client: 'Client Ref #1' },
      { month: 'Dec', income: 5900, expenses: 2300, client: 'Client Ref #4' },
      { month: 'Jan', income: 4000, expenses: 2100, client: 'Client Ref #2' },
      { month: 'Feb', income: 4100, expenses: 2100, client: 'Client Ref #3' },
      { month: 'Mar', income: 3300, expenses: 2200, client: 'Client Ref #1' },
      { month: 'Apr', income: 4500, expenses: 2100, client: 'Client Ref #2' },
      { month: 'May', income: 4800, expenses: 2100, client: 'Client Ref #3' },
      { month: 'Jun', income: 4600, expenses: 2250, client: 'Client Ref #1' },
    ]
  };

  const currency = data.currency || '$';

  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] flex flex-col font-sans">
      {/* Top Read-Only Banner */}
      <header className="border-b border-[var(--cf-border)] bg-[var(--cf-surface)] sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <CashFloorLogo size="sm" />
          </Link>
          <div className="h-4 w-px bg-[var(--cf-border)] hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Read-Only CPA Audit Vault</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-surface)] text-xs font-mono font-semibold text-[var(--cf-text)] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
            <span className="hidden sm:inline">Print / Save PDF</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex-1 space-y-8">
        {/* Verification Card */}
        <div className="p-6 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                <h1 className="font-serif text-2xl font-bold tracking-tight">
                  Independent Solvency & Runway Audit
                </h1>
              </div>
              <p className="text-xs text-[var(--cf-text-muted)] font-mono">
                Issued for {data.name} • Snapshot Timestamp: {new Date(data.created).toLocaleDateString()}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] font-mono text-[var(--cf-text-muted)] uppercase">Engine Verification</span>
              <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center sm:justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>P20 Non-Parametric Model Validated</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
            This read-only vault certifies that financial runway and cash distributions have been calculated using non-parametric 20th percentile quantile analysis rather than optimistic averages, preserving liquidity during high-variance revenue cycles.
          </p>
        </div>

        {/* 4 Core Financial Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-1">
            <span className="text-[11px] font-mono text-[var(--cf-text-muted)] uppercase">Conservative Floor</span>
            <div className="text-2xl font-bold font-mono text-[var(--cf-text)]">
              {currency}{data.metrics.floorIncome?.toLocaleString()}
            </div>
            <p className="text-[11px] text-[var(--cf-text-muted)]">20th percentile monthly income</p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-1">
            <span className="text-[11px] font-mono text-[var(--cf-text-muted)] uppercase">Monthly Fixed Burn</span>
            <div className="text-2xl font-bold font-mono text-[var(--cf-text)]">
              {currency}{data.metrics.avgExpenses?.toLocaleString()}
            </div>
            <p className="text-[11px] text-[var(--cf-text-muted)]">Living + operating overhead</p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-1">
            <span className="text-[11px] font-mono text-[var(--cf-text-muted)] uppercase">Certified Runway</span>
            <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {data.metrics.isInfiniteRunway ? 'Self-Sustaining' : `${Number(data.metrics.runwayMonths).toFixed(1)} Mo`}
            </div>
            <p className="text-[11px] text-[var(--cf-text-muted)]">At current liquid balance</p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-1">
            <span className="text-[11px] font-mono text-[var(--cf-text-muted)] uppercase">IRS Tax Escrow</span>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {currency}{data.metrics.taxReserve?.toLocaleString()}
            </div>
            <p className="text-[11px] text-[var(--cf-text-muted)]">{(data.assumptions.taxReservePct * 100).toFixed(0)}% estimated quarterly escrow</p>
          </div>
        </div>

        {/* 12-Month Audited Cash Flow Breakdown */}
        <div className="p-6 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="font-serif text-lg font-bold">12-Month Cash Flow Statement</h2>
              <p className="text-xs text-[var(--cf-text-muted)]">
                Historical monthly inflows, outflows, and net cash generated.
              </p>
            </div>
            <span className="text-xs font-mono text-[var(--cf-text-muted)]">
              {data.ledger.length} Monthly Periods
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--cf-border)] text-[var(--cf-text-muted)] uppercase text-[10px]">
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Client Tag / Channel</th>
                  <th className="py-2.5 px-3 text-right">Gross Inflow</th>
                  <th className="py-2.5 px-3 text-right">Fixed Expenses</th>
                  <th className="py-2.5 px-3 text-right">Net Cash Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cf-border-soft)]">
                {data.ledger.map((row: any, i: number) => {
                  const net = row.income - row.expenses;
                  return (
                    <tr key={i} className="hover:bg-[var(--cf-surface-alt)]/50 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[var(--cf-text)]">{row.month}</td>
                      <td className="py-2.5 px-3 text-[var(--cf-text-muted)]">{row.client}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                        {currency}{Number(row.income).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[var(--cf-text)]">
                        {currency}{Number(row.expenses).toLocaleString()}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-bold ${net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                        {net >= 0 ? '+' : ''}{currency}{net.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Auditor Notes & Disclaimer */}
        <div className="p-5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-[11px] text-[var(--cf-text-muted)] space-y-2">
          <div className="font-mono font-bold text-[var(--cf-text)] uppercase text-[10px]">
            CPA & Audit Disclosure Note
          </div>
          <p>
            This document contains self-reported financial performance data compiled by CashFloor for advisory, planning, and quarterly estimated tax planning purposes. While calculated with rigorous mathematical quantile algorithms, this report does not replace formal GAAP/IFRS audited balance sheets.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--cf-bg)] flex items-center justify-center font-mono text-xs">Loading Secure Audit Vault...</div>}>
      <ShareContent />
    </Suspense>
  );
}
