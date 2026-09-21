'use client';

import React, { useState, useTransition, useRef } from 'react';
import { parseUniversalCsv, ParsedCsvResult } from '../lib/csv/parser';
import { MonthlyRecord } from '../lib/calculator/types';
import {
  X,
  ClipboardPaste,
  AlertCircle,
  Upload,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

interface CsvPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (records: MonthlyRecord[]) => void;
  currencySymbol?: string;
}

const SAMPLE_TEMPLATES: { label: string; provider: string; data: string }[] = [
  {
    label: 'Wise (TransferWise)',
    provider: 'wise',
    data: `TransferWise ID,Date,Amount,Currency,Description,Payment Reference,Running Balance,Total fees
TRANSFER-89412,14-01-2025,4850.00,USD,Client Retainer Acme Corp,INV-2025-01,12450.00,12.50
TRANSFER-89413,28-01-2025,-350.00,USD,Figma & Adobe Subscriptions,CARD-8812,12100.00,0.00
TRANSFER-89501,15-02-2025,5200.00,USD,Bolt Studio Milestone 2,INV-2025-02,17300.00,14.20
TRANSFER-89502,26-02-2025,-420.00,USD,AWS Hosting & Supabase,CARD-8812,16880.00,0.00
TRANSFER-89610,12-03-2025,3900.00,USD,Client Retainer Acme Corp,INV-2025-03,20780.00,11.00
TRANSFER-89714,10-04-2025,6400.00,USD,Windfall Apex Design Sprint,INV-2025-04,27180.00,18.50
TRANSFER-89820,15-05-2025,4900.00,USD,Bolt Studio Retainer,INV-2025-05,32080.00,13.00
TRANSFER-89930,14-06-2025,5600.00,USD,Acme Corp & Direct C,INV-2025-06,37680.00,15.00`,
  },
  {
    label: 'Stripe Balance',
    provider: 'stripe',
    data: `id,Description,Amount,Fee,Net,Currency,Created (UTC),Type
txn_1QkL29,Invoice 1042 Acme Corp,4500.00,130.80,4369.20,usd,2025-01-15 14:22,charge
txn_1QkM44,Invoice 1043 Bolt Inc,3200.00,93.10,3106.90,usd,2025-02-12 09:15,charge
txn_1QkN88,Invoice 1044 Studio Sprint,5800.00,168.50,5631.50,usd,2025-03-18 16:40,charge
txn_1QkP12,Invoice 1045 Apex Brand,6900.00,200.40,6699.60,usd,2025-04-20 11:05,charge
txn_1QkQ55,Invoice 1046 Acme Corp,4600.00,133.70,4466.30,usd,2025-05-14 10:20,charge
txn_1QkR99,Invoice 1047 Bolt Retainer,5100.00,148.20,4951.80,usd,2025-06-16 17:30,charge`,
  },
  {
    label: 'Excel / Google Sheets',
    provider: 'spreadsheet',
    data: `Month\tIncome\tExpenses
Jul\t$4,500\t$2,100
Aug\t$5,200\t$2,150
Sep\t$3,800\t$2,050
Oct\t$2,400\t$1,950
Nov\t$4,900\t$2,200
Dec\t$7,800\t$2,400
Jan\t$4,200\t$2,100
Feb\t$4,600\t$2,100
Mar\t$3,900\t$2,250
Apr\t$5,500\t$2,100
May\t$6,100\t$2,150
Jun\t$5,400\t$2,200`,
  },
];

export const CsvPasteModal: React.FC<CsvPasteModalProps> = ({
  isOpen,
  onClose,
  onApply,
  currencySymbol = '$',
}) => {
  const [pasteContent, setPasteContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedCsvResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setPasteContent(text);
    setError(null);
    if (!text.trim()) {
      setParsedResult(null);
      return;
    }
    const result = parseUniversalCsv(text);
    if (result.records.length > 0) {
      setParsedResult(result);
    } else {
      setParsedResult(null);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  const readFile = (file: File) => {
    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        handleTextChange(content);
      }
    };
    reader.onerror = () => {
      setError('Failed reading CSV file from your disk.');
    };
    reader.readAsText(file);
  };

  const handleApply = () => {
    setError(null);
    const result = parsedResult || parseUniversalCsv(pasteContent);
    if (!result || result.records.length === 0) {
      setError(
        'Could not detect valid transactions or income records. Ensure your file or pasted text contains dates/months and revenue amounts.'
      );
      return;
    }
    onApply(result.records);
    onClose();
  };

  const loadSample = (sampleData: string) => {
    handleTextChange(sampleData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md">
      <div
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
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[var(--cf-text)]">
                Universal Ingestion &amp; Sync
              </h2>
              <p className="text-xs text-[var(--cf-text-muted)]">
                Auto-detects Wise, Stripe, PayPal, Upwork, Wave &amp; Spreadsheet CSVs
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[var(--cf-accent)] bg-[var(--cf-accent-bg)]'
                : 'border-[var(--cf-border-soft)] hover:border-[var(--cf-border)] bg-[var(--cf-surface-alt)]/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".csv,.tsv,.txt"
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <FileSpreadsheet className="w-8 h-8 text-[var(--cf-accent)]" />
              <p className="text-xs font-medium text-[var(--cf-text)]">
                <span className="font-semibold text-[var(--cf-accent)]">Click to upload</span> or drag and drop your CSV export
              </p>
              <p className="text-[11px] text-[var(--cf-text-muted)]">
                Supports Wise Statement, Stripe Balance History, PayPal Activity, or Excel (.csv, .tsv)
              </p>
            </div>
          </div>

          {/* Quick Sample Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono text-[var(--cf-text-muted)]">
              Try sample exports:
            </span>
            {SAMPLE_TEMPLATES.map((tpl) => (
              <button
                key={tpl.label}
                type="button"
                onClick={() => loadSample(tpl.data)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer hover:border-[var(--cf-accent)]"
                style={{
                  background: 'var(--cf-surface)',
                  borderColor: 'var(--cf-border-soft)',
                  color: 'var(--cf-text)',
                }}
              >
                {tpl.label}
              </button>
            ))}
          </div>

          {/* Direct Paste Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[var(--cf-text)] flex items-center gap-1.5">
                <ClipboardPaste className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
                <span>Or paste raw CSV / spreadsheet text directly:</span>
              </label>
              {pasteContent && (
                <button
                  type="button"
                  onClick={() => handleTextChange('')}
                  className="text-[11px] text-[var(--cf-text-muted)] hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              rows={5}
              value={pasteContent}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Paste raw CSV lines here or export from your banking/accounting tool..."
              className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-xl p-3 font-mono text-xs text-[var(--cf-text)] focus:border-[var(--cf-accent)] transition-colors focus:outline-none"
            />
          </div>

          {/* Auto-Detection Banner */}
          {parsedResult && parsedResult.records.length > 0 && (
            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 font-semibold font-mono text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Format Detected: {parsedResult.detectedFormat}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold uppercase">
                  {parsedResult.provider}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
                  <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">Transactions</span>
                  <span className="text-sm font-mono font-bold text-[var(--cf-text)]">
                    {parsedResult.transactionCount} parsed
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
                  <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">Aggregated</span>
                  <span className="text-sm font-mono font-bold text-[var(--cf-text)]">
                    {parsedResult.monthsCount} months
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
                  <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">Total Revenue</span>
                  <span className="text-sm font-mono font-bold text-emerald-600">
                    {currencySymbol}{parsedResult.totalIncome.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
                  <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">Tracked Burn</span>
                  <span className="text-sm font-mono font-bold text-[var(--cf-text)]">
                    {currencySymbol}{parsedResult.totalExpenses.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-500 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Zero Surveillance Notice */}
          <div className="flex items-center gap-2 text-[11px] text-[var(--cf-text-muted)] p-3 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Zero Bank Surveillance: Parsing happens 100% client-side in your browser. Your financial statements are never sent to external servers or third parties.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--cf-border-soft)] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={!parsedResult || parsedResult.records.length === 0}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95"
            style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Apply to Live Runway Model</span>
          </button>
        </div>
      </div>
    </div>
  );
};
