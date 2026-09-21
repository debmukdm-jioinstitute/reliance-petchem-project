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
  ArrowRight
} from 'lucide-react';
import { synthesizeAgentResponse, SynthesizedAnswer } from '@/lib/searchEngine';
import { MARKET_COMMODITIES } from '@/data/knowledgeStore';

function AICopilotContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { openAuditModal } = useIntelligence();

  const [inputQuery, setInputQuery] = useState(initialQuery);
  const [conversations, setConversations] = useState<{ query: string; answer: SynthesizedAnswer }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<SynthesizedAnswer | null>(null);

  // Auto-run initial query from URL
  useEffect(() => {
    if (initialQuery && conversations.length === 0) {
      handleRunQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleRunQuery = (q: string) => {
    if (!q.trim()) return;
    const response = synthesizeAgentResponse(q);
    setConversations((prev) => [...prev, { query: q, answer: response }]);
    setSelectedAnswer(response);
    setInputQuery('');
  };

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
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#BFA161]" />
              Multi-Agent Hybrid Orchestration
            </span>
            <span className="text-[#64748B]">•</span>
            <span className="text-[10px] text-[#94A3B8]">Google + ChatGPT + Bloomberg Search</span>
          </div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">
            AI COPILOT & STRATEGIC REASONING
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openAuditModal('audit-01')}
            className="px-3 py-1.5 rounded-lg bg-[#BFA161]/15 hover:bg-[#BFA161]/25 border border-[#BFA161]/40 text-[#D4BA7B] text-xs font-mono flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#BFA161]" />
            <span>Audit Trail Inspector</span>
          </button>
        </div>
      </div>

      {/* 3-Column Layout: History | Chat Center | Context Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
        {/* Left: Conversation History */}
        <div className="hidden lg:flex lg:col-span-3 flex-col rounded-2xl bg-[#0E1420] border border-[#1A2232] p-4 overflow-hidden">
          <div className="text-[10px] font-mono uppercase text-[#64748B] tracking-wider mb-3">
            Inquiry History ({conversations.length})
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {conversations.length === 0 && (
              <div className="text-xs text-[#64748B] italic p-2">
                No inquiries yet. Select a recommended prompt below.
              </div>
            )}
            {conversations.map((c, i) => (
              <div
                key={i}
                onClick={() => setSelectedAnswer(c.answer)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedAnswer === c.answer
                    ? 'bg-[#151D2C] border-[#BFA161] text-[#F8FAFC]'
                    : 'bg-[#0A0E17] border-[#1E2738] text-[#94A3B8] hover:text-white'
                }`}
              >
                <div className="font-medium line-clamp-2">{c.query}</div>
                <div className="text-[10px] font-mono text-[#BFA161] mt-1">
                  [{c.answer.category}]
                </div>
              </div>
            ))}
          </div>

          {/* Quick Starter Prompts */}
          <div className="pt-3 border-t border-[#1E2738] space-y-1.5">
            <div className="text-[9px] uppercase font-mono text-[#64748B]">Recommended:</div>
            {[
              'What did Rajesh say about switching?',
              'How would a 20% increase in Brent affect cracker economics?',
              'What did Hanoz decide in Meeting 2?'
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleRunQuery(p)}
                className="w-full text-left text-[11px] text-[#94A3B8] hover:text-[#D4BA7B] truncate py-1 block"
              >
                • {p}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Conversation & Structured Answer Feed */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl bg-[#0E1420] border border-[#1A2232] overflow-hidden">
          {/* Answer Output Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {!selectedAnswer && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-xs text-[#64748B] space-y-3">
                <Sparkles className="w-10 h-10 text-[#BFA161]/60" />
                <div className="text-sm font-semibold text-[#CBD5E1]">
                  Reliance O2C Intelligence Synthesis Ready
                </div>
                <p className="max-w-md text-[#94A3B8]">
                  Ask questions across meeting transcripts, feedstock spreads, quantitative forecasts, or dynamic financial scenarios. Answers are backed by line-level citations.
                </p>
              </div>
            )}

            {selectedAnswer && (
              <div className="space-y-4">
                {/* Active Agents Indicator */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono text-[#64748B]">Active Agents:</span>
                    {selectedAnswer.requiredAgents.map((ag) => (
                      <span
                        key={ag}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#162030] text-[#38BDF8] border border-[#242F44]"
                      >
                        {ag}
                      </span>
                    ))}
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      selectedAnswer.category === 'FACT'
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30'
                        : selectedAnswer.category === 'MODEL OUTPUT'
                        ? 'bg-[#BFA161]/20 text-[#D4BA7B] border border-[#BFA161]/30'
                        : 'bg-[#818CF8]/20 text-[#A5B4FC] border border-[#818CF8]/30'
                    }`}
                  >
                    {selectedAnswer.category}
                  </span>
                </div>

                {/* Question */}
                <div className="p-3 rounded-xl bg-[#141B28] border border-[#1E293B] text-xs font-semibold text-[#F8FAFC]">
                  {selectedAnswer.question}
                </div>

                {/* Structured Synthesis */}
                <div className="p-5 rounded-2xl bg-[#0A0E17] border border-[#1A2232] space-y-4 text-xs">
                  {/* Key Takeaway */}
                  <div className="p-3.5 rounded-xl bg-[#101826] border border-[#38BDF8]/30 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#38BDF8] block">
                      Executive Key Takeaway
                    </span>
                    <p className="text-xs text-[#F8FAFC] font-medium leading-relaxed">
                      {selectedAnswer.keyTakeaway}
                    </p>
                  </div>

                  {/* Answer */}
                  <div className="space-y-1 text-xs text-[#CBD5E1] leading-relaxed">
                    <span className="text-[10px] font-mono uppercase text-[#64748B] block font-semibold">
                      Full Intelligence Briefing:
                    </span>
                    <p>{selectedAnswer.answer}</p>
                  </div>

                  {/* Quantitative Data Points */}
                  {selectedAnswer.numericalData.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-mono uppercase text-[#64748B] block font-semibold">
                        Grounded Numerical Data:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedAnswer.numericalData.map((nd, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-[#121824] border border-[#1E2738]">
                            <span className="text-[10px] text-[#94A3B8] block">{nd.label}</span>
                            <span className="font-mono text-sm font-bold text-[#BFA161]">{nd.value}</span>
                            <span className="text-[9px] text-[#64748B] block">{nd.context}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verifiable Evidence */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono uppercase text-[#64748B] block font-semibold">
                      Ground Truth Evidence & Citations:
                    </span>
                    {selectedAnswer.evidence.map((ev, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#121824] border border-[#1E2738] space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#38BDF8]">
                          <span>{ev.sourceTitle}</span>
                          <span className="text-[#64748B]">{ev.pageOrLine}</span>
                        </div>
                        <blockquote className="text-[11px] text-[#CBD5E1] italic border-l-2 border-[#BFA161] pl-2.5">
                          &ldquo;{ev.quote}&rdquo;
                        </blockquote>
                        {ev.speaker && (
                          <div className="text-[10px] font-mono text-[#D4BA7B]">
                            Attributed to: {ev.speaker}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Uncertainty & Assumptions */}
                  <div className="pt-2 border-t border-[#1E2738] flex items-center justify-between text-[11px] text-[#64748B]">
                    <span>Uncertainty: <strong className="text-[#CBD5E1]">{selectedAnswer.uncertainty}</strong></span>
                    {selectedAnswer.auditRecordId && (
                      <button
                        onClick={() => openAuditModal(selectedAnswer.auditRecordId)}
                        className="text-[#D4BA7B] hover:underline font-mono text-xs flex items-center gap-1"
                      >
                        Why did AI say this? →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleFormSubmit} className="p-3 bg-[#0A0E17] border-t border-[#1E2738] flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about meetings, feedstock economics, scenarios, or models..."
              className="flex-1 h-10 px-3.5 rounded-xl bg-[#121824] border border-[#242F44] text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-[#BFA161] focus:outline-none"
            />
            <button
              type="submit"
              className="h-10 px-4 rounded-xl bg-[#BFA161] hover:bg-[#D4BA7B] text-[#080B10] text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right: Live Context Panel (Section 11 requirement) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col rounded-2xl bg-[#0E1420] border border-[#1A2232] p-4 overflow-y-auto space-y-4 text-xs">
          <div className="text-[10px] font-mono uppercase text-[#64748B] tracking-wider pb-2 border-b border-[#1E2738]">
            Active Context Panel
          </div>

          {/* Ingested Source Documents */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#BFA161] font-bold block">
              Ground Truth Sources
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="p-2 rounded bg-[#0A0E17] border border-[#1E2738] text-[#CBD5E1]">
                MoM RIL 6 July 2026 (Rajesh Rawal)
              </div>
              <div className="p-2 rounded bg-[#0A0E17] border border-[#1E2738] text-[#CBD5E1]">
                Meeting 2 Transcript (Hanoz Alignment)
              </div>
              <div className="p-2 rounded bg-[#0A0E17] border border-[#1E2738] text-[#CBD5E1]">
                Group 9 Live Project Proposal
              </div>
              <div className="p-2 rounded bg-[#0A0E17] border border-[#1E2738] text-[#CBD5E1]">
                AI Cracker Industry Document
              </div>
            </div>
          </div>

          {/* Real-time Market Feeds */}
          <div className="space-y-2 pt-2 border-t border-[#1E2738]">
            <span className="text-[10px] font-mono uppercase text-[#10B981] font-bold block">
              Market Benchmarks
            </span>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-[#CBD5E1]">
                <span>Ethylene (CFR):</span>
                <span className="font-bold text-[#F8FAFC]">$840/t</span>
              </div>
              <div className="flex justify-between text-[#CBD5E1]">
                <span>Ethane (FOB):</span>
                <span className="font-bold text-[#10B981]">$145/t</span>
              </div>
              <div className="flex justify-between text-[#CBD5E1]">
                <span>Naphtha (CFR):</span>
                <span className="font-bold text-[#F43F5E]">$685/t</span>
              </div>
              <div className="flex justify-between text-[#CBD5E1]">
                <span>Brent Crude:</span>
                <span className="font-bold text-[#F8FAFC]">$82.40/bbl</span>
              </div>
            </div>
          </div>

          {/* Model Status */}
          <div className="space-y-2 pt-2 border-t border-[#1E2738]">
            <span className="text-[10px] font-mono uppercase text-[#38BDF8] font-bold block">
              Quantitative Architecture
            </span>
            <div className="space-y-1 text-[11px] text-[#94A3B8]">
              <div>• Foundation: Google TimesFM</div>
              <div>• Ensemble: LightGBM + AutoARIMA</div>
              <div>• Embeddings: BAAI/bge-m3 (1024-d)</div>
              <div>• Simulation: 10,000-Run Monte Carlo</div>
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
      <Suspense fallback={<div className="text-xs text-[#94A3B8] p-6">Loading AI Copilot...</div>}>
        <AICopilotContent />
      </Suspense>
    </AppShell>
  );
}
