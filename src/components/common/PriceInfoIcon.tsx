'use client';

import React, { useState } from 'react';
import { Info, X, ExternalLink, ShieldCheck, TrendingUp, DollarSign, Database, CheckCircle2 } from 'lucide-react';
import { getCommodityIntelligence, CommodityIntelligenceData } from '@/data/commodityIntelligence';

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
  const info: CommodityIntelligenceData = getCommodityIntelligence(commodityId);

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4'
  };

  const buttonPaddings = {
    xs: 'p-0.5',
    sm: 'p-1',
    md: 'p-1.5'
  };

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <>
      {/* Small interactive "i" button beside the name/price */}
      <button
        type="button"
        onClick={handleOpen}
        title={`View methodology & Reliance impact for ${info.shortName}`}
        aria-label={`Information on ${info.name}`}
        className={`inline-flex items-center justify-center rounded-full bg-cyan-500/10 hover:bg-cyan-500/25 dark:bg-cyan-950/60 dark:hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-500/60 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-200 transition-all cursor-pointer select-none active:scale-95 ${buttonPaddings[size]} ${className}`}
      >
        <Info className={iconSizes[size]} />
      </button>

      {/* Floating 3D Frosted Glass Modal / Flyout */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-[#0D111A] border border-neutral-200 dark:border-neutral-700/80 rounded-2xl shadow-2xl p-6 lg:p-7 relative overflow-hidden backdrop-blur-2xl text-left select-text"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient specular highlight */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header with Close Button */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800 relative z-10">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 uppercase">
                    METRIC METHODOLOGY
                  </span>
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                    {info.symbol}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    {info.updateFrequency}
                  </span>
                </div>
                <h3 className="text-lg lg:text-xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono">
                  {info.name}
                </h3>
                {currentPrice !== undefined && (
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-xl font-extrabold font-mono text-neutral-900 dark:text-white">
                      ${currentPrice} {unit || info.unit}
                    </span>
                    {change1D !== undefined && (
                      <span className={`text-xs font-mono font-bold ${
                        change1D >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {change1D >= 0 ? '+' : ''}{change1D.toFixed(2)}% Today
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer"
                title="Close information"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Information Body */}
            <div className="mt-5 space-y-4 max-h-[68vh] overflow-y-auto pr-1 text-xs sm:text-sm font-sans relative z-10">
              
              {/* Card 1: Data Source */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-500" />
                  Primary Data Source & Methodology
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                  {info.source}
                </p>
              </div>

              {/* Card 2: Why it Matters in O2C */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  Why This Metric Matters in the O2C Industry
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {info.whyItMatters}
                </p>
              </div>

              {/* Card 3: How it Affects Reliance */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 via-neutral-50 to-neutral-50 dark:from-emerald-950/40 dark:via-neutral-900/70 dark:to-neutral-900/70 border border-emerald-500/30 dark:border-emerald-800/60">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  How It Affects Reliance Industries (O2C Assets)
                </div>
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                  {info.relianceImpact}
                </p>
                <div className="mt-3 pt-2.5 border-t border-emerald-500/20 dark:border-emerald-800/40 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <span className="font-bold shrink-0">EBITDA SENSITIVITY:</span>
                  <span>{info.ebitdaSensitivity}</span>
                </div>
              </div>

              {/* Card 4: Reliance Strategic Moat */}
              <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                <CheckCircle2 className="w-4 h-4 text-[#8F7640] dark:text-[#D4BA7B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 mr-1">
                    Reliance Strategic Advantage:
                  </span>
                  <span>{info.strategicMoat}</span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              <span>Asset Coverage: Jamnagar • Dahej • Hazira • Nagothane</span>
              <button
                type="button"
                onClick={handleClose}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-200 dark:text-neutral-900 font-bold transition-all cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
