'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import EChartsClient from '@/components/charts/EChartsClient';
import {
  SlidersHorizontal,
  ChevronLeft,
  RefreshCw,
  TrendingUp,
  Layers,
  BarChart2,
  ShieldCheck,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { MONTE_CARLO_RESULT } from '@/data/knowledgeStore';

export default function MonteCarloPage() {
  const [iterations, setIterations] = useState<number>(10000);
  const [selectedMetric, setSelectedMetric] = useState<'NPV' | 'IRR' | 'EBITDA'>('NPV');

  // Distribution Histogram Option
  const bins =
    selectedMetric === 'NPV'
      ? MONTE_CARLO_RESULT.npvDistributionBins
      : selectedMetric === 'IRR'
      ? MONTE_CARLO_RESULT.irrDistributionBins
      : MONTE_CARLO_RESULT.ebitdaDistributionBins;

  const histogramOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0E1420',
      borderColor: '#242F44',
      textStyle: { color: '#F8FAFC', fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0];
        const bin = bins[item.dataIndex];
        return `<div class="font-mono text-xs space-y-1">
          <div class="text-[#94A3B8]">Range: ${item.name}</div>
          <div class="text-[#BFA161] font-bold">Simulations: ${item.value.toLocaleString()}</div>
          <div class="text-[#10B981]">Cumulative: ${bin.cumulativePct}%</div>
        </div>`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: bins.map((b) => b.range),
      axisLine: { lineStyle: { color: '#1E2738' } },
      axisLabel: { color: '#64748B', fontSize: 10, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#141C2B', type: 'dashed' } },
      axisLabel: { color: '#64748B', fontSize: 11, fontFamily: 'monospace' }
    },
    series: [
      {
        name: 'Simulated Frequency',
        type: 'bar',
        barWidth: '55%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#D4BA7B' },
              { offset: 1, color: '#8F7640' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        data: bins.map((b) => b.count)
      }
    ]
  };

  // Tornado Sensitivity Chart Option
  const tornadoDrivers = MONTE_CARLO_RESULT.topSensitivityDrivers;
  const tornadoOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#0E1420',
      borderColor: '#242F44',
      textStyle: { color: '#F8FAFC', fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0];
        const driver = tornadoDrivers.find((d) => d.variable === item.name);
        return `<div class="font-mono text-xs">
          <div class="text-[#94A3B8]">${item.name}</div>
          <div class="text-[#38BDF8] font-bold">NPV Swing: $${item.value}M USD</div>
          <div class="text-[#10B981]">Sensitivity Correlation: ${driver?.correlation}</div>
        </div>`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '5%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#141C2B', type: 'dashed' } },
      axisLabel: { color: '#64748B', fontSize: 11, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'category',
      data: tornadoDrivers.map((d) => d.variable).reverse(),
      axisLine: { lineStyle: { color: '#1E2738' } },
      axisLabel: { color: '#CBD5E1', fontSize: 11 }
    },
    series: [
      {
        name: 'NPV Swing Impact',
        type: 'bar',
        barWidth: '45%',
        itemStyle: {
          color: '#38BDF8',
          borderRadius: [0, 4, 4, 0]
        },
        data: tornadoDrivers.map((d) => d.swingImpactUSD_Mn).reverse()
      }
    ]
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/scenarios"
                className="text-[11px] font-mono text-[#94A3B8] hover:text-[#BFA161] flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Scenario Engine
              </Link>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] font-mono uppercase text-[#BFA161]">Probabilistic Risk Envelope</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              MONTE CARLO SIMULATION (10,000 RUNS)
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Stochastic simulation incorporating correlated lognormal commodity distributions, empirical freight volatility, and discrete startup schedule delays.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-lg bg-[#0E1420] border border-[#1E2738] font-mono text-xs">
              {[1000, 5000, 10000].map((count) => (
                <button
                  key={count}
                  onClick={() => setIterations(count)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    iterations === count
                      ? 'bg-[#BFA161] text-[#080B10] font-bold'
                      : 'text-[#64748B] hover:text-white'
                  }`}
                >
                  {count.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quant Percentiles Table (P10, P25, P50, P75, P90) */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#BFA161] font-bold">
                Output Quantiles ({iterations.toLocaleString()} Iterations)
              </span>
              <h2 className="text-base font-bold text-[#F8FAFC]">
                Probabilistic Outcome Distribution
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              Confidence Interval: 80% (P10 to P90)
            </span>
          </div>

          <div className="rounded-xl border border-[#1A2232] overflow-hidden">
            <table className="w-full text-left text-xs text-[#CBD5E1]">
              <thead className="bg-[#0A0E17] text-[#64748B] uppercase font-mono text-[10px] tracking-wider border-b border-[#1A2232]">
                <tr>
                  <th className="py-3 px-4">Financial Metric</th>
                  <th className="py-3 px-4 text-right">Mean</th>
                  <th className="py-3 px-4 text-right text-[#F43F5E]">P10 (Worst 10%)</th>
                  <th className="py-3 px-4 text-right">P25</th>
                  <th className="py-3 px-4 text-right text-[#BFA161] font-bold">P50 (Median)</th>
                  <th className="py-3 px-4 text-right">P75</th>
                  <th className="py-3 px-4 text-right text-[#10B981]">P90 (Best 10%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2232] font-mono">
                {MONTE_CARLO_RESULT.metrics.map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#121A2B] transition-colors">
                    <td className="py-3.5 px-4 font-sans font-semibold text-[#F8FAFC]">
                      {m.name} ({m.unit})
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#CBD5E1]">
                      {m.mean.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#F43F5E] font-semibold">
                      {m.p10.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#94A3B8]">
                      {m.p25.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#D4BA7B] font-bold text-sm">
                      {m.p50.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#94A3B8]">
                      {m.p75.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#10B981] font-semibold">
                      {m.p90.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribution Histogram & Tornado Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Histogram */}
          <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#BFA161]">
                  Frequency Distribution
                </span>
                <h3 className="text-sm font-bold text-[#F8FAFC]">
                  {selectedMetric} Probability Histogram
                </h3>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs">
                {(['NPV', 'IRR', 'EBITDA'] as const).map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      selectedMetric === metric
                        ? 'bg-[#BFA161] text-[#080B10] font-bold'
                        : 'bg-[#141C2B] text-[#94A3B8]'
                    }`}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-72 w-full">
              <EChartsClient option={histogramOption} height="100%" />
            </div>
          </div>

          {/* Tornado Chart */}
          <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#38BDF8]">
                  Sensitivity Variance Decomposition
                </span>
                <h3 className="text-sm font-bold text-[#F8FAFC]">
                  Tornado Chart (Key Drivers of NPV Variance)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">
                Ranked by USD Impact
              </span>
            </div>

            <div className="h-72 w-full">
              <EChartsClient option={tornadoOption} height="100%" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
