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
  lines.push('CASHFLOOR — FREELANCE RUNWAY & INCOME EQUILIBRIUM REPORT');
  lines.push(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`);
  lines.push(`Currency: ${currencySymbol}`);
  lines.push('');

  // Executive Summary
  lines.push('EXECUTIVE FINANCIAL EQUILIBRIUM');
  lines.push(`Cash Runway Months at $0 New Income,${result.isInfiniteRunway ? 'Infinite' : result.runwayMonths}`);
  lines.push(`Conservative Income Floor (20th Percentile),${currencySymbol}${result.floorIncome}`);
  lines.push(`Safe Weekly Owner Draw,${currencySymbol}${Math.round(result.sustainablePaycheck / 4.33)}`);
  lines.push(`Sustainable Monthly Paycheck,${currencySymbol}${result.sustainablePaycheck}`);
  lines.push(`Recommended Monthly Tax Reserve (${Math.round(assumptions.taxReservePct * 100)}%),${currencySymbol}${result.taxReserve}`);
  lines.push(`Safety Buffer Goal (${assumptions.bufferMonthsMultiplier} months),${currencySymbol}${result.bufferTarget}`);
  lines.push(`Current Liquid Cash Reserve,${currencySymbol}${result.currentSavings}`);
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
  lines.push('"This report provides general mathematical simulations based on user-entered data. It does not constitute formal CPA, tax, legal, or investment advice."');

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
  const downloadLink = document.createElement('a');
  downloadLink.setAttribute('href', csvContent);
  downloadLink.setAttribute('download', `cashfloor-runway-report-${Date.now()}.csv`);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
