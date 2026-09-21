'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus, Activity } from 'lucide-react';
import { MARKET_COMMODITIES } from '@/data/knowledgeStore';

export default function MarketTickerStrip() {
  return (
    <div className="w-full bg-white dark:bg-[#0D0D11] border-b border-neutral-200 dark:border-neutral-800 py-2.5 px-4 lg:px-8 flex items-center overflow-x-auto no-scrollbar select-none transition-colors duration-200">
      <div className="flex items-center gap-2 mr-6 pr-4 border-r border-neutral-200 dark:border-neutral-800 shrink-0">
        <span className="live-indicator live-pulse-anim" />
        <span className="text-xs font-bold tracking-wider text-neutral-800 dark:text-[#D4BA7B] uppercase flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Live Feed
        </span>
      </div>

      <div className="flex items-center gap-7 text-sm whitespace-nowrap">
        {MARKET_COMMODITIES.map((c) => {
          const isUp = c.change1D > 0;
          const isDown = c.change1D < 0;
          const targetHref = c.id === 'comm-ethylene' 
            ? '/market?tab=products&item=ethylene'
            : c.id === 'comm-propylene'
            ? '/market?tab=products&item=propylene'
            : c.id === 'comm-naphtha'
            ? '/market?tab=feedstocks&item=naphtha'
            : c.id === 'comm-ethane'
            ? '/market?tab=feedstocks&item=ethane'
            : c.id === 'comm-brent'
            ? '/market?tab=energy&item=brent'
            : c.id === 'comm-fx-usdinr'
            ? '/market?tab=fx'
            : '/market';

          return (
            <Link
              key={c.id}
              href={targetHref}
              className="flex items-center gap-2 group hover:text-[#BFA161] transition-colors"
            >
              <span className="text-neutral-500 dark:text-neutral-400 font-semibold group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                {c.symbol}
              </span>
              <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                {c.currency === 'USD' ? '$' : '₹'}
                {c.currentPrice.toLocaleString(undefined, { minimumFractionDigits: c.currentPrice < 100 ? 2 : 0 })}
              </span>
              <span
                className={`flex items-center text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${
                  isUp
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : isDown
                    ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                ) : isDown ? (
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                ) : (
                  <Minus className="w-3.5 h-3.5 mr-0.5" />
                )}
                {isUp ? '+' : ''}
                {c.change1D.toFixed(2)}%
              </span>
            </Link>
          );
        })}

        {/* Integrated Gross Delta Spreads */}
        <div className="flex items-center gap-5 pl-5 border-l border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-neutral-500 dark:text-neutral-400">Ethylene-Naphtha:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">+$155/t</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-neutral-500 dark:text-neutral-400">Ethylene-Ethane:</span>
            <span className="font-mono text-[#8F7640] dark:text-[#D4BA7B] font-extrabold">+$695/t</span>
          </div>
        </div>
      </div>
    </div>
  );
}
