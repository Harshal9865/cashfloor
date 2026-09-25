'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle,
  AlertTriangle,
  Zap,
  Building2,
  Briefcase
} from 'lucide-react';
import { MonthlyRecord, CalculatorAssumptions } from '@/lib/calculator/types';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (newRecords: MonthlyRecord[], newAssumptions: Partial<CalculatorAssumptions>, currency: string) => void;
  initialCurrency?: string;
}

export function OnboardingWizardModal({
  isOpen,
  onClose,
  onComplete,
  initialCurrency = '$',
}: OnboardingWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Currency & Starting Bank Balance
  const [currency, setCurrency] = useState(initialCurrency);
  const [currentSavings, setCurrentSavings] = useState<number>(12500);

  // Step 2: Monthly Fixed & Living Burn
  const [housingCost, setHousingCost] = useState<number>(1400);
  const [livingCost, setLivingCost] = useState<number>(600);
  const [softwareTools, setSoftwareTools] = useState<number>(150);
  const [insuranceHealth, setInsuranceHealth] = useState<number>(250);

  // Step 3: Income Streams & Volatility
  const [worstMonthIncome, setWorstMonthIncome] = useState<number>(2400);
  const [typicalMonthIncome, setTypicalMonthIncome] = useState<number>(5200);
  const [peakMonthIncome, setPeakMonthIncome] = useState<number>(8500);

  // Step 4: Safety Buffer & Tax Escrow
  const [bufferMonths, setBufferMonths] = useState<number>(3.5);
  const [taxReservePct, setTaxReservePct] = useState<number>(25);

  if (!isOpen) return null;

  const totalMonthlyBurn = housingCost + livingCost + softwareTools + insuranceHealth;
  
  // 20th percentile cash floor estimation: conservative income floor
  const estimatedFloorIncome = Math.round(
    worstMonthIncome + (typicalMonthIncome - worstMonthIncome) * 0.2
  );
  
  const netBurnAtFloor = Math.max(0, totalMonthlyBurn - estimatedFloorIncome);
  const runwayMonths = totalMonthlyBurn > 0 
    ? (estimatedFloorIncome >= totalMonthlyBurn ? 999 : currentSavings / netBurnAtFloor)
    : 0;

  const targetBufferAmount = Math.round(totalMonthlyBurn * bufferMonths);
  const bufferFundingPct = targetBufferAmount > 0 
    ? Math.min(100, Math.round((currentSavings / targetBufferAmount) * 100))
    : 100;

  const handleFinish = () => {
    // Generate realistic 12 months with natural freelancer volatility
    const monthLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const syntheticMultipliers = [1.0, 1.15, 0.85, 0.46, 0.95, 1.6, 0.98, 1.05, 0.8, 1.2, 1.32, 1.1];

    const records: MonthlyRecord[] = monthLabels.map((m, idx) => {
      let income: number;
      if (idx === 3) {
        income = worstMonthIncome; // leanest month
      } else if (idx === 5) {
        income = peakMonthIncome; // peak windfall month
      } else {
        income = Math.round(typicalMonthIncome * syntheticMultipliers[idx]);
      }

      return {
        id: String(idx + 1),
        month: m,
        income,
        expenses: totalMonthlyBurn,
        clientTag: income < typicalMonthIncome ? 'Lean Cycle' : (income > typicalMonthIncome * 1.25 ? 'Windfall Project' : 'Retainer Base')
      };
    });

    const newAssumptions: Partial<CalculatorAssumptions> = {
      currentSavings,
      taxReservePct: taxReservePct / 100,
      bufferMonthsMultiplier: bufferMonths,
      percentile: 20,
      scenario: 'base'
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('cf_onboarding_completed', 'true');
    }

    onComplete(records, newAssumptions, currency);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-2xl bg-[var(--cf-surface)] border border-[var(--cf-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-[var(--cf-border)] flex items-center justify-between bg-[var(--cf-surface-alt)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[var(--cf-accent)]/10 text-[var(--cf-accent)] flex items-center justify-center border border-[var(--cf-accent)]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-[var(--cf-text)]">
                Welcome to CashFloor — Quick Setup Wizard
              </h2>
              <p className="text-xs text-[var(--cf-text-muted)] font-mono">
                Step {step} of 4: {step === 1 ? 'Currency & Cash Reserve' : step === 2 ? 'Monthly Operating Burn' : step === 3 ? 'Income Volatility' : 'Safety Buffer & Taxes'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--cf-border)] h-1">
          <div
            className="h-full bg-[var(--cf-accent)] transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Wizard Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Currency & Starting Savings */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--cf-text)]">
                  Let&apos;s start with your baseline cash reserves
                </h3>
                <p className="text-xs text-[var(--cf-text-muted)]">
                  CashFloor is designed for freelancers, indie hackers, and solo consultants with irregular income.
                </p>
              </div>

              {/* Currency Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--cf-text)] font-mono">
                  Primary Operating Currency
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { sym: '$', name: 'USD / CAD ($)' },
                    { sym: '€', name: 'EUR (€)' },
                    { sym: '£', name: 'GBP (£)' },
                    { sym: '₹', name: 'INR (₹)' },
                  ].map((c) => (
                    <button
                      key={c.sym}
                      type="button"
                      onClick={() => setCurrency(c.sym)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        currency === c.sym
                          ? 'border-[var(--cf-accent)] bg-[var(--cf-accent-bg)] font-bold text-[var(--cf-accent)] shadow-xs'
                          : 'border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] hover:border-[var(--cf-border-soft)]'
                      }`}
                    >
                      <div className="text-lg font-mono">{c.sym}</div>
                      <div className="text-[10px] mt-0.5">{c.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Liquid Bank Balance */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--cf-text)] font-mono flex items-center justify-between">
                  <span>Current Liquid Cash in Bank Accounts</span>
                  <span className="text-[11px] text-[var(--cf-text-muted)] font-normal">
                    Checking + High-Yield Savings
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-mono text-[var(--cf-text-muted)]">
                    {currency}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] font-mono text-base font-bold text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-[var(--cf-text-muted)]">
                  Only include liquid, unallocated cash you can access within 48 hours. Exclude retirement and locked investments.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Monthly Fixed Living & Operating Expenses */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--cf-text)]">
                  What are your bare-minimum monthly fixed expenses?
                </h3>
                <p className="text-xs text-[var(--cf-text-muted)]">
                  This forms your non-negotiable living + software burn rate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-[var(--cf-text)] flex items-center justify-between">
                    <span>Rent / Mortgage</span>
                    <span className="text-[10px] text-[var(--cf-text-muted)] font-normal">Monthly</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--cf-text-muted)]">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={housingCost}
                      onChange={(e) => setHousingCost(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] font-mono text-sm text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-[var(--cf-text)] flex items-center justify-between">
                    <span>Food, Groceries & Utilities</span>
                    <span className="text-[10px] text-[var(--cf-text-muted)] font-normal">Monthly</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--cf-text-muted)]">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={livingCost}
                      onChange={(e) => setLivingCost(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] font-mono text-sm text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-[var(--cf-text)] flex items-center justify-between">
                    <span>Software & SaaS Tools</span>
                    <span className="text-[10px] text-[var(--cf-text-muted)] font-normal">Hosting/AI/Work</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--cf-text-muted)]">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={softwareTools}
                      onChange={(e) => setSoftwareTools(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] font-mono text-sm text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-[var(--cf-text)] flex items-center justify-between">
                    <span>Health & Business Insurance</span>
                    <span className="text-[10px] text-[var(--cf-text-muted)] font-normal">Monthly</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--cf-text-muted)]">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={insuranceHealth}
                      onChange={(e) => setInsuranceHealth(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] font-mono text-sm text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)]"
                    />
                  </div>
                </div>
              </div>

              {/* Total Monthly Fixed Burn Banner */}
              <div className="p-4 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-[var(--cf-text-muted)]">Total Non-Negotiable Burn:</span>
                  <p className="text-lg font-bold font-mono text-[var(--cf-text)] mt-0.5">
                    {currency}{totalMonthlyBurn.toLocaleString()}<span className="text-xs font-normal text-[var(--cf-text-muted)]"> / month</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-[var(--cf-text-muted)]">Daily Living Burn:</span>
                  <p className="text-sm font-bold font-mono text-[var(--cf-text)] mt-0.5">
                    {currency}{(totalMonthlyBurn / 30.5).toFixed(0)} / day
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Income Streams & Volatility */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--cf-text)]">
                  Model your income spectrum across irregular cycles
                </h3>
                <p className="text-xs text-[var(--cf-text-muted)]">
                  Traditional tools assume steady paychecks. CashFloor evaluates your 20th-percentile lean floor.
                </p>
              </div>

              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-rose-700 dark:text-rose-400 flex items-center justify-between">
                    <span>1. Worst &quot;Drought&quot; Month Income (Client Churn)</span>
                    <span className="text-[10px] font-normal">Lean Survival Floor</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-rose-500">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={worstMonthIncome}
                      onChange={(e) => setWorstMonthIncome(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-rose-500/30 bg-[var(--cf-surface)] font-mono text-sm text-[var(--cf-text)] focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <p className="text-[10px] text-[var(--cf-text-muted)]">
                    Think of the worst month in the past 18 months where a client delayed payment or cancelled.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-[var(--cf-text)] flex items-center justify-between">
                    <span>2. Typical Steady-State Month Income</span>
                    <span className="text-[10px] text-[var(--cf-text-muted)] font-normal">Standard Retainers</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--cf-text-muted)]">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={typicalMonthIncome}
                      onChange={(e) => setTypicalMonthIncome(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] font-mono text-sm text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                    <span>3. Best &quot;Windfall&quot; Month Income</span>
                    <span className="text-[10px] font-normal">Bonus / Launch Spike</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-500">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={peakMonthIncome}
                      onChange={(e) => setPeakMonthIncome(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-emerald-500/30 bg-[var(--cf-surface)] font-mono text-sm text-[var(--cf-text)] focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Safety Buffer & Taxes Preview */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[var(--cf-text)]">
                  Calibration & Real-Time Runway Analysis
                </h3>
                <p className="text-xs text-[var(--cf-text-muted)]">
                  Here is your baseline financial posture computed by the CashFloor engine.
                </p>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-semibold">
                    <span>Runway Buffer Goal</span>
                    <span className="text-[var(--cf-accent)]">{bufferMonths} Months</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={bufferMonths}
                    onChange={(e) => setBufferMonths(Number(e.target.value))}
                    className="w-full accent-[var(--cf-accent)] cursor-pointer"
                  />
                  <p className="text-[10px] text-[var(--cf-text-muted)]">
                    Target reserve: {currency}{targetBufferAmount.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-semibold">
                    <span>Estimated Tax Escrow</span>
                    <span className="text-amber-600 dark:text-amber-400">{taxReservePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="1"
                    value={taxReservePct}
                    onChange={(e) => setTaxReservePct(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-[var(--cf-text-muted)]">
                    Self-employment tax + Federal/State reserve.
                  </p>
                </div>
              </div>

              {/* Real-time Computed Summary */}
              <div className="p-4 rounded-2xl border border-[var(--cf-accent)]/30 bg-[var(--cf-accent-bg)]/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--cf-accent)]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Instant Financial Posture Calculation</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2.5 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border)]">
                    <span className="text-[10px] font-mono text-[var(--cf-text-muted)] uppercase">Conservative Floor</span>
                    <p className="text-base font-bold font-mono text-[var(--cf-text)] mt-0.5">
                      {currency}{estimatedFloorIncome.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border)]">
                    <span className="text-[10px] font-mono text-[var(--cf-text-muted)] uppercase">Calculated Runway</span>
                    <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {runwayMonths >= 999 ? 'Self-Sustaining' : `${runwayMonths.toFixed(1)} Mo`}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border)]">
                    <span className="text-[10px] font-mono text-[var(--cf-text-muted)] uppercase">Buffer Funded</span>
                    <p className="text-base font-bold font-mono text-[var(--cf-text)] mt-0.5">
                      {bufferFundingPct}%
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[var(--cf-border)] bg-[var(--cf-surface-alt)] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl border border-[var(--cf-border)] text-xs font-mono text-[var(--cf-text)] hover:bg-[var(--cf-surface)] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2.5 rounded-xl bg-[var(--cf-accent)] text-white text-xs font-bold font-mono hover:opacity-90 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply & Launch Dashboard</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
