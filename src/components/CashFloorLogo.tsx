'use client';

import React from 'react';
import Link from 'next/link';
import { usePayment } from '@/lib/payment/PaymentContext';

interface CashFloorLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
  href?: string;
}

export default function CashFloorLogo({
  size = 'md',
  showWordmark = true,
  showTagline = false,
  className = '',
  href = '/',
}: CashFloorLogoProps) {
  // Dimensions based on size. Using Tailwind responsive classes for 'md' and 'lg' to ensure they shrink on mobile.
  const iconClasses = {
    sm: 'w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]',
    md: 'w-[24px] h-[24px] sm:w-[28px] sm:h-[28px]',
    lg: 'w-[28px] h-[28px] sm:w-[36px] sm:h-[36px]',
    xl: 'w-[34px] h-[34px] sm:w-[48px] sm:h-[48px]',
  }[size];

  const textSize = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-xl',
    xl: 'text-lg sm:text-2xl',
  }[size];

  // Try to safely access payment context (might be null in tests or some edge cases if not wrapped)
  let planLabel = 'PRO';
  try {
    const payment = usePayment();
    if (payment?.isProSubscriber) {
      planLabel = (payment.activePlan || 'PRO').toUpperCase();
    } else {
      planLabel = 'FREE';
    }
  } catch (e) {
    // Fallback if usePayment fails
  }

  const logoGraphic = (
    <div className={`flex items-center gap-2 sm:gap-3 group select-none ${className}`}>
      {/* Precision Geometric SVG Emblem */}
      <div 
        className={`relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${iconClasses}`}
      >
        {/* Subtle ambient halo with enhanced hover glow */}
        <div 
          className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#2F6F62] to-[#10B981] opacity-20 blur-md group-hover:opacity-60 group-hover:blur-lg transition-all duration-300"
        />

        {/* Vector SVG Emblem: Architectural Floor + Ascending Runway Trajectory */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        >
          {/* Base rounded squircle container */}
          <rect
            width="40"
            height="40"
            rx="10"
            className="fill-[#16232B] dark:fill-[#0F161A] transition-colors"
          />
          {/* Subtle perimeter bevel */}
          <rect
            x="0.75"
            y="0.75"
            width="38.5"
            height="38.5"
            rx="9.25"
            stroke="url(#cf-border-grad)"
            strokeWidth="1.5"
            className="group-hover:stroke-emerald-500/40 transition-colors"
          />

          {/* Floor Foundation Line (Capital Safety Datum) */}
          <path
            d="M8 29.5H32"
            stroke="#5C6D77"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 3"
            opacity="0.6"
          />

          {/* Dynamic Ascending Runway Slope (Income Trajectory) */}
          <path
            d="M10 26.5C14 26.5 17 21 21 17C25 13 28 11.5 31 10.5"
            stroke="url(#cf-emerald-grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />

          {/* Safe-to-Spend Equilibrium Node */}
          <circle
            cx="31"
            cy="10.5"
            r="3"
            fill="#10B981"
            className="animate-pulse"
          />
          <circle
            cx="31"
            cy="10.5"
            r="1.25"
            fill="#FFFFFF"
          />

          {/* Equilibrium Pillar Line */}
          <path
            d="M31 13.5V29.5"
            stroke="#2F6F62"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="cf-emerald-grad" x1="10" y1="26.5" x2="31" y2="10.5" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2F6F62" />
              <stop offset="0.6" stopColor="#10B981" />
              <stop offset="1" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="cf-border-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0.02" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center tracking-tight">
            <span 
              className={`font-serif ${textSize} font-medium tracking-tight text-[var(--cf-text)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200`}
            >
              Cash<span className="text-[var(--cf-accent)] font-semibold group-hover:text-[#10B981] transition-colors">Floor</span>
            </span>
            <span className="hidden sm:inline-flex ml-1.5 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/20 transition-all duration-200">
              {planLabel}
            </span>
          </div>

          {showTagline && (
            <span className="text-[10px] font-mono tracking-wider text-[var(--cf-text-muted)] group-hover:text-[var(--cf-text)] uppercase -mt-0.5 transition-colors">
              Runway &amp; Income Equilibrium
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none" aria-label="CashFloor Home">
        {logoGraphic}
      </Link>
    );
  }

  return logoGraphic;
}
