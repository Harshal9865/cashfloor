'use client';

import React from 'react';
import Link from 'next/link';

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
  // Dimensions based on size
  const iconDimensions = {
    sm: { box: 28, svg: 28 },
    md: { box: 34, svg: 34 },
    lg: { box: 42, svg: 42 },
    xl: { box: 52, svg: 52 },
  }[size];

  const textSize = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  const logoGraphic = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* Precision Geometric SVG Emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ width: iconDimensions.box, height: iconDimensions.box }}
      >
        {/* Subtle ambient halo */}
        <div 
          className="absolute inset-0 rounded-xl bg-gradient-to-tr from-[#2F6F62] to-[#10B981] opacity-25 blur-md group-hover:opacity-45 transition-opacity duration-300"
        />

        {/* Vector SVG Emblem: Architectural Floor + Ascending Runway Trajectory */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-sm"
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
              className={`font-serif ${textSize} font-medium tracking-tight text-[var(--cf-text)] group-hover:text-[#2F6F62] transition-colors`}
            >
              Cash<span className="text-[var(--cf-accent)] font-semibold">Floor</span>
            </span>
            <span className="ml-1.5 px-1 py-0.2 rounded text-[9px] font-mono font-bold tracking-widest uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              PRO
            </span>
          </div>

          {showTagline && (
            <span className="text-[10px] font-mono tracking-wider text-[var(--cf-text-muted)] uppercase -mt-0.5">
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
