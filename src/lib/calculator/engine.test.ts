import { describe, it, expect } from 'vitest';
import {
  incomeFloor,
  calculateBufferTarget,
  calculateRunway,
  calculateVolatility,
  calculateClientConcentrations,
  calculateWindfallWaterfall,
  computeFullLedger,
} from './engine';
import { MonthlyRecord, CalculatorAssumptions } from './types';

describe('Income Floor Algorithm', () => {
  it('handles empty input gracefully', () => {
    expect(incomeFloor([])).toBe(0);
    expect(incomeFloor(null as unknown as number[])).toBe(0);
    expect(incomeFloor(undefined as unknown as number[])).toBe(0);
  });

  it('handles a single data point correctly', () => {
    expect(incomeFloor([4500])).toBe(4500);
    expect(incomeFloor([0])).toBe(0);
  });

  it('handles all-equal incomes correctly', () => {
    const equalIncomes = [3000, 3000, 3000, 3000, 3000, 3000];
    expect(incomeFloor(equalIncomes)).toBe(3000);
  });

  it('is robust against an extreme high outlier month', () => {
    const outlierIncomes = [
      1900, 2000, 2100, 1950, 2050, 100000, 2000, 2150, 1900, 2000, 2200, 1950,
    ];
    const floor = incomeFloor(outlierIncomes, 20);
    expect(floor).toBeLessThanOrEqual(2000);
    expect(floor).toBeGreaterThanOrEqual(1900);
  });

  it('calculates the exact 20th percentile for a realistic 12-month irregular dataset', () => {
    const irregularIncomes = [
      1200, 3400, 5000, 2100, 1800, 6000, 1500, 4200, 3100, 1900, 2800, 3500,
    ];
    const floor = incomeFloor(irregularIncomes, 20);
    expect(floor).toBe(1800);
  });

  it('sanitizes negative values and non-numeric inputs', () => {
    const messy = [-500, NaN, 2500, 3000, 4000];
    const floor = incomeFloor(messy, 20);
    expect(floor).toBeGreaterThanOrEqual(0);
    expect(floor).not.toBeNaN();
  });
});

describe('Advanced FinTech Analytics', () => {
  it('calculates volatility metrics and coefficient of variation', () => {
    const incomes = [2000, 5000, 1500, 6000, 2500, 7000];
    const vol = calculateVolatility(incomes);
    expect(vol.meanIncome).toBeGreaterThan(0);
    expect(vol.standardDeviation).toBeGreaterThan(0);
    expect(vol.coefficientOfVariation).toBeGreaterThan(0);
    expect(['calm', 'moderate', 'volatile']).toContain(vol.volatilityTier);
    expect(vol.minMonth).toBe(1500);
    expect(vol.maxMonth).toBe(7000);
  });

  it('calculates client concentration risk', () => {
    const records: MonthlyRecord[] = [
      { id: '1', month: 'Jan', income: 7000, expenses: 2000, clientTag: 'Anchor Retainer' },
      { id: '2', month: 'Feb', income: 1000, expenses: 2000, clientTag: 'Small Project' },
      { id: '3', month: 'Mar', income: 2000, expenses: 2000, clientTag: 'Secondary Client' },
    ];
    const concentrations = calculateClientConcentrations(records);
    expect(concentrations.length).toBe(3);
    expect(concentrations[0].tag).toBe('Anchor Retainer');
    expect(concentrations[0].percentageOfTotal).toBe(70);
    expect(concentrations[0].isHighRisk).toBe(true); // >45%
  });

  it('calculates the windfall waterfall priority: tax -> buffer gap -> bonus draw', () => {
    const windfall = calculateWindfallWaterfall(10000, 0.25, 4000);
    expect(windfall.taxAllocation).toBe(2500); // 25% of 10,000
    expect(windfall.bufferAllocation).toBe(4000); // fills 4,000 buffer gap
    expect(windfall.bonusPaycheckAllocation).toBe(3500); // remainder 7,500 - 4,000 = 3,500
  });
});

describe('Full Calm Ledger Computation & Scenarios', () => {
  const sampleRecords: MonthlyRecord[] = [
    { id: '1', month: 'Jan', income: 4200, expenses: 2000 },
    { id: '2', month: 'Feb', income: 2800, expenses: 1900 },
    { id: '3', month: 'Mar', income: 5500, expenses: 2100 },
    { id: '4', month: 'Apr', income: 1800, expenses: 1950 },
    { id: '5', month: 'May', income: 3200, expenses: 2050 },
    { id: '6', month: 'Jun', income: 6400, expenses: 2200 },
    { id: '7', month: 'Jul', income: 2400, expenses: 2000 },
    { id: '8', month: 'Aug', income: 1900, expenses: 1900 },
    { id: '9', month: 'Sep', income: 4800, expenses: 2150 },
    { id: '10', month: 'Oct', income: 3600, expenses: 2000 },
    { id: '11', month: 'Nov', income: 2100, expenses: 1950 },
    { id: '12', month: 'Dec', income: 4100, expenses: 2200 },
  ];

  const baseAssumptions: CalculatorAssumptions = {
    taxReservePct: 0.25,
    bufferMonthsMultiplier: 3.5,
    currentSavings: 8400,
    percentile: 20,
    scenario: 'base',
  };

  it('computes complete financial metrics and waterfall steps in base scenario', () => {
    const result = computeFullLedger(sampleRecords, baseAssumptions);

    expect(result.floorIncome).toBeGreaterThan(0);
    expect(result.waterfallSteps.length).toBe(5);
    expect(result.bufferFundingPercentage).toBeGreaterThan(0);
    expect(result.volatility).toBeDefined();
  });

  it('stress tests a 30% client loss scenario', () => {
    const stressAssumptions: CalculatorAssumptions = {
      ...baseAssumptions,
      scenario: 'client_loss',
      clientLossPercentage: 0.30,
    };
    const baseResult = computeFullLedger(sampleRecords, baseAssumptions);
    const stressResult = computeFullLedger(sampleRecords, stressAssumptions);

    expect(stressResult.floorIncome).toBeLessThan(baseResult.floorIncome);
    expect(stressResult.scenarioImpactDescription).toContain('Stress Test');
  });

  it('stress tests a severe 3-month dry spell', () => {
    const drySpellAssumptions: CalculatorAssumptions = {
      ...baseAssumptions,
      scenario: 'dry_spell',
    };
    const dryResult = computeFullLedger(sampleRecords, drySpellAssumptions);
    expect(dryResult.floorIncome).toBe(0); // 3 out of 12 months at 0 brings 20th percentile to 0
    expect(dryResult.scenarioImpactDescription).toContain('Severe Dry Spell');
  });

  it('stress tests an invoice aging shock (late invoice)', () => {
    const lateInvoiceAssumptions: CalculatorAssumptions = {
      ...baseAssumptions,
      scenario: 'late_invoice',
    };
    const result = computeFullLedger(sampleRecords, lateInvoiceAssumptions);
    expect(result.scenarioImpactDescription).toContain('Invoice Aging Shock');
  });

  it('computes Stitch metrics: exhaustionDate, dailyBurnVelocity, and 5-pillar breakdown', () => {
    const result = computeFullLedger(sampleRecords, baseAssumptions);
    expect(result.exhaustionDate).toBeDefined();
    expect(result.dailyBurnVelocity).toBeGreaterThan(0);
    expect(result.sensitivityDaysPer150).toBeGreaterThan(0);
    expect(result.pillarBreakdown.length).toBe(5);
    expect(result.pillarBreakdown[0].name).toBe('Income Floor');
    expect(result.pillarBreakdown[1].name).toBe('Sustainable Paycheck');
    expect(result.pillarBreakdown[2].name).toBe('Tax Reserve Vault');
    expect(result.pillarBreakdown[3].name).toBe('Buffer Threshold');
    expect(result.pillarBreakdown[4].name).toBe('Total Liquid Working Cash');
  });
});
