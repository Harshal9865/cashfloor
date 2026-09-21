import { describe, it, expect } from 'vitest';
import {
  calculateDueDateFromTerms,
  calculateInvoiceTotals,
  generateInvoiceNumber,
  convertInvoiceToPendingInvoice,
  INVOICE_TEMPLATES,
} from './invoiceService';
import { InvoiceData } from './invoiceTypes';

describe('invoiceService', () => {
  it('calculates due date properly across payment terms', () => {
    const baseDate = '2026-05-01';
    expect(calculateDueDateFromTerms(baseDate, 'due_on_receipt')).toBe('2026-05-01');
    expect(calculateDueDateFromTerms(baseDate, 'net_15')).toBe('2026-05-16');
    expect(calculateDueDateFromTerms(baseDate, 'net_30')).toBe('2026-05-31');
  });

  it('calculates invoice subtotal, tax, discount, and total accurately', () => {
    const items = [
      { id: '1', description: 'Development', quantity: 20, unitPrice: 100, amount: 2000 },
      { id: '2', description: 'Deployment', quantity: 1, unitPrice: 500, amount: 500 },
    ];
    // Subtotal: 2500, Discount: 100 -> Base: 2400, Tax 10% -> 240, Total -> 2640
    const totals = calculateInvoiceTotals(items, 10, 100);
    expect(totals.subtotal).toBe(2500);
    expect(totals.discount).toBe(100);
    expect(totals.tax).toBe(240);
    expect(totals.total).toBe(2640);
  });

  it('generates consistent invoice numbers with year', () => {
    const invNum = generateInvoiceNumber('TEST');
    const currentYear = new Date().getFullYear().toString();
    expect(invNum.startsWith(`TEST-${currentYear}-`)).toBe(true);
  });

  it('converts invoice data into a PendingInvoice for dashboard receivables', () => {
    const invoice: InvoiceData = {
      invoiceNumber: 'INV-2026-101',
      issueDate: '2026-06-01',
      dueDate: '2026-06-16',
      paymentTerms: 'net_15',
      currencySymbol: '$',
      currencyCode: 'USD',
      issuer: { name: 'Acme Dev', email: 'dev@acme.com' },
      client: { name: 'Enterprise Corp', company: 'Enterprise Corp' },
      items: [
        { id: '1', description: 'Sprint', quantity: 1, unitPrice: 4500, amount: 4500 },
      ],
      taxRatePct: 0,
      discountAmount: 0,
    };

    const pending = convertInvoiceToPendingInvoice(invoice);
    expect(pending.clientName).toBe('Enterprise Corp');
    expect(pending.amount).toBe(4500);
    expect(pending.expectedDate).toBe('2026-06-16');
    expect(pending.probabilityScore).toBe(0.85);
    expect(pending.isForeignCurrency).toBe(false);
  });

  it('provides rich prebuilt templates', () => {
    expect(INVOICE_TEMPLATES.software_sprint).toBeDefined();
    expect(INVOICE_TEMPLATES.software_sprint.items.length).toBeGreaterThan(0);
    expect(INVOICE_TEMPLATES.design_retainer).toBeDefined();
    expect(INVOICE_TEMPLATES.advisory_consulting).toBeDefined();
  });
});
