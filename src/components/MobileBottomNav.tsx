'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, LayoutDashboard, Compass } from 'lucide-react';
import Link from 'next/link';

export default function MobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Do not render on marketing pages or auth routes if desired, or render everywhere.
  // We'll render it globally, but you might want to hide it on the homepage.
  if (pathname === '/' || pathname === '/pricing' || pathname === '/about') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t pb-safe"
      style={{
        background: 'var(--cf-nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--cf-nav-border)',
        boxShadow: 'var(--cf-shadow-md)'
      }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-full transition-colors active:scale-95"
          style={{ color: 'var(--cf-text)' }}
          aria-label="Go Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <Link
          href="/dashboard"
          className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors active:scale-95"
          style={{ color: pathname === '/dashboard' ? 'var(--cf-accent)' : 'var(--cf-text-muted)' }}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Dashboard</span>
        </Link>

        <Link
          href="/studio"
          className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors active:scale-95"
          style={{ color: pathname === '/studio' ? 'var(--cf-accent)' : 'var(--cf-text-muted)' }}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Studio</span>
        </Link>

        <button
          onClick={() => router.forward()}
          className="p-2.5 rounded-full transition-colors active:scale-95"
          style={{ color: 'var(--cf-text)' }}
          aria-label="Go Forward"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
