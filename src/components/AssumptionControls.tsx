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

  return (
    <section className="bg-white hairline-all p-6 md:p-8 space-y-6 transition-colors" id="assumptions">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 hairline-b pb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#16232B] font-normal tracking-tight">
            Equilibrium Levers &amp; Sensitivity Modeling
          </h2>
          <p className="font-sans text-xs text-[#5C6D77] mt-0.5">
            Adjust your core parameters to test financial resilience against revenue shocks.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 bg-[#F1F4F2] px-3 py-1 border border-[#16232B]/10">
            <span className="text-[#5C6D77]">Currency:</span>
            <select
              value={currencySymbol}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-transparent text-[#16232B] font-semibold font-mono text-xs cursor-pointer focus:outline-hidden"
            >
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
              <option value="£">£ GBP</option>
              <option value="₹">₹ INR</option>
              <option value="C$">C$ CAD</option>
              <option value="A$">A$ AUD</option>
            </select>
          </div>

          <div className="text-xs font-mono text-[#5C6D77] bg-[#F1F4F2] px-3 py-1 border border-[#16232B]/10 hidden sm:inline">
            MODE: REAL-TIME SIMULATION
          </div>
        </div>
      </div>

      {/* 4-Lever Grid matching Google Stitch */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Lever 1: Verified Liquid Working Cash */}
        <div className="p-4 bg-[#F5FAFF] hairline-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center font-mono text-[10px] text-[#5C6D77] uppercase mb-1">
              <span>Liquid Cash</span>
              <span className="text-[#2F6F62] font-semibold">AVAILABLE</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-xl font-bold text-[#16232B] tabular-nums">
                {currencySymbol}{currentSavings.toLocaleString()}
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#5C6D77] mt-1">
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
            <div className="flex justify-between text-[10px] font-mono text-[#5C6D77] mt-1">
              <span>{currencySymbol}1,000</span>
              <span>{currencySymbol}30,000</span>
            </div>
          </div>
        </div>

        {/* Lever 2: Retainer Confidence Probability */}
        <div className="p-4 bg-[#F5FAFF] hairline-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center font-mono text-[10px] text-[#5C6D77] uppercase mb-1">
              <span>Retainer Probability</span>
              <span className="text-[#875205] font-semibold">WEIGHTED</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-xl font-bold text-[#16232B] tabular-nums">
                {retainerProb}%
              </span>
              <span className="text-xs text-[#5C6D77] font-mono">certainty</span>
            </div>
            <p className="font-sans text-[11px] text-[#5C6D77] mt-1">
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
            <div className="flex justify-between text-[10px] font-mono text-[#5C6D77] mt-1">
              <span>50% (Pessimist)</span>
              <span>100% (Signed)</span>
            </div>
          </div>
        </div>

        {/* Lever 3: Tax Withholding Bracket */}
        <div className="p-4 bg-[#F5FAFF] hairline-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center font-mono text-[10px] text-[#5C6D77] uppercase mb-1">
              <span>Tax Withholding</span>
              <span className="text-[#5C6D77] font-semibold">AUTO ESCROW</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-xl font-bold text-[#16232B] tabular-nums">
                {taxPct}.0%
              </span>
              <span className="text-xs text-[#5C6D77] font-mono">
                ({currencySymbol}{Math.round(floorIncome * (taxPct / 100)).toLocaleString()}/floor)
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#5C6D77] mt-1">
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
            <div className="flex justify-between text-[10px] font-mono text-[#5C6D77] mt-1">
              <span>15%</span>
              <span>40%</span>
            </div>
          </div>
        </div>

        {/* Lever 4: Target Buffer Window */}
        <div className="p-4 bg-[#F5FAFF] hairline-all flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center font-mono text-[10px] text-[#5C6D77] uppercase mb-1">
              <span>Target Reserve Window</span>
              <span className="text-[#2F6F62] font-semibold">PRUDENCE</span>
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="font-mono text-xl font-bold text-[#16232B] tabular-nums">
                {bufferMonths.toFixed(1)}
              </span>
              <span className="text-xs text-[#5C6D77] font-mono">
                months
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#5C6D77] mt-1">
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
            <div className="flex justify-between text-[10px] font-mono text-[#5C6D77] mt-1">
              <span>2.0 mo</span>
              <span>12.0 mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Editorial Sensitivity Callout matching Google Stitch */}
      <div className="p-4 bg-[#F1F4F2] hairline-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#16232B]">
        <div className="flex items-start sm:items-center space-x-2.5">
          <Lightbulb className="w-4 h-4 text-[#2F6F62] shrink-0" />
          <span className="font-sans leading-relaxed">
            <strong>Sensitivity Rule:</strong> Trimming your monthly survival floor by just{' '}
            <strong className="font-mono">{currencySymbol}150/mo</strong> extends your guaranteed cash runway by{' '}
            <span className="text-[#0f564a] font-semibold font-mono">+{sensitivityDaysPer150} calendar days</span>{' '}
            without securing extra client work.
          </span>
        </div>
        {onRevertDefaults && (
          <button
            type="button"
            onClick={onRevertDefaults}
            className="text-[11px] font-mono text-[#0f564a] hover:underline underline-offset-4 flex items-center space-x-1 whitespace-nowrap cursor-pointer self-end sm:self-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Revert to Default Ratios</span>
          </button>
        )}
      </div>
    </section>
  );
};
