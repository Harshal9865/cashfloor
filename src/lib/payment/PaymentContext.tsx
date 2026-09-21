'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CheckoutDetails {
  planId: 'pro' | 'studio';
  planName: string;
  price: number;
  period: 'month' | 'year';
  billingCycle: 'monthly' | 'annual';
}

interface PaymentContextType {
  isCheckoutOpen: boolean;
  checkoutDetails: CheckoutDetails;
  isProSubscriber: boolean;
  activePlan: string | null;
  subscriptionRenewalDate: string | null;
  openCheckout: (planId?: 'pro' | 'studio', billingCycle?: 'monthly' | 'annual') => void;
  closeCheckout: () => void;
  completePayment: (transactionId: string) => void;
  cancelSubscription: () => void;
}

const DEFAULT_DETAILS: CheckoutDetails = {
  planId: 'pro',
  planName: 'Pro Sentinel',
  price: 9,
  period: 'month',
  billingCycle: 'annual',
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const LOCAL_STORAGE_PRO_KEY = 'cf_simulated_pro_subscription';

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails>(DEFAULT_DETAILS);
  const [isProSubscriber, setIsProSubscriber] = useState(false);
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [subscriptionRenewalDate, setSubscriptionRenewalDate] = useState<string | null>(null);

  // Hydrate subscription status from local storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_PRO_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.isActive) {
          setIsProSubscriber(true);
          setActivePlan(parsed.planName || 'Pro Sentinel');
          setSubscriptionRenewalDate(parsed.renewalDate || 'September 2027');
        }
      }
    } catch (e) {
      console.warn('Unable to hydrate mock subscription state', e);
    }
  }, []);

  const openCheckout = useCallback((planId: 'pro' | 'studio' = 'pro', billingCycle: 'monthly' | 'annual' = 'annual') => {
    const isAnnual = billingCycle === 'annual';
    const planName = planId === 'studio' ? 'Studio & Agency' : 'Pro Sentinel';
    const price = planId === 'studio' ? (isAnnual ? 24 : 29) : (isAnnual ? 9 : 12);

    setCheckoutDetails({
      planId,
      planName,
      price,
      period: 'month',
      billingCycle,
    });
    setIsCheckoutOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
  }, []);

  const completePayment = useCallback((transactionId: string) => {
    const renewal = new Date();
    renewal.setFullYear(renewal.getFullYear() + 1);
    const renewalFormatted = renewal.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const subData = {
      isActive: true,
      planId: checkoutDetails.planId,
      planName: checkoutDetails.planName,
      billingCycle: checkoutDetails.billingCycle,
      transactionId,
      activatedAt: new Date().toISOString(),
      renewalDate: renewalFormatted,
    };

    setIsProSubscriber(true);
    setActivePlan(checkoutDetails.planName);
    setSubscriptionRenewalDate(renewalFormatted);

    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_PRO_KEY, JSON.stringify(subData));
      window.dispatchEvent(new Event('storage'));
    }
  }, [checkoutDetails]);

  const cancelSubscription = useCallback(() => {
    setIsProSubscriber(false);
    setActivePlan(null);
    setSubscriptionRenewalDate(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_PRO_KEY);
      window.dispatchEvent(new Event('storage'));
    }
  }, []);

  return (
    <PaymentContext.Provider
      value={{
        isCheckoutOpen,
        checkoutDetails,
        isProSubscriber,
        activePlan,
        subscriptionRenewalDate,
        openCheckout,
        closeCheckout,
        completePayment,
        cancelSubscription,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return ctx;
}
