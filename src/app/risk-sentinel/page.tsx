'use client';

import React, { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import { 
  AlertTriangle, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Radio, 
  Zap, 
  RefreshCw, 
  ExternalLink, 
  Globe2, 
  Activity, 
  CheckCircle2, 
  Sliders, 
  ArrowRight,
  Flame,
  Ship,
  Eye,
  Radar
} from 'lucide-react';
import Link from 'next/link';
import RelianceLogo from '@/components/common/RelianceLogo';
import AppShell from '@/components/layout/AppShell';

interface RiskScenario {
  id: string;
  title: string;
  category: 'OIL_SPIKE' | 'ETHANE_SUPPLY' | 'SHIPPING' | 'DEMAND';
  severity: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'STABLE';
  probability: number; // 0 - 100%
  priceImpact: string;
  rilEbitdaImpact: string; // ₹ Cr
  mitigationAction: string;
  description: string;
}

export default function PriceRiskSentinelPage() {
  const { commodities, rssHeadlines, lastSyncTime, isSyncing, refreshPrices } = useMarket();

  const [selectedRiskId, setSelectedRiskId] = useState<string>('risk-oil-spike');
  const [brentShockDelta, setBrentShockDelta] = useState<number>(15); // +$15/bbl shock

  const liveBrent = commodities.find(c => c.id === 'comm-brent')?.currentPrice || 97.9;
  const liveEthane = commodities.find(c => c.id === 'comm-ethane')?.currentPrice || 157;
  const liveNaphtha = commodities.find(c => c.id === 'comm-naphtha')?.currentPrice || 816;

  // Impact calculations
  const naphthaSpikeCost = Number((brentShockDelta * 7.5).toFixed(0)); // $/tonne
  const unhedgedLossInrCr = Number(((brentShockDelta * 1850) / 10).toFixed(0)); // ₹ Cr
  const mitigatedLossInrCr = Number((unhedgedLossInrCr * 0.18).toFixed(0)); // RIL saves 82% via ethane flexibility!

  const riskCatalog: RiskScenario[] = [
    {
      id: 'risk-oil-spike',
      title: 'Middle East Geopolitical Escalation & Brent Spike',
      category: 'OIL_SPIKE',
      severity: 'CRITICAL',
      probability: 74,
      priceImpact: `Brent +$10 to +$25/bbl ($${(liveBrent + brentShockDelta).toFixed(0)}/bbl) | Naphtha +$${naphthaSpikeCost}/t`,
      rilEbitdaImpact: `-₹${unhedgedLossInrCr} Cr (Mitigated to -₹${mitigatedLossInrCr} Cr)`,
      mitigationAction: 'Swing Dahej & Hazira crackers to 100% Ethane mode; divert Jamnagar naphtha into domestic petrol blending pool.',
      description: 'Strait of Hormuz tanker transit restrictions or OPEC+ output curtailment driving global sweet crude benchmarks higher. Asian naphtha crackers facing severe margin compression.'
    },
    {
      id: 'risk-us-freeze',
      title: 'US Gulf Coast Tropical Storm / Winter Freeze Warning',
      category: 'ETHANE_SUPPLY',
      severity: 'ELEVATED',
      probability: 48,
      priceImpact: 'US Ethane Mont Belvieu Spot +$45/t (+$0.07/gal) to $202/t',
      rilEbitdaImpact: '-₹420 Cr on Dahej expansion run-rate',
      mitigationAction: 'Draw down Dahej cryogenic tank inventory (84,000t buffer = 22 days); ramp Jamnagar ROGC off-gas feed to maximum.',
      description: 'Extreme weather disruptions at Mont Belvieu fractionation hubs and Morgan’s Point export terminal could delay VLEC loading schedules by 5 to 10 days.'
    },
    {
      id: 'risk-vlec-charter',
      title: 'Red Sea & Suez Shipping Surcharge Spikes',
      category: 'SHIPPING',
      severity: 'MODERATE',
      probability: 62,
      priceImpact: 'Ocean freight +$25/tonne of delivered ethane',
      rilEbitdaImpact: '-₹290 Cr annual freight variance',
      mitigationAction: 'Deploy Reliance dedicated long-term chartered VLEC fleet (6 operational + 3 newbuilds) insulated from spot container surges.',
      description: 'Longer voyage routing around Cape of Good Hope adds 12 days sailing time between US Gulf and Dahej terminal.'
    },
    {
      id: 'risk-china-dumping',
      title: 'China Coal-to-Olefins (CTO) & PDH Polymer Oversupply',
      category: 'DEMAND',
      severity: 'ELEVATED',
      probability: 81,
      priceImpact: 'CFR Southeast Asia PE/PP netbacks depressed by -$60/t',
      rilEbitdaImpact: '-₹880 Cr domestic polymer price realization',
      mitigationAction: 'Maximize Indian domestic agricultural pipe and packaging grades; exercise BIS quality import standards to defend Indian market share.',
      description: 'Chinese CTO capacity ramp-up creating regional polymer export pressure into South Asian and Indian subcontinent markets.'
    }
  ];

  const activeRisk = riskCatalog.find(r => r.id === selectedRiskId) || riskCatalog[0];

  return (
    <AppShell>
      <div className="space-y-8 animate-fadeIn pb-12 max-w-[1600px] mx-auto">
        {/* Top Banner with Reliance Logo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F19] border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <RelianceLogo size="md" variant="badge" />
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-md bg-red-950/80 border border-red-800/60 text-red-400 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3" />
                AI PRICE RISK SENTINEL
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-md bg-neutral-800 text-neutral-300">
                GEOPOLITICAL RADAR
              </span>
              <span className="text-xs font-serif italic text-[#8F7640] dark:text-[#D4BA7B] font-bold">
                Growth is Life
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
              Energy Price Risk & Shock Sentinel
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed font-mono">
              Surveillance of global crude, NGL exports & shipping shocks protecting Reliance O2C assets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => refreshPrices()}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-red-500 text-xs font-mono text-neutral-200 transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-red-400' : 'text-neutral-400'}`} />
            <span>{isSyncing ? 'SCANNING FEEDS...' : 'SCAN FEEDS'}</span>
          </button>
          <Link
            href="/simulation"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-xs font-mono font-bold text-white transition-all shadow-lg shadow-red-600/20 active:scale-95"
          >
            <span>TEST MITIGATION IN SCADA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* RISK RADAR THREAT MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {riskCatalog.map((risk) => {
          const isSelected = selectedRiskId === risk.id;
          return (
            <div
              key={risk.id}
              onClick={() => setSelectedRiskId(risk.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all relative overflow-hidden backdrop-blur-md ${
                isSelected 
                  ? 'bg-neutral-900/90 border-red-500 shadow-xl shadow-red-950/30' 
                  : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className={`px-2 py-0.5 rounded font-bold ${
                  risk.severity === 'CRITICAL' 
                    ? 'bg-red-950 text-red-400 border border-red-800/80' 
                    : risk.severity === 'ELEVATED'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800/80'
                    : 'bg-blue-950 text-blue-400 border border-blue-800/80'
                }`}>
                  {risk.severity} THREAT
                </span>
                <span className="text-neutral-400">{risk.probability}% PROB</span>
              </div>

              <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                {risk.title}
              </h3>

              <div className="mt-4 pt-3 border-t border-neutral-800 text-xs font-mono space-y-1">
                <div className="text-neutral-400">Impact:</div>
                <div className="text-red-400 font-bold truncate">{risk.rilEbitdaImpact}</div>
              </div>

              {isSelected && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* DETAILED RISK INSPECTOR & INTERACTIVE SHOCK SLIDER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Shock Simulator */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0A0D14] border border-neutral-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <h2 className="text-base font-bold text-white font-mono uppercase">
                Active Threat Breakdown: {activeRisk.title}
              </h2>
            </div>
            <span className="text-xs font-mono text-red-400 font-bold">
              {activeRisk.severity}
            </span>
          </div>

          <p className="text-xs text-neutral-300 leading-relaxed">
            {activeRisk.description}
          </p>

          {/* Interactive Crude Shock Slider */}
          <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-300">Simulate Brent Crude Price Shock:</span>
              <span className="text-red-400 font-bold">+${brentShockDelta}/bbl (New Brent: ${(liveBrent + brentShockDelta).toFixed(1)}/bbl)</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={brentShockDelta}
              onChange={(e) => setBrentShockDelta(Number(e.target.value))}
              className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
              <span>+$5/bbl (Minor Spike)</span>
              <span>+$15/bbl (Current Stress)</span>
              <span>+$40/bbl (Major Geopolitical Crisis)</span>
            </div>
          </div>

          {/* Impact Quantifications */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/60">
              <span className="text-neutral-400 block text-[11px]">UNHEDGED RIL EBITDA LOSS</span>
              <span className="text-lg font-bold text-red-400 mt-1 block">
                -₹{unhedgedLossInrCr.toLocaleString()} Cr/yr
              </span>
              <span className="text-[10px] text-neutral-500">If operating on pure Naphtha mode</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-900/60">
              <span className="text-neutral-400 block text-[11px]">MITIGATED LOSS VIA ETHANE SWING</span>
              <span className="text-lg font-bold text-emerald-400 mt-1 block">
                -₹{mitigatedLossInrCr.toLocaleString()} Cr/yr
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">Reliance saves 82% downside!</span>
            </div>
          </div>

          {/* Prescribed Operational Playbook */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
              <Zap className="w-3.5 h-3.5" />
              AI PRESCRIBED OPERATIONAL PLAYBOOK
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-mono">
              {activeRisk.mitigationAction}
            </p>
          </div>
        </div>

        {/* Right: Live Energy & Chemical News Wire */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0A0D14] border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white font-mono uppercase">
                  Live Market News Wire (Indian Chemical News)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                RSS FEED
              </span>
            </div>

            <div className="space-y-3">
              {rssHeadlines.length > 0 ? (
                rssHeadlines.slice(0, 5).map((item, idx) => (
                  <a
                    key={idx}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 hover:border-cyan-500/60 transition-all group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mb-1">
                      <span>{item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Today'}</span>
                      <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-cyan-400 transition-colors" />
                    </div>
                    <p className="text-xs text-neutral-300 font-semibold group-hover:text-white transition-colors line-clamp-2">
                      {item.title}
                    </p>
                  </a>
                ))
              ) : (
                <div className="p-4 text-center text-xs font-mono text-neutral-500">
                  Scanning live petchem news feeds...
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Real-time NLP sentiment active
            </span>
            <span className="text-neutral-500">Auto-Refreshes 60s</span>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);
}
