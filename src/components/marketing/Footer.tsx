'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CashFloorLogo from '@/components/CashFloorLogo';
import { Check, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="bg-[var(--cf-bg-deep)] border-t border-[var(--cf-border)] pt-20 pb-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Social Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <CashFloorLogo size="lg" />
            <p className="text-[var(--cf-text-muted)] text-sm max-w-sm leading-relaxed font-sans">
              The professional double-entry ledger for irregular income. We help consultants, contractors, and solo operators stop guessing and build mathematical certainty.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-1">
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--cf-surface)] border border-[var(--cf-border)] text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] hover:border-[var(--cf-accent)]/50 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--cf-surface)] border border-[var(--cf-border)] text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] hover:border-[var(--cf-accent)]/50 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              <a 
                href="https://github.com/Harshal9865/cashfloor" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub Repository"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--cf-surface)] border border-[var(--cf-border)] text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] hover:border-[var(--cf-accent)]/50 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-3 font-sans">
            <h4 className="text-[var(--cf-text)] font-semibold text-xs tracking-wider uppercase">Product</h4>
            <Link href="/dashboard" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">Studio Dashboard</Link>
            <Link href="/#features" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">Risk Simulator</Link>
            <Link href="/pricing" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">Pricing &amp; Vaults</Link>
            <Link href="/integrations" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">Bank &amp; CSV Integrations</Link>
            <Link href="/daily" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">Daily Cash Stream</Link>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-3 font-sans">
            <h4 className="text-[var(--cf-text)] font-semibold text-xs tracking-wider uppercase">Research &amp; Guides</h4>
            <Link href="/blog/the-20th-percentile-math" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">The 20th Percentile Rule</Link>
            <Link href="/blog/five-pillar-partitioning" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">The 5-Pillar Partition</Link>
            <Link href="/blog/fx-volatility-haircuts" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">Cross-Border FX Buffers</Link>
            <Link href="/blog" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">The CashFloor Journal</Link>
            <Link href="/help" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">Help Center &amp; FAQs</Link>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-3 font-sans">
            <h4 className="text-[var(--cf-text)] font-semibold text-xs tracking-wider uppercase">Compliance</h4>
            <Link href="/privacy" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">Zero-Surveillance Privacy</Link>
            <Link href="/terms" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">Terms of Service</Link>
            <Link href="/security" className="text-[var(--cf-text-muted)] text-xs hover:text-[var(--cf-accent)] transition-colors">Security Architecture</Link>
          </div>

        </div>

        {/* Newsletter & Copyright Bar */}
        <div className="pt-8 border-t border-[var(--cf-border)] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[var(--cf-text-faint)] text-xs leading-relaxed text-center md:text-left">
            &copy; {new Date().getFullYear()} CashFloor Technologies. All rights reserved. <br className="hidden sm:inline" />
            Disclaimer: CashFloor provides mathematical scenario simulations for educational planning and does not offer certified tax, legal, or investment advice.
          </p>
          
          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>✓ Subscribed to CashFloor Research</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Join quantitative research notes..." 
                  className="bg-[var(--cf-surface)] border border-[var(--cf-border)] rounded-full px-4 py-2 text-xs text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors w-full sm:w-64"
                />
                <button 
                  type="submit"
                  className="bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] hover:text-white hover:bg-[var(--cf-accent)] hover:border-[var(--cf-accent)] px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
