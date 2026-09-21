'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell, { useIntelligence } from '@/components/layout/AppShell';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Tag,
  Share2,
  FileCode,
  Bookmark
} from 'lucide-react';
import { MEETINGS_DATA } from '@/data/knowledgeStore';

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { openAuditModal } = useIntelligence();

  const meetingId = (params?.id as string) || 'meeting-1';
  const meeting = MEETINGS_DATA.find((m) => m.id === meetingId) || MEETINGS_DATA[0];

  const [activeTab, setActiveTab] = useState<
    | 'SUMMARY'
    | 'DECISIONS'
    | 'ACTIONS'
    | 'RISKS'
    | 'ASSUMPTIONS'
    | 'NUMBERS'
    | 'TOPICS'
    | 'ENTITIES'
    | 'CHANGES'
    | 'TRANSCRIPT'
  >('SUMMARY');

  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);

  const jumpToTranscriptLine = (lineIdx: number) => {
    setActiveTab('TRANSCRIPT');
    setHighlightedLine(lineIdx);
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/meetings"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#94A3B8] hover:text-[#BFA161] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Meetings Register
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuditModal('audit-01')}
              className="px-3 py-1.5 rounded-lg bg-[#BFA161]/15 hover:bg-[#BFA161]/25 border border-[#BFA161]/40 text-[#D4BA7B] text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#BFA161]" />
              Audit This Meeting
            </button>
          </div>
        </div>

        {/* Meeting Header */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  {meeting.status}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
                  {meeting.projectStage}
                </span>
                <span className="text-[10px] font-mono text-[#64748B]">
                  Date: {meeting.date}
                </span>
              </div>
              <h1 className="text-xl lg:text-2xl font-bold text-[#F8FAFC]">
                {meeting.title}
              </h1>
              <p className="text-xs text-[#94A3B8] max-w-3xl">
                Topic: {meeting.topic}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-[#64748B] block">Meeting ID</span>
              <span className="text-xs font-mono text-[#D4BA7B]">{meeting.id}</span>
            </div>
          </div>

          {/* Attendees List */}
          <div className="pt-3 border-t border-[#1E2738]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] mb-2">
              Participants & Leadership ({meeting.participants.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {meeting.participants.map((p, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-[#141B28] border border-[#1E293B] text-[11px] flex items-center gap-2"
                >
                  <span className="font-semibold text-[#F8FAFC]">{p.name}</span>
                  <span className="text-[#64748B]">•</span>
                  <span className="text-[#94A3B8]">{p.role}</span>
                  <span className="text-[9px] font-mono text-[#BFA161]">({p.affiliation})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 10 Intelligence Tabs Navigation */}
        <div className="flex items-center overflow-x-auto border-b border-[#1A2232] gap-1 text-xs no-scrollbar">
          {[
            { id: 'SUMMARY', label: 'Summary' },
            { id: 'DECISIONS', label: `Decisions (${meeting.decisions.length})` },
            { id: 'ACTIONS', label: `Actions (${meeting.actionItems.length})` },
            { id: 'RISKS', label: `Risks (${meeting.risksIdentified.length})` },
            { id: 'ASSUMPTIONS', label: `Assumptions (${meeting.assumptionsCreated.length + meeting.assumptionsInvalidated.length})` },
            { id: 'NUMBERS', label: `Numbers (${meeting.numbersExtracted.length})` },
            { id: 'TOPICS', label: `Topics (${meeting.topics.length})` },
            { id: 'ENTITIES', label: `Entities (${meeting.entities.length})` },
            { id: 'CHANGES', label: 'Changes' },
            { id: 'TRANSCRIPT', label: 'Raw Transcript' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 font-medium whitespace-nowrap border-b-2 transition-all text-xs ${
                activeTab === tab.id
                  ? 'border-[#BFA161] text-[#D4BA7B] bg-[#121A2B]/60'
                  : 'border-transparent text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#0E1420]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: AI SUMMARY */}
        {activeTab === 'SUMMARY' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#BFA161]">
                <Sparkles className="w-4 h-4 text-[#BFA161]" />
                What Happened? (Executive AI Summary)
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {meeting.aiSummary}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-3">
              <div className="text-xs font-mono font-semibold uppercase text-[#64748B]">
                Key Discussion Points
              </div>
              <ul className="space-y-2 text-xs text-[#94A3B8]">
                {meeting.keyDiscussion.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#BFA161] mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-2">
              <div className="text-xs font-mono font-semibold uppercase text-[#64748B]">
                Project Direction & Impact
              </div>
              <p className="text-xs text-[#F8FAFC]">
                {meeting.projectImpact}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: DECISIONS */}
        {activeTab === 'DECISIONS' && (
          <div className="space-y-4">
            {meeting.decisions.map((dec) => (
              <div
                key={dec.id}
                className="p-5 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#F8FAFC]">
                    {dec.decision}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                    {dec.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1A2232]">
                    <span className="text-[10px] uppercase font-mono text-[#64748B] block">Rationale:</span>
                    <span className="text-[#CBD5E1]">{dec.rationale}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1A2232]">
                    <span className="text-[10px] uppercase font-mono text-[#64748B] block">Strategic Impact:</span>
                    <span className="text-[#10B981]">{dec.impact}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#141B28] border border-[#1E293B] text-xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#64748B] font-mono block">Direct Transcript Citation:</span>
                    <blockquote className="text-[11px] text-[#D4BA7B] italic">
                      &ldquo;{dec.sourceCitation.exactQuote}&rdquo;
                    </blockquote>
                  </div>
                  <button
                    onClick={() => jumpToTranscriptLine(3)}
                    className="text-xs font-mono text-[#38BDF8] hover:underline shrink-0 ml-4"
                  >
                    View in Transcript →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: ACTIONS */}
        {activeTab === 'ACTIONS' && (
          <div className="space-y-3">
            {meeting.actionItems.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#F8FAFC]">{act.action}</span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    Evidence: {act.evidence}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                  <span className="text-[#94A3B8]">Owner: <strong className="text-[#F8FAFC]">{act.owner}</strong></span>
                  <span className="text-[#64748B]">Due: {act.dueDate}</span>
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                    {act.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: RISKS */}
        {activeTab === 'RISKS' && (
          <div className="space-y-3">
            {meeting.risksIdentified.map((rsk) => (
              <div
                key={rsk.id}
                className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F8FAFC] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                    {rsk.risk}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-[#F59E0B]/20 text-[#F59E0B]">
                      Severity: {rsk.severity}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#162030] text-[#94A3B8]">
                      Trend: {rsk.trend}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#1A2232] text-[#94A3B8]">
                  <strong className="text-[#F8FAFC]">Mitigation Strategy:</strong> {rsk.mitigation}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: ASSUMPTIONS (Created & Invalidated) */}
        {activeTab === 'ASSUMPTIONS' && (
          <div className="space-y-6">
            {/* Invalidated Assumptions (Critical) */}
            {meeting.assumptionsInvalidated.length > 0 && (
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#F43F5E] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#F43F5E]" />
                  Assumptions Invalidated During This Meeting
                </div>
                {meeting.assumptionsInvalidated.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-5 rounded-xl bg-[#1C1216] border border-[#F43F5E]/30 space-y-3 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono text-[#F43F5E]">Original Stale Assumption:</span>
                      <div className="text-sm font-semibold text-[#F8FAFC]">
                        &ldquo;{inv.originalAssumption}&rdquo;
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#242F44]">
                        <span className="text-[10px] uppercase font-mono text-[#64748B] block">Why Invalidated:</span>
                        <span className="text-[#CBD5E1]">{inv.invalidationReason}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-[#0A0E17] border border-[#242F44]">
                        <span className="text-[10px] uppercase font-mono text-[#10B981] block">Updated Understanding:</span>
                        <span className="text-[#34D399] font-medium">{inv.updatedUnderstanding}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F43F5E]/20 text-[11px] font-mono text-[#D4BA7B] flex items-center justify-between">
                      <span>Source: {inv.sourceCitation.sourceTitle} ({inv.sourceCitation.speaker})</span>
                      <button
                        onClick={() => openAuditModal('audit-01')}
                        className="hover:underline flex items-center gap-1"
                      >
                        Audit Invalidation →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Created Assumptions */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981]">
                Active Assumptions Created
              </div>
              {meeting.assumptionsCreated.map((asm) => (
                <div
                  key={asm.id}
                  className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#F8FAFC]">{asm.assumption}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981]">
                      {asm.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#94A3B8]">
                    Value: <strong className="text-[#CBD5E1]">{asm.value}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: NUMBERS */}
        {activeTab === 'NUMBERS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meeting.numbersExtracted.map((num, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#94A3B8]">{num.metric}</span>
                  <span className="text-base font-bold font-mono text-[#BFA161]">
                    {num.value} <span className="text-xs text-[#94A3B8]">{num.unit}</span>
                  </span>
                </div>
                <p className="text-[11px] text-[#CBD5E1]">
                  Context: {num.context}
                </p>
                <blockquote className="text-[10px] text-[#64748B] italic border-l border-[#BFA161]/50 pl-2">
                  &ldquo;{num.sourceCitation.exactQuote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        )}

        {/* Tab 7: TOPICS & Tab 8: ENTITIES */}
        {activeTab === 'TOPICS' && (
          <div className="p-5 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-3">
            <div className="text-xs font-mono uppercase text-[#64748B]">Extracted Discussion Topics</div>
            <div className="flex flex-wrap gap-2">
              {meeting.topics.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-[#141B28] border border-[#1E293B] text-xs text-[#CBD5E1]"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ENTITIES' && (
          <div className="p-5 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-3">
            <div className="text-xs font-mono uppercase text-[#64748B]">Tagged Relational Entities</div>
            <div className="flex flex-wrap gap-2">
              {meeting.entities.map((e, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-[#162030] border border-[#242F44] text-xs text-[#38BDF8]"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tab 9: CHANGES */}
        {activeTab === 'CHANGES' && (
          <div className="p-5 rounded-xl bg-[#0E1420] border border-[#1A2232] space-y-3">
            <div className="text-xs font-mono uppercase text-[#64748B]">Since This Meeting</div>
            <p className="text-xs text-[#CBD5E1] leading-relaxed">
              This meeting redefined the project baseline. Following Meeting 1, the student team produced the AI Cracker Industry Document and Group 9 Live Project Proposal, directly incorporating Rajesh Rawal&apos;s guidance on AI optimization, capacity expansion financial modeling, and scenario forecasting.
            </p>
          </div>
        )}

        {/* Tab 10: RAW TRANSCRIPT */}
        {activeTab === 'TRANSCRIPT' && (
          <div className="p-5 rounded-xl bg-[#080B10] border border-[#1A2232] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E2738] text-[10px] text-[#64748B]">
              <span>Raw Document & Transcript Log</span>
              <span>Click any quote to audit</span>
            </div>

            <div className="space-y-2">
              {meeting.rawTranscript.map((t) => (
                <div
                  key={t.lineIndex}
                  className={`p-3 rounded-lg border transition-all ${
                    t.highlighted || highlightedLine === t.lineIndex
                      ? 'bg-[#BFA161]/10 border-[#BFA161]/50 text-[#F8FAFC]'
                      : 'bg-[#0E1420] border-[#1A2232] text-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-1">
                    <span className="font-bold text-[#D4BA7B]">{t.speaker}</span>
                    <span>Line #{t.lineIndex}</span>
                  </div>
                  <p className="leading-relaxed text-xs">
                    {t.text}
                  </p>
                  {t.annotation && (
                    <div className="mt-2 text-[10px] text-[#10B981] flex items-center gap-1.5">
                      <Bookmark className="w-3 h-3" />
                      <span>{t.annotation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
