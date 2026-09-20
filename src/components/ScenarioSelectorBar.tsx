'use client';

import React from 'react';
import { CalculatorAssumptions, ScenarioMode } from '../lib/calculator/types';

interface ScenarioSelectorBarProps {
  assumptions: CalculatorAssumptions;
  onChange: (updated: CalculatorAssumptions) => void;
  liquidCash: number;
  floorIncome: number;
  exhaustionDate: string;
  currencySymbol?: string;
}

export function ScenarioSelectorBar({
  assumptions,
  onChange,
  liquidCash,
  floorIncome,
  exhaustionDate,
  currencySymbol = '$',
}: ScenarioSelectorBarProps) {
  const currentScenario = assumptions.scenario || 'base';

  const scenarios: { id: ScenarioMode; label: string; tooltip: string }[] = [
    {
      id: 'conservative',
      label: 'Conservative (Floor Only)',
      tooltip: 'Zero pipeline reliance: strictly guaranteed survival floor',
    },
    {
      id: 'base',
      label: 'Base Case (85% Conf.)',
      tooltip: 'Normal 20th percentile baseline across active records',
    },
    {
      id: 'client_loss',
      label: 'Stress Test (-30%)',
      tooltip: 'Simulate losing 30% of revenue contracts immediately',
    },
    {
      id: 'dry_spell',
      label: '3-Mo Drought',
      tooltip: 'Simulate 3 consecutive months of $0 income',
    },
    {
      id: 'windfall',
      label: 'Windfall Strategy',
      tooltip: 'Allocate an immediate unexpected invoice payment',
    },
    {
      id: 'late_invoice',
      label: 'Late Invoice (60d)',
      tooltip: 'Simulate key invoice delayed by 60 days',
    },
  ];

  return (
    <section className="w-full bg-[#E8EDE9] hairline-b py-2 px-4 md:px-12 sticky top-16 z-30 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-[#16232B]">
        {/* Scenario Switcher Pills */}
        <div className="flex items-center space-x-3 overflow-x-auto py-0.5">
          <span className="text-[#5C6D77] tracking-wider uppercase text-[10px] font-sans font-semibold whitespace-nowrap">
            Active Scenario:
          </span>
          <div className="inline-flex border border-[#16232B]/20 bg-white divide-x divide-[#16232B]/15">
            {scenarios.map((sc) => {
              const isActive = currentScenario === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => onChange({ ...assumptions, scenario: sc.id })}
                  title={sc.tooltip}
                  className={`px-3 py-1 text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#16232B] text-[#F1F4F2] font-semibold'
                      : 'text-[#5C6D77] hover:text-[#16232B] hover:bg-[#F1F4F2]'
                  }`}
                >
                  {sc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time KPI Status Chips */}
        <div className="flex items-center space-x-5 text-[11px] text-[#5C6D77]">
          <span>
            Verified Liquid Cash:{' '}
            <strong className="tabular-nums text-[#16232B] font-semibold font-mono">
              {currencySymbol}
              {liquidCash.toLocaleString()}
            </strong>
          </span>
          <span className="hidden md:inline">
            Monthly Income Floor:{' '}
            <strong className="tabular-nums text-[#16232B] font-semibold font-mono">
              {currencySymbol}
              {floorIncome.toLocaleString()}
            </strong>
          </span>
          <span className="hidden sm:inline">
            Zero-Income Exhaustion:{' '}
            <strong className="text-[#0f564a] font-semibold font-mono">
              {exhaustionDate}
            </strong>
          </span>
        </div>
      </div>
    </section>
  );
}
