import { describe, it, expect } from 'vitest';
import { parseCurrency, parsePastedData } from './parser';

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
});
