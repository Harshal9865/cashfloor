import { CalculationResult, CalculatorAssumptions, MonthlyRecord } from '../calculator/types';

/**
 * Generates and downloads a clean, professional CSV financial ledger report.
 */
export function exportLedgerToCsv(
  records: MonthlyRecord[],
  result: CalculationResult,
  assumptions: CalculatorAssumptions,
  currencySymbol: string = '$'
) {
  const lines: string[] = [];

  // Header Banner
  lines.push('CALM LEDGER — FREELANCE IRREGULAR INCOME & CASH RUNWAY REPORT');
  lines.push(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`);
  lines.push(`Currency: ${currencySymbol}`);
  lines.push('');

  // Executive Summary
  lines.push('EXECUTIVE FINANCIAL EQUILIBRIUM');
  lines.push(`Cash Runway Months at $0 New Income,${result.isInfiniteRunway ? 'Infinite' : result.runwayMonths}`);
  lines.push(`Conservative Income Floor (20th Percentile),${result.floorIncome}`);
  lines.push(`Sustainable Monthly Paycheck,${result.sustainablePaycheck}`);
  lines.push(`Recommended Monthly Tax Reserve (${Math.round(assumptions.taxReservePct * 100)}%),${result.taxReserve}`);
  lines.push(`Safety Buffer Goal (${assumptions.bufferMonthsMultiplier} months),${result.bufferTarget}`);
  lines.push(`Current Liquid Cash Reserve,${result.currentSavings}`);
  lines.push(`Buffer Funding Status,${result.bufferFundingPercentage}% (${result.isBufferComplete ? 'Fully Funded' : 'In Progress'})`);
  lines.push(`Income Volatility Tier,${result.volatility.volatilityTier.toUpperCase()} (CV: ${result.volatility.coefficientOfVariation})`);
  lines.push('');

  // Monthly Breakdown Table
  lines.push('HISTORICAL & PROJECTED MONTHLY LEDGER');
  lines.push('Month,Client Tag,Gross Income,Living / Operating Expenses,Net Cash Flow');

  records.forEach((r) => {
    const net = r.income - r.expenses;
    lines.push(`"${r.month}","${r.clientTag || 'Standard'}","${r.income}","${r.expenses}","${net}"`);
  });

  lines.push('');
  lines.push(`Total Annual Inflow,,"${result.totalAnnualIncome}",,`);
  lines.push(`Total Annual Outflow,,,"${result.totalAnnualExpenses}",`);
  lines.push(`Average Monthly Inflow,,"${result.avgMonthlyIncome}",,`);
  lines.push(`Average Monthly Outflow,,,"${result.avgMonthlyExpenses}",`);
  lines.push('');
  lines.push('LEGAL DISCLAIMER');
  lines.push('"This report provides general mathematical calculations based on user-entered numbers. It does not constitute personalized financial, legal, tax, or investment advice."');

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', csvContent);
  downloadLink.setAttribute('download', `calm-ledger-financial-plan-${Date.now()}.csv`);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
