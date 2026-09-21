'use client';

import React from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  Cpu,
  Ship,
  GitMerge,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  Flame,
  ArrowRight
} from 'lucide-react';
import { CRACKER_ASSETS } from '@/data/knowledgeStore';

export default function OperationsPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#BFA161]" />
                Cracker Operations & Feedstock Infrastructure
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Jamnagar, Dahej, Hazira, Nagothane, Vadodara</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              OPERATIONS & VLEC LOGISTICS
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Operational reality: RIL possesses sub-day feedstock switching flexibility. Ingested logistics data covering 6 operating + 3 planned VLECs and the 100km Dahej pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] bg-[#10B981]/15 px-3.5 py-2 rounded-lg border border-[#10B981]/30">
            <span>Switching Agility: &lt; 24 Hours</span>
          </div>
        </div>

        {/* Operational Reality Banner */}
        <div className="p-5 rounded-xl bg-[#0E1524] border border-[#BFA161]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase text-[#D4BA7B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#BFA161]" />
              Verified Operational Capability
            </span>
            <span className="text-[10px] font-mono text-[#64748B]">
              AI Cracker Industry Analysis, Section 2
            </span>
          </div>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            &quot;Reliance already has built operational flexibility to switch feedstocks within a fraction of a day... The naphtha-to-ethane shift is already an established, completed decision for RIL.&quot;
          </p>
        </div>

        {/* VLEC Fleet & Cryogenic Terminal Logistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#38BDF8]">
              <Ship className="w-4 h-4 text-[#38BDF8]" />
              VLEC Ethane Fleet (6 + 3 Vessels)
            </div>
            <p className="text-xs text-[#94A3B8]">
              Very Large Ethane Carriers transporting ~1.5 MMTPA cryogenic liquid ethane (-90°C) from US Mont Belvieu / Morgan&apos;s Point to Dahej.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Active Operating Fleet:</span>
                <span className="font-bold text-[#F8FAFC]">6 VLECs</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Planned Additions:</span>
                <span className="font-bold text-[#D4BA7B]">3 New VLECs</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Vessel Capacity:</span>
                <span className="font-bold text-[#F8FAFC]">~87,000 cbm each</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Transit Time:</span>
                <span className="font-bold text-[#38BDF8]">~22 Days</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#10B981]">
              <GitMerge className="w-4 h-4 text-[#10B981]" />
              Dahej Ethane Terminal & Pipeline
            </div>
            <p className="text-xs text-[#94A3B8]">
              Cryogenic discharge berth, atmospheric storage tanks, and high-pressure ethylene/ethane transfer corridor.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Terminal Capacity:</span>
                <span className="font-bold text-[#F8FAFC]">&gt; 1.5 MMTPA</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Dedicated Pipeline:</span>
                <span className="font-bold text-[#D4BA7B]">~100 km length</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Connected Plants:</span>
                <span className="font-bold text-[#F8FAFC]">Hazira & Dahej</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Purity Specification:</span>
                <span className="font-bold text-[#10B981]">99.5% Polymer Grade</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#BFA161]">
              <Flame className="w-4 h-4 text-[#BFA161]" />
              Cracker Yield & Optimization
            </div>
            <p className="text-xs text-[#94A3B8]">
              Automated LP optimizer evaluates crack spreads every 4 hours to allocate ethane vs naphtha furnace passes.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Ethane Ethylene Yield:</span>
                <span className="font-bold text-[#10B981]">~80%</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Naphtha Ethylene Yield:</span>
                <span className="font-bold text-[#F43F5E]">~30%</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Optimizer Cycle:</span>
                <span className="font-bold text-[#D4BA7B]">Real-Time (Continuous)</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1E2738] flex justify-between">
                <span className="text-[#94A3B8]">Surrogate ML Model:</span>
                <span className="font-bold text-[#38BDF8]">Phase 1 In Progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Plant Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B]">
              Cracker Complex Operational Slates
            </h2>
            <span className="text-[10px] text-[#64748B] font-mono">Real-Time Mass Balances</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRACKER_ASSETS.map((asset) => (
              <div
                key={asset.id}
                className="p-5 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#F8FAFC]">
                    {asset.siteName} Complex
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981]">
                    Online • 94% Rate
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Ethylene Capacity:</span>
                    <span className="text-[#F8FAFC]">{asset.ethyleneCapacityKTA.toLocaleString()} KTA</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Ethane Feedstock Allocation:</span>
                    <span className="text-[#10B981] font-semibold">{asset.currentFeedstockCapacityMMTPA.ethane} MMTPA</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Naphtha Feedstock Allocation:</span>
                    <span className="text-[#F43F5E]">{asset.currentFeedstockCapacityMMTPA.naphtha} MMTPA</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1E2738] flex items-center justify-between text-[10px] text-[#64748B] font-mono">
                  <span>Pipeline Link: {asset.pipelineConnected ? 'Yes' : 'No'}</span>
                  <span className="text-[#D4BA7B]">Tier {asset.conversionTierRank} Asset</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
