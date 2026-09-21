'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Database, RotateCcw, Cloud, User, RefreshCw,
  ChevronDown, LogOut, Share2, Check, Menu, X, Shield, ShieldCheck, Sparkles, FileText
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/lib/auth/AuthContext';
import CashFloorLogo from '@/components/CashFloorLogo';

interface DashboardNavProps {
  onResetData?: () => void;
  onLoadSample?: () => void;
  onExportCsv?: () => void;
  onOpenShareModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenSolvencyModal?: () => void;
  onOpenCalibrationWizard?: () => void;
  onOpenInvoiceModal?: () => void;
  syncStatus?: 'offline' | 'saving' | 'synced' | 'error';
  lastSavedAt?: string | null;
}

const NAV_SECTIONS = [
  { label: 'Runway', href: '/dashboard#runway' },
  { label: 'Timeline', href: '/dashboard#cash-flow' },
  { label: 'Daily Stream', href: '/daily' },
  { label: 'Ledger', href: '/dashboard#ledger-archive' },
];

export default function DashboardNav({
  onResetData,
  onLoadSample,
  onExportCsv,
  onOpenShareModal,
  onOpenAuthModal,
  onOpenSolvencyModal,
  onOpenCalibrationWizard,
  onOpenInvoiceModal,
  syncStatus = 'offline',
  lastSavedAt,
}: DashboardNavProps) {
  const { user, loading: authLoading, signOut, openAuthModal } = useAuth();
  const isAuthenticated = !!user;

  const handleAuthTrigger = () => {
    if (onOpenAuthModal) onOpenAuthModal();
    else openAuthModal();
  };

  // Get initials from email or name
  const getInitials = (nameOrEmail: string) => {
    if (!nameOrEmail) return 'U';
    const clean = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
    const parts = clean.split(/[._\s-]+/).filter(Boolean);
    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : clean.slice(0, 2).toUpperCase();
  };
  const displayName = user?.name || user?.email?.split('@')[0] || 'Independent Pro';
  const initials = getInitials(user?.name || user?.email || '');

  const [activeSection, setActiveSection] = useState('');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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

  // Active section detection
  useEffect(() => {
    if (pathname !== '/dashboard') {
      setActiveSection('');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    NAV_SECTIONS.forEach(({ href }) => {
      if (href.includes('#')) {
        const id = href.split('#')[1];
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, [pathname]);

  const syncColor =
    syncStatus === 'synced' ? 'var(--cf-accent)' :
    syncStatus === 'saving' ? 'var(--cf-warm)' :
    syncStatus === 'error' ? 'var(--cf-caution)' : 'var(--cf-accent)';

  const syncLabel =
    syncStatus === 'synced' ? 'Cloud Synced' :
    syncStatus === 'saving' ? 'Saving...' :
    syncStatus === 'error' ? 'Sync Error' : 'Private Vault';

  return (
    <>
      <div className="h-20 shrink-0 w-full" /> {/* Spacer for fixed nav */}
      <header
        className={`fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-500`}
      >
        <div
          className="pointer-events-auto flex items-center justify-between w-full max-w-4xl px-3 h-12 rounded-2xl border transition-shadow duration-300"
          style={{
            background: 'var(--cf-nav-bg)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderColor: 'var(--cf-nav-border)',
            boxShadow: scrolled ? 'var(--cf-shadow-md)' : 'var(--cf-shadow-sm)',
          }}
        >

          {/* ── Mobile Hamburger & Logo ── */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 rounded-lg transition-colors cursor-pointer"
              style={{ color: 'var(--cf-text-muted)', background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--cf-surface)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Logo */}
            <CashFloorLogo size="sm" />
          </div>

          {/* ── Center Tab Nav (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-0.5 rounded-xl p-1 border"
            style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}>
            {NAV_SECTIONS.map((s) => {
              const isHash = s.href.includes('#');
              const isActiveHash = isHash && activeSection === s.href.split('#')[1] && pathname === '/dashboard';
              const isActivePath = !isHash && pathname === s.href;
              const isActive = isActiveHash || isActivePath;

              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className="relative px-4 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
                  style={{ color: isActive ? 'var(--cf-text)' : 'var(--cf-text-muted)' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'var(--cf-surface-alt)', boxShadow: 'var(--cf-shadow-sm)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative">{s.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            {/* Sync / Vault Status pill */}
            <Link
              href="/account"
              title={
                syncStatus === 'synced'
                  ? 'All financial models backed up to encrypted cloud'
                  : 'Zero Bank Surveillance: Operating in 100% Private Local-First Vault'
              }
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all hover:border-[var(--cf-accent)]"
              style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)', color: syncColor }}
            >
              {syncStatus === 'saving' ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : syncStatus === 'synced' ? (
                <Check className="w-3 h-3" />
              ) : (
                <Shield className="w-3 h-3 text-[var(--cf-accent)]" />
              )}
              <span>{syncLabel}</span>
            </Link>

            {/* Unauthenticated: Export / Share in main nav */}
            {!isAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={onExportCsv}
                  title="Export CSV"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer"
                  style={{ color: 'var(--cf-text-muted)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--cf-text)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--cf-surface)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--cf-text-muted)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenSolvencyModal}
                  title="CPA & Lease Solvency Report (PDF)"
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border border-[var(--cf-border)] hover:border-[var(--cf-accent)]"
                  style={{ color: 'var(--cf-text-muted)', background: 'var(--cf-surface)' }}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Audit PDF</span>
                </button>
                {onOpenInvoiceModal && (
                  <button
                    type="button"
                    onClick={onOpenInvoiceModal}
                    title="Client Invoice Studio (PDF)"
                    className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border border-[var(--cf-border)] hover:border-[var(--cf-accent)]"
                    style={{ color: 'var(--cf-text-muted)', background: 'var(--cf-surface)' }}
                  >
                    <FileText className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
                    <span>Invoice PDF</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenShareModal}
                  title="Share"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer"
                  style={{ color: 'var(--cf-text-muted)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--cf-accent)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--cf-accent-bg)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--cf-text-muted)';
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </>
            )}
            
            <ThemeToggle className="hidden sm:flex" />

            {/* Auth / Avatar */}
            {authLoading ? (
              <div
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]/40 animate-pulse"
                style={{ width: '84px', height: '32px' }}
              />
            ) : isAuthenticated ? (
              <div ref={avatarRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full transition-all cursor-pointer border"
                  style={{
                    border: '1px solid var(--cf-border)',
                    background: avatarOpen ? 'var(--cf-surface-alt)' : 'transparent',
                  }}
                  title="Account"
                >
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-[#2F6F62] to-[#0f564a] flex items-center justify-center shadow-sm text-white text-[11px] font-bold shrink-0">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[var(--cf-surface)] bg-emerald-500"
                      title="Online"
                    />
                  </div>
                  <span className="text-xs font-semibold hidden md:block max-w-[100px] truncate" style={{ color: 'var(--cf-text)' }}>
                    {displayName}
                  </span>
                  <span className="hidden md:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase text-emerald-600 bg-emerald-500/10 border border-emerald-500/20">
                    PRO
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--cf-text-muted)] transition-transform" style={{ transform: avatarOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                <AnimatePresence>
                  {avatarOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 w-60 rounded-2xl overflow-hidden z-50"
                      style={{
                        background: 'var(--cf-surface)',
                        border: '1px solid var(--cf-border)',
                        boxShadow: 'var(--cf-shadow-xl)',
                      }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--cf-border)', background: 'var(--cf-surface-alt)' }}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-[#2F6F62] to-[#0f564a] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                            {user?.avatar ? (
                              <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold truncate" style={{ color: 'var(--cf-text)' }}>{displayName}</p>
                              <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-1 rounded">PRO</span>
                            </div>
                            <p className="text-[11px] truncate" style={{ color: 'var(--cf-text-faint)' }}>{user?.email}</p>
                            <p className="text-[10px] font-mono truncate text-[#2F6F62]">{user?.role || 'Senior Independent'}</p>
                          </div>
                        </div>
                        {lastSavedAt && (
                          <p className="text-[10px] mt-2 font-mono" style={{ color: 'var(--cf-text-faint)' }}>Auto-synced at {lastSavedAt}</p>
                        )}
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <button onClick={onLoadSample}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer text-left">
                          <Database className="w-3.5 h-3.5 text-[#2F6F62]" /> Load Sample Ledger
                        </button>
                        <button onClick={() => { setAvatarOpen(false); openAuthModal('Switching to another freelance persona or account', 'demo'); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer text-left">
                          <RotateCcw className="w-3.5 h-3.5 text-amber-500" /> Switch Demo Persona
                        </button>
                        <Link href="/account" onClick={() => setAvatarOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer">
                          <User className="w-3.5 h-3.5 text-[#2F6F62]" /> Account &amp; Security
                        </Link>
                        <Link href="/subscription" onClick={() => setAvatarOpen(false)}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Subscription &amp; Billing
                        </Link>
                        <button onClick={() => { setAvatarOpen(false); onOpenSolvencyModal?.(); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer text-left">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> CPA &amp; Lease Solvency Audit (PDF)
                        </button>
                        {onOpenInvoiceModal && (
                          <button onClick={() => { setAvatarOpen(false); onOpenInvoiceModal(); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer text-left">
                            <FileText className="w-3.5 h-3.5 text-[var(--cf-accent)]" /> Client Invoice Studio (PDF)
                          </button>
                        )}
                        <button onClick={() => { setAvatarOpen(false); onOpenCalibrationWizard?.(); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer text-left">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 60s Calibration Wizard
                        </button>
                        
                        <div className="my-1 border-t" style={{ borderColor: 'var(--cf-border)' }}></div>

                        <button onClick={() => { onExportCsv?.(); setAvatarOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer text-left">
                          <Download className="w-3.5 h-3.5" /> Export Data to CSV
                        </button>
                        <button onClick={() => { onOpenShareModal?.(); setAvatarOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer text-left">
                          <Share2 className="w-3.5 h-3.5" /> Share Report
                        </button>
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <span className="w-3.5 h-3.5 flex items-center justify-center">🌓</span> Theme
                          </div>
                          <ThemeToggle />
                        </div>

                        <div className="my-1 border-t" style={{ borderColor: 'var(--cf-border)' }}></div>
                        <button onClick={onResetData}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-caution)] hover:bg-[var(--cf-caution-bg)] transition-colors cursor-pointer text-left">
                          <RotateCcw className="w-3.5 h-3.5" /> Reset Ledger
                        </button>
                      </div>
                      <div className="p-1.5 border-t" style={{ borderColor: 'var(--cf-border)' }}>
                        <button
                          onClick={async () => { setAvatarOpen(false); await signOut(); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                          style={{ color: 'var(--cf-caution)' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--cf-caution-bg)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAuthTrigger}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all cursor-pointer shadow-sm hover:shadow"
                style={{
                  background: 'linear-gradient(135deg, #2F6F62, #1a4f45)',
                }}
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden sticky top-14 z-30 overflow-hidden"
            style={{
              background: 'var(--cf-nav-bg)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--cf-nav-border)',
            }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_SECTIONS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm transition-colors"
                  style={{ color: 'var(--cf-text-muted)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cf-text)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'var(--cf-surface)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = 'var(--cf-text-muted)';
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                  }}
                >
                  {s.label}
                </a>
              ))}
              <div className="px-3 py-2 border-t mt-1" style={{ borderColor: 'var(--cf-border)' }}>
                <ThemeToggle />
              </div>
              {isAuthenticated && user ? (
                <div className="p-3 rounded-xl border mt-2 flex items-center justify-between"
                  style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#2F6F62] to-[#0f564a] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: 'var(--cf-text)' }}>{displayName}</p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--cf-text-faint)' }}>{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={async () => { setMobileOpen(false); await signOut(); }}
                    className="p-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                    style={{ color: 'var(--cf-caution)' }}
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); handleAuthTrigger(); }}
                  className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                >
                  <User className="w-3.5 h-3.5" /> Sign In to Pro Suite
                </button>
              )}
              <div className="border-t mt-2 pt-2 flex flex-col gap-2" style={{ borderColor: 'var(--cf-border)' }}>
                {onOpenInvoiceModal && (
                  <button onClick={() => { onOpenInvoiceModal(); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold cursor-pointer border"
                    style={{ color: 'var(--cf-accent)', borderColor: 'var(--cf-accent)', background: 'var(--cf-accent-bg)' }}>
                    <FileText className="w-3.5 h-3.5" /> Client Invoice Studio (PDF)
                  </button>
                )}
                <div className="flex gap-2">
                  <button onClick={() => { onExportCsv?.(); setMobileOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs cursor-pointer border"
                    style={{ color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border)', background: 'var(--cf-surface)' }}>
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                  <button onClick={() => { onLoadSample?.(); setMobileOpen(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs cursor-pointer border"
                    style={{ color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border)', background: 'var(--cf-surface)' }}>
                    <Database className="w-3.5 h-3.5" /> Sample
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
