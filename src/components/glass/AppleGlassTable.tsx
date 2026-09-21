'use client';

import React from 'react';
import { Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import GlassCard3D from './GlassCard3D';

export interface ModelMetricRow {
  modelName: string;
  architectureSubtitle: string;
  weight: number;
  mae: number;
  rmse: number;
  mape: number;
  sMape: number;
  confidenceScore: number;
  isFoundationModel?: boolean;
}

interface AppleGlassTableProps {
  models: ModelMetricRow[];
  title?: string;
  subtitle?: string;
}

export default function AppleGlassTable({
  models,
  title = 'Model Architecture & Backtesting Metrics',
  subtitle = '18-month rolling walk-forward cross-validation on out-of-sample data',
}: AppleGlassTableProps) {
  return (
    <GlassCard3D className="p-6 md:p-8 space-y-6">
      {/* Header with 3D Depth */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-800 dark:text-[#D4BA7B] border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-[#BFA161]" />
              AI Ensemble
            </span>
            <span className="text-xs font-semibold text-neutral-500">
              TimesFM + LightGBM + AutoARIMA + ETS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>0% Hallucination</span>
          </div>
        </div>
      </div>

      {/* 3D Frosted Glass Table */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white/40 dark:bg-black/20 backdrop-blur-xl shadow-inner">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-neutral-100/70 dark:bg-white/[0.04] text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-wider border-b border-neutral-200/80 dark:border-white/10">
              <th className="py-4 px-6 font-bold">Model Architecture</th>
              <th className="py-4 px-4 font-bold">Ensemble Weight</th>
              <th className="py-4 px-4 text-right font-bold">MAE ($/t)</th>
              <th className="py-4 px-4 text-right font-bold">RMSE ($/t)</th>
              <th className="py-4 px-4 text-right font-bold">MAPE (%)</th>
              <th className="py-4 px-4 text-right font-bold">sMAPE (%)</th>
              <th className="py-4 px-6 text-right font-bold">Confidence Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60 dark:divide-white/[0.06]">
            {models.map((m, idx) => {
              const isTop = m.confidenceScore >= 90;
              return (
                <tr
                  key={idx}
                  className="group hover:bg-white/80 dark:hover:bg-white/[0.08] transition-all duration-150 cursor-pointer"
                >
                  {/* Model Name & Architecture */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="font-extrabold text-base text-neutral-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-[#D4BA7B] transition-colors">
                        {m.modelName}
                      </div>
                      {m.isFoundationModel && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-[#D4BA7B] border border-amber-500/30">
                          FOUNDATION
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {m.architectureSubtitle}
                    </div>
                  </td>

                  {/* Ensemble Weight */}
                  <td className="py-4 px-4 font-mono font-extrabold text-base text-[#8F7640] dark:text-[#D4BA7B]">
                    {(m.weight * 100).toFixed(0)}%
                  </td>

                  {/* MAE */}
                  <td className="py-4 px-4 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {m.mae}
                  </td>

                  {/* RMSE */}
                  <td className="py-4 px-4 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {m.rmse}
                  </td>

                  {/* MAPE */}
                  <td className="py-4 px-4 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                    {m.mape}%
                  </td>

                  {/* sMAPE */}
                  <td className="py-4 px-4 text-right font-mono font-medium text-neutral-600 dark:text-neutral-300">
                    {m.sMape}%
                  </td>

                  {/* Confidence Score Pill Badge */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 font-mono text-xs font-extrabold px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all shadow-sm ${
                        isTop
                          ? 'bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/40 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                          : 'bg-neutral-100 dark:bg-white/[0.08] text-neutral-700 dark:text-neutral-200 border-neutral-300 dark:border-white/15'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                      <span>{m.confidenceScore}/100</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard3D>
  );
}
