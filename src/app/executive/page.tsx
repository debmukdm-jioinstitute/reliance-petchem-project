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
  TrendingUp,
  FileText,
  Clock,
  ShieldCheck,
  Download,
  Share2,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { MEETINGS_DATA, CHRONOLOGICAL_CHANGES } from '@/data/knowledgeStore';

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#BFA161]" />
                Senior Leadership Briefing
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">CFO & Strategy Review Cadence</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              EXECUTIVE INTELLIGENCE
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Synthesized 60-second strategic briefing, evidence-backed market signals, capital allocation decisions, and leadership attention alerts.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadDigest}
              className="px-3.5 py-2 rounded-lg bg-[#141C2B] hover:bg-[#1A2438] border border-[#242F44] text-[#F8FAFC] text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#BFA161]" />
              <span>{downloadSuccess ? 'Digest Downloaded (PDF)' : 'Download Executive PDF'}</span>
            </button>
            <button
              onClick={() => openAuditModal('audit-01')}
              className="px-3.5 py-2 rounded-lg bg-[#BFA161]/15 hover:bg-[#BFA161]/25 border border-[#BFA161]/40 text-[#D4BA7B] text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#BFA161]" />
              <span>Trace All Citations</span>
            </button>
          </div>
        </div>

        {/* 1. EXECUTIVE BRIEF (60-Second Briefing) */}
        <div id="brief" className="p-6 rounded-2xl bg-gradient-to-r from-[#0E1524] via-[#121A2D] to-[#0E1524] border border-[#BFA161]/30 shadow-lg relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#BFA161]" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4BA7B]">
                AI-Generated 60-Second Executive Briefing
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              Updated 21 Sep 2026 • Verified against Meetings 1 & 2
            </span>
          </div>

          <div className="mt-4 space-y-3 text-xs text-[#CBD5E1] leading-relaxed">
            <p>
              <strong className="text-[#F8FAFC]">1. Operational Framing Resolved:</strong> Meeting 1 with Cracker & Poly Business Head Rajesh Rawal conclusively invalidated the assumption that RIL needs to figure out how to switch from naphtha to ethane. Reliance completed this operational pivot in 2017 and possesses internal linear optimizers that execute feedstock transitions within a fraction of a day.
            </p>
            <p>
              <strong className="text-[#F8FAFC]">2. Dual-Simulation Architecture Approved:</strong> In Meeting 2, Cracker Business Head Hanoz approved the AI Live Dashboard concept and mandated two complementary simulations: (A) RIL asset-specific expansion viability, and (B) global cracker industry oversupply dynamics driven by Chinese capacity additions (+40 Mt capacity vs +27 Mt demand).
            </p>
            <p>
              <strong className="text-[#F8FAFC]">3. Feedstock Disconnect Widens RIL Advantage:</strong> Naphtha costs surged 61% YoY while US ethane fell 11%. Gross feedstock needed to produce 1 tonne of ethylene is ~$250 via ethane vs ~$2,629 via naphtha (~10x gross gap). This cushions RIL O2C margins (+₹1,850 Cr annual impact) against distressed European and Asian naphtha crackers.
            </p>
            <p>
              <strong className="text-[#F8FAFC]">4. Capital Allocation & Risk Pivot:</strong> Reliance’s &gt;$2.0 Billion commitment to Jamnagar and Dahej cryogenic ethane terminals (&gt;1.5 MMTPA each) and 6 existing + 3 planned VLECs is insulated from Middle East lean-gas shifts, shifting critical project sensitivity to US Mont Belvieu FOB prices and USD/INR hedge execution.
            </p>
          </div>
        </div>

        {/* 2. TODAY'S SIGNALS (Evidence-backed cards) */}
        <div id="signals" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B]">
              Today&apos;s Signals (Evidence-Backed Status)
            </h2>
            <span className="text-[10px] text-[#64748B]">Zero arbitrary scores • Grounded in data</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Positive */}
            <div className="p-4 rounded-xl bg-[#0D1814] border border-[#10B981]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-bold">
                  Positive Signal
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Ethane Cracking Delta Widening
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Naphtha spot price at $685/t (+3.1% 1D) expands the gross ethylene conversion advantage of US ethane ($145/t FOB).
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#10B981] border-t border-[#10B981]/20">
                Evidence: Group 9 Report / Q3 FY26 RIL Results
              </div>
            </div>

            {/* Negative */}
            <div className="p-4 rounded-xl bg-[#1C1216] border border-[#F43F5E]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F43F5E]/20 text-[#F43F5E] font-bold">
                  Negative Signal
                </span>
                <XCircle className="w-4 h-4 text-[#F43F5E]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Global Ethylene Realization Squeeze
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Global ethylene benchmark depressed at $840/t (-11% YoY) due to 40 Mt of excess Asian capacity, compressing downstream polymer deltas.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#F43F5E] border-t border-[#F43F5E]/20">
                Evidence: S&P Commodity Insights / AI Cracker Doc
              </div>
            </div>

            {/* Watch */}
            <div className="p-4 rounded-xl bg-[#1C1910] border border-[#F59E0B]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-bold">
                  Watch Signal
                </span>
                <Eye className="w-4 h-4 text-[#F59E0B]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                USD/INR Exchange Rate Creep
              </h3>
              <p className="text-xs text-[#94A3B8]">
                USD/INR at 83.95 adds ₹18/t to imported US ethane freight, testing foreign currency translation hedge bands.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#F59E0B] border-t border-[#F59E0B]/20">
                Evidence: RBI Reference Rate / Group 9 Lever 3
              </div>
            </div>

            {/* Critical */}
            <div className="p-4 rounded-xl bg-[#201015] border border-[#F43F5E]/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F43F5E]/30 text-[#FB7185] font-bold">
                  Critical Alert
                </span>
                <AlertOctagon className="w-4 h-4 text-[#F43F5E]" />
              </div>
              <h3 className="text-sm font-semibold text-[#F8FAFC]">
                Nagothane Terminal Debottlenecking
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Schedule variance of +1 month flagged on Nagothane pipeline link; $90M capex milestone deferred to Q1 FY28.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#FB7185] border-t border-[#F43F5E]/30">
                Evidence: Financial Asset Matrix / Capex Schedule
              </div>
            </div>
          </div>
        </div>

        {/* 3. TOP 5 DEVELOPMENTS */}
        <div className="space-y-4">
          <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B]">
            Top 5 Strategic Developments
          </h2>

          <div className="space-y-3">
            {[
              {
                headline: 'Gross Ethylene Feedstock Gap Hits 10x ($250/t Ethane vs $2,629/t Naphtha)',
                summary: 'Calculated using stoichiometric yield figures (80% vs 30%) across prevailing spot markets without co-product credits, highlighting RIL operational cushion.',
                impact: 'Ensures RIL units run at ~95% utilization while marginal naphtha producers curtail rates to ~75%.',
                evidence: 'AI Cracker Industry Document, Section 8, Table 2.',
                date: '08 Sep 2026',
                source: 'AI Based Cracker Industry Analysis & Scenario Simulation'
              },
              {
                headline: 'Cracker Business Head Mandates Dual RIL & Global Simulation Model',
                summary: 'Hanoz instructed the team to simulate both internal RIL unit cash flows and global cracker oversupply cycles using AI price forecasting.',
                impact: 'Broadens deliverable scope to include global capacity closures across Europe and Asia.',
                evidence: 'Meeting 2 Transcript, Lines 100-106.',
                date: '20 Jul 2026',
                source: 'Meeting 2 Transcript with Hanoz & Adepu'
              },
              {
                headline: 'Reliance Ethane Terminal Infrastructure Sized at >$2.0 Billion',
                summary: 'Jamnagar and Dahej cryogenic import facilities exceed 1.5 MMTPA each, supported by 6 operating and 3 contracted VLECs and a 100km pipeline.',
                impact: 'Establishes high barrier to entry; locks in lowest cash-cost feedstock corridor in Asia.',
                evidence: 'Group 9 Live Project Report, Page 1 / EIA Reports.',
                date: '15 Jul 2026',
                source: 'Beyond Naphtha Live Project Report'
              },
              {
                headline: 'Feedstock Switching Reclassified as Solved Operational Capability',
                summary: 'Meeting 1 minutes verified that RIL can switch feedstocks in a fraction of a day using established LP optimizers, eliminating redundant R&D.',
                impact: 'Redirected project resources to dynamic scenario simulation and capital allocation models.',
                evidence: 'Meeting 1 MoM, Sections 4 & 19.',
                date: '06 Jul 2026',
                source: 'MoM RIL 6 July 2026'
              },
              {
                headline: 'Global Cracker Margins Projected Subdued Until Early 2030s',
                summary: 'Industry oversupply driven by Chinese mega-complexes has kept cash margins negative since mid-2022, forcing rationalization across European majors.',
                impact: 'Affirms that cost leadership via US ethane is mandatory for baseline project viability.',
                evidence: 'AI Cracker Document Section 10 / ICIS Data.',
                date: '10 Aug 2026',
                source: 'Global Chemical Industry Review'
              }
            ].map((dev, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] hover:border-[#BFA161]/40 transition-all space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">
                    {dev.headline}
                  </h3>
                  <span className="text-[10px] font-mono text-[#64748B] bg-[#121824] px-2 py-0.5 rounded border border-[#1E2738]">
                    {dev.date}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  {dev.summary}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div className="p-2 rounded bg-[#0A0E17] border border-[#1A2232]">
                    <span className="text-[#64748B] block text-[10px] uppercase font-mono">Business Impact:</span>
                    <span className="text-[#10B981] font-medium">{dev.impact}</span>
                  </div>
                  <div className="p-2 rounded bg-[#0A0E17] border border-[#1A2232]">
                    <span className="text-[#64748B] block text-[10px] uppercase font-mono">Verifiable Evidence:</span>
                    <span className="text-[#CBD5E1] font-mono text-[10px]">{dev.evidence}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. KEY DECISIONS REGISTER & 5. OPEN QUESTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Decisions */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B] flex items-center justify-between">
              <span>Key Decisions Register</span>
              <Link href="/decisions" className="text-[10px] text-[#BFA161] hover:underline font-normal">
                View All
              </Link>
            </h2>

            <div className="space-y-2.5">
              {[
                {
                  decision: 'Pivot scope away from NAFTA-to-ethane switching',
                  date: '06 Jul 2026',
                  owner: 'Rajesh Rawal (Cracker Head)',
                  status: 'ACTIVE',
                  meeting: 'Meeting 1'
                },
                {
                  decision: 'Implement Dual Simulation (RIL + Global Industry)',
                  date: '20 Jul 2026',
                  owner: 'Hanoz (Cracker Business Head)',
                  status: 'ACTIVE',
                  meeting: 'Meeting 2'
                },
                {
                  decision: 'Build AI multi-horizon price prediction engine',
                  date: '20 Jul 2026',
                  owner: 'Hanoz & Team 9',
                  status: 'ACTIVE',
                  meeting: 'Meeting 2'
                },
                {
                  decision: 'Structure project into 5 clear workstreams',
                  date: '02 Sep 2026',
                  owner: 'Debabrata Mukherjee & Mentors',
                  status: 'ACTIVE',
                  meeting: 'Scope Doc'
                }
              ].map((dec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#0E1420] border border-[#1A2232] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F8FAFC]">
                      {dec.decision}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                      {dec.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-[#64748B] font-mono">
                    <span>Owner: <strong className="text-[#94A3B8]">{dec.owner}</strong></span>
                    <span>•</span>
                    <span>Date: {dec.date}</span>
                    <span>•</span>
                    <span className="text-[#D4BA7B]">{dec.meeting}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Questions */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B] flex items-center justify-between">
              <span>Open Questions Requiring Leadership</span>
              <span className="text-[10px] font-mono text-[#F59E0B]">2 Pending</span>
            </h2>

            <div className="space-y-2.5">
              {[
                {
                  question: 'RIL plant-level confidential feedstock mix calibration',
                  owner: 'Adepu & Reliance Business Team',
                  deadline: '30 Sep 2026',
                  answer: 'Using public capacity ranges (Jamnagar 1.6 MMTPA ethane, Dahej 1.2 MMTPA). Need internal LP split confirmation.',
                  status: 'PRELIMINARY'
                },
                {
                  question: 'VLEC charter rate sensitivities under Middle East tanker disruption',
                  owner: 'Team 9 Finance (Debabrata / Dhruv)',
                  deadline: '15 Oct 2026',
                  answer: 'Modeled at baseline $125/t; sensitivity analysis shows $20/t swing affects project NPV by ~$390M.',
                  status: 'IN_REVIEW'
                }
              ].map((q, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-[#0E1420] border border-[#1A2232] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                      {q.question}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                      {q.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    {q.answer}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#64748B] font-mono pt-1">
                    <span>Owner: {q.owner}</span>
                    <span>Deadline: {q.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. LEADERSHIP ATTENTION (Auto-surfaced anomalies) */}
        <div id="attention" className="p-5 rounded-xl bg-[#14121A] border border-[#A855F7]/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#C084FC]">
            <AlertTriangle className="w-4 h-4 text-[#A855F7]" />
            Leadership Attention: Auto-Surfaced Critical Variances
          </div>
          <p className="text-xs text-[#94A3B8]">
            Automated sentinel tracking assumption invalidations, forecast model confidence drifts, and schedule deviations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-[#0C0B12] border border-[#242F44] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#F43F5E]">Capex Schedule Variance</span>
              <div className="text-xs font-semibold text-[#F8FAFC]">Nagothane Pipeline Link (+1 Month)</div>
              <p className="text-[11px] text-[#94A3B8]">Commissioning shifted to Q1 FY28; minor NPV degradation of -$18M.</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0C0B12] border border-[#242F44] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#F59E0B]">Cracker Oversupply Cycle</span>
              <div className="text-xs font-semibold text-[#F8FAFC]">Chinese Capacity Flood (+40 Mt)</div>
              <p className="text-[11px] text-[#94A3B8]">Global operating rates capped at ~80%; chemical margins subdued through 2030.</p>
            </div>
            <div className="p-3 rounded-lg bg-[#0C0B12] border border-[#242F44] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#10B981]">Feedstock Advantage Cushion</span>
              <div className="text-xs font-semibold text-[#F8FAFC]">Naphtha-Ethane Spread Wide (+$540/t)</div>
              <p className="text-[11px] text-[#94A3B8]">RIL captures maximum switching arbitrage; cash generation exceeds base plan.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
