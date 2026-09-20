'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download, Database, RotateCcw, Cloud, User, RefreshCw,
  ChevronDown, LogOut, Share2, Check, Menu, X
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface DashboardNavProps {
  onResetData?: () => void;
  onLoadSample?: () => void;
  onExportCsv?: () => void;
  onOpenShareModal?: () => void;
  onOpenAuthModal?: () => void;
  isAuthenticated?: boolean;
  syncStatus?: 'offline' | 'saving' | 'synced' | 'error';
  lastSavedAt?: string | null;
}

const NAV_SECTIONS = [
  { label: 'Runway', href: '#runway' },
  { label: 'Pillars', href: '#partitions' },
  { label: 'Timeline', href: '#cash-flow' },
  { label: 'Levers', href: '#assumptions' },
  { label: 'Ledger', href: '#ledger-archive' },
];

export default function DashboardNav({
  onResetData,
  onLoadSample,
  onExportCsv,
  onOpenShareModal,
  onOpenAuthModal,
  isAuthenticated = false,
  syncStatus = 'offline',
  lastSavedAt,
}: DashboardNavProps) {
  const [activeSection, setActiveSection] = useState('');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    NAV_SECTIONS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const syncColor =
    syncStatus === 'synced' ? 'var(--cf-accent)' :
    syncStatus === 'saving' ? 'var(--cf-warm)' :
    syncStatus === 'error' ? 'var(--cf-caution)' : 'var(--cf-text-faint)';

  const syncLabel =
    syncStatus === 'synced' ? 'Synced' :
    syncStatus === 'saving' ? 'Saving...' :
    syncStatus === 'error' ? 'Error' : 'Offline';

  return (
    <>
      <header
        className="w-full sticky top-0 z-40 transition-all duration-300"
        style={{
          background: 'var(--cf-nav-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--cf-nav-border)',
          boxShadow: 'var(--cf-shadow-sm)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-7 h-7 bg-gradient-to-br from-[#16232B] to-[#2F6F62] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-[0_0_12px_rgba(47,111,98,0.4)] transition-shadow">
              <span className="text-white font-serif text-sm font-bold">C</span>
            </div>
            <span className="font-serif text-base text-[var(--cf-text)] tracking-tight group-hover:text-[var(--cf-accent)] transition-colors hidden sm:block">
              CashFloor
            </span>
          </Link>

          {/* ── Center Tab Nav (desktop) ── */}
          <nav className="hidden lg:flex items-center gap-0.5 rounded-xl p-1 border"
            style={{ background: 'var(--cf-surface)', borderColor: 'var(--cf-border)' }}>
            {NAV_SECTIONS.map((s) => {
              const isActive = activeSection === s.href.slice(1);
              return (
                <a
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
                </a>
              );
            })}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            {/* Sync status dot (compact) */}
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono"
                style={{ background: 'var(--cf-surface)', border: '1px solid var(--cf-border)', color: syncColor }}>
                {syncStatus === 'saving'
                  ? <RefreshCw className="w-3 h-3 animate-spin" />
                  : syncStatus === 'synced'
                  ? <Check className="w-3 h-3" />
                  : <Cloud className="w-3 h-3" />
                }
                <span>{syncLabel}</span>
              </div>
            )}

            {/* Export */}
            <button
              type="button"
              onClick={onExportCsv}
              title="Export CSV"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border"
              style={{
                color: 'var(--cf-text-muted)',
                borderColor: 'var(--cf-border)',
                background: 'transparent',
              }}
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

            {/* Share */}
            <button
              type="button"
              onClick={onOpenShareModal}
              title="Share"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border"
              style={{
                color: 'var(--cf-text-muted)',
                borderColor: 'var(--cf-border)',
                background: 'transparent',
              }}
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

            <ThemeToggle className="hidden sm:flex" />

            {/* Auth / Avatar */}
            {isAuthenticated ? (
              <div ref={avatarRef} className="relative">
                <button
                  type="button"
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full transition-all cursor-pointer group"
                  title="Account"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2F6F62] to-[#0f564a] flex items-center justify-center shadow-sm group-hover:shadow-[0_0_8px_rgba(47,111,98,0.4)] transition-shadow">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--cf-text-muted)] transition-transform" style={{ transform: avatarOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                <AnimatePresence>
                  {avatarOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 w-48 rounded-xl overflow-hidden"
                      style={{
                        background: 'var(--cf-surface)',
                        border: '1px solid var(--cf-border)',
                        boxShadow: 'var(--cf-shadow-lg)',
                      }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--cf-border)' }}>
                        <p className="text-xs font-mono text-[var(--cf-text-muted)]">Signed in</p>
                        {lastSavedAt && (
                          <p className="text-[11px] text-[var(--cf-text-faint)] mt-0.5">Last saved {lastSavedAt}</p>
                        )}
                      </div>
                      <div className="py-1">
                        <button onClick={onLoadSample}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer">
                          <Database className="w-3.5 h-3.5" /> Load Sample Data
                        </button>
                        <button onClick={onResetData}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--cf-text-muted)] hover:text-[var(--cf-caution)] hover:bg-[var(--cf-caution-bg)] transition-colors cursor-pointer">
                          <RotateCcw className="w-3.5 h-3.5" /> Reset Ledger
                        </button>
                        <div className="border-t my-1" style={{ borderColor: 'var(--cf-border)' }} />
                        <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[var(--cf-text-muted)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer">
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
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer text-white"
                style={{
                  background: 'linear-gradient(135deg, var(--cf-text) 0%, var(--cf-accent) 100%)',
                  boxShadow: '0 2px 8px rgba(47,111,98,0.25)',
                }}
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            )}

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
              <div className="border-t mt-2 pt-2 flex gap-2" style={{ borderColor: 'var(--cf-border)' }}>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
