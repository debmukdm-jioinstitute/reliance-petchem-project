'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import {
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

interface MarketAlert {
  id: string;
  timestamp: string;
  triggerEvent: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  quantifiedImpact: string;
  affectedAssumptions: string[];
  downstreamScenarioImpact: string;
  recommendedAction: string;
}

const ALERTS_DATA: MarketAlert[] = [
  {
    id: 'alert-01',
    timestamp: '2026-09-21 08:30 IST',
    triggerEvent: 'Brent crude moved +8.2% over 5 sessions, reaching $97.42/bbl',
    severity: 'HIGH',
    quantifiedImpact: 'Naphtha spot surged to $816/t (-2.1% today, +26.5% YoY). Ethylene-ethane gross margin delta expanded to +$729/t.',
    affectedAssumptions: [
      'Feedstock cost: Naphtha crack increases from $648/t baseline to $816/t',
      'Cracker margin: Jamnagar and Dahej ethane cracking advantage widens by +$42/tonne'
    ],
    downstreamScenarioImpact: 'Upside Scenario probability increased from 20% to 35%; projected annual O2C EBITDA raised by +₹1,850 Cr.',
    recommendedAction: 'Direct Hazira and Dahej crackers to maximize ethane intake to 95% of technical limit.'
  },
  {
    id: 'alert-02',
    timestamp: '2026-09-20 14:15 IST',
    triggerEvent: 'Nagothane pipeline connection milestone schedule lag (+1 month)',
    severity: 'MEDIUM',
    quantifiedImpact: '$90M capex tranche execution deferred to Q1 FY28; minor cash flow deferral of -$18M NPV.',
    affectedAssumptions: [
      'Nagothane startup target: deferred from Q4 FY27 to Q1 FY28',
      'Schedule variance: +1 month logged in asset DCF model'
    ],
    downstreamScenarioImpact: 'No impact on Jamnagar or Dahej primary cash generation; Nagothane payback shifts from 5.6 to 5.8 years.',
    recommendedAction: 'Review contractor EPC timeline during fortnightly mentor review.'
  },
  {
    id: 'alert-03',
    timestamp: '2026-09-18 19:40 IST',
    triggerEvent: 'US Mont Belvieu ethane spot firmed to $157/t FOB (+3.1% YoY)',
    severity: 'CRITICAL',
    quantifiedImpact: 'Delivered ethane landed at Dahej is $282/t ($157 FOB + $125 freight), sustaining a gross ethylene cost gap of roughly 10x vs naphtha ($250/t vs $2,629/t).',
    affectedAssumptions: [
      'Delivered ethane cost calibrated at $282/t',
      'Operating cash margins protected against Asian cracker downcycle'
    ],
    downstreamScenarioImpact: 'Confirms RIL cost leadership in Asia; validates fast-track deployment of 3 new contracted VLECs.',
    recommendedAction: 'Maintain maximum VLEC sailing frequency from US Gulf export terminals.'
  }
];

export default function AlertsPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                Event Detection & Downstream Propagation
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Real-time Shock Analysis</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              ALERTS & MARKET EVENT SENTINEL
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              When a market or operational shock occurs, the sentinel quantifies impact, identifies affected model assumptions, reruns forecasts, and notifies leadership.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#F43F5E] bg-[#F43F5E]/15 px-3.5 py-2 rounded-lg border border-[#F43F5E]/30">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>3 Active System Alerts</span>
          </div>
        </div>

        {/* Alerts Feed */}
        <div className="space-y-4">
          {ALERTS_DATA.map((alert) => (
            <div
              key={alert.id}
              className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl hover:border-[#BFA161]/40 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#1E2738]">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                        : alert.severity === 'HIGH'
                        ? 'bg-[#BFA161]/20 text-[#D4BA7B] border border-[#BFA161]/30'
                        : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                    }`}
                  >
                    {alert.severity} PRIORITY
                  </span>
                  <h3 className="text-sm font-bold text-[#F8FAFC]">
                    {alert.triggerEvent}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#64748B]">
                  {alert.timestamp}
                </span>
              </div>

              {/* Quantified Impact */}
              <div className="text-xs text-[#CBD5E1] leading-relaxed">
                <strong className="text-[#F8FAFC]">Quantified Impact: </strong>
                {alert.quantifiedImpact}
              </div>

              {/* Affected Assumptions & Downstream Cascade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#38BDF8] block font-semibold">
                    Affected Model Assumptions:
                  </span>
                  <ul className="space-y-1 text-[#94A3B8]">
                    {alert.affectedAssumptions.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#38BDF8] mt-1.5 shrink-0" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#10B981] block font-semibold">
                    Downstream Scenario Recalculation:
                  </span>
                  <p className="text-[#CBD5E1]">
                    {alert.downstreamScenarioImpact}
                  </p>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="pt-2 border-t border-[#1E2738] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono text-[#BFA161] font-bold">
                    Prescribed Executive Action:
                  </span>
                  <span className="text-[#F8FAFC]">{alert.recommendedAction}</span>
                </div>
                <Link
                  href="/scenarios"
                  className="text-xs font-mono text-[#D4BA7B] hover:underline flex items-center gap-1 shrink-0"
                >
                  Rerun Scenario Cascade →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
