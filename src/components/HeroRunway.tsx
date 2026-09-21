'use client';

import React, { useEffect, useState } from 'react';
import { InflationAdjustedRunway } from '../lib/calculator/types';
import { TrendingDown, Info } from 'lucide-react';

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
  inflationAdjusted?: InflationAdjustedRunway;
  primaryInsight?: string;
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
  inflationAdjusted,
  primaryInsight,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [showInflationTooltip, setShowInflationTooltip] = useState(false);

  useEffect(() => {
    if (isInfiniteRunway) { setDisplayValue(999); return; }
    const start = 0;
    const target = runwayMonths;
    const duration = 700;
    const startTime = performance.now();
    let animationFrameId: number;
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Number((start + (target - start) * easeOut).toFixed(1)));
      if (progress < 1) { animationFrameId = requestAnimationFrame(animate); }
      else { setDisplayValue(target); }
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [runwayMonths, isInfiniteRunway]);

  // Dynamic health classification
  let healthLabel = 'Runway Health: Resilient';
  let healthColor = '#2F6F62';
  let healthBg = 'rgba(47,111,98,0.1)';

  if (runwayMonths < 2.0 && !isInfiniteRunway) {
    healthLabel = 'Runway Health: Vulnerable';
    healthColor = '#B4573F';
    healthBg = 'rgba(180,87,63,0.1)';
  } else if (runwayMonths < 3.5 && !isInfiniteRunway) {
    healthLabel = 'Runway Health: Equilibrium';
    healthColor = '#875205';
    healthBg = 'rgba(201,138,62,0.1)';
  }

  // Primary insight severity color
  const insightColor =
    primaryInsight?.startsWith('CRITICAL')
      ? '#B4573F'
      : primaryInsight?.startsWith('ALERT')
      ? '#875205'
      : primaryInsight?.startsWith('RISK')
      ? '#875205'
      : 'var(--cf-text-muted)';

  const showInflation =
    inflationAdjusted && inflationAdjusted.monthsLost > 0 && !isInfiniteRunway;

  return (
    <section
      className="p-6 sm:p-10 md:p-12 text-center relative overflow-hidden transition-colors rounded-2xl border"
      style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
      id="runway"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 pb-2 w-full">
        <div
          className="font-mono text-[10px] tracking-widest uppercase select-none truncate text-left"
          style={{ color: 'var(--cf-text-muted)' }}
        >
          <span className="hidden sm:inline">REF // </span>RUNWAY EQUILIBRIUM
        </div>
        <div
          className="inline-flex items-center px-2 py-0.5 text-[11px] font-sans font-semibold border rounded-full whitespace-nowrap"
          style={{ color: healthColor, background: healthBg, borderColor: `${healthColor}33` }}
        >
          {healthLabel}
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-4 my-2">
        {/* Eyebrow */}
        <p
          className="text-[11px] font-sans font-semibold tracking-[0.18em] uppercase"
          style={{ color: 'var(--cf-text-muted)' }}
        >
          Guaranteed Inactivity Survival Horizon
        </p>

        {/* Main Runway Number */}
        <div className="flex items-baseline justify-center space-x-3 py-1">
          <span
            className="font-serif text-6xl sm:text-7xl md:text-[84px] md:leading-[92px] font-light tracking-tight tabular-nums"
            style={{ color: 'var(--cf-text)' }}
          >
            {isInfiniteRunway ? '∞' : displayValue.toFixed(1)}
          </span>
          <span
            className="font-serif text-2xl sm:text-3xl md:text-[36px] italic font-normal"
            style={{ color: 'var(--cf-accent)' }}
          >
            months
          </span>
        </div>

        {/* Inflation-Adjusted Secondary Display */}
        {showInflation && (
          <div className="flex items-center justify-center gap-2 relative">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono"
              style={{
                background: 'rgba(180,87,63,0.08)',
                borderColor: 'rgba(180,87,63,0.3)',
                color: '#875205',
              }}
            >
              <TrendingDown className="w-3 h-3" />
              <span>
                Real (inflation-adjusted):{' '}
                <strong>{inflationAdjusted!.realRunwayMonths.toFixed(1)} months</strong>
                <span style={{ color: '#B4573F' }}>
                  {' '}(−{inflationAdjusted!.monthsLost} mo at {inflationAdjusted!.purchasingPowerLossPercent}% CPI)
                </span>
              </span>
              <button
                type="button"
                onClick={() => setShowInflationTooltip(!showInflationTooltip)}
                className="cursor-pointer"
                aria-label="Inflation info"
              >
                <Info className="w-3 h-3" />
              </button>
            </div>
            {showInflationTooltip && (
              <div
                className="absolute top-8 left-1/2 -translate-x-1/2 w-64 p-3 rounded-xl shadow-xl text-left z-10"
                style={{
                  background: 'var(--cf-surface)',
                  border: '1px solid var(--cf-border)',
                }}
              >
                <p className="text-xs leading-relaxed" style={{ color: 'var(--cf-text-muted)' }}>
                  {inflationAdjusted!.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Primary Zero-Income Clarification */}
        <p
          className="font-sans text-base sm:text-lg font-normal tracking-tight"
          style={{ color: 'var(--cf-text)' }}
        >
          at{' '}
          <span style={{ borderBottom: '1px solid var(--cf-border)' }}>
            {currencySymbol}0 new income
          </span>{' '}
          from today
        </p>

        {/* Reassurance Subtitle */}
        <p
          className="font-sans text-xs sm:text-sm max-w-lg mx-auto pt-1 leading-relaxed"
          style={{ color: 'var(--cf-text-muted)' }}
        >
          Current liquid cash covers your verified{' '}
          <span style={{ color: 'var(--cf-text)', fontWeight: 500 }}>
            Income Floor ({currencySymbol}{floorIncome.toLocaleString()}/mo)
          </span>{' '}
          through{' '}
          <strong style={{ color: 'var(--cf-text)' }}>{exhaustionDate}</strong>{' '}
          without drawing from retirement or incurring debt.
        </p>

        {/* Primary Insight Banner */}
        {primaryInsight && (
          <div
            className="text-left px-4 py-3 rounded-xl border text-xs leading-relaxed"
            style={{
              background:
                primaryInsight.startsWith('CRITICAL') || primaryInsight.startsWith('ALERT')
                  ? 'rgba(180,87,63,0.08)'
                  : 'var(--cf-surface-alt)',
              borderColor:
                primaryInsight.startsWith('CRITICAL') || primaryInsight.startsWith('ALERT')
                  ? 'rgba(180,87,63,0.3)'
                  : 'var(--cf-border)',
              color: insightColor,
            }}
          >
            {primaryInsight}
          </div>
        )}

        {/* KPI Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4 font-mono text-[11px]">
          <span
            className="px-3 py-1 rounded-full border"
            style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)', color: 'var(--cf-text)' }}
          >
            Buffer:{' '}
            <strong style={{ color: 'var(--cf-accent)' }}>{bufferFundingPercentage}%</strong>{' '}
            of {bufferMonthsMultiplier}-mo target
          </span>
          <span
            className="px-3 py-1 rounded-full border"
            style={{
              background: surplusMargin >= 0 ? 'rgba(201,138,62,0.08)' : 'rgba(180,87,63,0.08)',
              borderColor: surplusMargin >= 0 ? '#C98A3E44' : '#B4573F44',
              color: surplusMargin >= 0 ? '#875205' : '#B4573F',
            }}
          >
            Surplus Margin:{' '}
            {surplusMargin >= 0 ? '+' : '-'}
            {currencySymbol}{Math.abs(surplusMargin).toLocaleString()}{' '}
            {surplusMargin >= 0 ? 'above buffer' : 'gap'}
          </span>
          <span
            className="px-3 py-1 rounded-full border"
            style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)', color: 'var(--cf-text-muted)' }}
          >
            Burn: {currencySymbol}{dailyBurnVelocity.toFixed(2)}/day
          </span>
        </div>
      </div>
    </section>
  );
};
