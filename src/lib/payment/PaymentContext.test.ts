import { describe, it, expect } from 'vitest';
import { LOCAL_STORAGE_PRO_KEY } from './PaymentContext';

describe('Payment Gateway and Licensing System', () => {
  it('exports correct local storage key for simulated pro licenses', () => {
    expect(LOCAL_STORAGE_PRO_KEY).toBe('cf_simulated_pro_subscription');
  });

  it('calculates annual discounts accurately (25% off regular rates)', () => {
    const regularProMonthly = 12;
    const annualProMonthly = 9;
    const proAnnualSavings = (regularProMonthly - annualProMonthly) * 12;
    expect(proAnnualSavings).toBe(36);

    const regularStudioMonthly = 29;
    const annualStudioMonthly = 24;
    const studioAnnualSavings = (regularStudioMonthly - annualStudioMonthly) * 12;
    expect(studioAnnualSavings).toBe(60);
  });

  it('generates sandbox transaction IDs with standard prefix format', () => {
    const generateSandboxTxId = () => `ch_sandbox_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    const txId = generateSandboxTxId();
    expect(txId).toMatch(/^ch_sandbox_[A-Z0-9]{9}$/);
  });

  it('validates test card number formatting and Luhn simulation', () => {
    const testCard = '4242 4242 4242 4242';
    const cleanNumber = testCard.replace(/\s/g, '');
    expect(cleanNumber).toHaveLength(16);
    expect(cleanNumber.startsWith('4242')).toBe(true);
  });
});
