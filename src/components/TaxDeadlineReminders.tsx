'use client';

import React, { useState } from 'react';
import { CalendarClock, AlertCircle, Download, Check, ExternalLink, ShieldCheck, Bell } from 'lucide-react';
import { downloadTaxCalendarFile } from '@/lib/calendar/icsGenerator';
import { TaxReminderModal } from '@/components/TaxReminderModal';

interface TaxDeadlineRemindersProps {
  taxReservePct?: number;
  quarterlyEscrowAmount?: number;
  currencySymbol?: string;
}

export const TaxDeadlineReminders: React.FC<TaxDeadlineRemindersProps> = ({
  taxReservePct = 0.25,
  quarterlyEscrowAmount,
  currencySymbol = '$',
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();

  // Define actual dates for this tax cycle
  const deadlineDates = [
    { period: 'Q1 (Jan–Mar)', dateStr: 'April 15', date: new Date(currentYear, 3, 15, 23, 59, 59) },
    { period: 'Q2 (Apr–May)', dateStr: 'June 15', date: new Date(currentYear, 5, 15, 23, 59, 59) },
    { period: 'Q3 (Jun–Aug)', dateStr: 'Sept 15', date: new Date(currentYear, 8, 15, 23, 59, 59) },
    { period: 'Q4 (Sep–Dec)', dateStr: 'Jan 15', date: new Date(currentYear + 1, 0, 15, 23, 59, 59) },
  ];

  // Find the next upcoming deadline
  let nextDeadlineIndex = deadlineDates.findIndex((d) => d.date.getTime() >= now.getTime());
  if (nextDeadlineIndex === -1) {
    nextDeadlineIndex = 0; // wrap to next year
  }

  const nextDeadline = deadlineDates[nextDeadlineIndex];
  const diffDays = Math.max(0, Math.ceil((nextDeadline.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  const handleDownloadCalendar = () => {
    downloadTaxCalendarFile();
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  return (
    <div
      className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 w-full rounded-2xl border transition-colors shadow-xs"
      style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)', color: 'var(--cf-text)' }}
    >
      {/* Title & Escrow Status */}
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="p-2.5 rounded-2xl shrink-0" style={{ background: 'var(--cf-accent-bg)' }}>
          <CalendarClock className="w-5 h-5" style={{ color: 'var(--cf-accent)' }} />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-sm tracking-wide text-[var(--cf-text)]">
              Quarterly Estimated Tax Deadlines
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
              {diffDays === 0 ? 'Due Today' : `Next in ${diffDays} days`}
            </span>
          </div>
          <p className="text-[11px] font-mono text-[var(--cf-text-muted)] flex items-center gap-2">
            <span>IRS & Self-Employment Escrow ({(taxReservePct * 100).toFixed(0)}% Rate)</span>
            {quarterlyEscrowAmount !== undefined && (
              <>
                <span>·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {currencySymbol}{quarterlyEscrowAmount.toLocaleString()} Allocated in Vault
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Deadlines Grid & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
          {deadlineDates.map((d, i) => {
            const isNext = i === nextDeadlineIndex;
            return (
              <div
                key={d.period}
                className="px-3 py-2 border rounded-xl transition-all"
                style={{
                  borderColor: isNext ? 'var(--cf-accent)' : 'var(--cf-border)',
                  background: isNext ? 'var(--cf-accent-bg)' : 'var(--cf-surface)',
                }}
              >
                <div className="flex items-center gap-1.5">
                  {isNext && <AlertCircle className="w-3 h-3" style={{ color: 'var(--cf-accent)' }} />}
                  <span
                    className="text-[10px] font-mono tracking-wider"
                    style={{ color: isNext ? 'var(--cf-accent)' : 'var(--cf-text-muted)' }}
                  >
                    {d.period}
                  </span>
                </div>
                <div
                  className="font-bold text-xs font-mono mt-0.5"
                  style={{ color: isNext ? 'var(--cf-text)' : 'var(--cf-text-faint)' }}
                >
                  {d.dateStr}
                </div>
              </div>
            );
          })}
        </div>

        {/* Export Calendar (.ics) button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadCalendar}
            title="Download iCalendar file to import deadlines into Google Calendar, Apple Calendar, or Outlook"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer shadow-xs hover:border-[var(--cf-accent)]"
            style={{
              borderColor: 'var(--cf-border)',
              background: 'var(--cf-surface)',
              color: 'var(--cf-text)',
            }}
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Saved (.ics)</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
                <span>Add to Calendar</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsAlertModalOpen(true)}
            title="Schedule email & browser push reminders for this tax deadline"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono border transition-all cursor-pointer shadow-xs border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Set Alerts</span>
          </button>

          <a
            href="https://www.irs.gov/payments"
            target="_blank"
            rel="noopener noreferrer"
            title="Open IRS Direct Pay portal"
            className="p-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] hover:border-[var(--cf-accent)] transition-colors inline-flex items-center justify-center"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <TaxReminderModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        taxReserveAmount={quarterlyEscrowAmount || 0}
        nextDeadlineDate={nextDeadline.dateStr}
        nextQuarterName={nextDeadline.period}
        currencySymbol={currencySymbol}
      />
    </div>
  );
};
