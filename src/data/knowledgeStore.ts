import {
  MeetingData,
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
      id: 'cit-mom-1-dec1',
      sourceTitle: 'Minutes of Meeting — RIL Meeting 1',
      sourceType: 'MEETING',
      date: '06 July 2026',
      pageOrSection: 'Section 19 / Key Decisions',
      exactQuote: 'The original idea of studying a NAFTA-to-ethane switch is not the right central framing because Reliance has already built this operational flexibility.',
      speaker: 'Rajesh Rawal',
      confidence: 'HIGH'
    },
    confidence: 'HIGH',
    potentialImpact: 'Accelerates delivery of executive decision dashboard and live scenario simulator.',
    deltaType: 'POSITIVE'
  },
  {
    id: 'chg-04',
    date: '20 Jul 2026',
    title: 'New Cracker Business Head Hanoz approved AI Live Dashboard & Dual Simulation',
    summary: 'Hanoz mandated dual simulation: RIL-specific asset modeling and global cracker industry outlook, backed by AI price predictions.',
    category: 'DECISION',
    whyItMatters: 'Positions the platform as an institutional tool used by executive leadership rather than an isolated study.',
    source: {
      id: 'cit-mom-2-hanoz',
      sourceTitle: 'Meeting 2 Transcript with Hanoz & Adepu',
      sourceType: 'MEETING',
      date: '20 July 2026',
      pageOrSection: 'Lines 104-106',
      exactQuote: 'You could work on predicting the prices using AI... and basis that, do two studies: one simulation for RIL and one for global industry as a whole.',
      speaker: 'Hanoz (Cracker Business Head)',
      confidence: 'HIGH'
    },
    confidence: 'HIGH',
    potentialImpact: 'Scope expanded to cover RIL expansion viability and global cracker oversupply tracking.',
    deltaType: 'POSITIVE'
  }
];

export const MEETINGS_DATA: MeetingData[] = [
  {
    id: 'meeting-1',
    title: 'RIL & Jio Institute Mentorship — Meeting 1',
    date: '2026-07-06',
    participants: [
      { name: 'Rajesh Rawal', role: 'Business Head, Cracker & Poly Business', affiliation: 'Reliance Industries' },
      { name: 'Debabrata Mukherjee', role: 'Student Researcher (Finance)', affiliation: 'Jio Institute' },
      { name: 'Dhruv Choudhary', role: 'Student Researcher (Finance)', affiliation: 'Jio Institute' },
      { name: 'Ishan Lath', role: 'Student Researcher', affiliation: 'Jio Institute' },
      { name: 'Vishwas Mordani', role: 'Student Researcher', affiliation: 'Jio Institute' }
    ],
    topic: 'Introductory project alignment, scoping revision, and operational ground truth',
    projectStage: 'Phase 1: Project Scoping & Problem Framing',
    status: 'COMPLETED',
    aiSummary: 'Rajesh Rawal clarified that Reliance Industries already executed the operational shift from naphtha to ethane a decade ago (2014-2017) and maintains an active linear programming optimizer that switches feedstocks within a fraction of a day. Therefore, studying feedstock switching as an unsolved problem is invalid. The project scope was redirected towards AI enhancement of existing optimization, dynamic market scenario simulation, multi-horizon price forecasting, dynamic financial modeling of the live capacity expansion project, and global chemical/O2C benchmarking.',
    keyDiscussion: [
      'Original proposal review: The team presented an initial concept around switching crackers from naphtha to ethane.',
      'Operational reality check: Rajesh explained that RIL possesses extensive operational flexibility and an internal optimizer already handling day-to-day switching.',
      'Revised project scope: Shift from basic operational switching to four new focus areas: AI optimization, scenario simulation, price forecasting, dynamic financial modeling of expansion projects.',
      'Confidentiality & data access: Team must utilize public information and external tools during the initial phase; site access and confidential calibration will occur subsequently.',
      'Review cadence: Periodic fortnightly review cycle established, targeting scoping document finalization by month-end.'
    ],
    decisions: [
      {
        id: 'dec-1-01',
        decision: 'Pivot project away from NAFTA-to-ethane operational switching',
        decisionMaker: 'Rajesh Rawal (Business Head, Cracker & Poly)',
        rationale: 'Reliance already has operational flexibility and proprietary optimizer tools capable of switching feedstocks within hours.',
        evidence: 'Meeting 1 Discussion Section 2, 4, 19.',
        impact: 'Saved team 3+ months of investigating a problem RIL solved in 2017.',
        status: 'ACTIVE',
        sourceCitation: {
          id: 'cit-m1-p1',
          sourceTitle: 'MoM RIL 6 July 2026',
          sourceType: 'MEETING',
          date: '2026-07-06',
          exactQuote: 'The original idea of studying a NAFTA-to-ethane switch is not the right central framing because Reliance has already built this operational flexibility.',
          speaker: 'Rajesh Rawal',
          confidence: 'HIGH'
        }
      },
      {
        id: 'dec-1-02',
        decision: 'Focus on AI Enhancement, Scenario Simulation, Forecasting, and Financial Modeling of Expansion',
        decisionMaker: 'Rajesh Rawal & Team 9',
        rationale: 'High executive value in dynamic risk quantification, Monte Carlo capex simulation, and global market price forecasting.',
        evidence: 'Meeting 1 Section 19.',
        impact: 'Established 5 concrete workstreams for the project.',
        status: 'ACTIVE',
        sourceCitation: {
          id: 'cit-m1-p2',
          sourceTitle: 'MoM RIL 6 July 2026',
          sourceType: 'MEETING',
          date: '2026-07-06',
          exactQuote: 'The project should instead focus on: enhancing existing optimization with AI, scenario simulation / forecasting, dynamic financial modeling of the live capacity expansion project, external benchmarking of AI use cases.',
          speaker: 'Rajesh Rawal',
          confidence: 'HIGH'
        }
      }
    ],
    actionItems: [
      {
        id: 'act-1-01',
        action: 'Review current-year Reliance Industries Annual Report (O2C & Petrochemicals)',
        owner: 'Debabrata Mukherjee & Team',
        dueDate: '2026-07-14',
        priority: 'HIGH',
        status: 'COMPLETED',
        evidence: 'Analyzed FY25 O2C revenue ₹6,26,921 Cr and EBITDA ₹54,988 Cr in Group 9 report.'
      },
      {
        id: 'act-1-02',
        action: 'Benchmark external AI use cases in chemicals/O2C (ExxonMobil, Shell, Dow, SABIC, BASF)',
        owner: 'Dhruv Choudhary & Ishan Lath',
        dueDate: '2026-07-20',
        priority: 'HIGH',
        status: 'COMPLETED',
        evidence: 'Synthesized 8 global peer AI cases in competitive intelligence module.'
      },
      {
        id: 'act-1-03',
        action: 'Draft preliminary Project Scope Document defining AI dashboard and dual simulation',
        owner: 'Debabrata Mukherjee',
        dueDate: '2026-07-25',
        priority: 'HIGH',
        status: 'COMPLETED',
        evidence: 'Produced AI Cracker Industry Project Document.'
      }
    ],
    openQuestions: [
      {
        id: 'q-1-01',
        question: 'What is RIL current plant-level feedstock mix between Jamnagar, Dahej, Hazira, and Nagothane?',
        owner: 'Adepu & Reliance Business Team',
        deadline: '2026-08-15',
        currentAnswer: 'Public estimates indicate Jamnagar and Dahej are primary ethane consumers (>1.5 MMTPA each); plant-specific splits are confidential but guided within operational ranges.',
        evidenceStatus: 'PRELIMINARY'
      },
      {
        id: 'q-1-02',
        question: 'How does RIL handle coproduct net-backs (mixed C4s, pygas, fuel gas) in its existing optimizer?',
        owner: 'Team 9',
        deadline: '2026-08-30',
        currentAnswer: 'Existing optimizer uses linear programming with dynamic market netback pricing; AI layer can predict price movements 30-90 days forward.',
        evidenceStatus: 'VERIFIED'
      }
    ],
    assumptionsCreated: [
      {
        id: 'asm-1-01',
        assumption: 'RIL already possesses operational infrastructure to switch cracker feedstocks in a fraction of a day.',
        value: '< 24 hours switching flexibility',
        confidence: 'HIGH',
        status: 'ACTIVE'
      },
      {
        id: 'asm-1-02',
        assumption: 'External public data and AI price prediction can provide meaningful guidance for expansion project viability.',
        value: 'True for market & scenario level',
        confidence: 'HIGH',
        status: 'ACTIVE'
      }
    ],
    assumptionsInvalidated: [
      {
        id: 'asm-inv-01',
        originalAssumption: 'RIL needs an engineering study on how to switch crackers from naphtha to ethane.',
        invalidationReason: 'RIL completed this transition a decade ago (2014-2017) with $2B+ cryogenic terminal, VLECs, and automated LP optimizers.',
        newEvidence: 'Rajesh Rawal oral testimony; RIL 2014 US ethane import contracts; 2017 Dahej terminal commissioning.',
        updatedUnderstanding: 'The real opportunity is AI enhancement of optimization, multi-horizon price forecasting, and dynamic capital allocation under global oversupply.',
        sourceCitation: {
          id: 'cit-m1-inv1',
          sourceTitle: 'MoM RIL 6 July 2026',
          sourceType: 'MEETING',
          date: '2026-07-06',
          exactQuote: 'Many of the team’s assumptions would need correction once they had more context... RIL already switches in a fraction of a day.',
          speaker: 'Rajesh Rawal',
          confidence: 'HIGH'
        }
      }
    ],
    risksIdentified: [
      {
        id: 'rsk-1-01',
        risk: 'Confidentiality constraints limiting access to exact internal unit costs and yields',
        severity: 'MEDIUM',
        probability: 'HIGH',
        mitigation: 'Build modular architecture using calibrated public market proxies and public annual report disclosures.',
        trend: 'STABLE'
      },
      {
        id: 'rsk-1-02',
        risk: 'Model divergence between public spot benchmarks and RIL confidential term contracts',
        severity: 'MEDIUM',
        probability: 'MEDIUM',
        mitigation: 'Incorporate basis differential parameters and editable assumption registers.',
        trend: 'DECREASING'
      }
    ],
    marketSignals: [
      {
        commodity: 'Naphtha vs Ethane Spread',
        signal: 'Historic divergence widening in favor of US ethane cracking',
        direction: 'BULLISH',
        impactOnRIL: 'Directly expands RIL O2C margins compared to Asian/European naphtha crackers.'
      }
    ],
    projectImpact: 'Fundamental realignment of project objectives towards quantitative financial and scenario intelligence.',
    numbersExtracted: [
      {
        metric: 'Switching time',
        value: '< 1 day',
        unit: 'hours',
        context: 'Existing RIL optimizer capability to switch feedstock slate',
        sourceCitation: {
          id: 'cit-m1-num1',
          sourceTitle: 'MoM RIL 6 July 2026',
          sourceType: 'MEETING',
          date: '2026-07-06',
          exactQuote: 'Reliance already has flexibility to switch feedstock within a fraction of a day.',
          confidence: 'HIGH'
        }
      },
      {
        metric: 'Student team weekly commitment',
        value: '20',
        unit: 'hours/week',
        context: 'Expected weekly project commitment per student (~80 hrs/month)',
        sourceCitation: {
          id: 'cit-m1-num2',
          sourceTitle: 'MoM RIL 6 July 2026',
          sourceType: 'MEETING',
          date: '2026-07-06',
          exactQuote: 'The team explained that weekends and evenings were generally the most feasible times.',
          confidence: 'HIGH'
        }
      }
    ],
    topics: ['Feedstock Optimization', 'Cracker Operations', 'Capacity Expansion', 'AI Enhancement', 'Financial Modeling', 'Confidentiality'],
    entities: ['Rajesh Rawal', 'Reliance Industries', 'Jio Institute', 'Debabrata Mukherjee', 'Dhruv Choudhary', 'Ethane', 'Naphtha', 'Ethylene'],
    rawTranscript: [
      { lineIndex: 1, speaker: 'Rajesh Rawal', text: 'Rajesh Rawal introduced himself as the person leading the poly business, mainly the cracker business...' },
      { lineIndex: 2, speaker: 'Debabrata / Dhruv', text: 'The team presented an initial concept around switching crackers from naphtha to ethane...' },
      { lineIndex: 3, speaker: 'Rajesh Rawal', text: 'Rajesh explained that Reliance already has built this operational flexibility a decade ago and can switch within a fraction of a day. The team should refocus on AI optimization, forecasting, and dynamic financial modeling of the expansion project.', highlighted: true, annotation: 'Key pivot point of the entire project' }
    ]
  },
  {
    id: 'meeting-2',
    title: 'Cracker Leadership Scoping & AI Dashboard Alignment — Meeting 2',
    date: '2026-07-20',
    participants: [
      { name: 'Hanoz', role: 'New Business Head of Cracker', affiliation: 'Reliance Industries' },
      { name: 'Adepu', role: 'Mentor & Industry Expert', affiliation: 'Reliance Industries' },
      { name: 'Garima', role: 'Mentor', affiliation: 'Reliance Industries' },
      { name: 'Dhruv Choudhary', role: 'Student Researcher (Finance)', affiliation: 'Jio Institute' },
      { name: 'Debabrata Mukherjee', role: 'Student Researcher (Finance)', affiliation: 'Jio Institute' },
      { name: 'Ishan Lath', role: 'Student Researcher', affiliation: 'Jio Institute' }
    ],
    topic: 'Detailed cracker business model, dual simulation scope, feedstock breakdown, and public data strategy',
    projectStage: 'Phase 1: Scope Formalization & Domain Immersion',
    status: 'COMPLETED',
    aiSummary: 'Hanoz, newly taking over as Business Head of Cracker, reviewed the project with the team. He endorsed the team’s proposal for an AI live dashboard and mandated two distinct simulation tiers: (1) an RIL-specific operational and expansion simulation, and (2) a global cracker industry simulation. He gave a technical overview of cracker feedstocks (gas feedstocks: ethane, propane, butane/LPG from drill wells and refinery off-gases; liquid feedstocks: naphtha) and main outputs (ethylene, propylene). He confirmed RIL imports 1.5 MMTPA of ethane from the US via Dahej on six VLECs with upgraded crackers at Dahej, Hazira, and Nagothane. He advised the team to utilize public data and AI prediction models first, with business team guidance provided on demand.',
    keyDiscussion: [
      'Leadership handover: Hanoz introduced as the new Business Head of Cracker taking over mentorship alignment.',
      'Student background: Dhruv Choudhary (Nomura Holdings 4 yrs) and Debabrata Mukherjee (Finance) introduced the team.',
      'AI price prediction & dual simulation: Hanoz approved using AI to predict major raw material and product prices and run dual simulations for RIL and the global industry.',
      'Technical feedstock breakdown: Clarification between gas feedstocks (ethane, propane, butane/LPG) and liquid feedstocks (naphtha), and how outputs resolve into ethylene and propylene.',
      'RIL public infrastructure verification: Hanoz confirmed April 2017 commissioning of 1.5 MMTPA US ethane imports, 6 VLECs, and upgraded crackers at Dahej, Hazira, and Nagothane.',
      'Deliverable roadmap: Agreement on drafting an authoritative Scope Document, followed by an industry overview session and iterative dashboard previews.'
    ],
    decisions: [
      {
        id: 'dec-2-01',
        decision: 'Implement Dual Simulation Architecture: RIL-specific and Global Cracker Industry',
        decisionMaker: 'Hanoz (Business Head, Cracker)',
        rationale: 'RIL cannot be viewed in isolation; global cracker oversupply and regional margin dynamics dictate RIL operational strategy.',
        evidence: 'Meeting 2 Transcript Line 104-106.',
        impact: 'Core architectural principle of RIL Intelligence OS.',
        status: 'ACTIVE',
        sourceCitation: {
          id: 'cit-m2-hanoz-dual',
          sourceTitle: 'MOM 2 Transcript',
          sourceType: 'MEETING',
          date: '2026-07-20',
          exactQuote: 'You can do two studies: one simulation for RIL and one for, say, global—the industry as a whole. How it develops.',
          speaker: 'Hanoz',
          confidence: 'HIGH'
        }
      },
      {
        id: 'dec-2-02',
        decision: 'Build AI Price Prediction Engine for Major Raw Materials and Products',
        decisionMaker: 'Hanoz & Team',
        rationale: 'Dynamic scenario simulation requires real-time forward-looking price trajectories rather than static trailing averages.',
        evidence: 'Meeting 2 Transcript Line 104.',
        impact: 'Formed the basis of the multi-model forecasting engine.',
        status: 'ACTIVE',
        sourceCitation: {
          id: 'cit-m2-price-pred',
          sourceTitle: 'MOM 2 Transcript',
          sourceType: 'MEETING',
          date: '2026-07-20',
          exactQuote: 'You could work on predicting the prices with using AI. If you can predict the prices of our major raw materials and products.',
          speaker: 'Hanoz',
          confidence: 'HIGH'
        }
      }
    ],
    actionItems: [
      {
        id: 'act-2-01',
        action: 'Draft comprehensive Project Scope Document incorporating dual simulations and AI forecasting',
        owner: 'Debabrata Mukherjee & Dhruv Choudhary',
        dueDate: '2026-08-01',
        priority: 'HIGH',
        status: 'COMPLETED',
        evidence: 'AI Cracker Industry Project Document completed and circulated.'
      },
      {
        id: 'act-2-02',
        action: 'Establish Friday weekly scheduling cadence for next-week milestone alignment',
        owner: 'Dhruv Choudhary',
        dueDate: '2026-07-25',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        evidence: 'Weekly update rhythm initiated.'
      }
    ],
    openQuestions: [
      {
        id: 'q-2-01',
        question: 'What is the precise shipping freight and liquefaction cost per tonne for US ethane to Dahej?',
        owner: 'Reliance Supply Chain Team',
        deadline: '2026-08-20',
        currentAnswer: 'Estimated in Group 9 report at ~$120-$140/t including VLEC charter, fuel, and terminal handling.',
        evidenceStatus: 'PRELIMINARY'
      }
    ],
    assumptionsCreated: [
      {
        id: 'asm-2-01',
        assumption: 'US ethane imports to Dahej run at approximately 1.5 MMTPA with 6 dedicated VLECs.',
        value: '1.5 MMTPA, 6 VLECs',
        confidence: 'HIGH',
        status: 'ACTIVE'
      },
      {
        id: 'asm-2-02',
        assumption: 'Main cracker outputs can be abstracted as Ethylene and Propylene for high-level executive simulations.',
        value: 'Ethylene (~80% ethane yield, ~30% naphtha yield)',
        confidence: 'HIGH',
        status: 'ACTIVE'
      }
    ],
    assumptionsInvalidated: [],
    risksIdentified: [
      {
        id: 'rsk-2-01',
        risk: 'Global oversupply in ethylene driven by Chinese capacity additions depressing cracker margins through 2030',
        severity: 'HIGH',
        probability: 'HIGH',
        mitigation: 'Position RIL as lowest-quartile cash cost producer using US ethane and dynamic switching.',
        trend: 'INCREASING'
      }
    ],
    marketSignals: [
      {
        commodity: 'US Mont Belvieu Ethane',
        signal: 'Sustained discount against global naphtha benchmarks',
        direction: 'BULLISH',
        impactOnRIL: 'Supports multi-billion dollar capacity expansion at Jamnagar and Dahej.'
      }
    ],
    projectImpact: 'Ratification of the AI live dashboard concept by Cracker Business Head; green light for dual-tier modeling.',
    numbersExtracted: [
      {
        metric: 'US Ethane Import Volume',
        value: '1.5',
        unit: 'MMTPA',
        context: 'RIL contract volume imported from the United States to Dahej',
        sourceCitation: {
          id: 'cit-m2-num1',
          sourceTitle: 'Meeting 2 Transcript',
          sourceType: 'MEETING',
          date: '2026-07-20',
          exactQuote: 'April 2017, 1.5 million tonnes of ethane from America, six VLECs. Upgraded cracker at Dahej, Hazira, Nagothane.',
          speaker: 'Hanoz',
          confidence: 'HIGH'
        }
      },
      {
        metric: 'VLEC Fleet Size',
        value: '6',
        unit: 'Vessels',
        context: 'Very Large Ethane Carriers currently operating in RIL fleet (with 3 planned)',
        sourceCitation: {
          id: 'cit-m2-num2',
          sourceTitle: 'Meeting 2 Transcript',
          sourceType: 'MEETING',
          date: '2026-07-20',
          exactQuote: 'Six VLECs. Upgraded cracker at Dahej, Hazira, Nagothane.',
          speaker: 'Hanoz',
          confidence: 'HIGH'
        }
      }
    ],
    topics: ['Cracker Business Model', 'Dual Simulation', 'AI Price Forecasting', 'Gas vs Liquid Feedstocks', 'VLEC Logistics', 'Global Oversupply'],
    entities: ['Hanoz', 'Adepu', 'Garima', 'Dhruv Choudhary', 'Debabrata Mukherjee', 'Ethane', 'Naphtha', 'LPG', 'Ethylene', 'Propylene', 'Dahej', 'Hazira', 'Nagothane'],
    rawTranscript: [
      { lineIndex: 98, speaker: 'Hanoz', text: 'So, you are doing this specifically for RIL or global?' },
      { lineIndex: 99, speaker: 'Dhruv Choudhary', text: 'Specifically for RIL, we thought. For the petchem.' },
      { lineIndex: 100, speaker: 'Hanoz', text: 'You can also look at it on a global basis. Like, globally how things will shift for all the industry as a whole. And you could work on predicting the prices with using AI... and basis that, do two studies: one simulation for RIL and one for global industry as a whole.', highlighted: true, annotation: 'Approval of dual-simulation architecture' },
      { lineIndex: 171, speaker: 'Hanoz', text: 'April 2017, 1.5 million tonnes of ethane from America, six VLECs. Upgraded cracker at Dahej, Hazira, Nagothane.', highlighted: true, annotation: 'Verification of RIL historical infrastructure' }
    ]
  }
];

export const MARKET_COMMODITIES: MarketCommodity[] = [
  {
    id: 'comm-ethylene',
    symbol: 'ETH-C2',
    name: 'Ethylene (CFR SE Asia / India)',
    category: 'PRODUCT',
    currentPrice: 840,
    previousPrice: 825,
    unit: 'USD/tonne',
    currency: 'USD',
    change1D: 1.82,
    change1W: 3.45,
    change1M: -2.10,
    change3M: -6.40,
    changeYTD: -4.80,
    change1Y: -11.20,
    trend: 'UP',
    source: 'Platts / ICIS Benchmark Feed',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2026-03-01', price: 920 },
      { date: '2026-04-01', price: 895 },
      { date: '2026-05-01', price: 870 },
      { date: '2026-06-01', price: 855 },
      { date: '2026-07-01', price: 830 },
      { date: '2026-08-01', price: 825 },
      { date: '2026-09-21', price: 840 }
    ]
  },
  {
    id: 'comm-propylene',
    symbol: 'PRP-C3',
    name: 'Propylene (FOB Korea / India)',
    category: 'PRODUCT',
    currentPrice: 790,
    previousPrice: 795,
    unit: 'USD/tonne',
    currency: 'USD',
    change1D: -0.63,
    change1W: 0.80,
    change1M: -3.50,
    change3M: -8.10,
    changeYTD: -5.90,
    change1Y: -14.30,
    trend: 'DOWN',
    source: 'ICIS Chemical Pricing',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2026-03-01', price: 860 },
      { date: '2026-04-01', price: 840 },
      { date: '2026-05-01', price: 825 },
      { date: '2026-06-01', price: 810 },
      { date: '2026-07-01', price: 800 },
      { date: '2026-08-01', price: 795 },
      { date: '2026-09-21', price: 790 }
    ]
  },
  {
    id: 'comm-naphtha',
    symbol: 'NAPH-SING',
    name: 'Naphtha (CFR Japan / Singapore)',
    category: 'FEEDSTOCK',
    currentPrice: 685,
    previousPrice: 664,
    unit: 'USD/tonne',
    currency: 'USD',
    change1D: 3.16,
    change1W: 7.20,
    change1M: 14.80,
    change3M: 22.40,
    changeYTD: 31.50,
    change1Y: 61.20,
    trend: 'UP',
    source: 'Argus Media / S&P Commodity',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2026-03-01', price: 540 },
      { date: '2026-04-01', price: 570 },
      { date: '2026-05-01', price: 610 },
      { date: '2026-06-01', price: 630 },
      { date: '2026-07-01', price: 645 },
      { date: '2026-08-01', price: 664 },
      { date: '2026-09-21', price: 685 }
    ]
  },
  {
    id: 'comm-ethane',
    symbol: 'ETH-MB',
    name: 'Ethane (Mont Belvieu FOB)',
    category: 'FEEDSTOCK',
    currentPrice: 145,
    previousPrice: 147,
    unit: 'USD/tonne',
    currency: 'USD',
    change1D: -1.36,
    change1W: -2.10,
    change1M: -5.40,
    change3M: -11.20,
    changeYTD: -14.60,
    change1Y: -11.00,
    trend: 'DOWN',
    source: 'OPIS / EIA Natural Gas Liquids',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2026-03-01', price: 175 },
      { date: '2026-04-01', price: 168 },
      { date: '2026-05-01', price: 160 },
      { date: '2026-06-01', price: 154 },
      { date: '2026-07-01', price: 149 },
      { date: '2026-08-01', price: 147 },
      { date: '2026-09-21', price: 145 }
    ]
  },
  {
    id: 'comm-brent',
    symbol: 'BRENT',
    name: 'Brent Crude Spot',
    category: 'ENERGY',
    currentPrice: 82.40,
    previousPrice: 81.65,
    unit: 'USD/bbl',
    currency: 'USD',
    change1D: 0.92,
    change1W: 2.10,
    change1M: 4.80,
    change3M: 8.50,
    changeYTD: 11.20,
    change1Y: 5.40,
    trend: 'UP',
    source: 'ICE Futures Europe',
    timestamp: '2026-09-21 09:30 IST',
    dataQuality: 'EXCELLENT',
    history: [
      { date: '2026-03-01', price: 74.5 },
      { date: '2026-04-01', price: 76.2 },
      { date: '2026-05-01', price: 78.9 },
      { date: '2026-06-01', price: 80.1 },
      { date: '2026-07-01', price: 80.8 },
      { date: '2026-08-01', price: 81.65 },
      { date: '2026-09-21', price: 82.40 }
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
    source: 'RBI Reference Rate / Bloomberg',
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
    source: 'Internal RIL Operational Proxy',
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
  { id: 'node-rajesh', name: 'Rajesh Rawal', category: 'PERSON', details: 'Business Head, Cracker & Poly Business, RIL (Meeting 1)', connectionsCount: 6 },
  { id: 'node-hanoz', name: 'Hanoz', category: 'PERSON', details: 'New Business Head of Cracker, RIL (Meeting 2)', connectionsCount: 7 },
  { id: 'node-adepu', name: 'Adepu', category: 'PERSON', details: 'Reliance Mentor & Cracker Domain Lead', connectionsCount: 5 },
  { id: 'node-debabrata', name: 'Debabrata Mukherjee', category: 'PERSON', details: 'Jio Institute Finance Lead (Roll 27GMT0008)', connectionsCount: 8 },
  { id: 'node-dhruv', name: 'Dhruv Choudhary', category: 'PERSON', details: 'Jio Institute Finance Researcher (ex-Nomura)', connectionsCount: 7 },
  { id: 'node-m1', name: 'Meeting 1 (06 Jul 2026)', category: 'MEETING', details: 'Scoped AI optimization, scenario modeling, expansion viability', connectionsCount: 9 },
  { id: 'node-m2', name: 'Meeting 2 (20 Jul 2026)', category: 'MEETING', details: 'Approved AI Live Dashboard and Dual Simulation architecture', connectionsCount: 9 },
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
  { source: 'node-rajesh', target: 'node-m1', relationship: 'HOSTED_AND_SCOPED', weight: 3 },
  { source: 'node-hanoz', target: 'node-m2', relationship: 'CHAIRED_AND_APPROVED', weight: 3 },
  { source: 'node-debabrata', target: 'node-m1', relationship: 'PRESENTED_AT', weight: 2 },
  { source: 'node-debabrata', target: 'node-m2', relationship: 'PARTICIPATED_IN', weight: 2 },
  { source: 'node-dhruv', target: 'node-m2', relationship: 'REPRESENTED_TEAM', weight: 2 },
  { source: 'node-m1', target: 'node-expansion', relationship: 'REDIRECTED_TOWARDS', weight: 3 },
  { source: 'node-m2', target: 'node-ril', relationship: 'MANDATED_DASHBOARD', weight: 3 },
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
    answerSnippet: 'Reliance Industries completed its naphtha-to-ethane operational transition between 2014 and 2017. In Meeting 1 (06 July 2026), Business Head Rajesh Rawal explicitly corrected the initial team scope.',
    category: 'FACT',
    model: 'RIL-Hybrid-RAG-Orchestrator v2.4 (BGE-M3 + BM25 + Qwen-72B-Instruct)',
    confidenceScore: 98,
    promptVersion: 'Executive-Institutional-v3.1',
    retrievedDocuments: [
      {
        title: 'Minutes of Meeting — RIL Meeting 1 (06 July 2026)',
        type: 'MEETING',
        pageOrLine: 'Section 4 & 19',
        snippet: 'The original idea of studying a NAFTA-to-ethane switch is not the right central framing because Reliance has already built this operational flexibility. Rajesh explained that RIL can switch within a fraction of a day using existing linear optimizers.'
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
