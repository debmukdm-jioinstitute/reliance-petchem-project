import { NextResponse } from 'next/server';
import { MARKET_COMMODITIES, CRACKER_ASSETS } from '@/data/knowledgeStore';
import { COMMODITY_INTELLIGENCE } from '@/data/commodityIntelligence';
import { performHybridSearch, SynthesizedAnswer } from '@/lib/searchEngine';

export const dynamic = 'force-dynamic';
// Generous ceiling for the local-model path: on Vercel, Ollama is
// unreachable and fails in well under a second, so this only matters when
// running locally against a real (often CPU-bound) Ollama instance.
export const maxDuration = 60;

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5:1.5b';

interface CopilotRequestBody {
  query: string;
  history?: Array<{ query: string; answer: Partial<SynthesizedAnswer> }>;
}

function buildSystemPrompt(contextSnippets: string, marketSnapshot: string, assetSummary: string) {
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
${contextSnippets || 'No direct keyword match in the document store; answer from the market data, asset data, and general cracker-economics principles above.'}

RULES:
- Ground every number in the data given above, or say plainly when you are estimating.
- Never invent a citation, speaker, or document that was not given to you in the RETRIEVED PROJECT CONTEXT above.
- Be direct and quantitative. No filler.
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
  searchHits: ReturnType<typeof performHybridSearch>
): SynthesizedAnswer | null {
  const p = parsed as Record<string, unknown> | null;
  if (!p || typeof p.answer !== 'string') return null;

  let evidenceList: SynthesizedAnswer['evidence'] = Array.isArray(p.evidence) && p.evidence.length > 0 ? (p.evidence as SynthesizedAnswer['evidence']) : [];
  if (evidenceList.length === 0 && searchHits.length > 0) {
    evidenceList = searchHits.slice(0, 3).map((h) => ({
      sourceTitle: h.source.sourceTitle,
      date: h.source.date || '2026',
      pageOrLine: h.source.pageOrSection || 'Project Document Store',
      quote: h.exactQuote || h.snippet
    }));
  }

  return {
    question: trimmedQuery,
    answer: p.answer,
    keyTakeaway: typeof p.keyTakeaway === 'string' ? p.keyTakeaway : '',
    category: (p.category as SynthesizedAnswer['category']) || 'FACT',
    evidence: evidenceList,
    numericalData: Array.isArray(p.numericalData) ? (p.numericalData as SynthesizedAnswer['numericalData']) : [],
    assumptions: Array.isArray(p.assumptions) ? (p.assumptions as string[]) : [],
    uncertainty: typeof p.uncertainty === 'string' ? p.uncertainty : '',
    relatedAnalysis: Array.isArray(p.relatedAnalysis) ? (p.relatedAnalysis as string[]) : ['/economics', '/simulation'],
    requiredAgents: []
  };
}

async function tryOllama(systemPrompt: string, query: string): Promise<{ text: string } | null> {
  const controller = new AbortController();
  // Small local models on CPU can take 15-25s for a prompt this size. On
  // Vercel this never matters: the fetch fails almost instantly since
  // nothing is listening on 127.0.0.1 there.
  const timeoutId = setTimeout(() => controller.abort(), 55000);
  try {
    const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        format: 'json',
        stream: false,
        options: { temperature: 0.2, num_predict: 500 }
      }),
      signal: controller.signal
    });
    if (!response.ok) return null;
    const data = await response.json();
    const text = data?.message?.content;
    return typeof text === 'string' ? { text } : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function tryPollinations(systemPrompt: string, query: string): Promise<{ text: string } | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 14000);
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

    const searchHits = performHybridSearch(trimmedQuery);
    const contextSnippets = searchHits
      .slice(0, 6)
      .map(
        (hit, i) =>
          `[Doc ${i + 1}] Source: "${hit.source.sourceTitle}" (${hit.source.date || 'Active'})\n` +
          `Section: ${hit.source.pageOrSection || 'Document'}\n` +
          `Content: ${hit.snippet} ${hit.exactQuote ? `Quote: "${hit.exactQuote}"` : ''}`
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

    const systemPrompt = buildSystemPrompt(contextSnippets, marketSnapshot, assetSummary);

    // Local LLM (Ollama) is the default engine. It runs on this machine, so it
    // only answers when the dashboard is running locally with `ollama serve`
    // active — a deployed/hosted copy of this site cannot reach it.
    let providerUsed = `Local LLM (Ollama · ${OLLAMA_MODEL})`;
    let raw = await tryOllama(systemPrompt, trimmedQuery);

    if (!raw) {
      providerUsed = 'Online LLM (fallback)';
      raw = await tryPollinations(systemPrompt, trimmedQuery);
    }

    let synthesizedResult: SynthesizedAnswer | null = null;
    if (raw) {
      try {
        const parsed = extractJson(raw.text);
        synthesizedResult = toSynthesizedAnswer(parsed, trimmedQuery, searchHits);
      } catch {
        synthesizedResult = null;
      }
    }

    if (!synthesizedResult) {
      return NextResponse.json({
        success: false,
        answer: {
          question: trimmedQuery,
          answer:
            'No AI engine responded. The local Ollama model could not be reached, and the online fallback did not return a usable answer. Start Ollama locally (`ollama serve`, model: ' +
            OLLAMA_MODEL +
            ') and try again.',
          keyTakeaway: 'AI engine unavailable — no answer was generated.',
          category: 'FACT',
          evidence: [],
          numericalData: [],
          assumptions: [],
          uncertainty: 'No model output to assess.',
          relatedAnalysis: [],
          requiredAgents: []
        },
        provider: 'None (engines unavailable)',
        timestamp: new Date().toISOString()
      });
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
