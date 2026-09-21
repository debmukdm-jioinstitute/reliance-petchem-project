'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import {
  Briefcase,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Cpu,
  LineChart,
  SlidersHorizontal,
  DollarSign,
  Globe2,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface Workstream {
  id: string;
  letter: string;
  name: string;
  objective: string;
  currentState: string;
  knownCapabilities: string;
  aiOpportunity: string;
  dataRequirements: string;
  modelRequirements: string;
  openQuestions: string;
  deliverables: string;
  progressPct: number;
}

const WORKSTREAMS: Workstream[] = [
  {
    id: 'ai-optimization',
    letter: 'A',
    name: 'AI Optimization of Cracker Units',
    objective: 'Enhance existing RIL linear programming (LP) cracker optimizer with non-linear machine learning yield predictors and real-time feed tuning.',
    currentState: 'RIL currently operates an internal LP optimizer switching feedstocks in <24 hours. Optimization operates on static yield curves.',
    knownCapabilities: 'Sub-day operational switching across Jamnagar, Dahej, and Hazira crackers between naphtha, ethane, and propane.',
    aiOpportunity: 'Replace static yield lookup tables with deep neural surrogate models predicting ethylene/propylene yields based on coil outlet temperatures and feed PNA composition.',
    dataRequirements: 'Furnace temperature logs, feedstock chromatography, steam-to-oil ratios, effluent gas analyzer feeds.',
    modelRequirements: 'Ensemble ML / Gradient Boosted Trees / Neural surrogates for olefin yield prediction (ACS Omega paradigm).',
    openQuestions: 'Integration latency with Aspen / Honeywell DCS systems at Dahej terminal.',
    deliverables: 'Surrogate yield model API and real-time feed mix advisor prototype.',
    progressPct: 65
  },
  {
    id: 'market-forecasting',
    letter: 'B',
    name: 'Market Price Forecasting Engine',
    objective: 'Deliver multi-horizon quantitative price forecasts for Ethane, Naphtha, Brent, Natural Gas, Ethylene, Propylene, and USD/INR.',
    currentState: 'Trading teams rely on historical rolling averages and third-party analyst reports (Platts/ICIS).',
    knownCapabilities: 'Standard econometric regression models and weekly manual spread tracking.',
    aiOpportunity: 'Multi-model ensemble combining foundation time-series models (TimesFM) with LightGBM and AutoARIMA to generate P10/P50/P90 probabilistic price envelopes.',
    dataRequirements: 'Global commodity spot prices, EIA US NGL production data, Chinese cracker operating rates, ICE Brent futures curve.',
    modelRequirements: 'TimesFM, AutoARIMA, ETS, LightGBM with automated out-of-sample backtesting (MAE, RMSE, MAPE).',
    openQuestions: 'Frequency of automated retraining (weekly vs daily batch).',
    deliverables: 'Quantitative forecasting dashboard with confidence intervals and dispersion metrics.',
    progressPct: 85
  },
  {
    id: 'scenario-simulation',
    letter: 'C',
    name: 'Scenario Simulation Engine',
    objective: 'Model cascading operational, financial, and market shocks (crude spikes, supply chain disruptions, capacity delays) on RIL EBITDA and cash flows.',
    currentState: 'Static Excel sensitivity tables run periodically during annual budgeting cycles.',
    knownCapabilities: 'Basic single-variable sensitivities (+10% crude, +10% naphtha).',
    aiOpportunity: 'Dynamic multi-variable waterfall engine modeling simultaneous shocks (e.g. Brent +20% + Ethane -10% + 3-month startup delay) with instant EBITDA recalculation.',
    dataRequirements: 'Cracker mass balance matrices, asset conversion tiers, variable cost coefficients.',
    modelRequirements: 'Dynamic deterministic financial equations + 10,000-iteration Monte Carlo simulator with lognormal distributions.',
    openQuestions: 'Calibration of supply chain disruption probabilities across US Gulf Coast export terminals.',
    deliverables: 'Interactive scenario builder, waterfall shock visualizer, and Monte Carlo risk envelope.',
    progressPct: 90
  },
  {
    id: 'dynamic-financial-model',
    letter: 'D',
    name: 'Dynamic Financial Model & Capex Tracker',
    objective: 'Provide CFO-level DCF valuation, NPV, IRR, and payback tracking for RIL >$2.0 Billion ethane capacity expansion and fleet deployment.',
    currentState: 'Fixed corporate model for project sanction; manual updates upon schedule changes.',
    knownCapabilities: 'Base-case DCF valuation across Jamnagar, Dahej, Hazira, Nagothane, and Vadodara.',
    aiOpportunity: 'Automated propagation: whenever a market forecast or plant delay changes, the entire DCF waterfall recalculates NPV, IRR, and payback in real time.',
    dataRequirements: 'Terminal capex milestones, VLEC charter rates, corporate tax rates, WACC (10.5%).',
    modelRequirements: 'Formula-driven financial engine with zero hardcoded fake numbers and full assumption audit trail.',
    openQuestions: 'Exact charter rates for 3 newly contracted VLECs.',
    deliverables: 'Asset-level DCF matrix, conversion tier rankings, and dynamic capex delay scenario analyzer.',
    progressPct: 80
  },
  {
    id: 'industry-benchmarking',
    letter: 'E',
    name: 'External AI & Global Industry Benchmarking',
    objective: 'Benchmark RIL against global petrochemical leaders (Dow, ExxonMobil, SABIC, BASF, LyondellBasell) and assess the global oversupply cycle.',
    currentState: 'Ad-hoc competitor intelligence based on quarterly earnings releases.',
    knownCapabilities: 'High-level knowledge of European cracker closures and Chinese capacity surge.',
    aiOpportunity: 'Systematic classification of public AI use cases in chemicals (digital twins, predictive maintenance, RL procurement) and regional margin competitiveness.',
    dataRequirements: 'Public annual reports, investor presentations, academic research papers, trade articles.',
    modelRequirements: 'NLP document intelligence, entity extraction, and comparative matrix categorization.',
    openQuestions: 'Timeline for Chinese capacity absorption (estimated early 2030s).',
    deliverables: 'Competitor AI benchmark matrix and global cracker oversupply tracker.',
    progressPct: 75
  }
];

export default function ProjectManagementPage() {
  const [selectedWs, setSelectedWs] = useState<string>('ai-optimization');
  const currentWs = WORKSTREAMS.find((w) => w.id === selectedWs) || WORKSTREAMS[0];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#BFA161]" />
                Project Intelligence & Governance
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Reliance O2C / Cracker Industry Live Project</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              PROJECT MANAGEMENT & WORKSTREAMS
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Execution roadmap covering 5 core workstreams, capital expenditure tracking, timeline milestones, and delivery status aligned with Reliance mentors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/project/capex"
              className="px-3.5 py-2 rounded-lg bg-[#BFA161]/15 hover:bg-[#BFA161]/25 border border-[#BFA161]/40 text-[#D4BA7B] text-xs font-mono font-medium transition-all flex items-center gap-1.5"
            >
              <span>Inspect Capex Tracker ($2.0B+)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Project Scope & Executive Summary Card */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E2738]">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-[#F8FAFC]">Project Objective:</span>
              <span className="text-xs text-[#CBD5E1]">
                AI-Enabled Optimization, Market Forecasting & Scenario Analysis for Reliance O2C
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-[#64748B]">Phase: <strong className="text-[#38BDF8]">Phase 1 (Scoping & Engine Build)</strong></span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#64748B]">Duration: <strong className="text-[#F8FAFC]">July – October 2026</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Primary Sponsor</span>
              <div className="font-semibold text-[#F8FAFC]">Reliance Industries Limited</div>
              <div className="text-[11px] text-[#94A3B8]">O2C / Petrochemicals Business</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Key Mentors</span>
              <div className="font-semibold text-[#F8FAFC]">Rajesh Rawal & Hanoz</div>
              <div className="text-[11px] text-[#94A3B8]">Cracker & Poly Business Heads</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Executing Team</span>
              <div className="font-semibold text-[#F8FAFC]">Team 9 (Jio Institute)</div>
              <div className="text-[11px] text-[#94A3B8]">Debabrata, Dhruv, Ishan, Vishwas</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Overall Progress</span>
              <div className="font-semibold text-[#10B981]">79% Complete</div>
              <div className="w-full bg-[#1A2232] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-[#10B981] h-full rounded-full" style={{ width: '79%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* 5 Workstreams Section */}
        <div id="workstreams" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B]">
              Core Workstreams (Select to View Operational Architecture)
            </h2>
            <span className="text-[10px] text-[#64748B] font-mono">5 Mandated Streams</span>
          </div>

          {/* Workstream selector pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            {WORKSTREAMS.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setSelectedWs(ws.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  selectedWs === ws.id
                    ? 'bg-[#151D2C] border-[#BFA161] shadow-md'
                    : 'bg-[#0E1420] border-[#1A2232] hover:bg-[#121824] hover:border-[#242F44]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-mono text-xs font-bold text-[#BFA161]">
                    Workstream {ws.letter}
                  </span>
                  <span className="text-[10px] font-mono text-[#10B981]">
                    {ws.progressPct}%
                  </span>
                </div>
                <div className="text-xs font-semibold text-[#F8FAFC] truncate">
                  {ws.name}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Workstream Detail View */}
          <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2738]">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#BFA161] font-bold">
                  Workstream {currentWs.letter}
                </span>
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  {currentWs.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#94A3B8]">Progress:</span>
                <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-md border border-[#10B981]/30">
                  {currentWs.progressPct}% Delivered
                </span>
              </div>
            </div>

            {/* Strategic Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-[#38BDF8] block font-semibold">
                  Strategic Objective
                </span>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {currentWs.objective}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-[#10B981] block font-semibold">
                  AI & Quantitative Opportunity
                </span>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {currentWs.aiOpportunity}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                  Current Operational State
                </span>
                <p className="text-[#94A3B8] leading-relaxed">
                  {currentWs.currentState}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1.5">
                <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                  Known Internal Capabilities
                </span>
                <p className="text-[#94A3B8] leading-relaxed">
                  {currentWs.knownCapabilities}
                </p>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#121824] border border-[#1E2738] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                  Data Inputs & Requirements
                </span>
                <p className="text-[#CBD5E1]">
                  {currentWs.dataRequirements}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121824] border border-[#1E2738] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                  Model & Algorithmic Stack
                </span>
                <p className="text-[#CBD5E1]">
                  {currentWs.modelRequirements}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#121824] border border-[#1E2738] space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                  Key Deliverables
                </span>
                <p className="text-[#D4BA7B]">
                  {currentWs.deliverables}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
