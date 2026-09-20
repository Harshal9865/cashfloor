import { MonthlyRecord, CalculatorAssumptions } from '../calculator/types';
import { createClient } from './client';

const LOCAL_STORAGE_KEY = 'calm_ledger_local_state_v1';

export type SyncStatus = 'offline' | 'saving' | 'synced' | 'error';

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes('dummy') && !key.includes('dummy'));
}

export interface StoredLedgerPayload {
  records: MonthlyRecord[];
  assumptions: CalculatorAssumptions;
  currencySymbol: string;
  updatedAt?: string;
}

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) return (globalThis as any).localStorage;
  return null;
}

// Local storage fallback helpers
export function getLocalLedgerState(): StoredLedgerPayload | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read from localStorage', e);
    return null;
  }
}

export function setLocalLedgerState(payload: StoredLedgerPayload): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      ...payload,
      updatedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

/**
 * Loads user's ledger data from Supabase (or local fallback).
 */
export async function loadUserLedger(
  userId?: string
): Promise<{ payload: StoredLedgerPayload; source: 'cloud' | 'local' | 'default' }> {
  // Always check local state first as baseline
  const local = getLocalLedgerState();

  if (!userId || !isSupabaseConfigured()) {
    if (local) {
      return { payload: local, source: 'local' };
    }
    return {
      payload: {
        records: [],
        assumptions: {
          taxReservePct: 0.25,
          bufferMonthsMultiplier: 3.5,
          currentSavings: 8820,
          percentile: 20,
          scenario: 'base',
        },
        currencySymbol: '$',
      },
      source: 'default',
    };
  }

  try {
    const supabase = createClient();
    // 1. Fetch primary ledger
    const { data: ledger, error: ledgerError } = await supabase
      .from('ledgers')
      .select('id, currency_symbol, updated_at')
      .eq('user_id', userId)
      .single();

    if (ledgerError || !ledger) {
      // If user has no ledger in cloud yet, fallback to local if available
      if (local) return { payload: local, source: 'local' };
      return {
        payload: {
          records: [],
          assumptions: {
            taxReservePct: 0.25,
            bufferMonthsMultiplier: 3.5,
            currentSavings: 8820,
            percentile: 20,
            scenario: 'base',
          },
          currencySymbol: '$',
        },
        source: 'default',
      };
    }

    // 2. Fetch records
    const { data: recordsData } = await supabase
      .from('ledger_records')
      .select('id, month, income, expenses, client_tag, sort_order')
      .eq('ledger_id', ledger.id)
      .order('sort_order', { ascending: true });

    // 3. Fetch assumptions
    const { data: assumptionsData } = await supabase
      .from('ledger_assumptions')
      .select('*')
      .eq('ledger_id', ledger.id)
      .single();

    const records: MonthlyRecord[] = (recordsData || []).map((r: any) => ({
      id: r.id,
      month: r.month,
      income: Number(r.income),
      expenses: Number(r.expenses),
      clientTag: r.client_tag || 'Standard',
    }));

    const assumptions: CalculatorAssumptions = assumptionsData ? {
      taxReservePct: Number(assumptionsData.tax_reserve_pct),
      bufferMonthsMultiplier: Number(assumptionsData.buffer_months_multiplier),
      currentSavings: Number(assumptionsData.current_savings),
      percentile: Number(assumptionsData.percentile),
      scenario: assumptionsData.scenario,
      clientLossPercentage: assumptionsData.client_loss_percentage ? Number(assumptionsData.client_loss_percentage) : 0.30,
      windfallAmount: assumptionsData.windfall_amount ? Number(assumptionsData.windfall_amount) : 10000,
      retainerProbability: assumptionsData.retainer_probability ? Number(assumptionsData.retainer_probability) : 0.85,
    } : {
      taxReservePct: 0.25,
      bufferMonthsMultiplier: 3.5,
      currentSavings: 8820,
      percentile: 20,
      scenario: 'base',
    };

    return {
      payload: {
        records,
        assumptions,
        currencySymbol: ledger.currency_symbol || '$',
        updatedAt: ledger.updated_at,
      },
      source: 'cloud',
    };
  } catch (err) {
    console.error('Error loading cloud ledger:', err);
    if (local) return { payload: local, source: 'local' };
    throw err;
  }
}

/**
 * Saves user's ledger data to Supabase (and mirrors to local storage).
 */
export async function saveUserLedger(
  userId: string | undefined,
  records: MonthlyRecord[],
  assumptions: CalculatorAssumptions,
  currencySymbol: string
): Promise<{ success: boolean; isCloud: boolean }> {
  const payload: StoredLedgerPayload = {
    records,
    assumptions,
    currencySymbol,
  };

  // Always mirror locally for instantaneous resilience
  setLocalLedgerState(payload);

  if (!userId || !isSupabaseConfigured()) {
    return { success: true, isCloud: false };
  }

  try {
    const supabase = createClient();

    // 1. Upsert ledger parent record
    const { data: ledger, error: ledgerError } = await supabase
      .from('ledgers')
      .upsert({
        user_id: userId,
        name: 'Primary Freelance Ledger',
        currency_symbol: currencySymbol,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id, name' })
      .select('id')
      .single();

    if (ledgerError || !ledger) {
      throw ledgerError || new Error('Failed to create or update ledger header');
    }

    const ledgerId = ledger.id;

    // 2. Atomic refresh of records: delete existing and insert new
    await supabase.from('ledger_records').delete().eq('ledger_id', ledgerId);

    if (records.length > 0) {
      const recordsToInsert = records.map((r, index) => ({
        ledger_id: ledgerId,
        month: r.month,
        income: r.income,
        expenses: r.expenses,
        client_tag: r.clientTag || 'Standard',
        sort_order: index,
      }));

      const { error: insertError } = await supabase
        .from('ledger_records')
        .insert(recordsToInsert);

      if (insertError) throw insertError;
    }

    // 3. Upsert assumptions
    const { error: assumptionsError } = await supabase
      .from('ledger_assumptions')
      .upsert({
        ledger_id: ledgerId,
        tax_reserve_pct: assumptions.taxReservePct ?? 0.25,
        buffer_months_multiplier: assumptions.bufferMonthsMultiplier ?? 3.5,
        current_savings: assumptions.currentSavings ?? 8820,
        percentile: assumptions.percentile ?? 20,
        scenario: assumptions.scenario ?? 'base',
        client_loss_percentage: assumptions.clientLossPercentage ?? 0.30,
        windfall_amount: assumptions.windfallAmount ?? 10000,
        retainer_probability: assumptions.retainerProbability ?? 0.85,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'ledger_id' });

    if (assumptionsError) throw assumptionsError;

    return { success: true, isCloud: true };
  } catch (err) {
    console.error('Error saving ledger to Supabase:', err);
    return { success: false, isCloud: false };
  }
}
