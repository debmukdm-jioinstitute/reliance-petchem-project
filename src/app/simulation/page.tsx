'use client';

import React, { useState } from 'react';
import ScadaDiagram, { ScadaState } from '@/components/scada/ScadaDiagram';
import { useMarket } from '@/context/MarketContext';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Download, 
  FileText, 
  Layers, 
  Radio, 
  RefreshCw, 
  ShieldCheck, 
  Sliders, 
  Terminal, 
  TrendingUp, 
  Zap,
  Flame,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import RelianceLogo from '@/components/common/RelianceLogo';

export default function ScadaSimulationPage() {
  const { commodities, spreads, lastSyncTime, isSyncing, refreshPrices } = useMarket();
  const [scadaState, setScadaState] = useState<ScadaState>({
    ethaneRatio: 75,
    naphthaRatio: 25,
    throughputKtpa: 1850,
    severity: 'HIGH',
    furnaceCot: 852,
    sorRatio: 0.40
  });

  // Dynamic real-time calculation of cracking margins given live market prices
  const ethanePrice = commodities.find(c => c.id === 'comm-ethane')?.currentPrice || 157; // $/t
  const naphthaPrice = commodities.find(c => c.id === 'comm-naphtha')?.currentPrice || 819; // $/t
  const ethylenePrice = commodities.find(c => c.id === 'comm-ethylene')?.currentPrice || 887; // $/t
  const propylenePrice = commodities.find(c => c.id === 'comm-propylene')?.currentPrice || 834; // $/t

  // Weighted feedstock cost ($/t)
  const weightedFeedCost = Number(((scadaState.ethaneRatio / 100) * ethanePrice + (scadaState.naphthaRatio / 100) * naphthaPrice).toFixed(1));

  // Yields
  const ethyleneYield = (scadaState.ethaneRatio / 100) * 0.795 + (scadaState.naphthaRatio / 100) * 0.332;
  const propyleneYield = (scadaState.ethaneRatio / 100) * 0.024 + (scadaState.naphthaRatio / 100) * 0.168;
  const byproductsYield = 1 - ethyleneYield - propyleneYield;

  // Realized basket revenue per tonne of feed
  const basketRevenue = Number((
    ethyleneYield * ethylenePrice +
    propyleneYield * propylenePrice +
    byproductsYield * 420 // Fuel gas and Pygas credit
  ).toFixed(1));

  // Variable operating & processing cost ($/t)
  // Ethane requires less fuel gas and simpler fractionation than Naphtha
  const processingCost = Number(((scadaState.ethaneRatio / 100) * 85 + (scadaState.naphthaRatio / 100) * 165).toFixed(1));

  // Net Cash Margin ($/tonne of feed)
  const netMargin = Number((basketRevenue - weightedFeedCost - processingCost).toFixed(1));

  // Annualized EBITDA in ₹ Crore ($1 = ₹84)
  const annualThroughputTonnes = scadaState.throughputKtpa * 1000;
  const annualEbitdaUsdM = Number(((netMargin * annualThroughputTonnes) / 1_000_000).toFixed(1));
  const annualEbitdaInrCr = Number(((annualEbitdaUsdM * 84) / 10).toFixed(0)); // ₹ Cr

  const alarmLog = [
    { time: '11:18:42', tag: 'TIC-104', type: 'INFO', msg: 'Furnace #04 decoking cycle completed. Switched back to active cracking train.' },
    { time: '11:14:05', tag: 'FIC-302', type: 'WARN', msg: 'Dahej ethane pipeline pressure fluctuation: 48.2 -> 49.6 bar (Within safety envelope).' },
    { time: '11:02:19', tag: 'AI-LP-01', type: 'OK', msg: 'Linear Program solver rebalanced Jamnagar-Dahej ethane stream for +$14/t EBITDA margin.' },
    { time: '10:48:30', tag: 'VLEC-06', type: 'OK', msg: 'Reliance Ethane VLEC vessel berthed at Dahej terminal. Cryogenic offloading engaged.' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner with SCADA Status & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B0F19] border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <RelianceLogo size="md" variant="badge" />
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                SCADA DIGITAL TWIN v4.2
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-md bg-neutral-800 text-neutral-300">
                DCS MIMIC: LIVE
              </span>
              <span className="text-xs font-serif italic text-[#8F7640] dark:text-[#D4BA7B] font-bold">
                Growth is Life
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
              Cracker SCADA Simulation & Telemetry
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed font-mono">
              Asset: Reliance O2C Dahej & Jamnagar Dual-Feed Complexes • Real-Time Hydrodynamic Model
            </p>
          </div>
        </div>

        {/* Live sync actions */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => refreshPrices()}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900/90 border border-neutral-700 hover:border-cyan-500 text-xs font-mono text-neutral-200 transition-all shadow-md active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : 'text-neutral-400'}`} />
            <span>{isSyncing ? 'SYNCING DCS...' : 'REFRESH DCS'}</span>
          </button>
          <Link
            href="/economics"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-mono font-bold text-white transition-all shadow-lg shadow-cyan-600/20 active:scale-95"
          >
            <span>VALUE CHAIN ECONOMICS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Interactive SCADA Graphic Diagram */}
      <ScadaDiagram onStateChange={setScadaState} initialEthaneRatio={scadaState.ethaneRatio} />

      {/* Real-Time Telemetry & Economic Response Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Weighted Feedstock Cost */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
            <span>INPUT FEEDSTOCK COST</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
            ${weightedFeedCost}
            <span className="text-xs font-normal text-neutral-400 ml-1">/tonne</span>
          </div>
          <div className="mt-2 text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>Ethane: ${ethanePrice}</span>
            <span>Naphtha: ${naphthaPrice}</span>
          </div>
          <div className="mt-3 w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden flex">
            <div style={{ width: `${scadaState.ethaneRatio}%` }} className="bg-cyan-400 h-full" />
            <div style={{ width: `${scadaState.naphthaRatio}%` }} className="bg-amber-400 h-full" />
          </div>
        </div>

        {/* Metric 2: Gross Basket Realization */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
            <span>GROSS OUTPUT BASKET</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
            ${basketRevenue}
            <span className="text-xs font-normal text-neutral-400 ml-1">/tonne</span>
          </div>
          <div className="mt-2 text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>Ethylene: ${(ethyleneYield * 100).toFixed(0)}% yield</span>
            <span>Spot: ${ethylenePrice}</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            High purity polymer premium applied
          </div>
        </div>

        {/* Metric 3: Processing OPEX */}
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-2">
            <span>CONVERSION & HEAT OPEX</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
            ${processingCost}
            <span className="text-xs font-normal text-neutral-400 ml-1">/tonne</span>
          </div>
          <div className="mt-2 text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>Steam/Oil Ratio: {scadaState.sorRatio}</span>
            <span>Furnace: {scadaState.furnaceCot}°C</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-cyan-400">
            {scadaState.ethaneRatio > 60 ? '⚡ Lower heat duty (Ethane lean route)' : '⚠️ Higher fuel duty (Naphtha heavy)'}
          </div>
        </div>

        {/* Metric 4: Integrated EBITDA */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-neutral-900/80 to-neutral-900/60 border border-emerald-800/60 relative overflow-hidden backdrop-blur-md shadow-lg shadow-emerald-950/20">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2 font-semibold">
            <span>NET EBITDA SPREAD</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-emerald-300">
            +${netMargin}
            <span className="text-xs font-normal text-neutral-400 ml-1">/tonne</span>
          </div>
          <div className="mt-2 text-xs font-mono text-white font-bold flex items-center justify-between">
            <span>Annual Run-Rate:</span>
            <span className="text-amber-400">₹{annualEbitdaInrCr.toLocaleString()} Cr/yr</span>
          </div>
          <div className="mt-3 text-[11px] font-mono text-neutral-400">
            Based on {scadaState.throughputKtpa.toLocaleString()} KTPA asset throughput
          </div>
        </div>
      </div>

      {/* DCS Alarm Status & Telemetry Events Log */}
      <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              SCADA Event Ledger & DCS Trip Sentinel
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            Protocol: OPC-UA / Modbus TCP Encrypted
          </span>
        </div>

        <div className="space-y-2.5">
          {alarmLog.map((alarm, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/80 border border-neutral-800/60 text-xs font-mono hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-neutral-500">{alarm.time}</span>
                <span className={`px-2 py-0.5 rounded font-bold ${
                  alarm.type === 'WARN' 
                    ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                    : alarm.type === 'OK' 
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                    : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                }`}>
                  [{alarm.tag}]
                </span>
                <span className="text-neutral-300">{alarm.msg}</span>
              </div>
              <span className="text-[11px] text-neutral-500 hidden sm:inline">ACKNOWLEDGED</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
