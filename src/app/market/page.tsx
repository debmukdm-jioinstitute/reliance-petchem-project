'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import EChartsClient from '@/components/charts/EChartsClient';
import {
  TrendingUp,
  Activity,
  ArrowRight,
  RefreshCw,
  Rss,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { DottedGrid, MagnetTabs } from '@/components/obsidian';
import { GlassCard3D, GlassMetricBox } from '@/components/glass';
import PriceInfoIcon from '@/components/common/PriceInfoIcon';
import { useMarket } from '@/context/MarketContext';
import { MarketCommodity } from '@/data/types';

function MarketContent() {
  const searchParams = useSearchParams();
  const { commodities, spreads, rssHeadlines, lastSyncTime, isSyncing, refreshPrices } = useMarket();

  const [activeTab, setActiveTab] = useState<string>('OVERVIEW');
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('comm-ethylene');

  // Deep linking for ?tab=products&item=ethylene
  useEffect(() => {
    const paramTab = searchParams.get('tab');
    const paramItem = searchParams.get('item');

    if (paramTab) {
      const upper = paramTab.toUpperCase();
      if (['OVERVIEW', 'CRACKER', 'FEEDSTOCKS', 'PRODUCTS', 'ENERGY'].includes(upper)) {
        setActiveTab(upper);
      }
    }

    if (paramItem) {
      const found = commodities.find(
        (c) =>
          c.id === paramItem ||
          c.id === `comm-${paramItem}` ||
          c.symbol.toLowerCase() === paramItem.toLowerCase() ||
          c.name.toLowerCase().includes(paramItem.toLowerCase())
      );
      if (found) {
        setSelectedCommodityId(found.id);
      }
    }
  }, [searchParams, commodities]);

  const selectedCommodity: MarketCommodity =
    commodities.find((c) => c.id === selectedCommodityId) || commodities[0];

  // Filter commodities based on active tab
  const filteredCommodities = commodities.filter((c) => {
    if (activeTab === 'PRODUCTS') return ['comm-ethylene', 'comm-propylene', 'comm-hdpe', 'comm-pp', 'comm-meg'].includes(c.id);
    if (activeTab === 'FEEDSTOCKS') return ['comm-ethane', 'comm-naphtha', 'comm-propane'].includes(c.id);
    if (activeTab === 'ENERGY') return ['comm-brent', 'comm-natgas', 'comm-fx-usdinr'].includes(c.id);
    return true; // OVERVIEW and CRACKER show all
  });

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181B',
      borderColor: '#3F3F46',
      textStyle: { color: '#FAFAFA', fontSize: 14 },
      formatter: (params: any) => {
        const item = params[0];
        return `<div class="font-mono text-sm">
          <div class="text-neutral-400">${item.name}</div>
          <div class="text-[#D4BA7B] font-bold">${selectedCommodity.currency === 'USD' ? '$' : '₹'}${item.value} ${selectedCommodity.unit}</div>
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
      axisLabel: { color: '#71717A', fontSize: 14, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: 'rgba(113, 113, 122, 0.2)', type: 'dashed' } },
      axisLabel: { color: '#71717A', fontSize: 14, fontFamily: 'monospace' }
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
    { id: 'OVERVIEW', label: 'All Commodities' },
    { id: 'PRODUCTS', label: 'Products (Ethylene/Propylene)' },
    { id: 'FEEDSTOCKS', label: 'Feedstocks (Ethane/Naphtha)' },
    { id: 'CRACKER', label: 'Cracker Flow' },
    { id: 'ENERGY', label: 'Energy & Macro' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <GlassCard3D className="p-8">
        <DottedGrid>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4BA7B] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                  Live Real-Time Market Desk
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Petrochemicals & Cracker Spreads
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Market Prices & Margins
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
                Real-time price feeds for Ethylene, Propylene, Naphtha, US Ethane, Brent crude, and crack margins.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Sync Button */}
              <button
                onClick={() => refreshPrices()}
                disabled={isSyncing}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-[#BFA161] dark:text-neutral-950 text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Fetching Quotes...' : 'Sync Prices Now'}</span>
              </button>

              <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{lastSyncTime}</span>
              </div>
            </div>
          </div>
        </DottedGrid>
      </GlassCard3D>

      {/* Live RSS News & Spread Bar */}
      <GlassCard3D className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8F7640] dark:text-[#D4BA7B] shrink-0">
            <Rss className="w-4 h-4 text-amber-600 dark:text-[#BFA161]" />
            <span>Petchem News Wire:</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <a
              href={rssHeadlines[0]?.link || 'https://www.indianchemicalnews.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-[#BFA161] truncate block flex items-center gap-1.5 group"
            >
              <span className="truncate">{rssHeadlines[0]?.title}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0" />
            </a>
          </div>
        </div>

        {/* Live Crack Spreads */}
        <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-neutral-200/80 dark:border-white/10 md:pl-5">
          <div className="text-xs">
            <span className="text-neutral-500 font-medium">Eth-Naphtha:</span>{' '}
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {spreads.ethyleneNaphtha >= 0 ? '+' : ''}${spreads.ethyleneNaphtha}/t
            </span>
          </div>
          <div className="text-xs">
            <span className="text-neutral-500 font-medium">Eth-Ethane:</span>{' '}
            <span className="font-mono font-extrabold text-[#8F7640] dark:text-[#D4BA7B]">
              {spreads.ethyleneEthane >= 0 ? '+' : ''}${spreads.ethyleneEthane}/t
            </span>
          </div>
        </div>
      </GlassCard3D>

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
        <GlassCard3D className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-white/10">
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
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                1. Raw Feedstocks
              </span>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white dark:bg-white/[0.08] border border-neutral-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">US Ethane (C2H6)</div>
                    <PriceInfoIcon commodityId="comm-ethane" currentPrice={157} unit="USD/t" size="xs" />
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-0.5">$157/t (FOB)</div>
                  <div className="text-xs text-neutral-500 mt-0.5">~80% Ethylene Yield</div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-white/[0.08] border border-neutral-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">Naphtha (C5-C12)</div>
                    <PriceInfoIcon commodityId="comm-naphtha" currentPrice={816} unit="USD/t" size="xs" />
                  </div>
                  <div className="text-xs text-rose-600 dark:text-rose-400 font-mono font-bold mt-0.5">$816/t (CFR)</div>
                  <div className="text-xs text-neutral-500 mt-0.5">~30% Ethylene Yield</div>
                </div>
              </div>
            </div>

            {/* Step 2: Cracker Furnace */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4BA7B]">
                2. Steam Cracker
              </span>
              <div className="p-3 rounded-xl bg-white dark:bg-white/[0.08] border border-neutral-200 dark:border-white/10 space-y-1">
                <div className="font-bold text-sm text-neutral-900 dark:text-white">Furnace Coils</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">820°C - 860°C Pyrolysis</div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Sub-day switching</div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Real-time optimizer adjusts feed ratio between ethane and naphtha depending on spot economics.
              </p>
            </div>

            {/* Step 3: Olefins */}
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                3. Primary Products
              </span>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white dark:bg-white/[0.08] border border-neutral-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">Ethylene</div>
                    <PriceInfoIcon commodityId="comm-ethylene" currentPrice={886} unit="USD/t" size="xs" />
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">$886/t</div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-white/[0.08] border border-neutral-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white">Propylene</div>
                    <PriceInfoIcon commodityId="comm-propylene" currentPrice={833} unit="USD/t" size="xs" />
                  </div>
                  <div className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 mt-0.5">$833/t</div>
                </div>
              </div>
            </div>

            {/* Step 4: Downstream */}
            <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-white/[0.04] border border-neutral-200 dark:border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                4. Polymers & Chemicals
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white dark:bg-white/[0.08] border border-neutral-200 dark:border-white/10 font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                  <span>Polyethylene (HDPE / LLDPE)</span>
                  <PriceInfoIcon commodityId="comm-hdpe" size="xs" />
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-white/[0.08] border border-neutral-200 dark:border-white/10 font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                  <span>Polypropylene (PP)</span>
                  <PriceInfoIcon commodityId="comm-pp" size="xs" />
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-white/[0.08] border border-neutral-200 dark:border-white/10 font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
                  <span>Polyester Chain (MEG & PTA)</span>
                  <PriceInfoIcon commodityId="comm-meg" size="xs" />
                </div>
              </div>
            </div>
          </div>
        </GlassCard3D>
      )}

      {/* Selected Commodity Interactive Chart Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard3D className="lg:col-span-2 p-6 md:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-neutral-200/80 dark:border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                6-Month Price Trend • Live Synchronized
              </span>
              <div className="flex items-center gap-2.5 mt-0.5">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                  {selectedCommodity.name} ({selectedCommodity.symbol})
                </h3>
                <PriceInfoIcon
                  commodityId={selectedCommodity.id}
                  currentPrice={selectedCommodity.currentPrice}
                  unit={selectedCommodity.unit}
                  change1D={selectedCommodity.change1D}
                  size="md"
                />
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">
                <span>
                  {selectedCommodity.currency === 'USD' ? '$' : '₹'}{selectedCommodity.currentPrice.toLocaleString()}
                  <span className="text-sm font-semibold text-neutral-500 ml-1">
                    {selectedCommodity.unit}
                  </span>
                </span>
                <PriceInfoIcon
                  commodityId={selectedCommodity.id}
                  currentPrice={selectedCommodity.currentPrice}
                  unit={selectedCommodity.unit}
                  change1D={selectedCommodity.change1D}
                  size="sm"
                />
              </div>
              <div className={`text-sm font-mono font-bold ${selectedCommodity.change1D >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {selectedCommodity.change1D >= 0 ? '+' : ''}{selectedCommodity.change1D}% Today
              </div>
            </div>
          </div>

          {/* ECharts Instance */}
          <div className="h-76 w-full">
            <EChartsClient option={chartOption} height="100%" />
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-200/80 dark:border-white/10 font-mono">
            <div className="flex items-center gap-2">
              <span>Source: {selectedCommodity.source}</span>
              <PriceInfoIcon
                commodityId={selectedCommodity.id}
                size="xs"
              />
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{selectedCommodity.timestamp}</span>
          </div>
        </GlassCard3D>

        {/* Commodity Details Card */}
        <GlassCard3D className="p-6 md:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Price Breakdown & Returns
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-neutral-200/60 dark:border-white/10">
                <span className="text-neutral-500">Commodity:</span>
                <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-white">
                  <span>{selectedCommodity.name}</span>
                  <PriceInfoIcon
                    commodityId={selectedCommodity.id}
                    currentPrice={selectedCommodity.currentPrice}
                    unit={selectedCommodity.unit}
                    change1D={selectedCommodity.change1D}
                    size="xs"
                  />
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200/60 dark:border-white/10">
                <span className="text-neutral-500">Category:</span>
                <span className="font-mono font-semibold text-amber-700 dark:text-[#D4BA7B]">{selectedCommodity.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200/60 dark:border-white/10">
                <span className="text-neutral-500">1-Day Change:</span>
                <span className={`font-mono font-bold ${selectedCommodity.change1D >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {selectedCommodity.change1D >= 0 ? '+' : ''}{selectedCommodity.change1D}%
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200/60 dark:border-white/10">
                <span className="text-neutral-500">1-Week Change:</span>
                <span className={`font-mono font-bold ${selectedCommodity.change1W >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {selectedCommodity.change1W >= 0 ? '+' : ''}{selectedCommodity.change1W}%
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200/60 dark:border-white/10">
                <span className="text-neutral-500">1-Month Change:</span>
                <span className={`font-mono font-bold ${selectedCommodity.change1M >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {selectedCommodity.change1M >= 0 ? '+' : ''}{selectedCommodity.change1M}%
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-200/60 dark:border-white/10">
                <span className="text-neutral-500">1-Year Change:</span>
                <span className={`font-mono font-extrabold ${selectedCommodity.change1Y >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {selectedCommodity.change1Y >= 0 ? '+' : ''}{selectedCommodity.change1Y}%
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/forecasts"
            className="w-full py-3 rounded-xl bg-neutral-900 text-white dark:bg-[#BFA161] dark:text-neutral-950 text-sm font-bold text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span>View TimesFM AI Forecast</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </GlassCard3D>
      </div>

      {/* Dense Table of Filtered Commodities */}
      <GlassCard3D className="overflow-hidden">
        <div className="p-5 border-b border-neutral-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-neutral-900 dark:text-white">
              {activeTab === 'OVERVIEW'
                ? 'All Petrochemical & Feedstock Quotes'
                : `${activeTab} Quotes`}
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
              Live Feed
            </span>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            Click any row to chart
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-700 dark:text-neutral-300">
            <thead className="bg-neutral-100/70 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 uppercase font-mono text-xs tracking-wider border-b border-neutral-200/80 dark:border-white/10">
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
            <tbody className="divide-y divide-neutral-200/60 dark:divide-white/[0.06]">
              {filteredCommodities.map((c) => {
                const isSelected = c.id === selectedCommodity.id;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCommodityId(c.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-500/15 dark:bg-amber-500/15 font-bold'
                        : 'hover:bg-white/60 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <td className="py-3.5 px-5 font-mono font-bold text-neutral-900 dark:text-white">
                      {c.symbol}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-neutral-800 dark:text-neutral-200">
                      <div className="flex items-center gap-1.5">
                        <span>{c.name}</span>
                        <PriceInfoIcon
                          commodityId={c.id}
                          currentPrice={c.currentPrice}
                          unit={c.unit}
                          change1D={c.change1D}
                          size="xs"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono font-extrabold text-neutral-900 dark:text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{c.currency === 'USD' ? '$' : '₹'}{c.currentPrice.toLocaleString()} {c.unit}</span>
                        <PriceInfoIcon
                          commodityId={c.id}
                          currentPrice={c.currentPrice}
                          unit={c.unit}
                          change1D={c.change1D}
                          size="xs"
                        />
                      </div>
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
      </GlassCard3D>

    </div>
  );
}

export default function MarketIntelligencePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-sm text-neutral-500">Loading live petchem quotes...</div>}>
        <MarketContent />
      </Suspense>
    </AppShell>
  );
}
