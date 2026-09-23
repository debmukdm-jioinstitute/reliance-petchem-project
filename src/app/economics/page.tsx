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
import RelianceLogo from '@/components/common/RelianceLogo';
import PriceInfoIcon from '@/components/common/PriceInfoIcon';
import AppShell from '@/components/layout/AppShell';

export default function CrackerEconomicsPage() {
  const { commodities, refreshPrices, isSyncing } = useMarket();

  // Baseline market quotes from context or defaults
  const liveBrent = commodities.find(c => c.id === 'comm-brent')?.currentPrice || 97.9;
  const liveEthane = commodities.find(c => c.id === 'comm-ethane')?.currentPrice || 157;
  const liveNaphtha = commodities.find(c => c.id === 'comm-naphtha')?.currentPrice || 816;
  const liveEthylene = commodities.find(c => c.id === 'comm-ethylene')?.currentPrice || 886;
  const livePropylene = commodities.find(c => c.id === 'comm-propylene')?.currentPrice || 833;
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
    <AppShell>
      <div className="space-y-8 animate-fadeIn pb-12 max-w-[1600px] mx-auto">
        {/* Header Banner with Reliance Logo */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0C101A] border border-neutral-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <RelianceLogo size="md" variant="badge" />
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-md bg-amber-950/80 border border-amber-800/60 text-amber-400 font-bold flex items-center gap-1.5">
                <Scale className="w-3 h-3" />
                END-TO-END VALUE CHAIN ECONOMICS
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase rounded-md bg-neutral-800 text-neutral-300">
                RELIANCE O2C ASSETS
              </span>
              <span className="text-xs font-serif italic text-[#8F7640] dark:text-[#D4BA7B] font-bold">
                Growth is Life
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">
              Cracker Cost & Profit Estimation Engine
            </h1>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed font-mono">
              Economic waterfall: Landed Feedstock Costs $\rightarrow$ Furnace Conversion OPEX $\rightarrow$ Output Realizations $\rightarrow$ Integrated Net EBITDA
            </p>
          </div>
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
            <span>MARGIN CALCULATOR</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </Link>
        </div>
      </div>

      {/* 4-STEP VALUE CHAIN WATERFALL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Step 1: Input Costs */}
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-cyan-700/50 relative overflow-hidden backdrop-blur-md shadow-lg shadow-cyan-950/20">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-2 font-bold tracking-wide">
            <div className="flex items-center gap-1.5">
              <span>STEP 1: INPUT COSTS</span>
              <PriceInfoIcon commodityId="comm-ethane" size="xs" />
            </div>
            <Ship className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
              ${blendedFeedCost}
              <span className="text-sm font-medium text-neutral-300 ml-1">/tonne</span>
            </div>
            <PriceInfoIcon commodityId="comm-ethane" currentPrice={blendedFeedCost} unit="USD/t" size="xs" />
          </div>
          <p className="text-sm font-medium text-neutral-200 mt-1">Weighted Landed Feedstock</p>
          <div className="mt-4 pt-3.5 border-t border-neutral-700/60 text-sm font-mono space-y-2.5 text-neutral-200">
            <div className="flex justify-between items-center">
              <span className="text-neutral-200 font-medium">US Ethane Delivered:</span>
              <div className="flex items-center gap-1 text-cyan-300 font-bold">
                <span>${totalDeliveredEthane}/t</span>
                <PriceInfoIcon commodityId="comm-ethane" currentPrice={totalDeliveredEthane} unit="USD/t" size="xs" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-200 font-medium">Naphtha Landed:</span>
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <span>${deliveredNaphtha}/t</span>
                <PriceInfoIcon commodityId="comm-naphtha" currentPrice={deliveredNaphtha} unit="USD/t" size="xs" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-200 font-medium">VLEC Shipping:</span>
              <span className="text-white font-semibold">${vlecFreight}/t</span>
            </div>
          </div>
        </div>

        {/* Step 2: Processing Cost */}
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-orange-700/50 relative overflow-hidden backdrop-blur-md shadow-lg shadow-orange-950/20">
          <div className="flex items-center justify-between text-xs font-mono text-orange-300 mb-2 font-bold tracking-wide">
            <div className="flex items-center gap-1.5">
              <span>STEP 2: PROCESSING OPEX</span>
              <PriceInfoIcon commodityId="comm-o2c-margin" size="xs" />
            </div>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
              ${blendedConversionCost}
              <span className="text-sm font-medium text-neutral-300 ml-1">/tonne</span>
            </div>
            <PriceInfoIcon commodityId="comm-o2c-margin" currentPrice={blendedConversionCost} unit="USD/t" size="xs" />
          </div>
          <p className="text-sm font-medium text-neutral-200 mt-1">Thermal Cracking & Separation</p>
          <div className="mt-4 pt-3.5 border-t border-neutral-700/60 text-sm font-mono space-y-2.5 text-neutral-200">
            <div className="flex justify-between items-center">
              <span className="text-neutral-200 font-medium">Furnace Fuel Gas:</span>
              <span className="text-white font-semibold">$48/t</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-200 font-medium">Compressor Power:</span>
              <span className="text-white font-semibold">$26/t</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-200 font-medium">Fixed O&M & Labor:</span>
              <span className="text-white font-semibold">${(blendedConversionCost - 74).toFixed(0)}/t</span>
            </div>
          </div>
        </div>

        {/* Step 3: Gross Basket Realization */}
        <div className="p-5 rounded-2xl bg-[#0D121F] border border-purple-700/50 relative overflow-hidden backdrop-blur-md shadow-lg shadow-purple-950/20">
          <div className="flex items-center justify-between text-xs font-mono text-purple-300 mb-2 font-bold tracking-wide">
            <div className="flex items-center gap-1.5">
              <span>STEP 3: OUTPUT VALUE</span>
              <PriceInfoIcon commodityId="comm-ethylene" size="xs" />
            </div>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl lg:text-3xl font-bold font-mono text-white">
              ${grossBasketRevenue}
              <span className="text-sm font-medium text-neutral-300 ml-1">/tonne</span>
            </div>
            <PriceInfoIcon commodityId="comm-ethylene" currentPrice={grossBasketRevenue} unit="USD/t" size="xs" />
          </div>
          <p className="text-sm font-medium text-neutral-200 mt-1">Weighted Chemical Realization</p>
          <div className="mt-4 pt-3.5 border-t border-neutral-700/60 text-sm font-mono space-y-2.5 text-neutral-200">
            <div className="flex justify-between items-center">
              <span className="text-neutral-200 font-medium">Ethylene ({(ethyleneYield * 100).toFixed(0)}%):</span>
              <div className="flex items-center gap-1 text-emerald-300 font-bold">
                <span>${(ethyleneYield * ethylenePrice).toFixed(0)}</span>
                <PriceInfoIcon commodityId="comm-ethylene" currentPrice={ethylenePrice} unit="USD/t" size="xs" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-200 font-medium">Propylene ({(propyleneYield * 100).toFixed(0)}%):</span>
              <div className="flex items-center gap-1 text-purple-300 font-bold">
                <span>${(propyleneYield * propylenePrice).toFixed(0)}</span>
                <PriceInfoIcon commodityId="comm-propylene" currentPrice={propylenePrice} unit="USD/t" size="xs" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-200 font-medium">Pygas & Byproducts:</span>
              <span className="text-white font-semibold">${(grossBasketRevenue - ethyleneYield * ethylenePrice - propyleneYield * propylenePrice).toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Step 4: Net EBITDA Profit */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/70 via-neutral-900 to-[#0A141A] border border-emerald-500/60 relative overflow-hidden backdrop-blur-md shadow-xl shadow-emerald-950/40">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-300 mb-2 font-bold tracking-wide">
            <div className="flex items-center gap-1.5">
              <span>STEP 4: NET PROFIT</span>
              <PriceInfoIcon commodityId="comm-o2c-margin" size="xs" />
            </div>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl lg:text-3xl font-bold font-mono text-emerald-300">
              +${finalNetEbitdaPerTonne}
              <span className="text-sm font-medium text-neutral-300 ml-1">/tonne</span>
            </div>
            <PriceInfoIcon commodityId="comm-o2c-margin" currentPrice={finalNetEbitdaPerTonne} unit="USD/t" size="xs" />
          </div>
          <p className="text-sm font-medium text-neutral-200 mt-1">Integrated O2C EBITDA Margin</p>
          <div className="mt-4 pt-3.5 border-t border-neutral-700/60 text-sm font-mono space-y-2.5">
            <div className="flex justify-between items-center text-white font-bold">
              <span className="text-neutral-200 font-medium">Annual EBITDA (USD):</span>
              <div className="flex items-center gap-1 text-emerald-300 font-bold">
                <span>${annualEbitdaUsdM.toLocaleString()}M</span>
                <PriceInfoIcon commodityId="comm-o2c-margin" size="xs" />
              </div>
            </div>
            <div className="flex justify-between items-center text-white font-bold">
              <span className="text-neutral-200 font-medium">Annual EBITDA (INR):</span>
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <span>₹{annualEbitdaInrCr.toLocaleString()} Cr</span>
                <PriceInfoIcon commodityId="comm-o2c-margin" size="xs" />
              </div>
            </div>
            <div className="flex justify-between items-center text-neutral-300 text-xs">
              <span>Polymer Integration:</span>
              <span className="text-emerald-300 font-semibold">{includePolymerUplift ? '+$135/t Active' : 'Off'}</span>
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
            <span className="text-xs font-mono text-neutral-300">
              Live Macro Calibration
            </span>
          </div>

          <div className="space-y-5">
            {/* Feedstock Blend Slider */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-mono mb-1.5">
                <span className="text-cyan-300 font-bold">US Ethane Ratio: {ethaneRatio}%</span>
                <span className="text-amber-300 font-bold">Jamnagar Naphtha: {naphthaRatio}%</span>
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
              <div className="flex justify-between text-xs font-mono text-neutral-400 mt-1.5">
                <span>0% Ethane (Naphtha Only)</span>
                <span>50/50 Dual Feed</span>
                <span>100% Ethane (Max Margin)</span>
              </div>
            </div>

            {/* Brent Crude Oil Price Slider */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-mono mb-1.5 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-200 font-medium">Brent Crude Oil Price:</span>
                  <PriceInfoIcon commodityId="comm-brent" currentPrice={brentInput} unit="USD/bbl" size="xs" />
                </div>
                <span className="text-amber-300 font-bold text-sm">${brentInput}/bbl</span>
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
              <div className="flex justify-between text-xs font-mono text-neutral-400 mt-1.5">
                <span>$60 (Depressed)</span>
                <span>$98 (Live Spot)</span>
                <span>$140 (Geopolitical Shock)</span>
              </div>
            </div>

            {/* US Ethane Spot Price Slider */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-mono mb-1.5 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-200 font-medium">US Ethane Mont Belvieu Spot:</span>
                  <PriceInfoIcon commodityId="comm-ethane" currentPrice={ethaneSpotInput} unit="USD/t" size="xs" />
                </div>
                <span className="text-cyan-300 font-bold text-sm">${ethaneSpotInput}/t ({(ethaneSpotInput / 6.2).toFixed(1)} ¢/gal)</span>
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
              <div className="flex justify-between text-xs font-mono text-neutral-400 mt-1.5">
                <span>$100 (Historical Low)</span>
                <span>$157 (Live Spot)</span>
                <span>$350 (Severe Polar Freeze)</span>
              </div>
            </div>

            {/* VLEC Shipping Cost Slider */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-mono mb-1.5 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-200 font-medium">VLEC Shipping Freight (USGC to Dahej):</span>
                  <PriceInfoIcon commodityId="comm-spread-ee" currentPrice={vlecFreight} unit="USD/t" size="xs" />
                </div>
                <span className="text-white font-bold text-sm">${vlecFreight}/t</span>
              </div>
              <input
                type="range"
                min="40"
                max="180"
                step="5"
                value={vlecFreight}
                onChange={(e) => setVlecFreight(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-neutral-400"
              />
              <div className="flex justify-between text-xs font-mono text-neutral-400 mt-1.5">
                <span>$40/t (RIL Captive Moat)</span>
                <span>$85/t (Current Average)</span>
                <span>$160/t (Suez / Canal Spike)</span>
              </div>
            </div>

            {/* Polymer Value Add Toggle */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-mono text-white font-bold block">
                    Downstream Polymer Integration (PE/PP)
                  </span>
                  <PriceInfoIcon commodityId="comm-hdpe" size="xs" />
                </div>
                <span className="text-xs text-neutral-300">
                  Adds +$135/t value capture converting olefins to polymer pellets
                </span>
              </div>
              <button
                onClick={() => setIncludePolymerUplift(!includePolymerUplift)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                  includePolymerUplift 
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300' 
                    : 'bg-neutral-800 border-neutral-700 text-neutral-300'
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
              <span className="text-xs font-mono text-cyan-300 font-bold">
                Delta: +${ethaneAdvantage}/t
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs sm:text-sm">
              {/* Row 1: Landed Feedstock */}
              <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-700/60">
                <div className="flex justify-between text-neutral-300 mb-1.5">
                  <span className="font-medium text-neutral-200">Landed Feedstock Cost</span>
                  <span className="text-cyan-300 font-bold">ETHANE WINS</span>
                </div>
                <div className="flex justify-between text-white text-sm sm:text-base font-bold">
                  <span>100% Ethane: ${totalDeliveredEthane}/t</span>
                  <span className="text-amber-300">100% Naphtha: ${deliveredNaphtha}/t</span>
                </div>
                <p className="text-xs text-neutral-300 mt-1.5">
                  Ethane is ${(deliveredNaphtha - totalDeliveredEthane).toFixed(0)}/tonne cheaper than Naphtha.
                </p>
              </div>

              {/* Row 2: Ethylene Yield */}
              <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-700/60">
                <div className="flex justify-between text-neutral-300 mb-1.5">
                  <span className="font-medium text-neutral-200">Ethylene Yield</span>
                  <span className="text-emerald-300 font-bold">2.4X HIGHER</span>
                </div>
                <div className="flex justify-between text-white text-sm sm:text-base font-bold">
                  <span>Ethane Route: ~80%</span>
                  <span className="text-amber-300">Naphtha Route: ~33%</span>
                </div>
                <p className="text-xs text-neutral-300 mt-1.5">
                  Ethane cracking requires 1.25 tonnes of feed per tonne of ethylene vs 3.0 tonnes for Naphtha.
                </p>
              </div>

              {/* Row 3: Net Cash Margin */}
              <div className="p-3.5 rounded-xl bg-neutral-900/90 border border-neutral-700/60">
                <div className="flex justify-between text-neutral-300 mb-1.5">
                  <span className="font-medium text-neutral-200">Net EBITDA per Tonne</span>
                  <span className="text-emerald-300 font-bold">FINAL MARGIN</span>
                </div>
                <div className="flex justify-between text-white text-sm sm:text-base font-bold">
                  <span className="text-emerald-300">+${pureEthaneMargin}/t</span>
                  <span className={pureNaphthaMargin >= 0 ? 'text-amber-300' : 'text-rose-400'}>
                    ${pureNaphthaMargin}/t
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-1.5">
                  Pure Ethane provides an extra +${ethaneAdvantage}/t margin over pure Naphtha cracking.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-300">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <CheckCircle2 className="w-4 h-4" />
              Reliance Strategic Sweet Spot
            </div>
            <p className="text-xs leading-relaxed text-neutral-200">
              By maintaining dual-feed capability, RIL captures ethane cost leadership while preserving the ability 
              to crack Naphtha when co-product propylene and BTX spreads surge.
            </p>
          </div>
        </div>
      </div>
    </div>
  </AppShell>
);
}
