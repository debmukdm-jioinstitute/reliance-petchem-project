'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import EChartsLight from '@/components/charts/EChartsLight';
import GlassCard3D from '@/components/glass/GlassCard3D';
import {
  ChevronLeft,
  SlidersHorizontal,
  Gauge,
  Shuffle,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import {
  buildDefaultVariables,
  DEFAULT_ASSUMPTIONS,
  runMonteCarlo,
  applyPresetShift,
  type SimulationInputs,
  type ProjectAssumptions,
  type SimulationResult,
  type TriangularVar,
  type NormalVar,
  type DiscreteVar,
  type ScenarioPreset
} from '@/lib/monteCarlo';

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const fmtUsdMn = (n: number) => `$${Math.round(n).toLocaleString()}M`;
const fmtInrCr = (n: number) => `₹${Math.round(n).toLocaleString()} Cr`;
const fmtPct = (n: number, d = 1) => `${n.toFixed(d)}%`;
const fmtYears = (n: number) => `${n.toFixed(1)} yrs`;

const GOLD = '#8F7640';
const GOLD_LIGHT = '#BFA161';
const INFO_BLUE = '#0284C7';
const AXIS_LABEL = '#52525B';
const GRID_LINE = 'rgba(0,0,0,0.08)';

// ---------------------------------------------------------------------------
// UI-facing variable state (simplified so business users control two dials
// per variable -- a central estimate and how wide the uncertainty is --
// instead of wrestling with raw min/max numbers).
// ---------------------------------------------------------------------------

interface TriangularUiState {
  kind: 'triangular';
  centralValue: number;
  bandWidth: number; // uncertainty band, +/- this many units around the central value
  bandMin: number;
  bandMax: number;
  bandStep: number;
  hardMin: number;
  hardMax: number;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
}

interface NormalUiState {
  kind: 'normal';
  meanValue: number;
  stdevValue: number;
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  stdevMin: number;
  stdevMax: number;
  stdevStep: number;
}

interface DiscreteUiState {
  kind: 'discrete';
  riskLevel: 'low' | 'base' | 'high';
}

type VariableUiState = TriangularUiState | NormalUiState | DiscreteUiState;

interface VariableMeta {
  id: keyof SimulationInputs;
  label: string;
  group: string;
  unit: string;
  description: string;
}

const SCHEDULE_RISK_PRESETS: Record<'low' | 'base' | 'high', { value: number; probability: number; label: string }[]> = {
  low: [
    { value: 0, probability: 0.85, label: 'On time' },
    { value: 1, probability: 0.12, label: '1 month late' },
    { value: 3, probability: 0.03, label: '3 months late' }
  ],
  base: [
    { value: 0, probability: 0.65, label: 'On time' },
    { value: 1, probability: 0.2, label: '1 month late' },
    { value: 3, probability: 0.12, label: '3 months late' },
    { value: 6, probability: 0.03, label: '6 months late' }
  ],
  high: [
    { value: 0, probability: 0.4, label: 'On time' },
    { value: 1, probability: 0.25, label: '1 month late' },
    { value: 3, probability: 0.2, label: '3 months late' },
    { value: 6, probability: 0.15, label: '6 months late' }
  ]
};

function buildDefaultUiState(): Record<keyof SimulationInputs, VariableUiState> {
  const defaults = buildDefaultVariables();
  const tri = (
    id: keyof SimulationInputs,
    sliderMin: number,
    sliderMax: number,
    sliderStep: number,
    hardMin: number,
    hardMax: number
  ): TriangularUiState => {
    const spec = defaults[id].spec as TriangularVar;
    const bandWidth = Math.round(((spec.mode - spec.min + (spec.max - spec.mode)) / 2) * 10) / 10;
    return {
      kind: 'triangular',
      centralValue: spec.mode,
      bandWidth,
      bandMin: sliderStep,
      bandMax: Math.round(((hardMax - hardMin) / 2) * 10) / 10,
      bandStep: sliderStep,
      hardMin,
      hardMax,
      sliderMin,
      sliderMax,
      sliderStep
    };
  };
  const norm = (
    id: keyof SimulationInputs,
    sliderMin: number,
    sliderMax: number,
    sliderStep: number,
    stdevMin: number,
    stdevMax: number,
    stdevStep: number
  ): NormalUiState => {
    const spec = defaults[id].spec as NormalVar;
    return { kind: 'normal', meanValue: spec.mean, stdevValue: spec.stdev, sliderMin, sliderMax, sliderStep, stdevMin, stdevMax, stdevStep };
  };

  return {
    brentPrice: tri('brentPrice', 50, 140, 1, 20, 200),
    naphthaPrice: tri('naphthaPrice', 400, 950, 5, 200, 1400),
    ethanePrice: tri('ethanePrice', 90, 230, 5, 50, 350),
    ethylenePrice: tri('ethylenePrice', 600, 1150, 5, 300, 1500),
    propylenePrice: tri('propylenePrice', 550, 1050, 5, 300, 1400),
    usdInrFx: norm('usdInrFx', 78, 92, 0.1, 0.2, 4, 0.1),
    freightCost: tri('freightCost', 10, 40, 1, 5, 60),
    waccPct: norm('waccPct', 8, 14, 0.1, 0.1, 2, 0.1),
    startupDelay: { kind: 'discrete', riskLevel: 'base' },
    capexOverrunPct: tri('capexOverrunPct', -10, 40, 1, -15, 60),
    plantUtilizationPct: tri('plantUtilizationPct', 70, 98, 1, 50, 100),
    ethaneMixPct: tri('ethaneMixPct', 50, 95, 1, 30, 98)
  };
}

const VARIABLE_META: VariableMeta[] = (Object.keys(buildDefaultVariables()) as (keyof SimulationInputs)[]).map((id) => {
  const v = buildDefaultVariables()[id];
  return { id, label: v.label, group: v.group, unit: v.unit, description: v.description };
});

const GROUP_ORDER = ['Feedstock & Product Prices', 'Currency & Financing', 'Plant Operations', 'Project Execution'];

function buildSimulationInputs(ui: Record<keyof SimulationInputs, VariableUiState>): SimulationInputs {
  const defaults = buildDefaultVariables();
  const result = defaults;
  (Object.keys(ui) as (keyof SimulationInputs)[]).forEach((id) => {
    const state = ui[id];
    if (state.kind === 'triangular') {
      const min = Math.max(state.hardMin, state.centralValue - state.bandWidth);
      const max = Math.min(state.hardMax, state.centralValue + state.bandWidth);
      const spec = result[id].spec as TriangularVar;
      result[id] = { ...result[id], spec: { ...spec, min, mode: state.centralValue, max } };
    } else if (state.kind === 'normal') {
      const spec = result[id].spec as NormalVar;
      result[id] = { ...result[id], spec: { ...spec, mean: state.meanValue, stdev: state.stdevValue } };
    } else {
      const spec = result[id].spec as DiscreteVar;
      result[id] = { ...result[id], spec: { ...spec, outcomes: SCHEDULE_RISK_PRESETS[state.riskLevel] } };
    }
  });
  return result;
}

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function KpiCard({
  title,
  median,
  range,
  unit,
  tone
}: {
  title: string;
  median: string;
  range: string;
  unit?: string;
  tone: 'gold' | 'green' | 'blue' | 'neutral';
}) {
  const toneClass =
    tone === 'gold'
      ? 'text-[#8F7640] dark:text-[#D4BA7B]'
      : tone === 'green'
      ? 'text-emerald-700 dark:text-emerald-400'
      : tone === 'blue'
      ? 'text-sky-700 dark:text-sky-400'
      : 'text-neutral-900 dark:text-white';
  return (
    <GlassCard3D className="p-6 lg:p-7">
      <div className="text-base font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 mb-3">{title}</div>
      <div className={`text-4xl lg:text-5xl font-extrabold tracking-tight ${toneClass}`}>{median}</div>
      {unit && <div className="text-lg font-semibold text-neutral-500 dark:text-neutral-400 mt-1">{unit}</div>}
      <div className="mt-4 pt-4 border-t border-neutral-200/70 dark:border-white/10 text-base font-medium text-neutral-600 dark:text-neutral-300">
        {range}
      </div>
    </GlassCard3D>
  );
}

function SectionHeading({ eyebrow, title, right }: { eyebrow: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-neutral-200/70 dark:border-white/10">
      <div>
        <div className="text-sm font-bold uppercase tracking-wider text-[#8F7640] dark:text-[#D4BA7B]">{eyebrow}</div>
        <h2 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-white mt-0.5">{title}</h2>
      </div>
      {right}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chart option builders
// ---------------------------------------------------------------------------

function histogramOption(bins: { rangeLabel: string; count: number; cumulativePct: number }[]) {
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#FFFFFF',
      borderColor: '#E4E4E7',
      textStyle: { color: '#18181B', fontSize: 14 },
      formatter: (params: any) => {
        const item = params[0];
        const bin = bins[item.dataIndex];
        return `<div style="font-size:13px;line-height:1.5"><b>${bin.rangeLabel}</b><br/>Simulations: ${bin.count.toLocaleString()}<br/>Cumulative: ${bin.cumulativePct.toFixed(1)}%</div>`;
      }
    },
    grid: { left: '2%', right: '4%', bottom: '18%', top: '6%', containLabel: true },
    xAxis: {
      type: 'category',
      data: bins.map((b) => b.rangeLabel),
      axisLine: { lineStyle: { color: GRID_LINE } },
      axisLabel: { color: AXIS_LABEL, fontSize: 14, rotate: 45, interval: Math.ceil(bins.length / 9) }
    },
    yAxis: {
      type: 'value',
      name: 'Simulations',
      nameTextStyle: { color: AXIS_LABEL, fontSize: 14 },
      splitLine: { lineStyle: { color: GRID_LINE, type: 'dashed' } },
      axisLabel: { color: AXIS_LABEL, fontSize: 14 }
    },
    series: [
      {
        name: 'Simulations',
        type: 'bar',
        barWidth: '82%',
        itemStyle: {
          color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: GOLD_LIGHT }, { offset: 1, color: GOLD }] },
          borderRadius: [3, 3, 0, 0]
        },
        data: bins.map((b) => b.count)
      }
    ]
  };
}

function sCurveOption(bins: { rangeLabel: string; cumulativePct: number }[]) {
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#FFFFFF',
      borderColor: '#E4E4E7',
      textStyle: { color: '#18181B', fontSize: 14 },
      formatter: (params: any) => `<div style="font-size:13px">${params[0].name}<br/><b>${params[0].value.toFixed(1)}% of runs at or below this level</b></div>`
    },
    grid: { left: '2%', right: '4%', bottom: '18%', top: '6%', containLabel: true },
    xAxis: {
      type: 'category',
      data: bins.map((b) => b.rangeLabel),
      axisLine: { lineStyle: { color: GRID_LINE } },
      axisLabel: { color: AXIS_LABEL, fontSize: 14, rotate: 45, interval: Math.ceil(bins.length / 9) }
    },
    yAxis: {
      type: 'value',
      max: 100,
      name: 'Cumulative %',
      nameTextStyle: { color: AXIS_LABEL, fontSize: 14 },
      splitLine: { lineStyle: { color: GRID_LINE, type: 'dashed' } },
      axisLabel: { color: AXIS_LABEL, fontSize: 14, formatter: '{value}%' }
    },
    series: [
      {
        name: 'Cumulative probability',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: INFO_BLUE, width: 3 },
        itemStyle: { color: INFO_BLUE },
        areaStyle: { color: 'rgba(2, 132, 199, 0.08)' },
        data: bins.map((b) => b.cumulativePct)
      }
    ]
  };
}

function tornadoOption(drivers: { label: string; npvSwingUSD_Mn: number; correlationToNpv: number }[]) {
  const top = drivers.slice(0, 8);
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#FFFFFF',
      borderColor: '#E4E4E7',
      textStyle: { color: '#18181B', fontSize: 14 },
      formatter: (params: any) => {
        const item = params[0];
        const driver = top[top.length - 1 - item.dataIndex];
        return `<div style="font-size:13px"><b>${driver.label}</b><br/>NPV swing: $${Math.round(driver.npvSwingUSD_Mn).toLocaleString()}M<br/>Correlation with NPV: ${driver.correlationToNpv.toFixed(2)}</div>`;
      }
    },
    grid: { left: '2%', right: '6%', bottom: '4%', top: '4%', containLabel: true },
    xAxis: {
      type: 'value',
      name: 'NPV Swing ($M)',
      nameTextStyle: { color: AXIS_LABEL, fontSize: 14 },
      splitLine: { lineStyle: { color: GRID_LINE, type: 'dashed' } },
      axisLabel: { color: AXIS_LABEL, fontSize: 14 }
    },
    yAxis: {
      type: 'category',
      data: top.map((d) => d.label).reverse(),
      axisLine: { lineStyle: { color: GRID_LINE } },
      axisLabel: { color: '#27272A', fontSize: 14, fontWeight: 600 }
    },
    series: [
      {
        name: 'NPV Swing',
        type: 'bar',
        barWidth: '55%',
        itemStyle: { color: INFO_BLUE, borderRadius: [0, 4, 4, 0] },
        data: top.map((d) => Math.round(d.npvSwingUSD_Mn)).reverse()
      }
    ]
  };
}

function convergenceOption(points: { atIteration: number; runningMeanNpv: number }[]) {
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#FFFFFF',
      borderColor: '#E4E4E7',
      textStyle: { color: '#18181B', fontSize: 14 },
      formatter: (params: any) => `<div style="font-size:13px">After ${params[0].name} runs<br/><b>Running average NPV: $${Math.round(params[0].value).toLocaleString()}M</b></div>`
    },
    grid: { left: '2%', right: '4%', bottom: '10%', top: '6%', containLabel: true },
    xAxis: {
      type: 'category',
      data: points.map((p) => p.atIteration.toLocaleString()),
      axisLine: { lineStyle: { color: GRID_LINE } },
      axisLabel: { color: AXIS_LABEL, fontSize: 14, interval: Math.ceil(points.length / 6) }
    },
    yAxis: {
      type: 'value',
      name: 'Running Avg NPV ($M)',
      nameTextStyle: { color: AXIS_LABEL, fontSize: 14 },
      splitLine: { lineStyle: { color: GRID_LINE, type: 'dashed' } },
      axisLabel: { color: AXIS_LABEL, fontSize: 14 }
    },
    series: [
      {
        name: 'Running average NPV',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { color: GOLD, width: 3 },
        data: points.map((p) => Math.round(p.runningMeanNpv))
      }
    ]
  };
}

// ---------------------------------------------------------------------------
// Shared results dashboard (used by both Manual and Auto modes)
// ---------------------------------------------------------------------------

function ResultsDashboard({
  result,
  assumptions,
  metric,
  setMetric
}: {
  result: SimulationResult;
  assumptions: ProjectAssumptions;
  metric: 'NPV' | 'IRR' | 'EBITDA';
  setMetric: (m: 'NPV' | 'IRR' | 'EBITDA') => void;
}) {
  const bins = metric === 'NPV' ? result.npvHistogram : metric === 'IRR' ? result.irrHistogram : result.ebitdaHistogram;

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <KpiCard
          title="Project NPV"
          median={fmtUsdMn(result.npv.p50)}
          range={`80% chance between ${fmtUsdMn(result.npv.p10)} and ${fmtUsdMn(result.npv.p90)}`}
          tone="gold"
        />
        <KpiCard
          title="Project IRR"
          median={fmtPct(result.irr.p50)}
          range={`80% chance between ${fmtPct(result.irr.p10)} and ${fmtPct(result.irr.p90)}`}
          tone="green"
        />
        <KpiCard
          title="Annual EBITDA"
          median={fmtInrCr(result.ebitdaInr.p50)}
          range={`80% chance between ${fmtInrCr(result.ebitdaInr.p10)} and ${fmtInrCr(result.ebitdaInr.p90)}`}
          tone="blue"
        />
        <KpiCard
          title="Payback Period"
          median={fmtYears(result.payback.p50)}
          range={`80% chance between ${fmtYears(result.payback.p10)} and ${fmtYears(result.payback.p90)}`}
          tone="neutral"
        />
      </div>

      {/* Risk callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div
          className={`p-5 rounded-2xl border flex items-start gap-4 ${
            result.probabilityNpvNegative > 10
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
          }`}
        >
          {result.probabilityNpvNegative > 10 ? (
            <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div>
            <div className="text-lg font-bold text-neutral-900 dark:text-white">
              {result.probabilityNpvNegative.toFixed(1)}% chance the project loses money
            </div>
            <div className="text-base text-neutral-600 dark:text-neutral-300 mt-1">
              Out of {result.iterations.toLocaleString()} simulated futures, this share came back with a negative NPV.
            </div>
          </div>
        </div>

        <div
          className={`p-5 rounded-2xl border flex items-start gap-4 ${
            result.probabilityBelowHurdleIrr > 25
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
              : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
          }`}
        >
          <Gauge className="w-7 h-7 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-lg font-bold text-neutral-900 dark:text-white">
              {result.probabilityBelowHurdleIrr.toFixed(1)}% chance IRR misses the {assumptions.hurdleRateIrrPct}% hurdle rate
            </div>
            <div className="text-base text-neutral-600 dark:text-neutral-300 mt-1">
              RIL&apos;s minimum required return on this capital is {assumptions.hurdleRateIrrPct}%. This is how often the simulation fell short of it.
            </div>
          </div>
        </div>
      </div>

      {/* Histogram + S-curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard3D className="p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Outcome Frequency</h3>
            <div className="flex items-center gap-1 text-sm font-bold">
              {(['NPV', 'IRR', 'EBITDA'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    metric === m ? 'bg-[#8F7640] text-white' : 'bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <p className="text-base text-neutral-600 dark:text-neutral-300 mb-3">
            How often each {metric} outcome showed up across every simulated run.
          </p>
          <div className="h-80 w-full">
            <EChartsLight option={histogramOption(bins)} height="100%" />
          </div>
        </GlassCard3D>

        <GlassCard3D className="p-6">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Chance of Being Below a Level</h3>
          <p className="text-base text-neutral-600 dark:text-neutral-300 mb-3">
            Read this as: &ldquo;there is a Y% chance {metric} comes in at or below X.&rdquo;
          </p>
          <div className="h-80 w-full">
            <EChartsLight option={sCurveOption(bins)} height="100%" />
          </div>
        </GlassCard3D>
      </div>

      {/* Tornado */}
      <GlassCard3D className="p-6">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">What Moves the Outcome Most</h3>
        <p className="text-base text-neutral-600 dark:text-neutral-300 mb-4">
          Each bar shows how far NPV swings between this variable&apos;s worst 10% and best 10% of simulated values. Longer bar, bigger business impact.
        </p>
        <div className="h-96 w-full">
          <EChartsLight option={tornadoOption(result.drivers)} height="100%" />
        </div>
      </GlassCard3D>

      {/* Convergence */}
      <GlassCard3D className="p-6">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Simulation Stability Check</h3>
        <p className="text-base text-neutral-600 dark:text-neutral-300 mb-4">
          The running average NPV should flatten out as more runs are added. A flat line means enough simulations were run to trust the results.
        </p>
        <div className="h-64 w-full">
          <EChartsLight option={convergenceOption(result.convergence)} height="100%" />
        </div>
      </GlassCard3D>

      {/* Percentile table */}
      <GlassCard3D className="p-6 overflow-hidden">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Full Outcome Range</h3>
        <p className="text-base text-neutral-600 dark:text-neutral-300 mb-4">
          P10 means only 10% of simulations came in lower. P90 means only 10% came in higher. The middle 80% of realistic outcomes sits between them.
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="text-sm font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 border-b-2 border-neutral-200 dark:border-white/10">
                <th className="py-3 px-2">Metric</th>
                <th className="py-3 px-2 text-right">P10</th>
                <th className="py-3 px-2 text-right">P25</th>
                <th className="py-3 px-2 text-right text-[#8F7640] dark:text-[#D4BA7B]">P50 (Median)</th>
                <th className="py-3 px-2 text-right">P75</th>
                <th className="py-3 px-2 text-right">P90</th>
              </tr>
            </thead>
            <tbody className="text-base">
              {[
                { name: 'NPV', unit: '$M', s: result.npv },
                { name: 'IRR', unit: '%', s: result.irr },
                { name: 'Annual EBITDA', unit: '₹ Cr', s: result.ebitdaInr },
                { name: 'Payback', unit: 'years', s: result.payback }
              ].map((row) => (
                <tr key={row.name} className="border-b border-neutral-100 dark:border-white/5">
                  <td className="py-3.5 px-2 font-bold text-neutral-900 dark:text-white">
                    {row.name} <span className="text-neutral-400 font-normal">({row.unit})</span>
                  </td>
                  <td className="py-3.5 px-2 text-right text-rose-600 dark:text-rose-400 font-semibold">{row.s.p10.toFixed(1)}</td>
                  <td className="py-3.5 px-2 text-right text-neutral-700 dark:text-neutral-300">{row.s.p25.toFixed(1)}</td>
                  <td className="py-3.5 px-2 text-right font-bold text-[#8F7640] dark:text-[#D4BA7B]">{row.s.p50.toFixed(1)}</td>
                  <td className="py-3.5 px-2 text-right text-neutral-700 dark:text-neutral-300">{row.s.p75.toFixed(1)}</td>
                  <td className="py-3.5 px-2 text-right text-emerald-700 dark:text-emerald-400 font-semibold">{row.s.p90.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard3D>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Manual mode controls
// ---------------------------------------------------------------------------

function VariableControl({
  meta,
  state,
  onChange
}: {
  meta: VariableMeta;
  state: VariableUiState;
  onChange: (next: VariableUiState) => void;
}) {
  if (state.kind === 'triangular') {
    const s = state;
    const impliedMin = Math.max(s.hardMin, s.centralValue - s.bandWidth);
    const impliedMax = Math.min(s.hardMax, s.centralValue + s.bandWidth);
    return (
      <div className="py-4 border-b border-neutral-200/70 dark:border-white/10 last:border-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-base font-bold text-neutral-800 dark:text-neutral-200">{meta.label}</span>
          <span className="text-base font-mono font-bold text-[#8F7640] dark:text-[#D4BA7B]">
            {s.centralValue.toLocaleString()} {meta.unit}
          </span>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{meta.description}</p>
        <label className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Most likely value</label>
        <input
          type="range"
          min={s.sliderMin}
          max={s.sliderMax}
          step={s.sliderStep}
          value={s.centralValue}
          onChange={(e) => onChange({ ...s, centralValue: Number(e.target.value) })}
          className="w-full accent-[#BFA161] cursor-pointer mt-1"
        />
        <div className="flex items-center justify-between mt-3">
          <label className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Uncertainty band</label>
          <span className="text-sm font-mono text-neutral-500">
            ±{s.bandWidth} {meta.unit} ({impliedMin.toFixed(0)} – {impliedMax.toFixed(0)} {meta.unit})
          </span>
        </div>
        <input
          type="range"
          min={s.bandMin}
          max={s.bandMax}
          step={s.bandStep}
          value={s.bandWidth}
          onChange={(e) => onChange({ ...s, bandWidth: Number(e.target.value) })}
          className="w-full accent-neutral-400 cursor-pointer mt-1"
        />
      </div>
    );
  }

  if (state.kind === 'normal') {
    const s = state;
    return (
      <div className="py-4 border-b border-neutral-200/70 dark:border-white/10 last:border-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-base font-bold text-neutral-800 dark:text-neutral-200">{meta.label}</span>
          <span className="text-base font-mono font-bold text-[#8F7640] dark:text-[#D4BA7B]">
            {s.meanValue.toLocaleString()} {meta.unit}
          </span>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">{meta.description}</p>
        <label className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Central value</label>
        <input
          type="range"
          min={s.sliderMin}
          max={s.sliderMax}
          step={s.sliderStep}
          value={s.meanValue}
          onChange={(e) => onChange({ ...s, meanValue: Number(e.target.value) })}
          className="w-full accent-[#BFA161] cursor-pointer mt-1"
        />
        <div className="flex items-center justify-between mt-3">
          <label className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">Volatility</label>
          <span className="text-sm font-mono text-neutral-500">±{s.stdevValue.toFixed(1)} {meta.unit}</span>
        </div>
        <input
          type="range"
          min={s.stdevMin}
          max={s.stdevMax}
          step={s.stdevStep}
          value={s.stdevValue}
          onChange={(e) => onChange({ ...s, stdevValue: Number(e.target.value) })}
          className="w-full accent-neutral-400 cursor-pointer mt-1"
        />
      </div>
    );
  }

  // discrete: schedule risk
  const s = state;
  return (
    <div className="py-4">
      <div className="text-base font-bold text-neutral-800 dark:text-neutral-200 mb-1">{meta.label}</div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">{meta.description}</p>
      <div className="grid grid-cols-3 gap-2">
        {(['low', 'base', 'high'] as const).map((level) => (
          <button
            key={level}
            onClick={() => onChange({ ...s, riskLevel: level })}
            className={`py-2.5 rounded-xl text-sm font-bold border transition-all capitalize ${
              s.riskLevel === level
                ? 'bg-[#8F7640] text-white border-[#8F7640]'
                : 'bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-white/10'
            }`}
          >
            {level} risk
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MonteCarloPage() {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [iterations, setIterations] = useState(5000);
  const [seed, setSeed] = useState(42);
  const [metric, setMetric] = useState<'NPV' | 'IRR' | 'EBITDA'>('NPV');
  const [uiState, setUiState] = useState(buildDefaultUiState());
  const [assumptions] = useState<ProjectAssumptions>(DEFAULT_ASSUMPTIONS);

  const manualInputs = useMemo(() => buildSimulationInputs(uiState), [uiState]);
  const manualResult = useMemo(
    () => runMonteCarlo(manualInputs, assumptions, iterations, seed),
    [manualInputs, assumptions, iterations, seed]
  );

  const autoBaseInputs = useMemo(() => buildDefaultVariables(), []);
  const autoResult = useMemo(() => runMonteCarlo(autoBaseInputs, assumptions, 20000, 7), [autoBaseInputs, assumptions]);
  const bearResult = useMemo(
    () => runMonteCarlo(applyPresetShift(autoBaseInputs, 'bear'), assumptions, 8000, 11),
    [autoBaseInputs, assumptions]
  );
  const bullResult = useMemo(
    () => runMonteCarlo(applyPresetShift(autoBaseInputs, 'bull'), assumptions, 8000, 13),
    [autoBaseInputs, assumptions]
  );

  const topDriver = autoResult.drivers[0];

  return (
    <AppShell>
      <div className="max-w-[1500px] mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-neutral-200/70 dark:border-white/10">
          <Link
            href="/scenarios"
            className="text-sm font-bold text-neutral-500 hover:text-[#8F7640] dark:hover:text-[#D4BA7B] flex items-center gap-1 mb-3"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Scenario Engine
          </Link>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Monte Carlo Simulation
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mt-2 max-w-3xl leading-relaxed">
            This tool tests the RIL cracker capacity expansion (Jamnagar, Dahej, Hazira, Nagothane, Vadodara) against
            thousands of possible futures at once, instead of a single guess. Feedstock prices, product prices, currency,
            and schedule risk are all uncertain. Each simulated run picks one plausible combination of these and works out
            the project&apos;s NPV, IRR, EBITDA, and payback period. Looking at all the runs together shows the full range of
            outcomes and how likely each one is.
          </p>
        </div>

        {/* Mode switch */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="inline-flex p-1.5 rounded-2xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
            <button
              onClick={() => setMode('manual')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-base font-bold transition-all ${
                mode === 'manual' ? 'bg-white dark:bg-white/15 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500'
              }`}
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
              Manual Control
            </button>
            <button
              onClick={() => setMode('auto')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-base font-bold transition-all ${
                mode === 'auto' ? 'bg-white dark:bg-white/15 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-500'
              }`}
            >
              <Gauge className="w-4.5 h-4.5" />
              Auto Mode — All Parameters
            </button>
          </div>

          {mode === 'manual' && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-sm font-bold">
                {[1000, 5000, 10000, 25000].map((count) => (
                  <button
                    key={count}
                    onClick={() => setIterations(count)}
                    className={`px-3.5 py-2 rounded-lg transition-all ${
                      iterations === count ? 'bg-[#8F7640] text-white' : 'text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    {count.toLocaleString()}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSeed((s) => s + 1)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-sm font-bold text-neutral-700 dark:text-neutral-200 hover:border-[#BFA161]"
              >
                <Shuffle className="w-4 h-4" /> Re-run
              </button>
              <button
                onClick={() => setUiState(buildDefaultUiState())}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-sm font-bold text-neutral-700 dark:text-neutral-200 hover:border-[#BFA161]"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          )}
        </div>

        {mode === 'manual' ? (
          <div className="grid grid-cols-1 xl:grid-cols-[400px_1fr] gap-6 items-start">
            {/* Controls */}
            <GlassCard3D className="p-6 xl:sticky xl:top-6">
              <div className="flex items-center gap-2 mb-2">
                <SlidersHorizontal className="w-5 h-5 text-[#8F7640] dark:text-[#D4BA7B]" />
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Set Your Own Ranges</h2>
              </div>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mb-2">
                Move a dial, and every chart on the right updates instantly using {iterations.toLocaleString()} simulated
                runs.
              </p>
              <div className="max-h-[70vh] overflow-y-auto pr-1">
                {GROUP_ORDER.map((group) => (
                  <div key={group} className="mb-2">
                    <div className="text-sm font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 pt-4 pb-1">
                      {group}
                    </div>
                    {VARIABLE_META.filter((m) => m.group === group).map((meta) => (
                      <VariableControl
                        key={meta.id}
                        meta={meta}
                        state={uiState[meta.id]}
                        onChange={(next) => setUiState((prev) => ({ ...prev, [meta.id]: next }))}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </GlassCard3D>

            {/* Results */}
            <ResultsDashboard result={manualResult} assumptions={assumptions} metric={metric} setMetric={setMetric} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Executive read-out */}
            <div className="p-6 rounded-2xl bg-[#FBF7EE] dark:bg-white/5 border border-[#E9DCC0] dark:border-white/10 flex items-start gap-4">
              <Info className="w-7 h-7 text-[#8F7640] dark:text-[#D4BA7B] shrink-0 mt-0.5" />
              <p className="text-lg text-neutral-800 dark:text-neutral-200 leading-relaxed">
                Across {autoResult.iterations.toLocaleString()} simulated runs using every parameter&apos;s full realistic range,
                the median project NPV is <b>{fmtUsdMn(autoResult.npv.p50)}</b> with an IRR of{' '}
                <b>{fmtPct(autoResult.irr.p50)}</b>. The single biggest swing factor is{' '}
                <b>{topDriver.label}</b>, worth roughly <b>{fmtUsdMn(topDriver.npvSwingUSD_Mn)}</b> of NPV between its
                worst and best 10% of outcomes. There is a <b>{autoResult.probabilityNpvNegative.toFixed(1)}%</b> chance
                the project comes back with a negative NPV, and a{' '}
                <b>{autoResult.probabilityBelowHurdleIrr.toFixed(1)}%</b> chance IRR misses the{' '}
                {assumptions.hurdleRateIrrPct}% hurdle rate.
              </p>
            </div>

            {/* Scenario comparison */}
            <div>
              <SectionHeading eyebrow="Auto-Generated Scenarios" title="Bear, Base, and Bull Case" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                {(
                  [
                    { key: 'bear', title: 'Bear Case', desc: 'Weak olefin margins, narrow ethane-naphtha spread, slower ramp-up.', result: bearResult, icon: TrendingDown, tone: 'text-rose-600 dark:text-rose-400' },
                    { key: 'base', title: 'Base Case', desc: 'Current market ranges, no directional bias applied.', result: autoResult, icon: Gauge, tone: 'text-[#8F7640] dark:text-[#D4BA7B]' },
                    { key: 'bull', title: 'Bull Case', desc: 'Wider ethane cost advantage, strong olefin realizations, high utilisation.', result: bullResult, icon: TrendingUp, tone: 'text-emerald-600 dark:text-emerald-400' }
                  ] as { key: ScenarioPreset; title: string; desc: string; result: SimulationResult; icon: any; tone: string }[]
                ).map((s) => (
                  <GlassCard3D key={s.key} className="p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <s.icon className={`w-5 h-5 ${s.tone}`} />
                      <h3 className={`text-xl font-extrabold ${s.tone}`}>{s.title}</h3>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{s.desc}</p>
                    <div className="space-y-3">
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-semibold text-neutral-600 dark:text-neutral-300">Median NPV</span>
                        <span className="text-2xl font-extrabold text-neutral-900 dark:text-white">{fmtUsdMn(s.result.npv.p50)}</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-semibold text-neutral-600 dark:text-neutral-300">Median IRR</span>
                        <span className="text-2xl font-extrabold text-neutral-900 dark:text-white">{fmtPct(s.result.irr.p50)}</span>
                      </div>
                      <div className="flex items-baseline justify-between pt-2 border-t border-neutral-200/70 dark:border-white/10">
                        <span className="text-base font-semibold text-neutral-600 dark:text-neutral-300">EBITDA (median)</span>
                        <span className="text-lg font-bold text-neutral-700 dark:text-neutral-200">{fmtInrCr(s.result.ebitdaInr.p50)}</span>
                      </div>
                    </div>
                  </GlassCard3D>
                ))}
              </div>
            </div>

            {/* Full parameter ledger */}
            <div>
              <SectionHeading eyebrow="Every Input, In One Place" title="Full Parameter Ledger" />
              <GlassCard3D className="p-6 mt-5 overflow-hidden">
                <p className="text-base text-neutral-600 dark:text-neutral-300 mb-4">
                  Every variable behind the base case above, with the range it is allowed to take and why it matters. This
                  is the full set of assumptions driving the numbers on this page.
                </p>
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="text-sm font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400 border-b-2 border-neutral-200 dark:border-white/10">
                        <th className="py-3 px-2">Parameter</th>
                        <th className="py-3 px-2">Group</th>
                        <th className="py-3 px-2">Shape</th>
                        <th className="py-3 px-2 text-right">Low</th>
                        <th className="py-3 px-2 text-right">Central</th>
                        <th className="py-3 px-2 text-right">High</th>
                        <th className="py-3 px-2">Business meaning</th>
                      </tr>
                    </thead>
                    <tbody className="text-base">
                      {VARIABLE_META.map((meta) => {
                        const spec = autoBaseInputs[meta.id].spec;
                        let shape = '';
                        let low = '—';
                        let central = '—';
                        let high = '—';
                        if (spec.distribution === 'triangular') {
                          shape = 'Triangular';
                          low = spec.min.toFixed(0);
                          central = spec.mode.toFixed(0);
                          high = spec.max.toFixed(0);
                        } else if (spec.distribution === 'normal') {
                          shape = 'Normal';
                          low = (spec.mean - 2 * spec.stdev).toFixed(1);
                          central = spec.mean.toFixed(1);
                          high = (spec.mean + 2 * spec.stdev).toFixed(1);
                        } else {
                          shape = 'Discrete';
                          low = `${spec.outcomes[0].value}`;
                          central = `${Math.round(spec.outcomes.reduce((a, o) => a + o.value * o.probability, 0))}`;
                          high = `${spec.outcomes[spec.outcomes.length - 1].value}`;
                        }
                        return (
                          <tr key={meta.id} className="border-b border-neutral-100 dark:border-white/5">
                            <td className="py-3.5 px-2 font-bold text-neutral-900 dark:text-white whitespace-nowrap">{meta.label}</td>
                            <td className="py-3.5 px-2 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{meta.group}</td>
                            <td className="py-3.5 px-2 text-neutral-600 dark:text-neutral-300">{shape}</td>
                            <td className="py-3.5 px-2 text-right font-mono text-neutral-700 dark:text-neutral-300">
                              {low} {meta.unit}
                            </td>
                            <td className="py-3.5 px-2 text-right font-mono font-bold text-[#8F7640] dark:text-[#D4BA7B]">
                              {central} {meta.unit}
                            </td>
                            <td className="py-3.5 px-2 text-right font-mono text-neutral-700 dark:text-neutral-300">
                              {high} {meta.unit}
                            </td>
                            <td className="py-3.5 px-2 text-neutral-600 dark:text-neutral-300 max-w-xs">{meta.description}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </GlassCard3D>
            </div>

            {/* Full results dashboard for the base case */}
            <div>
              <SectionHeading eyebrow="Base Case, In Full" title="Every Chart, Base Case" />
              <div className="mt-5">
                <ResultsDashboard result={autoResult} assumptions={assumptions} metric={metric} setMetric={setMetric} />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
