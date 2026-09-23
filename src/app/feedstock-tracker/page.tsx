'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { DottedGrid, MagnetTabs } from '@/components/obsidian';
import { GlassCard3D, GlassMetricBox } from '@/components/glass';
import {
  Database,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
} from 'lucide-react';
import {
  FEEDSTOCK_GROUPS,
  FEEDSTOCK_SPEC_SHEET,
  LIVE_BENCHMARK_TICKER,
  getColumnsByGroup,
  getColumnStats,
  getMonthlyByGroup,
} from '@/data/feedstockTracker';

const OVERVIEW_METRIC_KEYS = [
  'brentDated',
  'usEthaneFob',
  'naphthaCfrJapan',
  'ethyleneCfr',
  'peNaphtha',
  'ethaneAdvantage',
  'integratedMargin',
  'polyesterSpread',
];

function fmt(n: number, unit: string) {
  if (unit === '$/kg') return n.toFixed(2);
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(2);
}

function monthLabel(ym: string) {
  const [y, m] = ym.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

export default function FeedstockTrackerPage() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [period, setPeriod] = useState<14 | 36>(14);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    ...FEEDSTOCK_GROUPS.map((g, i) => ({ id: `g${i}`, label: groupShortLabel(g) })),
  ];

  const activeGroup =
    activeTab === 'overview' ? null : FEEDSTOCK_GROUPS[Number(activeTab.replace('g', ''))];

  const groupColumns = activeGroup ? getColumnsByGroup(activeGroup) : [];
  const groupMonthly = activeGroup ? getMonthlyByGroup(activeGroup, period) : [];
  const groupStats = groupColumns.map((c) => getColumnStats(c.key));

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <DottedGrid className="rounded-3xl border border-black/[0.05] dark:border-white/10 bg-white dark:bg-[#121217] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#8F7640] dark:text-[#D4BA7B] font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  Enterprise Raw Material Tracker
                </span>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Oct 2025 – Sep 2026 · Monthly · 3Y History to Oct 2023
                </span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                O2C Feedstock &amp; Petrochemical Price Tracker
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 max-w-2xl">
                Global crude slates, cracker feeds, chlor-alkali, polyester precursors, catalysts &amp; utilities
                mapped to RIL&rsquo;s Jamnagar, Dahej, Hazira, Nagothane &amp; Vadodara O2C complex.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3.5 py-2 rounded-full border border-emerald-500/25 shrink-0">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>4 Live Tickers Synchronized</span>
            </div>
          </div>
        </DottedGrid>

        {/* Tabs + Period toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="overflow-x-auto pb-1">
            <MagnetTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>
          {activeGroup && (
            <MagnetTabs
              tabs={[
                { id: '14', label: 'Current 14M' },
                { id: '36', label: 'Full 3Y (36M)' },
              ]}
              activeTab={String(period)}
              onChange={(id) => setPeriod(Number(id) as 14 | 36)}
            />
          )}
        </div>

        {activeTab === 'overview' ? (
          <OverviewPanel />
        ) : (
          <GroupPanel
            group={activeGroup!}
            columns={groupColumns}
            monthly={groupMonthly}
            stats={groupStats}
            period={period}
          />
        )}
      </div>
    </AppShell>
  );
}

function groupShortLabel(g: string) {
  const map: Record<string, string> = {
    'UPSTREAM CRUDE SLATES & HEAVY FEEDSTOCK BASKET': 'Crude Slates',
    'CRACKER FEEDSTOCKS & OLEFINS PRECURSORS': 'Cracker Feeds',
    'CHLOR-ALKALI & VINYLS CHAIN INPUTS': 'Chlor-Alkali',
    'POLYESTER PRECURSORS & AROMATICS': 'Polyester Precursors',
    'CATALYSTS & INDUSTRIAL CHEMICALS': 'Catalysts',
    'ENERGY, FUEL & UTILITY INPUTS': 'Energy & Utilities',
    'DOWNSTREAM POLYMER & POLYESTER REALIZATIONS': 'Downstream Realizations',
    'CRACK SPREADS, FEED ADVANTAGE & INTEGRATED MARGINS': 'Spreads & Margins',
  };
  return map[g] || g;
}

function OverviewPanel() {
  return (
    <div className="space-y-6">
      {/* Live Benchmark Ticker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {OVERVIEW_METRIC_KEYS.map((key) => {
          const s = getColumnStats(key);
          const up = s.momPct >= 0;
          return (
            <GlassMetricBox
              key={key}
              title={s.label}
              value={fmt(s.latest, s.unit)}
              unit={s.unit}
              subtitle={`LTM ${fmt(s.ltmMin, s.unit)} – ${fmt(s.ltmMax, s.unit)}`}
              trend={up ? 'up' : 'down'}
              trendValue={`${up ? '+' : ''}${s.momPct.toFixed(1)}% MoM`}
              commodityId={key}
              showInfoIcon={false}
            />
          );
        })}
      </div>

      {/* Live Data Stream ticker strip */}
      <GlassCard3D className="p-4 md:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-200">
            Automated Spot Feed Status
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-neutral-500 dark:text-neutral-400 uppercase font-mono text-[10px] tracking-wider border-b border-neutral-200 dark:border-white/10">
                <th className="py-2 pr-4">Benchmark</th>
                <th className="py-2 pr-4">Pricing Basis</th>
                <th className="py-2 pr-4 text-right">Price</th>
                <th className="py-2 pr-4">Unit</th>
                <th className="py-2 pr-4 text-right">Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-white/5 font-mono">
              {LIVE_BENCHMARK_TICKER.map((t, i) => (
                <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="py-2.5 pr-4 font-sans font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                    {t.benchmark}
                  </td>
                  <td className="py-2.5 pr-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {t.basis}
                  </td>
                  <td className="py-2.5 pr-4 text-right font-bold text-neutral-900 dark:text-white">
                    {t.price}
                  </td>
                  <td className="py-2.5 pr-4 text-neutral-500 dark:text-neutral-400">{t.unit}</td>
                  <td
                    className={`py-2.5 pr-4 text-right font-semibold whitespace-nowrap ${
                      t.indicator.includes('▲')
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : t.indicator.includes('▼')
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-neutral-500'
                    }`}
                  >
                    {t.indicator}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard3D>

      {/* Raw Material Specification Sheet */}
      <GlassCard3D className="p-4 md:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-3.5 h-3.5 text-[#8F7640] dark:text-[#D4BA7B]" />
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-200">
            Raw Material Specification &amp; RIL Integration Map
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-neutral-500 dark:text-neutral-400 uppercase font-mono text-[10px] tracking-wider border-b border-neutral-200 dark:border-white/10">
                <th className="py-2 pr-4">Material</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Benchmark Origin &amp; Grade</th>
                <th className="py-2 pr-4">Pricing Basis</th>
                <th className="py-2 pr-4 text-right">Sep-26 Spot</th>
                <th className="py-2 pr-4">RIL Node</th>
                <th className="py-2 pr-4">Strategic Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
              {FEEDSTOCK_SPEC_SHEET.map((row, i) => (
                <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors align-top">
                  <td className="py-2.5 pr-4 font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                    {row.material}
                  </td>
                  <td className="py-2.5 pr-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-white/10 border border-neutral-200 dark:border-white/10 text-[10px] font-semibold">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 text-neutral-600 dark:text-neutral-300 min-w-[200px]">
                    {row.benchmark}
                  </td>
                  <td className="py-2.5 pr-4 text-neutral-500 dark:text-neutral-400 font-mono whitespace-nowrap">
                    {row.pricingBasis}
                  </td>
                  <td className="py-2.5 pr-4 text-right font-mono font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                    {row.spotPriceLabel}
                  </td>
                  <td className="py-2.5 pr-4 text-neutral-600 dark:text-neutral-300 min-w-[180px]">
                    {row.rilNode}
                  </td>
                  <td className="py-2.5 pr-4 text-neutral-500 dark:text-neutral-400 min-w-[260px]">
                    {row.strategicRole}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard3D>
    </div>
  );
}

function GroupPanel({
  group,
  columns,
  monthly,
  stats,
  period,
}: {
  group: string;
  columns: { key: string; label: string; unit: string; group: string }[];
  monthly: { date: string; values: Record<string, number> }[];
  stats: ReturnType<typeof getColumnStats>[];
  period: 14 | 36;
}) {
  return (
    <div className="space-y-6">
      {/* Column summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => {
          const up = s.momPct >= 0;
          return (
            <GlassMetricBox
              key={s.key}
              title={s.label}
              value={fmt(s.latest, s.unit)}
              unit={s.unit}
              subtitle={`3Y range ${fmt(s.y3Min, s.unit)} – ${fmt(s.y3Max, s.unit)}`}
              trend={up ? 'up' : 'down'}
              trendValue={`${up ? '+' : ''}${s.momPct.toFixed(1)}% MoM`}
              commodityId={s.key}
              showInfoIcon={false}
            />
          );
        })}
      </div>

      {/* Monthly matrix */}
      <GlassCard3D className="p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-200">
            {group} — {period === 14 ? 'Oct 2025 – Sep 2026' : 'Oct 2023 – Sep 2026 (3Y)'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-neutral-500 dark:text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-200 dark:border-white/10">
                <th className="py-2 pr-4 sticky left-0 bg-white dark:bg-[#121218] font-sans">Month</th>
                {columns.map((c) => (
                  <th key={c.key} className="py-2 px-3 text-right whitespace-nowrap">
                    {c.label}
                    <div className="text-[9px] normal-case font-normal text-neutral-400">{c.unit}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
              {monthly.map((row) => (
                <tr key={row.date} className="hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="py-2 pr-4 sticky left-0 bg-white dark:bg-[#121218] font-sans font-semibold text-neutral-900 dark:text-white whitespace-nowrap">
                    {monthLabel(row.date)}
                  </td>
                  {columns.map((c) => (
                    <td key={c.key} className="py-2 px-3 text-right text-neutral-700 dark:text-neutral-300">
                      {fmt(row.values[c.key], c.unit)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-neutral-200 dark:border-white/10 bg-neutral-50/60 dark:bg-white/[0.03]">
                <td className="py-2 pr-4 sticky left-0 bg-neutral-50/95 dark:bg-[#161b22] font-sans font-bold text-neutral-900 dark:text-white">
                  {period === 14 ? 'LTM' : '3Y'} Average
                </td>
                {stats.map((s) => (
                  <td key={s.key} className="py-2 px-3 text-right font-bold text-neutral-900 dark:text-white">
                    {fmt(period === 14 ? s.ltmAvg : s.y3Avg, s.unit)}
                  </td>
                ))}
              </tr>
              <tr className="bg-neutral-50/40 dark:bg-white/[0.02]">
                <td className="py-2 pr-4 sticky left-0 bg-neutral-50/95 dark:bg-[#161b22] font-sans text-neutral-600 dark:text-neutral-400">
                  {period === 14 ? 'LTM' : '3Y'} Min
                </td>
                {stats.map((s) => (
                  <td key={s.key} className="py-2 px-3 text-right text-neutral-500 dark:text-neutral-400">
                    {fmt(period === 14 ? s.ltmMin : s.y3Min, s.unit)}
                  </td>
                ))}
              </tr>
              <tr className="bg-neutral-50/40 dark:bg-white/[0.02]">
                <td className="py-2 pr-4 sticky left-0 bg-neutral-50/95 dark:bg-[#161b22] font-sans text-neutral-600 dark:text-neutral-400">
                  {period === 14 ? 'LTM' : '3Y'} Max
                </td>
                {stats.map((s) => (
                  <td key={s.key} className="py-2 px-3 text-right text-neutral-500 dark:text-neutral-400">
                    {fmt(period === 14 ? s.ltmMax : s.y3Max, s.unit)}
                  </td>
                ))}
              </tr>
              <tr className="bg-neutral-50/60 dark:bg-white/[0.03]">
                <td className="py-2 pr-4 sticky left-0 bg-neutral-50/95 dark:bg-[#161b22] font-sans font-bold text-neutral-900 dark:text-white">
                  MoM Change
                </td>
                {stats.map((s) => {
                  const up = s.momPct >= 0;
                  return (
                    <td
                      key={s.key}
                      className={`py-2 px-3 text-right font-bold whitespace-nowrap ${
                        up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      <span className="inline-flex items-center gap-0.5 justify-end">
                        {up ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(s.momPct).toFixed(1)}%
                      </span>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </GlassCard3D>
    </div>
  );
}
