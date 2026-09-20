'use client';

import React from 'react';
import { MonthlyRecord } from '../lib/calculator/types';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface CashFlowChartProps {
  records: MonthlyRecord[];
  floorIncome: number;
  avgExpenses: number;
  currentSavings?: number;
  bufferTarget?: number;
  taxReservePct?: number;
  currencySymbol?: string;
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  records,
  floorIncome,
  avgExpenses,
  currentSavings = 8820,
  bufferTarget = 7350,
  taxReservePct = 0.25,
  currencySymbol = '$',
}) => {
  if (!records || records.length === 0) return null;

  // Calculate rolling month-end liquid cash balance trajectory
  let rolling = currentSavings;
  const rollingBalances: { month: string; balance: number; netFlow: number; isLean: boolean; isTax: boolean; isPeak: boolean }[] = [];

  records.forEach((r, idx) => {
    const tax = Math.round(r.income * taxReservePct);
    const net = r.income - tax - r.expenses;
    rolling += net;
    const isLean = r.income < floorIncome;
    const isTax = idx === 2 || idx === 8; // Q1 / Q3 tax intervals
    const isPeak = r.income >= floorIncome * 1.4;

    rollingBalances.push({
      month: r.month,
      balance: rolling,
      netFlow: net,
      isLean,
      isTax,
      isPeak,
    });
  });

  const balances = rollingBalances.map((b) => b.balance);
  const minBalance = Math.min(...balances, 0);
  const maxBalance = Math.max(...balances, bufferTarget * 1.5, 12000);

  // SVG Chart bounds
  const svgWidth = 1000;
  const svgHeight = 240;
  const padTop = 25;
  const padBottom = 35;
  const padLeft = 40;
  const padRight = 30;
  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const getY = (val: number) => {
    const range = maxBalance - minBalance || 1;
    const normalized = (val - minBalance) / range;
    return svgHeight - padBottom - normalized * chartH;
  };

  const getX = (idx: number) => {
    const step = chartW / (records.length - 1 || 1);
    return padLeft + idx * step;
  };

  const points = rollingBalances.map((b, idx) => `${getX(idx)},${getY(b.balance)}`).join(' ');
  const bufferY = getY(bufferTarget);
  const dangerY = getY(avgExpenses * 1.5); // 1.5 month danger threshold

  // Find lowest month in horizon
  let lowestIdx = 0;
  let lowestBal = balances[0];
  balances.forEach((b, i) => {
    if (b < lowestBal) {
      lowestBal = b;
      lowestIdx = i;
    }
  });

  const lowestMonthName = rollingBalances[lowestIdx]?.month || 'Oct';
  const hasDeficit = minBalance < 0;

  return (
    <section className="bg-white hairline-all p-6 md:p-8 space-y-6 transition-colors" id="cash-flow">
      {/* Header & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 hairline-b pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#16232B] font-normal tracking-tight">
              12-Month Cash Flow Horizon &amp; Floor Overlay
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border border-[#16232B]/20 text-[#5C6D77]">
              Editorial Projection
            </span>
          </div>
          <p className="font-sans text-xs text-[#5C6D77] mt-1 leading-relaxed">
            Simulates dynamic month-end liquid cash balances vs. the non-negotiable {currencySymbol}{Math.round(floorIncome).toLocaleString()}/mo survival floor baseline.
          </p>
        </div>

        {/* Legend matching Google Stitch */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#5C6D77]">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-[#0f564a]"></span>
            <span>Projected Cash</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-0.5 bg-[#C98A3E] border-t border-dashed"></span>
            <span>Buffer Threshold ({currencySymbol}{Math.round(bufferTarget).toLocaleString()})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 bg-[#C98A3E]/20 border border-[#C98A3E]/40"></span>
            <span>Surplus Zone</span>
          </div>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="text-[10px] font-mono text-[#5C6D77] md:hidden flex items-center justify-between">
        <span>12-Month Trajectory</span>
        <span>← Scroll horizontally →</span>
      </div>

      {/* SVG Canvas matching Google Stitch */}
      <div className="relative w-full overflow-x-auto pb-2">
        <div className="min-w-[640px] md:min-w-0">
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              {/* Horizontal Grid lines */}
              <line stroke="rgba(22, 35, 43, 0.08)" strokeWidth="1" x1="0" x2={svgWidth} y1={padTop} y2={padTop} />
              <text fill="#8E9EA7" fontFamily="var(--font-mono), monospace" fontSize="11" x="5" y={padTop - 6}>
                {currencySymbol}{Math.round(maxBalance).toLocaleString()}
              </text>

              <line stroke="rgba(22, 35, 43, 0.08)" strokeWidth="1" x1="0" x2={svgWidth} y1={bufferY} y2={bufferY} />
              <text fill="#C98A3E" fontFamily="var(--font-mono), monospace" fontSize="11" x="5" y={bufferY - 6}>
                {currencySymbol}{Math.round(bufferTarget).toLocaleString()} (Buffer Target)
              </text>

              <line stroke="rgba(22, 35, 43, 0.08)" strokeWidth="1" x1="0" x2={svgWidth} y1={dangerY} y2={dangerY} />
              <text fill="#B4573F" fontFamily="var(--font-mono), monospace" fontSize="11" x="5" y={dangerY - 6}>
                {currencySymbol}{Math.round(avgExpenses * 1.5).toLocaleString()} (Lean Threshold)
              </text>

              {/* Buffer Target Dashed Line */}
              <line stroke="#C98A3E" strokeDasharray="4 3" strokeWidth="1.5" x1={padLeft} x2={svgWidth - padRight} y1={bufferY} y2={bufferY} />

              {/* Shaded Surplus Area above buffer line */}
              <polygon
                fill="rgba(201, 138, 62, 0.08)"
                points={`
                  ${getX(0)},${Math.min(getY(rollingBalances[0].balance), bufferY)}
                  ${rollingBalances.map((b, i) => `${getX(i)},${Math.min(getY(b.balance), bufferY)}`).join(' ')}
                  ${getX(records.length - 1)},${bufferY}
                  ${getX(0)},${bufferY}
                `}
              />

              {/* Primary Projected Cash Balance Polyline */}
              <polyline fill="none" points={points} stroke="#0f564a" strokeWidth="2.5" />

              {/* Verified Data Point Markers matching Stitch */}
              {rollingBalances.map((b, idx) => {
                const cx = getX(idx);
                const cy = getY(b.balance);

                let pointColor = '#0f564a';
                let pointRadius = 3.5;

                if (b.isLean) {
                  pointColor = '#B4573F'; // lean month
                  pointRadius = 4.5;
                } else if (b.isPeak) {
                  pointColor = '#C98A3E'; // strong inflow
                  pointRadius = 4.5;
                } else if (b.isTax) {
                  pointColor = '#875205'; // tax quarter
                  pointRadius = 4;
                }

                return (
                  <circle
                    key={`pt-${idx}`}
                    cx={cx}
                    cy={cy}
                    r={pointRadius}
                    fill={pointColor}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
          </div>

          {/* 12-Month Baseline Grid Markers matching Google Stitch */}
          <div className="grid grid-cols-12 gap-1 pt-4 text-center font-mono text-xs hairline-t text-[#5C6D77]">
            {rollingBalances.map((b, idx) => (
              <div key={`m-${idx}`} className="py-1">
                <span className={`block font-semibold ${b.isLean ? 'text-[#B4573F]' : b.isPeak ? 'text-[#C98A3E]' : 'text-[#16232B]'}`}>
                  {b.month}
                </span>
                <span className="tabular-nums text-[11px]">
                  {currencySymbol}{Math.round(b.balance).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projection Takeaway Callout matching Google Stitch */}
      <div className="p-4 bg-[#E8EDE9] hairline-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center space-x-2.5">
          {hasDeficit ? (
            <AlertTriangle className="w-4 h-4 text-[#B4573F] shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#2F6F62] shrink-0" />
          )}
          <span className="font-sans text-[#16232B] leading-relaxed">
            <strong>Low Point Identification:</strong> {lowestMonthName} reaches the horizon floor balance of{' '}
            <strong className="font-mono">{currencySymbol}{Math.round(lowestBal).toLocaleString()}</strong>{' '}
            {hasDeficit ? 'requiring buffer draw' : 'before projected renewals replenish the working ledger'}.
          </span>
        </div>
        <span className={`font-mono text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap px-2 py-0.5 border ${
          hasDeficit
            ? 'border-[#B4573F]/40 bg-[#B4573F]/10 text-[#B4573F]'
            : 'border-[#2F6F62]/40 bg-[#2F6F62]/10 text-[#2F6F62]'
        }`}>
          {hasDeficit ? 'DEFICIT SQUEEZE RISK' : 'NO NEGATIVE DRAW DEFICIT'}
        </span>
      </div>
    </section>
  );
};
