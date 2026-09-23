import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { MARKET_COMMODITIES, CRACKER_ASSETS } from '@/data/knowledgeStore';
import { COMMODITY_INTELLIGENCE } from '@/data/commodityIntelligence';
import { performHybridSearch, SynthesizedAnswer } from '@/lib/searchEngine';
import { searchTinyFish, buildAnswerFromTinyFish, TinyFishSearchResultItem } from '@/lib/tinyfish';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ─── Groq client ────────────────────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || '' });

// Primary: 120B flagship model on this Groq key
const GROQ_PRIMARY   = 'openai/gpt-oss-120b';
// Fallback: fast 20B model
const GROQ_FALLBACK  = 'openai/gpt-oss-20b';

// ─── Request body ────────────────────────────────────────────────────────────
interface CopilotRequestBody {
  query:   string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  stream?:  boolean;
}

// ─── System prompt builder ───────────────────────────────────────────────────
function buildSystemPrompt(
  contextSnippets: string,
  liveWebSnippets: string,
  marketSnapshot:  string,
  assetSummary:    string
): string {
  return `You are RIL Intelligence — the elite AI copilot for Reliance Industries Limited's O2C & Petrochemicals division, embedded inside an executive intelligence dashboard.

## Scope
You are an expert on ALL topics — petrochemicals, macroeconomics, geopolitics, finance, science, technology, business strategy, and general knowledge. No question is out of scope.

## Core RIL Domain Knowledge
• **Assets**: Jamnagar (~1.24 MMTPA ethylene), Dahej Cryogenic Terminal (US ethane import hub), Hazira, Nagothane, Vadodara, VLEC fleet, downstream polymer & MEG assets.
• **Cracker economics**: Ethane → ~79.5% ethylene yield vs ~33.2% naphtha. Ethane priced off Mont Belvieu (US gas fundamentals, Brent-decoupled). Naphtha tracks Brent tightly. RIL structural margin advantage = $150–250/t over naphtha crackers.
• **Macro drivers**: Brent crude, Mont Belvieu ethane, Asian Naphtha CFR, USD/INR FX, VLCC freight, global petchem capacity additions, China demand cycle.

## Live Market Data (Use For All Calculations)
${marketSnapshot}

## RIL Cracker Asset Portfolio
${assetSummary}

## Internal Project Intelligence (RAG)
${contextSnippets || 'No direct keyword match — answer from market data, asset data, and domain expertise.'}

## Real-Time Web Intelligence (TinyFish)
${liveWebSnippets || 'No live web results — answering from internal knowledge and market data.'}

## Response Format
Respond in **clean, well-structured Markdown**:
1. **Executive Summary** — 2-3 sentence bottom line with the decisive answer
2. **Detailed Analysis** — full reasoning with quantitative data
3. **Key Metrics** — table of the most important numbers (if applicable)
4. **Strategic Implication** — what RIL should do / what this means

## Rules
- Be **direct and quantitative** — cite every number's source
- **Any topic is welcome** — answer general questions as a world-class expert
- For calculations, show your working
- Never fabricate citations not present in context above`;
}

// ─── Helper: market data strings ─────────────────────────────────────────────
function buildMarketSnapshot(): string {
  return MARKET_COMMODITIES.slice(0, 10)
    .map((c) => {
      const intel = COMMODITY_INTELLIGENCE[c.id];
      const note = intel ? ` — ${intel.relianceImpact}` : '';
      return `• ${c.name} (${c.symbol}): **$${c.currentPrice} ${c.currency}/${c.unit}** | 1D: ${c.change1D > 0 ? '+' : ''}${c.change1D}% | 1Y: ${c.change1Y}%${note}`;
    })
    .join('\n');
}

function buildAssetSummary(): string {
  return CRACKER_ASSETS.map(
    (a) =>
      `• ${a.siteName}: ${a.ethyleneCapacityKTA} KTA ethylene, ${a.propyleneCapacityKTA} KTA propylene | NPV $${a.npvUSD_Mn}M | IRR ${a.irrPct}% | ${a.currentScheduleStatus}`
  ).join('\n');
}

// ─── Helper: RAG context + web context ───────────────────────────────────────
function buildContext(query: string): {
  contextSnippets: string;
  searchHits: ReturnType<typeof performHybridSearch>;
} {
  const searchHits = performHybridSearch(query);
  const contextSnippets = searchHits
    .slice(0, 5)
    .map(
      (hit, i) =>
        `[Doc ${i + 1}: "${hit.source.sourceTitle}" — ${hit.source.pageOrSection || 'Document'}]\n${hit.snippet}${hit.exactQuote ? `\n→ "${hit.exactQuote}"` : ''}`
    )
    .join('\n\n');
  return { contextSnippets, searchHits };
}

function buildWebSnippets(webHits: TinyFishSearchResultItem[]): string {
  return webHits
    .slice(0, 5)
    .map(
      (w, i) =>
        `[Web ${i + 1}: "${w.title}" via ${w.site_name}${w.date ? ` (${w.date})` : ''}]\n${w.snippet}\nURL: ${w.url}`
    )
    .join('\n\n');
}

// ─── Parse markdown text into SynthesizedAnswer ───────────────────────────────
function parseToSynthesized(
  markdownText: string,
  query: string,
  searchHits: ReturnType<typeof performHybridSearch>,
  webHits: TinyFishSearchResultItem[]
): SynthesizedAnswer {
  // Extract executive summary as key takeaway
  const execMatch = markdownText.match(
    /##?\s*\*?\*?Executive Summary\*?\*?[\s\S]*?\n+([\s\S]*?)(?=\n##|\n\*\*[A-Z]|$)/i
  );
  const rawTakeaway = execMatch
    ? execMatch[1].replace(/\*\*/g, '').replace(/^[-•]\s*/gm, '').trim()
    : markdownText.slice(0, 250).replace(/#+\s*/g, '').replace(/\*\*/g, '').trim();
  const keyTakeaway = rawTakeaway.slice(0, 350);

  // Category detection
  const lower = query.toLowerCase();
  let category: SynthesizedAnswer['category'] = 'FACT';
  if (lower.match(/optim|allocat|best|switch|hedg/)) category = 'OPTIMIZATION';
  else if (lower.match(/brent|crude|macro|geopolit|opec|fed|inflation|gdp/)) category = 'MACRO';
  else if (lower.match(/margin|ebitda|spread|cost|yield|profit|revenue/)) category = 'MICRO';
  else if (lower.match(/model|scenario|forecast|simulation|monte carlo|predict/)) category = 'MODEL OUTPUT';

  // Extract numerical metrics (bold pattern: **value**)
  const numericalData: SynthesizedAnswer['numericalData'] = [];
  const numRe = /([A-Za-z][^|*\n]{3,50}?):\s*\*\*([^*\n]+)\*\*/g;
  let m;
  let count = 0;
  while ((m = numRe.exec(markdownText)) !== null && count < 8) {
    const val = m[2].trim();
    if (/[\d$₹€£%]/.test(val)) {
      numericalData.push({ label: m[1].trim(), value: val, context: '' });
      count++;
    }
  }

  // Build evidence: web hits first, then RAG hits
  const evidence: SynthesizedAnswer['evidence'] = [
    ...webHits.slice(0, 3).map((w) => ({
      sourceTitle: `${w.site_name}: ${w.title}`,
      date: w.date || 'Live 2026',
      pageOrLine: w.url,
      quote: w.snippet.slice(0, 200),
    })),
    ...searchHits.slice(0, 2).map((h) => ({
      sourceTitle: h.source.sourceTitle,
      date: h.source.date || '2026',
      pageOrLine: h.source.pageOrSection || 'Project Document Store',
      quote: (h.exactQuote || h.snippet).slice(0, 200),
    })),
  ];

  return {
    question: query,
    answer: markdownText,
    keyTakeaway,
    category,
    evidence,
    numericalData,
    assumptions: [],
    uncertainty:
      'Based on Groq AI analysis, live market data, and TinyFish real-time web intelligence. Verify critical decisions against primary sources.',
    relatedAnalysis: ['/economics', '/simulation', '/feedstock-tracker', '/financial', '/risk-sentinel'],
    requiredAgents: ['Groq Intelligence Engine', 'TinyFish Real-Time Search'],
  };
}

// ─── Main POST handler ────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body: CopilotRequestBody = await req.json();
    const { query, history = [], stream: requestStream = false } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'A query string is required.' }, { status: 400 });
    }
    const trimmedQuery = query.trim();

    const hasGroqKey = !!process.env.GROQ_API_KEY;

    // ── Build RAG context + fire TinyFish search in parallel ──────────────────
    const { contextSnippets, searchHits } = buildContext(trimmedQuery);
    const marketSnapshot = buildMarketSnapshot();
    const assetSummary   = buildAssetSummary();

    // TinyFish web search runs concurrently while we prepare the prompt
    const webHitsPromise = searchTinyFish(trimmedQuery, { limit: 6 });

    // ── No Groq key: return TinyFish-only answer immediately ──────────────────
    if (!hasGroqKey) {
      const webHits = await webHitsPromise;
      const fallback = buildAnswerFromTinyFish(trimmedQuery, webHits);
      return NextResponse.json({
        success: true,
        answer: {
          ...fallback,
          answer:
            '⚠️ **Groq API key not configured.**\n\nAdd `GROQ_API_KEY` to your Vercel environment variables (or `.env.local` for local dev) to unlock full AI power.\n\nGet a **free key** at [console.groq.com](https://console.groq.com) in under 30 seconds.\n\n---\n\n**Live TinyFish Web Results for your query:**\n\n' +
            fallback.answer,
        },
        provider: 'TinyFish Live Search (Groq not configured)',
        webSearchUsed: webHits.length > 0,
        timestamp: new Date().toISOString(),
      });
    }

    // ── Groq path ─────────────────────────────────────────────────────────────
    const webHits = await webHitsPromise;
    const liveWebSnippets = buildWebSnippets(webHits);

    const systemPrompt = buildSystemPrompt(
      contextSnippets,
      liveWebSnippets,
      marketSnapshot,
      assetSummary
    );

    // Multi-turn conversation messages
    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-8),
      { role: 'user', content: trimmedQuery },
    ];

    // ── STREAMING MODE ────────────────────────────────────────────────────────
    if (requestStream) {
      const encoder = new TextEncoder();

      const readable = new ReadableStream({
        async start(controller) {
          const send = (data: object) =>
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

          let fullText = '';
          let providerUsed = '';

          try {
            // Try compound-beta first (has native web search)
            let stream: AsyncIterable<Groq.Chat.ChatCompletionChunk>;
            try {
              stream = await groq.chat.completions.create({
                model: GROQ_PRIMARY,
                messages,
                stream: true,
                temperature: 0.25,
                max_tokens: 2048,
              });
              providerUsed = 'Groq gpt-oss-120b · TinyFish web search';
            } catch {
              // Fallback to llama-3.3-70b
              stream = await groq.chat.completions.create({
                model: GROQ_FALLBACK,
                messages,
                stream: true,
                temperature: 0.25,
                max_tokens: 2048,
              });
              providerUsed = 'Groq gpt-oss-20b · TinyFish web search';
            }

            for await (const chunk of stream) {
              const delta = chunk.choices[0]?.delta?.content || '';
              if (delta) {
                fullText += delta;
                send({ type: 'delta', content: delta, provider: providerUsed });
              }
            }

            // Finalize with structured answer
            const synthesized = parseToSynthesized(fullText, trimmedQuery, searchHits, webHits);
            send({
              type: 'done',
              answer: synthesized,
              provider: providerUsed,
              webSearchUsed: webHits.length > 0,
              timestamp: new Date().toISOString(),
            });
          } catch (err) {
            // Groq failed — fall back to TinyFish-only structured answer
            const fallback = buildAnswerFromTinyFish(trimmedQuery, webHits);
            send({
              type: 'done',
              answer: fallback,
              provider: 'TinyFish Live Search (Groq fallback)',
              webSearchUsed: webHits.length > 0,
              error: err instanceof Error ? err.message : 'Groq unavailable',
              timestamp: new Date().toISOString(),
            });
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type':  'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          Connection:      'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      });
    }

    // ── NON-STREAMING MODE (fallback for clients that don't support SSE) ──────
    let fullText = '';
    let providerUsed = '';
    let webSearchUsed = webHits.length > 0;

    try {
      let completion: Groq.Chat.ChatCompletion;
      try {
        completion = await groq.chat.completions.create({
          model: GROQ_PRIMARY,
          messages,
          stream: false,
          temperature: 0.25,
          max_tokens: 2048,
        });
        providerUsed = 'Groq gpt-oss-120b · TinyFish web search';
      } catch {
        completion = await groq.chat.completions.create({
          model: GROQ_FALLBACK,
          messages,
          stream: false,
          temperature: 0.25,
          max_tokens: 2048,
        });
        providerUsed = 'Groq gpt-oss-20b · TinyFish web search';
      }

      fullText = completion.choices[0]?.message?.content || '';
    } catch (err) {
      console.warn('Groq unavailable, falling back to TinyFish:', err);
    }

    // If Groq returned nothing, use TinyFish-only answer
    if (!fullText) {
      const fallback = buildAnswerFromTinyFish(trimmedQuery, webHits);
      return NextResponse.json({
        success: true,
        answer: fallback,
        provider: 'TinyFish Live Search (Groq fallback)',
        webSearchUsed,
        timestamp: new Date().toISOString(),
      });
    }

    const synthesized = parseToSynthesized(fullText, trimmedQuery, searchHits, webHits);
    return NextResponse.json({
      success: true,
      answer: synthesized,
      provider: providerUsed,
      webSearchUsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error('Fatal error in /api/ai/copilot:', err);
    return NextResponse.json(
      {
        error: 'Failed to synthesize AI response.',
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
