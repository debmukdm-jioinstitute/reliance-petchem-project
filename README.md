# Reliance Intelligence Platform

> **An AI-powered petrochemical analytics dashboard built to model feedstock economics, simulate capital project risk, and surface real-time market intelligence across the Reliance O2C cracker business.**

[![Platform](https://img.shields.io/badge/Platform-Next.js_16-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![AI Engine](https://img.shields.io/badge/AI-TinyFish_Intelligence_Engine-BFA161?style=for-the-badge)](https://tinyfish.ai)
[![Charts](https://img.shields.io/badge/Charts-Apache_ECharts-AA344D?style=for-the-badge)](https://echarts.apache.org)
[![Status](https://img.shields.io/badge/Status-Live_on_Vercel-10B981?style=for-the-badge)](https://reliance-petchem-project.vercel.app)
[![License](https://img.shields.io/badge/License-Academic_Project-6366F1?style=for-the-badge)](#)

**Live demo →** [reliance-petchem-project.vercel.app](https://reliance-petchem-project.vercel.app)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Application Modules](#3-application-modules)
4. [Monte Carlo Simulation Engine](#4-monte-carlo-simulation-engine)
5. [AI Copilot Architecture](#5-ai-copilot-architecture)
6. [SCADA Digital Twin](#6-scada-digital-twin)
7. [Market Intelligence Layer](#7-market-intelligence-layer)
8. [Data Architecture](#8-data-architecture)
9. [Running Locally](#9-running-locally)
10. [Project Structure](#10-project-structure)

---

## 1. Project Overview

The **Reliance Intelligence Platform** is a full-stack, production-grade analytics dashboard that models the economics of petrochemical cracking — specifically the business case for switching feedstock from **naphtha** to **US-imported ethane** across an integrated cracker network.

The platform answers three strategic questions:

| Question | Module |
|---|---|
| What are the current margins, spreads, and price positions? | Market Intelligence, SCADA Simulator |
| What is the risk-adjusted NPV/IRR of the capacity expansion? | Monte Carlo Engine |
| What does real-time AI analysis tell us about any business question? | AI Copilot |

The application is designed around a **warm, light-theme premium UI** (cream and white surfaces, amber accents) inspired by the clarity of Bloomberg Terminal data density, delivered through a modern consumer-grade interface.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Server + Client Components) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Apache ECharts (via `echarts-for-react`) |
| **AI / Search** | TinyFish Web Intelligence Engine (white-labelled as RIL Intelligence Engine) |
| **Market Data** | Yahoo Finance API (real-time via `/api/prices` server route) |
| **News Feeds** | Multi-source RSS aggregation (Reuters, Bloomberg, Platts) |
| **Deployment** | Vercel (Edge runtime for API routes) |
| **State Management** | React Context (`MarketContext`) |

---

## 3. Application Modules

### 3.1 Home Dashboard (`/`)

The command center of the platform. On load it:

- Fetches live commodity prices (Brent crude, Asian naphtha, US ethane, ethylene, propylene, USD/INR) from Yahoo Finance via the `/api/prices` route.
- Renders an **Ask Intelligence** box where users can type any natural-language question and get an AI-synthesized answer inline without leaving the page.
- Displays a **Key Market Benchmarks** panel with interactive time filters (Live / 1D / 1W / 1M) and a mini Brent chart.
- Shows a real-time **cracker value chain** metric strip — feedstock cost, ethylene margin, and feedstock spread.

---

### 3.2 AI Copilot Studio (`/ai`)

The main conversational AI interface. See [Section 5](#5-ai-copilot-architecture) for deep-dive architecture.

Key features:
- A **hero chat bar** embedded in a full-bleed refinery hero card.
- Answers classified by type: `FACT`, `OPTIMIZATION`, `MACRO`, `MICRO`, `MODEL OUTPUT`.
- Every answer includes an **Executive Key Takeaway**, full briefing, grounded numerical metrics, and verified source citations with external links.
- **Audit Trail Inspector** — every AI answer has a traceable `auditRecordId` that links back to the reasoning chain.
- Persistent conversation history within the session; previous queries displayed as clickable pills.

---

### 3.3 Market Intelligence (`/market`)

A Bloomberg-style market intelligence terminal.

- **Live ticker strip** — real-time prices with Δ% change badges (green for positive, red for negative).
- **Cracker Value Chain flow diagram** — visual representation of: `Feed Cost → Cracker → Ethylene + Propylene → Margin`.
- **Multi-feedstock spread table** — side-by-side comparison of Ethane vs Naphtha vs Propane economics.
- **Interactive ECharts** — price history charts with zoom, pan, and tooltip overlays.
- **Return ledger** — short-term and long-term price return calculations across all tracked commodities.

---

### 3.4 SCADA Cracker Digital Twin (`/simulation`)

A real-time simulation of cracker plant operations. See [Section 6](#6-scada-digital-twin) for full details.

---

### 3.5 Scenarios & Monte Carlo (`/scenarios` and `/scenarios/monte-carlo`)

The full probabilistic capital project risk engine. See [Section 4](#4-monte-carlo-simulation-engine) for the complete technical deep-dive.

The `/scenarios` route provides:
- An interactive **multi-variable scenario builder** with 3 preset modes (Bear / Base / Bull).
- **EBITDA waterfall charts** showing which variables drive margin changes.
- **Decision tree** — nested branching analysis of feedstock decisions and expansion timing.

---

### 3.6 Cracker Value Chain Economics (`/economics`)

A detailed economics model of the ethane vs naphtha cracking decision:

- **Feedstock cost comparison** — raw dollar-per-tonne cost differentials.
- **Ethylene yield uplift** — ethane cracks to ~79.5% ethylene yield vs ~33.2% for naphtha.
- **Cash cost stack** — building-block breakdown from raw feed through to delivered ethylene.
- **Spread sensitivity** — how EBITDA per tonne changes as Brent, ethane, and FX move.

---

### 3.7 LP Feedstock Optimizer (`/optimization`)

A linear-programming-inspired feedstock allocation tool:

- Inputs: available feed volumes, price constraints, yield coefficients.
- Outputs: optimal feed mix that maximises contribution margin.
- Visual output: stacked bar charts of margin by feed type.

---

### 3.8 Energy Price Risk Sentinel (`/risk-sentinel`)

A warm bento-grid risk dashboard that monitors:

- **Macro threat matrix** — geopolitical, supply, demand, and currency risk signals.
- **Price shock scenarios** — how a +$10/bbl Brent spike, a 10% ethane price rise, or a ₹2 FX move flows through to EBITDA.
- **Threat severity badges** — color-coded risk levels (Critical, High, Medium, Watch).

---

### 3.9 Cracker Operations & VLEC Fleet (`/operations`)

Tracks the physical logistics of the ethane import chain:

- **VLEC fleet status** — vessel positions, utilisation, and cargo schedules.
- **Dahej Cryogenic Terminal** — throughput metrics and utilisation.
- **Sub-day switching dynamics** — how fast the LP optimizer can shift feedstock mix.
- **Plant mass balance** — feed-in vs product-out reconciliation.

---

### 3.10 Price Forecasts (`/forecasts`)

A multi-model quantitative forecasting engine:

- **AutoARIMA** — automatic lag and differencing selection, fitted per commodity.
- **ETS (Exponential Triple Smoothing)** — captures level, trend, and seasonality.
- **LightGBM gradient boosting** — non-linear tree model trained on macroeconomic features.
- **Google TimesFM representation** — foundation-model-style time-series forecasting.
- **Ensemble output** — weighted average of all four models.
- **Backtesting panel** — out-of-sample MAE, RMSE, and MAPE for each model so accuracy is transparent.

---

### 3.11 Financial Realization Model (`/financial`)

A formula-driven Discounted Cash Flow (DCF) model:

- **Five cracker assets**: Jamnagar, Dahej, Hazira, Nagothane, Vadodara.
- **Editable assumption register** — users can change WACC, growth rates, terminal multiples.
- **Sensitivity tables** — two-way NPV grids varying WACC and EBITDA margin.
- **INR ↔ USD conversion** — all outputs dual-labelled.

---

### 3.12 Competitive Intelligence (`/competitive-intelligence`)

A peer benchmarking matrix:

- **AI use case comparison** — how ExxonMobil, Dow, SABIC, BASF, and LyondellBasell use AI in operations vs how the RIL platform approaches similar problems.
- **Global capacity oversupply** — world ethylene capacity additions vs demand growth chart.
- **China exposure table** — peer companies' percentage of revenue at risk from Asian oversupply.

---

### 3.13 AI Research Library (`/ai-research`)

Curated academic literature:

- Peer-reviewed papers from ACS Omega, ScienceDirect, and Ind. Eng. Chem. Res.
- Topics: ethane cracking kinetics, furnace coil-outlet temperature (COT) optimization, SCADA AI integration, and feedstock flexibility modeling.

---

### 3.14 Data Intelligence (`/data`)

Infrastructure health and data quality layer:

- **DataProvider registry** — tracks each active data source (Yahoo Finance, RSS feeds, internal knowledge store).
- **Latency monitor** — round-trip response time for each provider.
- **Data quality scoring** — freshness, completeness, and anomaly flags per feed.

---

### 3.15 Alerts Engine (`/alerts`)

Automated market shock detection:

- Price crossing pre-defined thresholds triggers an alert card.
- Alerts are classified by severity: `CRITICAL`, `HIGH`, `MEDIUM`, `INFO`.
- Each alert links to the relevant dashboard module for immediate drill-down.

---

### 3.16 Action Center (`/actions`)

Project execution tracking:

- Extracted action items with owners, deadlines, and priority levels.
- Execution evidence tracking — what was delivered vs what was committed.

---

### 3.17 Knowledge Graph (`/knowledge-graph`)

A Palantir-style interactive force-directed network graph:

- **Nodes**: cracker plants, commodities, entities, financial metrics, risk factors.
- **Edges**: causal and relational links (e.g., "Brent → Naphtha Price → Cracker Margin").
- Users can click any node to highlight its relationship cluster.
- Built with a physics-based simulation for natural, explorable layouts.

---

### 3.18 Settings (`/settings`)

Configuration panel:

- AI model router toggle (RIL Intelligence Engine / custom endpoints).
- Theme and display preferences.

---

## 4. Monte Carlo Simulation Engine

> **The most technically sophisticated component of the platform.** The engine lives in [`src/lib/monteCarlo.ts`](src/lib/monteCarlo.ts) and is invoked by the [`/scenarios/monte-carlo`](/scenarios/monte-carlo) page. It runs up to **10,000 independent economic simulations** in the browser, each producing a full P&L, NPV, IRR, and payback estimate.

---

### 4.1 Purpose

Capital investment decisions in petrochemicals involve deep uncertainty across commodity prices, exchange rates, construction costs, and plant reliability. A single-point estimate ("the NPV is $X billion") is misleading because it hides the range of outcomes. The Monte Carlo engine replaces the single estimate with a **probability distribution** — answering questions like:

- *What is the probability that this investment has a negative NPV?*
- *What is the P10 (worst-likely) vs P90 (best-likely) IRR?*
- *Which single variable — ethane price, Brent, or startup delay — causes the most NPV damage if it moves against us?*

---

### 4.2 Random Number Generation

The engine uses the **mulberry32 PRNG** — a deterministic, fast pseudo-random number generator:

```
a = (a + 0x6d2b79f5) | 0
t = imul(a ^ (a >>> 15), 1 | a)
t = (t + imul(t ^ (t >>> 7), 61 | t)) ^ t
output = (t ^ (t >>> 14)) >>> 0 / 4294967296
```

**Why deterministic?** Identical seeds reproduce identical simulation runs. This means results are reproducible and auditable — the same configuration always yields the same distribution.

**Box-Muller transform** converts uniform random numbers into standard normal (Gaussian) samples, which are needed for the normal distribution and for the Gaussian copula correlation model.

---

### 4.3 Variable Distributions

The engine supports three statistical distribution types:

#### Triangular Distribution

Used for commodity prices (Brent, naphtha, ethane, ethylene, propylene), capital overrun, and plant utilisation. Requires three parameters:

| Parameter | Description |
|---|---|
| `min` | Lowest physically plausible value |
| `mode` | Most likely value (peak of the triangle) |
| `max` | Highest physically plausible value |

Sampling uses the **analytical inverse CDF**:

```
Fc = (mode − min) / (max − min)   ← breakpoint

if U < Fc:  X = min + √(U × (max − min) × (mode − min))
else:        X = max − √((1−U) × (max − min) × (max − mode))
```

This produces asymmetric distributions — for example, capital overrun is modelled with mode at +5% but max at +30%, correctly reflecting that megaprojects rarely come in under budget but can overrun significantly.

#### Normal (Gaussian) Distribution

Used for USD/INR exchange rate and WACC, which are continuous and symmetric around an expected mean:

```
X = μ + σ × Z     where Z ~ N(0,1)
```

#### Discrete Distribution

Used for **startup schedule delay** — a real-world variable that isn't continuous but takes specific values (0 months, 1 month, 3 months, 6 months) with assigned probabilities:

| Outcome | Base probability |
|---|---|
| On time (0 months) | 65% |
| 1 month late | 20% |
| 3 months late | 12% |
| 6 months late | 3% |

Sampling draws a uniform random number and walks through the cumulative probability until the threshold is crossed.

---

### 4.4 Gaussian Copula for Market Correlation

The most important statistical innovation in the engine. In reality, oil-linked commodity prices **do not move independently** — when Brent crude spikes, naphtha prices typically spike with it, and ethylene prices also move upward. Treating them as independent would understate tail risk (everything going wrong simultaneously) and overstate diversification.

The engine solves this with a **Gaussian copula**. A single shared "market shock" factor `Z_market` is drawn once per iteration:

```
Z_market ~ N(0,1)    // the global oil-market shock for this trial
```

For every triangular variable, its final uniform quantile is computed from a blend of the market shock and its own private shock:

```
ρ = marketCorrelation   // calibrated per variable (0 = independent, 1 = fully correlated)

Z_blended = ρ × Z_market + √(1 − ρ²) × Z_own

U = Φ(Z_blended)        // convert to uniform via standard normal CDF
X = TriangularInverseCDF(U, min, mode, max)
```

**Market correlation calibrations:**

| Variable | ρ | Rationale |
|---|---|---|
| Brent Crude | 1.00 | The market itself |
| Asian Naphtha | 0.85 | Directly crude-linked |
| Ethylene | 0.65 | Partly crude-linked, partly supply-driven |
| Propylene | 0.55 | Similar to ethylene, slightly more independent |
| US Ethane | 0.15 | Priced off US shale gas, mostly ignores Brent |
| VLEC Freight | 0.00 | Driven by vessel supply, not oil markets |
| WACC | 0.00 | Driven by credit markets, modelled as Normal |

This means a "high Brent world" simulation will simultaneously see high naphtha, moderate ethylene rises, and essentially unchanged ethane — correctly widening the ethane-naphtha feedstock spread in bull scenarios and compressing it in bear scenarios.

The standard normal CDF `Φ(z)` is computed using the **Abramowitz-Stegun 7.1.26 polynomial approximation** — accurate to ~1×10⁻⁷:

```
Φ(z) ≈ 1 − φ(z) × (a₁t + a₂t² + a₃t³ + a₄t⁴ + a₅t⁵)
where t = 1 / (1 + 0.2316419 × |z|)
```

---

### 4.5 Economic Model (One Iteration)

Each of the 10,000 iterations draws a full set of 12 input variables and passes them through the **economic model** to produce financial outputs.

#### Step 1 — Feed Composition & Throughput

```
Feed_KTPA   = totalFeedCapacity × (utilisation% / 100)
Ethane_KTPA = Feed_KTPA × (ethaneMix% / 100)
Naphtha_KTPA = Feed_KTPA × (1 − ethaneMix%)
```

#### Step 2 — Product Yield

Ethane cracks at ~79.5% ethylene yield; naphtha at ~33.2%. The model uses a weighted blended yield:

```
Blended ethylene yield = ethane_fraction × 0.795 + naphtha_fraction × 0.332
Ethylene_KTPA = Feed_KTPA × blended_yield

Propylene yield = ethane_fraction × 0.04 + naphtha_fraction × 0.155
Propylene_KTPA = Feed_KTPA × propylene_yield
```

#### Step 3 — Revenue

```
Revenue_USD_Mn = (Ethylene_KTPA × ethylenePrice × 1000)
               + (Propylene_KTPA × propylenePrice × 1000)
               + (Feed_KTPA × byproductCredit × 1000)   // C₃/C₄ by-products
```

#### Step 4 — Feed Cost

```
FeedCost_USD_Mn = (Ethane_KTPA × (ethanePrice + freightCost) × 1000)
                + (Naphtha_KTPA × naphthaPrice × 1000)
```

#### Step 5 — EBITDA

```
EBITDA_USD_Mn = Revenue_USD_Mn − FeedCost_USD_Mn − FixedOpex_USD_Mn

EBITDA_INR_Cr = EBITDA_USD_Mn × 8.33 × usdInrFx / 10
                                ↑
                       unit conversion: $Mn → ₹Cr
```

#### Step 6 — Capital Cost (with overrun + delay)

```
Actual_Capex = totalCapex × (1 + capexOverrun% / 100)

Delay_years  = startupDelay_months / 12
```

Startup delay shifts all cash flows forward in time, which reduces their present value at the discount rate.

#### Step 7 — DCF & NPV

The model builds a 15-year cash flow stream. The first `delay_years` of production cash flows are zeroed. A terminal value is added in year 15:

```
TV = EBITDA_USD_Mn × terminalValueMultiple

NPV = −Actual_Capex + Σ(t=1→15) [CF_t / (1 + WACC)^(t + delay)]
                     + TV / (1 + WACC)^(15 + delay)
```

#### Step 8 — IRR

Solved with a **bisection method** on the NPV function:

```
Find r such that NPV(r) = 0

Iterate:
  mid = (lo + hi) / 2
  if NPV(mid) > 0: lo = mid   else: hi = mid
  until |NPV(mid)| < 1e-6   (80 iterations max)
```

#### Step 9 — Payback Period

The engine counts how many years of undiscounted cash flows are required to recover the actual capital outlay.

---

### 4.6 Aggregate Statistics

After all iterations complete, the engine computes for each output metric (NPV, IRR, EBITDA, Payback):

| Statistic | Description |
|---|---|
| `mean` | Arithmetic average across all iterations |
| `stdev` | Standard deviation |
| `p10` | 10th percentile — the "downside" outcome |
| `p25` | Lower quartile |
| `p50` | Median |
| `p75` | Upper quartile |
| `p90` | 90th percentile — the "upside" outcome |
| `min / max` | Absolute worst and best simulated outcomes |

**Histograms** divide the full NPV, IRR, and EBITDA distributions into 18 equal-width bins with cumulative probability overlaid, rendered as ECharts bar charts.

**Probability metrics:**
- `P(NPV < 0)` — probability the investment destroys value.
- `P(IRR < 12%)` — probability the investment fails to clear the hurdle rate.

---

### 4.7 Convergence Tracking

Every `iterations/60` steps, the engine records the running mean of NPV. This produces a **convergence curve** — as iterations increase, the mean stabilises. The chart confirms the simulation has run enough trials for statistical reliability (typically stable within 3,000–4,000 iterations).

---

### 4.8 Tornado Chart — Driver Impact Analysis

The engine identifies which input variables have the biggest influence on NPV using a **partial-rank correlation tornado chart**:

1. For each variable, sort all 10,000 iterations by that variable's sampled value.
2. Isolate the bottom 10% and top 10% of iterations for that variable.
3. Compute the mean NPV for each group.
4. **NPV Swing** = |mean_NPV_top10% − mean_NPV_bottom10%|
5. Sort all variables by swing, largest first.
6. Also compute the **Pearson correlation** between each variable series and the NPV series.

The result is a horizontal bar chart where the length of each bar shows exactly how much NPV damage or benefit results from that variable moving from its bad tail to its good tail — letting decision-makers focus risk management on the most impactful uncertainties.

---

### 4.9 Scenario Presets

Three built-in presets shift every triangular variable's mode by 28% of its range in the favourable or unfavourable direction:

| Preset | Description |
|---|---|
| **Bull** | High product prices, low ethane cost, high naphtha (widening the spread), high utilisation |
| **Base** | Mode values unchanged — the central estimate |
| **Bear** | Low product prices, high ethane cost, low utilisation, maximum capex overrun |

The correlation structure is preserved in all presets.

---

### 4.10 Performance

The engine runs **entirely in the browser** — no server call required. 10,000 iterations with 12 variables each complete in under **150 milliseconds** on a modern laptop, thanks to:

- Pure JavaScript arithmetic (no WASM, no workers needed at this scale).
- Pre-allocated typed arrays (`new Array(iterations)`) instead of dynamic push.
- A single-pass variance computation for Pearson correlation.

---

## 5. AI Copilot Architecture

The AI layer is powered by the **RIL Intelligence Engine** — a white-labelled integration of the TinyFish AI web search and synthesis API. No TinyFish branding appears anywhere in the user interface.

### Request Flow

```
User query
    ↓
POST /api/ai/copilot   (Next.js server route, force-dynamic)
    ↓
[1] Pull live market snapshot from MarketContext store
[2] Build structured system prompt with:
    - Current commodity prices (Brent, naphtha, ethane, ethylene, FX)
    - Cracker asset context (5 sites, capacities, feed splits)
    - Domain rules (force grounded numbers, no hallucination)
[3] Call TinyFish Search API → get live web snippets
[4] Feed snippets + internal context → LLM synthesis
[5] Parse JSON response → SynthesizedAnswer schema
    ↓
Return to client as JSON
```

### Answer Schema

Every AI response is structured as a typed `SynthesizedAnswer` object:

```typescript
interface SynthesizedAnswer {
  answer: string;           // Full analytical narrative
  keyTakeaway: string;      // 1–2 sentence executive bottom line
  category: 'FACT' | 'OPTIMIZATION' | 'MACRO' | 'MICRO' | 'MODEL OUTPUT';
  evidence: Evidence[];     // Cited sources with quotes and external links
  numericalData: Metric[];  // Extracted numbers as labelled key-value pairs
  assumptions: string[];    // Stated assumptions in the reasoning
  uncertainty: string;      // What the AI is least confident about
  relatedAnalysis: string[]; // Suggested follow-on modules to visit
  auditRecordId?: string;   // Traceable ID for the Audit Trail Inspector
}
```

### Caching

The server route is marked `force-dynamic` so every query hits the live web — ensuring freshness. A 15-second `maxDuration` edge timeout prevents cold-start hangs.

---

## 6. SCADA Digital Twin

The `/simulation` page provides a real-time process simulation of a cracker furnace complex. Users control:

- **Ethane / Naphtha feed ratio** (0–100%)
- **Throughput** (KTPA)
- **Furnace Coil Outlet Temperature (COT)** (°C)
- **Severity** (HIGH / NORMAL)
- **Steam-to-Oil ratio (SOR)**

The SCADA model computes:

```
Ethylene yield = f(COT, ethaneFraction)
  ≈ (0.795 × ethane_frac + 0.332 × naphtha_frac) × throughput

EBITDA = (Ethylene × ethylenePrice + Propylene × propylenePrice)
        − (Ethane × ethaneCost + Naphtha × naphthaCost)
        − fixed_opex
```

Results update in real time as sliders move. The same yield formulas are reused inside the Monte Carlo engine, ensuring numbers are consistent across the dashboard.

---

## 7. Market Intelligence Layer

### Live Price Feed (`/api/prices`)

A Next.js API route fetches real-time prices from Yahoo Finance every time the market context refreshes:

| Commodity | Yahoo Symbol | Unit |
|---|---|---|
| Brent Crude | `BZ=F` | $/bbl |
| Asian Naphtha | proxy via CL=F + spread | $/t |
| US Ethane | proxy via NG=F + regression | $/t |
| Ethylene (CFR) | internal model | $/t |
| USD/INR | `INR=X` | ₹/$ |

Prices are cached in `MarketContext` and broadcast to all subscribed components — a single fetch updates every chart, ticker, and model simultaneously.

### News Aggregator

RSS feeds from Reuters Energy, Bloomberg Commodities, and Platts are parsed and ranked by relevance to the `[reliance, petrochemical, ethane, cracker, O2C]` topic set. Headlines are displayed as a live news strip on the Risk Sentinel page.

---

## 8. Data Architecture

```
src/
├── app/                    Next.js App Router pages
│   ├── api/
│   │   ├── ai/copilot/     AI synthesis endpoint
│   │   └── prices/         Live commodity price fetcher
│   ├── ai/                 AI Copilot Studio
│   ├── scenarios/
│   │   └── monte-carlo/    Monte Carlo simulation UI
│   ├── simulation/         SCADA Digital Twin
│   ├── market/             Market Intelligence Terminal
│   └── ...                 Other module pages
│
├── components/
│   ├── layout/             AppShell, Sidebar, Navbar
│   ├── charts/             EChartsLight wrapper (SSR-safe)
│   ├── scada/              ScadaDiagram component
│   └── common/             CommandPaletteModal, AuditTrailModal
│
├── context/
│   └── MarketContext.tsx   Global price state + refresh logic
│
├── data/
│   ├── knowledgeStore.ts   In-memory cracker asset register + commodity configs
│   ├── commodityIntelligence.ts   Domain intelligence snippets per commodity
│   └── rawDocuments.ts     Ingested source document content
│
└── lib/
    ├── monteCarlo.ts       Monte Carlo engine (RNG, distributions, DCF model)
    ├── searchEngine.ts     Hybrid search + answer synthesis types
    └── tinyfish.ts         TinyFish API client (white-labelled)
```

---

## 9. Running Locally

```bash
# Clone the repository
git clone https://github.com/debmukdm-jioinstitute/reliance-petchem-project.git
cd reliance-petchem-project

# Install dependencies
npm install

# Set up environment variables
# Create a .env.local file with:
# TINYFISH_API_KEY=your_api_key_here

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

```bash
# Run a production build (validates all TypeScript and routes)
npm run build

# Start production server
npm start
```

> **Note:** The AI Copilot and live price features require valid API credentials. The Monte Carlo engine, SCADA simulator, market charts, and all other analytical modules work fully offline with seeded/static data.

---

## 10. Project Structure

```
reliance-petchem-project/
├── public/
│   └── images/             Static assets (refinery photos, logo)
├── src/
│   ├── app/                All pages and API routes
│   ├── components/         Shared UI components
│   ├── context/            React context providers
│   ├── data/               Static knowledge and asset data
│   └── lib/                Core engines (Monte Carlo, AI, search)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

---

## Academic Context

This platform was developed as part of a quantitative finance and strategy project by a four-member student team at **Jio Institute** (PGP Management Finance). The analysis focuses on the petrochemical feedstock economics of a large Indian refining and chemicals company as a case study for:

- **Capital allocation under uncertainty** (Monte Carlo methods)
- **Real-time AI-assisted decision support** (LLM + live web grounding)
- **Quantitative time-series forecasting** (ensemble methods)
- **Digital twin simulation** (SCADA-style process modeling)

The codebase demonstrates how modern web technologies (Next.js, TypeScript, ECharts) can be used to build institutional-grade financial analytics tools that were previously only available in proprietary Bloomberg / Palantir-class systems.

---

*Built with Next.js · Deployed on Vercel · AI powered by the RIL Intelligence Engine*
