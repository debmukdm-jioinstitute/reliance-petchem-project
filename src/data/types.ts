export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type SignalType = 'POSITIVE' | 'NEGATIVE' | 'WATCH' | 'CRITICAL';

export type InformationCategory = 
  | 'FACT' 
  | 'MODEL OUTPUT' 
  | 'INFERENCE' 
  | 'SCENARIO' 
  | 'FORECAST' 
  | 'UNKNOWN';

export interface SourceCitation {
  id: string;
  sourceTitle: string;
  sourceType: 'MEETING' | 'DOCUMENT' | 'MARKET_DATA' | 'ANNUAL_REPORT' | 'RESEARCH';
  date: string;
  pageOrSection?: string;
  exactQuote?: string;
  speaker?: string;
  confidence: ConfidenceLevel;
}

export interface ChronologicalChange {
  id: string;
  date: string;
  title: string;
  summary: string;
  category: 'FEEDSTOCK' | 'ASSUMPTION' | 'DECISION' | 'MARKET' | 'CAPEX' | 'RISK';
  whyItMatters: string;
  source: SourceCitation;
  confidence: ConfidenceLevel;
  potentialImpact: string;
  deltaType: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'CRITICAL';
}

export interface MeetingData {
  id: string;
  title: string;
  date: string;
  participants: {
    name: string;
    role: string;
    affiliation: 'Reliance Industries' | 'Jio Institute' | 'External';
  }[];
  topic: string;
  projectStage: string;
  status: 'COMPLETED' | 'SCHEDULED';
  aiSummary: string;
  keyDiscussion: string[];
  decisions: {
    id: string;
    decision: string;
    decisionMaker: string;
    rationale: string;
    evidence: string;
    impact: string;
    status: 'ACTIVE' | 'SUPERSEDED' | 'PENDING';
    sourceCitation: SourceCitation;
  }[];
  actionItems: {
    id: string;
    action: string;
    owner: string;
    dueDate: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
    dependencies?: string;
    evidence: string;
  }[];
  openQuestions: {
    id: string;
    question: string;
    owner: string;
    deadline: string;
    currentAnswer: string;
    evidenceStatus: 'VERIFIED' | 'PRELIMINARY' | 'UNRESOLVED';
  }[];
  assumptionsCreated: {
    id: string;
    assumption: string;
    value: string;
    confidence: ConfidenceLevel;
    status: 'ACTIVE' | 'UNVERIFIED';
  }[];
  assumptionsInvalidated: {
    id: string;
    originalAssumption: string;
    invalidationReason: string;
    newEvidence: string;
    updatedUnderstanding: string;
    sourceCitation: SourceCitation;
  }[];
  risksIdentified: {
    id: string;
    risk: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    probability: 'HIGH' | 'MEDIUM' | 'LOW';
    mitigation: string;
    trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  }[];
  marketSignals: {
    commodity: string;
    signal: string;
    direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    impactOnRIL: string;
  }[];
  projectImpact: string;
  numbersExtracted: {
    metric: string;
    value: string;
    unit: string;
    context: string;
    sourceCitation: SourceCitation;
  }[];
  topics: string[];
  entities: string[];
  rawTranscript: {
    lineIndex: number;
    speaker: string;
    timestamp?: string;
    text: string;
    highlighted?: boolean;
    annotation?: string;
  }[];
}

export interface MarketCommodity {
  id: string;
  symbol: string;
  name: string;
  category: 'FEEDSTOCK' | 'PRODUCT' | 'ENERGY' | 'FX' | 'CRACK';
  currentPrice: number;
  previousPrice: number;
  unit: string;
  currency: string;
  change1D: number;
  change1W: number;
  change1M: number;
  change3M: number;
  changeYTD: number;
  change1Y: number;
  trend: 'UP' | 'DOWN' | 'FLAT';
  source: string;
  timestamp: string;
  dataQuality: 'EXCELLENT' | 'HIGH' | 'ESTIMATED';
  history: {
    date: string;
    price: number;
    volume?: number;
  }[];
}

export interface ForecastModelMetrics {
  modelName: 'AutoARIMA' | 'ETS' | 'LightGBM' | 'XGBoost' | 'TimesFM' | 'Ensemble Consensus';
  weight: number;
  mae: number;
  rmse: number;
  mape: number;
  sMape: number;
  confidenceScore: number;
}

export interface ForecastPoint {
  date: string;
  actual?: number;
  pointForecast: number;
  p10: number;
  p50: number;
  p90: number;
  isHistorical: boolean;
}

export interface CommodityForecast {
  commodityId: string;
  commodityName: string;
  unit: string;
  currency: string;
  horizon: '7D' | '30D' | '90D' | '6M' | '12M' | '24M';
  trainingPeriod: string;
  lastUpdated: string;
  models: ForecastModelMetrics[];
  consensusSummary: string;
  dispersion: 'LOW' | 'MODERATE' | 'HIGH';
  points: ForecastPoint[];
}

export interface ScenarioDefinition {
  id: string;
  name: string;
  type: 'BASE' | 'UPSIDE' | 'DOWNSIDE' | 'CUSTOM' | 'STRESS_TEST';
  description: string;
  inputs: {
    brentOilDeltaPct: number; // e.g. +20%
    ethanePriceDeltaPct: number; // e.g. -10%
    naphthaPriceDeltaPct: number; // e.g. +30%
    usEthaneImportCostDeltaPct: number;
    naturalGasDeltaPct: number;
    fxUsdInr: number; // e.g. 84.5
    ethylenePriceDeltaPct: number;
    propylenePriceDeltaPct: number;
    plantUtilizationPct: number; // e.g. 92%
    projectStartupDelayMonths: number; // e.g. 3
    capexEscalationPct: number;
  };
  outputs: {
    revenueINR_Cr: number;
    ebitdaINR_Cr: number;
    o2cMarginPct: number;
    netCashFlowINR_Cr: number;
    npvUSD_Mn: number;
    irrPct: number;
    paybackYears: number;
    ebitdaDeltaINR_Cr: number;
    npvDeltaUSD_Mn: number;
  };
  impactWaterfall: {
    component: string;
    deltaINR_Cr: number;
    direction: 'POSITIVE' | 'NEGATIVE';
  }[];
}

export interface MonteCarloSimulationResult {
  iterations: number;
  timestamp: string;
  variables: {
    name: string;
    distribution: 'Lognormal' | 'Normal' | 'Empirical' | 'Discrete';
    parameters: string;
  }[];
  metrics: {
    name: string;
    unit: string;
    mean: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    min: number;
    max: number;
  }[];
  npvDistributionBins: { range: string; count: number; cumulativePct: number }[];
  irrDistributionBins: { range: string; count: number; cumulativePct: number }[];
  ebitdaDistributionBins: { range: string; count: number; cumulativePct: number }[];
  topSensitivityDrivers: {
    variable: string;
    swingImpactUSD_Mn: number;
    correlation: number;
  }[];
}

export interface FinancialAssetCracker {
  id: string;
  siteName: 'Jamnagar' | 'Dahej' | 'Hazira' | 'Nagothane' | 'Vadodara';
  currentFeedstockCapacityMMTPA: {
    naphtha: number;
    ethane: number;
    propane: number;
  };
  ethyleneCapacityKTA: number;
  propyleneCapacityKTA: number;
  proximityToDahejTerminalKm: number;
  pipelineConnected: boolean;
  conversionTierRank: number;
  capexCommittedUSD_Mn: number;
  spentUSD_Mn: number;
  remainingUSD_Mn: number;
  npvUSD_Mn: number;
  irrPct: number;
  paybackYears: number;
  startupTarget: string;
  currentScheduleStatus: 'ON_TRACK' | 'DELAYED_1M' | 'DELAYED_3M';
}

export interface EntityNode {
  id: string;
  name: string;
  category: 'PERSON' | 'MEETING' | 'DECISION' | 'COMMODITY' | 'PLANT' | 'RISK' | 'ASSUMPTION' | 'PROJECT' | 'COMPANY';
  details: string;
  connectionsCount: number;
}

export interface EntityLink {
  source: string;
  target: string;
  relationship: string;
  weight?: number;
}

export interface AuditRecord {
  id: string;
  question: string;
  answerSnippet: string;
  category: InformationCategory;
  model: string;
  confidenceScore: number;
  promptVersion: string;
  retrievedDocuments: {
    title: string;
    type: string;
    pageOrLine: string;
    snippet: string;
  }[];
  numericalCalculations?: string[];
  assumptionsUsed: string[];
  uncertaintyDisclosures: string[];
  timestamp: string;
}
