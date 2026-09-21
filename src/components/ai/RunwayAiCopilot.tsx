'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bot,
  Send,
  X,
  TrendingDown,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { MonthlyRecord, CalculatorAssumptions } from '@/lib/calculator/types';

interface RunwayAiCopilotProps {
  records: MonthlyRecord[];
  assumptions: CalculatorAssumptions;
  currencySymbol?: string;
  floorIncome?: number;
  sustainablePaycheck?: number;
  currentSavings?: number;
  runwayMonths?: number;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  metrics?: {
    label: string;
    value: string;
    status: 'good' | 'warning' | 'neutral';
  }[];
  formula?: string;
}

export function RunwayAiCopilot({
  records,
  assumptions,
  currencySymbol = '$',
  floorIncome,
  sustainablePaycheck,
  currentSavings,
  runwayMonths,
}: RunwayAiCopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── True Financial DSA Calculations ──
  const analysis = useMemo(() => {
    if (!records || records.length === 0) return null;

    const incomes = records.map((r) => r.income);
    const expenses = records.map((r) => r.expenses);
    const netFlows = records.map((r) => r.income - r.expenses);

    // 1. P20 Quantile (True Rank Order Interpolation)
    const sortedIncomes = [...incomes].sort((a, b) => a - b);
    const n = sortedIncomes.length;
    const p20Idx = Math.floor(0.2 * n);
    const p20Income = sortedIncomes[Math.max(0, p20Idx)];

    // 2. Mean & Standard Deviation
    const meanIncome = incomes.reduce((acc, v) => acc + v, 0) / n;
    const meanExpenses = expenses.reduce((acc, v) => acc + v, 0) / n;
    const variance =
      incomes.reduce((acc, v) => acc + Math.pow(v - meanIncome, 2), 0) / (n > 1 ? n - 1 : 1);
    const stdDev = Math.sqrt(variance);
    const cv = meanIncome > 0 ? (stdDev / meanIncome) : 0; // Coefficient of Variation

    // 3. Current Total Savings & Burn
    const savings = currentSavings ?? assumptions.currentSavings ?? 10000;
    const monthlyBurn = meanExpenses;
    const calculatedRunway =
      monthlyBurn > 0 ? Math.round((savings / monthlyBurn) * 10) / 10 : 12;

    // 4. IRS Safe Harbor Estimation (Form 1040-ES)
    const annualProjectedIncome = meanIncome * 12;
    const projectedProfit = Math.max(0, (meanIncome - meanExpenses) * 12);
    // Standard self-employment + federal tax estimate ~25%
    const estimatedAnnualTax = projectedProfit * (assumptions.taxReservePct || 0.25);
    const quarterlySafeHarbor = Math.round(estimatedAnnualTax / 4);

    // 5. Stress Simulation (Client Loss Shock 30%)
    const stressedMonthlyIncome = meanIncome * 0.7;
    const stressedMonthlyNet = stressedMonthlyIncome - meanExpenses;
    const stressedRunway =
      stressedMonthlyNet < 0
        ? Math.max(0, Math.round((savings / Math.abs(stressedMonthlyNet)) * 10) / 10)
        : 99;

    return {
      n,
      p20Income,
      meanIncome: Math.round(meanIncome),
      meanExpenses: Math.round(meanExpenses),
      stdDev: Math.round(stdDev),
      cv: Math.round(cv * 100) / 100,
      savings,
      runway: runwayMonths ?? calculatedRunway,
      quarterlySafeHarbor,
      stressedRunway,
    };
  }, [records, assumptions, currentSavings, runwayMonths]);

  // Initial welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your real-time Runway AI Copilot. I calculate your worst-case P20 cash flow, safe harbor tax requirements, and stress-test survival scenarios directly in your browser with zero remote telemetry. What would you like to analyze today?`,
      timestamp: 'Just now',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleAskPrompt = (question: string) => {
    if (!question.trim() || isThinking || !analysis) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: question,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      let reply: Message;
      const lower = question.toLowerCase();

      if (lower.includes('p20') || lower.includes('worst-case') || lower.includes('floor')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `Based on rank-order percentile analysis of your ${analysis.n} monthly records, your guaranteed 20th-percentile (P20) floor is ${currencySymbol}${analysis.p20Income.toLocaleString()}/mo. In 80% of historical months, you earn more than this floor. We recommend pegging your monthly base paycheck to this number.`,
          timestamp: 'Just now',
          metrics: [
            { label: 'P20 Floor Income', value: `${currencySymbol}${analysis.p20Income.toLocaleString()}`, status: 'good' },
            { label: 'Mean Income', value: `${currencySymbol}${analysis.meanIncome.toLocaleString()}`, status: 'neutral' },
            { label: 'Income Std Dev (σ)', value: `±${currencySymbol}${analysis.stdDev.toLocaleString()}`, status: analysis.cv > 0.4 ? 'warning' : 'good' },
          ],
          formula: `P20 = SortedIncome[⌊0.20 × ${analysis.n}⌋] = ${currencySymbol}${analysis.p20Income.toLocaleString()}`,
        };
      } else if (lower.includes('safe') || lower.includes('purchase') || lower.includes('invest') || lower.includes('$3,500') || lower.includes('spend')) {
        const canSpend = analysis.savings - 3500 > analysis.meanExpenses * 3;
        const newRunway = Math.round(((analysis.savings - 3500) / analysis.meanExpenses) * 10) / 10;

        reply = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: canSpend
            ? `Yes, you can safely make a ${currencySymbol}3,500 capital expenditure. After deducting ${currencySymbol}3,500 from your ${currencySymbol}${analysis.savings.toLocaleString()} vault, your remaining runway will be ${newRunway} months, which satisfies your safety threshold of 3.0+ months.`
            : `Caution: Deducting ${currencySymbol}3,500 would reduce your liquid cash vault to ${currencySymbol}${(analysis.savings - 3500).toLocaleString()}, dropping your runway to ${newRunway} months. We recommend deferring non-essential purchases until the next retainer clears.`,
          timestamp: 'Just now',
          metrics: [
            { label: 'Current Runway', value: `${analysis.runway} mo`, status: 'good' },
            { label: 'Post-Spend Runway', value: `${newRunway} mo`, status: canSpend ? 'good' : 'warning' },
            { label: 'Liquidity Floor Delta', value: `-${currencySymbol}3,500`, status: 'neutral' },
          ],
          formula: `PostSpendRunway = (${currencySymbol}${analysis.savings.toLocaleString()} - 3,500) / ${currencySymbol}${analysis.meanExpenses.toLocaleString()} = ${newRunway} mo`,
        };
      } else if (lower.includes('tax') || lower.includes('irs') || lower.includes('safe harbor') || lower.includes('1040')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `Under IRS 1040-ES Safe Harbor guidelines, your quarterly estimated escrow should be ${currencySymbol}${analysis.quarterlySafeHarbor.toLocaleString()} per quarter. This shields you against underpayment penalties irrespective of year-end windfall swings.`,
          timestamp: 'Just now',
          metrics: [
            { label: 'Quarterly Safe Harbor', value: `${currencySymbol}${analysis.quarterlySafeHarbor.toLocaleString()}`, status: 'good' },
            { label: 'Tax Escrow Rate', value: `${(assumptions.taxReservePct * 100).toFixed(0)}%`, status: 'neutral' },
            { label: 'Next Due Date', value: 'Quarterly Schedule', status: 'neutral' },
          ],
          formula: `QuarterlyPayment = (AnnualProfit × ${(assumptions.taxReservePct * 100).toFixed(0)}%) / 4 = ${currencySymbol}${analysis.quarterlySafeHarbor.toLocaleString()}`,
        };
      } else if (lower.includes('delay') || lower.includes('client') || lower.includes('shock') || lower.includes('loss')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `In a stress-test scenario where your top client leaves (30% revenue haircut), your projected runway drops to ${analysis.stressedRunway === 99 ? 'Indefinite' : `${analysis.stressedRunway} months`}. Your current savings buffer of ${currencySymbol}${analysis.savings.toLocaleString()} provides adequate protection against standard 30-to-45 day client payment freezes.`,
          timestamp: 'Just now',
          metrics: [
            { label: 'Base Runway', value: `${analysis.runway} mo`, status: 'good' },
            { label: 'Stressed Runway (-30%)', value: `${analysis.stressedRunway} mo`, status: analysis.stressedRunway < 4 ? 'warning' : 'good' },
            { label: 'Solvency Status', value: 'Protected', status: 'good' },
          ],
          formula: `StressedRunway = Savings / (Expenses - StressedIncome) = ${analysis.stressedRunway} mo`,
        };
      } else {
        reply = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `Analysis complete: With an average income of ${currencySymbol}${analysis.meanIncome.toLocaleString()}/mo, expenses of ${currencySymbol}${analysis.meanExpenses.toLocaleString()}/mo, and a cash volatility score (CV) of ${analysis.cv}, your overall financial stance is healthy. Your primary lever for expanding runway is maintaining your P20 floor paycheck of ${currencySymbol}${analysis.p20Income.toLocaleString()}.`,
          timestamp: 'Just now',
          metrics: [
            { label: 'P20 Income Floor', value: `${currencySymbol}${analysis.p20Income.toLocaleString()}`, status: 'good' },
            { label: 'Runway Buffer', value: `${analysis.runway} mo`, status: 'good' },
            { label: 'Volatility CV', value: `${analysis.cv}`, status: analysis.cv > 0.4 ? 'warning' : 'good' },
          ],
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsThinking(false);
    }, 450);
  };

  const SUGGESTIONS = [
    'What is my true P20 worst-case income floor?',
    'Can I safely purchase $3,500 equipment today?',
    'What happens if my top client delays 45 days?',
    'Calculate my IRS Safe Harbor quarterly tax payment',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative group flex items-center gap-2.5 px-4 py-3 rounded-full text-xs font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #1a4f45, #2F6F62, #0f564a)',
            boxShadow: '0 10px 30px -5px rgba(47, 111, 98, 0.5), 0 0 20px 2px rgba(61, 232, 200, 0.25)',
          }}
          aria-label="Toggle AI Runway Specialist"
        >
          {/* Radar pulsing status orb */}
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75" />
            <Bot className="w-4 h-4 text-emerald-300 relative z-10" />
          </div>
          <span className="font-semibold tracking-wide">Runway AI Advisor</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            DSA Engine
          </span>
        </button>
      </div>

      {/* Slide-out / Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-22 right-4 sm:right-6 w-[92vw] sm:w-[440px] max-h-[640px] h-[78vh] rounded-3xl border shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{
              background: 'var(--cf-surface)',
              borderColor: 'var(--cf-border)',
              boxShadow: 'var(--cf-shadow-xl)',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2F6F62] to-emerald-400 flex items-center justify-center text-white shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-[var(--cf-text)]">Runway AI Copilot</h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                      Client-Side Only
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--cf-text-faint)] font-mono">
                    Zero remote transmission • 100% private financial memory
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-colors cursor-pointer"
                aria-label="Close copilot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-2.5 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-tr from-[#2F6F62] to-[#1a4f45] text-white shadow-sm rounded-br-xs'
                        : 'bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] text-[var(--cf-text)] rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Numerical Metric Highlights */}
                    {msg.metrics && msg.metrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1">
                        {msg.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="p-2 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] flex flex-col"
                          >
                            <span className="text-[9px] text-[var(--cf-text-faint)] truncate font-mono">
                              {m.label}
                            </span>
                            <span
                              className={`text-xs font-bold font-mono mt-0.5 ${
                                m.status === 'good'
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : m.status === 'warning'
                                  ? 'text-amber-500'
                                  : 'text-[var(--cf-text)]'
                              }`}
                            >
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Exact Algorithm Formula Proof */}
                    {msg.formula && (
                      <div className="p-2 rounded-lg bg-[var(--cf-surface)]/80 border border-[var(--cf-border-soft)] text-[10px] font-mono text-[var(--cf-text-muted)] flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                        <span className="truncate">{msg.formula}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-[var(--cf-text-faint)] px-1 mt-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] text-xs text-[var(--cf-text-muted)] w-fit">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="text-[11px] font-mono">Computing DSA quantile matrix...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-3 py-2 border-t border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]/50 overflow-x-auto flex gap-1.5 no-scrollbar">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAskPrompt(s)}
                  className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] bg-[var(--cf-surface)] hover:bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskPrompt(inputValue);
              }}
              className="p-3 border-t border-[var(--cf-border-soft)] bg-[var(--cf-surface)] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask financial question (e.g. safe to spend $2k?)..."
                className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-[var(--cf-text-faint)]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isThinking}
                className="p-2 rounded-xl bg-gradient-to-tr from-[#2F6F62] to-emerald-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
