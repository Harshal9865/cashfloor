import { InvoiceData, InvoiceItem, InvoicePaymentTerms, InvoiceTotals } from './invoiceTypes';
import { PendingInvoice } from '../calculator/types';

export function calculateDueDateFromTerms(issueDateStr: string, terms: InvoicePaymentTerms): string {
  const date = new Date(issueDateStr);
  if (isNaN(date.getTime())) {
    return issueDateStr;
  }

  let daysToAdd = 0;
  switch (terms) {
    case 'due_on_receipt':
      daysToAdd = 0;
      break;
    case 'net_15':
      daysToAdd = 15;
      break;
    case 'net_30':
      daysToAdd = 30;
      break;
    case 'net_60':
      daysToAdd = 60;
      break;
    default:
      daysToAdd = 30;
  }

  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0];
}

export function calculateInvoiceTotals(
  items: InvoiceItem[],
  taxRatePct: number = 0,
  discountAmount: number = 0
): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const discount = Math.min(Math.max(0, discountAmount), subtotal);
  const taxableBase = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableBase * (taxRatePct / 100) * 100) / 100;
  const total = Math.round((taxableBase + tax) * 100) / 100;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount,
    tax,
    total,
  };
}

export function generateInvoiceNumber(prefix = 'INV'): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${randomSuffix}`;
}

export function convertInvoiceToPendingInvoice(invoice: InvoiceData): PendingInvoice {
  const totals = calculateInvoiceTotals(invoice.items, invoice.taxRatePct, invoice.discountAmount);
  return {
    id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    expectedDate: invoice.dueDate,
    amount: totals.total,
    clientName: invoice.client.company || invoice.client.name || 'Client',
    probabilityScore: invoice.paymentTerms === 'due_on_receipt' ? 0.95 : 0.85,
    isForeignCurrency: invoice.currencyCode !== 'USD',
  };
}

export interface PrebuiltTemplate {
  name: string;
  description: string;
  items: Omit<InvoiceItem, 'id'>[];
  terms: InvoicePaymentTerms;
  notes: string;
}

export const INVOICE_TEMPLATES: Record<string, PrebuiltTemplate> = {
  software_sprint: {
    name: 'Software Engineering Sprint',
    description: 'Bi-weekly engineering delivery with architecture & QA',
    terms: 'net_15',
    items: [
      {
        description: 'Sprint 14: Core API Integration & Database Migration',
        quantity: 40,
        unitPrice: 100,
        amount: 4000,
      },
      {
        description: 'Code Review, Production Load Testing & CI/CD Pipeline Setup',
        quantity: 10,
        unitPrice: 100,
        amount: 1000,
      },
    ],
    notes: 'Payment is due within 15 days of invoice date. Wire transfer or ACH direct deposit preferred.',
  },
  design_retainer: {
    name: 'Product Design & UI Retainer',
    description: 'Monthly dedicated design direction & Figma design system updates',
    terms: 'due_on_receipt',
    items: [
      {
        description: 'Monthly UI/UX Design Retainer — Multi-Platform Web Application',
        quantity: 1,
        unitPrice: 3500,
        amount: 3500,
      },
    ],
    notes: 'Monthly design retainer billed in advance. Thank you for our ongoing creative partnership!',
  },
  advisory_consulting: {
    name: 'Strategic Advisory & Financial Modeling',
    description: 'Executive advisory sessions & quantitative financial audits',
    terms: 'net_30',
    items: [
      {
        description: 'Fractional CFO Advisory & Cash Runway Stress-Testing',
        quantity: 15,
        unitPrice: 160,
        amount: 2400,
      },
      {
        description: 'Executive Board Presentation & Solvency Scenario Deck',
        quantity: 1,
        unitPrice: 800,
        amount: 800,
      },
    ],
    notes: 'Net-30 corporate payment terms. Wire transfer instructions provided below.',
  },
};
