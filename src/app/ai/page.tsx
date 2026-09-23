'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppShell from '@/components/layout/AppShell';
import {
  Sparkles, Send, BookOpen, Bot, RefreshCw,
  FileText, Copy, CheckCheck, Trash2, X
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
   ZERO-DEP MARKDOWN RENDERER (LIGHT MINIMALIST THEME)
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
        return <code key={i} className="px-1.5 py-0.5 rounded-md bg-black/5 text-[#B89358] border border-black/5 text-[13px] font-mono">{part.slice(1, -1)}</code>;
      const lm = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (lm) return <a key={i} href={lm[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-500">{lm[1]}</a>;
      return part;
    });
  };

  const lines = content.split('\n');
  const rendered: React.ReactNode[] = [];
  let tableBuffer: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    if (line.startsWith('### ')) { rendered.push(<h3 key={idx} className="text-base font-bold text-neutral-900 mt-5 mb-2">{renderInline(line.slice(4))}</h3>); return; }
    if (line.startsWith('## ')) { rendered.push(<h2 key={idx} className="text-lg font-bold text-[#8F7640] mt-5 mb-2 border-b border-black/5 pb-2">{renderInline(line.slice(3))}</h2>); return; }
    if (line.startsWith('# ')) { rendered.push(<h1 key={idx} className="text-xl font-bold text-neutral-900 mt-5 mb-3">{renderInline(line.slice(2))}</h1>); return; }
    if (/^[-•*]\s/.test(line)) { rendered.push(<li key={idx} className="text-[15px] text-neutral-700 leading-relaxed ml-4 mb-1 list-disc list-inside marker:text-[#C8A96E]">{renderInline(line.replace(/^[-•*]\s/, ''))}</li>); return; }
    if (/^\d+\.\s/.test(line)) { rendered.push(<li key={idx} className="text-[15px] text-neutral-700 leading-relaxed ml-4 mb-1 list-decimal list-inside marker:font-bold marker:text-neutral-400">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>); return; }
    if (/^---+$/.test(line.trim())) { rendered.push(<hr key={idx} className="border-neutral-200 my-4" />); return; }
    if (!line.trim()) { rendered.push(<div key={idx} className="h-2" />); return; }
    if (line.includes('|')) {
      const cells = line.split('|').filter(Boolean).map(c => c.trim());
      const isSep = cells.every(c => /^[-:]+$/.test(c));
      if (!isSep) tableBuffer.push(<tr key={idx} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">{cells.map((cell, ci) => <td key={ci} className="px-4 py-2.5 text-[14px] text-neutral-700">{renderInline(cell)}</td>)}</tr>);
      if (idx === lines.length - 1 && tableBuffer.length > 0) {
        rendered.push(<div key={`table-${idx}`} className="my-4 overflow-x-auto rounded-2xl border border-black/10 shadow-sm bg-white/50 backdrop-blur-sm"><table className="w-full text-left border-collapse"><tbody>{tableBuffer}</tbody></table></div>);
        tableBuffer = [];
      }
      return;
    }
    if (tableBuffer.length > 0) {
      rendered.push(<div key={`table-flush-${idx}`} className="my-4 overflow-x-auto rounded-2xl border border-black/10 shadow-sm bg-white/50 backdrop-blur-sm"><table className="w-full text-left border-collapse"><tbody>{tableBuffer}</tbody></table></div>);
      tableBuffer = [];
    }
    rendered.push(<p key={idx} className="text-[15px] text-neutral-700 leading-relaxed">{renderInline(line)}</p>);
  });

  return <div className="space-y-2">{rendered}</div>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   COPY BUTTON
───────────────────────────────────────────────────────────────────────────── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded-full hover:bg-black/5 text-neutral-400 hover:text-neutral-700 transition-all cursor-pointer backdrop-blur-md" title="Copy">
      {copied ? <CheckCheck className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
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
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#C8A96E]" style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SUGGESTED PROMPTS
───────────────────────────────────────────────────────────────────────────── */
const SUGGESTED = [
  { label: 'Ethane vs Naphtha EBITDA', query: 'What is the EBITDA difference between 100% Ethane and 100% Naphtha cracking at RIL Dahej?' },
  { label: 'RIL cracks vs peers', query: 'Compare RIL O2C cracker margins vs ExxonMobil, SABIC and Dow Chemical globally' },
  { label: 'Dahej pipeline capacity', query: 'What is the throughput capacity of the Dahej-Hazira ethane pipeline and current utilization?' },
  { label: 'Global oil demand 2026', query: 'What are the key drivers of global crude oil demand in 2026 and the IEA/EIA demand outlook?' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
function RelianceIntelligenceContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [inputQuery, setInputQuery]     = useState(initialQuery);
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 'default', title: 'New Session', messages: [], createdAt: new Date() },
  ]);
  const [activeConvId, setActiveConvId] = useState('default');
  const [isLoading, setIsLoading]       = useState(false);
  const [expandedEvidence, setExpandedEvidence] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions]   = useState(true);

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
        let final: { answer?: SynthesizedAnswer } = {};

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
              ? { ...m, content: streamed || final?.answer?.answer || 'No response.', synthesized: final?.answer, isStreaming: false }
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
    const c: Conversation = { id: genId(), title: 'New Session', messages: [], createdAt: new Date() };
    setConversations((prev) => [c, ...prev]);
    setActiveConvId(c.id);
    setShowSuggestions(true);
    setInputQuery('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  /* ─────────────────────────────── RENDER ─────────────────────────────────── */
  return (
    <div className="relative h-[calc(100vh-7.5rem)] sm:h-[calc(100vh-8.5rem)] rounded-3xl overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#FFFDF9] to-[#F5F0E8] animate-fadeIn border border-black/[0.03] shadow-sm">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Single Column */}
      <div className="relative flex flex-col h-full max-w-4xl mx-auto z-10 pt-4 pb-8 px-4 sm:px-6">
        
        {/* Top Header (Subtle logo & New Chat button) */}
        <div className="flex items-center justify-between py-4 shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight font-sans flex items-center gap-2.5">
            <Bot className="w-7 h-7 text-[#C8A96E]" />
            Reliance Intelligence
          </h1>
          <button onClick={newConversation} 
            className="p-2.5 rounded-full bg-white/60 hover:bg-white/90 border border-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] backdrop-blur-md text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-8 scroll-smooth pb-32" id="chat-messages">

          {/* Empty State / Hero */}
          {activeMessages.length === 0 && showSuggestions && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-10 py-12 animate-fadeInUp">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 font-sans tracking-tight mb-4">
                  How can I help you today?
                </h2>
                <p className="text-base text-neutral-500 max-w-lg mx-auto leading-relaxed">
                  Ask anything about petchem economics, live market data, or operational insights.
                </p>
              </div>

              {/* Minimalist 3D Suggestion Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-2">
                {SUGGESTED.map((p, i) => (
                  <button key={i} onClick={() => handleRunQuery(p.query)}
                    className="group relative p-4 rounded-3xl bg-white/40 hover:bg-white/70 border border-white/60 text-left transition-all duration-300 cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex items-center justify-between text-[15px] font-medium text-neutral-700 group-hover:text-neutral-900">
                      <span className="truncate pr-4">{p.label}</span>
                      <div className="w-8 h-8 rounded-full bg-white/80 shadow-sm flex items-center justify-center text-[#C8A96E] transform group-hover:scale-110 transition-transform">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && activeMessages.some((m) => m.isStreaming && m.content === '') && (
            <div className="flex justify-start animate-fadeIn">
              <div className="max-w-[85%] sm:max-w-[75%] p-6 rounded-[32px] rounded-tl-[12px] bg-white/60 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-white shadow-sm shrink-0">
                    <Sparkles className="w-5 h-5 text-[#C8A96E] animate-spin" />
                  </div>
                  <div className="text-[15px] font-semibold text-neutral-800">Synthesizing intel...</div>
                </div>
                <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-transparent via-[#C8A96E] to-transparent rounded-full w-[200%] animate-slide" />
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {activeMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}>
              {msg.role === 'user' ? (
                <div className="max-w-[85%] sm:max-w-[75%] group">
                  <div className="px-6 py-4 rounded-[32px] rounded-tr-[12px] bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 text-[16px] text-white font-medium shadow-[0_8px_24px_rgba(0,0,0,0.12)] leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="max-w-[95%] sm:max-w-[85%] group flex items-start gap-4">
                  <div className="p-2.5 rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-black/5 shrink-0 mt-1">
                    <Bot className="w-6 h-6 text-[#C8A96E]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`px-6 py-5 rounded-[32px] rounded-tl-[12px] transition-all duration-300 backdrop-blur-xl ${msg.isStreaming ? 'bg-white/80 border-2 border-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.06)]' : 'bg-white/60 border border-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)]'}`}>
                      {msg.content
                        ? <MarkdownContent content={msg.content} />
                        : <div className="text-[15px] text-neutral-400 italic">Thinking<StreamingDots /></div>
                      }
                      {msg.isStreaming && msg.content && <StreamingDots />}
                    </div>

                    {/* Footer Actions */}
                    {!msg.isStreaming && msg.content && (
                      <div className="flex items-center gap-2 mt-2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyButton text={msg.content} />
                        {msg.synthesized?.evidence && msg.synthesized.evidence.length > 0 && (
                          <button onClick={() => setExpandedEvidence(expandedEvidence === msg.id ? null : msg.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm hover:bg-white/90 text-neutral-500 hover:text-neutral-900 text-[12px] font-bold transition-all cursor-pointer backdrop-blur-md">
                            <BookOpen className="w-3.5 h-3.5" />
                            Sources ({msg.synthesized.evidence.length})
                          </button>
                        )}
                      </div>
                    )}

                    {/* Evidence accordion */}
                    {expandedEvidence === msg.id && msg.synthesized?.evidence && (
                      <div className="mt-3 space-y-2 ml-2">
                        {msg.synthesized.evidence.map((ev, i) => (
                          <div key={i} className="p-4 rounded-3xl bg-white/50 border border-white/80 shadow-sm backdrop-blur-md space-y-2">
                            <div className="flex items-center gap-2 text-[13px] font-bold text-neutral-900">
                              <FileText className="w-4 h-4 text-[#B89358] shrink-0" />
                              <span>{ev.sourceTitle}</span>
                            </div>
                            <blockquote className="text-[13px] text-neutral-600 italic border-l-2 border-[#C8A96E] pl-4">
                              &ldquo;{ev.quote}&rdquo;
                            </blockquote>
                            {ev.pageOrLine?.startsWith('http') && (
                              <a href={ev.pageOrLine} target="_blank" rel="noopener noreferrer"
                                className="text-[12px] text-blue-600 hover:underline truncate block font-medium">
                                {ev.pageOrLine}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} className="h-8" />
        </div>

        {/* Floating Input Bar (3D Glassmorphism) */}
        <div className="absolute bottom-6 left-4 right-4 sm:left-6 sm:right-6 flex justify-center pointer-events-none">
          <form onSubmit={(e) => { e.preventDefault(); handleRunQuery(inputQuery); }} 
            className="w-full max-w-3xl flex items-end gap-3 p-2 rounded-[32px] bg-white/70 backdrop-blur-2xl border border-white shadow-[0_12px_48px_rgba(0,0,0,0.08)] pointer-events-auto transition-all focus-within:shadow-[0_16px_64px_rgba(0,0,0,0.12)] focus-within:bg-white/90">
            <div className="flex-1 relative">
              <textarea ref={inputRef} value={inputQuery} onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRunQuery(inputQuery); } }}
                disabled={isLoading} rows={1}
                placeholder="Ask Reliance Intelligence..."
                className="w-full px-5 py-4 bg-transparent text-[16px] text-neutral-900 placeholder-neutral-400 focus:outline-none disabled:opacity-50 font-sans resize-none leading-relaxed font-medium"
                style={{ minHeight: '56px', maxHeight: '160px' }}
                onInput={(e) => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 160) + 'px'; }}
              />
            </div>
            {isLoading ? (
              <button type="button" onClick={() => abortRef.current?.abort()}
                className="h-[56px] w-[56px] flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer transition-colors shrink-0">
                <X className="w-6 h-6" />
              </button>
            ) : (
              <button type="submit" disabled={!inputQuery.trim()}
                className="h-[56px] w-[56px] flex items-center justify-center rounded-full bg-[#C8A96E] hover:bg-[#B89358] text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(200,169,110,0.4)] active:scale-95 transition-all shrink-0">
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            )}
          </form>
        </div>

      </div>

      <style jsx global>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(50%); } }
        .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; }
        .animate-slide { animation: slide 1.5s infinite linear; }
        #chat-messages { scroll-behavior: smooth; }
        /* Hide scrollbar for a cleaner look */
        #chat-messages::-webkit-scrollbar { display: none; }
        #chat-messages { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default function RelianceIntelligencePage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div className="flex items-center justify-center h-64">
          <div className="text-sm font-bold text-neutral-500 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#C8A96E]" />
            Loading Reliance Intelligence...
          </div>
        </div>
      }>
        <RelianceIntelligenceContent />
      </Suspense>
    </AppShell>
  );
}
