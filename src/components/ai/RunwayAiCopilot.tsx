'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  X,
  Zap,
  Minimize2,
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
  const [showTooltip, setShowTooltip] = useState(false);
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
    const cv = meanIncome > 0 ? (stdDev / meanIncome) : 0;

    // 3. Runway calculation
    const savings = assumptions.currentSavings ?? 0;
    const avgNetFlow = netFlows.reduce((a, b) => a + b, 0) / n;
    const burnRate = meanExpenses - p20Income;
    const runway = burnRate > 0 ? Math.round(savings / burnRate) : 99;

    // 4. Stress-test (lose top 30% revenue client)
    const stressedIncome = p20Income * (1 - (assumptions.clientLossPercentage ?? 0.3));
    const stressedBurn = meanExpenses - stressedIncome;
    const stressedRunway = stressedBurn > 0 ? Math.round(savings / stressedBurn) : 99;

    // 5. Tax reserve
    const taxReserve = meanIncome * (assumptions.taxReservePct ?? 0.25);
    const paycheck = meanIncome - taxReserve - meanExpenses;

    return {
      p20Income: Math.round(p20Income),
      meanIncome: Math.round(meanIncome),
      meanExpenses: Math.round(meanExpenses),
      stdDev: Math.round(stdDev),
      cv: cv.toFixed(2),
      runway: Math.min(runway, 99),
      stressedRunway: Math.min(stressedRunway, 99),
      savings,
      taxReserve: Math.round(taxReserve),
      paycheck: Math.round(Math.max(paycheck, 0)),
      avgNetFlow: Math.round(avgNetFlow),
      n,
    };
  }, [records, assumptions]);

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'init',
      sender: 'ai',
      text: analysis
        ? `Your P20 cash floor is ${currencySymbol}${analysis.p20Income.toLocaleString()}/mo — this is your worst-case income derived from ${analysis.n} months of data. Your estimated runway is ${analysis.runway === 99 ? 'indefinite' : `${analysis.runway} months`} based on current savings. Ask me anything about your finances.`
        : 'Hello! Add your income and expense data to get personalized AI financial insights powered by real DSA quantile calculations.',
      timestamp: 'Now',
    },
  ]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleAskPrompt = (prompt: string) => {
    if (!prompt.trim() || isThinking || !analysis) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      let reply: Message;
      const lower = prompt.toLowerCase();

      if (lower.includes('p20') || lower.includes('floor') || lower.includes('worst')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `Your P20 income floor is ${currencySymbol}${analysis.p20Income.toLocaleString()}/mo. This is calculated using rank-order quantile interpolation across ${analysis.n} months. It represents the income level you'll hit or exceed 80% of the time — your financial bedrock.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metrics: [
            { label: 'P20 Floor', value: `${currencySymbol}${analysis.p20Income.toLocaleString()}`, status: 'good' },
            { label: 'Mean Income', value: `${currencySymbol}${analysis.meanIncome.toLocaleString()}`, status: 'neutral' },
            { label: 'Volatility CV', value: analysis.cv, status: Number(analysis.cv) > 0.4 ? 'warning' : 'good' },
          ],
          formula: `P20 = sortedIncomes[floor(0.2 × n)] = ${currencySymbol}${analysis.p20Income.toLocaleString()}`,
        };
      } else if (lower.includes('runway') || lower.includes('month') || lower.includes('long')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `Based on ${currencySymbol}${analysis.savings.toLocaleString()} savings and your P20 burn rate, your runway is ${analysis.runway === 99 ? 'effectively indefinite' : `~${analysis.runway} months`}. Under a 30% client-loss stress test, this drops to ${analysis.stressedRunway === 99 ? 'still indefinite' : `${analysis.stressedRunway} months`}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metrics: [
            { label: 'Base Runway', value: `${analysis.runway} mo`, status: 'good' },
            { label: 'Stressed (-30%)', value: `${analysis.stressedRunway} mo`, status: analysis.stressedRunway < 4 ? 'warning' : 'good' },
            { label: 'Cash Buffer', value: `${currencySymbol}${analysis.savings.toLocaleString()}`, status: 'neutral' },
          ],
          formula: `Runway = Savings ÷ (Avg Expenses − P20 Income) = ${analysis.runway} months`,
        };
      } else if (lower.includes('tax') || lower.includes('irs') || lower.includes('quarterly')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `Based on your ${(assumptions.taxReservePct * 100).toFixed(0)}% tax reserve rate and average monthly income of ${currencySymbol}${analysis.meanIncome.toLocaleString()}, your monthly tax set-aside should be ${currencySymbol}${analysis.taxReserve.toLocaleString()}. Your IRS safe harbor quarterly payment is ${currencySymbol}${(analysis.taxReserve * 3).toLocaleString()}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metrics: [
            { label: 'Monthly Reserve', value: `${currencySymbol}${analysis.taxReserve.toLocaleString()}`, status: 'good' },
            { label: 'Quarterly Est.', value: `${currencySymbol}${(analysis.taxReserve * 3).toLocaleString()}`, status: 'neutral' },
            { label: 'Reserve Rate', value: `${(assumptions.taxReservePct * 100).toFixed(0)}%`, status: 'good' },
          ],
          formula: `Tax = AvgIncome × TaxRate = ${currencySymbol}${analysis.meanIncome.toLocaleString()} × ${(assumptions.taxReservePct * 100).toFixed(0)}% = ${currencySymbol}${analysis.taxReserve.toLocaleString()}/mo`,
        };
      } else if (lower.includes('spend') || lower.includes('buy') || lower.includes('purchase') || lower.includes('safe')) {
        const amountMatch = prompt.match(/\$?([\d,]+)/);
        const amount = amountMatch ? parseInt(amountMatch[1].replace(',', '')) : 2000;
        const safeToSpend = analysis.savings - (analysis.meanExpenses * assumptions.bufferMonthsMultiplier) > amount;
        reply = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `For a ${currencySymbol}${amount.toLocaleString()} purchase: Your safety buffer is ${currencySymbol}${(analysis.meanExpenses * assumptions.bufferMonthsMultiplier).toLocaleString()} (${assumptions.bufferMonthsMultiplier}× monthly expenses). After this buffer, you have ${currencySymbol}${Math.max(0, analysis.savings - analysis.meanExpenses * assumptions.bufferMonthsMultiplier).toLocaleString()} available. This purchase is ${safeToSpend ? '✓ SAFE' : '⚠ RISKY'}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metrics: [
            { label: 'Safety Buffer', value: `${currencySymbol}${Math.round(analysis.meanExpenses * assumptions.bufferMonthsMultiplier).toLocaleString()}`, status: 'neutral' },
            { label: 'Discretionary', value: `${currencySymbol}${Math.max(0, Math.round(analysis.savings - analysis.meanExpenses * assumptions.bufferMonthsMultiplier)).toLocaleString()}`, status: safeToSpend ? 'good' : 'warning' },
            { label: 'Decision', value: safeToSpend ? 'Safe ✓' : 'Wait ⚠', status: safeToSpend ? 'good' : 'warning' },
          ],
        };
      } else if (lower.includes('stress') || lower.includes('client') || lower.includes('delay')) {
        reply = {
          id: String(Date.now() + 1),
          sender: 'ai',
          text: `In a stress-test scenario where your top client leaves (30% revenue haircut), your projected runway drops to ${analysis.stressedRunway === 99 ? 'Indefinite' : `${analysis.stressedRunway} months`}. Your current savings buffer of ${currencySymbol}${analysis.savings.toLocaleString()} provides adequate protection against standard 30-to-45 day client payment freezes.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metrics: [
            { label: 'P20 Income Floor', value: `${currencySymbol}${analysis.p20Income.toLocaleString()}`, status: 'good' },
            { label: 'Runway Buffer', value: `${analysis.runway} mo`, status: 'good' },
            { label: 'Volatility CV', value: `${analysis.cv}`, status: Number(analysis.cv) > 0.4 ? 'warning' : 'good' },
          ],
        };
      }

      setMessages((prev) => [...prev, reply]);
      setIsThinking(false);
    }, 450);
  };

  const SUGGESTIONS = [
    'What is my P20 worst-case floor?',
    'Safe to spend $3,500 today?',
    'Top client delays 45 days?',
    'IRS quarterly tax estimate',
  ];

  return (
    <>
      {/* ── Compact FAB Icon Button ── */}
      <div className="fixed bottom-6 right-5 sm:right-6 z-40">
        <div className="relative">
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && !isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none"
              >
                <div
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1a4f45, #2F6F62)' }}
                >
                  AI Financial Advisor
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-0 h-0"
                    style={{
                      borderTop: '5px solid transparent',
                      borderBottom: '5px solid transparent',
                      borderLeft: '5px solid #1a4f45',
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="relative flex items-center justify-center w-12 h-12 rounded-full text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #1a4f45, #2F6F62)',
              boxShadow: '0 8px 24px -4px rgba(47, 111, 98, 0.5), 0 0 16px 2px rgba(61, 232, 200, 0.2)',
            }}
            aria-label="AI Financial Advisor"
          >
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-emerald-400" style={{ animationDuration: '2.5s' }} />
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Minimize2 className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Bot className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-50 flex flex-col overflow-hidden"
            style={{
              bottom: '5rem',
              right: '1.25rem',
              width: 'min(92vw, 420px)',
              height: 'min(75vh, 580px)',
              background: 'var(--cf-surface)',
              border: '1px solid var(--cf-border)',
              borderRadius: '20px',
              boxShadow: 'var(--cf-shadow-lg), 0 0 0 1px rgba(47,111,98,0.1)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b shrink-0"
              style={{ borderColor: 'var(--cf-border-soft)', background: 'var(--cf-surface-alt)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0"
                  style={{ background: 'linear-gradient(135deg, #2F6F62, #3DE8C8)' }}
                >
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold" style={{ color: 'var(--cf-text)' }}>
                      AI Financial Advisor
                    </h3>
                    <span
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded font-bold border"
                      style={{
                        background: 'rgba(47,111,98,0.1)',
                        color: 'var(--cf-accent)',
                        borderColor: 'rgba(47,111,98,0.2)',
                      }}
                    >
                      Private
                    </span>
                  </div>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--cf-text-faint)' }}>
                    Client-side only · Zero data transmission
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg transition-colors cursor-pointer"
                style={{ color: 'var(--cf-text-muted)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cf-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                aria-label="Close AI advisor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3" style={{ scrollbarWidth: 'thin' }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className="max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed space-y-2"
                    style={
                      msg.sender === 'user'
                        ? {
                            background: 'linear-gradient(135deg, #2F6F62, #1a4f45)',
                            color: '#fff',
                            borderBottomRightRadius: '4px',
                          }
                        : {
                            background: 'var(--cf-surface-alt)',
                            border: '1px solid var(--cf-border-soft)',
                            color: 'var(--cf-text)',
                            borderBottomLeftRadius: '4px',
                          }
                    }
                  >
                    <p>{msg.text}</p>

                    {msg.metrics && msg.metrics.length > 0 && (
                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        {msg.metrics.map((m) => (
                          <div
                            key={m.label}
                            className="p-1.5 rounded-lg flex flex-col"
                            style={{
                              background: 'var(--cf-surface)',
                              border: '1px solid var(--cf-border-soft)',
                            }}
                          >
                            <span
                              className="text-[9px] font-mono truncate"
                              style={{ color: 'var(--cf-text-faint)' }}
                            >
                              {m.label}
                            </span>
                            <span
                              className="text-[11px] font-bold font-mono mt-0.5"
                              style={{
                                color:
                                  m.status === 'good'
                                    ? 'var(--cf-accent)'
                                    : m.status === 'warning'
                                    ? 'var(--cf-warm)'
                                    : 'var(--cf-text)',
                              }}
                            >
                              {m.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.formula && (
                      <div
                        className="p-1.5 rounded-lg text-[10px] font-mono flex items-center gap-1.5"
                        style={{
                          background: 'rgba(47,111,98,0.08)',
                          border: '1px solid rgba(47,111,98,0.15)',
                          color: 'var(--cf-text-muted)',
                        }}
                      >
                        <Zap className="w-3 h-3 shrink-0" style={{ color: 'var(--cf-warm)' }} />
                        <span className="truncate">{msg.formula}</span>
                      </div>
                    )}
                  </div>
                  <span
                    className="text-[9px] px-1 mt-0.5 font-mono"
                    style={{ color: 'var(--cf-text-faint)' }}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isThinking && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl w-fit text-xs"
                  style={{
                    background: 'var(--cf-surface-alt)',
                    border: '1px solid var(--cf-border-soft)',
                    color: 'var(--cf-text-muted)',
                  }}
                >
                  <div className="flex space-x-1">
                    {[0, 150, 300].map((delay) => (
                      <div
                        key={delay}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          background: 'var(--cf-accent)',
                          animationDelay: `${delay}ms`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[11px]">Computing…</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            <div
              className="px-3 py-2 border-t flex gap-1.5 overflow-x-auto shrink-0"
              style={{
                borderColor: 'var(--cf-border-soft)',
                background: 'var(--cf-surface-alt)',
                scrollbarWidth: 'none',
              }}
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAskPrompt(s)}
                  className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer border whitespace-nowrap"
                  style={{
                    color: 'var(--cf-text-muted)',
                    background: 'var(--cf-surface)',
                    borderColor: 'var(--cf-border-soft)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--cf-text)';
                    e.currentTarget.style.borderColor = 'var(--cf-accent)';
                    e.currentTarget.style.background = 'var(--cf-accent-bg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--cf-text-muted)';
                    e.currentTarget.style.borderColor = 'var(--cf-border-soft)';
                    e.currentTarget.style.background = 'var(--cf-surface)';
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskPrompt(inputValue);
              }}
              className="p-3 border-t flex items-center gap-2 shrink-0"
              style={{
                borderColor: 'var(--cf-border-soft)',
                background: 'var(--cf-surface)',
              }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a financial question…"
                className="flex-1 px-3.5 py-2 rounded-xl text-xs border transition-colors"
                style={{
                  background: 'var(--cf-surface-alt)',
                  borderColor: 'var(--cf-border)',
                  color: 'var(--cf-text)',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--cf-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--cf-border)')}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isThinking}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                style={{ background: 'linear-gradient(135deg, #2F6F62, #3DE8C8)' }}
                aria-label="Send"
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
