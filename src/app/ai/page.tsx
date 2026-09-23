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
   ZERO-DEP MARKDOWN RENDERER (LIGHT THEME)
───────────────────────────────────────────────────────────────────────────── */
function MarkdownContent({ content }: { content: string }) {
  const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[([^\]]+)\]\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={i} className="text-neutral-900 font-bold">{part.slice(2, -2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
        return <em key={i} className="text-neutral-600 italic">{part.slice(1, -1)}</em>;
      if (part.startsWith('`') && part.endsWith('`'))
        return <code key={i} className="px-1.5 py-0.5 rounded bg-neutral-100 text-amber-700 border border-neutral-200 text-xs font-mono">{part.slice(1, -1)}</code>;
      const lm = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (lm) return <a key={i} href={lm[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-500">{lm[1]}</a>;
      return part;
    });
  };

  const lines = content.split('\n');
  const rendered: React.ReactNode[] = [];
  let tableBuffer: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    // Headers
    if (line.startsWith('### ')) { rendered.push(<h3 key={idx} className="text-sm font-bold text-neutral-900 mt-4 mb-1.5">{renderInline(line.slice(4))}</h3>); return; }
    if (line.startsWith('## ')) { rendered.push(<h2 key={idx} className="text-sm font-bold text-[#8F7640] mt-4 mb-1.5 border-b border-black/5 pb-1">{renderInline(line.slice(3))}</h2>); return; }
    if (line.startsWith('# ')) { rendered.push(<h1 key={idx} className="text-base font-bold text-neutral-900 mt-4 mb-2">{renderInline(line.slice(2))}</h1>); return; }
    // Bullets
    if (/^[-•*]\s/.test(line)) { rendered.push(<li key={idx} className="text-sm text-neutral-700 leading-relaxed ml-3 list-disc list-inside">{renderInline(line.replace(/^[-•*]\s/, ''))}</li>); return; }
    if (/^\d+\.\s/.test(line)) { rendered.push(<li key={idx} className="text-sm text-neutral-700 leading-relaxed ml-3 list-decimal list-inside">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>); return; }
    // HR
    if (/^---+$/.test(line.trim())) { rendered.push(<hr key={idx} className="border-neutral-200 my-3" />); return; }
    // Empty
    if (!line.trim()) { rendered.push(<div key={idx} className="h-1.5" />); return; }
    // Table
    if (line.includes('|')) {
      const cells = line.split('|').filter(Boolean).map(c => c.trim());
      const isSep = cells.every(c => /^[-:]+$/.test(c));
      if (!isSep) tableBuffer.push(<tr key={idx} className="border-b border-neutral-100">{cells.map((cell, ci) => <td key={ci} className="px-3 py-1.5 text-xs text-neutral-700 font-mono">{renderInline(cell)}</td>)}</tr>);
      if (idx === lines.length - 1 && tableBuffer.length > 0) {
        rendered.push(<div key={`table-${idx}`} className="my-3 overflow-x-auto rounded-xl border border-neutral-200"><table className="w-full text-xs"><tbody>{tableBuffer}</tbody></table></div>);
        tableBuffer = [];
      }
      return;
    }
    // Flush pending table
    if (tableBuffer.length > 0) {
      rendered.push(<div key={`table-flush-${idx}`} className="my-3 overflow-x-auto rounded-xl border border-neutral-200"><table className="w-full text-xs"><tbody>{tableBuffer}</tbody></table></div>);
      tableBuffer = [];
    }
    rendered.push(<p key={idx} className="text-sm text-neutral-700 leading-relaxed">{renderInline(line)}</p>);
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
      className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-all cursor-pointer" title="Copy">
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
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
        <span key={i} className="w-1 h-1 rounded-full bg-amber-500" style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
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
        'Groq processing synthesizing answer...',
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
    <div className="max-w-[1680px] mx-auto flex flex-col h-[calc(100vh-6rem)] gap-4 animate-fadeIn">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5 shrink-0 px-1">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-mono uppercase text-[#B89358] font-bold flex items-center gap-1.5 tracking-wider">
              <Zap className="w-3.5 h-3.5 text-blue-500" />
              Groq + TinyFish Intelligence Copilot
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-[10px] text-emerald-600 font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              gpt-oss-120b · live web search · any topic
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight font-sans">
            AI Copilot Studio
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5" /> TinyFish Web ON
          </span>
          <button onClick={() => openAuditModal('audit-01')}
            className="px-3.5 py-1.5 rounded-full bg-[#F5F0E8] hover:bg-[#EDE7DC] border border-[#E8E0D0] text-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Audit Trail
          </button>
        </div>
      </div>

      {/* ── 3-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden min-h-0">

        {/* ── LEFT: Conversations ── */}
        <div className="hidden lg:flex lg:col-span-3 flex-col rounded-3xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-50 space-y-3 shrink-0">
            <button onClick={newConversation} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FBF9F5] hover:bg-[#F5F0E8] border border-black/5 text-[#8F7640] text-xs font-bold transition-all cursor-pointer shadow-sm">
              <Plus className="w-4 h-4" /> New Conversation
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input type="text" value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search conversations..." className="w-full pl-8 pr-3 py-2 rounded-lg bg-neutral-50 border border-neutral-100 text-xs text-neutral-800 placeholder-neutral-400 focus:border-amber-200 focus:outline-none transition-all font-medium" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {filteredConvs.map((conv) => (
              <div key={conv.id} onClick={() => setActiveConvId(conv.id)}
                className={`group relative p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${activeConvId === conv.id ? 'bg-[#FBF9F5] border-amber-200 text-neutral-900 shadow-sm' : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'}`}>
                <div className="font-semibold line-clamp-2 pr-6 leading-tight text-[13px]">
                  <MessageSquare className="inline w-3.5 h-3.5 mr-1.5 opacity-60" />{conv.title}
                </div>
                <div className="text-[10px] font-medium text-neutral-400 mt-1.5">
                  {conv.messages.length} msgs · {conv.createdAt.toLocaleDateString()}
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                  className="absolute top-2.5 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick prompts */}
          <div className="p-4 border-t border-neutral-50 bg-[#FAF8F5]/50 space-y-2 shrink-0">
            <div className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B89358]" /> Quick Prompts
            </div>
            {SUGGESTED.slice(0, 4).map((p, i) => (
              <button key={i} onClick={() => handleRunQuery(p.query)} disabled={isLoading}
                className="w-full text-left text-xs text-neutral-600 hover:text-neutral-900 font-medium transition-colors py-1.5 block cursor-pointer disabled:opacity-40 truncate">
                <ChevronRight className="inline w-3.5 h-3.5 mr-1 text-neutral-300" />{p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── CENTER: Chat ── */}
        <div className="lg:col-span-6 flex flex-col rounded-3xl bg-white border border-neutral-100 shadow-sm overflow-hidden min-h-0 relative">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth bg-[#FAF8F5]/30" id="chat-messages">

            {/* Empty state */}
            {activeMessages.length === 0 && showSuggestions && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-8">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-100 to-blue-50 blur-xl" />
                  <div className="relative p-5 rounded-3xl bg-white border border-black/5 shadow-sm">
                    <Bot className="w-12 h-12 text-[#C8A96E] mx-auto" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 font-sans tracking-tight">Groq × TinyFish Copilot</h2>
                  <p className="text-sm text-neutral-500 max-w-sm mt-2 leading-relaxed">
                    Powered by <span className="font-semibold text-neutral-700">gpt-oss-120b</span> and live web search. Ask <strong className="text-neutral-900">anything</strong> — petchem economics, realtime finance, or science.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl px-4">
                  {SUGGESTED.map((p, i) => (
                    <button key={i} onClick={() => handleRunQuery(p.query)}
                      className="px-4 py-3 rounded-2xl bg-white hover:bg-[#FBF9F5] border border-neutral-100 hover:border-amber-200 text-xs text-neutral-600 hover:text-neutral-900 text-left transition-all cursor-pointer leading-snug shadow-sm">
                      <span className="text-[#C8A96E] mr-1.5 font-bold">→</span>{p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading skeleton (before stream starts) */}
            {isLoading && activeMessages.some((m) => m.isStreaming && m.content === '') && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-4 rounded-3xl rounded-tl-md bg-white border border-black/5 shadow-sm space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-500 animate-spin" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900">Groq + TinyFish at work...</div>
                      <div className="text-xs text-neutral-500 mt-0.5 font-medium">{loadingStage}</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 via-[#C8A96E] to-emerald-400 rounded-full w-full animate-pulse" />
                  </div>
                  <div className="text-[10px] font-bold text-neutral-400 flex gap-4 uppercase">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> TinyFish web running</span>
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Groq gpt-oss-120b</span>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {activeMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' ? (
                  <div className="max-w-[85%] group">
                    <div className="px-5 py-3.5 rounded-[24px] rounded-tr-[8px] bg-gradient-to-br from-[#C8A96E] to-[#B89358] border border-[#B89358]/50 text-[15px] text-white font-medium shadow-md leading-relaxed">
                      {msg.content}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-semibold mt-1.5 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[95%] w-full group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-2xl bg-[#FBF9F5] border border-black/5 shrink-0 shadow-sm mt-0.5">
                        <Bot className="w-4 h-4 text-[#C8A96E]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Provider badges */}
                        {msg.provider && (
                          <div className="flex items-center flex-wrap gap-1.5 mb-2">
                            <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                              <Zap className="w-3 h-3" />{msg.provider}
                            </span>
                            {msg.webSearchUsed && (
                              <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                                <Globe className="w-3 h-3" />TinyFish live web
                              </span>
                            )}
                          </div>
                        )}

                        {/* Content */}
                        <div className={`p-5 sm:p-6 rounded-3xl rounded-tl-[8px] transition-all shadow-sm ${msg.isStreaming ? 'bg-white border-2 border-blue-100' : 'bg-white border border-black/5'}`}>
                          {msg.content
                            ? <MarkdownContent content={msg.content} />
                            : <div className="text-sm text-neutral-400 italic">Generating<StreamingDots /></div>
                          }
                          {msg.isStreaming && msg.content && <StreamingDots />}
                        </div>

                        {/* Footer */}
                        {!msg.isStreaming && msg.content && (
                          <div className="flex items-center justify-between mt-2 px-1">
                            <div className="text-[10px] text-neutral-400 font-semibold">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <CopyButton text={msg.content} />
                              {msg.synthesized?.evidence && msg.synthesized.evidence.length > 0 && (
                                <button onClick={() => setExpandedEvidence(expandedEvidence === msg.id ? null : msg.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-neutral-100 shadow-sm hover:bg-neutral-50 text-neutral-500 hover:text-emerald-600 text-[11px] font-bold transition-all cursor-pointer">
                                  <BookOpen className="w-3.5 h-3.5" />
                                  {msg.synthesized.evidence.length} refs
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Evidence accordion */}
                        {expandedEvidence === msg.id && msg.synthesized?.evidence && (
                          <div className="mt-3 space-y-2">
                            {msg.synthesized.evidence.map((ev, i) => (
                              <div key={i} className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-black/5 space-y-1.5 shadow-sm">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-800">
                                  <FileText className="w-3.5 h-3.5 text-[#B89358] shrink-0" />
                                  <span>{ev.sourceTitle}</span>
                                  {ev.date && <span className="text-neutral-400 font-medium ml-1">[{ev.date}]</span>}
                                </div>
                                <blockquote className="text-[12px] text-neutral-600 italic border-l-2 border-[#C8A96E] pl-3 line-clamp-3">
                                  &ldquo;{ev.quote}&rdquo;
                                </blockquote>
                                {ev.pageOrLine?.startsWith('http') && (
                                  <a href={ev.pageOrLine} target="_blank" rel="noopener noreferrer"
                                    className="text-[11px] text-blue-600 hover:underline truncate block font-medium">
                                    {ev.pageOrLine}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Numerical chips */}
                        {!msg.isStreaming && msg.synthesized?.numericalData && msg.synthesized.numericalData.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {msg.synthesized.numericalData.slice(0, 4).map((nd, i) => (
                              <div key={i} className="px-3 py-1.5 rounded-xl bg-white border border-neutral-100 shadow-sm text-[11px] font-mono">
                                <span className="text-neutral-500 font-medium">{nd.label}: </span>
                                <span className="text-neutral-900 font-bold">{nd.value}</span>
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
          <div className="border-t border-black/5 bg-white p-3 sm:p-5 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
            <form onSubmit={(e) => { e.preventDefault(); handleRunQuery(inputQuery); }} className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea ref={inputRef} value={inputQuery} onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRunQuery(inputQuery); } }}
                  disabled={isLoading} rows={1}
                  placeholder="Ask anything — petchem, macro, finance, science, strategy..."
                  className="w-full px-4 py-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-[14px] text-neutral-900 placeholder-neutral-400 focus:border-amber-300 focus:bg-white focus:shadow-sm focus:outline-none transition-all disabled:opacity-50 font-sans resize-none leading-relaxed font-medium"
                  style={{ minHeight: '52px', maxHeight: '140px' }}
                  onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 140) + 'px'; }}
                />
              </div>
              {isLoading ? (
                <button type="button" onClick={() => abortRef.current?.abort()}
                  className="h-[52px] px-5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-sm font-bold flex items-center gap-2 shrink-0 cursor-pointer transition-colors shadow-sm">
                  <X className="w-4 h-4" /> Stop
                </button>
              ) : (
                <button type="submit" disabled={!inputQuery.trim()}
                  className="h-[52px] px-6 rounded-2xl bg-[#C8A96E] hover:bg-[#B89358] text-white text-sm font-bold flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-95 transition-all">
                  Send <Send className="w-4 h-4" />
                </button>
              )}
            </form>
            <div className="flex items-center justify-between mt-2.5 px-2">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wide">
                Groq 120B · TinyFish Web Search · Any Topic
              </span>
              {activeMessages.length > 0 && (
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wide">
                  {activeMessages.filter((m) => m.role === 'user').length} queries in session
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Context Panel ── */}
        <div className="hidden lg:flex lg:col-span-3 flex-col rounded-3xl bg-white border border-neutral-100 shadow-sm p-5 overflow-y-auto space-y-5 text-xs">
          <div className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider pb-3 border-b border-black/5 flex items-center justify-between shrink-0">
            <span>Intelligence Stack</span>
            <Database className="w-3.5 h-3.5 text-blue-500" />
          </div>

          {/* AI Engine Stack */}
          <div className="space-y-2.5">
            <span className="text-[10px] uppercase text-blue-600 font-bold">AI Engine Stack</span>
            <div className="space-y-1.5">
              {[
                { name: 'Groq gpt-oss-120b', sub: 'Primary · 120B flagship model', bg: 'bg-violet-50', border: 'border-violet-100', dot: 'text-violet-500' },
                { name: 'Groq gpt-oss-20b', sub: 'Fallback · fast 20B model', bg: 'bg-blue-50', border: 'border-blue-100', dot: 'text-blue-500' },
                { name: 'TinyFish Search', sub: 'Live web intel · LRU cached', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'text-emerald-500' },
                { name: 'Internal RAG', sub: 'RIL docs · hybrid search', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'text-amber-500' },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-xl ${item.bg} border ${item.border}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${item.dot} shrink-0`} />
                  <div>
                    <div className="text-neutral-900 font-bold text-[11px]">{item.name}</div>
                    <div className="text-neutral-500 text-[10px] font-medium">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document store */}
          <div className="space-y-2.5 pt-3 border-t border-black/5">
            <span className="text-[10px] uppercase text-[#B89358] font-bold">Document Store</span>
            {[
              ['Group 9 Petchem Proposal', 'Beyond Naphtha · Capital Allocation'],
              ['AI Cracker Industry Analysis', 'SCADA Pyrolysis Model · Telemetry'],
              ['RIL FY26 Financial Model', 'O2C EBITDA · NPV · IRR'],
            ].map(([title, sub], i) => (
              <div key={i} className="p-3 rounded-xl bg-white border border-neutral-100 shadow-sm">
                <div className="font-bold text-neutral-900 text-[11px]">{title}</div>
                <div className="text-[10px] text-neutral-500 font-medium mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* Market snapshot */}
          <div className="space-y-2.5 pt-3 border-t border-black/5">
            <span className="text-[10px] uppercase text-emerald-600 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Market Benchmarks
            </span>
            <div className="space-y-1 text-[11px]">
              {[
                { label: 'Ethylene (CFR)',  value: '$886/t',     color: 'text-neutral-900' },
                { label: 'Ethane (FOB)',    value: '$157/t',     color: 'text-emerald-600' },
                { label: 'Naphtha (CFR)',   value: '$816/t',     color: 'text-amber-600' },
                { label: 'Brent Crude',     value: '$97.42/bbl', color: 'text-neutral-900' },
                { label: 'USD/INR',         value: '₹83.62',     color: 'text-blue-600' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between py-1 border-b border-black/5 last:border-0">
                  <span className="text-neutral-500 font-medium">{item.label}</span>
                  <span className={`font-bold font-mono ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Session stats */}
          {activeMessages.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-black/5">
              <span className="text-[10px] uppercase text-neutral-500 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Session Stats
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: activeMessages.filter((m) => m.role === 'user').length, label: 'Queries', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                  { value: conversations.length, label: 'Convos', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                ].map((s, i) => (
                  <div key={i} className={`p-2.5 rounded-xl ${s.bg} border ${s.border} text-center`}>
                    <div className={`text-xl font-bold ${s.color} font-mono`}>{s.value}</div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase">{s.label}</div>
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
          <div className="text-sm font-bold text-neutral-500 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#C8A96E]" />
            Loading Groq × TinyFish AI Copilot...
          </div>
        </div>
      }>
        <AICopilotContent />
      </Suspense>
    </AppShell>
  );
}
