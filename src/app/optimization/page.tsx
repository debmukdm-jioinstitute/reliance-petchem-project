'use client';

import React, { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import { 
  Cpu, 
  Layers, 
  Sliders, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  BarChart3, 
  Activity, 
  Flame,
  Factory,
  Check
} from 'lucide-react';
import Link from 'next/link';

interface PlantAsset {
  id: string;
  name: string;
  capacityKtpa: number;
  currentEthaneRatio: number; // %
  currentNaphthaRatio: number; // %
  optimalEthaneRatio: number; // %
  optimalNaphthaRatio: number; // %
  ebitdaCurrentM: number;
  ebitdaOptimalM: number;
  switchingHours: number;
  constraints: string;
}

export default function FeedstockOptimizationPage() {
  const { commodities } = useMarket();

  const [isOptimized, setIsOptimized] = useState<boolean>(true);
  const [totalEthaneImportCapKtpa, setTotalEthaneImportCapKtpa] = useState<number>(2200); // VLEC import cap

  const initialPlants: PlantAsset[] = [
    {
      id: 'p-jamnagar',
      name: 'Jamnagar ROGC (Refinery Off-Gas Cracker)',
      capacityKtpa: 1400,
      currentEthaneRatio: 85,
      currentNaphthaRatio: 15,
      optimalEthaneRatio: 95,
      optimalNaphthaRatio: 5,
      ebitdaCurrentM: 610,
      ebitdaOptimalM: 685,
      switchingHours: 8,
      constraints: 'Off-gas stream from Jamnagar SEZ refinery + imported ethane'
    },
    {
      id: 'p-dahej',
      name: 'Dahej Dual-Feed Cracker Complex',
      capacityKtpa: 1100,
      currentEthaneRatio: 70,
      currentNaphthaRatio: 30,
      optimalEthaneRatio: 100,
      optimalNaphthaRatio: 0,
      ebitdaCurrentM: 420,
      ebitdaOptimalM: 545,
      switchingHours: 12,
      constraints: 'Direct cryogenic terminal pipeline feed from VLEC berths'
    },
    {
      id: 'p-hazira',
      name: 'Hazira Cracker Complex',
      capacityKtpa: 900,
      currentEthaneRatio: 50,
      currentNaphthaRatio: 50,
      optimalEthaneRatio: 75,
      optimalNaphthaRatio: 25,
      ebitdaCurrentM: 280,
      ebitdaOptimalM: 360,
      switchingHours: 18,
      constraints: '100km Dahej-Hazira ethane pipeline throughput ceiling'
    },
    {
      id: 'p-nagothane',
      name: 'Nagothane Gas Cracker',
      capacityKtpa: 500,
      currentEthaneRatio: 80,
      currentNaphthaRatio: 20,
      optimalEthaneRatio: 90,
      optimalNaphthaRatio: 10,
      ebitdaCurrentM: 195,
      ebitdaOptimalM: 220,
      switchingHours: 14,
      constraints: 'ONGC gas feedstock mix + domestic ethane allocation'
    },
    {
      id: 'p-vadodara',
      name: 'Vadodara Cracker Complex',
      capacityKtpa: 300,
      currentEthaneRatio: 40,
      currentNaphthaRatio: 60,
      optimalEthaneRatio: 50,
      optimalNaphthaRatio: 50,
      ebitdaCurrentM: 95,
      ebitdaOptimalM: 110,
      switchingHours: 22,
      constraints: 'Heritage furnace metallurgy and local propylene demand'
    }
  ];

  const totalCurrentEbitda = initialPlants.reduce((acc, p) => acc + p.ebitdaCurrentM, 0);
  const totalOptimalEbitda = initialPlants.reduce((acc, p) => acc + p.ebitdaOptimalM, 0);
  const ebitdaUplift = totalOptimalEbitda - totalCurrentEbitda;
  const ebitdaUpliftInrCr = Number(((ebitdaUplift * 84) / 10).toFixed(0));

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#090D17] border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase rounded-md bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              MULTI-PLANT LP OPTIMIZER
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase rounded-md bg-neutral-800 text-neutral-300">
              5 ASSET SITES • SUB-DAY SWITCHING
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
            Linear Program (LP) Feedstock Allocation
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Multi-variable Linear Programming solver allocating cryogenic US Ethane and Jamnagar Naphtha across 
            Reliance’s 5 cracker complexes to maximize total consolidated O2C EBITDA under pipeline and logistics constraints.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setIsOptimized(!isOptimized)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-lg active:scale-95 ${
              isOptimized 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{isOptimized ? 'SOLVED: LP OPTIMAL' : 'RUN LP OPTIMIZER'}</span>
          </button>
          <Link
            href="/simulation"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-200 transition-all active:scale-95"
          >
            <span>SCADA MIMIC</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </Link>
        </div>
      </div>

      {/* Optimization Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
          <span className="text-xs font-mono text-neutral-400 block mb-1">CONSOLIDATED CRACKER EBITDA</span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
            ${isOptimized ? totalOptimalEbitda.toLocaleString() : totalCurrentEbitda.toLocaleString()}M
            <span className="text-xs font-normal text-neutral-400 ml-1">/year</span>
          </div>
          <div className="mt-2 text-xs font-mono text-emerald-400 font-bold">
            ₹{isOptimized ? Number(((totalOptimalEbitda * 84) / 10).toFixed(0)).toLocaleString() : Number(((totalCurrentEbitda * 84) / 10).toFixed(0)).toLocaleString()} Cr
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-neutral-900/60 to-neutral-900/40 border border-emerald-800/60 backdrop-blur-md">
          <span className="text-xs font-mono text-emerald-400 font-semibold block mb-1">LP ARBITRAGE UPLIFT</span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-emerald-300">
            +${ebitdaUplift}M
            <span className="text-xs font-normal text-neutral-400 ml-1">/year</span>
          </div>
          <div className="mt-2 text-xs font-mono text-amber-400 font-bold">
            +₹{ebitdaUpliftInrCr.toLocaleString()} Cr Annualized EBITDA Gain
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
          <span className="text-xs font-mono text-neutral-400 block mb-1">MAX SUB-DAY SWING TIME</span>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
            &lt; 24 Hours
          </div>
          <p className="mt-2 text-xs font-mono text-cyan-400">
            Automated furnace ramping protocol armed
          </p>
        </div>
      </div>

      {/* Asset-by-Asset Allocation Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Factory className="w-4 h-4 text-cyan-400" />
          RIL Cracker Complex Allocation Ledger (4,200 KTPA Combined Capacity)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {initialPlants.map((plant) => {
            const ethaneRatio = isOptimized ? plant.optimalEthaneRatio : plant.currentEthaneRatio;
            const naphthaRatio = isOptimized ? plant.optimalNaphthaRatio : plant.currentNaphthaRatio;
            const ebitda = isOptimized ? plant.ebitdaOptimalM : plant.ebitdaCurrentM;
            const gain = plant.ebitdaOptimalM - plant.ebitdaCurrentM;

            return (
              <div
                key={plant.id}
                className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all backdrop-blur-md space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">{plant.name}</h3>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                      Capacity: {plant.capacityKtpa.toLocaleString()} KTPA • Switch Time: {plant.switchingHours}h
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg ${
                    isOptimized && gain > 0
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}>
                    ${ebitda}M EBITDA
                  </span>
                </div>

                {/* Blend bar */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-cyan-400 font-bold">Ethane: {ethaneRatio}%</span>
                    <span className="text-amber-400 font-bold">Naphtha: {naphthaRatio}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 rounded-full h-2.5 overflow-hidden flex">
                    <div style={{ width: `${ethaneRatio}%` }} className="bg-cyan-500 h-full transition-all duration-500" />
                    <div style={{ width: `${naphthaRatio}%` }} className="bg-amber-500 h-full transition-all duration-500" />
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 text-xs font-mono text-neutral-400 flex items-center justify-between">
                  <span className="truncate max-w-[320px]">{plant.constraints}</span>
                  {isOptimized && gain > 0 && (
                    <span className="text-emerald-400 font-bold shrink-0">
                      +${gain}M/yr
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
