'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell, { useIntelligence } from '@/components/layout/AppShell';
import {
  Sparkles, Send, ShieldCheck, BookOpen, Bot, RefreshCw,
  FileText, Globe, Zap, MessageSquare, Trash2, Copy, CheckCheck,
  ChevronRight, TrendingUp, Activity, Database, CheckCircle2,
  Plus, Search, X,
} from 'lucide-react';
import { SynthesizedAnswer } from '@/lib/searchEngine';

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  synthesized?: SynthesizedAnswer;
  provider?: string;
  webSearchUsed?: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ZERO-DEP MARKDOWN RENDERER
───────────────────────────────────────────────────────────────────────────── */
function MarkdownContent({ content }: { content: string }) {
  const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[([^\]]+)\]\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
        return <em key={i} className="text-neutral-300 italic">{part.slice(1, -1)}</em>;
      if (part.startsWith('`') && part.endsWith('`'))
        return <code key={i} className="px-1.5 py-0.5 rounded bg-neutral-800 text-amber-300 text-xs font-mono">{part.slice(1, -1)}</code>;
      const lm = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (lm) return <a key={i} href={lm[2]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300">{lm[1]}</a>;
      return part;
    });
  };

  const lines = content.split('\n');
  const rendered: React.ReactNode[] = [];
  let tableBuffer: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    // Headers
    if (line.startsWith('### ')) { rendered.push(<h3 key={idx} className="text-sm font-bold text-white mt-4 mb-1.5">{renderInline(line.slice(4))}</h3>); return; }
    if (line.startsWith('## ')) { rendered.push(<h2 key={idx} className="text-sm font-bold text-amber-300 mt-4 mb-1.5 border-b border-amber-500/20 pb-1">{renderInline(line.slice(3))}</h2>); return; }
    if (line.startsWith('# ')) { rendered.push(<h1 key={idx} className="text-base font-bold text-white mt-4 mb-2">{renderInline(line.slice(2))}</h1>); return; }
    // Bullets
    if (/^[-•*]\s/.test(line)) { rendered.push(<li key={idx} className="text-sm text-neutral-200 leading-relaxed ml-3 list-disc list-inside">{renderInline(line.replace(/^[-•*]\s/, ''))}</li>); return; }
    if (/^\d+\.\s/.test(line)) { rendered.push(<li key={idx} className="text-sm text-neutral-200 leading-relaxed ml-3 list-decimal list-inside">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>); return; }
    // HR
    if (/^---+$/.test(line.trim())) { rendered.push(<hr key={idx} className="border-neutral-700 my-3" />); return; }
    // Empty
    if (!line.trim()) { rendered.push(<div key={idx} className="h-1.5" />); return; }
    // Table
    if (line.includes('|')) {
      const cells = line.split('|').filter(Boolean).map(c => c.trim());
      const isSep = cells.every(c => /^[-:]+$/.test(c));
      if (!isSep) tableBuffer.push(<tr key={idx} className="border-b border-neutral-800">{cells.map((cell, ci) => <td key={ci} className="px-3 py-1.5 text-xs text-neutral-200 font-mono">{renderInline(cell)}</td>)}</tr>);
      if (idx === lines.length - 1 && tableBuffer.length > 0) {
        rendered.push(<div key={`table-${idx}`} className="my-3 overflow-x-auto rounded-xl border border-neutral-700"><table className="w-full text-xs"><tbody>{tableBuffer}</tbody></table></div>);
        tableBuffer = [];
      }
      return;
    }
    // Flush pending table
    if (tableBuffer.length > 0) {
      rendered.push(<div key={`table-flush-${idx}`} className="my-3 overflow-x-auto rounded-xl border border-neutral-700"><table className="w-full text-xs"><tbody>{tableBuffer}</tbody></table></div>);
      tableBuffer = [];
    }
    rendered.push(<p key={idx} className="text-sm text-neutral-200 leading-relaxed">{renderInline(line)}</p>);
  });

  return <div className="space-y-1.5">{rendered}</div>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   COPY BUTTON
───────────────────────────────────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-500 hover:text-neutral-200 transition-all" title="Copy">
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STREAMING DOTS
───────────────────────────────────────────────────────────────────────────── */
function StreamingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-1 h-1 rounded-full bg-amber-400" style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUGGESTED PROMPTS
───────────────────────────────────────────────────────────────────────────── */
const SUGGESTED = [
  { label: 'Ethane vs Naphtha EBITDA', query: 'What is the EBITDA difference between 100% Ethane and 100% Naphtha cracking at RIL Dahej?' },
  { label: 'Brent +$10 impact on RIL', query: 'How does a +$10/bbl Brent crude spike impact RIL O2C cracker EBITDA and crack spreads?' },
  { label: 'RIL cracks vs peers', query: 'Compare RIL O2C cracker margins vs ExxonMobil, SABIC and Dow Chemical globally' },
  { label: 'Dahej pipeline capacity', query: 'What is the throughput capacity of the Dahej-Hazira ethane pipeline and current utilization?' },
  { label: '852°C furnace COT yield', query: 'What is the mass yield of Ethylene at 852°C furnace Coil Outlet Temperature?' },
  { label: 'US ethane outlook 2026', query: 'What is the 2025–26 outlook for US Mont Belvieu ethane prices and impact on RIL feedstock cost?' },
  { label: 'How does Groq work?', query: 'Explain how Groq LPU inference works and why it is significantly faster than GPU-based inference' },
  { label: 'Global oil demand 2026', query: 'What are the key drivers of global crude oil demand in 2026 and the IEA/EIA demand outlook?' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
function AICopilotContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const { openAuditModal } = useIntelligence();

  const [inputQuery, setInputQuery]     = useState(initialQuery);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 'default', title: 'New Conversation', messages: [], createdAt: new Date() },
  ]);
  const [activeConvId, setActiveConvId] = useState('default');
  const [isLoading, setIsLoading]       = useState(false);
  const [loadingStage, setLoadingStage] = useState('Connecting to Groq...');
  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions]   = useState(true);
  const [searchFilter, setSearchFilter]         = useState('');

  const messagesEndRef   = useRef<HTMLDivElement>(null);
  const inputRef         = useRef<HTMLTextAreaElement>(null);
  const abortRef         = useRef<AbortController | null>(null);

  const activeConv  = conversations.find((c) => c.id === activeConvId)!;
  const activeMessages = activeConv?.messages ?? [];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeMessages.length]);
  useEffect(() => { if (activeMessages.length > 0) setShowSuggestions(false); }, [activeMessages.length]);

  const genId = () => Math.random().toString(36).slice(2, 11);

  const updateConv = useCallback((id: string, updater: (c: Conversation) => Conversation) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  }, []);

  /* ── Run a query ── */
  const handleRunQuery = useCallback(
    async (q: string) => {
      if (!q.trim() || isLoading) return;
      const queryText = q.trim();
      setIsLoading(true);
      setShowSuggestions(false);
      setInputQuery('');

      const history = activeMessages.slice(-10).map((m) => ({ role: m.role, content: m.content }));

      const userMsgId  = genId();
      const asstMsgId  = genId();
      const userMsg: Message  = { id: userMsgId,  role: 'user',      content: queryText, timestamp: new Date() };
      const placeholder: Message = { id: asstMsgId, role: 'assistant', content: '', timestamp: new Date(), isStreaming: true };

      updateConv(activeConvId, (c) => ({
        ...c,
        title: c.messages.length === 0 ? queryText.slice(0, 55) : c.title,
        messages: [...c.messages, userMsg, placeholder],
      }));

      // Loading stage cycle
      const stages = [
        'Firing TinyFish web search & Groq in parallel...',
        'Searching live web with TinyFish...',
        'Groq compound-beta synthesizing answer...',
        'Weaving web intel + RIL asset data...',
      ];
      let si = 0;
      setLoadingStage(stages[0]);
      const stageTimer = setInterval(() => { si = Math.min(si + 1, stages.length - 1); setLoadingStage(stages[si]); }, 1800);

      abortRef.current = new AbortController();

      try {
        const res = await fetch('/api/ai/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: queryText, history, stream: true }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) throw new Error(`Server ${res.status}`);
        if (!res.body) throw new Error('No body');

        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let streamed  = '';
        let final: { answer?: SynthesizedAnswer; provider?: string; webSearchUsed?: boolean } = {};

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const lines = decoder.decode(value, { stream: true }).split('\n');
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
              const evt = JSON.parse(line.slice(6));
              if (evt.type === 'delta') {
                streamed += evt.content;
                updateConv(activeConvId, (c) => ({
                  ...c,
                  messages: c.messages.map((m) => m.id === asstMsgId ? { ...m, content: streamed } : m),
                }));
              } else if (evt.type === 'done') {
                final = evt;
              }
            } catch { /* skip malformed */ }
          }
        }

        updateConv(activeConvId, (c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === asstMsgId
              ? { ...m, content: streamed || final?.answer?.answer || 'No response.', synthesized: final?.answer, provider: final?.provider, webSearchUsed: final?.webSearchUsed, isStreaming: false }
              : m
          ),
        }));
      } catch (err: unknown) {
        const isAbort = err instanceof Error && err.name === 'AbortError';
        updateConv(activeConvId, (c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === asstMsgId
              ? { ...m, content: isAbort ? m.content : `**Error:** ${err instanceof Error ? err.message : 'Unknown error'}`, isStreaming: false }
              : m
          ),
        }));
      } finally {
        clearInterval(stageTimer);
        setIsLoading(false);
        abortRef.current = null;
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [activeConvId, activeMessages, isLoading, updateConv]
  );

  // Auto-run URL query
  useEffect(() => {
    if (initialQuery && activeMessages.length === 0) handleRunQuery(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const newConversation = () => {
    const c: Conversation = { id: genId(), title: 'New Conversation', messages: [], createdAt: new Date() };
    setConversations((prev) => [c, ...prev]);
    setActiveConvId(c.id);
    setShowSuggestions(true);
    setInputQuery('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const deleteConversation = (id: string) => {
    if (conversations.length === 1) { newConversation(); return; }
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) setActiveConvId(conversations.find((c) => c.id !== id)!.id);
  };

  const filteredConvs = conversations.filter((c) =>
    searchFilter ? c.title.toLowerCase().includes(searchFilter.toLowerCase()) : true
  );

  /* ─────────────────────────────── RENDER ─────────────────────────────────── */
  return (
    <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] gap-3">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A2232] shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              Groq + TinyFish Intelligence Copilot
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              compound-beta · live web search · any topic
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
            AI COPILOT STUDIO — POWERED BY GROQ
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono">
            <Globe className="w-3.5 h-3.5" /> TinyFish Web ON
          </span>
          <button onClick={() => openAuditModal('audit-01')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Audit Trail
          </button>
        </div>
      </div>

      {/* ── 3-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 overflow-hidden min-h-0">

        {/* ── LEFT: Conversations ── */}
        <div className="hidden lg:flex lg:col-span-3 flex-col rounded-2xl bg-[#0B0F18] border border-neutral-800 overflow-hidden">
          <div className="p-3 border-b border-neutral-800 space-y-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search conversations..." className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-[#0E1422] border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:border-amber-400/50 focus:outline-none transition-all" />
            </div>
            <button onClick={newConversation} className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono transition-all cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> New Conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredConvs.map((conv) => (
              <div key={conv.id} onClick={() => setActiveConvId(conv.id)}
                className={`group relative p-3 rounded-xl border text-xs cursor-pointer transition-all ${activeConvId === conv.id ? 'bg-[#151E2E] border-amber-500/60 text-white' : 'bg-[#0E131E] border-neutral-800/50 text-neutral-400 hover:text-white hover:border-neutral-700'}`}>
                <div className="font-medium line-clamp-2 pr-6">
                  <MessageSquare className="inline w-3 h-3 mr-1.5 opacity-60" />{conv.title}
                </div>
                <div className="text-[10px] font-mono text-neutral-500 mt-1">
                  {conv.messages.length} msgs · {conv.createdAt.toLocaleDateString()}
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                  className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-neutral-500 hover:text-red-400 transition-all">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick prompts */}
          <div className="p-3 border-t border-neutral-800 space-y-1.5 shrink-0">
            <div className="text-[10px] uppercase font-mono text-neutral-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" /> Quick Prompts
            </div>
            {SUGGESTED.slice(0, 5).map((p, i) => (
              <button key={i} onClick={() => handleRunQuery(p.query)} disabled={isLoading}
                className="w-full text-left text-[11px] text-neutral-400 hover:text-amber-300 transition-colors py-1 block cursor-pointer disabled:opacity-40 truncate">
                <ChevronRight className="inline w-3 h-3 mr-1 opacity-50" />{p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTER: Chat ── */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl bg-[#0B0F18] border border-neutral-800 overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scroll-smooth" id="chat-messages">

            {/* Empty state */}
            {activeMessages.length === 0 && showSuggestions && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-5 py-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 blur-xl" />
                  <div className="relative p-5 rounded-2xl bg-[#0E1422] border border-neutral-700">
                    <Bot className="w-12 h-12 text-amber-400 mx-auto" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-mono">Groq × TinyFish Copilot</h2>
                  <p className="text-sm text-neutral-400 max-w-xs mt-2 leading-relaxed">
                    <span className="text-amber-300 font-mono">compound-beta</span> + live TinyFish web search. Ask <strong className="text-white">anything</strong> — petchem, finance, science, tech, geopolitics.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                  {SUGGESTED.map((p, i) => (
                    <button key={i} onClick={() => handleRunQuery(p.query)}
                      className="px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 hover:border-amber-500/40 text-xs text-neutral-300 hover:text-white text-left transition-all cursor-pointer leading-snug">
                      <span className="text-amber-400 mr-1">→</span>{p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading skeleton (before stream starts) */}
            {isLoading && activeMessages.some((m) => m.isStreaming && m.content === '') && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-4 rounded-2xl bg-[#0E1422] border border-cyan-500/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 shrink-0">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-mono">Groq + TinyFish at work...</div>
                      <div className="text-xs text-cyan-300 mt-0.5 font-mono">{loadingStage}</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 rounded-full w-full animate-pulse" />
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 flex gap-4">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> TinyFish web running</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Groq compound-beta</span>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {activeMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[80%] group">
                    <div className="px-4 py-3 rounded-2xl rounded-tr-md bg-gradient-to-br from-amber-600/80 to-amber-500/60 border border-amber-500/40 text-sm text-white font-medium shadow-lg">
                      {msg.content}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono mt-1 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[92%] w-full group">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 rounded-xl bg-gradient-to-br from-cyan-500/30 to-violet-500/30 border border-cyan-500/30 shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Provider badges */}
                        {msg.provider && (
                          <div className="flex items-center flex-wrap gap-1.5 mb-2">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/30 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5" />{msg.provider}
                            </span>
                            {msg.webSearchUsed && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                                <Globe className="w-2.5 h-2.5" />TinyFish live web
                              </span>
                            )}
                          </div>
                        )}

                        {/* Content */}
                        <div className={`p-4 sm:p-5 rounded-2xl rounded-tl-md bg-[#080C14] border transition-all ${msg.isStreaming ? 'border-cyan-500/30' : 'border-neutral-800'}`}>
                          {msg.content
                            ? <MarkdownContent content={msg.content} />
                            : <div className="text-sm text-neutral-400 italic">Generating<StreamingDots /></div>
                          }
                          {msg.isStreaming && msg.content && <StreamingDots />}
                        </div>

                        {/* Footer */}
                        {!msg.isStreaming && msg.content && (
                          <div className="flex items-center justify-between mt-1.5 px-1">
                            <div className="text-[10px] text-neutral-500 font-mono">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <CopyButton text={msg.content} />
                              {msg.synthesized?.evidence && msg.synthesized.evidence.length > 0 && (
                                <button onClick={() => setExpandedEvidence(expandedEvidence === msg.id ? null : msg.id)}
                                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-neutral-700 text-neutral-500 hover:text-emerald-400 text-[10px] font-mono transition-all">
                                  <BookOpen className="w-3 h-3" />
                                  {msg.synthesized.evidence.length} refs
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Evidence accordion */}
                        {expandedEvidence === msg.id && msg.synthesized?.evidence && (
                          <div className="mt-2 space-y-2">
                            {msg.synthesized.evidence.map((ev, i) => (
                              <div key={i} className="p-3 rounded-xl bg-[#0C121D] border border-emerald-500/20 space-y-1.5">
                                <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-300">
                                  <FileText className="w-3 h-3 shrink-0" />
                                  <span className="font-bold">{ev.sourceTitle}</span>
                                  {ev.date && <span className="text-neutral-500">[{ev.date}]</span>}
                                </div>
                                <blockquote className="text-[11px] text-neutral-300 italic border-l-2 border-amber-400 pl-2 line-clamp-3">
                                  &ldquo;{ev.quote}&rdquo;
                                </blockquote>
                                {ev.pageOrLine?.startsWith('http') && (
                                  <a href={ev.pageOrLine} target="_blank" rel="noopener noreferrer"
                                    className="text-[10px] text-cyan-400 hover:underline truncate block">
                                    {ev.pageOrLine}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Numerical chips */}
                        {!msg.isStreaming && msg.synthesized?.numericalData && msg.synthesized.numericalData.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {msg.synthesized.numericalData.slice(0, 4).map((nd, i) => (
                              <div key={i} className="px-2.5 py-1.5 rounded-lg bg-[#0E1422] border border-neutral-800 text-[10px] font-mono">
                                <span className="text-neutral-400">{nd.label}: </span>
                                <span className="text-amber-300 font-bold">{nd.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-neutral-800 bg-[#080B12] p-3 sm:p-4 shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleRunQuery(inputQuery); }} className="flex items-end gap-2.5">
              <div className="flex-1 relative">
                <textarea ref={inputRef} value={inputQuery} onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRunQuery(inputQuery); } }}
                  disabled={isLoading} rows={1}
                  placeholder="Ask anything — petchem, macro, finance, science, strategy... (Enter to send, Shift+Enter for newline)"
                  className="w-full px-4 py-3 rounded-xl bg-[#0E1422] border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:border-amber-400/60 focus:outline-none transition-all disabled:opacity-50 font-mono resize-none leading-relaxed"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 120) + 'px'; }}
                />
              </div>
              {isLoading ? (
                <button type="button" onClick={() => abortRef.current?.abort()}
                  className="h-12 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 text-xs font-mono flex items-center gap-2 shrink-0 cursor-pointer">
                  <X className="w-4 h-4" /> Stop
                </button>
              ) : (
                <button type="submit" disabled={!inputQuery.trim()}
                  className="h-12 px-5 rounded-xl bg-gradient-to-br from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 text-xs sm:text-sm font-bold font-mono flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg active:scale-95 transition-all">
                  Ask Groq <Send className="w-4 h-4" />
                </button>
              )}
            </form>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <span className="text-[10px] text-neutral-600 font-mono">
                Groq compound-beta · TinyFish web search · streaming SSE · any topic
              </span>
              {activeMessages.length > 0 && (
                <span className="text-[10px] text-neutral-600 font-mono">
                  {activeMessages.filter((m) => m.role === 'user').length} queries · session
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Context Panel ── */}
        <div className="hidden lg:flex lg:col-span-3 flex-col rounded-2xl bg-[#0B0F18] border border-neutral-800 p-4 overflow-y-auto space-y-4 text-xs">
          <div className="text-xs font-mono uppercase text-neutral-400 tracking-wider pb-2 border-b border-neutral-800 flex items-center justify-between shrink-0">
            <span>Intelligence Stack</span>
            <Database className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          {/* AI Engine Stack */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">AI Engine Stack</span>
            <div className="space-y-1.5">
              {[
                { name: 'Groq compound-beta', sub: 'Primary · built-in web search', color: 'border-violet-500/30', dot: 'text-violet-400' },
                { name: 'llama-3.3-70b-versatile', sub: 'Fallback · deep reasoning', color: 'border-cyan-500/20', dot: 'text-cyan-400' },
                { name: 'TinyFish Search', sub: 'Live web intel · LRU cached', color: 'border-emerald-500/20', dot: 'text-emerald-400' },
                { name: 'Internal RAG', sub: 'RIL docs · hybrid search', color: 'border-amber-500/20', dot: 'text-amber-400' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2 p-2 rounded-lg bg-[#0E1422] border ${item.color}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${item.dot} shrink-0`} />
                  <div>
                    <div className="text-white font-mono font-bold text-[10px]">{item.name}</div>
                    <div className="text-neutral-400 text-[9px]">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document store */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <span className="text-[10px] font-mono uppercase text-amber-300 font-bold">Document Store</span>
            {[
              ['Group 9 Petchem Proposal', 'Beyond Naphtha · Capital Allocation'],
              ['AI Cracker Industry Analysis', 'SCADA Pyrolysis Model · Telemetry'],
              ['RIL FY26 Financial Model', 'O2C EBITDA · NPV · IRR'],
            ].map(([title, sub], i) => (
              <div key={i} className="p-2.5 rounded-xl bg-[#0E1422] border border-neutral-800">
                <div className="font-semibold text-white text-[10px]">{title}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* Market snapshot */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Market Benchmarks
            </span>
            <div className="space-y-1 font-mono text-[10px]">
              {[
                { label: 'Ethylene (CFR)',  value: '$886/t',     color: 'text-white' },
                { label: 'Ethane (FOB)',    value: '$157/t',     color: 'text-emerald-300' },
                { label: 'Naphtha (CFR)',   value: '$816/t',     color: 'text-amber-300' },
                { label: 'Brent Crude',     value: '$97.42/bbl', color: 'text-white' },
                { label: 'USD/INR',         value: '₹83.62',     color: 'text-cyan-300' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-neutral-800/50">
                  <span className="text-neutral-400">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Session stats */}
          {activeMessages.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-800">
              <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Session Stats
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: activeMessages.filter((m) => m.role === 'user').length, label: 'Queries', color: 'text-amber-300' },
                  { value: conversations.length, label: 'Convos', color: 'text-cyan-300' },
                ].map((s, i) => (
                  <div key={i} className="p-2 rounded-lg bg-[#0E1422] border border-neutral-800 text-center">
                    <div className={`text-lg font-bold ${s.color} font-mono`}>{s.value}</div>
                    <div className="text-[9px] text-neutral-400 font-mono">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
        #chat-messages { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}

export default function AICopilotPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-xs text-neutral-400 font-mono flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
            Loading Groq × TinyFish AI Copilot...
          </div>
        </div>
      }>
        <AICopilotContent />
      </Suspense>
    </AppShell>
  );
}
