// ─────────────────────────────────────────────────────────────
// Monte Carlo Stochastic Simulation Engine — Phase 4
// Uses Box-Muller transform for Gaussian income sampling.
// Runs in a Web Worker to avoid blocking the UI thread.
// ─────────────────────────────────────────────────────────────
import { MonteCarloResult } from './types';

/**
 * Generates a normally distributed random number using the Box-Muller transform.
 * Source: Box, G.E.P. & Muller, M.E. (1958). "A Note on the Generation of
 * Random Normal Deviates". The Annals of Mathematical Statistics.
 *
 * @returns A sample from N(mean, std²), clamped to ≥0 (income can't be negative)
 */
function gaussianRandom(mean: number, std: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  // Box-Muller transform
  const z0 = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2);
  return Math.max(0, z0 * std + mean);
}

/**
 * Runs a Monte Carlo stochastic simulation of financial survival.
 *
 * For each of N iterations, we simulate `simulationMonths` months of income
 * drawn from a Gaussian distribution N(meanIncome, stdDeviation²), subtract
 * expenses, and track whether the freelancer goes bankrupt (cash < 0).
 *
 * The output gives a probability distribution of survival outcomes:
 * P5 = worst case, P50 = median case, P95 = best realistic case.
 *
 * @param meanIncome - historical average monthly income
 * @param stdDeviation - historical standard deviation of monthly income
 * @param monthlyExpenses - fixed monthly overhead
 * @param startingCash - current liquid cash savings
 * @param simulationMonths - max horizon (default: 12)
 * @param iterations - number of Monte Carlo paths (default: 10,000)
 */
export function runMonteCarloSimulation(
  meanIncome: number,
  stdDeviation: number,
  monthlyExpenses: number,
  startingCash: number,
  simulationMonths: number = 12,
  iterations: number = 10000,
): MonteCarloResult {
  // Guard against degenerate inputs
  if (meanIncome <= 0 || monthlyExpenses <= 0) {
    return {
      survivalProbabilities: [],
      p5RunwayMonths: 0,
      p50RunwayMonths: 0,
      p95RunwayMonths: 0,
      probabilityOfSurviving3Months: 0,
      probabilityOfSurviving6Months: 0,
      probabilityOfSurviving12Months: 0,
      riskSignal: 'CRITICAL',
      description: 'Insufficient data to run simulation. Enter income and expense data first.',
    };
  }

  // Clamp std to prevent pathological distributions
  const clampedStd = Math.min(stdDeviation, meanIncome * 1.5);

  // survivalCounts[m] = how many paths survived ≥ m months
  const survivalCounts = new Array<number>(simulationMonths + 1).fill(0);
  const runwayDistribution: number[] = [];

  for (let i = 0; i < iterations; i++) {
    let cash = startingCash;
    let monthsSurvived = 0;

    for (let month = 0; month < simulationMonths; month++) {
      const monthIncome = gaussianRandom(meanIncome, clampedStd);
      cash += monthIncome - monthlyExpenses;

      if (cash > 0) {
        monthsSurvived = month + 1;
        survivalCounts[month + 1]++;
      } else {
        // Bankrupt — stop this path
        break;
      }
    }

    runwayDistribution.push(monthsSurvived);
  }

  // Sort for percentile extraction
  const sorted = [...runwayDistribution].sort((a, b) => a - b);

  // Percentile extraction using linear interpolation
  const getPercentile = (pct: number): number => {
    const idx = Math.floor((pct / 100) * (iterations - 1));
    return sorted[idx] ?? 0;
  };

  const p5 = getPercentile(5);
  const p50 = getPercentile(50);
  const p95 = getPercentile(95);

  const prob3 = Math.round((survivalCounts[Math.min(3, simulationMonths)] / iterations) * 100);
  const prob6 = Math.round((survivalCounts[Math.min(6, simulationMonths)] / iterations) * 100);
  const prob12 = Math.round((survivalCounts[simulationMonths] / iterations) * 100);

  // Risk signal: based on P50 (median outcome)
  const riskSignal: 'SAFE' | 'CAUTION' | 'CRITICAL' =
    prob6 >= 75 ? 'SAFE' : prob6 >= 40 ? 'CAUTION' : 'CRITICAL';

  const description =
    `Based on ${iterations.toLocaleString()} simulations of your income history, ` +
    `you have a ${prob6}% probability of surviving the next 6 months. ` +
    `Median runway: ${p50} months (P5: ${p5} worst / P95: ${p95} best case).`;

  // Probability at each month (for chart)
  const survivalProbabilities = survivalCounts.map((count, month) => ({
    month,
    probability: Math.round((count / iterations) * 100),
  }));

  return {
    survivalProbabilities,
    p5RunwayMonths: p5,
    p50RunwayMonths: p50,
    p95RunwayMonths: p95,
    probabilityOfSurviving3Months: prob3,
    probabilityOfSurviving6Months: prob6,
    probabilityOfSurviving12Months: prob12,
    riskSignal,
    description,
  };
}
