'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Check,
  Sparkles,
  User,
  Zap,
  Briefcase,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAuth, DEMO_PERSONAS, DemoPersonaKey } from '@/lib/auth/AuthContext';

interface AuthModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  message?: string;
  defaultTab?: 'signin' | 'signup' | 'demo';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  message: propMessage,
  defaultTab: propDefaultTab,
}) => {
  const {
    authModalOpen,
    authModalMessage,
    authModalDefaultTab,
    closeAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithDemo,
    signInWithGoogle,
  } = useAuth();

  // Use props if passed, otherwise fall back to context state
  const isOpen = propIsOpen !== undefined ? propIsOpen : authModalOpen;
  const onClose = propOnClose !== undefined ? propOnClose : closeAuthModal;
  const message = propMessage || authModalMessage;
  const initialTab = propDefaultTab || authModalDefaultTab || 'signin';

  const [tab, setTab] = useState<'signin' | 'signup' | 'demo'>(initialTab);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError(null);
      setSuccess(false);
      setLoading(false);
    }
  }, [isOpen, initialTab]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  const handleTabChange = (t: 'signin' | 'signup' | 'demo') => {
    setError(null);
    setTab(t);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);

    const res = await signInWithEmail(email, password);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Welcome back! Full Pro suite unlocked.');
      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 450);
    } else {
      const errStr = res.error || 'Sign in failed.';
      if (errStr.toLowerCase().includes('invalid login credentials')) {
        setError('Incorrect password or account not found yet.');
      } else {
        setError(errStr);
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError(null);

    const res = await signUpWithEmail(email, password, fullName);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(
        res.autoConfirmed
          ? 'Account created! Welcome to CashFloor Pro.'
          : 'Welcome to CashFloor Pro! Instant access granted.'
      );
      setSuccess(true);
      setTimeout(() => {
        onClose();
        resetForm();
      }, 450);
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  const handleDemoSelect = (key: DemoPersonaKey) => {
    setLoading(true);
    signInWithDemo(key);
    const p = DEMO_PERSONAS[key];
    setSuccessMessage(`Signed in as ${p.name}! Pro features unlocked.`);
    setSuccess(true);
    setTimeout(() => {
      onClose();
      resetForm();
    }, 450);
  };

  const handleGoogleClick = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (e: any) {
      setLoading(false);
      setError('Google Sign-In failed. Please try email or 1-Click Demo.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-2xl overflow-hidden z-10"
            style={{
              background: 'var(--cf-surface)',
              border: '1px solid var(--cf-border)',
              boxShadow: 'var(--cf-shadow-xl)',
            }}
          >
            {/* Top decorative accent bar */}
            <div
              className="h-1.5 w-full"
              style={{
                background: 'linear-gradient(90deg, #2F6F62, #4E9B8A, #D4AF37, #2F6F62)',
                backgroundSize: '200% 100%',
              }}
            />

            {/* Header */}
            <div className="p-6 pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase"
                    style={{
                      background: 'var(--cf-accent-bg)',
                      color: 'var(--cf-accent)',
                      border: '1px solid var(--cf-accent-border)',
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    Member Portal
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-medium tracking-tight" style={{ color: 'var(--cf-text)' }}>
                  {tab === 'signin' && 'Sign in to CashFloor'}
                  {tab === 'signup' && 'Create Pro Account'}
                  {tab === 'demo' && 'Instant 1-Click Access'}
                </h2>
                <p className="text-xs mt-1" style={{ color: 'var(--cf-text-muted)' }}>
                  {tab === 'signin' && 'Access your synced cash runway, models, and conservative floor.'}
                  {tab === 'signup' && 'Unlock the 12-month double-entry ledger, stress lab, and cloud sync.'}
                  {tab === 'demo' && 'Explore the full unlocked suite immediately with pre-loaded scenarios.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl transition-colors cursor-pointer"
                style={{ color: 'var(--cf-text-muted)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--cf-surface-alt)';
                  e.currentTarget.style.color = 'var(--cf-text)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--cf-text-muted)';
                }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Context message if triggered by locked feature */}
            {message && (
              <div
                className="mx-6 mb-4 px-4 py-3 rounded-xl border flex items-center gap-3 text-xs"
                style={{
                  background: 'var(--cf-accent-bg)',
                  borderColor: 'var(--cf-accent-border)',
                  color: 'var(--cf-text)',
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'var(--cf-surface)', color: 'var(--cf-accent)' }}
                >
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{message}</p>
                  <p className="text-[11px] opacity-80">Free sign-in instantly removes all feature locks.</p>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="p-6 pt-0">
              {success ? (
                /* Success View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center space-y-4"
                >
                  <div
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(47,111,98,0.2), rgba(47,111,98,0.4))',
                      border: '2px solid var(--cf-accent)',
                    }}
                  >
                    <Check className="w-8 h-8 text-[var(--cf-accent)]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-medium" style={{ color: 'var(--cf-text)' }}>
                      Authentication Verified
                    </h3>
                    <p className="text-xs mt-1 font-mono" style={{ color: 'var(--cf-text-muted)' }}>
                      {successMessage}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Tab Selector */}
                  <div
                    className="grid grid-cols-3 rounded-xl p-1 mb-5 text-xs font-medium"
                    style={{ background: 'var(--cf-surface-alt)' }}
                  >
                    <button
                      type="button"
                      onClick={() => handleTabChange('signin')}
                      className="py-2 rounded-lg transition-all cursor-pointer text-center"
                      style={{
                        background: tab === 'signin' ? 'var(--cf-surface)' : 'transparent',
                        color: tab === 'signin' ? 'var(--cf-text)' : 'var(--cf-text-muted)',
                        boxShadow: tab === 'signin' ? 'var(--cf-shadow-sm)' : 'none',
                        fontWeight: tab === 'signin' ? 600 : 500,
                      }}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange('signup')}
                      className="py-2 rounded-lg transition-all cursor-pointer text-center"
                      style={{
                        background: tab === 'signup' ? 'var(--cf-surface)' : 'transparent',
                        color: tab === 'signup' ? 'var(--cf-text)' : 'var(--cf-text-muted)',
                        boxShadow: tab === 'signup' ? 'var(--cf-shadow-sm)' : 'none',
                        fontWeight: tab === 'signup' ? 600 : 500,
                      }}
                    >
                      Create Account
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange('demo')}
                      className="py-2 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                      style={{
                        background: tab === 'demo' ? 'var(--cf-surface)' : 'transparent',
                        color: tab === 'demo' ? 'var(--cf-accent)' : 'var(--cf-text-muted)',
                        boxShadow: tab === 'demo' ? 'var(--cf-shadow-sm)' : 'none',
                        fontWeight: tab === 'demo' ? 600 : 500,
                      }}
                    >
                      <Zap className="w-3 h-3 text-[var(--cf-accent)]" />
                      1-Click Demo
                    </button>
                  </div>

                  {/* TAB 1: SIGN IN */}
                  {tab === 'signin' && (
                    <div className="space-y-4">
                      {/* Google SSO Button */}
                      <button
                        type="button"
                        onClick={handleGoogleClick}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl text-xs font-medium border transition-all cursor-pointer"
                        style={{
                          background: 'var(--cf-surface-alt)',
                          borderColor: 'var(--cf-border)',
                          color: 'var(--cf-text)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--cf-accent)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--cf-border)')}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px" style={{ background: 'var(--cf-border)' }} />
                        <span className="text-[11px]" style={{ color: 'var(--cf-text-faint)' }}>
                          or email & password
                        </span>
                        <div className="flex-1 h-px" style={{ background: 'var(--cf-border)' }} />
                      </div>

                      <form onSubmit={handleSignIn} className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--cf-text-muted)' }}>
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                              style={{ color: 'var(--cf-text-faint)' }}
                            />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              placeholder="name@consulting.com"
                              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-sans transition-colors"
                              style={{
                                background: 'var(--cf-surface-alt)',
                                border: '1px solid var(--cf-border)',
                                color: 'var(--cf-text)',
                                outline: 'none',
                              }}
                              onFocus={e => (e.currentTarget.style.borderColor = 'var(--cf-accent)')}
                              onBlur={e => (e.currentTarget.style.borderColor = 'var(--cf-border)')}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[11px] font-medium" style={{ color: 'var(--cf-text-muted)' }}>
                              Password
                            </label>
                            <button
                              type="button"
                              onClick={() => handleTabChange('demo')}
                              className="text-[11px] transition-colors"
                              style={{ color: 'var(--cf-accent)' }}
                            >
                              Need test access? Use 1-Click Demo
                            </button>
                          </div>
                          <div className="relative">
                            <Lock
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                              style={{ color: 'var(--cf-text-faint)' }}
                            />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-xs font-sans transition-colors"
                              style={{
                                background: 'var(--cf-surface-alt)',
                                border: '1px solid var(--cf-border)',
                                color: 'var(--cf-text)',
                                outline: 'none',
                              }}
                              onFocus={e => (e.currentTarget.style.borderColor = 'var(--cf-accent)')}
                              onBlur={e => (e.currentTarget.style.borderColor = 'var(--cf-border)')}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                              style={{ color: 'var(--cf-text-faint)' }}
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {error && (
                          <div
                            className="p-3 rounded-xl text-xs flex flex-col gap-1.5"
                            style={{ background: 'var(--cf-caution-bg)', color: 'var(--cf-caution)' }}
                          >
                            <p className="font-medium">{error}</p>
                            <div className="flex gap-3 text-[11px]">
                              <button
                                type="button"
                                onClick={() => handleTabChange('signup')}
                                className="underline font-semibold"
                              >
                                Create this account →
                              </button>
                              <button
                                type="button"
                                onClick={() => handleTabChange('demo')}
                                className="underline font-semibold"
                              >
                                Or try 1-Click Demo →
                              </button>
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-60 shadow-md"
                          style={{
                            background: 'linear-gradient(135deg, #2F6F62, #1a4f45)',
                          }}
                        >
                          {loading ? (
                            <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                          ) : (
                            <>
                              <span>Sign In to Pro Suite</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB 2: SIGN UP */}
                  {tab === 'signup' && (
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={handleGoogleClick}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl text-xs font-medium border transition-all cursor-pointer"
                        style={{
                          background: 'var(--cf-surface-alt)',
                          borderColor: 'var(--cf-border)',
                          color: 'var(--cf-text)',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--cf-accent)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--cf-border)')}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Sign up with Google
                      </button>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px" style={{ background: 'var(--cf-border)' }} />
                        <span className="text-[11px]" style={{ color: 'var(--cf-text-faint)' }}>
                          or email & password
                        </span>
                        <div className="flex-1 h-px" style={{ background: 'var(--cf-border)' }} />
                      </div>

                      <form onSubmit={handleSignUp} className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--cf-text-muted)' }}>
                          Full Name
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--cf-text-faint)' }}
                          />
                          <input
                            type="text"
                            value={fullName}
                            onChange={e => setFullName(e.target.value)}
                            placeholder="Alex Vance"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-sans transition-colors"
                            style={{
                              background: 'var(--cf-surface-alt)',
                              border: '1px solid var(--cf-border)',
                              color: 'var(--cf-text)',
                              outline: 'none',
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'var(--cf-accent)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'var(--cf-border)')}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--cf-text-muted)' }}>
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--cf-text-faint)' }}
                          />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="name@consulting.com"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-sans transition-colors"
                            style={{
                              background: 'var(--cf-surface-alt)',
                              border: '1px solid var(--cf-border)',
                              color: 'var(--cf-text)',
                              outline: 'none',
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'var(--cf-accent)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'var(--cf-border)')}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--cf-text-muted)' }}>
                          Create Password (at least 6 characters)
                        </label>
                        <div className="relative">
                          <Lock
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--cf-text-faint)' }}
                          />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-10 py-2.5 rounded-xl text-xs font-sans transition-colors"
                            style={{
                              background: 'var(--cf-surface-alt)',
                              border: '1px solid var(--cf-border)',
                              color: 'var(--cf-text)',
                              outline: 'none',
                            }}
                            onFocus={e => (e.currentTarget.style.borderColor = 'var(--cf-accent)')}
                            onBlur={e => (e.currentTarget.style.borderColor = 'var(--cf-border)')}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                            style={{ color: 'var(--cf-text-faint)' }}
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {error && (
                        <div
                          className="p-3 rounded-xl text-xs"
                          style={{ background: 'var(--cf-caution-bg)', color: 'var(--cf-caution)' }}
                        >
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer disabled:opacity-60 shadow-md"
                        style={{
                          background: 'linear-gradient(135deg, #2F6F62, #1a4f45)',
                        }}
                      >
                        {loading ? (
                          <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                        ) : (
                          <>
                            <span>Create Account & Unlock Pro</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                  )}

                  {/* TAB 3: INSTANT 1-CLICK DEMO */}
                  {tab === 'demo' && (
                    <div className="space-y-3">
                      <div
                        className="p-3 rounded-xl text-xs border"
                        style={{
                          background: 'var(--cf-surface-alt)',
                          borderColor: 'var(--cf-border)',
                          color: 'var(--cf-text-muted)',
                        }}
                      >
                        <p className="font-semibold text-[var(--cf-text)] mb-0.5">Instant Pro Access</p>
                        <p className="text-[11px] leading-relaxed">
                          Select a realistic freelance persona to test the website with fully unlocked features,
                          real cash scenarios, and responsive navbar status.
                        </p>
                      </div>

                      <div className="space-y-2">
                        {(Object.keys(DEMO_PERSONAS) as DemoPersonaKey[]).map(key => {
                          const persona = DEMO_PERSONAS[key];
                          const icons = {
                            consultant: Briefcase,
                            freelancer: Sparkles,
                            agency: Layers,
                          };
                          const IconComp = icons[key];

                          return (
                            <button
                              key={key}
                              type="button"
                              disabled={loading}
                              onClick={() => handleDemoSelect(key)}
                              className="w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer"
                              style={{
                                background: 'var(--cf-surface-alt)',
                                borderColor: 'var(--cf-border)',
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--cf-accent)';
                                e.currentTarget.style.background = 'var(--cf-accent-bg)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'var(--cf-border)';
                                e.currentTarget.style.background = 'var(--cf-surface-alt)';
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                  style={{
                                    background: 'linear-gradient(135deg, #2F6F62, #1a4f45)',
                                    color: 'white',
                                  }}
                                >
                                  <IconComp className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold" style={{ color: 'var(--cf-text)' }}>
                                      {persona.name}
                                    </span>
                                    <span
                                      className="text-[10px] font-mono px-1.5 py-0.2 rounded"
                                      style={{ background: 'var(--cf-border)', color: 'var(--cf-text-muted)' }}
                                    >
                                      ${persona.monthlyIncome.toLocaleString()}/mo
                                    </span>
                                  </div>
                                  <p className="text-[11px] truncate max-w-[240px]" style={{ color: 'var(--cf-text-faint)' }}>
                                    {persona.role}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-[var(--cf-text-faint)] group-hover:text-[var(--cf-accent)] group-hover:translate-x-0.5 transition-all" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Trust Bar */}
            <div
              className="px-6 py-3.5 border-t flex items-center justify-between text-[11px]"
              style={{
                borderColor: 'var(--cf-border)',
                background: 'var(--cf-surface-alt)',
                color: 'var(--cf-text-faint)',
              }}
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--cf-accent)]" />
                <span>Zero bank logins. Private mathematical simulation.</span>
              </div>
              <span className="font-mono text-[10px]">256-bit SSL</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
