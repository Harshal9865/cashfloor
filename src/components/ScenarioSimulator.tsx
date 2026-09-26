'use client';

import React from 'react';
import { CalculatorAssumptions, ScenarioMode, WindfallAllocation } from '../lib/calculator/types';
import { ShieldAlert, Sparkles, TrendingDown, CheckCircle2, Sliders, Lock } from 'lucide-react';

interface ScenarioSimulatorProps {
  assumptions: CalculatorAssumptions;
  onChange: (updated: CalculatorAssumptions) => void;
  windfallAllocation?: WindfallAllocation;
  currencySymbol?: string;
  scenarioImpactDescription?: string;
  isLocked?: boolean;
  onUnlockRequest?: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  assumptions,
  onChange,
  windfallAllocation,
  currencySymbol = '$',
  scenarioImpactDescription,
  isLocked = false,
  onUnlockRequest,
}) => {
  const currentScenario = assumptions.scenario || 'base';

  const handleSelectScenario = (mode: ScenarioMode) => {
    if (isLocked) {
      onUnlockRequest?.();
      return;
    }
    onChange({
      ...assumptions,
      scenario: mode,
      windfallAmount: mode === 'windfall' ? (assumptions.windfallAmount || 10000) : undefined,
    });
  };

  return (
    <section
      className="p-6 md:p-8 space-y-6 transition-colors relative rounded-2xl border"
      style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
      id="scenarios"
    >
      {isLocked && (
        <div
          className="absolute inset-0 z-20 rounded-2xl flex items-center justify-center backdrop-blur-md"
          style={{ background: 'var(--cf-surface)', opacity: 0.95 }}
        >
          <div className="text-center space-y-3.5 p-8 max-w-sm mx-auto">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-sm"
              style={{ background: 'var(--cf-surface-alt)', border: '1px solid var(--cf-border)' }}
            >
              <Lock className="w-6 h-6 text-[#2F6F62]" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 mb-1">
                PRO FEATURE
              </span>
              <h3 className="font-serif text-xl font-medium" style={{ color: 'var(--cf-text)' }}>
                Stress Testing & Scenario Simulator
              </h3>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--cf-text-muted)' }}>
                Model worst-case retainer cancellations, dry spells, and delayed client payments.
              </p>
            </div>
            <button
              type="button"
              onClick={onUnlockRequest}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white transition-all cursor-pointer shadow-md hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
            >
              Unlock Stress Lab — Sign In Free
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--cf-border-soft)] pb-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[var(--cf-text)] font-normal tracking-tight">
              Stress Testing & Scenario Simulator
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider bg-[var(--cf-surface-alt)] px-2 py-0.5 border border-[var(--cf-border)] text-[var(--cf-text-muted)] rounded">
              Financial Stress Lab
            </span>
          </div>
          <p className="font-sans text-xs text-[var(--cf-text-muted)] mt-0.5">
            Test how unexpected macro events, lost retainers, and windfalls impact your survival horizon.
          </p>
        </div>
        <span className="text-xs font-mono text-[var(--cf-text-muted)]">
          ACTIVE: <strong className="text-[var(--cf-text)]">{currentScenario.toUpperCase()}</strong>
        </span>
      </div>

      {/* Scenario Selector Tabs with rounded corners and accessible contrast */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <button
          type="button"
          onClick={() => handleSelectScenario('conservative')}
          className={`p-3 text-left transition-all cursor-pointer border rounded-xl ${
            currentScenario === 'conservative'
              ? 'bg-[var(--cf-accent)] text-white border-[var(--cf-accent)] shadow-sm'
              : 'bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] border-[var(--cf-border)] hover:text-[var(--cf-text)] hover:border-[var(--cf-accent)]'
          }`}
        >
          <span className="font-mono font-semibold block text-[11px]">Conservative</span>
          <span className="text-[10px] opacity-80 block font-sans">Floor only</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('base')}
          className={`p-3 text-left transition-all cursor-pointer border rounded-xl ${
            currentScenario === 'base'
              ? 'bg-[var(--cf-accent)] text-white border-[var(--cf-accent)] shadow-sm'
              : 'bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] border-[var(--cf-border)] hover:text-[var(--cf-text)] hover:border-[var(--cf-accent)]'
          }`}
        >
          <span className="font-mono font-semibold block text-[11px]">Base Case</span>
          <span className="text-[10px] opacity-80 block font-sans">85% confidence</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('client_loss')}
          className={`p-3 text-left transition-all cursor-pointer border rounded-xl ${
            currentScenario === 'client_loss'
              ? 'bg-rose-600 dark:bg-rose-700 text-white border-rose-600 shadow-sm'
              : 'bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] border-[var(--cf-border)] hover:border-rose-500 hover:text-[var(--cf-text)]'
          }`}
        >
          <div className="flex items-center gap-1 font-mono font-semibold text-[11px]">
            <TrendingDown className="w-3 h-3" />
            <span>-30% Loss</span>
          </div>
          <span className="text-[10px] opacity-80 block font-sans">Lost major client</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('dry_spell')}
          className={`p-3 text-left transition-all cursor-pointer border rounded-xl ${
            currentScenario === 'dry_spell'
              ? 'bg-rose-600 dark:bg-rose-700 text-white border-rose-600 shadow-sm'
              : 'bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] border-[var(--cf-border)] hover:border-rose-500 hover:text-[var(--cf-text)]'
          }`}
        >
          <div className="flex items-center gap-1 font-mono font-semibold text-[11px]">
            <ShieldAlert className="w-3 h-3" />
            <span>3-Mo Drought</span>
          </div>
          <span className="text-[10px] opacity-80 block font-sans">90 days at $0</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('windfall')}
          className={`p-3 text-left transition-all cursor-pointer border rounded-xl ${
            currentScenario === 'windfall'
              ? 'bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-600 shadow-sm'
              : 'bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] border-[var(--cf-border)] hover:border-emerald-500 hover:text-[var(--cf-text)]'
          }`}
        >
          <div className="flex items-center gap-1 font-mono font-semibold text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Windfall</span>
          </div>
          <span className="text-[10px] opacity-80 block font-sans">Lump sum injection</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectScenario('late_invoice')}
          className={`p-3 text-left transition-all cursor-pointer border rounded-xl ${
            currentScenario === 'late_invoice'
              ? 'bg-amber-600 dark:bg-amber-700 text-white border-amber-600 shadow-sm'
              : 'bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] border-[var(--cf-border)] hover:border-amber-500 hover:text-[var(--cf-text)]'
          }`}
        >
          <div className="flex items-center gap-1 font-mono font-semibold text-[11px]">
            <TrendingDown className="w-3 h-3" />
            <span>Late Invoice</span>
          </div>
          <span className="text-[10px] opacity-80 block font-sans">60 days overdue</span>
        </button>
      </div>

      {/* Scenario Detail Panel */}
      <div className="p-4 bg-[var(--cf-surface-alt)] rounded-2xl border border-[var(--cf-border)] text-xs text-[var(--cf-text)] font-sans space-y-3">
        <div className="flex items-center space-x-2 font-mono text-[11px] text-[var(--cf-accent)] font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{scenarioImpactDescription}</span>
        </div>

        {currentScenario === 'client_loss' && (
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[var(--cf-border-soft)]">
            <label htmlFor="client-loss-slider" className="text-xs text-[var(--cf-text-muted)] font-sans">
              Simulated contract drop:
            </label>
            <input
              id="client-loss-slider"
              type="range"
              min="0.10"
              max="0.60"
              step="0.05"
              value={assumptions.clientLossPercentage ?? 0.30}
              onChange={(e) => onChange({ ...assumptions, clientLossPercentage: Number(e.target.value) })}
              className="w-40"
            />
            <span className="font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums text-sm">
              -{Math.round((assumptions.clientLossPercentage ?? 0.30) * 100)}% Gross Inflow
            </span>
          </div>
        )}

        {currentScenario === 'windfall' && windfallAllocation && (
          <div className="space-y-3 pt-2 border-t border-[var(--cf-border-soft)]">
            <div className="flex flex-wrap items-center gap-4">
              <label htmlFor="windfall-input" className="text-xs text-[var(--cf-text-muted)]">
                Unexpected invoice payment:
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--cf-text-muted)] font-mono">
                  {currencySymbol}
                </span>
                <input
                  id="windfall-input"
                  type="number"
                  min="1000"
                  step="1000"
                  value={assumptions.windfallAmount ?? 10000}
                  onChange={(e) =>
                    onChange({ ...assumptions, windfallAmount: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="pl-6 pr-3 py-1 bg-[var(--cf-surface)] border border-[var(--cf-border)] text-xs font-mono font-semibold tabular-nums w-32 focus:outline-hidden rounded-lg text-[var(--cf-text)]"
                />
              </div>
            </div>

            {/* Windfall Waterfall Allocation Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-[var(--cf-surface)] border border-[var(--cf-border)] rounded-xl">
                <span className="text-[10px] font-mono text-[var(--cf-text-muted)] uppercase block">1. Statutory Tax Escrow</span>
                <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums mt-0.5 block">
                  {currencySymbol}{windfallAllocation.taxAllocation.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-[var(--cf-surface)] border border-[var(--cf-border)] rounded-xl">
                <span className="text-[10px] font-mono text-[var(--cf-text-muted)] uppercase block">2. Safety Buffer Sunk</span>
                <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5 block">
                  {currencySymbol}{windfallAllocation.bufferAllocation.toLocaleString()}
                </span>
              </div>
              <div className="p-3 bg-[var(--cf-surface)] border border-[var(--cf-border)] rounded-xl">
                <span className="text-[10px] font-mono text-[var(--cf-text-muted)] uppercase block">3. Guilt-Free Owner Bonus</span>
                <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums mt-0.5 block">
                  {currencySymbol}{windfallAllocation.bonusPaycheckAllocation.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
