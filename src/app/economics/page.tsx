'use client';

import React, { useState } from 'react';
import { useMarket } from '@/context/MarketContext';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowRight, 
  Layers, 
  Zap, 
  Flame, 
  Ship, 
  Fuel, 
  Scale, 
  Sliders, 
  BarChart3, 
  CheckCircle2, 
  Info,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function CrackerEconomicsPage() {
  const { commodities, refreshPrices, isSyncing } = useMarket();

  // Baseline market quotes from context or defaults
  const liveBrent = commodities.find(c => c.id === 'comm-brent')?.currentPrice || 97.9;
  const liveEthane = commodities.find(c => c.id === 'comm-ethane')?.currentPrice || 157;
  const liveNaphtha = commodities.find(c => c.id === 'comm-naphtha')?.currentPrice || 819;
  const liveEthylene = commodities.find(c => c.id === 'comm-ethylene')?.currentPrice || 887;
  const livePropylene = commodities.find(c => c.id === 'comm-propylene')?.currentPrice || 834;
  const liveUsdInr = commodities.find(c => c.id === 'comm-fx-usdinr')?.currentPrice || 84.0;

  // Interactive user simulation knobs
  const [brentInput, setBrentInput] = useState<number>(liveBrent);
  const [ethaneSpotInput, setEthaneSpotInput] = useState<number>(liveEthane);
  const [vlecFreight, setVlecFreight] = useState<number>(85); // $/t shipping
  const [ethaneRatio, setEthaneRatio] = useState<number>(75); // 75% Ethane / 25% Naphtha
  const [annualCapacityKtpa, setAnnualCapacityKtpa] = useState<number>(3500); // RIL total petchem capacity in KTPA
  const [includePolymerUplift, setIncludePolymerUplift] = useState<boolean>(true);

  const naphthaRatio = 100 - ethaneRatio;

  // STEP 1: INPUT / RAW MATERIAL COSTS
  // US Ethane Delivered to Dahej
  const ethaneLiquefaction = 35; // $/t
  const dahejRegasAndPort = 25; // $/t
  const totalDeliveredEthane = Number((ethaneSpotInput + ethaneLiquefaction + vlecFreight + dahejRegasAndPort).toFixed(1));

  // Naphtha Cost delivered (derived from Brent + freight)
  const deliveredNaphtha = Number((brentInput * 7.5 + 85).toFixed(1));

  // Blended Feedstock Cost ($/tonne)
  const blendedFeedCost = Number(((ethaneRatio / 100) * totalDeliveredEthane + (naphthaRatio / 100) * deliveredNaphtha).toFixed(1));

  // STEP 2: MIDDLE PROCESSING & CONVERSION COSTS ($/tonne)
  // Cracker energy, fuel gas duty, steam, compressor power, catalysts & fixed O&M
  const ethaneConversionCost = 92; // Less severe cracking, less fractionation stages
  const naphthaConversionCost = 175; // Higher heat duty, quench oil, heavy separation
  const blendedConversionCost = Number(((ethaneRatio / 100) * ethaneConversionCost + (naphthaRatio / 100) * naphthaConversionCost).toFixed(1));

  // Total Cash Cost of Production ($/tonne of feed)
  const totalCashCost = Number((blendedFeedCost + blendedConversionCost).toFixed(1));

  // STEP 3: PRODUCT OUTPUT BASKET & PRICES
  // Yields
  const ethyleneYield = (ethaneRatio / 100) * 0.795 + (naphthaRatio / 100) * 0.332;
  const propyleneYield = (ethaneRatio / 100) * 0.024 + (naphthaRatio / 100) * 0.168;
  const pygasBenzeneYield = (ethaneRatio / 100) * 0.015 + (naphthaRatio / 100) * 0.185;
  const fuelGasByproductYield = 1 - ethyleneYield - propyleneYield - pygasBenzeneYield;

  // Realized prices ($/tonne)
  const ethylenePrice = liveEthylene;
  const propylenePrice = livePropylene;
  const pygasPrice = Number((brentInput * 7.2).toFixed(1));
  const fuelGasCredit = 380; // Fuel gas credited at thermal parity

  // Gross Basket Output Realization per tonne of feed ($/tonne)
  const grossBasketRevenue = Number((
    ethyleneYield * ethylenePrice +
    propyleneYield * propylenePrice +
    pygasBenzeneYield * pygasPrice +
    fuelGasByproductYield * fuelGasCredit
  ).toFixed(1));

  // STEP 4: PROFIT ESTIMATION
  // Gross Cracking Margin (GCM = Basket - Feedstock Cost)
  const grossCrackingMargin = Number((grossBasketRevenue - blendedFeedCost).toFixed(1));

  // Base Net Operating Margin ($/tonne)
  const baseNetMargin = Number((grossCrackingMargin - blendedConversionCost).toFixed(1));

  // Integrated Polymer Value Add (Converting Ethylene to HDPE & Propylene to PP adds ~$140/t)
  const polymerUplift = includePolymerUplift ? 135 : 0;
  const finalNetEbitdaPerTonne = Number((baseNetMargin + polymerUplift).toFixed(1));

  // Total Reliance Annual Profit Run-Rate (₹ Crores & $ Millions)
  const totalAnnualTonnes = annualCapacityKtpa * 1000;
  const annualEbitdaUsdM = Number(((finalNetEbitdaPerTonne * totalAnnualTonnes) / 1_000_000).toFixed(1));
  const annualEbitdaInrCr = Number(((annualEbitdaUsdM * liveUsdInr) / 10).toFixed(0)); // ₹ Cr

  // Comparison metrics: Pure Ethane route vs Pure Naphtha route
  const pureEthaneBasket = 0.795 * ethylenePrice + 0.024 * propylenePrice + 0.015 * pygasPrice + 0.166 * fuelGasCredit;
  const pureEthaneCashCost = totalDeliveredEthane + ethaneConversionCost;
  const pureEthaneMargin = Number((pureEthaneBasket - pureEthaneCashCost + polymerUplift).toFixed(1));

  const pureNaphthaBasket = 0.332 * ethylenePrice + 0.168 * propylenePrice + 0.185 * pygasPrice + 0.315 * fuelGasCredit;
  const pureNaphthaCashCost = deliveredNaphtha + naphthaConversionCost;
  const pureNaphthaMargin = Number((pureNaphthaBasket - pureNaphthaCashCost + polymerUplift).toFixed(1));

  const ethaneAdvantage = Number((pureEthaneMargin - pureNaphthaMargin).toFixed(1));

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0C101A] border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase rounded-md bg-amber-950/80 border border-amber-800/60 text-amber-400 font-bold flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              END-TO-END VALUE CHAIN ECONOMICS
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono uppercase rounded-md bg-neutral-800 text-neutral-300">
              RELIANCE O2C ASSETS
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
            Cracker Cost & Profit Estimation Engine
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Simulate the full economic waterfall from imported raw material landed costs, through furnace conversion OPEX, 
            to chemical yield realization and net integrated EBITDA.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => refreshPrices()}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-amber-500 text-xs font-mono text-neutral-200 transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : 'text-neutral-400'}`} />
            <span>{isSyncing ? 'UPDATING...' : 'LIVE QUOTES'}</span>
          </button>
          <Link
            href="/simulation"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono font-bold text-white transition-all active:scale-95"
          >
            <span>SCADA SIMULATION</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </Link>
        </div>
      </div>

      {/* 4-STEP VALUE CHAIN WATERFALL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Step 1: Input Costs */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-cyan-800/40 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2 font-semibold">
            <span>STEP 1: INPUT COSTS</span>
            <Ship className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
            ${blendedFeedCost}
            <span className="text-xs font-normal text-neutral-400 ml-1">/tonne</span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Weighted Landed Feedstock</p>
          <div className="mt-4 pt-3 border-t border-neutral-800 text-xs font-mono space-y-1.5 text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-400">US Ethane Delivered:</span>
              <span className="text-cyan-400 font-bold">${totalDeliveredEthane}/t</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Naphtha Landed:</span>
              <span className="text-amber-400 font-bold">${deliveredNaphtha}/t</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">VLEC Shipping:</span>
              <span>${vlecFreight}/t</span>
            </div>
          </div>
        </div>

        {/* Step 2: Processing Cost */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-orange-800/40 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-orange-400 mb-2 font-semibold">
            <span>STEP 2: PROCESSING OPEX</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
            ${blendedConversionCost}
            <span className="text-xs font-normal text-neutral-400 ml-1">/tonne</span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Thermal Cracking & Separation</p>
          <div className="mt-4 pt-3 border-t border-neutral-800 text-xs font-mono space-y-1.5 text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-400">Furnace Fuel Gas:</span>
              <span>$48/t</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Compressor Power:</span>
              <span>$26/t</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Fixed O&M & Labor:</span>
              <span>${(blendedConversionCost - 74).toFixed(0)}/t</span>
            </div>
          </div>
        </div>

        {/* Step 3: Gross Basket Realization */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-purple-800/40 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-purple-400 mb-2 font-semibold">
            <span>STEP 3: OUTPUT VALUE</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
            ${grossBasketRevenue}
            <span className="text-xs font-normal text-neutral-400 ml-1">/tonne</span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">Weighted Chemical Realization</p>
          <div className="mt-4 pt-3 border-t border-neutral-800 text-xs font-mono space-y-1.5 text-neutral-300">
            <div className="flex justify-between">
              <span className="text-neutral-400">Ethylene ({(ethyleneYield * 100).toFixed(0)}%):</span>
              <span className="text-emerald-400 font-bold">${(ethyleneYield * ethylenePrice).toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Propylene ({(propyleneYield * 100).toFixed(0)}%):</span>
              <span className="text-purple-400 font-bold">${(propyleneYield * propylenePrice).toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Pygas & Byproducts:</span>
              <span>${(grossBasketRevenue - ethyleneYield * ethylenePrice - propyleneYield * propylenePrice).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Step 4: Net EBITDA Profit */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-neutral-900 to-neutral-950 border border-emerald-500/50 relative overflow-hidden backdrop-blur-md shadow-xl shadow-emerald-950/30">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2 font-bold">
            <span>STEP 4: NET PROFIT</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl lg:text-3xl font-bold font-mono text-emerald-300">
            +${finalNetEbitdaPerTonne}
            <span className="text-xs font-normal text-neutral-400 ml-1">/tonne</span>
          </div>
          <p className="text-xs text-neutral-300 mt-1">Integrated O2C EBITDA Margin</p>
          <div className="mt-4 pt-3 border-t border-neutral-800 text-xs font-mono space-y-1.5">
            <div className="flex justify-between text-white font-bold">
              <span>Annual EBITDA (USD):</span>
              <span className="text-emerald-400">${annualEbitdaUsdM.toLocaleString()}M</span>
            </div>
            <div className="flex justify-between text-white font-bold">
              <span>Annual EBITDA (INR):</span>
              <span className="text-amber-400">₹{annualEbitdaInrCr.toLocaleString()} Cr</span>
            </div>
            <div className="flex justify-between text-neutral-400 text-[11px]">
              <span>Polymer Integration:</span>
              <span>{includePolymerUplift ? '+$135/t Active' : 'Off'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE VALUE CHAIN SLIDER CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0A0D14] border border-neutral-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white font-mono uppercase">
                Input Sensitivity & Operating Variables
              </h2>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              Live Macro Calibration
            </span>
          </div>

          <div className="space-y-5">
            {/* Feedstock Blend Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-cyan-400 font-bold">US Ethane Ratio: {ethaneRatio}%</span>
                <span className="text-amber-400 font-bold">Jamnagar Naphtha: {naphthaRatio}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={ethaneRatio}
                onChange={(e) => setEthaneRatio(Number(e.target.value))}
                className="w-full h-2.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>0% Ethane (Naphtha Only)</span>
                <span>50/50 Dual Feed</span>
                <span>100% Ethane (Max Margin)</span>
              </div>
            </div>

            {/* Brent Crude Oil Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-300">Brent Crude Oil Price:</span>
                <span className="text-amber-400 font-bold">${brentInput}/bbl</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                step="1"
                value={brentInput}
                onChange={(e) => setBrentInput(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>$60 (Depressed)</span>
                <span>$98 (Live Spot)</span>
                <span>$140 (Geopolitical Shock)</span>
              </div>
            </div>

            {/* US Ethane Spot Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-300">US Ethane Mont Belvieu Spot:</span>
                <span className="text-cyan-400 font-bold">${ethaneSpotInput}/t ({(ethaneSpotInput / 6.2).toFixed(1)} ¢/gal)</span>
              </div>
              <input
                type="range"
                min="100"
                max="350"
                step="5"
                value={ethaneSpotInput}
                onChange={(e) => setEthaneSpotInput(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>$100/t (US Gas Glut)</span>
                <span>$157/t (Current FOB)</span>
                <span>$350/t (Severe US Freeze)</span>
              </div>
            </div>

            {/* VLEC Ocean Shipping Freight */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-300">VLEC Ocean Freight (US Gulf to Dahej):</span>
                <span className="text-purple-400 font-bold">${vlecFreight}/tonne</span>
              </div>
              <input
                type="range"
                min="50"
                max="160"
                step="5"
                value={vlecFreight}
                onChange={(e) => setVlecFreight(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>$50/t (RIL Owned Fleet Base)</span>
                <span>$85/t (Current Average)</span>
                <span>$160/t (Suez / Canal Spike)</span>
              </div>
            </div>

            {/* Polymer Value Add Toggle */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-white font-bold block">
                  Downstream Polymer Integration (PE/PP)
                </span>
                <span className="text-[11px] text-neutral-400">
                  Adds +$135/t value capture converting olefins to polymer pellets
                </span>
              </div>
              <button
                onClick={() => setIncludePolymerUplift(!includePolymerUplift)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                  includePolymerUplift 
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-400' 
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                {includePolymerUplift ? 'INCLUDED (+$135/t)' : 'EXCLUDED (Mononomer Only)'}
              </button>
            </div>
          </div>
        </div>

        {/* Strategic Comparative Economics Table */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0A0D14] border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                Ethane vs Naphtha Route Comparison
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">
                Delta: +${ethaneAdvantage}/t
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Row 1: Landed Feedstock */}
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Landed Feedstock Cost</span>
                  <span className="text-cyan-400 font-bold">ETHANE WINS</span>
                </div>
                <div className="flex justify-between text-white text-sm font-bold">
                  <span>100% Ethane: ${totalDeliveredEthane}/t</span>
                  <span className="text-amber-400">100% Naphtha: ${deliveredNaphtha}/t</span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Ethane is ${(deliveredNaphtha - totalDeliveredEthane).toFixed(0)}/tonne cheaper than Naphtha.
                </p>
              </div>

              {/* Row 2: Ethylene Yield */}
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Ethylene Yield</span>
                  <span className="text-emerald-400 font-bold">2.4X HIGHER</span>
                </div>
                <div className="flex justify-between text-white text-sm font-bold">
                  <span>Ethane Route: ~80%</span>
                  <span className="text-amber-400">Naphtha Route: ~33%</span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Ethane cracking requires 1.25 tonnes of feed per tonne of ethylene vs 3.0 tonnes for Naphtha.
                </p>
              </div>

              {/* Row 3: Net Cash Margin */}
              <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800">
                <div className="flex justify-between text-neutral-400 mb-1">
                  <span>Net EBITDA per Tonne</span>
                  <span className="text-emerald-400 font-bold">FINAL MARGIN</span>
                </div>
                <div className="flex justify-between text-white text-sm font-bold">
                  <span className="text-emerald-400">+${pureEthaneMargin}/t</span>
                  <span className={pureNaphthaMargin >= 0 ? 'text-amber-400' : 'text-red-400'}>
                    ${pureNaphthaMargin}/t
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Pure Ethane provides an extra +${ethaneAdvantage}/t margin over pure Naphtha cracking.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-400">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Reliance Strategic Sweet Spot
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              By maintaining dual-feed capability, RIL captures ethane cost leadership while preserving the ability 
              to crack Naphtha when co-product propylene and BTX spreads surge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
