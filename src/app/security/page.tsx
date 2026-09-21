'use client';

import React from 'react';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';
import Link from 'next/link';
import { Shield, Lock, Server, CheckCircle2, Key, ArrowRight, EyeOff, ShieldCheck, Database } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[var(--cf-bg)] flex flex-col font-sans transition-colors duration-300">
      <MarketingNav />
      
      <main className="flex-1 flex flex-col items-center justify-start pt-32 pb-24 px-4 sm:px-6 md:px-8 relative z-10 overflow-hidden">
        {/* Ambient background glow */}
        <div 
          className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[140px] opacity-15 pointer-events-none" 
          style={{ background: 'radial-gradient(circle, var(--cf-accent) 0%, transparent 70%)' }} 
        />

        <div className="w-full max-w-5xl mx-auto space-y-16 relative z-10">
          
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero-Compromise Security Architecture</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[var(--cf-text)]"
            >
              Bank-Grade Security. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--cf-accent)] to-emerald-500">
                Zero Surveillance.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-base sm:text-lg text-[var(--cf-text-muted)] max-w-2xl mx-auto leading-relaxed font-sans"
            >
              Your financial records are your sovereign property. CashFloor is designed from the ground up so your calculations run locally in your browser with zero data harvesting.
            </motion.p>
          </div>

          {/* Core Guarantees Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <SecurityCard 
              icon={<EyeOff className="w-6 h-6 text-emerald-600" />}
              title="Zero Plaid / Bank Ingestion"
              description="We never ask for your online banking passwords, account credentials, or access tokens. You paste clean values or import standard CSV statements."
            />
            <SecurityCard 
              icon={<Database className="w-6 h-6 text-emerald-600" />}
              title="Local-First Browser Execution"
              description="Calculations happen in your device's memory via WebAssembly and React state. Your financial models function even with zero internet connection."
            />
            <SecurityCard 
              icon={<Lock className="w-6 h-6 text-emerald-600" />}
              title="AES-256 &amp; TLS 1.3 Encryption"
              description="For Pro subscribers with cloud backup enabled, data is encrypted in transit using TLS 1.3 and stored at rest using industry-grade AES-256."
            />
            <SecurityCard 
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
              title="PostgreSQL Row-Level Security (RLS)"
              description="Your cloud records are isolated by database-enforced cryptographic security policies. Only your authenticated user UUID can access your ledger."
            />
          </motion.div>

          {/* Interactive Safe-Harbor CTA */}
          <div className="p-8 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-5 text-center shadow-xl relative overflow-hidden">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--cf-text)]">
              Experience 100% Private Financial Clarity
            </h3>
            <p className="text-sm text-[var(--cf-text-muted)] max-w-xl mx-auto leading-relaxed">
              Launch CashFloor Studio to model your freelance cash floor, tax escrow, and runway horizon without giving up your privacy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white transition-all shadow-lg hover:opacity-95"
                style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
              >
                <span>Launch Studio Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-all"
              >
                <span>Read Full Privacy Policy</span>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function SecurityCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-7 rounded-3xl bg-[var(--cf-surface)] border border-[var(--cf-border)] flex flex-col gap-4 shadow-sm hover:shadow-xl hover:border-[var(--cf-accent)]/50 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-2xl bg-[var(--cf-surface-alt)] flex items-center justify-center border border-[var(--cf-border-soft)] group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-serif font-bold text-[var(--cf-text)] group-hover:text-[var(--cf-accent)] transition-colors">
        {title}
      </h3>
      <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
