import {
  ChronologicalChange,
  MarketCommodity,
  CommodityForecast,
  ScenarioDefinition,
  MonteCarloSimulationResult,
  FinancialAssetCracker,
  EntityNode,
  EntityLink,
  AuditRecord
} from './types';

export const CHRONOLOGICAL_CHANGES: ChronologicalChange[] = [
  {
    id: 'chg-01',
    date: '08 Sep 2026',
    title: 'Feedstock economics diverged sharply in favor of Ethane',
    summary: 'Naphtha costs surged 61% YoY while US ethane import costs fell 11%, widening gross ethylene feedstock cost gap to ~10x ($250/t ethane vs $2,629/t naphtha).',
    category: 'FEEDSTOCK',
    whyItMatters: 'Protects RIL O2C margins during the ongoing global cracker downcycle, validating rapid conversion of flexible units to ethane.',
    source: {
      id: 'cit-ai-cracker-s8',
      sourceTitle: 'AI Based Cracker Industry Analysis & Scenario Simulation',
      sourceType: 'DOCUMENT',
      date: 'Aug 2026',
      pageOrSection: 'Section 8 & 9',
      exactQuote: 'At current public prices, feedstock to make 1t ethylene costs ~$250 by ethane route vs ~$2,629 by naphtha route.',
      confidence: 'HIGH'
    },
    confidence: 'HIGH',
    potentialImpact: '+₹1,850 Cr annual EBITDA contribution if Dahej and Hazira maximize ethane cracking.',
    deltaType: 'POSITIVE'
  },
  {
    id: 'chg-02',
    date: '06 Sep 2026',
    title: 'QatarEnergy lean-gas transition shifts feedstock security risk',
    summary: 'QatarEnergy shift to supplying "lean" gas makes imported US ethane a deliberate, purchased feedstock choice rather than a regional by-product.',
    category: 'ASSUMPTION',
    whyItMatters: 'RIL must accelerate long-term US Mont Belvieu supply agreements and VLEC shipping scheduling.',
    source: {
      id: 'cit-grp9-p1',
      sourceTitle: 'Beyond Naphtha: Capital Allocation & Feedstock Economics',
      sourceType: 'DOCUMENT',
      date: 'July 2026',
      pageOrSection: 'Page 1, Situation',
      exactQuote: 'QatarEnergy shift to supplying lean gas makes imported US ethane a deliberate, paid-for feedstock choice rather than a by-product.',
      confidence: 'HIGH'
    },
    confidence: 'HIGH',
    potentialImpact: 'Increases reliance on 6 existing + 3 planned VLECs and USD/INR hedge book.',
    deltaType: 'CRITICAL'
  },
  {
    id: 'chg-03',
    date: '02 Sep 2026',
    title: 'Project workstreams aligned into 5 core focus areas',
    summary: 'Project moved definitively away from naphtha-to-ethane switching into AI Optimization, Market Forecasting, Scenario Simulation, Dynamic Financial Model, and External Benchmarking.',
    category: 'DECISION',
    whyItMatters: 'Eliminates redundant research into solved problems; focuses engineering resources on dynamic market-driven capital allocation.',
    source: {
      id: 'cit-ai-cracker-s2',
      sourceTitle: 'AI Based Cracker Industry Analysis & Scenario Simulation',
      sourceType: 'DOCUMENT',
      date: 'Aug 2026',
      pageOrSection: 'Section 2 & 3',
      exactQuote: 'Since the naphtha to ethane shift is already an established, completed decision for RIL, the project became a decision support tool for ongoing and future scenarios.',
      confidence: 'HIGH'
    },
    confidence: 'HIGH',
    potentialImpact: 'Accelerates delivery of executive decision dashboard and live scenario simulator.',
    deltaType: 'POSITIVE'
  },
  {
    id: 'chg-04',
    date: '20 Jul 2026',
    title: 'AI live dashboard scope approved: dual simulation architecture',
    summary: 'Project scope approved for dual simulation: RIL-specific asset modeling and global cracker industry outlook, backed by AI price predictions.',
    category: 'DECISION',
    whyItMatters: 'Positions the platform as an institutional tool used by executive leadership rather than an isolated study.',
    source: {
      id: 'cit-ai-cracker-s4',
      sourceTitle: 'AI Based Cracker Industry Analysis & Scenario Simulation',
      sourceType: 'DOCUMENT',
      date: 'Aug 2026',
      pageOrSection: 'Section 3 & 4',
      exactQuote: 'The analysis now has two parts: an RIL specific simulation, and a global industry simulation, using AI based price prediction as a core input.',
      confidence: 'HIGH'
    },
    confidence: 'HIGH',
    potentialImpact: 'Scope expanded to cover RIL expansion viability and global cracker oversupply tracking.',
    deltaType: 'POSITIVE'
  }
];

export interface KeyDecision {
  id: string;
  decision: string;
  decisionMaker: string;
  rationale: string;
  impact: string;
  status: 'ACTIVE' | 'SUPERSEDED' | 'PENDING';
  sourceCitation: { sourceTitle: string };
}

export const KEY_DECISIONS: KeyDecision[] = [
  {
    id: 'dec-01',
    decision: 'Reframe the project away from "should RIL switch to ethane" toward AI-driven decision support',
    decisionMaker: 'Project Team',
    rationale: 'RIL already completed its naphtha-to-ethane transition between 2014 and 2017 and can rebalance feed within a fraction of a day using internal LP optimizers, so studying the switch itself was redundant.',
    impact: 'Redirected engineering effort toward AI optimization, price forecasting, scenario simulation, and capital allocation modeling.',
    status: 'ACTIVE',
    sourceCitation: { sourceTitle: 'AI Based Cracker Industry Analysis and Scenario Simulation' }
  },
  {
    id: 'dec-02',
    decision: 'Adopt a dual simulation architecture: RIL-specific and global industry',
    decisionMaker: 'Project Team',
    rationale: 'A single-asset view understates risk; global cracker oversupply (+40 Mt capacity vs +27 Mt demand) directly affects the pricing environment RIL sells into.',
    impact: 'Dashboard models both RIL asset economics and global oversupply dynamics side by side.',
    status: 'ACTIVE',
    sourceCitation: { sourceTitle: 'AI Based Cracker Industry Analysis and Scenario Simulation' }
  },
  {
    id: 'dec-03',
    decision: 'Prioritize ethane feedstock share as the primary margin lever',
    decisionMaker: 'Project Team',
    rationale: 'Ethane cracking yields ~79.5% ethylene versus ~33.2% for naphtha, and ethane pricing is largely decoupled from Brent crude, creating a structural cost advantage of roughly $210-265 per tonne of ethylene.',
    impact: 'Feedstock mix optimization treated as the highest-leverage lever in the financial model and Monte Carlo simulation.',
    status: 'ACTIVE',
    sourceCitation: { sourceTitle: 'Beyond Naphtha: Capital Allocation, Feedstock-Switching Economics & Forex-Risk Quantification' }
  }
];

export const MARKET_COMMODITIES: MarketCommodity[] = [
  {
    id: 'comm-ethylene',
    symbol: 'ETH-C2',
    name: 'Ethylene (CFR SE Asia / India)',
    category: 'PRODUCT',
    currentPrice: 886,
    previousPrice: 865.23,
    unit: 'USD/tonne',
    currency: 'USD',
    change1D: 2.40,
    change1W: 3.10,
    change1M: 2.40,
    change3M: -2.10,
    changeYTD: -1.01,
    change1Y: 1.26,
    trend: 'UP',
    source: 'Platts / ICIS Benchmark Feed • Yahoo Finance Live API',
    sourceUrl: 'https://finance.yahoo.com/quote/BZ=F/',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2025-10-01', price: 875.00 },
      { date: '2025-11-01', price: 860.00 },
      { date: '2025-12-01', price: 850.00 },
      { date: '2026-01-01', price: 895.00 },
      { date: '2026-02-01', price: 925.00 },
      { date: '2026-03-01', price: 940.00 },
      { date: '2026-04-01', price: 915.00 },
      { date: '2026-05-01', price: 890.00 },
      { date: '2026-06-01', price: 905.00 },
      { date: '2026-07-01', price: 880.00 },
      { date: '2026-08-01', price: 865.23 },
      { date: '2026-09-21', price: 886.00 }
    ]
  },
  {
    id: 'comm-propylene',
    symbol: 'PRP-C3',
    name: 'Propylene (FOB Korea / India)',
    category: 'PRODUCT',
    currentPrice: 833,
    previousPrice: 813,
    unit: 'USD/tonne',
    currency: 'USD',
    change1D: 2.46,
    change1W: 2.90,
    change1M: 2.46,
    change3M: -2.10,
    changeYTD: -1.01,
    change1Y: 1.26,
    trend: 'UP',
    source: 'ICIS Chemical Pricing • Yahoo Finance Live API',
    sourceUrl: 'https://finance.yahoo.com/quote/BZ=F/',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2025-10-01', price: 823 },
      { date: '2025-11-01', price: 808 },
      { date: '2025-12-01', price: 799 },
      { date: '2026-01-01', price: 841 },
      { date: '2026-02-01', price: 870 },
      { date: '2026-03-01', price: 884 },
      { date: '2026-04-01', price: 860 },
      { date: '2026-05-01', price: 837 },
      { date: '2026-06-01', price: 851 },
      { date: '2026-07-01', price: 827 },
      { date: '2026-08-01', price: 813 },
      { date: '2026-09-21', price: 833 }
    ]
  },
  {
    id: 'comm-naphtha',
    symbol: 'NAPH-SING',
    name: 'Naphtha (CFR Japan / Singapore)',
    category: 'FEEDSTOCK',
    currentPrice: 816,
    previousPrice: 833.5,
    unit: 'USD/tonne',
    currency: 'USD',
    change1D: -2.10,
    change1W: -1.40,
    change1M: -2.10,
    change3M: 21.43,
    changeYTD: 22.16,
    change1Y: 26.51,
    trend: 'DOWN',
    source: 'Argus Media / ICE Brent Proxy • Yahoo Finance',
    sourceUrl: 'https://finance.yahoo.com/quote/BZ=F/',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2025-10-01', price: 645.0 },
      { date: '2025-11-01', price: 632.0 },
      { date: '2025-12-01', price: 622.0 },
      { date: '2026-01-01', price: 668.0 },
      { date: '2026-02-01', price: 692.0 },
      { date: '2026-03-01', price: 708.0 },
      { date: '2026-04-01', price: 685.0 },
      { date: '2026-05-01', price: 660.0 },
      { date: '2026-06-01', price: 672.0 },
      { date: '2026-07-01', price: 648.0 },
      { date: '2026-08-01', price: 833.5 },
      { date: '2026-09-21', price: 816.0 }
    ]
  },
  {
    id: 'comm-ethane',
    symbol: 'ETH-MB',
    name: 'Ethane (Mont Belvieu FOB)',
    category: 'FEEDSTOCK',
    currentPrice: 157,
    previousPrice: 159.88,
    unit: 'USD/tonne',
    currency: 'USD',
    change1D: -1.80,
    change1W: -1.20,
    change1M: -1.80,
    change3M: -1.69,
    changeYTD: -8.19,
    change1Y: 3.09,
    trend: 'DOWN',
    source: 'OPIS / EIA Mont Belvieu • Yahoo Finance Henry Hub',
    sourceUrl: 'https://finance.yahoo.com/quote/NG=F/',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2025-10-01', price: 152.3 },
      { date: '2025-11-01', price: 156.3 },
      { date: '2025-12-01', price: 161.0 },
      { date: '2026-01-01', price: 171.0 },
      { date: '2026-02-01', price: 175.0 },
      { date: '2026-03-01', price: 172.4 },
      { date: '2026-04-01', price: 163.7 },
      { date: '2026-05-01', price: 155.0 },
      { date: '2026-06-01', price: 159.7 },
      { date: '2026-07-01', price: 150.3 },
      { date: '2026-08-01', price: 159.88 },
      { date: '2026-09-21', price: 157.0 }
    ]
  },
  {
    id: 'comm-brent',
    symbol: 'BRENT',
    name: 'Brent Crude Spot',
    category: 'ENERGY',
    currentPrice: 97.42,
    previousPrice: 96.17,
    unit: 'USD/bbl',
    currency: 'USD',
    change1D: 1.30,
    change1W: 1.60,
    change1M: 1.30,
    change3M: 22.85,
    changeYTD: 24.26,
    change1Y: 27.35,
    trend: 'UP',
    source: 'ICE Futures Europe • Yahoo Finance Live API (BZ=F)',
    sourceUrl: 'https://finance.yahoo.com/quote/BZ=F/',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2025-10-01', price: 76.5 },
      { date: '2025-11-01', price: 74.2 },
      { date: '2025-12-01', price: 73.1 },
      { date: '2026-01-01', price: 78.4 },
      { date: '2026-02-01', price: 81.2 },
      { date: '2026-03-01', price: 82.9 },
      { date: '2026-04-01', price: 80.5 },
      { date: '2026-05-01', price: 77.8 },
      { date: '2026-06-01', price: 79.3 },
      { date: '2026-07-01', price: 76.2 },
      { date: '2026-08-01', price: 96.17 },
      { date: '2026-09-21', price: 97.42 }
    ]
  },
  {
    id: 'comm-fx-usdinr',
    symbol: 'USDINR',
    name: 'USD / INR Spot Exchange Rate',
    category: 'FX',
    currentPrice: 83.95,
    previousPrice: 83.88,
    unit: 'INR per USD',
    currency: 'INR',
    change1D: 0.08,
    change1W: 0.22,
    change1M: 0.65,
    change3M: 1.15,
    changeYTD: 2.40,
    change1Y: 3.80,
    trend: 'UP',
    source: 'RBI Reference Rate • Yahoo Finance Real-Time (INR=X)',
    sourceUrl: 'https://finance.yahoo.com/quote/INR=X/',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2026-03-01', price: 82.9 },
      { date: '2026-04-01', price: 83.1 },
      { date: '2026-05-01', price: 83.3 },
      { date: '2026-06-01', price: 83.5 },
      { date: '2026-07-01', price: 83.7 },
      { date: '2026-08-01', price: 83.88 },
      { date: '2026-09-21', price: 83.95 }
    ]
  },
  {
    id: 'comm-o2c-margin',
    symbol: 'RIL-O2C-GRM',
    name: 'RIL O2C Integrated Segment Margin',
    category: 'CRACK',
    currentPrice: 9.80,
    previousPrice: 9.40,
    unit: 'USD/bbl',
    currency: 'USD',
    change1D: 4.25,
    change1W: 8.90,
    change1M: 12.40,
    change3M: 6.50,
    changeYTD: 14.80,
    change1Y: 22.50,
    trend: 'UP',
    source: 'Internal RIL Operational Proxy • Yahoo Finance (RELIANCE.NS)',
    sourceUrl: 'https://finance.yahoo.com/quote/RELIANCE.NS/',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'HIGH',
    history: [
      { date: '2026-03-01', price: 8.2 },
      { date: '2026-04-01', price: 8.5 },
      { date: '2026-05-01', price: 8.8 },
      { date: '2026-06-01', price: 9.1 },
      { date: '2026-07-01', price: 9.2 },
      { date: '2026-08-01', price: 9.4 },
      { date: '2026-09-21', price: 9.8 }
    ]
  }
];

export const COMMODITY_FORECASTS: Record<string, CommodityForecast> = {
  'comm-ethane': {
    commodityId: 'comm-ethane',
    commodityName: 'Ethane (Mont Belvieu FOB)',
    unit: 'USD/tonne',
    currency: 'USD',
    horizon: '12M',
    trainingPeriod: '2021-01 to 2026-08 (68 monthly observations)',
    lastUpdated: '2026-09-21 06:00 UTC',
    models: [
      { modelName: 'AutoARIMA', weight: 0.25, mae: 6.2, rmse: 8.1, mape: 4.1, sMape: 4.0, confidenceScore: 88 },
      { modelName: 'ETS', weight: 0.15, mae: 7.4, rmse: 9.8, mape: 5.0, sMape: 4.8, confidenceScore: 82 },
      { modelName: 'LightGBM', weight: 0.30, mae: 5.1, rmse: 6.9, mape: 3.4, sMape: 3.3, confidenceScore: 92 },
      { modelName: 'TimesFM', weight: 0.30, mae: 4.8, rmse: 6.4, mape: 3.1, sMape: 3.0, confidenceScore: 94 }
    ],
    consensusSummary: 'Strong consensus that US ethane remains range-bound between $135 and $160/t over next 12M due to surging Permian NGL production and growing LNG export pipeline capacity.',
    dispersion: 'LOW',
    points: [
      { date: '2026-07', actual: 149, pointForecast: 149, p10: 145, p50: 149, p90: 153, isHistorical: true },
      { date: '2026-08', actual: 147, pointForecast: 147, p10: 143, p50: 147, p90: 151, isHistorical: true },
      { date: '2026-09', actual: 145, pointForecast: 145, p10: 140, p50: 145, p90: 150, isHistorical: true },
      { date: '2026-10', pointForecast: 143, p10: 136, p50: 143, p90: 151, isHistorical: false },
      { date: '2026-11', pointForecast: 141, p10: 133, p50: 141, p90: 150, isHistorical: false },
      { date: '2026-12', pointForecast: 139, p10: 130, p50: 139, p90: 149, isHistorical: false },
      { date: '2027-01', pointForecast: 142, p10: 131, p50: 142, p90: 154, isHistorical: false },
      { date: '2027-02', pointForecast: 145, p10: 132, p50: 145, p90: 158, isHistorical: false },
      { date: '2027-03', pointForecast: 148, p10: 134, p50: 148, p90: 163, isHistorical: false }
    ]
  },
  'comm-naphtha': {
    commodityId: 'comm-naphtha',
    commodityName: 'Naphtha (CFR Japan / Singapore)',
    unit: 'USD/tonne',
    currency: 'USD',
    horizon: '12M',
    trainingPeriod: '2021-01 to 2026-08 (68 monthly observations)',
    lastUpdated: '2026-09-21 06:00 UTC',
    models: [
      { modelName: 'AutoARIMA', weight: 0.20, mae: 14.2, rmse: 19.1, mape: 5.2, sMape: 5.1, confidenceScore: 84 },
      { modelName: 'ETS', weight: 0.15, mae: 16.4, rmse: 22.0, mape: 6.1, sMape: 5.9, confidenceScore: 79 },
      { modelName: 'LightGBM', weight: 0.35, mae: 11.5, rmse: 15.3, mape: 4.1, sMape: 4.0, confidenceScore: 90 },
      { modelName: 'TimesFM', weight: 0.30, mae: 10.8, rmse: 14.7, mape: 3.9, sMape: 3.8, confidenceScore: 91 }
    ],
    consensusSummary: 'Geopolitical crude premiums and Russian refinery maintenance project naphtha staying elevated between $660 and $740/t through early 2027.',
    dispersion: 'MODERATE',
    points: [
      { date: '2026-07', actual: 645, pointForecast: 645, p10: 630, p50: 645, p90: 660, isHistorical: true },
      { date: '2026-08', actual: 664, pointForecast: 664, p10: 645, p50: 664, p90: 683, isHistorical: true },
      { date: '2026-09', actual: 685, pointForecast: 685, p10: 660, p50: 685, p90: 710, isHistorical: true },
      { date: '2026-10', pointForecast: 698, p10: 665, p50: 698, p90: 735, isHistorical: false },
      { date: '2026-11', pointForecast: 710, p10: 672, p50: 710, p90: 755, isHistorical: false },
      { date: '2026-12', pointForecast: 725, p10: 680, p50: 725, p90: 780, isHistorical: false },
      { date: '2027-01', pointForecast: 715, p10: 668, p50: 715, p90: 775, isHistorical: false },
      { date: '2027-02', pointForecast: 705, p10: 650, p50: 705, p90: 770, isHistorical: false },
      { date: '2027-03', pointForecast: 695, p10: 635, p50: 695, p90: 765, isHistorical: false }
    ]
  },
  'comm-ethylene': {
    commodityId: 'comm-ethylene',
    commodityName: 'Ethylene (CFR SE Asia / India)',
    unit: 'USD/tonne',
    currency: 'USD',
    horizon: '12M',
    trainingPeriod: '2021-01 to 2026-08 (68 monthly observations)',
    lastUpdated: '2026-09-21 06:00 UTC',
    models: [
      { modelName: 'AutoARIMA', weight: 0.25, mae: 12.1, rmse: 16.5, mape: 4.5, sMape: 4.4, confidenceScore: 86 },
      { modelName: 'ETS', weight: 0.15, mae: 14.8, rmse: 19.2, mape: 5.4, sMape: 5.2, confidenceScore: 80 },
      { modelName: 'LightGBM', weight: 0.30, mae: 10.2, rmse: 13.9, mape: 3.8, sMape: 3.7, confidenceScore: 91 },
      { modelName: 'TimesFM', weight: 0.30, mae: 9.8, rmse: 13.2, mape: 3.6, sMape: 3.5, confidenceScore: 93 }
    ],
    consensusSummary: 'Global cracker oversupply (+40 Mt capacity surge vs +27 Mt demand) keeps ethylene prices compressed between $820 and $880/t.',
    dispersion: 'LOW',
    points: [
      { date: '2026-07', actual: 830, pointForecast: 830, p10: 815, p50: 830, p90: 845, isHistorical: true },
      { date: '2026-08', actual: 825, pointForecast: 825, p10: 808, p50: 825, p90: 842, isHistorical: true },
      { date: '2026-09', actual: 840, pointForecast: 840, p10: 820, p50: 840, p90: 860, isHistorical: true },
      { date: '2026-10', pointForecast: 845, p10: 822, p50: 845, p90: 870, isHistorical: false },
      { date: '2026-11', pointForecast: 850, p10: 824, p50: 850, p90: 880, isHistorical: false },
      { date: '2026-12', pointForecast: 855, p10: 825, p50: 855, p90: 890, isHistorical: false },
      { date: '2027-01', pointForecast: 860, p10: 826, p50: 860, p90: 900, isHistorical: false },
      { date: '2027-02', pointForecast: 865, p10: 828, p50: 865, p90: 910, isHistorical: false },
      { date: '2027-03', pointForecast: 870, p10: 830, p50: 870, p90: 920, isHistorical: false }
    ]
  }
};

export const SCENARIO_DEFINITIONS: Record<string, ScenarioDefinition> = {
  'base-case': {
    id: 'base-case',
    name: 'Base Case (Executive Plan)',
    type: 'BASE',
    description: 'Current baseline: Brent at $82/bbl, US ethane delivered at $270/t ($145 FOB + $125 freight), Naphtha at $685/t, plant utilization at 92%, on-schedule startup.',
    inputs: {
      brentOilDeltaPct: 0,
      ethanePriceDeltaPct: 0,
      naphthaPriceDeltaPct: 0,
      usEthaneImportCostDeltaPct: 0,
      naturalGasDeltaPct: 0,
      fxUsdInr: 84.0,
      ethylenePriceDeltaPct: 0,
      propylenePriceDeltaPct: 0,
      plantUtilizationPct: 92,
      projectStartupDelayMonths: 0,
      capexEscalationPct: 0
    },
    outputs: {
      revenueINR_Cr: 642500,
      ebitdaINR_Cr: 58400,
      o2cMarginPct: 9.09,
      netCashFlowINR_Cr: 34200,
      npvUSD_Mn: 2840,
      irrPct: 19.4,
      paybackYears: 4.8,
      ebitdaDeltaINR_Cr: 0,
      npvDeltaUSD_Mn: 0
    },
    impactWaterfall: [
      { component: 'Baseline EBITDA', deltaINR_Cr: 58400, direction: 'POSITIVE' }
    ]
  },
  'upside-case': {
    id: 'upside-case',
    name: 'Ethane Advantage Acceleration (Upside)',
    type: 'UPSIDE',
    description: 'Naphtha spikes +20% due to geopolitical crude supply cuts, while US Mont Belvieu ethane drops -10% with Permian debottlenecking. RIL captures peak switching delta.',
    inputs: {
      brentOilDeltaPct: 15,
      ethanePriceDeltaPct: -10,
      naphthaPriceDeltaPct: 20,
      usEthaneImportCostDeltaPct: -8,
      naturalGasDeltaPct: -5,
      fxUsdInr: 85.0,
      ethylenePriceDeltaPct: 8,
      propylenePriceDeltaPct: 5,
      plantUtilizationPct: 96,
      projectStartupDelayMonths: 0,
      capexEscalationPct: 0
    },
    outputs: {
      revenueINR_Cr: 685200,
      ebitdaINR_Cr: 72100,
      o2cMarginPct: 10.52,
      netCashFlowINR_Cr: 44800,
      npvUSD_Mn: 3780,
      irrPct: 24.6,
      paybackYears: 3.8,
      ebitdaDeltaINR_Cr: 13700,
      npvDeltaUSD_Mn: 940
    },
    impactWaterfall: [
      { component: 'Base EBITDA', deltaINR_Cr: 58400, direction: 'POSITIVE' },
      { component: 'Ethane Feedstock Cost Reduction (-10%)', deltaINR_Cr: 4800, direction: 'POSITIVE' },
      { component: 'Ethylene & Product Realization Uplift (+8%)', deltaINR_Cr: 5600, direction: 'POSITIVE' },
      { component: 'Utilization Gain (92% -> 96%)', deltaINR_Cr: 2400, direction: 'POSITIVE' },
      { component: 'Forex Translation Effect (84.0 -> 85.0)', deltaINR_Cr: 900, direction: 'POSITIVE' }
    ]
  },
  'downside-case': {
    id: 'downside-case',
    name: 'Global Oversupply & Capex Delay (Downside)',
    type: 'DOWNSIDE',
    description: 'Chinese cracker capacity flood hits regional chemical margins (-15% ethylene), US shipping charter spikes, and Dahej cryogenic terminal expansion faces 3-month startup delay.',
    inputs: {
      brentOilDeltaPct: -10,
      ethanePriceDeltaPct: 15,
      naphthaPriceDeltaPct: -5,
      usEthaneImportCostDeltaPct: 25,
      naturalGasDeltaPct: 15,
      fxUsdInr: 83.0,
      ethylenePriceDeltaPct: -15,
      propylenePriceDeltaPct: -12,
      plantUtilizationPct: 84,
      projectStartupDelayMonths: 3,
      capexEscalationPct: 8
    },
    outputs: {
      revenueINR_Cr: 574000,
      ebitdaINR_Cr: 43200,
      o2cMarginPct: 7.52,
      netCashFlowINR_Cr: 21500,
      npvUSD_Mn: 1520,
      irrPct: 13.2,
      paybackYears: 7.1,
      ebitdaDeltaINR_Cr: -15200,
      npvDeltaUSD_Mn: -1320
    },
    impactWaterfall: [
      { component: 'Base EBITDA', deltaINR_Cr: 58400, direction: 'POSITIVE' },
      { component: 'Ethylene Realization Drop (-15%)', deltaINR_Cr: -8400, direction: 'NEGATIVE' },
      { component: 'VLEC Shipping & Ethane Freight Spike (+25%)', deltaINR_Cr: -3200, direction: 'NEGATIVE' },
      { component: 'Utilization Curtailment (92% -> 84%)', deltaINR_Cr: -2100, direction: 'NEGATIVE' },
      { component: '3-Month Expansion Startup Delay Penalty', deltaINR_Cr: -1500, direction: 'NEGATIVE' }
    ]
  }
};

export const MONTE_CARLO_RESULT: MonteCarloSimulationResult = {
  iterations: 10000,
  timestamp: '2026-09-21 07:00 UTC',
  variables: [
    { name: 'Brent Crude Oil', distribution: 'Lognormal', parameters: 'Mean $82/bbl, Volatility 24%' },
    { name: 'US Mont Belvieu Ethane', distribution: 'Empirical', parameters: 'Range $115 - $190/t, Mode $145/t' },
    { name: 'Asian Naphtha', distribution: 'Lognormal', parameters: 'Mean $680/t, Correlation with Brent 0.91' },
    { name: 'USD/INR Exchange Rate', distribution: 'Normal', parameters: 'Mean 84.2, StdDev 1.8' },
    { name: 'Terminal Expansion Startup Delay', distribution: 'Discrete', parameters: 'P(0m)=65%, P(1m)=20%, P(3m)=12%, P(6m)=3%' }
  ],
  metrics: [
    { name: 'Project NPV', unit: 'USD Mn', mean: 2815, p10: 1680, p25: 2240, p50: 2840, p75: 3380, p90: 3950, min: 1120, max: 4820 },
    { name: 'Project IRR', unit: '%', mean: 19.3, p10: 14.1, p25: 16.8, p50: 19.4, p75: 22.3, p90: 25.4, min: 9.8, max: 29.5 },
    { name: 'Annual O2C EBITDA', unit: 'INR Cr', mean: 58200, p10: 44600, p25: 51800, p50: 58400, p75: 65100, p90: 72800, min: 36200, max: 86400 },
    { name: 'Payback Period', unit: 'Years', mean: 4.9, p10: 3.6, p25: 4.1, p50: 4.8, p75: 5.6, p90: 6.8, min: 3.1, max: 9.4 }
  ],
  npvDistributionBins: [
    { range: '< $1,500M', count: 420, cumulativePct: 4.2 },
    { range: '$1,500M - $2,000M', count: 1280, cumulativePct: 17.0 },
    { range: '$2,000M - $2,500M', count: 2150, cumulativePct: 38.5 },
    { range: '$2,500M - $3,000M', count: 2980, cumulativePct: 68.3 },
    { range: '$3,000M - $3,500M', count: 1840, cumulativePct: 86.7 },
    { range: '$3,500M - $4,000M', count: 960, cumulativePct: 96.3 },
    { range: '> $4,000M', count: 370, cumulativePct: 100.0 }
  ],
  irrDistributionBins: [
    { range: '< 12%', count: 380, cumulativePct: 3.8 },
    { range: '12% - 16%', count: 1650, cumulativePct: 20.3 },
    { range: '16% - 20%', count: 3750, cumulativePct: 57.8 },
    { range: '20% - 24%', count: 2850, cumulativePct: 86.3 },
    { range: '24% - 28%', count: 1120, cumulativePct: 97.5 },
    { range: '> 28%', count: 250, cumulativePct: 100.0 }
  ],
  ebitdaDistributionBins: [
    { range: '< ₹45,000 Cr', count: 520, cumulativePct: 5.2 },
    { range: '₹45k - ₹52k Cr', count: 1850, cumulativePct: 23.7 },
    { range: '₹52k - ₹60k Cr', count: 3620, cumulativePct: 59.9 },
    { range: '₹60k - ₹68k Cr', count: 2680, cumulativePct: 86.7 },
    { range: '₹68k - ₹75k Cr', count: 1040, cumulativePct: 97.1 },
    { range: '> ₹75,000 Cr', count: 290, cumulativePct: 100.0 }
  ],
  topSensitivityDrivers: [
    { variable: 'Ethane vs Naphtha Spread (Gross Delta)', swingImpactUSD_Mn: 1420, correlation: 0.78 },
    { variable: 'Global Ethylene Realization / Downstream Cash Margin', swingImpactUSD_Mn: 1180, correlation: 0.71 },
    { variable: 'Brent Crude Baseline Level', swingImpactUSD_Mn: 820, correlation: 0.54 },
    { variable: 'Startup Schedule Delay (Months)', swingImpactUSD_Mn: 640, correlation: -0.42 },
    { variable: 'USD/INR FX Translation', swingImpactUSD_Mn: 480, correlation: 0.35 },
    { variable: 'VLEC Charter & Shipping Freight Rate', swingImpactUSD_Mn: 390, correlation: -0.28 }
  ]
};

export const CRACKER_ASSETS: FinancialAssetCracker[] = [
  {
    id: 'asset-jamnagar',
    siteName: 'Jamnagar',
    currentFeedstockCapacityMMTPA: { naphtha: 0.8, ethane: 1.6, propane: 0.4 },
    ethyleneCapacityKTA: 1500,
    propyleneCapacityKTA: 750,
    proximityToDahejTerminalKm: 340,
    pipelineConnected: true,
    conversionTierRank: 1,
    capexCommittedUSD_Mn: 1200,
    spentUSD_Mn: 780,
    remainingUSD_Mn: 420,
    npvUSD_Mn: 1420,
    irrPct: 22.4,
    paybackYears: 4.1,
    startupTarget: 'Q2 FY27',
    currentScheduleStatus: 'ON_TRACK'
  },
  {
    id: 'asset-dahej',
    siteName: 'Dahej',
    currentFeedstockCapacityMMTPA: { naphtha: 0.4, ethane: 1.2, propane: 0.2 },
    ethyleneCapacityKTA: 1100,
    propyleneCapacityKTA: 450,
    proximityToDahejTerminalKm: 12,
    pipelineConnected: true,
    conversionTierRank: 2,
    capexCommittedUSD_Mn: 550,
    spentUSD_Mn: 390,
    remainingUSD_Mn: 160,
    npvUSD_Mn: 780,
    irrPct: 20.1,
    paybackYears: 4.6,
    startupTarget: 'Q4 FY26',
    currentScheduleStatus: 'ON_TRACK'
  },
  {
    id: 'asset-hazira',
    siteName: 'Hazira',
    currentFeedstockCapacityMMTPA: { naphtha: 0.7, ethane: 0.6, propane: 0.3 },
    ethyleneCapacityKTA: 900,
    propyleneCapacityKTA: 520,
    proximityToDahejTerminalKm: 130,
    pipelineConnected: true,
    conversionTierRank: 3,
    capexCommittedUSD_Mn: 420,
    spentUSD_Mn: 240,
    remainingUSD_Mn: 180,
    npvUSD_Mn: 490,
    irrPct: 17.8,
    paybackYears: 5.2,
    startupTarget: 'Q3 FY27',
    currentScheduleStatus: 'ON_TRACK'
  },
  {
    id: 'asset-nagothane',
    siteName: 'Nagothane',
    currentFeedstockCapacityMMTPA: { naphtha: 0.1, ethane: 0.5, propane: 0.2 },
    ethyleneCapacityKTA: 550,
    propyleneCapacityKTA: 180,
    proximityToDahejTerminalKm: 380,
    pipelineConnected: true,
    conversionTierRank: 4,
    capexCommittedUSD_Mn: 210,
    spentUSD_Mn: 120,
    remainingUSD_Mn: 90,
    npvUSD_Mn: 240,
    irrPct: 16.2,
    paybackYears: 5.8,
    startupTarget: 'Q1 FY28',
    currentScheduleStatus: 'DELAYED_1M'
  },
  {
    id: 'asset-vadodara',
    siteName: 'Vadodara',
    currentFeedstockCapacityMMTPA: { naphtha: 0.35, ethane: 0.1, propane: 0.05 },
    ethyleneCapacityKTA: 220,
    propyleneCapacityKTA: 120,
    proximityToDahejTerminalKm: 95,
    pipelineConnected: true,
    conversionTierRank: 5,
    capexCommittedUSD_Mn: 90,
    spentUSD_Mn: 45,
    remainingUSD_Mn: 45,
    npvUSD_Mn: 60,
    irrPct: 12.1,
    paybackYears: 7.4,
    startupTarget: 'Q4 FY28',
    currentScheduleStatus: 'ON_TRACK'
  }
];

export const KNOWLEDGE_GRAPH_NODES: EntityNode[] = [
  { id: 'node-ril', name: 'Reliance Industries Limited', category: 'COMPANY', details: 'India largest private enterprise, O2C revenue ₹6,26,921 Cr (FY25)', connectionsCount: 12 },
  { id: 'node-rajesh', name: 'Rajesh Rawal', category: 'PERSON', details: 'Business Head, Cracker & Poly Business, RIL', connectionsCount: 5 },
  { id: 'node-hanoz', name: 'Hanoz', category: 'PERSON', details: 'New Business Head of Cracker, RIL', connectionsCount: 6 },
  { id: 'node-adepu', name: 'Adepu', category: 'PERSON', details: 'Reliance Mentor & Cracker Domain Lead', connectionsCount: 5 },
  { id: 'node-debabrata', name: 'Debabrata Mukherjee', category: 'PERSON', details: 'Jio Institute Finance Lead (Roll 27GMT0008)', connectionsCount: 8 },
  { id: 'node-dhruv', name: 'Dhruv Choudhary', category: 'PERSON', details: 'Jio Institute Finance Researcher (ex-Nomura)', connectionsCount: 7 },
  { id: 'node-ethane', name: 'Ethane (Feedstock)', category: 'COMMODITY', details: '1.5 MMTPA imported from US; ~80% ethylene yield; $250/t gross cost', connectionsCount: 10 },
  { id: 'node-naphtha', name: 'Naphtha (Feedstock)', category: 'COMMODITY', details: 'Liquid feedstock; ~30% ethylene yield; $2,629/t gross cost', connectionsCount: 8 },
  { id: 'node-ethylene', name: 'Ethylene (Product)', category: 'COMMODITY', details: 'Primary building block; $840/t; global market $459.7B', connectionsCount: 9 },
  { id: 'node-propylene', name: 'Propylene (Product)', category: 'COMMODITY', details: 'Secondary olefin; $790/t; derivative of cracker', connectionsCount: 6 },
  { id: 'node-jamnagar', name: 'Jamnagar Complex', category: 'PLANT', details: 'Largest integrated refining & cracker complex, Tier 1 conversion', connectionsCount: 6 },
  { id: 'node-dahej', name: 'Dahej Terminal & Cracker', category: 'PLANT', details: 'Cryogenic ethane terminal (>1.5 MMTPA) + 100km pipeline', connectionsCount: 7 },
  { id: 'node-hazira', name: 'Hazira Complex', category: 'PLANT', details: 'Dual feed cracker, 900 KTA ethylene capacity', connectionsCount: 5 },
  { id: 'node-vlec', name: 'VLEC Fleet', category: 'PROJECT', details: '6 existing + 3 planned Very Large Ethane Carriers', connectionsCount: 5 },
  { id: 'node-expansion', name: 'O2C Capacity Expansion', category: 'PROJECT', details: '>$2 Billion committed cryogenic ethane terminals and pipelines', connectionsCount: 7 },
  { id: 'node-oversupply', name: 'Global Cracker Oversupply', category: 'RISK', details: '+40 Mt capacity surge vs +27 Mt demand; ~80% utilization', connectionsCount: 5 }
];

export const KNOWLEDGE_GRAPH_LINKS: EntityLink[] = [
  { source: 'node-ril', target: 'node-jamnagar', relationship: 'OPERATES', weight: 2 },
  { source: 'node-ril', target: 'node-dahej', relationship: 'OPERATES_TERMINAL', weight: 3 },
  { source: 'node-dahej', target: 'node-vlec', relationship: 'RECEIVES_CARGOES_VIA', weight: 3 },
  { source: 'node-vlec', target: 'node-ethane', relationship: 'TRANSPORTS_FROM_US', weight: 3 },
  { source: 'node-ethane', target: 'node-ethylene', relationship: 'YIELDS_80_PERCENT', weight: 3 },
  { source: 'node-naphtha', target: 'node-ethylene', relationship: 'YIELDS_30_PERCENT', weight: 2 },
  { source: 'node-naphtha', target: 'node-propylene', relationship: 'CO_PRODUCES', weight: 2 },
  { source: 'node-expansion', target: 'node-dahej', relationship: 'EXPANDS_CAPACITY_AT', weight: 2 },
  { source: 'node-expansion', target: 'node-jamnagar', relationship: 'EXPANDS_CAPACITY_AT', weight: 2 },
  { source: 'node-oversupply', target: 'node-ethylene', relationship: 'DEPRESSES_MARGINS_ON', weight: 3 },
  { source: 'node-oversupply', target: 'node-ril', relationship: 'TESTS_RESILIENCE_OF', weight: 2 }
];

export const AUDIT_RECORDS: Record<string, AuditRecord> = {
  'audit-01': {
    id: 'audit-01',
    question: 'Why did the AI say RIL already has feedstock switching flexibility and that the project should focus on AI optimization?',
    answerSnippet: 'Reliance Industries completed its naphtha-to-ethane operational transition between 2014 and 2017, using internal linear programming optimizers that can rebalance feedstock within a fraction of a day.',
    category: 'FACT',
    model: 'RIL-Hybrid-RAG-Orchestrator v2.4 (BGE-M3 + BM25 + Qwen-72B-Instruct)',
    confidenceScore: 98,
    promptVersion: 'Executive-Institutional-v3.1',
    retrievedDocuments: [
      {
        title: 'AI Based Cracker Industry Analysis and Scenario Simulation',
        type: 'INDUSTRY_ANALYSIS',
        pageOrLine: 'Section 2',
        snippet: 'The original idea of studying a naphtha-to-ethane switch is not the right central framing because Reliance has already built this operational flexibility, having completed the transition between 2014 and 2017.'
      },
      {
        title: 'Beyond Naphtha: Capital Allocation & Feedstock Economics (Group 9)',
        type: 'PROJECT_REPORT',
        pageOrLine: 'Page 1, Paragraph 3',
        snippet: 'Reliance committed >$2 billion to cryogenic ethane terminals at Jamnagar and Dahej, a planned ~100 km Dahej pipeline, and six VLECs.'
      }
    ],
    assumptionsUsed: [
      'Operational switching time is under 24 hours',
      'Existing LP optimizer handles real-time co-product balancing'
    ],
    uncertaintyDisclosures: [
      'Exact internal LP algorithm weights are confidential and estimated via public delta proxies.'
    ],
    timestamp: '2026-09-21 08:15:22 IST'
  },
  'audit-02': {
    id: 'audit-02',
    question: 'How did the model calculate the $250/t ethane vs $2,629/t naphtha gross ethylene cost?',
    answerSnippet: 'Calculated using stoichiometric yield assumptions (80% for ethane, 30% for naphtha) multiplied by prevailing spot feedstock benchmark prices, excluding co-product credits.',
    category: 'MODEL OUTPUT',
    model: 'RIL Quantitative Cracker Unit Model v1.2',
    confidenceScore: 94,
    promptVersion: 'Quantitative-Yield-Math-v1.0',
    retrievedDocuments: [
      {
        title: 'AI Based Cracker Industry Analysis and Scenario Simulation',
        type: 'INDUSTRY_ANALYSIS',
        pageOrLine: 'Section 8, Table 2',
        snippet: 'Ethane route: 1.25 tonnes ethane per tonne ethylene @ $200/t landed = ~$250/t. Naphtha route: 3.33 tonnes naphtha per tonne ethylene @ $790/t = ~$2,629/t.'
      }
    ],
    numericalCalculations: [
      'Ethane route: 1 tonne ethylene / 0.80 yield = 1.25 tonnes ethane required. 1.25 * $200/t delivered cost = $250/tonne ethylene.',
      'Naphtha route: 1 tonne ethylene / 0.30 yield = 3.33 tonnes naphtha required. 3.33 * $790/t benchmark = $2,630.70/tonne ethylene (gross, before co-product credits).'
    ],
    assumptionsUsed: [
      'Gross feedstock only; excludes pygas, mixed C4s, fuel gas netbacks',
      '80% ethylene yield on ethane basis from Oxford Institute for Energy Studies',
      '30% ethylene yield on naphtha basis from industry steam cracking benchmarks'
    ],
    uncertaintyDisclosures: [
      'Actual cracker yields vary with cracking severity, furnace coil design, and naphtha paraffin/naphthene/aromatic (PNA) content.'
    ],
    timestamp: '2026-09-21 08:30:10 IST'
  }
};
