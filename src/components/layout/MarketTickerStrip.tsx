'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus, Activity } from 'lucide-react';
import { MARKET_COMMODITIES } from '@/data/knowledgeStore';

export default function MarketTickerStrip() {
  return (
    <div className="w-full bg-[#0B0F17] border-b border-[#1A2232] py-2 px-4 flex items-center overflow-x-auto no-scrollbar select-none">
      <div className="flex items-center gap-2 mr-4 pr-3 border-r border-[#1E2738] shrink-0">
        <span className="live-indicator live-pulse-anim" />
        <span className="text-[11px] font-semibold tracking-wider text-[#BFA161] uppercase flex items-center gap-1">
          <Activity className="w-3 h-3" /> Live Cracker Feed
        </span>
      </div>

      <div className="flex items-center gap-6 text-xs whitespace-nowrap">
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
              <span className="text-[#94A3B8] font-medium group-hover:text-white transition-colors">
                {c.symbol}
              </span>
              <span className="font-tabular font-semibold text-[#F8FAFC]">
                {c.currency === 'USD' ? '$' : '₹'}
                {c.currentPrice.toLocaleString(undefined, { minimumFractionDigits: c.currentPrice < 100 ? 2 : 0 })}
              </span>
              <span
                className={`flex items-center text-[11px] font-tabular font-medium ${
                  isUp
                    ? 'text-[#10B981]'
                    : isDown
                    ? 'text-[#F43F5E]'
                    : 'text-[#94A3B8]'
                }`}
              >
                {isUp ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : isDown ? (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <Minus className="w-3 h-3 mr-0.5" />
                )}
                {isUp ? '+' : ''}
                {c.change1D.toFixed(2)}%
              </span>
            </Link>
          );
        })}

        {/* Integrated Gross Delta Spreads */}
        <div className="flex items-center gap-4 pl-4 border-l border-[#1E2738]">
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-[#64748B]">ETH-NAPH DELTA:</span>
            <span className="font-tabular text-[#10B981] font-semibold">+$155/t</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-[#64748B]">ETH-ETHANE DELTA:</span>
            <span className="font-tabular text-[#BFA161] font-bold">+$695/t</span>
          </div>
        </div>
      </div>
    </div>
  );
}
