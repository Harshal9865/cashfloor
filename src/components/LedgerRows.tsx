'use client';

import React, { useState } from 'react';
import { CalculationResult, CalculatorAssumptions } from '../lib/calculator/types';
import { HelpCircle } from 'lucide-react';

interface LedgerRowsProps {
  result: CalculationResult;
  assumptions: CalculatorAssumptions;
  currencySymbol?: string;
}

export const LedgerRows: React.FC<LedgerRowsProps> = ({
  result,
  assumptions,
  currencySymbol = '$',
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const bufferMultiplier = assumptions.bufferMonthsMultiplier ?? 3.5;
  const maxIdealMonths = 6.0;
  const runwayProgress = Math.min(100, Math.round((result.runwayMonths / maxIdealMonths) * 100));
  const targetPinPosition = Math.min(100, (bufferMultiplier / maxIdealMonths) * 100);

  const pillars = result.pillarBreakdown || [];

  return (
    <section className="transition-colors rounded-2xl border" style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }} id="partitions">
      {/* Section Header */}
      <div className="p-5 md:px-8 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2" style={{ borderColor: 'var(--cf-border)' }}>
        <div>
          <h2 className="font-serif text-xl sm:text-2xl tracking-tight font-normal" style={{ color: 'var(--cf-text)' }}>
            Capital Partitioning & Reserve Pillars
          </h2>
          <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--cf-text-muted)' }}>
            Strict double-entry allocation ensuring core freelancer survival before elective distributions.
          </p>
        </div>
        <div className="font-mono text-xs flex items-center space-x-2" style={{ color: 'var(--cf-text-muted)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--cf-accent)' }}></span>
          <span>AUDIT STATUS: BALANCED</span>
        </div>
      </div>

      {/* Ledger Table Header (Desktop lg+) */}
      <div className="hidden lg:grid grid-cols-12 px-8 py-3 font-mono text-[10px] uppercase tracking-wider border-b" style={{ background: 'var(--cf-surface-alt)', color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border)' }}>
        <div className="col-span-4">Pillar & Objective</div>
        <div className="col-span-2 text-right">Monthly Quota</div>
        <div className="col-span-2 text-right">Methodology</div>
        <div className="col-span-2 text-right">Funded Balance</div>
        <div className="col-span-2 text-right">Solvency Status</div>
      </div>

      {/* Stacked Pillar Rows */}
      <div className="divide-y" style={{ borderColor: 'var(--cf-border)' }}>
        {pillars.map((pillar) => {
          let badgeStyle = 'border-[var(--cf-accent)] bg-[var(--cf-accent)]/10 text-[var(--cf-accent)]';
          let borderOpacity = '33';
          
          if (pillar.solvencyType === 'safe') {
            badgeStyle = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            borderOpacity = '40';
          } else if (pillar.solvencyType === 'warning') {
            badgeStyle = 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            borderOpacity = '30';
          } else if (pillar.solvencyType === 'surplus') {
            badgeStyle = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            borderOpacity = '40';
          }

          const isTotalRow = pillar.id === 'liquid';

          return (
            <div
              key={pillar.id}
              className={`p-5 lg:px-8 lg:py-4 transition-all duration-300 ${!isTotalRow ? 'hover:bg-[var(--cf-surface-alt)] lg:hover:-translate-y-0.5 lg:hover:shadow-sm' : ''}`}
              style={{
                background: isTotalRow ? 'var(--cf-surface-alt)' : 'transparent',
                fontWeight: isTotalRow ? 500 : 400
              }}
            >
              {/* Desktop View (lg+) */}
              <div className="hidden lg:grid grid-cols-12 items-center">
                {/* Column 1: Pillar & Objective */}
                <div className="col-span-4 pr-4">
                  <div className="text-sm font-semibold flex items-center space-x-2" style={{ color: 'var(--cf-text)' }}>
                    <span
                      className="w-2 h-2 inline-block shrink-0 rounded-sm"
                      style={{ backgroundColor: pillar.indicatorColor }}
                    ></span>
                    <span>{pillar.name}</span>
                    <button
                      type="button"
                      aria-label={`Inspect ${pillar.name}`}
                      onClick={() => setActiveTooltip(activeTooltip === pillar.id ? null : pillar.id)}
                      className="transition-colors p-0.5 cursor-pointer"
                      style={{ color: 'var(--cf-text-faint)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--cf-accent)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--cf-text-faint)'}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-sans text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--cf-text-muted)' }}>
                    {pillar.objective}
                  </p>
                  {activeTooltip === pillar.id && (
                    <div className="mt-2 p-2 text-[11px] font-mono border rounded" style={{ background: 'var(--cf-surface-alt)', color: 'var(--cf-text)', borderColor: 'var(--cf-border)' }}>
                      Formula: {pillar.formula} • Solvency: {pillar.solvencyStatus}
                    </div>
                  )}
                </div>

                {/* Column 2: Monthly Quota */}
                <div className="col-span-2 text-right font-mono text-sm font-semibold tabular-nums" style={{ color: 'var(--cf-text)' }}>
                  {currencySymbol}
                  {Math.round(pillar.monthlyQuota).toLocaleString()}
                  <span className="text-[10px] font-normal ml-0.5" style={{ color: 'var(--cf-text-muted)' }}>/mo</span>
                </div>

                {/* Column 3: Methodology / Formula */}
                <div className="col-span-2 text-right font-mono text-xs truncate pl-2" title={pillar.formula} style={{ color: 'var(--cf-text-muted)' }}>
                  {pillar.formula}
                </div>

                {/* Column 4: Funded Balance */}
                <div className="col-span-2 text-right font-mono text-sm font-semibold tabular-nums" style={{ color: pillar.solvencyType === 'warning' ? '#B4573F' : 'var(--cf-accent)' }}>
                  {currencySymbol}
                  {Math.round(pillar.fundedBalance).toLocaleString()}
                </div>

                {/* Column 5: Solvency Status */}
                <div className="col-span-2 text-right">
                  <span 
                    className={`inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase border rounded whitespace-nowrap ${badgeStyle}`}
                    style={pillar.solvencyType === 'protected' || pillar.solvencyType === 'automated' || pillar.solvencyType === 'funded' ? { borderColor: 'var(--cf-accent)' + borderOpacity, color: 'var(--cf-accent)' } : { borderColor: 'currentColor' }}
                  >
                    {pillar.solvencyStatus}
                  </span>
                </div>
              </div>

              {/* Mobile & Tablet Card Layout (< lg) */}
              <div className="lg:hidden space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 inline-block shrink-0 rounded-sm"
                      style={{ backgroundColor: pillar.indicatorColor }}
                    ></span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--cf-text)' }}>{pillar.name}</span>
                  </div>
                  <span 
                    className={`inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase border rounded whitespace-nowrap ${badgeStyle}`}
                    style={pillar.solvencyType === 'protected' || pillar.solvencyType === 'automated' || pillar.solvencyType === 'funded' ? { borderColor: 'var(--cf-accent)' + borderOpacity, color: 'var(--cf-accent)' } : { borderColor: 'currentColor' }}
                  >
                    {pillar.solvencyStatus}
                  </span>
                </div>

                <p className="font-sans text-xs leading-relaxed" style={{ color: 'var(--cf-text-muted)' }}>
                  {pillar.objective}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs p-3 rounded-lg border" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
                  <div>
                    <span className="text-[10px] block uppercase font-sans" style={{ color: 'var(--cf-text-muted)' }}>Monthly Quota</span>
                    <span className="font-semibold tabular-nums" style={{ color: 'var(--cf-text)' }}>
                      {currencySymbol}{Math.round(pillar.monthlyQuota).toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] block uppercase font-sans" style={{ color: 'var(--cf-text-muted)' }}>Funded Balance</span>
                    <span className="font-semibold tabular-nums" style={{ color: pillar.solvencyType === 'warning' ? '#B4573F' : 'var(--cf-accent)' }}>
                      {currencySymbol}{Math.round(pillar.fundedBalance).toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t" style={{ borderColor: 'var(--cf-border)' }}>
                    <span className="text-[10px] block uppercase font-sans" style={{ color: 'var(--cf-text-muted)' }}>Formula</span>
                    <span className="text-[11px]" style={{ color: 'var(--cf-text-muted)' }}>{pillar.formula}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integrated Buffer Progress Gauge */}
      <div className="p-6 md:px-8 border-t" style={{ borderColor: 'var(--cf-border)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono mb-2 gap-1">
          <span className="tracking-wider uppercase" style={{ color: 'var(--cf-text)' }}>
            RUNWAY MATURITY: {result.isInfiniteRunway ? '∞' : result.runwayMonths.toFixed(1)} OF {maxIdealMonths.toFixed(1)} MONTH GOAL
          </span>
          <span className="font-semibold" style={{ color: 'var(--cf-accent)' }}>
            {runwayProgress}% OF 6-MONTH EQUILIBRIUM REACHED
          </span>
        </div>

        {/* Progress Bar with Pin Marker */}
        <div className="w-full h-2.5 relative overflow-hidden rounded-full" style={{ background: 'var(--cf-surface-alt)' }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${runwayProgress}%`, background: 'var(--cf-accent)' }}
          ></div>
          {/* Target Marker Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 z-10"
            style={{ left: `${targetPinPosition}%`, background: 'var(--cf-text)' }}
            title={`Minimum Target: ${bufferMultiplier} Months`}
          ></div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between text-[10px] font-mono mt-2 gap-1" style={{ color: 'var(--cf-text-muted)' }}>
          <span>0.0 Mo ({currencySymbol}0)</span>
          <span className="font-semibold" style={{ color: 'var(--cf-text)' }}>
            | Min Target: {bufferMultiplier} Mo ({currencySymbol}{result.bufferTarget.toLocaleString()})
          </span>
          <span>
            Max Ideal: {maxIdealMonths.toFixed(1)} Mo ({currencySymbol}{(result.avgMonthlyExpenses * maxIdealMonths).toLocaleString()})
          </span>
        </div>
      </div>
    </section>
  );
};
