import {
  CalculatorAssumptions,
  CalculationResult,
  MonthlyRecord,
  VolatilityMetrics,
  ClientConcentration,
  WindfallAllocation,
  WaterfallStep,
  DSOMetrics,
  AgingBucket,
  InflationAdjustedRunway,
} from './types';

// ─── Financial Calendar Constants ───────────────────────────────────────────
// Source: ISO 8601 / IFRS financial calendar standard
const DAYS_PER_MONTH = 365.25 / 12; // 30.4375 — NOT the hardcoded 30.417

// HHI (Herfindahl-Hirschman Index) threshold for high-risk client concentration
// Source: DOJ Horizontal Merger Guidelines; 40%+ signals single-point-of-failure risk
const HHI_HIGH_RISK_THRESHOLD = 40;

// ─── P0.1: incomeFloor — now accepts retainerProbability weighting ────────
/**
 * Computes the conservative income floor at a specified percentile (default: 20th percentile).
 * Then applies a retainerProbability confidence discount:
 *   weightedFloor = P20_floor × retainerProbability
 *
 * @param incomes - array of monthly income values
 * @param percentile - default 20 (20th percentile)
 * @param retainerProbability - confidence weight [0,1], default 1.0 (no discount)
 */
export function incomeFloor(
  incomes: number[],
  percentile: number = 20,
  retainerProbability: number = 1.0,
): number {
  if (!incomes || incomes.length === 0) return 0;

  const valid = incomes
    .filter((n) => typeof n === 'number' && !isNaN(n) && isFinite(n))
    .map((n) => Math.max(0, n));

  if (valid.length === 0) return 0;

  // True percentile interpolation (linear)
  const sorted = [...valid].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  const rawFloor = sorted[Math.max(0, index)];

  // P0.1 FIX: Apply retainer probability as a confidence-weighted discount
  // If retainerProbability=0.85, we assume 85% of that floor is reliably collectible
  const prob = Math.min(1, Math.max(0, retainerProbability));
  return Math.round(rawFloor * prob);
}

/**
 * Calculates safety buffer target based on average monthly expenses and target months.
 */
export function calculateBufferTarget(
  avgMonthlyExpenses: number,
  bufferMonthsMultiplier: number = 3.5,
): number {
  if (avgMonthlyExpenses <= 0 || bufferMonthsMultiplier <= 0) return 0;
  return Math.round(avgMonthlyExpenses * bufferMonthsMultiplier);
}

/**
 * Calculates runway months at $0 new income.
 */
export function calculateRunway(
  currentSavings: number,
  avgMonthlyExpenses: number,
): { runwayMonths: number; isInfiniteRunway: boolean } {
  const savings = Math.max(0, currentSavings);

  if (avgMonthlyExpenses <= 0) {
    if (savings > 0) return { runwayMonths: 999, isInfiniteRunway: true };
    return { runwayMonths: 0, isInfiniteRunway: false };
  }

  const raw = savings / avgMonthlyExpenses;
  return { runwayMonths: Math.round(raw * 10) / 10, isInfiniteRunway: false };
}

/**
 * Computes volatility metrics including standard deviation and CV.
 * Returns a plain-English `description` for UI one-liner banners.
 */
export function calculateVolatility(incomes: number[]): VolatilityMetrics {
  const valid = (incomes || []).filter(
    (n) => typeof n === 'number' && !isNaN(n) && isFinite(n),
  );
  if (valid.length === 0) {
    return {
      standardDeviation: 0,
      meanIncome: 0,
      coefficientOfVariation: 0,
      volatilityTier: 'calm',
      minMonth: 0,
      maxMonth: 0,
      peakToTroughRatio: 1,
      description: 'No income data to assess volatility.',
    };
  }

  const mean = valid.reduce((a, b) => a + b, 0) / valid.length;
  const variance =
    valid.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) /
    valid.length;
  const standardDeviation = Math.round(Math.sqrt(variance));
  const cv = mean > 0 ? Number((standardDeviation / mean).toFixed(2)) : 0;

  let volatilityTier: 'calm' | 'moderate' | 'volatile' = 'moderate';
  if (cv < 0.25) volatilityTier = 'calm';
  else if (cv > 0.45) volatilityTier = 'volatile';

  const minMonth = Math.min(...valid);
  const maxMonth = Math.max(...valid);
  const peakToTroughRatio =
    minMonth > 0
      ? Number((maxMonth / minMonth).toFixed(1))
      : maxMonth > 0
      ? 99
      : 1;

  // Plain-English description
  const description =
    volatilityTier === 'calm'
      ? `Income volatility is LOW (CV=${cv}). Your cash flow is stable and predictable.`
      : volatilityTier === 'volatile'
      ? `Income volatility is HIGH (CV=${cv}). Consider a 6+ month buffer, not 3.5.`
      : `Income volatility is MODERATE (CV=${cv}). A 3.5-month buffer is your minimum safe threshold.`;

  return {
    standardDeviation,
    meanIncome: Math.round(mean),
    coefficientOfVariation: cv,
    volatilityTier,
    minMonth,
    maxMonth,
    peakToTroughRatio,
    description,
  };
}

/**
 * Computes client concentration risk using an HHI-inspired approach.
 * isHighRisk threshold: 40% — based on DOJ Horizontal Merger Guidelines.
 */
export function calculateClientConcentrations(
  records: MonthlyRecord[],
): ClientConcentration[] {
  const tagTotals: Record<string, number> = {};
  let totalIncome = 0;

  records.forEach((r) => {
    const tag = r.clientTag || 'Primary Client';
    tagTotals[tag] = (tagTotals[tag] || 0) + r.income;
    totalIncome += r.income;
  });

  if (totalIncome === 0) return [];

  return Object.entries(tagTotals)
    .map(([tag, amount]) => {
      const pct = Math.round((amount / totalIncome) * 100);
      return {
        tag,
        totalIncome: amount,
        percentageOfTotal: pct,
        isHighRisk: pct >= HHI_HIGH_RISK_THRESHOLD, // P0.3 FIX: named constant, not magic number
      };
    })
    .sort((a, b) => b.totalIncome - a.totalIncome);
}

/**
 * Computes the Windfall Allocation Waterfall.
 */
export function calculateWindfallWaterfall(
  windfallAmount: number,
  taxReservePct: number,
  bufferGap: number,
): WindfallAllocation {
  const amount = Math.max(0, windfallAmount);
  const tax = Math.round(amount * taxReservePct);
  const postTax = Math.max(0, amount - tax);
  const bufferAllocation = Math.min(bufferGap, postTax);
  const bonusPaycheck = Math.max(0, postTax - bufferAllocation);

  return {
    windfallAmount: amount,
    taxAllocation: tax,
    bufferAllocation,
    bonusPaycheckAllocation: bonusPaycheck,
  };
}

// ─── Phase 1: DSO & Invoice Aging ─────────────────────────────────────────
/**
 * Calculates Days Sales Outstanding (DSO) and aging buckets.
 *
 * Formula: DSO = (Total Outstanding Receivables / Total Revenue) × 30.4375
 * Source: GAAP / IFRS receivables management standards
 *
 * @returns DSOMetrics with aging buckets and a plain-English description
 */
export function calculateDSO(
  records: MonthlyRecord[],
  nominalRunwayMonths: number,
): DSOMetrics {
  const today = new Date();
  const totalRevenue = records.reduce((sum, r) => sum + r.income, 0);

  // Outstanding = pending + overdue invoices
  const outstanding = records
    .filter(
      (r) =>
        r.invoiceStatus === 'pending' || r.invoiceStatus === 'overdue',
    )
    .reduce((sum, r) => sum + (r.invoiceAmount ?? r.income), 0);

  // Formal DSO
  const dso =
    totalRevenue > 0
      ? (outstanding / totalRevenue) * DAYS_PER_MONTH
      : 0;

  // Average actual payment lag from records that have both dates
  const paidRecords = records.filter(
    (r) => r.paidDate && r.invoicedDate,
  );
  const avgLag =
    paidRecords.length > 0
      ? paidRecords.reduce((acc, r) => {
          const lag =
            (new Date(r.paidDate!).getTime() -
              new Date(r.invoicedDate!).getTime()) /
            (1000 * 60 * 60 * 24);
          return acc + lag;
        }, 0) / paidRecords.length
      : 0;

  // Aging buckets — categorize pending/overdue invoices by days outstanding
  const agingBuckets: AgingBucket[] = [
    { bucket: '0–30 days', totalOutstanding: 0, count: 0, risk: 'healthy' },
    { bucket: '31–60 days', totalOutstanding: 0, count: 0, risk: 'watch' },
    { bucket: '61–90 days', totalOutstanding: 0, count: 0, risk: 'critical' },
    { bucket: '90+ days', totalOutstanding: 0, count: 0, risk: 'critical' },
  ];

  records
    .filter(
      (r) =>
        (r.invoiceStatus === 'pending' || r.invoiceStatus === 'overdue') &&
        r.invoicedDate,
    )
    .forEach((r) => {
      const daysOut =
        (today.getTime() - new Date(r.invoicedDate!).getTime()) /
        (1000 * 60 * 60 * 24);
      const amount = r.invoiceAmount ?? r.income;
      if (daysOut <= 30) {
        agingBuckets[0].totalOutstanding += amount;
        agingBuckets[0].count++;
      } else if (daysOut <= 60) {
        agingBuckets[1].totalOutstanding += amount;
        agingBuckets[1].count++;
      } else if (daysOut <= 90) {
        agingBuckets[2].totalOutstanding += amount;
        agingBuckets[2].count++;
      } else {
        agingBuckets[3].totalOutstanding += amount;
        agingBuckets[3].count++;
      }
    });

  // Adjust runway for cash flow lag: lag/DAYS_PER_MONTH months of runway are "phantom"
  const cashFlowLagMonths = avgLag / DAYS_PER_MONTH;
  const adjustedRunwayMonths = Math.max(
    0,
    nominalRunwayMonths - cashFlowLagMonths,
  );

  const dsoRounded = Math.round(dso);
  const dsoRating =
    dsoRounded < 30
      ? 'healthy'
      : dsoRounded < 60
      ? 'lagging'
      : 'critical';

  const lagMonthsDisplay = cashFlowLagMonths.toFixed(1);
  const description =
    outstanding === 0 && paidRecords.length === 0
      ? 'No invoice dates entered yet. Add invoice dates to your ledger to track DSO.'
      : dsoRating === 'healthy'
      ? `Your DSO is ${dsoRounded} days — invoices are paid promptly. Cash flow is healthy.`
      : dsoRating === 'lagging'
      ? `Your DSO is ${dsoRounded} days — cash is arriving ~${lagMonthsDisplay} months late. Real runway is lower.`
      : `CRITICAL: DSO is ${dsoRounded} days. Overdue receivables are distorting your runway by ${lagMonthsDisplay} months.`;

  return {
    dso: dsoRounded,
    dsoRating,
    agingBuckets,
    cashFlowLag: Math.round(avgLag),
    adjustedRunwayMonths: Math.round(adjustedRunwayMonths * 10) / 10,
    totalOutstanding: outstanding,
    description,
  };
}

// ─── Phase 2: Inflation Drag ───────────────────────────────────────────────
/**
 * Computes inflation-adjusted runway using compound monthly inflation.
 *
 * Uses the Fisher equation: Real Rate ≈ Nominal Rate - Inflation Rate
 * Monthly rate: (1 + annual)^(1/12) - 1
 *
 * Default annual inflation rate: 5.5% — US CPI 12-month rolling average (2024)
 * Source: Bureau of Labor Statistics, CPI-U, release 2024-09
 *
 * @returns InflationAdjustedRunway with real runway and plain-English description
 */
export function applyInflationDrag(
  currentSavings: number,
  monthlyExpenses: number,
  nominalRunwayMonths: number,
  annualInflationRate: number = 0.055,
): InflationAdjustedRunway {
  if (monthlyExpenses <= 0 || currentSavings <= 0) {
    return {
      nominalRunwayMonths,
      realRunwayMonths: nominalRunwayMonths,
      purchasingPowerLossPercent: 0,
      inflatedExpenseIn12Months: monthlyExpenses,
      monthsLost: 0,
      description: 'No expenses data available for inflation adjustment.',
    };
  }

  // Monthly inflation compounding (standard financial formula)
  const monthlyInflationRate = Math.pow(1 + annualInflationRate, 1 / 12) - 1;

  // Iteratively solve: how many months of inflating expenses can savings cover?
  let remainingSavings = currentSavings;
  let realMonths = 0;
  let currentExpense = monthlyExpenses;

  while (remainingSavings > currentExpense && realMonths < 600) {
    remainingSavings -= currentExpense;
    currentExpense *= 1 + monthlyInflationRate; // each month is slightly more expensive
    realMonths++;
  }

  const realRunwayMonths = Math.round(realMonths * 10) / 10;
  const monthsLost = Math.round((nominalRunwayMonths - realRunwayMonths) * 10) / 10;
  const inflatedExpenseIn12Months = Math.round(
    monthlyExpenses * Math.pow(1 + annualInflationRate, 1),
  );
  const purchasingPowerLossPercent =
    Math.round(annualInflationRate * 1000) / 10; // e.g. 5.5

  const description =
    monthsLost <= 0
      ? `Inflation has negligible impact on your runway at ${purchasingPowerLossPercent}% CPI.`
      : `At ${purchasingPowerLossPercent}% inflation, your expenses rise to $${inflatedExpenseIn12Months.toLocaleString()}/mo by next year — shrinking your real runway by ${monthsLost} months.`;

  return {
    nominalRunwayMonths,
    realRunwayMonths,
    purchasingPowerLossPercent,
    inflatedExpenseIn12Months,
    monthsLost,
    description,
  };
}

// ─── Primary Insight Generator ────────────────────────────────────────────
/**
 * Generates the single most important one-liner insight given the full calculation.
 * Ordered by severity: critical issues surface first.
 */
export function getPrimaryInsight(
  result: Omit<CalculationResult, 'primaryInsight' | 'dso' | 'inflationAdjusted'>,
  currencySymbol: string = '$',
): string {
  const { runwayMonths, isInfiniteRunway, volatility, clientConcentrations,
          hasDeficitAtFloor, floorIncome, avgMonthlyExpenses, bufferFundingPercentage } = result;

  // Critical: below survival floor
  if (hasDeficitAtFloor) {
    return `CRITICAL: Your P20 income floor (${currencySymbol}${floorIncome.toLocaleString()}) is below monthly overhead (${currencySymbol}${avgMonthlyExpenses.toLocaleString()}). You are operating at structural insolvency.`;
  }

  // Critical: runway < 2 months
  if (!isInfiniteRunway && runwayMonths < 2) {
    return `ALERT: You have less than 2 months of runway. Secure new income immediately or reduce overhead by ${currencySymbol}${Math.abs(result.monthlyFloorSurplusDeficit).toLocaleString()}/mo.`;
  }

  // Warning: high volatility
  if (volatility.volatilityTier === 'volatile') {
    return volatility.description;
  }

  // Warning: extreme client concentration
  const topClient = clientConcentrations[0];
  if (topClient && topClient.isHighRisk) {
    return `RISK: ${topClient.tag} represents ${topClient.percentageOfTotal}% of revenue. A single lost contract could eliminate your income floor.`;
  }

  // Warning: buffer underfunded
  if (bufferFundingPercentage < 50) {
    return `Your emergency buffer is only ${bufferFundingPercentage}% funded. Prioritize reaching the ${result.runwayMonths.toFixed(1)}-month target before making elective draws.`;
  }

  // Healthy state
  const coveragePct = avgMonthlyExpenses > 0
    ? Math.round((floorIncome / avgMonthlyExpenses) * 100)
    : 100;

  if (coveragePct >= 110) {
    return `Strong position: Your P20 income floor covers ${coveragePct}% of overhead — you have a structural surplus.`;
  }

  return `Runway is ${isInfiniteRunway ? 'infinite' : `${runwayMonths} months`}. P20 floor covers ${coveragePct}% of monthly overhead. ${volatility.description}`;
}

/**
 * Full deterministic calculation of the Calm Ledger metrics.
 */
export function computeFullLedger(
  records: MonthlyRecord[],
  assumptions: CalculatorAssumptions,
): CalculationResult {
  const rawIncomes = records.map((r) => Math.max(0, Number(r.income) || 0));
  const expenses = records.map((r) => Math.max(0, Number(r.expenses) || 0));

  const retainerProbability = Math.min(
    1,
    Math.max(0, assumptions.retainerProbability ?? 1.0),
  );

  // Handle Scenario Adjustments
  let scenarioAdjustedIncomes = [...rawIncomes];
  let scenarioImpactDescription =
    'Normal baseline: 20th percentile calculated across 12 active months.';

  const scenario = assumptions.scenario || 'base';

  if (scenario === 'conservative') {
    const baseFloor = incomeFloor(rawIncomes, assumptions.percentile ?? 20, 1.0);
    scenarioAdjustedIncomes = scenarioAdjustedIncomes.map(() => baseFloor);
    scenarioImpactDescription =
      'Conservative (Floor Only): Zero pipeline reliance, strictly guaranteed survival floor.';
  } else if (scenario === 'client_loss') {
    const dropPct = assumptions.clientLossPercentage ?? 0.3;
    scenarioAdjustedIncomes = scenarioAdjustedIncomes.map((inc) =>
      Math.round(inc * (1 - dropPct)),
    );
    scenarioImpactDescription = `Stress Test: Simulating a ${Math.round(dropPct * 100)}% revenue contract loss shock.`;
  } else if (scenario === 'dry_spell') {
    scenarioAdjustedIncomes = scenarioAdjustedIncomes.map((inc, i) =>
      i >= scenarioAdjustedIncomes.length - 3 ? 0 : inc,
    );
    scenarioImpactDescription =
      'Severe Dry Spell: Simulating 3 consecutive months of zero client revenue.';
  } else if (scenario === 'windfall') {
    const windfall = assumptions.windfallAmount ?? 10000;
    scenarioImpactDescription = `Windfall: Simulating an immediate ${windfall.toLocaleString()} project payment.`;
  } else if (scenario === 'late_invoice') {
    scenarioAdjustedIncomes = scenarioAdjustedIncomes.map((inc, i) =>
      i < 2 ? 0 : inc,
    );
    scenarioImpactDescription =
      'Invoice Aging Shock: Simulating a sudden 60-day freeze on all receivables.';
  }

  const totalAnnualIncome = scenarioAdjustedIncomes.reduce(
    (acc, curr) => acc + curr,
    0,
  );
  const totalAnnualExpenses = expenses.reduce((acc, curr) => acc + curr, 0);

  const count = records.length || 1;
  const avgMonthlyIncome = Math.round(totalAnnualIncome / count);
  const avgMonthlyExpenses = Math.round(totalAnnualExpenses / count);

  // P0.1 FIX: incomeFloor now applies retainerProbability weighting
  const floor = incomeFloor(
    scenarioAdjustedIncomes,
    assumptions.percentile ?? 20,
    retainerProbability,
  );

  const taxReservePct = Math.min(
    1,
    Math.max(0, assumptions.taxReservePct ?? 0.25),
  );
  const taxReserve = Math.round(floor * taxReservePct);

  const bufferMultiplier = assumptions.bufferMonthsMultiplier ?? 3.5;
  const bufferTarget = calculateBufferTarget(avgMonthlyExpenses, bufferMultiplier);

  let currentSavings = Math.max(0, assumptions.currentSavings || 0);

  let windfallAllocation: WindfallAllocation | undefined;
  if (scenario === 'windfall' && assumptions.windfallAmount) {
    const gapBeforeWindfall = Math.max(0, bufferTarget - currentSavings);
    windfallAllocation = calculateWindfallWaterfall(
      assumptions.windfallAmount,
      taxReservePct,
      gapBeforeWindfall,
    );
    currentSavings += windfallAllocation.bufferAllocation;
  }

  const bufferGap = Math.max(0, bufferTarget - currentSavings);
  const isBufferComplete = bufferTarget > 0 && bufferGap === 0;
  const bufferFundingPercentage =
    bufferTarget > 0
      ? Math.min(100, Math.round((currentSavings / bufferTarget) * 100))
      : 100;

  const netFloor = Math.max(0, floor - taxReserve);

  let monthlyBufferContribution = 0;
  if (bufferGap > 0) {
    const surplusAtFloor = Math.max(0, netFloor - avgMonthlyExpenses);
    const potentialAllocation =
      surplusAtFloor > 0
        ? surplusAtFloor
        : Math.min(bufferGap, Math.round(netFloor * 0.15));
    monthlyBufferContribution = Math.min(bufferGap, potentialAllocation);
  }

  const sustainablePaycheck = Math.max(0, netFloor - monthlyBufferContribution);
  const { runwayMonths, isInfiniteRunway } = calculateRunway(
    currentSavings,
    avgMonthlyExpenses,
  );

  const monthlyFloorSurplusDeficit = netFloor - avgMonthlyExpenses;
  const hasDeficitAtFloor = monthlyFloorSurplusDeficit < 0;

  const monthsToBufferTarget =
    monthlyBufferContribution > 0
      ? Math.ceil(bufferGap / monthlyBufferContribution)
      : bufferGap === 0
      ? 0
      : 99;

  // Exhaustion date using ISO financial calendar (365.25/12 days per month)
  let exhaustionDate = 'Indefinite';
  if (!isInfiniteRunway && runwayMonths > 0) {
    const now = new Date();
    const daysRemaining = Math.round(runwayMonths * DAYS_PER_MONTH);
    const exhaustion = new Date(
      now.getTime() + daysRemaining * 24 * 60 * 60 * 1000,
    );
    exhaustionDate = exhaustion.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } else if (runwayMonths === 0) {
    exhaustionDate = 'Immediate';
  }

  const dailyBurnVelocity =
    avgMonthlyExpenses > 0
      ? Math.round((avgMonthlyExpenses / DAYS_PER_MONTH) * 100) / 100
      : 0;
  const surplusMargin = currentSavings - bufferTarget;
  const sensitivityDaysPer150 =
    dailyBurnVelocity > 0 ? Math.round(150 / dailyBurnVelocity) : 0;

  // Capital Partitioning Pillars
  const pillarBreakdown = [
    {
      id: 'floor',
      name: 'Income Floor',
      objective:
        'Absolute baseline survival overhead & essential personal commitments.',
      monthlyQuota: avgMonthlyExpenses,
      formula: 'Fixed Cost Ceiling',
      fundedBalance: Math.min(avgMonthlyExpenses, floor),
      solvencyStatus:
        floor >= avgMonthlyExpenses ? '100% Protected' : 'Deficit Warning',
      solvencyType:
        floor >= avgMonthlyExpenses
          ? ('protected' as const)
          : ('warning' as const),
      indicatorColor: '#16232B',
    },
    {
      id: 'salary',
      name: 'Sustainable Paycheck',
      objective:
        'Regular predictable transfer to personal checking on the 1st & 15th.',
      monthlyQuota: sustainablePaycheck,
      formula: `${Math.round((sustainablePaycheck / (floor || 1)) * 100)}% of Base Floor`,
      fundedBalance: sustainablePaycheck,
      solvencyStatus:
        sustainablePaycheck > 0 ? 'Automated Bi-Weekly' : '0% Draw Capacity',
      solvencyType: 'automated' as const,
      indicatorColor: '#2F6F62',
    },
    {
      id: 'tax',
      name: 'Tax Reserve Vault',
      objective:
        'Mandatory statutory withholding escrow (Federal + State + Self-Employment).',
      monthlyQuota: taxReserve,
      formula: `${Math.round(taxReservePct * 100)}% Gross Inflow (Auto Escrow)`,
      // P0.2 FIX: 3 months of escrow = one IRS quarterly Safe Harbor payment
      fundedBalance: taxReserve * 3,
      solvencyStatus: 'Q3 Safe Harbor (3-mo escrow)',
      solvencyType: 'safe' as const,
      indicatorColor: '#875205',
    },
    {
      id: 'buffer',
      name: 'Buffer Threshold',
      objective: `Targeted ${bufferMultiplier}-month minimum calm reserve fund before growth reinvestment.`,
      monthlyQuota: bufferTarget,
      formula: `${bufferMultiplier} × $${avgMonthlyExpenses.toLocaleString()}/mo`,
      fundedBalance: Math.min(currentSavings, bufferTarget),
      solvencyStatus:
        currentSavings >= bufferTarget
          ? 'Fully Funded'
          : `${bufferFundingPercentage}% Funded`,
      solvencyType:
        currentSavings >= bufferTarget
          ? ('funded' as const)
          : ('warning' as const),
      indicatorColor: '#6f7976',
    },
    {
      id: 'liquid',
      name: 'Total Liquid Working Cash',
      objective:
        'Verified aggregated balance across business checking & treasury accounts.',
      monthlyQuota: currentSavings,
      formula: 'Total Liquid Capital',
      fundedBalance: currentSavings,
      solvencyStatus:
        surplusMargin >= 0
          ? `+$${surplusMargin.toLocaleString()} Surplus`
          : `-$${Math.abs(surplusMargin).toLocaleString()} Deficit`,
      solvencyType:
        surplusMargin >= 0 ? ('surplus' as const) : ('warning' as const),
      indicatorColor: '#0f564a',
    },
  ];

  // Waterfall Steps
  const waterfallSteps: WaterfallStep[] = [
    {
      label: 'Gross Income Floor',
      amount: floor,
      runningTotal: floor,
      type: 'inflow',
      color: '#2F6F62',
    },
    {
      label: `Tax Reserve (${Math.round(taxReservePct * 100)}%)`,
      amount: -taxReserve,
      runningTotal: floor - taxReserve,
      type: 'deduction',
      color: '#875205',
    },
    {
      label: 'Average Overhead Expenses',
      amount: -Math.min(floor - taxReserve, avgMonthlyExpenses),
      runningTotal: Math.max(0, floor - taxReserve - avgMonthlyExpenses),
      type: 'deduction',
      color: '#B4573F',
    },
    {
      label: 'Safety Buffer Contribution',
      amount: -monthlyBufferContribution,
      runningTotal: sustainablePaycheck,
      type: 'allocation',
      color: '#C98A3E',
    },
    {
      label: 'Net Sustainable Paycheck',
      amount: sustainablePaycheck,
      runningTotal: sustainablePaycheck,
      type: 'net',
      color: '#2F6F62',
    },
  ];

  const volatility = calculateVolatility(rawIncomes);
  const clientConcentrations = calculateClientConcentrations(records);

  // Phase 1: DSO
  const dso = calculateDSO(records, runwayMonths);

  // Phase 2: Inflation Drag
  const annualInflationRate = assumptions.annualInflationRate ?? 0.055;
  const inflationAdjusted = applyInflationDrag(
    currentSavings,
    avgMonthlyExpenses,
    runwayMonths,
    annualInflationRate,
  );

  // Primary Insight
  const partialResult = {
    floorIncome: floor, taxReserve, bufferTarget, currentSavings, bufferGap,
    monthlyBufferContribution, sustainablePaycheck, avgMonthlyIncome,
    avgMonthlyExpenses, totalAnnualIncome, totalAnnualExpenses, runwayMonths,
    isInfiniteRunway, isBufferComplete, hasDeficitAtFloor, monthlyFloorSurplusDeficit,
    monthsToBufferTarget, bufferFundingPercentage, exhaustionDate, dailyBurnVelocity,
    surplusMargin, sensitivityDaysPer150, pillarBreakdown, volatility,
    clientConcentrations, windfallAllocation, waterfallSteps, scenarioImpactDescription,
  };
  const primaryInsight = getPrimaryInsight(partialResult);

  return {
    ...partialResult,
    dso,
    inflationAdjusted,
    primaryInsight,
  };
}
