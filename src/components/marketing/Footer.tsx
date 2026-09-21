import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--cf-bg-deep)] border-t border-[var(--cf-border)] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Social Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 group inline-flex w-max">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#2F6F62] rounded-lg opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-7 h-7 bg-gradient-to-br from-[#2F6F62] to-[#0f564a] rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-serif text-sm font-bold">C</span>
                </div>
              </div>
              <span className="text-[var(--cf-text)] font-serif text-xl tracking-tight font-medium">
                Cash<span className="text-[var(--cf-accent)]">Floor</span>
              </span>
            </Link>
            <p className="text-[var(--cf-text-muted)] text-sm max-w-sm leading-relaxed">
              The professional ledger for irregular income. We help freelancers, consultants, and independent professionals stop guessing and build certainty.
            </p>
            {/* Social Icons Placeholder */}
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--cf-surface)] border border-[var(--cf-border)] text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] hover:border-[var(--cf-accent)]/50 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--cf-surface)] border border-[var(--cf-border)] text-[var(--cf-text-muted)] hover:text-[var(--cf-accent)] hover:border-[var(--cf-accent)]/50 transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[var(--cf-text)] font-semibold text-sm tracking-wide uppercase">Product</h4>
            <Link href="/dashboard" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">Studio Dashboard</Link>
            <Link href="/#features" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">Features</Link>
            <Link href="/pricing" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">Pricing</Link>
            <Link href="/integrations" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">Integrations</Link>
          </div>

          {/* Resources Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[var(--cf-text)] font-semibold text-sm tracking-wide uppercase">Resources</h4>
            <Link href="/blog/the-20th-percentile-math" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">The 20th Percentile Rule</Link>
            <Link href="/blog" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">Blog</Link>
            <Link href="/#how-it-works" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">How it Works</Link>
            <Link href="/help" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">Help Center</Link>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[var(--cf-text)] font-semibold text-sm tracking-wide uppercase">Legal</h4>
            <Link href="/privacy" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">Terms of Service</Link>
            <Link href="/security" className="text-[var(--cf-text-muted)] text-sm hover:text-[var(--cf-accent-bright)] transition-colors">Security</Link>
          </div>

        </div>

        {/* Newsletter & Copyright Bar */}
        <div className="pt-8 border-t border-[var(--cf-border)] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[var(--cf-text-faint)] text-xs">
            &copy; {new Date().getFullYear()} CashFloor. All rights reserved. <br className="md:hidden" />
            <span className="hidden md:inline"> | </span> 
            Disclaimer: CashFloor is an educational simulation tool. It does not provide financial, tax, or legal advice.
          </p>
          
          <div className="w-full md:w-auto flex items-center gap-2">
            <input 
              type="email" 
              placeholder="Join our newsletter" 
              className="bg-[var(--cf-surface)] border border-[var(--cf-border)] rounded-full px-4 py-2 text-sm text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors w-full md:w-64"
            />
            <button className="bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] hover:text-white hover:bg-[var(--cf-accent)] hover:border-[var(--cf-accent)] px-4 py-2 rounded-full text-sm font-medium transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
