'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import EChartsClient from '@/components/charts/EChartsClient';
import {
  LineChart,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { COMMODITY_FORECASTS } from '@/data/knowledgeStore';
import { GlassCard3D, AppleGlassTable, GlassMetricBox } from '@/components/glass';
import { DottedGrid, MagnetTabs } from '@/components/obsidian';

export default function ForecastsPage() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('comm-ethane');
  const [selectedHorizon, setSelectedHorizon] = useState<string>('12M');

  const forecast = COMMODITY_FORECASTS[selectedCommodity] || COMMODITY_FORECASTS['comm-ethane'];

  // Construct Fan Chart ECharts Option with P10, P50, P90 shaded prediction bands
  const dates = forecast.points.map((p) => p.date);
  const actualData = forecast.points.map((p) => (p.isHistorical ? p.actual : null));
  const p50Data = forecast.points.map((p) => (!p.isHistorical ? p.p50 : null));
  const p10Data = forecast.points.map((p) => (!p.isHistorical ? p.p10 : null));
  const bandDifference = forecast.points.map((p) => (!p.isHistorical ? p.p90 - p.p10 : 0));

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#18181B',
      borderColor: '#3F3F46',
      textStyle: { color: '#FAFAFA', fontSize: 13 },
      formatter: (params: any) => {
        const date = params[0]?.name;
        const pt = forecast.points.find((p) => p.date === date);
        if (!pt) return '';
        if (pt.isHistorical) {
          return `<div class="font-mono text-sm">
            <div class="text-neutral-400">${date} (Historical Actual)</div>
            <div class="text-sky-400 font-bold">$${pt.actual} ${forecast.unit}</div>
          </div>`;
        }
        return `<div class="font-mono text-sm space-y-1">
          <div class="text-[#D4BA7B] font-bold">${date} (Ensemble Forecast)</div>
          <div class="text-white">P50 Point Forecast: <strong>$${pt.p50}</strong></div>
          <div class="text-neutral-400">P10 (Bear): $${pt.p10} | P90 (Bull): $${pt.p90}</div>
          <div class="text-xs text-emerald-400">Dispersion: ${forecast.dispersion}</div>
        </div>`;
      }
    },
    legend: {
      data: ['Historical Actual', 'Ensemble Consensus (P50)', 'P10 - P90 Confidence Band'],
      textStyle: { color: '#A1A1AA', fontSize: 12 },
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
      axisLine: { lineStyle: { color: '#71717A' } },
      axisLabel: { color: '#71717A', fontSize: 12, fontFamily: 'monospace' }
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitLine: { lineStyle: { color: 'rgba(113, 113, 122, 0.2)', type: 'dashed' } },
      axisLabel: { color: '#71717A', fontSize: 12, fontFamily: 'monospace' }
    },
    series: [
      {
        name: 'Historical Actual',
        type: 'line',
        showSymbol: true,
        symbolSize: 6,
        itemStyle: { color: '#38BDF8' },
        lineStyle: { width: 3, color: '#38BDF8' },
        data: actualData
      },
      {
        name: 'Ensemble Consensus (P50)',
        type: 'line',
        showSymbol: true,
        symbolSize: 6,
        itemStyle: { color: '#BFA161' },
        lineStyle: { width: 3, type: 'dashed', color: '#BFA161' },
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
          color: 'rgba(191, 161, 97, 0.25)'
        },
        data: bandDifference
      }
    ]
  };

  const commodityTabs = [
    { id: 'comm-ethane', label: 'US Ethane (Mont Belvieu)' },
    { id: 'comm-naphtha', label: 'Naphtha (CFR Japan)' },
    { id: 'comm-ethylene', label: 'Ethylene (SE Asia)' },
  ];

  const horizonTabs = [
    { id: '7D', label: '7D' },
    { id: '30D', label: '30D' },
    { id: '90D', label: '90D' },
    { id: '6M', label: '6M' },
    { id: '12M', label: '12M' },
    { id: '24M', label: '24M' },
  ];

  // Map models for AppleGlassTable
  const tableModels = forecast.models.map((m) => ({
    modelName: m.modelName,
    architectureSubtitle:
      m.modelName === 'TimesFM'
        ? 'Google TimesFM Pretrained Foundation Time-Series'
        : m.modelName === 'LightGBM'
        ? 'Gradient Boosted Trees with lagged macro covariates'
        : m.modelName === 'AutoARIMA'
        ? 'Hyndman-Khandakar stepwise autoregressive'
        : 'Exponential Smoothing State Space',
    weight: m.weight,
    mae: m.mae,
    rmse: m.rmse,
    mape: m.mape,
    sMape: m.sMape,
    confidenceScore: m.confidenceScore,
    isFoundationModel: m.modelName === 'TimesFM',
  }));

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <DottedGrid className="p-8 rounded-3xl border border-neutral-200/80 dark:border-white/10 bg-white/70 dark:bg-[#121217]/80 backdrop-blur-2xl shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#D4BA7B] flex items-center gap-1.5">
                  <LineChart className="w-4 h-4" />
                  Quantitative Time-Series Engine
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  Google TimesFM Foundation + 3 Multi-Horizon Models
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Price Forecasting & Backtesting
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-300 mt-1 max-w-2xl">
                Rigorous time-series forecasting with TimesFM, LightGBM, AutoARIMA, and ETS. Verified out-of-sample backtest validation.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Zero-Shot TimesFM Active
              </span>
            </div>
          </div>
        </DottedGrid>

        {/* 4 Apple 3D Glass Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <GlassMetricBox
            title="P50 Forecast"
            value={`$${forecast.points[forecast.points.length - 1]?.p50 || 152}`}
            unit={forecast.unit}
            subtitle="Central consensus expectation"
            badgeText="Target"
            trend="up"
            trendValue="+4.8%"
            highlight
          />
          <GlassMetricBox
            title="Uncertainty Range"
            value={`$${forecast.points[forecast.points.length - 1]?.p10 || 132} - $${forecast.points[forecast.points.length - 1]?.p90 || 178}`}
            unit={forecast.unit}
            subtitle="P10 Bear to P90 Bull envelope"
            badgeText="80% CI"
            trend="neutral"
            trendValue={forecast.dispersion}
          />
          <GlassMetricBox
            title="Top Accuracy"
            value="3.1%"
            unit="MAPE"
            subtitle="TimesFM foundation model error"
            badgeText="Best Model"
            trend="up"
            trendValue="High Precision"
            highlight
          />
          <GlassMetricBox
            title="Ensemble Confidence"
            value="94"
            unit="/ 100"
            subtitle="18-month rolling walk-forward"
            badgeText="Backtested"
            trend="up"
            trendValue="Calibrated"
          />
        </div>

        {/* Interactive Controls Bar (Glass Style) */}
        <GlassCard3D className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              Select Feedstock or Product
            </span>
            <MagnetTabs
              tabs={commodityTabs}
              activeTab={selectedCommodity}
              onChange={(id) => setSelectedCommodity(id)}
            />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
              Forecast Horizon
            </span>
            <MagnetTabs
              tabs={horizonTabs}
              activeTab={selectedHorizon}
              onChange={(id) => setSelectedHorizon(id)}
            />
          </div>
        </GlassCard3D>

        {/* Fan Chart Card (Apple 3D Glass) */}
        <GlassCard3D className="p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200/80 dark:border-white/10">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#8F7640] dark:text-[#D4BA7B]">
                Fan Chart: P10 - P50 - P90 Uncertainty Envelope
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white">
                {forecast.commodityName} — {selectedHorizon} Trajectory
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
              <span>Training: {forecast.trainingPeriod}</span>
              <span>•</span>
              <span className="text-sky-500 font-semibold">Updated: {forecast.lastUpdated}</span>
            </div>
          </div>

          {/* ECharts Fan Chart */}
          <div className="h-84 w-full">
            <EChartsClient option={chartOption} height="100%" />
          </div>

          {/* Consensus Interpretation Glass Box */}
          <div className="p-5 rounded-2xl bg-neutral-100/60 dark:bg-white/[0.04] border border-neutral-200/80 dark:border-white/10 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold uppercase text-[#8F7640] dark:text-[#D4BA7B]">
                Ensemble Consensus Outlook
              </span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                Model Dispersion: {forecast.dispersion}
              </span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-normal">
              {forecast.consensusSummary}
            </p>
          </div>
        </GlassCard3D>

        {/* Apple-Style 3D Glass Table (The user's requested element!) */}
        <div id="ensemble">
          <AppleGlassTable
            models={tableModels}
            title="Model Architecture & Backtesting Evaluation"
            subtitle="18-month rolling walk-forward cross-validation on out-of-sample data"
          />
        </div>

      </div>
    </AppShell>
  );
}
