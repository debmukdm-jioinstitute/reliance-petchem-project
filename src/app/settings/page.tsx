'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  Settings,
  Cpu,
  Lock,
  CheckCircle2,
  Info
} from 'lucide-react';

const STACK_REFERENCE = [
  {
    layer: 'Live Prices',
    value: 'Yahoo Finance (Brent, Henry Hub, USD/INR)',
    detail: 'Fetched directly every 45s. See /data for the full breakdown.',
  },
  {
    layer: 'News Wire',
    value: '4 public RSS feeds',
    detail: 'Indian Chemical News, Google News (x2 queries), OilPrice.',
  },
  {
    layer: 'AI Copilot',
    value: 'Groq (gpt-oss-120b + gpt-oss-20b) + TinyFish web search',
    detail: 'See src/app/api/ai/copilot/route.ts.',
  },
  {
    layer: 'Forecasts & Monte Carlo',
    value: 'Static reference datasets + in-browser math',
    detail: 'TimesFM/LightGBM/AutoARIMA model names describe the reference dataset\'s provenance — not a live model running in this app.',
  },
];

export default function SettingsPage() {
  const [activeRole, setActiveRole] = useState<string>('Leadership');

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 p-6 rounded-2xl bg-[#0B0F19] border border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-[#BFA161]" />
                What&rsquo;s actually running, and what&rsquo;s a design reference
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              PLATFORM REFERENCE
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              This page is read-only. There is no config backend — nothing here is a live switch, and nothing
              you click persists anywhere.
            </p>
          </div>
        </div>

        {/* Stack Reference */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-6 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1E2738]">
            <Cpu className="w-4 h-4 text-[#BFA161]" />
            <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wide">
              Current Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {STACK_REFERENCE.map((item) => (
              <div key={item.layer} className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#38BDF8] font-semibold">
                  {item.layer}
                </span>
                <div className="text-sm font-semibold text-[#F8FAFC]">{item.value}</div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RBAC Design Reference */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-6 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1E2738]">
            <Lock className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wide">
              Role-Based Access — Design Reference
            </h2>
          </div>

          <div className="p-3 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/25 flex items-start gap-2 text-[11px] text-[#94A3B8]">
            <Info className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
            <span>
              No access control is enforced anywhere in this app — every page is open to anyone with the link.
              This toggle just previews what each role&rsquo;s permission set is intended to look like if RBAC
              were built.
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#CBD5E1] block mb-2">
                Preview role:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Leadership', 'Project Team', 'Mentor', 'Admin', 'Viewer'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className={`px-3.5 py-1.5 rounded-lg border font-mono transition-all ${
                      activeRole === role
                        ? 'bg-[#10B981] text-[#080B10] font-bold border-[#10B981]'
                        : 'bg-[#0A0E17] text-[#94A3B8] border-[#1E2738] hover:text-white'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1E2738] space-y-2">
              <span className="text-[10px] font-mono uppercase text-[#38BDF8] font-semibold">
                Intended permissions for [{activeRole}]:
              </span>
              <ul className="space-y-1 text-xs text-[#CBD5E1]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Access to executive briefings and 60-second leadership digests</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Interactive execution of multi-variable financial scenarios and Monte Carlo simulations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Full traceability into the document store, decisions register, and assumption logs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
