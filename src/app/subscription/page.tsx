'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Lock,
  ArrowLeft,
  Building2,
  User,
  Star,
  Layers,
  ChevronDown
} from 'lucide-react';
import MarketingNav from '@/components/MarketingNav';
import { useAuth } from '@/lib/auth/AuthContext';
import { usePayment } from '@/lib/payment/PaymentContext';

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { user, isAuthenticated, isPro, openAuthModal } = useAuth();
  const { 
    openCheckout, 
    isProSubscriber, 
    activePlan, 
    subscriptionRenewalDate, 
    cancelSubscription 
  } = usePayment();

  const handleUpgrade = (tier: 'pro' | 'studio') => {
    openCheckout(tier, billingCycle);
  };

  const FAQS = [
    {
      q: 'Why does CashFloor use 20th-percentile math instead of averages?',
      a: 'Average income is dangerously misleading for freelancers. If you make $10k in December and $2k in January, your average is $6k. But if you budget based on $6k, you risk overdrafting in lean months. The 20th percentile guarantees that 80% of your historical months were equal to or better than this floor, giving you an impenetrable safety baseline.',
    },
    {
      q: 'Does CashFloor connect to my bank or credit cards?',
      a: 'No. Never. We practice strict Zero Bank Surveillance. We do not use Plaid, Yodlee, or bank credentials. You paste your numbers, import a clean CSV, or enter your monthly invoice totals. Your confidential banking credentials remain strictly in your hands.',
    },
    {
      q: 'Where is my financial data stored?',
      a: 'By default, CashFloor operates as a Private Local Vault inside your device browser storage. For Pro subscribers with cloud sync enabled, records are encrypted with AES-256 before being mirrored to our secure Supabase database.',
    },
    {
      q: 'Can I cancel my subscription anytime?',
      a: 'Yes, with one click in your Account settings. If you cancel, your account automatically reverts to the free Starter tier and your private data remains completely accessible and exportable as CSV or JSON.',
    },
    {
      q: 'Can I share my runway reports with my accountant or business partner?',
      a: 'Yes. You can generate clean double-entry CSV reconciliation sheets or share high-resolution social runway cards with your CPA or business advisors.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300">
      <MarketingNav />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 pt-28 pb-20 space-y-16">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>

          <span className="text-xs font-mono text-[var(--cf-text-faint)]">
            Transparent Pricing · Zero Hidden Fees
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono"
            style={{
              background: 'var(--cf-accent-bg)',
              borderColor: 'var(--cf-border)',
              color: 'var(--cf-accent)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Invest in Financial Certainty</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-serif font-semibold tracking-tight text-[var(--cf-text)] leading-[1.12]">
            Predictable income for the{' '}
            <span className="gradient-text italic">unpredictable</span> economy.
          </h1>

          <p className="text-base sm:text-lg text-[var(--cf-text-muted)] max-w-2xl mx-auto leading-relaxed">
            Choose the level of stress-testing and capital partitioning you need. Upgrade or downgrade at any time with zero lock-in.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div 
              className="p-1 rounded-full border flex items-center gap-1 bg-[var(--cf-surface)]"
              style={{ borderColor: 'var(--cf-border)' }}
            >
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[var(--cf-text)] text-[var(--cf-bg)] shadow-sm'
                    : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                }`}
              >
                Monthly
              </button>

              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-[var(--cf-text)] text-[var(--cf-bg)] shadow-sm'
                    : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                }`}
              >
                <span>Annual</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-white">
                  Save 25%
                </span>
              </button>
            </div>
          </div>

          {isProSubscriber && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Active Sandbox License: {activePlan || 'Pro Sentinel'}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--cf-text-muted)] font-mono">
                  Renews: {subscriptionRenewalDate || 'September 2027'} · Zero Bank Surveillance Mode
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openCheckout('studio', billingCycle)}
                  className="px-3 py-1.5 rounded-lg bg-[var(--cf-surface)] border border-[var(--cf-border)] text-xs font-mono text-[var(--cf-text)] hover:border-[var(--cf-accent)] cursor-pointer transition-colors"
                >
                  Switch Tier
                </button>
                <button
                  type="button"
                  onClick={cancelSubscription}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors"
                >
                  Revoke License
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Pricing Tiers Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Tier 1: Starter / Free */}
          <div 
            className="rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative"
            style={{
              background: 'var(--cf-surface)',
              borderColor: 'var(--cf-border)',
              boxShadow: 'var(--cf-shadow-sm)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--cf-text-faint)]">
                  Free Forever
                </span>
                <span className="p-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                  <User className="w-4 h-4 text-[var(--cf-text-muted)]" />
                </span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-[var(--cf-text)]">
                Starter Ledger
              </h2>
              <p className="text-xs text-[var(--cf-text-muted)] mt-1 mb-6 leading-relaxed">
                Essential conservative floor calculation for independent creators taking control of their cash flow.
              </p>

              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-[var(--cf-border-soft)]">
                <span className="text-4xl font-serif font-bold text-[var(--cf-text)]">$0</span>
                <span className="text-xs font-mono text-[var(--cf-text-muted)]">/ forever</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>20th-Percentile Conservative Floor calculation</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>12-Month Single Ledger Spreadsheet</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>100% Private Local Vault (zero telemetry)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Standard CSV Export</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/dashboard"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                style={{
                  borderColor: 'var(--cf-border)',
                  background: 'var(--cf-surface-alt)',
                  color: 'var(--cf-text)',
                }}
              >
                <span>Use Free Tier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Tier 2: Freelance Pro (Featured) */}
          <div 
            className="rounded-3xl border-2 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative shadow-2xl scale-[1.02] z-10"
            style={{
              background: 'var(--cf-surface)',
              borderColor: 'var(--cf-accent)',
              boxShadow: '0 12px 40px rgba(47,111,98,0.18)',
            }}
          >
            {/* Best Value Badge */}
            <div 
              className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase text-white shadow-md"
              style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
            >
              Most Popular for Freelancers
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--cf-accent)]">
                  Pro Floor
                </span>
                <span className="p-2 rounded-xl bg-[var(--cf-accent-bg)] border border-[var(--cf-accent)]/30">
                  <Sparkles className="w-4 h-4 text-[var(--cf-accent)]" />
                </span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-[var(--cf-text)]">
                Freelance Pro
              </h2>
              <p className="text-xs text-[var(--cf-text-muted)] mt-1 mb-6 leading-relaxed">
                Full dynamic stress-testing suite, automated quarterly tax shielding, and cloud sync for consultants.
              </p>

              <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-[var(--cf-border-soft)]">
                <span className="text-4xl sm:text-5xl font-serif font-bold text-[var(--cf-text)]">
                  ${billingCycle === 'annual' ? '15' : '19'}
                </span>
                <span className="text-xs font-mono text-[var(--cf-text-muted)]">
                  / month {billingCycle === 'annual' && '· billed annually'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-semibold text-[var(--cf-text)]">
                    All 6 Advanced Stress-Test Scenarios
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Quarterly Tax Escrow Auto-Partitioner</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Encrypted Multi-Device Cloud Sync (Supabase)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Client Revenue Concentration (HHI) Radar</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Zero-Income Exhaustion Date Countdown</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Unlimited Bank &amp; Invoice CSV Imports</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleUpgrade('pro')}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-semibold text-white transition-all duration-300 cursor-pointer shadow-lg hover:opacity-95"
                style={{
                  background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)',
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isProSubscriber && activePlan?.toLowerCase().includes('pro')
                    ? 'Active Plan (Re-authorize / Test)'
                    : 'Activate Freelance Pro'}
                </span>
              </button>
            </div>
          </div>

          {/* Tier 3: Studio / Agency */}
          <div 
            className="rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative"
            style={{
              background: 'var(--cf-surface)',
              borderColor: 'var(--cf-border)',
              boxShadow: 'var(--cf-shadow-sm)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--cf-text-faint)]">
                  Boutique &amp; Studio
                </span>
                <span className="p-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                  <Building2 className="w-4 h-4 text-[var(--cf-text-muted)]" />
                </span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-[var(--cf-text)]">
                Studio &amp; Agency
              </h2>
              <p className="text-xs text-[var(--cf-text-muted)] mt-1 mb-6 leading-relaxed">
                Multi-entity cash flow, subcontractor escrow partitioning, and CPA audit reports for growing firms.
              </p>

              <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-[var(--cf-border-soft)]">
                <span className="text-4xl font-serif font-bold text-[var(--cf-text)]">
                  ${billingCycle === 'annual' ? '39' : '49'}
                </span>
                <span className="text-xs font-mono text-[var(--cf-text-muted)]">
                  / month {billingCycle === 'annual' && '· billed annually'}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Everything in Freelance Pro</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Multi-Entity &amp; Sub-brand Ledgers</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Subcontractor Milestone Escrow Buckets</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Direct CPA &amp; Bookkeeper Export Packages</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Dedicated Priority Founder Support</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="button"
                onClick={() => handleUpgrade('studio')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer hover:border-[var(--cf-accent)]"
                style={{
                  borderColor: 'var(--cf-border)',
                  background: 'var(--cf-surface-alt)',
                  color: 'var(--cf-text)',
                }}
              >
                <span>
                  {isProSubscriber && activePlan?.toLowerCase().includes('studio')
                    ? 'Active Plan (Re-authorize / Test)'
                    : 'Upgrade to Studio'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* ── Feature Comparison Table ── */}
        <div 
          className="rounded-3xl border overflow-hidden p-6 sm:p-8"
          style={{
            background: 'var(--cf-surface)',
            borderColor: 'var(--cf-border)',
          }}
        >
          <h2 className="text-xl font-serif font-bold text-[var(--cf-text)] mb-6">
            Detailed Feature Breakdown
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-[var(--cf-border-soft)] text-[var(--cf-text-faint)]">
                  <th className="py-3 px-2 font-medium">Capability</th>
                  <th className="py-3 px-2 font-medium text-center">Starter ($0)</th>
                  <th className="py-3 px-2 font-medium text-center text-[var(--cf-accent)]">Pro ($15)</th>
                  <th className="py-3 px-2 font-medium text-center">Studio ($39)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cf-border-soft)]">
                <tr>
                  <td className="py-3 px-2 text-[var(--cf-text)] font-sans">20th-Percentile Survival Floor Math</td>
                  <td className="py-3 px-2 text-center text-emerald-500">✓</td>
                  <td className="py-3 px-2 text-center text-emerald-500 font-bold">✓</td>
                  <td className="py-3 px-2 text-center text-emerald-500">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--cf-text)] font-sans">Zero Bank Surveillance (Client Privacy)</td>
                  <td className="py-3 px-2 text-center text-emerald-500">✓</td>
                  <td className="py-3 px-2 text-center text-emerald-500 font-bold">✓</td>
                  <td className="py-3 px-2 text-center text-emerald-500">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--cf-text)] font-sans">Stress Tests: Client Churn, 90d Drought, Late Invoices</td>
                  <td className="py-3 px-2 text-center text-[var(--cf-text-faint)]">—</td>
                  <td className="py-3 px-2 text-center text-emerald-500 font-bold">✓</td>
                  <td className="py-3 px-2 text-center text-emerald-500">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--cf-text)] font-sans">Automated Quarterly Tax Escrow Partitioning</td>
                  <td className="py-3 px-2 text-center text-[var(--cf-text-faint)]">—</td>
                  <td className="py-3 px-2 text-center text-emerald-500 font-bold">✓</td>
                  <td className="py-3 px-2 text-center text-emerald-500">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--cf-text)] font-sans">Encrypted Multi-Device Cloud Sync</td>
                  <td className="py-3 px-2 text-center text-[var(--cf-text-faint)]">—</td>
                  <td className="py-3 px-2 text-center text-emerald-500 font-bold">✓</td>
                  <td className="py-3 px-2 text-center text-emerald-500">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--cf-text)] font-sans">Client Concentration (HHI) Risk Radar</td>
                  <td className="py-3 px-2 text-center text-[var(--cf-text-faint)]">—</td>
                  <td className="py-3 px-2 text-center text-emerald-500 font-bold">✓</td>
                  <td className="py-3 px-2 text-center text-emerald-500">✓</td>
                </tr>
                <tr>
                  <td className="py-3 px-2 text-[var(--cf-text)] font-sans">Multi-Entity / Subcontractor Escrow</td>
                  <td className="py-3 px-2 text-center text-[var(--cf-text-faint)]">—</td>
                  <td className="py-3 px-2 text-center text-[var(--cf-text-faint)]">—</td>
                  <td className="py-3 px-2 text-center text-emerald-500">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── FAQ Section ── */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-serif font-bold text-center text-[var(--cf-text)] mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border overflow-hidden transition-colors"
                  style={{
                    background: 'var(--cf-surface)',
                    borderColor: 'var(--cf-border)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-[var(--cf-text)] pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className="w-4 h-4 shrink-0 transition-transform duration-200 text-[var(--cf-text-muted)]"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-[var(--cf-text-muted)] leading-relaxed border-t border-[var(--cf-border-soft)] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
