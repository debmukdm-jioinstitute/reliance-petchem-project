'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell, { useIntelligence } from '@/components/layout/AppShell';
import {
  TrendingUp,
  Briefcase,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Search,
  ExternalLink,
  ChevronRight,
  Layers,
  ArrowRight,
  FileText,
  Clock,
  Zap
} from 'lucide-react';
import { CHRONOLOGICAL_CHANGES, MARKET_COMMODITIES } from '@/data/knowledgeStore';

export default function OverviewPage() {
  const router = useRouter();
  const { openAuditModal } = useIntelligence();
  const [naturalQuery, setNaturalQuery] = useState('');

  const handleAskNaturalQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalQuery.trim()) return;
    router.push(`/ai?q=${encodeURIComponent(naturalQuery)}`);
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header & Operational Readiness Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Executive Command Center
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Reliance Industries Limited (O2C)</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              RIL INTELLIGENCE OS
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              One unified institutional intelligence layer for market dynamics, capital allocation, scenario simulation, and cracker operational decisions.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/executive"
              className="px-3.5 py-2 rounded-lg bg-[#BFA161]/15 hover:bg-[#BFA161]/25 border border-[#BFA161]/40 text-[#D4BA7B] text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-[#BFA161]" />
              <span>60s Executive Brief</span>
            </Link>
            <Link
              href="/scenarios"
              className="px-3.5 py-2 rounded-lg bg-[#141C2B] hover:bg-[#1A2438] border border-[#242F44] text-[#F8FAFC] text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Run Scenario</span>
            </Link>
          </div>
        </div>

        {/* Executive Pulse Status Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Market Status', val: 'Feedstock Delta Favors Ethane', status: 'POSITIVE', color: 'text-[#10B981]' },
            { label: 'Project Status', val: 'Phase 1: Scoping Aligned', status: 'POSITIVE', color: 'text-[#10B981]' },
            { label: 'AI Signal', val: 'Maximize Dahej Ethane Run', status: 'BULLISH', color: 'text-[#D4BA7B]' },
            { label: 'Risk Level', val: 'Global Ethylene Oversupply', status: 'WATCH', color: 'text-[#F59E0B]' },
            { label: 'Latest Meeting', val: 'Meeting 2 (Hanoz Alignment)', status: 'COMPLETED', color: 'text-[#38BDF8]' },
            { label: 'Next Milestone', val: 'Model Calibration & Review', status: 'SCHEDULED', color: 'text-[#F8FAFC]' },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-[#0E141F] border border-[#1A2232] space-y-1 hover:border-[#BFA161]/40 transition-colors"
            >
              <div className="text-[10px] uppercase tracking-wider font-mono text-[#64748B]">
                {item.label}
              </div>
              <div className={`text-xs font-semibold truncate ${item.color}`}>
                {item.val}
              </div>
            </div>
          ))}
        </div>

        {/* 12 Clickable Executive KPI Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B] flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-[#BFA161]" />
              Executive Metrics & Live Spreads (Click to Inspect)
            </h2>
            <span className="text-[10px] text-[#64748B] font-mono">
              Auto-synced with Platts / ICIS / RBI
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {[
              {
                id: 'kpi-ethylene',
                name: 'ETHYLENE',
                val: '$840',
                unit: '/t',
                delta: '+1.82%',
                isUp: true,
                sub: 'CFR SE Asia / India',
                href: '/market?tab=products&item=ethylene',
              },
              {
                id: 'kpi-propylene',
                name: 'PROPYLENE',
                val: '$790',
                unit: '/t',
                delta: '-0.63%',
                isUp: false,
                sub: 'FOB Korea / India',
                href: '/market?tab=products&item=propylene',
              },
              {
                id: 'kpi-naphtha',
                name: 'NAFTA',
                val: '$685',
                unit: '/t',
                delta: '+3.16%',
                isUp: true,
                sub: '+61% YoY spike',
                href: '/market?tab=feedstocks&item=naphtha',
              },
              {
                id: 'kpi-ethane',
                name: 'ETHANE',
                val: '$145',
                unit: '/t',
                delta: '-1.36%',
                isUp: false,
                sub: 'Mont Belvieu FOB',
                href: '/market?tab=feedstocks&item=ethane',
              },
              {
                id: 'kpi-brent',
                name: 'BRENT',
                val: '$82.40',
                unit: '/bbl',
                delta: '+0.92%',
                isUp: true,
                sub: 'ICE Futures London',
                href: '/market?tab=energy&item=brent',
              },
              {
                id: 'kpi-natgas',
                name: 'NATURAL GAS',
                val: '$2.45',
                unit: '/MMBtu',
                delta: '-1.50%',
                isUp: false,
                sub: 'Henry Hub Benchmark',
                href: '/market?tab=energy',
              },
              {
                id: 'kpi-fx',
                name: 'FX (USD/INR)',
                val: '₹83.95',
                unit: '',
                delta: '+0.08%',
                isUp: true,
                sub: 'RBI Reference Rate',
                href: '/market?tab=fx',
              },
              {
                id: 'kpi-o2c-margin',
                name: 'O2C MARGIN',
                val: '$9.80',
                unit: '/bbl',
                delta: '+4.25%',
                isUp: true,
                sub: 'Ethane boost driver',
                href: '/financial',
              },
              {
                id: 'kpi-capex',
                name: 'CAPEX',
                val: '>$2.0B',
                unit: 'USD',
                delta: 'Active',
                isUp: true,
                sub: 'Terminals + 6 VLECs',
                href: '/project/capex',
              },
              {
                id: 'kpi-irr',
                name: 'PROJECT IRR',
                val: '19.4%',
                unit: '',
                delta: 'Base Plan',
                isUp: true,
                sub: 'P50 Monte Carlo',
                href: '/financial',
              },
              {
                id: 'kpi-npv',
                name: 'PROJECT NPV',
                val: '$2,840M',
                unit: 'USD',
                delta: '+$940M Upside',
                isUp: true,
                sub: '10.5% Discount Rate',
                href: '/financial',
              },
              {
                id: 'kpi-status',
                name: 'PROJECT STATUS',
                val: 'On Track',
                unit: '',
                delta: 'Phase 1',
                isUp: true,
                sub: 'Dual Simulator Scoped',
                href: '/project',
              },
            ].map((kpi) => (
              <Link
                key={kpi.id}
                href={kpi.href}
                className="group p-3.5 rounded-xl bg-[#0E1420] border border-[#1A2232] hover:border-[#BFA161]/50 hover:bg-[#121929] transition-all flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-medium text-[#94A3B8] group-hover:text-[#BFA161] transition-colors">
                    {kpi.name}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#BFA161] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <div className="my-2">
                  <div className="text-xl font-bold font-tabular text-[#F8FAFC]">
                    {kpi.val}
                    <span className="text-xs font-normal text-[#94A3B8] ml-0.5">
                      {kpi.unit}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#64748B] truncate mt-0.5">
                    {kpi.sub}
                  </div>
                </div>
                <div className="flex items-center text-[10px] font-mono">
                  <span
                    className={`flex items-center font-medium ${
                      kpi.isUp ? 'text-[#10B981]' : 'text-[#F43F5E]'
                    }`}
                  >
                    {kpi.delta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* "WHAT CHANGED" — AI-Generated Chronological Change Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#BFA161]" />
                What Changed
              </h2>
              <p className="text-xs text-[#94A3B8]">
                AI-synthesized chronological intelligence feed cross-referenced across meeting transcripts, regulatory disclosures, and market shocks.
              </p>
            </div>
            <button
              onClick={() => openAuditModal('audit-01')}
              className="text-xs font-mono text-[#D4BA7B] hover:underline flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#BFA161]" />
              Why did AI say this?
            </button>
          </div>

          <div className="space-y-3">
            {CHRONOLOGICAL_CHANGES.map((chg) => (
              <div
                key={chg.id}
                className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] hover:border-[#BFA161]/40 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="p-2 rounded-lg bg-[#141C2B] border border-[#242F44] text-[#BFA161] font-mono text-[11px] shrink-0 text-center min-w-[68px]">
                    <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-[#D4BA7B]" />
                    {chg.date}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#162030] text-[#38BDF8] border border-[#242F44]">
                        {chg.category}
                      </span>
                      <h3 className="text-sm font-semibold text-[#F8FAFC] group-hover:text-[#D4BA7B] transition-colors">
                        {chg.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#94A3B8] leading-relaxed">
                      {chg.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-[11px]">
                      <div className="p-2 rounded bg-[#0A0E17] border border-[#1A2232]">
                        <span className="text-[#64748B] block text-[10px] uppercase font-mono">Why it matters:</span>
                        <span className="text-[#CBD5E1]">{chg.whyItMatters}</span>
                      </div>
                      <div className="p-2 rounded bg-[#0A0E17] border border-[#1A2232]">
                        <span className="text-[#64748B] block text-[10px] uppercase font-mono">Potential business impact:</span>
                        <span className="text-[#10B981] font-medium">{chg.potentialImpact}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-end justify-between md:justify-start gap-2 border-t md:border-t-0 md:border-l border-[#1A2232] pt-2 md:pt-0 md:pl-4 shrink-0 text-right">
                  <span className="text-[10px] font-mono text-[#64748B] bg-[#121824] px-2 py-0.5 rounded border border-[#1E2738]">
                    {chg.source.sourceTitle}
                  </span>
                  <button
                    onClick={() => openAuditModal('audit-01')}
                    className="text-[11px] text-[#BFA161] hover:text-[#D4BA7B] flex items-center gap-1 font-mono transition-colors"
                  >
                    Trace Source <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Ask the Intelligence Layer (Natural Language Bar) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0E1524] to-[#121A2D] border border-[#1E293B] shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D4BA7B] uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#BFA161]" />
              Ask the Intelligence Layer
            </div>
            <p className="text-xs text-[#94A3B8]">
              Natural-language information discovery across ingested meeting transcripts, market time-series, quantitative forecasts, and dynamic financial scenarios.
            </p>

            <form onSubmit={handleAskNaturalQuery} className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="Ask about the project, market, forecasts, scenarios, capex or meetings (e.g. 'What did Rajesh say about switching?')..."
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#080B10] border border-[#242F44] text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-[#BFA161] focus:outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-5 rounded-xl bg-[#BFA161] hover:bg-[#D4BA7B] text-[#080B10] text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-md"
              >
                <span>Query OS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-[#64748B]">
              <span className="font-mono text-[10px]">Sample Prompts:</span>
              {[
                'What changed in ethane economics this month?',
                'How would a 20% increase in Brent affect cracker economics?',
                'What assumptions were invalidated in Meeting 1?',
                'Why did the forecast change?'
              ].map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setNaturalQuery(prompt);
                    router.push(`/ai?q=${encodeURIComponent(prompt)}`);
                  }}
                  className="px-2.5 py-1 rounded-md bg-[#162030] hover:bg-[#1E2B40] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#242F44] transition-colors truncate max-w-xs"
                >
                  &quot;{prompt}&quot;
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
