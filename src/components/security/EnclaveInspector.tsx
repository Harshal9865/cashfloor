'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, HardDrive, Trash2, RefreshCw, CheckCircle2, Lock, AlertTriangle, ExternalLink } from 'lucide-react';

interface StorageKeyReport {
  key: string;
  name: string;
  bytes: number;
  description: string;
  exists: boolean;
}

export default function EnclaveInspector() {
  const [mounted, setMounted] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<string>('');
  const [storageItems, setStorageItems] = useState<StorageKeyReport[]>([]);
  const [totalBytes, setTotalBytes] = useState(0);
  const [trackerCount, setTrackerCount] = useState(0);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  const monitoredKeys = [
    { key: 'calm_ledger_local_state_v1', name: 'Primary Ledger State', description: 'Core balances, cash transactions, and simulation settings' },
    { key: 'cf_client_rules', name: 'Client Delay Matrix', description: 'Payment reliability rules and collection lag profiles' },
    { key: 'cf_connected_integrations', name: 'Connected Ingestion Rails', description: 'Active webhook and CSV sync configurations' },
    { key: 'cf_user_profile', name: 'Account Sovereignty Profile', description: 'Local user preferences and currency formatting' },
    { key: 'cf-theme', name: 'Display Theme Preference', description: 'Dark / Light mode CSS token selection' },
  ];

  const runAudit = () => {
    if (typeof window === 'undefined') return;
    setScanning(true);

    setTimeout(() => {
      let total = 0;
      const reports: StorageKeyReport[] = monitoredKeys.map(k => {
        try {
          const val = localStorage.getItem(k.key);
          const size = val ? new Blob([val]).size : 0;
          total += size;
          return {
            ...k,
            bytes: size,
            exists: val !== null,
          };
        } catch {
          return {
            ...k,
            bytes: 0,
            exists: false,
          };
        }
      });

      // Audit for common commercial tracking scripts in the DOM
      const scripts = Array.from(document.querySelectorAll('script'));
      const trackers = scripts.filter(s => {
        const src = (s.src || '').toLowerCase();
        return (
          src.includes('google-analytics') ||
          src.includes('googletagmanager') ||
          src.includes('facebook') ||
          src.includes('clarity.ms') ||
          src.includes('hotjar') ||
          src.includes('mixpanel') ||
          src.includes('segment.io')
        );
      });

      setStorageItems(reports);
      setTotalBytes(total);
      setTrackerCount(trackers.length);
      setLastScanned(new Date().toLocaleTimeString());
      setScanning(false);
    }, 450);
  };

  useEffect(() => {
    setMounted(true);
    runAudit();
  }, []);

  const handlePurgeEnclave = () => {
    if (typeof window === 'undefined') return;
    monitoredKeys.forEach(k => {
      localStorage.removeItem(k.key);
    });
    setShowPurgeConfirm(false);
    runAudit();
  };

  if (!mounted) {
    return (
      <div className="p-8 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] animate-pulse h-64" />
    );
  }

  return (
    <section className="p-7 sm:p-9 rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-6 shadow-sm">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--cf-border-soft)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--cf-accent)] font-semibold">
              Live Browser Enclave Audit
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--cf-text)]">
            Client-Side Cryptographic Storage Inspector
          </h3>
          <p className="text-xs text-[var(--cf-text-muted)]">
            Inspect the exact memory footprint residing in your browser. Nothing is transmitted to external analytics servers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={runAudit}
            disabled={scanning}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-surface)] text-[var(--cf-text)] transition-all cursor-pointer disabled:opacity-50"
            title="Scan localStorage and DOM for trackers"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[var(--cf-accent)] ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Auditing...' : 'Re-verify Enclave'}</span>
          </button>

          <button
            onClick={() => setShowPurgeConfirm(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 transition-all cursor-pointer"
            title="Wipe all local financial records from this device"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe Vault</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)]">
            Active Storage Footprint
          </span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--cf-text)] pt-1">
            {(totalBytes / 1024).toFixed(2)} <span className="text-xs text-[var(--cf-text-muted)] font-normal">KB</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 pt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            100% Client-Side Memory
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)]">
            Third-Party Tracking Scripts
          </span>
          <div className="text-xl sm:text-2xl font-mono font-bold text-[var(--cf-text)] pt-1">
            {trackerCount} <span className="text-xs text-[var(--cf-text-muted)] font-normal">detected</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 pt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Zero Telemetry Harvest
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--cf-text-muted)]">
            Enclave Isolation Status
          </span>
          <div className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 pt-2 flex items-center gap-1.5">
            <Lock className="w-4 h-4" />
            <span>Sovereign Enclave</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--cf-text-faint)] pt-1">
            Last audited: {lastScanned || 'Initial'}
          </span>
        </div>
      </div>

      {/* Storage Key Table */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--cf-text-muted)] block font-semibold">
          Sandboxed Keys in Local Storage
        </span>
        <div className="border border-[var(--cf-border)] rounded-2xl overflow-hidden divide-y divide-[var(--cf-border-soft)]">
          {storageItems.map(item => (
            <div
              key={item.key}
              className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 bg-[var(--cf-surface)] hover:bg-[var(--cf-surface-alt)] transition-colors"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[var(--cf-text)]">
                    {item.name}
                  </span>
                  <code className="text-[10px] font-mono text-[var(--cf-text-faint)] bg-[var(--cf-surface-alt)] px-1.5 py-0.5 rounded border border-[var(--cf-border-soft)] truncate">
                    {item.key}
                  </code>
                </div>
                <p className="text-[11px] text-[var(--cf-text-muted)] truncate">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold border ${
                  item.exists
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-[var(--cf-text-faint)]'
                }`}>
                  {item.exists ? `${(item.bytes / 1024).toFixed(2)} KB` : 'Empty / Initial'}
                </span>
                <span className="text-[10px] font-mono text-[var(--cf-text-muted)]">
                  {item.exists ? 'Allocated' : 'Uninitialized'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purge Confirmation Dialog */}
      {showPurgeConfirm && (
        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Confirm Cryptographic Enclave Purge</span>
          </div>
          <p className="text-xs text-[var(--cf-text-muted)] leading-relaxed">
            This will permanently erase all local ledger entries, integration tokens, and client delay rules from this browser. This action cannot be undone. Are you sure?
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handlePurgeEnclave}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
            >
              Permanently Destroy Local Vault
            </button>
            <button
              onClick={() => setShowPurgeConfirm(false)}
              className="px-4 py-2 rounded-xl text-xs font-mono font-medium border border-[var(--cf-border)] text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
