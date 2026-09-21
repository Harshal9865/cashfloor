'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  LayoutDashboard,
  Layers,
  Sparkles,
  LogOut,
  ChevronDown,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (loading) {
    return (
      <div className="w-20 h-8 rounded-full bg-[var(--cf-surface-alt)]/60 border border-[var(--cf-border-soft)] animate-pulse" />
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
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full text-xs font-medium transition-all border cursor-pointer group select-none"
        style={{
          background: isOpen ? 'var(--cf-surface-alt)' : 'var(--cf-surface)',
          borderColor: isOpen ? 'var(--cf-accent)' : 'var(--cf-border)',
          color: 'var(--cf-text)',
          boxShadow: 'var(--cf-shadow-sm)',
        }}
        aria-label="User account menu"
        aria-expanded={isOpen}
      >
        {/* Avatar circle with image / initials + online radar dot */}
        <div className="relative">
          <div
            className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--cf-surface)] bg-emerald-500"
            title="Active Session"
          />
        </div>

        <span className="hidden sm:inline max-w-[110px] truncate text-xs font-semibold">
          {displayName}
        </span>

        <span className="hidden md:inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold tracking-wider uppercase text-emerald-600 bg-emerald-500/10 border border-emerald-500/20">
          PRO
        </span>

        <ChevronDown
          className="w-3.5 h-3.5 transition-transform duration-200"
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
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } top-full mt-2 w-60 rounded-2xl overflow-hidden z-50 shadow-2xl border`}
            style={{
              background: 'var(--cf-surface)',
              borderColor: 'var(--cf-border)',
            }}
          >
            {/* Header: User Profile Details */}
            <div className="p-3.5 border-b border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold truncate text-[var(--cf-text)]">
                      {displayName}
                    </p>
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] truncate text-[var(--cf-text-faint)] font-mono">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Options */}
            <div className="p-1.5 space-y-0.5">
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
                <span>Dashboard Overview</span>
              </Link>

              <Link
                href="/studio"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Runway Studio</span>
              </Link>

              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-purple-500" />
                <span>Account Settings</span>
              </Link>

              <Link
                href="/subscription"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Billing &amp; Plan</span>
              </Link>
            </div>

            {/* Theme Toggle Bar */}
            <div className="px-3 py-2 border-t border-[var(--cf-border-soft)] flex items-center justify-between text-xs text-[var(--cf-text-muted)]">
              <span className="text-[11px] font-medium flex items-center gap-1.5">
                <span>Display Theme</span>
              </span>
              <ThemeToggle />
            </div>

            {/* Sign Out Trigger */}
            <div className="p-1.5 border-t border-[var(--cf-border-soft)]">
              <button
                type="button"
                onClick={async () => {
                  setIsOpen(false);
                  await signOut();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
