'use client';

import React, { useState, useEffect } from 'react';
import { usePayment } from '@/lib/payment/PaymentContext';
import { useRouter } from 'next/navigation';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Download,
  AlertCircle,
  Zap,
  Building2,
  Check
} from 'lucide-react';
import CashFloorLogo from '@/components/CashFloorLogo';

export default function MockCheckoutModal() {
  const { isCheckoutOpen, checkoutDetails, closeCheckout, completePayment } = usePayment();
  const router = useRouter();

  // Form inputs
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_google' | 'wise'>('card');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // Selected plan & billing inside modal
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>(checkoutDetails.billingCycle);
  const [planId, setPlanId] = useState<'pro' | 'studio'>(checkoutDetails.planId);

  useEffect(() => {
    setBillingCycle(checkoutDetails.billingCycle);
    setPlanId(checkoutDetails.planId);
  }, [checkoutDetails]);

  // Reset states when modal opens
  useEffect(() => {
    if (isCheckoutOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
      setProcessingStep(0);
      setTransactionId('');
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const isAnnual = billingCycle === 'annual';
  const monthlyRate = planId === 'studio' ? (isAnnual ? 24 : 29) : (isAnnual ? 9 : 12);
  const totalBilledToday = isAnnual ? monthlyRate * 12 : monthlyRate;
  const regularRate = planId === 'studio' ? 29 : 12;
  const annualSavings = isAnnual ? (regularRate - monthlyRate) * 12 : 0;

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const parts = raw.match(/[\s\S]{1,4}/g) || [];
    setCardNumber(parts.join(' '));
  };

  // Format expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setExpiry(raw);
    }
  };

  // Quick-fill test card
  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('999');
    setName('Alex Vance');
    setPostalCode('94107');
  };

  // Simulated Checkout Submission
  const handlePay = () => {
    setIsProcessing(true);
    setProcessingStep(1);

    const generatedTxId = `ch_sandbox_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    setTransactionId(generatedTxId);

    // Step 1: Encrypting
    setTimeout(() => {
      setProcessingStep(2);
    }, 600);

    // Step 2: Authorizing with network
    setTimeout(() => {
      setProcessingStep(3);
    }, 1200);

    // Step 3: 3D Secure verification
    setTimeout(() => {
      setProcessingStep(4);
    }, 1800);

    // Step 4: Complete
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      completePayment(generatedTxId);
    }, 2400);
  };

  // Download Simulated Receipt
  const handleDownloadReceipt = () => {
    const receiptContent = `================================================
CASHFLOOR TECHNOLOGIES — PAYMENT RECEIPT
================================================
Transaction ID: ${transactionId}
Date: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
Status: Paid & Active (Sandbox Simulation)
Plan: ${planId === 'studio' ? 'Studio & Agency' : 'Pro Sentinel'} (${billingCycle.toUpperCase()})
Amount Paid: $${totalBilledToday}.00 USD
Payment Method: Visa ending in 4242
Billing Descriptor: CASHFLOOR.APP*PRO

Customer: ${name || 'Independent Pro'}
Postal Code: ${postalCode || '94107'}
Zero Bank Surveillance License ID: CF-SENTINEL-${Date.now()}
================================================
Thank you for securing your freelance runway.
https://cashfloor.app
================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cashfloor-receipt-${transactionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] bg-[var(--cf-surface)] border-[var(--cf-border)] transition-all"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--cf-border-soft)] flex items-center justify-between bg-[var(--cf-surface-alt)]/50">
          <div className="flex items-center gap-3">
            <CashFloorLogo size="sm" />
            <div className="h-4 w-px bg-[var(--cf-border)]" />
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sandbox Gateway // Test Mode</span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCheckout}
            aria-label="Close checkout modal"
            className="p-1.5 rounded-xl text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] hover:bg-[var(--cf-surface)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!isSuccess ? (
            <>
              {/* Plan Selection & Cycle Selector */}
              <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--cf-text)]">Select Plan:</span>
                    <button
                      type="button"
                      onClick={() => setPlanId('pro')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        planId === 'pro'
                          ? 'bg-[var(--cf-accent)] text-white font-bold shadow-sm'
                          : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                      }`}
                    >
                      Pro Sentinel ($9/mo)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanId('studio')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        planId === 'studio'
                          ? 'bg-[var(--cf-accent)] text-white font-bold shadow-sm'
                          : 'text-[var(--cf-text-muted)] hover:text-[var(--cf-text)]'
                      }`}
                    >
                      Studio ($24/mo)
                    </button>
                  </div>

                  {/* Billing cycle pill */}
                  <div className="flex items-center bg-[var(--cf-surface)] p-0.5 rounded-lg border border-[var(--cf-border-soft)]">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('annual')}
                      className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-all ${
                        isAnnual ? 'bg-[var(--cf-accent)] text-white font-bold' : 'text-[var(--cf-text-muted)]'
                      }`}
                    >
                      Annual (-25%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-2 py-0.5 text-[10px] font-mono rounded cursor-pointer transition-all ${
                        !isAnnual ? 'bg-[var(--cf-accent)] text-white font-bold' : 'text-[var(--cf-text-muted)]'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline justify-between pt-1 border-t border-[var(--cf-border-soft)]">
                  <div>
                    <span className="text-2xl font-serif font-bold text-[var(--cf-text)]">
                      ${totalBilledToday}
                    </span>
                    <span className="text-xs text-[var(--cf-text-muted)] ml-1.5 font-mono">
                      {isAnnual ? 'billed annually ($' + monthlyRate + '/mo)' : 'billed monthly'}
                    </span>
                  </div>
                  {annualSavings > 0 && (
                    <span className="text-[11px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md font-semibold">
                      Save ${annualSavings}/year
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-[var(--cf-text)] flex items-center justify-between">
                  <span>Payment Method</span>
                  <button
                    type="button"
                    onClick={handleFillTestCard}
                    className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Zap className="w-3 h-3" />
                    <span>⚡ Quick-fill Test Card</span>
                  </button>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[var(--cf-accent)] bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] font-semibold shadow-xs'
                        : 'border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text-muted)] hover:border-[var(--cf-border-soft)]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_google')}
                    className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'apple_google'
                        ? 'border-[var(--cf-accent)] bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] font-semibold shadow-xs'
                        : 'border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text-muted)] hover:border-[var(--cf-border-soft)]'
                    }`}
                  >
                    <span> Apple / G Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wise')}
                    className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      paymentMethod === 'wise'
                        ? 'border-[var(--cf-accent)] bg-[var(--cf-accent-bg)] text-[var(--cf-accent)] font-semibold shadow-xs'
                        : 'border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text-muted)] hover:border-[var(--cf-border-soft)]'
                    }`}
                  >
                    <span>Wise Wire</span>
                  </button>
                </div>

                {/* Card Fields */}
                <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface)] space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[var(--cf-text-muted)]">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4242 4242 4242 4242"
                        className="w-full pl-3 pr-10 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] font-mono text-xs text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors"
                      />
                      <CreditCard className="w-4 h-4 text-[var(--cf-text-muted)] absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[var(--cf-text-muted)]">Expiration (MM/YY)</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={handleExpiryChange}
                        placeholder="12/28"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] font-mono text-xs text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[var(--cf-text-muted)]">CVC / Security Code</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                        placeholder="999"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] font-mono text-xs text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[var(--cf-text-muted)]">Cardholder Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Vance"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-xs text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-[var(--cf-text-muted)]">Postal / ZIP Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="94107"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] font-mono text-xs text-[var(--cf-text)] focus:outline-none focus:border-[var(--cf-accent)] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Progress Steps */}
              {isProcessing && (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-mono font-medium text-emerald-600">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {processingStep === 1 && 'Encrypting payment token via TLS 1.3...'}
                      {processingStep === 2 && 'Connecting to card issuing network...'}
                      {processingStep === 3 && 'Simulating 3D Secure verification...'}
                      {processingStep === 4 && 'Generating Pro Sentinel cryptographic license...'}
                    </span>
                    <span>Step {processingStep}/4</span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-500/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                      style={{ width: `${processingStep * 25}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Security notice */}
              <div className="flex items-center gap-2 text-[11px] text-[var(--cf-text-muted)] p-3 rounded-xl bg-[var(--cf-surface-alt)] border border-[var(--cf-border-soft)]">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Zero Bank Surveillance: Payment simulation executes 100% in test mode. No actual financial charges or credit card liabilities are created.
                </span>
              </div>
            </>
          ) : (
            /* Success & Activated Screen */
            <div className="py-6 text-center space-y-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 font-bold uppercase tracking-wider">
                  Payment Authorized // Pro Active
                </span>
                <h3 className="text-2xl font-serif font-bold text-[var(--cf-text)]">
                  Welcome to {planId === 'studio' ? 'Studio & Agency' : 'Pro Sentinel'}
                </h3>
                <p className="text-xs text-[var(--cf-text-muted)] max-w-sm mx-auto leading-relaxed">
                  Your simulated payment was authorized. All 12-month projections, Monte Carlo risk labs, and cross-border FX buffers are now permanently unlocked.
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="p-4 rounded-2xl border border-[var(--cf-border)] bg-[var(--cf-surface-alt)] text-left font-mono text-xs space-y-2">
                <div className="flex justify-between text-[var(--cf-text-muted)]">
                  <span>Transaction ID:</span>
                  <span className="font-bold text-[var(--cf-text)]">{transactionId}</span>
                </div>
                <div className="flex justify-between text-[var(--cf-text-muted)]">
                  <span>Plan Activated:</span>
                  <span className="font-semibold text-emerald-600">{planId === 'studio' ? 'Studio' : 'Pro Sentinel'} ({billingCycle})</span>
                </div>
                <div className="flex justify-between text-[var(--cf-text-muted)]">
                  <span>Simulated Charge:</span>
                  <span className="font-bold text-[var(--cf-text)]">${totalBilledToday}.00 USD</span>
                </div>
                <div className="flex justify-between text-[var(--cf-text-muted)]">
                  <span>Card Used:</span>
                  <span className="text-[var(--cf-text)]">Visa •••• 4242</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadReceipt}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono border border-[var(--cf-border)] bg-[var(--cf-surface)] text-[var(--cf-text)] hover:bg-[var(--cf-surface-alt)] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Download Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeCheckout();
                    router.push('/dashboard');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all shadow-lg cursor-pointer hover:opacity-95"
                  style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
                >
                  <span>Launch Pro Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="p-5 border-t border-[var(--cf-border-soft)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 bg-[var(--cf-surface-alt)]/40">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--cf-text-muted)]">
              <span>Total:</span>
              <span className="font-bold text-sm text-[var(--cf-text)]">${totalBilledToday}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeCheckout}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-mono text-[var(--cf-text-muted)] hover:text-[var(--cf-text)] transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-lg disabled:opacity-50 hover:opacity-95"
                style={{ background: 'linear-gradient(135deg, #2F6F62 0%, #1a4f45 100%)' }}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isProcessing ? 'Authorizing...' : `Authorize $${totalBilledToday} (Sandbox)`}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
