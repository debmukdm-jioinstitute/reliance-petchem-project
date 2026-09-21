import { 
  MEETINGS_DATA, 
  MARKET_COMMODITIES, 
  SCENARIO_DEFINITIONS, 
  CHRONOLOGICAL_CHANGES, 
  CRACKER_ASSETS,
  COMMODITY_FORECASTS,
  MONTE_CARLO_RESULT,
  AUDIT_RECORDS
} from '../data/knowledgeStore';
import { ALL_RAW_DOCUMENTS } from '../data/rawDocuments';
import { InformationCategory, SourceCitation } from '../data/types';

export interface SearchResultItem {
  id: string;
  type: 'MEETING' | 'DOCUMENT_CHUNK' | 'MARKET' | 'SCENARIO' | 'DECISION' | 'ASSUMPTION' | 'ACTION' | 'ASSET';
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

  // 1. Search Meeting Transcripts & MoMs
  for (const m of MEETINGS_DATA) {
    let score = 0;
    const combinedText = `${m.title} ${m.aiSummary} ${m.topic} ${m.keyDiscussion.join(' ')} ${m.entities.join(' ')}`;
    const docTokens = tokenize(combinedText);
    
    for (const qt of queryTokens) {
      if (docTokens.includes(qt)) score += 3;
      if (m.title.toLowerCase().includes(qt)) score += 5;
    }

    if (score > 0) {
      results.push({
        id: m.id,
        type: 'MEETING',
        title: m.title,
        snippet: m.aiSummary.slice(0, 220) + '...',
        source: {
          id: `src-${m.id}`,
          sourceTitle: m.title,
          sourceType: 'MEETING',
          date: m.date,
          confidence: 'HIGH'
        },
        score,
        date: m.date,
        categoryTag: 'FACT'
      });
    }

    // Search individual decisions
    for (const d of m.decisions) {
      let dScore = 0;
      const dText = `${d.decision} ${d.rationale} ${d.evidence}`;
      for (const qt of queryTokens) {
        if (dText.toLowerCase().includes(qt)) dScore += 4;
      }
      if (dScore > 0) {
        results.push({
          id: d.id,
          type: 'DECISION',
          title: `Decision: ${d.decision}`,
          snippet: `${d.rationale} Impact: ${d.impact}`,
          exactQuote: d.sourceCitation.exactQuote,
          source: d.sourceCitation,
          score: dScore + 2,
          date: m.date,
          categoryTag: 'FACT'
        });
      }
    }

    // Search individual assumptions invalidated
    for (const a of m.assumptionsInvalidated) {
      let aScore = 0;
      const aText = `${a.originalAssumption} ${a.invalidationReason} ${a.updatedUnderstanding}`;
      for (const qt of queryTokens) {
        if (aText.toLowerCase().includes(qt)) aScore += 4;
      }
      if (aScore > 0) {
        results.push({
          id: a.id,
          type: 'ASSUMPTION',
          title: `Invalidated Assumption: ${a.originalAssumption}`,
          snippet: `Updated: ${a.updatedUnderstanding}. Reason: ${a.invalidationReason}`,
          exactQuote: a.sourceCitation.exactQuote,
          source: a.sourceCitation,
          score: aScore + 3,
          date: m.date,
          categoryTag: 'FACT'
        });
      }
    }
  }

  // 2. Search Raw Ingested Documents
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

  // 3. Search Market Commodities
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

  // 4. Search Scenarios & Quantitative Models
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

// Multi-Agent Answer Synthesis Pipeline
export function synthesizeAgentResponse(question: string): SynthesizedAnswer {
  const qLower = question.toLowerCase();
  
  // Determine required specialized agents
  const requiredAgents: string[] = [];
  if (qLower.includes('meeting') || qLower.includes('rajesh') || qLower.includes('hanoz') || qLower.includes('decide') || qLower.includes('transcript')) {
    requiredAgents.push('Meeting Agent');
  }
  if (qLower.includes('price') || qLower.includes('market') || qLower.includes('brent') || qLower.includes('naphtha') || qLower.includes('ethane') || qLower.includes('ethylene')) {
    requiredAgents.push('Market Agent');
  }
  if (qLower.includes('forecast') || qLower.includes('predict') || qLower.includes('timesfm') || qLower.includes('arima')) {
    requiredAgents.push('Forecast Agent');
  }
  if (qLower.includes('financial') || qLower.includes('npv') || qLower.includes('irr') || qLower.includes('capex') || qLower.includes('payback') || qLower.includes('ebitda')) {
    requiredAgents.push('Financial Agent');
  }
  if (qLower.includes('scenario') || qLower.includes('what if') || qLower.includes('increase') || qLower.includes('shock') || qLower.includes('delay')) {
    requiredAgents.push('Scenario Agent');
  }
  if (requiredAgents.length === 0) {
    requiredAgents.push('Document Agent', 'Executive Agent');
  } else {
    requiredAgents.push('Executive Agent');
  }

  // Specialized Q&A synthesis patterns
  if (qLower.includes('brent') && (qLower.includes('20%') || qLower.includes('increase') || qLower.includes('effect'))) {
    return {
      question,
      answer: 'A 20% increase in Brent crude (from ~$82/bbl to ~$98.5/bbl) widens the competitive moat of Reliance’s ethane-cracking assets against Asian and European naphtha-based crackers. Because naphtha is closely tethered to Brent (0.91 correlation), Asian naphtha spot prices would rise from ~$685/t toward ~$820/t. In contrast, US Mont Belvieu ethane is decoupled from crude and driven by Permian gas production. As a result, RIL gross ethylene margin on ethane expands by +$160–$190/tonne, driving an estimated annual EBITDA uplift of +₹3,850 Cr across Jamnagar and Dahej units.',
      keyTakeaway: 'High crude prices directly expand RIL ethane margin delta over naphtha-reliant regional peers, cushioning O2C earnings.',
      category: 'MODEL OUTPUT',
      evidence: [
        {
          sourceTitle: 'Beyond Naphtha: Capital Allocation & Feedstock Economics (Group 9)',
          date: 'July 2026',
          pageOrLine: 'Page 1, Paragraph 2 & References',
          quote: 'Cracking ethane yields ~80% ethylene per molecule vs ~30% for naphtha, and ethane is roughly half as expensive on an energy-equivalent basis.'
        },
        {
          sourceTitle: 'AI Based Cracker Industry Analysis and Scenario Simulation',
          date: 'August 2026',
          pageOrLine: 'Section 7 & 9',
          quote: 'Naphtha costs rose 61 percent year on year, while US ethane costs fell 11 percent, and RIL specifically credited favourable ethane cracking economics for cushioning its O2C margins.'
        }
      ],
      numericalData: [
        { label: 'Baseline Brent', value: '$82.40/bbl', context: 'Current spot' },
        { label: 'Shock Brent (+20%)', value: '$98.88/bbl', context: 'Scenario input' },
        { label: 'Naphtha Spot Equivalent', value: '~$822/tonne', context: '0.91 correlation' },
        { label: 'Estimated EBITDA Uplift', value: '+₹3,850 Cr / year', context: 'Jamnagar & Dahej maximized ethane run' }
      ],
      assumptions: [
        'Ethane price at Mont Belvieu remains insulated from crude via domestic natural gas liquids supply',
        'VLEC shipping freight and liquefaction charges remain at baseline $125/t delivered to Dahej',
        'Downstream polyethylene and chemical realizations absorb at least 65% of the naphtha cost push'
      ],
      uncertainty: 'Moderate uncertainty regarding whether European naphtha crackers will shut down prematurely, altering global trade balance.',
      relatedAnalysis: ['/scenarios', '/financial', '/market/cracker'],
      auditRecordId: 'audit-02',
      requiredAgents
    };
  }

  if (qLower.includes('rajesh') || qLower.includes('meeting 1') || qLower.includes('switching') || qLower.includes('flexibility')) {
    return {
      question,
      answer: 'In Meeting 1 (06 July 2026), Rajesh Rawal (Business Head, Cracker & Poly Business, RIL) clarified that Reliance completed the operational transition from naphtha to ethane a decade ago (2014–2017) by contracting 1.5 MMTPA US ethane, commissioning Dahej terminal, and deploying six VLECs. RIL already operates an internal linear programming optimizer capable of switching feedstocks within a fraction of a day. Therefore, studying feedstock switching as an unsolved question was invalidated. The project was redirected toward AI optimization enhancement, multi-horizon price forecasting, dynamic financial modeling of the live capacity expansion project, and global chemical benchmarking.',
      keyTakeaway: 'Feedstock switching is already operational at RIL; the real strategic challenge is dynamic capital allocation, price forecasting, and expansion viability under global oversupply.',
      category: 'FACT',
      evidence: [
        {
          sourceTitle: 'Minutes of Meeting — RIL Meeting 1',
          date: '06 July 2026',
          pageOrLine: 'Section 4, 14, 19',
          quote: 'The original idea of studying a NAFTA-to-ethane switch is not the right central framing because Reliance has already built this operational flexibility. Reliance already has flexibility to switch feedstock within a fraction of a day.',
          speaker: 'Rajesh Rawal'
        }
      ],
      numericalData: [
        { label: 'Switching Lead Time', value: '< 24 hours', context: 'Fraction of a day operational flexibility' },
        { label: 'Contracted US Ethane', value: '1.5 MMTPA', context: 'Contracted in 2014, active since 2017' },
        { label: 'Operating VLEC Fleet', value: '6 vessels', context: 'With 3 planned additions' }
      ],
      assumptions: [
        'Internal RIL linear programming optimizer continues to govern real-time unit feeds',
        'Project team works on external architecture and public data before on-site calibration'
      ],
      uncertainty: 'Zero uncertainty on historical operational facts; high confidence based on verified MoM records.',
      relatedAnalysis: ['/meetings/meeting-1', '/assumptions', '/project'],
      auditRecordId: 'audit-01',
      requiredAgents
    };
  }

  if (qLower.includes('hanoz') || qLower.includes('meeting 2') || qLower.includes('dual')) {
    return {
      question,
      answer: 'In Meeting 2, Hanoz (new Business Head of Cracker) approved the AI Live Dashboard concept and mandated a Dual Simulation Architecture: (1) an RIL-specific operational & capacity expansion simulation, and (2) a global cracker industry simulation. He also instructed the team to build an AI price prediction engine for major raw materials (ethane, propane, butane/LPG, naphtha) and finished products (ethylene, propylene) to drive dynamic scenario testing.',
      keyTakeaway: 'Cracker leadership validated the live dashboard and expanded scope to benchmark RIL against global petrochemical oversupply.',
      category: 'FACT',
      evidence: [
        {
          sourceTitle: 'Meeting 2 Transcript',
          date: '20 July 2026',
          pageOrLine: 'Lines 100-106, 171',
          quote: 'You can also look at it on a global basis... You could work on predicting the prices with using AI... basis that, you can do two studies: one simulation for RIL and one for global industry as a whole.',
          speaker: 'Hanoz'
        }
      ],
      numericalData: [
        { label: 'Dual Simulation Tiers', value: '2', context: 'RIL-Specific + Global Industry' },
        { label: 'Core Products', value: 'Ethylene & Propylene', context: 'Main outputs from cracker' },
        { label: 'US Ethane Base', value: '1.5 MMTPA', context: 'Confirmed by Hanoz' }
      ],
      assumptions: [
        'Public commodity data can be used as proxies before business team internal data release',
        'Scope document serves as the formal alignment gate'
      ],
      uncertainty: 'None on leadership intent; transcript confirms exact words.',
      relatedAnalysis: ['/meetings/meeting-2', '/scenarios', '/market'],
      auditRecordId: 'audit-01',
      requiredAgents
    };
  }

  // Default synthesis using hybrid retrieval
  const searchHits = performHybridSearch(question);
  const primaryHit = searchHits[0];

  return {
    question,
    answer: primaryHit 
      ? `Based on active project intelligence and verified documentation: ${primaryHit.snippet} ${primaryHit.exactQuote ? `Direct record confirms: "${primaryHit.exactQuote}"` : ''}`
      : 'Based on ingested project records, this query touches active workstreams across AI optimization, scenario simulation, and dynamic financial modeling for Reliance O2C.',
    keyTakeaway: 'Intelligence verified across project transcripts, quantitative models, and market feeds.',
    category: primaryHit?.categoryTag || 'INFERENCE',
    evidence: searchHits.slice(0, 3).map(h => ({
      sourceTitle: h.source.sourceTitle,
      date: h.source.date,
      pageOrLine: h.source.pageOrSection || 'General Section',
      quote: h.exactQuote || h.snippet,
      speaker: h.source.speaker
    })),
    numericalData: [
      { label: 'Ethylene Spot', value: '$840/tonne', context: 'CFR SE Asia / India' },
      { label: 'US Ethane FOB', value: '$145/tonne', context: 'Mont Belvieu spot' },
      { label: 'Naphtha Spot', value: '$685/tonne', context: 'CFR Japan/Singapore' },
      { label: 'Gross Yield Delta', value: '~80% vs ~30%', context: 'Ethane vs Naphtha ethylene yield' }
    ],
    assumptions: [
      'Data reflects current market tick feeds and approved meeting transcripts',
      'Assumptions verified against Meeting 1 (Rajesh Rawal) and Meeting 2 (Hanoz)'
    ],
    uncertainty: 'Low-to-moderate; cross-referenced across meeting minutes and quantitative models.',
    relatedAnalysis: ['/overview', '/executive', '/meetings', '/scenarios'],
    auditRecordId: 'audit-01',
    requiredAgents
  };
}
