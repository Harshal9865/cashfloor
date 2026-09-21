import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import Footer from '@/components/marketing/Footer';
import { ShieldCheck, Lock, Database, ArrowLeft, Globe, EyeOff, Server } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | CashFloor',
  description: 'Zero bank surveillance. Learn how CashFloor preserves 100% client-side data privacy for your freelance financials.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300 font-sans flex flex-col">
      <DashboardNav />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-20 w-full space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Zero Bank Surveillance
          </span>
        </div>

        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[var(--cf-text)]">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-[var(--cf-text-muted)] leading-relaxed">
            Last Updated: September 2026 · Effective Immediately
          </p>
        </div>

        {/* Highlight Architecture Banner */}
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-serif font-bold text-base">
            <EyeOff className="w-5 h-5 text-emerald-600" />
            <span>The Zero-Surveillance Core Guarantee</span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--cf-text-muted)] leading-relaxed">
            CashFloor does not connect to Plaid, Yodlee, or financial data brokers. Your financial records, customer invoice values, and cash runway calculations run 100% in your local browser memory by default. We never sell, monetize, or harvest your business records.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8 text-xs sm:text-sm leading-relaxed text-[var(--cf-text-muted)]">
          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <Database className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>1. Local-First Ledger Architecture</span>
            </h2>
            <p>
              When using the CashFloor Studio workspace without signing in, all monthly records, income numbers, and scenario levers are processed entirely client-side using Web API storage (IndexedDB and LocalStorage). This data is never sent to our servers. Clearing your browser cookies completely removes your local workspace.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>2. Optional Encrypted Cloud Synchronization</span>
            </h2>
            <p>
              If you choose to create a CashFloor Pro account to synchronize your workspace across devices, your financial models are stored in our secure PostgreSQL database managed via Supabase. Every row is protected by PostgreSQL Row-Level Security (RLS), guaranteeing that only your authenticated UUID can read or mutate your records.
            </p>
            <p>
              Authentication tokens and passwords are encrypted in transit via TLS 1.3 and at rest via AES-256.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>3. Data We Collect and Why</span>
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Credentials:</strong> Your email address and optional profile name, solely for authentication and secure magic-link logins.</li>
              <li><strong>Anonymous Telemetry:</strong> High-level application diagnostics (e.g. error reporting to identify runtime bugs) without any identifiable financial data attached.</li>
              <li><strong>No Third-Party Advertising:</strong> We run zero tracking pixels, zero social media retargeting scripts, and zero ad networks.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <Server className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>4. Data Portability &amp; Account Deletion</span>
            </h2>
            <p>
              You maintain 100% sovereign ownership of your financial records. At any time, you may export your entire double-entry ledger as a standard CSV or JSON file from the Studio Dashboard. If you delete your account, your data is permanently purged from our primary database and replica backups within 30 days.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>5. Contact Our Security Desk</span>
            </h2>
            <p>
              If you have inquiries regarding our encryption standards, data handling policies, or wish to exercise GDPR / CCPA rights, contact our security desk at <a href="mailto:security@cashfloor.app" className="text-[var(--cf-accent)] font-mono hover:underline">security@cashfloor.app</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
