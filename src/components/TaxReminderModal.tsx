'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Zap,
  Smartphone
} from 'lucide-react';

interface TaxReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxReserveAmount: number;
  nextDeadlineDate: string;
  nextQuarterName: string;
  currencySymbol?: string;
  runwayMonths?: number;
}

export function TaxReminderModal({
  isOpen,
  onClose,
  taxReserveAmount,
  nextDeadlineDate,
  nextQuarterName,
  currencySymbol = '$',
  runwayMonths = 6,
}: TaxReminderModalProps) {
  const [email, setEmail] = useState('');
  const [remind14Days, setRemind14Days] = useState(true);
  const [remind7Days, setRemind7Days] = useState(true);
  const [remindLowRunway, setRemindLowRunway] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cf_tax_reminders');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.email) setEmail(parsed.email);
          if (parsed.remind14Days !== undefined) setRemind14Days(parsed.remind14Days);
          if (parsed.remind7Days !== undefined) setRemind7Days(parsed.remind7Days);
          if (parsed.remindLowRunway !== undefined) setRemindLowRunway(parsed.remindLowRunway);
        } catch {}
      }

      if ('Notification' in window) {
        setPushSupported(true);
        if (Notification.permission === 'granted') {
          setPushEnabled(true);
        }
      }
    }
  }, []);

  if (!isOpen) return null;

  const handleRequestPush = async () => {
    if (!('Notification' in window)) {
      setPushStatusMessage('Browser notifications are not supported in this browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPushEnabled(true);
        setPushStatusMessage('Push notifications enabled successfully!');
        // Show test notification
        new Notification('CashFloor Solvency Alert', {
          body: `Upcoming ${nextQuarterName} Tax Deadline: ${currencySymbol}${Math.round(taxReserveAmount).toLocaleString()} reserved in escrow.`,
          icon: '/cashfloor-icon.png',
        });
      } else {
        setPushEnabled(false);
        setPushStatusMessage('Notification permission denied by browser.');
      }
    } catch (err) {
      console.error(err);
      setPushStatusMessage('Could not request notification permission.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      const preferences = {
        email,
        remind14Days,
        remind7Days,
        remindLowRunway,
        pushEnabled,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('cf_tax_reminders', JSON.stringify(preferences));
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-lg bg-[var(--cf-surface)] border border-[var(--cf-border)] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--cf-border)] flex items-center justify-between bg-[var(--cf-surface-alt)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-serif text-[var(--cf-text)]">
                Tax Deadline & Low Runway Alerts
              </h2>
              <p className="text-xs text-[var(--cf-text-muted)] font-mono">
                Automated reminders for IRS estimated tax & cash safety
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5">
          {/* Upcoming Deadline Highlight Card */}
          <div className="p-4 rounded-2xl border border-amber-500/25 bg-amber-500/5 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Next Deadline: {nextQuarterName}</span>
              </span>
              <span>{nextDeadlineDate}</span>
            </div>
            <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
              Target tax escrow: <span className="font-bold text-[var(--cf-text)]">{currencySymbol}{Math.round(taxReserveAmount).toLocaleString()}</span>. We will remind you ahead of time so you never incur underpayment penalties.
            </p>
          </div>

          {/* Email Alert Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-semibold text-[var(--cf-text)] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
              <span>Notification Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@freelancestudio.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] font-mono text-xs text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2.5 p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)]">
            <div className="text-[11px] font-mono font-bold text-[var(--cf-text-muted)] uppercase tracking-wider">
              Trigger Rules
            </div>

            <label className="flex items-center justify-between text-xs text-[var(--cf-text)] cursor-pointer">
              <span>Send reminder 14 days before quarterly deadline</span>
              <input
                type="checkbox"
                checked={remind14Days}
                onChange={(e) => setRemind14Days(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--cf-accent)]"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-[var(--cf-text)] cursor-pointer">
              <span>Send final reminder 7 days before filing date</span>
              <input
                type="checkbox"
                checked={remind7Days}
                onChange={(e) => setRemind7Days(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--cf-accent)]"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-[var(--cf-text)] cursor-pointer">
              <span>Low-runway emergency alert (if runway drops &lt; 3.0 months)</span>
              <input
                type="checkbox"
                checked={remindLowRunway}
                onChange={(e) => setRemindLowRunway(e.target.checked)}
                className="w-4 h-4 rounded accent-[var(--cf-accent)]"
              />
            </label>
          </div>

          {/* Browser Push Notification Option */}
          {pushSupported && (
            <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-mono font-bold text-[var(--cf-text)] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Browser & Mobile PWA Push</span>
                </div>
                <p className="text-[11px] text-[var(--cf-text-muted)]">
                  Receive instant desktop & lockscreen banner alerts
                </p>
                {pushStatusMessage && (
                  <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    {pushStatusMessage}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleRequestPush}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0 ${
                  pushEnabled
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-[var(--cf-accent)] text-white hover:opacity-90'
                }`}
              >
                {pushEnabled ? '✓ Active' : 'Enable Push'}
              </button>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[var(--cf-accent)] text-white text-xs font-bold font-mono hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Save Alert Schedules</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
