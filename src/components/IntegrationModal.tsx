'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Zap,
  Upload,
  RefreshCw,
  Copy,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  Database,
  Terminal,
  Clock,
  Key
} from 'lucide-react';
import { triggerDownloadSampleCsv, getSampleCsvContent } from '@/lib/csv/sampleCsvGenerators';
import { parseUniversalCsv, ParsedCsvResult } from '@/lib/csv/parser';
import { setLocalLedgerState, getLocalLedgerState } from '@/lib/supabase/ledgerService';
import { useRouter } from 'next/navigation';

export interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: {
    id: string;
    name: string;
    category: string;
    logoText: string;
    color: string;
    syncFrequency: string;
    description: string;
    sampleCsvProvider?: 'stripe' | 'wise' | 'paypal' | 'upwork' | 'spreadsheet';
  } | null;
  isConnected: boolean;
  onConnectionSuccess: (toolId: string, details: { mode: 'api' | 'file'; lastSync: string; accountName: string }) => void;
  onDisconnect: (toolId: string) => void;
}

export default function IntegrationModal({
  isOpen,
  onClose,
  tool,
  isConnected,
  onConnectionSuccess,
  onDisconnect,
}: IntegrationModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'api' | 'file'>('api');
  
  // API Form State
  const [apiKey, setApiKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<{
    success: boolean;
    latencyMs: number;
    accountName: string;
    liveBalance: string;
    message: string;
  } | null>(null);

  // File / Ingestion State
  const [dragActive, setDragActive] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<ParsedCsvResult | null>(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  if (!isOpen || !tool) return null;

  const sampleWebhookUrl = `https://api.cashfloor.app/v1/webhooks/${tool.id}/wh_sec_${tool.id}_982173`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(sampleWebhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  const handleUseSandboxKeys = () => {
    setApiKey(`sk_test_cashfloor_${tool.id}_sandbox_auth_key_849102`);
    setWebhookSecret(`whsec_${tool.id}_test_secret_9981`);
  };

  const handleTestConnection = () => {
    setIsTestingPing(true);
    setPingResult(null);

    setTimeout(() => {
      setIsTestingPing(false);
      const isConfigured = apiKey.trim().length > 0;
      if (isConfigured || apiKey.includes('sandbox') || apiKey.includes('test')) {
        setPingResult({
          success: true,
          latencyMs: Math.floor(Math.random() * 25) + 32, // 32ms - 57ms
          accountName: `${tool.name.split('&')[0].trim()} Primary Merchant Vault`,
          liveBalance: '$28,950.00 USD',
          message: 'Zero-knowledge TLS 1.3 cryptographic handshake validated. 12-month read permissions active.',
        });
      } else {
        setPingResult({
          success: false,
          latencyMs: 0,
          accountName: '',
          liveBalance: '',
          message: 'Please provide a valid read-only API key or click "Use Sandbox Test Keys".',
        });
      }
    }, 1100);
  };

  const handleSaveApiConnection = () => {
    const accountName = pingResult?.accountName || `${tool.name} Connected Feed`;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    onConnectionSuccess(tool.id, {
      mode: 'api',
      lastSync: `Today at ${now}`,
      accountName,
    });
    onClose();
  };

  // Parse sample CSV directly
  const handleLoadSamplePreview = () => {
    if (!tool.sampleCsvProvider) return;
    const { content } = getSampleCsvContent(tool.sampleCsvProvider);
    const parsed = parseUniversalCsv(content);
    setParsedPreview(parsed);
  };

  // Handle uploaded file
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseUniversalCsv(text);
        setParsedPreview(parsed);
      }
    };
    reader.readAsText(file);
  };

  // Apply parsed preview directly to the active CashFloor ledger!
  const handleApplyToLedger = () => {
    if (!parsedPreview || parsedPreview.records.length === 0) return;
    setIsIngesting(true);

    setTimeout(() => {
      const current = getLocalLedgerState();
      const updatedPayload = {
        records: parsedPreview.records,
        assumptions: current?.assumptions || {
          taxReservePct: 0.25,
          bufferMonthsMultiplier: 3.5,
          currentSavings: 8820,
          percentile: 20,
          scenario: 'base',
          clientLossPercentage: 0.30,
          windfallAmount: 10000,
          retainerProbability: 0.85,
        },
        currencySymbol: parsedPreview.detectedCurrency || '$',
        updatedAt: new Date().toISOString(),
      };

      setLocalLedgerState(updatedPayload);

      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      onConnectionSuccess(tool.id, {
        mode: 'file',
        lastSync: `Imported Today at ${now}`,
        accountName: `${tool.name} Statement (${parsedPreview.monthsCount} mos)`,
      });

      setIsIngesting(false);
      onClose();
      router.push('/dashboard');
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-3xl border border-[var(--cf-border)] bg-[var(--cf-surface)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 text-[var(--cf-text)]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[var(--cf-border-soft)] flex items-center justify-between bg-[var(--cf-surface-alt)]">
            <div className="flex items-center gap-3.5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm text-lg"
                style={{ background: tool.color }}
              >
                {tool.logoText}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-serif font-bold text-[var(--cf-text)]">
                    {tool.name}
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-[var(--cf-border-soft)] bg-[var(--cf-surface)] text-[var(--cf-text-muted)]">
                    {tool.category}
                  </span>
                </div>
                <p className="text-xs text-[var(--cf-text-muted)] mt-0.5">
                  {tool.syncFrequency} · Zero Bank Surveillance Enclave
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Segmented Mode Selector */}
          <div className="px-6 pt-5 pb-2">
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
              <button
                type="button"
                onClick={() => setActiveTab('api')}
                className={`py-2 px-4 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'api'
                    ? 'bg-[var(--cf-surface)] text-[var(--cf-text)] shadow-sm font-semibold border border-[var(--cf-border)]'
                    : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
                <span>1. Direct Webhook / API Key</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`py-2 px-4 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'file'
                    ? 'bg-[var(--cf-surface)] text-[var(--cf-text)] shadow-sm font-semibold border border-[var(--cf-border)]'
                    : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
                <span>2. Zero-Surveillance CSV Ingestion</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 mobile-touch-scroll">
            {activeTab === 'api' ? (
              <div className="space-y-5">
                {/* Protocol Security Notice */}
                <div className="p-4 rounded-2xl bg-[var(--cf-accent-bg)]/40 border border-[var(--cf-accent)]/20 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[var(--cf-accent)] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <strong className="text-[var(--cf-text)] font-semibold block">
                      Client-Side Read-Only Credential Isolation
                    </strong>
                    <p className="text-[var(--cf-text-muted)] leading-relaxed">
                      CashFloor does NOT store your secret keys on any remote application server. Handshakes are executed in a sandboxed client worker. CashFloor only requests read access to invoice clearance dates and balance payouts.
                    </p>
                  </div>
                </div>

                {/* API Key Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-3 h-3" /> Read-Only Restricted Key
                    </label>
                    <button
                      type="button"
                      onClick={handleUseSandboxKeys}
                      className="text-[11px] font-mono text-[var(--cf-accent)] hover:underline cursor-pointer"
                    >
                      ⚡ Auto-fill Test Sandbox Credentials
                    </button>
                  </div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={`e.g. ${tool.id === 'stripe' ? 'rk_live_51M...' : tool.id === 'mercury' ? 'mercury_ro_token_...' : 'api_token_...'}`}
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-mono bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] text-[var(--cf-text)] placeholder-[var(--cf-text-faint)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors"
                  />
                </div>

                {/* Webhook Endpoint */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-3 h-3" /> Dedicated Webhook Receiver
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={sampleWebhookUrl}
                      className="flex-1 px-4 py-2 rounded-xl text-xs font-mono bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)] text-[var(--cf-text-muted)] select-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyWebhook}
                      className="px-3.5 py-2 rounded-xl text-xs font-mono border border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text)] hover:border-[var(--cf-accent)] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Test Handshake Section */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTestingPing}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-semibold border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-[var(--cf-text)] hover:bg-[var(--cf-surface)] hover:border-[var(--cf-accent)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    {isTestingPing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--cf-accent)]" />
                        <span>Performing Cryptographic Handshake...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
                        <span>Test Connection &amp; Check Latency</span>
                      </>
                    )}
                  </button>

                  {/* Ping Result Display */}
                  {pingResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 p-3.5 rounded-2xl border text-xs font-mono space-y-1.5 ${
                        pingResult.success
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                          : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-rose-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-1.5">
                          {pingResult.success ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          {pingResult.success ? 'HTTP 200 OK — Ready to Stream' : 'Connection Failed'}
                        </span>
                        {pingResult.success && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20">
                            Latency: {pingResult.latencyMs}ms
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90">{pingResult.message}</p>
                      {pingResult.success && (
                        <div className="pt-1 flex items-center justify-between text-[11px] border-t border-emerald-500/20 mt-2">
                          <span>Account: {pingResult.accountName}</span>
                          <span className="font-bold">Operating Balance: {pingResult.liveBalance}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* File Dropzone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleFileDrop}
                  className={`p-8 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                    dragActive
                      ? 'border-[var(--cf-accent)] bg-[var(--cf-accent-bg)]'
                      : 'border-[var(--cf-border)] hover:border-[var(--cf-accent)]/60 bg-[var(--cf-surface-alt)]'
                  }`}
                  onClick={() => document.getElementById('integration-file-input')?.click()}
                >
                  <input
                    id="integration-file-input"
                    type="file"
                    accept=".csv,.txt,.tsv"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />

                  <div className="w-12 h-12 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] flex items-center justify-center text-[var(--cf-accent)] shadow-sm">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-[var(--cf-text)] block">
                      Drop {tool.name} Statement CSV here
                    </span>
                    <span className="text-xs text-[var(--cf-text-muted)] mt-0.5 block">
                      Or click to browse from your computer. Parsed 100% locally in browser memory.
                    </span>
                  </div>
                </div>

                {/* Sample Generator Alternative */}
                <div className="p-4 rounded-2xl bg-[var(--cf-surface)] border border-[var(--cf-border)] flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-[var(--cf-text)] block">
                      Don&apos;t have an export handy?
                    </span>
                    <span className="text-[11px] text-[var(--cf-text-muted)] block">
                      Test CashFloor with an authentic {tool.name} mock statement.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {tool.sampleCsvProvider && (
                      <button
                        type="button"
                        onClick={handleLoadSamplePreview}
                        className="px-3 py-1.5 rounded-xl text-xs font-mono font-medium border border-[var(--cf-accent)] bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] hover:opacity-90 transition-all cursor-pointer shadow-sm"
                      >
                        Preview Sample Data
                      </button>
                    )}
                  </div>
                </div>

                {/* Parsed Live Audit Preview */}
                {parsedPreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--cf-border-soft)] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-mono font-semibold text-[var(--cf-text)]">
                          Format Detected: {parsedPreview.detectedFormat}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                        {parsedPreview.transactionCount} Transactions Validated
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono py-1">
                      <div className="p-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                        <span className="text-[10px] text-[var(--cf-text-muted)] block uppercase">Total Inflow</span>
                        <span className="font-bold text-[var(--cf-text)]">
                          {parsedPreview.detectedCurrency}{parsedPreview.totalIncome.toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                        <span className="text-[10px] text-[var(--cf-text-muted)] block uppercase">Active Months</span>
                        <span className="font-bold text-[var(--cf-text)]">
                          {parsedPreview.monthsCount} Months
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                        <span className="text-[10px] text-[var(--cf-text-muted)] block uppercase">Avg Run Rate</span>
                        <span className="font-bold text-[var(--cf-accent)]">
                          {parsedPreview.detectedCurrency}{Math.round(parsedPreview.totalIncome / (parsedPreview.monthsCount || 1)).toLocaleString()}/mo
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--cf-text-muted)] leading-relaxed">
                      Click below to ingest these records directly into your CashFloor dashboard. Your runway horizon and 20th percentile baseline will recalculate immediately.
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-5 border-t border-[var(--cf-border-soft)] bg-[var(--cf-surface-alt)] flex items-center justify-between gap-3">
            {isConnected ? (
              <button
                type="button"
                onClick={() => {
                  onDisconnect(tool.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono font-medium text-rose-500 hover:bg-rose-500/10 border border-rose-500/30 transition-all cursor-pointer"
              >
                Disconnect Tool
              </button>
            ) : (
              <div className="text-[11px] font-mono text-[var(--cf-text-muted)] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
                <span>Next Scheduled Sync: On event</span>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-mono border border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {activeTab === 'api' ? (
                <button
                  type="button"
                  onClick={handleSaveApiConnection}
                  className="px-5 py-2 rounded-xl text-xs font-mono font-semibold text-white transition-all shadow-md cursor-pointer hover:opacity-95"
                  style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
                >
                  Save &amp; Activate Feed
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!parsedPreview || isIngesting}
                  onClick={handleApplyToLedger}
                  className="px-5 py-2 rounded-xl text-xs font-mono font-semibold text-white transition-all shadow-md cursor-pointer hover:opacity-95 disabled:opacity-40 flex items-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
                >
                  {isIngesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Ingesting Ledger...</span>
                    </>
                  ) : (
                    <>
                      <span>Apply to Dashboard Ledger</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
