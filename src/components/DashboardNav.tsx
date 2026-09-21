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
          className="pointer-events-auto flex items-center justify-between w-full max-w-6xl px-4 h-13 min-h-[52px] max-h-[52px] rounded-2xl border transition-all duration-300"
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
                  className="relative px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-200"
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
                  <span className="relative z-10 whitespace-nowrap select-none">{s.label}</span>
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
                <Link
                  key={s.label}
                  href={s.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm transition-colors"
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
                </Link>
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
