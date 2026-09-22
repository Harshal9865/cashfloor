'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  X,
  Menu,
  LogOut,
  LayoutDashboard,
  User,
  Shield,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/lib/auth/AuthContext';
import ProfileDropdown from '@/components/nav/ProfileDropdown';
import CashFloorLogo from '@/components/CashFloorLogo';

const navLinks = [
  {
    label: 'Product',
    items: [
      { label: 'Financial Dashboard', href: '/dashboard', desc: 'Daily solvency briefing & action center' },
      { label: 'Runway Studio', href: '/studio', desc: 'Interactive ledger, P20 floor & stress tests' },
      { label: 'Daily Cash Flow', href: '/daily', desc: 'Day-by-day cash flow & lag model' },
      { label: 'Connected Accounts', href: '/integrations', desc: 'Connect payment feeds & files' },
      { label: 'Core Features', href: '/#features', desc: 'Core risk & cash flow tools' }
    ]
  },
  { label: 'Pricing', href: '/pricing' },
  {
    label: 'Resources',
    items: [
      { label: 'Why CashFloor', href: '/about', desc: 'The Sovereign Freelancer Manifesto' },
      { label: 'Calculation Math', href: '/blog/the-20th-percentile-math', desc: '20th-percentile math & 5 pillars' },
      { label: 'Data Privacy & Security', href: '/security', desc: 'Zero-bank-surveillance architecture' },
      { label: 'Financial Guides', href: '/blog', desc: 'Freelance financial playbooks' },
      { label: 'How It Works', href: '/#how-it-works', desc: 'Step-by-step operating guide' }
    ]
  }
];

export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const { user, isAuthenticated, loading, openAuthModal, signOut } = useAuth();

  const displayName = user?.name || user?.email?.split('@')[0] || 'Independent Pro';
  const getInitials = (nameOrEmail?: string) => {
    if (!nameOrEmail) return 'CF';
    const clean = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
    const parts = clean.split(/[._\s-]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return clean.slice(0, 2).toUpperCase();
  };
  const initials = getInitials(user?.name || user?.email);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b'
          : 'bg-transparent'
      }`}
      style={
        scrolled
          ? {
              background: 'var(--cf-nav-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderColor: 'var(--cf-border)',
              boxShadow: 'var(--cf-shadow-md)',
            }
          : {
              background: 'transparent',
            }
      }
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -ml-2 rounded-xl transition-colors cursor-pointer"
            style={{ color: 'var(--cf-text-muted)' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <CashFloorLogo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            if (link.items) {
              return (
                <div key={link.label} className="relative group px-1 py-4">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors rounded-lg hover:bg-[var(--cf-surface-alt)]">
                    {link.label}
                    <ChevronDown className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute top-full left-0 mt-0 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="p-2 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-2xl backdrop-blur-xl flex flex-col gap-1">
                      {link.items.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex flex-col px-3 py-2 rounded-xl hover:bg-[var(--cf-surface-alt)] transition-colors"
                        >
                          <span className="text-[var(--cf-text)] text-sm font-medium">{item.label}</span>
                          <span className="text-[var(--cf-text-muted)] text-[10px]">{item.desc}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href!}
                className="px-3.5 py-1.5 text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors rounded-lg hover:bg-[var(--cf-surface-alt)]"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:flex" />

          {isAuthenticated && user ? (
            <ProfileDropdown align="right" />
          ) : (
            /* ── SIGNED OUT: Sleek Sign In + Try Free CTA ── */
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => openAuthModal()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all border cursor-pointer"
                style={{
                  background: 'var(--cf-surface)',
                  borderColor: 'var(--cf-border)',
                  color: 'var(--cf-text)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cf-accent)';
                  e.currentTarget.style.background = 'var(--cf-surface-alt)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--cf-border)';
                  e.currentTarget.style.background = 'var(--cf-surface)';
                }}
              >
                <User className="w-3.5 h-3.5" style={{ color: 'var(--cf-accent)' }} />
                <span>Sign In</span>
              </button>

              <Link
                href="/dashboard"
                className="relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold overflow-hidden group text-white shadow-md transition-all hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #2F6F62, #1a4f45)',
                }}
              >
                <span>Try Free</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-30 border-b md:hidden shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto"
            style={{ background: 'var(--cf-bg)', borderColor: 'var(--cf-border)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1.5 pb-8">
              {navLinks.map((link) => (
                <div key={link.label} className="flex flex-col gap-1">
                  {link.items ? (
                    <>
                      <div className="px-3 py-2 text-xs font-bold text-[var(--cf-text-faint)] uppercase tracking-wider">
                        {link.label}
                      </div>
                      {link.items.map(item => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="px-4 py-2 text-sm rounded-xl transition-colors pl-6"
                          style={{ color: 'var(--cf-text)' }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={link.href!}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2 text-sm font-semibold rounded-xl transition-colors"
                      style={{ color: 'var(--cf-text)' }}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between px-3 py-2 border-t pt-3" style={{ borderColor: 'var(--cf-border)' }}>
                <span className="text-xs" style={{ color: 'var(--cf-text-muted)' }}>Theme</span>
                <ThemeToggle />
              </div>

              {isAuthenticated && user ? (
                <div
                  className="p-3 rounded-2xl border space-y-3 mt-1"
                  style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--cf-text)' }}>
                        {displayName}
                      </p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--cf-text-muted)' }}>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        setMobileOpen(false);
                        await signOut();
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border cursor-pointer"
                      style={{
                        borderColor: 'var(--cf-border)',
                        color: 'var(--cf-caution)',
                        background: 'var(--cf-caution-bg)',
                      }}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: 'var(--cf-border)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      openAuthModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border"
                    style={{
                      background: 'var(--cf-surface)',
                      borderColor: 'var(--cf-border)',
                      color: 'var(--cf-text)',
                    }}
                  >
                    <User className="w-3.5 h-3.5 text-[#2F6F62]" />
                    Sign In
                  </button>

                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                  >
                    Try Free <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
