'use client';

import React from 'react';
import { CalculatorAssumptions } from '../lib/calculator/types';
import { Lightbulb, RotateCcw } from 'lucide-react';

interface AssumptionControlsProps {
  assumptions: CalculatorAssumptions;
  onChange: (updated: CalculatorAssumptions) => void;
  currencySymbol: string;
  onCurrencyChange: (symbol: string) => void;
  floorIncome?: number;
  sensitivityDaysPer150?: number;
  onRevertDefaults?: () => void;
}

export const AssumptionControls: React.FC<AssumptionControlsProps> = ({
  assumptions,
  onChange,
  currencySymbol,
  onCurrencyChange,
  floorIncome = 2300,
  sensitivityDaysPer150 = 14,
  onRevertDefaults,
}) => {
  const taxPct = Math.round((assumptions.taxReservePct ?? 0.25) * 100);
  const bufferMonths = assumptions.bufferMonthsMultiplier ?? 3.5;
  const currentSavings = assumptions.currentSavings ?? 8820;
  const retainerProb = Math.round((assumptions.retainerProbability ?? 0.85) * 100);
  const inflationPct = Math.round((assumptions.annualInflationRate ?? 0.055) * 1000) / 10;

  return (
    <section className="p-6 md:p-8 space-y-6 transition-colors rounded-2xl border" style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }} id="assumptions">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--cf-border)' }}>
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight" style={{ color: 'var(--cf-text)' }}>
            Equilibrium Levers &amp; Sensitivity Modeling
          </h2>
          <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--cf-text-muted)' }}>
            Adjust your core parameters to test financial resilience against revenue shocks.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 px-3 py-1 border rounded-lg" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
            <span style={{ color: 'var(--cf-text-muted)' }}>Currency:</span>
            <select
              value={currencySymbol}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-transparent font-semibold font-mono text-xs cursor-pointer focus:outline-none"
              style={{ color: 'var(--cf-text)' }}
            >
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
              <option value="₹">₹ INR</option>
              <option value="C$">C$ CAD</option>
              <option value="A$">A$ AUD</option>
            </select>
          </div>

          <div className="text-xs font-mono px-3 py-1 border rounded-lg hidden sm:inline" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)', color: 'var(--cf-text-muted)' }}>
            MODE: REAL-TIME SIMULATION
          </div>
        </div>
      </div>

      {/* 4-Lever Grid matching Google Stitch */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Lever 1: Verified Liquid Working Cash */}
        <div className="p-4 rounded-xl border flex flex-col justify-between space-y-4" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
          <div>
            <div className="flex justify-between items-center font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--cf-text-muted)' }}>
              <span>Liquid Cash</span>
              <span className="font-semibold" style={{ color: 'var(--cf-accent)' }}>AVAILABLE</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-xl font-bold tabular-nums" style={{ color: 'var(--cf-text)' }}>
                {currencySymbol}{currentSavings.toLocaleString()}
              </span>
            </div>
            <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--cf-text-muted)' }}>
              Readily accessible checking &amp; liquid treasury reserve.
            </p>
          </div>
          <div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="250"
              value={currentSavings}
              onChange={(e) => onChange({ ...assumptions, currentSavings: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: 'var(--cf-text-muted)' }}>
              <span>{currencySymbol}1,000</span>
              <span>{currencySymbol}30,000</span>
            </div>
          </div>
        </div>

        {/* Lever 2: Retainer Confidence Probability */}
        <div className="p-4 rounded-xl border flex flex-col justify-between space-y-4" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
          <div>
            <div className="flex justify-between items-center font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--cf-text-muted)' }}>
              <span>Retainer Probability</span>
              <span className="font-semibold" style={{ color: 'var(--cf-warm)' }}>WEIGHTED</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-xl font-bold tabular-nums" style={{ color: 'var(--cf-text)' }}>
                {retainerProb}%
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--cf-text-muted)' }}>certainty</span>
            </div>
            <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--cf-text-muted)' }}>
              Haircut applied to non-contracted pipeline opportunities.
            </p>
          </div>
          <div>
            <input
              type="range"
              min="50"
              max="100"
              step="5"
              value={retainerProb}
              onChange={(e) => onChange({ ...assumptions, retainerProbability: Number(e.target.value) / 100 })}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: 'var(--cf-text-muted)' }}>
              <span>50% (Pessimist)</span>
              <span>100% (Signed)</span>
            </div>
          </div>
        </div>

        {/* Lever 3: Tax Withholding Bracket */}
        <div className="p-4 rounded-xl border flex flex-col justify-between space-y-4" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
          <div>
            <div className="flex justify-between items-center font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--cf-text-muted)' }}>
              <span>Tax Withholding</span>
              <span className="font-semibold" style={{ color: 'var(--cf-text-muted)' }}>AUTO ESCROW</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-xl font-bold tabular-nums" style={{ color: 'var(--cf-text)' }}>
                {taxPct}.0%
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--cf-text-muted)' }}>
                ({currencySymbol}{Math.round(floorIncome * (taxPct / 100)).toLocaleString()}/floor)
              </span>
            </div>
            <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--cf-text-muted)' }}>
              Separated immediately upon every incoming invoice payment.
            </p>
          </div>
          <div>
            <input
              type="range"
              min="15"
              max="40"
              step="1"
              value={taxPct}
              onChange={(e) => onChange({ ...assumptions, taxReservePct: Number(e.target.value) / 100 })}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: 'var(--cf-text-muted)' }}>
              <span>15%</span>
              <span>40%</span>
            </div>
          </div>
        </div>

        {/* Lever 4: Target Buffer Window */}
        <div className="p-4 rounded-xl border flex flex-col justify-between space-y-4" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
          <div>
            <div className="flex justify-between items-center font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--cf-text-muted)' }}>
              <span>Target Reserve Window</span>
              <span className="font-semibold" style={{ color: 'var(--cf-accent)' }}>PRUDENCE</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-xl font-bold tabular-nums" style={{ color: 'var(--cf-text)' }}>
                {bufferMonths.toFixed(1)}
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--cf-text-muted)' }}>
                months
              </span>
            </div>
            <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--cf-text-muted)' }}>
              Required runway cushion before elective dividend draws.
            </p>
          </div>
          <div>
            <input
              type="range"
              min="2"
              max="12"
              step="0.5"
              value={bufferMonths}
              onChange={(e) => onChange({ ...assumptions, bufferMonthsMultiplier: Number(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: 'var(--cf-text-muted)' }}>
              <span>2.0 mo</span>
              <span>12.0 mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lever 5: Annual Inflation Rate — Phase 2 */}
      <div className="p-4 rounded-xl border flex flex-col justify-between space-y-4" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
        <div>
          <div className="flex justify-between items-center font-mono text-[10px] uppercase mb-1" style={{ color: 'var(--cf-text-muted)' }}>
            <span>Inflation Rate</span>
            <span className="font-semibold" style={{ color: '#875205' }}>CPI DRAG</span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="font-mono text-xl font-bold tabular-nums" style={{ color: 'var(--cf-text)' }}>
              {inflationPct}%
            </span>
          </div>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--cf-text-muted)' }}>
            Annual purchasing power erosion applied to real runway.
          </p>
        </div>
        <input
          type="range"
          min={0.02}
          max={0.12}
          step={0.005}
          value={assumptions.annualInflationRate ?? 0.055}
          onChange={(e) =>
            onChange({ ...assumptions, annualInflationRate: parseFloat(e.target.value) })
          }
          className="w-full"
        />
        <div className="flex justify-between text-[10px] font-mono mt-1" style={{ color: 'var(--cf-text-muted)' }}>
          <span>2% (Low)</span>
          <span>12% (High)</span>
        </div>
      </div>

      {/* Sensitivity Callout */}
      <div className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs" style={{ background: 'var(--cf-accent-bg)', borderColor: 'var(--cf-border)', color: 'var(--cf-text)' }}>
        <div className="flex items-start sm:items-center space-x-2.5">
          <Lightbulb className="w-4 h-4 shrink-0" style={{ color: 'var(--cf-accent)' }} />
          <span className="font-sans leading-relaxed">
            <strong>Sensitivity Rule:</strong> Trimming your monthly survival floor by just{' '}
            <strong className="font-mono">{currencySymbol}150/mo</strong> extends your guaranteed cash runway by{' '}
            <span className="font-semibold font-mono" style={{ color: 'var(--cf-accent)' }}>+{sensitivityDaysPer150} calendar days</span>{' '}
            without securing extra client work.
          </span>
        </div>
        {onRevertDefaults && (
          <button
            type="button"
            onClick={onRevertDefaults}
            className="text-[11px] font-mono hover:underline underline-offset-4 flex items-center space-x-1 whitespace-nowrap cursor-pointer self-end sm:self-auto"
            style={{ color: 'var(--cf-accent)' }}
          >
            <RotateCcw className="w-3 h-3" />
            <span>Revert to Default Ratios</span>
          </button>
        )}
      </div>
    </section>
  );
};
