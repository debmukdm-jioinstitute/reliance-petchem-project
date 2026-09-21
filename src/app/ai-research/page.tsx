'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  BookOpen,
  Cpu,
  FileText,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AIResearchPage() {
  const papers = [
    {
      id: 'paper-acs',
      title: 'Optimal Design of AI Models for Modeling Light Olefin Yields in Crude-to-Chemical Conversions',
      journal: 'ACS Omega (American Chemical Society)',
      year: '2023',
      authors: 'Chemical Engineering & Process AI Research Group',
      summary: 'Demonstrates how ensemble machine learning architectures (Random Forest, Gradient Boosted Trees, MLP Neural Networks) model non-linear ethylene and propylene yields under variable cracker coil outlet temperatures and naphtha PNA slates.',
      directRelevanceToRIL: 'Provides mathematical framework to augment RIL internal linear optimizer with machine learning surrogate yield predictions.',
      doi: '10.1021/acsomega.3c05128',
      keyFindings: [
        'Ensemble gradient boosting achieved R² of 0.94 on ethylene yield prediction vs 0.81 for linear models',
        'Coil outlet temperature (COT) and residence time account for 68% of light olefin variance',
        'Surrogate models execute inference in <12 milliseconds, suitable for online closed-loop APC'
      ]
    },
    {
      id: 'paper-sciencedirect',
      title: 'Data Science and Reinforcement Learning for Price Forecasting and Raw Material Procurement in Petrochemicals',
      journal: 'Computers & Chemical Engineering (ScienceDirect)',
      year: '2022',
      authors: 'Industrial Decision Systems Laboratory',
      summary: 'Applies deep Q-learning (DQN) and policy gradient reinforcement learning to automate raw material (naphtha and LPG) purchasing decisions based on forward-looking price trajectory forecasts and inventory carrying limits.',
      directRelevanceToRIL: 'Informs RIL procurement strategy for US Mont Belvieu ethane contracts, VLEC charter scheduling, and domestic naphtha balancing.',
      doi: '10.1016/j.compchemeng.2021.107590',
      keyFindings: [
        'RL agent reduced procurement acquisition costs by 3.8% compared to naive spot procurement',
        'Price trend momentum indicators provided highest reward attribution in volatile crude regimes',
        'Inventory buffer constraints prevented stockout risks during maritime shipping delays'
      ]
    },
    {
      id: 'paper-iecr',
      title: 'Comprehensive Decision Framework Combining Price Prediction and Production Planning for Petrochemical Operations',
      journal: 'Industrial & Engineering Chemistry Research (Ind. Eng. Chem. Res.)',
      year: '2021',
      authors: 'Process Systems Engineering Group',
      summary: 'Introduces a unified bi-level mathematical optimization framework linking multi-horizon commodity price predictions directly with short-term production planning and feedstock allocation in steam crackers.',
      directRelevanceToRIL: 'Forms the foundational architectural inspiration for RIL Intelligence OS: bridging market price forecasting with cracker plant simulation.',
      doi: '10.1021/acs.iecr.0c01957',
      keyFindings: [
        'Coupling price prediction with production planning generated 7.2% higher gross operating contribution',
        'Bi-level MILP formulation reconciled short-term operational constraints with medium-term market spreads',
        'Validated that forecast uncertainty intervals (P10-P90) must be explicitly fed into stochastic unit commitment'
      ]
    }
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#BFA161]" />
                Academic & Industry Scientific Literature
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">ACS Omega • ScienceDirect • Ind. Eng. Chem. Res.</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              AI RESEARCH & CHEMICAL LITERATURE
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Scientific references cited in project documentation establishing algorithmic precedents for olefin yield modeling, reinforcement learning procurement, and unified production planning.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#D4BA7B] bg-[#0E1420] px-3.5 py-2 rounded-lg border border-[#1E2738]">
            <span>3 Peer-Reviewed Papers Indexed</span>
          </div>
        </div>

        {/* Papers Grid */}
        <div className="space-y-6">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl hover:border-[#BFA161]/40 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-[#1E2738]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
                      {paper.journal}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">Year: {paper.year}</span>
                  </div>
                  <h2 className="text-base font-bold text-[#F8FAFC]">
                    {paper.title}
                  </h2>
                  <div className="text-xs text-[#94A3B8] font-mono">
                    Authors: {paper.authors}
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#64748B] shrink-0">
                  DOI: {paper.doi}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-[10px] uppercase font-mono text-[#64748B]">Abstract & Methodology:</div>
                <p className="text-[#CBD5E1] leading-relaxed">
                  {paper.summary}
                </p>
              </div>

              {/* Relevance to RIL */}
              <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-[#10B981] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Direct Applicability to Reliance O2C Architecture:
                </span>
                <p className="text-[#CBD5E1]">
                  {paper.directRelevanceToRIL}
                </p>
              </div>

              {/* Key Quantitative Findings */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-mono text-[#64748B]">Key Empirical Findings:</span>
                <ul className="space-y-1 text-[#94A3B8]">
                  {paper.keyFindings.map((kf, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#BFA161] mt-0.5 shrink-0" />
                      <span>{kf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
