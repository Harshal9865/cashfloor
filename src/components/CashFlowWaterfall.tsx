'use client';

import React from 'react';
import { WaterfallStep } from '../lib/calculator/types';

interface CashFlowWaterfallProps {
  steps: WaterfallStep[];
  currencySymbol?: string;
}

export const CashFlowWaterfall: React.FC<CashFlowWaterfallProps> = ({
  steps,
  currencySymbol = '$',
}) => {
  if (!steps || steps.length === 0) return null;

  const maxAmount = Math.max(...steps.map((s) => Math.abs(s.amount)), 1000);

  return (
    <section className="bg-white hairline-all p-6 md:p-8 space-y-6 transition-colors" id="waterfall">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 hairline-b pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#16232B] font-normal tracking-tight">
              Cash Flow Allocation Waterfall
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider bg-[#E8EDE9] px-2 py-0.5 border border-[#16232B]/10 text-[#5C6D77]">
              Zero-Leakage Budgeting
            </span>
          </div>
          <p className="font-sans text-xs text-[#5C6D77] mt-1">
            Visual distribution of every gross dollar into statutory tax escrow, survival floor, safety buffer, and net owner paycheck.
          </p>
        </div>
        <span className="text-xs font-mono text-[#0f564a] font-medium hidden md:inline">
          100% RECONCILED
        </span>
      </div>

      <div className="space-y-4 font-sans">
        {steps.map((step, index) => {
          const isDeduction = step.type === 'deduction' || step.type === 'allocation';
          const widthPct = Math.min(100, Math.max(10, Math.round((Math.abs(step.amount) / maxAmount) * 100)));

          return (
            <div key={index} className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#16232B] font-medium flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 inline-block shrink-0"
                    style={{ backgroundColor: step.color }}
                  ></span>
                  <span>{step.label}</span>
                </span>
                <div className="flex items-center gap-4 font-mono">
                  <span className={isDeduction ? 'text-[#875205] font-semibold' : 'text-[#16232B] font-bold text-sm'}>
                    {isDeduction && step.amount < 0 ? '-' : '+'}
                    {currencySymbol}
                    {Math.abs(Math.round(step.amount)).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#8E9EA7] w-28 text-right hidden sm:inline">
                    (bal: {currencySymbol}{Math.max(0, Math.round(step.runningTotal)).toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Waterfall Bar with sharp 0px corners */}
              <div className="w-full h-3 bg-[#E8EDE9] overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: step.color,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-[#F1F4F2] hairline-all text-xs font-mono text-[#5C6D77] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <span>Taxes and living costs are strictly partitioned before discretionary owner drawings.</span>
        <span className="text-[#0f564a] font-semibold">Automated Solvency Protocol</span>
      </div>
    </section>
  );
};
