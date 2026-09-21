'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import {
  DollarSign,
  TrendingUp,
  Clock,
  ChevronLeft,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CRACKER_ASSETS } from '@/data/knowledgeStore';

export default function CapexIntelligencePage() {
  const [scheduleShiftMonths, setScheduleShiftMonths] = useState<number>(0);

  // Dynamic calculations for scenario: "What happens if startup moves forward or delays?"
  // Baseline assumptions:
  // Base monthly operational EBITDA generated once fully commissioned: ~$320M/year = ~$26.6M/month (₹220 Cr/month)
  // Acceleration requires fast-track capex premium (+2.5% per month advanced)
  // Delay carries standing overhead cost (~$1.8M/month) + deferred EBITDA + NPV degradation (discounted at 10.5% WACC)
  
  const isAccelerated = scheduleShiftMonths < 0;
  const isDelayed = scheduleShiftMonths > 0;
  const absShift = Math.abs(scheduleShiftMonths);

  const baselineNPV = 2840; // USD Millions
  const baselineIRR = 19.4; // %
  const baselineEBITDA = 58400; // INR Crores

  let npvImpactUSD_Mn = 0;
  let irrImpactPct = 0;
  let incrementalCapexUSD_Mn = 0;
  let ebitdaImpactINR_Cr = 0;

  if (isAccelerated) {
    // Advancing startup by absShift months
    incrementalCapexUSD_Mn = absShift * 18; // fast-track acceleration cost
    npvImpactUSD_Mn = absShift * 42 - incrementalCapexUSD_Mn; // early cash flows
    irrImpactPct = +(absShift * 0.45).toFixed(2);
    ebitdaImpactINR_Cr = +(absShift * 220).toFixed(0);
  } else if (isDelayed) {
    // Delaying startup by absShift months
    incrementalCapexUSD_Mn = absShift * 6; // idle overhead
    npvImpactUSD_Mn = -(absShift * 54 + incrementalCapexUSD_Mn);
    irrImpactPct = -(absShift * 0.65).toFixed(2);
    ebitdaImpactINR_Cr = -(absShift * 260).toFixed(0);
  }

  const adjustedNPV = baselineNPV + npvImpactUSD_Mn;
  const adjustedIRR = +(baselineIRR + irrImpactPct).toFixed(1);
  const adjustedEBITDA = baselineEBITDA + ebitdaImpactINR_Cr;

  const totalCommitted = CRACKER_ASSETS.reduce((sum, a) => sum + a.capexCommittedUSD_Mn, 0);
  const totalSpent = CRACKER_ASSETS.reduce((sum, a) => sum + a.spentUSD_Mn, 0);
  const totalRemaining = totalCommitted - totalSpent;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/project"
                className="text-[11px] font-mono text-[#94A3B8] hover:text-[#BFA161] flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Project Management
              </Link>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] font-mono uppercase text-[#BFA161]">Capital Allocation & Capex</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              CAPEX & STARTUP SCHEDULE INTELLIGENCE
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Tracking &gt;$2.0 Billion committed to cryogenic ethane terminals, 100km Dahej pipeline, and VLEC fleet. Live simulator for commissioning date shifts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-3.5 py-2 rounded-lg border border-[#10B981]/30">
            <span>Overall Capex Status: Active Deployment</span>
          </div>
        </div>

        {/* Global Capex Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Total Approved Budget</span>
            <div className="text-xl font-bold font-tabular text-[#F8FAFC]">
              ${totalCommitted.toLocaleString()}M
            </div>
            <div className="text-[10px] text-[#94A3B8]">Approved by RIL Board</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Cumulative Spent</span>
            <div className="text-xl font-bold font-tabular text-[#38BDF8]">
              ${totalSpent.toLocaleString()}M
            </div>
            <div className="text-[10px] text-[#94A3B8]">{((totalSpent / totalCommitted) * 100).toFixed(1)}% deployed</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Remaining To Deploy</span>
            <div className="text-xl font-bold font-tabular text-[#D4BA7B]">
              ${totalRemaining.toLocaleString()}M
            </div>
            <div className="text-[10px] text-[#94A3B8]">FY27 – FY28 funding</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Schedule Variance</span>
            <div className="text-xl font-bold font-tabular text-[#F59E0B]">
              +1 Month
            </div>
            <div className="text-[10px] text-[#94A3B8]">Nagothane link minor lag</div>
          </div>
        </div>

        {/* Interactive Scenario: "What happens if startup moves forward or delays?" */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0E1524] to-[#141E33] border border-[#BFA161]/40 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
            <div>
              <div className="text-xs font-mono font-bold uppercase text-[#BFA161] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#BFA161]" />
                Dynamic Schedule Sensitivity Simulator
              </div>
              <h2 className="text-base font-bold text-[#F8FAFC] mt-0.5">
                Scenario: &quot;What happens if startup moves forward or is delayed?&quot;
              </h2>
            </div>
            <span className="text-xs font-mono text-[#94A3B8] bg-[#0A0E17] px-3 py-1.5 rounded-lg border border-[#1E2738]">
              Shift: {scheduleShiftMonths === 0 ? 'On Schedule' : scheduleShiftMonths < 0 ? `${Math.abs(scheduleShiftMonths)} Month Forward` : `${scheduleShiftMonths} Months Delayed`}
            </span>
          </div>

          {/* Slider input */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#94A3B8]">
              <span>-3 Months (Fast-Track Forward)</span>
              <span className="font-mono font-bold text-[#F8FAFC]">
                {scheduleShiftMonths === 0 ? 'Baseline (Zero Shift)' : `${scheduleShiftMonths > 0 ? '+' : ''}${scheduleShiftMonths} Months`}
              </span>
              <span>+6 Months (Extended Delay)</span>
            </div>
            <input
              type="range"
              min="-3"
              max="6"
              step="1"
              value={scheduleShiftMonths}
              onChange={(e) => setScheduleShiftMonths(parseInt(e.target.value))}
              className="w-full h-2 bg-[#1E2738] rounded-lg appearance-none cursor-pointer accent-[#BFA161]"
            />
          </div>

          {/* Live Impact Calculation Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Projected NPV</span>
              <div className="text-base font-bold font-mono text-[#F8FAFC]">
                ${adjustedNPV.toLocaleString()}M
              </div>
              <div className={`text-[10px] font-mono ${npvImpactUSD_Mn >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                {npvImpactUSD_Mn >= 0 ? '+' : ''}${npvImpactUSD_Mn}M NPV Delta
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Projected IRR</span>
              <div className="text-base font-bold font-mono text-[#F8FAFC]">
                {adjustedIRR}%
              </div>
              <div className={`text-[10px] font-mono ${irrImpactPct >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                {irrImpactPct >= 0 ? '+' : ''}{irrImpactPct}% Delta
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Annualized EBITDA</span>
              <div className="text-base font-bold font-mono text-[#F8FAFC]">
                ₹{adjustedEBITDA.toLocaleString()} Cr
              </div>
              <div className={`text-[10px] font-mono ${ebitdaImpactINR_Cr >= 0 ? 'text-[#10B981]' : 'text-[#F43F5E]'}`}>
                {ebitdaImpactINR_Cr >= 0 ? '+' : ''}₹{ebitdaImpactINR_Cr} Cr Impact
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Incremental Capex</span>
              <div className="text-base font-bold font-mono text-[#F8FAFC]">
                ${incrementalCapexUSD_Mn}M
              </div>
              <div className="text-[10px] text-[#94A3B8]">
                {isAccelerated ? 'Fast-track overtime' : isDelayed ? 'Standing overhead' : 'Nominal'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#64748B]">Startup Timing</span>
              <div className="text-base font-bold font-mono text-[#BFA161]">
                {scheduleShiftMonths === 0 ? 'Q2 FY27' : scheduleShiftMonths < 0 ? 'Q1 FY27 (Early)' : 'Q3 FY27 (Lag)'}
              </div>
              <div className="text-[10px] text-[#94A3B8]">Commissioning Gate</div>
            </div>
          </div>
        </div>

        {/* Cracker Asset Investment Matrix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B]">
              Cracker Asset Capex & Conversion Tiers
            </h2>
            <span className="text-[10px] text-[#64748B] font-mono">Ranked by Ethylene Yield ROI</span>
          </div>

          <div className="rounded-xl border border-[#1A2232] bg-[#0E1420] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#CBD5E1]">
                <thead className="bg-[#0A0E17] text-[#64748B] uppercase font-mono text-[10px] tracking-wider border-b border-[#1A2232]">
                  <tr>
                    <th className="py-3 px-4">Tier Rank</th>
                    <th className="py-3 px-4">Site Name</th>
                    <th className="py-3 px-4">Ethylene Capacity</th>
                    <th className="py-3 px-4">Approved Capex</th>
                    <th className="py-3 px-4">Deployed</th>
                    <th className="py-3 px-4">NPV / IRR</th>
                    <th className="py-3 px-4">Target Startup</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2232]">
                  {CRACKER_ASSETS.map((asset) => (
                    <tr key={asset.id} className="hover:bg-[#121A2B] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#BFA161]">
                        Tier {asset.conversionTierRank}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-sm text-[#F8FAFC]">
                          {asset.siteName}
                        </div>
                        <div className="text-[10px] text-[#94A3B8]">
                          {asset.pipelineConnected ? 'Pipeline Connected to Dahej' : 'Isolated Rail/Truck'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {asset.ethyleneCapacityKTA.toLocaleString()} KTA
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#F8FAFC]">
                        ${asset.capexCommittedUSD_Mn}M
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#38BDF8]">
                        ${asset.spentUSD_Mn}M
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-[#10B981] font-semibold">${asset.npvUSD_Mn}M NPV</div>
                        <div className="text-[10px] text-[#94A3B8]">{asset.irrPct}% IRR</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {asset.startupTarget}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                            asset.currentScheduleStatus === 'ON_TRACK'
                              ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                              : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                          }`}
                        >
                          {asset.currentScheduleStatus.replace('_', ' ')}
                        </span>
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
