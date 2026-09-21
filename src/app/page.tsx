'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppShell, { useIntelligence } from '@/components/layout/AppShell';
import {
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Search,
  ChevronRight,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CHRONOLOGICAL_CHANGES } from '@/data/knowledgeStore';
import { 
  CardSpotlight, 
  DottedGrid, 
  ArrowFillButton, 
  ObsidianMetricBox 
} from '@/components/obsidian';

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
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Top Hero Section with ObsidianUI DottedGrid */}
        <DottedGrid className="p-8 sm:p-10 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121217] shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live System
                </span>
                <span className="text-neutral-400 dark:text-neutral-600 font-bold">•</span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Reliance Industries Limited (O2C)
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Cracker & Petchem Intelligence
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-normal leading-relaxed pt-1">
                Real-time cracker economics, dual simulation models, AI price forecasts, and strategic capital allocation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/executive">
                <ArrowFillButton variant="primary">
                  60-Second Brief
                </ArrowFillButton>
              </Link>
              <Link href="/scenarios">
                <ArrowFillButton variant="secondary">
                  Run Scenarios
                </ArrowFillButton>
              </Link>
            </div>
          </div>
        </DottedGrid>

        {/* 6 High-Visibility Status Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Feedstock Edge', val: 'Ethane Advantage', status: 'POSITIVE', badge: '+Delta', color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Project Phase', val: 'Scoping Approved', status: 'ACTIVE', badge: 'Phase 1', color: 'text-neutral-900 dark:text-white' },
            { label: 'AI Optimization', val: 'Run Dahej Ethane', status: 'BULLISH', badge: 'Max Yield', color: 'text-amber-600 dark:text-[#D4BA7B]' },
            { label: 'Market Risk', val: 'Global Oversupply', status: 'WATCH', badge: 'High Risk', color: 'text-rose-600 dark:text-rose-400' },
            { label: 'Latest Meeting', val: 'Hanoz & Adepu', status: 'RECORDED', badge: 'Minutes', color: 'text-sky-600 dark:text-sky-400' },
            { label: 'Next Review', val: 'Model Calibration', status: 'SCHEDULED', badge: 'Upcoming', color: 'text-neutral-900 dark:text-white' },
          ].map((item, i) => (
            <CardSpotlight
              key={i}
              className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                  {item.label}
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {item.badge}
                </span>
              </div>
              <div className={`text-base font-bold truncate mt-1 ${item.color}`}>
                {item.val}
              </div>
            </CardSpotlight>
          ))}
        </div>

        {/* Key Metrics Bento Grid — Increased Font Size & Visibility */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#8F7640] dark:text-[#D4BA7B]" />
              Key Market & Project Metrics
            </h2>
            <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400">
              Live Feed • Click to Inspect
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <ObsidianMetricBox
              title="Ethylene Spot"
              value="$840"
              unit="/t"
              subtitle="CFR SE Asia / India"
              badgeText="Product"
              trend="up"
              trendValue="+1.82%"
              href="/market?tab=products&item=ethylene"
              highlight
            />
            <ObsidianMetricBox
              title="Propylene Spot"
              value="$790"
              unit="/t"
              subtitle="FOB Korea / Domestic"
              badgeText="Product"
              trend="down"
              trendValue="-0.63%"
              href="/market?tab=products&item=propylene"
            />
            <ObsidianMetricBox
              title="Naphtha Feedstock"
              value="$685"
              unit="/t"
              subtitle="+61% YoY cost spike"
              badgeText="Feedstock"
              trend="up"
              trendValue="+3.16%"
              href="/market?tab=feedstocks&item=naphtha"
            />
            <ObsidianMetricBox
              title="US Ethane FOB"
              value="$145"
              unit="/t"
              subtitle="Mont Belvieu deep discount"
              badgeText="Feedstock"
              trend="down"
              trendValue="-1.36%"
              href="/market?tab=feedstocks&item=ethane"
              highlight
            />
            <ObsidianMetricBox
              title="Brent Crude"
              value="$82.40"
              unit="/bbl"
              subtitle="ICE London Futures"
              badgeText="Energy"
              trend="up"
              trendValue="+0.92%"
              href="/market?tab=energy&item=brent"
            />
            <ObsidianMetricBox
              title="Ethylene Cost Gap"
              value="~10x"
              unit="Advantage"
              subtitle="$250/t ethane vs $2,629/t naphtha"
              badgeText="Cost Spread"
              trend="up"
              trendValue="High Margin"
              href="/operations"
              highlight
            />
            <ObsidianMetricBox
              title="Committed Capex"
              value=">$2.0B"
              unit="USD"
              subtitle="Dahej Terminal + 6 VLECs"
              badgeText="Capital"
              trend="neutral"
              trendValue="Funded"
              href="/project/capex"
            />
            <ObsidianMetricBox
              title="Project IRR (P50)"
              value="19.4%"
              unit="Return"
              subtitle="10,000-run Monte Carlo base"
              badgeText="Financial"
              trend="up"
              trendValue="+$940M NPV"
              href="/financial"
              highlight
            />
          </div>
        </div>

        {/* "Recent Updates" — Clean Obsidian Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#8F7640] dark:text-[#D4BA7B]" />
                Recent Intelligence Updates
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Key takeaways from meeting notes, market shifts, and project milestones.
              </p>
            </div>
            <button
              onClick={() => openAuditModal('audit-01')}
              className="text-xs font-semibold text-neutral-700 dark:text-[#D4BA7B] hover:underline flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#8F7640] dark:text-[#D4BA7B]" />
              Audit Trace
            </button>
          </div>

          <div className="space-y-4">
            {CHRONOLOGICAL_CHANGES.map((chg) => (
              <CardSpotlight
                key={chg.id}
                className="p-6 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Date badge */}
                    <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center shrink-0 min-w-[80px]">
                      <Clock className="w-4 h-4 mx-auto mb-1 text-neutral-600 dark:text-[#D4BA7B]" />
                      <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                        {chg.date}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                          {chg.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-[#D4BA7B] transition-colors">
                          {chg.title}
                        </h3>
                      </div>

                      <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {chg.summary}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                            Why it matters
                          </span>
                          <span className="text-sm text-neutral-800 dark:text-neutral-200 font-medium">
                            {chg.whyItMatters}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-0.5">
                            Business impact
                          </span>
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {chg.potentialImpact}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 pt-3 lg:pt-0 lg:pl-5 shrink-0">
                    <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                      {chg.source.sourceTitle}
                    </span>
                    <button
                      onClick={() => openAuditModal('audit-01')}
                      className="text-xs font-semibold text-[#8F7640] dark:text-[#D4BA7B] hover:underline flex items-center gap-1"
                    >
                      View Source <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </CardSpotlight>
            ))}
          </div>
        </div>

        {/* Natural Language Discovery Box */}
        <CardSpotlight className="p-8 border border-neutral-200 dark:border-neutral-800">
          <div className="space-y-4 max-w-4xl">
            <div className="flex items-center gap-2 text-sm font-bold text-[#8F7640] dark:text-[#D4BA7B] uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              Ask the Project Intelligence Assistant
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
              Search meetings, prices, models, or decisions in plain English
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
              Instant answers backed by direct quotes from Rajesh Rawal and Hanoz meetings, O2C project documents, and quantitative forecasts.
            </p>

            <form onSubmit={handleAskNaturalQuery} className="flex items-center gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="e.g. What did Rajesh Rawal say about feedstock switching flexibility?"
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-sm sm:text-base text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-500 focus:border-[#BFA161] focus:ring-2 focus:ring-[#BFA161]/20 focus:outline-none transition-all"
                />
              </div>
              <ArrowFillButton type="submit" variant="primary" className="h-14">
                Ask
              </ArrowFillButton>
            </form>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <span className="font-semibold text-neutral-500">Try asking:</span>
              {[
                'Why did we drop the naphtha-to-ethane switching problem?',
                'How does the Dahej terminal expand our margins?',
                'What is the Dual Simulation architecture approved in Meeting 2?',
                'What is the cost difference between ethane and naphtha?'
              ].map((prompt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setNaturalQuery(prompt);
                    router.push(`/ai?q=${encodeURIComponent(prompt)}`);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 transition-colors"
                >
                  &quot;{prompt}&quot;
                </button>
              ))}
            </div>
          </div>
        </CardSpotlight>

      </div>
    </AppShell>
  );
}
