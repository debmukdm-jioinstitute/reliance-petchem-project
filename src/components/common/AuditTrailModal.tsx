'use client';

import React from 'react';
import { X, ShieldCheck, Calculator, BookOpen, AlertCircle, Cpu, Clock, ExternalLink } from 'lucide-react';
import { AUDIT_RECORDS } from '@/data/knowledgeStore';

interface AuditTrailModalProps {
  auditId: string | null;
  onClose: () => void;
}

export default function AuditTrailModal({ auditId, onClose }: AuditTrailModalProps) {
  if (!auditId) return null;

  const record = AUDIT_RECORDS[auditId] || AUDIT_RECORDS['audit-01'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#0E1420] border border-[#242F44] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2738] bg-[#0A0E17]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#BFA161]/15 border border-[#BFA161]/30 text-[#D4BA7B]">
              <ShieldCheck className="w-5 h-5 text-[#BFA161]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wide">
                  Intelligence Audit Inspector
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  {record.confidenceScore}% Confidence
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
                  {record.category}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8]">
                &quot;Why did the AI reach this conclusion?&quot; — Cryptographically verifiable audit trail
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E2738] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#F8FAFC]">
          {/* Question & Answer Snippet */}
          <div className="p-4 rounded-xl bg-[#121824] border border-[#1E293B] space-y-2">
            <div className="text-[10px] uppercase font-mono tracking-wider text-[#BFA161]">
              Audited Query & Conclusion
            </div>
            <div className="text-sm font-semibold text-[#F8FAFC]">
              {record.question}
            </div>
            <div className="text-xs text-[#94A3B8] leading-relaxed border-l-2 border-[#BFA161] pl-3 py-0.5">
              {record.answerSnippet}
            </div>
          </div>

          {/* Retrieved Ground Truth Sources */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              <BookOpen className="w-4 h-4 text-[#38BDF8]" />
              Retrieved Ground Truth Evidence ({record.retrievedDocuments.length})
            </div>
            <div className="space-y-2">
              {record.retrievedDocuments.map((doc, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-lg bg-[#141B28] border border-[#1E293B] space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#38BDF8] flex items-center gap-1.5">
                      {doc.title}
                    </span>
                    <span className="font-mono text-[10px] text-[#94A3B8] bg-[#0E1420] px-2 py-0.5 rounded border border-[#1E2738]">
                      {doc.pageOrLine}
                    </span>
                  </div>
                  <blockquote className="text-[11px] text-[#CBD5E1] italic bg-[#0A0E17]/60 p-2.5 rounded border-l border-[#38BDF8]/50">
                    &ldquo;{doc.snippet}&rdquo;
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical & Numerical Calculation Steps (if applicable) */}
          {record.numericalCalculations && record.numericalCalculations.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
                <Calculator className="w-4 h-4 text-[#10B981]" />
                Deterministic Numerical Calculations (No Hallucination)
              </div>
              <div className="p-3 rounded-lg bg-[#0F1916] border border-[#10B981]/30 font-mono text-[11px] text-[#A7F3D0] space-y-1.5">
                {record.numericalCalculations.map((calc, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#10B981] font-bold">Step {i + 1}:</span>
                    <span>{calc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Assumptions */}
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
              Underlying Assumptions
            </div>
            <ul className="space-y-1 text-xs text-[#94A3B8]">
              {record.assumptionsUsed.map((asm, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BFA161]" />
                  <span>{asm}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Uncertainty & Limitations Disclosure */}
          <div className="p-3 rounded-lg bg-[#1F1712] border border-[#F59E0B]/30 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <div>
              <div className="text-[11px] font-semibold text-[#FBBF24]">
                Model Uncertainty & Operational Boundaries
              </div>
              <p className="text-[11px] text-[#FDE68A] mt-0.5">
                {record.uncertaintyDisclosures.join(' ')}
              </p>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="pt-4 border-t border-[#1E2738] flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-[#64748B]">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#BFA161]" />
              <span>Model Pipeline: <strong className="text-[#CBD5E1]">{record.model}</strong></span>
            </div>
            <div>
              Prompt Spec: <strong className="text-[#CBD5E1]">{record.promptVersion}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Audited at: {record.timestamp}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
