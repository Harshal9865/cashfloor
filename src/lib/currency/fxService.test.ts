import { describe, it, expect } from 'vitest';
import {
  calculateFxConversionMultiplier,
  FALLBACK_RATES,
  SYMBOL_TO_CODE,
  CODE_TO_SYMBOL,
  fetchLiveExchangeRates,
} from './fxService';

describe('fxService - Multi-Currency FX Engine', () => {
  it('maps symbols to currency codes correctly and vice-versa', () => {
    expect(SYMBOL_TO_CODE['$']).toBe('USD');
    expect(SYMBOL_TO_CODE['€']).toBe('EUR');
    expect(SYMBOL_TO_CODE['£']).toBe('GBP');
    expect(SYMBOL_TO_CODE['₹']).toBe('INR');
    expect(CODE_TO_SYMBOL['USD']).toBe('$');
    expect(CODE_TO_SYMBOL['EUR']).toBe('€');
  });

  it('returns identity multiplier (1.0) when converting same currency', () => {
    const res = calculateFxConversionMultiplier('$', '$', FALLBACK_RATES);
    expect(res.multiplier).toBe(1);
    expect(res.rateDescription).toContain('1 USD = 1 USD');
  });

  it('calculates accurate direct multipliers from USD base', () => {
    // 1 USD = 0.92 EUR in fallback rates
    const toEur = calculateFxConversionMultiplier('$', '€', FALLBACK_RATES);
    expect(toEur.multiplier).toBeCloseTo(0.92, 2);

    // 1 USD = 83.5 INR in fallback rates
    const toInr = calculateFxConversionMultiplier('$', '₹', FALLBACK_RATES);
    expect(toInr.multiplier).toBeCloseTo(83.5, 1);
  });

  it('calculates accurate cross-rate multipliers (e.g. EUR to INR)', () => {
    // 1 EUR = (83.5 / 0.92) INR ≈ 90.76 INR
    const eurToInr = calculateFxConversionMultiplier('€', '₹', FALLBACK_RATES);
    expect(eurToInr.multiplier).toBeCloseTo(83.5 / 0.92, 2);
    expect(eurToInr.rateDescription).toContain('EUR');
    expect(eurToInr.rateDescription).toContain('INR');
  });

  it('gracefully falls back when unknown symbol is provided', () => {
    const res = calculateFxConversionMultiplier('XYZ', '$', FALLBACK_RATES);
    expect(res.multiplier).toBe(1);
  });

  it('fetchLiveExchangeRates returns a valid rates table with USD=1', async () => {
    const result = await fetchLiveExchangeRates();
    expect(result.rates).toBeDefined();
    expect(result.rates.USD).toBe(1);
    expect(result.rates.EUR).toBeGreaterThan(0);
    expect(result.rates.INR).toBeGreaterThan(0);
  });
});
