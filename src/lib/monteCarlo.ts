// Monte Carlo simulation engine for the RIL cracker capacity expansion decision.
//
// The economics (feed mix -> product yield -> cash margin) reuse the same
// formulas as the live feed-mix margin calculator (src/app/simulation/page.tsx) so
// numbers stay consistent across the site. This file adds the part that page does not do:
// treat every price and delay as a range instead of one fixed number, run the
// model thousands of times, and read off the spread of possible outcomes.

// ---------------------------------------------------------------------------
// Random number generation
// ---------------------------------------------------------------------------

/** Deterministic PRNG (mulberry32). Same seed always reproduces the same run. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleStdNormal(rng: () => number): number {
  // Box-Muller transform
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/** Standard normal CDF, Abramowitz-Stegun 7.1.26 approximation (accurate to ~1e-7). */
function stdNormalCdf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429,
    p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1 + sign * y);
}

function triangularInverseCdf(u: number, min: number, mode: number, max: number): number {
  const fc = (mode - min) / (max - min);
  if (u < fc) return min + Math.sqrt(u * (max - min) * (mode - min));
  return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
}

function clamp01(u: number): number {
  return Math.min(0.999999, Math.max(0.000001, u));
}

// ---------------------------------------------------------------------------
// Variable configuration
// ---------------------------------------------------------------------------

export type Distribution = 'triangular' | 'normal' | 'discrete';

export interface TriangularVar {
  distribution: 'triangular';
  min: number;
  mode: number;
  max: number;
  /** How strongly this variable rides the shared market swing (0 = independent, 1 = moves in lockstep). */
  marketCorrelation: number;
}

export interface NormalVar {
  distribution: 'normal';
  mean: number;
  stdev: number;
}

export interface DiscreteOutcome {
  value: number;
  probability: number;
  label: string;
}

export interface DiscreteVar {
  distribution: 'discrete';
  outcomes: DiscreteOutcome[];
}

export type VariableSpec = TriangularVar | NormalVar | DiscreteVar;

export interface VariableConfig {
  id: string;
  label: string;
  group: 'Feedstock & Product Prices' | 'Currency & Financing' | 'Project Execution' | 'Plant Operations';
  unit: string;
  description: string;
  spec: VariableSpec;
}

export interface SimulationInputs {
  brentPrice: VariableConfig; // $/bbl
  naphthaPrice: VariableConfig; // $/t
  ethanePrice: VariableConfig; // $/t
  ethylenePrice: VariableConfig; // $/t
  propylenePrice: VariableConfig; // $/t
  usdInrFx: VariableConfig; // INR per USD
  freightCost: VariableConfig; // $/t of ethane moved
  waccPct: VariableConfig; // % discount rate
  startupDelay: VariableConfig; // months
  capexOverrunPct: VariableConfig; // % over or under the planned capital budget
  plantUtilizationPct: VariableConfig; // %
  ethaneMixPct: VariableConfig; // % of feed that is ethane (rest naphtha)
}

export interface ProjectAssumptions {
  totalFeedCapacityKTPA: number;
  totalCapexUSD_Mn: number;
  projectLifeYears: number;
  terminalValueMultiple: number;
  byproductCreditUSD_t: number;
  hurdleRateIrrPct: number;
}

// Defaults grounded in the site's own cracker asset register (CRACKER_ASSETS)
// and the feed-mix margin calculator's price levels, so this tool tells the same story
// as the rest of the dashboard. Feed capacity is the sum of naphtha+ethane+
// propane feed capacity across all 5 sites (Jamnagar, Dahej, Hazira,
// Nagothane, Vadodara). Total capex is an independent, bottom-up estimate for
// that combined 4.27 MMTPA ethylene / 2.02 MMTPA propylene network (roughly
// $2,000/t of combined olefin capacity, in line with world-scale integrated
// cracker complexes) -- it is deliberately not tied to the smaller
// "remaining spend" figures on the Project page, which track budget burn on
// work already committed rather than the full economic cost of the network.
export const DEFAULT_ASSUMPTIONS: ProjectAssumptions = {
  totalFeedCapacityKTPA: 7500,
  totalCapexUSD_Mn: 13000,
  projectLifeYears: 15,
  terminalValueMultiple: 3, // terminal value = 3 years of steady-state cash flow, a conservative salvage/going-concern estimate
  byproductCreditUSD_t: 420,
  hurdleRateIrrPct: 12
};

export function buildDefaultVariables(): SimulationInputs {
  return {
    brentPrice: {
      id: 'brentPrice',
      label: 'Brent Crude Oil',
      group: 'Feedstock & Product Prices',
      unit: '$/bbl',
      description: 'Sets the global oil-linked market swing. Naphtha and olefin prices move partly with it.',
      spec: { distribution: 'triangular', min: 70, mode: 97, max: 130, marketCorrelation: 1 }
    },
    naphthaPrice: {
      id: 'naphthaPrice',
      label: 'Asian Naphtha',
      group: 'Feedstock & Product Prices',
      unit: '$/t',
      description: 'Liquid feedstock cost, the alternative to ethane. Tracks Brent closely.',
      spec: { distribution: 'triangular', min: 625, mode: 816, max: 1030, marketCorrelation: 0.85 }
    },
    ethanePrice: {
      id: 'ethanePrice',
      label: 'US Mont Belvieu Ethane',
      group: 'Feedstock & Product Prices',
      unit: '$/t',
      description: 'Imported feedstock cost. Priced off US shale gas, so it mostly ignores Brent moves.',
      spec: { distribution: 'triangular', min: 125, mode: 157, max: 205, marketCorrelation: 0.15 }
    },
    ethylenePrice: {
      id: 'ethylenePrice',
      label: 'Ethylene (Product)',
      group: 'Feedstock & Product Prices',
      unit: '$/t',
      description: 'Main product sold from the cracker. Global supply and oil prices both move it.',
      spec: { distribution: 'triangular', min: 720, mode: 886, max: 1050, marketCorrelation: 0.65 }
    },
    propylenePrice: {
      id: 'propylenePrice',
      label: 'Propylene (Product)',
      group: 'Feedstock & Product Prices',
      unit: '$/t',
      description: 'Second product stream from the cracker, sold alongside ethylene.',
      spec: { distribution: 'triangular', min: 680, mode: 833, max: 980, marketCorrelation: 0.55 }
    },
    usdInrFx: {
      id: 'usdInrFx',
      label: 'USD / INR Exchange Rate',
      group: 'Currency & Financing',
      unit: '₹/$',
      description: 'Converts the dollar margin into the rupee EBITDA number RIL reports to shareholders.',
      spec: { distribution: 'normal', mean: 84.2, stdev: 1.8 }
    },
    freightCost: {
      id: 'freightCost',
      label: 'VLEC Freight & Shipping',
      group: 'Currency & Financing',
      unit: '$/t',
      description: 'Cost to ship imported ethane on the VLEC fleet to the Dahej terminal.',
      spec: { distribution: 'triangular', min: 15, mode: 22, max: 32, marketCorrelation: 0 }
    },
    waccPct: {
      id: 'waccPct',
      label: 'Discount Rate (WACC)',
      group: 'Currency & Financing',
      unit: '%',
      description: 'The return RIL requires on capital employed. Higher rate, lower present value.',
      spec: { distribution: 'normal', mean: 10.5, stdev: 0.6 }
    },
    startupDelay: {
      id: 'startupDelay',
      label: 'Startup Schedule Delay',
      group: 'Project Execution',
      unit: 'months',
      description: 'Chance the expansion starts later than planned, pushing cash flows back.',
      spec: {
        distribution: 'discrete',
        outcomes: [
          { value: 0, probability: 0.65, label: 'On time' },
          { value: 1, probability: 0.2, label: '1 month late' },
          { value: 3, probability: 0.12, label: '3 months late' },
          { value: 6, probability: 0.03, label: '6 months late' }
        ]
      }
    },
    capexOverrunPct: {
      id: 'capexOverrunPct',
      label: 'Capital Cost Overrun',
      group: 'Project Execution',
      unit: '%',
      description: 'Megaprojects usually cost more than planned, rarely less. This is the gap between budgeted and actual spend.',
      spec: { distribution: 'triangular', min: -5, mode: 5, max: 30, marketCorrelation: 0 }
    },
    plantUtilizationPct: {
      id: 'plantUtilizationPct',
      label: 'Plant Utilisation',
      group: 'Plant Operations',
      unit: '%',
      description: 'Share of nameplate feed capacity actually run through the crackers each year.',
      spec: { distribution: 'triangular', min: 84, mode: 90, max: 95, marketCorrelation: 0 }
    },
    ethaneMixPct: {
      id: 'ethaneMixPct',
      label: 'Ethane Share of Feed',
      group: 'Plant Operations',
      unit: '%',
      description: 'How much of total feed is ethane versus naphtha. Higher ethane share usually means fatter margins, since ethane is far cheaper per tonne of ethylene produced.',
      spec: { distribution: 'triangular', min: 65, mode: 75, max: 85, marketCorrelation: 0 }
    }
  };
}

// ---------------------------------------------------------------------------
// Sampling
// ---------------------------------------------------------------------------

function sampleFromSpec(rng: () => number, spec: VariableSpec, marketZ: number): number {
  if (spec.distribution === 'normal') {
    return spec.mean + sampleStdNormal(rng) * spec.stdev;
  }
  if (spec.distribution === 'discrete') {
    const u = rng();
    let cumulative = 0;
    for (const outcome of spec.outcomes) {
      cumulative += outcome.probability;
      if (u <= cumulative) return outcome.value;
    }
    return spec.outcomes[spec.outcomes.length - 1].value;
  }
  // Triangular, linked to the shared market factor via a Gaussian copula:
  // z combines the market-wide shock with the variable's own private shock,
  // then Phi(z) gives a uniform quantile that is fed into the triangular
  // inverse CDF. This keeps every variable's own shape (min/mode/max) while
  // making correlated variables rise and fall together.
  const rho = spec.marketCorrelation;
  const ownShock = sampleStdNormal(rng);
  const z = rho * marketZ + Math.sqrt(Math.max(0, 1 - rho * rho)) * ownShock;
  const u = clamp01(stdNormalCdf(z));
  return triangularInverseCdf(u, spec.min, spec.mode, spec.max);
}

export interface IterationSample {
  brentPrice: number;
  naphthaPrice: number;
  ethanePrice: number;
  ethylenePrice: number;
  propylenePrice: number;
  usdInrFx: number;
  freightCost: number;
  waccPct: number;
  startupDelay: number;
  capexOverrunPct: number;
  plantUtilizationPct: number;
  ethaneMixPct: number;
}

function sampleIteration(rng: () => number, inputs: SimulationInputs): IterationSample {
  const marketZ = sampleStdNormal(rng); // shared oil-market shock for this iteration
  return {
    brentPrice: sampleFromSpec(rng, inputs.brentPrice.spec, marketZ),
    naphthaPrice: sampleFromSpec(rng, inputs.naphthaPrice.spec, marketZ),
    ethanePrice: sampleFromSpec(rng, inputs.ethanePrice.spec, marketZ),
    ethylenePrice: sampleFromSpec(rng, inputs.ethylenePrice.spec, marketZ),
    propylenePrice: sampleFromSpec(rng, inputs.propylenePrice.spec, marketZ),
    usdInrFx: sampleFromSpec(rng, inputs.usdInrFx.spec, marketZ),
    freightCost: sampleFromSpec(rng, inputs.freightCost.spec, marketZ),
    waccPct: sampleFromSpec(rng, inputs.waccPct.spec, marketZ),
    startupDelay: sampleFromSpec(rng, inputs.startupDelay.spec, marketZ),
    capexOverrunPct: sampleFromSpec(rng, inputs.capexOverrunPct.spec, marketZ),
    plantUtilizationPct: sampleFromSpec(rng, inputs.plantUtilizationPct.spec, marketZ),
    ethaneMixPct: sampleFromSpec(rng, inputs.ethaneMixPct.spec, marketZ)
  };
}

// ---------------------------------------------------------------------------
// Economic model (one iteration -> one set of financial outcomes)
// ---------------------------------------------------------------------------

export interface IterationResult {
  npvUSD_Mn: number;
  irrPct: number;
  ebitdaUSD_Mn: number;
  ebitdaINR_Cr: number;
  paybackYears: number;
  netMarginUSD_t: number;
}

function solveIrr(cashFlows: number[]): number {
  // Bisection on NPV(rate) = 0. Cash flows are year 0..N, flows[0] is the outflow.
  const npvAt = (rate: number) => cashFlows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i), 0);
  let lo = -0.9;
  let hi = 3.0;
  let npvLo = npvAt(lo);
  let npvHi = npvAt(hi);
  if (npvLo * npvHi > 0) return NaN; // no sign change in range: no clean IRR
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const npvMid = npvAt(mid);
    if (Math.abs(npvMid) < 1e-6) return mid;
    if (npvLo * npvMid < 0) {
      hi = mid;
      npvHi = npvMid;
    } else {
      lo = mid;
      npvLo = npvMid;
    }
  }
  return (lo + hi) / 2;
}

export function runEconomicModel(sample: IterationSample, assumptions: ProjectAssumptions): IterationResult {
  const ethaneMix = sample.ethaneMixPct / 100;
  const naphthaMix = 1 - ethaneMix;

  // Same feed -> yield -> margin formulas as the feed-mix margin calculator page.
  const weightedFeedCost = ethaneMix * (sample.ethanePrice + sample.freightCost) + naphthaMix * sample.naphthaPrice;
  const ethyleneYield = ethaneMix * 0.795 + naphthaMix * 0.332;
  const propyleneYield = ethaneMix * 0.024 + naphthaMix * 0.168;
  const byproductYield = 1 - ethyleneYield - propyleneYield;
  const basketRevenue =
    ethyleneYield * sample.ethylenePrice + propyleneYield * sample.propylenePrice + byproductYield * assumptions.byproductCreditUSD_t;
  const processingCost = ethaneMix * 85 + naphthaMix * 165;
  const netMarginUSD_t = basketRevenue - weightedFeedCost - processingCost;

  const annualFeedTonnes = assumptions.totalFeedCapacityKTPA * 1000 * (sample.plantUtilizationPct / 100);
  const steadyStateEbitdaUSD_Mn = (netMarginUSD_t * annualFeedTonnes) / 1_000_000;

  // Ramp-up profile: startup delay pushes the whole ramp back.
  const delayYears = sample.startupDelay / 12;
  const cashFlows: number[] = [];
  for (let year = 1; year <= assumptions.projectLifeYears; year++) {
    const effectiveYear = year - delayYears;
    let rampFactor = 1;
    if (effectiveYear < 0) rampFactor = 0;
    else if (effectiveYear < 1) rampFactor = 0.55;
    else if (effectiveYear < 2) rampFactor = 0.85;
    cashFlows.push(steadyStateEbitdaUSD_Mn * rampFactor);
  }

  const totalCapex = assumptions.totalCapexUSD_Mn * (1 + sample.capexOverrunPct / 100);
  const capexYear0 = totalCapex * 0.7;
  const capexYear1 = totalCapex * 0.3;
  const r = sample.waccPct / 100;

  let npv = -capexYear0 - capexYear1 / (1 + r);
  cashFlows.forEach((cf, idx) => {
    npv += cf / Math.pow(1 + r, idx + 1);
  });

  // Terminal value: a conservative multiple of steady-state annual cash flow
  // (not a growing perpetuity), representing the plant's going-concern value
  // beyond the modelled horizon.
  const lastCf = cashFlows[cashFlows.length - 1];
  const terminalValue = lastCf * assumptions.terminalValueMultiple;
  npv += terminalValue / Math.pow(1 + r, assumptions.projectLifeYears);

  const flowSeries = [-capexYear0, -capexYear1 + cashFlows[0], ...cashFlows.slice(1)];
  flowSeries[flowSeries.length - 1] += terminalValue;
  const irrPct = solveIrr(flowSeries) * 100;

  let cumulative = -totalCapex;
  let paybackYears = assumptions.projectLifeYears;
  for (let i = 0; i < cashFlows.length; i++) {
    const prev = cumulative;
    cumulative += cashFlows[i];
    if (cumulative >= 0 && cashFlows[i] > 0) {
      paybackYears = i + Math.max(0, Math.min(1, -prev / cashFlows[i]));
      break;
    }
  }

  const ebitdaINR_Cr = (steadyStateEbitdaUSD_Mn * sample.usdInrFx) / 10;

  return { npvUSD_Mn: npv, irrPct, ebitdaUSD_Mn: steadyStateEbitdaUSD_Mn, ebitdaINR_Cr, paybackYears, netMarginUSD_t };
}

// ---------------------------------------------------------------------------
// Statistics helpers
// ---------------------------------------------------------------------------

export function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function stdev(values: number[]): number {
  const m = mean(values);
  return Math.sqrt(values.reduce((a, b) => a + (b - m) * (b - m), 0) / values.length);
}

export function percentile(sortedValues: number[], p: number): number {
  const idx = (p / 100) * (sortedValues.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedValues[lo];
  const frac = idx - lo;
  return sortedValues[lo] * (1 - frac) + sortedValues[hi] * frac;
}

export function pearsonCorrelation(x: number[], y: number[]): number {
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let dx2 = 0;
  let dy2 = 0;
  for (let i = 0; i < x.length; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    num += dx * dy;
    dx2 += dx * dx;
    dy2 += dy * dy;
  }
  const denom = Math.sqrt(dx2 * dy2);
  return denom === 0 ? 0 : num / denom;
}

export interface HistogramBin {
  rangeLabel: string;
  rangeStart: number;
  rangeEnd: number;
  count: number;
  cumulativePct: number;
}

export function buildHistogram(values: number[], binCount: number, formatter: (n: number) => string): HistogramBin[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / binCount || 1;
  const bins: HistogramBin[] = Array.from({ length: binCount }, (_, i) => ({
    rangeLabel: `${formatter(min + i * width)} – ${formatter(min + (i + 1) * width)}`,
    rangeStart: min + i * width,
    rangeEnd: min + (i + 1) * width,
    count: 0,
    cumulativePct: 0
  }));
  values.forEach((v) => {
    let idx = Math.floor((v - min) / width);
    if (idx >= binCount) idx = binCount - 1;
    if (idx < 0) idx = 0;
    bins[idx].count++;
  });
  let running = 0;
  bins.forEach((b) => {
    running += b.count;
    b.cumulativePct = (running / values.length) * 100;
  });
  return bins;
}

// ---------------------------------------------------------------------------
// Full run
// ---------------------------------------------------------------------------

export interface MetricSummary {
  mean: number;
  stdev: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  min: number;
  max: number;
}

function summarize(values: number[]): MetricSummary {
  const clean = values.filter((v) => Number.isFinite(v));
  const sorted = [...clean].sort((a, b) => a - b);
  return {
    mean: mean(clean),
    stdev: stdev(clean),
    p10: percentile(sorted, 10),
    p25: percentile(sorted, 25),
    p50: percentile(sorted, 50),
    p75: percentile(sorted, 75),
    p90: percentile(sorted, 90),
    min: sorted[0],
    max: sorted[sorted.length - 1]
  };
}

export interface DriverImpact {
  variableId: string;
  label: string;
  correlationToNpv: number;
  /** NPV swing between the driver's own P10 and P90 iterations (tornado bar length). */
  npvSwingUSD_Mn: number;
}

export interface SimulationResult {
  iterations: number;
  seed: number;
  npv: MetricSummary;
  irr: MetricSummary;
  ebitdaUsd: MetricSummary;
  ebitdaInr: MetricSummary;
  payback: MetricSummary;
  npvHistogram: HistogramBin[];
  irrHistogram: HistogramBin[];
  ebitdaHistogram: HistogramBin[];
  convergence: { atIteration: number; runningMeanNpv: number }[];
  drivers: DriverImpact[];
  probabilityNpvNegative: number;
  probabilityBelowHurdleIrr: number;
  rawNpv: number[];
  rawIrr: number[];
}

export function runMonteCarlo(
  inputs: SimulationInputs,
  assumptions: ProjectAssumptions,
  iterations: number,
  seed: number = 42
): SimulationResult {
  const rng = createRng(seed);
  const npv: number[] = new Array(iterations);
  const irr: number[] = new Array(iterations);
  const ebitdaUsd: number[] = new Array(iterations);
  const ebitdaInr: number[] = new Array(iterations);
  const payback: number[] = new Array(iterations);

  const variableKeys = Object.keys(inputs) as (keyof SimulationInputs)[];
  const inputSeries: Record<string, number[]> = {};
  variableKeys.forEach((k) => (inputSeries[k] = new Array(iterations)));

  const convergence: { atIteration: number; runningMeanNpv: number }[] = [];
  const convergenceStep = Math.max(1, Math.floor(iterations / 60));
  let runningSum = 0;

  for (let i = 0; i < iterations; i++) {
    const sample = sampleIteration(rng, inputs);
    const result = runEconomicModel(sample, assumptions);

    npv[i] = result.npvUSD_Mn;
    irr[i] = result.irrPct;
    ebitdaUsd[i] = result.ebitdaUSD_Mn;
    ebitdaInr[i] = result.ebitdaINR_Cr;
    payback[i] = result.paybackYears;

    variableKeys.forEach((k) => {
      inputSeries[k][i] = sample[k as keyof IterationSample];
    });

    runningSum += result.npvUSD_Mn;
    if ((i + 1) % convergenceStep === 0 || i === iterations - 1) {
      convergence.push({ atIteration: i + 1, runningMeanNpv: runningSum / (i + 1) });
    }
  }

  const drivers: DriverImpact[] = variableKeys.map((k) => {
    const series = inputSeries[k];
    const sortedIdx = series.map((_, i) => i).sort((a, b) => series[a] - series[b]);
    const lowCount = Math.max(1, Math.floor(iterations * 0.1));
    const lowIdx = sortedIdx.slice(0, lowCount);
    const highIdx = sortedIdx.slice(-lowCount);
    const lowNpvMean = mean(lowIdx.map((i) => npv[i]));
    const highNpvMean = mean(highIdx.map((i) => npv[i]));
    return {
      variableId: k,
      label: inputs[k].label,
      correlationToNpv: pearsonCorrelation(series, npv),
      npvSwingUSD_Mn: Math.abs(highNpvMean - lowNpvMean)
    };
  });
  drivers.sort((a, b) => b.npvSwingUSD_Mn - a.npvSwingUSD_Mn);

  const npvClean = npv.filter((v) => Number.isFinite(v));
  const irrClean = irr.filter((v) => Number.isFinite(v));

  return {
    iterations,
    seed,
    npv: summarize(npv),
    irr: summarize(irr),
    ebitdaUsd: summarize(ebitdaUsd),
    ebitdaInr: summarize(ebitdaInr),
    payback: summarize(payback),
    npvHistogram: buildHistogram(npvClean, 18, (n) => `$${Math.round(n).toLocaleString()}M`),
    irrHistogram: buildHistogram(irrClean, 18, (n) => `${n.toFixed(1)}%`),
    ebitdaHistogram: buildHistogram(
      ebitdaInr.filter((v) => Number.isFinite(v)),
      18,
      (n) => `₹${Math.round(n).toLocaleString()}Cr`
    ),
    convergence,
    drivers,
    probabilityNpvNegative: (npvClean.filter((v) => v < 0).length / npvClean.length) * 100,
    probabilityBelowHurdleIrr: (irrClean.filter((v) => v < assumptions.hurdleRateIrrPct).length / irrClean.length) * 100,
    rawNpv: npv,
    rawIrr: irr
  };
}

// ---------------------------------------------------------------------------
// Scenario presets for Auto Mode
// ---------------------------------------------------------------------------

export type ScenarioPreset = 'bear' | 'base' | 'bull';

/** Shifts every variable's mode/mean toward one end, for the Auto Mode scenario comparison. */
export function applyPresetShift(inputs: SimulationInputs, preset: ScenarioPreset): SimulationInputs {
  if (preset === 'base') return inputs;
  const direction = preset === 'bull' ? 1 : -1;
  const clone: SimulationInputs = JSON.parse(JSON.stringify(inputs));
  const shiftTriangular = (v: TriangularVar, favorableIsUp: boolean) => {
    const range = v.max - v.min;
    const push = direction * (favorableIsUp ? 1 : -1) * 0.28 * range;
    v.mode = Math.min(v.max, Math.max(v.min, v.mode + push));
  };
  // Higher olefin prices and higher ethane-naphtha spread help RIL; higher feedstock cost hurts.
  shiftTriangular(clone.ethylenePrice.spec as TriangularVar, true);
  shiftTriangular(clone.propylenePrice.spec as TriangularVar, true);
  shiftTriangular(clone.naphthaPrice.spec as TriangularVar, true); // pricier naphtha widens RIL's ethane cost advantage
  shiftTriangular(clone.ethanePrice.spec as TriangularVar, false);
  shiftTriangular(clone.plantUtilizationPct.spec as TriangularVar, true);
  return clone;
}
