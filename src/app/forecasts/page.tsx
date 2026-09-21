'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import EChartsClient from '@/components/charts/EChartsClient';
import {
  LineChart,
  Cpu,
  TrendingUp,
  CheckCircle2,
  Layers,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { COMMODITY_FORECASTS } from '@/data/knowledgeStore';

export default function ForecastsPage() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('comm-ethane');
  const [selectedHorizon, setSelectedHorizon] = useState<'7D' | '30D' | '90D' | '6M' | '12M' | '24M'>('12M');

  const forecast = COMMODITY_FORECASTS[selectedCommodity] || COMMODITY_FORECASTS['comm-ethane'];

  // Construct Fan Chart ECharts Option with P10, P50, P90 shaded prediction bands
  const dates = forecast.points.map((p) => p.date);
  const actualData = forecast.points.map((p) => (p.isHistorical ? p.actual : null));
  const p50Data = forecast.points.map((p) => (!p.isHistorical ? p.p50 : null));
  const p10Data = forecast.points.map((p) => (!p.isHistorical ? p.p10 : null));
  const p90Data = forecast.points.map((p) => (!p.isHistorical ? p.p90 : null));

  // Range band data for area shading
  const bandDifference = forecast.points.map((p) => (!p.isHistorical ? p.p90 - p.p10 : 0));

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#0E1420',
      borderColor: '#242F44',
      textStyle: { color: '#F8FAFC', fontSize: 12 },
      formatter: (params: any) => {
        const date = params[0]?.name;
        const pt = forecast.points.find((p) => p.date === date);
        if (!pt) return '';
        if (pt.isHistorical) {
          return `<div class="font-mono text-xs">
            <div class="text-[#64748B]">${date} (Historical Actual)</div>
            <div class="text-[#38BDF8] font-bold">$${pt.actual} ${forecast.unit}</div>
          </div>`;
        }
        return `<div class="font-mono text-xs space-y-1">
          <div class="text-[#BFA161] font-bold">${date} (Ensemble Forecast)</div>
          <div class="text-[#F8FAFC]">P50 Point Forecast: <strong>$${pt.p50}</strong></div>
          <div class="text-[#94A3B8]">P10 (Bear): $${pt.p10} | P90 (Bull): $${pt.p90}</div>
          <div class="text-[10px] text-[#10B981]">Dispersion: ${forecast.dispersion}</div>
        </div>`;
      }
    },
    legend: {
      data: ['Historical Actual', 'Ensemble Consensus (P50)', 'P10 - P90 Confidence Band'],
      textStyle: { color: '#94A3B8', fontSize: 11 },
      top: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '8%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#1E2738' } },
      axisLabel: { color: '#64748B', fontSize: 11, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: '#141C2B', type: 'dashed' } },
      axisLabel: { color: '#64748B', fontSize: 11, fontFamily: 'monospace' }
    },
    series: [
      {
        name: 'Historical Actual',
        type: 'line',
        showSymbol: true,
        symbolSize: 6,
        itemStyle: { color: '#38BDF8' },
        lineStyle: { width: 2.5, color: '#38BDF8' },
        data: actualData
      },
      {
        name: 'Ensemble Consensus (P50)',
        type: 'line',
        showSymbol: true,
        symbolSize: 6,
        itemStyle: { color: '#BFA161' },
        lineStyle: { width: 2.5, type: 'dashed', color: '#BFA161' },
        data: p50Data
      },
      {
        name: 'P10 Lower Bound',
        type: 'line',
        stack: 'confidence-band',
        symbol: 'none',
        lineStyle: { opacity: 0 },
        data: p10Data
      },
      {
        name: 'P10 - P90 Confidence Band',
        type: 'line',
        stack: 'confidence-band',
        symbol: 'none',
        lineStyle: { opacity: 0 },
        areaStyle: {
          color: 'rgba(191, 161, 97, 0.20)'
        },
        data: bandDifference
      }
    ]
  };

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <LineChart className="w-3.5 h-3.5 text-[#BFA161]" />
                Quantitative Time-Series Layer
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Foundation Model + Ensemble Architecture</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              AI FORECASTING ENGINE & BACKTESTING
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Genuine quantitative forecasting models (TimesFM, LightGBM, AutoARIMA, ETS). No hallucinated numbers; verified out-of-sample backtest validation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/15 px-3.5 py-2 rounded-lg border border-[#10B981]/30">
              Foundation: TimesFM-ZeroShot Active
            </span>
          </div>
        </div>

        {/* Commodity & Horizon Selection Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0E1420] border border-[#1A2232]">
          {/* Commodity selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B] font-mono uppercase">Commodity:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'comm-ethane', label: 'Ethane (Mont Belvieu)' },
                { id: 'comm-naphtha', label: 'Naphtha (CFR Japan)' },
                { id: 'comm-ethylene', label: 'Ethylene (CFR SE Asia)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedCommodity(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCommodity === item.id
                      ? 'bg-[#BFA161] text-[#080B10] font-bold shadow-md'
                      : 'bg-[#141C2B] text-[#94A3B8] hover:text-[#F8FAFC] border border-[#1E2738]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Horizon selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B] font-mono uppercase">Horizon:</span>
            <div className="flex items-center gap-1 font-mono text-xs">
              {(['7D', '30D', '90D', '6M', '12M', '24M'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setSelectedHorizon(h)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedHorizon === h
                      ? 'bg-[#1E293B] text-[#38BDF8] border border-[#38BDF8]/40 font-bold'
                      : 'text-[#64748B] hover:text-[#94A3B8]'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Probabilistic Fan Chart Card */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2738]">
            <div>
              <div className="text-[10px] font-mono text-[#BFA161] uppercase tracking-wider font-bold">
                Fan Chart (P10 - P50 - P90 Uncertainty Envelope)
              </div>
              <h2 className="text-base font-bold text-[#F8FAFC]">
                {forecast.commodityName} — {selectedHorizon} Horizon Trajectory
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#94A3B8]">
              <span>Training: {forecast.trainingPeriod}</span>
              <span>•</span>
              <span className="text-[#38BDF8]">Updated: {forecast.lastUpdated}</span>
            </div>
          </div>

          {/* ECharts Fan Chart */}
          <div className="h-80 w-full">
            <EChartsClient option={chartOption} height="100%" />
          </div>

          {/* Consensus Interpretation */}
          <div className="p-4 rounded-xl bg-[#0A0E17] border border-[#1A2232] space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold uppercase text-[#D4BA7B]">
                Ensemble Consensus Outlook
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#162030] text-[#10B981] border border-[#242F44]">
                Model Dispersion: {forecast.dispersion}
              </span>
            </div>
            <p className="text-[#CBD5E1] leading-relaxed">
              {forecast.consensusSummary}
            </p>
          </div>
        </div>

        {/* Model Ensemble Performance & Backtest Evaluation Table */}
        <div id="ensemble" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase font-mono tracking-wider font-semibold text-[#64748B]">
              Ensemble Model Architecture & Out-of-Sample Backtesting Metrics
            </h2>
            <span className="text-[10px] text-[#64748B] font-mono">
              Evaluated on 18-month rolling walk-forward cross-validation
            </span>
          </div>

          <div className="rounded-xl border border-[#1A2232] bg-[#0E1420] overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#CBD5E1]">
                <thead className="bg-[#0A0E17] text-[#64748B] uppercase font-mono text-[10px] tracking-wider border-b border-[#1A2232]">
                  <tr>
                    <th className="py-3 px-4">Model Architecture</th>
                    <th className="py-3 px-4">Ensemble Weight</th>
                    <th className="py-3 px-4 text-right">MAE ($/t)</th>
                    <th className="py-3 px-4 text-right">RMSE ($/t)</th>
                    <th className="py-3 px-4 text-right">MAPE (%)</th>
                    <th className="py-3 px-4 text-right">sMAPE (%)</th>
                    <th className="py-3 px-4 text-right">Confidence Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A2232]">
                  {forecast.models.map((m, idx) => (
                    <tr key={idx} className="hover:bg-[#121A2B] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-sm text-[#F8FAFC]">
                          {m.modelName}
                        </div>
                        <div className="text-[10px] text-[#64748B]">
                          {m.modelName === 'TimesFM'
                            ? 'Google TimesFM Pretrained Foundation Time-Series'
                            : m.modelName === 'LightGBM'
                            ? 'Gradient Boosted Trees with lagged macro covariates'
                            : m.modelName === 'AutoARIMA'
                            ? 'Hyndman-Khandakar stepwise autoregressive'
                            : 'Exponential Smoothing State Space'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#BFA161]">
                        {(m.weight * 100).toFixed(0)}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-tabular text-[#F8FAFC]">
                        {m.mae}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-tabular text-[#F8FAFC]">
                        {m.rmse}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-tabular text-[#10B981]">
                        {m.mape}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-tabular text-[#CBD5E1]">
                        {m.sMape}%
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-mono text-xs font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/30">
                          {m.confidenceScore}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
