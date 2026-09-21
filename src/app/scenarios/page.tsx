'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import EChartsClient from '@/components/charts/EChartsClient';
import {
  SlidersHorizontal,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { SCENARIO_DEFINITIONS } from '@/data/knowledgeStore';
import { CardSpotlight, DottedGrid, ArrowFillButton, MagnetTabs } from '@/components/obsidian';

export default function ScenarioEnginePage() {
  const [activePreset, setActivePreset] = useState<string>('base-case');

  // Custom interactive sliders state
  const [brentDelta, setBrentDelta] = useState<number>(0);
  const [ethaneDelta, setEthaneDelta] = useState<number>(0);
  const [naphthaDelta, setNaphthaDelta] = useState<number>(0);
  const [delayMonths, setDelayMonths] = useState<number>(0);
  const [fxRate, setFxRate] = useState<number>(84.0);
  const [utilizationRate, setUtilizationRate] = useState<number>(92);

  const activeScenario = SCENARIO_DEFINITIONS[activePreset] || SCENARIO_DEFINITIONS['base-case'];

  const isCustom = activePreset === 'custom';

  const effBrentDelta = isCustom ? brentDelta : activeScenario.inputs.brentOilDeltaPct;
  const effEthaneDelta = isCustom ? ethaneDelta : activeScenario.inputs.ethanePriceDeltaPct;
  const effNaphthaDelta = isCustom ? naphthaDelta : activeScenario.inputs.naphthaPriceDeltaPct;
  const effDelayMonths = isCustom ? delayMonths : activeScenario.inputs.projectStartupDelayMonths;
  const effFxRate = isCustom ? fxRate : activeScenario.inputs.fxUsdInr;
  const effUtilization = isCustom ? utilizationRate : activeScenario.inputs.plantUtilizationPct;

  // Formula calculations
  const ebitdaFromEthane = -(effEthaneDelta * 240);
  const ebitdaFromNaphtha = -(effNaphthaDelta * 110);
  const ebitdaFromBrentOlefins = effBrentDelta * 180;
  const ebitdaFromUtilization = (effUtilization - 92) * 620;
  const ebitdaFromDelay = -(effDelayMonths * 260);
  const ebitdaFromFx = (effFxRate - 84.0) * 450;

  const totalEbitdaDelta = ebitdaFromEthane + ebitdaFromNaphtha + ebitdaFromBrentOlefins + ebitdaFromUtilization + ebitdaFromDelay + ebitdaFromFx;
  const calculatedEBITDA = 58400 + totalEbitdaDelta;

  const calculatedNPV = Math.round(2840 + (totalEbitdaDelta / 84) * 5.2 - effDelayMonths * 54);
  const calculatedIRR = +(19.4 + (totalEbitdaDelta / 58400) * 8.5 - effDelayMonths * 0.65).toFixed(1);
  const calculatedPayback = +(4.8 - (totalEbitdaDelta / 58400) * 1.8 + effDelayMonths * 0.45).toFixed(1);

  const waterfallLabels = [
    'Base Plan EBITDA',
    'Ethane Shift',
    'Naphtha Shift',
    'Brent Crude Uplift',
    'Plant Run Rate',
    'Startup Delay',
    'Scenario EBITDA'
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
      backgroundColor: '#18181B',
      borderColor: '#3F3F46',
      textStyle: { color: '#FAFAFA', fontSize: 13 },
      formatter: (params: any) => {
        const p = params[0];
        const val = waterfallData[p.dataIndex];
        return `<div class="font-mono text-sm">
          <div class="text-neutral-400">${p.name}</div>
          <div class="text-white font-bold">${val >= 0 ? '+' : ''}₹${val.toLocaleString()} Cr</div>
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
      axisLine: { lineStyle: { color: '#71717A' } },
      axisLabel: {
        color: '#71717A',
        fontSize: 11,
        fontFamily: 'monospace',
        interval: 0,
        rotate: 15
      }
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: 'rgba(113, 113, 122, 0.2)', type: 'dashed' } },
      axisLabel: { color: '#71717A', fontSize: 12, fontFamily: 'monospace' }
    },
    series: [
      {
        name: 'EBITDA Impact',
        type: 'bar',
        barWidth: '42%',
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

  const presetTabs = [
    { id: 'base-case', label: 'Base Plan' },
    { id: 'upside-case', label: 'Ethane Surge (Upside)' },
    { id: 'downside-case', label: 'Oversupply Shock (Downside)' },
    { id: 'custom', label: 'Custom Sandbox' }
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <DottedGrid className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121217]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4BA7B] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4" />
                  Dual Simulation Engine
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  RIL Asset & Global Oversupply Stress Testing
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Scenario Simulation & Impact Waterfall
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
                Simulate price shocks across Brent crude, ethane, naphtha, plant run rates, and startup delays.
              </p>
            </div>

            <Link href="/scenarios/monte-carlo">
              <ArrowFillButton variant="primary">
                10,000-Run Monte Carlo
              </ArrowFillButton>
            </Link>
          </div>
        </DottedGrid>

        {/* Preset Selector with MagnetTabs */}
        <div className="overflow-x-auto pb-1">
          <MagnetTabs
            tabs={presetTabs}
            activeTab={activePreset}
            onChange={(id) => setActivePreset(id)}
          />
        </div>

        {/* 4 Large KPI Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <CardSpotlight className="p-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Scenario EBITDA
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-neutral-900 dark:text-white">
              ₹{calculatedEBITDA.toLocaleString()}
              <span className="text-sm font-semibold text-neutral-500 ml-1">Cr</span>
            </div>
            <div className={`text-sm font-mono font-bold ${totalEbitdaDelta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {totalEbitdaDelta >= 0 ? '+' : ''}₹{totalEbitdaDelta.toLocaleString()} Cr vs Base
            </div>
          </CardSpotlight>

          <CardSpotlight className="p-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Project NPV (10.5%)
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-neutral-900 dark:text-white">
              ${calculatedNPV.toLocaleString()}
              <span className="text-sm font-semibold text-neutral-500 ml-1">M USD</span>
            </div>
            <div className="text-sm font-mono font-semibold text-neutral-600 dark:text-neutral-400">
              Discounted Cash Flows
            </div>
          </CardSpotlight>

          <CardSpotlight className="p-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Project IRR
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-700 dark:text-[#D4BA7B]">
              {calculatedIRR}%
            </div>
            <div className="text-sm font-mono font-semibold text-neutral-600 dark:text-neutral-400">
              Hurdle Rate: 12.0%
            </div>
          </CardSpotlight>

          <CardSpotlight className="p-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Capital Payback
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-neutral-900 dark:text-white">
              {calculatedPayback}
              <span className="text-sm font-semibold text-neutral-500 ml-1">Years</span>
            </div>
            <div className="text-sm font-mono font-semibold text-neutral-600 dark:text-neutral-400">
              Target: &lt; 5.0 Years
            </div>
          </CardSpotlight>
        </div>

        {/* Main Chart + Slider Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Waterfall Chart */}
          <CardSpotlight className="lg:col-span-2 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  EBITDA Waterfall Impact Breakdown
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Decomposition of feedstock, energy, operational run-rate, and schedule deltas.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#8F7640] dark:text-[#D4BA7B]">
                ₹ in Crores
              </span>
            </div>

            <div className="h-80 w-full">
              <EChartsClient option={waterfallOption} height="100%" />
            </div>
          </CardSpotlight>

          {/* Interactive Sliders */}
          <CardSpotlight className="p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Live Scenario Controls
              </h3>
              <button
                onClick={() => {
                  setBrentDelta(0);
                  setEthaneDelta(0);
                  setNaphthaDelta(0);
                  setDelayMonths(0);
                  setFxRate(84.0);
                  setUtilizationRate(92);
                }}
                className="text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Brent Oil Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-700 dark:text-neutral-300">Brent Oil Shift:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-[#D4BA7B]">
                    {effBrentDelta >= 0 ? '+' : ''}{effBrentDelta}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="40"
                  step="5"
                  value={effBrentDelta}
                  onChange={(e) => {
                    setActivePreset('custom');
                    setBrentDelta(Number(e.target.value));
                  }}
                  className="w-full accent-[#BFA161] cursor-pointer"
                />
              </div>

              {/* Ethane Price Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-700 dark:text-neutral-300">Ethane Price Shift:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-[#D4BA7B]">
                    {effEthaneDelta >= 0 ? '+' : ''}{effEthaneDelta}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-40"
                  max="40"
                  step="5"
                  value={effEthaneDelta}
                  onChange={(e) => {
                    setActivePreset('custom');
                    setEthaneDelta(Number(e.target.value));
                  }}
                  className="w-full accent-[#BFA161] cursor-pointer"
                />
              </div>

              {/* Naphtha Price Slider */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-700 dark:text-neutral-300">Naphtha Price Shift:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-[#D4BA7B]">
                    {effNaphthaDelta >= 0 ? '+' : ''}{effNaphthaDelta}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="50"
                  step="5"
                  value={effNaphthaDelta}
                  onChange={(e) => {
                    setActivePreset('custom');
                    setNaphthaDelta(Number(e.target.value));
                  }}
                  className="w-full accent-[#BFA161] cursor-pointer"
                />
              </div>

              {/* Plant Utilization */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-700 dark:text-neutral-300">Plant Run Rate:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-[#D4BA7B]">
                    {effUtilization}%
                  </span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="98"
                  step="1"
                  value={effUtilization}
                  onChange={(e) => {
                    setActivePreset('custom');
                    setUtilizationRate(Number(e.target.value));
                  }}
                  className="w-full accent-[#BFA161] cursor-pointer"
                />
              </div>

              {/* Startup Delay */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-neutral-700 dark:text-neutral-300">Startup Delay:</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-[#D4BA7B]">
                    +{effDelayMonths} Months
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={effDelayMonths}
                  onChange={(e) => {
                    setActivePreset('custom');
                    setDelayMonths(Number(e.target.value));
                  }}
                  className="w-full accent-[#BFA161] cursor-pointer"
                />
              </div>
            </div>
          </CardSpotlight>
        </div>

      </div>
    </AppShell>
  );
}
