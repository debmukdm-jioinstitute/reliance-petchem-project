'use client';

import React, { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import {
  FileText,
  FileCode,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { ALL_RAW_DOCUMENTS } from '@/data/rawDocuments';

export default function DocumentsPage() {
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-ai-cracker');
  const [searchChunk, setSearchChunk] = useState<string>('');

  const selectedDoc =
    ALL_RAW_DOCUMENTS.find((d) => d.id === selectedDocId) || ALL_RAW_DOCUMENTS[0];

  const filteredLines = searchChunk
    ? selectedDoc.contentLines.filter((l) =>
        l.toLowerCase().includes(searchChunk.toLowerCase())
      )
    : selectedDoc.contentLines;

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#1A2232]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#BFA161] font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#BFA161]" />
                Institutional Document Store & Parser
              </span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[11px] text-[#94A3B8]">Ground Truth Knowledge Base</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-[#F8FAFC]">
              DOCUMENT INTELLIGENCE & INGESTION
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1 font-light max-w-2xl">
              Original research studies and live project reports ingested into vector store with paragraph-level chunking and metadata tags.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] bg-[#0E1420] px-3.5 py-2 rounded-lg border border-[#1E2738]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>{ALL_RAW_DOCUMENTS.length} Grounded Documents Active</span>
          </div>
        </div>

        {/* Ingested Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {ALL_RAW_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                setSelectedDocId(doc.id);
                setSearchChunk('');
              }}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                selectedDocId === doc.id
                  ? 'bg-[#151D2C] border-[#BFA161] shadow-lg'
                  : 'bg-[#0E1420] border-[#1A2232] hover:bg-[#121824]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#162030] text-[#38BDF8] border border-[#242F44]">
                    {doc.category}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    {doc.contentLines.length} Chunks
                  </span>
                </div>
                <h3 className="font-semibold text-xs text-[#F8FAFC] line-clamp-2">
                  {doc.title}
                </h3>
              </div>
              <div className="text-[10px] font-mono text-[#94A3B8] mt-2 pt-2 border-t border-[#1E2738]">
                {doc.date}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Document Metadata & Chunks Inspector */}
        <div className="p-6 rounded-2xl bg-[#0E1420] border border-[#1A2232] space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2738]">
            <div>
              <span className="text-[10px] font-mono text-[#BFA161] uppercase tracking-wider font-bold">
                Document Chunk Inspector
              </span>
              <h2 className="text-base font-bold text-[#F8FAFC]">
                {selectedDoc.title}
              </h2>
              <div className="text-xs text-[#94A3B8]">
                Author / Lead: <strong className="text-[#CBD5E1]">{selectedDoc.authorOrSpeaker}</strong> ({selectedDoc.organization})
              </div>
            </div>

            {/* In-document chunk search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchChunk}
                onChange={(e) => setSearchChunk(e.target.value)}
                placeholder="Search chunks in this document..."
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#080B10] border border-[#242F44] text-xs text-[#F8FAFC] placeholder-[#64748B] focus:border-[#BFA161] focus:outline-none"
              />
            </div>
          </div>

          {/* Chunk Feed */}
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-2">
            {filteredLines.map((line, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg bg-[#0A0E17] border border-[#1A2232] space-y-1 text-xs hover:border-[#BFA161]/30 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Chunk #{idx + 1}</span>
                  <span>Vector Embedding: BGE-M3 (1024-dim)</span>
                </div>
                <p className="text-[#CBD5E1] leading-relaxed font-sans">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
