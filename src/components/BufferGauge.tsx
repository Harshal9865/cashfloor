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
      <div className="hairline rounded-sm p-4 sm:p-5 bg-[#F8FAF9]">
        <div className="flex items-center justify-between pb-3 hairline-b mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#2F6F62]" />
            <h3 className="text-sm font-semibold text-[#16232B] font-sans">
              Liquid buffer & sinking fund progress
            </h3>
          </div>
          <span
            className={`text-xs font-semibold tabular-nums px-2 py-0.5 rounded-xs ${
              isComplete
                ? 'text-[#2F6F62] bg-[#E6F0EE]'
                : 'text-[#C98A3E] bg-[#FAF2E8]'
            }`}
          >
            {fundingPercentage}% Funded
          </span>
        </div>

        {/* Progress bar with milestones */}
        <div className="space-y-1.5 font-sans">
          <div className="flex justify-between text-xs text-[#5C6D77]">
            <span>
              {currencySymbol}{Math.round(currentSavings).toLocaleString()} current
            </span>
            <span className="font-medium text-[#16232B]">
              Goal: {currencySymbol}{Math.round(bufferTarget).toLocaleString()}
            </span>
          </div>

          <div className="w-full h-3 bg-[#E7ECE9] rounded-xs overflow-hidden relative">
            <div
              className={`h-full transition-all duration-700 ease-out ${
                isComplete ? 'bg-[#2F6F62]' : 'bg-[#C98A3E]'
              }`}
              style={{ width: `${Math.min(100, fundingPercentage)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-[10px] text-[#8E9EA7] pt-1">
            <span>0 mo</span>
            <span>1.5 mo (Lean)</span>
            <span className="font-medium text-[#2F6F62]">3.5 mo (Target)</span>
            <span>6.0 mo (Immunity)</span>
          </div>
        </div>

        {/* Status Commentary */}
        <div className="mt-4 pt-3 hairline-t text-xs text-[#5C6D77] flex items-center justify-between font-sans">
          {isComplete ? (
            <span className="flex items-center gap-1.5 text-[#2F6F62] font-medium">
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
