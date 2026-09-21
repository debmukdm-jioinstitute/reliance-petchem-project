import {
  MARKET_COMMODITIES,
  SCENARIO_DEFINITIONS
} from '../data/knowledgeStore';
import { ALL_RAW_DOCUMENTS } from '../data/rawDocuments';
import { InformationCategory, SourceCitation } from '../data/types';

export interface SearchResultItem {
  id: string;
  type: 'DOCUMENT_CHUNK' | 'MARKET' | 'SCENARIO' | 'DECISION' | 'ASSUMPTION' | 'ACTION' | 'ASSET';
  title: string;
  snippet: string;
  exactQuote?: string;
  source: SourceCitation;
  score: number;
  date?: string;
  categoryTag?: InformationCategory;
}

export interface SynthesizedAnswer {
  question: string;
  answer: string;
  keyTakeaway: string;
  category: InformationCategory;
  evidence: {
    sourceTitle: string;
    date: string;
    pageOrLine?: string;
    quote: string;
    speaker?: string;
  }[];
  numericalData: {
    label: string;
    value: string;
    context: string;
  }[];
  assumptions: string[];
  uncertainty: string;
  relatedAnalysis: string[];
  auditRecordId?: string;
  requiredAgents: string[];
}

// Tokenize and clean text
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2);
}

// In-Memory Hybrid Search & RAG Pipeline
export function performHybridSearch(query: string, filterType?: string): SearchResultItem[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const results: SearchResultItem[] = [];

  // 1. Search Raw Ingested Documents
  for (const doc of ALL_RAW_DOCUMENTS) {
    for (let i = 0; i < doc.contentLines.length; i++) {
      const line = doc.contentLines[i];
      let lineScore = 0;
      for (const qt of queryTokens) {
        if (line.toLowerCase().includes(qt)) {
          lineScore += 2;
        }
      }
      if (lineScore > 3) {
        results.push({
          id: `${doc.id}-line-${i}`,
          type: 'DOCUMENT_CHUNK',
          title: `${doc.title} (Paragraph ${i + 1})`,
          snippet: line.slice(0, 240) + '...',
          exactQuote: line,
          source: {
            id: `src-${doc.id}-${i}`,
            sourceTitle: doc.title,
            sourceType: 'DOCUMENT',
            date: doc.date,
            pageOrSection: `Line/Para ${i + 1}`,
            exactQuote: line,
            confidence: 'HIGH'
          },
          score: lineScore,
          date: doc.date,
          categoryTag: 'FACT'
        });
      }
    }
  }

  // 2. Search Market Commodities
  for (const c of MARKET_COMMODITIES) {
    let cScore = 0;
    const cText = `${c.name} ${c.symbol} ${c.category} ${c.source}`;
    for (const qt of queryTokens) {
      if (cText.toLowerCase().includes(qt)) cScore += 4;
    }
    if (cScore > 0) {
      results.push({
        id: c.id,
        type: 'MARKET',
        title: `${c.name} (${c.symbol}): ${c.currentPrice} ${c.currency}/${c.unit}`,
        snippet: `1D: ${c.change1D > 0 ? '+' : ''}${c.change1D}%, 1Y: ${c.change1Y}%. Source: ${c.source}`,
        source: {
          id: `src-${c.id}`,
          sourceTitle: c.source,
          sourceType: 'MARKET_DATA',
          date: '2026-09-21',
          confidence: 'HIGH'
        },
        score: cScore,
        categoryTag: 'FACT'
      });
    }
  }

  // 3. Search Scenarios & Quantitative Models
  for (const s of Object.values(SCENARIO_DEFINITIONS)) {
    let sScore = 0;
    const sText = `${s.name} ${s.description}`;
    for (const qt of queryTokens) {
      if (sText.toLowerCase().includes(qt)) sScore += 3;
    }
    if (sScore > 0) {
      results.push({
        id: s.id,
        type: 'SCENARIO',
        title: `Scenario: ${s.name}`,
        snippet: `${s.description} | EBITDA: ₹${s.outputs.ebitdaINR_Cr.toLocaleString()} Cr, NPV: $${s.outputs.npvUSD_Mn}M, IRR: ${s.outputs.irrPct}%`,
        source: {
          id: `src-scen-${s.id}`,
          sourceTitle: 'RIL Quantitative Scenario Engine',
          sourceType: 'RESEARCH',
          date: '2026-09-21',
          confidence: 'HIGH'
        },
        score: sScore,
        categoryTag: 'SCENARIO'
      });
    }
  }

  // Sort by score descending and return top 20
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, 20);
}
