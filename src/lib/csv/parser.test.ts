import { describe, it, expect } from 'vitest';
import { parseCurrency, parsePastedData, parseUniversalCsv } from './parser';

describe('CSV / TSV Clipboard Parser', () => {
  it('parses currency strings with symbols, commas, and negative signs', () => {
    expect(parseCurrency('$4,500.50')).toBe(4500.5);
    expect(parseCurrency('€2,100')).toBe(2100);
    expect(parseCurrency('₹1,50,000')).toBe(150000);
    expect(parseCurrency('($400)')).toBe(-400);
    expect(parseCurrency('-250')).toBe(-250);
    expect(parseCurrency('')).toBe(0);
  });

  it('parses tab-separated data copied directly from Google Sheets or Excel', () => {
    const rawTSV = `Month\tIncome\tExpenses
Jan\t$4,500\t$2,100
Feb\t$2,800\t$1,900
Mar\t$5,200\t$2,050`;

    const records = parsePastedData(rawTSV);
    expect(records.length).toBe(3);
    expect(records[0].month).toBe('Jan');
    expect(records[0].income).toBe(4500);
    expect(records[0].expenses).toBe(2100);
  });

  it('parses comma-separated values with or without header', () => {
    const rawCSV = `Jan, 3500, 1800
Feb, 4200, 1950`;

    const records = parsePastedData(rawCSV);
    expect(records.length).toBe(2);
    expect(records[0].income).toBe(3500);
    expect(records[0].expenses).toBe(1800);
  });

  it('handles empty or malformed strings gracefully', () => {
    expect(parsePastedData('')).toEqual([]);
    expect(parsePastedData('    \n\n  ')).toEqual([]);
  });

  it('auto-detects and aggregates Stripe Balance CSV into 12 monthly records', () => {
    const stripeCsv = `id,Description,Amount,Fee,Net,Currency,Created (UTC),Type
txn_1,Acme Retainer,5000.00,150.00,4850.00,usd,2025-01-15 12:00,charge
txn_2,Bolt Studio,3000.00,90.00,2910.00,usd,2025-01-20 10:00,charge
txn_3,Monthly Retainer,4500.00,135.00,4365.00,usd,2025-02-14 14:00,charge`;

    const result = parseUniversalCsv(stripeCsv);
    expect(result.provider).toBe('stripe');
    expect(result.transactionCount).toBe(3);
    expect(result.records.length).toBe(12); // Padded to standard 12-month runway
    expect(result.records[0].income).toBe(7760); // 4850 + 2910
  });

  it('auto-detects and aggregates Wise Multi-Currency Statement CSV', () => {
    const wiseCsv = `TransferWise ID,Date,Amount,Currency,Description,Payment Reference,Running Balance,Total fees
TR_101,15-01-2025,4800.00,USD,Client Wire,INV-01,12000.00,14.00
TR_102,20-01-2025,-300.00,USD,Software Tool,CARD,11700.00,0.00`;

    const result = parseUniversalCsv(wiseCsv);
    expect(result.provider).toBe('wise');
    expect(result.transactionCount).toBe(2);
    expect(result.records[0].income).toBe(4800);
    expect(result.records[0].expenses).toBe(314); // 300 + 14 fee
  });

  it('auto-detects and aggregates PayPal Activity CSV', () => {
    const payPalCsv = `Date,Time,TimeZone,Name,Type,Status,Currency,Gross,Fee,Net
01/15/2025,12:00:00,PST,Client Acme,Payment,Completed,USD,3500.00,-105.00,3395.00`;

    const result = parseUniversalCsv(payPalCsv);
    expect(result.provider).toBe('paypal');
    expect(result.records[0].income).toBe(3395);
  });
});
