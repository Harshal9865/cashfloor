'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FlaskConical,
  CalendarDays,
  Plug,
  User,
} from 'lucide-react';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/studio', label: 'Studio', icon: FlaskConical },
  { href: '/daily', label: 'Daily', icon: CalendarDays },
  { href: '/integrations', label: 'Connect', icon: Plug },
  { href: '/account', label: 'Account', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on public marketing, legal, and educational pages
  const isMarketingOrLegal =
    pathname === '/' ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/security') ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/help') ||
    pathname.startsWith('/auth');

  if (isMarketingOrLegal) {
    return null;
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t"
      style={{
        background: 'var(--cf-nav-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'var(--cf-nav-border)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all active:scale-90"
              style={{
                color: isActive ? 'var(--cf-accent)' : 'var(--cf-text-faint)',
                background: isActive ? 'var(--cf-accent-bg)' : 'transparent',
                minWidth: '52px',
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className="transition-all"
                style={{
                  width: isActive ? '22px' : '20px',
                  height: isActive ? '22px' : '20px',
                  strokeWidth: isActive ? 2.2 : 1.8,
                }}
              />
              <span
                className="text-[9px] font-semibold tracking-wide transition-all"
                style={{
                  color: isActive ? 'var(--cf-accent)' : 'var(--cf-text-faint)',
                  opacity: isActive ? 1 : 0.75,
                }}
              >
                {label}
              </span>
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: 'var(--cf-accent)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
