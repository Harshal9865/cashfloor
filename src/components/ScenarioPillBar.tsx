'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CalculatorAssumptions, ScenarioMode } from '../lib/calculator/types';

interface ScenarioPillBarProps {
  assumptions: CalculatorAssumptions;
  onChange: (updated: CalculatorAssumptions) => void;
  liquidCash: number;
  floorIncome: number;
  exhaustionDate: string;
  currencySymbol?: string;
}

const SCENARIOS: { id: ScenarioMode; label: string; short: string; tooltip: string; color: string }[] = [
  { id: 'conservative', label: 'Conservative', short: 'Floor', tooltip: 'Zero pipeline reliance: strictly guaranteed survival floor', color: '#2F6F62' },
  { id: 'base',         label: 'Base Case',    short: 'Base',  tooltip: 'Normal 20th percentile baseline across active records',    color: '#16232B' },
  { id: 'client_loss',  label: 'Client Loss',  short: '-30%',  tooltip: 'Simulate losing 30% of revenue contracts immediately',     color: '#B4573F' },
  { id: 'dry_spell',    label: 'Dry Spell',    short: '3-Mo',  tooltip: 'Simulate 3 consecutive months of $0 income',              color: '#C98A3E' },
  { id: 'windfall',     label: 'Windfall',     short: '+$$',   tooltip: 'Allocate an immediate unexpected invoice payment',         color: '#3DE8C8' },
  { id: 'late_invoice', label: 'Late Invoice', short: '60d',   tooltip: 'Simulate key invoice delayed by 60 days',                  color: '#875205' },
];

function KpiChip({ label, value, color = '#16232B' }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E9EA7] leading-none">{label}</span>
      <span className="text-[13px] font-mono font-semibold tabular-nums leading-tight" style={{ color }}>{value}</span>
    </div>
  );
}

export function ScenarioPillBar({
  assumptions,
  onChange,
  liquidCash,
  floorIncome,
  exhaustionDate,
  currencySymbol = '$',
}: ScenarioPillBarProps) {
  const current = assumptions.scenario || 'base';

  return (
    <div
      className="w-full sticky top-14 z-30"
      style={{
        background: 'rgba(232,237,233,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(22,35,43,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between gap-4">

        {/* Scenario pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 dark-scroll">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9EA7] whitespace-nowrap mr-1 hidden sm:block">
            Scenario:
          </span>
          {SCENARIOS.map((sc) => {
            const isActive = current === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => onChange({ ...assumptions, scenario: sc.id })}
                title={sc.tooltip}
                className="relative flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer"
                style={{
                  background: isActive ? `${sc.color}18` : 'transparent',
                  border: `1px solid ${isActive ? sc.color + '50' : 'rgba(22,35,43,0.1)'}`,
                  color: isActive ? sc.color : '#5C6D77',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="scenario-active"
                    className="absolute inset-0 rounded-full"
                    style={{ background: `${sc.color}12` }}
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
                <span className="relative hidden sm:block">{sc.label}</span>
                <span className="relative sm:hidden">{sc.short}</span>
              </button>
            );
          })}
        </div>

        {/* KPI chips */}
        <div className="hidden md:flex items-center gap-5 shrink-0 divide-x divide-[rgba(22,35,43,0.08)]">
          <KpiChip
            label="Liquid Cash"
            value={`${currencySymbol}${liquidCash.toLocaleString()}`}
            color="#16232B"
          />
          <div className="pl-5">
            <KpiChip
              label="Income Floor"
              value={`${currencySymbol}${floorIncome.toLocaleString()}`}
              color="#2F6F62"
            />
          </div>
          <div className="pl-5">
            <KpiChip
              label="Exhaustion"
              value={exhaustionDate}
              color="#0f564a"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
