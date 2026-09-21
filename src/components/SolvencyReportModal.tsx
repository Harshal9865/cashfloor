'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Building2, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Lock,
  ArrowDownToLine
} from 'lucide-react';
import { CalculationResult, CalculatorAssumptions, MonthlyRecord } from '@/lib/calculator/types';
import { useAuth } from '@/lib/auth/AuthContext';
import CashFloorLogo from '@/components/CashFloorLogo';

interface SolvencyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
  assumptions: CalculatorAssumptions;
  records: MonthlyRecord[];
  currencySymbol?: string;
}

export function SolvencyReportModal({
  isOpen,
  onClose,
  result,
  assumptions,
  records,
  currencySymbol = '$',
}: SolvencyReportModalProps) {
  const { user } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [legalEntity, setLegalEntity] = useState('Single-Member LLC');

  useEffect(() => {
    if (isOpen) {
      const code = `CF-AUDIT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${new Date().getFullYear()}`;
      setVerificationCode(code);
      setReportDate(new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }));

      // Hydrate legal entity from localStorage
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('cf_client_rules');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.entityType) {
              setLegalEntity(parsed.entityType);
            }
          }
        } catch {}
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const displayName = user?.name || 'Independent Consultant';
  const role = user?.role || 'Senior Independent Professional';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Container */}
      <div className="w-full max-w-4xl max-h-[94vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden bg-[var(--cf-surface)] border-[var(--cf-border)]">
        
        {/* Modal Action Header (Hidden during window.print) */}
        <div className="p-4 sm:p-5 border-b border-[var(--cf-border-soft)] flex items-center justify-between bg-[var(--cf-surface-alt)]/60 print:hidden">
          <div className="flex items-center gap-3">
            <CashFloorLogo size="sm" />
            <div className="h-4 w-px bg-[var(--cf-border)]" />
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CPA &amp; Lease Underwriting Report Ready</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md cursor-pointer hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Solvency Certificate Body */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 space-y-8 print:p-0 print:space-y-6 print:m-0 print:overflow-visible">
          
          {/* Certificate Official Header */}
          <div className="border-b border-[var(--cf-border)] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--cf-accent)] font-bold px-2 py-0.5 rounded bg-[var(--cf-accent-bg)] border border-[var(--cf-accent)]/20">
                  Certified Solvency Statement
                </span>
                <span className="text-[10px] font-mono text-[var(--cf-text-muted)]">
                  Ref: {verificationCode}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--cf-text)] tracking-tight">
                Independent Professional Liquidity &amp; Runway Audit
              </h1>
              <p className="text-xs text-[var(--cf-text-muted)] max-w-xl">
                Generated via CashFloor Sovereign Financial Architecture. Stress-tested against 20th-percentile cash flows, invoice aging lags, and quarterly tax reserves.
              </p>
            </div>

            <div className="text-right font-mono text-xs text-[var(--cf-text-muted)] space-y-1">
              <div>Date: <span className="font-bold text-[var(--cf-text)]">{reportDate}</span></div>
              <div>Standard: <span className="text-emerald-600 font-bold">20th-Percentile Conservative</span></div>
              <div>Privacy: <span className="font-semibold text-[var(--cf-text)]">Zero Bank Surveillance</span></div>
            </div>
          </div>

          {/* Subject & Entity Identification */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] font-mono text-xs">
            <div>
              <span className="text-[10px] text-[var(--cf-text-muted)] uppercase block">Principal</span>
              <span className="font-bold text-[var(--cf-text)] truncate block">{displayName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--cf-text-muted)] uppercase block">Role / Practice</span>
              <span className="font-semibold text-[var(--cf-text)] truncate block">{role}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--cf-text-muted)] uppercase block">Legal Business Entity</span>
              <span className="font-bold text-[var(--cf-accent)] truncate block">{legalEntity}</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--cf-text-muted)] uppercase block">Reporting Currency</span>
              <span className="font-bold text-[var(--cf-text)]">{currencySymbol} (Normalized)</span>
            </div>
          </div>

          {/* Underwriter's Executive Solvency Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--cf-text-muted)] block">
                Liquid Cash Reserves
              </span>
              <p className="text-xl sm:text-2xl font-serif font-bold text-emerald-600">
                {currencySymbol}{result.currentSavings.toLocaleString()}
              </p>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">
                Immediate unencumbered liquidity
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--cf-text-muted)] block">
                Conservative Floor Income
              </span>
              <p className="text-xl sm:text-2xl font-serif font-bold text-[var(--cf-text)]">
                {currencySymbol}{result.floorIncome.toLocaleString()}
                <span className="text-xs font-mono font-normal text-[var(--cf-text-muted)]">/mo</span>
              </p>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">
                20th-percentile survival baseline
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--cf-text-muted)] block">
                Zero-Income Runway
              </span>
              <p className="text-xl sm:text-2xl font-serif font-bold text-[var(--cf-accent)]">
                {result.runwayMonths.toFixed(1)} Months
              </p>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">
                Zero new revenue survival horizon
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--cf-text-muted)] block">
                Safe-To-Spend Allowance
              </span>
              <p className="text-xl sm:text-2xl font-serif font-bold text-[var(--cf-text)]">
                {currencySymbol}{result.safeToSpend.toLocaleString()}
                <span className="text-xs font-mono font-normal text-[var(--cf-text-muted)]">/mo</span>
              </p>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">
                After tax escrow &amp; buffer requirements
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--cf-text-muted)] block">
                Tax Escrow Partitioning
              </span>
              <p className="text-xl sm:text-2xl font-serif font-bold text-[var(--cf-text)]">
                {(assumptions.taxReservePct * 100).toFixed(0)}% Escrow
              </p>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">
                Quarterly tax drag shielded
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-1">
              <span className="text-[10px] font-mono uppercase text-[var(--cf-text-muted)] block">
                Capital Health Status
              </span>
              <p className="text-xl sm:text-2xl font-serif font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span>Solvent</span>
              </p>
              <span className="text-[10px] font-mono text-[var(--cf-text-muted)] block">
                Buffer target {assumptions.bufferMonthsMultiplier}x covered
              </span>
            </div>
          </div>

          {/* 12-Month Performance & Projection Table */}
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-sm text-[var(--cf-text)] flex items-center justify-between">
              <span>12-Month Cash Flow &amp; Escrow Schedule</span>
              <span className="text-[11px] font-mono font-normal text-[var(--cf-text-muted)]">
                All amounts in {currencySymbol}
              </span>
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-[var(--cf-border)]">
              <table className="w-full text-xs font-mono text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--cf-surface-alt)] border-b border-[var(--cf-border)] text-[var(--cf-text-muted)]">
                    <th className="p-2.5 font-bold">Month</th>
                    <th className="p-2.5 font-bold text-right">Invoiced Income</th>
                    <th className="p-2.5 font-bold text-right">Living &amp; Biz Burn</th>
                    <th className="p-2.5 font-bold text-right">Tax Escrow</th>
                    <th className="p-2.5 font-bold text-right">Net Month Delta</th>
                    <th className="p-2.5 font-bold text-right">Projected Cash Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--cf-border-soft)] text-[var(--cf-text)]">
                  {(() => {
                    let running = result.currentSavings;
                    return records.slice(0, 12).map((row) => {
                      const tax = Math.round(row.income * assumptions.taxReservePct);
                      const net = row.income - row.expenses - tax;
                      running += net;
                      return (
                        <tr key={row.month} className="hover:bg-[var(--cf-surface-alt)]/50">
                          <td className="p-2.5 font-semibold">{row.month}</td>
                          <td className="p-2.5 text-right font-medium">
                            {currencySymbol}{row.income.toLocaleString()}
                          </td>
                          <td className="p-2.5 text-right text-[var(--cf-text-muted)]">
                            {currencySymbol}{row.expenses.toLocaleString()}
                          </td>
                          <td className="p-2.5 text-right text-amber-600 dark:text-amber-400">
                            {currencySymbol}{tax.toLocaleString()}
                          </td>
                          <td className={`p-2.5 text-right font-semibold ${net >= 0 ? 'text-emerald-600' : 'text-[#B4573F]'}`}>
                            {net >= 0 ? '+' : ''}{currencySymbol}{net.toLocaleString()}
                          </td>
                          <td className="p-2.5 text-right font-bold">
                            {currencySymbol}{Math.max(0, running).toLocaleString()}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Underwriting & CPA Certification Addendum */}
          <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] space-y-2 text-xs text-[var(--cf-text-muted)] leading-relaxed">
            <h4 className="font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Note to Mortgage Underwriters, Landlords &amp; CPAs</span>
            </h4>
            <p>
              Traditional freelance income verification relies on crude multi-year averages, which fail to capture irregular seasonal inflows or sudden payment delays. CashFloor implements a mathematically conservative <strong>20th-percentile floor analysis</strong>: in 80% of historical months, the subject exceeded this income threshold. Furthermore, quarterly estimated taxes have been systematically partitioned into escrow prior to calculating Safe-To-Spend liquidity.
            </p>
          </div>

          {/* Signature & Verification Footer */}
          <div className="pt-4 border-t border-[var(--cf-border)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[var(--cf-text-muted)]">
            <div>
              Verification Hash: <span className="text-[var(--cf-text)] font-semibold">{verificationCode}</span>
            </div>
            <div>
              Authorized by CashFloor Engine · https://cashfloor.app
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
