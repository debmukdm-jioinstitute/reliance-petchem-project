'use client';

import React, { useState, useEffect, useId } from 'react';
import { 
  Activity, 
  Flame, 
  Gauge, 
  Layers, 
  AlertCircle, 
  Zap, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sliders, 
  Info,
  Maximize2
} from 'lucide-react';

export interface ScadaState {
  ethaneRatio: number; // 0 - 100%
  naphthaRatio: number; // 0 - 100%
  throughputKtpa: number; // 1200 - 2400
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  furnaceCot: number; // °C (820 - 865)
  sorRatio: number; // Steam to oil ratio (0.3 - 0.6)
}

interface ScadaDiagramProps {
  initialEthaneRatio?: number;
  onStateChange?: (state: ScadaState) => void;
  compact?: boolean;
}

export default function ScadaDiagram({
  initialEthaneRatio = 75,
  onStateChange,
  compact = false
}: ScadaDiagramProps) {
  const [ethaneRatio, setEthaneRatio] = useState<number>(initialEthaneRatio);
  const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('HIGH');
  const [throughput, setThroughput] = useState<number>(1850); // KTPA
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [selectedUnit, setSelectedUnit] = useState<string | null>('furnace');
  const uid = useId().replace(/:/g, '');

  const naphthaRatio = 100 - ethaneRatio;

  // Temperature dynamics based on severity & feed
  const furnaceCot = severity === 'HIGH' ? 852 : severity === 'MEDIUM' ? 840 : 828;
  const sorRatio = Number((0.35 + (naphthaRatio / 100) * 0.18).toFixed(2));

  // Dynamic chemical yields based on feed blend
  // Ethane cracking yield: Ethylene ~80%, Propylene ~2.5%, H2/CH4 ~12%, PyGas/C4 ~5.5%
  // Naphtha cracking yield: Ethylene ~33%, Propylene ~17%, PyGas/BTX ~22%, Fuel Gas ~18%, C4 ~10%
  const ethyleneYield = Number(((ethaneRatio / 100) * 79.5 + (naphthaRatio / 100) * 33.2).toFixed(1));
  const propyleneYield = Number(((ethaneRatio / 100) * 2.4 + (naphthaRatio / 100) * 16.8).toFixed(1));
  const byproductsYield = Number((100 - ethyleneYield - propyleneYield).toFixed(1));

  // Mass flow rates in Tonnes per Hour (t/h)
  const totalFeedRate = Number(((throughput * 1000) / (365 * 24 * 0.94)).toFixed(1)); // ~225 t/h
  const ethaneFeedRate = Number((totalFeedRate * (ethaneRatio / 100)).toFixed(1));
  const naphthaFeedRate = Number((totalFeedRate * (naphthaRatio / 100)).toFixed(1));
  const ethyleneProductionRate = Number((totalFeedRate * (ethyleneYield / 100)).toFixed(1));
  const propyleneProductionRate = Number((totalFeedRate * (propyleneYield / 100)).toFixed(1));

  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        ethaneRatio,
        naphthaRatio,
        throughputKtpa: throughput,
        severity,
        furnaceCot,
        sorRatio
      });
    }
  }, [ethaneRatio, naphthaRatio, throughput, severity, furnaceCot, sorRatio, onStateChange]);

  const unitDetails: Record<string, { title: string; desc: string; metrics: { label: string; val: string; status: 'ok' | 'warn' }[] }> = {
    cryo: {
      title: 'Dahej & Jamnagar Cryogenic Ethane Terminal',
      desc: 'Liquid ethane stored at -90°C imported via Reliance 6+3 VLEC fleet from Morgan’s Point, Texas. Continuous boil-off reliquefaction loop.',
      metrics: [
        { label: 'Storage Temperature', val: '-91.4 °C', status: 'ok' },
        { label: 'Tank Inventory', val: '84,200 tonnes (72%)', status: 'ok' },
        { label: 'Boil-Off Gas (BOG)', val: '1.8 t/h', status: 'ok' },
        { label: 'Unloading Arm Pressure', val: '4.8 bar', status: 'ok' }
      ]
    },
    naphtha: {
      title: 'Jamnagar Refinery Naphtha Day Tank Farm',
      desc: 'Full-range straight-run naphtha from Jamnagar DTA/SEZ refineries. Direct pipeline transfer to cracker batteries.',
      metrics: [
        { label: 'Feed Density (15°C)', val: '0.718 kg/L', status: 'ok' },
        { label: 'PONA Paraffins', val: '68.4 %', status: 'ok' },
        { label: 'Contaminant Sulfur', val: '< 15 ppm', status: 'ok' },
        { label: 'Transfer Pump Head', val: '18.2 bar', status: 'ok' }
      ]
    },
    furnace: {
      title: 'Pyrolysis Radiant Furnaces (Coils & Firebox)',
      desc: '12 cracking furnaces with short residence time radiant coils (0.18s) operating under controlled steam dilution to prevent coking.',
      metrics: [
        { label: 'Coil Outlet Temp (COT)', val: `${furnaceCot} °C`, status: 'ok' },
        { label: 'Firebox Bridge Wall Temp', val: '1,045 °C', status: 'ok' },
        { label: 'Steam-to-Oil Ratio', val: `${sorRatio} kg/kg`, status: 'ok' },
        { label: 'Coil Differential Pressure', val: '1.42 bar', status: 'ok' }
      ]
    },
    quench: {
      title: 'Transfer Line Exchanger (TLE) & Primary Quench',
      desc: 'Rapid thermal quench from 850°C to 400°C in 0.03 seconds generating 120 bar superheated Very High Pressure (VHP) steam.',
      metrics: [
        { label: 'TLE Inlet Temp', val: `${furnaceCot} °C`, status: 'ok' },
        { label: 'TLE Outlet Temp', val: '410 °C', status: 'ok' },
        { label: 'VHP Steam Generated', val: '186 t/h @ 125 bar', status: 'ok' },
        { label: 'Quench Oil Circulation', val: '1,420 m³/h', status: 'ok' }
      ]
    },
    compressor: {
      title: 'Cracked Gas Compression Train (5-Stage)',
      desc: 'Centrifugal compressor with intermediate water washing and caustic soda tower to scrub acid gases (H2S, CO2 < 1 ppm).',
      metrics: [
        { label: 'Suction Pressure (Stage 1)', val: '1.15 bar', status: 'ok' },
        { label: 'Discharge Pressure (Stage 5)', val: '34.8 bar', status: 'ok' },
        { label: 'Shaft Speed', val: '4,850 RPM', status: 'ok' },
        { label: 'Turbine Steam Drive', val: '48 MW', status: 'ok' }
      ]
    },
    separation: {
      title: 'Fractionation Train (Demethanizer & C2 Splitter)',
      desc: 'Deep cryogenic chill train (-100°C) followed by 120-tray C2 Splitter isolating polymer-grade ethylene at 99.95% purity.',
      metrics: [
        { label: 'Ethylene Purity', val: '99.96 % mol', status: 'ok' },
        { label: 'Propylene Purity', val: '99.65 % mol', status: 'ok' },
        { label: 'Demethanizer Overhead', val: '-98.6 °C', status: 'ok' },
        { label: 'C2 Acetylene Reactor', val: '< 3 ppm', status: 'ok' }
      ]
    },
    polymers: {
      title: 'Downstream Polymer Units (PE / PP / Glycols)',
      desc: 'Integrated gas-phase and slurry loop reactors converting ethylene and propylene into premium grade polymers (Relene HDPE, LLDPE, Repol PP).',
      metrics: [
        { label: 'Polymer Conversion Rate', val: '94.2 %', status: 'ok' },
        { label: 'PE Line Throughput', val: '168 t/h', status: 'ok' },
        { label: 'PP Line Throughput', val: '32 t/h', status: 'ok' },
        { label: 'Extruder Melt Flow Index', val: '0.85 g/10min', status: 'ok' }
      ]
    }
  };

  const activeUnitInfo = unitDetails[selectedUnit || 'furnace'];

  return (
    <div className="w-full bg-[#0A0D14] border border-neutral-800/80 rounded-2xl p-4 lg:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background industrial grid & glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top SCADA Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-neutral-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <div className="w-3 h-3 rounded-full bg-emerald-500 -ml-6" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg lg:text-xl font-bold tracking-tight text-white flex items-center gap-2 font-mono">
                RIL-SCADA // CRACKER DIGITAL TWIN
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/50">
                MIMIC DCS v4.2
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Asset: Dahej & Jamnagar Dual-Feed Complexes • Real-Time Hydrodynamic Simulation
            </p>
          </div>
        </div>

        {/* Telemetry quick pills */}
        <div className="flex items-center gap-2 lg:gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center gap-2 text-neutral-300">
            <span className="text-neutral-500">FEED IN:</span>
            <span className="text-cyan-400 font-semibold">{totalFeedRate} t/h</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center gap-2 text-neutral-300">
            <span className="text-neutral-500">ETHYLENE:</span>
            <span className="text-emerald-400 font-semibold">{ethyleneProductionRate} t/h ({ethyleneYield}%)</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 flex items-center gap-2 text-neutral-300">
            <span className="text-neutral-500">COT:</span>
            <span className="text-amber-400 font-semibold">{furnaceCot}°C</span>
          </div>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`p-2 rounded-lg border transition-all ${
              isRunning 
                ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/40' 
                : 'bg-amber-950/40 border-amber-700/50 text-amber-400 hover:bg-amber-900/40'
            }`}
            title={isRunning ? 'Pause Simulation Flow' : 'Resume Flow'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive SCADA Graphic Canvas */}
      <div className="my-6 relative bg-neutral-950/80 rounded-xl border border-neutral-800/80 p-4 lg:p-6 overflow-x-auto">
        <svg 
          viewBox="0 0 1100 480" 
          className="w-full min-w-[850px] h-auto select-none"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id={`ethaneGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id={`naphthaGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id={`furnaceHeat-${uid}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id={`ethyleneGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id={`propyleneGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id={`neonGlow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* PIPEWORK BACKGROUND LINES */}
          {/* Ethane Feed Line (Cyan) */}
          <path
            d="M 120 130 L 260 130 L 260 210 L 330 210"
            fill="none"
            stroke="#0e7490"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Naphtha Feed Line (Amber) */}
          <path
            d="M 120 310 L 260 310 L 260 230 L 330 230"
            fill="none"
            stroke="#b45309"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Combined Transfer Line to Quench (Red/Heat) */}
          <path
            d="M 440 220 L 510 220"
            fill="none"
            stroke="#dc2626"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.5"
          />
          {/* Quench to Compressor */}
          <path
            d="M 570 220 L 640 220"
            fill="none"
            stroke="#6366f1"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Compressor to Separation */}
          <path
            d="M 720 220 L 790 220"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Separation to Ethylene Polymer Unit (Green) */}
          <path
            d="M 870 180 L 940 180 L 940 150 L 980 150"
            fill="none"
            stroke="#047857"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Separation to Propylene Unit (Purple) */}
          <path
            d="M 870 240 L 940 240 L 940 280 L 980 280"
            fill="none"
            stroke="#6d28d9"
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Separation to Fuel Gas / Heavies (Byproducts) */}
          <path
            d="M 870 280 L 920 280 L 920 390 L 980 390"
            fill="none"
            stroke="#475569"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.4"
          />

          {/* ANIMATED PULSING PARTICLES IN PIPES */}
          {isRunning && (
            <>
              {/* Ethane particles */}
              <path
                d="M 120 130 L 260 130 L 260 210 L 330 210"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeDasharray="8, 14"
                className="animate-[dash_1.5s_linear_infinite]"
                filter={`url(#neonGlow-${uid})`}
              />
              {/* Naphtha particles */}
              <path
                d="M 120 310 L 260 310 L 260 230 L 330 230"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="4"
                strokeDasharray="8, 14"
                className="animate-[dash_2s_linear_infinite]"
                filter={`url(#neonGlow-${uid})`}
              />
              {/* Hot cracked gas particles */}
              <path
                d="M 440 220 L 510 220"
                fill="none"
                stroke="#ef4444"
                strokeWidth="5"
                strokeDasharray="6, 10"
                className="animate-[dash_1s_linear_infinite]"
                filter={`url(#neonGlow-${uid})`}
              />
              {/* Cooled cracked gas */}
              <path
                d="M 570 220 L 640 220"
                fill="none"
                stroke="#818cf8"
                strokeWidth="4"
                strokeDasharray="7, 12"
                className="animate-[dash_1.2s_linear_infinite]"
              />
              {/* Compressed gas */}
              <path
                d="M 720 220 L 790 220"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="4"
                strokeDasharray="6, 10"
                className="animate-[dash_1s_linear_infinite]"
              />
              {/* Ethylene stream particles */}
              <path
                d="M 870 180 L 940 180 L 940 150 L 980 150"
                fill="none"
                stroke="#34d399"
                strokeWidth="4"
                strokeDasharray="8, 12"
                className="animate-[dash_1.2s_linear_infinite]"
                filter={`url(#neonGlow-${uid})`}
              />
              {/* Propylene stream particles */}
              <path
                d="M 870 240 L 940 240 L 940 280 L 980 280"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="4"
                strokeDasharray="8, 14"
                className="animate-[dash_1.8s_linear_infinite]"
                filter={`url(#neonGlow-${uid})`}
              />
              {/* Byproducts stream */}
              <path
                d="M 870 280 L 920 280 L 920 390 L 980 390"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="3"
                strokeDasharray="6, 16"
                className="animate-[dash_2.5s_linear_infinite]"
              />
            </>
          )}

          {/* UNIT 1: CRYO ETHANE STORAGE */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedUnit('cryo')}
          >
            <rect 
              x="20" 
              y="80" 
              width="100" 
              height="100" 
              rx="12" 
              fill="#082f49" 
              stroke={selectedUnit === 'cryo' ? '#38bdf8' : '#0284c7'} 
              strokeWidth={selectedUnit === 'cryo' ? '3' : '1.5'}
            />
            {/* Liquid level */}
            <rect x="25" y="115" width="90" height="60" rx="6" fill="#0369a1" opacity="0.6" />
            <text x="70" y="105" textAnchor="middle" fill="#e0f2fe" fontSize="11" fontWeight="bold" fontFamily="monospace">
              CRYO ETHANE
            </text>
            <text x="70" y="135" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace">
              -90°C
            </text>
            <text x="70" y="155" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontFamily="monospace">
              {ethaneFeedRate} t/h ({ethaneRatio}%)
            </text>
            <circle cx="70" cy="72" r="4" fill="#38bdf8" />
          </g>

          {/* UNIT 2: NAPHTHA TANK FARM */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedUnit('naphtha')}
          >
            <rect 
              x="20" 
              y="260" 
              width="100" 
              height="100" 
              rx="12" 
              fill="#451a03" 
              stroke={selectedUnit === 'naphtha' ? '#fbbf24' : '#d97706'} 
              strokeWidth={selectedUnit === 'naphtha' ? '3' : '1.5'}
            />
            {/* Liquid level */}
            <rect x="25" y="295" width="90" height="60" rx="6" fill="#b45309" opacity="0.6" />
            <text x="70" y="285" textAnchor="middle" fill="#fef3c7" fontSize="11" fontWeight="bold" fontFamily="monospace">
              NAPHTHA TANK
            </text>
            <text x="70" y="315" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="monospace">
              AMB 35°C
            </text>
            <text x="70" y="335" textAnchor="middle" fill="#fde68a" fontSize="9" fontFamily="monospace">
              {naphthaFeedRate} t/h ({naphthaRatio}%)
            </text>
            <circle cx="70" cy="252" r="4" fill="#fbbf24" />
          </g>

          {/* BLENDING MANIFOLD & VALVE */}
          <g transform="translate(245, 205)">
            <polygon points="0,0 30,15 0,30" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <polygon points="30,0 0,15 30,30" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
            <circle cx="15" cy="15" r="5" fill="#38bdf8" />
            <text x="15" y="-6" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              RATIO MIX
            </text>
          </g>

          {/* UNIT 3: RADIANT PYROLYSIS FURNACE (HEART OF THE CRACKER) */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedUnit('furnace')}
          >
            <rect 
              x="330" 
              y="140" 
              width="110" 
              height="160" 
              rx="14" 
              fill="#18181b" 
              stroke={selectedUnit === 'furnace' ? '#f97316' : '#ea580c'} 
              strokeWidth={selectedUnit === 'furnace' ? '3' : '2'}
            />
            {/* Furnace radiant glow */}
            <rect x="340" y="160" width="90" height="120" rx="8" fill={`url(#furnaceHeat-${uid})`} />
            
            {/* Coils schematic inside furnace */}
            <path 
              d="M 350 180 C 370 180, 370 200, 390 200 C 410 200, 410 220, 390 220 C 370 220, 370 240, 390 240 C 410 240, 410 260, 360 260" 
              fill="none" 
              stroke="#fee2e2" 
              strokeWidth="2.5" 
            />

            <text x="385" y="155" textAnchor="middle" fill="#ffedd5" fontSize="11" fontWeight="bold" fontFamily="monospace">
              CRACKER FURNACE
            </text>
            <text x="385" y="275" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="extrabold" fontFamily="monospace">
              {furnaceCot}°C
            </text>
            <text x="385" y="292" textAnchor="middle" fill="#f97316" fontSize="9" fontWeight="bold" fontFamily="monospace">
              SEV: {severity}
            </text>
            <circle cx="385" cy="130" r="5" fill="#ef4444" className="animate-ping" />
            <circle cx="385" cy="130" r="4" fill="#ef4444" />
          </g>

          {/* UNIT 4: TRANSFER LINE EXCHANGER & QUENCH TOWER */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedUnit('quench')}
          >
            <rect 
              x="510" 
              y="160" 
              width="60" 
              height="120" 
              rx="10" 
              fill="#1e1b4b" 
              stroke={selectedUnit === 'quench' ? '#818cf8' : '#4f46e5'} 
              strokeWidth={selectedUnit === 'quench' ? '3' : '1.5'}
            />
            {/* Quench spray nozzles */}
            <line x1="520" y1="185" x2="560" y2="185" stroke="#a5b4fc" strokeWidth="2" strokeDasharray="3,3" />
            <line x1="520" y1="210" x2="560" y2="210" stroke="#a5b4fc" strokeWidth="2" strokeDasharray="3,3" />
            <text x="540" y="150" textAnchor="middle" fill="#e0e7ff" fontSize="10" fontWeight="bold" fontFamily="monospace">
              QUENCH
            </text>
            <text x="540" y="250" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="bold" fontFamily="monospace">
              410°C
            </text>
            <text x="540" y="270" textAnchor="middle" fill="#818cf8" fontSize="8" fontFamily="monospace">
              VHP STEAM
            </text>
          </g>

          {/* UNIT 5: 5-STAGE CRACKED GAS COMPRESSOR */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedUnit('compressor')}
          >
            <polygon 
              points="640,170 720,195 720,245 640,270" 
              fill="#1e293b" 
              stroke={selectedUnit === 'compressor' ? '#38bdf8' : '#0284c7'} 
              strokeWidth={selectedUnit === 'compressor' ? '3' : '1.5'}
            />
            {/* Compressor impellers */}
            <circle cx="680" cy="220" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="680" y="224" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="monospace">
              5S
            </text>
            <text x="680" y="155" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="monospace">
              COMPRESSOR
            </text>
            <text x="680" y="285" textAnchor="middle" fill="#93c5fd" fontSize="9" fontFamily="monospace">
              34.8 bar
            </text>
          </g>

          {/* UNIT 6: FRACTIONATION & DEMETHANIZER / SPLITTERS */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedUnit('separation')}
          >
            <rect 
              x="790" 
              y="130" 
              width="80" 
              height="180" 
              rx="12" 
              fill="#0f172a" 
              stroke={selectedUnit === 'separation' ? '#22c55e' : '#16a34a'} 
              strokeWidth={selectedUnit === 'separation' ? '3' : '2'}
            />
            {/* Fractionation Trays */}
            <line x1="795" y1="165" x2="865" y2="165" stroke="#334155" strokeWidth="2" />
            <line x1="795" y1="195" x2="865" y2="195" stroke="#334155" strokeWidth="2" />
            <line x1="795" y1="225" x2="865" y2="225" stroke="#334155" strokeWidth="2" />
            <line x1="795" y1="255" x2="865" y2="255" stroke="#334155" strokeWidth="2" />

            <text x="830" y="120" textAnchor="middle" fill="#f0fdf4" fontSize="10" fontWeight="bold" fontFamily="monospace">
              C2/C3 SPLITTERS
            </text>
            <text x="830" y="180" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="bold" fontFamily="monospace">
              99.95%
            </text>
            <text x="830" y="295" textAnchor="middle" fill="#86efac" fontSize="9" fontFamily="monospace">
              PURITY TRAIN
            </text>
          </g>

          {/* UNIT 7A: ETHYLENE DERIVATIVE / HDPE UNIT */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedUnit('polymers')}
          >
            <rect 
              x="980" 
              y="115" 
              width="100" 
              height="70" 
              rx="10" 
              fill="#064e3b" 
              stroke={selectedUnit === 'polymers' ? '#34d399' : '#059669'} 
              strokeWidth={selectedUnit === 'polymers' ? '3' : '1.5'}
            />
            <text x="1030" y="135" textAnchor="middle" fill="#ecfdf5" fontSize="11" fontWeight="bold" fontFamily="monospace">
              RELENE HDPE
            </text>
            <text x="1030" y="155" textAnchor="middle" fill="#34d399" fontSize="13" fontWeight="bold" fontFamily="monospace">
              {ethyleneProductionRate} t/h
            </text>
            <text x="1030" y="172" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontFamily="monospace">
              YIELD: {ethyleneYield}%
            </text>
          </g>

          {/* UNIT 7B: PROPYLENE DERIVATIVE / PP UNIT */}
          <g 
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedUnit('polymers')}
          >
            <rect 
              x="980" 
              y="245" 
              width="100" 
              height="70" 
              rx="10" 
              fill="#3b0764" 
              stroke={selectedUnit === 'polymers' ? '#c084fc' : '#7e22ce'} 
              strokeWidth={selectedUnit === 'polymers' ? '3' : '1.5'}
            />
            <text x="1030" y="265" textAnchor="middle" fill="#faf5ff" fontSize="11" fontWeight="bold" fontFamily="monospace">
              REPOL PP
            </text>
            <text x="1030" y="285" textAnchor="middle" fill="#c084fc" fontSize="13" fontWeight="bold" fontFamily="monospace">
              {propyleneProductionRate} t/h
            </text>
            <text x="1030" y="302" textAnchor="middle" fill="#e9d5ff" fontSize="9" fontFamily="monospace">
              YIELD: {propyleneYield}%
            </text>
          </g>

          {/* UNIT 7C: BYPRODUCTS & FUEL GAS */}
          <g>
            <rect 
              x="980" 
              y="360" 
              width="100" 
              height="60" 
              rx="8" 
              fill="#1e293b" 
              stroke="#475569" 
              strokeWidth="1.5"
            />
            <text x="1030" y="380" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="monospace">
              PYGAS & FUEL GAS
            </text>
            <text x="1030" y="402" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
              {byproductsYield}%
            </text>
          </g>

          {/* REAL TIME MASS BALANCE LEGEND */}
          <g transform="translate(30, 440)">
            <text x="0" y="15" fill="#64748b" fontSize="10" fontFamily="monospace">
              MASS CONSERVATION: FEED IN ({totalFeedRate} t/h) = CHEMICAL OUTPUTS ({(ethyleneProductionRate + propyleneProductionRate).toFixed(1)} t/h) + BYPRODUCTS ({(totalFeedRate * (byproductsYield / 100)).toFixed(1)} t/h) [DELTA: 0.0%]
            </text>
          </g>
        </svg>
      </div>

      {/* Live SCADA Control Console & Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Left: Feedstock Mix & Furnace Knobs */}
        <div className="lg:col-span-7 bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 lg:p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Feedstock & Cracker Operational Knobs
            </h3>
            <span className="text-[11px] font-mono text-neutral-400">
              LP Optimization Bound: 100% Flexible
            </span>
          </div>

          <div className="space-y-4">
            {/* Feedstock Blend Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  US Cryo Ethane: {ethaneRatio}% ({ethaneFeedRate} t/h)
                </span>
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Jamnagar Naphtha: {naphthaRatio}% ({naphthaFeedRate} t/h)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={ethaneRatio}
                onChange={(e) => setEthaneRatio(Number(e.target.value))}
                className="w-full h-2.5 bg-gradient-to-r from-amber-600 via-purple-600 to-cyan-500 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>100% Naphtha Cracking</span>
                <span>50/50 Dual Feed</span>
                <span>100% Pure Ethane Cracking</span>
              </div>
            </div>

            {/* Cracking Severity Selector */}
            <div className="pt-2 border-t border-neutral-800/80">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-neutral-300">Cracking Severity (Radiant Coil Profile):</span>
                <span className="text-amber-400 font-bold">{severity} SEVERITY ({furnaceCot}°C)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`py-2 px-3 text-xs font-mono font-bold rounded-lg border transition-all ${
                      severity === sev 
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10' 
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sev === 'LOW' && '828°C (Max Propylene)'}
                    {sev === 'MEDIUM' && '840°C (Balanced)'}
                    {sev === 'HIGH' && '852°C (Max Ethylene)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Plant Throughput Slider */}
            <div className="pt-2 border-t border-neutral-800/80">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-300">Total Nameplate Throughput:</span>
                <span className="text-emerald-400 font-bold">{throughput.toLocaleString()} KTPA ({totalFeedRate} t/h)</span>
              </div>
              <input
                type="range"
                min="1200"
                max="2400"
                step="50"
                value={throughput}
                onChange={(e) => setThroughput(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>1,200 KTPA (Turndown)</span>
                <span>1,850 KTPA (Nominal)</span>
                <span>2,400 KTPA (Expanded Dahej+JMN)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected SCADA Unit Inspector */}
        <div className="lg:col-span-5 bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 lg:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                <Gauge className="w-4 h-4" />
                Unit Telemetry Inspector
              </span>
              <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                ACTIVE TAG
              </span>
            </div>

            <div className="mt-3">
              <h4 className="text-sm font-bold text-white">{activeUnitInfo.title}</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{activeUnitInfo.desc}</p>
            </div>

            <div className="mt-4 space-y-2">
              {activeUnitInfo.metrics.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/70 border border-neutral-800/60 text-xs font-mono">
                  <span className="text-neutral-400">{m.label}</span>
                  <span className="text-white font-bold">{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Safety Interlocks Armed (SIL-3)
            </span>
            <span className="text-neutral-500">Hazira • Dahej • Jamnagar</span>
          </div>
        </div>
      </div>
    </div>
  );
}
