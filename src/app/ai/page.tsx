'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AppShell, { useIntelligence } from '@/components/layout/AppShell';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  ShieldCheck,
  BookOpen,
  TrendingUp,
  FileText,
  Lightbulb,
  Target,
  ArrowRight,
  ExternalLink,
  Bell,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Bot,
  BarChart2,
  Cpu,
  ArrowUpRight,
  Minus,
} from 'lucide-react';
import { SynthesizedAnswer } from '@/lib/searchEngine';
import { MARKET_COMMODITIES } from '@/data/knowledgeStore';

interface ConversationItem {
  query: string;
  answer: SynthesizedAnswer;
  provider?: string;
}

const ACTION_CARDS = [
  {
    id: 'analyze',
    icon: FileText,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    title: 'Analyze',
    subtitle: 'Reports & Filings',
    href: '/executive',
  },
  {
    id: 'model',
    icon: BarChart2,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    title: 'Model',
    subtitle: 'Scenarios',
    href: '/scenarios',
  },
  {
    id: 'insights',
    icon: Lightbulb,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
    title: 'Get Insights',
    subtitle: 'Strategic Answers',
    href: '/market',
  },
  {
    id: 'solve',
    icon: Target,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    title: 'Solve',
    subtitle: 'With AI',
    href: '/ai',
  },
];

const MARKET_TICKERS = [
  { label: 'Ethylene (CFR)', value: '$886/t', change: '+1.2%', positive: true, id: 'comm-ethylene' },
  { label: 'Ethane (FOB)', value: '$157/t', change: '+0.8%', positive: true, id: 'comm-ethane' },
  { label: 'Naphtha (CFR)', value: '$816/t', change: '-0.6%', positive: false, id: 'comm-naphtha' },
  { label: 'Brent Crude', value: '$97.42/bbl', change: '+0.4%', positive: true, id: 'comm-brent' },
];

function AICopilotContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const { openAuditModal } = useIntelligence();

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<SynthesizedAnswer | null>(null);
  const [currentProvider, setCurrentProvider] = useState<string>('RIL Intelligence Engine');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('Querying intelligence engine...');
  const [showAnswerPanel, setShowAnswerPanel] = useState(false);

  const handleRunQuery = async (q: string) => {
    if (!q.trim() || isLoading) return;
    const queryText = q.trim();
    setIsLoading(true);
    setShowAnswerPanel(true);
    setLoadingStage('Querying real-time market intelligence & cracker models...');

    try {
      const stageTimer = setTimeout(() => {
        setLoadingStage('Cross-referencing market data and cracker asset records...');
      }, 1500);

      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      clearTimeout(stageTimer);

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();

      if (data && data.answer) {
        const item: ConversationItem = {
          query: queryText,
          answer: data.answer,
          provider: data.provider || 'RIL Intelligence Engine',
        };
        setConversations((prev) => [item, ...prev]);
        setSelectedAnswer(data.answer);
        setCurrentProvider(data.provider || 'RIL Intelligence Engine');
      } else {
        throw new Error('Invalid answer format');
      }
    } catch (err) {
      console.warn('AI copilot request failed:', err);
      const fallback: SynthesizedAnswer = {
        question: queryText,
        answer: 'Could not reach the AI engine. Please verify network connectivity and try again.',
        keyTakeaway: 'AI engine unavailable.',
        category: 'FACT',
        evidence: [],
        numericalData: [],
        assumptions: [],
        uncertainty: 'No model output to assess.',
        relatedAnalysis: [],
        requiredAgents: [],
      };
      const item: ConversationItem = {
        query: queryText,
        answer: fallback,
        provider: 'None (engine unavailable)',
      };
      setConversations((prev) => [item, ...prev]);
      setSelectedAnswer(fallback);
      setCurrentProvider('None (engine unavailable)');
    } finally {
      setIsLoading(false);
      setInputQuery('');
    }
  };

  useEffect(() => {
    if (initialQuery && conversations.length === 0) {
      handleRunQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRunQuery(inputQuery);
  };

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] space-y-4">

      {/* ── Top section: Hero + Market Snapshot side-by-side ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">

        {/* ── Hero Card ── */}
        <div
          className="relative rounded-3xl overflow-hidden min-h-[340px] flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, #f5f0e8 0%, #e8dece 100%)' }}
        >
          {/* Background refinery image with warm overlay */}
          <div className="absolute inset-0">
            <img
              src="/images/refinery-plant.jpg"
              alt="Petrochemical Refinery Complex"
              className="w-full h-full object-cover object-center opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f5f0e8]/95 via-[#f5f0e8]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f5f0e8]/40 via-transparent to-transparent" />
          </div>

          {/* Reliance R watermark */}
          <div className="absolute right-8 bottom-6 opacity-20 pointer-events-none select-none">
            <img
              src="/images/reliance-logo.png"
              alt=""
              className="w-24 h-24 object-contain"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-7 sm:p-9 flex flex-col h-full gap-6">
            {/* Label */}
            <div>
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase text-amber-700/80 font-semibold">
                Reliance Intelligence
              </span>
            </div>

            {/* Headline */}
            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-[1.1] tracking-tight font-serif mb-3">
                From Data<br />to Decisions
              </h1>
              <p className="text-xs sm:text-sm tracking-[0.15em] uppercase text-neutral-600 font-medium">
                Powering a Smarter Tomorrow
              </p>
            </div>

            {/* ── Embedded Chat Input Bar ── */}
            <form onSubmit={handleFormSubmit} className="relative">
              <div className="relative flex items-center">
                <Sparkles className="absolute left-4 w-4 h-4 text-amber-500 shrink-0 z-10" />
                <input
                  id="ai-chat-input"
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ask anything about Reliance..."
                  className="w-full h-13 pl-11 pr-16 rounded-2xl bg-white/90 backdrop-blur-md border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-300 transition-all disabled:opacity-60 font-sans"
                  style={{ height: '52px' }}
                />
                <button
                  type="submit"
                  id="ai-chat-submit"
                  disabled={isLoading || !inputQuery.trim()}
                  className="absolute right-2 w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-white flex items-center justify-center shadow-md shadow-amber-500/25 transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Suggested queries */}
              {!showAnswerPanel && !isLoading && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    'Ethane vs Naphtha EBITDA',
                    '852°C Furnace COT Yield',
                    'Dahej Pipeline Capacity',
                  ].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleRunQuery(q)}
                      className="px-3 py-1.5 rounded-full bg-white/70 hover:bg-white border border-black/[0.06] text-xs text-neutral-600 hover:text-neutral-900 transition-all shadow-xs cursor-pointer backdrop-blur-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* ── Market Snapshot Panel ── */}
        <div className="rounded-3xl bg-white border border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-neutral-900 font-serif">Market Snapshot</h2>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {MARKET_TICKERS.map((ticker) => (
              <div
                key={ticker.id}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-neutral-50 transition-colors group"
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center transition-colors shrink-0">
                  {ticker.id === 'comm-ethylene' && (
                    <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 3v18M18 3v18M6 12h12" />
                    </svg>
                  )}
                  {ticker.id === 'comm-ethane' && (
                    <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="8" />
                      <path d="M12 8v8M8 12h8" />
                    </svg>
                  )}
                  {ticker.id === 'comm-naphtha' && (
                    <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <path d="M4 9h16M9 4v16" />
                    </svg>
                  )}
                  {ticker.id === 'comm-brent' && (
                    <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13s-7-8-7-13a7 7 0 0 1 7-7z" />
                      <circle cx="12" cy="9" r="2" />
                    </svg>
                  )}
                </div>

                {/* Label + value */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-neutral-500 font-medium truncate">{ticker.label}</div>
                  <div className="text-sm font-bold text-neutral-900 mt-0.5">{ticker.value}</div>
                </div>

                {/* Change badge */}
                <div
                  className={`flex items-center gap-0.5 px-2.5 py-1 rounded-xl text-xs font-bold ${
                    ticker.positive
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-red-50 text-red-500'
                  }`}
                >
                  {ticker.positive ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                  {ticker.change}
                </div>
              </div>
            ))}
          </div>

          {/* View full market link */}
          <Link
            href="/market"
            className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors font-medium"
          >
            Full Market Dashboard
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── AI Answer Panel (appears after query) ── */}
      {showAnswerPanel && (
        <div className="rounded-3xl bg-white border border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Loading State */}
          {isLoading && (
            <div className="p-8 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-neutral-800 text-sm">RIL Intelligence Engine Synthesizing...</p>
                <p className="text-xs text-neutral-400 mt-1">{loadingStage}</p>
              </div>
              <div className="w-full max-w-md h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-full animate-pulse w-3/4" />
              </div>
            </div>
          )}

          {/* Answer Content */}
          {selectedAnswer && !isLoading && (
            <div className="p-6 sm:p-8 space-y-5">
              {/* Answer Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-neutral-500 font-medium">Provider:</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {currentProvider}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                      selectedAnswer.category === 'FACT'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : selectedAnswer.category === 'OPTIMIZATION'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : selectedAnswer.category === 'MACRO'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {selectedAnswer.category}
                  </span>
                </div>
                <button
                  onClick={() => openAuditModal('audit-01')}
                  className="text-xs text-neutral-400 hover:text-amber-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Audit Trail
                </button>
              </div>

              {/* Question bubble */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm font-semibold text-neutral-800 flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0 mt-0.5">Q:</span>
                <span>{selectedAnswer.question}</span>
              </div>

              {/* Key Takeaway */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Executive Key Takeaway</span>
                </div>
                <p className="text-sm sm:text-base text-neutral-800 font-medium leading-relaxed">
                  {selectedAnswer.keyTakeaway}
                </p>
              </div>

              {/* Full answer */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Full Intelligence Briefing</p>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                  {selectedAnswer.answer}
                </div>
              </div>

              {/* Numerical data */}
              {selectedAnswer.numericalData && selectedAnswer.numericalData.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Key Metrics</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedAnswer.numericalData.map((nd, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                        <span className="text-xs text-neutral-500 block">{nd.label}</span>
                        <span className="font-bold text-lg text-amber-600 block mt-0.5">{nd.value}</span>
                        <span className="text-[11px] text-neutral-400 block mt-0.5 leading-tight">{nd.context}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {selectedAnswer.evidence && selectedAnswer.evidence.length > 0 && (
                <div className="pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5 mb-3">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Verified Citations ({selectedAnswer.evidence.length})
                    </span>
                  </div>
                  <div className="space-y-2">
                    {selectedAnswer.evidence.map((ev, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                          <span className="text-xs font-bold text-neutral-700 flex items-center gap-1">
                            <FileText className="w-3 h-3 text-emerald-500" />
                            {ev.sourceTitle}
                          </span>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                            {ev.date && <span>{ev.date}</span>}
                            {ev.pageOrLine && ev.pageOrLine.startsWith('http') && (
                              <a href={ev.pageOrLine} target="_blank" rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 underline">
                                Source <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                        <blockquote className="text-xs text-neutral-600 italic border-l-2 border-amber-400 pl-2.5">
                          &ldquo;{ev.quote}&rdquo;
                        </blockquote>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* History */}
              {conversations.length > 1 && (
                <div className="pt-4 border-t border-neutral-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Previous Queries</p>
                  <div className="flex flex-wrap gap-2">
                    {conversations.slice(1).map((c, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedAnswer(c.answer);
                          if (c.provider) setCurrentProvider(c.provider);
                        }}
                        className="px-3 py-1.5 rounded-full border border-neutral-200 bg-neutral-50 hover:bg-white text-xs text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer max-w-[200px] truncate"
                      >
                        {c.query}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 4 Action Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ACTION_CARDS.map((card) => {
          const IconComponent = card.icon;
          const isCurrent = card.id === 'solve';
          return (
            <Link
              key={card.id}
              href={card.href}
              id={`action-card-${card.id}`}
              className="group relative rounded-3xl bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex flex-col gap-4 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
                <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
              </div>

              {/* Label + subtitle */}
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 mb-0.5 font-serif">{card.title}</h3>
                <p className="text-xs text-neutral-500">{card.subtitle}</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-end">
                <div className="w-8 h-8 rounded-full border border-neutral-200 group-hover:border-neutral-300 group-hover:bg-neutral-50 flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                </div>
              </div>

              {/* Active indicator */}
              {isCurrent && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>

      {/* ── Bottom Recommended Queries Strip ── */}
      {!showAnswerPanel && (
        <div className="rounded-3xl bg-white border border-black/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Recommended Queries</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              'What is the EBITDA difference between 100% Ethane and 100% Naphtha cracking?',
              'What is the mass yield of Ethylene at 852°C furnace COT?',
              'What is the capacity limit of the Dahej-Hazira ethane pipeline?',
              'How does a +$10/bbl Brent spike impact RIL cracker EBITDA?',
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleRunQuery(p)}
                disabled={isLoading}
                className="group text-left px-4 py-3.5 rounded-2xl bg-neutral-50 hover:bg-amber-50 border border-neutral-100 hover:border-amber-200 text-xs text-neutral-600 hover:text-amber-800 transition-all cursor-pointer disabled:opacity-50 leading-snug"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-amber-400 mb-1.5 transition-colors" />
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AICopilotPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          </div>
        </div>
      }>
        <AICopilotContent />
      </Suspense>
    </AppShell>
  );
}
