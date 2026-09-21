'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  User,
  Calendar,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { MEETINGS_DATA } from '@/data/knowledgeStore';

interface ActionItem {
  id: string;
  action: string;
  meetingTitle: string;
  meetingDate: string;
  owner: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
  dependency?: string;
  evidence: string;
}

const ALL_ACTIONS: ActionItem[] = [
  {
    id: 'act-01',
    action: 'Review Reliance Industries FY25 Annual Report (O2C & Petrochemical segments)',
    meetingTitle: 'Meeting 1 (06 Jul 2026)',
    meetingDate: '2026-07-06',
    owner: 'Debabrata Mukherjee & Team 9',
    dueDate: '2026-07-14',
    priority: 'HIGH',
    status: 'COMPLETED',
    evidence: 'Extracted ₹6,26,921 Cr O2C revenue and ₹54,988 Cr EBITDA into Group 9 Report.'
  },
  {
    id: 'act-02',
    action: 'Benchmark external AI use cases across global chemical majors (ExxonMobil, Dow, SABIC, BASF)',
    meetingTitle: 'Meeting 1 (06 Jul 2026)',
    meetingDate: '2026-07-06',
    owner: 'Dhruv Choudhary & Ishan Lath',
    dueDate: '2026-07-20',
    priority: 'HIGH',
    status: 'COMPLETED',
    evidence: 'Compiled peer matrix covering PINNs, digital twins, and reinforcement learning.'
  },
  {
    id: 'act-03',
    action: 'Formulate Project Scope Document defining Dual Simulation (RIL + Global Cracker)',
    meetingTitle: 'Meeting 2 (20 Jul 2026)',
    meetingDate: '2026-07-20',
    owner: 'Debabrata Mukherjee & Dhruv Choudhary',
    dueDate: '2026-08-01',
    priority: 'HIGH',
    status: 'COMPLETED',
    evidence: 'Produced AI Cracker Industry Document circulated to Hanoz and Adepu.'
  },
  {
    id: 'act-04',
    action: 'Establish recurring Friday weekly schedule cadence for mentorship updates',
    meetingTitle: 'Meeting 2 (20 Jul 2026)',
    meetingDate: '2026-07-20',
    owner: 'Dhruv Choudhary',
    dueDate: '2026-07-25',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    evidence: 'Coordinating weekly availability slots.'
  },
  {
    id: 'act-05',
    action: 'Calibrate asset-level feedstock throughput parameters with Reliance Cracker business team',
    meetingTitle: 'Scope Document Milestone',
    meetingDate: '2026-08-15',
    owner: 'Debabrata Mukherjee',
    dueDate: '2026-09-30',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dependency: 'Reliance mentor review session',
    evidence: 'Using public baseline bounds (Jamnagar 1.6M, Dahej 1.2M ethane).'
  }
];

export default function ActionCenterPage() {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered =
    filterStatus === 'ALL'
      ? ALL_ACTIONS
      : ALL_ACTIONS.filter((a) => a.status === filterStatus);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-[#BFA161]" />
                Execution Tracking & Governance
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Extracted Directly from Meeting Transcripts</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              ACTION CENTER
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Every action item is generated automatically from verified meeting records with explicit ownership, due dates, status, and supporting evidence.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] bg-[#10B981]/15 px-3.5 py-2 rounded-lg border border-[#10B981]/30">
            <span>{ALL_ACTIONS.filter((a) => a.status === 'COMPLETED').length} of {ALL_ACTIONS.length} Actions Completed</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {['ALL', 'COMPLETED', 'IN_PROGRESS', 'NOT_STARTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filterStatus === st
                  ? 'bg-[#BFA161] text-[#080B10] font-bold border-[#BFA161]'
                  : 'bg-[#0E1420] text-[#94A3B8] border-[#1A2232] hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Action Items List */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-[#0E1420] border border-[#1A2232] hover:border-[#BFA161]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                      item.status === 'COMPLETED'
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                        : item.status === 'IN_PROGRESS'
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30'
                        : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B] bg-[#121824] px-2 py-0.5 rounded border border-[#1E2738]">
                    Priority: {item.priority}
                  </span>
                  <span className="text-[10px] font-mono text-[#D4BA7B]">
                    Source: {item.meetingTitle}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[#F8FAFC]">
                  {item.action}
                </h3>

                <div className="text-[11px] text-[#94A3B8]">
                  <strong className="text-[#CBD5E1]">Evidence of Execution: </strong>
                  {item.evidence}
                </div>

                {item.dependency && (
                  <div className="text-[10px] text-[#F59E0B] font-mono">
                    Dependency: {item.dependency}
                  </div>
                )}
              </div>

              <div className="flex md:flex-col items-start md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-[#1A2232] pt-2 md:pt-0 md:pl-4 shrink-0 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-[#CBD5E1]">
                  <User className="w-3.5 h-3.5 text-[#BFA161]" />
                  <span>{item.owner}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#64748B] text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Due: {item.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
