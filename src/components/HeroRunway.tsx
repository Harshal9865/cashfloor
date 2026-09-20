'use client';

import React, { useEffect, useState } from 'react';

interface HeroRunwayProps {
  runwayMonths: number;
  isInfiniteRunway: boolean;
  currentSavings: number;
  avgMonthlyExpenses: number;
  floorIncome: number;
  exhaustionDate: string;
  dailyBurnVelocity: number;
  surplusMargin: number;
  bufferFundingPercentage: number;
  bufferMonthsMultiplier?: number;
  currencySymbol?: string;
}

export const HeroRunway: React.FC<HeroRunwayProps> = ({
  runwayMonths,
  isInfiniteRunway,
  currentSavings,
  avgMonthlyExpenses,
  floorIncome,
  exhaustionDate,
  dailyBurnVelocity,
  surplusMargin,
  bufferFundingPercentage,
  bufferMonthsMultiplier = 3.5,
  currencySymbol = '$',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  // Smooth count-up animation when runwayMonths changes
  useEffect(() => {
    if (isInfiniteRunway) {
      setDisplayValue(999);
      return;
    }

    const start = 0;
    const target = runwayMonths;
    const duration = 700; // ms
    const startTime = performance.now();

    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * easeOut;

      setDisplayValue(Number(current.toFixed(1)));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [runwayMonths, isInfiniteRunway]);

  // Dynamic health classification
  let healthLabel = 'Runway Health: Resilient';
  let healthColorClass = 'border-[#2F6F62]/30 bg-[#2F6F62]/10 text-[#2F6F62]';

  if (runwayMonths < 2.0 && !isInfiniteRunway) {
    healthLabel = 'Runway Health: Vulnerable';
    healthColorClass = 'border-[#B4573F]/30 bg-[#B4573F]/10 text-[#B4573F]';
  } else if (runwayMonths < 3.5 && !isInfiniteRunway) {
    healthLabel = 'Runway Health: Equilibrium';
    healthColorClass = 'border-[#C98A3E]/40 bg-[#C98A3E]/10 text-[#875205]';
  }

  return (
    <section className="bg-white hairline-all p-6 sm:p-10 md:p-12 text-center relative overflow-hidden transition-colors" id="runway">
      {/* Top Header Row matching Google Stitch without overlapping */}
      <div className="flex items-center justify-between gap-2 pb-2 w-full">
        <div className="font-mono text-[10px] text-[#5C6D77] tracking-widest uppercase select-none truncate text-left">
          <span className="hidden sm:inline">REF // </span>RUNWAY EQUILIBRIUM
        </div>

        <div className="text-right">
          <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-sans font-semibold border whitespace-nowrap ${healthColorClass}`}>
            {healthLabel}
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 my-2">
        {/* Eyebrow */}
        <p className="text-[11px] font-sans font-semibold tracking-[0.18em] text-[#5C6D77] uppercase">
          Guaranteed Inactivity Survival Horizon
        </p>

        {/* Monumental Metric Numeral */}
        <div className="flex items-baseline justify-center space-x-3 py-1">
          <span className="font-serif text-6xl sm:text-7xl md:text-[84px] md:leading-[92px] text-[#16232B] font-light tracking-tight tabular-nums">
            {isInfiniteRunway ? '∞' : displayValue.toFixed(1)}
          </span>
          <span className="font-serif text-2xl sm:text-3xl md:text-[36px] italic text-[#2F6F62] font-normal">
            months
          </span>
        </div>

        {/* Primary Zero-Income Clarification */}
        <p className="font-sans text-base sm:text-lg text-[#16232B] font-normal tracking-tight">
          at <span className="border-b border-[#16232B]/30 pb-0.5">$0 new income</span> from today
        </p>

        {/* Reassurance Subtitle */}
        <p className="font-sans text-xs sm:text-sm text-[#5C6D77] max-w-lg mx-auto pt-1 leading-relaxed">
          Current liquid cash covers your verified{' '}
          <span className="text-[#16232B] font-medium">
            Income Floor ({currencySymbol}{floorIncome.toLocaleString()}/mo)
          </span>{' '}
          through <strong className="text-[#16232B]">{exhaustionDate}</strong> without drawing from retirement or incurring debt.
        </p>

        {/* Secondary Note Chips matching Google Stitch */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 font-mono text-[11px]">
          <span className="px-3 py-1 bg-[#F1F4F2] border border-[#16232B]/10 text-[#16232B]">
            Buffer: <strong className="text-[#0f564a]">{bufferFundingPercentage}%</strong> of {bufferMonthsMultiplier}-mo target
          </span>
          <span className="px-3 py-1 bg-[#C98A3E]/10 border border-[#C98A3E]/30 text-[#875205]">
            Surplus Margin: {surplusMargin >= 0 ? '+' : '-'}{currencySymbol}{Math.abs(surplusMargin).toLocaleString()} {surplusMargin >= 0 ? 'above buffer' : 'gap'}
          </span>
          <span className="px-3 py-1 bg-[#F1F4F2] border border-[#16232B]/10 text-[#5C6D77]">
            Burn Velocity: {currencySymbol}{dailyBurnVelocity.toFixed(2)} / day
          </span>
        </div>
      </div>
    </section>
  );
};
