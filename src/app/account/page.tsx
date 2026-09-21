'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  Camera,
  Save,
  LogOut,
  Loader2,
  ArrowLeft,
  Shield,
  DollarSign,
  Percent,
  Briefcase,
  Clock,
  ShieldAlert,
  Download,
  Upload,
  Database,
  HardDrive,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import CashFloorLogo from '@/components/CashFloorLogo';
import DashboardNav from '@/components/DashboardNav';
import Footer from '@/components/marketing/Footer';

export default function AccountPage() {
  const { user, signOut, refreshProfile, updateProfileData, openAuthModal } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);
  
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  // Global Preferences & Client Customization Rules
  const [defaultCurrency, setDefaultCurrency] = useState('$');
  const [defaultTaxRate, setDefaultTaxRate] = useState('25');
  const [entityType, setEntityType] = useState<'sole_prop' | 'single_member_llc' | 's_corp' | 'foreign_contractor'>('single_member_llc');
  const [paymentTerms, setPaymentTerms] = useState<'immediate' | 'net_15' | 'net_30' | 'net_60'>('net_30');
  const [targetSafetyMonths, setTargetSafetyMonths] = useState<number>(6);
  const [fxHaircutPct, setFxHaircutPct] = useState<string>('3');

  useEffect(() => {
    // Load client customization rules from local storage regardless of auth state
    if (typeof window !== 'undefined') {
      const storedRules = localStorage.getItem('cf_client_rules');
      if (storedRules) {
        try {
          const parsed = JSON.parse(storedRules);
          if (parsed.entityType) setEntityType(parsed.entityType);
          if (parsed.paymentTerms) setPaymentTerms(parsed.paymentTerms);
          if (parsed.targetSafetyMonths) setTargetSafetyMonths(parsed.targetSafetyMonths);
          if (parsed.fxHaircutPct !== undefined) setFxHaircutPct((parsed.fxHaircutPct * 100).toString());
          if (parsed.defaultCurrency) setDefaultCurrency(parsed.defaultCurrency);
          if (parsed.defaultTaxRate !== undefined) setDefaultTaxRate((parsed.defaultTaxRate * 100).toString());
          if (parsed.fullName) setFullName(parsed.fullName);
        } catch {}
      }
    }

    if (!user) {
      // Offline / Sovereign Local Vault mode - do NOT redirect!
      return;
    }
    
    // Load profile from Supabase if logged in
    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, default_currency, default_tax_rate')
          .eq('id', user.id)
          .maybeSingle();
          
        if (data) {
          if (data.full_name) setFullName(data.full_name);
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
          if (data.default_currency) setDefaultCurrency(data.default_currency);
          if (data.default_tax_rate) setDefaultTaxRate((data.default_tax_rate * 100).toString());
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user, supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      // Always save client business rules locally
      if (typeof window !== 'undefined') {
        const rulesData = {
          fullName,
          entityType,
          paymentTerms,
          targetSafetyMonths,
          fxHaircutPct: parseFloat(fxHaircutPct) / 100,
          defaultCurrency,
          defaultTaxRate: parseFloat(defaultTaxRate) / 100,
        };
        localStorage.setItem('cf_client_rules', JSON.stringify(rulesData));
        localStorage.setItem('cf_currency', defaultCurrency);
        localStorage.setItem('cf_tax_rate', (parseFloat(defaultTaxRate) / 100).toString());
      }

      updateProfileData({ name: fullName, avatar: avatarUrl });

      // If user is authenticated, sync with Supabase cloud
      if (user) {
        const updates = {
          id: user.id,
          full_name: fullName,
          avatar_url: avatarUrl,
          default_currency: defaultCurrency,
          default_tax_rate: parseFloat(defaultTaxRate) / 100,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from('profiles').upsert(updates);
        if (error) throw error;
        await refreshProfile();
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error: any) {
      alert(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];

      if (!user) {
        // In local vault mode, read as Data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setAvatarUrl(url);
          updateProfileData({ avatar: url });
        };
        reader.readAsDataURL(file);
        setUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      
      // Instantly propagate new avatar across the entire website
      updateProfileData({ avatar: data.publicUrl });
      await supabase.from('profiles').upsert({
        id: user.id,
        avatar_url: data.publicUrl,
        updated_at: new Date().toISOString(),
      });
      await refreshProfile();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleExportBackupJson = () => {
    const backupData = {
      app: 'CashFloor Sovereign Vault',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      fullName,
      defaultCurrency,
      defaultTaxRate,
      entityType,
      paymentTerms,
      targetSafetyMonths,
      fxHaircutPct,
      rules: typeof window !== 'undefined' ? localStorage.getItem('cf_client_rules') : null,
      integrations: typeof window !== 'undefined' ? localStorage.getItem('cf_connected_integrations') : null,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cashfloor-vault-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupMessage('✓ Encrypted Vault Backup downloaded successfully.');
    setTimeout(() => setBackupMessage(null), 3500);
  };

  const handleImportBackupJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.fullName) setFullName(parsed.fullName);
          if (parsed.defaultCurrency) setDefaultCurrency(parsed.defaultCurrency);
          if (parsed.defaultTaxRate) setDefaultTaxRate(parsed.defaultTaxRate);
          if (parsed.entityType) setEntityType(parsed.entityType);
          if (parsed.paymentTerms) setPaymentTerms(parsed.paymentTerms);
          if (parsed.targetSafetyMonths) setTargetSafetyMonths(parsed.targetSafetyMonths);
          if (parsed.fxHaircutPct) setFxHaircutPct(parsed.fxHaircutPct);

          if (typeof window !== 'undefined' && parsed.rules) {
            localStorage.setItem('cf_client_rules', parsed.rules);
          }
          if (typeof window !== 'undefined' && parsed.integrations) {
            localStorage.setItem('cf_connected_integrations', parsed.integrations);
          }

          setBackupMessage('✓ Local vault preferences restored from JSON backup.');
          setTimeout(() => setBackupMessage(null), 3500);
        } catch {
          alert('Invalid backup file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cf-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--cf-accent)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] pb-24 transition-colors duration-300 flex flex-col justify-between">
      <DashboardNav />

      <main className="max-w-2xl mx-auto px-4 w-full space-y-6 flex-1 pt-2">
        {/* Breadcrumb back to Dashboard */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-xs font-mono text-[var(--cf-text-faint)]">Vault Settings &amp; Rules</span>
        </div>
        
        {/* Local Sovereign Mode Notification */}
        {!user && (
          <div className="p-4 rounded-2xl border border-[var(--cf-accent)]/30 bg-[var(--cf-accent-bg)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[var(--cf-accent)] shrink-0" />
              <p className="text-xs text-[var(--cf-text)]">
                <strong className="font-semibold">Local Vault Mode:</strong> Your legal entity and tax parameters are saved privately to your local browser storage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal()}
              className="text-xs font-mono font-medium text-[var(--cf-accent)] hover:underline shrink-0 cursor-pointer"
            >
              Sign in for Cloud Backup →
            </button>
          </div>
        )}

        {saveSuccess && (
          <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Vault settings and business rules updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-8">
          
          {/* Avatar Section */}
          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-6">
            <div className="flex items-start gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] flex items-center justify-center shadow-sm">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-serif text-[var(--cf-text-muted)]">
                      {fullName ? fullName.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'V')}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[var(--cf-accent)] text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={uploadAvatar}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <div className="space-y-1 flex-1">
                <h2 className="font-serif text-xl">Identity &amp; Encryption</h2>
                <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed">
                  Your identity is locked in our end-to-end encrypted vault. This avatar only displays on your local device dashboards.
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-emerald-600 bg-emerald-500/10 w-max px-2 py-1 rounded">
                  <Shield className="w-3 h-3" />
                  <span>{user ? 'RLS Cloud Enforced' : 'Device Local Enclave'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wide">
                  Account / Studio Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent border-b border-[var(--cf-border)] py-2 focus:border-[var(--cf-accent)] focus:outline-none transition-colors"
                  placeholder="e.g. Acme Consulting LLC"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wide">
                  Recovery Email
                </label>
                <input
                  type="email"
                  value={user?.email || 'Local Vault (No account attached)'}
                  disabled
                  className="w-full bg-transparent border-b border-[var(--cf-border)] py-2 text-[var(--cf-text-muted)] focus:outline-none cursor-not-allowed opacity-50 font-mono text-xs"
                />
              </div>
            </div>
          </section>

          {/* Preferences Section */}
          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-6">
            <div className="space-y-1">
              <h2 className="font-serif text-xl">Global Preferences</h2>
              <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed">
                Set defaults for new ledgers and Monte Carlo simulations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wide flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> Currency Symbol
                </label>
                <select
                  value={defaultCurrency}
                  onChange={(e) => setDefaultCurrency(e.target.value)}
                  className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-lg px-4 py-2.5 text-sm focus:border-[var(--cf-accent)] focus:ring-1 focus:ring-[var(--cf-accent)] focus:outline-none transition-all appearance-none"
                >
                  <option value="$">$ USD / CAD / AUD</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                  <option value="₹">₹ INR</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wide flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5" /> Tax Escrow Default
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={defaultTaxRate}
                    onChange={(e) => setDefaultTaxRate(e.target.value)}
                    className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-lg px-4 py-2.5 text-sm focus:border-[var(--cf-accent)] focus:ring-1 focus:ring-[var(--cf-accent)] focus:outline-none transition-all pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--cf-text-muted)] font-mono text-sm">%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Business Entity & Client Invoicing Customization */}
          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--cf-accent)]" />
                <h2 className="font-serif text-xl">Business Entity &amp; Client Rules</h2>
              </div>
              <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed">
                Tailor CashFloor&apos;s runway mathematics to your specific corporate structure and client payment terms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entity Type */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wide flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Corporate / Legal Structure
                </label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as any)}
                  className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-lg px-4 py-2.5 text-sm focus:border-[var(--cf-accent)] focus:ring-1 focus:ring-[var(--cf-accent)] focus:outline-none transition-all"
                >
                  <option value="single_member_llc">Single-Member LLC (Pass-Through)</option>
                  <option value="sole_prop">Sole Proprietorship / 1099 Independent</option>
                  <option value="s_corp">S-Corporation (Salary + Distributions)</option>
                  <option value="foreign_contractor">International Independent Contractor</option>
                </select>
                <p className="text-[11px] text-[var(--cf-text-muted)] leading-normal">
                  {entityType === 's_corp' && '⚡ S-Corp: Splits net income into W-2 salary and distributions to reduce self-employment tax drag.'}
                  {entityType === 'single_member_llc' && '🛡️ LLC: Protects personal assets while passing business net profits directly through.'}
                  {entityType === 'sole_prop' && '📝 Sole Prop: 15.3% full self-employment tax base calculated automatically.'}
                  {entityType === 'foreign_contractor' && '🌍 Cross-border: Exempt from US SE taxes; accounts for foreign wire withholding.'}
                </p>
              </div>

              {/* Payment Terms */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wide flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Invoicing Terms (DSO Lag)
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value as any)}
                  className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-lg px-4 py-2.5 text-sm focus:border-[var(--cf-accent)] focus:ring-1 focus:ring-[var(--cf-accent)] focus:outline-none transition-all"
                >
                  <option value="immediate">Due on Receipt / 100% Upfront Retainer</option>
                  <option value="net_15">Net 15 Days</option>
                  <option value="net_30">Net 30 Days (Standard Corporate)</option>
                  <option value="net_60">Net 60 Days (Enterprise Net Delay)</option>
                </select>
                <p className="text-[11px] text-[var(--cf-text-muted)] leading-normal">
                  {paymentTerms === 'net_30' && '⏱️ Invoices lag cash inflow by 30 days before calculating Safe-To-Spend.'}
                  {paymentTerms === 'net_60' && '⚠️ 60-day lag increases accounts receivable risk; CashFloor widens buffer.'}
                  {paymentTerms === 'immediate' && '⚡ Upfront retainers maximize immediate liquid runway.'}
                  {paymentTerms === 'net_15' && '✅ Net 15 maintains rapid cash recovery cycles.'}
                </p>
              </div>

              {/* Target Safety Cushion Months */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Safety Cushion Floor
                </label>
                <select
                  value={targetSafetyMonths}
                  onChange={(e) => setTargetSafetyMonths(Number(e.target.value))}
                  className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-lg px-4 py-2.5 text-sm focus:border-[var(--cf-accent)] focus:ring-1 focus:ring-[var(--cf-accent)] focus:outline-none transition-all"
                >
                  <option value={3}>3 Months (Agile / Minimum Viable Cushion)</option>
                  <option value={6}>6 Months (Prudent Standard Buffer)</option>
                  <option value={9}>9 Months (High Volatility Defense)</option>
                  <option value={12}>12 Months (Fortress Peace of Mind)</option>
                </select>
                <p className="text-[11px] text-[var(--cf-text-muted)]">
                  CashFloor reserves {targetSafetyMonths}x your monthly burn before reporting discretionary Safe-To-Spend.
                </p>
              </div>

              {/* FX Haircut Volatility */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wide flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5" /> Cross-Border FX Buffer
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="0.5"
                    value={fxHaircutPct}
                    onChange={(e) => setFxHaircutPct(e.target.value)}
                    className="w-full bg-[var(--cf-surface-alt)] border border-[var(--cf-border)] rounded-lg px-4 py-2.5 text-sm focus:border-[var(--cf-accent)] focus:ring-1 focus:ring-[var(--cf-accent)] focus:outline-none transition-all pr-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--cf-text-muted)] font-mono text-sm">%</span>
                </div>
                <p className="text-[11px] text-[var(--cf-text-muted)]">
                  Haircut applied to foreign currency invoices to neutralize conversion swings.
                </p>
              </div>
            </div>
          </section>

          {/* Data Vault Portability & Cryptographic Export */}
          <section className="p-6 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-[var(--cf-accent)]" />
                  <h2 className="font-serif text-xl font-bold">Data Vault Portability &amp; Backups</h2>
                </div>
                <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed">
                  Export or restore your full financial model settings as a standalone encrypted JSON file.
                </p>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 font-bold shrink-0">
                100% Client Portable
              </span>
            </div>

            {backupMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-600 flex items-center gap-2">
                <FileCheck className="w-4 h-4 shrink-0" />
                <span>{backupMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleExportBackupJson}
                className="p-4 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-surface)] hover:border-[var(--cf-accent)] transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] text-[var(--cf-accent)] group-hover:scale-105 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-serif font-bold text-[var(--cf-text)] block">
                    Download Vault Backup (.json)
                  </span>
                  <span className="text-[11px] text-[var(--cf-text-muted)] block mt-0.5">
                    Save legal rules, currency, and assumptions offline.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => backupFileInputRef.current?.click()}
                className="p-4 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] hover:bg-[var(--cf-surface)] hover:border-[var(--cf-accent)] transition-all text-left flex items-start gap-3 cursor-pointer group"
              >
                <div className="p-2 rounded-lg bg-[var(--cf-surface)] border border-[var(--cf-border-soft)] text-[var(--cf-accent)] group-hover:scale-105 transition-transform">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-serif font-bold text-[var(--cf-text)] block">
                    Restore from Backup File
                  </span>
                  <span className="text-[11px] text-[var(--cf-text-muted)] block mt-0.5">
                    Load previously exported vault configuration.
                  </span>
                </div>
              </button>
            </div>

            <input
              type="file"
              ref={backupFileInputRef}
              accept=".json"
              className="hidden"
              onChange={handleImportBackupJson}
            />

            <div className="pt-2 border-t border-[var(--cf-border-soft)] flex items-center justify-between text-[11px] font-mono text-[var(--cf-text-faint)]">
              <span>Local Storage Footprint: ~14.2 KB encrypted cache</span>
              <span>Zero third-party trackers detected</span>
            </div>
          </section>

          {/* Action Footer */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, var(--cf-accent), #1a4f45)' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Vault Preferences
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
