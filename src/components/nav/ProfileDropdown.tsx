'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  LayoutDashboard,
  Sliders,
  Receipt,
  Shield,
  FileCheck,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  Copy,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useTheme } from '@/lib/theme/ThemeContext';

interface ProfileDropdownProps {
  align?: 'left' | 'right';
  className?: string;
}

function getInitials(nameOrEmail: string): string {
  if (!nameOrEmail) return 'CF';
  const clean = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
  const parts = clean.split(/[._\s-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export default function ProfileDropdown({ align = 'right', className = '' }: ProfileDropdownProps) {
  const { user, isAuthenticated, loading, signOut, openAuthModal } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read client custom preferences for the mini-HUD
  const [targetMonths, setTargetMonths] = useState<number>(6);
  const [entityLabel, setEntityLabel] = useState<string>('LLC Vault');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cf_client_rules');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.targetSafetyMonths) setTargetMonths(parsed.targetSafetyMonths);
          if (parsed.entityType) {
            const map: Record<string, string> = {
              single_member_llc: 'Single-Member LLC',
              s_corp: 'S-Corporation',
              sole_prop: 'Sole Proprietor',
              foreign_contractor: 'Foreign Contractor'
            };
            setEntityLabel(map[parsed.entityType] || 'Protected Vault');
          }
        }
      } catch {}
    }
  }, [isOpen]);

  // Close on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading && !user) {
    return (
      <div className="w-24 h-8 rounded-full bg-[var(--cf-surface-alt)]/60 border border-[var(--cf-border-soft)] animate-pulse" />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <button
        type="button"
        onClick={() => openAuthModal('Sign in to access your financial vault')}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all cursor-pointer shadow-sm hover:shadow hover:opacity-95"
        style={{
          background: 'linear-gradient(135deg, #2F6F62, #1a4f45)',
        }}
      >
        <User className="w-3.5 h-3.5" />
        <span>Sign In</span>
      </button>
    );
  }

  const displayName = user.name || user.email?.split('@')[0] || 'Independent Pro';
  const initials = getInitials(user.name || user.email || '');

  return (
    <div ref={dropdownRef} className={`relative shrink-0 ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-all border cursor-pointer group select-none"
        style={{
          background: isOpen ? 'var(--cf-surface-alt)' : 'var(--cf-surface)',
          borderColor: isOpen ? 'var(--cf-accent)' : 'var(--cf-border)',
          color: 'var(--cf-text)',
          boxShadow: isOpen ? '0 0 0 1px var(--cf-accent), var(--cf-shadow-sm)' : 'var(--cf-shadow-sm)',
        }}
        aria-label="User account menu"
        aria-expanded={isOpen}
      >
        {/* Avatar circle with image / initials + online radar dot */}
        <div className="relative shrink-0">
          <div
            className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm ring-1 ring-white/10"
            style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                loading="eager"
                decoding="async"
                // @ts-ignore fetchpriority
                fetchPriority="high"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              initials
            )}
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--cf-surface)] bg-emerald-500 ring-1 ring-emerald-400/20"
            title="Active Session"
          />
        </div>

        <span className="hidden sm:inline max-w-[110px] truncate text-xs font-semibold whitespace-nowrap">
          {displayName}
        </span>

        <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 whitespace-nowrap shrink-0">
          PRO
        </span>

        <ChevronDown
          className="w-3.5 h-3.5 transition-transform duration-200 shrink-0"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'none',
            color: 'var(--cf-text-muted)',
          }}
        />
      </button>

      {/* Unified Professional Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } top-full mt-2 w-72 sm:w-80 rounded-2xl overflow-hidden z-50 shadow-2xl border backdrop-blur-2xl`}
            style={{
              background: 'var(--cf-surface)',
              borderColor: 'var(--cf-border)',
            }}
          >
            {/* Header: User Profile Details */}
            <div className="p-4 border-b border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]/70">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md ring-1 ring-emerald-500/30"
                  style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={displayName}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-bold truncate text-[var(--cf-text)] max-w-[140px]">
                      {displayName}
                    </p>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/25 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      PRO ARCHITECT
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-[11px] truncate text-[var(--cf-text-faint)] font-mono max-w-[150px]">
                      {user.email}
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      title="Copy email address"
                      className="text-[var(--cf-text-faint)] hover:text-[var(--cf-text)] transition-colors p-0.5 rounded cursor-pointer"
                    >
                      {copied ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Solvency Mini-HUD Pill */}
              <div className="mt-3 pt-3 border-t border-[var(--cf-border-soft)] grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="p-2 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
                  <span className="text-[var(--cf-text-faint)] block text-[9px] uppercase tracking-wider">Floor Target</span>
                  <span className="text-[var(--cf-text)] font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-[var(--cf-accent)] shrink-0" />
                    {targetMonths} Mo Cushion
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
                  <span className="text-[var(--cf-text-faint)] block text-[9px] uppercase tracking-wider">Entity Vault</span>
                  <span className="text-[var(--cf-text)] font-semibold truncate block mt-0.5">
                    {entityLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Options - Group 1: Core Financial OS */}
            <div className="p-2 space-y-0.5">
              <div className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--cf-text-faint)]">
                Financial OS
              </div>

              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-3.5 h-3.5 text-[var(--cf-accent)] group-hover:scale-110 transition-transform" />
                  <span>Dashboard Overview</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--cf-text-faint)]">HUD</span>
              </Link>

              <Link
                href="/studio"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span>Scenario Studio</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--cf-text-faint)]">DSA</span>
              </Link>

              <Link
                href="/daily"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Receipt className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>Daily Run-Rate Ledger</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--cf-text-faint)]">Live</span>
              </Link>
            </div>

            {/* Navigation Options - Group 2: Governance & CPA */}
            <div className="p-2 pt-0 space-y-0.5 border-t border-[var(--cf-border-soft)] mt-1">
              <div className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--cf-text-faint)]">
                Governance & Audit
              </div>

              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-3.5 h-3.5 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span>Account & Legal Vault</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--cf-text-faint)]">Settings</span>
              </Link>

              <Link
                href="/share"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                  <span>Share Audit with CPA</span>
                </div>
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1 rounded">Read-Only</span>
              </Link>
            </div>

            {/* Footer with Theme Switcher & Sign Out */}
            <div className="p-2 border-t border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]/50 space-y-2">
              {/* Day / Night Theme Toggle */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)]">
                <span className="text-[11px] font-medium text-[var(--cf-text-muted)] flex items-center gap-1.5">
                  {isDark ? <Moon className="w-3.5 h-3.5 text-[var(--cf-accent)]" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{isDark ? 'Obsidian Glow' : 'Solar Slate'}</span>
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition-all cursor-pointer bg-[var(--cf-surface-alt)] text-[var(--cf-text)] hover:bg-[var(--cf-border)] border border-[var(--cf-border)]"
                >
                  Switch to {isDark ? 'Day' : 'Night'}
                </button>
              </div>

              {/* Sign Out Trigger */}
              <button
                type="button"
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                }}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Session</span>
                </div>
                <span className="text-[10px] font-mono opacity-70">End</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
