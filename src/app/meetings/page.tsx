'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { MEETINGS_DATA } from '@/data/knowledgeStore';

export default function MeetingsListPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#BFA161]" />
                Institutional Meeting Intelligence
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Reliance Industries & Jio Institute</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              MEETING REGISTER & TRANSCRIPTS
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Fully indexed and extracted meeting records with 10-tab transcript intelligence, decision registers, assumption validation, and line-level citations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#94A3B8] bg-[#0E1420] px-3.5 py-2 rounded-lg border border-[#1E2738]">
            <span>2 Ground Truth Meetings Active</span>
          </div>
        </div>

        {/* Meeting List Table */}
        <div className="rounded-xl border border-[#1A2232] bg-[#0E1420] overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#CBD5E1]">
              <thead className="bg-[#0A0E17] text-[#64748B] uppercase font-mono text-[10px] tracking-wider border-b border-[#1A2232]">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Meeting & Scope</th>
                  <th className="py-3 px-4">Key Leadership</th>
                  <th className="py-3 px-4">Decisions</th>
                  <th className="py-3 px-4">Actions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A2232]">
                {MEETINGS_DATA.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-[#121A2B] transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#D4BA7B] whitespace-nowrap">
                      {m.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link href={`/meetings/${m.id}`} className="block">
                        <div className="font-semibold text-sm text-[#F8FAFC] group-hover:text-[#BFA161] transition-colors">
                          {m.title}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] mt-0.5 line-clamp-1">
                          {m.topic}
                        </div>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-xs text-[#F8FAFC]">
                        {m.participants[0].name}
                      </div>
                      <div className="text-[10px] text-[#64748B]">
                        {m.participants[0].role}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#10B981]">
                      {m.decisions.length} recorded
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#38BDF8]">
                      {m.actionItems.length} items
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/meetings/${m.id}`}
                        className="inline-flex items-center gap-1 text-xs font-mono text-[#BFA161] group-hover:text-[#D4BA7B] transition-colors"
                      >
                        Inspect Transcript <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upload Transcript Information Banner */}
        <div className="p-5 rounded-xl bg-[#0E1420] border border-[#242F44] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#BFA161]" />
              Automated Transcript Intelligence Pipeline
            </div>
            <p className="text-xs text-[#94A3B8]">
              Drop any DOCX, PDF, or raw transcript. The system automatically parses attendees, extracts decisions, invalidates stale assumptions, embeds chunks into vector space, and links entities to the knowledge graph.
            </p>
          </div>
          <Link
            href="/documents"
            className="px-4 py-2 rounded-lg bg-[#151D2C] hover:bg-[#1E293B] border border-[#242F44] text-xs font-mono text-[#F8FAFC] flex items-center gap-2 shrink-0 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Manage All Documents</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
