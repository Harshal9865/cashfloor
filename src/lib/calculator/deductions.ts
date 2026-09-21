// ─────────────────────────────────────────────────────────────
// Tax Deduction Optimizer Engine — Phase 3
// Legal basis cited for every deduction category.
// ─────────────────────────────────────────────────────────────
import { DeductionCategory, TaxOptimizationResult } from './types';

// IRS 2024 standard deduction for self-employed individuals
// Source: IRS Publication 334 (Tax Guide for Small Business, 2024)
const SELF_EMPLOYMENT_TAX_RATE = 0.1530; // 15.3% SE tax (Social Security 12.4% + Medicare 2.9%)
const SE_TAX_DEDUCTION_RATE = 0.5; // IRS allows deducting 50% of SE tax — IRC §164(f)

// SEP-IRA 2024 contribution limit
// Source: IRS Notice 2023-75 — $69,000 or 25% of net earnings, whichever is less
const SEP_IRA_MAX_2024 = 69000;

export const DEFAULT_DEDUCTION_CATEGORIES: DeductionCategory[] = [
  {
    id: 'home_office',
    name: 'Home Office Deduction',
    description: 'Proportional share of rent/mortgage, utilities, and internet for dedicated workspace.',
    annualEstimate: 2400, // $200/mo reasonable estimate
    isEnabled: false,
    legalBasis: 'IRS Publication 587 — Business Use of Your Home',
    maxAllowableByLaw: undefined,
  },
  {
    id: 'sep_ira',
    name: 'SEP-IRA Retirement Contribution',
    description: 'Pre-tax retirement contribution — the most powerful tax lever for self-employed individuals.',
    annualEstimate: 6000,
    isEnabled: false,
    legalBasis: `IRC §402(h) — 2024 limit: $${SEP_IRA_MAX_2024.toLocaleString()} or 25% of net earnings`,
    maxAllowableByLaw: SEP_IRA_MAX_2024,
  },
  {
    id: 'health_insurance',
    name: 'Self-Employed Health Insurance',
    description: 'Premiums paid for health, dental, and vision coverage for you and your family.',
    annualEstimate: 4800,
    isEnabled: false,
    legalBasis: 'IRC §162(l) — 100% deductible above-the-line',
    maxAllowableByLaw: undefined,
  },
  {
    id: 'software',
    name: 'Software & SaaS Subscriptions',
    description: 'Adobe, Figma, Notion, Slack, CashFloor Pro, and all business-purpose SaaS tools.',
    annualEstimate: 1800,
    isEnabled: false,
    legalBasis: 'IRS Schedule C, Line 22 — Office Expense / Line 27 — Other Expenses',
    maxAllowableByLaw: undefined,
  },
  {
    id: 'professional_development',
    name: 'Professional Development & Education',
    description: 'Courses, books, conferences, and certifications that maintain or improve business skills.',
    annualEstimate: 1200,
    isEnabled: false,
    legalBasis: 'IRC §162 — Ordinary & Necessary Business Expenses; Rev. Rul. 68-71',
    maxAllowableByLaw: undefined,
  },
  {
    id: 'phone_internet',
    name: 'Phone & Internet (Business %)',
    description: 'Proportional business-use share of your mobile plan and home internet.',
    annualEstimate: 900,
    isEnabled: false,
    legalBasis: 'IRS Schedule C, Line 25 — Utilities',
    maxAllowableByLaw: undefined,
  },
  {
    id: 'equipment',
    name: 'Equipment & Technology',
    description: 'Laptop, monitors, camera, peripherals — deductible in year of purchase (Section 179).',
    annualEstimate: 2000,
    isEnabled: false,
    legalBasis: 'IRC §179 — Section 179 Expensing Election; IRS Form 4562',
    maxAllowableByLaw: 1160000, // 2024 Section 179 limit
  },
  {
    id: 'se_tax_deduction',
    name: '50% Self-Employment Tax Deduction',
    description: 'The IRS lets you deduct half of your SE tax (15.3%) automatically as an above-the-line deduction.',
    annualEstimate: 0, // auto-calculated below based on income
    isEnabled: true, // always enabled — this is an automatic IRS entitlement
    legalBasis: 'IRC §164(f) — Automatically applies to all self-employed individuals',
    maxAllowableByLaw: undefined,
  },
];

/**
 * Calculates tax savings from enabled deductions.
 * Uses the marginal tax rate logic: each deduction reduces taxable income,
 * which reduces taxes at the marginal rate.
 *
 * @param grossAnnualIncome - total annual income before deductions
 * @param nominalTaxRate - user's current tax reserve rate (e.g. 0.25)
 * @param deductions - array of DeductionCategory with user selections
 * @param monthlyExpenses - for runway extension calculation
 * @param runwayMonths - nominal runway (for extension calculation)
 */
export function calculateTaxSavings(
  grossAnnualIncome: number,
  nominalTaxRate: number,
  deductions: DeductionCategory[],
  monthlyExpenses: number,
  runwayMonths: number,
): TaxOptimizationResult {
  // Auto-calculate SE Tax deduction amount based on income
  // SE tax = grossIncome × 0.9235 × 0.1530; deductible half = SE tax × 0.5
  // Source: IRS Schedule SE instructions
  const netEarnings = grossAnnualIncome * 0.9235; // after SE tax reduction factor
  const seTax = netEarnings * SELF_EMPLOYMENT_TAX_RATE;
  const seDeductibleAmount = seTax * SE_TAX_DEDUCTION_RATE;

  const enrichedDeductions = deductions.map((d) =>
    d.id === 'se_tax_deduction'
      ? { ...d, annualEstimate: Math.round(seDeductibleAmount) }
      : d,
  );

  // Total enabled deductions
  const totalDeductions = enrichedDeductions
    .filter((d) => d.isEnabled)
    .reduce((sum, d) => {
      // Respect per-category legal caps
      const amount =
        d.maxAllowableByLaw !== undefined
          ? Math.min(d.annualEstimate, d.maxAllowableByLaw)
          : d.annualEstimate;
      return sum + amount;
    }, 0);

  // Can't deduct more than gross income
  const effectiveDeductions = Math.min(totalDeductions, grossAnnualIncome);

  // Taxable income after deductions
  const taxableIncome = Math.max(0, grossAnnualIncome - effectiveDeductions);

  // Tax savings: the deductions save you taxes at the marginal rate
  const taxSavings = Math.round(effectiveDeductions * nominalTaxRate);

  // Effective (blended) tax rate after deductions
  const effectiveTaxRate =
    grossAnnualIncome > 0
      ? (taxableIncome * nominalTaxRate) / grossAnnualIncome
      : nominalTaxRate;

  const adjustedTaxReservePct = Math.round(effectiveTaxRate * 1000) / 1000;

  // Unused potential: deductions not yet enabled
  const unusedPotential = enrichedDeductions
    .filter((d) => !d.isEnabled)
    .reduce((sum, d) => sum + d.annualEstimate, 0);

  // Runway extension: monthly tax savings / monthly expenses = extra months
  const monthlyTaxSavings = taxSavings / 12;
  const runwayExtensionMonths =
    monthlyExpenses > 0
      ? Math.round((monthlyTaxSavings / monthlyExpenses) * 10) / 10
      : 0;

  const enabledCount = enrichedDeductions.filter((d) => d.isEnabled).length;
  const description =
    taxSavings === 0
      ? 'Enable deductions to reduce your effective tax rate and extend your runway.'
      : `Claiming ${enabledCount} deduction${enabledCount !== 1 ? 's' : ''} reduces your effective tax rate from ${Math.round(nominalTaxRate * 100)}% → ${Math.round(effectiveTaxRate * 100)}%, saving you $${taxSavings.toLocaleString()}/year (+${runwayExtensionMonths} months runway).`;

  return {
    totalDeductions: Math.round(effectiveDeductions),
    taxSavings,
    effectiveTaxRate,
    adjustedTaxReservePct,
    unusedPotential: Math.round(unusedPotential),
    runwayExtensionMonths,
    description,
  };
}
