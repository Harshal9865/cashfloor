/**
 * CashFloor Resilient Multi-Currency & Live FX Conversion Service
 * Supports offline baseline rates, live API fetching, and local cache with fallback.
 */

export const SYMBOL_TO_CODE: Record<string, string> = {
  '$': 'USD',
  '€': 'EUR',
  '£': 'GBP',
  '₹': 'INR',
  'C$': 'CAD',
  'A$': 'AUD',
};

export const CODE_TO_SYMBOL: Record<string, string> = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'INR': '₹',
  'CAD': 'C$',
  'AUD': 'A$',
};

export const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  CAD: 1.36,
  AUD: 1.52,
};

const FX_CACHE_KEY = 'cf_fx_rates_cache_v1';
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

interface FxCachePayload {
  timestamp: number;
  rates: Record<string, number>;
}

export async function fetchLiveExchangeRates(): Promise<{ rates: Record<string, number>; isLive: boolean }> {
  // 1. Check local storage cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(FX_CACHE_KEY);
      if (cached) {
        const parsed: FxCachePayload = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.rates?.USD) {
          return { rates: { ...FALLBACK_RATES, ...parsed.rates }, isLive: true };
        }
      }
    } catch {}
  }

  // 2. Fetch live rates from public API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        const sanitizedRates = { ...FALLBACK_RATES, ...data.rates };
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              FX_CACHE_KEY,
              JSON.stringify({ timestamp: Date.now(), rates: sanitizedRates })
            );
          } catch {}
        }
        return { rates: sanitizedRates, isLive: true };
      }
    }
  } catch (err) {
    console.warn('Live FX rate fetch timed out or failed, using local offline rates table.');
  }

  // 3. Fallback to resilient offline rates
  return { rates: FALLBACK_RATES, isLive: false };
}

export function calculateFxConversionMultiplier(
  fromSymbol: string,
  toSymbol: string,
  rates: Record<string, number>
): { multiplier: number; rateDescription: string } {
  const fromCode = SYMBOL_TO_CODE[fromSymbol] || 'USD';
  const toCode = SYMBOL_TO_CODE[toSymbol] || 'USD';

  if (fromCode === toCode) {
    return { multiplier: 1, rateDescription: `1 ${fromCode} = 1 ${toCode}` };
  }

  const fromRate = rates[fromCode] || FALLBACK_RATES[fromCode] || 1;
  const toRate = rates[toCode] || FALLBACK_RATES[toCode] || 1;

  // Since rates are relative to 1 USD:
  // 1 unit of fromCode = (1 / fromRate) USD
  // = (toRate / fromRate) of toCode
  const multiplier = toRate / fromRate;
  const rateDescription = `1 ${fromCode} ≈ ${(toRate / fromRate).toFixed(3)} ${toCode}`;

  return { multiplier, rateDescription };
}
