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

const navLinks = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Calculators', href: '/dashboard' },
  { label: 'Philosophy', href: '/blog/the-20th-percentile-math' },
];

function getInitials(nameOrEmail: string): string {
  if (!nameOrEmail) return 'CF';
  const clean = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
  const parts = clean.split(/[._\s-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const { user, isAuthenticated, loading, openAuthModal, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const displayName = user?.name || user?.email?.split('@')[0] || 'Independent Pro';
  const initials = getInitials(user?.name || user?.email || '');

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
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-[#2F6F62] rounded-lg opacity-25 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-7 h-7 bg-gradient-to-br from-[#2F6F62] to-[#0f564a] rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-serif text-sm font-bold">C</span>
            </div>
          </div>
          <span className="text-[var(--cf-text)] font-serif text-lg tracking-tight font-medium">
            Cash<span className="text-[var(--cf-accent)]">Floor</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isHash = link.href.includes('#');
            const isActive = !isHash && pathname === link.href;

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3.5 py-1.5 text-xs font-medium transition-colors duration-200 rounded-lg ${
                  isActive ? 'font-bold' : ''
                }`}
                style={{
                  color: isActive ? 'var(--cf-accent)' : 'var(--cf-text-muted)',
                  background: isActive ? 'var(--cf-accent-bg)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--cf-accent)';
                    e.currentTarget.style.background = 'var(--cf-accent-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--cf-text-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
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
                /* ── SIGNED IN: Responsive Avatar & Status Pill ── */
                <div className="relative" ref={avatarRef}>
                  <button
                    type="button"
                    onClick={() => setAvatarOpen(!avatarOpen)}
                    className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full text-xs font-medium transition-all border cursor-pointer group"
                    style={{
                      background: avatarOpen ? 'var(--cf-surface-alt)' : 'var(--cf-surface)',
                      borderColor: avatarOpen ? 'var(--cf-accent)' : 'var(--cf-border)',
                      color: 'var(--cf-text)',
                      boxShadow: 'var(--cf-shadow-sm)',
                    }}
                    aria-label="User account menu"
                  >
                    {/* Avatar circle with initials + online indicator */}
                    <div className="relative">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                      >
                        {initials}
                      </div>
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--cf-surface)] bg-emerald-500"
                        title="Active Session"
                      />
                    </div>

                    <span className="hidden sm:inline max-w-[110px] truncate text-xs font-semibold">
                      {displayName}
                    </span>

                    <span
                      className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-600 bg-emerald-500/10 border border-emerald-500/20"
                    >
                      PRO
                    </span>

                    <ChevronDown
                      className="w-3.5 h-3.5 transition-transform duration-200"
                      style={{
                        transform: avatarOpen ? 'rotate(180deg)' : 'none',
                        color: 'var(--cf-text-muted)',
                      }}
                    />
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {avatarOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden z-50"
                        style={{
                          background: 'var(--cf-surface)',
                          border: '1px solid var(--cf-border)',
                          boxShadow: 'var(--cf-shadow-xl)',
                        }}
                      >
                        {/* User Header */}
                        <div
                          className="p-4 border-b"
                          style={{ borderColor: 'var(--cf-border)', background: 'var(--cf-surface-alt)' }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md"
                              style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold truncate" style={{ color: 'var(--cf-text)' }}>
                                  {displayName}
                                </p>
                                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                                  PRO
                                </span>
                              </div>
                              <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--cf-text-muted)' }}>
                                {user.email}
                              </p>
                              <p className="text-[10px] font-mono truncate mt-0.5 text-[#2F6F62]">
                                {user.role || 'Senior Independent'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Actions */}
                        <div className="p-2 space-y-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setAvatarOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                            style={{ color: 'var(--cf-text)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cf-surface-alt)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#2F6F62]" />
                            <span>Launch Studio Dashboard</span>
                          </Link>

                          <Link
                            href="/account"
                            onClick={() => setAvatarOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                            style={{ color: 'var(--cf-text)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cf-surface-alt)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <User className="w-4 h-4" style={{ color: 'var(--cf-text-muted)' }} />
                            <span>Account &amp; Security</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setAvatarOpen(false);
                              openAuthModal('Switching to another freelance persona or account', 'demo');
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-left"
                            style={{ color: 'var(--cf-text)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cf-surface-alt)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span>Switch Demo Persona</span>
                          </button>
                        </div>

                        {/* Sign Out Section */}
                        <div className="p-2 border-t" style={{ borderColor: 'var(--cf-border)' }}>
                          <button
                            type="button"
                            onClick={async () => {
                              setAvatarOpen(false);
                              await signOut();
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer"
                            style={{ color: 'var(--cf-caution)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cf-caution-bg)')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl transition-colors cursor-pointer"
            style={{ color: 'var(--cf-text-muted)' }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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
            className="fixed inset-x-0 top-16 z-30 border-b backdrop-blur-xl md:hidden"
            style={{ background: 'var(--cf-nav-bg)', borderColor: 'var(--cf-border)' }}
          >
            <div className="px-5 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm rounded-xl transition-colors"
                  style={{ color: 'var(--cf-text)' }}
                >
                  {link.label}
                </Link>
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
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                      style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                    >
                      {initials}
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
