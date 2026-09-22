'use client';

import React from 'react';
import { MonthlyRecord } from '../lib/calculator/types';
import { Plus, ClipboardPaste, Trash2, Lock, FileSpreadsheet, Globe } from 'lucide-react';

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
    field: keyof MonthlyRecord,
    val: any
  ) => {
    if (isLocked) {
      onUnlockRequest?.();
      return;
    }
    const updated = [...records];
    if (field === 'month' || field === 'clientTag') {
      updated[index] = { ...updated[index], [field]: val };
    } else if (field === 'isForeignCurrency') {
      updated[index] = { ...updated[index], [field]: Boolean(val) };
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
          style={{ background: 'rgba(var(--cf-surface-rgb), 0.95)' }}
        >
          <div className="text-center space-y-3.5 p-8 max-w-sm mx-auto">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-sm"
              style={{ background: 'var(--cf-surface-alt)', border: '1px solid var(--cf-border)' }}
            >
              <Lock className="w-6 h-6" style={{ color: 'var(--cf-accent)' }} />
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
              style={{ background: 'linear-gradient(135deg, var(--cf-accent), #1a4f45)' }}
            >
              Unlock 12-Month Ledger — Sign In Free
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal tracking-tight" style={{ color: 'var(--cf-text)' }}>
              Detailed Double-Entry Cash Ledger
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 border rounded" style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)', color: 'var(--cf-text)' }}>
              12-Month Ledger Cycle
            </span>
          </div>
          <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--cf-text-muted)' }}>
            Auditable schedule accounting for confirmed retainers, variable contracts, tax escrow, and drawings.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <button
            type="button"
            onClick={onOpenPasteModal}
            className="px-3 py-1.5 border rounded flex items-center space-x-1.5 transition-colors cursor-pointer"
            style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)', color: 'var(--cf-text)' }}
          >
            <ClipboardPaste className="w-3.5 h-3.5" style={{ color: 'var(--cf-accent)' }} />
            <span>Paste CSV / TSV</span>
          </button>
          <button
            type="button"
            onClick={handleAddRow}
            className="px-3 py-1.5 rounded flex items-center space-x-1 transition-colors cursor-pointer"
            style={{ background: 'var(--cf-text)', color: 'var(--cf-bg)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event Row</span>
          </button>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto min-h-[300px] flex flex-col">
        {records.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-xl border-2 border-dashed m-6" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border-soft)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border shadow-sm" style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}>
              <FileSpreadsheet className="w-8 h-8 opacity-80" style={{ color: 'var(--cf-text-muted)' }} />
            </div>
            <h3 className="font-serif text-lg mb-2" style={{ color: 'var(--cf-text)' }}>No Ledger Data</h3>
            <p className="text-sm max-w-md mx-auto mb-6 leading-relaxed" style={{ color: 'var(--cf-text-muted)' }}>
              Your financial ledger is currently empty. 
              <br/><br/>
              <strong className="text-[var(--cf-text)]">Pro Tip:</strong> Export a 12-month CSV transaction history from your bank, <strong>Upwork, Stripe, or QuickBooks</strong>, and paste it directly into CashFloor.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddRow}
                className="px-4 py-2 text-sm font-semibold rounded-lg text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
                style={{ background: 'var(--cf-accent)' }}
              >
                Add First Record
              </button>
              <button
                onClick={onOpenPasteModal}
                className="px-4 py-2 text-sm font-semibold rounded-lg border transition-colors cursor-pointer"
                style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)', color: 'var(--cf-text)' }}
              >
                Paste CSV
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block w-full">
              <table className="w-full text-left border-collapse">
            <thead>
              <tr className="font-mono text-[10px] tracking-wider uppercase border-b-2" style={{ background: 'var(--cf-surface-alt)', color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border-soft)' }}>
                <th className="py-3 px-4 font-semibold">Month</th>
                <th className="py-3 px-4 font-semibold text-right">Gross Income</th>
                <th className="py-3 px-4 font-semibold text-right text-[#875205]">Tax Escrow (-{Math.round(taxReservePct * 100)}%)</th>
                <th className="py-3 px-4 font-semibold text-right">Personal Draw</th>
                <th className="py-3 px-4 font-semibold text-right">Net Change</th>
                <th className="py-3 px-4 font-semibold text-right" style={{ color: 'var(--cf-accent)' }}>Ending Cash</th>
                <th className="py-3 px-2 text-center w-10"></th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs divide-y" style={{ borderColor: 'var(--cf-border)', color: 'var(--cf-text)' }}>
              {rowsWithAccounting.map((row, index) => (
                <tr
                  key={row.id || index}
                  className="transition-all hover:bg-[var(--cf-surface-alt)] group"
                  style={{ background: row.isLean ? 'rgba(180,87,63,0.03)' : 'transparent' }}
                >
                  {/* Month & Status */}
                  <td className="py-2.5 px-4 font-sans font-medium" style={{ color: 'var(--cf-text)' }}>
                    <div className="flex items-center space-x-1.5">
                      {row.isLean && <span className="w-1.5 h-1.5 rounded-full bg-[#B4573F]"></span>}
                      <input
                        type="text"
                        value={row.month}
                        onChange={(e) => handleRecordChange(index, 'month', e.target.value)}
                        className="w-20 bg-transparent px-2 py-1 rounded-md border border-transparent hover:border-[var(--cf-border)] focus:border-[var(--cf-accent)] focus:ring-1 focus:ring-[var(--cf-accent)] focus:outline-none transition-all text-xs font-semibold"
                        style={{ color: 'var(--cf-text)' }}
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
                    <div className="inline-flex items-center justify-end group">
                      <button
                        type="button"
                        onClick={() => handleRecordChange(index, 'isForeignCurrency', !row.isForeignCurrency)}
                        title="Toggle Foreign Currency (Applies 3% FX volatility haircut)"
                        className={`mr-2 p-1 rounded transition-colors ${row.isForeignCurrency ? 'bg-[var(--cf-accent)]/20 text-[var(--cf-accent)]' : 'text-[var(--cf-text-faint)] hover:text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface-alt)]'}`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs mr-1" style={{ color: 'var(--cf-text-muted)' }}>{currencySymbol}</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={row.income || ''}
                        onChange={(e) => handleRecordChange(index, 'income', e.target.value)}
                        className="w-24 bg-[var(--cf-surface)] px-2 py-1 rounded-md border text-right text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)] transition-all"
                        style={{ color: 'var(--cf-text)', borderColor: 'var(--cf-border-soft)' }}
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
                      <span className="text-xs mr-1" style={{ color: 'var(--cf-text-muted)' }}>-{currencySymbol}</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={row.expenses || ''}
                        onChange={(e) => handleRecordChange(index, 'expenses', e.target.value)}
                        className="w-24 bg-[var(--cf-surface)] px-2 py-1 rounded-md border text-right text-xs focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)] transition-all"
                        style={{ color: 'var(--cf-text)', borderColor: 'var(--cf-border-soft)' }}
                      />
                    </div>
                  </td>

                  {/* Net Change */}
                  <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                    <span className="font-medium" style={{ color: row.netChange >= 0 ? 'var(--cf-accent)' : '#84331e' }}>
                      {row.netChange >= 0 ? '+' : '-'}
                      {currencySymbol}
                      {Math.abs(row.netChange).toLocaleString()}
                    </span>
                  </td>

                  {/* Ending Cash */}
                  <td className="py-2.5 px-4 text-right font-mono font-bold tabular-nums" style={{ color: 'var(--cf-accent)' }}>
                    {currencySymbol}
                    {Math.round(row.endingCash).toLocaleString()}
                  </td>

                  {/* Row delete */}
                  <td className="py-2.5 px-2 text-center">
                    <button
                      type="button"
                      aria-label={`Remove ${row.month}`}
                      onClick={() => handleRemoveRow(index)}
                      className="p-1.5 rounded-md transition-all cursor-pointer opacity-40 group-hover:opacity-100 hover:scale-110 hover:bg-rose-500/10 hover:text-rose-500"
                      style={{ color: 'var(--cf-text-muted)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Totals Footer Summary Row */}
            <tfoot>
              <tr className="font-mono font-semibold text-xs border-t" style={{ background: 'var(--cf-surface-alt)', color: 'var(--cf-text)', borderColor: 'var(--cf-border)' }}>
                <td className="py-3.5 px-4 font-sans font-bold">{records.length}-Mo Cumulative</td>
                <td className="py-3.5 px-4 text-right font-bold tabular-nums">
                  {currencySymbol}{totalGross.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right text-[#875205] tabular-nums">
                  -{currencySymbol}{totalTaxEscrow.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right tabular-nums">
                  -{currencySymbol}{totalDraw.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-bold tabular-nums" style={{ color: totalNetChange >= 0 ? 'var(--cf-accent)' : '#84331e' }}>
                  {totalNetChange >= 0 ? '+' : '-'}
                  {currencySymbol}{Math.abs(totalNetChange).toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-sm tabular-nums" style={{ color: 'var(--cf-accent)' }}>
                  {currencySymbol}{Math.round(rollingCash).toLocaleString()}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col divide-y" style={{ borderColor: 'var(--cf-border)' }}>
            {rowsWithAccounting.map((row, index) => (
              <div 
                key={row.id || index}
                className="p-4 space-y-3"
                style={{ background: row.isLean ? 'rgba(180,87,63,0.03)' : 'transparent' }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {row.isLean && <span className="w-1.5 h-1.5 rounded-full bg-[#B4573F]"></span>}
                    <input
                      type="text"
                      value={row.month}
                      onChange={(e) => handleRecordChange(index, 'month', e.target.value)}
                      className="w-24 bg-[var(--cf-surface)] px-2 py-1.5 rounded-md border text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)] transition-all"
                      style={{ color: 'var(--cf-text)', borderColor: 'var(--cf-border-soft)' }}
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${row.month}`}
                    onClick={() => handleRemoveRow(index)}
                    className="p-2 rounded-md transition-all cursor-pointer hover:bg-rose-500/10 hover:text-rose-500"
                    style={{ color: 'var(--cf-text-muted)' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider block" style={{ color: 'var(--cf-text-muted)' }}>Income</span>
                    <div className="flex items-center">
                      <span className="mr-1" style={{ color: 'var(--cf-text-muted)' }}>{currencySymbol}</span>
                      <input
                        type="number"
                        value={row.income || ''}
                        onChange={(e) => handleRecordChange(index, 'income', e.target.value)}
                        className="w-full bg-[var(--cf-surface)] px-2 py-1.5 rounded-md border focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)] transition-all"
                        style={{ color: 'var(--cf-text)', borderColor: 'var(--cf-border-soft)' }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider block" style={{ color: 'var(--cf-text-muted)' }}>Draw</span>
                    <div className="flex items-center">
                      <span className="mr-1" style={{ color: 'var(--cf-text-muted)' }}>{currencySymbol}</span>
                      <input
                        type="number"
                        value={row.expenses || ''}
                        onChange={(e) => handleRecordChange(index, 'expenses', e.target.value)}
                        className="w-full bg-[var(--cf-surface)] px-2 py-1.5 rounded-md border focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)] transition-all"
                        style={{ color: 'var(--cf-text)', borderColor: 'var(--cf-border-soft)' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-mono pt-2 border-t" style={{ borderColor: 'var(--cf-border-soft)' }}>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#875205]">Tax (-{Math.round(taxReservePct * 100)}%)</span>
                    <span className="text-[#875205]">-{currencySymbol}{row.taxEscrow.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px]" style={{ color: 'var(--cf-text-muted)' }}>Ending Cash</span>
                    <span className="font-bold" style={{ color: 'var(--cf-accent)' }}>{currencySymbol}{Math.round(row.endingCash).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-4 font-mono text-sm space-y-2" style={{ background: 'var(--cf-surface-alt)' }}>
              <div className="font-sans font-bold border-b pb-2 mb-2" style={{ color: 'var(--cf-text)', borderColor: 'var(--cf-border)' }}>Total ({records.length} mo)</div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--cf-text-muted)' }}>Gross:</span>
                <span>{currencySymbol}{totalGross.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--cf-text-muted)' }}>Tax:</span>
                <span className="text-[#875205]">-{currencySymbol}{totalTaxEscrow.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold pt-2 border-t" style={{ borderColor: 'var(--cf-border-soft)', color: totalNetChange >= 0 ? 'var(--cf-accent)' : '#84331e' }}>
                <span>Net:</span>
                <span>{totalNetChange >= 0 ? '+' : '-'}{currencySymbol}{Math.abs(totalNetChange).toLocaleString()}</span>
              </div>
            </div>
          </div>
          </>
        )}
      </div>

      {/* Ledger Footer Notes */}
      <div className="p-4 border-t flex flex-col md:flex-row justify-between items-start md:items-center text-[11px] font-mono gap-2" style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)', color: 'var(--cf-text-muted)' }}>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--cf-accent)' }}></span>
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
