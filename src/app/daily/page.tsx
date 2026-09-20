'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar,
  ArrowLeft,
  Sparkles,
  Zap,
  DollarSign,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Download
} from 'lucide-react';
import DashboardNav from '@/components/DashboardNav';
import { CashFlowChart } from '@/components/CashFlowChart';
import { DailyPaymentLog, DailyTransaction } from '@/components/DailyPaymentLog';
import { MonthlyRecord } from '@/lib/calculator/types';

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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300">
      <DashboardNav />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-8 space-y-8">
        
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
              <span>Sync Stripe &amp; Mercury</span>
            </Link>
          </div>
        </div>

        {/* ── Daily Cash Flow Chart Section ── */}
        <div 
          className="dash-card rounded-3xl border overflow-hidden shadow-sm"
          style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
        >
          <CashFlowChart
            records={SAMPLE_MONTHS}
            floorIncome={3200}
            avgExpenses={2100}
            currentSavings={12400}
            bufferTarget={7350}
            taxReservePct={0.25}
            currencySymbol={currencySymbol}
            initialViewMode="30_days"
          />
        </div>

        {/* ── Daily Inflow & Payment Ledger ── */}
        <DailyPaymentLog
          currencySymbol={currencySymbol}
        />

        {/* ── Strategy Callout for Daily Tracking ── */}
        <div 
          className="p-6 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
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
    </div>
  );
}
