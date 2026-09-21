import { MonthlyRecord } from '../calculator/types';

/**
 * Cleans numeric strings containing currency symbols, commas, or spaces.
 * e.g., "$4,500.50" -> 4500.5, "(200)" -> -200
 */
export function parseCurrency(val: string): number {
  if (!val) return 0;
  let clean = val.trim();
  // Check for accounting negative notation: ($500) or -$500
  const isNegative = (clean.startsWith('(') && clean.endsWith(')')) || clean.startsWith('-');
  clean = clean.replace(/[$€£₹,\s()]/g, '');
  const num = parseFloat(clean);
  if (isNaN(num)) return 0;
  return isNegative ? -Math.abs(num) : num;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export interface ParsedCsvResult {
  records: MonthlyRecord[];
  detectedFormat: string;
  provider: 'stripe' | 'wise' | 'paypal' | 'upwork' | 'wave_quickbooks' | 'spreadsheet' | 'generic';
  transactionCount: number;
  totalIncome: number;
  totalExpenses: number;
  monthsCount: number;
  sampleRowsCount: number;
}

/**
 * Splits a CSV line while handling quotes properly.
 */
function splitCsvLine(line: string, delimiter?: string): string[] {
  // Auto-detect delimiter if not forced
  const delim = delimiter || (line.includes('\t') ? '\t' : line.includes(';') ? ';' : ',');
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === delim && !inQuotes) {
      result.push(cur.trim().replace(/^["']|["']$/g, ''));
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim().replace(/^["']|["']$/g, ''));
  return result;
}

/**
 * Extracts a normalized Month label (e.g. 'Jan 2025' or 'Jan') from arbitrary date strings.
 */
function extractMonthKey(dateStr: string): { key: string; label: string } | null {
  if (!dateStr) return null;
  const clean = dateStr.trim();

  // Try ISO format: YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = clean.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const monthIdx = parseInt(isoMatch[2], 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      return {
        key: `${year}-${String(monthIdx + 1).padStart(2, '0')}`,
        label: `${MONTH_NAMES[monthIdx]} ${year}`,
      };
    }
  }

  // Try DD-MM-YYYY or MM-DD-YYYY or DD/MM/YYYY or MM/DD/YYYY
  const slashMatch = clean.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (slashMatch) {
    const year = parseInt(slashMatch[3], 10);
    const p1 = parseInt(slashMatch[1], 10);
    const p2 = parseInt(slashMatch[2], 10);
    let monthIdx = -1;

    if (p1 <= 12 && p2 > 12) {
      // MM/DD/YYYY format (US standard e.g. PayPal, Stripe US)
      monthIdx = p1 - 1;
    } else if (p2 <= 12 && p1 > 12) {
      // DD/MM/YYYY format (European standard e.g. Wise, UK/EU banks)
      monthIdx = p2 - 1;
    } else if (p1 <= 12) {
      // Default to p1
      monthIdx = p1 - 1;
    }

    if (monthIdx >= 0 && monthIdx < 12) {
      return {
        key: `${year}-${String(monthIdx + 1).padStart(2, '0')}`,
        label: `${MONTH_NAMES[monthIdx]} ${year}`,
      };
    }
  }

  // Try Textual month: "Jul 15, 2025" or "15 Jul 2025"
  for (let i = 0; i < MONTH_NAMES.length; i++) {
    const name = MONTH_NAMES[i];
    if (new RegExp(`\\b${name}\\b`, 'i').test(clean)) {
      const yearMatch = clean.match(/\b(20\d\d)\b/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
      return {
        key: `${year}-${String(i + 1).padStart(2, '0')}`,
        label: `${name} ${year}`,
      };
    }
  }

  return null;
}

/**
 * Universal Intelligent Parser for real freelancer tool exports:
 * - Stripe Balance & Payout History CSV
 * - Wise (TransferWise) Balance Statement CSV
 * - PayPal Business Activity CSV
 * - Upwork Transaction History CSV
 * - Wave Accounting / QuickBooks General Ledger CSV
 * - Excel / Google Sheets pasted tables
 */
export function parseUniversalCsv(text: string): ParsedCsvResult {
  if (!text || text.trim() === '') {
    return {
      records: [],
      detectedFormat: 'Empty Input',
      provider: 'generic',
      transactionCount: 0,
      totalIncome: 0,
      totalExpenses: 0,
      monthsCount: 0,
      sampleRowsCount: 0,
    };
  }

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      records: [],
      detectedFormat: 'Empty Input',
      provider: 'generic',
      transactionCount: 0,
      totalIncome: 0,
      totalExpenses: 0,
      monthsCount: 0,
      sampleRowsCount: 0,
    };
  }

  // Analyze headers
  const headerParts = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const headerLine = lines[0].toLowerCase();

  // 1. Stripe Balance History Check
  const isStripe =
    headerLine.includes('balance transaction id') ||
    (headerLine.includes('created (utc)') && headerLine.includes('net')) ||
    (headerParts.includes('amount') && headerParts.includes('net') && headerParts.includes('fee'));

  // 2. Wise (TransferWise) Statement Check
  const isWise =
    headerLine.includes('transferwise id') ||
    headerLine.includes('wise id') ||
    (headerLine.includes('payment reference') && headerLine.includes('running balance'));

  // 3. PayPal Activity Check
  const isPayPal =
    headerLine.includes('paypal') ||
    (headerParts.includes('gross') && headerParts.includes('net') && headerParts.includes('timezone'));

  // 4. Upwork Transaction Check
  const isUpwork =
    headerLine.includes('upwork') ||
    (headerParts.includes('ref id') && headerParts.includes('agency') && headerParts.includes('freelancer'));

  // 5. Wave / QuickBooks / Xero Accounting Ledger
  const isAccountingLedger =
    (headerParts.includes('credit') && headerParts.includes('debit')) ||
    (headerParts.includes('split') && headerParts.includes('memo'));

  // Multi-transaction aggregation map: Key -> { label, income, expenses, count }
  const monthlyAggregates = new Map<string, { label: string; income: number; expenses: number; count: number }>();
  let totalTxs = 0;

  if (isStripe) {
    // Stripe indices
    const dateIdx = headerParts.findIndex((h) => h.includes('created') || h.includes('date'));
    const netIdx = headerParts.findIndex((h) => h === 'net' || h.includes('net'));
    const feeIdx = headerParts.findIndex((h) => h === 'fee');
    const typeIdx = headerParts.findIndex((h) => h === 'type');

    lines.slice(1).forEach((line) => {
      const cols = splitCsvLine(line);
      const dateVal = cols[dateIdx >= 0 ? dateIdx : 0] || '';
      const m = extractMonthKey(dateVal);
      if (!m) return;

      const type = (cols[typeIdx] || '').toLowerCase();
      // Skip transfers/payouts from counting as double income
      if (type === 'payout' || type === 'transfer') return;

      const net = parseCurrency(cols[netIdx >= 0 ? netIdx : 1] || '0');
      const fee = Math.abs(parseCurrency(cols[feeIdx >= 0 ? feeIdx : 2] || '0'));

      const entry = monthlyAggregates.get(m.key) || { label: m.label, income: 0, expenses: 0, count: 0 };
      if (net > 0) {
        entry.income += net;
      } else if (net < 0) {
        entry.expenses += Math.abs(net);
      }
      entry.expenses += fee;
      entry.count += 1;
      monthlyAggregates.set(m.key, entry);
      totalTxs++;
    });

    return formatResult(monthlyAggregates, 'Stripe Balance & Payout History', 'stripe', totalTxs);
  }

  if (isWise) {
    // Wise indices
    const dateIdx = headerParts.findIndex((h) => h.includes('date'));
    const amountIdx = headerParts.findIndex((h) => h === 'amount');
    const feeIdx = headerParts.findIndex((h) => h.includes('fee'));

    lines.slice(1).forEach((line) => {
      const cols = splitCsvLine(line);
      const dateVal = cols[dateIdx >= 0 ? dateIdx : 1] || '';
      const m = extractMonthKey(dateVal);
      if (!m) return;

      const amount = parseCurrency(cols[amountIdx >= 0 ? amountIdx : 2] || '0');
      const fee = Math.abs(parseCurrency(cols[feeIdx >= 0 ? feeIdx : 7] || '0'));

      const entry = monthlyAggregates.get(m.key) || { label: m.label, income: 0, expenses: 0, count: 0 };
      if (amount > 0) {
        entry.income += amount;
      } else {
        entry.expenses += Math.abs(amount);
      }
      entry.expenses += fee;
      entry.count += 1;
      monthlyAggregates.set(m.key, entry);
      totalTxs++;
    });

    return formatResult(monthlyAggregates, 'Wise Multi-Currency Statement', 'wise', totalTxs);
  }

  if (isPayPal) {
    // PayPal indices
    const dateIdx = headerParts.findIndex((h) => h.includes('date'));
    const netIdx = headerParts.findIndex((h) => h === 'net');
    const grossIdx = headerParts.findIndex((h) => h === 'gross');
    const statusIdx = headerParts.findIndex((h) => h === 'status');

    lines.slice(1).forEach((line) => {
      const cols = splitCsvLine(line);
      const status = (cols[statusIdx] || '').toLowerCase();
      if (status && status !== 'completed' && status !== 'cleared') return;

      const dateVal = cols[dateIdx >= 0 ? dateIdx : 0] || '';
      const m = extractMonthKey(dateVal);
      if (!m) return;

      const netVal = cols[netIdx] ? parseCurrency(cols[netIdx]) : parseCurrency(cols[grossIdx] || '0');
      const entry = monthlyAggregates.get(m.key) || { label: m.label, income: 0, expenses: 0, count: 0 };

      if (netVal > 0) {
        entry.income += netVal;
      } else {
        entry.expenses += Math.abs(netVal);
      }
      entry.count += 1;
      monthlyAggregates.set(m.key, entry);
      totalTxs++;
    });

    return formatResult(monthlyAggregates, 'PayPal Business Activity', 'paypal', totalTxs);
  }

  if (isUpwork) {
    // Upwork indices
    const dateIdx = headerParts.findIndex((h) => h.includes('date'));
    const amountIdx = headerParts.findIndex((h) => h === 'amount');
    const typeIdx = headerParts.findIndex((h) => h === 'type');

    lines.slice(1).forEach((line) => {
      const cols = splitCsvLine(line);
      const type = (cols[typeIdx] || '').toLowerCase();
      if (type.includes('withdrawal')) return; // Skip withdrawals from bank

      const dateVal = cols[dateIdx >= 0 ? dateIdx : 0] || '';
      const m = extractMonthKey(dateVal);
      if (!m) return;

      const amount = parseCurrency(cols[amountIdx >= 0 ? amountIdx : 8] || '0');
      const entry = monthlyAggregates.get(m.key) || { label: m.label, income: 0, expenses: 0, count: 0 };

      if (amount > 0) {
        entry.income += amount;
      } else {
        entry.expenses += Math.abs(amount);
      }
      entry.count += 1;
      monthlyAggregates.set(m.key, entry);
      totalTxs++;
    });

    return formatResult(monthlyAggregates, 'Upwork Contract Payouts', 'upwork', totalTxs);
  }

  if (isAccountingLedger) {
    const dateIdx = headerParts.findIndex((h) => h.includes('date'));
    const creditIdx = headerParts.findIndex((h) => h.includes('credit'));
    const debitIdx = headerParts.findIndex((h) => h.includes('debit'));

    lines.slice(1).forEach((line) => {
      const cols = splitCsvLine(line);
      const dateVal = cols[dateIdx >= 0 ? dateIdx : 0] || '';
      const m = extractMonthKey(dateVal);
      if (!m) return;

      const credit = Math.max(0, parseCurrency(cols[creditIdx] || '0'));
      const debit = Math.max(0, parseCurrency(cols[debitIdx] || '0'));

      const entry = monthlyAggregates.get(m.key) || { label: m.label, income: 0, expenses: 0, count: 0 };
      entry.income += credit;
      entry.expenses += debit;
      entry.count += 1;
      monthlyAggregates.set(m.key, entry);
      totalTxs++;
    });

    return formatResult(monthlyAggregates, 'Wave / QuickBooks General Ledger', 'wave_quickbooks', totalTxs);
  }

  // Fallback: Standard Spreadsheets / Paste table (Month, Income, Expenses)
  const legacyRecords = parsePastedData(text);
  const totalInc = legacyRecords.reduce((acc, r) => acc + r.income, 0);
  const totalExp = legacyRecords.reduce((acc, r) => acc + r.expenses, 0);

  return {
    records: legacyRecords,
    detectedFormat: legacyRecords.length > 0 ? 'Spreadsheet Monthly Table (Excel/Sheets)' : 'Unrecognized CSV',
    provider: 'spreadsheet',
    transactionCount: legacyRecords.length,
    totalIncome: Math.round(totalInc),
    totalExpenses: Math.round(totalExp),
    monthsCount: legacyRecords.length,
    sampleRowsCount: lines.length,
  };
}

/**
 * Formats aggregated monthly totals into 12 sorted MonthlyRecords.
 */
function formatResult(
  aggregates: Map<string, { label: string; income: number; expenses: number; count: number }>,
  detectedFormat: string,
  provider: ParsedCsvResult['provider'],
  totalTxs: number
): ParsedCsvResult {
  const sortedKeys = Array.from(aggregates.keys()).sort();
  const records: MonthlyRecord[] = sortedKeys.map((key, idx) => {
    const item = aggregates.get(key)!;
    return {
      id: `ingested-${idx + 1}-${Date.now()}`,
      month: item.label,
      income: Math.round(item.income),
      expenses: Math.round(item.expenses),
      clientTag: `${provider.toUpperCase()} Sync`,
    };
  });

  // If fewer than 12 months were found, pad up to 12 months using normalized sequence
  if (records.length > 0 && records.length < 12) {
    const avgInc = Math.round(records.reduce((a, b) => a + b.income, 0) / records.length);
    const avgExp = Math.round(records.reduce((a, b) => a + b.expenses, 0) / records.length);
    const needed = 12 - records.length;
    for (let i = 0; i < needed; i++) {
      const idx = (records.length + i) % 12;
      records.push({
        id: `padded-${i + 1}-${Date.now()}`,
        month: MONTH_NAMES[idx],
        income: avgInc,
        expenses: avgExp,
        clientTag: 'Estimated Trajectory',
      });
    }
  }

  // Limit to 12 months for the CashFloor runway engine
  const finalRecords = records.slice(0, 12);
  const totalIncome = finalRecords.reduce((sum, r) => sum + r.income, 0);
  const totalExpenses = finalRecords.reduce((sum, r) => sum + r.expenses, 0);

  return {
    records: finalRecords,
    detectedFormat,
    provider,
    transactionCount: totalTxs,
    totalIncome,
    totalExpenses,
    monthsCount: finalRecords.length,
    sampleRowsCount: totalTxs,
  };
}

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
    const parts = splitCsvLine(line);

    // Skip table header lines
    const lowerFirst = parts[0]?.toLowerCase();
    if (
      lowerFirst === 'month' ||
      lowerFirst === 'date' ||
      lowerFirst === 'period' ||
      parts.some((p) => p.toLowerCase().includes('income') || p.toLowerCase().includes('revenue'))
    ) {
      return;
    }

    let monthName = parts[0] || MONTH_NAMES[records.length % 12];
    let income = 0;
    let expenses = 0;

    const firstAsNum = parseCurrency(parts[0]);
    if (!isNaN(firstAsNum) && parts[0].match(/^[$€£₹\d]/)) {
      monthName = MONTH_NAMES[records.length % 12];
      income = Math.max(0, firstAsNum);
      expenses = Math.max(0, parseCurrency(parts[1] || '0'));
    } else {
      income = Math.max(0, parseCurrency(parts[1] || '0'));
      expenses = Math.max(0, parseCurrency(parts[2] || '0'));
    }

    if (income > 0 || expenses > 0) {
      records.push({
        id: `pasted-${index + 1}-${Date.now()}`,
        month: monthName,
        income,
        expenses,
      });
    }
  });

  return records;
}
