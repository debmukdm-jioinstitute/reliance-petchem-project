'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import EChartsClient from '@/components/charts/EChartsClient';
import {
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Minus,
  ChevronRight,
} from 'lucide-react';
import { MARKET_COMMODITIES } from '@/data/knowledgeStore';
import { CardSpotlight, DottedGrid, MagnetTabs } from '@/components/obsidian';

export default function MarketIntelligencePage() {
  const [activeTab, setActiveTab] = useState<string>('OVERVIEW');
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('comm-ethylene');

  const selectedCommodity =
    MARKET_COMMODITIES.find((c) => c.id === selectedCommodityId) || MARKET_COMMODITIES[0];

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181B',
      borderColor: '#3F3F46',
      textStyle: { color: '#FAFAFA', fontSize: 13 },
      formatter: (params: any) => {
        const item = params[0];
        return `<div class="font-mono text-sm">
          <div class="text-neutral-400">${item.name}</div>
          <div class="text-[#D4BA7B] font-bold">$${item.value} ${selectedCommodity.unit}</div>
        </div>`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: selectedCommodity.history.map((h) => h.date),
      axisLine: { lineStyle: { color: '#71717A' } },
      axisLabel: { color: '#71717A', fontSize: 12, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: 'rgba(113, 113, 122, 0.2)', type: 'dashed' } },
      axisLabel: { color: '#71717A', fontSize: 12, fontFamily: 'monospace' }
    },
    series: [
      {
        name: selectedCommodity.name,
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbolSize: 7,
        itemStyle: { color: '#BFA161' },
        lineStyle: { width: 3, color: '#BFA161' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(191, 161, 97, 0.4)' },
              { offset: 1, color: 'rgba(191, 161, 97, 0.0)' }
            ]
          }
        },
        data: selectedCommodity.history.map((h) => h.price)
      }
    ]
  };

  const navTabs = [
    { id: 'OVERVIEW', label: 'All Prices' },
    { id: 'CRACKER', label: 'Cracker Flow' },
    { id: 'FEEDSTOCKS', label: 'Feedstocks' },
    { id: 'PRODUCTS', label: 'Products' },
    { id: 'ENERGY', label: 'Energy & Crude' },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <DottedGrid className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121217]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4BA7B] flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  Live Commodity Desk
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Petrochemicals & Cracker Spreads
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Market Prices & Margins
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
                Real-time price feeds for Ethylene, Propylene, Naphtha, US Ethane, Brent crude, and crack margins.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Market Feed Active</span>
            </div>
          </div>
        </DottedGrid>

        {/* Magnet Tabs Navigation */}
        <div className="overflow-x-auto pb-1">
          <MagnetTabs
            tabs={navTabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id)}
          />
        </div>

        {/* Cracker Value Chain Flow */}
        {activeTab === 'CRACKER' && (
          <CardSpotlight className="p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  Cracker Process Flow: From Feedstock to Polymer
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Chemical conversion through steam cracker coils to primary olefins and polymers.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#8F7640] dark:text-[#D4BA7B] bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Mass Balance
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Step 1: Feedstocks */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  1. Raw Feedstocks
                </span>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">US Ethane (C2H6)</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">$145/t (FOB)</div>
                    <div className="text-xs text-neutral-500 mt-0.5">~80% Ethylene Yield</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">Naphtha (C5-C12)</div>
                    <div className="text-xs text-rose-600 dark:text-rose-400 font-mono font-bold">$685/t (CFR)</div>
                    <div className="text-xs text-neutral-500 mt-0.5">~30% Ethylene Yield</div>
                  </div>
                </div>
              </div>

              {/* Step 2: Cracker Furnace */}
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/30 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4BA7B]">
                  2. Steam Cracker
                </span>
                <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-1">
                  <div className="font-bold text-sm text-neutral-900 dark:text-white">Furnace Coils</div>
                  <div className="text-xs text-neutral-600 dark:text-neutral-400">820°C - 860°C Pyrolysis</div>
                  <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Sub-day switching</div>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Real-time optimizer adjusts feed ratio between ethane and naphtha depending on spot economics.
                </p>
              </div>

              {/* Step 3: Olefins */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  3. Primary Products
                </span>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">Ethylene</div>
                    <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">$840/t</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">Propylene</div>
                    <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">$790/t</div>
                  </div>
                </div>
              </div>

              {/* Step 4: Downstream */}
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  4. Polymers & Chemicals
                </span>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold text-neutral-800 dark:text-neutral-200">
                    Polyethylene (HDPE / LLDPE)
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold text-neutral-800 dark:text-neutral-200">
                    Polypropylene (PP)
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-semibold text-neutral-800 dark:text-neutral-200">
                    Polyester Chain (MEG & PTA)
                  </div>
                </div>
              </div>
            </div>
          </CardSpotlight>
        )}

        {/* Selected Commodity Interactive Chart Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CardSpotlight className="lg:col-span-2 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  6-Month Price Trend
                </span>
                <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                  {selectedCommodity.name} ({selectedCommodity.symbol})
                </h3>
              </div>

              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">
                  ${selectedCommodity.currentPrice.toLocaleString()}
                  <span className="text-sm font-semibold text-neutral-500 ml-1">
                    {selectedCommodity.unit}
                  </span>
                </div>
                <div className={`text-sm font-mono font-bold ${selectedCommodity.change1D >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {selectedCommodity.change1D >= 0 ? '+' : ''}{selectedCommodity.change1D}% Today
                </div>
              </div>
            </div>

            {/* ECharts Instance */}
            <div className="h-72 w-full">
              <EChartsClient option={chartOption} height="100%" />
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-200 dark:border-neutral-800 font-mono">
              <span>Source: {selectedCommodity.source}</span>
              <span>Updated: {selectedCommodity.timestamp}</span>
            </div>
          </CardSpotlight>

          {/* Commodity Details Card */}
          <CardSpotlight className="p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Price Breakdown & Returns
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">Commodity:</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{selectedCommodity.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">Category:</span>
                  <span className="font-mono font-semibold text-amber-700 dark:text-[#D4BA7B]">{selectedCommodity.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">1-Week Change:</span>
                  <span className={`font-mono font-bold ${selectedCommodity.change1W >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {selectedCommodity.change1W >= 0 ? '+' : ''}{selectedCommodity.change1W}%
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">1-Month Change:</span>
                  <span className={`font-mono font-bold ${selectedCommodity.change1M >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {selectedCommodity.change1M >= 0 ? '+' : ''}{selectedCommodity.change1M}%
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-neutral-500">1-Year Change:</span>
                  <span className={`font-mono font-extrabold ${selectedCommodity.change1Y >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {selectedCommodity.change1Y >= 0 ? '+' : ''}{selectedCommodity.change1Y}%
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/forecasts"
              className="w-full py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-sm font-bold text-neutral-900 dark:text-[#D4BA7B] text-center flex items-center justify-center gap-2 transition-colors"
            >
              <span>View AI Forecasts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </CardSpotlight>
        </div>

        {/* Dense Table of All Commodities */}
        <CardSpotlight className="overflow-hidden">
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              All Petchem & Feedstock Prices
            </h2>
            <span className="text-xs text-neutral-500 font-mono">
              Click any row to chart
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-700 dark:text-neutral-300">
              <thead className="bg-neutral-100/70 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 uppercase font-mono text-xs tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-3 px-5">Symbol</th>
                  <th className="py-3 px-5">Commodity</th>
                  <th className="py-3 px-5">Price</th>
                  <th className="py-3 px-5">1D Change</th>
                  <th className="py-3 px-5">1W Change</th>
                  <th className="py-3 px-5">1M Change</th>
                  <th className="py-3 px-5">1Y Change</th>
                  <th className="py-3 px-5">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {MARKET_COMMODITIES.map((c) => {
                  const isSelected = c.id === selectedCommodity.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCommodityId(c.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-500/10 dark:bg-amber-500/10'
                          : 'hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60'
                      }`}
                    >
                      <td className="py-3.5 px-5 font-mono font-bold text-neutral-900 dark:text-white">
                        {c.symbol}
                      </td>
                      <td className="py-3.5 px-5 font-semibold text-neutral-800 dark:text-neutral-200">
                        {c.name}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-extrabold text-neutral-900 dark:text-white">
                        {c.currency === 'USD' ? '$' : '₹'}{c.currentPrice.toLocaleString()} {c.unit}
                      </td>
                      <td className={`py-3.5 px-5 font-mono font-semibold ${c.change1D >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {c.change1D >= 0 ? '+' : ''}{c.change1D}%
                      </td>
                      <td className={`py-3.5 px-5 font-mono font-semibold ${c.change1W >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {c.change1W >= 0 ? '+' : ''}{c.change1W}%
                      </td>
                      <td className={`py-3.5 px-5 font-mono font-semibold ${c.change1M >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {c.change1M >= 0 ? '+' : ''}{c.change1M}%
                      </td>
                      <td className={`py-3.5 px-5 font-mono font-bold ${c.change1Y >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {c.change1Y >= 0 ? '+' : ''}{c.change1Y}%
                      </td>
                      <td className="py-3.5 px-5 font-mono text-xs text-neutral-500">
                        {c.source}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardSpotlight>

      </div>
    </AppShell>
  );
}
