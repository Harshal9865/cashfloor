'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, ArrowLeft, FileSpreadsheet } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error in CashFloor:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full p-8 rounded-3xl border border-amber-500/30 bg-[var(--cf-surface)] shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-amber-600 font-semibold">
            Calculation State Interrupted
          </span>
          <h1 className="text-2xl font-serif font-bold text-[var(--cf-text)]">
            Workspace Recovery Active
          </h1>
          <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
            An unexpected runtime condition occurred while rendering financial models. Your local records are protected in your browser cache.
          </p>
        </div>

        {error.message && (
          <div className="p-3 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] font-mono text-[11px] text-[var(--cf-text-muted)] text-left overflow-x-auto max-h-24">
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-md cursor-pointer hover:opacity-95"
            style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Calculation</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Reload Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
