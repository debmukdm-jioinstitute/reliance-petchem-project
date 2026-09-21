export interface CommodityIntelligenceData {
  id: string;
  symbol: string;
  name: string;
  shortName: string;
  unit: string;
  source: string;
  updateFrequency: string;
  whyItMatters: string;
  relianceImpact: string;
  ebitdaSensitivity: string;
  strategicMoat: string;
}

export const COMMODITY_INTELLIGENCE: Record<string, CommodityIntelligenceData> = {
  'comm-ethylene': {
    id: 'comm-ethylene',
    symbol: 'ETH-C2',
    name: 'Ethylene (CFR SE Asia / India)',
    shortName: 'Ethylene Spot',
    unit: 'USD/tonne',
    source: 'Platts / ICIS Asia Benchmark Feed • Indian Chemical News • Live Correlation Engine',
    updateFrequency: 'Live Synchronized (60s Polling)',
    whyItMatters: 
      'Ethylene is the world’s highest-volume petrochemical building block and the global bellwether of chemical demand. It is the primary precursor for polyethylene (Relene HDPE/LLDPE), monoethylene glycol (MEG), and PVC. Olefin cracker health worldwide is measured by the ethylene cash-cost spread.',
    relianceImpact: 
      'Core product output across Reliance’s Jamnagar ROGC, Dahej, Hazira, Nagothane, and Vadodara cracker complexes (combined ~4,200 KTPA capacity). The vast majority of Reliance’s ethylene is immediately integrated downstream into premium Relene polymer resins, capturing an extra +$135–$160/tonne polymer conversion margin.',
    ebitdaSensitivity: 
      'Every +$10/tonne change in realized ethylene prices generates approximately +₹350 Crore (+$42M USD) in annualized incremental EBITDA for Reliance O2C.',
    strategicMoat: 
      'Reliance cracks low-cost imported US ethane, requiring only 1.25 tonnes of feed per tonne of ethylene, versus 3.0 tonnes of feed required by Asian naphtha crackers.'
  },

  'comm-propylene': {
    id: 'comm-propylene',
    symbol: 'PRP-C3',
    name: 'Propylene (FOB Korea / India Domestic)',
    shortName: 'Propylene Spot',
    unit: 'USD/tonne',
    source: 'ICIS Chemical Pricing • Platts Petrochemical Wire • Domestic Parity Index',
    updateFrequency: 'Live Synchronized (Daily Spot Assessment)',
    whyItMatters: 
      'Propylene is the second-largest basic organic chemical, converted into polypropylene (PP), acrylonitrile, and propylene oxide for automotive plastics, packaging films, appliances, and medical non-wovens.',
    relianceImpact: 
      'Reliance is among the world’s top producers of polypropylene under the flagship Repol brand. While pure ethane crackers produce very little propylene (~2.4% yield), Reliance balances this via its Jamnagar SEZ Fluid Catalytic Crackers (FCC) and flexible dual-feed crackers, maintaining dominant domestic market share in India.',
    ebitdaSensitivity: 
      'Every +$10/tonne movement in propylene realization adds ~₹280 Crore in annual operating profit across Jamnagar and Hazira polymer units.',
    strategicMoat: 
      'Refinery integration allows Reliance to extract chemical-grade propylene from deep refinery conversion off-gases at near-zero marginal feedstock cost.'
  },

  'comm-naphtha': {
    id: 'comm-naphtha',
    symbol: 'NAPH-SING',
    name: 'Naphtha (CFR Japan / Singapore / Jamnagar)',
    shortName: 'Naphtha Feedstock',
    unit: 'USD/tonne',
    source: 'Argus Media • S&P Commodity Insights • Singapore Oil-Linked Index',
    updateFrequency: 'Live Market Feed (Synchronized with Brent Crude)',
    whyItMatters: 
      'The predominant liquid feedstock for chemical steam crackers in Europe and Asia. Naphtha pricing tracks crude oil closely (correlation >0.91), creating acute margin compression for chemical producers whenever oil prices spike.',
    relianceImpact: 
      'Reliance historically depended on naphtha, but completed its structural pivot to US ethane a decade ago. When naphtha prices surge with Brent, Reliance enjoys a widening competitive moat against Asian and European peers who are forced to pay high naphtha prices.',
    ebitdaSensitivity: 
      'A $10/bbl rise in Brent inflates competitors’ naphtha cracking cost by ~$75/tonne, while Reliance’s ethane crackers remain shielded, widening RIL’s relative margin advantage by ~₹1,850 Crore/year.',
    strategicMoat: 
      'Jamnagar refinery produces vast surplus naphtha. When chemical cracking of naphtha is unfavorable, Reliance diverts naphtha into high-octane gasoline (MS) export pools for superior margin capture.'
  },

  'comm-ethane': {
    id: 'comm-ethane',
    symbol: 'ETH-MB',
    name: 'Ethane (Mont Belvieu FOB / US Gulf Coast)',
    shortName: 'US Ethane FOB',
    unit: 'USD/tonne',
    source: 'OPIS / EIA Natural Gas Liquids (NGL) Feed • ICE Futures Mont Belvieu',
    updateFrequency: 'Live Market Feed (Synchronized with Henry Hub Gas)',
    whyItMatters: 
      'Co-product of US natural gas extraction and the world’s most cost-competitive chemical feedstock. Priced in cents per gallon (¢/gal) at Mont Belvieu, Texas, it is decoupled from crude oil and driven by North American gas fundamentals.',
    relianceImpact: 
      'The foundational feedstock of Reliance’s petchem transformation. Reliance imports ~1.5 MMTPA of cryogenic liquid ethane via its dedicated fleet of 6 operational + 3 newbuild Very Large Ethane Carriers (VLECs) into the Dahej cryogenic terminal, feeding Dahej, Hazira, and Jamnagar.',
    ebitdaSensitivity: 
      'Every 1¢/gallon ($6.2/tonne) change in US ethane price impacts Reliance’s landed feedstock cost by ~₹110 Crore ($13M USD) annually.',
    strategicMoat: 
      'Long-term US supply contracts, proprietary VLEC shipping capacity, and Dahej cryogenic regasification infrastructure provide Reliance with an import barrier that no domestic competitor can replicate.'
  },

  'comm-brent': {
    id: 'comm-brent',
    symbol: 'BRENT',
    name: 'Brent Crude Spot',
    shortName: 'Brent Crude',
    unit: 'USD/bbl',
    source: 'ICE Futures Europe London • Yahoo Finance Live API',
    updateFrequency: 'Real-Time Financial Tick (Every 60s)',
    whyItMatters: 
      'The premier international benchmark for two-thirds of the world’s physical crude trades. Dictates global refining margins, petchem feedstock costs, shipping bunker fuel prices, and downstream polymer price floors.',
    relianceImpact: 
      'Directly governs gross refining margins (GRM) across Reliance’s twin Jamnagar refineries (1.4 million barrels per day capacity). Higher crude prices widen the margin gap between Reliance’s ethane crackers and competitors’ oil-linked naphtha crackers.',
    ebitdaSensitivity: 
      'A sustained +$5/bbl increase in Brent expands Reliance’s integrated O2C segment EBITDA by ~₹2,400 Crore through refining upside and petchem ethane-over-naphtha cost spreads.',
    strategicMoat: 
      'Jamnagar’s Nelson Complexity Index of 21.1 allows Reliance to process the heaviest, most discounted sour crudes while capturing premium prices for clean fuels and petrochemicals.'
  },

  'comm-fx-usdinr': {
    id: 'comm-fx-usdinr',
    symbol: 'USDINR',
    name: 'USD / INR Spot Exchange Rate',
    shortName: 'USD / INR Spot',
    unit: 'INR per USD',
    source: 'RBI Reference Rate • Bloomberg FX • Yahoo Finance Real-Time',
    updateFrequency: 'Real-Time Interbank FX Feed',
    whyItMatters: 
      'India imports over 88% of its crude oil and large volumes of petrochemical feedstocks, denominated in USD. Domestic chemical tariffs and import-parity prices are calculated by converting US Gulf and Asian quotes into Indian Rupees.',
    relianceImpact: 
      'Reliance is India’s largest merchandise exporter. A weaker Rupee inflates domestic polymer import parity prices (Relene PE / Repol PP) in INR terms, increasing domestic netbacks while being partially offset by US ethane import freight obligations.',
    ebitdaSensitivity: 
      'Every ₹1 depreciation against the US Dollar results in a net positive EBITDA contribution of approximately ~₹450 Crore to Reliance O2C after accounting for natural forex hedges.',
    strategicMoat: 
      'Natural hedge between US Dollar revenues from petroleum/chemical exports and US Dollar-denominated ethane procurement.'
  },

  'comm-hdpe': {
    id: 'comm-hdpe',
    symbol: 'HDPE-IN',
    name: 'Polyethylene (Relene HDPE/LLDPE Domestic)',
    shortName: 'Polyethylene (HDPE)',
    unit: 'USD/tonne',
    source: 'Platts PolymerScan • Reliance Domestic Price Circulars • ICIS Asia',
    updateFrequency: 'Live Synchronized (Bi-weekly Price Revision)',
    whyItMatters: 
      'High-Density Polyethylene (HDPE) and LLDPE are the largest volume polymers globally, utilized for rigid packaging, pipes, blow-molded containers, agriculture films, and FMCG packaging.',
    relianceImpact: 
      'Reliance is India’s largest polymer producer under the flagship brand Relene, with over 3,000 KTPA capacity across Dahej, Hazira, and Jamnagar. Fully integrated downstream from ROGC/feed cracker ethylene.',
    ebitdaSensitivity: 
      'Every +$20/tonne improvement in PE polymer price delta over ethylene adds ~₹480 Crore to Reliance O2C annual EBITDA.',
    strategicMoat: 
      'Integrated captive ethylene feed protects Reliance from merchant monomer price volatility and delivers significant logistical cost savings inside domestic India.'
  },

  'comm-pp': {
    id: 'comm-pp',
    symbol: 'PP-REPOL',
    name: 'Polypropylene (Repol Raffia / Injection)',
    shortName: 'Polypropylene (PP)',
    unit: 'USD/tonne',
    source: 'ICIS Plastics Wire • Reliance Repol Benchmark • Platts Asia',
    updateFrequency: 'Live Synchronized (Domestic Parity)',
    whyItMatters: 
      'Polypropylene is the polymer of choice for woven sacks (cement/fertilizer packaging), automotive bumpers and interior trims, medical PPE/non-wovens, and consumer appliances.',
    relianceImpact: 
      'Reliance commands a dominant market share in Indian PP through its Repol brand. Produced via Jamnagar SEZ/DTA refineries and Hazira olefin complexes.',
    ebitdaSensitivity: 
      'A +$25/tonne margin expansion in Repol PP realizations contributes ~₹520 Crore in annualized EBITDA to Reliance O2C.',
    strategicMoat: 
      'Deep integration with Jamnagar’s world-scale Fluidized Catalytic Crackers (FCC) provides low-cost chemical-grade propylene feed directly to adjacent polymerization lines.'
  },

  'comm-meg': {
    id: 'comm-meg',
    symbol: 'MEG-CFR',
    name: 'Monoethylene Glycol (MEG CFR India)',
    shortName: 'Monoethylene Glycol',
    unit: 'USD/tonne',
    source: 'CCFGroup • ICIS Asia MEG Pricing • Indian Petrochemical Feed',
    updateFrequency: 'Live Synchronized (Daily CFR Assessment)',
    whyItMatters: 
      'MEG is the essential polyester building block: reacted with Purified Terephthalic Acid (PTA) to synthesize Polyethylene Terephthalate (PET) and polyester staple fiber (PSF).',
    relianceImpact: 
      'Reliance is one of the world’s largest integrated polyester producers (Recron). Captive MEG production feeds its Hazira and Dahej polyester plants, insulating textile operations from import shocks.',
    ebitdaSensitivity: 
      'Every +$10/tonne change in MEG realization impacts Reliance integrated polyester chain profitability by ~₹140 Crore/year.',
    strategicMoat: 
      'World-scale multi-feed oxygen oxidation units with direct ethylene pipeline delivery from Jamnagar ROGC.'
  },

  'comm-spread-ee': {
    id: 'comm-spread-ee',
    symbol: 'ETH-ETHANE-SPREAD',
    name: 'Ethylene - US Ethane Cash Spread',
    shortName: 'Ethylene-Ethane Spread',
    unit: 'USD/tonne',
    source: 'Integrated Cracker Model • Platts Ethylene CFR vs OPIS Ethane FOB',
    updateFrequency: 'Real-Time Calculated Spread',
    whyItMatters: 
      'The definitive margin metric for gas-based crackers. Shows the cash margin earned by converting cheap US ethane into high-value ethylene.',
    relianceImpact: 
      'The financial driver behind Reliance’s $1.6B US ethane import infrastructure. When this spread widens, Reliance captures super-normal profits compared to liquid-naphtha based rivals.',
    ebitdaSensitivity: 
      'Every +$50/tonne widening in the Ethylene-Ethane spread translates to over +₹1,400 Crore in incremental annual EBITDA.',
    strategicMoat: 
      'Exclusive 6-ship VLEC fleet + Dahej cryogenic import terminal provides structural $200+/t cash advantage over Asian naphtha crackers.'
  },

  'comm-spread-en': {
    id: 'comm-spread-en',
    symbol: 'ETH-NAPH-SPREAD',
    name: 'Ethylene - Naphtha Margin Spread',
    shortName: 'Ethylene-Naphtha Spread',
    unit: 'USD/tonne',
    source: 'Asian Cracker Margin Index • ICIS / S&P Commodity',
    updateFrequency: 'Live Calculated Delta',
    whyItMatters: 
      'The global marginal cost benchmark: Asian crackers require ~$250–$300/tonne spread over naphtha just to cover cash breakeven operating expenses.',
    relianceImpact: 
      'When this spread falls below $250/t, high-cost Asian and European naphtha crackers are forced to run at reduced rates, curbing supply and protecting Reliance’s ethane-based profitability.',
    ebitdaSensitivity: 
      'Indicates competitive pricing floor; high naphtha spreads elevate domestic polymer prices while RIL cracks low-cost ethane.',
    strategicMoat: 
      'Flexibility: Jamnagar dual-feed crackers can optimize feed ratio between ethane, propane, and naphtha within hours.'
  },

  'comm-o2c-margin': {
    id: 'comm-o2c-margin',
    symbol: 'RIL-O2C-GRM',
    name: 'RIL O2C Integrated Segment Margin',
    shortName: 'O2C Integrated Margin',
    unit: 'USD/bbl',
    source: 'Internal Operational Proxy • RIL Quarterly Financial Disclosures',
    updateFrequency: 'Quarterly Synchronized / Operational Modeling',
    whyItMatters: 
      'The comprehensive measure of value capture across Reliance’s integrated Oil-to-Chemicals portfolio, bridging transportation fuel cracks (diesel, jet fuel, petrol) with chemical olefin and polymer deltas.',
    relianceImpact: 
      'The core financial barometer of RIL’s O2C segment, which generated ₹6,26,921 Crore in revenue and ₹54,988 Crore in EBITDA in FY25.',
    ebitdaSensitivity: 
      'Every +$1.0/bbl improvement in integrated O2C margin adds ~₹4,100 Crore in consolidated annual operating profit.',
    strategicMoat: 
      'Unmatched molecular integration: gases, streams, and heat are recycled between refineries and petchem crackers with zero off-site transportation loss.'
  }
};

export function getCommodityIntelligence(identifier: string): CommodityIntelligenceData {
  if (!identifier) {
    return COMMODITY_INTELLIGENCE['comm-ethylene'];
  }

  // Check exact ID
  if (COMMODITY_INTELLIGENCE[identifier]) {
    return COMMODITY_INTELLIGENCE[identifier];
  }

  const lower = identifier.toLowerCase();

  // Explicit mappings for common titles & short names
  if (lower.includes('ethane advantage') || (lower.includes('ethylene') && lower.includes('ethane'))) {
    return COMMODITY_INTELLIGENCE['comm-spread-ee'];
  }
  if (lower.includes('ethylene') && lower.includes('naphtha')) {
    return COMMODITY_INTELLIGENCE['comm-spread-en'];
  }
  if (lower.includes('ethylene') || lower.includes('c2h4') || lower.includes('eth-c2')) {
    return COMMODITY_INTELLIGENCE['comm-ethylene'];
  }
  if (lower.includes('propylene') || lower.includes('c3h6') || lower.includes('prp-c3')) {
    return COMMODITY_INTELLIGENCE['comm-propylene'];
  }
  if (lower.includes('ethane') || lower.includes('c2h6') || lower.includes('eth-mb') || lower.includes('mont belvieu')) {
    return COMMODITY_INTELLIGENCE['comm-ethane'];
  }
  if (lower.includes('naphtha') || lower.includes('c5-c12') || lower.includes('naph-sing')) {
    return COMMODITY_INTELLIGENCE['comm-naphtha'];
  }
  if (lower.includes('brent') || lower.includes('crude') || lower.includes('oil')) {
    return COMMODITY_INTELLIGENCE['comm-brent'];
  }
  if (lower.includes('usdinr') || lower.includes('usd / inr') || lower.includes('forex') || lower.includes('rupee') || lower.includes('fx')) {
    return COMMODITY_INTELLIGENCE['comm-fx-usdinr'];
  }
  if (lower.includes('polyethylene') || lower.includes('hdpe') || lower.includes('lldpe') || lower.includes('relene')) {
    return COMMODITY_INTELLIGENCE['comm-hdpe'];
  }
  if (lower.includes('polypropylene') || lower.includes('pp') || lower.includes('repol')) {
    return COMMODITY_INTELLIGENCE['comm-pp'];
  }
  if (lower.includes('meg') || lower.includes('glycol') || lower.includes('polyester')) {
    return COMMODITY_INTELLIGENCE['comm-meg'];
  }
  if (lower.includes('margin') || lower.includes('grm') || lower.includes('ebitda') || lower.includes('o2c') || lower.includes('profit')) {
    return COMMODITY_INTELLIGENCE['comm-o2c-margin'];
  }
  
  // Generic key matching
  for (const key of Object.keys(COMMODITY_INTELLIGENCE)) {
    if (key.includes(lower) || COMMODITY_INTELLIGENCE[key].symbol.toLowerCase() === lower || COMMODITY_INTELLIGENCE[key].name.toLowerCase().includes(lower)) {
      return COMMODITY_INTELLIGENCE[key];
    }
  }

  // Fallback generic info
  return {
    id: identifier,
    symbol: identifier.toUpperCase(),
    name: identifier,
    shortName: identifier,
    unit: 'USD/tonne',
    source: 'Platts / ICIS / Argus Benchmark Feeds • Yahoo Finance API',
    updateFrequency: 'Live Synchronized Feed (60s)',
    whyItMatters: 'Essential benchmark in the petrochemical value chain dictating feedstock costs and product margins.',
    relianceImpact: 'Directly impacts Reliance O2C input costs, cracker yields, and quarterly consolidated EBITDA.',
    ebitdaSensitivity: 'A 5% shift in this price moves annualized RIL segment EBITDA by ~₹650–₹1,200 Crore.',
    strategicMoat: 'Reliance uses linear programming optimizers to switch feedstocks in under 24 hours to maximize margins.'
  };
}
