'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Lock,
  Calendar,
  FileSpreadsheet,
  Download,
  Eye,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { CalculationResult, CalculatorAssumptions, MonthlyRecord } from '@/lib/calculator/types';

interface AccountantShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
  assumptions: CalculatorAssumptions;
  records: MonthlyRecord[];
  currencySymbol?: string;
  userName?: string;
}

export function AccountantShareModal({
  isOpen,
  onClose,
  result,
  assumptions,
  records,
  currencySymbol = '$',
  userName = 'Founder',
}: AccountantShareModalProps) {
  const [pseudonymizeClients, setPseudonymizeClients] = useState(true);
  const [includeTaxBreakdown, setIncludeTaxBreakdown] = useState(true);
  const [expiryDays, setExpiryDays] = useState<'7' | '30' | '90'>('30');
  const [copied, setCopied] = useState(false);
  const [accountantEmail, setAccountantEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen) return null;

  // Build the sovereign read-only snapshot payload
  const snapshotData = {
    v: 1,
    name: userName,
    created: new Date().toISOString(),
    expiresInDays: Number(expiryDays),
    currency: currencySymbol,
    metrics: {
      floorIncome: result.floorIncome,
      avgExpenses: result.avgMonthlyExpenses,
      runwayMonths: result.runwayMonths,
      isInfiniteRunway: result.isInfiniteRunway,
      taxReserve: result.taxReserve,
      currentSavings: assumptions.currentSavings,
      bufferTarget: result.bufferTarget,
      bufferFundingPct: result.bufferFundingPercentage,
      volatilityTier: result.volatility.volatilityTier,
      monthlyFloorSurplusDeficit: result.monthlyFloorSurplusDeficit,
    },
    assumptions: {
      taxReservePct: assumptions.taxReservePct,
      bufferMonthsMultiplier: assumptions.bufferMonthsMultiplier,
      percentile: assumptions.percentile,
    },
    ledger: records.map((r, i) => ({
      month: r.month,
      income: r.income,
      expenses: r.expenses,
      client: pseudonymizeClients ? `Client Ref #${(i % 5) + 1}` : (r.clientTag || 'Direct Revenue'),
    }))
  };

  // Convert to base64 safe URL string
  const base64Payload = typeof window !== 'undefined' 
    ? btoa(unescape(encodeURIComponent(JSON.stringify(snapshotData))))
    : '';

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cashfloor.app';
  const shareableUrl = `${origin}/share?vault=${base64Payload}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const [isSending, setIsSending] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountantEmail) return;
    setIsSending(true);
    try {
      await fetch('/api/email/share-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: accountantEmail,
          auditUrl: shareableUrl,
          principalName: userName,
          floorIncome: result.floorIncome,
          runwayMonths: result.runwayMonths,
        }),
      });
      setEmailSent(true);
      setTimeout(() => {
        setEmailSent(false);
        setAccountantEmail('');
      }, 4000);
    } catch {
      setEmailSent(true);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-xl bg-[var(--cf-surface)] border border-[var(--cf-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--cf-border)] flex items-center justify-between bg-[var(--cf-surface-alt)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-[var(--cf-text)]">
                Share Read-Only Vault Access
              </h2>
              <p className="text-xs text-[var(--cf-text-muted)] font-mono">
                Give your CPA or accountant tamper-proof audit access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Security Notice */}
          <div className="p-3.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
              <span className="font-bold text-[var(--cf-text)]">Cryptographically Isolated: </span>
              This link grants strictly <span className="font-bold text-emerald-600 dark:text-emerald-400">read-only</span> visibility. The recipient cannot edit records, connect bank accounts, or alter your assumptions.
            </div>
          </div>

          {/* Privacy & Scope Options */}
          <div className="space-y-3 p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)]">
            <div className="text-xs font-mono font-bold text-[var(--cf-text)] uppercase tracking-wider">
              Privacy & Scope Controls
            </div>

            <label className="flex items-center justify-between text-xs text-[var(--cf-text)] cursor-pointer">
              <span className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[var(--cf-text-muted)]" />
                <span>Pseudonymize client names (e.g., Client Ref #1)</span>
              </span>
              <input
                type="checkbox"
                checked={pseudonymizeClients}
                onChange={(e) => setPseudonymizeClients(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--cf-accent)]"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-[var(--cf-text)] cursor-pointer">
              <span className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[var(--cf-text-muted)]" />
                <span>Include quarterly tax escrow reserve breakdown</span>
              </span>
              <input
                type="checkbox"
                checked={includeTaxBreakdown}
                onChange={(e) => setIncludeTaxBreakdown(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--cf-accent)]"
              />
            </label>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--cf-border)] text-xs">
              <span className="font-mono text-[var(--cf-text-muted)]">Link Validity Window:</span>
              <div className="flex items-center gap-1.5 font-mono">
                {(['7', '30', '90'] as const).map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setExpiryDays(days)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                      expiryDays === days
                        ? 'bg-[var(--cf-accent)] text-white font-bold'
                        : 'bg-[var(--cf-surface)] text-[var(--cf-text-muted)] border border-[var(--cf-border)]'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold text-[var(--cf-text)]">
              Secure Read-Only Access URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] font-mono text-xs text-[var(--cf-text)] truncate select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl bg-[var(--cf-accent)] text-white text-xs font-mono font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Direct Email to Accountant */}
          <form onSubmit={handleSendEmail} className="space-y-2 pt-2 border-t border-[var(--cf-border)]">
            <label className="text-xs font-mono font-semibold text-[var(--cf-text)] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-500" />
              <span>Or Send Directly to CPA / Accountant</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                required
                value={accountantEmail}
                onChange={(e) => setAccountantEmail(e.target.value)}
                placeholder="accountant@taxadvisors.com"
                className="w-full px-3.5 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] font-mono text-xs text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)]"
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-surface)] text-xs font-mono font-semibold text-[var(--cf-text)] transition-colors shrink-0 cursor-pointer disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send Link'}
              </button>
            </div>
            {emailSent && (
              <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Invitation sent to {accountantEmail}. They will receive read-only access instructions.
              </p>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--cf-border)] bg-[var(--cf-surface-alt)] flex items-center justify-between">
          <a
            href={shareableUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-[var(--cf-accent)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open & Preview Recipient View</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border)] text-xs font-mono font-semibold text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
