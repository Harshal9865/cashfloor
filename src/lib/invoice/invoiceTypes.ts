export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type InvoicePaymentTerms = 'due_on_receipt' | 'net_15' | 'net_30' | 'net_60';

export interface InvoiceIssuer {
  name: string;
  email: string;
  address?: string;
  taxId?: string;
  paymentDetails?: string;
}

export interface InvoiceClient {
  name: string;
  company?: string;
  email?: string;
  address?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  paymentTerms: InvoicePaymentTerms;
  currencySymbol: string;
  currencyCode: string;
  issuer: InvoiceIssuer;
  client: InvoiceClient;
  items: InvoiceItem[];
  taxRatePct: number; // e.g. 0 or 10 for 10%
  discountAmount: number;
  notes?: string;
}

export interface InvoiceTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
}
