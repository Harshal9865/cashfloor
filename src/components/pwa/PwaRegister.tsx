'use client';

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PwaRegister() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnectedToast, setShowReconnectedToast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Register Service Worker in Production / Supported Browsers
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Check for worker updates periodically
          reg.onupdatefound = () => {
            const installing = reg.installing;
            if (installing) {
              installing.onstatechange = () => {
                if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('CashFloor PWA update available.');
                }
              };
            }
          };
        })
        .catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
    }

    // 2. Online / Offline event listeners
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnectedToast(true);
      setTimeout(() => setShowReconnectedToast(false), 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnectedToast(false);
    };

    if (!navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#16232B] border border-amber-500/40 text-amber-400 text-xs font-mono shadow-2xl flex items-center gap-2.5 backdrop-blur-md"
          >
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span>Offline Mode Active · Changes stored safely in Local Vault</span>
          </motion.div>
        )}

        {showReconnectedToast && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#16232B] border border-emerald-500/40 text-emerald-400 text-xs font-mono shadow-2xl flex items-center gap-2.5 backdrop-blur-md"
          >
            <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>✓ Reconnected to network · Workspace synchronized</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
