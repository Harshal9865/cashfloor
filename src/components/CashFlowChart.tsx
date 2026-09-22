'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend, Cell,
} from 'recharts';
import { MonthlyRecord } from '../lib/calculator/types';
import { CheckCircle2, AlertTriangle, TrendingUp, Calendar, Zap, Activity } from 'lucide-react';

interface CashFlowChartProps {
  records: MonthlyRecord[];
  floorIncome: number;
  avgExpenses: number;
  currentSavings?: number;
  bufferTarget?: number;
  taxReservePct?: number;
  currencySymbol?: string;
  initialViewMode?: '12_months' | '30_days' | '90_drought';
}

/* ── Custom rich tooltip for Monthly View ── */
const CustomMonthlyTooltip = ({
  active,
  payload,
  label,
  currencySymbol,
  floorIncome,
  bufferTarget,
}: any) => {
  if (!active || !payload || !payload.length) return null;

  const income = payload.find((p: any) => p.dataKey === 'income')?.value ?? 0;
  const expenses = payload.find((p: any) => p.dataKey === 'expenses')?.value ?? 0;
  const balance = payload.find((p: any) => p.dataKey === 'balance')?.value ?? 0;
  const netFlow = income - expenses;
  const isLean = income < floorIncome;
  const isSurplus = balance > bufferTarget;
  const floorDelta = income - floorIncome;

  return (
    <div
      className="rounded-xl text-xs overflow-hidden bg-cf-surface border border-cf-border shadow-lg min-w-[200px] font-sans"
    >
      <div className="px-4 py-2.5 font-semibold flex items-center justify-between border-b border-cf-border bg-cf-surface-alt text-cf-text">
        <span>{label}</span>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
          isLean ? 'bg-cf-caution-bg text-cf-caution'
          : isSurplus ? 'bg-cf-warm-bg text-cf-warm'
          : 'bg-cf-accent-bg text-cf-accent'
        }`}>
          {isLean ? 'Lean' : isSurplus ? 'Surplus' : 'Stable'}
        </span>
      </div>

      <div className="px-4 py-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-cf-text-muted">Income</span>
          <span className="font-mono font-semibold text-cf-accent">
            {currencySymbol}{income.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-cf-text-muted">Expenses</span>
          <span className="font-mono font-semibold text-cf-caution">
            {currencySymbol}{expenses.toLocaleString()}
          </span>
        </div>
        <div className="h-px bg-cf-border" />
        <div className="flex justify-between items-center">
          <span className="text-cf-text-muted">Net Flow</span>
          <span className={`font-mono font-bold ${netFlow >= 0 ? 'text-cf-accent' : 'text-cf-caution'}`}>
            {netFlow >= 0 ? '+' : ''}{currencySymbol}{netFlow.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-cf-text-muted">Cash Balance</span>
          <span className="font-mono font-bold text-cf-text">
            {currencySymbol}{Math.round(balance).toLocaleString()}
          </span>
        </div>
        
        <div className="pt-2 border-t mt-2 border-cf-border-soft">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-cf-text-faint">Vs. Survival Floor:</span>
            <span className={`font-mono font-bold ${floorDelta >= 0 ? 'text-cf-accent' : 'text-cf-caution'}`}>
              {floorDelta >= 0 ? '+' : ''}{currencySymbol}{Math.round(floorDelta).toLocaleString()}
            </span>
          </div>
          {isLean && (
            <div className="text-[10px] pt-1 text-cf-caution">
              ⚠ Below income floor ({currencySymbol}{Math.round(floorIncome).toLocaleString()})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Custom rich tooltip for Daily View ── */
const CustomDailyTooltip = ({
  active,
  payload,
  label,
  currencySymbol,
  dailyFloor,
}: any) => {
  if (!active || !payload || !payload.length) return null;

  const inflow = payload.find((p: any) => p.dataKey === 'inflow')?.value ?? 0;
  const outflow = payload.find((p: any) => p.dataKey === 'outflow')?.value ?? 0;
  const balance = payload.find((p: any) => p.dataKey === 'balance')?.value ?? 0;
  const net = inflow - outflow;

  return (
    <div
      className="rounded-xl text-xs overflow-hidden bg-cf-surface border border-cf-border shadow-lg min-w-[210px] font-sans"
    >
      <div className="px-4 py-2 font-semibold flex items-center justify-between border-b bg-cf-surface-alt border-cf-border text-cf-text">
        <span>Day {label}</span>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
          inflow > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-cf-surface text-cf-text-muted'
        }`}>
          {inflow > 0 ? 'Payment Inflow' : 'Daily Burn'}
        </span>
      </div>

      <div className="px-4 py-3 space-y-1.5 font-mono">
        {inflow > 0 && (
          <div className="flex justify-between items-center text-emerald-600">
            <span>Inflow:</span>
            <span className="font-bold">+{currencySymbol}{inflow.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between items-center text-cf-text-muted">
          <span>Daily Outflow:</span>
          <span className="text-cf-caution">-{currencySymbol}{Math.round(outflow).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center border-t border-cf-border-soft pt-1">
          <span className="text-cf-text-faint">Net Delta:</span>
          <span className={net >= 0 ? 'text-emerald-500 font-bold' : 'text-cf-caution font-bold'}>
            {net >= 0 ? '+' : ''}{currencySymbol}{Math.round(net).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center border-t border-cf-border-soft pt-1">
          <span className="text-cf-text font-semibold font-sans">Day-End Cash:</span>
          <span className="font-bold text-cf-text">{currencySymbol}{Math.round(balance).toLocaleString()}</span>
        </div>
        <div className="text-[9px] text-cf-text-faint pt-0.5">
          Daily Survival Floor: {currencySymbol}{Math.round(dailyFloor)}/day
        </div>
      </div>
    </div>
  );
};

export const CashFlowChart: React.FC<CashFlowChartProps> = ({
  records,
  floorIncome,
  avgExpenses,
  currentSavings = 8820,
  bufferTarget = 7350,
  taxReservePct = 0.25,
  currencySymbol = '$',
  initialViewMode = '12_months',
}) => {
  const [viewMode, setViewMode] = useState<'12_months' | '30_days' | '90_drought'>(initialViewMode);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!records || records.length === 0) return null;

  const dailyFloor = floorIncome / 30.4167;
  const dailyBurn = avgExpenses / 30.4167;

  // 1. Monthly Macro Data
  const monthlyData = useMemo(() => {
    let rolling = currentSavings;
    return records.map((r) => {
      const tax = Math.round(r.income * taxReservePct);
      const net = r.income - tax - r.expenses;
      rolling += net;
      const isLean = r.income < floorIncome;
      const isPeak = r.income >= floorIncome * 1.4;

      return {
        label: r.month.length > 4 ? r.month.slice(0, 3) : r.month,
        fullMonth: r.month,
        income: r.income,
        expenses: r.expenses,
        tax,
        balance: Math.round(rolling),
        netFlow: net,
        isLean,
        isPeak,
      };
    });
  }, [records, currentSavings, taxReservePct, floorIncome]);

  // 2. 30-Day Daily Micro Data
  const dailyData = useMemo(() => {
    let rollingDaily = currentSavings;
    
    // Distribute actual inflows across the month
    const dailyInflowEvents: Record<number, number> = {
      3: 3200,   // Retainer 1
      12: 4500,  // Milestone 2
      15: 680,   // Platform payout
      22: 1200,  // Advisory call
    };

    return Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      const inflow = dailyInflowEvents[day] || 0;
      // Fixed daily baseline burn plus rent on day 1
      const outflow = day === 1 ? dailyBurn + 1400 : dailyBurn;
      const net = inflow - outflow;
      rollingDaily += net;

      return {
        label: `${day}`,
        day,
        inflow,
        outflow: Math.round(outflow),
        balance: Math.round(rollingDaily),
        netFlow: Math.round(net),
      };
    });
  }, [currentSavings, dailyBurn]);

  // 3. 90-Day Drought Exhaustion Forecast Data
  const droughtData = useMemo(() => {
    let rolling = currentSavings;
    return Array.from({ length: 90 }, (_, i) => {
      const day = i + 1;
      rolling = Math.max(0, rolling - dailyBurn);
      return {
        label: day % 15 === 0 ? `D${day}` : '',
        day,
        balance: Math.round(rolling),
        burn: Math.round(dailyBurn),
      };
    });
  }, [currentSavings, dailyBurn]);

  const fmt = (v: number) => `${currencySymbol}${Math.round(v).toLocaleString()}`;

  if (!records || records.length === 0) {
    return (
      <section className="space-y-5 transition-colors bg-cf-surface px-8 py-6 rounded-2xl border border-cf-border">
        <div className="w-full h-[320px] rounded-2xl bg-cf-surface-alt/40 flex flex-col items-center justify-center text-xs font-mono text-cf-text-muted gap-4">
          <Activity className="w-8 h-8 text-cf-border" />
          <span>No ledger records found. Add transactions to generate your cash flow forecast.</span>
        </div>
      </section>
    );
  }

  return (
    <section
      className="space-y-5 transition-colors bg-cf-surface px-8 py-6 rounded-2xl border border-cf-border"
      id="cash-flow"
    >
      {/* Header with Granularity Switcher */}
      <div 
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--cf-border)]"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight text-[var(--cf-text)]">
              {viewMode === '12_months' && '12-Month Macro Cash Flow'}
              {viewMode === '30_days' && '30-Day Daily Micro Variations'}
              {viewMode === '90_drought' && '90-Day Zero-Income Drought Forecast'}
            </h2>

            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)]">
              {viewMode === '30_days' ? 'Daily Resolution Active' : 'Interactive Timeline'}
            </span>
          </div>

          <p className="text-xs mt-1 leading-relaxed text-[var(--cf-text-muted)]">
            {viewMode === '12_months' && `Month-end liquidity vs. your ${fmt(floorIncome)}/mo conservative floor.`}
            {viewMode === '30_days' && `Daily cash trajectory: daily living burn (${fmt(dailyFloor)}/day floor) with payment arrival spikes.`}
            {viewMode === '90_drought' && 'Continuous daily cash drain if all incoming client payments freeze for 90 days.'}
          </p>
        </div>

        {/* ── Granularity Mode Switcher Tabs ── */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('12_months')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              viewMode === '12_months'
                ? 'bg-[var(--cf-surface)] text-[var(--cf-text)] font-semibold shadow-sm border border-[var(--cf-border)]'
                : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
            }`}
          >
            12-Month
          </button>

          <button
            type="button"
            onClick={() => setViewMode('30_days')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === '30_days'
                ? 'bg-[var(--cf-surface)] text-[var(--cf-accent)] font-semibold shadow-sm border border-[var(--cf-accent)]/30'
                : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
            }`}
          >
            <Zap className="w-3 h-3 text-[var(--cf-accent)]" />
            <span>30-Day Daily</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('90_drought')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
              viewMode === '90_drought'
                ? 'bg-[var(--cf-surface)] text-[var(--cf-caution)] font-semibold shadow-sm border border-[var(--cf-caution)]/30'
                : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
            }`}
          >
            90-Day Drought
          </button>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[var(--cf-text-muted)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[var(--cf-accent)]" />
            <span>{viewMode === '30_days' ? 'Daily Inflow' : 'Monthly Income'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[var(--cf-caution)]" />
            <span>{viewMode === '30_days' ? 'Daily Outflow' : 'Expenses'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-[var(--cf-accent)] opacity-80" />
            <span>Liquid Cash Balance</span>
          </div>
        </div>

        <div className="text-[11px] font-mono text-[var(--cf-text-faint)]">
          {viewMode === '30_days' ? `Daily Floor: ${fmt(dailyFloor)}/day` : `Monthly Floor: ${fmt(floorIncome)}/mo`}
        </div>
      </div>

      {/* ── Dynamic Chart Rendering ── */}
      <div style={{ width: '100%', height: 320 }}>
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === '12_months' ? (
              <ComposedChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cf-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--cf-text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={{ stroke: 'var(--cf-border)' }} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: 'var(--cf-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickFormatter={(v) => `${currencySymbol}${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`} axisLine={false} tickLine={false} width={40} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--cf-text-faint)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickFormatter={(v) => `${currencySymbol}${Math.round(v / 1000)}k`} axisLine={false} tickLine={false} width={45} />
                <Tooltip content={<CustomMonthlyTooltip currencySymbol={currencySymbol} floorIncome={floorIncome} bufferTarget={bufferTarget} />} />
                <ReferenceLine yAxisId="left" y={floorIncome} stroke="var(--cf-accent)" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: `Floor ${fmt(floorIncome)}`, fill: 'var(--cf-accent)', fontSize: 10, fontFamily: 'var(--font-mono)', position: 'insideTopLeft' }} />
                <Bar yAxisId="left" dataKey="income" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  {monthlyData.map((entry, idx) => (
                    <Cell key={`bar-${idx}`} fill={entry.isLean ? 'var(--cf-warm)' : 'var(--cf-accent)'} opacity={0.88} />
                  ))}
                </Bar>
                <Bar yAxisId="left" dataKey="expenses" fill="var(--cf-caution)" opacity={0.35} radius={[3, 3, 0, 0]} maxBarSize={16} />
                <Line yAxisId="right" type="monotone" dataKey="balance" stroke="var(--cf-accent)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--cf-surface)', stroke: 'var(--cf-accent)', strokeWidth: 2 }} activeDot={{ r: 5, fill: 'var(--cf-accent)' }} />
              </ComposedChart>
            ) : viewMode === '30_days' ? (
              <ComposedChart data={dailyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cf-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--cf-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} interval={2} axisLine={{ stroke: 'var(--cf-border)' }} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: 'var(--cf-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickFormatter={(v) => `${currencySymbol}${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`} axisLine={false} tickLine={false} width={42} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--cf-text-faint)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickFormatter={(v) => `${currencySymbol}${Math.round(v / 1000)}k`} axisLine={false} tickLine={false} width={45} />
                <Tooltip content={<CustomDailyTooltip currencySymbol={currencySymbol} dailyFloor={dailyFloor} />} />
                <ReferenceLine yAxisId="left" y={dailyFloor} stroke="var(--cf-accent)" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: `Floor ${fmt(dailyFloor)}/d`, fill: 'var(--cf-accent)', fontSize: 9, fontFamily: 'var(--font-mono)', position: 'insideTopLeft' }} />
                <Bar yAxisId="left" dataKey="inflow" fill="#3DE8C8" radius={[3, 3, 0, 0]} maxBarSize={14} />
                <Bar yAxisId="left" dataKey="outflow" fill="var(--cf-caution)" opacity={0.4} radius={[2, 2, 0, 0]} maxBarSize={10} />
                <Line yAxisId="right" type="monotone" dataKey="balance" stroke="var(--cf-accent)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: 'var(--cf-accent)' }} />
              </ComposedChart>
            ) : (
              <ComposedChart data={droughtData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--cf-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: 'var(--cf-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={{ stroke: 'var(--cf-border)' }} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--cf-text-faint)', fontSize: 10, fontFamily: 'var(--font-mono)' }} tickFormatter={(v) => `${currencySymbol}${Math.round(v / 1000)}k`} axisLine={false} tickLine={false} width={45} />
                <Tooltip formatter={(v: any) => [`${currencySymbol}${Number(v).toLocaleString()}`, 'Remaining Cash']} />
                <ReferenceLine yAxisId="right" y={0} stroke="var(--cf-caution)" strokeWidth={2} label={{ value: 'Exhaustion Line ($0)', fill: 'var(--cf-caution)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                <Area yAxisId="right" type="monotone" dataKey="balance" stroke="var(--cf-caution)" fill="rgba(180,87,63,0.15)" strokeWidth={2} />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full rounded-2xl bg-[var(--cf-surface-alt)]/40 animate-pulse flex items-center justify-center text-xs font-mono text-[var(--cf-text-muted)]">
            <span>Synchronizing Solvency Trajectory...</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CashFlowChart;
