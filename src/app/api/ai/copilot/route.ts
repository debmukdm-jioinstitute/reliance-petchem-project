import { NextResponse } from 'next/server';
import { MARKET_COMMODITIES, CRACKER_ASSETS } from '@/data/knowledgeStore';
import { COMMODITY_INTELLIGENCE } from '@/data/commodityIntelligence';
import { performHybridSearch, SynthesizedAnswer } from '@/lib/searchEngine';
import { searchTinyFish, buildAnswerFromTinyFish, TinyFishSearchResultItem } from '@/lib/tinyfish';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

interface CopilotRequestBody {
  query: string;
  history?: Array<{ query: string; answer: Partial<SynthesizedAnswer> }>;
}

function buildSystemPrompt(
  contextSnippets: string,
  liveWebSnippets: string,
  marketSnapshot: string,
  assetSummary: string
) {
  return `You are the Reliance Petrochemicals & O2C analytics copilot embedded in an internal decision-support dashboard.
You have domain knowledge over:
1. Reliance Industries Limited (RIL) O2C Business: Jamnagar, Dahej Cryogenic Terminal, Hazira, Nagothane, Vadodara, a VLEC fleet importing US ethane, and downstream polymer assets.
2. Macroeconomics: Brent crude, US Mont Belvieu ethane prices, Asian Naphtha CFR, USD/INR, shipping freight rates, global petchem supply additions.
3. Cracker economics: ethane cracking yields ~79.5% ethylene vs ~33.2% for naphtha; ethane is priced off US gas fundamentals and is largely decoupled from Brent, while naphtha tracks Brent closely.

CURRENT LIVE MARKET DATA:
${marketSnapshot}

RELIANCE CRACKER ASSETS:
${assetSummary}

RETRIEVED PROJECT CONTEXT:
${contextSnippets || 'Reliance O2C operational architecture and feedstock balances.'}

REAL-TIME WEB INTELLIGENCE:
${liveWebSnippets || 'No external web search results found; answer from internal project data.'}

RULES:
- Ground every number in the data given above, or say plainly when you are estimating.
- Seamlessly blend real-time market data, web intelligence, and cracker economics.
- Be direct, strategic, and quantitative. No filler.
- Respond with ONLY valid JSON, no markdown fences, matching exactly this schema:
{
  "answer": "Full analytical answer.",
  "keyTakeaway": "1-2 sentence bottom line.",
  "category": "FACT" | "OPTIMIZATION" | "MACRO" | "MICRO" | "MODEL OUTPUT",
  "evidence": [{ "sourceTitle": "string", "date": "string", "pageOrLine": "string", "quote": "string" }],
  "numericalData": [{ "label": "string", "value": "string", "context": "string" }],
  "assumptions": ["string"],
  "uncertainty": "string",
  "relatedAnalysis": ["/economics", "/simulation", "/market", "/financial"]
}`;
}

function extractJson(text: string): unknown {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

function toSynthesizedAnswer(
  parsed: unknown,
  trimmedQuery: string,
  searchHits: ReturnType<typeof performHybridSearch>,
  webHits: TinyFishSearchResultItem[]
): SynthesizedAnswer | null {
  const p = parsed as Record<string, unknown> | null;
  if (!p || typeof p.answer !== 'string') return null;

  let evidenceList: SynthesizedAnswer['evidence'] =
    Array.isArray(p.evidence) && p.evidence.length > 0
      ? (p.evidence as SynthesizedAnswer['evidence'])
      : [];

  if (evidenceList.length === 0) {
    // Populate with live web results first
    const webEvidence = webHits.slice(0, 3).map((w) => ({
      sourceTitle: `${w.site_name}: ${w.title}`,
      date: w.date || 'Live 2026',
      pageOrLine: w.url,
      quote: w.snippet
    }));

    // Followed by local hybrid search hits
    const localEvidence = searchHits.slice(0, 2).map((h) => ({
      sourceTitle: h.source.sourceTitle,
      date: h.source.date || '2026',
      pageOrLine: h.source.pageOrSection || 'Project Store',
      quote: h.exactQuote || h.snippet
    }));

    evidenceList = [...webEvidence, ...localEvidence];
  }

  return {
    question: trimmedQuery,
    answer: p.answer,
    keyTakeaway: typeof p.keyTakeaway === 'string' ? p.keyTakeaway : '',
    category: (p.category as SynthesizedAnswer['category']) || 'FACT',
    evidence: evidenceList,
    numericalData: Array.isArray(p.numericalData) ? (p.numericalData as SynthesizedAnswer['numericalData']) : [],
    assumptions: Array.isArray(p.assumptions) ? (p.assumptions as string[]) : [],
    uncertainty: typeof p.uncertainty === 'string' ? p.uncertainty : 'Grounded in real-time market search & RIL model telemetry.',
    relatedAnalysis: Array.isArray(p.relatedAnalysis) ? (p.relatedAnalysis as string[]) : ['/economics', '/simulation', '/market'],
    requiredAgents: ['Real-Time Search Engine', 'RIL O2C Copilot Engine']
  };
}

async function tryOnlineLLM(systemPrompt: string, query: string): Promise<{ text: string } | null> {
  const controller = new AbortController();
  // Fast 5.5s timeout for snappy responses
  const timeoutId = setTimeout(() => controller.abort(), 5500);
  try {
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        model: 'openai',
        jsonMode: true,
        seed: 42
      }),
      signal: controller.signal
    });
    if (!response.ok) return null;
    const text = await response.text();
    return { text };
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(req: Request) {
  try {
    const body: CopilotRequestBody = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'A query string is required.' }, { status: 400 });
    }
    const trimmedQuery = query.trim();

    // 1. Fetch internal hybrid search context and backend real-time web search in parallel
    const [searchHits, webHits] = await Promise.all([
      Promise.resolve(performHybridSearch(trimmedQuery)),
      searchTinyFish(trimmedQuery, { limit: 5 })
    ]);

    const contextSnippets = searchHits
      .slice(0, 4)
      .map(
        (hit, i) =>
          `[Internal ${i + 1}] Source: "${hit.source.sourceTitle}" (${hit.source.date || 'Active'})\n` +
          `Section: ${hit.source.pageOrSection || 'Project Store'}\n` +
          `Content: ${hit.snippet} ${hit.exactQuote ? `Quote: "${hit.exactQuote}"` : ''}`
      )
      .join('\n\n');

    const liveWebSnippets = webHits
      .slice(0, 4)
      .map(
        (w, i) =>
          `[Web Search ${i + 1}] Source: "${w.title}" (${w.site_name}${w.date ? ` • ${w.date}` : ''})\n` +
          `URL: ${w.url}\n` +
          `Content: ${w.snippet}`
      )
      .join('\n\n');

    const marketSnapshot = MARKET_COMMODITIES.slice(0, 8)
      .map((c) => {
        const intel = COMMODITY_INTELLIGENCE[c.id];
        const note = intel ? ` — ${intel.relianceImpact}` : '';
        return `${c.name} (${c.symbol}): $${c.currentPrice} ${c.currency}/${c.unit} (1D: ${c.change1D > 0 ? '+' : ''}${c.change1D}%)${note}`;
      })
      .join('\n');

    const assetSummary = CRACKER_ASSETS.map(
      (a) =>
        `${a.siteName}: ${a.ethyleneCapacityKTA} KTA Ethylene, ${a.propyleneCapacityKTA} KTA Propylene, NPV $${a.npvUSD_Mn}M, IRR ${a.irrPct}%, Status: ${a.currentScheduleStatus}.`
    ).join('\n');

    const systemPrompt = buildSystemPrompt(contextSnippets, liveWebSnippets, marketSnapshot, assetSummary);

    // 2. Query cloud intelligence with real-time web context
    let providerUsed = 'RIL Intelligence Engine (Live Web + Cloud)';
    let raw = await tryOnlineLLM(systemPrompt, trimmedQuery);

    let synthesizedResult: SynthesizedAnswer | null = null;
    if (raw) {
      try {
        const parsed = extractJson(raw.text);
        synthesizedResult = toSynthesizedAnswer(parsed, trimmedQuery, searchHits, webHits);
      } catch {
        synthesizedResult = null;
      }
    }

    // 3. High-speed synthesis fallback from real-time web intelligence
    if (!synthesizedResult) {
      providerUsed = 'RIL Intelligence Engine (Live Web Search)';
      synthesizedResult = buildAnswerFromTinyFish(trimmedQuery, webHits);
    }

    return NextResponse.json({
      success: true,
      answer: synthesizedResult,
      provider: providerUsed,
      timestamp: new Date().toISOString()
    });
  } catch (err: unknown) {
    console.error('Fatal error in /api/ai/copilot route:', err);
    return NextResponse.json(
      { error: 'Failed to synthesize AI copilot response.', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
