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
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Studio Engine', href: '/studio' },
  { label: 'Daily Stream', href: '/daily' },
  { label: 'Integrations', href: '/integrations' },
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

  const handleDownloadVaultJson = () => {
    if (typeof window === 'undefined') return;
    const backupData = {
      version: 'cashfloor_vault_v1',
      exportedAt: new Date().toISOString(),
      ledger: localStorage.getItem('calm_ledger_local_state_v1'),
      rules: localStorage.getItem('cf_client_rules'),
      integrations: localStorage.getItem('cf_connected_integrations'),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cashfloor-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setAvatarOpen(false);
  };

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
          className="pointer-events-auto flex items-center justify-between w-full max-w-5xl px-3.5 h-13 rounded-2xl border transition-shadow duration-300"
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
          <nav className="hidden lg:flex items-center gap-1 rounded-xl p-1 border"
            style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}>
            {NAV_SECTIONS.map((s) => {
              const isActive = pathname === s.href;

              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className="relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200"
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
                  <span className="relative z-10">{s.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2">
            
            {/* Sync Status Badge */}
            <div 
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border"
              style={{ 
                borderColor: 'var(--cf-border-soft)',
                background: 'var(--cf-surface-alt)',
                color: syncColor
              }}
              title={syncStatus === 'synced' ? 'All changes saved to PostgreSQL with RLS' : 'Saved in local browser memory'}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: syncColor }} />
              <span className="font-medium">{syncLabel}</span>
            </div>
            
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

                {/* Refined Tier-1 Professional Profile Menu */}
                <AnimatePresence>
                  {avatarOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-11 w-64 rounded-2xl overflow-hidden z-50 shadow-2xl border"
                      style={{
                        background: 'var(--cf-surface)',
                        borderColor: 'var(--cf-border)',
                      }}
                    >
                      {/* Identity Card */}
                      <div className="p-4 border-b space-y-2.5" style={{ borderColor: 'var(--cf-border-soft)', background: 'var(--cf-surface-alt)' }}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#2F6F62] to-[#0f564a] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
                            {user?.avatar ? (
                              <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold truncate text-[var(--cf-text)]">{displayName}</p>
                              <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-500/15 px-1 py-0.5 rounded border border-emerald-500/20">
                                PRO
                              </span>
                            </div>
                            <p className="text-[11px] truncate text-[var(--cf-text-faint)] font-mono">{user?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[10px] font-mono border-t border-[var(--cf-border-soft)]">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            Enclave Sovereign
                          </span>
                          <span className="text-[var(--cf-text-faint)]">{lastSavedAt ? `Sync ${lastSavedAt}` : 'Local-First'}</span>
                        </div>
                      </div>

                      {/* Primary Workspace Links */}
                      <div className="p-1.5 space-y-0.5">
                        <div className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-[var(--cf-text-faint)]">
                          Workspace &amp; Settings
                        </div>
                        <Link 
                          href="/account" 
                          onClick={() => setAvatarOpen(false)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-[var(--cf-accent)]" /> 
                          <span>Account Settings</span>
                        </Link>
                        <Link 
                          href="/security" 
                          onClick={() => setAvatarOpen(false)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-emerald-500" /> 
                          <span>Security &amp; Storage Vault</span>
                        </Link>
                        <Link 
                          href="/subscription" 
                          onClick={() => setAvatarOpen(false)}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 
                          <span>Pro Plan &amp; Billing</span>
                        </Link>
                      </div>

                      {/* Data Portability Section */}
                      <div className="p-1.5 border-t border-[var(--cf-border-soft)] space-y-0.5">
                        <div className="px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider text-[var(--cf-text-faint)]">
                          Data Portability
                        </div>
                        <button
                          onClick={handleDownloadVaultJson}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer text-left"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-500" />
                          <span>Export Vault Backup (.json)</span>
                        </button>
                        {onExportCsv && (
                          <button
                            onClick={() => { onExportCsv(); setAvatarOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer text-left"
                          >
                            <Database className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Export Ledger (.csv)</span>
                          </button>
                        )}
                      </div>

                      {/* Danger / Session Zone */}
                      <div className="p-1.5 border-t border-[var(--cf-border-soft)] space-y-0.5">
                        {onResetData && (
                          <button 
                            onClick={() => { onResetData(); setAvatarOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-[var(--cf-text-muted)] hover:text-amber-600 hover:bg-amber-500/10 transition-colors cursor-pointer text-left"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> 
                            <span>Reset Local Workspace</span>
                          </button>
                        )}
                        <button
                          onClick={async () => { setAvatarOpen(false); await signOut(); }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" /> 
                          <span>Sign Out</span>
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
