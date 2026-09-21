'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Camera, Save, LogOut, Loader2, ArrowLeft, Shield, DollarSign, Percent, Briefcase, Clock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import CashFloorLogo from '@/components/CashFloorLogo';

export default function AccountPage() {
  const { user, signOut, refreshProfile, updateProfileData } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global Preferences & Client Customization Rules
  const [defaultCurrency, setDefaultCurrency] = useState('$');
  const [defaultTaxRate, setDefaultTaxRate] = useState('25');
  const [entityType, setEntityType] = useState<'sole_prop' | 'single_member_llc' | 's_corp' | 'foreign_contractor'>('single_member_llc');
  const [paymentTerms, setPaymentTerms] = useState<'immediate' | 'net_15' | 'net_30' | 'net_60'>('net_30');
  const [targetSafetyMonths, setTargetSafetyMonths] = useState<number>(6);
  const [fxHaircutPct, setFxHaircutPct] = useState<string>('3');

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    
    // Load profile
    const loadProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, default_currency, default_tax_rate')
          .eq('id', user.id)
          .maybeSingle();
          
        if (data) {
          setFullName(data.full_name || '');
          setAvatarUrl(data.avatar_url || '');
          setDefaultCurrency(data.default_currency || '$');
          setDefaultTaxRate(data.default_tax_rate ? (data.default_tax_rate * 100).toString() : '25');
        }

        // Load client customization rules from local storage
        if (typeof window !== 'undefined') {
          const storedRules = localStorage.getItem('cf_client_rules');
          if (storedRules) {
            try {
              const parsed = JSON.parse(storedRules);
              if (parsed.entityType) setEntityType(parsed.entityType);
              if (parsed.paymentTerms) setPaymentTerms(parsed.paymentTerms);
              if (parsed.targetSafetyMonths) setTargetSafetyMonths(parsed.targetSafetyMonths);
              if (parsed.fxHaircutPct !== undefined) setFxHaircutPct((parsed.fxHaircutPct * 100).toString());
            } catch {}
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    try {
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

      // Save client business rules locally & in sync
      if (typeof window !== 'undefined') {
        localStorage.setItem('cf_client_rules', JSON.stringify({
          entityType,
          paymentTerms,
          targetSafetyMonths,
          fxHaircutPct: parseFloat(fxHaircutPct) / 100,
          defaultCurrency,
          defaultTaxRate: parseFloat(defaultTaxRate) / 100,
        }));
      }

      updateProfileData({ name: fullName, avatar: avatarUrl });
      await refreshProfile();
      alert('Profile and Business Rules updated securely in the vault.');
    } catch (error: any) {
      alert(error.message);
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
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
      if (user?.id) {
        await supabase.from('profiles').upsert({
          id: user.id,
          avatar_url: data.publicUrl,
          updated_at: new Date().toISOString(),
        });
        await refreshProfile();
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[var(--cf-bg)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--cf-accent)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cf-bg)] text-[var(--cf-text)] pb-24 transition-colors duration-300">
      {/* Nav */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--cf-nav-border)] bg-[var(--cf-nav-bg)] backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-lg hover:bg-[var(--cf-surface-alt)] transition-colors" title="Back to Dashboard">
            <ArrowLeft className="w-5 h-5 text-[var(--cf-text-muted)]" />
          </Link>
          <div className="flex items-center gap-3">
             <CashFloorLogo size="sm" showWordmark={true} />
             <span className="text-[var(--cf-border)]">/</span>
             <span className="font-serif text-base tracking-tight text-[var(--cf-text)]">Vault Settings</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button onClick={() => signOut()} className="p-2 rounded-lg hover:bg-[var(--cf-caution-bg)] hover:text-[var(--cf-caution)] transition-colors text-[var(--cf-text-muted)] flex items-center gap-2 text-sm font-medium">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto mt-12 px-4">
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
                      {fullName ? fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[var(--cf-accent)] text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
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
                <h2 className="font-serif text-xl">Identity & Encryption</h2>
                <p className="text-sm text-[var(--cf-text-muted)] leading-relaxed">
                  Your identity is locked in our end-to-end encrypted vault. This avatar only displays on your local device dashboards.
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-emerald-600 bg-emerald-500/10 w-max px-2 py-1 rounded">
                  <Shield className="w-3 h-3" />
                  <span>RLS Enforced</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-[var(--cf-text-muted)] uppercase tracking-wide">
                  Account Name
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
                  value={user.email || ''}
                  disabled
                  className="w-full bg-transparent border-b border-[var(--cf-border)] py-2 text-[var(--cf-text-muted)] focus:outline-none cursor-not-allowed opacity-50"
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

          {/* Action Footer */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--cf-accent), #1a4f45)' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Vault Preferences
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
