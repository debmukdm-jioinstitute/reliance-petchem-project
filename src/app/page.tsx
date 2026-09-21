'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import {
  TrendingUp,
  Sparkles,
  Search,
  ArrowRight,
  Activity,
  DollarSign,
  Cpu,
  AlertTriangle,
  Flame,
  Ship,
  Zap,
  CheckCircle2,
  Sliders,
  Scale
} from 'lucide-react';
import { GlassCard3D, GlassMetricBox } from '@/components/glass';
import { ArrowFillButton, DottedGrid } from '@/components/obsidian';
import { useMarket } from '@/context/MarketContext';
import ScadaDiagram, { ScadaState } from '@/components/scada/ScadaDiagram';

export default function OverviewPage() {
  const router = useRouter();
  const { getCommodity, commodities, refreshPrices, isSyncing } = useMarket();
  const [naturalQuery, setNaturalQuery] = useState('');
  const [scadaState, setScadaState] = useState<ScadaState>({
    ethaneRatio: 75,
    naphthaRatio: 25,
    throughputKtpa: 1850,
    severity: 'HIGH',
    furnaceCot: 852,
    sorRatio: 0.40
  });

  const ethylene = getCommodity('comm-ethylene');
  const propylene = getCommodity('comm-propylene');
  const naphtha = getCommodity('comm-naphtha');
  const ethane = getCommodity('comm-ethane');
  const brent = getCommodity('comm-brent');

  // Dynamic economics calculations
  const ethanePrice = ethane?.currentPrice || 157;
  const naphthaPrice = naphtha?.currentPrice || 819;
  const ethylenePrice = ethylene?.currentPrice || 887;
  const propylenePrice = propylene?.currentPrice || 834;

  const weightedFeedCost = Number(((scadaState.ethaneRatio / 100) * ethanePrice + (scadaState.naphthaRatio / 100) * naphthaPrice).toFixed(1));
  const processingCost = Number(((scadaState.ethaneRatio / 100) * 85 + (scadaState.naphthaRatio / 100) * 165).toFixed(1));
  const ethyleneYield = (scadaState.ethaneRatio / 100) * 0.795 + (scadaState.naphthaRatio / 100) * 0.332;
  const propyleneYield = (scadaState.ethaneRatio / 100) * 0.024 + (scadaState.naphthaRatio / 100) * 0.168;
  const byproductsYield = 1 - ethyleneYield - propyleneYield;

  const grossBasketRevenue = Number((ethyleneYield * ethylenePrice + propyleneYield * propylenePrice + byproductsYield * 420).toFixed(1));
  const netEbitdaPerTonne = Number((grossBasketRevenue - weightedFeedCost - processingCost + 135).toFixed(1)); // with polymer uplift
  const annualEbitdaCr = Number((((netEbitdaPerTonne * scadaState.throughputKtpa * 1000) / 1_000_000) * 84 / 10).toFixed(0));

  const handleAskNaturalQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalQuery.trim()) return;
    router.push(`/ai?q=${encodeURIComponent(naturalQuery)}`);
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Hero Section */}
        <GlassCard3D className="p-6 sm:p-10">
          <DottedGrid>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    SCADA Simulation & Digital Twin
                  </span>
                  <span className="text-neutral-400 dark:text-neutral-600 font-bold">•</span>
                  <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 font-mono">
                    Reliance Industries (O2C Petrochemicals)
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-mono">
                  Petchem SCADA & Optimization OS
                </h1>
                <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed">
                  End-to-end value chain operating system: real-time feedstock import costs, furnace conversion OPEX, 
                  hydrodynamic cracking simulations, product price realizations, and AI-powered geopolitical price risk sentinels.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Link href="/simulation">
                  <ArrowFillButton variant="primary">
                    Full SCADA Mimic
                  </ArrowFillButton>
                </Link>
                <Link href="/economics">
                  <ArrowFillButton variant="secondary">
                    Economics Waterfall
                  </ArrowFillButton>
                </Link>
              </div>
            </div>
          </DottedGrid>
        </GlassCard3D>

        {/* AI GEOPOLITICAL & PRICE RISK ALERT SENTINEL BANNER */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/40 via-neutral-900/80 to-neutral-900/60 border border-red-800/60 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-800 text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 font-bold border border-red-800/60">
                  AI RISK SENTINEL ALERT
                </span>
                <span className="text-xs font-mono text-neutral-400">
                  Middle East Shipping & Brent Crude Volatility
                </span>
              </div>
              <p className="text-sm text-neutral-200 font-semibold mt-1">
                Crude benchmark elevated at ${brent?.currentPrice || 97.9}/bbl. Naphtha crack spread under pressure (+$65/t penalty).
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                AI Prescribed Action: Maximize Dahej Cryogenic Ethane intake to 100%; swing Hazira away from imported Naphtha.
              </p>
            </div>
          </div>

          <Link
            href="/risk-sentinel"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900/80 border border-red-700 text-xs font-mono font-bold text-red-300 transition-all shrink-0 self-start md:self-auto"
          >
            <span>VIEW THREAT RADAR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-STEP END-TO-END VALUE CHAIN SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <GlassCard3D className="p-5 flex flex-col justify-between" maxTilt={6}>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Ship className="w-4 h-4" />
                1. INPUT COSTS
              </span>
              <span className="text-neutral-500 text-[10px]">LANDED</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              ${weightedFeedCost}
              <span className="text-xs font-normal text-neutral-400 ml-1">/t</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Ethane (${ethanePrice}) & Naphtha (${naphthaPrice}) blend
            </p>
          </GlassCard3D>

          {/* Step 2 */}
          <GlassCard3D className="p-5 flex flex-col justify-between" maxTilt={6}>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-orange-400 font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                2. PROCESSING OPEX
              </span>
              <span className="text-neutral-500 text-[10px]">CONVERSION</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              ${processingCost}
              <span className="text-xs font-normal text-neutral-400 ml-1">/t</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Thermal cracking fuel gas, steam & compressor drives
            </p>
          </GlassCard3D>

          {/* Step 3 */}
          <GlassCard3D className="p-5 flex flex-col justify-between" maxTilt={6}>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-purple-400 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                3. OUTPUT BASKET
              </span>
              <span className="text-neutral-500 text-[10px]">REALIZATION</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              ${grossBasketRevenue}
              <span className="text-xs font-normal text-neutral-400 ml-1">/t</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Ethylene (${ethylenePrice}), Propylene (${propylenePrice}), PyGas
            </p>
          </GlassCard3D>

          {/* Step 4 */}
          <GlassCard3D className="p-5 flex flex-col justify-between bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-900" maxTilt={6}>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                4. NET EBITDA
              </span>
              <span className="text-emerald-400 text-[10px] font-bold">INTEGRATED</span>
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-300">
              +${netEbitdaPerTonne}
              <span className="text-xs font-normal text-neutral-400 ml-1">/t</span>
            </div>
            <p className="text-xs text-amber-400 font-mono mt-1 font-semibold">
              ₹{annualEbitdaCr.toLocaleString()} Cr Annualized Run-Rate
            </p>
          </GlassCard3D>
        </div>

        {/* EMBEDDED SCADA DIGITAL TWIN MIMIC (INTERACTIVE HERO) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2 font-mono">
              <Activity className="w-5 h-5 text-cyan-400" />
              Live Cracker Hydrodynamic SCADA Mimic
            </h2>
            <Link
              href="/simulation"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Expand Full Control Room</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ScadaDiagram onStateChange={setScadaState} initialEthaneRatio={scadaState.ethaneRatio} />
        </div>

        {/* REAL-TIME MARKET PRICES & METRIC BOXES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2 font-mono">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Real-Time Feedstock & Product Spot Prices
            </h2>
            <Link
              href="/market?tab=products&item=ethylene"
              className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Deep-Link Commodity Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <GlassMetricBox
              title="Ethylene Spot"
              value={`$${ethylene?.currentPrice || 887}`}
              unit="/t"
              subtitle="CFR SE Asia / India Benchmark"
              badgeText="Product"
              trend={(ethylene?.change1D || 0) >= 0 ? 'up' : 'down'}
              trendValue={`${(ethylene?.change1D || 0) >= 0 ? '+' : ''}${(ethylene?.change1D || -0.9).toFixed(2)}%`}
              href="/market?tab=products&item=ethylene"
              highlight
            />
            <GlassMetricBox
              title="Propylene Spot"
              value={`$${propylene?.currentPrice || 834}`}
              unit="/t"
              subtitle="FOB Korea / India Domestic"
              badgeText="Product"
              trend={(propylene?.change1D || 0) >= 0 ? 'up' : 'down'}
              trendValue={`${(propylene?.change1D || 0) >= 0 ? '+' : ''}${(propylene?.change1D || -0.77).toFixed(2)}%`}
              href="/market?tab=products&item=propylene"
            />
            <GlassMetricBox
              title="Naphtha Landed"
              value={`$${naphtha?.currentPrice || 819}`}
              unit="/t"
              subtitle="CFR Japan / Singapore / Jamnagar"
              badgeText="Feedstock"
              trend={(naphtha?.change1D || 0) >= 0 ? 'up' : 'down'}
              trendValue={`${(naphtha?.change1D || 0) >= 0 ? '+' : ''}${(naphtha?.change1D || -1.26).toFixed(2)}%`}
              href="/market?tab=feedstocks&item=naphtha"
            />
            <GlassMetricBox
              title="US Ethane FOB"
              value={`$${ethane?.currentPrice || 157}`}
              unit="/t"
              subtitle="Mont Belvieu (VLEC Pipeline)"
              badgeText="Feedstock"
              trend={(ethane?.change1D || 0) >= 0 ? 'up' : 'down'}
              trendValue={`${(ethane?.change1D || 0) >= 0 ? '+' : ''}${(ethane?.change1D || -0.7).toFixed(2)}%`}
              href="/market?tab=feedstocks&item=ethane"
              highlight
            />
            <GlassMetricBox
              title="Brent Crude"
              value={`$${brent?.currentPrice || 97.9}`}
              unit="/bbl"
              subtitle="ICE London Futures Spot"
              badgeText="Energy"
              trend={(brent?.change1D || 0) >= 0 ? 'up' : 'down'}
              trendValue={`${(brent?.change1D || 0) >= 0 ? '+' : ''}${(brent?.change1D || -1.4).toFixed(2)}%`}
              href="/market?tab=energy&item=brent"
            />
            <GlassMetricBox
              title="Ethane Advantage"
              value={`+$${(naphthaPrice - (ethanePrice + 145)).toFixed(0)}`}
              unit="/t"
              subtitle="Spread over Landed Naphtha"
              badgeText="Cost Delta"
              trend="up"
              trendValue="High Margin"
              href="/economics"
              highlight
            />
            <GlassMetricBox
              title="Cracker Capacity"
              value="4,200"
              unit="KTPA"
              subtitle="5 Complexes Across India"
              badgeText="Operations"
              trend="neutral"
              trendValue="Optimal"
              href="/optimization"
            />
            <GlassMetricBox
              title="Consolidated EBITDA"
              value="₹54,988"
              unit="Cr"
              subtitle="RIL O2C Segment (FY25)"
              badgeText="Financial"
              trend="up"
              trendValue="+14% YoY"
              href="/financial"
              highlight
            />
          </div>
        </div>

        {/* NATURAL LANGUAGE DIGITAL TWIN QUERY BOX */}
        <GlassCard3D className="p-8">
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-500 dark:text-[#D4BA7B] uppercase tracking-wide font-mono">
              <Sparkles className="w-4 h-4" />
              Petchem Digital Twin & Optimization Query
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white font-mono">
              Ask about cracker yields, input costs, or LP allocations in plain English
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Query real-time mass balances, furnace cracking kinetics, Dahej pipeline throughput limits, or EBITDA profit sensitivities.
            </p>

            <form onSubmit={handleAskNaturalQuery} className="flex items-center gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="e.g. What is the EBITDA difference between 100% Ethane and 100% Naphtha cracking?"
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/70 dark:bg-black/30 border border-neutral-300 dark:border-white/15 text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-500 focus:border-[#BFA161] focus:ring-2 focus:ring-[#BFA161]/20 focus:outline-none transition-all shadow-inner font-mono"
                />
              </div>
              <ArrowFillButton type="submit" variant="primary" className="h-14 font-mono">
                Solve
              </ArrowFillButton>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
              <span className="font-semibold text-neutral-500">Quick simulations:</span>
              {[
                'How does a +$10/bbl Brent spike impact RIL cracker EBITDA?',
                'What is the mass yield of Ethylene at 852°C furnace COT?',
                'What is the capacity limit of the Dahej-Hazira ethane pipeline?',
                'Show side-by-side economics for Jamnagar ROGC vs Dahej'
              ].map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setNaturalQuery(prompt);
                    router.push(`/ai?q=${encodeURIComponent(prompt)}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white/60 hover:bg-white dark:bg-white/5 dark:hover:bg-white/15 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 transition-all cursor-pointer"
                >
                  &quot;{prompt}&quot;
                </button>
              ))}
            </div>
          </div>
        </GlassCard3D>

      </div>
    </AppShell>
  );
}
