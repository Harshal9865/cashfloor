/**
 * Sample CSV generator for testing universal ingestion.
 * Produces authentic mock transaction statements matching Stripe, Wise, PayPal, Upwork, and spreadsheets.
 */

export function getSampleCsvContent(provider: 'stripe' | 'wise' | 'paypal' | 'upwork' | 'spreadsheet'): {
  filename: string;
  content: string;
} {
  switch (provider) {
    case 'stripe':
      return {
        filename: 'stripe-sample-payouts.csv',
        content: `id,Description,Amount,Fee,Net,Currency,Created (UTC),Type
txn_101,Enterprise Retainer Sprint 1,5000.00,145.00,4855.00,usd,2025-01-15 10:00,charge
txn_102,UI Design Milestone,3200.00,92.80,3107.20,usd,2025-01-28 14:30,charge
txn_103,Figma Cloud Subscription,45.00,0.00,-45.00,usd,2025-02-01 09:00,fee
txn_104,Consulting Retainer,4500.00,130.50,4369.50,usd,2025-02-15 11:20,charge
txn_105,Apex Studio Architecture,5800.00,168.20,5631.80,usd,2025-03-10 16:00,charge
txn_106,Quarterly Tax Payout,2500.00,0.00,-2500.00,usd,2025-03-15 08:00,payout
txn_107,Direct Client Sprint,3900.00,113.10,3786.90,usd,2025-04-12 10:45,charge
txn_108,Bolt Studio Advisory,4200.00,121.80,4078.20,usd,2025-05-18 15:30,charge
txn_109,Summer Brand Identity,5100.00,147.90,4952.10,usd,2025-06-20 12:00,charge`,
      };

    case 'wise':
      return {
        filename: 'wise-multi-currency-sample.csv',
        content: `TransferWise ID,Date,Amount,Currency,Description,Payment Reference,Running Balance,Total fees
TR_901,15-01-2025,4800.00,USD,Client Invoice Clearance,INV-2025-01,14800.00,14.50
TR_902,28-01-2025,-420.00,USD,AWS Cloud Infrastructure,CARD-9821,14380.00,0.00
TR_903,12-02-2025,5200.00,USD,Retainer Monthly Wire,INV-2025-02,19580.00,15.20
TR_904,25-02-2025,-1200.00,USD,Health Insurance Premium,ACH-DEBIT,18380.00,0.00
TR_905,10-03-2025,3800.00,USD,Development Sprint,INV-2025-03,22180.00,12.00
TR_906,18-04-2025,4600.00,USD,Advisory Retainer,INV-2025-04,26780.00,14.00
TR_907,15-05-2025,4900.00,USD,Frontend Architecture,INV-2025-05,31680.00,14.50`,
      };

    case 'paypal':
      return {
        filename: 'paypal-sample-statement.csv',
        content: `Date,Time,TimeZone,Name,Type,Status,Currency,Gross,Fee,Net
01/15/2025,10:30:00,PST,Overseas Client LLC,Payment Received,Completed,USD,4200.00,-146.70,4053.30
02/10/2025,14:20:00,PST,Digital Studio Corp,Payment Received,Completed,USD,3800.00,-132.70,3667.30
03/15/2025,09:15:00,PST,SaaS Advisory Partners,Payment Received,Completed,USD,5100.00,-178.20,4921.80
04/18/2025,16:40:00,PST,Vanguard Retainer,Payment Received,Completed,USD,4400.00,-153.70,4246.30
05/20/2025,11:10:00,PST,Acme Studio Project,Payment Received,Completed,USD,4900.00,-171.20,4728.80`,
      };

    case 'upwork':
      return {
        filename: 'upwork-sample-ledger.csv',
        content: `Date,Ref ID,Type,Description,Agency,Freelancer,Amount,Currency
Jan 15 2025,REF-9812,Fixed Price,Milestone 2 - API Gateway & Schema,,Alex Vance,3500.00,USD
Feb 10 2025,REF-9813,Hourly,40 hrs @ $95/hr Frontend Engineering,,Alex Vance,3800.00,USD
Mar 12 2025,REF-9814,Fixed Price,Milestone 3 - Database Indexing & Caching,,Alex Vance,4200.00,USD
Apr 14 2025,REF-9815,Hourly,45 hrs @ $95/hr Cloud Migration,,Alex Vance,4275.00,USD
May 16 2025,REF-9816,Fixed Price,Quarterly Retainer Completion,,Alex Vance,4500.00,USD`,
      };

    case 'spreadsheet':
    default:
      return {
        filename: 'cashfloor-sample-spreadsheet.csv',
        content: `Month,Income,Expenses,Client Tag
Jul 2025,4050,2100,Acme Retainer
Aug 2025,4400,2100,Bolt Studio
Sep 2025,2850,2100,Acme Retainer
Oct 2025 (Lean),1600,2100,Direct Client C
Nov 2025,3400,2100,Acme Retainer
Dec 2025 (Peak),5900,2300,Apex Design
Jan 2026,4000,2100,Bolt Studio
Feb 2026,4100,2100,Direct Client C
Mar 2026 (Tax),3300,2200,Acme Retainer
Apr 2026,4500,2100,Bolt Studio
May 2026,4800,2100,Direct Client C
Jun 2026,4600,2250,Acme Retainer`,
      };
  }
}

export function triggerDownloadSampleCsv(provider: 'stripe' | 'wise' | 'paypal' | 'upwork' | 'spreadsheet') {
  const { filename, content } = getSampleCsvContent(provider);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
