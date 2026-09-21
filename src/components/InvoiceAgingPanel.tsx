'use client';

import React from 'react';
import { DSOMetrics } from '../lib/calculator/types';
import { Clock, AlertCircle, CheckCircle2, TrendingDown, FileText } from 'lucide-react';

interface InvoiceAgingPanelProps {
  dso: DSOMetrics;
  currencySymbol?: string;
}

const BUCKET_COLORS = {
  healthy: { bg: 'var(--cf-accent-bg)', text: 'var(--cf-accent)', border: 'var(--cf-accent)' },
  watch: { bg: 'rgba(201,138,62,0.1)', text: '#875205', border: '#C98A3E' },
  critical: { bg: 'rgba(180,87,63,0.12)', text: '#B4573F', border: '#B4573F' },
};

export const InvoiceAgingPanel: React.FC<InvoiceAgingPanelProps> = ({
  dso,
  currencySymbol = '$',
}) => {
  const hasData = dso.dso > 0 || dso.totalOutstanding > 0 || dso.agingBuckets.some(b => b.count > 0);

  const dsoColor =
    dso.dsoRating === 'healthy'
      ? 'var(--cf-accent)'
      : dso.dsoRating === 'lagging'
      ? '#C98A3E'
      : '#B4573F';

  const StatusIcon =
    dso.dsoRating === 'healthy'
      ? CheckCircle2
      : dso.dsoRating === 'lagging'
      ? Clock
      : AlertCircle;

  return (
    <section
      className="space-y-5 transition-colors rounded-2xl border p-6"
      style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
      id="invoice-aging"
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b"
        style={{ borderColor: 'var(--cf-border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4" style={{ color: 'var(--cf-accent)' }} />
            <h2
              className="font-serif text-lg font-normal tracking-tight"
              style={{ color: 'var(--cf-text)' }}
            >
              Invoice Aging & DSO Tracker
            </h2>
          </div>
          <p className="text-xs" style={{ color: 'var(--cf-text-muted)' }}>
            Days Sales Outstanding — how long before invoices actually convert to cash.
          </p>
        </div>

        {hasData && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border shrink-0"
            style={{
              color: dsoColor,
              borderColor: `${dsoColor}44`,
              background: `${dsoColor}11`,
            }}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            <span className="font-semibold uppercase tracking-wider">
              {dso.dsoRating}
            </span>
          </div>
        )}
      </div>

      {!hasData ? (
        /* Empty state */
        <div
          className="text-center py-8 rounded-xl border-2 border-dashed"
          style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-text-muted)' }}
        >
          <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium" style={{ color: 'var(--cf-text)' }}>
            No invoice dates entered
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--cf-text-muted)' }}>
            Add invoice sent/paid dates to your ledger rows to track real cash lag.
          </p>
        </div>
      ) : (
        <>
          {/* DSO KPI Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              className="p-3 rounded-xl border text-center"
              style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}
            >
              <p
                className="font-mono text-2xl font-bold tabular-nums"
                style={{ color: dsoColor }}
              >
                {dso.dso}
              </p>
              <p
                className="text-[10px] font-mono uppercase tracking-wider mt-0.5"
                style={{ color: 'var(--cf-text-muted)' }}
              >
                DSO (days)
              </p>
            </div>

            <div
              className="p-3 rounded-xl border text-center"
              style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}
            >
              <p
                className="font-mono text-2xl font-bold tabular-nums"
                style={{ color: 'var(--cf-text)' }}
              >
                {dso.adjustedRunwayMonths}
              </p>
              <p
                className="text-[10px] font-mono uppercase tracking-wider mt-0.5"
                style={{ color: 'var(--cf-text-muted)' }}
              >
                Real Runway (mo)
              </p>
            </div>

            <div
              className="p-3 rounded-xl border text-center col-span-2 sm:col-span-1"
              style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}
            >
              <p
                className="font-mono text-2xl font-bold tabular-nums"
                style={{ color: dso.totalOutstanding > 0 ? '#C98A3E' : 'var(--cf-accent)' }}
              >
                {currencySymbol}{dso.totalOutstanding.toLocaleString()}
              </p>
              <p
                className="text-[10px] font-mono uppercase tracking-wider mt-0.5"
                style={{ color: 'var(--cf-text-muted)' }}
              >
                Outstanding A/R
              </p>
            </div>
          </div>

          {/* Aging Buckets */}
          {dso.agingBuckets.some(b => b.count > 0) && (
            <div className="space-y-2">
              <p
                className="text-[10px] font-mono uppercase tracking-wider font-semibold"
                style={{ color: 'var(--cf-text-muted)' }}
              >
                Receivables Aging Schedule
              </p>
              {dso.agingBuckets.map((bucket) => {
                const colors = BUCKET_COLORS[bucket.risk];
                if (bucket.count === 0) return null;
                return (
                  <div
                    key={bucket.bucket}
                    className="flex items-center justify-between p-3 rounded-lg border text-xs"
                    style={{
                      background: colors.bg,
                      borderColor: `${colors.border}44`,
                      color: colors.text,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: colors.border }}
                      />
                      <span className="font-mono font-semibold">{bucket.bucket}</span>
                      <span style={{ color: 'var(--cf-text-muted)' }}>
                        ({bucket.count} invoice{bucket.count !== 1 ? 's' : ''})
                      </span>
                    </div>
                    <span className="font-mono font-bold">
                      {currencySymbol}{bucket.totalOutstanding.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Insight One-Liner */}
          <div
            className="flex items-start gap-2 p-3 rounded-xl border text-xs"
            style={{
              background: dso.dsoRating === 'healthy' ? 'var(--cf-accent-bg)' : 'rgba(201,138,62,0.08)',
              borderColor: dso.dsoRating === 'healthy' ? 'var(--cf-accent)' + '33' : '#C98A3E44',
              color: 'var(--cf-text)',
            }}
          >
            <TrendingDown className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: dsoColor }} />
            <span className="leading-relaxed">{dso.description}</span>
          </div>
        </>
      )}
    </section>
  );
};
