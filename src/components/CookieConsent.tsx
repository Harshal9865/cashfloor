'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cf-cookie-consent');
      if (!consent) {
        // Small delay so it doesn't jarringly pop on initial paint
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('cf-cookie-consent', 'essential-accepted');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent notice"
      role="region"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)]/95 backdrop-blur-md shadow-xl text-[var(--cf-text)] transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-serif font-bold uppercase tracking-wider text-[var(--cf-text)]">
              Zero Surveillance Cookie Policy
            </h3>
            <button
              type="button"
              onClick={handleAccept}
              aria-label="Dismiss cookie notice"
              className="text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed font-sans">
            CashFloor uses only strictly essential session cookies for secure sign-in and local-first cache. We run <strong>zero tracking pixels</strong>, <strong>zero ad networks</strong>, and <strong>no third-party surveillance</strong>.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleAccept}
              className="px-3.5 py-1.5 rounded-xl bg-[var(--cf-accent)] hover:bg-[var(--cf-accent)]/90 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            >
              Accept Essential
            </button>
            <Link
              href="/privacy"
              className="text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] transition-colors underline underline-offset-2"
            >
              Read Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
