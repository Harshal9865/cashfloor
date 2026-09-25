'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, AlertTriangle, ShieldCheck, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function P20InteractiveSandbox() {
  const [months, setMonths] = useState<number[]>([6500, 2400, 8900, 3100, 1800, 7200]);

  const updateMonth = (index: number, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    const copy = [...months];
    copy[index] = num;
    setMonths(copy);
  };

  // Math calculations
  const total = months.reduce((a, b) => a + b, 0);
  const average = Math.round(total / months.length);

  // Exact 20th percentile calculation (Weibull / Rank-order)
  const sorted = [...months].sort((a, b) => a - b);
  const rank = 0.20 * (sorted.length - 1);
  const lowIndex = Math.floor(rank);
  const highIndex = Math.ceil(rank);
  const weight = rank - lowIndex;
  const p20Floor = Math.round(sorted[lowIndex] * (1 - weight) + sorted[highIndex] * weight);

  const dangerGap = Math.max(0, average - p20Floor);

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--cf-border-soft)] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] flex items-center justify-center border border-[var(--cf-accent)]/20">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-[var(--cf-text)]">
              Interactive Methodology Sandbox: Average vs. P20 Bedrock
            </h3>
            <p className="text-xs text-[var(--cf-text-muted)]">
              Adjust any monthly receipt below to see how our conservative algorithm prevents cash crunches
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--cf-accent)] bg-[var(--cf-accent-bg)] px-2.5 py-1 rounded-full border border-[var(--cf-accent)]/20 font-bold self-start sm:self-auto">
          Live Model
        </span>
      </div>

      {/* Month Inputs */}
      <div className="space-y-2">
        <label className="text-[11px] font-mono uppercase tracking-wider text-[var(--cf-text-faint)] block">
          Sample 6-Month Irregular Inflows ($ USD)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          {months.map((val, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">Month {idx + 1}</span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--cf-text-faint)]">$</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={val}
                  aria-label={`Inflow amount for month ${idx + 1}`}
                  onChange={(e) => updateMonth(idx, e.target.value)}
                  className="w-full pl-6 pr-2 py-2 rounded-xl text-xs font-mono bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors text-right"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Scoreboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Misleading Average */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-600 font-semibold">
              The Optimistic Average
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-[var(--cf-text)] font-mono tabular-nums">
            ${average.toLocaleString()}
            <span className="text-xs font-normal text-[var(--cf-text-muted)]">/mo</span>
          </div>
          <p className="text-[11px] text-[var(--cf-text-muted)] leading-relaxed">
            Budgeting based on ${average.toLocaleString()} causes overdrafts when lean months drop to ${Math.min(...months).toLocaleString()}.
          </p>
        </div>

        {/* 20th Percentile Bedrock */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 font-semibold">
              CashFloor Bedrock (P20)
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-600 font-mono tabular-nums">
            ${p20Floor.toLocaleString()}
            <span className="text-xs font-normal text-[var(--cf-text-muted)]">/mo</span>
          </div>
          <p className="text-[11px] text-[var(--cf-text-muted)] leading-relaxed">
            Empirically, 80% of your months match or beat this floor. Your living draw is structurally safe.
          </p>
        </div>

        {/* The Danger Buffer */}
        <div className="p-4 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--cf-text-faint)] font-semibold">
              Danger Gap Shielded
            </span>
            <Sparkles className="w-4 h-4 text-[var(--cf-accent)]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[var(--cf-text)] font-mono tabular-nums">
            ${dangerGap.toLocaleString()}
            <span className="text-xs font-normal text-[var(--cf-text-muted)]">/mo</span>
          </div>
          <p className="text-[11px] text-[var(--cf-text-muted)] leading-relaxed">
            Surplus above P20 flows into your Liquid Buffer before any discretionary spending is unlocked.
          </p>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-[var(--cf-border-soft)]">
        <span className="text-[var(--cf-text-muted)]">
          Want to test this model with your complete 12-month double-entry ledger?
        </span>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono font-semibold text-[var(--cf-accent)] hover:underline"
        >
          <span>Open Studio Dashboard Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
