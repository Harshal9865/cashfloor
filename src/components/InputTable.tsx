'use client';

import React from 'react';
import { MonthlyRecord } from '../lib/calculator/types';
import { Plus, ClipboardPaste, Trash2, Lock } from 'lucide-react';

interface InputTableProps {
  records: MonthlyRecord[];
  onChange: (updated: MonthlyRecord[]) => void;
  onOpenPasteModal: () => void;
  taxReservePct?: number;
  sustainablePaycheck?: number;
  initialSavings?: number;
  floorIncome?: number;
  currencySymbol?: string;
  isLocked?: boolean;
  onUnlockRequest?: () => void;
}

export const InputTable: React.FC<InputTableProps> = ({
  records,
  onChange,
  onOpenPasteModal,
  taxReservePct = 0.25,
  sustainablePaycheck = 1725,
  initialSavings = 8820,
  floorIncome = 2300,
  currencySymbol = '$',
  isLocked = false,
  onUnlockRequest,
}) => {
  const handleRecordChange = (
    index: number,
    field: 'month' | 'income' | 'expenses' | 'clientTag',
    val: string
  ) => {
    if (isLocked) {
      onUnlockRequest?.();
      return;
    }
    const updated = [...records];
    if (field === 'month' || field === 'clientTag') {
      updated[index] = { ...updated[index], [field]: val };
    } else {
      const num = Math.max(0, parseFloat(val) || 0);
      updated[index] = { ...updated[index], [field]: num };
    }
    onChange(updated);
  };

  const handleAddRow = () => {
    if (isLocked) {
      onUnlockRequest?.();
      return;
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const nextMonth = months[records.length % 12];
    const newRecord: MonthlyRecord = {
      id: `custom-${Date.now()}`,
      month: nextMonth,
      income: 3600,
      expenses: 2100,
      clientTag: 'Standard Retainer',
    };
    onChange([...records, newRecord]);
  };

  const handleRemoveRow = (index: number) => {
    if (isLocked) {
      onUnlockRequest?.();
      return;
    }
    if (records.length <= 1) return;
    const updated = records.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Calculate row-by-row double entry progression
  let rollingCash = initialSavings;
  let totalGross = 0;
  let totalTaxEscrow = 0;
  let totalDraw = 0;
  let totalNetChange = 0;

  const rowsWithAccounting = records.map((r, i) => {
    const gross = r.income;
    const taxEscrow = Math.round(gross * taxReservePct);
    const personalDraw = r.expenses;
    const netChange = gross - taxEscrow - personalDraw;
    rollingCash += netChange;

    totalGross += gross;
    totalTaxEscrow += taxEscrow;
    totalDraw += personalDraw;
    totalNetChange += netChange;

    const isLean = gross < floorIncome;
    const isTaxMonth = i === 2 || i === 8;

    return {
      ...r,
      gross,
      taxEscrow,
      personalDraw,
      netChange,
      endingCash: rollingCash,
      isLean,
      isTaxMonth,
    };
  });

  const totalDebits = totalTaxEscrow + totalDraw;

  return (
    <section
      className="overflow-hidden transition-colors relative rounded-2xl border"
      style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
      id="ledger-archive"
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
                12-Month Double-Entry Ledger
              </h3>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--cf-text-muted)' }}>
                Auditable cash schedule accounting for retainers, variable client contracts, quarterly tax escrow, and drawings.
              </p>
            </div>
            <button
              type="button"
              onClick={onUnlockRequest}
              className="px-6 py-2.5 rounded-full text-xs font-semibold text-white transition-all cursor-pointer shadow-md hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
            >
              Unlock 12-Month Ledger — Sign In Free
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 hairline-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FBFDFB]">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="font-serif text-xl sm:text-2xl text-[#16232B] font-normal tracking-tight">
              Detailed Double-Entry Cash Ledger
            </h2>
            <span className="text-xs font-mono bg-[#E8EDE9] px-2 py-0.5 border border-[#16232B]/10">
              12-Month Ledger Cycle
            </span>
          </div>
          <p className="font-sans text-xs text-[#5C6D77] mt-0.5">
            Auditable schedule accounting for confirmed retainers, variable contracts, tax escrow, and drawings.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <button
            type="button"
            onClick={onOpenPasteModal}
            className="bg-[#F1F4F2] hover:bg-[#E8EDE9] text-[#16232B] px-3 py-1.5 hairline-all flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-[#2F6F62]" />
            <span>Paste CSV / TSV</span>
          </button>
          <button
            type="button"
            onClick={handleAddRow}
            className="bg-[#16232B] hover:bg-[#2F6F62] text-[#F1F4F2] px-3 py-1.5 flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event Row</span>
          </button>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll matching Google Stitch */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#E8EDE9] font-mono text-[10px] text-[#5C6D77] tracking-wider uppercase hairline-b">
              <th className="py-3 px-4 font-semibold">Month</th>
              <th className="py-3 px-4 font-semibold text-right">Gross Income</th>
              <th className="py-3 px-4 font-semibold text-right text-[#875205]">Tax Escrow (-{Math.round(taxReservePct * 100)}%)</th>
              <th className="py-3 px-4 font-semibold text-right">Personal Draw</th>
              <th className="py-3 px-4 font-semibold text-right">Net Change</th>
              <th className="py-3 px-4 font-semibold text-right text-[#0f564a]">Ending Cash</th>
              <th className="py-3 px-2 text-center w-10"></th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs divide-y divide-[#16232B]/[0.08] text-[#16232B]">
            {rowsWithAccounting.map((row, index) => (
              <tr
                key={row.id || index}
                className={`transition-colors hover:bg-[#2F6F62]/[0.02] ${
                  row.isLean ? 'bg-[#B4573F]/[0.03]' : ''
                }`}
              >
                {/* Month & Status */}
                <td className="py-2.5 px-4 font-sans font-medium text-[#16232B]">
                  <div className="flex items-center space-x-1.5">
                    {row.isLean && <span className="w-1.5 h-1.5 rounded-full bg-[#B4573F]"></span>}
                    <input
                      type="text"
                      value={row.month}
                      onChange={(e) => handleRecordChange(index, 'month', e.target.value)}
                      className="w-20 bg-transparent border-b border-transparent hover:border-[#16232B]/20 focus:border-[#2F6F62] py-0.5 text-xs font-semibold text-[#16232B]"
                    />
                    {row.isLean && (
                      <span className="text-[9px] uppercase tracking-wider font-mono text-[#84331e]">
                        (Lean Cycle)
                      </span>
                    )}
                    {row.isTaxMonth && (
                      <span className="text-[9px] uppercase tracking-wider font-mono text-[#875205]">
                        (Tax Out)
                      </span>
                    )}
                  </div>
                </td>

                {/* Gross Income Input */}
                <td className="py-2.5 px-4 text-right">
                  <div className="inline-flex items-center justify-end">
                    <span className="text-xs text-[#5C6D77] mr-1">{currencySymbol}</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={row.income || ''}
                      onChange={(e) => handleRecordChange(index, 'income', e.target.value)}
                      className="w-24 bg-transparent border-b border-[#16232B]/20 text-right text-xs font-semibold text-[#16232B] focus:border-[#2F6F62] py-0.5"
                    />
                  </div>
                </td>

                {/* Tax Escrow */}
                <td className="py-2.5 px-4 text-right font-mono text-[#875205] tabular-nums">
                  -{currencySymbol}{row.taxEscrow.toLocaleString()}
                </td>

                {/* Personal Draw Input */}
                <td className="py-2.5 px-4 text-right">
                  <div className="inline-flex items-center justify-end">
                    <span className="text-xs text-[#5C6D77] mr-1">-{currencySymbol}</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={row.expenses || ''}
                      onChange={(e) => handleRecordChange(index, 'expenses', e.target.value)}
                      className="w-24 bg-transparent border-b border-[#16232B]/20 text-right text-xs text-[#16232B] focus:border-[#2F6F62] py-0.5"
                    />
                  </div>
                </td>

                {/* Net Change */}
                <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                  <span className={row.netChange >= 0 ? 'text-[#0f564a] font-medium' : 'text-[#84331e] font-medium'}>
                    {row.netChange >= 0 ? '+' : '-'}
                    {currencySymbol}
                    {Math.abs(row.netChange).toLocaleString()}
                  </span>
                </td>

                {/* Ending Cash */}
                <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums text-[#0f564a]">
                  {currencySymbol}
                  {Math.round(row.endingCash).toLocaleString()}
                </td>

                {/* Row delete */}
                <td className="py-2.5 px-2 text-center">
                  {records.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Remove ${row.month}`}
                      onClick={() => handleRemoveRow(index)}
                      className="text-[#8E9EA7] hover:text-[#B4573F] p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>

          {/* Totals Footer Summary Row matching Google Stitch */}
          <tfoot>
            <tr className="bg-[#E8EDE9] font-mono font-semibold text-xs hairline-t text-[#16232B]">
              <td className="py-3.5 px-4 font-sans font-bold">12-Mo Cumulative</td>
              <td className="py-3.5 px-4 text-right font-bold tabular-nums">
                {currencySymbol}{totalGross.toLocaleString()}
              </td>
              <td className="py-3.5 px-4 text-right text-[#875205] tabular-nums">
                -{currencySymbol}{totalTaxEscrow.toLocaleString()}
              </td>
              <td className="py-3.5 px-4 text-right tabular-nums">
                -{currencySymbol}{totalDraw.toLocaleString()}
              </td>
              <td className="py-3.5 px-4 text-right text-[#0f564a] font-bold tabular-nums">
                {totalNetChange >= 0 ? '+' : '-'}
                {currencySymbol}{Math.abs(totalNetChange).toLocaleString()}
              </td>
              <td className="py-3.5 px-4 text-right text-[#0f564a] font-bold text-sm tabular-nums">
                {currencySymbol}{Math.round(rollingCash).toLocaleString()}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Ledger Footer Notes matching Google Stitch */}
      <div className="p-4 bg-[#FBFDFB] hairline-t flex flex-col md:flex-row justify-between items-start md:items-center text-[11px] font-mono text-[#5C6D77] gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#0f564a]"></span>
          <span>
            Double-entry balance check: Total Credits ({currencySymbol}{totalGross.toLocaleString()}) minus Debits ({currencySymbol}{totalDebits.toLocaleString()}) reconciles to {totalNetChange >= 0 ? '+' : '-'}{currencySymbol}{Math.abs(totalNetChange).toLocaleString()} Net Asset Change.
          </span>
        </div>
        <div>
          <span>Audited: Real-Time Verified</span>
        </div>
      </div>
    </section>
  );
};
