'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search,
  Sparkles,
  FileText,
  TrendingUp,
  SlidersHorizontal, 
  DollarSign, 
  X, 
  ArrowRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { performHybridSearch, SearchResultItem } from '@/lib/searchEngine';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPaletteModal({
  isOpen,
  onClose
}: CommandPaletteModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Global Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Execute hybrid search on query changes
  useEffect(() => {
    if (query.trim().length >= 2) {
      const searchHits = performHybridSearch(query);
      setResults(searchHits);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleSelectResult = (item: SearchResultItem) => {
    onClose();
    if (item.type === 'MARKET') {
      router.push('/market');
    } else if (item.type === 'SCENARIO') {
      router.push('/scenarios');
    } else if (item.type === 'DECISION' || item.type === 'ASSUMPTION') {
      router.push('/ai');
    } else {
      router.push(`/ai?q=${encodeURIComponent(item.title)}`);
    }
  };

  const handleAskAI = () => {
    if (!query) return;
    onClose();
    router.push(`/ai?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#0E1420] border border-[#242F44] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-[#1E2738] bg-[#0A0E17]">
          <Search className="w-5 h-5 text-[#BFA161] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                handleAskAI();
              }
            }}
            placeholder="Ask AI, or search markets, feedstocks, plant assets..."
            className="w-full h-14 bg-transparent text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#64748B] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono text-[#64748B] ml-2 px-1.5 py-0.5 rounded bg-[#161F30] border border-[#242F44] hidden sm:inline">
            ESC to close
          </span>
        </div>

        {/* Results / Default Quick Actions */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {query.trim().length > 0 && (
            <div className="p-2 rounded-lg bg-[#BFA161]/10 border border-[#BFA161]/30 flex items-center justify-between group cursor-pointer hover:bg-[#BFA161]/20 transition-all"
              onClick={handleAskAI}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#BFA161]" />
                <span className="text-xs font-medium text-[#F8FAFC]">
                  Ask AI Copilot: &quot;<span className="text-[#D4BA7B]">{query}</span>&quot;
                </span>
              </div>
              <span className="text-[10px] text-[#BFA161] font-mono flex items-center gap-1">
                Press Enter <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          )}

          {/* Search Hits */}
          {results.length > 0 && (
            <div className="space-y-1">
              <div className="text-[10px] uppercase font-semibold text-[#64748B] px-2 py-1 tracking-wider">
                Matching Intelligence ({results.length})
              </div>
              {results.map((hit) => (
                <div
                  key={hit.id}
                  onClick={() => handleSelectResult(hit)}
                  className="p-2.5 rounded-lg hover:bg-[#151D2C] border border-transparent hover:border-[#1E2738] cursor-pointer transition-all flex items-start gap-3"
                >
                  <div className="p-1.5 rounded bg-[#1E2738] text-[#94A3B8] shrink-0 mt-0.5">
                    {hit.type === 'MARKET' && <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />}
                    {hit.type === 'SCENARIO' && <SlidersHorizontal className="w-3.5 h-3.5 text-[#F59E0B]" />}
                    {hit.type === 'DECISION' && <FileText className="w-3.5 h-3.5 text-[#BFA161]" />}
                    {hit.type === 'ASSUMPTION' && <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />}
                    {hit.type === 'DOCUMENT_CHUNK' && <FileText className="w-3.5 h-3.5 text-[#94A3B8]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#F8FAFC] truncate">
                        {hit.title}
                      </span>
                      {hit.date && (
                        <span className="text-[10px] text-[#64748B] shrink-0 font-mono">
                          {hit.date}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#94A3B8] line-clamp-2 mt-0.5">
                      {hit.snippet}
                    </p>
                    {hit.exactQuote && (
                      <p className="text-[10px] text-[#D4BA7B] italic border-l border-[#BFA161]/50 pl-2 mt-1">
                        &ldquo;{hit.exactQuote}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Shortcuts when empty */}
          {results.length === 0 && (
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-semibold text-[#64748B] px-2 tracking-wider">
                Quick Navigation & Commands
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  { name: 'AI Copilot', desc: 'Ask questions grounded in project data', href: '/ai', icon: Sparkles },
                  { name: 'Cracker Value Chain & Spreads', desc: 'Ethane vs Naphtha Economics', href: '/market?tab=cracker', icon: TrendingUp },
                  { name: '10,000-Run Monte Carlo Simulation', desc: 'NPV / IRR probability curve', href: '/scenarios/monte-carlo', icon: SlidersHorizontal },
                  { name: 'RIL Asset DCF Valuation Model', desc: 'Jamnagar, Dahej, Hazira', href: '/financial', icon: DollarSign },
                  { name: 'Interactive Knowledge Graph', desc: 'Palantir-grade relational network', href: '/knowledge-graph', icon: Sparkles },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.name}
                      onClick={() => {
                        onClose();
                        router.push(item.href);
                      }}
                      className="p-2 rounded-lg bg-[#111724] border border-[#1C2638] hover:border-[#BFA161]/50 hover:bg-[#151D2C] cursor-pointer transition-all flex items-center gap-2.5"
                    >
                      <Icon className="w-4 h-4 text-[#BFA161] shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#F8FAFC] truncate">{item.name}</div>
                        <div className="text-[10px] text-[#64748B] truncate">{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
