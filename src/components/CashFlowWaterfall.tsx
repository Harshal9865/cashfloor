'use client';

import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Cell, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { WaterfallStep } from '../lib/calculator/types';
import { Info } from 'lucide-react';

interface CashFlowWaterfallProps {
  steps: WaterfallStep[];
  currencySymbol?: string;
}

/* ── Step descriptions for the tooltip ── */
const STEP_DESCRIPTIONS: Record<string, string> = {
  'Gross Income': 'Total amount invoiced this period before any deductions.',
  'Tax Escrow': 'Strictly reserved for income tax — never touched for operations.',
  'Floor Income': 'Your 20th-percentile baseline. The minimum your lifestyle can cost.',
  'Buffer Contribution': 'Monthly deposit towards your 3.5-month survival buffer.',
  'Owner\'s Draw': 'What\'s left after taxes, floor, and buffer. Guilt-free to spend.',
  'Deficit Reserve': 'Allocated to cover any shortfall below your income floor.',
};

const CustomTooltip = ({ active, payload, currencySymbol }: any) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  const isDeduction = d.type === 'deduction' || d.type === 'allocation';
  const desc = STEP_DESCRIPTIONS[d.label] || d.description || '';

  return (
    <div className="rounded-xl overflow-hidden text-xs"
      style={{
        background: 'var(--cf-surface)',
        border: '1px solid var(--cf-border)',
        boxShadow: 'var(--cf-shadow-lg)',
        minWidth: 220,
        fontFamily: 'var(--font-sans)',
      }}>
      <div className="px-4 py-2.5 font-semibold flex items-center gap-2"
        style={{ background: 'var(--cf-surface-alt)', borderBottom: '1px solid var(--cf-border)', color: 'var(--cf-text)' }}>
        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
        {d.label}
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="flex justify-between items-center">
          <span style={{ color: 'var(--cf-text-muted)' }}>Amount</span>
          <span className="font-mono font-bold"
            style={{ color: isDeduction ? 'var(--cf-caution)' : 'var(--cf-accent)' }}>
            {isDeduction && d.amount < 0 ? '-' : '+'}{currencySymbol}{Math.abs(Math.round(d.amount)).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span style={{ color: 'var(--cf-text-muted)' }}>Running total</span>
          <span className="font-mono" style={{ color: 'var(--cf-text)' }}>
            {currencySymbol}{Math.max(0, Math.round(d.runningTotal)).toLocaleString()}
          </span>
        </div>
        {d.percentage != null && (
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--cf-text-muted)' }}>% of gross</span>
            <span className="font-mono" style={{ color: 'var(--cf-text)' }}>
              {d.percentage}%
            </span>
          </div>
        )}
        {desc && (
          <div className="pt-2 text-[11px] leading-relaxed" style={{ color: 'var(--cf-text-faint)', borderTop: '1px solid var(--cf-border)' }}>
            {desc}
          </div>
        )}
      </div>
    </div>
  );
};

export const CashFlowWaterfall: React.FC<CashFlowWaterfallProps> = ({
  steps,
  currencySymbol = '$',
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!steps || steps.length === 0) return null;

  const gross = steps.find(s => s.type === 'inflow')?.amount ?? steps[0].amount;

  // Enrich data with percentage
  const data = steps.map(s => ({
    ...s,
    percentage: gross ? Math.round((Math.abs(s.amount) / gross) * 100) : null,
    absAmount: Math.abs(s.amount),
  }));

  const maxAmount = Math.max(...data.map(d => d.absAmount), 1000);

  return (
    <section
      className="space-y-5 transition-colors"
      style={{ background: 'var(--cf-surface)', padding: '1.5rem 2rem' }}
      id="waterfall"
    >
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--cf-border)', paddingBottom: '1rem' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight" style={{ color: 'var(--cf-text)' }}>
                Money Allocation Breakdown
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border"
                style={{ color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border)', background: 'var(--cf-surface-alt)' }}>
                Hover to explore
              </span>
            </div>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--cf-text-muted)' }}>
              How every dollar you earn gets allocated — taxes first, then survival floor, then buffer, then your take-home.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold shrink-0" style={{ color: 'var(--cf-accent)' }}>
            100% Accounted For
          </span>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 80, left: 0, bottom: 0 }}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--cf-border)" horizontal={false} />

            <XAxis
              type="number"
              tick={{ fill: 'var(--cf-text-muted)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${currencySymbol}${(v / 1000).toFixed(0)}k`}
            />

            <YAxis
              type="category"
              dataKey="label"
              width={120}
              tick={{ fill: 'var(--cf-text)', fontSize: 11, fontFamily: 'var(--font-sans)', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={<CustomTooltip currencySymbol={currencySymbol} />}
              cursor={{ fill: 'var(--cf-accent)', fillOpacity: 0.04 }}
            />

            <Bar
              dataKey="absAmount"
              name="Amount"
              radius={[0, 4, 4, 0]}
              onMouseEnter={(_, index) => setActiveIdx(index)}
              label={{
                position: 'right' as const,
                formatter: (v: any) => `${currencySymbol}${Math.round(Number(v)).toLocaleString()}`,
                fill: 'var(--cf-text-muted)',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`wf-${index}`}
                  fill={entry.color}
                  opacity={activeIdx === null || activeIdx === index ? 1 : 0.4}
                  style={{ transition: 'opacity 0.15s ease', cursor: 'pointer' }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Compact step list (visible on all sizes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {data.map((step, i) => {
          const isDeduction = step.type === 'deduction' || step.type === 'allocation';
          return (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all cursor-default gap-2"
              style={{
                borderColor: activeIdx === i ? step.color : 'var(--cf-border)',
                background: activeIdx === i ? `${step.color}0D` : 'var(--cf-surface-alt)',
              }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              onTouchStart={() => setActiveIdx(i)}
              onTouchEnd={() => setActiveIdx(null)}
            >
              <div className="flex items-center gap-2.5 text-xs flex-1 min-w-0">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: step.color }} />
                <span className="truncate" style={{ color: 'var(--cf-text)' }}>{step.label}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                <span style={{ color: isDeduction ? 'var(--cf-caution)' : 'var(--cf-accent)', fontWeight: 600 }}>
                  {isDeduction && step.amount < 0 ? '-' : '+'}{currencySymbol}{Math.abs(Math.round(step.amount)).toLocaleString()}
                </span>
                {step.percentage != null && (
                  <span className="text-[10px] hidden sm:inline" style={{ color: 'var(--cf-text-faint)' }}>
                    {step.percentage}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 text-xs" style={{ color: 'var(--cf-text-faint)' }}>
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--cf-accent)' }} />
        Taxes and survival costs are partitioned before any discretionary spending. Touch or hover any row to inspect.
      </div>
    </section>
  );
};
