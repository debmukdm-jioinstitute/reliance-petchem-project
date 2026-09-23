'use client';

import React, { useState, useEffect, useCallback, useId } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { 
  Info, 
  X, 
  TrendingUp, 
  DollarSign, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  ExternalLink, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Building2,
  Layers,
  BarChart3,
  Flame,
  Ship
} from 'lucide-react';
import { getCommodityIntelligence, CommodityIntelligenceData } from '@/data/commodityIntelligence';

const YAHOO_SOURCE_MAP: Record<string, string> = {
  'comm-brent': 'https://finance.yahoo.com/quote/BZ=F/',
  'comm-natgas': 'https://finance.yahoo.com/quote/NG=F/',
  'comm-fx-usdinr': 'https://finance.yahoo.com/quote/INR=X/',
  'comm-ethane': 'https://finance.yahoo.com/quote/NG=F/',
  'comm-naphtha': 'https://finance.yahoo.com/quote/BZ=F/',
  'comm-ethylene': 'https://finance.yahoo.com/quote/BZ=F/',
  'comm-propylene': 'https://finance.yahoo.com/quote/BZ=F/',
  'comm-hdpe': 'https://finance.yahoo.com/quote/RELIANCE.NS/',
  'comm-pp': 'https://finance.yahoo.com/quote/RELIANCE.NS/',
  'comm-meg': 'https://finance.yahoo.com/quote/RELIANCE.NS/',
  'comm-o2c-margin': 'https://finance.yahoo.com/quote/RELIANCE.NS/',
};

interface PriceInfoIconProps {
  commodityId: string;
  currentPrice?: number | string;
  currency?: string;
  unit?: string;
  change1D?: number;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

export default function PriceInfoIcon({
  commodityId,
  currentPrice,
  currency = 'USD',
  unit,
  change1D,
  className = '',
  size = 'sm'
}: PriceInfoIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sensitivity' | 'methodology'>('overview');
  const [priceShift, setPriceShift] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);
  const titleId = useId();

  const info: CommodityIntelligenceData = getCommodityIntelligence(commodityId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPriceShift(0);
    setIsOpen(true);
  };

  const handleClose = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsOpen(false);
  }, []);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5'
  };

  const buttonPaddings = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2'
  };

  // Sensitivity calculations
  const numericPrice = typeof currentPrice === 'number' 
    ? currentPrice 
    : typeof currentPrice === 'string' && !isNaN(parseFloat(currentPrice.replace(/[^0-9.-]+/g, '')))
    ? parseFloat(currentPrice.replace(/[^0-9.-]+/g, ''))
    : 100;

  // Calculate simulated EBITDA impact:
  // Base rule: ~$35M to $42M USD (₹300 - ₹350 Cr) per $10/t shift for primary olefins
  const isOilLinked = info.id.includes('brent') || info.id.includes('margin');
  const sensitivityMultiplierUsd = isOilLinked ? 55 : 4.2; // $M per dollar/tonne
  const simulatedUsdImpact = (priceShift * sensitivityMultiplierUsd).toFixed(1);
  const simulatedInrImpact = (priceShift * sensitivityMultiplierUsd * 8.65).toFixed(0);

  const modalContent = isOpen ? (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn"
      onClick={() => handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0B0F19] text-white border border-neutral-700/80 rounded-3xl shadow-2xl shadow-cyan-950/50 relative overflow-hidden backdrop-blur-2xl text-left select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Specular Highlight Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        {/* TOP EXECUTIVE HEADER */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-7 border-b border-neutral-800/80 bg-neutral-900/60 relative z-10 shrink-0">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-wide">
                <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
                PETCHEM INTELLIGENCE
              </span>
              <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-neutral-800 text-neutral-300 border border-neutral-700">
                {info.symbol}
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                {info.updateFrequency}
              </span>
              <a
                href={YAHOO_SOURCE_MAP[commodityId] || 'https://finance.yahoo.com/quote/BZ=F/'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-semibold rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition-colors"
                title="View live quote on Yahoo Finance"
              >
                <span>Yahoo Finance</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <h2 id={titleId} className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
              {info.name}
            </h2>

            {currentPrice !== undefined && (
              <div className="flex flex-wrap items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
                  ${currentPrice} <span className="text-sm font-semibold text-neutral-400">{unit || info.unit}</span>
                </span>
                {change1D !== undefined && (
                  <span className={`text-xs sm:text-sm font-mono font-bold px-2.5 py-0.5 rounded-md ${
                    change1D >= 0 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}>
                    {change1D >= 0 ? '+' : ''}{change1D.toFixed(2)}% Today
                  </span>
                )}
                <span className="text-xs text-neutral-400 font-mono">
                  Benchmark: Spot CIF / CFR India Parity
                </span>
              </div>
            )}
          </div>

          {/* Prominent High-Contrast Close Button */}
          <button
            type="button"
            onClick={() => handleClose()}
            className="group flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-neutral-800/90 hover:bg-neutral-700/90 text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-500 transition-all cursor-pointer shadow-lg active:scale-95 shrink-0"
            title="Close this screen (Esc)"
            aria-label="Close intelligence window"
          >
            <span className="hidden sm:inline text-xs font-mono font-semibold">CLOSE</span>
            <div className="p-1 rounded-full bg-neutral-700/60 group-hover:bg-rose-500/20 group-hover:text-rose-400 transition-colors">
              <X className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-700">ESC</span>
          </button>
        </div>

        {/* TAB NAVIGATION STRIP */}
        <div className="flex items-center gap-2 px-5 sm:px-7 pt-4 pb-1 border-b border-neutral-800 bg-[#0E1320] relative z-10 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-transparent'
            }`}
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Strategic Overview & Impact</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sensitivity')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sensitivity'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-transparent'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>EBITDA Sensitivity Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('methodology')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'methodology'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-transparent'
            }`}
          >
            <Database className="w-4 h-4 text-purple-400" />
            <span>Methodology & Asset Coverage</span>
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 relative z-10 font-sans">
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Card 1: Why It Matters (Hero Highlight) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-neutral-900/80 to-[#101422] border border-amber-500/30 shadow-lg shadow-amber-950/20">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-amber-400 uppercase tracking-wider mb-2.5">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Why This Metric Matters in the O2C Industry
                </div>
                <p className="text-neutral-100 text-sm sm:text-base leading-relaxed font-normal">
                  {info.whyItMatters}
                </p>
              </div>

              {/* Card 2: Reliance Impact */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-neutral-900/90 to-[#101422] border border-emerald-500/35 shadow-lg shadow-emerald-950/20">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  How It Affects Reliance Industries (O2C Assets)
                </div>
                <p className="text-neutral-100 text-sm sm:text-base leading-relaxed font-normal">
                  {info.relianceImpact}
                </p>
                
                <div className="mt-4 pt-3.5 border-t border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-emerald-300">
                    <span className="font-bold text-emerald-400">FINANCIAL SENSITIVITY:</span>
                    <span>{info.ebitdaSensitivity}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Reliance Strategic Advantage / Moat */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-neutral-900/90 to-[#101422] border border-cyan-500/30">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wide font-mono">
                      Reliance Strategic Moat & Competitive Defense
                    </h4>
                    <p className="text-neutral-200 text-sm sm:text-base leading-relaxed">
                      {info.strategicMoat}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sensitivity' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-6 rounded-2xl bg-neutral-900/80 border border-amber-500/30 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-amber-400" />
                      Interactive Price Sensitivity Simulator
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                      Drag the slider to project the annualized impact of market price moves on Reliance O2C segment EBITDA.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPriceShift(0)}
                    className="self-start sm:self-auto px-3 py-1.5 text-xs font-mono rounded-lg bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 cursor-pointer"
                  >
                    Reset (+$0)
                  </button>
                </div>

                {/* Slider Control */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-neutral-300">Simulated Price Delta:</span>
                    <span className={`text-base font-bold px-3 py-1 rounded-lg ${
                      priceShift > 0 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : priceShift < 0
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-neutral-800 text-neutral-300 border border-neutral-700'
                    }`}>
                      {priceShift >= 0 ? '+' : ''}${priceShift}/t
                    </span>
                  </div>

                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="5"
                    value={priceShift}
                    onChange={(e) => setPriceShift(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />

                  <div className="flex justify-between text-xs font-mono text-neutral-400 px-1">
                    <span>-$50/t (Bearish)</span>
                    <span>Baseline ($0)</span>
                    <span>+$50/t (Bullish)</span>
                  </div>
                </div>

                {/* Impact Output Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                    <div className="text-xs font-mono text-neutral-400">Annualized EBITDA Impact (USD)</div>
                    <div className={`text-2xl font-bold font-mono ${
                      priceShift >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {priceShift >= 0 ? '+' : ''}${simulatedUsdImpact} Million
                    </div>
                    <div className="text-xs text-neutral-400">Based on Reliance O2C capacity</div>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                    <div className="text-xs font-mono text-neutral-400">Annualized EBITDA Impact (INR)</div>
                    <div className={`text-2xl font-bold font-mono ${
                      priceShift >= 0 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {priceShift >= 0 ? '+' : ''}₹{simulatedInrImpact} Crore
                    </div>
                    <div className="text-xs text-neutral-400">FX rate @ ₹86.5 / USD</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-neutral-200 space-y-1">
                  <div className="font-bold text-emerald-400 font-mono uppercase">Operational Sensitivity Rule:</div>
                  <p className="leading-relaxed text-neutral-100">
                    {info.ebitdaSensitivity}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'methodology' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Card: Primary Data Source */}
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Primary Data Source & Calculation Engine
                </div>
                <p className="text-neutral-100 text-sm sm:text-base leading-relaxed">
                  {info.source}
                </p>
                <div className="pt-3 border-t border-neutral-800 flex flex-wrap gap-4 text-xs font-mono text-neutral-300">
                  <div>
                    <span className="text-neutral-400">Polling Cadence:</span> {info.updateFrequency}
                  </div>
                  <div>
                    <span className="text-neutral-400">Unit Basis:</span> {info.unit}
                  </div>
                </div>
              </div>

              {/* Card: Physical Asset Coverage */}
              <div className="p-5 sm:p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-purple-400 uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  Reliance Manufacturing Complex & Asset Nodes
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> Jamnagar ROGC & DTA/SEZ
                    </div>
                    <div className="text-neutral-300 mt-1 text-xs">
                      1.5 MMTPA ROGC cracker feeding captive downstream Relene PE, PP, and MEG plants.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                      <Ship className="w-3.5 h-3.5 text-cyan-400" /> Dahej Cryogenic Terminal
                    </div>
                    <div className="text-neutral-300 mt-1 text-xs">
                      Dedicated deep-water berths unloading 6 VLEC ships from US Gulf Coast with sub-zero pipelines.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" /> Hazira Cracker Complex
                    </div>
                    <div className="text-neutral-300 mt-1 text-xs">
                      Dual-feed cracker converting US ethane & naphtha into high-purity polymer building blocks.
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800">
                    <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                      <Building2 className="w-3.5 h-3.5 text-purple-400" /> Nagothane & Vadodara
                    </div>
                    <div className="text-neutral-300 mt-1 text-xs">
                      Gas-cracking assets interconnected via pipeline grid supplying Western India industrial belts.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="p-4 sm:p-5 border-t border-neutral-800 bg-[#0A0D16] flex flex-wrap items-center justify-between gap-3 relative z-10 shrink-0">
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-300">
            <span className="hidden sm:inline">Coverage: Jamnagar • Dahej • Hazira • Nagothane</span>
            <div className="flex items-center gap-2">
              <Link
                href="/simulation"
                onClick={() => handleClose()}
                className="hover:text-cyan-300 underline underline-offset-4 flex items-center gap-1 text-cyan-400"
              >
                Margin Calc <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-neutral-600">•</span>
              <Link
                href="/economics"
                onClick={() => handleClose()}
                className="hover:text-amber-300 underline underline-offset-4 flex items-center gap-1 text-amber-400"
              >
                Economics <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleClose()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-cyan-900/40 active:scale-95 flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Close Window</span>
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Small interactive "i" button beside the name/price */}
      <button
        type="button"
        onClick={handleOpen}
        title={`View methodology & Reliance impact for ${info.shortName}`}
        aria-label={`Information on ${info.name}`}
        className={`inline-flex items-center justify-center rounded-full bg-cyan-500/15 hover:bg-cyan-500/30 border border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-cyan-200 transition-all cursor-pointer select-none active:scale-95 shadow-xs ${buttonPaddings[size]} ${className}`}
      >
        <Info className={iconSizes[size]} />
      </button>

      {/* Render to document.body using createPortal so it escapes all parent CSS containers */}
      {isMounted && modalContent ? createPortal(modalContent, document.body) : null}
    </>
  );
}
