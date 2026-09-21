// ─────────────────────────────────────────────────────────────
// CashFloor Calculator Types
// All types are strict — no `any`. Every metric produces an
// accompanying *Description: string for UI one-liner banners.
// ─────────────────────────────────────────────────────────────

export interface MonthlyRecord {
  id: string;
  month: string; // e.g. "Jan", "Feb", "2025-01"
  income: number;
  expenses: number;
  clientTag?: string;
  category?: string;
  isForeignCurrency?: boolean; // Toggles FX volatility haircut
  // Phase 1: Invoice Aging / DSO
  invoicedDate?: string;  // ISO date when invoice was sent
  paidDate?: string;      // ISO date when it was actually paid
  invoiceStatus?: 'paid' | 'pending' | 'overdue' | 'partial';
  invoiceAmount?: number; // could differ from income if partial payment
}

export interface PendingInvoice {
  id: string;
  expectedDate: string; // ISO date
  amount: number;
  clientName: string;
  probabilityScore: number; // e.g. 0.9 for 90% confidence
  isForeignCurrency?: boolean;
}

export type ScenarioMode = 'base' | 'conservative' | 'client_loss' | 'dry_spell' | 'windfall' | 'late_invoice';

export type BusinessEntityType = 'sole_prop' | 'single_member_llc' | 's_corp' | 'foreign_contractor';
export type PaymentTermsType = 'immediate' | 'net_15' | 'net_30' | 'net_60';

export interface ClientCustomization {
  entityType: BusinessEntityType;
  paymentTerms: PaymentTermsType;
  targetSafetyMonths: number; // e.g. 3, 6, 9, 12
  fxHaircutPct: number;       // e.g. 0.03 for 3%
}

export interface CalculatorAssumptions {
  taxReservePct: number;           // e.g. 0.25 for 25%
  bufferMonthsMultiplier: number;  // e.g. 3.5 months
  currentSavings: number;          // current liquid cash reserve
  percentile?: number;             // default 20 (20th percentile conservative floor)
  scenario?: ScenarioMode;
  clientLossPercentage?: number;   // e.g. 30% reduction if client lost
  windfallAmount?: number;         // e.g. $10,000 extra project
  retainerProbability?: number;    // e.g. 0.85 for 85% certainty — probability-weight on floor
  // Phase 2: Inflation Drag
  annualInflationRate?: number;    // e.g. 0.055 = 5.5% US CPI default
  // Client Customizations
  entityType?: BusinessEntityType;
  paymentTerms?: PaymentTermsType;
  fxHaircutPct?: number;
}

export interface ClientConcentration {
  tag: string;
  totalIncome: number;
  percentageOfTotal: number;
  isHighRisk: boolean; // >= 40% HHI warning threshold (tunable)
}

export interface VolatilityMetrics {
  standardDeviation: number;
  meanIncome: number;
  coefficientOfVariation: number; // CV = SD / Mean
  volatilityTier: 'calm' | 'moderate' | 'volatile';
  minMonth: number;
  maxMonth: number;
  peakToTroughRatio: number;
  description: string; // one-liner for UI
}

export interface WindfallAllocation {
  windfallAmount: number;
  taxAllocation: number;
  bufferAllocation: number;
  bonusPaycheckAllocation: number;
}

export interface WaterfallStep {
  label: string;
  amount: number;
  runningTotal: number;
  type: 'inflow' | 'deduction' | 'allocation' | 'net';
  color: string;
}

export interface PillarRow {
  id: string;
  name: string;
  objective: string;
  monthlyQuota: number;
  formula: string;
  fundedBalance: number;
  solvencyStatus: string;
  solvencyType: 'protected' | 'automated' | 'safe' | 'funded' | 'surplus' | 'warning';
  indicatorColor: string;
}

// Phase 1: DSO / Invoice Aging
export interface AgingBucket {
  bucket: '0–30 days' | '31–60 days' | '61–90 days' | '90+ days';
  totalOutstanding: number;
  count: number;
  risk: 'healthy' | 'watch' | 'critical';
}

export interface DSOMetrics {
  dso: number;                        // Days Sales Outstanding
  dsoRating: 'healthy' | 'lagging' | 'critical';
  agingBuckets: AgingBucket[];
  cashFlowLag: number;                // avg days from invoice to receipt
  adjustedRunwayMonths: number;       // runway corrected for lag
  totalOutstanding: number;
  description: string;                // one-liner for UI
}

// Phase 2: Inflation Drag
export interface InflationAdjustedRunway {
  nominalRunwayMonths: number;
  realRunwayMonths: number;           // iteratively solved
  purchasingPowerLossPercent: number;
  inflatedExpenseIn12Months: number;
  monthsLost: number;                 // nominalRunway - realRunway
  description: string;
}

// Phase 3: Tax Deduction Optimizer
export interface DeductionCategory {
  id: string;
  name: string;
  description: string;
  annualEstimate: number;       // user-editable estimate
  isEnabled: boolean;
  legalBasis: string;           // IRS code citation
  maxAllowableByLaw?: number;   // null = no cap
}

export interface TaxOptimizationResult {
  totalDeductions: number;
  taxSavings: number;
  effectiveTaxRate: number;           // after deductions
  adjustedTaxReservePct: number;      // what the lever should really be
  unusedPotential: number;            // dollars left on the table
  runwayExtensionMonths: number;      // how many months more runway from tax savings
  description: string;
}

// Phase 4: Monte Carlo
export interface MonteCarloResult {
  survivalProbabilities: { month: number; probability: number }[];
  p5RunwayMonths: number;
  p50RunwayMonths: number;
  p95RunwayMonths: number;
  probabilityOfSurviving3Months: number;
  probabilityOfSurviving6Months: number;
  probabilityOfSurviving12Months: number;
  riskSignal: 'SAFE' | 'CAUTION' | 'CRITICAL';
  description: string;
}

export interface CalculationResult {
  floorIncome: number;
  taxReserve: number;
  bufferTarget: number;
  currentSavings: number;
  bufferGap: number;
  monthlyBufferContribution: number;
  sustainablePaycheck: number;
  avgMonthlyIncome: number;
  avgMonthlyExpenses: number;
  totalAnnualIncome: number;
  totalAnnualExpenses: number;
  runwayMonths: number;
  riskAdjustedRunwayMonths: number; // Includes probability-weighted A/R
  safeToSpend: number; // currentSavings - taxReserve - bufferTarget
  isInfiniteRunway: boolean;
  isBufferComplete: boolean;
  hasDeficitAtFloor: boolean;
  monthlyFloorSurplusDeficit: number;
  monthsToBufferTarget: number;
  bufferFundingPercentage: number;

  // Stitch Fintech Metrics
  exhaustionDate: string;
  dailyBurnVelocity: number;
  surplusMargin: number;
  sensitivityDaysPer150: number;
  pillarBreakdown: PillarRow[];

  // Advanced Analytics & Risk
  volatility: VolatilityMetrics;
  clientConcentrations: ClientConcentration[];
  windfallAllocation?: WindfallAllocation;
  waterfallSteps: WaterfallStep[];
  scenarioImpactDescription?: string;

  // Phase 1
  dso: DSOMetrics;

  // Phase 2
  inflationAdjusted: InflationAdjustedRunway;

  // Overall insight one-liner
  primaryInsight: string;
}
