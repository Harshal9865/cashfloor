'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  defaultTab?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  message,
  defaultTab = 'signin',
}) => {
  const [tab, setTab] = useState<'signin' | 'signup' | 'magic'>(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const reset = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  const switchTab = (t: 'signin' | 'signup' | 'magic') => {
    reset();
    setTab(t);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSuccessMessage('Signed in! Redirecting…');
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials'
        ? 'Wrong email or password. Please try again.'
        : err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      setSuccessMessage('Account created! Check your email to confirm and you\'re in.');
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;
      setSuccessMessage(`Magic link sent to ${email}. Check your inbox.`);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send link.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError('Google sign in failed. Please try another method.');
    }
  };

  const titles = {
    signin: 'Welcome back',
    signup: 'Create your account',
    magic: 'Sign in with email',
  };

  const subtitles = {
    signin: 'Sign in to see your saved runway and history.',
    signup: 'Free forever. No credit card needed.',
    magic: 'We\'ll email you a secure link to sign in instantly.',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[var(--cf-text)]/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md pointer-events-auto rounded-2xl overflow-hidden"
              style={{
                background: 'var(--cf-surface)',
                border: '1px solid var(--cf-border)',
                boxShadow: 'var(--cf-shadow-lg)',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-0">
                <div>
                  <h2 className="font-serif text-2xl font-semibold" style={{ color: 'var(--cf-text)' }}>
                    {titles[tab]}
                  </h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--cf-text-muted)' }}>
                    {subtitles[tab]}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors ml-4 mt-1"
                  style={{ color: 'var(--cf-text-faint)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--cf-surface-alt)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Context message from feature gate */}
              {message && (
                <div className="mx-6 mt-4 px-4 py-3 rounded-lg border-l-2 text-sm"
                  style={{
                    background: 'var(--cf-accent-bg)',
                    borderColor: 'var(--cf-accent)',
                    color: 'var(--cf-text-muted)',
                  }}>
                  {message}
                </div>
              )}

              <div className="p-6">
                {/* Success state */}
                {success ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4 space-y-4"
                  >
                    <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--cf-accent-bg)' }}>
                      <Check className="w-7 h-7" style={{ color: 'var(--cf-accent)' }} />
                    </div>
                    <p className="font-medium" style={{ color: 'var(--cf-text)' }}>
                      {successMessage}
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Tab switcher */}
                    <div className="flex rounded-xl p-1 mb-5 gap-1"
                      style={{ background: 'var(--cf-surface-alt)' }}>
                      {(['signin', 'signup'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => switchTab(t)}
                          className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                          style={{
                            background: tab === t ? 'var(--cf-surface)' : 'transparent',
                            color: tab === t ? 'var(--cf-text)' : 'var(--cf-text-muted)',
                            boxShadow: tab === t ? 'var(--cf-shadow-sm)' : 'none',
                          }}
                        >
                          {t === 'signin' ? 'Sign In' : 'Sign Up'}
                        </button>
                      ))}
                    </div>

                    {/* Google button */}
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 mb-4 border"
                      style={{
                        background: 'var(--cf-surface-alt)',
                        borderColor: 'var(--cf-border)',
                        color: 'var(--cf-text)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--cf-accent)')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--cf-border)')}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px" style={{ background: 'var(--cf-border)' }} />
                      <span className="text-xs" style={{ color: 'var(--cf-text-faint)' }}>or</span>
                      <div className="flex-1 h-px" style={{ background: 'var(--cf-border)' }} />
                    </div>

                    {/* Email + Password Form */}
                    <form
                      onSubmit={tab === 'signin' ? handleSignIn : handleSignUp}
                      className="space-y-4"
                    >
                      {/* Email */}
                      <div>
                        <label htmlFor="auth-email" className="block text-xs font-medium mb-1.5"
                          style={{ color: 'var(--cf-text-muted)' }}>
                          Email address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--cf-text-faint)' }} />
                          <input
                            id="auth-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-colors"
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

                      {/* Password */}
                      <div>
                        <label htmlFor="auth-password" className="block text-xs font-medium mb-1.5"
                          style={{ color: 'var(--cf-text-muted)' }}>
                          {tab === 'signup' ? 'Create a password' : 'Password'}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                            style={{ color: 'var(--cf-text-faint)' }} />
                          <input
                            id="auth-password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={tab === 'signup' ? 'At least 6 characters' : '••••••••'}
                            className="w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-colors"
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
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                            style={{ color: 'var(--cf-text-faint)' }}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Error */}
                      {error && (
                        <p className="text-sm px-3 py-2 rounded-lg"
                          style={{ background: 'var(--cf-caution-bg)', color: 'var(--cf-caution)' }}>
                          {error}
                        </p>
                      )}

                      {/* Forgot password (sign in only) */}
                      {tab === 'signin' && (
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => switchTab('magic')}
                            className="text-xs transition-colors"
                            style={{ color: 'var(--cf-accent)' }}
                          >
                            Forgot password? Use magic link instead
                          </button>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
                        style={{
                          background: 'linear-gradient(135deg, #2F6F62, #1a4f45)',
                          boxShadow: '0 4px 16px rgba(47,111,98,0.3)',
                        }}
                      >
                        {loading ? (
                          <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                        ) : (
                          <>
                            {tab === 'signin' ? 'Sign In' : 'Create Account'}
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Magic link option */}
                      {tab !== 'magic' && (
                        <p className="text-center text-xs" style={{ color: 'var(--cf-text-faint)' }}>
                          Prefer passwordless?{' '}
                          <button
                            type="button"
                            onClick={() => switchTab('magic')}
                            className="underline transition-colors"
                            style={{ color: 'var(--cf-accent)' }}
                          >
                            Send me a magic link
                          </button>
                        </p>
                      )}
                    </form>

                    {/* Magic link form */}
                    {tab === 'magic' && (
                      <form onSubmit={handleMagicLink} className="space-y-4">
                        <div>
                          <label htmlFor="magic-email" className="block text-xs font-medium mb-1.5"
                            style={{ color: 'var(--cf-text-muted)' }}>
                            Email address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                              style={{ color: 'var(--cf-text-faint)' }} />
                            <input
                              id="magic-email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-colors"
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

                        {error && (
                          <p className="text-sm px-3 py-2 rounded-lg"
                            style={{ background: 'var(--cf-caution-bg)', color: 'var(--cf-caution)' }}>
                            {error}
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
                          style={{ background: 'linear-gradient(135deg, #2F6F62, #1a4f45)' }}
                        >
                          {loading
                            ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                            : 'Send Magic Link'
                          }
                        </button>

                        <p className="text-center text-xs" style={{ color: 'var(--cf-text-faint)' }}>
                          <button
                            type="button"
                            onClick={() => switchTab('signin')}
                            className="underline"
                            style={{ color: 'var(--cf-accent)' }}
                          >
                            ← Back to Sign In
                          </button>
                        </p>
                      </form>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex items-start gap-2 border-t"
                style={{ borderColor: 'var(--cf-border)', background: 'var(--cf-surface-alt)' }}>
                <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--cf-accent)' }} />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--cf-text-faint)' }}>
                  Your data is private and encrypted. We never sell your information.
                  Your anonymous session data migrates to your account on sign in.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
