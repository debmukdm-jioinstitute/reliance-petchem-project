'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MARKET_COMMODITIES } from '@/data/knowledgeStore';

export default function DataLayerPage() {
  const dataQualityItems = [
    { metric: 'Platts CFR Ethylene Feed', frequency: 'Daily Tick', status: 'HEALTHY', latency: '12m', qualityScore: 99.4 },
    { metric: 'ICIS FOB Propylene Feed', frequency: 'Daily Tick', status: 'HEALTHY', latency: '14m', qualityScore: 98.9 },
    { metric: 'OPIS US Mont Belvieu Ethane', frequency: 'Hourly Tick', status: 'HEALTHY', latency: '5m', qualityScore: 99.8 },
    { metric: 'Argus Singapore Naphtha', frequency: 'Daily Tick', status: 'HEALTHY', latency: '8m', qualityScore: 99.2 },
    { metric: 'ICE Brent Crude Futures', frequency: 'Real-time', status: 'HEALTHY', latency: '2s', qualityScore: 100 },
    { metric: 'RBI USD/INR Reference Rate', frequency: 'Daily 13:30 IST', status: 'HEALTHY', latency: 'Synced', qualityScore: 100 }
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#BFA161]" />
                Modular Data Architecture
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">DataProvider Interface & Health Monitor</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              DATA LAYER & QUALITY MONITOR
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Pluggable data providers for Platts, ICIS, EIA, ICE, and RBI with automated anomaly detection, outlier screening, and currency/unit normalization.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] bg-[#10B981]/15 px-3.5 py-2 rounded-lg border border-[#10B981]/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>All 6 Adapters Active</span>
          </div>
        </div>

        {/* Data Quality Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Aggregate Feed Quality</span>
            <div className="text-2xl font-bold font-mono text-[#10B981]">99.6%</div>
            <div className="text-[10px] text-[#94A3B8]">0 dropped records in past 30 days</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Automated Anomaly Sentinel</span>
            <div className="text-2xl font-bold font-mono text-[#38BDF8]">0 Anomalies</div>
            <div className="text-[10px] text-[#94A3B8]">Z-score screening active across spreads</div>
          </div>
          <div className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#64748B]">Standardization Engine</span>
            <div className="text-2xl font-bold font-mono text-[#BFA161]">USD / MT & INR</div>
            <div className="text-[10px] text-[#94A3B8]">Auto-converts barrels & MMBtu to metric tonnes</div>
          </div>
        </div>

        {/* Feed Health Table */}
        <div className="rounded-xl border border-[#1A2232] bg-[#0E1420] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#CBD5E1]">
              <thead className="bg-[#0A0E17] text-[#64748B] uppercase font-mono text-[10px] tracking-wider border-b border-[#1A2232]">
                <tr>
                  <th className="py-3 px-4">Adapter / Feed Name</th>
                  <th className="py-3 px-4">Sampling Cadence</th>
                  <th className="py-3 px-4">Ingestion Latency</th>
                  <th className="py-3 px-4 text-right">Data Quality Score</th>
                  <th className="py-3 px-4 text-right">Operational Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2232] font-mono">
                {dataQualityItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#121A2B] transition-colors">
                    <td className="py-3.5 px-4 font-sans font-semibold text-[#F8FAFC]">
                      {item.metric}
                    </td>
                    <td className="py-3.5 px-4 text-[#94A3B8]">
                      {item.frequency}
                    </td>
                    <td className="py-3.5 px-4 text-[#38BDF8]">
                      {item.latency}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#10B981]">
                      {item.qualityScore}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-[10px]">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
