'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AppShell from '@/components/layout/AppShell';
import {
  Search, ArrowRight, ChevronRight, RefreshCw, TrendingUp,
  TrendingDown, Flame, Droplets, Factory, Box, BarChart2,
  FileText, Sliders, Play, Layers, Bell, X, ExternalLink,
  Zap, Globe, Sparkles
} from 'lucide-react';
import { useMarket } from '@/context/MarketContext';
import { SynthesizedAnswer } from '@/lib/searchEngine';

// Dynamic import for ECharts (SSR-safe)
const EChartsClient = dynamic(() => import('@/components/charts/EChartsClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] flex items-center justify-center">
      <RefreshCw className="w-5 h-5 text-neutral-300 animate-spin" />
    </div>
  ),
});

/* ─── Greeting helper ──────────────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/* ─── Smooth SVG Sparkline ─────────────────────────────────────────────────── */
function Sparkline({ up }: { up: boolean }) {
  const color = up ? '#16A34A' : '#DC2626';
  const gradId = `sg-${up ? 'g' : 'r'}-${Math.random().toString(36).slice(2, 6)}`;
  const path = up
    ? 'M0,28 C15,26 28,22 42,18 S65,13 80,10 S92,7 100,5'
    : 'M0,8 C12,10 25,14 38,20 S60,24 75,22 S90,26 100,28';
  const fill = up
    ? 'M0,28 C15,26 28,22 42,18 S65,13 80,10 S92,7 100,5 L100,35 L0,35Z'
    : 'M0,8 C12,10 25,14 38,20 S60,24 75,22 S90,26 100,28 L100,35 L0,35Z';

  return (
    <svg viewBox="0 0 100 35" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#${gradId})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Benchmark Card ───────────────────────────────────────────────────────── */
interface BenchmarkCardProps {
  icon: React.ElementType;
  label: string;
  price: string;
  unit: string;
  change: string;
  isUp: boolean;
  href: string;
}
function BenchmarkCard({ icon: Icon, label, price, unit, change, isUp, href }: BenchmarkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group p-4 rounded-2xl bg-white border border-neutral-100 hover:border-neutral-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-3 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-neutral-500 shrink-0" />
          <span className="text-xs font-medium text-neutral-500">{label}</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
      </div>
      <div>
        <div className="text-2xl font-bold text-neutral-900 font-mono tracking-tight">
          ${price}
          <span className="text-xs text-neutral-400 font-normal ml-0.5">/{unit}</span>
        </div>
        <div className={`flex items-center gap-1 mt-1 text-xs font-semibold font-mono ${isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{change}</span>
        </div>
      </div>
      <div className="h-9 w-full">
        <Sparkline up={isUp} />
      </div>
    </a>
  );
}

/* ─── Quick Action Button ──────────────────────────────────────────────────── */
function QuickAction({ icon: Icon, label, sublabel, href, iconBg, iconColor }: {
  icon: React.ElementType; label: string; sublabel?: string; href: string;
  iconBg: string; iconColor: string;
}) {
  return (
    <Link href={href}
      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all group">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`w-4 h-4 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-neutral-800 leading-tight">{label}</div>
        {sublabel && <div className="text-[10px] text-neutral-400 mt-0.5">{sublabel}</div>}
      </div>
    </Link>
  );
}

/* ─── Insight Row ──────────────────────────────────────────────────────────── */
function InsightRow({ color, icon: Icon, title, time }: {
  color: string; icon: React.ElementType; title: string; time: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-neutral-50 last:border-0">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${color}`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-neutral-800 leading-snug">{title}</p>
        <p className="text-[10px] text-neutral-400 mt-0.5">{time}</p>
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0 mt-1" />
    </div>
  );
}

/* ─── Global Price Trend ECharts option ────────────────────────────────────── */
function buildTrendChartOption(period: '1M' | '3M' | '6M') {
  // Month labels based on period
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const months = period === '1M' ? allMonths.slice(7) : period === '3M' ? allMonths.slice(5) : allMonths;

  // Brent, Naphtha, Ethylene, Ethane approximate data
  const data: Record<string, Record<string, number[][]>> = {
    '6M': {
      brent:    [[0,780],[1,820],[2,850],[3,840],[4,900],[5,920],[6,880],[7,940],[8,998]],
      naphtha:  [[0,600],[1,640],[2,680],[3,660],[4,700],[5,720],[6,700],[7,740],[8,828]],
      ethylene: [[0,750],[1,780],[2,820],[3,800],[4,840],[5,860],[6,830],[7,870],[8,891]],
      ethane:   [[0,130],[1,140],[2,145],[3,138],[4,148],[5,155],[6,150],[7,158],[8,162]],
    },
    '3M': {
      brent:    [[0,880],[1,920],[2,900],[3,940],[4,998]],
      naphtha:  [[0,700],[1,730],[2,710],[3,750],[4,828]],
      ethylene: [[0,840],[1,870],[2,845],[3,880],[4,891]],
      ethane:   [[0,148],[1,155],[2,150],[3,158],[4,162]],
    },
    '1M': {
      brent:    [[0,960],[1,998]],
      naphtha:  [[0,800],[1,828]],
      ethylene: [[0,875],[1,891]],
      ethane:   [[0,158],[1,162]],
    },
  };

  const d = data[period];
  const n = months.length;

  const makeSeries = (
    name: string,
    pts: number[][],
    color: string,
    isDashed = false
  ) => ({
    name,
    type: 'line',
    smooth: true,
    data: pts.map(([xi, y]) => [xi, y]),
    symbol: 'none',
    lineStyle: { width: 2.5, color, type: isDashed ? 'dashed' : 'solid' },
    itemStyle: { color },
    areaStyle: undefined,
  });

  return {
    backgroundColor: 'transparent',
    grid: { top: 20, right: 20, bottom: 40, left: 50, containLabel: false },
    xAxis: {
      type: 'category',
      data: months,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter, sans-serif' },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1200,
      interval: 400,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#9CA3AF', fontSize: 11, fontFamily: 'Inter, sans-serif' },
      splitLine: { lineStyle: { color: '#F3F4F6', type: 'solid' } },
    },
    legend: { show: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      textStyle: { color: '#374151', fontSize: 11, fontFamily: 'Inter, sans-serif' },
      formatter: (params: { seriesName: string; value: number[] }[]) =>
        params.map((p) => `<b>${p.seriesName}</b>: $${p.value[1]}/t`).join('<br/>'),
    },
    series: [
      makeSeries('Brent Crude', d.brent.slice(0, n), '#C8A96E'),   // warm gold
      makeSeries('Naphtha',     d.naphtha.slice(0, n), '#93B5C6'),  // steel blue
      makeSeries('Ethylene',    d.ethylene.slice(0, n), '#4A90D9'), // blue
      makeSeries('Ethane',      d.ethane.slice(0, n), '#5BAD8C'),   // teal green
    ],
  };
}

/* ─── INLINE AI RESULT ─────────────────────────────────────────────────────── */
function InlineAIResult({ result, provider, onClose }: {
  result: SynthesizedAnswer; provider: string; onClose: () => void;
}) {
  return (
    <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/60 shadow-sm space-y-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300/50">
            {result.category}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {provider}
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-amber-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <p className="text-sm font-semibold text-neutral-800 leading-relaxed">{result.keyTakeaway}</p>
      <p className="text-xs text-neutral-600 leading-relaxed line-clamp-4">{result.answer}</p>
      <Link href={`/ai?q=${encodeURIComponent(result.question)}`}
        className="text-xs text-amber-700 font-semibold flex items-center gap-1 hover:underline">
        View full analysis <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

/* ─── MAIN DASHBOARD ────────────────────────────────────────────────────────── */
function DashboardContent() {
  const router = useRouter();
  const { getCommodity, isSyncing, refreshPrices } = useMarket();

  const [timeFilter, setTimeFilter] = useState<'Live' | '1D' | '1W' | '1M'>('Live');
  const [chartPeriod, setChartPeriod] = useState<'1M' | '3M' | '6M'>('6M');
  const [query, setQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [aiResult, setAiResult] = useState<SynthesizedAnswer | null>(null);
  const [aiProvider, setAiProvider] = useState('');

  // Live commodity data
  const brent    = getCommodity('comm-brent');
  const naphtha  = getCommodity('comm-naphtha');
  const ethylene = getCommodity('comm-ethylene');
  const ethane   = getCommodity('comm-ethane');

  const brentPrice    = brent?.currentPrice?.toFixed(2)    ?? '99.85';
  const naphthaPrice  = naphtha?.currentPrice?.toFixed(0)  ?? '828';
  const ethylenePrice = ethylene?.currentPrice?.toFixed(0) ?? '891';
  const ethanePrice   = ethane?.currentPrice?.toFixed(0)   ?? '162';

  const brentUp    = (brent?.change1D    ?? 1.8) >= 0;
  const naphthaUp  = (naphtha?.change1D  ?? -2.1) >= 0;
  const ethyleneUp = (ethylene?.change1D ?? 2.4) >= 0;
  const ethaneUp   = (ethane?.change1D   ?? -1.8) >= 0;

  const changeMap: Record<string, { live: string; '1D': string; '1W': string; '1M': string }> = {
    brent:    { live: `${brentUp ? '+' : ''}${(brent?.change1D ?? 1.8).toFixed(1)}%`,    '1D': '+1.8%', '1W': '-4.7%', '1M': '+5.8%' },
    naphtha:  { live: `${naphthaUp ? '+' : ''}${(naphtha?.change1D ?? -2.1).toFixed(1)}%`, '1D': '-2.1%', '1W': '-1.4%', '1M': '+3.2%' },
    ethylene: { live: `${ethyleneUp ? '+' : ''}${(ethylene?.change1D ?? 2.4).toFixed(1)}%`, '1D': '+2.4%', '1W': '+3.1%', '1M': '+4.8%' },
    ethane:   { live: `${ethaneUp ? '+' : ''}${(ethane?.change1D ?? -1.8).toFixed(1)}%`,   '1D': '-1.8%', '1W': '-1.2%', '1M': '+2.1%' },
  };

  const tf = timeFilter === 'Live' ? 'live' : timeFilter;

  const QUICK_PROMPTS = [
    { label: '🔥 Brent outlook', query: 'What is the near-term Brent crude outlook and impact on RIL O2C margins?' },
    { label: '⚗️ Naphtha vs Ethane', query: 'What is the EBITDA margin advantage of ethane cracking over naphtha cracking at RIL?' },
    { label: '📈 RIL cracking margins', query: 'What are current RIL cracker crack spreads and how do they compare to Asian peers?' },
    { label: '🎲 Run scenario', query: 'Run a scenario: Brent at $120/bbl, ethane at $200/t — impact on RIL O2C profitability?' },
  ];

  const INSIGHTS = [
    { color: 'bg-emerald-500', icon: TrendingUp,   title: 'Brent up 1.8% on supply tightness',      time: '2 hours ago' },
    { color: 'bg-rose-400',    icon: TrendingDown,  title: 'Naphtha softens on lower demand',         time: '4 hours ago' },
    { color: 'bg-blue-500',    icon: TrendingUp,    title: 'Ethylene margins improve in Asia',         time: '5 hours ago' },
  ];

  const runQuery = async (q: string) => {
    if (!q.trim() || isQuerying) return;
    setIsQuerying(true);
    setAiResult(null);
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q.trim(), stream: false }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      if (data?.answer) {
        setAiResult(data.answer);
        setAiProvider(data.provider || 'Groq Intelligence');
      } else {
        router.push(`/ai?q=${encodeURIComponent(q)}`);
      }
    } catch {
      router.push(`/ai?q=${encodeURIComponent(q)}`);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) runQuery(query);
  };

  const chartOption = buildTrendChartOption(chartPeriod);

  return (
    <div className="space-y-4 pb-8 animate-fadeIn">

      {/* ── ROW 1: Greeting + Hero ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        {/* LEFT: Greeting + Search bar */}
        <div className="lg:col-span-7 space-y-4">

          {/* Greeting */}
          <div className="px-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              {getGreeting()}, Debabrata
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5">Turn market data into sharper decisions for RIL.</p>
          </div>

          {/* Search / AI prompt bar */}
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-4 space-y-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about markets, assets, scenarios or models..."
                className="flex-1 text-sm text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none font-sans"
              />
              <button
                type="submit"
                disabled={!query.trim() || isQuerying}
                className="w-10 h-10 rounded-full bg-[#C8A96E] hover:bg-[#B89358] text-white flex items-center justify-center shrink-0 transition-all active:scale-95 disabled:opacity-40 cursor-pointer shadow-sm"
              >
                {isQuerying
                  ? <RefreshCw className="w-4 h-4 animate-spin" />
                  : <ArrowRight className="w-4 h-4" />
                }
              </button>
            </form>

            {/* Quick prompt chips */}
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(p.query); runQuery(p.query); }}
                  disabled={isQuerying}
                  className="px-3.5 py-1.5 rounded-full bg-[#F5F0E8] hover:bg-[#EDE7DC] border border-[#E8E0D0] text-xs text-neutral-700 font-medium transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Inline AI result */}
            {aiResult && (
              <InlineAIResult result={aiResult} provider={aiProvider} onClose={() => setAiResult(null)} />
            )}
          </div>
        </div>

        {/* RIGHT: Hero image */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-auto lg:h-[200px] shadow-md">
            <img
              src="/images/refinery-plant.jpg"
              alt="Reliance Petrochemical Complex"
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            {/* Live badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Market Data
            </div>
            {/* Branding text */}
            <div className="absolute bottom-0 left-0 p-4">
              <p className="text-[9px] font-mono tracking-widest text-white/60 uppercase mb-1">RELIANCE INDUSTRIES</p>
              <h2 className="text-xl font-bold text-white leading-tight drop-shadow-sm">
                From Energy<br />to Endless<br />Possibilities
              </h2>
              <p className="text-[10px] text-white/70 mt-1">Integrated. Intelligent. Sustainable.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Benchmarks + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Benchmarks */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-neutral-900">Key Market Benchmarks</h2>
            <div className="flex items-center gap-0.5 text-xs bg-[#F5F0E8] rounded-full p-0.5">
              {(['Live', '1D', '1W', '1M'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeFilter(t)}
                  className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                    timeFilter === t
                      ? 'bg-[#C8A96E] text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {t === 'Live' ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </span>
                  ) : t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <BenchmarkCard
              icon={Flame}
              label="Brent Crude"
              price={brentPrice}
              unit="bbl"
              change={changeMap.brent[tf as keyof typeof changeMap.brent]}
              isUp={tf === 'live' ? brentUp : !changeMap.brent[tf as keyof typeof changeMap.brent].startsWith('-')}
              href="https://finance.yahoo.com/quote/BZ=F/"
            />
            <BenchmarkCard
              icon={Factory}
              label="Naphtha (CFR)"
              price={naphthaPrice}
              unit="t"
              change={changeMap.naphtha[tf as keyof typeof changeMap.naphtha]}
              isUp={tf === 'live' ? naphthaUp : !changeMap.naphtha[tf as keyof typeof changeMap.naphtha].startsWith('-')}
              href="https://finance.yahoo.com/quote/BZ=F/"
            />
            <BenchmarkCard
              icon={Droplets}
              label="Ethylene (CFR)"
              price={ethylenePrice}
              unit="t"
              change={changeMap.ethylene[tf as keyof typeof changeMap.ethylene]}
              isUp={tf === 'live' ? ethyleneUp : !changeMap.ethylene[tf as keyof typeof changeMap.ethylene].startsWith('-')}
              href="https://finance.yahoo.com/quote/BZ=F/"
            />
            <BenchmarkCard
              icon={Box}
              label="Ethane (FOB)"
              price={ethanePrice}
              unit="t"
              change={changeMap.ethane[tf as keyof typeof changeMap.ethane]}
              isUp={tf === 'live' ? ethaneUp : !changeMap.ethane[tf as keyof typeof changeMap.ethane].startsWith('-')}
              href="https://finance.yahoo.com/quote/NG=F/"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2">
            <QuickAction
              icon={Play}
              label="Run Monte Carlo"
              href="/scenarios/monte-carlo"
              iconBg="bg-orange-50"
              iconColor="text-orange-500"
            />
            <QuickAction
              icon={Layers}
              label="Scenario Analysis"
              href="/scenarios"
              iconBg="bg-blue-50"
              iconColor="text-blue-500"
            />
            <QuickAction
              icon={BarChart2}
              label="View Reports"
              href="/financial"
              iconBg="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <QuickAction
              icon={Sliders}
              label="Adjust Inputs"
              href="/economics"
              iconBg="bg-violet-50"
              iconColor="text-violet-500"
            />
          </div>
        </div>
      </div>

      {/* ── ROW 3: Global Price Trends + Latest Insights + Data Clarity Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Global Price Trends chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-neutral-900">Global Price Trends</h2>
            <div className="relative">
              <select
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value as '1M' | '3M' | '6M')}
                className="text-xs text-neutral-600 font-semibold bg-[#F5F0E8] border-0 rounded-full px-3 py-1.5 pr-7 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="6M">6 Months</option>
                <option value="3M">3 Months</option>
                <option value="1M">1 Month</option>
              </select>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-500 absolute right-2 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
          </div>

          {/* ECharts light-mode chart */}
          <Suspense fallback={<div className="h-[200px] flex items-center justify-center"><RefreshCw className="w-5 h-5 text-neutral-300 animate-spin" /></div>}>
            <EChartsClient option={chartOption} height={200} />
          </Suspense>

          {/* Legend */}
          <div className="flex items-center flex-wrap gap-4 mt-2 pt-2 border-t border-neutral-50">
            {[
              { label: 'Brent Crude', color: '#C8A96E' },
              { label: 'Naphtha',     color: '#93B5C6' },
              { label: 'Ethylene',    color: '#4A90D9' },
              { label: 'Ethane',      color: '#5BAD8C' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="w-3 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-neutral-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Insights */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-neutral-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-neutral-900">Latest Insights</h2>
            <Link href="/feedstock-tracker" className="text-xs text-neutral-400 hover:text-neutral-700 font-semibold transition-colors">
              View All
            </Link>
          </div>
          <div className="space-y-0">
            {INSIGHTS.map((ins, i) => (
              <InsightRow key={i} {...ins} />
            ))}
          </div>
        </div>

        {/* DATA INTO CLARITY card */}
        <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-sm min-h-[200px] group">
          <img
            src="/images/golden_silk_ribbon.jpg"
            alt="Data into Clarity"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <p className="text-[9px] tracking-[0.3em] font-mono font-bold text-white/70 uppercase leading-snug">
              DATA<br />INTO<br />CLARITY
            </p>
            <Link href="/ai"
              className="w-9 h-9 rounded-full bg-[#C8A96E] hover:bg-[#B89358] flex items-center justify-center shrink-0 transition-all shadow-md">
              <ChevronRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── FOOTER STRIP ── */}
      <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-white border border-neutral-100 shadow-sm">
        <div className="flex items-center gap-2.5 text-sm text-neutral-600">
          <span className="text-lg">🌱</span>
          <span className="font-medium">Building a cleaner, more resilient tomorrow.</span>
        </div>
        <Link href="/ai"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8A96E] hover:bg-[#B89358] text-white text-xs font-bold transition-all shadow-sm">
          Explore Insights
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}

/* ─── PAGE EXPORT ──────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-5 h-5 text-neutral-300 animate-spin" />
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </AppShell>
  );
}
