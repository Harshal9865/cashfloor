'use client';

import React, { useState, useCallback } from 'react';
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, Legend, Cell,
} from 'recharts';
import { MonthlyRecord } from '../lib/calculator/types';
import { CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface CashFlowChartProps {
  records: MonthlyRecord[];
  floorIncome: number;
  avgExpenses: number;
  currentSavings?: number;
  bufferTarget?: number;
  taxReservePct?: number;
  currencySymbol?: string;
}

/* ── Custom rich tooltip ── */
const CustomTooltip = ({
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

  return (
    <div
      className="rounded-xl text-xs overflow-hidden"
      style={{
        background: 'var(--cf-surface)',
        border: '1px solid var(--cf-border)',
        boxShadow: 'var(--cf-shadow-lg)',
        minWidth: 200,
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Header */}
      <div className="px-4 py-2.5 font-semibold flex items-center justify-between"
        style={{ background: 'var(--cf-surface-alt)', borderBottom: '1px solid var(--cf-border)', color: 'var(--cf-text)' }}>
        <span>{label}</span>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
          isLean ? 'bg-[var(--cf-caution-bg)] text-[var(--cf-caution)]'
          : isSurplus ? 'bg-[var(--cf-warm-bg)] text-[var(--cf-warm)]'
          : 'bg-[var(--cf-accent-bg)] text-[var(--cf-accent)]'
        }`}>
          {isLean ? 'Lean' : isSurplus ? 'Surplus' : 'Stable'}
        </span>
      </div>

      {/* Body rows */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex justify-between items-center">
          <span style={{ color: 'var(--cf-text-muted)' }}>Income</span>
          <span className="font-mono font-semibold" style={{ color: 'var(--cf-accent)' }}>
            {currencySymbol}{income.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span style={{ color: 'var(--cf-text-muted)' }}>Expenses</span>
          <span className="font-mono font-semibold" style={{ color: 'var(--cf-caution)' }}>
            {currencySymbol}{expenses.toLocaleString()}
          </span>
        </div>
        <div className="h-px" style={{ background: 'var(--cf-border)' }} />
        <div className="flex justify-between items-center">
          <span style={{ color: 'var(--cf-text-muted)' }}>Net Flow</span>
          <span className={`font-mono font-bold ${netFlow >= 0 ? 'text-[var(--cf-accent)]' : 'text-[var(--cf-caution)]'}`}>
            {netFlow >= 0 ? '+' : ''}{currencySymbol}{netFlow.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span style={{ color: 'var(--cf-text-muted)' }}>Cash Balance</span>
          <span className="font-mono font-bold" style={{ color: 'var(--cf-text)' }}>
            {currencySymbol}{Math.round(balance).toLocaleString()}
          </span>
        </div>
        {isLean && (
          <div className="text-[10px] pt-1" style={{ color: 'var(--cf-caution)' }}>
            ⚠ Below income floor ({currencySymbol}{Math.round(floorIncome).toLocaleString()})
          </div>
        )}
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
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!records || records.length === 0) return null;

  // Build data
  let rolling = currentSavings;
  const data = records.map((r, idx) => {
    const tax = Math.round(r.income * taxReservePct);
    const net = r.income - tax - r.expenses;
    rolling += net;
    const isLean = r.income < floorIncome;
    const isPeak = r.income >= floorIncome * 1.4;

    return {
      month: r.month.length > 4 ? r.month.slice(0, 3) : r.month,
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

  const minBalance = Math.min(...data.map(d => d.balance), 0);
  const maxBalance = Math.max(...data.map(d => d.balance), bufferTarget * 1.2, 12000);
  const hasDeficit = minBalance < 0;
  const lowestMonth = data.reduce((a, b) => a.balance < b.balance ? a : b);

  const fmt = (v: number) => `${currencySymbol}${Math.round(v).toLocaleString()}`;

  return (
    <section
      className="space-y-5 transition-colors"
      style={{ background: 'var(--cf-surface)', padding: '1.5rem 2rem' }}
      id="cash-flow"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3"
        style={{ borderBottom: '1px solid var(--cf-border)', paddingBottom: '1rem' }}>
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight" style={{ color: 'var(--cf-text)' }}>
              12-Month Cash Flow
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border"
              style={{ color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border)', background: 'var(--cf-surface-alt)' }}>
              Hover any bar for detail
            </span>
          </div>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--cf-text-muted)' }}>
            Month-end cash balance vs. your <strong style={{ color: 'var(--cf-text)' }}>{fmt(floorIncome)}/mo</strong> income floor.
            Teal bars = above floor · Amber = below floor.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono shrink-0" style={{ color: 'var(--cf-text-muted)' }}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--cf-accent)' }} />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--cf-caution)' }} />
            <span>Expenses</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5" style={{ background: 'var(--cf-accent)', opacity: 0.8 }} />
            <span>Cash Balance</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseMove={(state) => {
              if (state.isTooltipActive) setActiveIdx(typeof state.activeTooltipIndex === 'number' ? state.activeTooltipIndex : null);
              else setActiveIdx(null);
            }}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--cf-border)" vertical={false} />

            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--cf-text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }}
              axisLine={{ stroke: 'var(--cf-border)' }}
              tickLine={false}
              interval={0}
            />

            <YAxis
              yAxisId="bars"
              tick={{ fill: 'var(--cf-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${currencySymbol}${(v / 1000).toFixed(0)}k`}
              width={45}
            />

            <YAxis
              yAxisId="line"
              orientation="right"
              domain={[minBalance * 0.9, maxBalance * 1.05]}
              tick={{ fill: 'var(--cf-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${currencySymbol}${(v / 1000).toFixed(0)}k`}
              width={45}
            />

            <Tooltip
              content={
                <CustomTooltip
                  currencySymbol={currencySymbol}
                  floorIncome={floorIncome}
                  bufferTarget={bufferTarget}
                />
              }
              cursor={{ fill: 'var(--cf-accent)', fillOpacity: 0.05 }}
            />

            {/* Reference lines */}
            <ReferenceLine
              yAxisId="line"
              y={bufferTarget}
              stroke="var(--cf-warm)"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{ value: 'Buffer target', fill: 'var(--cf-warm)', fontSize: 10, fontFamily: 'var(--font-mono)', position: 'insideTopLeft' }}
            />
            <ReferenceLine
              yAxisId="bars"
              y={floorIncome}
              stroke="var(--cf-accent)"
              strokeDasharray="5 4"
              strokeWidth={1.5}
              label={{ value: 'Income floor', fill: 'var(--cf-accent)', fontSize: 10, fontFamily: 'var(--font-mono)', position: 'insideTopLeft' }}
            />

            {/* Income bars */}
            <Bar yAxisId="bars" dataKey="income" name="Income" radius={[3, 3, 0, 0]} maxBarSize={28}>
              {data.map((entry, index) => (
                <Cell
                  key={`income-${index}`}
                  fill={entry.isLean ? 'var(--cf-warm)' : 'var(--cf-accent)'}
                  opacity={activeIdx === null || activeIdx === index ? 1 : 0.4}
                />
              ))}
            </Bar>

            {/* Expense bars */}
            <Bar yAxisId="bars" dataKey="expenses" name="Expenses" radius={[3, 3, 0, 0]} maxBarSize={20}>
              {data.map((_, index) => (
                <Cell
                  key={`exp-${index}`}
                  fill="var(--cf-caution)"
                  opacity={activeIdx === null || activeIdx === index ? 0.7 : 0.2}
                />
              ))}
            </Bar>

            {/* Cash balance line with area */}
            <Area
              yAxisId="line"
              type="monotone"
              dataKey="balance"
              name="Cash Balance"
              stroke="var(--cf-accent)"
              strokeWidth={2.5}
              fill="var(--cf-accent)"
              fillOpacity={0.06}
              dot={(props: any) => {
                const { cx, cy, index } = props;
                const d = data[index];
                const isActive = activeIdx === index;
                return (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={isActive ? 6 : 3.5}
                    fill={d.isLean ? 'var(--cf-warm)' : 'var(--cf-accent)'}
                    stroke="var(--cf-surface)"
                    strokeWidth={2}
                    style={{ transition: 'r 0.15s ease' }}
                  />
                );
              }}
              activeDot={{ r: 7, fill: 'var(--cf-accent)', stroke: 'var(--cf-surface)', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary callout */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border text-xs"
        style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
        <div className="flex items-start sm:items-center gap-2.5">
          {hasDeficit
            ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--cf-caution)' }} />
            : <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--cf-accent)' }} />
          }
          <span style={{ color: 'var(--cf-text-muted)' }}>
            <strong style={{ color: 'var(--cf-text)' }}>Lowest point:</strong>{' '}
            {lowestMonth.fullMonth} reaches{' '}
            <strong className="font-mono" style={{ color: 'var(--cf-text)' }}>
              {fmt(lowestMonth.balance)}
            </strong>
            {hasDeficit ? ' — buffer draw required' : ' before income replenishes reserves'}.
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full shrink-0"
          style={{
            background: hasDeficit ? 'var(--cf-caution-bg)' : 'var(--cf-accent-bg)',
            color: hasDeficit ? 'var(--cf-caution)' : 'var(--cf-accent)',
            border: `1px solid ${hasDeficit ? 'var(--cf-caution)' : 'var(--cf-accent)'}33`,
          }}>
          {hasDeficit ? 'Deficit Risk' : 'No Deficit'}
        </span>
      </div>
    </section>
  );
};
