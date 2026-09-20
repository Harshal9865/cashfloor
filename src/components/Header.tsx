'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw, Database, Download, Share2, ArrowRight, Cloud, User, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  isMarketingPage?: boolean;
  onResetData?: () => void;
  onLoadSample?: () => void;
  onExportCsv?: () => void;
  onOpenShareModal?: () => void;
  onOpenAuthModal?: () => void;
  isAuthenticated?: boolean;
  syncStatus?: 'offline' | 'saving' | 'synced' | 'error';
  lastSavedAt?: string | null;
}

export default function Header({
  isMarketingPage = false,
  onResetData,
  onLoadSample,
  onExportCsv,
  onOpenShareModal,
  onOpenAuthModal,
  isAuthenticated = false,
  syncStatus = 'offline',
  lastSavedAt,
}: HeaderProps) {
  return (
    <header className="w-full bg-[#F1F4F2] hairline-b sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-12 flex justify-between items-center w-full h-16">
        {/* Brand Identity Anchor */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 bg-[#16232B] flex items-center justify-center text-[#F1F4F2] font-serif text-lg font-bold group-hover:bg-[#2F6F62] transition-colors">
              C
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-tight text-[#16232B] font-normal leading-tight group-hover:text-[#2F6F62] transition-colors">
                Calm Ledger
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#5C6D77] uppercase hidden sm:inline">
                Runway &amp; Income Equilibrium
              </span>
            </div>
          </Link>

          {/* Global Ecosystem Navigation Links (Desktop) */}
          {!isMarketingPage && (
            <nav className="hidden lg:flex items-center space-x-3.5 xl:space-x-5 ml-2 xl:ml-4 text-xs font-sans font-medium text-[#5C6D77]">
              <a href="#runway" className="hover:text-[#2F6F62] transition-colors pb-0.5 whitespace-nowrap">
                Runway
              </a>
              <a href="#partitions" className="hover:text-[#2F6F62] transition-colors pb-0.5 whitespace-nowrap">
                Pillars
              </a>
              <a href="#waterfall" className="hover:text-[#2F6F62] transition-colors pb-0.5 whitespace-nowrap">
                Waterfall
              </a>
              <a href="#cash-flow" className="hover:text-[#2F6F62] transition-colors pb-0.5 whitespace-nowrap">
                Timeline
              </a>
              <a href="#assumptions" className="hover:text-[#2F6F62] transition-colors pb-0.5 whitespace-nowrap">
                Levers
              </a>
              <a href="#ledger-archive" className="hover:text-[#2F6F62] transition-colors pb-0.5 whitespace-nowrap">
                Ledger
              </a>
            </nav>
          )}
        </div>

        {/* Trailing Status & Actions */}
        <div className="flex items-center space-x-2.5 md:space-x-4">
          {isMarketingPage ? (
            <Link 
              href="/dashboard"
              className="bg-[#16232B] hover:bg-[#2F6F62] text-[#F1F4F2] px-4 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors duration-150 flex items-center space-x-2 cursor-pointer"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              {/* Live Status indicator (responsive to prevent collision on 1280px) */}
              <div className="hidden 2xl:flex items-center space-x-2 text-[#5C6D77] font-mono text-[11px] whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#2F6F62] animate-pulse"></span>
                <span>100% Client-Side Safe</span>
                <span className="opacity-40">•</span>
                <span>Zero Server Ingestion</span>
              </div>
              <div className="hidden xl:flex 2xl:hidden items-center space-x-2 text-[#5C6D77] font-mono text-[11px] whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#2F6F62] animate-pulse"></span>
                <span>Client-Side Safe</span>
              </div>

              {/* Quick Action Icons */}
              <div className="hidden md:flex items-center space-x-1 border-l border-[#16232B]/10 pl-2">
                <button
                  type="button"
                  onClick={onLoadSample}
                  className="p-1.5 text-[#5C6D77] hover:text-[#2F6F62] transition-colors cursor-pointer"
                  title="Load Realistic Sample Freelance Ledger"
                >
                  <Database className="w-4 h-4" />
                </button>
                <a
                  href="#assumptions"
                  className="p-1.5 text-[#5C6D77] hover:text-[#2F6F62] transition-colors cursor-pointer"
                  title="Tune Sensitivity Levers"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={onResetData}
                  className="p-1.5 text-[#5C6D77] hover:text-[#B4573F] transition-colors cursor-pointer"
                  title="Reset to Blank Ledger"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Primary Action Buttons */}
              <button
                type="button"
                onClick={onExportCsv}
                className="bg-[#16232B] hover:bg-[#2F6F62] text-[#F1F4F2] px-3 md:px-4 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors duration-150 flex items-center space-x-1.5 cursor-pointer"
                title="Download Double-Entry Audit CSV"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export</span>
              </button>

              <button
                type="button"
                onClick={onOpenShareModal}
                className="border border-[#2F6F62] text-[#2F6F62] hover:bg-[#2F6F62] hover:text-white px-3 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors duration-150 flex items-center space-x-1.5 cursor-pointer"
                title="Generate 1000x1500px Pinterest Card"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Cloud Sync & Auth Button */}
              {isAuthenticated ? (
                <div 
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-[#2F6F62]/10 border border-[#2F6F62]/30 text-[#0f564a] font-mono text-[11px]"
                  title={lastSavedAt ? `Cloud Synced at ${lastSavedAt}` : 'Saved to Supabase Cloud'}
                >
                  {syncStatus === 'saving' ? (
                    <RefreshCw className="w-3 h-3 animate-spin text-[#875205]" />
                  ) : (
                    <Cloud className="w-3.5 h-3.5 text-[#2F6F62]" />
                  )}
                  <span className="hidden lg:inline font-semibold">
                    {syncStatus === 'saving' ? 'Saving...' : 'Cloud Synced'}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="border border-[#16232B]/20 hover:border-[#2F6F62] bg-white text-[#16232B] hover:text-[#2F6F62] px-2.5 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer"
                  title="Sign in to save ledger to cloud"
                >
                  <User className="w-3.5 h-3.5 text-[#2F6F62]" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
