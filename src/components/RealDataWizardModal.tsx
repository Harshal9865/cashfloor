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
  Check, 
  Calendar,
  Layers,
  HelpCircle,
  Upload
} from 'lucide-react';
import { MonthlyRecord, CalculatorAssumptions } from '@/lib/calculator/types';

interface RealDataWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRealData: (newRecords: MonthlyRecord[], newAssumptions: Partial<CalculatorAssumptions>) => void;
  currencySymbol?: string;
  onOpenCsvModal: () => void;
}

export function RealDataWizardModal({
  isOpen,
  onClose,
  onApplyRealData,
  currencySymbol = '$',
  onOpenCsvModal,
}: RealDataWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [inputMode, setInputMode] = useState<'quick' | 'exact'>('quick');

  // Quick Mode Inputs
  const [worstMonthIncome, setWorstMonthIncome] = useState<number>(2200);
  const [typicalMonthIncome, setTypicalMonthIncome] = useState<number>(5500);
  const [bestMonthIncome, setBestMonthIncome] = useState<number>(9000);

  // Exact Mode Inputs (12 months)
  const monthLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const [exactIncomes, setExactIncomes] = useState<number[]>([
    4800, 5200, 3900, 2400, 4900, 8500, 5100, 5400, 4200, 6200, 6900, 5800
  ]);

  // Step 2: Fixed Monthly Living & Business Expenses
  const [housingCost, setHousingCost] = useState<number>(1400);
  const [livingCost, setLivingCost] = useState<number>(600);
  const [softwareTools, setSoftwareTools] = useState<number>(150);
  const [insuranceCost, setInsuranceCost] = useState<number>(250);

  // Step 3: Cash in Bank & Taxes
  const [currentCash, setCurrentCash] = useState<number>(12500);
  const [taxBracketPct, setTaxBracketPct] = useState<number>(25);

  if (!isOpen) return null;

  const totalMonthlyBurn = housingCost + livingCost + softwareTools + insuranceCost;

  const handleFinish = () => {
    let finalMonthlyIncomes: number[] = [];

    if (inputMode === 'quick') {
      // Synthesize 12 months with natural variance between worst, typical, and best
      finalMonthlyIncomes = [
        typicalMonthIncome,
        Math.round(typicalMonthIncome * 1.1),
        Math.round(typicalMonthIncome * 0.85),
        worstMonthIncome, // lean month
        Math.round(typicalMonthIncome * 0.95),
        bestMonthIncome, // peak
        typicalMonthIncome,
        Math.round(typicalMonthIncome * 1.05),
        Math.round(typicalMonthIncome * 0.8),
        Math.round(typicalMonthIncome * 1.15),
        Math.round(typicalMonthIncome * 1.2),
        Math.round(typicalMonthIncome * 1.0),
      ];
    } else {
      finalMonthlyIncomes = exactIncomes;
    }

    const newRecords: MonthlyRecord[] = finalMonthlyIncomes.map((inc, i) => ({
      id: String(i + 1),
      month: monthLabels[i],
      income: inc,
      expenses: totalMonthlyBurn,
      clientTag: inc < typicalMonthIncome ? 'Lean Cycle' : (inc > typicalMonthIncome * 1.3 ? 'Windfall Project' : 'Retainer Base'),
    }));

    onApplyRealData(newRecords, {
      currentSavings: currentCash,
      taxReservePct: taxBracketPct / 100,
      bufferMonthsMultiplier: 3.5,
      percentile: 20,
      scenario: 'base',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          background: 'var(--cf-surface)',
          borderColor: 'var(--cf-border)',
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--cf-border-soft)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[var(--cf-text)]">
                Calculate Your Real Financial Floor
              </h2>
              <p className="text-xs text-[var(--cf-text-muted)]">
                Step {step} of 3 · Zero Bank Surveillance (Private to your browser)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="h-1 bg-[var(--cf-surface-alt)] w-full">
          <div 
            className="h-full bg-[var(--cf-accent)] transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* STEP 1: INCOME HISTORY */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--cf-text)]">
                    1. Enter Your Recent Monthly Invoiced Income
                  </h3>
                  <p className="text-xs text-[var(--cf-text-muted)] mt-0.5">
                    To calculate your 20th percentile, we need to know your range of good and bad months.
                  </p>
                </div>

                <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setInputMode('quick')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      inputMode === 'quick' ? 'bg-[var(--cf-surface)] text-[var(--cf-text)] shadow-sm' : 'text-[var(--cf-text-muted)]'
                    }`}
                  >
                    Quick Range
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('exact')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      inputMode === 'exact' ? 'bg-[var(--cf-surface)] text-[var(--cf-text)] shadow-sm' : 'text-[var(--cf-text-muted)]'
                    }`}
                  >
                    12 Exact Months
                  </button>
                </div>
              </div>

              {inputMode === 'quick' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
                    <label className="text-xs font-mono font-semibold text-[#B4573F] block mb-1">
                      Worst Month (Drought)
                    </label>
                    <p className="text-[10px] text-[var(--cf-text-muted)] mb-2">
                      Your lowest revenue month in the past year.
                    </p>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-mono text-[var(--cf-text-faint)]">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        value={worstMonthIncome}
                        onChange={e => setWorstMonthIncome(Number(e.target.value) || 0)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl text-sm font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
                    <label className="text-xs font-mono font-semibold text-[var(--cf-accent)] block mb-1">
                      Typical Month (Average)
                    </label>
                    <p className="text-[10px] text-[var(--cf-text-muted)] mb-2">
                      What a standard normal month looks like.
                    </p>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-mono text-[var(--cf-text-faint)]">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        value={typicalMonthIncome}
                        onChange={e => setTypicalMonthIncome(Number(e.target.value) || 0)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl text-sm font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
                    <label className="text-xs font-mono font-semibold text-[#3DE8C8] block mb-1">
                      Best Month (Windfall)
                    </label>
                    <p className="text-[10px] text-[var(--cf-text-muted)] mb-2">
                      A peak month with multiple project milestones.
                    </p>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-mono text-[var(--cf-text-faint)]">
                        {currencySymbol}
                      </span>
                      <input
                        type="number"
                        value={bestMonthIncome}
                        onChange={e => setBestMonthIncome(Number(e.target.value) || 0)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl text-sm font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {monthLabels.map((m, idx) => (
                    <div key={m} className="p-2.5 rounded-xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
                      <span className="text-[10px] font-mono text-[var(--cf-text-faint)] block mb-1">
                        Month {idx + 1} ({m})
                      </span>
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-xs font-mono text-[var(--cf-text-faint)]">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          value={exactIncomes[idx]}
                          onChange={e => {
                            const copy = [...exactIncomes];
                            copy[idx] = Number(e.target.value) || 0;
                            setExactIncomes(copy);
                          }}
                          className="w-full pl-6 pr-2 py-1.5 rounded-lg text-xs font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CSV Alternative Link */}
              <div className="p-3 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] flex items-center justify-between text-xs">
                <span className="text-[var(--cf-text-muted)]">
                  Have bank statements or Stripe exported as CSV?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCsvModal();
                  }}
                  className="font-mono font-semibold text-[var(--cf-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import CSV Instead</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FIXED MONTHLY LIVING & BUSINESS BURNOVER */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-[var(--cf-text)]">
                  2. What Are Your Fixed Non-Negotiable Monthly Expenses?
                </h3>
                <p className="text-xs text-[var(--cf-text-muted)] mt-0.5">
                  The minimum burn you must cover even if you bill $0 this month.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
                  <label className="text-xs font-semibold text-[var(--cf-text)] block mb-1">
                    Rent / Studio / Mortgage
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono text-[var(--cf-text-faint)]">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={housingCost}
                      onChange={e => setHousingCost(Number(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
                  <label className="text-xs font-semibold text-[var(--cf-text)] block mb-1">
                    Basic Groceries &amp; Utilities
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono text-[var(--cf-text-faint)]">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={livingCost}
                      onChange={e => setLivingCost(Number(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
                  <label className="text-xs font-semibold text-[var(--cf-text)] block mb-1">
                    Software, Hosting &amp; Tools
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono text-[var(--cf-text-faint)]">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={softwareTools}
                      onChange={e => setSoftwareTools(Number(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
                  <label className="text-xs font-semibold text-[var(--cf-text)] block mb-1">
                    Health Insurance &amp; Taxes
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono text-[var(--cf-text-faint)]">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={insuranceCost}
                      onChange={e => setInsuranceCost(Number(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                    />
                  </div>
                </div>
              </div>

              {/* Total Burn Summary Pill */}
              <div className="p-4 rounded-2xl bg-[var(--cf-accent-bg)] border border-[var(--cf-accent)]/30 flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-[var(--cf-text)]">
                  Calculated Monthly Baseline Burn:
                </span>
                <span className="text-lg font-serif font-bold text-[var(--cf-accent)]">
                  {currencySymbol}{totalMonthlyBurn.toLocaleString()} / month
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: CURRENT LIQUID CASH & TAXES */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-[var(--cf-text)]">
                  3. Cash In Bank &amp; Tax Partitioning
                </h3>
                <p className="text-xs text-[var(--cf-text-muted)] mt-0.5">
                  How much liquid cash is sitting in your checking and business accounts right now?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
                  <label className="text-xs font-semibold text-[var(--cf-text)] block mb-1">
                    Current Liquid Cash Reserves
                  </label>
                  <p className="text-[10px] text-[var(--cf-text-muted)] mb-2">
                    Available cash buffer (excluding retirement).
                  </p>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-mono text-[var(--cf-text-faint)]">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={currentCash}
                      onChange={e => setCurrentCash(Number(e.target.value) || 0)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
                  <label className="text-xs font-semibold text-[var(--cf-text)] block mb-1">
                    Estimated Tax Reserve Rate
                  </label>
                  <p className="text-[10px] text-[var(--cf-text-muted)] mb-2">
                    Standard freelancer estimate is 20% to 30%.
                  </p>
                  <div className="relative">
                    <input
                      type="number"
                      min={10}
                      max={50}
                      value={taxBracketPct}
                      onChange={e => setTaxBracketPct(Number(e.target.value) || 25)}
                      className="w-full pl-3 pr-8 py-2 rounded-xl text-sm font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-mono text-[var(--cf-text-faint)]">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Ready to Compute Box */}
              <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-[var(--cf-text-muted)] space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Ready to Calculate True Financial Floor</span>
                </div>
                <p>
                  We will evaluate your 20th percentile income, partition taxes into escrow, and plot your runway exhaustion date across all 6 stress test scenarios.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-[var(--cf-border-soft)] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer"
              style={{
                borderColor: 'var(--cf-border)',
                color: 'var(--cf-text-muted)',
                background: 'var(--cf-surface)',
              }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-md"
              style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-lg hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #0f564a 100%)' }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My Real Floor &amp; Graphs</span>
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
}
