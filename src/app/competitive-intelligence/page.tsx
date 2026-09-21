'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  Globe2,
  Cpu,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingDown,
  Layers,
  ArrowRight
} from 'lucide-react';

interface BenchmarkCase {
  id: string;
  company: string;
  useCase: string;
  category: string;
  technology: string;
  businessProblem: string;
  applicabilityToRIL: string;
  source: string;
  date: string;
}

const BENCHMARK_CASES: BenchmarkCase[] = [
  {
    id: 'bm-exxon',
    company: 'ExxonMobil',
    useCase: 'Predictive Steam Cracker Furnace Optimization',
    category: 'Optimization & AI',
    technology: 'Physics-informed Neural Networks (PINN) + Honeywell DCS',
    businessProblem: 'Coking in radiant furnace tubes causing unplanned decoking shutdowns and thermal degradation.',
    applicabilityToRIL: 'Directly applicable to Dahej and Jamnagar ethane cracking coils to prolong run-lengths.',
    source: 'Hydrocarbon Processing / AIChE Chemical Engineering Conference',
    date: '2025-11'
  },
  {
    id: 'bm-dow',
    company: 'Dow Chemical',
    useCase: 'Autonomous Cracker Digital Twin',
    category: 'Digital Twins',
    technology: 'Aspen Hybrid Models + Cloud AI Optimization',
    businessProblem: 'Dynamic feedstock switching optimization between light NGLs and condensates across Texas Gulf Coast crackers.',
    applicabilityToRIL: 'Validates RIL direction to integrate machine learning surrogate layers on top of traditional LP optimizers.',
    source: 'Dow Investor Day & Sustainability / Tech Presentation',
    date: '2025-09'
  },
  {
    id: 'bm-sabic',
    company: 'SABIC',
    useCase: 'Crude-to-Chemicals (COTC) Yield Maximization',
    category: 'Process Optimization',
    technology: 'Ensemble Random Forests & Deep RL for Catalyst Control',
    businessProblem: 'Maximizing light olefin yield from heavy atmospheric bottoms and gas oils.',
    applicabilityToRIL: 'Highly relevant for Jamnagar integrated O2C refinery-to-chemicals configuration.',
    source: 'SABIC Technology Papers / ACS Omega Chemical Literature',
    date: '2025-06'
  },
  {
    id: 'bm-basf',
    company: 'BASF',
    useCase: 'Verbund Integrated Supply Chain & Energy AI',
    category: 'Energy Optimization',
    technology: 'Graph Neural Networks (GNN) for Steam & Heat Balancing',
    businessProblem: 'High steam and power volatility across multi-plant chemical complexes.',
    applicabilityToRIL: 'Optimizing co-generation power plants and cracker waste heat steam generators at Dahej and Hazira.',
    source: 'BASF Capital Markets Day & European Chemical Industry Reports',
    date: '2025-10'
  },
  {
    id: 'bm-lyondell',
    company: 'LyondellBasell',
    useCase: 'Real-Time Dynamic Pricing & Resin Hedging',
    category: 'Forecasting & Pricing',
    technology: 'Time-Series Transformer Models + Econometric Covariates',
    businessProblem: 'Polyethylene and polypropylene customer contract price forecasting under severe Asian oversupply.',
    applicabilityToRIL: 'Direct benchmark for RIL Intelligence OS multi-horizon commodity forecasting engine.',
    source: 'ScienceDirect Petrochemical Decision Framework / Ind. Eng. Chem. Res.',
    date: '2025-08'
  },
  {
    id: 'bm-shell',
    company: 'Shell Chemicals',
    useCase: 'Vessel Route & Ethane Carrier Liquefaction Analytics',
    category: 'Supply Chain',
    technology: 'Maritime AI Fleet Routing + Boil-Off Gas (BOG) Optimization',
    businessProblem: 'Boil-off gas management during long-haul cryogenic ethane voyages.',
    applicabilityToRIL: 'Optimizes RIL fleet of 6 existing + 3 planned VLECs traversing US Gulf to Gujarat.',
    source: 'Maritime & Energy Logistics Review',
    date: '2026-02'
  }
];

export default function CompetitiveIntelligencePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredCases =
    selectedCategory === 'ALL'
      ? BENCHMARK_CASES
      : BENCHMARK_CASES.filter((b) => b.category.includes(selectedCategory));

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-[#BFA161]" />
                External Benchmarking & Global Chemical Intelligence
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Peer AI Adoption & Oversupply Tracking</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              COMPETITIVE INTELLIGENCE & GLOBAL BENCHMARK
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Publicly verified benchmark matrix of AI use cases across global chemical leaders (ExxonMobil, Dow, SABIC, BASF, LyondellBasell) and global oversupply context.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#D4BA7B] bg-[#0E1420] px-3.5 py-2 rounded-lg border border-[#1E2738]">
            <span>6 Global Peers Tracked</span>
          </div>
        </div>

        {/* Global Cracker Oversupply Context (from AI Cracker Doc Section 10) */}
        <div id="oversupply" className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2738]">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#F43F5E]" />
              <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wide">
                Global Petrochemical Oversupply Cycle (2020 – 2033 Context)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              Source: S&P Global / AI Cracker Doc Section 10
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Global Capacity Surge</span>
              <div className="text-xl font-bold font-mono text-[#F43F5E]">+40 Million Tonnes</div>
              <div className="text-[10px] text-[#94A3B8]">70% constructed in China (2020-2025)</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Global Demand Growth</span>
              <div className="text-xl font-bold font-mono text-[#CBD5E1]">+27 Million Tonnes</div>
              <div className="text-[10px] text-[#94A3B8]">Lagged supply by 13 Mt surplus</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Industry Operating Rate</span>
              <div className="text-xl font-bold font-mono text-[#F59E0B]">~80% Average</div>
              <div className="text-[10px] text-[#94A3B8]">High-cost naphtha units idling</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Margin Recovery Gate</span>
              <div className="text-xl font-bold font-mono text-[#BFA161]">Early 2030s</div>
              <div className="text-[10px] text-[#94A3B8]">Cost position is a survival condition</div>
            </div>
          </div>
        </div>

        {/* Competitor AI Benchmark Matrix Table */}
        <div id="matrix" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B]">
              Global Chemical & O2C AI Benchmark Matrix
            </h2>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              {['ALL', 'Optimization', 'Digital Twins', 'Process', 'Energy', 'Pricing'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#BFA161] text-[#080B10] font-bold'
                      : 'bg-[#141C2B] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#1A2232] bg-[#0E1420] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#CBD5E1]">
                <thead className="bg-[#0A0E17] text-[#64748B] uppercase font-mono text-[10px] tracking-wider border-b border-[#1A2232]">
                  <tr>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Use Case & Domain</th>
                    <th className="py-3 px-4">Technology Stack</th>
                    <th className="py-3 px-4">Business Problem Solved</th>
                    <th className="py-3 px-4">Potential Applicability to RIL</th>
                    <th className="py-3 px-4">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2232]">
                  {filteredCases.map((c) => (
                    <tr key={c.id} className="hover:bg-[#121A2B] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-sm text-[#F8FAFC]">
                        {c.company}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#CBD5E1]">{c.useCase}</div>
                        <span className="text-[10px] font-mono text-[#BFA161]">{c.category}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#38BDF8]">
                        {c.technology}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-[#94A3B8]">
                        {c.businessProblem}
                      </td>
                      <td className="py-3.5 px-4 text-[11px] text-[#10B981]">
                        {c.applicabilityToRIL}
                      </td>
                      <td className="py-3.5 px-4 text-[10px] font-mono text-[#64748B]">
                        {c.source} ({c.date})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
