'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';

export function WorkspaceLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    // Determine if we are crossing the boundary from Marketing (/) to Workspace (/dashboard, /daily, /integrations)
    const isMarketing = (path: string) => path === '/' || path.startsWith('/blog') || path.startsWith('/pricing');
    const isWorkspace = (path: string) => path === '/dashboard' || path === '/daily' || path === '/integrations' || path.startsWith('/account');

    if (isMarketing(previousPathname.current) && isWorkspace(pathname)) {
      // Crossing boundary! Trigger loader.
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 900); // 900ms mock decryption load
      
      previousPathname.current = pathname;
      return () => clearTimeout(timer);
    } else {
      previousPathname.current = pathname;
    }
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="workspace-loader"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--cf-bg)]/80"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, type: 'spring' }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--cf-accent)]/20 rounded-full blur-xl animate-pulse" />
              <div className="w-16 h-16 bg-[var(--cf-surface)] border border-[var(--cf-border)] rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
                <Lock className="w-8 h-8 text-[var(--cf-accent)] animate-pulse" />
              </div>
            </div>
            
            <div className="text-center space-y-1 mt-4">
              <h2 className="font-serif text-lg font-semibold text-[var(--cf-text)] tracking-tight">
                Initializing Secure Workspace
              </h2>
              <p className="text-sm font-mono text-[var(--cf-text-muted)] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Decrypting Local Ledger...
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
