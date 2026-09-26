'use client';

import React from 'react';
import { ShieldCheck, Target } from 'lucide-react';

interface BufferGaugeProps {
  currentSavings: number;
  bufferTarget: number;
  fundingPercentage: number;
  monthsToTarget: number;
  monthlyContribution: number;
  currencySymbol?: string;
}

export const BufferGauge: React.FC<BufferGaugeProps> = ({
  currentSavings,
  bufferTarget,
  fundingPercentage,
  monthsToTarget,
  monthlyContribution,
  currencySymbol = '$',
}) => {
  const isComplete = currentSavings >= bufferTarget && bufferTarget > 0;

  return (
    <section className="w-full max-w-2xl mx-auto px-4 mt-8">
      <div className="rounded-2xl p-4 sm:p-5 bg-[var(--cf-surface)] border border-[var(--cf-border)] shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--cf-border-soft)] mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--cf-accent)]" />
            <h3 className="text-sm font-semibold text-[var(--cf-text)] font-sans">
              Liquid buffer & sinking fund progress
            </h3>
          </div>
          <span
            className={`text-xs font-semibold tabular-nums px-2.5 py-0.5 rounded-full border ${
              isComplete
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}
          >
            {fundingPercentage}% Funded
          </span>
        </div>

        {/* Progress bar with milestones */}
        <div className="space-y-1.5 font-sans">
          <div className="flex justify-between text-xs text-[var(--cf-text-muted)]">
            <span>
              {currencySymbol}{Math.round(currentSavings).toLocaleString()} current
            </span>
            <span className="font-semibold text-[var(--cf-text)]">
              Goal: {currencySymbol}{Math.round(bufferTarget).toLocaleString()}
            </span>
          </div>

          <div className="w-full h-3 bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] rounded-full overflow-hidden relative">
            <div
              className={`h-full transition-all duration-700 ease-out ${
                isComplete ? 'bg-[var(--cf-accent)]' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, fundingPercentage)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] text-[var(--cf-text-faint)] pt-1 font-mono">
            <span>0 mo</span>
            <span>1.5 mo (Lean)</span>
            <span className="font-medium text-[var(--cf-accent)]">3.5 mo (Target)</span>
            <span>6.0 mo (Immunity)</span>
          </div>
        </div>

        {/* Status Commentary */}
        <div className="mt-4 pt-3 border-t border-[var(--cf-border-soft)] text-xs text-[var(--cf-text-muted)] flex items-center justify-between font-sans">
          {isComplete ? (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safety target fully funded. Surpluses now flow 100% into sustainable paychecks.
            </span>
          ) : (
            <span>
              At your current floor allocation ({currencySymbol}{monthlyContribution.toLocaleString()}/mo), your buffer will be fully funded in ~{monthsToTarget} {monthsToTarget === 1 ? 'month' : 'months'}.
            </span>
          )}
        </div>
      </div>
    </section>
  );
};
