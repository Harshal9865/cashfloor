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
import ProfileDropdown from '@/components/nav/ProfileDropdown';

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
  { label: 'Financial Dashboard', href: '/dashboard' },
  { label: 'Runway Studio', href: '/studio' },
  { label: 'Daily Cash Flow', href: '/daily' },
  { label: 'Connected Accounts', href: '/integrations' },
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

  // Get initials from email or name for mobile drawer
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

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
      <div className="h-24 shrink-0 w-full" /> {/* Spacer for fixed nav */}
      <header
        className={`fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-500`}
      >
        <div
          className="pointer-events-auto flex items-center justify-between w-full max-w-7xl px-5 h-16 min-h-[64px] max-h-[64px] rounded-2xl border transition-all duration-300"
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

          {/* ── Center Route Nav (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-1 rounded-xl p-1 border shrink-0 whitespace-nowrap"
            style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}>
            {NAV_SECTIONS.map((s) => {
              const isActive = pathname === s.href;

              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className="relative flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200"
                  style={{ color: isActive ? 'var(--cf-text)' : 'var(--cf-text-muted)' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: 'var(--cf-surface-alt)', border: '1px solid var(--cf-border)' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 select-none whitespace-nowrap">{s.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
            
            {/* Sync Status Badge */}
            <div 
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border whitespace-nowrap shrink-0"
              style={{ 
                borderColor: 'var(--cf-border-soft)',
                background: 'var(--cf-surface-alt)',
                color: syncColor
              }}
              title={syncStatus === 'synced' ? 'All changes saved to PostgreSQL with RLS' : 'Saved in local browser memory'}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: syncColor }} />
              <span className="font-medium whitespace-nowrap">{syncLabel}</span>
            </div>
            
            <ThemeToggle className="hidden sm:flex shrink-0" />

            {/* Unified Canonical Profile Dropdown */}
            <ProfileDropdown align="right" className="shrink-0" />

          </div>
        </div>
      </header>

      {/* Standard Side Drawer Overlay & Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Side Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-[280px] z-50 shadow-2xl flex flex-col overflow-y-auto"
              style={{
                background: 'var(--cf-surface)',
                borderRight: '1px solid var(--cf-border)',
              }}
            >
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--cf-border-soft)' }}>
                <CashFloorLogo size="sm" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{ color: 'var(--cf-text-muted)' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="px-4 py-4 flex flex-col gap-1.5 flex-1">
                {NAV_SECTIONS.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: pathname === s.href ? 'var(--cf-text)' : 'var(--cf-text-muted)', background: pathname === s.href ? 'var(--cf-surface-alt)' : 'transparent' }}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
              
              <div className="p-4 border-t mt-auto" style={{ borderColor: 'var(--cf-border-soft)', background: 'var(--cf-surface-alt)' }}>
                <div className="mb-4">
                  <ThemeToggle />
                </div>
                {isAuthenticated && user ? (
                  <div className="p-3 rounded-xl border flex items-center justify-between"
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
                      className="p-1.5 rounded-lg text-xs transition-colors cursor-pointer hover:bg-rose-500/10"
                      style={{ color: 'var(--cf-caution)' }}
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); handleAuthTrigger(); }}
                    className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                  >
                    <User className="w-4 h-4" /> Sign In to Pro Suite
                  </button>
                )}
                
                <div className="mt-4 flex flex-col gap-2">
                  {onOpenInvoiceModal && (
                    <button onClick={() => { onOpenInvoiceModal(); setMobileOpen(false); }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold cursor-pointer border"
                      style={{ color: 'var(--cf-accent)', borderColor: 'var(--cf-accent)', background: 'var(--cf-accent-bg)' }}>
                      <FileText className="w-4 h-4" /> Client Invoice Studio
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => { onExportCsv?.(); setMobileOpen(false); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium cursor-pointer border hover:bg-[var(--cf-surface-alt)]"
                      style={{ color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border)', background: 'var(--cf-surface)' }}>
                      <Download className="w-3.5 h-3.5" /> Export
                    </button>
                    <button onClick={() => { onLoadSample?.(); setMobileOpen(false); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium cursor-pointer border hover:bg-[var(--cf-surface-alt)]"
                      style={{ color: 'var(--cf-text-muted)', borderColor: 'var(--cf-border)', background: 'var(--cf-surface)' }}>
                      <Database className="w-3.5 h-3.5" /> Sample
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
