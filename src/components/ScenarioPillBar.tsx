'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalculatorAssumptions, ScenarioMode } from '../lib/calculator/types';
import { 
  Shield, 
  TrendingDown, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Activity, 
  HelpCircle,
  X,
  Info
} from 'lucide-react';

interface ScenarioPillBarProps {
  assumptions: CalculatorAssumptions;
  onChange: (updated: CalculatorAssumptions) => void;
  liquidCash: number;
  floorIncome: number;
  exhaustionDate: string;
  currencySymbol?: string;
}

interface ScenarioMeta {
  id: ScenarioMode;
  label: string;
  short: string;
  tooltip: string;
  description: string;
  color: string;
  icon: React.ElementType;
}

const SCENARIOS: ScenarioMeta[] = [
  { 
    id: 'conservative', 
    label: 'Conservative', 
    short: 'Floor', 
    tooltip: 'Zero pipeline reliance: strictly guaranteed survival floor', 
    description: 'Conservative Survival Floor: Strips away speculative pipeline revenue and anchors strictly to your historical 20th-percentile income ($3,200/mo).',
    color: '#2F6F62',
    icon: Shield
  },
  { 
    id: 'base',         
    label: 'Base Case',    
    short: 'Base',  
    tooltip: 'Normal 20th percentile baseline across active records',    
    description: 'Standard Baseline: Your regular irregular freelance distribution modeled with 20th-percentile floor protection.',
    color: 'var(--cf-text)',
    icon: Activity
  },
  { 
    id: 'client_loss',  
    label: 'Client Loss',  
    short: '-30%',  
    tooltip: 'Simulate losing 30% of revenue contracts immediately',     
    description: 'Anchor Client Churn (-30%): Simulates losing your largest client retainer immediately. Tests your runway buffer to replace them without debt.',
    color: '#B4573F',
    icon: TrendingDown
  },
  { 
    id: 'dry_spell',    
    label: 'Dry Spell',    
    short: '3-Mo',  
    tooltip: 'Simulate 3 consecutive months of $0 income',              
    description: '90-Day Summer Drought ($0 Income): Simulates 3 consecutive months with zero client revenue. Tests if your cash reserves survive a seasonal freeze.',
    color: '#C98A3E',
    icon: AlertTriangle
  },
  { 
    id: 'windfall',     
    label: 'Windfall',     
    short: '+$$',   
    tooltip: 'Allocate an immediate unexpected invoice payment',         
    description: 'Enterprise Windfall (+$$): Simulates a large surprise project payment. Highlights automated Tax Escrow (25%) so you don’t overspend.',
    color: '#3DE8C8',
    icon: Sparkles
  },
  { 
    id: 'late_invoice', 
    label: 'Late Invoice', 
    short: '60d',   
    tooltip: 'Simulate key invoice delayed by 60 days',                  
    description: '60-Day Invoice Delay: Simulates client payment terms pushed from Net-30 to Net-90. Verifies if operating capital cushions the delay.',
    color: '#875205',
    icon: Clock
  },
];

function KpiChip({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-faint)] leading-none">
        {label}
      </span>
      <span 
        className="text-[13px] font-mono font-semibold tabular-nums leading-tight mt-0.5" 
        style={{ color: color || 'var(--cf-text)' }}
      >
        {value}
      </span>
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
  const [showHelperModal, setShowHelperModal] = useState(false);
  const current = assumptions.scenario || 'base';
  const activeScenarioMeta = SCENARIOS.find(s => s.id === current) || SCENARIOS[1];
  const Icon = activeScenarioMeta.icon;

  return (
    <>
      <div
        className="w-full sticky top-14 z-30 transition-colors duration-200"
        style={{
          background: 'var(--cf-nav-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--cf-border)',
          boxShadow: 'var(--cf-shadow-sm)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between gap-4">

          {/* Scenario pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 dark-scroll">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--cf-text-faint)] whitespace-nowrap mr-1 hidden sm:flex items-center gap-1">
              <span>Stress Tests:</span>
            </span>

            {SCENARIOS.map((sc) => {
              const isActive = current === sc.id;
              const ScIcon = sc.icon;

              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => onChange({ ...assumptions, scenario: sc.id })}
                  title={sc.tooltip}
                  className="relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer border"
                  style={{
                    background: isActive ? 'var(--cf-surface)' : 'transparent',
                    borderColor: isActive ? sc.color : 'var(--cf-border-soft)',
                    color: isActive ? sc.color : 'var(--cf-text-muted)',
                    fontWeight: isActive ? 600 : 400,
                    boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  <ScIcon className="w-3 h-3 shrink-0" />
                  <span className="relative hidden sm:block">{sc.label}</span>
                  <span className="relative sm:hidden">{sc.short}</span>

                  {isActive && (
                    <motion.span
                      layoutId="scenario-active-dot"
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: sc.color }}
                    />
                  )}
                </button>
              );
            })}

            {/* Explainer Button */}
            <button
              type="button"
              onClick={() => setShowHelperModal(true)}
              className="p-1 rounded-full text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors cursor-pointer ml-1"
              title="What are these scenarios and why are they used?"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Scenario Quick Explainer (Replaces KPIs on Desktop) */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-[var(--cf-text-muted)] border-l border-[var(--cf-border)] pl-4 truncate flex-1 min-w-0">
            <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: activeScenarioMeta.color }} />
            <span className="truncate">
              <strong className="text-[var(--cf-text)] font-semibold">{activeScenarioMeta.label}:</strong>{' '}
              {activeScenarioMeta.description}
            </span>
          </div>
        </div>
      </div>

      {/* ── Helper Modal: "What are scenarios & why are they used?" ── */}
      <AnimatePresence>
        {showHelperModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl p-6 sm:p-8 rounded-3xl border shadow-2xl relative"
              style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
            >
              <button
                type="button"
                onClick={() => setShowHelperModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[var(--cf-accent-bg)] border border-[var(--cf-accent)]/30 flex items-center justify-center text-[var(--cf-accent)]">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[var(--cf-text)]">
                    What are Stress-Test Scenarios?
                  </h3>
                  <p className="text-xs text-[var(--cf-text-muted)]">
                    Why freelancers need stress tests, not just averages
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs leading-relaxed text-[var(--cf-text-muted)]">
                <p>
                  Most budgeting apps calculate an <strong className="text-[var(--cf-text)]">average income</strong> (e.g. $6,000/month). But freelance cash flow doesn&apos;t arrive in steady averages — it arrives in volatile spikes and sudden droughts.
                </p>
                <p>
                  <strong className="text-[var(--cf-text)]">Stress tests simulate the worst-case events before they happen:</strong>
                </p>
                <div className="space-y-2 p-3.5 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] font-mono text-[11px]">
                  <div><strong className="text-[#B4573F]">Client Loss (-30%):</strong> What happens if your biggest anchor client pauses their contract tomorrow?</div>
                  <div><strong className="text-[#C98A3E]">Dry Spell (3-Mo):</strong> How long can you survive if no new invoices are paid for 90 days?</div>
                  <div><strong className="text-[#875205]">Late Invoice (60d):</strong> Will your living expenses survive Net-60 or Net-90 client delays?</div>
                  <div><strong className="text-[#3DE8C8]">Windfall (+$$):</strong> When a big check clears, how much gets locked in tax escrow so you don&apos;t spend it?</div>
                </div>
                <p className="text-[11px] text-[var(--cf-text-faint)]">
                  Clicking any scenario recalculates your real runway in real time, so you always know your exact panic-free survival margin.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--cf-border-soft)] flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowHelperModal(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
