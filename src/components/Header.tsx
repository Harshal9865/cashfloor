'use client';

import React from 'react';
import MarketingNav from '@/components/MarketingNav';

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

/**
 * Clean Unified Header component that delegates to MarketingNav,
 * ensuring zero broken in-page hash links or misplaced dashboard action buttons.
 */
export default function Header(_props: HeaderProps) {
  return <MarketingNav />;
}
