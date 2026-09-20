export interface MonthlyRecord {
  id: string;
  month: string; // e.g. "Jan", "Feb", "2025-01"
  income: number;
  expenses: number;
  clientTag?: string;
  category?: string;
}

export type ScenarioMode = 'base' | 'conservative' | 'client_loss' | 'dry_spell' | 'windfall' | 'late_invoice';

export interface CalculatorAssumptions {
  taxReservePct: number; // e.g. 0.25 for 25%
  bufferMonthsMultiplier: number; // e.g. 3.5 months
  currentSavings: number; // current liquid cash reserve
  percentile?: number; // default 20 (20th percentile conservative floor)
  scenario?: ScenarioMode;
  clientLossPercentage?: number; // e.g. 30% reduction if client lost
  windfallAmount?: number; // e.g. $10,000 extra project
  retainerProbability?: number; // e.g. 0.85 for 85% certainty
}

export interface ClientConcentration {
  tag: string;
  totalIncome: number;
  percentageOfTotal: number;
  isHighRisk: boolean; // > 45% concentration
}

export interface VolatilityMetrics {
  standardDeviation: number;
  meanIncome: number;
  coefficientOfVariation: number; // CV = SD / Mean
  volatilityTier: 'calm' | 'moderate' | 'volatile';
  minMonth: number;
  maxMonth: number;
  peakToTroughRatio: number;
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
  isInfiniteRunway: boolean;
  isBufferComplete: boolean;
  hasDeficitAtFloor: boolean;
  monthlyFloorSurplusDeficit: number;
  monthsToBufferTarget: number;
  bufferFundingPercentage: number;
  
  // Google Stitch & Fintech Advisor Metrics
  exhaustionDate: string; // e.g. "Nov 18, 2025"
  dailyBurnVelocity: number; // e.g. $76.66/day
  surplusMargin: number; // e.g. +$1,470 above buffer threshold
  sensitivityDaysPer150: number; // days runway extended by trimming $150/mo
  pillarBreakdown: PillarRow[];

  // Advanced Analytics & Risk Dimensions
  volatility: VolatilityMetrics;
  clientConcentrations: ClientConcentration[];
  windfallAllocation?: WindfallAllocation;
  waterfallSteps: WaterfallStep[];
  scenarioImpactDescription?: string;
}
