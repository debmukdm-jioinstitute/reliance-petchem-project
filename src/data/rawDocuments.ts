// Source Documents Ground Truth Store
// Extracted from original verified project artifacts

export interface RawDocumentSource {
  id: string;
  title: string;
  category: 'PROJECT_REPORT' | 'INDUSTRY_ANALYSIS';
  date: string;
  authorOrSpeaker: string;
  organization: string;
  contentLines: string[];
}

export const RAW_GROUP9_REPORT = {
  id: 'doc-group9-report',
  title: 'Beyond Naphtha: Capital Allocation, Feedstock-Switching Economics & Forex-Risk Quantification for Reliance O2C',
  category: 'PROJECT_REPORT' as const,
  date: '2026-07-15',
  authorOrSpeaker: 'Debabrata Mukherjee, Dhruv Choudhary, Ishan Lath, Vishwas Mordani (Team 9, Jio Institute)',
  organization: 'Jio Institute PGP Management Finance / Reliance Industries O2C',
  pages: [
  {
    "page": 1,
    "content": "Beyond Naphtha: Capital Allocation, Feedstock-Switching \nEconomics & Forex-Risk Quantification for Reliance O2C\u2019s Ethane-\nCracking Pivot \nSITUATION \n\u2022 Reliance\u2019s O2C engine is being squeezed by a margin problem, not a volume one. The O2C \nsegment earned \u20b96,26,921 crore revenue in FY25 (+11% YoY), yet EBITDA fell to \u20b954,988 crore as \nweak transport-fuel cracks and muted downstream chemical deltas compressed polymer and polyester \nmargins \u2014 driven by record global petrochemical oversupply, with excess capacity in the six key building \nblocks reaching ~218 million tonnes in 2023, nearly 3\u00d7 the long-run average.[1][6] \n\u2022 The structural fix is feedstock, not price. Cracking ethane yields ~80% ethylene per molecule \nversus ~30% for naphtha, and ethane is roughly half as expensive as naphtha on an energy-\nequivalent basis. Q3 FY26 already proved the upside: O2C EBITDA rose 15% YoY to \u20b916,507 crore, \nwith favourable ethane-cracking economics explicitly cited as a profit driver.[2][3] \n\u2022 The pivot is being built right now. Reliance has committed >$2 billion to cryogenic ethane terminals \nat Jamnagar and Dahej (each >1.5 MMTPA), a planned ~100 km Dahej pipeline, and three new very-\nlarge ethane carriers on top of its existing fleet of six. QatarEnergy\u2019s shift to supplying \u201clean\u201d gas makes \nimported US ethane a deliberate, paid-for feedstock choice rather than a by-product.[3][4] \n\u2022 Every substituted tonne is simultaneously a margin and a forex decision. Each tonne of ethane \nreplacing naphtha shifts exposure from imported crude (India\u2019s oil-import dependence ~88.6% in FY25) \nto US Mont Belvieu ethane plus freight and USD/INR. US ethane net exports are set to rise 14% in 2025 \nand 16% in 2026, even as a 2026 naphtha spike toward $1,000/t widens the switching prize. Which \ncrackers convert first, at what capex, and hedged how, is a capital-allocation and risk problem.[5][7][8] \nTHE THREE-LEVER FRAMEWORK \nLever 1: Cracker-Conversion Investment Case (Which Units, Which Feedstock) \nEthane-handling capacity is a per-asset capex decision under uncertainty: which of Reliance\u2019s cracker \ncomplexes \u2014 Jamnagar, Dahej, Hazira, Nagothane, Vadodara \u2014 justify incremental ethane-conversion and \nterminal/pipeline capex first, ranked by current naphtha exposure, ethylene-yield uplift, throughput and \nproximity to import infrastructure.[3] Output: NPV, IRR and payback per cracker tier, plus a phased FY27\u2013FY29 \ncapex roadmap sized against the >$2 billion terminal commitment.[4] \nOur role: Build the Feedstock Stratification Matrix \u2014 the ROI-ranked conversion tiers with NPV, IRR and \npayback per asset. \nLever 2: Cross-Feedstock Margin & Delta Simulation (The Margin Engine) \nA flexible cracker only pays if the switching rule does. We estimate the naphtha\u2013ethane switch-point \u2014 the \nspread (delta) at which moving a molecule to ethane adds contribution margin net of freight and conversion \ncost \u2014 and simulate the product slate (PE, PP, polyester chain) against China import-parity pricing under \npersistent oversupply. \nOur role: Deliver the Dynamic Delta Simulator \u2014 feedstock-mix and product-slate margin \nrecommendations by plant, with explicit switch-point and volume\u2013margin trade-off curves. \nLever 3: Feedstock-and-Forex Risk Quantification (The Hedge) \nEach shift trades Brent/naphtha exposure for US ethane, VLEC freight and USD/INR. Monte Carlo \nsimulation across ethane price, the naphtha\u2013ethane spread, shipping rates, throughput variance, forex and \npolicy/tariff timing yields a P10/P50/P90 earnings range per rollout scenario; the national stakes \u2014 \n~88.6% crude-import dependence[5] \u2014 scale down to a per-cracker import-substitution value. \nOur role: Run the Monte Carlo Risk Simulation to quantify the risk-adjusted value of converting early \nversus waiting for ethane economics and tariffs to settle, and consolidate all three levers into the Executive \nDashboard for O2C leadership. \nDELIVERABLES (20 HRS/WEEK, 8 WEEKS, 4-MEMBER TEAM) \n\u2022 Feedstock Stratification Matrix. Ranks Reliance\u2019s cracker complexes into conversion tiers by naphtha \nexposure, ethylene-yield uplift, throughput and infrastructure proximity. \n\u2022 Dynamic Delta Simulator. Interactive model linking the naphtha\u2013ethane spread, ethylene-yield \neconomics and product-slate pricing to plant-level contribution margin. \n\u2022 Monte Carlo Risk Simulation. 10,000-scenario simulation of earnings volatility across ethane/naphtha \nprices, crude/forex movements and policy-pace assumptions, with downside (VaR-style) metrics. "
  },
  {
    "page": 2,
    "content": "\u2022 Executive Dashboard. CFO-level view consolidating the conversion roadmap, NPV/IRR/payback by tier, \nrecommended feedstock mix and risk-adjusted investment recommendations. \nRESULT \nReliance O2C gets four things it does not have today: an ROI-ranked map of which crackers to convert \nto ethane first, a margin tool that turns the naphtha-to-ethane choice into a live decision rather than a \nprocurement reflex, a quantified feedstock-and-forex risk envelope around the pivot, and a first-mover \ncapital-allocation playbook for the ethane economy the company is already building toward.[3] \nReferences: \n[1] Reliance Industries Limited, Financial Results Presentation FY2024-25 (25 April 2025) \u2014 O2C revenue \u20b96,26,921 cr, \nEBITDA \u20b954,988 cr. \n[2] Reliance Industries Limited, Media Release: Q3 FY2025-26 Financial & Operational Performance, 16 January 2026 \u2014 \nO2C EBITDA \u20b916,507 cr (+15% YoY), ethane-cracking economics. \n[3] Business Standard (Bloomberg Opinion), \u201cMukesh Ambani bets big on US ethane amid shifting global trade \ndynamics\u201d, 7 July 2025 \u2014 ethane vs naphtha yield (~80% vs ~30%) and cost, 6 VLECs + 3 planned, ~100 km Dahej \npipeline, QatarEnergy lean-gas shift. \n[4] U.S. Energy Information Administration / Reuters coverage of US ethane exports & infrastructure, 2025 \u2014 >$2 bn \nJamnagar & Dahej cryogenic ethane terminals (>1.5 MMTPA each). \n[5] OilPrice.com / PPAC, \u201cIndia\u2019s Oil Import Dependence Climbs to Nearly 89%\u201d, 2025 \u2014 88.6% crude-import \ndependence, FY25. \n[6] S&P Global Commodity Insights, \u201cOversupply weighs on global petrochemicals\u201d, 2024 \u2014 ~218 Mt excess capacity in six \nkey building blocks (2023). \n[7] U.S. Energy Information Administration, \u201cU.S. ethane exports are expected to grow through 2026\u201d \u2014 net exports +14% \n(2025), +16% (2026). \n[8] Market Minute / FinancialContent, \u201cNaphtha Surges to $1,000: The Petrochemical Crisis of 2026 Explained\u201d, 30 \nMarch 2026. \nPrepared for Reliance Industries \u2013 O2C / Petrochemicals  |  Confidential, For Internal Review Only  |  PGP Management Finance Live \nProject, Jio Institute \n \nTeam 9 \u2013 Jio Institute: \nDebabrata Mukherjee \nDhruv Choudhary \nIshan Lath \nVishwas Mordani "
  }
]
};

export const RAW_AI_CRACKER_DOC: RawDocumentSource = {
  id: 'doc-ai-cracker',
  title: 'AI Based Cracker Industry Analysis and Scenario Simulation',
  category: 'INDUSTRY_ANALYSIS',
  date: '2026-08-01',
  authorOrSpeaker: 'Debabrata Mukherjee & Project Team',
  organization: 'Reliance O2C Strategic Planning',
  contentLines: [
  "AI Based Cracker Industry Analysis and Scenario Simulation",
  "1. Executive Summary",
  "The project began as a study on shifting cracker feedstock from naphtha to ethane. Reliance Industries Limited (RIL) already made this shift around ten years ago [1][2]. The project has therefore moved to a new goal, an AI enabled dashboard that runs business and operational scenarios for RIL and for the global cracker industry, using AI based price prediction as a core input.",
  "This version of the document goes a step further. It carries out a first, preliminary version of the analysis the dashboard is meant to automate, using public feedstock and product prices, RIL's own reported results, and published industry data. Three findings stand out.",
  "At current public prices, the feedstock needed to make one tonne of ethylene costs about USD 250 by the ethane route (US import basis) against about USD 2,629 by the naphtha route, a gap of roughly 10 times [4][10][11]. This is a gross, feedstock only figure and is explained fully in Section 8.",
  "RIL's own Q1 FY2026-27 results confirm this pattern in practice. Naphtha costs rose 61 percent year on year, while US ethane costs fell 11 percent, and RIL specifically credited favourable ethane cracking economics for cushioning its O2C margins [9].",
  "The global cracker industry is in an oversupply cycle, mostly driven by new Chinese capacity, with average plant utilisation near 80 percent and integrated margins negative since mid 2022 for higher cost producers [14]. In this environment, low cost feedstock is not just a saving, it is increasingly a condition for staying open.",
  "The sections below present the full analysis, the assumptions behind it, and its limitations, followed by supporting detail and next steps.",
  "2. Background: Why the Original Scope Had to Change",
  "The original idea was to evaluate the business benefit of moving cracker feedstock from naphtha to ethane, and to build a simulation to test this shift.",
  "Project research confirmed that RIL had already completed this transition. The public record supports this timeline. RIL agreed in 2014 to source about 1.5 million tonnes of ethane per year from the United States [1]. RIL's ethane fed cracker unit was commissioned in 2017, and RIL was among the first companies in the world to plan large scale ethane imports from the US at this scale [2]. Ethane reaches RIL's Dahej terminal in Gujarat on very large ethane carriers. RIL co-owns a fleet of six such carriers and has planned three more [2]. A pipeline of about 100 kilometres moves ethane from Dahej to other processing sites [2].",
  "Since the naphtha to ethane shift is already an established, completed decision for RIL, the project cannot simply ask whether RIL should make the shift. The team agreed the project should instead become a decision support tool that helps evaluate ongoing and future scenarios, given that both feedstocks are already in use across the industry.",
  "3. Revised Project Direction",
  "The business team suggested widening the project from an RIL only analysis to include a global industry view. The analysis now has two parts.",
  "RIL specific simulation: assess how different scenarios affect RIL's operations, profitability, revenue, and expansion decisions.",
  "Global industry simulation: analyse how changes in feedstock prices, product prices, supply conditions, and other outside factors affect the cracker industry worldwide.",
  "The scale involved is significant. The global market for ethylene and propylene, the two main outputs of a cracker, was valued at about USD 459.7 billion in 2026 and is projected to reach about USD 710.2 billion by 2033, growing at roughly 6.4 percent a year [5]. Section 10 below shows why this revenue growth should not be read as a margin recovery.",
  "A key recommendation from the project team was to explore AI for price prediction, particularly for major raw materials and finished products. These price forecasts would then feed into the scenario simulations to show the effect on production, profitability, and overall business viability.",
  "4. Proposed AI Dashboard: What It Should Do",
  "The team proposed an AI enabled dashboard able to model several scenarios. This section explains each one in plain terms, since together they define everything the tool needs to do.",
  "Scenario type",
  "What it means in practice",
  "Why it matters",
  "Feedstock and product price changes",
  "Change the price of naphtha, ethane, ethylene, or propylene and see the effect",
  "The core lever. Sections 6 to 9 build a manual first version of exactly this",
  "Supply chain shortages and disruptions",
  "Model a feedstock simply not arriving, for example a shipping delay or a regional conflict, rather than just a price move",
  "Naphtha's 61 percent cost jump in Section 7 was tied to a real supply disruption, not a normal price cycle",
  "Changes in production volumes and output",
  "Model the plant running below full capacity, whether by choice or by a breakdown",
  "Connects the feedstock cost per tonne in Section 8 to an actual production plan",
  "Impact on revenue and profitability",
  "Roll feedstock cost, product price, and volume up into one bottom line number",
  "This is the output metric a decision maker actually needs to see",
  "Operational changes",
  "Model switching the feedstock mix, for example more ethane and less naphtha",
  "Turns the cost gap explained in Section 5.3 into an operating decision",
  "Financial viability of potential expansion projects",
  "Test whether a new plant or import terminal makes sense across a range of future prices, not just today's price",
  "A longer horizon question, since new capacity takes years to pay back",
  "Alternative business scenarios and their outcomes",
  "A catch all for side by side comparisons, for example ethane only versus naphtha only versus a blend",
  "Lets a user compare options directly rather than model them one at a time",
  "10. Analysis: Global Industry Context",
  "The global cracker industry is going through a prolonged oversupply cycle. Global ethylene capacity grew by more than 40 million tonnes between 2020 and 2025, with about 70 percent of that new capacity built in China, while global demand grew by only 27 million tonnes over the same period [14]. Average global ethylene plant utilisation is currently around 80 percent [14].",
  "This oversupply has hit margins hard. Integrated polyethylene cash margins have been largely negative since mid 2022, and margins for higher cost producers have stayed negative over the past year, triggering plant closures [14]. Producers in Europe (including Dow, ExxonMobil, LyondellBasell, and TotalEnergies) are cutting capacity, South Korea is targeting a 25 percent cut in domestic capacity, and plants have closed in Malaysia, Vietnam, and the Philippines [14]. A return to what the industry would call satisfactory profitability is not expected until the early 2030s [14].",
  "This creates an important tension worth flagging rather than smoothing over. The global ethylene and propylene market is projected to grow from about USD 459.7 billion in 2026 to about USD 710.2 billion by 2033 [5], but that is a revenue projection, driven by volume growth and pricing over time. It is not the same as a margin or profitability forecast, and it sits alongside a separate, credible view that margins stay weak into the early 2030s [14]. The Scope Document should treat top line market size and cracker profitability as two different questions.",
  "For RIL, the practical reading is this: in a market where the weakest, highest cost naphtha based plants are the ones closing, a lower cost feedstock position is not just a margin advantage, it is closer to a survival advantage. This reading is the team's interpretation, built on the two cited sources, not a claim made directly by either source.",
  "11. AI for Price Prediction: Why and How",
  "Feedstock and product prices in this industry move often, driven by oil and gas price changes, supply disruptions, and shifts in demand, as shown throughout Sections 6 to 10. AI based forecasting can help anticipate these price movements and feed them into the scenario simulations planned for the dashboard.",
  "Existing research gives useful starting points for the team's approach:",
  "Machine learning and ensemble models have been used to model the yield of light olefins, including ethylene and propylene, in crude to chemical conversion processes, which can support production planning work [6].",
  "Data science and reinforcement learning methods have been applied to price forecasting and raw material buying decisions in the petrochemical industry [7].",
  "Combined decision models exist that link price prediction directly with production planning for petrochemical companies [8].",
  "The team should review these approaches while developing the AI and predictive modelling section of the Scope Document.",
  "12. What This Analysis Means for the Dashboard",
  "This preliminary study shows the dashboard is feasible in principle. Public prices for naphtha, ethane, ethylene, and propylene are available and update regularly, and even a simple model built on them produces a clear, decision relevant result. To move from this illustration to a real tool, the team still needs:",
  "Prices for the remaining co-products of naphtha cracking, mainly mixed C4s, pyrolysis gasoline or aromatics, and fuel gas, so a true net-back and profitability model can replace the gross feedstock cost view used here [3][15].",
  "RIL's actual feedstock mix, plant level volumes, and capacity utilisation, which are not public and will need the business team's help, as already flagged in Section 13.",
  "A consistent, single source price feed for each input, rather than the mixed dates and baskets used in this first pass, ideally from one paid data provider such as ICIS, S&P Global Commodity Insights, or Wood Mackenzie, since public news sources are not built for daily model input.",
  "Region level capacity and utilisation data to model the global industry side properly, since Section 10 only used industry wide aggregates.",
  "13. Limitations of This Preliminary Study",
  "In the interest of accuracy, the following limits apply to everything in Sections 6 to 10 and should be read before the numbers are used in any external document.",
  "Prices are point in time public benchmarks taken from different dates, from November 2025 to September 2026, and different pricing bases (spot, CFR, FOB, or domestic). They are used to show order of magnitude, not a matched, same day price set [9][10][11][12][13].",
  "The ethylene yield assumptions of 80 percent for ethane and 30 percent for naphtha come from a single referenced source and can vary by plant design, feed quality, and how hard the cracker is run [4].",
  "The feedstock cost figures in Section 8 exclude every naphtha co-product except where explicitly noted, so they understate how naphtha cracking actually earns money [3][15].",
  "The scenario price moves in Section 9 (plus 20 percent, minus 15 percent, plus 30 percent) are illustrative assumptions picked to demonstrate the model. They are not price forecasts.",
  "RIL's O2C figures in Section 7 cover the whole segment, including refining and other petrochemical lines, not the cracker business alone, so they should be read as supporting context, not a direct measure of cracker profit [9].",
  "14. Data Availability and Support",
  "Reliable industry and operational data, especially business specific figures, may not be publicly available.",
  "The business team advised the project team to start with publicly available information and use AI tools and other research sources to gather what is needed. Where data is missing, appears incorrect, or needs interpretation, the team can seek guidance from the business team.",
  "The business team indicated it can share relevant, publicly shareable material and an industry overview to help the team build out the project scope.",
  "References",
  "[1] Reuters, carried by Business Standard, \"Reliance to source 1.5 mln tonne/year of ethane from US\", 2014. https://www.business-standard.com/article/reuters/reliance-to-source-1-5-mln-tonne-year-of-ethane-from-u-s-114082001441_1.html",
  "[2] Angel One, \"Reliance eyes US ethane expansion as global trade landscape transforms\". https://www.angelone.in/news/share-market/reliance-eyes-us-ethane-expansion-as-global-trade-landscape-transforms",
  "[3] Wikipedia, \"Steam cracking\". https://en.wikipedia.org/wiki/Steam_cracking",
  "[4] Oxford Institute for Energy Studies, \"US NGLs Production and Steam Cracker Substitution\", 2014. https://www.oxfordenergy.org/wpcms/wp-content/uploads/2014/09/US-NGLs-Production-and-Steam-Cracker-Substitution.pdf",
  "[5] Coherent Market Insights, \"Ethylene and Propylene Market Size and Forecast, 2026 to 2033\". https://www.coherentmarketinsights.com/market-insight/ethylene-and-propylene-market-3007",
  "[6] ACS Omega, \"Feasibility of the Optimal Design of AI Based Models Integrated with Ensemble Machine Learning Paradigms for Modeling the Yields of Light Olefins in Crude to Chemical Conversions\". https://pubs.acs.org/acsodf/article/8/43/40517/406225/Feasibility-of-the-Optimal-Design-of-AI-Based",
  "[7] ScienceDirect, \"Data science and reinforcement learning for price forecasting and raw material procurement in petrochemical industry\". https://www.sciencedirect.com/science/article/abs/pii/S1474034621001956",
  "[8] Industrial and Engineering Chemistry Research, \"Comprehensive Decision Framework Combining Price Prediction and Production Planning Models for Strategic Operation of a Petrochemical Industry\". https://pubs.acs.org/doi/abs/10.1021/acs.iecr.0c01957",
  "[9] Reliance Industries Limited, Media Release, \"Q1 FY2026-27 Financial and Operational Performance\", July 2026. https://www.ril.com/sites/default/files/2026-07/Media_Release_RIL_Q1_FY2026-27_Financial_and_Operational_Performance.pdf",
  "[10] Trading Economics, \"Naphtha\" commodity price page, accessed September 2026. https://tradingeconomics.com/commodity/naphtha",
  "[11] Intratec, \"Ethane Price, Current and Forecasts\". https://www.intratec.us/solutions/primary-commodity-prices/commodity/ethane-prices",
  "[12] IMARC Group, \"Ethylene Price, Index, Trend, Chart and Forecast 2026\". https://www.imarcgroup.com/ethylene-pricing-report",
  "[13] Procurement Resource, \"Propylene Price Trend 2026\". https://www.procurementresource.com/resource-center/propylene-price-trends",
  "[14] Wood Mackenzie, \"Petrochemicals in peril, oversupply crisis and energy transition threaten industry survival\". https://www.woodmac.com/news/opinion/petrochemicals-in-peril-oversupply-crisis-and-energy-transition-threaten-industry-survival/",
  "[15] Intratec, \"Ethylene Production from Naphtha (High Severity Steam Cracking)\" report preview. https://cdn.intratec.us/docs/reports/previews/ethylene-e71b-b.pdf"
]
};

export const RAW_LIVE_PROJECT_DOC: RawDocumentSource = {
  id: 'doc-live-project',
  title: 'Live Project Report: AI-Enabled Optimization and Scenario Analysis for Reliance O2C',
  category: 'PROJECT_REPORT',
  date: '2026-08-10',
  authorOrSpeaker: 'Debabrata Mukherjee (Roll 27GMT0008, Jio Institute)',
  organization: 'Jio Institute / Reliance Industries',
  contentLines: [
  "LIVE PROJECT REPORT",
  "PGP Management  |  Jio Institute",
  "Name",
  "Debabrata Mukherjee",
  "Roll No.",
  "27GMT0008",
  "Specialisation",
  "Finance",
  "Company",
  "Reliance industries",
  "Project Title",
  "AI-Enabled Optimization and Scenario Analysis for Reliance O2C",
  "Function / Team",
  "Finance",
  "Duration (from to)",
  "Total Hours",
  "1. Project brief. What was the project, and what problem was the company trying to solve through it?  (max 60 words)",
  "The project focuses on using AI, scenario simulation and financial modelling to support decision-making in Reliance\u2019s O2C business. The initial idea was to study switching from naphtha to ethane, but discussions with Reliance showed that this capability already exists. The project therefore shifted towards improving optimization, forecasting market prices, testing scenarios and supporting dynamic financial decisions.",
  "2. Your contribution. What work did you personally do, and what did you hand over to the company?  (max 80 words)",
  "I contributed to understanding the O2C business, refining the original project idea based on mentor feedback, and developing the scope around AI, simulation and financial analysis. I also contributed to the proposed framework covering feedstock economics, scenario analysis, forecasting, Monte Carlo simulation and dashboard-based decision support. The team\u2019s proposed outputs include a dynamic simulator, risk analysis and an executive dashboard.",
  "3. Key learning. What did you learn from this project that you did not know before, in concepts, tools or ways of working?  (max 80 words)",
  "I learned that solving a business problem starts with understanding the existing systems before proposing a new solution. I gained a better understanding of feedstocks such as naphtha and ethane, cracker operations, O2C economics and the role of optimization. I also learned how AI can support forecasting and scenario analysis, while financial tools such as NPV, IRR  can support business decisions under uncertainty.",
  "4. Application. How do you plan to apply this learning in your coursework, placements or career going forward?  (max 80 words)",
  "I plan to apply this learning in my coursework and future finance roles by combining financial analysis with business and operational understanding. I will use scenario analysis and financial modelling to evaluate decisions under changing market conditions. The project also showed me how AI can be used as a decision-support tool rather than simply as a technology solution. This will help me approach future problems with a more structured and practical mindset.",
  "5. One takeaway. In a single sentence, what is the one thing you would carry forward from this project?  (1 sentence)",
  "Good solution starts with understanding the real business problem and existing processes before deciding what needs to be built."
]
};

export const ALL_RAW_DOCUMENTS = [
  RAW_AI_CRACKER_DOC,
  RAW_LIVE_PROJECT_DOC
];
