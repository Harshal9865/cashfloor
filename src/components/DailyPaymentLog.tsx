'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Sparkles,
  Search,
  Trash2,
  DollarSign,
  X
} from 'lucide-react';

export interface DailyTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  dayNumber: number; // 1-30
  title: string;
  category: 'client_invoice' | 'retainer' | 'platform_payout' | 'expense' | 'tax_payment';
  amount: number; // positive for inflow, negative for expense
  clientOrVendor: string;
  status: 'cleared' | 'pending' | 'scheduled';
}

function AnimatedCounter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    let start = display;
    const end = value;
    if (start === end) return;

    const duration = 600;
    const startTime = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (end - start) * ease);
      setDisplay(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return <span>{prefix}{display.toLocaleString()}</span>;
}

const INITIAL_DAILY_TRANSACTIONS: DailyTransaction[] = [
  {
    id: 'tx-1',
    date: '2026-09-01',
    dayNumber: 1,
    title: 'Studio Rent & Coworking',
    category: 'expense',
    amount: -1400,
    clientOrVendor: 'WeWork / Studio Landlord',
    status: 'cleared',
  },
  {
    id: 'tx-2',
    date: '2026-09-03',
    dayNumber: 3,
    title: 'Monthly Retainer Wire',
    category: 'retainer',
    amount: 3200,
    clientOrVendor: 'Acme Corp Tech',
    status: 'cleared',
  },
  {
    id: 'tx-3',
    date: '2026-09-07',
    dayNumber: 7,
    title: 'Adobe CC & Figma Pro Subs',
    category: 'expense',
    amount: -115,
    clientOrVendor: 'Adobe & Figma',
    status: 'cleared',
  },
  {
    id: 'tx-4',
    date: '2026-09-12',
    dayNumber: 12,
    title: 'Milestone 2 Delivery: UI Redesign',
    category: 'client_invoice',
    amount: 4500,
    clientOrVendor: 'Bolt Studio Inc',
    status: 'cleared',
  },
  {
    id: 'tx-5',
    date: '2026-09-15',
    dayNumber: 15,
    title: 'Stripe Payout: Digital Templates',
    category: 'platform_payout',
    amount: 680,
    clientOrVendor: 'Stripe Payouts',
    status: 'cleared',
  },
  {
    id: 'tx-6',
    date: '2026-09-18',
    dayNumber: 18,
    title: 'AWS & Vercel Cloud Infrastructure',
    category: 'expense',
    amount: -85,
    clientOrVendor: 'Amazon Web Services',
    status: 'cleared',
  },
  {
    id: 'tx-7',
    date: '2026-09-22',
    dayNumber: 22,
    title: 'Advisory Consultation Call',
    category: 'client_invoice',
    amount: 1200,
    clientOrVendor: 'Apex Capital Partners',
    status: 'cleared',
  },
  {
    id: 'tx-8',
    date: '2026-09-28',
    dayNumber: 28,
    title: 'Quarterly Estimated Tax Reserve Transfer',
    category: 'tax_payment',
    amount: -1800,
    clientOrVendor: 'IRS Direct Pay Escrow',
    status: 'scheduled',
  },
];

interface DailyPaymentLogProps {
  currencySymbol?: string;
  onTransactionsChange?: (transactions: DailyTransaction[]) => void;
}

export function DailyPaymentLog({
  currencySymbol = '$',
  onTransactionsChange,
}: DailyPaymentLogProps) {
  const [transactions, setTransactions] = useState<DailyTransaction[]>(INITIAL_DAILY_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Transaction Form State
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<number>(1500);
  const [newType, setNewType] = useState<'inflow' | 'outflow'>('inflow');
  const [newCategory, setNewCategory] = useState<DailyTransaction['category']>('client_invoice');
  const [newClient, setNewClient] = useState('');
  const [newDay, setNewDay] = useState<number>(15);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.clientOrVendor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || 
        (filterCategory === 'inflows' && tx.amount > 0) ||
        (filterCategory === 'outflows' && tx.amount < 0) ||
        tx.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, filterCategory]);

  // Aggregate Totals
  const totalInflow = useMemo(() => {
    return transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  }, [transactions]);

  const totalOutflow = useMemo(() => {
    return transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  }, [transactions]);

  const netDailyCash = totalInflow - totalOutflow;

  // Auto-Partition Calculation for Inflows (25% Taxes, 40% Buffer, 35% Safe Stipend)
  const taxPartition = Math.round(totalInflow * 0.25);
  const bufferPartition = Math.round(totalInflow * 0.40);
  const stipendPartition = Math.round(totalInflow * 0.35);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const finalAmount = newType === 'outflow' ? -Math.abs(newAmount) : Math.abs(newAmount);
    const dayStr = newDay < 10 ? `0${newDay}` : `${newDay}`;
    const newTx: DailyTransaction = {
      id: `tx-${Date.now()}`,
      date: `2026-09-${dayStr}`,
      dayNumber: newDay,
      title: newTitle,
      category: newCategory,
      amount: finalAmount,
      clientOrVendor: newClient || (newType === 'inflow' ? 'Direct Client' : 'Vendor'),
      status: 'cleared',
    };

    const updated = [...transactions, newTx].sort((a, b) => a.dayNumber - b.dayNumber);
    setTransactions(updated);
    if (onTransactionsChange) onTransactionsChange(updated);

    // Reset
    setNewTitle('');
    setNewClient('');
    setIsAddModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    if (onTransactionsChange) onTransactionsChange(updated);
  };

  return (
    <div 
      className="rounded-3xl border overflow-hidden p-6 sm:p-8 space-y-6 transition-colors shadow-sm"
      style={{
        background: 'var(--cf-surface)',
        borderColor: 'var(--cf-border)',
      }}
      id="daily-log"
    >
      {/* ── Top Header & Aggregates Ribbon ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[var(--cf-border-soft)]">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="p-1.5 rounded-lg bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] border border-[var(--cf-accent)]/20">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-serif font-bold text-[var(--cf-text)]">
              Daily Payment &amp; Inflow Ledger
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text-muted)]">
              September 2026 Feed
            </span>
          </div>
          <p className="text-xs text-[var(--cf-text-muted)] max-w-xl leading-relaxed">
            Record exact invoice arrival dates and daily expenses. CashFloor automatically routes every payment into sovereign tax escrow and operating buffers.
          </p>
        </div>

        {/* Quick Action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-md transition-all cursor-pointer hover:opacity-95"
            style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Log Daily Payment</span>
          </button>
        </div>
      </div>

      {/* ── Key Daily Metrics Ribbon ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Inflows */}
        <div className="p-4 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--cf-text-faint)]">
            <span>Monthly Inflows</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-600 mt-1">
            <AnimatedCounter value={totalInflow} prefix={`+${currencySymbol}`} />
          </div>
          <span className="text-[10px] font-mono text-[var(--cf-text-muted)] mt-0.5 block">
            Across {transactions.filter(t => t.amount > 0).length} client payments
          </span>
        </div>

        {/* Total Outflows */}
        <div className="p-4 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--cf-text-faint)]">
            <span>Monthly Outflows</span>
            <ArrowDownRight className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-[var(--cf-caution)] mt-1">
            <AnimatedCounter value={totalOutflow} prefix={`-${currencySymbol}`} />
          </div>
          <span className="text-[10px] font-mono text-[var(--cf-text-muted)] mt-0.5 block">
            Rent, software &amp; tax escrow transfers
          </span>
        </div>

        {/* Net Cash Generated */}
        <div className="p-4 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
          <div className="flex items-center justify-between text-xs font-mono text-[var(--cf-text-faint)]">
            <span>Net Monthly Surplus</span>
            <Sparkles className="w-4 h-4 text-[var(--cf-accent)]" />
          </div>
          <div className={`text-2xl font-serif font-bold mt-1 ${netDailyCash >= 0 ? 'text-[var(--cf-accent)]' : 'text-rose-500'}`}>
            <AnimatedCounter value={netDailyCash} prefix={netDailyCash >= 0 ? `+${currencySymbol}` : currencySymbol} />
          </div>
          <span className="text-[10px] font-mono text-[var(--cf-text-muted)] mt-0.5 block">
            Directly reinforcing your liquid runway
          </span>
        </div>
      </div>

      {/* ── Automated 5-Pillar Capital Routing Live Preview ── */}
      <div 
        className="p-4 sm:p-5 rounded-2xl border bg-[var(--cf-accent-bg)] border-[var(--cf-accent)]/20 space-y-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--cf-accent)]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--cf-text)]">
              Automatic Inflow Partitioning Protocol
            </span>
          </div>
          <span className="text-[11px] font-mono text-[var(--cf-accent)] font-semibold">
            <AnimatedCounter value={totalInflow} prefix={`$`} /> Inflows Routed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
            <span className="text-[10px] font-mono text-[var(--cf-text-faint)] block">
              1. Tax Escrow (25%)
            </span>
            <span className="text-sm font-serif font-bold text-rose-500 mt-0.5 block">
              ${taxPartition.toLocaleString()} Locked
            </span>
            <span className="text-[9px] text-[var(--cf-text-muted)]">Safe from imposter spending</span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
            <span className="text-[10px] font-mono text-[var(--cf-text-faint)] block">
              2. Operating Buffer (40%)
            </span>
            <div className="text-sm font-serif font-bold text-[var(--cf-accent)] mt-0.5 flex items-center gap-1">
              <AnimatedCounter value={bufferPartition} prefix={currencySymbol} />
              <span>Buffered</span>
            </div>
            <span className="text-[9px] text-[var(--cf-text-muted)]">Cushions 60-day invoice delays</span>
          </div>

          <div className="p-3 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
            <span className="text-[10px] font-mono text-[var(--cf-text-faint)] block">
              3. Owner Safe Draw (35%)
            </span>
            <span className="text-sm font-serif font-bold text-emerald-600 mt-0.5 block">
              ${stipendPartition.toLocaleString()} Stipend
            </span>
            <span className="text-[9px] text-[var(--cf-text-muted)]">Guaranteed personal paycheck</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--cf-text-faint)]" />
          <input
            type="text"
            placeholder="Search client, vendor or title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)] focus:outline-none focus:border-[var(--cf-accent)]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'inflows', label: 'Inflows Only' },
            { id: 'outflows', label: 'Expenses' },
            { id: 'retainer', label: 'Retainers' },
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterCategory(f.id)}
              className={`px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer border ${
                filterCategory === f.id
                  ? 'bg-[var(--cf-surface-alt)] border-[var(--cf-accent)] text-[var(--cf-text)] font-semibold'
                  : 'border-transparent text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Transactions Table ── */}
      <div className="overflow-x-auto border border-[var(--cf-border-soft)] rounded-2xl">
        <table className="w-full text-xs font-mono text-left">
          <thead>
            <tr className="border-b border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)] text-[var(--cf-text-faint)]">
              <th className="py-2.5 px-4 font-medium">Day</th>
              <th className="py-2.5 px-4 font-medium">Description</th>
              <th className="py-2.5 px-4 font-medium">Client / Counterparty</th>
              <th className="py-2.5 px-4 font-medium">Category</th>
              <th className="py-2.5 px-4 font-medium text-right">Amount</th>
              <th className="py-2.5 px-4 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--cf-border-soft)]">
            <AnimatePresence>
              {filteredTransactions.map(tx => {
                const isInflow = tx.amount > 0;
  
                return (
                  <motion.tr 
                    key={tx.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-[var(--cf-surface-alt)]/60 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-[var(--cf-text)]">
                      Day {tx.dayNumber}
                    </td>
                    <td className="py-3 px-4 text-[var(--cf-text)] font-sans font-medium">
                      {tx.title}
                    </td>
                    <td className="py-3 px-4 text-[var(--cf-text-muted)]">
                      {tx.clientOrVendor}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] text-[var(--cf-text-muted)]">
                        {tx.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold font-mono">
                      <span className={isInflow ? 'text-emerald-500' : 'text-rose-500'}>
                        {isInflow ? '+' : '-'}{currencySymbol}{Math.abs(tx.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="p-1 rounded text-[var(--cf-text-faint)] hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* ── Add Payment Modal ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl border shadow-2xl relative"
              style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] border border-[var(--cf-accent)]/30 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-[var(--cf-text)]">
                    Log Daily Payment or Expense
                  </h3>
                  <p className="text-xs text-[var(--cf-text-muted)]">
                    Directly feeds your 30-day cash flow curve
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-4">
                {/* Inflow vs Outflow */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                  <button
                    type="button"
                    onClick={() => setNewType('inflow')}
                    className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      newType === 'inflow' ? 'bg-[var(--cf-surface)] text-emerald-600 shadow-sm' : 'text-[var(--cf-text-muted)]'
                    }`}
                  >
                    + Income Inflow
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewType('outflow')}
                    className={`py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      newType === 'outflow' ? 'bg-[var(--cf-surface)] text-rose-500 shadow-sm' : 'text-[var(--cf-text-muted)]'
                    }`}
                  >
                    - Business Expense
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--cf-text)] block mb-1">
                    Description / Invoice Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Retainer, Logo Design Milestone"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--cf-text)] block mb-1">
                      Amount ({currencySymbol})
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newAmount}
                      onChange={e => setNewAmount(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--cf-text)] block mb-1">
                      Day of Month (1–30)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={30}
                      value={newDay}
                      onChange={e => setNewDay(Number(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--cf-text)] block mb-1">
                    Client or Counterparty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp, Stripe, Adobe"
                    value={newClient}
                    onChange={e => setNewClient(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs font-mono border bg-[var(--cf-surface)] text-[var(--cf-text)] border-[var(--cf-border)]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono border border-[var(--cf-border)] text-[var(--cf-text-muted)] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-md cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DailyPaymentLog;
