import { describe, it, expect, beforeEach } from 'vitest';
import {
  isSupabaseConfigured,
  getLocalLedgerState,
  setLocalLedgerState,
  loadUserLedger,
  saveUserLedger,
  StoredLedgerPayload,
} from './ledgerService';
import { MonthlyRecord, CalculatorAssumptions } from '../calculator/types';

// Simple in-memory localStorage mock for Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('ledgerService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('detects unconfigured or dummy supabase environment', () => {
    // In local test env without live keys, isSupabaseConfigured should return false
    expect(isSupabaseConfigured()).toBe(false);
  });

  it('correctly sets and retrieves local ledger state', () => {
    const mockRecords: MonthlyRecord[] = [
      { id: '1', month: 'Jan', income: 5000, expenses: 2000, clientTag: 'Client A' },
    ];
    const mockAssumptions: CalculatorAssumptions = {
      taxReservePct: 0.30,
      bufferMonthsMultiplier: 4,
      currentSavings: 10000,
      percentile: 20,
      scenario: 'base',
    };

    const payload: StoredLedgerPayload = {
      records: mockRecords,
      assumptions: mockAssumptions,
      currencySymbol: '€',
    };

    setLocalLedgerState(payload);

    const retrieved = getLocalLedgerState();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.currencySymbol).toBe('€');
    expect(retrieved?.records.length).toBe(1);
    expect(retrieved?.records[0].income).toBe(5000);
    expect(retrieved?.assumptions.taxReservePct).toBe(0.30);
  });

  it('loads local fallback data when no userId is supplied', async () => {
    const mockRecords: MonthlyRecord[] = [
      { id: '1', month: 'Feb', income: 6000, expenses: 2500, clientTag: 'Retainer' },
    ];
    const mockAssumptions: CalculatorAssumptions = {
      taxReservePct: 0.25,
      bufferMonthsMultiplier: 3.5,
      currentSavings: 8000,
      percentile: 20,
      scenario: 'base',
    };

    setLocalLedgerState({
      records: mockRecords,
      assumptions: mockAssumptions,
      currencySymbol: '$',
    });

    const { payload, source } = await loadUserLedger(undefined);
    expect(source).toBe('local');
    expect(payload.records.length).toBe(1);
    expect(payload.records[0].income).toBe(6000);
  });

  it('saves ledger data locally when unauthenticated or offline', async () => {
    const records: MonthlyRecord[] = [
      { id: '1', month: 'Jul', income: 4500, expenses: 2100, clientTag: 'Bolt' },
    ];
    const assumptions: CalculatorAssumptions = {
      taxReservePct: 0.25,
      bufferMonthsMultiplier: 3.5,
      currentSavings: 9000,
      percentile: 20,
      scenario: 'base',
    };

    const result = await saveUserLedger(undefined, records, assumptions, '£');
    expect(result.success).toBe(true);
    expect(result.isCloud).toBe(false);

    const stored = getLocalLedgerState();
    expect(stored?.currencySymbol).toBe('£');
    expect(stored?.records[0].income).toBe(4500);
  });
});
