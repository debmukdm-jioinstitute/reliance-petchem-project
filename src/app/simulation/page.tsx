'use client';

import React, { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import {
  Activity,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Flame,
  Zap,
  Sliders,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import RelianceLogo from '@/components/common/RelianceLogo';
import PriceInfoIcon from '@/components/common/PriceInfoIcon';
import AppShell from '@/components/layout/AppShell';

export default function FeedMixMarginCalculatorPage() {
  const { commodities, isSyncing, refreshPrices } = useMarket();
  const [ethaneRatio, setEthaneRatio] = useState(75);
  const [throughputKtpa, setThroughputKtpa] = useState(1850);

  const naphthaRatio = 100 - ethaneRatio;

  // Live market prices (fallback to last-known static values if feed hasn't loaded)
  const ethanePrice = commodities.find(c => c.id === 'comm-ethane')?.currentPrice || 157; // $/t
  const naphthaPrice = commodities.find(c => c.id === 'comm-naphtha')?.currentPrice || 816; // $/t
  const ethylenePrice = commodities.find(c => c.id === 'comm-ethylene')?.currentPrice || 886; // $/t
  const propylenePrice = commodities.find(c => c.id === 'comm-propylene')?.currentPrice || 833; // $/t

  // Weighted feedstock cost ($/t)
  const weightedFeedCost = Number(((ethaneRatio / 100) * ethanePrice + (naphthaRatio / 100) * naphthaPrice).toFixed(1));

  // Industry-typical steam-cracker yields by feedstock (ethane vs naphtha)
  const ethyleneYield = (ethaneRatio / 100) * 0.795 + (naphthaRatio / 100) * 0.332;
  const propyleneYield = (ethaneRatio / 100) * 0.024 + (naphthaRatio / 100) * 0.168;
  const byproductsYield = 1 - ethyleneYield - propyleneYield;

  // Realized basket revenue per tonne of feed
  const basketRevenue = Number((
    ethyleneYield * ethylenePrice +
    propyleneYield * propylenePrice +
    byproductsYield * 420 // Fuel gas and Pygas credit
  ).toFixed(1));

  // Variable operating & processing cost ($/t) — ethane needs less fuel gas & simpler fractionation than naphtha
  const processingCost = Number(((ethaneRatio / 100) * 85 + (naphthaRatio / 100) * 165).toFixed(1));

  // Net Cash Margin ($/tonne of feed)
  const netMargin = Number((basketRevenue - weightedFeedCost - processingCost).toFixed(1));

  // Annualized EBITDA in ₹ Crore ($1 = ₹84)
  const annualThroughputTonnes = throughputKtpa * 1000;
  const annualEbitdaUsdM = Number(((netMargin * annualThroughputTonnes) / 1_000_000).toFixed(1));
  const annualEbitdaInrCr = Number(((annualEbitdaUsdM * 84) / 10).toFixed(0));

  return (
    <AppShell>
      <div className="space-y-8 animate-fadeIn max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F19] border border-neutral-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <RelianceLogo size="md" variant="badge" />
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
                Feed-Mix Margin Calculator
              </h1>
              <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed font-mono">
                Ethane vs. naphtha feed substitution economics for the Dahej &amp; Jamnagar dual-feed crackers,
                driven by live spot prices.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              onClick={() => refreshPrices()}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-700 hover:border-cyan-500 text-xs font-mono text-neutral-200 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : 'text-neutral-400'}`} />
              <span>{isSyncing ? 'SYNCING PRICES...' : 'REFRESH PRICES'}</span>
            </button>
            <Link
              href="/economics"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-mono font-bold text-white transition-all shadow-lg shadow-cyan-600/20 active:scale-95"
            >
              <span>VALUE CHAIN ECONOMICS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feed-Mix Controls */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-5 lg:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Feedstock Blend &amp; Throughput
            </h3>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  US Ethane: {ethaneRatio}%
                </span>
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Naphtha: {naphthaRatio}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={ethaneRatio}
                onChange={(e) => setEthaneRatio(Number(e.target.value))}
                className="w-full h-2.5 bg-gradient-to-r from-amber-600 via-purple-600 to-cyan-500 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>100% Naphtha Cracking</span>
                <span>50/50 Dual Feed</span>
                <span>100% Pure Ethane Cracking</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800/80">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-300">Total Nameplate Throughput:</span>
                <span className="text-emerald-400 font-bold">{throughputKtpa.toLocaleString()} KTPA</span>
              </div>
              <input
                type="range"
                min="1200"
                max="2400"
                step="50"
                value={throughputKtpa}
                onChange={(e) => setThroughputKtpa(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>1,200 KTPA (Turndown)</span>
                <span>1,850 KTPA (Nominal)</span>
                <span>2,400 KTPA (Expanded Dahej+JMN)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Margin Calculator Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Blended Feedstock Cost */}
          <div className="p-5 rounded-2xl bg-[#0D121F] border border-cyan-800/50 relative overflow-hidden backdrop-blur-md shadow-lg shadow-cyan-950/20">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-2 font-bold tracking-wide">
              <div className="flex items-center gap-1.5">
                <span>INPUT FEEDSTOCK COST</span>
                <PriceInfoIcon commodityId="comm-ethane" size="xs" />
              </div>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
                ${weightedFeedCost}
                <span className="text-sm font-medium text-neutral-300 ml-1">/tonne</span>
              </div>
              <PriceInfoIcon commodityId="comm-ethane" currentPrice={weightedFeedCost} unit="USD/t" size="xs" />
            </div>
            <div className="mt-2.5 text-xs sm:text-sm font-mono text-neutral-200 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-cyan-300 font-medium">Ethane: ${ethanePrice}</span>
                <PriceInfoIcon commodityId="comm-ethane" currentPrice={ethanePrice} unit="USD/t" size="xs" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-amber-300 font-medium">Naphtha: ${naphthaPrice}</span>
                <PriceInfoIcon commodityId="comm-naphtha" currentPrice={naphthaPrice} unit="USD/t" size="xs" />
              </div>
            </div>
            <div className="mt-3 w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden flex">
              <div style={{ width: `${ethaneRatio}%` }} className="bg-cyan-400 h-full" />
              <div style={{ width: `${naphthaRatio}%` }} className="bg-amber-400 h-full" />
            </div>
          </div>

          {/* Metric 2: Gross Basket Realization */}
          <div className="p-5 rounded-2xl bg-[#0D121F] border border-purple-800/50 relative overflow-hidden backdrop-blur-md shadow-lg shadow-purple-950/20">
            <div className="flex items-center justify-between text-xs font-mono text-purple-300 mb-2 font-bold tracking-wide">
              <div className="flex items-center gap-1.5">
                <span>GROSS OUTPUT BASKET</span>
                <PriceInfoIcon commodityId="comm-ethylene" size="xs" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
                ${basketRevenue}
                <span className="text-sm font-medium text-neutral-300 ml-1">/tonne</span>
              </div>
              <PriceInfoIcon commodityId="comm-ethylene" currentPrice={basketRevenue} unit="USD/t" size="xs" />
            </div>
            <div className="mt-2.5 text-xs sm:text-sm font-mono text-neutral-200 flex items-center justify-between">
              <span className="text-neutral-200">Ethylene: {(ethyleneYield * 100).toFixed(0)}% yield</span>
              <div className="flex items-center gap-1">
                <span className="text-emerald-300 font-medium">Spot: ${ethylenePrice}</span>
                <PriceInfoIcon commodityId="comm-ethylene" currentPrice={ethylenePrice} unit="USD/t" size="xs" />
              </div>
            </div>
            <div className="mt-3 text-xs font-mono text-emerald-300 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              High purity polymer premium applied
            </div>
          </div>

          {/* Metric 3: Processing OPEX */}
          <div className="p-5 rounded-2xl bg-[#0D121F] border border-orange-800/50 relative overflow-hidden backdrop-blur-md shadow-lg shadow-orange-950/20">
            <div className="flex items-center justify-between text-xs font-mono text-orange-300 mb-2 font-bold tracking-wide">
              <div className="flex items-center gap-1.5">
                <span>CONVERSION &amp; HEAT OPEX</span>
                <PriceInfoIcon commodityId="comm-o2c-margin" size="xs" />
              </div>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
                ${processingCost}
                <span className="text-sm font-medium text-neutral-300 ml-1">/tonne</span>
              </div>
              <PriceInfoIcon commodityId="comm-o2c-margin" currentPrice={processingCost} unit="USD/t" size="xs" />
            </div>
            <div className="mt-3 text-xs font-mono text-cyan-300 font-medium">
              {ethaneRatio > 60 ? '⚡ Lower heat duty (Ethane lean route)' : '⚠️ Higher fuel duty (Naphtha heavy)'}
            </div>
          </div>

          {/* Metric 4: Integrated EBITDA */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-neutral-900 to-[#0A141A] border border-emerald-700/60 relative overflow-hidden backdrop-blur-md shadow-lg shadow-emerald-950/30">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-300 mb-2 font-bold tracking-wide">
              <div className="flex items-center gap-1.5">
                <span>NET EBITDA SPREAD</span>
                <PriceInfoIcon commodityId="comm-spread-ee" size="xs" />
              </div>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl lg:text-3xl font-bold font-mono text-emerald-300">
                +${netMargin}
                <span className="text-sm font-medium text-neutral-300 ml-1">/tonne</span>
              </div>
              <PriceInfoIcon commodityId="comm-spread-ee" currentPrice={netMargin} unit="USD/t" size="xs" />
            </div>
            <div className="mt-2.5 text-xs sm:text-sm font-mono text-white font-bold flex items-center justify-between">
              <span className="text-neutral-200">Annual Run-Rate:</span>
              <div className="flex items-center gap-1 text-amber-300">
                <span>₹{annualEbitdaInrCr.toLocaleString()} Cr/yr</span>
                <PriceInfoIcon commodityId="comm-o2c-margin" size="xs" />
              </div>
            </div>
            <div className="mt-3 text-xs font-mono text-neutral-300">
              Based on {throughputKtpa.toLocaleString()} KTPA asset throughput
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
