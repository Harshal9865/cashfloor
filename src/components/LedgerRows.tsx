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
    <section className="bg-white hairline-all transition-colors" id="partitions">
      {/* Section Header */}
      <div className="p-5 md:px-8 hairline-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FBFDFB]">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#16232B] tracking-tight font-normal">
            Capital Partitioning &amp; Reserve Pillars
          </h2>
          <p className="font-sans text-xs text-[#5C6D77] mt-0.5">
            Strict double-entry allocation ensuring core freelancer survival before elective distributions.
          </p>
        </div>
        <div className="font-mono text-xs text-[#5C6D77] flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6F62]"></span>
          <span>AUDIT STATUS: BALANCED</span>
        </div>
      </div>

      {/* Ledger Table Header (Desktop lg+) */}
      <div className="hidden lg:grid grid-cols-12 px-8 py-3 bg-[#E8EDE9] font-mono text-[10px] text-[#5C6D77] uppercase tracking-wider hairline-b">
        <div className="col-span-4">Pillar &amp; Objective</div>
        <div className="col-span-2 text-right">Monthly Quota</div>
        <div className="col-span-2 text-right">Methodology</div>
        <div className="col-span-2 text-right">Funded Balance</div>
        <div className="col-span-2 text-right">Solvency Status</div>
      </div>

      {/* Stacked Pillar Rows */}
      <div className="divide-y divide-[#16232B]/10">
        {pillars.map((pillar) => {
          let badgeStyle = 'border-[#2F6F62]/30 bg-[#2F6F62]/10 text-[#2F6F62]';
          if (pillar.solvencyType === 'safe') {
            badgeStyle = 'border-[#C98A3E]/40 bg-[#C98A3E]/10 text-[#875205]';
          } else if (pillar.solvencyType === 'warning') {
            badgeStyle = 'border-[#B4573F]/30 bg-[#B4573F]/10 text-[#B4573F]';
          } else if (pillar.solvencyType === 'surplus') {
            badgeStyle = 'border-[#C98A3E]/40 bg-[#C98A3E]/10 text-[#875205]';
          }

          const isTotalRow = pillar.id === 'liquid';

          return (
            <div
              key={pillar.id}
              className={`p-5 lg:px-8 lg:py-4 hover:bg-[#2F6F62]/[0.02] transition-colors ${
                isTotalRow ? 'bg-[#F1F4F2]/50 font-medium' : ''
              }`}
            >
              {/* Desktop View (lg+) */}
              <div className="hidden lg:grid grid-cols-12 items-center">
                {/* Column 1: Pillar & Objective */}
                <div className="col-span-4 pr-4">
                  <div className="text-sm text-[#16232B] font-semibold flex items-center space-x-2">
                    <span
                      className="w-2 h-2 inline-block shrink-0"
                      style={{ backgroundColor: pillar.indicatorColor }}
                    ></span>
                    <span>{pillar.name}</span>
                    <button
                      type="button"
                      aria-label={`Inspect ${pillar.name}`}
                      onClick={() => setActiveTooltip(activeTooltip === pillar.id ? null : pillar.id)}
                      className="text-[#8E9EA7] hover:text-[#2F6F62] transition-colors p-0.5 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="font-sans text-xs text-[#5C6D77] mt-0.5 leading-relaxed">
                    {pillar.objective}
                  </p>
                  {activeTooltip === pillar.id && (
                    <div className="mt-2 p-2 bg-[#E8EDE9] text-[11px] font-mono text-[#16232B] border border-[#16232B]/10">
                      Formula: {pillar.formula} • Solvency: {pillar.solvencyStatus}
                    </div>
                  )}
                </div>

                {/* Column 2: Monthly Quota */}
                <div className="col-span-2 text-right font-mono text-sm text-[#16232B] font-semibold tabular-nums">
                  {currencySymbol}
                  {Math.round(pillar.monthlyQuota).toLocaleString()}
                  <span className="text-[10px] font-normal text-[#5C6D77] ml-0.5">/mo</span>
                </div>

                {/* Column 3: Methodology / Formula */}
                <div className="col-span-2 text-right font-mono text-xs text-[#5C6D77] truncate pl-2" title={pillar.formula}>
                  {pillar.formula}
                </div>

                {/* Column 4: Funded Balance */}
                <div className="col-span-2 text-right font-mono text-sm font-semibold tabular-nums text-[#0f564a]">
                  {currencySymbol}
                  {Math.round(pillar.fundedBalance).toLocaleString()}
                </div>

                {/* Column 5: Solvency Status */}
                <div className="col-span-2 text-right">
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase border whitespace-nowrap ${badgeStyle}`}>
                    {pillar.solvencyStatus}
                  </span>
                </div>
              </div>

              {/* Mobile & Tablet Card Layout (< lg) */}
              <div className="lg:hidden space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className="w-2.5 h-2.5 inline-block shrink-0"
                      style={{ backgroundColor: pillar.indicatorColor }}
                    ></span>
                    <span className="text-sm text-[#16232B] font-semibold">{pillar.name}</span>
                  </div>
                  <span className={`inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider uppercase border whitespace-nowrap ${badgeStyle}`}>
                    {pillar.solvencyStatus}
                  </span>
                </div>

                <p className="font-sans text-xs text-[#5C6D77] leading-relaxed">
                  {pillar.objective}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs bg-[#F5FAFF]/60 p-3 hairline-all">
                  <div>
                    <span className="text-[10px] text-[#5C6D77] block uppercase font-sans">Monthly Quota</span>
                    <span className="font-semibold text-[#16232B] tabular-nums">
                      {currencySymbol}{Math.round(pillar.monthlyQuota).toLocaleString()}/mo
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#5C6D77] block uppercase font-sans">Funded Balance</span>
                    <span className="font-semibold text-[#0f564a] tabular-nums">
                      {currencySymbol}{Math.round(pillar.fundedBalance).toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-[#16232B]/10">
                    <span className="text-[10px] text-[#5C6D77] block uppercase font-sans">Formula</span>
                    <span className="text-[#5C6D77] text-[11px]">{pillar.formula}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integrated Buffer Progress Gauge matching Google Stitch */}
      <div className="p-6 md:px-8 hairline-t bg-[#FBFDFB]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono mb-2 gap-1">
          <span className="text-[#16232B] tracking-wider uppercase">
            RUNWAY MATURITY: {result.isInfiniteRunway ? '∞' : result.runwayMonths.toFixed(1)} OF {maxIdealMonths.toFixed(1)} MONTH GOAL
          </span>
          <span className="font-semibold text-[#0f564a]">
            {runwayProgress}% OF 6-MONTH EQUILIBRIUM REACHED
          </span>
        </div>

        {/* Progress Bar with Pin Marker */}
        <div className="w-full h-2.5 bg-[#E8EDE9] relative overflow-hidden">
          <div
            className="h-full bg-[#2F6F62] transition-all duration-500"
            style={{ width: `${runwayProgress}%` }}
          ></div>
          {/* Target Marker Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-[#16232B] z-10"
            style={{ left: `${targetPinPosition}%` }}
            title={`Minimum Target: ${bufferMultiplier} Months`}
          ></div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between text-[10px] font-mono text-[#5C6D77] mt-2 gap-1">
          <span>0.0 Mo ({currencySymbol}0)</span>
          <span className="text-[#16232B] font-semibold">
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
