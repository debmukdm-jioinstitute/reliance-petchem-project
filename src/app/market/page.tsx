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
  Layers,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  Flame,
  Globe2,
  DollarSign
} from 'lucide-react';
import { MARKET_COMMODITIES } from '@/data/knowledgeStore';

export default function MarketIntelligencePage() {
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'CRACKER' | 'FEEDSTOCKS' | 'PRODUCTS' | 'ENERGY' | 'FX' | 'SUPPLY_CHAIN'
  >('OVERVIEW');

  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('comm-ethylene');
  const selectedCommodity =
    MARKET_COMMODITIES.find((c) => c.id === selectedCommodityId) || MARKET_COMMODITIES[0];

  // ECharts Option for selected commodity historical trend
  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0E1420',
      borderColor: '#242F44',
      textStyle: { color: '#F8FAFC', fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0];
        return `<div class="font-mono text-xs">
          <div class="text-[#94A3B8]">${item.name}</div>
          <div class="text-[#BFA161] font-bold">$${item.value} ${selectedCommodity.unit}</div>
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
      axisLine: { lineStyle: { color: '#1E2738' } },
      axisLabel: { color: '#64748B', fontSize: 11, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: '#141C2B', type: 'dashed' } },
      axisLabel: { color: '#64748B', fontSize: 11, fontFamily: 'monospace' }
    },
    series: [
      {
        name: selectedCommodity.name,
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbolSize: 6,
        itemStyle: { color: '#BFA161' },
        lineStyle: { width: 2.5, color: '#BFA161' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(191, 161, 97, 0.35)' },
              { offset: 1, color: 'rgba(191, 161, 97, 0.0)' }
            ]
          }
        },
        data: selectedCommodity.history.map((h) => h.price)
      }
    ]
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#BFA161]" />
                Bloomberg Terminal Feed
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Petrochemical & Cracker Market Layer</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              MARKET INTELLIGENCE & CRACKER SPREADS
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Real-time tick feeds, multi-period trailing returns, cracker value chain flows, and feedstock conversion economics.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#D4BA7B] bg-[#0E1420] px-3.5 py-2 rounded-lg border border-[#1E2738]">
            <span className="live-indicator" />
            <span>Feed Integrity: 100% Calibrated</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center overflow-x-auto border-b border-[#1A2232] gap-1 text-xs no-scrollbar">
          {[
            { id: 'OVERVIEW', label: 'Overview' },
            { id: 'CRACKER', label: 'Cracker Value Chain' },
            { id: 'FEEDSTOCKS', label: 'Feedstocks (Ethane/Naphtha)' },
            { id: 'PRODUCTS', label: 'Products (Ethylene/Propylene)' },
            { id: 'ENERGY', label: 'Energy & Crude' },
            { id: 'FX', label: 'FX & Macro' },
            { id: 'SUPPLY_CHAIN', label: 'Supply Chain & Logistics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 font-medium whitespace-nowrap border-b-2 transition-all text-xs ${
                activeTab === tab.id
                  ? 'border-[#BFA161] text-[#D4BA7B] bg-[#121A2B]/60'
                  : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1420]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CRACKER VALUE CHAIN DIAGRAM (Interactive Flow) */}
        {activeTab === 'CRACKER' && (
          <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wide">
                  Integrated Cracker Value Chain Architecture
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  From primary gas/liquid feedstocks through steam cracking furnace coils to primary olefins and downstream polymers.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#BFA161] bg-[#BFA161]/10 px-2 py-1 rounded border border-[#BFA161]/30">
                Stoichiometric Mass Balance
              </span>
            </div>

            {/* Visual Value Chain Flow */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs">
              {/* Step 1: Feedstocks */}
              <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#38BDF8] block font-bold">
                  1. FEEDSTOCKS
                </span>
                <div className="space-y-1.5">
                  <div className="p-2 rounded bg-[#121824] border border-[#1E2738]">
                    <div className="font-semibold text-[#F8FAFC]">Ethane (C2H6)</div>
                    <div className="text-[10px] text-[#10B981] font-mono">$145/t (FOB)</div>
                    <div className="text-[9px] text-[#64748B]">~80% Ethylene Yield</div>
                  </div>
                  <div className="p-2 rounded bg-[#121824] border border-[#1E2738]">
                    <div className="font-semibold text-[#F8FAFC]">Naphtha (C5-C12)</div>
                    <div className="text-[10px] text-[#F43F5E] font-mono">$685/t (CFR)</div>
                    <div className="text-[9px] text-[#64748B]">~30% Ethylene Yield</div>
                  </div>
                  <div className="p-2 rounded bg-[#121824] border border-[#1E2738]">
                    <div className="font-semibold text-[#CBD5E1]">Propane/Butane (LPG)</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">$520/t</div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-[#BFA161]">
                <ChevronRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Step 2: Cracker Furnace */}
              <div className="p-4 rounded-xl bg-[#141B28] border border-[#BFA161]/40 space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#BFA161] block font-bold">
                  2. STEAM CRACKER
                </span>
                <div className="p-2.5 rounded bg-[#0A0E17] border border-[#1E2738] space-y-1">
                  <div className="font-semibold text-[#F8FAFC]">Furnace Coils</div>
                  <div className="text-[10px] text-[#94A3B8]">820°C - 860°C Pyrolysis</div>
                  <div className="text-[10px] text-[#D4BA7B]">Sub-day switching</div>
                </div>
                <div className="text-[10px] text-[#94A3B8] leading-tight">
                  LP Optimizer tunes steam-to-oil and severity in real-time.
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-[#BFA161]">
                <ChevronRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Step 3: Olefins */}
              <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#10B981] block font-bold">
                  3. PRIMARY OLEFINS
                </span>
                <div className="space-y-1.5">
                  <div className="p-2 rounded bg-[#121824] border border-[#1E2738]">
                    <div className="font-semibold text-[#F8FAFC]">Ethylene (C2H4)</div>
                    <div className="text-[10px] text-[#10B981] font-mono">$840/tonne</div>
                  </div>
                  <div className="p-2 rounded bg-[#121824] border border-[#1E2738]">
                    <div className="font-semibold text-[#F8FAFC]">Propylene (C3H6)</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">$790/tonne</div>
                  </div>
                  <div className="p-2 rounded bg-[#121824] border border-[#1E2738]">
                    <div className="font-semibold text-[#CBD5E1]">PyGas & C4s</div>
                    <div className="text-[10px] text-[#64748B] font-mono">Coproducts</div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-[#BFA161]">
                <ChevronRight className="w-6 h-6" />
              </div>

              {/* Step 4: Downstream */}
              <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#A855F7] block font-bold">
                  4. DOWNSTREAM
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 rounded bg-[#121824] border border-[#1E2738] text-[#CBD5E1]">
                    Polyethylene (HDPE, LLDPE)
                  </div>
                  <div className="p-2 rounded bg-[#121824] border border-[#1E2738] text-[#CBD5E1]">
                    Polypropylene (PP)
                  </div>
                  <div className="p-2 rounded bg-[#121824] border border-[#1E2738] text-[#CBD5E1]">
                    Polyester Chain (MEG, PTA)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected Commodity Interactive Chart Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2738]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#BFA161]">
                  Price Trajectory (Past 6 Months)
                </span>
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  {selectedCommodity.name} ({selectedCommodity.symbol})
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xl font-bold font-tabular text-[#F8FAFC]">
                    ${selectedCommodity.currentPrice.toLocaleString()}
                    <span className="text-xs font-normal text-[#94A3B8] ml-1">
                      {selectedCommodity.unit}
                    </span>
                  </div>
                  <div className={`text-xs font-mono ${selectedCommodity.change1D >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                    {selectedCommodity.change1D >= 0 ? '+' : ''}{selectedCommodity.change1D}% (1D)
                  </div>
                </div>
              </div>
            </div>

            {/* ECharts Instance */}
            <div className="h-64 w-full">
              <EChartsClient option={chartOption} height="100%" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#1E2738] font-mono">
              <span>Source: {selectedCommodity.source}</span>
              <span>Updated: {selectedCommodity.timestamp}</span>
            </div>
          </div>

          {/* Commodity Details & Spreads */}
          <div className="p-5 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 flex flex-col justify-between shadow-lg">
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Selected Benchmark Intelligence
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#1E2738]">
                  <span className="text-[#94A3B8]">Pricing Benchmark:</span>
                  <span className="font-semibold text-[#F8FAFC]">{selectedCommodity.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2738]">
                  <span className="text-[#94A3B8]">Market Category:</span>
                  <span className="font-mono text-[#BFA161]">{selectedCommodity.category}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2738]">
                  <span className="text-[#94A3B8]">1-Week Return:</span>
                  <span className={`font-mono ${selectedCommodity.change1W >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                    {selectedCommodity.change1W >= 0 ? '+' : ''}{selectedCommodity.change1W}%
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2738]">
                  <span className="text-[#94A3B8]">1-Month Return:</span>
                  <span className={`font-mono ${selectedCommodity.change1M >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                    {selectedCommodity.change1M >= 0 ? '+' : ''}{selectedCommodity.change1M}%
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2738]">
                  <span className="text-[#94A3B8]">1-Year Trailing Delta:</span>
                  <span className={`font-mono font-bold ${selectedCommodity.change1Y >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                    {selectedCommodity.change1Y >= 0 ? '+' : ''}{selectedCommodity.change1Y}%
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E2738]">
                  <span className="text-[#94A3B8]">Data Quality Score:</span>
                  <span className="font-mono text-[#10B981]">{selectedCommodity.dataQuality}</span>
                </div>
              </div>
            </div>

            <Link
              href={`/forecasts`}
              className="w-full py-2.5 rounded-lg bg-[#141C2B] hover:bg-[#1E293B] border border-[#242F44] text-xs font-mono text-[#D4BA7B] text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View TimesFM Quantitative Forecast</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bloomberg-Style Dense Metrics Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B]">
              Comprehensive Multi-Horizon Commodity Ledger
            </h2>
            <span className="text-[10px] text-[#64748B] font-mono">1D • 1W • 1M • 3M • YTD • 1Y</span>
          </div>

          <div className="rounded-xl border border-[#1A2232] bg-[#0E1420] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#CBD5E1]">
                <thead className="bg-[#0A0E17] text-[#64748B] uppercase font-mono text-[10px] tracking-wider border-b border-[#1A2232]">
                  <tr>
                    <th className="py-3 px-4">Commodity / Symbol</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Current Price</th>
                    <th className="py-3 px-4 text-right">1D</th>
                    <th className="py-3 px-4 text-right">1W</th>
                    <th className="py-3 px-4 text-right">1M</th>
                    <th className="py-3 px-4 text-right">3M</th>
                    <th className="py-3 px-4 text-right">1Y</th>
                    <th className="py-3 px-4">Source Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2232]">
                  {MARKET_COMMODITIES.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCommodityId(c.id)}
                      className={`hover:bg-[#141C2B] transition-colors cursor-pointer ${
                        selectedCommodityId === c.id ? 'bg-[#121A2B]' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                          {c.name}
                          {selectedCommodityId === c.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#BFA161]" />
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-[#94A3B8]">{c.symbol}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[10px] text-[#94A3B8]">
                        {c.category}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#F8FAFC]">
                        {c.currency === 'USD' ? '$' : '₹'}
                        {c.currentPrice.toLocaleString(undefined, { minimumFractionDigits: c.currentPrice < 100 ? 2 : 0 })}
                      </td>
                      <td className={`py-3 px-4 text-right font-mono ${c.change1D >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                        {c.change1D >= 0 ? '+' : ''}{c.change1D}%
                      </td>
                      <td className={`py-3 px-4 text-right font-mono ${c.change1W >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                        {c.change1W >= 0 ? '+' : ''}{c.change1W}%
                      </td>
                      <td className={`py-3 px-4 text-right font-mono ${c.change1M >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                        {c.change1M >= 0 ? '+' : ''}{c.change1M}%
                      </td>
                      <td className={`py-3 px-4 text-right font-mono ${c.change3M >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                        {c.change3M >= 0 ? '+' : ''}{c.change3M}%
                      </td>
                      <td className={`py-3 px-4 text-right font-mono font-bold ${c.change1Y >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                        {c.change1Y >= 0 ? '+' : ''}{c.change1Y}%
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#64748B]">
                        {c.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
