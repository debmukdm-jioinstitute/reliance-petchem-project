'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import EChartsClient from '@/components/charts/EChartsClient';
import {
  SlidersHorizontal,
  Layers,
  TrendingUp,
  RefreshCw,
  GitFork,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sliders,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { SCENARIO_DEFINITIONS } from '@/data/knowledgeStore';

export default function ScenarioEnginePage() {
  const [activePreset, setActivePreset] = useState<'base-case' | 'upside-case' | 'downside-case' | 'custom'>('base-case');

  // Custom interactive sliders state
  const [brentDelta, setBrentDelta] = useState<number>(0);
  const [ethaneDelta, setEthaneDelta] = useState<number>(0);
  const [naphthaDelta, setNaphthaDelta] = useState<number>(0);
  const [delayMonths, setDelayMonths] = useState<number>(0);
  const [fxRate, setFxRate] = useState<number>(84.0);
  const [utilizationRate, setUtilizationRate] = useState<number>(92);

  const activeScenario = SCENARIO_DEFINITIONS[activePreset] || SCENARIO_DEFINITIONS['base-case'];

  // Calculate live dynamic impacts if preset is custom or sliders are adjusted
  const isCustom = activePreset === 'custom';

  const effBrentDelta = isCustom ? brentDelta : activeScenario.inputs.brentOilDeltaPct;
  const effEthaneDelta = isCustom ? ethaneDelta : activeScenario.inputs.ethanePriceDeltaPct;
  const effNaphthaDelta = isCustom ? naphthaDelta : activeScenario.inputs.naphthaPriceDeltaPct;
  const effDelayMonths = isCustom ? delayMonths : activeScenario.inputs.projectStartupDelayMonths;
  const effFxRate = isCustom ? fxRate : activeScenario.inputs.fxUsdInr;
  const effUtilization = isCustom ? utilizationRate : activeScenario.inputs.plantUtilizationPct;

  // Formula-driven calculation engine
  // Baseline: Base EBITDA = ₹58,400 Cr, Base NPV = $2,840M, Base IRR = 19.4%, Payback = 4.8 yrs
  const ebitdaFromEthane = -(effEthaneDelta * 240); // Ethane cost drops -> EBITDA increases
  const ebitdaFromNaphtha = -(effNaphthaDelta * 110);
  const ebitdaFromBrentOlefins = effBrentDelta * 180; // Crude push lifts chemical pricing
  const ebitdaFromUtilization = (effUtilization - 92) * 620;
  const ebitdaFromDelay = -(effDelayMonths * 260);
  const ebitdaFromFx = (effFxRate - 84.0) * 450;

  const totalEbitdaDelta = ebitdaFromEthane + ebitdaFromNaphtha + ebitdaFromBrentOlefins + ebitdaFromUtilization + ebitdaFromDelay + ebitdaFromFx;
  const calculatedEBITDA = 58400 + totalEbitdaDelta;

  const calculatedNPV = Math.round(2840 + (totalEbitdaDelta / 84) * 5.2 - effDelayMonths * 54);
  const calculatedIRR = +(19.4 + (totalEbitdaDelta / 58400) * 8.5 - effDelayMonths * 0.65).toFixed(1);
  const calculatedPayback = +(4.8 - (totalEbitdaDelta / 58400) * 1.8 + effDelayMonths * 0.45).toFixed(1);

  // ECharts Waterfall Chart for Profit / EBITDA Impact Decomposition
  const waterfallLabels = [
    'Base Plan EBITDA',
    'Ethane Price Shift',
    'Naphtha Cost Impact',
    'Brent Crude Olefin Uplift',
    'Plant Utilization Delta',
    'Schedule Delay Penalty',
    'Net Scenario EBITDA'
  ];

  const waterfallData = [
    58400,
    ebitdaFromEthane,
    ebitdaFromNaphtha,
    ebitdaFromBrentOlefins,
    ebitdaFromUtilization,
    ebitdaFromDelay,
    calculatedEBITDA
  ];

  const waterfallOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#0E1420',
      borderColor: '#242F44',
      textStyle: { color: '#F8FAFC', fontSize: 12 },
      formatter: (params: any) => {
        const p = params[0];
        const val = waterfallData[p.dataIndex];
        return `<div class="font-mono text-xs">
          <div class="text-[#94A3B8]">${p.name}</div>
          <div class="text-[#F8FAFC] font-bold">${val >= 0 ? '+' : ''}₹${val.toLocaleString()} Cr</div>
        </div>`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: waterfallLabels,
      axisLine: { lineStyle: { color: '#1E2738' } },
      axisLabel: {
        color: '#64748B',
        fontSize: 10,
        fontFamily: 'monospace',
        interval: 0,
        rotate: 15
      }
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: '#141C2B', type: 'dashed' } },
      axisLabel: { color: '#64748B', fontSize: 11, fontFamily: 'monospace' }
    },
    series: [
      {
        name: 'Impact',
        type: 'bar',
        barWidth: '40%',
        data: waterfallData.map((val, idx) => {
          if (idx === 0 || idx === waterfallData.length - 1) {
            return { value: val, itemStyle: { color: '#BFA161' } };
          }
          return {
            value: val,
            itemStyle: { color: val >= 0 ? '#10B981' : '#F43F5E' }
          };
        })
      }
    ]
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#BFA161]" />
                Institutional Scenario Simulation Engine
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Reliance O2C Stress Testing Layer</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              SCENARIO ENGINE & IMPACT WATERFALL
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Simulate cascading multi-variable shocks across Brent crude, ethane, naphtha, plant utilization, and startup delay with real-time financial propagation.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/scenarios/monte-carlo"
              className="px-3.5 py-2 rounded-lg bg-[#BFA161]/15 hover:bg-[#BFA161]/25 border border-[#BFA161]/40 text-[#D4BA7B] text-xs font-mono font-medium transition-all flex items-center gap-1.5"
            >
              <span>10,000-Run Monte Carlo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Preset Scenario Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            { id: 'base-case', name: 'Base Case (Executive Plan)', desc: 'Brent $82, Ethane $145/t, On Schedule' },
            { id: 'upside-case', name: 'Ethane Advantage (Upside)', desc: 'Brent +15%, Ethane -10%, Margin Surge' },
            { id: 'downside-case', name: 'Oversupply & Delay (Downside)', desc: 'Ethylene -15%, Delay +3M, Capex +8%' },
            { id: 'custom', name: 'Custom Sandbox (Interactive)', desc: 'Freely tune sliders to model specific shocks' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset.id as any)}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                activePreset === preset.id
                  ? 'bg-[#151D2C] border-[#BFA161] shadow-lg'
                  : 'bg-[#0E1420] border-[#1A2232] hover:bg-[#121824]'
              }`}
            >
              <div className="font-semibold text-xs text-[#F8FAFC] flex items-center justify-between mb-1">
                <span>{preset.name}</span>
                {activePreset === preset.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BFA161]" />
                )}
              </div>
              <div className="text-[10px] text-[#94A3B8]">
                {preset.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Interactive Sandbox Controls (Always active or customizable) */}
        <div className="p-5 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
            <div className="text-xs font-mono font-bold uppercase text-[#BFA161] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#BFA161]" />
              Multi-Variable Scenario Levers (Real-Time Inputs)
            </div>
            {isCustom && (
              <button
                onClick={() => {
                  setBrentDelta(0);
                  setEthaneDelta(0);
                  setNaphthaDelta(0);
                  setDelayMonths(0);
                  setFxRate(84.0);
                  setUtilizationRate(92);
                }}
                className="text-[10px] font-mono text-[#94A3B8] hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset Controls
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
            {/* Lever 1: Brent */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94A3B8]">Brent Oil Shock</span>
                <span className="font-mono font-bold text-[#F8FAFC]">
                  {effBrentDelta >= 0 ? '+' : ''}{effBrentDelta}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                step="5"
                disabled={!isCustom}
                value={effBrentDelta}
                onChange={(e) => setBrentDelta(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#1E2738] rounded appearance-none cursor-pointer accent-[#BFA161]"
              />
            </div>

            {/* Lever 2: Ethane */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94A3B8]">US Ethane FOB</span>
                <span className="font-mono font-bold text-[#F8FAFC]">
                  {effEthaneDelta >= 0 ? '+' : ''}{effEthaneDelta}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                step="5"
                disabled={!isCustom}
                value={effEthaneDelta}
                onChange={(e) => setEthaneDelta(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#1E2738] rounded appearance-none cursor-pointer accent-[#BFA161]"
              />
            </div>

            {/* Lever 3: Naphtha */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94A3B8]">Asian Naphtha</span>
                <span className="font-mono font-bold text-[#F8FAFC]">
                  {effNaphthaDelta >= 0 ? '+' : ''}{effNaphthaDelta}%
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="50"
                step="5"
                disabled={!isCustom}
                value={effNaphthaDelta}
                onChange={(e) => setNaphthaDelta(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#1E2738] rounded appearance-none cursor-pointer accent-[#BFA161]"
              />
            </div>

            {/* Lever 4: Delay */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94A3B8]">Startup Delay</span>
                <span className="font-mono font-bold text-[#F8FAFC]">
                  +{effDelayMonths} Months
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                disabled={!isCustom}
                value={effDelayMonths}
                onChange={(e) => setDelayMonths(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#1E2738] rounded appearance-none cursor-pointer accent-[#BFA161]"
              />
            </div>

            {/* Lever 5: FX */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94A3B8]">USD / INR FX</span>
                <span className="font-mono font-bold text-[#F8FAFC]">
                  {effFxRate.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="80"
                max="90"
                step="0.5"
                disabled={!isCustom}
                value={effFxRate}
                onChange={(e) => setFxRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#1E2738] rounded appearance-none cursor-pointer accent-[#BFA161]"
              />
            </div>

            {/* Lever 6: Utilization */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#94A3B8]">Plant Operating Rate</span>
                <span className="font-mono font-bold text-[#F8FAFC]">
                  {effUtilization}%
                </span>
              </div>
              <input
                type="range"
                min="75"
                max="100"
                step="1"
                disabled={!isCustom}
                value={effUtilization}
                onChange={(e) => setUtilizationRate(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#1E2738] rounded appearance-none cursor-pointer accent-[#BFA161]"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Financial Outputs Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Projected Annual EBITDA</span>
            <div className="text-xl font-bold font-tabular text-[#F8FAFC]">
              ₹{calculatedEBITDA.toLocaleString()} Cr
            </div>
            <div className={`text-[10px] font-mono ${totalEbitdaDelta >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
              {totalEbitdaDelta >= 0 ? '+' : ''}₹{totalEbitdaDelta.toLocaleString()} Cr vs Base Plan
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Project Net Present Value (NPV)</span>
            <div className="text-xl font-bold font-tabular text-[#F8FAFC]">
              ${calculatedNPV.toLocaleString()}M USD
            </div>
            <div className={`text-[10px] font-mono ${calculatedNPV - 2840 >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
              {calculatedNPV - 2840 >= 0 ? '+' : ''}${calculatedNPV - 2840}M USD Delta
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Project Internal Rate of Return</span>
            <div className="text-xl font-bold font-tabular text-[#BFA161]">
              {calculatedIRR}% IRR
            </div>
            <div className="text-[10px] text-[#94A3B8]">WACC Benchmark: 10.5%</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Payback Horizon</span>
            <div className="text-xl font-bold font-tabular text-[#38BDF8]">
              {calculatedPayback} Years
            </div>
            <div className="text-[10px] text-[#94A3B8]">From full Dahej commissioning</div>
          </div>
        </div>

        {/* EBITDA Impact Decomposition Waterfall Chart */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#BFA161] font-bold">
                Financial Propagation Waterfall
              </span>
              <h2 className="text-base font-bold text-[#F8FAFC]">
                EBITDA Variance Decomposition (INR Crores)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              Deterministic Cash Flow Model
            </span>
          </div>

          <div className="h-80 w-full">
            <EChartsClient option={waterfallOption} height="100%" />
          </div>
        </div>

        {/* Nested Scenario Tree (Section 18) */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#D4BA7B]">
              <GitFork className="w-4 h-4 text-[#BFA161]" />
              Nested Decision & Scenario Tree
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              Branch Cascades
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] font-mono text-xs text-[#CBD5E1] space-y-2">
            <div className="font-bold text-[#F8FAFC]">BASE CASE: ₹58,400 Cr EBITDA ($2,840M NPV)</div>
            <div className="pl-4 border-l border-[#1E2738] space-y-1 text-[11px]">
              <div>├── <span className="text-[#10B981]">Oil +10%</span>: +₹1,800 Cr EBITDA</div>
              <div>├── <span className="text-[#10B981]">Oil +20%</span>: +₹3,600 Cr EBITDA (widens ethane competitive delta)</div>
              <div>├── <span className="text-[#10B981]">Ethane -10%</span>: +₹2,400 Cr EBITDA (Permian debottlenecking)</div>
              <div>├── <span className="text-[#F43F5E]">Ethane +20%</span>: -₹4,800 Cr EBITDA (US Gulf export pipeline constraints)</div>
              <div>├── <span className="text-[#38BDF8]">FX +5% (USD/INR 88.2)</span>: +₹1,900 Cr gross dollar export translation</div>
              <div>├── <span className="text-[#F59E0B]">Project Delay 1 Month</span>: -₹260 Cr EBITDA, -$54M NPV</div>
              <div>├── <span className="text-[#F43F5E]">Project Delay 3 Months</span>: -₹780 Cr EBITDA, -$162M NPV</div>
              <div>└── <span className="text-[#F43F5E]">Supply Disruption (US Gulf Hurricane)</span>: -₹1,200 Cr temporary run curtailment</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
