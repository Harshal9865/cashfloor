'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, X, Shield, Lock, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const PRICING_PLANS = [
  {
    name: 'Free Vault',
    price: '$0',
    duration: 'forever',
    description: 'Basic local-first runway calculator for new freelancers.',
    features: [
      '3-Month Runway Forecast',
      'Local Browser Storage Only',
      'Basic Tax Escrow Calculator',
      'DSO Tracking',
    ],
    notIncluded: [
      '12-Month Double-Entry Ledger',
      'End-to-End Encrypted Cloud Sync',
      'Monte Carlo Risk Lab',
      'Client Concentration Radar',
    ],
    cta: 'Current Plan',
    highlight: false,
    buttonStyle: 'bg-[var(--cf-surface-alt)] text-[var(--cf-text)] border border-[var(--cf-border)] cursor-default',
  },
  {
    name: 'Pro Sentinel',
    price: '$12',
    duration: 'per month',
    description: 'Full financial peace of mind with risk modeling and cloud sync.',
    features: [
      '12-Month Double-Entry Ledger',
      'End-to-End Encrypted Cloud Sync',
      'Monte Carlo Risk Lab (10k iterations)',
      'Client Concentration Radar',
      'Unlimited Scenario Planning',
      'Export to CSV & Accounting Systems',
      'Priority Email Support',
    ],
    notIncluded: [],
    cta: 'Upgrade to Pro',
    highlight: true,
    buttonStyle: 'bg-[var(--cf-accent)] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all',
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300">
      {/* Nav */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--cf-border)] bg-[var(--cf-nav-bg)] backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 group">
           <div className="relative w-8 h-8 bg-gradient-to-br from-[#16232B] to-[#2F6F62] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-[0_0_12px_rgba(47,111,98,0.4)] transition-shadow">
             <span className="text-white font-serif text-sm font-bold">C</span>
           </div>
           <span className="font-serif text-lg tracking-tight group-hover:text-[var(--cf-accent)] transition-colors hidden sm:block">CashFloor</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/dashboard" className="px-4 py-2 rounded-lg bg-[var(--cf-surface-alt)] text-sm font-medium hover:bg-[var(--cf-border)] transition-colors">
            Back to Vault
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-mono text-xs font-semibold tracking-wider uppercase"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Bank-Grade Encryption</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif tracking-tight"
          >
            Upgrade your financial armor.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--cf-text-muted)] text-lg leading-relaxed"
          >
            Unlock the 12-month ledger, cloud sync, and Monte Carlo risk lab to ensure you never run out of cash.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className={`relative rounded-3xl p-8 border ${
                plan.highlight 
                  ? 'border-[var(--cf-accent)] shadow-2xl bg-[var(--cf-surface)]' 
                  : 'border-[var(--cf-border)] bg-[var(--cf-surface-alt)]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--cf-accent)] text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h2 className="text-2xl font-serif mb-2">{plan.name}</h2>
                <p className="text-sm text-[var(--cf-text-muted)] h-10">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl font-serif tracking-tight">{plan.price}</span>
                <span className="text-[var(--cf-text-muted)] font-mono text-sm">/{plan.duration}</span>
              </div>

              <button className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-8 ${plan.buttonStyle}`}>
                {plan.cta}
                {plan.highlight && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="space-y-4">
                {plan.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map(feature => (
                  <div key={feature} className="flex items-start gap-3 opacity-50 grayscale">
                    <X className="w-5 h-5 text-[var(--cf-text-muted)] shrink-0" />
                    <span className="text-sm text-[var(--cf-text-muted)]">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ or Trust Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24 grid md:grid-cols-3 gap-8 text-center border-t border-[var(--cf-border)] pt-16 max-w-4xl mx-auto"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-[var(--cf-accent)]" />
            </div>
            <h3 className="font-serif text-lg">Bank-Grade Security</h3>
            <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
              Your financial data is encrypted at rest using AES-256 and protected by strict Row Level Security (RLS) policies.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-6 h-6 text-[var(--cf-accent)]" />
            </div>
            <h3 className="font-serif text-lg">Real-Time Cloud Sync</h3>
            <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
              Seamlessly sync your ledgers across your phone, tablet, and desktop securely.
            </p>
          </div>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-[var(--cf-accent)]" />
            </div>
            <h3 className="font-serif text-lg">Cancel Anytime</h3>
            <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
              No locked contracts. If you cancel, you simply revert to the local-only free vault.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
