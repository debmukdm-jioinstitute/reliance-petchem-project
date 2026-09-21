'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell, { useIntelligence } from '@/components/layout/AppShell';
import {
  Crown,
  Zap,
  CheckCircle2,
  XCircle,
  Eye,
  AlertOctagon,
  Download,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Clock
} from 'lucide-react';
import { KEY_DECISIONS } from '@/data/knowledgeStore';
import { CardSpotlight, DottedGrid } from '@/components/obsidian';

export default function ExecutiveIntelligencePage() {
  const { openAuditModal } = useIntelligence();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadDigest = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with ObsidianUI DottedGrid */}
        <DottedGrid className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121217]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4BA7B] flex items-center gap-1.5">
                  <Crown className="w-4 h-4" />
                  Executive Briefing
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Leadership Review
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Executive Intelligence
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
                60-second summary, real-time market signals, capital allocation updates, and priority decisions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadDigest}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#8F7640] dark:text-[#D4BA7B]" />
                <span>{downloadSuccess ? 'Downloaded (PDF)' : 'Download PDF'}</span>
              </button>
              <button
                onClick={() => openAuditModal('audit-01')}
                className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-[#D4BA7B] text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Trace Citations</span>
              </button>
            </div>
          </div>
        </DottedGrid>

        {/* 1. EXECUTIVE BRIEF (60-Second Briefing) */}
        <CardSpotlight id="brief" className="p-8 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#8F7640] dark:text-[#D4BA7B]" />
              <span className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                60-Second Executive Briefing
              </span>
            </div>
            <span className="text-xs font-mono text-neutral-500">
              Verified from project records
            </span>
          </div>

          <div className="mt-5 space-y-4 text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            <p>
              <strong className="text-neutral-900 dark:text-white">1. Switching is Already Solved:</strong> Reliance already switched from naphtha to ethane in 2017. Internal linear programs can switch feeds within hours. We do not need to study how to switch.
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">2. Dual Simulation Model Approved:</strong> The project scope covers two simulation models: (A) RIL asset-specific expansion economics, and (B) global cracker industry oversupply (+40 Mt capacity vs +27 Mt demand).
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">3. Huge Ethane Feedstock Advantage:</strong> Naphtha costs surged 61% YoY while US ethane fell 11%. Feedstock cost to make 1 tonne of ethylene is ~$250 using ethane vs ~$2,629 using naphtha (~10x cost difference). This protects RIL&apos;s O2C margins (+₹1,850 Cr annual impact).
            </p>
            <p>
              <strong className="text-neutral-900 dark:text-white">4. Capital Plan on Track:</strong> Over $2.0 Billion is invested in Jamnagar and Dahej ethane terminals (&gt;1.5 MMTPA each) plus 6 active and 3 planned Very Large Ethane Carriers (VLECs).
            </p>
          </div>
        </CardSpotlight>

        {/* 2. TODAY'S SIGNALS */}
        <div id="signals" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Today&apos;s Signals
            </h2>
            <span className="text-xs text-neutral-500">Evidence-based market indicators</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Positive */}
            <CardSpotlight className="p-6 space-y-3 border-emerald-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400">
                  Positive Signal
                </span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Ethane Margin Widening
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Naphtha spot price at $816/t (-2.1%) widens our cost advantage with US ethane at $157/t FOB.
              </p>
              <div className="pt-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 border-t border-neutral-100 dark:border-neutral-800">
                Source: Group 9 Report / Q3 Results
              </div>
            </CardSpotlight>

            {/* Negative */}
            <CardSpotlight className="p-6 space-y-3 border-rose-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400">
                  Market Risk
                </span>
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Ethylene Price Pressure
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Asian ethylene benchmark is at $886/t (+1.3% YoY) with 40 Mt of new Chinese capacity still weighing on the market.
              </p>
              <div className="pt-2 text-xs font-mono text-rose-700 dark:text-rose-400 border-t border-neutral-100 dark:border-neutral-800">
                Source: S&P Commodity Insights
              </div>
            </CardSpotlight>

            {/* Watch */}
            <CardSpotlight className="p-6 space-y-3 border-amber-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400">
                  Watch Signal
                </span>
                <Eye className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                USD / INR Currency Creep
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                USD/INR at 83.95 adds ₹18/t to imported US ethane freight. Currency hedges must be watched.
              </p>
              <div className="pt-2 text-xs font-mono text-amber-700 dark:text-amber-400 border-t border-neutral-100 dark:border-neutral-800">
                Source: RBI Reference Rate
              </div>
            </CardSpotlight>

            {/* Critical */}
            <CardSpotlight className="p-6 space-y-3 border-purple-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-400">
                  Operational Alert
                </span>
                <AlertOctagon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                Nagothane Pipe Link
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                1-month schedule delay on the Nagothane link. $90M capex milestone moved to Q1 FY28.
              </p>
              <div className="pt-2 text-xs font-mono text-purple-700 dark:text-purple-400 border-t border-neutral-100 dark:border-neutral-800">
                Source: Capex Schedule Review
              </div>
            </CardSpotlight>
          </div>
        </div>

        {/* 3. KEY DECISIONS REGISTER */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Key Decisions Register
          </h2>

          <div className="space-y-4">
            {KEY_DECISIONS.map((d) => (
              <CardSpotlight key={d.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-[#D4BA7B] border border-amber-500/20">
                        {d.decisionMaker}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                        {d.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                      {d.decision}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      <strong>Reason:</strong> {d.rationale}
                    </p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                      <strong>Impact:</strong> {d.impact}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-xs font-mono text-neutral-500 block">
                      Source: {d.sourceCitation.sourceTitle}
                    </span>
                  </div>
                </div>
              </CardSpotlight>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
