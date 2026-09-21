'use client';

import React from 'react';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import {
  Users,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { MEETINGS_DATA } from '@/data/knowledgeStore';
import { CardSpotlight, DottedGrid } from '@/components/obsidian';

export default function MeetingsListPage() {
  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <DottedGrid className="p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121217]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4BA7B] flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Meeting Intelligence
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Reliance Industries & Jio Institute
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Meeting Records & Transcripts
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
                Structured meeting notes with leadership decisions, action items, invalidated assumptions, and transcript citations.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <span>2 Verified Meetings</span>
            </div>
          </div>
        </DottedGrid>

        {/* Meeting Cards - High Visibility Bento Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MEETINGS_DATA.map((m) => (
            <CardSpotlight
              key={m.id}
              className="p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 dark:text-[#D4BA7B] border border-amber-500/20">
                    {m.date}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                    {m.status}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-[#D4BA7B] transition-colors">
                    {m.title}
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                    {m.topic}
                  </p>
                </div>

                {/* Key Participants */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Key Leadership
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.participants.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
                      >
                        {p.name} ({p.role})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Numbers */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60">
                    <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                      {m.decisions.length}
                    </span>
                    <span className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      Decisions
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60">
                    <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                      {m.actionItems.length}
                    </span>
                    <span className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      Actions
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60">
                    <span className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
                      {m.risksIdentified.length}
                    </span>
                    <span className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      Risks
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500">
                  {m.projectStage}
                </span>
                <Link
                  href={`/meetings/${m.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-neutral-900 dark:text-[#D4BA7B] hover:underline"
                >
                  <span>Open 10-Tab Intelligence</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CardSpotlight>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
