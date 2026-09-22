'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Shield, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Zap, 
  Sparkles, 
  HelpCircle, 
  ChevronDown,
  ChevronUp,
  Download,
  ShieldCheck,
  Building,
  UserCheck
} from 'lucide-react';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';
import { usePayment } from '@/lib/payment/PaymentContext';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { openCheckout, isProSubscriber, activePlan } = usePayment();

  const isAnnual = billingCycle === 'annual';

  const PRICING_PLANS = [
    {
      id: 'free',
      name: 'Free Vault',
      badge: 'Local-First',
      price: '$0',
      period: 'forever',
      description: 'Essential client-side runway calculator for new freelancers and early-stage solo operators.',
      features: [
        '3-Month Runway Forecast',
        'Local Browser Storage (IndexedDB)',
        'Basic Tax Escrow Calculator (25%)',
        'Days Sales Outstanding (DSO) Tracker',
        'Standard CSV Template Export',
      ],
      notIncluded: [
        '12-Month Double-Entry Cloud Ledger',
        'Monte Carlo 10,000 Iteration Risk Lab',
        'Pending Invoice Aging & Haircut Engine',
        'Cross-Border FX Volatility Buffer (3%)',
        'Cross-Device Multi-Tab Realtime Cloud Sync',
      ],
      cta: 'Start with Free Vault',
      href: '/dashboard',
      highlight: false,
    },
    {
      id: 'pro',
      name: 'Pro Sentinel',
      badge: 'Most Popular',
      price: isAnnual ? '$9' : '$12',
      period: isAnnual ? 'per month, billed annually ($108/yr)' : 'per month, billed monthly',
      description: 'The definitive financial operating system for serious independent consultants and contractors.',
      features: [
        '12-Month Double-Entry Cloud Ledger',
        'End-to-End Encrypted Supabase Cloud Sync',
        'Monte Carlo 10k Iteration Simulation Lab',
        'Safe-To-Spend Real-Time Liquidity Metric',
        'Accounts Receivable & Invoice Aging Radar',
        '3% Cross-Border FX Volatility Haircut Engine',
        'Custom Business Legal Structure (LLC, S-Corp)',
        'Stripe, Wise, & PayPal Universal CSV Ingestion',
        'Priority Technical & Financial Desk Support',
      ],
      notIncluded: [],
      cta: 'Start 14-Day Free Trial',
      href: '/dashboard',
      highlight: true,
    },
    {
      id: 'studio',
      name: 'Studio & Agency',
      badge: 'Boutique Firm',
      price: isAnnual ? '$24' : '$29',
      period: isAnnual ? 'per month, billed annually ($288/yr)' : 'per month, billed monthly',
      description: 'Advanced liquidity fortress for boutique studios, multi-client agencies, and high-retainer teams.',
      features: [
        'Everything in Pro Sentinel included',
        'Multi-Entity Client Consolidation',
        'Accountant & Bookkeeper Read-Only Vault Link',
        'Custom Fiscal Year & Quarterly Estimated Schedules',
        'Advanced Sub-Reserve Partitioning (5 Pillars)',
        'Bespoke Export Mapping (QuickBooks, Xero, Wave)',
        'Direct 1-on-1 Runway Calibration Call',
      ],
      notIncluded: [],
      cta: 'Upgrade to Studio',
      href: '/dashboard',
      highlight: false,
    },
  ];

  const FAQS = [
    {
      q: 'How does CashFloor protect my banking and financial data?',
      a: 'CashFloor is built on a client-side first architecture. All Monte Carlo simulations, runway models, and Safe-To-Spend figures are computed in your browser using WebAssembly and V8. When synced to Supabase Cloud, records are protected with strict PostgreSQL Row Level Security (RLS) bound solely to your cryptographic user ID. We never sell or inspect your ledgers.',
    },
    {
      q: 'Why do I need CashFloor if I already use QuickBooks, Wave, or Stripe?',
      a: 'Accounting software like QuickBooks and invoicing tools like Stripe only look backward at past transactions. They do not calculate future survival runway, worst-case 20th percentile cashflows, or dynamic Safe-To-Spend figures under irregular client payments. CashFloor prevents overspending before lean months arrive.',
    },
    {
      q: 'Can I import my data from Stripe, Wise, or my bank without manual entry?',
      a: 'Yes! CashFloor features an intelligent Universal CSV parser. You can drop or paste transaction statements exported from Stripe, Wise, PayPal, or any standard bank CSV. CashFloor auto-detects columns, normalizes amounts, and aggregates them into a 12-month runway schedule in seconds.',
    },
    {
      q: 'What is the 3% FX Volatility Haircut on foreign invoices?',
      a: 'If you bill overseas clients in USD, EUR, GBP, or other foreign currencies, currency exchange rate fluctuations and intermediary wire fees frequently erode 2% to 4% of your payout. CashFloor automatically discounts pending foreign receivables by 3% so your runway is never caught short by conversion dips.',
    },
    {
      q: 'Can I cancel anytime or export my ledgers?',
      a: 'Absolutely. There are no lock-in contracts. You can export your full double-entry accounting ledger to CSV at any time with a single click, and cancel your Pro subscription with zero penalties.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cf-bg)] text-[var(--cf-text)] font-sans transition-colors duration-300 overflow-x-hidden">
      <MarketingNav />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-24 space-y-16">
        
        {/* Breadcrumb & Quick Return */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard Workspace</span>
          </Link>

          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>14-Day Risk-Free Money Back Guarantee</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" />
            <span>Predictive Financial Engineering</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[var(--cf-text)]"
          >
            Invest in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-accent)] to-emerald-500">Certainty</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-base sm:text-lg text-[var(--cf-text-muted)] leading-relaxed"
          >
            Stop calculating runway on unreliable averages. Equip your freelance practice with quantitative risk modeling, automated tax escrow, and guaranteed cash floor visibility.
          </motion.p>

          {/* Billing Cycle Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`text-xs transition-all cursor-pointer ${
                !isAnnual
                  ? 'text-[var(--cf-text)] font-bold drop-shadow-xs'
                  : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
              }`}
            >
              Monthly Billing
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle(isAnnual ? 'monthly' : 'annual')}
              className="relative w-16 h-8 rounded-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] p-1 transition-all focus:outline-none cursor-pointer shadow-inner hover:border-emerald-500/40"
              aria-label="Toggle annual billing"
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2F6F62] to-emerald-400 shadow-md flex items-center justify-center text-white"
                animate={{ x: isAnnual ? 30 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              >
                <Sparkles className="w-3 h-3 text-white/90" />
              </motion.div>
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                isAnnual
                  ? 'text-[var(--cf-text)] font-bold drop-shadow-xs'
                  : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-sm ring-1 ring-emerald-400/30">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid with Interactive Selection & Radiant Shades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan, index) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.015 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative flex flex-col justify-between rounded-3xl p-8 border cursor-pointer transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'bg-[var(--cf-surface)] border-emerald-500 shadow-[0_0_45px_-8px_rgba(47,111,98,0.4)] dark:shadow-[0_0_50px_-8px_rgba(61,232,200,0.25)] ring-2 ring-emerald-500/40 md:-translate-y-2'
                    : plan.highlight
                    ? 'bg-[var(--cf-surface)] border-[var(--cf-accent)]/80 shadow-xl ring-1 ring-[var(--cf-accent)]/20 hover:border-emerald-500/60'
                    : 'bg-[var(--cf-surface)] border-[var(--cf-border)] hover:border-emerald-500/40 shadow-sm hover:shadow-xl'
                }`}
              >
                {/* Radiant Ambient Shade Overlay for Selected / Highlighted Card */}
                {isSelected && (
                  <div
                    className="absolute inset-0 rounded-3xl pointer-events-none opacity-50"
                    style={{
                      background:
                        'radial-gradient(ellipse at top center, rgba(61, 232, 200, 0.18), transparent 70%)',
                    }}
                  />
                )}

                {/* Top Highlight Badge */}
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[var(--cf-accent)] to-emerald-600 text-white shadow-md z-10">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-2xl font-bold text-[var(--cf-text)]">{plan.name}</h3>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full shadow-xs">
                          <Check className="w-3 h-3" /> Selected
                        </span>
                      ) : !plan.highlight ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[var(--cf-text-muted)] bg-[var(--cf-surface-alt)] border border-[var(--cf-border)]">
                          {plan.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Price Display */}
                  <div className="pt-2 pb-4 border-b border-[var(--cf-border)]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-serif font-bold text-[var(--cf-text)] tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs font-mono text-[var(--cf-text-muted)]">
                        {plan.price === '$0' ? '/ forever' : '/ month'}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[var(--cf-text-muted)] mt-1">
                      {plan.period}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3">
                    <p className="text-xs font-mono font-bold text-[var(--cf-text)] uppercase tracking-wider">
                      Included in {plan.name}:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-xs text-[var(--cf-text)]">
                          <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                      {plan.notIncluded.map((notFeat) => (
                        <li key={notFeat} className="flex items-start gap-2.5 text-xs text-[var(--cf-text-muted)] opacity-50">
                          <div className="w-4 h-4 rounded-full bg-[var(--cf-surface-alt)] text-[var(--cf-text-muted)] flex items-center justify-center shrink-0 mt-0.5">
                            <X className="w-3 h-3" />
                          </div>
                          <span className="line-through">{notFeat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-8 relative z-10">
                  {plan.id === 'free' ? (
                    <Link
                      href={plan.href}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm border cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 shadow-md'
                          : 'bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-border)] text-[var(--cf-text)] border-[var(--cf-border)]'
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openCheckout(plan.id as 'pro' | 'studio', billingCycle);
                      }}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                        isSelected || plan.highlight
                          ? 'bg-[var(--cf-accent)] hover:bg-[#23584e] text-white shadow-md hover:shadow-xl hover:scale-[1.02]'
                          : 'bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-border)] text-[var(--cf-text)] border border-[var(--cf-border)]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                      <span>
                        {isProSubscriber && activePlan?.toLowerCase().includes(plan.id)
                          ? 'Manage Active Plan'
                          : plan.cta}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <section className="pt-12 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cf-text)]">
              Detailed Feature Comparison
            </h2>
            <p className="text-xs sm:text-sm text-[var(--cf-text-muted)]">
              Every detail engineered to give independent professionals mathematical peace of mind.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--cf-border)] bg-[var(--cf-surface-alt)]">
                  <th className="p-4 font-mono font-bold uppercase tracking-wider text-[var(--cf-text)]">Capabilities</th>
                  <th className="p-4 font-mono font-bold text-center text-[var(--cf-text)]">Free Vault</th>
                  <th className="p-4 font-mono font-bold text-center text-[var(--cf-accent)]">Pro Sentinel</th>
                  <th className="p-4 font-mono font-bold text-center text-[var(--cf-text)]">Studio &amp; Agency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cf-border)] text-[var(--cf-text)]">
                <tr>
                  <td className="p-4 font-medium">Runway Forecast Horizon</td>
                  <td className="p-4 text-center font-mono text-[var(--cf-text-muted)]">3 Months</td>
                  <td className="p-4 text-center font-mono font-bold text-emerald-600">12 Months</td>
                  <td className="p-4 text-center font-mono font-bold text-emerald-600">24 Months</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Storage &amp; Encryption</td>
                  <td className="p-4 text-center">Local Browser Only</td>
                  <td className="p-4 text-center text-emerald-600 font-semibold">Postgres RLS Cloud Sync</td>
                  <td className="p-4 text-center text-emerald-600 font-semibold">Postgres RLS + Multi-Vault</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Monte Carlo Simulation Lab</td>
                  <td className="p-4 text-center text-[var(--cf-text-muted)]">—</td>
                  <td className="p-4 text-center text-emerald-600">10,000 Iterations</td>
                  <td className="p-4 text-center text-emerald-600">50,000 Iterations</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Cross-Border FX Volatility Haircut</td>
                  <td className="p-4 text-center text-[var(--cf-text-muted)]">—</td>
                  <td className="p-4 text-center text-emerald-600">3% Dynamic Haircut</td>
                  <td className="p-4 text-center text-emerald-600">Custom Tunable Haircut</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Stripe, Wise, &amp; PayPal Ingestion</td>
                  <td className="p-4 text-center text-[var(--cf-text-muted)]">Manual Only</td>
                  <td className="p-4 text-center text-emerald-600">Universal CSV Auto-Detect</td>
                  <td className="p-4 text-center text-emerald-600">Universal CSV + Webhook</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Corporate Legal Profile (LLC, S-Corp)</td>
                  <td className="p-4 text-center text-[var(--cf-text-muted)]">—</td>
                  <td className="p-4 text-center text-emerald-600">Included</td>
                  <td className="p-4 text-center text-emerald-600">Multi-Entity</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="pt-8 max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cf-text)]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[var(--cf-text-muted)]">
              Have questions before upgrading? Here is everything you need to know.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                  >
                    <span className="font-serif text-base font-bold text-[var(--cf-text)]">
                      {faq.q}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-[var(--cf-surface-alt)] flex items-center justify-center shrink-0 text-[var(--cf-text-muted)]">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-[var(--cf-text-muted)] leading-relaxed border-t border-[var(--cf-border)]/50 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA Banner - High-Conversion Aurora Mesh Design */}
        <section className="relative p-8 sm:p-14 rounded-3xl overflow-hidden border border-emerald-500/30 shadow-[0_20px_80px_-15px_rgba(16,185,129,0.3)] text-white text-center space-y-6">
          {/* Layered Aurora Mesh & Radial Glows */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#04100E] via-[#0A2621] to-[#06151D]" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[550px] h-[300px] bg-emerald-500/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-[350px] h-[350px] bg-teal-500/15 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 -left-20 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          {/* Subtle Grid Texture */}
          <div 
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-medium border border-emerald-400/30 bg-emerald-500/15 text-emerald-300 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sovereign Financial Freedom • 20th Percentile Solvency</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to eliminate the <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
                Feast-or-Famine anxiety?
              </span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-emerald-100/80 leading-relaxed max-w-xl mx-auto font-sans">
              Join thousands of solo founders, consultants, and software engineers who run stress-free cash flow with mathematically guaranteed runway safety.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-[#06151D] bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-200 hover:from-white hover:to-emerald-100 transition-all shadow-[0_4px_25px_rgba(52,211,153,0.4)] hover:shadow-[0_6px_35px_rgba(52,211,153,0.6)] hover:scale-105 duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Launch Your Runway Free</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
              <Link
                href="/#faq"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium text-xs sm:text-sm transition-all backdrop-blur-sm hover:border-emerald-400/40 cursor-pointer"
              >
                Read Methodology Whitepaper
              </Link>
            </div>

            {/* Bottom trust badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono text-emerald-200/60">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Local-first encryption
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Instant setup in 2 minutes
              </span>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
