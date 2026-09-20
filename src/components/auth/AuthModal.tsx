'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, message }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16232B]/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-[#F1F4F2] border border-[rgba(22,35,43,0.12)] shadow-2xl relative"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 hairline-b bg-white">
              <h2 className="font-[var(--font-fraunces)] text-2xl text-[#16232B]">Unlock Full Ledger</h2>
              <button
                onClick={onClose}
                className="text-[#5C6D77] hover:text-[#B4573F] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8">
              {message && (
                <div className="mb-6 px-4 py-3 bg-[#E8EDE9] border-l-2 border-[#2F6F62] text-sm text-[#16232B]">
                  {message}
                </div>
              )}

              {success ? (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-[#2F6F62]/10 flex items-center justify-center rounded-full">
                    <Mail className="w-6 h-6 text-[#2F6F62]" />
                  </div>
                  <h3 className="font-sans text-lg font-medium text-[#16232B]">Check your email</h3>
                  <p className="text-sm text-[#5C6D77]">
                    We sent a magic link to <strong>{email}</strong>. Click it to securely sign in.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[11px] font-[var(--font-mono)] uppercase tracking-wider text-[#5C6D77]">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-white border border-[rgba(22,35,43,0.12)] text-[#16232B] font-[var(--font-mono)] text-sm focus:outline-none focus:border-[#2F6F62] transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="text-xs text-[#B4573F] font-medium">{error}</div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#16232B] hover:bg-[#2F6F62] text-white py-3 text-xs uppercase tracking-widest transition-colors font-medium disabled:opacity-50"
                  >
                    {loading ? 'Sending link...' : 'Continue with Email'}
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 hairline-t bg-[#E8EDE9] flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#2F6F62] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#5C6D77] leading-relaxed">
                We use secure passwordless login. By signing in, your anonymous session data will be safely migrated to your account.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
