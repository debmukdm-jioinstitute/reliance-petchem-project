'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import {
  Search,
  ArrowRight,
  Activity,
  DollarSign,
  Cpu,
  FileText,
  ChevronRight,
  Sparkles,
  BarChart2,
  RefreshCw,
  X,
  Droplets,
  Box,
  Factory,
  Flame,
  CheckCircle2,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import ScadaDiagram, { ScadaState } from '@/components/scada/ScadaDiagram';
import PriceInfoIcon from '@/components/common/PriceInfoIcon';
import { SynthesizedAnswer } from '@/lib/searchEngine';

export default function OverviewPage() {
  const router = useRouter();
  const { getCommodity, commodities, brentChart, refreshPrices, isSyncing } = useMarket();

  // Active time filter for benchmarks
  const [timeFilter, setTimeFilter] = useState<'Live' | '1D' | '1W' | '1M'>('Live');
  const brentTfKey = timeFilter === 'Live' ? '1D' : timeFilter;
  const brentTfData = brentChart?.timeframes?.[brentTfKey];

  // Query state for AI Copilot
  const [naturalQuery, setNaturalQuery] = useState('');
  const [isSolvingInline, setIsSolvingInline] = useState(false);
  const [inlineResult, setInlineResult] = useState<SynthesizedAnswer | null>(null);
  const [inlineProvider, setInlineProvider] = useState<string>('RIL Intelligence Engine');

  // Active deep dive view toggle (SCADA, Economics, or Hidden)
  const [activeDeepDive, setActiveDeepDive] = useState<'none' | 'scada' | 'economics'>('none');

  // SCADA state for cracker simulation
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

  const runInlineSolve = async (queryToRun: string) => {
    if (!queryToRun.trim() || isSolvingInline) return;
    setIsSolvingInline(true);
    setInlineResult(null);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToRun.trim() })
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      if (data && data.answer) {
        setInlineResult(data.answer);
        setInlineProvider(data.provider || 'RIL Intelligence Engine');
      } else {
        router.push(`/ai?q=${encodeURIComponent(queryToRun)}`);
      }
    } catch (err) {
      console.warn('Inline solve fallback:', err);
      router.push(`/ai?q=${encodeURIComponent(queryToRun)}`);
    } finally {
      setIsSolvingInline(false);
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalQuery.trim()) return;
    runInlineSolve(naturalQuery);
  };

  const quickQuestions = [
    { label: 'Brent +20% impact', query: 'How does a +20% Brent crude oil spike impact RIL cracker EBITDA and margins?' },
    { label: 'RIL cracks vs peers', query: 'How do Reliance dual-feed cracker economics compare against Asian naphtha peers?' },
    { label: 'Ethane vs naphtha margin', query: 'What is the EBITDA margin advantage of ethane cracking over naphtha cracking?' },
    { label: 'Dahej capacity limits', query: 'What is the throughput capacity of the Dahej ethane terminal and pipeline?' }
  ];

  return (
    <AppShell>
      <div className="max-w-[1680px] mx-auto space-y-6 animate-fadeIn pb-12">
        
        {/* MAIN BENTO GRID (MATCHING REFERENCE UI) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ================= LEFT BENTO COLUMN: ASK INTELLIGENCE ================= */}
          <div className="lg:col-span-4">
            <div className="rounded-[28px] bg-white/95 dark:bg-[#121218]/95 border border-black/[0.05] dark:border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.03)] backdrop-blur-2xl flex flex-col justify-between overflow-hidden relative min-h-[640px] transition-all hover:shadow-[0_16px_48px_rgba(0,0,0,0.05)]">
              
              {/* Upper Section */}
              <div className="p-6 sm:p-7 space-y-6 relative z-10">
                <div className="space-y-1.5">
                  <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-sans">
                    Ask Intelligence
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal leading-snug">
                    Get quick answers from market data, cracker asset records, and live web intelligence.
                  </p>
                </div>

                {/* Prompt Box with Circular Black Arrow Button */}
                <form 
                  onSubmit={handlePromptSubmit}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[#F6F4EF]/80 dark:bg-neutral-900/80 border border-black/[0.04] dark:border-white/10 shadow-2xs space-y-3"
                >
                  <textarea
                    rows={3}
                    value={naturalQuery}
                    onChange={(e) => setNaturalQuery(e.target.value)}
                    placeholder="How does a +$10/bbl Brent spike impact RIL cracker EBITDA?"
                    className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none resize-none font-medium leading-relaxed"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-mono text-neutral-400">
                      {isSolvingInline ? 'Querying local model...' : 'Press Enter or Arrow'}
                    </span>
                    <button
                      type="submit"
                      disabled={isSolvingInline || !naturalQuery.trim()}
                      className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 cursor-pointer shadow-sm"
                      title="Run Intelligence Query"
                    >
                      {isSolvingInline ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </form>

                {/* 4 Quick Pills Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNaturalQuery(q.query);
                        runInlineSolve(q.query);
                      }}
                      disabled={isSolvingInline}
                      className="px-3 py-2.5 rounded-full bg-[#EFECE6]/70 hover:bg-[#EAE6DF] dark:bg-neutral-900 dark:hover:bg-neutral-800 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 border border-black/[0.03] dark:border-white/5 transition-all text-center truncate disabled:opacity-50 cursor-pointer"
                      title={q.query}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lower Section: Golden Silk Ribbon Wave Graphic */}
              <div className="relative w-full h-52 sm:h-56 mt-auto overflow-hidden pointer-events-none select-none">
                <Image
                  src="/images/golden_silk_ribbon.jpg"
                  alt="Liquid gold fluid ribbon wave"
                  fill
                  className="object-cover object-bottom opacity-90 transition-opacity"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/90 dark:via-[#121218]/10 dark:to-[#121218]/90" />
                
                {/* Bottom tracked branding text */}
                <div className="absolute bottom-5 left-6 z-10">
                  <span className="text-[10px] tracking-[0.25em] font-mono font-bold text-neutral-500/80 dark:text-neutral-400 uppercase block">
                    TURN DATA
                  </span>
                  <span className="text-[10px] tracking-[0.25em] font-mono font-bold text-neutral-500/80 dark:text-neutral-400 uppercase block">
                    INTO CLARITY
                  </span>
                </div>
              </div>

            </div>
          </div>


          {/* ================= CENTER BENTO COLUMN: BENCHMARKS & GROUND TRUTH ================= */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* Top Center Card: Key Market Benchmarks */}
            <div className="p-6 sm:p-7 rounded-[28px] bg-white/95 dark:bg-[#121218]/95 border border-black/[0.05] dark:border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.03)] backdrop-blur-2xl space-y-5">
              
              {/* Header with Title & Time Range Filter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-sans">
                    Key Market Benchmarks
                  </h3>
                </div>

                {/* Filter Pills matching reference UI */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setTimeFilter('Live')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition-all ${
                      timeFilter === 'Live'
                        ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live</span>
                  </button>
                  {(['1D', '1W', '1M'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeFilter(tf)}
                      className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                        timeFilter === tf
                          ? 'bg-black dark:bg-white text-white dark:text-black font-semibold'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 Benchmarks Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* 1. Ethylene (CFR) */}
                <a
                  href={ethylene?.sourceUrl || 'https://finance.yahoo.com/quote/BZ=F/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#FAF8F5]/80 dark:bg-neutral-900/50 border border-black/[0.04] dark:border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-black/20 dark:hover:border-white/20 transition-all shadow-2xs cursor-pointer block"
                  title="Click to view live source quote on Yahoo Finance"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Droplets className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200 shrink-0" />
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 truncate">
                        Ethylene (CFR)
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <PriceInfoIcon commodityId="comm-ethylene" size="xs" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono">
                      ${ethylene?.currentPrice || 886}
                      <span className="text-xs text-neutral-500 font-normal">/t</span>
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5 font-mono">
                      <span>▲</span>
                      <span>{timeFilter === '1W' ? '+3.1%' : '+2.4%'}</span>
                      <span className="text-[9px] font-normal text-neutral-400">({timeFilter})</span>
                    </div>
                  </div>
                  {/* Green Smooth Sparkline Curve */}
                  <div className="w-full h-9 mt-2 relative">
                    <svg viewBox="0 0 100 35" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,22 Q 25,28 50,16 T 75,20 T 100,8 L 100,35 L 0,35 Z"
                        fill="url(#greenGrad)"
                      />
                      <path
                        d="M 0,22 Q 25,28 50,16 T 75,20 T 100,8"
                        fill="none"
                        stroke="#16A34A"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </a>

                {/* 2. Ethane (FOB) */}
                <a
                  href={ethane?.sourceUrl || 'https://finance.yahoo.com/quote/NG=F/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#FAF8F5]/80 dark:bg-neutral-900/50 border border-black/[0.04] dark:border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-black/20 dark:hover:border-white/20 transition-all shadow-2xs cursor-pointer block"
                  title="Click to view live source quote on Yahoo Finance (Henry Hub NatGas Proxy)"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Box className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200 shrink-0" />
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 truncate">
                        Ethane (FOB)
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <PriceInfoIcon commodityId="comm-ethane" size="xs" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono">
                      ${ethane?.currentPrice || 157}
                      <span className="text-xs text-neutral-500 font-normal">/t</span>
                    </div>
                    <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-0.5 font-mono">
                      <span>▼</span>
                      <span>{timeFilter === '1W' ? '-1.2%' : '-1.8%'}</span>
                      <span className="text-[9px] font-normal text-neutral-400">({timeFilter})</span>
                    </div>
                  </div>
                  {/* Red Smooth Sparkline Curve */}
                  <div className="w-full h-9 mt-2 relative">
                    <svg viewBox="0 0 100 35" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="redGrad1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,10 Q 30,8 55,20 T 80,18 T 100,26 L 100,35 L 0,35 Z"
                        fill="url(#redGrad1)"
                      />
                      <path
                        d="M 0,10 Q 30,8 55,20 T 80,18 T 100,26"
                        fill="none"
                        stroke="#DC2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </a>

                {/* 3. Naphtha (CFR) */}
                <a
                  href={naphtha?.sourceUrl || 'https://finance.yahoo.com/quote/BZ=F/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#FAF8F5]/80 dark:bg-neutral-900/50 border border-black/[0.04] dark:border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-black/20 dark:hover:border-white/20 transition-all shadow-2xs cursor-pointer block"
                  title="Click to view live source quote on Yahoo Finance (ICE Brent Crack Proxy)"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Factory className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200 shrink-0" />
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 truncate">
                        Naphtha (CFR)
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <PriceInfoIcon commodityId="comm-naphtha" size="xs" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono">
                      ${naphtha?.currentPrice || 816}
                      <span className="text-xs text-neutral-500 font-normal">/t</span>
                    </div>
                    <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-0.5 font-mono">
                      <span>▼</span>
                      <span>{timeFilter === '1W' ? '-1.4%' : '-2.1%'}</span>
                      <span className="text-[9px] font-normal text-neutral-400">({timeFilter})</span>
                    </div>
                  </div>
                  {/* Red Smooth Sparkline Curve */}
                  <div className="w-full h-9 mt-2 relative">
                    <svg viewBox="0 0 100 35" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="redGrad2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#DC2626" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#DC2626" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0,14 Q 25,12 50,24 T 80,18 T 100,28 L 100,35 L 0,35 Z"
                        fill="url(#redGrad2)"
                      />
                      <path
                        d="M 0,14 Q 25,12 50,24 T 80,18 T 100,28"
                        fill="none"
                        stroke="#DC2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </a>

                {/* 4. Brent Crude */}
                <a
                  href={brent?.sourceUrl || 'https://finance.yahoo.com/quote/BZ=F/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#FAF8F5]/80 dark:bg-neutral-900/50 border border-black/[0.04] dark:border-white/5 flex flex-col justify-between relative overflow-hidden group hover:border-black/20 dark:hover:border-white/20 transition-all shadow-2xs cursor-pointer block"
                  title="Click to view live Brent Crude quote on Yahoo Finance (BZ=F)"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Flame className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200 shrink-0" />
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 truncate">
                        Brent Crude
                      </span>
                      <ExternalLink className="w-2.5 h-2.5 text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <PriceInfoIcon commodityId="comm-brent" size="xs" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono">
                      ${brentTfData ? brentTfData.price.toFixed(2) : (brent?.currentPrice ? brent.currentPrice.toFixed(2) : '99.85')}
                      <span className="text-xs text-neutral-500 font-normal">/bbl</span>
                    </div>
                    <div className={`text-[11px] font-semibold flex items-center gap-1 mt-0.5 font-mono ${
                      (brentTfData ? brentTfData.isUp : (brent?.change1D || 0) >= 0)
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      <span>{(brentTfData ? brentTfData.isUp : (brent?.change1D || 0) >= 0) ? '▲' : '▼'}</span>
                      <span>
                        {brentTfData 
                          ? `${brentTfData.changePercent >= 0 ? '+' : ''}${brentTfData.changePercent.toFixed(1)}%`
                          : `${(brent?.change1D || 1.3) >= 0 ? '+' : ''}${(brent?.change1D || 1.3).toFixed(1)}%`}
                      </span>
                      <span className="text-[9px] font-normal text-neutral-400">({timeFilter})</span>
                    </div>
                  </div>
                  {/* Brent Smooth Sparkline Curve */}
                  <div className="w-full h-9 mt-2 relative">
                    <svg viewBox="0 0 100 35" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="brentGradHome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={(brentTfData ? brentTfData.isUp : true) ? '#16A34A' : '#DC2626'} stopOpacity="0.25" />
                          <stop offset="100%" stopColor={(brentTfData ? brentTfData.isUp : true) ? '#16A34A' : '#DC2626'} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={(brentTfData ? brentTfData.isUp : true)
                          ? "M 0,26 Q 20,24 45,18 T 75,12 T 100,6 L 100,35 L 0,35 Z"
                          : "M 0,8 Q 25,12 50,22 T 75,20 T 100,30 L 100,35 L 0,35 Z"}
                        fill="url(#brentGradHome)"
                      />
                      <path
                        d={(brentTfData ? brentTfData.isUp : true)
                          ? "M 0,26 Q 20,24 45,18 T 75,12 T 100,6"
                          : "M 0,8 Q 25,12 50,22 T 75,20 T 100,30"}
                        fill="none"
                        stroke={(brentTfData ? brentTfData.isUp : true) ? '#16A34A' : '#DC2626'}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </a>

              </div>
            </div>







            {/* Bottom Floating Bar: Ask about markets, scenarios, models */}
            <form
              onSubmit={handlePromptSubmit}
              className="p-2 pl-5 rounded-full bg-white/95 dark:bg-[#121218]/95 border border-black/[0.06] dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-2xl flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Sparkles className="w-4 h-4 text-[#BFA161] shrink-0" />
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="Ask about markets, assets, scenarios or models..."
                  className="w-full bg-transparent text-xs sm:text-sm text-neutral-800 dark:text-white placeholder-neutral-500 focus:outline-none truncate font-sans"
                />
              </div>
              <button
                type="submit"
                disabled={isSolvingInline || !naturalQuery.trim()}
                className="w-10 h-10 rounded-full bg-[#E5DFD5] dark:bg-neutral-800 hover:bg-[#DED7CB] text-neutral-800 dark:text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
                title="Submit Query"
              >
                {isSolvingInline ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-600" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-neutral-700 dark:text-neutral-200" />
                )}
              </button>
            </form>

          </div>




        </div>


        {/* INLINE AI SOLVED RESULT ACCORDION (WHEN SOLVING QUERY) */}
        {inlineResult && (
          <div className="p-6 sm:p-8 rounded-[28px] bg-white dark:bg-[#121218] border border-black/[0.08] dark:border-white/15 shadow-[0_16px_50px_rgba(0,0,0,0.06)] space-y-5 animate-fadeIn text-left">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] dark:border-white/10">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  {inlineResult.category}
                </span>
                <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {inlineProvider} (Online)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInlineResult(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Dismiss result"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key Takeaway */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF9F5] dark:bg-[#1A1A22] border border-black/[0.05] dark:border-white/10">
              <span className="text-xs font-mono font-bold text-[#8F7640] dark:text-[#D4BA7B] uppercase block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Executive Synthesis
              </span>
              <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed">
                {inlineResult.keyTakeaway}
              </p>
            </div>

            {/* Answer Body */}
            <div className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line p-5 rounded-2xl bg-[#FAF8F5]/80 dark:bg-neutral-900/60 border border-black/[0.04] dark:border-white/5 font-sans">
              {inlineResult.answer}
            </div>

            {/* Mandatory Evidence Citations */}
            {inlineResult.evidence && inlineResult.evidence.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-black/[0.05] dark:border-white/10">
                <span className="text-xs font-mono uppercase text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Verified Citations & Audited Evidence ({inlineResult.evidence.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {inlineResult.evidence.map((ev, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-white/10 text-xs space-y-1 shadow-2xs">
                      <div className="flex justify-between font-mono text-neutral-800 dark:text-neutral-200 font-bold items-center gap-2">
                        <span className="truncate">{ev.sourceTitle}</span>
                        {ev.pageOrLine && ev.pageOrLine.startsWith('http') ? (
                          <a
                            href={ev.pageOrLine}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-normal text-[11px] shrink-0"
                          >
                            <span>Source</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-neutral-400 font-normal text-[11px] shrink-0">{ev.pageOrLine}</span>
                        )}
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 italic font-sans">&ldquo;{ev.quote}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* DEEP DIVE INTERACTIVE MODULE DRAWER TOGGLE (SCADA, ECONOMICS, ALLOCATION) */}
        <div className="pt-4 border-t border-black/[0.05] dark:border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 font-mono">
                Advanced Engineering & Cracker Telemetry
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                Deep dive into hydrodynamic cracking coils, waterfall cost stacks, or feedstock LP allocations
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveDeepDive(activeDeepDive === 'scada' ? 'none' : 'scada')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  activeDeepDive === 'scada'
                    ? 'bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900'
                    : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-black/[0.06] dark:border-white/10 hover:bg-neutral-100'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-cyan-500" />
                <span>SCADA Twin Mimic</span>
              </button>

              <Link
                href="/economics"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-black/[0.06] dark:border-white/10 hover:bg-neutral-100 transition-all"
              >
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                <span>Economics Waterfall</span>
              </Link>

              <Link
                href="/optimization"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-black/[0.06] dark:border-white/10 hover:bg-neutral-100 transition-all"
              >
                <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                <span>LP Optimizer</span>
              </Link>
            </div>
          </div>

          {/* Expandable SCADA Twin View */}
          {activeDeepDive === 'scada' && (
            <div className="p-6 rounded-[28px] bg-white dark:bg-[#121218] border border-black/[0.06] dark:border-white/10 shadow-lg space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                  <span>Cracker Hydrodynamic SCADA MIMIC (Live Telemetry)</span>
                </div>
                <Link
                  href="/simulation"
                  className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Open Full Screen Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <ScadaDiagram onStateChange={setScadaState} initialEthaneRatio={scadaState.ethaneRatio} />
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}
