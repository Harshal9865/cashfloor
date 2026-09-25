import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';
import { ShieldCheck, Lock, Database, ArrowLeft, Globe, EyeOff, Server } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | CashFloor',
  description: 'Zero bank surveillance. Learn how CashFloor preserves 100% client-side data privacy for your freelance financials.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300 font-sans flex flex-col">
      <MarketingNav />
      
      <main id="main-content" className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 pt-6 pb-20 w-full space-y-10">
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
              <li><strong>Error Diagnostics:</strong> Browser-side error logging (console errors only) to identify and fix runtime bugs. No financial data is included in error reports.</li>
              <li><strong>No Third-Party Advertising:</strong> We run zero tracking pixels, zero social media retargeting scripts, and zero ad networks.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <Server className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>4. Data Portability & Account Deletion</span>
            </h2>
            <p>
              You maintain 100% sovereign ownership of your financial records. At any time, you may export your entire double-entry ledger as a standard CSV or JSON file from the Studio Dashboard. If you delete your account, your data is permanently purged from our primary database and replica backups within 30 days.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <Database className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>5. Data Retention</span>
            </h2>
            <p>
              <strong>Local data:</strong> Retained on your device until you clear browser storage. We have no access to local data.
            </p>
            <p>
              <strong>Cloud data (Pro accounts):</strong> Retained for as long as your account is active. Upon account deletion, all records are purged from primary databases within 7 business days and from automated backups within 30 calendar days.
            </p>
            <p>
              <strong>Authentication logs:</strong> Session logs are retained for 90 days for security audit purposes, then automatically deleted.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>6. Third-Party Sub-Processors</span>
            </h2>
            <p>
              CashFloor relies on the following trusted infrastructure providers to deliver its service:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Supabase (PostgreSQL & Auth):</strong> Hosts cloud database and authentication. Data is encrypted at rest (AES-256) and in transit (TLS 1.3). Supabase is SOC 2 Type II compliant.</li>
              <li><strong>Vercel:</strong> Hosts the web application frontend. No user financial data is stored on Vercel servers.</li>
              <li><strong>Dev.to Public API:</strong> Used solely to fetch public freelance blog articles for the Journal page. No user data is transmitted to Dev.to.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>7. Cookies & Local Storage</span>
            </h2>
            <p>
              CashFloor uses the following browser storage mechanisms:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Essential Authentication Cookies:</strong> Set by Supabase Auth to maintain your login session. These are strictly necessary and cannot be disabled while using Pro features.</li>
              <li><strong>LocalStorage:</strong> Used to persist your financial workspace, theme preference, and integration connection states. All data remains on your device.</li>
              <li><strong>No Analytics or Advertising Cookies:</strong> We do not use Google Analytics, Facebook Pixel, or any third-party tracking cookies.</li>
            </ul>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>8. International Data Transfers</span>
            </h2>
            <p>
              If you are located outside the United States, your cloud-synced data may be processed in the United States where our infrastructure providers operate. By using CashFloor Pro with cloud sync enabled, you consent to the transfer of your data to the United States. We ensure all transfers comply with applicable data protection regulations through our sub-processors&apos; standard contractual clauses (SCCs).
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>9. Your Rights (GDPR / CCPA)</span>
            </h2>
            <p>
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Access:</strong> Request a copy of all personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Correct any inaccurate personal data.</li>
              <li><strong>Erasure ("Right to be Forgotten"):</strong> Request permanent deletion of your account and all associated data.</li>
              <li><strong>Data Portability:</strong> Export your ledger data in machine-readable formats (CSV, JSON).</li>
              <li><strong>Restrict Processing:</strong> Limit how we use your personal data.</li>
              <li><strong>Opt-Out of Sale (CCPA):</strong> CashFloor does not sell personal information. We never have and never will.</li>
            </ul>
            <p>
              To exercise any of these rights, contact <a href="mailto:privacy@cashfloor.app" className="text-[var(--cf-accent)] font-mono hover:underline">privacy@cashfloor.app</a>. We will respond within 30 days.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>10. Children&apos;s Privacy</span>
            </h2>
            <p>
              CashFloor is designed for professional use by independent business operators. We do not knowingly collect personal information from individuals under the age of 16. If we become aware that a minor has provided us with personal data, we will take steps to delete that information promptly.
            </p>
          </section>

          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
            <h2 className="text-base font-serif font-bold text-[var(--cf-text)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--cf-accent)]" />
              <span>11. Contact Our Security Desk</span>
            </h2>
            <p>
              If you have inquiries regarding our encryption standards, data handling policies, or wish to exercise your privacy rights, contact our security desk at <a href="mailto:security@cashfloor.app" className="text-[var(--cf-accent)] font-mono hover:underline">security@cashfloor.app</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
