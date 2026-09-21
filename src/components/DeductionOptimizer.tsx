'use client';

import React, { useState } from 'react';
import { DeductionCategory, TaxOptimizationResult } from '../lib/calculator/types';
import { calculateTaxSavings, DEFAULT_DEDUCTION_CATEGORIES } from '../lib/calculator/deductions';
import { Receipt, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface DeductionOptimizerProps {
  grossAnnualIncome: number;
  nominalTaxRate: number;           // current taxReservePct e.g. 0.25
  monthlyExpenses: number;
  runwayMonths: number;
  currencySymbol?: string;
  onOptimizedRateChange?: (newRate: number) => void; // callback to update AssumptionControls
}

export const DeductionOptimizer: React.FC<DeductionOptimizerProps> = ({
  grossAnnualIncome,
  nominalTaxRate,
  monthlyExpenses,
  runwayMonths,
  currencySymbol = '$',
  onOptimizedRateChange,
}) => {
  const [deductions, setDeductions] = useState<DeductionCategory[]>(
    DEFAULT_DEDUCTION_CATEGORIES,
  );
  const [expanded, setExpanded] = useState(false);

  const result: TaxOptimizationResult = calculateTaxSavings(
    grossAnnualIncome,
    nominalTaxRate,
    deductions,
    monthlyExpenses,
    runwayMonths,
  );

  const toggleDeduction = (id: string) => {
    const updated = deductions.map((d) =>
      d.id === id && d.id !== 'se_tax_deduction' // SE tax is always on
        ? { ...d, isEnabled: !d.isEnabled }
        : d,
    );
    setDeductions(updated);
    // Propagate the optimized rate up so AssumptionControls can update live
    const newResult = calculateTaxSavings(
      grossAnnualIncome,
      nominalTaxRate,
      updated,
      monthlyExpenses,
      runwayMonths,
    );
    onOptimizedRateChange?.(newResult.adjustedTaxReservePct);
  };

  const updateEstimate = (id: string, value: number) => {
    setDeductions((prev) =>
      prev.map((d) => (d.id === id ? { ...d, annualEstimate: value } : d)),
    );
  };

  const enabledCount = deductions.filter((d) => d.isEnabled).length;
  const hasOptimized = result.taxSavings > 0;

  return (
    <section
      className="space-y-4 transition-colors rounded-2xl border p-5"
      style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
      id="deduction-optimizer"
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b"
        style={{ borderColor: 'var(--cf-border)' }}
      >
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Receipt className="w-4 h-4" style={{ color: 'var(--cf-accent)' }} />
            <h2
              className="font-serif text-base font-normal tracking-tight"
              style={{ color: 'var(--cf-text)' }}
            >
              Tax Deduction Optimizer
            </h2>
          </div>
          <p className="text-[11px]" style={{ color: 'var(--cf-text-muted)' }}>
            Enable deductions to lower your effective tax rate in real-time.
          </p>
        </div>
        {hasOptimized && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border shrink-0"
            style={{
              background: 'var(--cf-accent-bg)',
              borderColor: 'var(--cf-accent)' + '33',
              color: 'var(--cf-accent)',
            }}
          >
            <Sparkles className="w-3 h-3" />
            Saving {currencySymbol}{result.taxSavings.toLocaleString()}/yr
          </div>
        )}
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="p-3 rounded-xl border text-center"
          style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}
        >
          <p
            className="font-mono text-lg font-bold tabular-nums"
            style={{ color: hasOptimized ? 'var(--cf-accent)' : 'var(--cf-text)' }}
          >
            {Math.round(result.effectiveTaxRate * 100)}%
          </p>
          <p
            className="text-[10px] font-mono uppercase tracking-wider mt-0.5"
            style={{ color: 'var(--cf-text-muted)' }}
          >
            Effective Rate
          </p>
        </div>
        <div
          className="p-3 rounded-xl border text-center"
          style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}
        >
          <p
            className="font-mono text-lg font-bold tabular-nums"
            style={{ color: result.runwayExtensionMonths > 0 ? 'var(--cf-accent)' : 'var(--cf-text-muted)' }}
          >
            +{result.runwayExtensionMonths}
          </p>
          <p
            className="text-[10px] font-mono uppercase tracking-wider mt-0.5"
            style={{ color: 'var(--cf-text-muted)' }}
          >
            Runway Months
          </p>
        </div>
      </div>

      {/* Insight */}
      <p className="text-xs leading-relaxed px-1" style={{ color: 'var(--cf-text-muted)' }}>
        {result.description}
      </p>

      {/* Expand/Collapse Toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-xs font-mono py-2 border-t transition-colors cursor-pointer"
        style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-text-muted)' }}
      >
        <span>
          {enabledCount} of {deductions.length} deductions active
          {result.unusedPotential > 0 && (
            <span style={{ color: '#C98A3E' }}>
              {' '}— {currencySymbol}{result.unusedPotential.toLocaleString()} untapped
            </span>
          )}
        </span>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Deduction List */}
      {expanded && (
        <div className="space-y-2 pt-1">
          {deductions.map((d) => {
            const isAlwaysOn = d.id === 'se_tax_deduction';
            const savingsFromThis = d.isEnabled
              ? Math.round(d.annualEstimate * nominalTaxRate)
              : 0;

            return (
              <div
                key={d.id}
                className="p-3 rounded-xl border transition-all"
                style={{
                  borderColor: d.isEnabled ? 'var(--cf-accent)' + '44' : 'var(--cf-border)',
                  background: d.isEnabled ? 'var(--cf-accent-bg)' : 'var(--cf-surface-alt)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: 'var(--cf-text)' }}
                      >
                        {d.name}
                      </span>
                      {isAlwaysOn && (
                        <span
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase"
                          style={{
                            background: 'var(--cf-accent-bg)',
                            color: 'var(--cf-accent)',
                          }}
                        >
                          Auto
                        </span>
                      )}
                      {savingsFromThis > 0 && (
                        <span
                          className="text-[10px] font-mono"
                          style={{ color: 'var(--cf-accent)' }}
                        >
                          saves {currencySymbol}{savingsFromThis.toLocaleString()}/yr
                        </span>
                      )}
                    </div>
                    <p
                      className="text-[11px] mt-0.5 leading-relaxed"
                      style={{ color: 'var(--cf-text-muted)' }}
                    >
                      {d.description}
                    </p>
                    <p
                      className="text-[10px] mt-1 font-mono"
                      style={{ color: 'var(--cf-text-faint)' }}
                    >
                      {d.legalBasis}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isAlwaysOn}
                    onClick={() => toggleDeduction(d.id)}
                    className="shrink-0 w-9 h-5 rounded-full border-2 relative transition-all cursor-pointer disabled:cursor-default"
                    style={{
                      background: d.isEnabled ? 'var(--cf-accent)' : 'var(--cf-surface)',
                      borderColor: d.isEnabled ? 'var(--cf-accent)' : 'var(--cf-border)',
                    }}
                    aria-label={`Toggle ${d.name}`}
                  >
                    <span
                      className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                      style={{ left: d.isEnabled ? '18px' : '2px' }}
                    />
                  </button>
                </div>

                {/* Editable annual estimate */}
                {d.isEnabled && !isAlwaysOn && (
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: 'var(--cf-text-muted)' }}
                    >
                      Annual amount ({currencySymbol}):
                    </span>
                    <input
                      type="number"
                      value={d.annualEstimate}
                      onChange={(e) =>
                        updateEstimate(d.id, Math.max(0, Number(e.target.value)))
                      }
                      className="w-24 text-[11px] font-mono px-2 py-1 rounded border focus:outline-none"
                      style={{
                        background: 'var(--cf-surface)',
                        borderColor: 'var(--cf-border)',
                        color: 'var(--cf-text)',
                      }}
                    />
                    {d.maxAllowableByLaw !== undefined && (
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: 'var(--cf-text-faint)' }}
                      >
                        max {currencySymbol}{d.maxAllowableByLaw.toLocaleString()}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
