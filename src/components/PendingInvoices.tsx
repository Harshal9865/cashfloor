'use client';

import React from 'react';
import { PendingInvoice } from '../lib/calculator/types';
import { Plus, Trash2, Globe, Clock } from 'lucide-react';

interface PendingInvoicesProps {
  invoices: PendingInvoice[];
  onChange: (invoices: PendingInvoice[]) => void;
  currencySymbol?: string;
  isLocked?: boolean;
}

export const PendingInvoices: React.FC<PendingInvoicesProps> = ({
  invoices,
  onChange,
  currencySymbol = '$',
  isLocked = false,
}) => {

  const handleAdd = () => {
    if (isLocked) return;
    const newInvoice: PendingInvoice = {
      id: Math.random().toString(36).substring(7),
      expectedDate: new Date().toISOString().split('T')[0],
      amount: 0,
      clientName: '',
      probabilityScore: 0.8,
      isForeignCurrency: false,
    };
    onChange([...invoices, newInvoice]);
  };

  const handleUpdate = (index: number, field: keyof PendingInvoice, value: any) => {
    if (isLocked) return;
    const updated = [...invoices];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    if (isLocked) return;
    const updated = [...invoices];
    updated.splice(index, 1);
    onChange(updated);
  };

  if (invoices.length === 0) {
    return (
      <div className="w-full rounded-2xl border p-6 flex flex-col items-center justify-center text-center transition-colors mt-6" style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}>
        <div className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center bg-[var(--cf-surface)] border border-[var(--cf-border)]">
          <Clock className="w-6 h-6 text-[var(--cf-text-faint)]" />
        </div>
        <h4 className="font-serif text-[var(--cf-text)] mb-1">No Pending Invoices</h4>
        <p className="text-xs text-[var(--cf-text-muted)] max-w-sm mb-4">
          Log your accounts receivable. We'll automatically adjust your runway based on the probability of getting paid on time.
        </p>
        <button
          onClick={handleAdd}
          disabled={isLocked}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-[var(--cf-bg)] transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--cf-text)' }}
        >
          <Plus className="w-3 h-3" /> Add Invoice
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border overflow-hidden mt-6" style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}>
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--cf-border)', background: 'var(--cf-surface-alt)' }}>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[var(--cf-accent)]" />
          <h3 className="font-semibold text-sm" style={{ color: 'var(--cf-text)' }}>Accounts Receivable (A/R)</h3>
        </div>
        <button
          onClick={handleAdd}
          disabled={isLocked}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] uppercase tracking-wider font-semibold transition-colors disabled:opacity-50 hover:bg-[var(--cf-surface)] cursor-pointer"
          style={{ background: 'var(--cf-bg)', color: 'var(--cf-text)', border: '1px solid var(--cf-border)' }}
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="font-mono text-[10px] tracking-wider uppercase border-b" style={{ color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border)', background: 'var(--cf-surface-alt)' }}>
              <th className="py-2.5 px-4 font-semibold">Expected Date</th>
              <th className="py-2.5 px-4 font-semibold">Client Name</th>
              <th className="py-2.5 px-4 font-semibold text-right">Amount</th>
              <th className="py-2.5 px-4 font-semibold text-right">Probability</th>
              <th className="py-2.5 px-4 font-semibold text-right">Risk-Adj Value</th>
              <th className="py-2.5 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="font-mono text-xs divide-y" style={{ borderColor: 'var(--cf-border)' }}>
            {invoices.map((inv, idx) => {
              const fxHaircut = inv.isForeignCurrency ? 0.97 : 1;
              const riskAdjValue = Math.round(inv.amount * fxHaircut * inv.probabilityScore);
              
              return (
                <tr key={inv.id} className="transition-colors hover:bg-[var(--cf-surface-alt)]">
                  <td className="py-2 px-4">
                    <input
                      type="date"
                      value={inv.expectedDate}
                      onChange={(e) => handleUpdate(idx, 'expectedDate', e.target.value)}
                      disabled={isLocked}
                      className="bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)] rounded px-1 w-full"
                      style={{ color: 'var(--cf-text)' }}
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="text"
                      placeholder="Client..."
                      value={inv.clientName}
                      onChange={(e) => handleUpdate(idx, 'clientName', e.target.value)}
                      disabled={isLocked}
                      className="bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)] rounded px-1 w-full"
                      style={{ color: 'var(--cf-text)' }}
                    />
                  </td>
                  <td className="py-2 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end group">
                      <button
                        type="button"
                        onClick={() => handleUpdate(idx, 'isForeignCurrency', !inv.isForeignCurrency)}
                        disabled={isLocked}
                        title="Toggle Foreign Currency (Applies 3% FX volatility haircut)"
                        className={`mr-2 p-1 rounded transition-colors ${inv.isForeignCurrency ? 'bg-[var(--cf-accent)]/20 text-[var(--cf-accent)]' : 'text-[var(--cf-text-faint)] hover:text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface-alt)]'}`}
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs mr-1" style={{ color: 'var(--cf-text-muted)' }}>{currencySymbol}</span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={inv.amount || ''}
                        onChange={(e) => handleUpdate(idx, 'amount', Number(e.target.value))}
                        disabled={isLocked}
                        className="w-20 bg-transparent border-b text-right text-xs font-semibold focus:outline-none py-0.5"
                        style={{ color: 'var(--cf-text)', borderColor: 'var(--cf-border)' }}
                      />
                    </div>
                  </td>
                  <td className="py-2 px-4 text-right">
                    <select
                      value={inv.probabilityScore}
                      onChange={(e) => handleUpdate(idx, 'probabilityScore', Number(e.target.value))}
                      disabled={isLocked}
                      className="bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)] rounded text-right cursor-pointer"
                      style={{ color: 'var(--cf-text)' }}
                    >
                      <option value={1.0}>100% (Guaranteed)</option>
                      <option value={0.9}>90% (High Confidence)</option>
                      <option value={0.75}>75% (Likely)</option>
                      <option value={0.5}>50% (Coin Toss)</option>
                      <option value={0.25}>25% (At Risk)</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 text-right font-semibold" style={{ color: 'var(--cf-steady)' }}>
                    {currencySymbol}{riskAdjValue.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={() => handleDelete(idx)}
                      disabled={isLocked}
                      className="p-1.5 rounded transition-colors opacity-50 hover:opacity-100 disabled:opacity-30 cursor-pointer"
                      style={{ color: 'var(--cf-caution)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
