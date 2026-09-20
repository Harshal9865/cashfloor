import { MonthlyRecord } from '../calculator/types';

/**
 * Cleans numeric strings containing currency symbols, commas, or spaces.
 * e.g., "$4,500.50" -> 4500.5, "(200)" -> -200
 */
export function parseCurrency(val: string): number {
  if (!val) return 0;
  let clean = val.trim();
  // Check for accounting negative notation: ($500)
  const isNegative = clean.startsWith('(') && clean.endsWith(')') || clean.startsWith('-');
  clean = clean.replace(/[$€£₹,\s()]/g, '');
  const num = parseFloat(clean);
  if (isNaN(num)) return 0;
  return isNegative ? -Math.abs(num) : num;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Robust parser for text pasted from Excel, Google Sheets, or CSV files.
 * Supports comma, tab, or semicolon delimiters.
 */
export function parsePastedData(text: string): MonthlyRecord[] {
  if (!text || text.trim() === '') return [];

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const records: MonthlyRecord[] = [];

  lines.forEach((line, index) => {
    // Try splitting by tab first (Excel/Sheets default clipboard format), then comma, then semicolon
    let parts: string[] = [];
    if (line.includes('\t')) {
      parts = line.split('\t');
    } else if (line.includes(',')) {
      parts = line.split(',');
    } else if (line.includes(';')) {
      parts = line.split(';');
    } else {
      // Space separated
      parts = line.split(/\s+/);
    }

    parts = parts.map((p) => p.trim());

    // Skip if this line looks like a table header (e.g. "Month, Income, Expenses")
    const lowerFirst = parts[0]?.toLowerCase();
    if (
      lowerFirst === 'month' ||
      lowerFirst === 'date' ||
      lowerFirst === 'period' ||
      parts.some((p) => p.toLowerCase().includes('income'))
    ) {
      return;
    }

    let monthName = parts[0] || MONTH_NAMES[records.length % 12];
    // If the first item is numeric, treat it as income and generate standard month name
    let income = 0;
    let expenses = 0;

    const firstAsNum = parseCurrency(parts[0]);
    if (!isNaN(firstAsNum) && parts[0].match(/^[$\d]/)) {
      monthName = MONTH_NAMES[records.length % 12];
      income = Math.max(0, firstAsNum);
      expenses = Math.max(0, parseCurrency(parts[1] || '0'));
    } else {
      income = Math.max(0, parseCurrency(parts[1] || '0'));
      expenses = Math.max(0, parseCurrency(parts[2] || '0'));
    }

    records.push({
      id: `pasted-${index + 1}-${Date.now()}`,
      month: monthName,
      income,
      expenses,
    });
  });

  return records;
}
