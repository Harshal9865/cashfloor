import React from 'react';
import Link from 'next/link';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';
import { ArrowLeft, Compass, FileSpreadsheet, BookOpen, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300 font-sans flex flex-col">
      <MarketingNav />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-24 text-center relative overflow-hidden">
        {/* Ambient glow */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-15 pointer-events-none" 
          style={{ background: 'radial-gradient(circle, var(--cf-accent) 0%, transparent 70%)' }} 
        />

        <div className="max-w-xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-[var(--cf-surface)] border border-[var(--cf-border)] shadow-md">
            <Compass className="w-10 h-10 text-[var(--cf-accent)] animate-spin-slow" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--cf-accent)] font-semibold">
              Error 404 // Unknown Coordinates
            </span>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[var(--cf-text)] tracking-tight">
              Financial Horizon Not Found
            </h1>
            <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed max-w-md mx-auto">
              The ledger entry or page you are looking for has been moved, archived, or does not exist in our mathematical models.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white transition-all shadow-lg hover:opacity-95"
              style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Return to Studio Dashboard</span>
            </Link>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono border border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore Financial Guides</span>
            </Link>
          </div>

          <div className="pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to CashFloor Homepage</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
