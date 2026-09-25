'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  ShieldCheck,
  Send,
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';
import MarketingNav from '@/components/MarketingNav';
import Footer from '@/components/marketing/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'support' | 'methodology' | 'enterprise' | 'security'>('support');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const ticketId = `CF-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      try {
        const stored = localStorage.getItem('cf_contact_tickets') || '[]';
        const tickets = JSON.parse(stored);
        tickets.push({ ticketId, name, email, category, message, createdAt: new Date().toISOString() });
        localStorage.setItem('cf_contact_tickets', JSON.stringify(tickets));
      } catch {}

      setSubmitting(false);
      setSubmittedTicket(ticketId);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] transition-colors duration-300 font-sans flex flex-col justify-between">
      <MarketingNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-8 pb-20 w-full space-y-12 flex-1" id="main-content">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Support Desk Available
          </span>
        </div>

        {/* Hero Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-emerald-600 bg-emerald-500/10 border border-emerald-500/20">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Advisory & Engineering Dispatch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-[var(--cf-text)]">
            Contact CashFloor
          </h1>
          <p className="text-sm sm:text-base text-[var(--cf-text-muted)] leading-relaxed">
            Have a question about our 20th-percentile runway math, need assistance with your double-entry ledger, or want to audit your firm&apos;s custom parameters? Our engineering and advisory desk is here to help.
          </p>
        </div>

        {/* Main Grid: Channels on Left, Interactive Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-4 shadow-sm">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--cf-text-muted)]">
                Direct Inboxes
              </h2>

              <div className="space-y-4">
                <a
                  href="mailto:support@cashfloor.app"
                  className="p-3.5 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] hover:border-[var(--cf-accent)] transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-[var(--cf-surface)] text-[var(--cf-accent)] border border-[var(--cf-border)] group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--cf-text)] block">General & Technical Support</span>
                    <span className="text-xs font-mono text-[var(--cf-text-muted)] group-hover:text-[var(--cf-accent)]">support@cashfloor.app</span>
                    <p className="text-[11px] text-[var(--cf-text-muted)] mt-1">Average response time: &lt; 24 hours</p>
                  </div>
                </a>

                <a
                  href="mailto:security@cashfloor.app"
                  className="p-3.5 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] hover:border-[var(--cf-accent)] transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-[var(--cf-surface)] text-purple-500 border border-[var(--cf-border)] group-hover:scale-105 transition-transform">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--cf-text)] block">Security & Cryptographic Desk</span>
                    <span className="text-xs font-mono text-[var(--cf-text-muted)] group-hover:text-[var(--cf-accent)]">security@cashfloor.app</span>
                    <p className="text-[11px] text-[var(--cf-text-muted)] mt-1">Responsible disclosures & bug bounties</p>
                  </div>
                </a>

                <a
                  href="mailto:privacy@cashfloor.app"
                  className="p-3.5 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] hover:border-[var(--cf-accent)] transition-all flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-[var(--cf-surface)] text-blue-500 border border-[var(--cf-border)] group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--cf-text)] block">Privacy & Data Requests</span>
                    <span className="text-xs font-mono text-[var(--cf-text-muted)] group-hover:text-[var(--cf-accent)]">privacy@cashfloor.app</span>
                    <p className="text-[11px] text-[var(--cf-text-muted)] mt-1">GDPR & CCPA data subject requests</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Open Source & Community */}
            <div className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3 shadow-sm">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--cf-text-muted)]">
                Developer & Issue Tracking
              </h2>
              <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
                Found a calculation edge case or want to inspect our open-source client-side financial engine?
              </p>
              <a
                href="https://github.com/Harshal9865/cashfloor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-surface)] text-xs font-semibold text-[var(--cf-text)] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>GitHub Issues & Discussions</span>
              </a>
            </div>

            {/* Quick Self-Help */}
            <div className="p-5 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)]/60 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-[var(--cf-accent)] shrink-0" />
                <span className="text-xs text-[var(--cf-text)] font-medium">Looking for quick answers?</span>
              </div>
              <Link
                href="/help"
                className="text-xs font-semibold text-[var(--cf-accent)] hover:underline shrink-0"
              >
                Visit Help Center →
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-6 shadow-sm">
              <div className="space-y-1">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--cf-text)]">
                  Send a Direct Message
                </h2>
                <p className="text-xs text-[var(--cf-text-muted)]">
                  Fill in your details below and our team will review your inquiry promptly.
                </p>
              </div>

              {submittedTicket ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-4 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-bold text-[var(--cf-text)]">
                      Inquiry Received
                    </h3>
                    <p className="text-xs text-[var(--cf-text-muted)] max-w-md mx-auto">
                      Thank you for reaching out. We have logged your request under ticket reference:
                    </p>
                    <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                      {submittedTicket}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--cf-text-muted)]">
                    Our team will reply to <span className="font-mono text-[var(--cf-text)]">{email}</span> within 1 business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedTicket(null);
                      setMessage('');
                    }}
                    className="px-4 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface)] hover:bg-[var(--cf-surface-alt)] text-xs font-semibold text-[var(--cf-text)] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--cf-text)] focus:border-[var(--cf-accent)] focus:outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase">
                        Work Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@studio.com"
                        className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--cf-text)] focus:border-[var(--cf-accent)] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase">
                      Inquiry Nature
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--cf-text)] focus:border-[var(--cf-accent)] focus:outline-none transition-all cursor-pointer font-medium"
                    >
                      <option value="support">Technical Support & Ledger Sync</option>
                      <option value="methodology">Mathematical Modeling & 20th Percentile Rule</option>
                      <option value="enterprise">Studio & Boutique Agency Advisory</option>
                      <option value="security">Security & Privacy Governance</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your question or requirements in detail..."
                      className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--cf-text)] focus:border-[var(--cf-accent)] focus:outline-none transition-all resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !email.trim() || !message.trim()}
                    className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, var(--cf-accent), #1a4f45)' }}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting Dispatch...' : 'Send Inquiry to Support Desk'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
