# RIL Intelligence OS
> **AI-Powered Market, Project & Scenario Intelligence Operating System**  
> *Built for Reliance Industries Limited — O2C & Petrochemicals Cracker Business*

![RIL Intelligence OS Badge](https://img.shields.io/badge/Platform-RIL%20Intelligence%20OS-BFA161?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Grade-10B981?style=for-the-badge)
![Architecture](https://img.shields.io/badge/Stack-Next.js%2016%20%7C%20TimesFM%20%7C%20ECharts-38BDF8?style=for-the-badge)

---

## Executive Vision

**RIL Intelligence OS** is an institutional intelligence operating system bridging real-time meeting transcripts, verified project documents, quantitative financial models, and continuous commodity price feeds into one unified intelligence layer.

The design synthesizes:
- **Apple**: Clean, minimal, distraction-free typography and surfaces.
- **Bloomberg Terminal**: High-density underlying intelligence, live tick feeds, spreads, and crack deltas.
- **McKinsey**: Structured executive communications, 60-second briefings, pyramid-principle data presentation.
- **Google**: Natural language discovery, instant search across disparate documents, entities, and forecasts.
- **Palantir**: Interconnected entities, relational knowledge graphs, dynamic scenario trees, and assumption propagation.
- **Linear**: Fluid keyboard-driven navigation, command palette (`⌘K`), responsive status badges.

---

## Core Ingested Source Knowledge

All facts, numbers, quotes, and assumptions are grounded in verified source documents:

1. **`MoM_RIL_6 July 2026` (Meeting 1)**: Mentorship session with **Rajesh Rawal** (Business Head, Cracker & Poly Business, RIL). Establishes that Reliance already completed the operational transition from naphtha to ethane a decade ago (2014–2017) and possesses linear programming optimizers switching feedstocks in under 24 hours. The project scope was redirected to AI optimization enhancement, multi-horizon price forecasting, dynamic financial modeling of the capacity expansion project, and global chemical benchmarking.
2. **`MOM 2` Transcript (Meeting 2)**: Scoping alignment with **Hanoz** (New Business Head of Cracker, RIL) and mentor **Adepu**. Approves the AI Live Dashboard concept and mandates a **Dual Simulation Architecture**: (A) RIL asset-specific expansion viability, and (B) global cracker industry oversupply dynamics.
3. **`Group 9 Live Project Proposal`**: Authored by Debabrata Mukherjee, Dhruv Choudhary, Ishan Lath, and Vishwas Mordani (Jio Institute PGP Management Finance). Grounded in FY25 O2C revenue of ₹6,26,921 Cr and EBITDA of ₹54,988 Cr. Details the >$2.0 Billion committed to Jamnagar and Dahej cryogenic ethane terminals (>1.5 MMTPA each), 6 operating + 3 planned VLECs, and 100km Dahej pipeline.
4. **`AI Based Cracker Industry Analysis & Scenario Simulation`**: Details the ~10x gross ethylene feedstock cost gap ($250/t ethane route vs $2,629/t naphtha route) and global ethylene capacity oversupply (+40 Mt vs +27 Mt demand).
5. **`Live Project Report: Debabrata Mukherjee`**: Formal documentation of optimization frameworks and risk modeling.

---

## Primary Navigation Modules

1. **`01 OVERVIEW` (`/`)**: Executive command center, live ticker strip, 12 clickable KPI cards, "What Changed" chronological change feed, natural language query bar.
2. **`02 EXECUTIVE INTELLIGENCE` (`/executive`)**: AI-generated 60-second briefing, Today's Signals (Positive, Negative, Watch, Critical), Top 5 Developments, Decisions Register, Open Questions, Leadership Attention sentinel.
3. **`03 MEETINGS` (`/meetings`, `/meetings/:id`)**: Full meeting register with 10-tab transcript intelligence (Summary, Decisions, Actions, Risks, Assumptions, Numbers, Topics, Entities, Changes, Raw Transcript).
4. **`04 PROJECT` (`/project`, `/project/capex`)**: 5 core workstreams (AI Optimization, Market Forecasting, Scenario Simulation, Dynamic Financial Model, External Benchmarking) and capital allocation tracker.
5. **`05 MARKET` (`/market`)**: Bloomberg-style terminal view, interactive cracker value chain flow, feedstock spreads (Ethane, Naphtha, Propane), product margins (Ethylene, Propylene), and multi-horizon return ledger.
6. **`06 FORECASTS` (`/forecasts`)**: Quantitative time-series forecasting engine with multi-model ensemble (AutoARIMA, ETS, LightGBM, TimesFM representation) and out-of-sample backtesting metrics (MAE, RMSE, MAPE).
7. **`07 SCENARIOS` (`/scenarios`)**: Interactive multi-variable scenario builder, nested decision tree, and EBITDA waterfall impact decomposition.
8. **`08 FINANCIAL MODEL` (`/financial`)**: Formula-driven DCF model across RIL cracker assets (Jamnagar, Dahej, Hazira, Nagothane, Vadodara) with editable assumption register.
9. **`09 OPERATIONS` (`/operations`)**: Sub-day switching dynamics, VLEC fleet tracking (6+3 vessels), Dahej pipeline, and plant mass balances.
10. **`10 COMPETITIVE INTELLIGENCE` (`/competitive-intelligence`)**: Peer AI use case benchmark matrix (ExxonMobil, Dow, SABIC, BASF, LyondellBasell) and global oversupply analysis.
11. **`11 AI RESEARCH` (`/ai-research`)**: Academic literature review from ACS Omega, ScienceDirect, and Ind. Eng. Chem. Res.
12. **`12 DATA` (`/data`)**: Pluggable `DataProvider` interface, latency monitors, and automated data quality scoring.
13. **`13 ALERTS` (`/alerts`)**: Market shock detection, assumption cascade, and automatic downstream scenario recalculation.
14. **`14 ACTION CENTER` (`/actions`)**: Extracted action items, owners, deadlines, priority levels, and execution evidence.
15. **`15 KNOWLEDGE GRAPH` (`/knowledge-graph`)**: Palantir-grade interactive force-directed network graph connecting entities, plants, commodities, decisions, and relationships.
16. **`16 AI COPILOT` (`/ai`)**: 3-column multi-agent conversational reasoning engine with live context panel, classification tags (FACT, MODEL OUTPUT, INFERENCE), and "Why Did AI Say This?" audit trail.
17. **`17 SETTINGS` (`/settings`)**: Open-source first `ModelRouter` configuration (Ollama, vLLM, BGE-M3, TimesFM) and role-based access control.

---

## Running Locally

```bash
# Clone the repository
git clone https://github.com/debmukdm-jioinstitute/reliance-petchem-project.git
cd reliance-petchem-project

# Install dependencies
npm install

# Run production build validation
npm run build

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view **RIL Intelligence OS**.
