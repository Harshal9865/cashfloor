'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  User,
  Mail,
  Briefcase,
  Lock,
  LogOut,
  LayoutDashboard,
  ArrowLeft,
  Sparkles,
  Database,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import DashboardNav from '@/components/DashboardNav';
import { useAuth, DEMO_PERSONAS, DemoPersonaKey } from '@/lib/auth/AuthContext';

export default function AccountPage() {
  const { user, isAuthenticated, isPro, signOut, openAuthModal } = useAuth();

  const displayName = user?.name || user?.email?.split('@')[0] || 'Independent Pro';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300">
      <DashboardNav />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
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
            Account Management · CashFloor Pro
          </span>
        </div>

        {/* Profile Card Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 sm:p-8 rounded-2xl border relative overflow-hidden"
          style={{
            background: 'var(--cf-surface)',
            borderColor: 'var(--cf-border)',
            boxShadow: 'var(--cf-shadow-lg)',
          }}
        >
          {/* Subtle background glow */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-10"
            style={{ background: 'var(--cf-accent)' }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg shrink-0"
                style={{ background: 'linear-gradient(135deg, #2F6F62, #0f564a)' }}
              >
                {displayName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-2xl font-semibold tracking-tight" style={{ color: 'var(--cf-text)' }}>
                    {displayName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 border border-emerald-500/20">
                    <Sparkles className="w-3 h-3" />
                    Pro Tier
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--cf-text-muted)' }}>
                  {user?.email || 'Guest Explorer'}
                </p>
                <p className="text-xs font-mono mt-1 text-[#2F6F62]">
                  {user?.role || 'Senior Independent Consultant'}
                </p>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer"
                style={{
                  borderColor: 'var(--cf-border)',
                  color: 'var(--cf-caution)',
                  background: 'var(--cf-caution-bg)',
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-md"
                style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
              >
                <User className="w-4 h-4" />
                <span>Sign In to Unlock Pro</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Account Details & Plan Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan & Unlocked Features */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="p-6 rounded-2xl border space-y-4"
            style={{
              background: 'var(--cf-surface)',
              borderColor: 'var(--cf-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--cf-border)' }}>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#2F6F62]" />
                <h2 className="text-sm font-semibold" style={{ color: 'var(--cf-text)' }}>
                  Subscription &amp; Entitlements
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--cf-text)' }}>
                    20th-Percentile Survival Runway Calculator
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--cf-text-muted)' }}>
                    Conservative burn calculation with zero-income exhaustion countdown.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--cf-text)' }}>
                    Advanced Stress Testing Lab (Unlocked)
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--cf-text-muted)' }}>
                    Client loss scenarios, 90-day cash drought modeling, and tax drag simulation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--cf-text)' }}>
                    12-Month Detailed Double-Entry Ledger (Unlocked)
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--cf-text-muted)' }}>
                    Full inline spreadsheet editing, CSV paste import, and double-entry reconciliation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold" style={{ color: 'var(--cf-text)' }}>
                    Client Concentration &amp; Volatility Radar (Unlocked)
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--cf-text-muted)' }}>
                    Identifies dangerous client revenue concentration and cash volatility.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Privacy, Security & Data Sync */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="p-6 rounded-2xl border space-y-4"
            style={{
              background: 'var(--cf-surface)',
              borderColor: 'var(--cf-border)',
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--cf-border)' }}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2F6F62]" />
                <h2 className="text-sm font-semibold" style={{ color: 'var(--cf-text)' }}>
                  Data Privacy &amp; Storage
                </h2>
              </div>
              <span className="text-xs font-mono text-[var(--cf-text-faint)]">
                256-bit Encrypted
              </span>
            </div>

            <div className="space-y-3 text-xs leading-relaxed" style={{ color: 'var(--cf-text-muted)' }}>
              <p>
                <strong className="text-[var(--cf-text)]">Zero Bank Surveillance:</strong> CashFloor operates on
                pure mathematical modeling. We do not connect to your bank accounts, credit cards, or IRS portals.
              </p>
              <p>
                <strong className="text-[var(--cf-text)]">Dual-Layer Persistence:</strong> Your financial scenarios are
                mirrored to your device’s local browser storage for instantaneous offline responsiveness and synchronized
                with Supabase Cloud when logged in.
              </p>
              <div className="pt-2">
                <div
                  className="p-3 rounded-xl border flex items-center justify-between"
                  style={{ background: 'var(--cf-surface-alt)', borderColor: 'var(--cf-border)' }}
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#2F6F62]" />
                    <span className="font-semibold text-[var(--cf-text)]">Cloud &amp; Local Mirror</span>
                  </div>
                  <span className="font-mono text-emerald-600 font-semibold text-[11px]">Active</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Demo Persona Quick Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="p-6 rounded-2xl border space-y-4"
          style={{
            background: 'var(--cf-surface)',
            borderColor: 'var(--cf-border)',
          }}
        >
          <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--cf-border)' }}>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold" style={{ color: 'var(--cf-text)' }}>
                Switch Simulation Persona (Instant Testing)
              </h2>
            </div>
            <span className="text-xs font-mono text-[var(--cf-text-faint)]">
              1-Click Profiles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(DEMO_PERSONAS) as DemoPersonaKey[]).map((key) => {
              const p = DEMO_PERSONAS[key];
              const isCurrent = user?.email === p.email;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => openAuthModal(`Switching to ${p.name}`, 'demo')}
                  className="p-3.5 rounded-xl border text-left transition-all cursor-pointer group"
                  style={{
                    background: isCurrent ? 'var(--cf-accent-bg)' : 'var(--cf-surface-alt)',
                    borderColor: isCurrent ? 'var(--cf-accent)' : 'var(--cf-border)',
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold" style={{ color: 'var(--cf-text)' }}>
                      {p.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-emerald-600 font-bold">CURRENT</span>
                    )}
                  </div>
                  <p className="text-[11px] truncate text-[var(--cf-text-muted)]">{p.role}</p>
                  <p className="text-[10px] font-mono text-[#2F6F62] mt-1 font-semibold">
                    ${p.monthlyIncome.toLocaleString()}/mo · ${p.initialSavings.toLocaleString()} buffer
                  </p>
                </button>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
