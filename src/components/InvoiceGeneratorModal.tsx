'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  FileText, 
  Building2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Download
} from 'lucide-react';
import { 
  InvoiceData, 
  InvoiceItem, 
  InvoicePaymentTerms 
} from '@/lib/invoice/invoiceTypes';
import { 
  calculateDueDateFromTerms, 
  calculateInvoiceTotals, 
  generateInvoiceNumber, 
  convertInvoiceToPendingInvoice,
  INVOICE_TEMPLATES 
} from '@/lib/invoice/invoiceService';
import { PendingInvoice } from '@/lib/calculator/types';
import { SYMBOL_TO_CODE } from '@/lib/currency/fxService';
import CashFloorLogo from '@/components/CashFloorLogo';

interface InvoiceGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currencySymbol?: string;
  onSaveToReceivables: (pending: PendingInvoice) => void;
}

const STORAGE_KEY_ISSUER = 'cf_invoice_issuer_v1';

export function InvoiceGeneratorModal({
  isOpen,
  onClose,
  currencySymbol = '$',
  onSaveToReceivables,
}: InvoiceGeneratorModalProps) {
  const currencyCode = SYMBOL_TO_CODE[currencySymbol] || 'USD';
  const todayStr = new Date().toISOString().split('T')[0];

  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: generateInvoiceNumber(),
    issueDate: todayStr,
    dueDate: calculateDueDateFromTerms(todayStr, 'net_15'),
    paymentTerms: 'net_15',
    currencySymbol,
    currencyCode,
    issuer: {
      name: 'Apex Studio / Independent Pro',
      email: 'billing@apexstudio.io',
      address: '100 Sovereign Way, Suite 400',
      taxId: 'EIN: 84-9281729',
      paymentDetails: 'Wire Transfer / ACH:\nBank: Mercury Bank NA\nRouting: 021000021\nAccount: 9823481723\nWise / Stripe: wise.com/pay/me/apexstudio',
    },
    client: {
      name: 'Sarah Jenkins',
      company: 'Vanguard Capital Partners',
      email: 'ap@vanguardpartners.com',
      address: '742 Evergreen Terrace, Floor 12, New York, NY 10001',
    },
    items: [
      {
        id: '1',
        description: 'Sprint 14: Core API Integration & Database Migration',
        quantity: 40,
        unitPrice: 100,
        amount: 4000,
      },
    ],
    taxRatePct: 0,
    discountAmount: 0,
    notes: 'Payment is due within 15 days of invoice issue date. Thank you for your partnership!',
  });

  const [savedToReceivables, setSavedToReceivables] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string>('software_sprint');

  // Load saved issuer profile from localStorage if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedIssuer = localStorage.getItem(STORAGE_KEY_ISSUER);
        if (savedIssuer) {
          const parsed = JSON.parse(savedIssuer);
          setInvoice(prev => ({
            ...prev,
            issuer: { ...prev.issuer, ...parsed },
          }));
        }
      } catch {}
    }
  }, [isOpen]);

  // Sync currency symbol
  useEffect(() => {
    setInvoice(prev => ({
      ...prev,
      currencySymbol,
      currencyCode: SYMBOL_TO_CODE[currencySymbol] || 'USD',
    }));
  }, [currencySymbol]);

  if (!isOpen) return null;

  const totals = calculateInvoiceTotals(invoice.items, invoice.taxRatePct, invoice.discountAmount);

  const handleIssuerChange = (field: string, val: string) => {
    const updatedIssuer = { ...invoice.issuer, [field]: val };
    setInvoice(prev => ({ ...prev, issuer: updatedIssuer }));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_ISSUER, JSON.stringify(updatedIssuer));
      } catch {}
    }
  };

  const handleClientChange = (field: string, val: string) => {
    setInvoice(prev => ({
      ...prev,
      client: { ...prev.client, [field]: val },
    }));
  };

  const handleTermsChange = (newTerms: InvoicePaymentTerms) => {
    const newDueDate = calculateDueDateFromTerms(invoice.issueDate, newTerms);
    setInvoice(prev => ({
      ...prev,
      paymentTerms: newTerms,
      dueDate: newDueDate,
    }));
  };

  const handleIssueDateChange = (newDate: string) => {
    const newDueDate = calculateDueDateFromTerms(newDate, invoice.paymentTerms);
    setInvoice(prev => ({
      ...prev,
      issueDate: newDate,
      dueDate: newDueDate,
    }));
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substring(7),
      description: 'Consulting / Deliverable',
      quantity: 1,
      unitPrice: 500,
      amount: 500,
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, val: any) => {
    const updatedItems = [...invoice.items];
    const current = { ...updatedItems[index], [field]: val };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(val) || 0 : current.quantity;
      const p = field === 'unitPrice' ? Number(val) || 0 : current.unitPrice;
      current.amount = Math.round(q * p * 100) / 100;
    }
    updatedItems[index] = current;
    setInvoice(prev => ({ ...prev, items: updatedItems }));
  };

  const handleRemoveItem = (index: number) => {
    if (invoice.items.length <= 1) return;
    const updated = [...invoice.items];
    updated.splice(index, 1);
    setInvoice(prev => ({ ...prev, items: updated }));
  };

  const handleApplyTemplate = (templateKey: string) => {
    const template = INVOICE_TEMPLATES[templateKey];
    if (!template) return;
    setActiveTemplate(templateKey);
    const newDueDate = calculateDueDateFromTerms(invoice.issueDate, template.terms);
    setInvoice(prev => ({
      ...prev,
      paymentTerms: template.terms,
      dueDate: newDueDate,
      notes: template.notes,
      items: template.items.map(item => ({
        ...item,
        id: Math.random().toString(36).substring(7),
      })),
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLogToReceivables = () => {
    const pending = convertInvoiceToPendingInvoice(invoice);
    onSaveToReceivables(pending);
    setSavedToReceivables(true);
    setTimeout(() => setSavedToReceivables(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Dynamic Print Stylesheet to guarantee pure vector printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #cashfloor-invoice-canvas, #cashfloor-invoice-canvas * {
            visibility: visible !important;
          }
          #cashfloor-invoice-canvas {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            min-height: 100vh !important;
            margin: 0 !important;
            padding: 36px 48px !important;
            background: #ffffff !important;
            color: #0f172a !important;
            z-index: 9999999 !important;
            box-shadow: none !important;
            border: none !important;
          }
          .invoice-no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Modal Shell */}
      <div className="w-full max-w-6xl max-h-[95vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden bg-[var(--cf-surface)] border-[var(--cf-border)] invoice-modal-container">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-[var(--cf-border-soft)] flex flex-wrap items-center justify-between gap-3 bg-[var(--cf-surface-alt)] invoice-no-print">
          <div className="flex items-center gap-3">
            <CashFloorLogo size="sm" />
            <div className="h-4 w-px bg-[var(--cf-border)]" />
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-base text-[var(--cf-text)]">
                Client Invoice Studio
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Zero-Cloud Sovereign
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogToReceivables}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                savedToReceivables 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[var(--cf-accent)] text-white hover:opacity-90'
              }`}
            >
              {savedToReceivables ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Logged to A/R!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log to A/R (Receivables)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] font-mono text-xs font-semibold text-[var(--cf-text)] hover:border-[var(--cf-accent)] transition-all cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-[var(--cf-border)] text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Template Quick Selection Bar */}
        <div className="px-6 py-2.5 bg-[var(--cf-surface)] border-b border-[var(--cf-border-soft)] flex items-center gap-2 overflow-x-auto text-xs invoice-no-print">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)] shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Templates:
          </span>
          {Object.entries(INVOICE_TEMPLATES).map(([key, t]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleApplyTemplate(key)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] whitespace-nowrap transition-all cursor-pointer border ${
                activeTemplate === key
                  ? 'bg-[var(--cf-accent-bg)] border-[var(--cf-accent)] text-[var(--cf-accent)] font-semibold'
                  : 'bg-[var(--cf-surface-alt)] border-[var(--cf-border)] text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Modal Body: Split 2-Column on Desktop (Left: Controls, Right: Real Paper Canvas) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[var(--cf-border-soft)]">
          
          {/* LEFT: Editor Controls (5 cols) */}
          <div className="lg:col-span-5 p-5 space-y-6 overflow-y-auto invoice-no-print">
            
            {/* 1. Issuer Block */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--cf-text-muted)] font-semibold flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
                  Your Business Profile (Issuer)
                </span>
                <span className="text-[10px] text-[var(--cf-text-faint)]">Auto-saved</span>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Business / Your Name"
                  value={invoice.issuer.name}
                  onChange={e => handleIssuerChange('name', e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={invoice.issuer.email}
                    onChange={e => handleIssuerChange('email', e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)]"
                  />
                  <input
                    type="text"
                    placeholder="Tax ID / EIN"
                    value={invoice.issuer.taxId || ''}
                    onChange={e => handleIssuerChange('taxId', e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address (City, Country)"
                  value={invoice.issuer.address || ''}
                  onChange={e => handleIssuerChange('address', e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)]"
                />
              </div>
            </div>

            {/* 2. Client Block */}
            <div className="space-y-3 pt-3 border-t border-[var(--cf-border-soft)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--cf-text-muted)] font-semibold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                Client &amp; Billing Recipient
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Client Company Name"
                  value={invoice.client.company || ''}
                  onChange={e => handleClientChange('company', e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)] font-medium"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Contact Person"
                    value={invoice.client.name}
                    onChange={e => handleClientChange('name', e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)]"
                  />
                  <input
                    type="email"
                    placeholder="Accounts Payable Email"
                    value={invoice.client.email || ''}
                    onChange={e => handleClientChange('email', e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Client Office Address"
                  value={invoice.client.address || ''}
                  onChange={e => handleClientChange('address', e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none focus:ring-1 focus:ring-[var(--cf-accent)]"
                />
              </div>
            </div>

            {/* 3. Invoice Metadata */}
            <div className="space-y-3 pt-3 border-t border-[var(--cf-border-soft)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--cf-text-muted)] font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                Invoice Details &amp; Terms
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-mono text-[var(--cf-text-muted)] mb-1">Invoice #</label>
                  <input
                    type="text"
                    value={invoice.invoiceNumber}
                    onChange={e => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[var(--cf-text-muted)] mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={invoice.issueDate}
                    onChange={e => handleIssueDateChange(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[var(--cf-text-muted)] mb-1">Payment Terms</label>
                  <select
                    value={invoice.paymentTerms}
                    onChange={e => handleTermsChange(e.target.value as InvoicePaymentTerms)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] font-mono focus:outline-none cursor-pointer"
                  >
                    <option value="due_on_receipt">Due on Receipt</option>
                    <option value="net_15">Net 15 Days</option>
                    <option value="net_30">Net 30 Days</option>
                    <option value="net_60">Net 60 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[var(--cf-text-muted)] mb-1">Due Date</label>
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={e => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Line Items Editor */}
            <div className="space-y-3 pt-3 border-t border-[var(--cf-border-soft)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[var(--cf-text-muted)] font-semibold">
                  Line Items ({invoice.items.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[var(--cf-accent)] hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              </div>

              <div className="space-y-2">
                {invoice.items.map((item, idx) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Item description / deliverable"
                        value={item.description}
                        onChange={e => handleUpdateItem(idx, 'description', e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-[var(--cf-surface)] border border-[var(--cf-border)] text-[var(--cf-text)] focus:outline-none"
                      />
                      {invoice.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1 rounded-lg text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] text-[var(--cf-text-muted)] font-mono">Qty/Hrs</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={e => handleUpdateItem(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-[var(--cf-surface)] border border-[var(--cf-border)] text-[var(--cf-text)] font-mono text-right focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--cf-text-muted)] font-mono">Unit Rate ({currencySymbol})</span>
                        <input
                          type="number"
                          min="0"
                          step="10"
                          value={item.unitPrice}
                          onChange={e => handleUpdateItem(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1 rounded-lg bg-[var(--cf-surface)] border border-[var(--cf-border)] text-[var(--cf-text)] font-mono text-right focus:outline-none"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[var(--cf-text-muted)] font-mono">Line Total</span>
                        <div className="px-2 py-1 rounded-lg bg-[var(--cf-surface)] border border-[var(--cf-border)] text-[var(--cf-text)] font-mono text-right font-semibold">
                          {currencySymbol}{item.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tax & Discount */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <label className="block text-[10px] font-mono text-[var(--cf-text-muted)] mb-1">Tax / VAT (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={invoice.taxRatePct}
                    onChange={e => setInvoice(prev => ({ ...prev, taxRatePct: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] font-mono focus:outline-none text-right"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[var(--cf-text-muted)] mb-1">Discount ({currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={invoice.discountAmount}
                    onChange={e => setInvoice(prev => ({ ...prev, discountAmount: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-1.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] font-mono focus:outline-none text-right"
                  />
                </div>
              </div>
            </div>

            {/* 5. Payment Details & Notes */}
            <div className="space-y-3 pt-3 border-t border-[var(--cf-border-soft)]">
              <span className="text-xs font-mono uppercase tracking-wider text-[var(--cf-text-muted)] font-semibold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                Payment Instructions (Bank / Wire / Stripe)
              </span>
              <textarea
                rows={3}
                value={invoice.issuer.paymentDetails || ''}
                onChange={e => handleIssuerChange('paymentDetails', e.target.value)}
                placeholder="Bank Wire, IBAN, Swift, Stripe link..."
                className="w-full p-2.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] font-mono text-xs focus:outline-none resize-none leading-relaxed"
              />
              <textarea
                rows={2}
                value={invoice.notes || ''}
                onChange={e => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Terms & conditions or friendly note..."
                className="w-full p-2.5 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] text-xs focus:outline-none resize-none"
              />
            </div>

          </div>

          {/* RIGHT: Live Corporate Paper Preview & Printable Canvas (7 cols) */}
          <div className="lg:col-span-7 p-4 sm:p-8 bg-neutral-900/40 dark:bg-black/40 overflow-y-auto flex justify-center">
            
            {/* The Actual Invoice Sheet */}
            <div 
              id="cashfloor-invoice-canvas"
              className="w-full max-w-[650px] bg-white text-slate-900 rounded-2xl shadow-xl p-6 sm:p-10 border border-slate-200 flex flex-col justify-between font-sans relative"
              style={{ minHeight: '820px' }}
            >
              
              {/* Sheet Top: Logo & Title */}
              <div>
                <div className="flex flex-row justify-between items-start border-b border-slate-200 pb-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-serif font-bold text-xs">
                        C
                      </div>
                      <span className="font-serif font-bold text-lg text-slate-900 tracking-tight">
                        {invoice.issuer.name || 'Your Studio Name'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 space-y-0.5 leading-relaxed">
                      {invoice.issuer.address && <div>{invoice.issuer.address}</div>}
                      <div>{invoice.issuer.email}</div>
                      {invoice.issuer.taxId && <div className="font-mono text-[11px] text-slate-600 font-medium">{invoice.issuer.taxId}</div>}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-wider mb-2">
                      INVOICE
                    </div>
                    <div className="font-mono text-xs text-slate-700 font-bold">
                      {invoice.invoiceNumber}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">
                      <div>Issued: {invoice.issueDate}</div>
                      <div className="text-emerald-700 font-semibold">Due: {invoice.dueDate}</div>
                      <div className="capitalize text-slate-400">({invoice.paymentTerms.replace('_', ' ')})</div>
                    </div>
                  </div>
                </div>

                {/* Billed To Section */}
                <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      BILLED TO
                    </span>
                    <div className="font-serif font-bold text-slate-900 text-sm">
                      {invoice.client.company || invoice.client.name || 'Client Name'}
                    </div>
                    {invoice.client.company && invoice.client.name && (
                      <div className="text-xs text-slate-600 mt-0.5">Attn: {invoice.client.name}</div>
                    )}
                    {invoice.client.address && (
                      <div className="text-xs text-slate-500 mt-0.5 max-w-xs">{invoice.client.address}</div>
                    )}
                    {invoice.client.email && (
                      <div className="text-xs text-slate-500 mt-0.5">{invoice.client.email}</div>
                    )}
                  </div>

                  <div className="sm:text-right">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      TOTAL AMOUNT DUE
                    </span>
                    <div className="font-mono font-bold text-2xl text-emerald-800">
                      {invoice.currencySymbol}{totals.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5 uppercase tracking-wider">
                      Currency: {invoice.currencyCode}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-900 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                        <th className="py-2 px-1">Description</th>
                        <th className="py-2 px-2 text-right">Qty</th>
                        <th className="py-2 px-2 text-right">Rate</th>
                        <th className="py-2 px-1 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-slate-100 font-mono">
                      {invoice.items.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-3 px-1 font-sans text-slate-800 pr-4">
                            <span className="font-medium">{item.description}</span>
                          </td>
                          <td className="py-3 px-2 text-right text-slate-600">{item.quantity}</td>
                          <td className="py-3 px-2 text-right text-slate-600">
                            {invoice.currencySymbol}{item.unitPrice.toLocaleString()}
                          </td>
                          <td className="py-3 px-1 text-right font-semibold text-slate-900">
                            {invoice.currencySymbol}{item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Calculations Summary */}
                <div className="flex justify-end mb-6">
                  <div className="w-56 space-y-1.5 font-mono text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{invoice.currencySymbol}{totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span>Discount:</span>
                        <span>-{invoice.currencySymbol}{totals.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    {totals.tax > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Tax ({invoice.taxRatePct}%):</span>
                        <span>{invoice.currencySymbol}{totals.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t-2 border-slate-900 font-bold text-slate-900 text-sm">
                      <span>Total Due:</span>
                      <span className="text-emerald-800">
                        {invoice.currencySymbol}{totals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Instructions Box */}
                {invoice.issuer.paymentDetails && (
                  <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Payment Remittance Instructions
                    </span>
                    <pre className="text-[11px] font-mono text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {invoice.issuer.paymentDetails}
                    </pre>
                  </div>
                )}

                {/* Notes / Terms */}
                {invoice.notes && (
                  <div className="text-[11px] text-slate-500 italic mb-4">
                    {invoice.notes}
                  </div>
                )}
              </div>

              {/* Sheet Bottom Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-row items-center justify-between text-[10px] font-mono text-slate-400">
                <div>
                  Generated locally via CashFloor Studio
                </div>
                <div>
                  Page 1 of 1
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
