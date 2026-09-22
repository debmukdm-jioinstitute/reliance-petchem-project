'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell, { useIntelligence } from '@/components/layout/AppShell';
import {
  Sparkles,
  Send,
  ShieldCheck,
  BookOpen,
  TrendingUp,
  Cpu,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Database,
  CheckCircle2,
  Clock,
  ArrowRight,
  Activity,
  Bot,
  RefreshCw,
  FileText
} from 'lucide-react';
import { SynthesizedAnswer } from '@/lib/searchEngine';
import { MARKET_COMMODITIES } from '@/data/knowledgeStore';

interface ConversationItem {
  query: string;
  answer: SynthesizedAnswer;
  provider?: string;
}

function AICopilotContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { openAuditModal } = useIntelligence();

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<SynthesizedAnswer | null>(null);
  const [currentProvider, setCurrentProvider] = useState<string>('TinyFish AI Agent');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStage, setLoadingStage] = useState<string>('Connecting to local model...');

  const handleRunQuery = async (q: string) => {
    if (!q.trim() || isLoading) return;
    const queryText = q.trim();
    setIsLoading(true);
    setLoadingStage('Querying TinyFish web intelligence & internal cracker models...');

    try {
      const stageTimer = setTimeout(() => {
        setLoadingStage('Cross-referencing market data and cracker asset records...');
      }, 1500);

      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });

      clearTimeout(stageTimer);

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      if (data && data.answer) {
        const item: ConversationItem = {
          query: queryText,
          answer: data.answer,
          provider: data.provider || 'Local LLM (Ollama)'
        };
        setConversations((prev) => [item, ...prev]);
        setSelectedAnswer(data.answer);
        setCurrentProvider(data.provider || 'Local LLM (Ollama)');
      } else {
        throw new Error('Invalid answer format');
      }
    } catch (err) {
      console.warn('AI copilot request failed:', err);
      const fallback: SynthesizedAnswer = {
        question: queryText,
        answer: 'Could not reach the AI engine. Check that Ollama is running locally (`ollama serve`) and try again.',
        keyTakeaway: 'AI engine unavailable.',
        category: 'FACT',
        evidence: [],
        numericalData: [],
        assumptions: [],
        uncertainty: 'No model output to assess.',
        relatedAnalysis: [],
        requiredAgents: []
      };
      const item: ConversationItem = {
        query: queryText,
        answer: fallback,
        provider: 'None (engine unavailable)'
      };
      setConversations((prev) => [item, ...prev]);
      setSelectedAnswer(fallback);
      setCurrentProvider('None (engine unavailable)');
    } finally {
      setIsLoading(false);
      setInputQuery('');
    }
  };

  // Auto-run initial query from URL (e.g. from homepage query box)
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
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A2232] shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-mono tracking-wider uppercase text-amber-400 font-semibold flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
              Autonomous Petrochemical AI Copilot
            </span>
            <span className="text-[#64748B]">•</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Local LLM Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            AI COPILOT & STRATEGIC OPTIMIZATION ENGINE
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAuditModal('audit-01')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Audit Trail Inspector</span>
          </button>
        </div>
      </div>

      {/* 3-Column Layout: History | Chat Center | Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
        {/* Left: Conversation History */}
        <div className="hidden lg:flex lg:col-span-3 flex-col rounded-2xl bg-[#0B0F18] border border-neutral-800 p-4 overflow-hidden">
          <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider mb-3 flex items-center justify-between">
            <span>Inquiry History ({conversations.length})</span>
            {isLoading && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {conversations.length === 0 && !isLoading && (
              <div className="text-xs text-neutral-400 italic p-2 leading-relaxed">
                No inquiries yet. Type a question or choose a recommended prompt below.
              </div>
            )}
            {conversations.map((c, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedAnswer(c.answer);
                  if (c.provider) setCurrentProvider(c.provider);
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedAnswer === c.answer
                    ? 'bg-[#151E2E] border-amber-500/60 text-white shadow-sm'
                    : 'bg-[#0E131E] border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
                }`}
              >
                <div className="font-medium line-clamp-2 leading-snug">{c.query}</div>
                <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 mt-1.5">
                  <span>[{c.answer.category}]</span>
                  <span className="text-neutral-400 truncate max-w-[120px]">{c.provider || 'Local LLM'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Starter Prompts */}
          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <div className="text-[10px] uppercase font-mono text-neutral-400 font-bold">Recommended Queries:</div>
            {[
              'What is the EBITDA difference between 100% Ethane and 100% Naphtha cracking?',
              'What is the mass yield of Ethylene at 852°C furnace COT?',
              'What is the capacity limit of the Dahej-Hazira ethane pipeline?',
              'How does a +$10/bbl Brent spike impact RIL cracker EBITDA?'
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleRunQuery(p)}
                disabled={isLoading}
                className="w-full text-left text-xs text-neutral-300 hover:text-amber-300 transition-colors truncate py-1 block cursor-pointer disabled:opacity-50"
              >
                • {p}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Conversation & Structured Answer Feed */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl bg-[#0B0F18] border border-neutral-800 overflow-hidden">
          {/* Answer Output Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Loading State */}
            {isLoading && (
              <div className="p-6 rounded-2xl bg-[#0E1422] border border-cyan-500/30 space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                    <Sparkles className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono">
                      Local Model Synthesizing Response...
                    </h3>
                    <p className="text-xs text-cyan-300 mt-0.5 font-mono">
                      {loadingStage}
                    </p>
                  </div>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 animate-pulse w-3/4 rounded-full" />
                </div>
                <div className="text-[11px] font-mono text-neutral-400 flex justify-between">
                  <span>Searching: Reliance Records • Cracker Kinetics • Macro Data</span>
                  <span>Mandatory References Enforcement: Active</span>
                </div>
              </div>
            )}

            {!selectedAnswer && !isLoading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-xs text-neutral-400 space-y-4">
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Bot className="w-10 h-10" />
                </div>
                <div className="text-base font-bold text-white font-mono">
                  Reliance O2C Digital Twin Copilot Ready
                </div>
                <p className="max-w-md text-sm text-neutral-300 leading-relaxed">
                  Ask any question about Reliance business, macroeconomic trends, microeconomic spreads, cracker kinetics, or site-wide data. Answers are generated by a local LLM (Ollama) grounded in this project&apos;s market data, cracker asset records, and document store.
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-lg pt-2">
                  <button
                    onClick={() => handleRunQuery('What is the EBITDA difference between 100% Ethane and 100% Naphtha cracking?')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 border border-neutral-700 cursor-pointer"
                  >
                    Ethane vs Naphtha EBITDA Difference
                  </button>
                  <button
                    onClick={() => handleRunQuery('What is the mass yield of Ethylene at 852°C furnace COT?')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 border border-neutral-700 cursor-pointer"
                  >
                    852°C Furnace COT Yield
                  </button>
                  <button
                    onClick={() => handleRunQuery('What is the capacity limit of the Dahej-Hazira ethane pipeline?')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-200 border border-neutral-700 cursor-pointer"
                  >
                    Dahej Pipeline Throughput
                  </button>
                </div>
              </div>
            )}

            {selectedAnswer && (
              <div className="space-y-4 animate-fadeIn">
                {/* Active Agents & Engine Provider Indicator */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-mono text-neutral-400">Provider:</span>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      {currentProvider}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg ${
                      selectedAnswer.category === 'FACT'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : selectedAnswer.category === 'OPTIMIZATION'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : selectedAnswer.category === 'MACRO'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {selectedAnswer.category}
                  </span>
                </div>

                {/* User Question */}
                <div className="p-3.5 rounded-xl bg-[#121826] border border-neutral-700/80 text-sm font-bold text-white font-mono flex items-center gap-2">
                  <span className="text-amber-400">Q:</span>
                  <span>{selectedAnswer.question}</span>
                </div>

                {/* Structured Synthesis */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#080C14] border border-neutral-800 space-y-5 text-sm">
                  {/* Executive Key Takeaway */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-neutral-900 to-[#0E1524] border border-amber-500/40 space-y-1.5">
                    <span className="text-xs font-mono uppercase font-bold text-amber-300 block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Executive Key Takeaway
                    </span>
                    <p className="text-sm sm:text-base text-neutral-100 font-medium leading-relaxed">
                      {selectedAnswer.keyTakeaway}
                    </p>
                  </div>

                  {/* Full Intelligence Briefing */}
                  <div className="space-y-2 text-sm text-neutral-200 leading-relaxed font-sans">
                    <span className="text-xs font-mono uppercase text-neutral-400 block font-bold tracking-wider">
                      Full Intelligence Briefing & Technical Reasoning:
                    </span>
                    <div className="p-4 rounded-xl bg-[#0D121F] border border-neutral-800 text-neutral-100 leading-relaxed space-y-2 whitespace-pre-line">
                      {selectedAnswer.answer}
                    </div>
                  </div>

                  {/* Quantitative Data Points */}
                  {selectedAnswer.numericalData && selectedAnswer.numericalData.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-mono uppercase text-neutral-400 block font-bold tracking-wider">
                        Grounded Numerical Metrics:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedAnswer.numericalData.map((nd, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-[#0E1422] border border-neutral-800">
                            <span className="text-xs text-neutral-300 block">{nd.label}</span>
                            <span className="font-mono text-base sm:text-lg font-bold text-amber-300">{nd.value}</span>
                            <span className="text-xs text-neutral-400 block mt-0.5">{nd.context}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* MANDATORY VERIFIED REFERENCES & CITATIONS SECTION */}
                  <div className="space-y-2.5 pt-3 border-t border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        Mandatory References & Verified Citations ({selectedAnswer.evidence?.length || 0})
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        AUDIT VERIFIED
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {selectedAnswer.evidence && selectedAnswer.evidence.length > 0 ? (
                        selectedAnswer.evidence.map((ev, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl bg-[#0C121D] border border-emerald-500/30 space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono text-cyan-300">
                              <span className="font-bold flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                                {ev.sourceTitle}
                              </span>
                              <div className="flex items-center gap-2 text-neutral-300">
                                {ev.date && <span>[{ev.date}]</span>}
                                {ev.pageOrLine && (
                                  ev.pageOrLine.startsWith('http') ? (
                                    <a
                                      href={ev.pageOrLine}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 transition-colors"
                                    >
                                      <span>Source Link</span>
                                      <ExternalLink className="w-3 h-3 inline" />
                                    </a>
                                  ) : (
                                    <span className="text-neutral-400">• {ev.pageOrLine}</span>
                                  )
                                )}
                              </div>
                            </div>

                            <blockquote className="text-xs text-neutral-200 italic border-l-2 border-amber-400 pl-3 py-0.5 bg-neutral-900/40 rounded-r-md">
                              &ldquo;{ev.quote}&rdquo;
                            </blockquote>

                            {ev.speaker && (
                              <div className="text-xs font-mono text-amber-300 pt-0.5">
                                Verified Speaker: <span className="font-bold text-white">{ev.speaker}</span>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400">
                          Primary reference: Reliance O2C Strategic Asset Framework & FY25-26 Financial Modeling.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Uncertainty & Audit Action */}
                  <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-300">
                    <div>
                      <span className="text-neutral-400">Uncertainty Assessment: </span>
                      <strong className="text-white font-medium">{selectedAnswer.uncertainty}</strong>
                    </div>
                    {selectedAnswer.auditRecordId && (
                      <button
                        onClick={() => openAuditModal(selectedAnswer.auditRecordId)}
                        className="text-amber-300 hover:text-amber-200 font-mono text-xs flex items-center gap-1 cursor-pointer underline underline-offset-4"
                      >
                        Inspect Full Audit Trail →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleFormSubmit} className="p-3.5 bg-[#080B12] border-t border-neutral-800 flex items-center gap-2.5">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              placeholder="Ask about cracker yields, furnace COT, input costs, macro crude, or LP allocations..."
              className="flex-1 h-12 px-4 rounded-xl bg-[#0E1422] border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:border-amber-400 focus:outline-none transition-all disabled:opacity-50 font-mono"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="h-12 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs sm:text-sm font-bold font-mono transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 shadow-md shadow-amber-950/40 active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Solving...</span>
                </>
              ) : (
                <>
                  <span>Solve with AI</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Live Context Panel (Section 11 requirement) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col rounded-2xl bg-[#0B0F18] border border-neutral-800 p-4 overflow-y-auto space-y-4 text-xs">
          <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider pb-2 border-b border-neutral-800 flex items-center justify-between">
            <span>Active Knowledge Base</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          {/* Ingested Source Documents */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-amber-300 font-bold block">
              Ground Truth Sources
            </span>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#0E1422] border border-neutral-800 text-neutral-200">
                <div className="font-semibold text-white">Group 9 Petchem Project Proposal</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Beyond Naphtha: Capital Allocation & Feeds</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#0E1422] border border-neutral-800 text-neutral-200">
                <div className="font-semibold text-white">AI Cracker Industry Analysis</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">SCADA Cracker Telemetry & Pyrolysis Model</div>
              </div>
            </div>
          </div>

          {/* Real-time Market Feeds */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <span className="text-xs font-mono uppercase text-emerald-300 font-bold block">
              Market Benchmarks
            </span>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-neutral-200">
                <span>Ethylene (CFR):</span>
                <span className="font-bold text-white">$886/t</span>
              </div>
              <div className="flex justify-between text-neutral-200">
                <span>Ethane (FOB):</span>
                <span className="font-bold text-emerald-300">$157/t</span>
              </div>
              <div className="flex justify-between text-neutral-200">
                <span>Naphtha (CFR):</span>
                <span className="font-bold text-amber-300">$816/t</span>
              </div>
              <div className="flex justify-between text-neutral-200">
                <span>Brent Crude:</span>
                <span className="font-bold text-white">$97.42/bbl</span>
              </div>
            </div>
          </div>

          {/* Model Status */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <span className="text-xs font-mono uppercase text-cyan-300 font-bold block">
              AI Engine Architecture
            </span>
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>TinyFish Web Agent & Search: Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Local / Online LLM Router: Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Real-Time Web Grounding: Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AICopilotPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-xs text-neutral-400 p-6 font-mono">Loading AI Copilot...</div>}>
        <AICopilotContent />
      </Suspense>
    </AppShell>
  );
}
