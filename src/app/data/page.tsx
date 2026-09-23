'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Rss,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function DataLayerPage() {
  const liveQuotes = [
    { name: 'Dated Brent Crude', ticker: 'BZ=F', source: 'Yahoo Finance', note: 'Fetched directly' },
    { name: 'Henry Hub Natural Gas', ticker: 'NG=F', source: 'Yahoo Finance', note: 'Fetched directly' },
    { name: 'USD/INR Exchange Rate', ticker: 'INR=X', source: 'Yahoo Finance', note: 'Fetched directly' },
  ];

  const derivedQuotes = [
    { name: 'Naphtha CFR Japan', basis: 'Brent × 7.5 + $85/t crack spread' },
    { name: 'US Ethane FOB', basis: 'Henry Hub NatGas × 28 + $76/t fractionator spread' },
    { name: 'Ethylene CFR', basis: '$620 + 22% of Naphtha + 55% of Ethane' },
    { name: 'Propylene CFR', basis: '94% of Ethylene' },
    { name: 'HDPE / PP / MEG', basis: 'Fixed offset or ratio off Ethylene/Propylene' },
  ];

  const newsFeeds = [
    { name: 'Indian Chemical News', url: 'indianchemicalnews.com/feed', category: 'Petchem & Hydrogen' },
    { name: 'Reliance & O2C Radar (Google News)', url: 'news.google.com/rss (search query)', category: 'RIL O2C Impact' },
    { name: 'OilPrice Global', url: 'oilprice.com/rss/main', category: 'Crude & OPEC' },
    { name: 'Feedstock & Chemicals (Google News)', url: 'news.google.com/rss (search query)', category: 'Feedstock Spread' },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-2xl bg-[#0B0F19] border border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#BFA161]" />
                Where the numbers on this site actually come from
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              DATA SOURCES
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Three instruments are fetched directly from Yahoo Finance. Every other commodity on this site
              (naphtha, ethane, ethylene, propylene, HDPE, PP, MEG) is derived from those three via fixed
              correlation formulas — not independently quoted. News comes from 4 public RSS feeds. Everything
              refreshes every 45 seconds via <code className="text-[#38BDF8]">/api/prices</code>.
            </p>
          </div>
        </div>

        {/* Directly fetched quotes */}
        <div className="rounded-xl border border-[#1A2232] bg-[#0E1420] overflow-hidden shadow-lg">
          <div className="px-5 py-3.5 border-b border-[#1A2232] flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Fetched Directly (Yahoo Finance)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#CBD5E1]">
              <thead className="bg-[#0A0E17] text-[#64748B] uppercase font-mono text-[10px] tracking-wider border-b border-[#1A2232]">
                <tr>
                  <th className="py-3 px-4">Instrument</th>
                  <th className="py-3 px-4">Ticker</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2232] font-mono">
                {liveQuotes.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#121A2B] transition-colors">
                    <td className="py-3 px-4 font-sans font-semibold text-[#F8FAFC]">{item.name}</td>
                    <td className="py-3 px-4 text-[#38BDF8]">{item.ticker}</td>
                    <td className="py-3 px-4 text-[#94A3B8]">{item.source}</td>
                    <td className="py-3 px-4 text-[#10B981]">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Derived commodities */}
        <div className="rounded-xl border border-[#1A2232] bg-[#0E1420] overflow-hidden shadow-lg">
          <div className="px-5 py-3.5 border-b border-[#1A2232] flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Derived, Not Independently Quoted
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#CBD5E1]">
              <thead className="bg-[#0A0E17] text-[#64748B] uppercase font-mono text-[10px] tracking-wider border-b border-[#1A2232]">
                <tr>
                  <th className="py-3 px-4">Commodity</th>
                  <th className="py-3 px-4">Derivation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2232] font-mono">
                {derivedQuotes.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#121A2B] transition-colors">
                    <td className="py-3 px-4 font-sans font-semibold text-[#F8FAFC]">{item.name}</td>
                    <td className="py-3 px-4 text-[#94A3B8]">{item.basis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-[#1A2232] text-[11px] text-[#64748B]">
            These formulas are fixed, hand-set approximations (see <code className="text-[#38BDF8]">src/app/api/prices/route.ts</code>) —
            useful for showing directionally correct spread movement, not a substitute for actual Platts/ICIS contract prices.
          </div>
        </div>

        {/* News feeds */}
        <div className="rounded-xl border border-[#1A2232] bg-[#0E1420] overflow-hidden shadow-lg">
          <div className="px-5 py-3.5 border-b border-[#1A2232] flex items-center gap-2">
            <Rss className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              News Wire (4 RSS Feeds)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#CBD5E1]">
              <thead className="bg-[#0A0E17] text-[#64748B] uppercase font-mono text-[10px] tracking-wider border-b border-[#1A2232]">
                <tr>
                  <th className="py-3 px-4">Feed</th>
                  <th className="py-3 px-4">Endpoint</th>
                  <th className="py-3 px-4">Tagged As</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2232] font-mono">
                {newsFeeds.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#121A2B] transition-colors">
                    <td className="py-3 px-4 font-sans font-semibold text-[#F8FAFC]">{item.name}</td>
                    <td className="py-3 px-4 text-[#94A3B8]">{item.url}</td>
                    <td className="py-3 px-4 text-[#94A3B8]">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-[#1A2232] text-[11px] text-[#64748B] flex items-center gap-1.5">
            <ArrowRight className="w-3 h-3" />
            If a feed is unreachable at request time, that source is silently skipped — no error is surfaced to the user.
          </div>
        </div>

        <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
          <ExternalLink className="w-3 h-3" />
          Route: <code className="text-[#38BDF8]">src/app/api/prices/route.ts</code> · Polled every 45s from{' '}
          <code className="text-[#38BDF8]">src/context/MarketContext.tsx</code>
        </div>
      </div>
    </AppShell>
  );
}
