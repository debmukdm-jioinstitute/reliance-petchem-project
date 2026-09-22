'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Globe2, 
  CloudRain, 
  Ship, 
  Factory, 
  Radio, 
  RefreshCw, 
  ArrowRight, 
  Search, 
  Bell, 
  Droplets, 
  ChevronRight, 
  BarChart2, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { useMarket } from '@/context/MarketContext';

interface ThreatCard {
  id: string;
  title: string;
  threatLevel: 'CRITICAL' | 'ELEVATED' | 'MODERATE';
  threatClass: string;
  probability: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  impactValue: string;
  impactSubtext: string;
  impactColor: string;
  sparklineColor: string;
  description: string;
  mitigationAction: string;
  unhedgedBase: number;
  mitigatedBase: number;
}

const THREAT_DATA: ThreatCard[] = [
  {
    id: 'risk-oil-spike',
    title: 'Middle East Geopolitical Escalation & Brent Spike',
    threatLevel: 'CRITICAL',
    threatClass: 'bg-red-50 text-red-600 border border-red-200/70',
    probability: 74,
    icon: Globe2,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50',
    impactValue: '-₹2,775 Cr',
    impactSubtext: '(Mitigated to ~₹500 Cr)',
    impactColor: 'text-red-600',
    sparklineColor: '#EF4444',
    description: 'Strait of Hormuz tanker transit restrictions or OPEC+ output curtailment driving global sweet crude benchmarks higher. Asian naphtha crackers facing severe margin compression.',
    mitigationAction: 'Swing Dahej & Hazira crackers to 100% Ethane mode; divert Jamnagar naphtha into domestic petrol blending pool.',
    unhedgedBase: 2775,
    mitigatedBase: 500
  },
  {
    id: 'risk-us-freeze',
    title: 'US Gulf Coast Tropical Storm / Winter Freeze Warning',
    threatLevel: 'ELEVATED',
    threatClass: 'bg-amber-50 text-amber-700 border border-amber-200/70',
    probability: 48,
    icon: CloudRain,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    impactValue: '-₹420 Cr',
    impactSubtext: 'on Dahej expansion run-rate',
    impactColor: 'text-amber-700',
    sparklineColor: '#D97706',
    description: 'Extreme weather disruptions at Mont Belvieu fractionation hubs and Morgan’s Point export terminal could delay VLEC loading schedules by 5 to 10 days.',
    mitigationAction: 'Draw down Dahej cryogenic tank inventory (84,000t buffer = 22 days); ramp Jamnagar ROGC off-gas feed to maximum.',
    unhedgedBase: 1250,
    mitigatedBase: 420
  },
  {
    id: 'risk-vlec-charter',
    title: 'Red Sea & Suez Shipping Surcharge Spikes',
    threatLevel: 'MODERATE',
    threatClass: 'bg-blue-50 text-blue-600 border border-blue-200/70',
    probability: 62,
    icon: Ship,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    impactValue: '-₹290 Cr',
    impactSubtext: 'annual freight variance',
    impactColor: 'text-blue-600',
    sparklineColor: '#2563EB',
    description: 'Longer voyage routing around Cape of Good Hope adds 12 days sailing time between US Gulf and Dahej terminal.',
    mitigationAction: 'Deploy Reliance dedicated long-term chartered VLEC fleet (6 operational + 3 newbuilds) insulated from spot container surges.',
    unhedgedBase: 650,
    mitigatedBase: 290
  },
  {
    id: 'risk-china-dumping',
    title: 'China Coal-to-Olefins (CTO) & PDH Polymer Oversupply',
    threatLevel: 'ELEVATED',
    threatClass: 'bg-purple-50 text-purple-700 border border-purple-200/70',
    probability: 81,
    icon: Factory,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50',
    impactValue: '-₹880 Cr',
    impactSubtext: 'domestic polymer price realignment',
    impactColor: 'text-purple-700',
    sparklineColor: '#9333EA',
    description: 'Chinese CTO capacity ramp-up creating regional polymer export pressure into South Asian and Indian subcontinent markets.',
    mitigationAction: 'Maximize Indian domestic agricultural pipe and packaging grades; exercise BIS quality import standards to defend Indian market share.',
    unhedgedBase: 1980,
    mitigatedBase: 880
  }
];

export default function PriceRiskSentinelPage() {
  const { commodities, refreshPrices, isSyncing } = useMarket();

  const [selectedRiskId, setSelectedRiskId] = useState<string>('risk-oil-spike');
  const [brentShockDelta, setBrentShockDelta] = useState<number>(15);
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1M');
  const [searchQuery, setSearchQuery] = useState('');

  const liveBrent = commodities.find(c => c.id === 'comm-brent')?.currentPrice || 99.1;
  const activeRisk = THREAT_DATA.find(r => r.id === selectedRiskId) || THREAT_DATA[0];

  // Dynamic calculation based on slider
  const dynamicUnhinged = Number(((brentShockDelta / 15) * activeRisk.unhedgedBase).toFixed(0));
  const dynamicMitigated = Number(((brentShockDelta / 15) * activeRisk.mitigatedBase).toFixed(0));
  const newBrentPrice = (liveBrent + brentShockDelta).toFixed(1);

  return (
    <AppShell>
      <div className="space-y-4 sm:space-y-5 animate-fadeIn pb-8 max-w-[1600px] mx-auto font-sans">
        
        {/* ================= 1. TOP BENTO BANNER CARD ================= */}
        <div className="rounded-3xl bg-white dark:bg-[#121217] border border-black/[0.05] dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-5 sm:p-7 relative overflow-hidden">
          
          {/* Petrochemical Cracking Towers Watermark blended on the right */}
          <div className="absolute right-0 top-0 bottom-0 w-[420px] sm:w-[540px] pointer-events-none select-none overflow-hidden opacity-25 dark:opacity-15">
            <img
              src="/images/refinery-plant.jpg"
              alt="Reliance Refinery Towers"
              className="w-full h-full object-cover object-left"
              style={{
                maskImage: 'linear-gradient(to left, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.4) 60%, transparent 100%)'
              }}
            />
          </div>

          {/* Faint Golden Reliance Emblem in Background */}
          <div className="absolute right-48 top-1/2 -translate-y-1/2 w-28 h-28 pointer-events-none select-none opacity-20 dark:opacity-10">
            <img
              src="/images/reliance-logo.png"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          {/* Top Row: Badges, Search & Header Status */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-black/[0.04] dark:border-neutral-800">
            {/* Left Pill Badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]/70">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                AI PRICE RISK SENTINEL
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold tracking-tight bg-[#F1F5F9] text-[#475569] dark:bg-neutral-800 dark:text-neutral-300">
                GEOPOLITICAL RADAR
              </span>
            </div>

            {/* Right Group: Search, Date, Bell, Avatar */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Sleek Search Pill */}
              <div className="relative hidden md:flex items-center">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search global news, commodities..."
                  className="pl-8 pr-4 py-1.5 rounded-full bg-[#F8F7F4] dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 w-56 lg:w-68 transition-all"
                />
              </div>

              {/* Date & Time */}
              <div className="text-right hidden sm:block">
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block leading-tight">
                  Mon, 22 Sep 2026
                </span>
                <span className="text-[10px] font-mono text-neutral-400 block leading-tight">
                  10:24 AM IST
                </span>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#F8F7F4] dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 transition-colors relative cursor-pointer"
                  title="1 New Sentinel Alert"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    1
                  </span>
                </button>
              </div>

              {/* User Avatar "DM" */}
              <div
                className="w-8 h-8 rounded-full bg-[#23272F] text-white flex items-center justify-center font-bold text-xs tracking-tight shadow-xs cursor-pointer hover:opacity-90 transition-opacity"
                title="Debabrata (DM) • Executive Account"
              >
                DM
              </div>
            </div>
          </div>

          {/* Main Title & Action Buttons Row */}
          <div className="relative z-10 pt-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Energy Price Risk & Shock Sentinel
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                Surveillance of global crude, NGL exports & shipping shocks protecting Reliance O2C assets.
              </p>
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => refreshPrices()}
                disabled={isSyncing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-all active:scale-95 shadow-2xs cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-red-500' : 'text-neutral-500'}`} />
                <span>{isSyncing ? 'Scanning Feeds...' : 'Scan Feeds'}</span>
              </button>

              <Link
                href="/simulation"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF2B44] via-[#F43F5E] to-[#F97316] hover:from-[#E11D48] hover:to-[#EA580C] text-xs sm:text-sm font-bold text-white transition-all shadow-md shadow-red-500/25 active:scale-95"
              >
                <span>Test Mitigation in SCADA</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>


        {/* ================= 2. FOUR THREAT CARDS (HORIZONTAL GRID) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {THREAT_DATA.map((risk) => {
            const isSelected = selectedRiskId === risk.id;
            const IconComponent = risk.icon;

            return (
              <div
                key={risk.id}
                onClick={() => setSelectedRiskId(risk.id)}
                className={`p-5 rounded-3xl bg-white dark:bg-[#121217] border cursor-pointer transition-all duration-200 relative overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'border-neutral-400 dark:border-neutral-500 shadow-[0_8px_30px_rgba(0,0,0,0.06)] ring-2 ring-neutral-900/5 dark:ring-white/10'
                    : 'border-black/[0.05] dark:border-white/10 shadow-[0_4px_18px_rgba(0,0,0,0.02)] hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md'
                }`}
              >
                {/* Top Row: Icon + Threat Pill + Probability Pill */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${risk.iconBg} ${risk.iconColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${risk.threatClass}`}>
                      {risk.threatLevel} THREAT
                    </span>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                      {risk.probability}% PROB
                    </span>
                  </div>

                  {/* Threat Title */}
                  <h3 className="text-[13px] font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2 h-9">
                    {risk.title}
                  </h3>
                </div>

                {/* Bottom Row: Impact, Sparkline, Arrow Button */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-end justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 font-medium block leading-tight">
                      Impact
                    </span>
                    <span className={`text-base font-extrabold tracking-tight ${risk.impactColor} block leading-tight mt-0.5`}>
                      {risk.impactValue}
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block truncate max-w-[130px] mt-0.5">
                      {risk.impactSubtext}
                    </span>
                  </div>

                  {/* Sparkline Graphic */}
                  <div className="w-16 h-8 relative shrink-0">
                    <svg viewBox="0 0 70 30" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <path
                        d={
                          risk.id === 'risk-oil-spike'
                            ? 'M 0,22 Q 18,24 35,15 T 52,18 T 70,6'
                            : risk.id === 'risk-us-freeze'
                            ? 'M 0,24 Q 20,20 38,14 T 55,16 T 70,8'
                            : risk.id === 'risk-vlec-charter'
                            ? 'M 0,20 Q 22,22 40,16 T 58,18 T 70,10'
                            : 'M 0,18 Q 18,22 36,12 T 54,15 T 70,7'
                        }
                        fill="none"
                        stroke={risk.sparklineColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {/* Circular Action Arrow */}
                  <div className="w-7 h-7 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200/90 dark:border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white shadow-2xs shrink-0 group-hover:translate-x-0.5 transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>


        {/* ================= 3. LOWER SECTION (TWO COLUMNS: 65% LEFT, 35% RIGHT) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ================= LEFT COLUMN: ACTIVE THREAT BREAKDOWN ================= */}
          <div className="lg:col-span-7 xl:col-span-8 rounded-3xl bg-white dark:bg-[#121217] border border-black/[0.05] dark:border-white/10 p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-6">
            
            {/* Header: Warning Triangle + Threat Title + Critical Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
                    Active Threat Breakdown
                  </h2>
                  <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-400 block mt-0.5">
                    {activeRisk.title.toUpperCase()}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-tight bg-red-50 text-red-600 border border-red-200/70">
                {activeRisk.threatLevel}
              </span>
            </div>

            {/* Context Paragraph */}
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
              {activeRisk.description}
            </p>

            {/* Simulate Brent Crude Price Shock Slider Box */}
            <div className="p-5 rounded-2xl bg-[#F8F7F4] dark:bg-neutral-900/60 border border-neutral-200/70 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-neutral-900 dark:text-white">
                  Simulate Brent Crude Price Shock
                </span>
                <span className="font-bold text-red-600">
                  +{brentShockDelta > 0 ? `$${brentShockDelta}` : '$0'}/bbl <span className="font-semibold text-neutral-600 dark:text-neutral-400">(New Brent: ${newBrentPrice}/bbl)</span>
                </span>
              </div>

              {/* Range Slider */}
              <div className="pt-1">
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={brentShockDelta}
                  onChange={(e) => setBrentShockDelta(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider Ticks */}
              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium pt-1">
                <span>+$5/bbl (Minor Spike)</span>
                <span>+$15/bbl (Current Stress)</span>
                <span>+$40/bbl (Major Geopolitical Crisis)</span>
              </div>
            </div>

            {/* Two Stat Metric Cards Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Unhedged Loss (Light Red Tinted Card) */}
              <div className="p-5 rounded-2xl bg-[#FFF1F2] dark:bg-red-950/20 border border-[#FFE4E6] dark:border-red-900/40 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/90 dark:bg-red-900/30 text-red-500 flex items-center justify-center shrink-0 shadow-2xs">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-500 dark:text-neutral-400 block leading-tight">
                    UNHEDGED RIL EBITDA LOSS
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-red-600 tracking-tight block mt-1 leading-none">
                    -₹{dynamicUnhinged.toLocaleString()} Cr
                  </span>
                </div>
              </div>

              {/* Card 2: Mitigated Loss (Light Green Tinted Card) */}
              <div className="p-5 rounded-2xl bg-[#ECFDF5] dark:bg-emerald-950/20 border border-[#D1FAE5] dark:border-emerald-900/40 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/90 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase font-bold text-neutral-500 dark:text-neutral-400 block leading-tight">
                    MITIGATED LOSS VIA ETHANE SWING
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight block mt-1 leading-none">
                    -₹{dynamicMitigated.toLocaleString()} Cr
                  </span>
                </div>
              </div>

            </div>

          </div>


          {/* ================= RIGHT COLUMN: CRUDE PRICE & NEWS WIRE ================= */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 sm:space-y-5">
            
            {/* Card 1: Global Crude Price (Brent) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121217] border border-black/[0.05] dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
              
              {/* Header with Oil Droplet Icon & Timeframe Pills */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <Droplets className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Global Crude Price (Brent)
                  </h3>
                </div>

                {/* Timeframe Selector */}
                <div className="flex items-center gap-1 text-xs">
                  {(['1D', '1W', '1M', '1Y'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setActiveTimeframe(tf)}
                      className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                        activeTimeframe === tf
                          ? 'bg-[#EFECE6] dark:bg-neutral-800 text-neutral-900 dark:text-white font-bold'
                          : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Display */}
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    $99.1
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    /bbl
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <span>▲</span>
                  <span>+1.8% today</span>
                </span>
              </div>

              {/* Smooth Area Line Chart */}
              <div className="w-full h-18 relative pt-1">
                <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="crudeChartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Fill area */}
                  <path
                    d="M 0,50 Q 30,48 55,42 T 90,36 T 125,40 T 160,26 T 195,15 L 195,60 L 0,60 Z"
                    fill="url(#crudeChartGrad)"
                  />
                  {/* Stroke curve */}
                  <path
                    d="M 0,50 Q 30,48 55,42 T 90,36 T 125,40 T 160,26 T 195,15"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Terminal point dot */}
                  <circle cx="195" cy="15" r="3.5" fill="#10B981" />
                </svg>
              </div>

            </div>


            {/* Card 2: Live Market News Wire (Indian Chemical News) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121217] border border-black/[0.05] dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-600 animate-pulse" />
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                    Live Market News Wire (Indian Chemical News)
                  </h3>
                </div>
                <Link
                  href="/documents"
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-0.5 shrink-0"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* 3 News Rows with Real High-Res Thumbnails */}
              <div className="space-y-3">
                
                {/* News Item 1: Hydrogen storage tank */}
                <div className="flex items-center justify-between gap-3 group cursor-pointer p-1 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <div className="w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src="/images/green-hydrogen-tank.jpg"
                      alt="Green Hydrogen Tank"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-neutral-400 block font-medium">
                      22 Sep 2026
                    </span>
                    <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                      Elogen and Metrosert strike multi-year deal to expand solid oxide technology testing
                    </h4>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* News Item 2: Wind turbine clean energy */}
                <div className="flex items-center justify-between gap-3 group cursor-pointer p-1 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <div className="w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src="/images/wind-turbine-plant.jpg"
                      alt="Wind Energy Facility"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-neutral-400 block font-medium">
                      22 Sep 2026
                    </span>
                    <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                      Moeve launches €1 billion first phase of Europe&apos;s largest green hydrogen facility
                    </h4>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* News Item 3: Pumpjack sunset */}
                <div className="flex items-center justify-between gap-3 group cursor-pointer p-1 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                  <div className="w-14 h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-100 dark:bg-neutral-800">
                    <img
                      src="/images/oil-pumpjack-sunset.jpg"
                      alt="Oil Pumpjack Sunset"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-neutral-400 block font-medium">
                      22 Sep 2026
                    </span>
                    <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                      OPEC+ signals possible output adjustment amid rising geopolitical tensions
                    </h4>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white shrink-0 group-hover:translate-x-0.5 transition-all">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </AppShell>
  );
}
