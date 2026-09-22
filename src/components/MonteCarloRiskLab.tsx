'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MonteCarloResult, VolatilityMetrics } from '../lib/calculator/types';
import { runMonteCarloSimulation } from '../lib/calculator/montecarlo';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Lock, Activity, Loader2, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

interface MonteCarloRiskLabProps {
  volatility: VolatilityMetrics;
  monthlyExpenses: number;
  currentSavings: number;
  currencySymbol?: string;
  isLocked?: boolean;
  onUnlockRequest?: () => void;
}

const SIGNAL_CONFIG = {
  SAFE: {
    color: 'var(--cf-accent)',
    bg: 'var(--cf-accent-bg)',
    icon: ShieldCheck,
    label: 'SAFE',
  },
  CAUTION: {
    color: '#C98A3E',
    bg: 'rgba(201,138,62,0.1)',
    icon: AlertTriangle,
    label: 'CAUTION',
  },
  CRITICAL: {
    color: '#B4573F',
    bg: 'rgba(180,87,63,0.1)',
    icon: AlertOctagon,
    label: 'CRITICAL',
  },
};

export const MonteCarloRiskLab: React.FC<MonteCarloRiskLabProps> = ({
  volatility,
  monthlyExpenses,
  currentSavings,
  currencySymbol = '$',
  isLocked = false,
  onUnlockRequest,
}) => {
  const [result, setResult] = useState<MonteCarloResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSimulation = useCallback(() => {
    if (volatility.meanIncome <= 0) return;
    setIsRunning(true);

    // Defer to next tick so the loading state renders
    setTimeout(() => {
      const res = runMonteCarloSimulation(
        volatility.meanIncome,
        volatility.standardDeviation,
        monthlyExpenses,
        currentSavings,
        12,
        10000,
      );
      setResult(res);
      setIsRunning(false);
    }, 50);
  }, [volatility.meanIncome, volatility.standardDeviation, monthlyExpenses, currentSavings]);

  // Auto-run whenever key inputs change
  useEffect(() => {
    if (!isLocked) runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volatility.meanIncome, volatility.standardDeviation, monthlyExpenses, currentSavings, isLocked]);

  const signal = result ? SIGNAL_CONFIG[result.riskSignal] : null;
  const SignalIcon = signal?.icon;

  // Chart data: probability at each month for P5, P50, P95
  const chartData = result
    ? result.survivalProbabilities.slice(1).map((d) => ({
        month: `Mo ${d.month}`,
        probability: d.probability,
      }))
    : [];

  return (
    <section
      className="flex flex-col w-full min-w-0 space-y-5 transition-colors relative"
      id="monte-carlo"
    >
      {/* Lock overlay */}
      {isLocked && (
        <div
          className="absolute inset-0 z-20 rounded-2xl flex items-center justify-center backdrop-blur-md"
          style={{ background: 'var(--cf-surface)', opacity: 0.97 }}
        >
          <div className="text-center space-y-3 p-8 max-w-xs">
            <div
              className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
              style={{ background: 'var(--cf-surface-alt)', border: '1px solid var(--cf-border)' }}
            >
              <Lock className="w-5 h-5 text-[#2F6F62]" />
            </div>
            <div>
              <span
                className="inline-flex items-center text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold mb-1"
                style={{
                  background: 'var(--cf-accent-bg)',
                  color: 'var(--cf-accent)',
                  border: '1px solid var(--cf-accent)33',
                }}
              >
                PRO FEATURE
              </span>
              <h3
                className="font-serif text-lg font-medium"
                style={{ color: 'var(--cf-text)' }}
              >
                Monte Carlo Risk Lab
              </h3>
              <p
                className="text-xs mt-1 leading-relaxed"
                style={{ color: 'var(--cf-text-muted)' }}
              >
                Run 10,000 income simulations to get your real probability of financial survival.
              </p>
            </div>
            <button
              type="button"
              onClick={onUnlockRequest}
              className="px-5 py-2 rounded-full text-xs font-semibold text-white transition-all shadow-sm cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
            >
              Unlock — Sign In Free
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b"
        style={{ borderColor: 'var(--cf-border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Activity className="w-4 h-4" style={{ color: 'var(--cf-accent)' }} />
            <h2
              className="font-serif text-base font-normal tracking-tight"
              style={{ color: 'var(--cf-text)' }}
            >
              Monte Carlo Risk Lab
            </h2>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--cf-text-muted)' }}>
            10,000 stochastic income simulations — probability of financial survival.
          </p>
        </div>

        {signal && SignalIcon && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold border shrink-0"
            style={{ color: signal.color, background: signal.bg, borderColor: `${signal.color}44` }}
          >
            <SignalIcon className="w-3.5 h-3.5" />
            {signal.label}
          </div>
        )}
      </div>

      {/* Loading state */}
      {isRunning && (
        <div className="flex items-center justify-center py-10 gap-2" style={{ color: 'var(--cf-text-muted)' }}>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs font-mono">Running 10,000 simulations…</span>
        </div>
      )}

      {/* Results */}
      {!isRunning && result && (
        <>
          {/* Probability KPIs */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: '3-Month', value: result.probabilityOfSurviving3Months },
              { label: '6-Month', value: result.probabilityOfSurviving6Months },
              { label: '12-Month', value: result.probabilityOfSurviving12Months },
            ].map(({ label, value }) => {
              const color = value >= 75 ? 'var(--cf-accent)' : value >= 40 ? '#C98A3E' : '#B4573F';
              return (
                <div
                  key={label}
                  className="p-2.5 rounded-xl border text-center"
                  style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}
                >
                  <p
                    className="font-mono text-xl font-bold tabular-nums"
                    style={{ color }}
                  >
                    {value}%
                  </p>
                  <p
                    className="text-[9px] font-mono uppercase tracking-wider mt-0.5"
                    style={{ color: 'var(--cf-text-muted)' }}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Fan chart — survival probability over 12 months */}
          <div style={{ height: 180 }}>
            <p
              className="text-[10px] font-mono uppercase tracking-wider mb-2"
              style={{ color: 'var(--cf-text-muted)' }}
            >
              Survival Probability (%) — Month-by-Month
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="mcGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F6F62" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2F6F62" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cf-border)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--cf-text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: 'var(--cf-text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <ReferenceLine y={75} stroke="#2F6F62" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'SAFE', fill: '#2F6F62', fontSize: 9 }} />
                <ReferenceLine y={40} stroke="#C98A3E" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'CAUTION', fill: '#C98A3E', fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--cf-surface)',
                    border: '1px solid var(--cf-border)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: 'var(--cf-text)',
                  }}
                  formatter={(value: unknown) => [`${value as number}%`, 'Survival Probability']}
                />
                <Area
                  type="monotone"
                  dataKey="probability"
                  stroke="#2F6F62"
                  strokeWidth={2}
                  fill="url(#mcGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Percentile Runway Bands */}
          <div
            className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-xl border"
            style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}
          >
            <div>
              <p className="font-mono font-bold text-sm" style={{ color: '#B4573F' }}>
                {result.p5RunwayMonths}mo
              </p>
              <p className="text-[10px] font-mono" style={{ color: 'var(--cf-text-muted)' }}>P5 worst</p>
            </div>
            <div>
              <p className="font-mono font-bold text-sm" style={{ color: 'var(--cf-text)' }}>
                {result.p50RunwayMonths}mo
              </p>
              <p className="text-[10px] font-mono" style={{ color: 'var(--cf-text-muted)' }}>P50 median</p>
            </div>
            <div>
              <p className="font-mono font-bold text-sm" style={{ color: 'var(--cf-accent)' }}>
                {result.p95RunwayMonths}mo
              </p>
              <p className="text-[10px] font-mono" style={{ color: 'var(--cf-text-muted)' }}>P95 best</p>
            </div>
          </div>

          {/* One-liner */}
          <p className="text-xs leading-relaxed" style={{ color: 'var(--cf-text-muted)' }}>
            {result.description}
          </p>
        </>
      )}

      {/* No data */}
      {!isRunning && !result && !isLocked && (
        <p className="text-xs text-center py-6" style={{ color: 'var(--cf-text-muted)' }}>
          Enter income data to run Monte Carlo simulation.
        </p>
      )}
    </section>
  );
};
