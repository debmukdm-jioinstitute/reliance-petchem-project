// Auto-generated from 'Ril Price (1) (1).xlsx' — RIL O2C petrochemical feedstock & product price tracker
// Source sheets: RIL_Petrochem_Tracker, Historical_3Y_Data (Oct 2023 - Sep 2026, monthly)

export interface FeedstockColumnDef {
  key: string;
  label: string;
  unit: string;
  group: string;
}

export interface FeedstockMonthlyRow {
  date: string;
  values: Record<string, number>;
}

export const FEEDSTOCK_GROUPS: string[] = [
  'UPSTREAM CRUDE SLATES & HEAVY FEEDSTOCK BASKET',
  'CRACKER FEEDSTOCKS & OLEFINS PRECURSORS',
  'CHLOR-ALKALI & VINYLS CHAIN INPUTS',
  'POLYESTER PRECURSORS & AROMATICS',
  'CATALYSTS & INDUSTRIAL CHEMICALS',
  'ENERGY, FUEL & UTILITY INPUTS',
  'DOWNSTREAM POLYMER & POLYESTER REALIZATIONS',
  'CRACK SPREADS, FEED ADVANTAGE & INTEGRATED MARGINS',
];

export const FEEDSTOCK_COLUMNS: FeedstockColumnDef[] = [
  { key: 'brentDated', label: 'Brent Dated', unit: '$/bbl', group: 'UPSTREAM CRUDE SLATES & HEAVY FEEDSTOCK BASKET' },
  { key: 'dubaiCrude', label: 'Dubai Crude', unit: '$/bbl', group: 'UPSTREAM CRUDE SLATES & HEAVY FEEDSTOCK BASKET' },
  { key: 'usWtiMidland', label: 'US WTI Midland', unit: '$/bbl', group: 'UPSTREAM CRUDE SLATES & HEAVY FEEDSTOCK BASKET' },
  { key: 'arabLight', label: 'Arab Light', unit: '$/bbl', group: 'UPSTREAM CRUDE SLATES & HEAVY FEEDSTOCK BASKET' },
  { key: 'venezuelanMerey', label: 'Venezuelan Merey', unit: '$/bbl', group: 'UPSTREAM CRUDE SLATES & HEAVY FEEDSTOCK BASKET' },
  { key: 'naphthaCfrJapan', label: 'Naphtha CFR Japan', unit: '$/MT', group: 'CRACKER FEEDSTOCKS & OLEFINS PRECURSORS' },
  { key: 'usEthaneFob', label: 'US Ethane FOB', unit: '$/MT', group: 'CRACKER FEEDSTOCKS & OLEFINS PRECURSORS' },
  { key: 'propaneSaudiCp', label: 'Propane Saudi CP', unit: '$/MT', group: 'CRACKER FEEDSTOCKS & OLEFINS PRECURSORS' },
  { key: 'butaneSaudiCp', label: 'Butane Saudi CP', unit: '$/MT', group: 'CRACKER FEEDSTOCKS & OLEFINS PRECURSORS' },
  { key: 'ethyleneCfr', label: 'Ethylene CFR', unit: '$/MT', group: 'CRACKER FEEDSTOCKS & OLEFINS PRECURSORS' },
  { key: 'industrialSalt', label: 'Industrial Salt', unit: '$/MT', group: 'CHLOR-ALKALI & VINYLS CHAIN INPUTS' },
  { key: 'edcCfr', label: 'EDC CFR', unit: '$/MT', group: 'CHLOR-ALKALI & VINYLS CHAIN INPUTS' },
  { key: 'vcmCfr', label: 'VCM CFR', unit: '$/MT', group: 'CHLOR-ALKALI & VINYLS CHAIN INPUTS' },
  { key: 'paraxylenePx', label: 'Paraxylene PX', unit: '$/MT', group: 'POLYESTER PRECURSORS & AROMATICS' },
  { key: 'ptaCfr', label: 'PTA CFR', unit: '$/MT', group: 'POLYESTER PRECURSORS & AROMATICS' },
  { key: 'megCfr', label: 'MEG CFR', unit: '$/MT', group: 'POLYESTER PRECURSORS & AROMATICS' },
  { key: 'benzeneFob', label: 'Benzene FOB', unit: '$/MT', group: 'POLYESTER PRECURSORS & AROMATICS' },
  { key: 'polymerCatalysts', label: 'Polymer Catalysts', unit: '$/kg', group: 'CATALYSTS & INDUSTRIAL CHEMICALS' },
  { key: 'causticSoda50', label: 'Caustic Soda 50%', unit: '$/MT', group: 'CATALYSTS & INDUSTRIAL CHEMICALS' },
  { key: 'petcokeGasifier', label: 'Petcoke Gasifier', unit: '$/MT', group: 'ENERGY, FUEL & UTILITY INPUTS' },
  { key: 'thermalCoalCif', label: 'Thermal Coal CIF', unit: '$/MT', group: 'ENERGY, FUEL & UTILITY INPUTS' },
  { key: 'spotLngJkm', label: 'Spot LNG JKM', unit: '$/MMBtu', group: 'ENERGY, FUEL & UTILITY INPUTS' },
  { key: 'polyethyleneHdpe', label: 'Polyethylene HDPE', unit: '$/MT', group: 'DOWNSTREAM POLYMER & POLYESTER REALIZATIONS' },
  { key: 'polypropylenePp', label: 'Polypropylene PP', unit: '$/MT', group: 'DOWNSTREAM POLYMER & POLYESTER REALIZATIONS' },
  { key: 'pvcCfrIndia', label: 'PVC CFR India', unit: '$/MT', group: 'DOWNSTREAM POLYMER & POLYESTER REALIZATIONS' },
  { key: 'polyesterFibrePsf', label: 'Polyester Fibre PSF', unit: '$/MT', group: 'DOWNSTREAM POLYMER & POLYESTER REALIZATIONS' },
  { key: 'polyesterYarnPoy', label: 'Polyester Yarn POY', unit: '$/MT', group: 'DOWNSTREAM POLYMER & POLYESTER REALIZATIONS' },
  { key: 'petBottleResin', label: 'PET Bottle Resin', unit: '$/MT', group: 'DOWNSTREAM POLYMER & POLYESTER REALIZATIONS' },
  { key: 'peNaphtha', label: 'PE - Naphtha', unit: '$/MT', group: 'CRACK SPREADS, FEED ADVANTAGE & INTEGRATED MARGINS' },
  { key: 'ppNaphtha', label: 'PP - Naphtha', unit: '$/MT', group: 'CRACK SPREADS, FEED ADVANTAGE & INTEGRATED MARGINS' },
  { key: 'polyesterSpread', label: 'Polyester Spread', unit: '$/MT', group: 'CRACK SPREADS, FEED ADVANTAGE & INTEGRATED MARGINS' },
  { key: 'ethaneAdvantage', label: 'Ethane Advantage', unit: '$/MT', group: 'CRACK SPREADS, FEED ADVANTAGE & INTEGRATED MARGINS' },
  { key: 'integratedMargin', label: 'Integrated Margin', unit: '$/MT', group: 'CRACK SPREADS, FEED ADVANTAGE & INTEGRATED MARGINS' },
];

export const FEEDSTOCK_MONTHLY: FeedstockMonthlyRow[] = [
  { date: '2023-10', values: { brentDated: 88.7, dubaiCrude: 84.5, usWtiMidland: 85.6, arabLight: 90.5, venezuelanMerey: 68.5, naphthaCfrJapan: 680.0, usEthaneFob: 145.0, propaneSaudiCp: 610.0, butaneSaudiCp: 615.0, ethyleneCfr: 860.0, industrialSalt: 30.5, edcCfr: 295.0, vcmCfr: 610.0, paraxylenePx: 1020.0, ptaCfr: 760.0, megCfr: 490.0, benzeneFob: 880.0, polymerCatalysts: 46.5, causticSoda50: 390.0, petcokeGasifier: 105.0, thermalCoalCif: 135.0, spotLngJkm: 16.5, polyethyleneHdpe: 1040.0, polypropylenePp: 990.0, pvcCfrIndia: 780.0, polyesterFibrePsf: 920.0, polyesterYarnPoy: 1030.0, petBottleResin: 910.0, peNaphtha: 360, ppNaphtha: 310, polyesterSpread: 209.8, ethaneAdvantage: 668.75, integratedMargin: 356.26 } },
  { date: '2023-11', values: { brentDated: 82.0, dubaiCrude: 78.5, usWtiMidland: 77.4, arabLight: 83.2, venezuelanMerey: 62.0, naphthaCfrJapan: 650.0, usEthaneFob: 140.0, propaneSaudiCp: 600.0, butaneSaudiCp: 620.0, ethyleneCfr: 840.0, industrialSalt: 30.5, edcCfr: 290.0, vcmCfr: 605.0, paraxylenePx: 995.0, ptaCfr: 745.0, megCfr: 485.0, benzeneFob: 860.0, polymerCatalysts: 46.5, causticSoda50: 395.0, petcokeGasifier: 102.0, thermalCoalCif: 130.0, spotLngJkm: 15.8, polyethyleneHdpe: 1010.0, polypropylenePp: 970.0, pvcCfrIndia: 770.0, polyesterFibrePsf: 910.0, polyesterYarnPoy: 1020.0, petBottleResin: 895.0, peNaphtha: 360, ppNaphtha: 320, polyesterSpread: 214.4, ethaneAdvantage: 637.5, integratedMargin: 355.23 } },
  { date: '2023-12', values: { brentDated: 77.6, dubaiCrude: 74.0, usWtiMidland: 71.9, arabLight: 79.1, venezuelanMerey: 58.5, naphthaCfrJapan: 640.0, usEthaneFob: 138.0, propaneSaudiCp: 610.0, butaneSaudiCp: 630.0, ethyleneCfr: 850.0, industrialSalt: 30.8, edcCfr: 290.0, vcmCfr: 615.0, paraxylenePx: 980.0, ptaCfr: 735.0, megCfr: 480.0, benzeneFob: 850.0, polymerCatalysts: 46.8, causticSoda50: 400.0, petcokeGasifier: 100.0, thermalCoalCif: 125.0, spotLngJkm: 14.5, polyethyleneHdpe: 1000.0, polypropylenePp: 960.0, pvcCfrIndia: 775.0, polyesterFibrePsf: 900.0, polyesterYarnPoy: 1010.0, petBottleResin: 885.0, peNaphtha: 360, ppNaphtha: 320, polyesterSpread: 214.7, ethaneAdvantage: 627.5, integratedMargin: 353.8 } },
  { date: '2024-01', values: { brentDated: 80.1, dubaiCrude: 77.5, usWtiMidland: 74.1, arabLight: 81.0, venezuelanMerey: 61.2, naphthaCfrJapan: 655.0, usEthaneFob: 142.0, propaneSaudiCp: 620.0, butaneSaudiCp: 630.0, ethyleneCfr: 870.0, industrialSalt: 30.8, edcCfr: 300.0, vcmCfr: 625.0, paraxylenePx: 1010.0, ptaCfr: 750.0, megCfr: 510.0, benzeneFob: 890.0, polymerCatalysts: 47.0, causticSoda50: 405.0, petcokeGasifier: 102.0, thermalCoalCif: 122.0, spotLngJkm: 12.2, polyethyleneHdpe: 1020.0, polypropylenePp: 980.0, pvcCfrIndia: 785.0, polyesterFibrePsf: 915.0, polyesterYarnPoy: 1025.0, petBottleResin: 895.0, peNaphtha: 365, ppNaphtha: 325, polyesterSpread: 206.6, ethaneAdvantage: 641.25, integratedMargin: 356.84 } },
  { date: '2024-02', values: { brentDated: 83.5, dubaiCrude: 80.8, usWtiMidland: 77.2, arabLight: 84.2, venezuelanMerey: 64.0, naphthaCfrJapan: 680.0, usEthaneFob: 145.0, propaneSaudiCp: 630.0, butaneSaudiCp: 640.0, ethyleneCfr: 910.0, industrialSalt: 31.0, edcCfr: 310.0, vcmCfr: 640.0, paraxylenePx: 1045.0, ptaCfr: 775.0, megCfr: 525.0, benzeneFob: 935.0, polymerCatalysts: 47.2, causticSoda50: 410.0, petcokeGasifier: 105.0, thermalCoalCif: 124.0, spotLngJkm: 11.5, polyethyleneHdpe: 1050.0, polypropylenePp: 1010.0, pvcCfrIndia: 800.0, polyesterFibrePsf: 930.0, polyesterYarnPoy: 1045.0, petBottleResin: 915.0, peNaphtha: 370, ppNaphtha: 330, polyesterSpread: 200, ethaneAdvantage: 668.75, integratedMargin: 362.31 } },
  { date: '2024-03', values: { brentDated: 85.4, dubaiCrude: 83.2, usWtiMidland: 81.3, arabLight: 86.1, venezuelanMerey: 66.5, naphthaCfrJapan: 710.0, usEthaneFob: 148.0, propaneSaudiCp: 630.0, butaneSaudiCp: 640.0, ethyleneCfr: 930.0, industrialSalt: 31.0, edcCfr: 320.0, vcmCfr: 655.0, paraxylenePx: 1070.0, ptaCfr: 790.0, megCfr: 535.0, benzeneFob: 970.0, polymerCatalysts: 47.5, causticSoda50: 415.0, petcokeGasifier: 108.0, thermalCoalCif: 126.0, spotLngJkm: 10.8, polyethyleneHdpe: 1080.0, polypropylenePp: 1040.0, pvcCfrIndia: 820.0, polyesterFibrePsf: 950.0, polyesterYarnPoy: 1070.0, petBottleResin: 935.0, peNaphtha: 370, ppNaphtha: 330, polyesterSpread: 208.7, ethaneAdvantage: 702.5, integratedMargin: 369.55 } },
  { date: '2024-04', values: { brentDated: 89.0, dubaiCrude: 86.8, usWtiMidland: 84.4, arabLight: 89.5, venezuelanMerey: 70.2, naphthaCfrJapan: 725.0, usEthaneFob: 150.0, propaneSaudiCp: 615.0, butaneSaudiCp: 620.0, ethyleneCfr: 940.0, industrialSalt: 31.2, edcCfr: 325.0, vcmCfr: 660.0, paraxylenePx: 1090.0, ptaCfr: 805.0, megCfr: 540.0, benzeneFob: 1010.0, polymerCatalysts: 47.5, causticSoda50: 420.0, petcokeGasifier: 110.0, thermalCoalCif: 128.0, spotLngJkm: 11.2, polyethyleneHdpe: 1095.0, polypropylenePp: 1055.0, pvcCfrIndia: 830.0, polyesterFibrePsf: 965.0, polyesterYarnPoy: 1085.0, petBottleResin: 950.0, peNaphtha: 370, ppNaphtha: 330, polyesterSpread: 209.1, ethaneAdvantage: 718.75, integratedMargin: 372.09 } },
  { date: '2024-05', values: { brentDated: 83.0, dubaiCrude: 81.5, usWtiMidland: 78.6, arabLight: 83.8, venezuelanMerey: 65.0, naphthaCfrJapan: 675.0, usEthaneFob: 144.0, propaneSaudiCp: 580.0, butaneSaudiCp: 585.0, ethyleneCfr: 915.0, industrialSalt: 31.2, edcCfr: 315.0, vcmCfr: 645.0, paraxylenePx: 1050.0, ptaCfr: 780.0, megCfr: 530.0, benzeneFob: 960.0, polymerCatalysts: 47.5, causticSoda50: 415.0, petcokeGasifier: 108.0, thermalCoalCif: 125.0, spotLngJkm: 12.0, polyethyleneHdpe: 1060.0, polypropylenePp: 1020.0, pvcCfrIndia: 815.0, polyesterFibrePsf: 940.0, polyesterYarnPoy: 1055.0, petBottleResin: 925.0, peNaphtha: 385, ppNaphtha: 345, polyesterSpread: 204, ethaneAdvantage: 663.75, integratedMargin: 371.56 } },
  { date: '2024-06', values: { brentDated: 82.6, dubaiCrude: 81.2, usWtiMidland: 79.8, arabLight: 83.5, venezuelanMerey: 64.5, naphthaCfrJapan: 668.0, usEthaneFob: 142.0, propaneSaudiCp: 580.0, butaneSaudiCp: 565.0, ethyleneCfr: 895.0, industrialSalt: 31.5, edcCfr: 310.0, vcmCfr: 640.0, paraxylenePx: 1040.0, ptaCfr: 770.0, megCfr: 525.0, benzeneFob: 950.0, polymerCatalysts: 47.8, causticSoda50: 415.0, petcokeGasifier: 107.0, thermalCoalCif: 126.0, spotLngJkm: 12.5, polyethyleneHdpe: 1050.0, polypropylenePp: 1010.0, pvcCfrIndia: 810.0, polyesterFibrePsf: 935.0, polyesterYarnPoy: 1045.0, petBottleResin: 915.0, peNaphtha: 382, ppNaphtha: 342, polyesterSpread: 204.3, ethaneAdvantage: 657.5, integratedMargin: 368.9 } },
  { date: '2024-07', values: { brentDated: 83.9, dubaiCrude: 82.5, usWtiMidland: 80.5, arabLight: 84.8, venezuelanMerey: 65.8, naphthaCfrJapan: 675.0, usEthaneFob: 145.0, propaneSaudiCp: 570.0, butaneSaudiCp: 555.0, ethyleneCfr: 905.0, industrialSalt: 31.5, edcCfr: 315.0, vcmCfr: 645.0, paraxylenePx: 1055.0, ptaCfr: 780.0, megCfr: 530.0, benzeneFob: 965.0, polymerCatalysts: 47.8, causticSoda50: 418.0, petcokeGasifier: 109.0, thermalCoalCif: 127.0, spotLngJkm: 12.4, polyethyleneHdpe: 1060.0, polypropylenePp: 1020.0, pvcCfrIndia: 815.0, polyesterFibrePsf: 945.0, polyesterYarnPoy: 1055.0, petBottleResin: 925.0, peNaphtha: 385, ppNaphtha: 345, polyesterSpread: 204, ethaneAdvantage: 662.5, integratedMargin: 371.38 } },
  { date: '2024-08', values: { brentDated: 78.9, dubaiCrude: 77.6, usWtiMidland: 75.4, arabLight: 79.7, venezuelanMerey: 61.5, naphthaCfrJapan: 650.0, usEthaneFob: 140.0, propaneSaudiCp: 590.0, butaneSaudiCp: 570.0, ethyleneCfr: 885.0, industrialSalt: 31.5, edcCfr: 305.0, vcmCfr: 635.0, paraxylenePx: 1020.0, ptaCfr: 755.0, megCfr: 520.0, benzeneFob: 920.0, polymerCatalysts: 47.8, causticSoda50: 415.0, petcokeGasifier: 106.0, thermalCoalCif: 124.0, spotLngJkm: 13.0, polyethyleneHdpe: 1035.0, polypropylenePp: 995.0, pvcCfrIndia: 800.0, polyesterFibrePsf: 925.0, polyesterYarnPoy: 1035.0, petBottleResin: 905.0, peNaphtha: 385, ppNaphtha: 345, polyesterSpread: 208.9, ethaneAdvantage: 637.5, integratedMargin: 368.85 } },
  { date: '2024-09', values: { brentDated: 74.3, dubaiCrude: 73.5, usWtiMidland: 70.2, arabLight: 75.2, venezuelanMerey: 58.0, naphthaCfrJapan: 630.0, usEthaneFob: 138.0, propaneSaudiCp: 605.0, butaneSaudiCp: 585.0, ethyleneCfr: 865.0, industrialSalt: 31.5, edcCfr: 300.0, vcmCfr: 625.0, paraxylenePx: 990.0, ptaCfr: 735.0, megCfr: 515.0, benzeneFob: 880.0, polymerCatalysts: 48.0, causticSoda50: 412.0, petcokeGasifier: 105.0, thermalCoalCif: 122.0, spotLngJkm: 13.2, polyethyleneHdpe: 1015.0, polypropylenePp: 975.0, pvcCfrIndia: 790.0, polyesterFibrePsf: 910.0, polyesterYarnPoy: 1015.0, petBottleResin: 890.0, peNaphtha: 385, ppNaphtha: 345, polyesterSpread: 207.8, ethaneAdvantage: 615, integratedMargin: 365.2 } },
  { date: '2024-10', values: { brentDated: 75.4, dubaiCrude: 74.2, usWtiMidland: 71.6, arabLight: 76.2, venezuelanMerey: 59.1, naphthaCfrJapan: 640.0, usEthaneFob: 141.0, propaneSaudiCp: 625.0, butaneSaudiCp: 615.0, ethyleneCfr: 870.0, industrialSalt: 31.5, edcCfr: 305.0, vcmCfr: 630.0, paraxylenePx: 1005.0, ptaCfr: 740.0, megCfr: 518.0, benzeneFob: 870.0, polymerCatalysts: 48.0, causticSoda50: 415.0, petcokeGasifier: 106.0, thermalCoalCif: 123.0, spotLngJkm: 13.1, polyethyleneHdpe: 1020.0, polypropylenePp: 980.0, pvcCfrIndia: 795.0, polyesterFibrePsf: 915.0, polyesterYarnPoy: 1020.0, petBottleResin: 895.0, peNaphtha: 380, ppNaphtha: 340, polyesterSpread: 207.48, ethaneAdvantage: 623.75, integratedMargin: 363.43 } },
  { date: '2024-11', values: { brentDated: 73.2, dubaiCrude: 72.4, usWtiMidland: 69.8, arabLight: 74.0, venezuelanMerey: 57.5, naphthaCfrJapan: 628.0, usEthaneFob: 144.0, propaneSaudiCp: 635.0, butaneSaudiCp: 630.0, ethyleneCfr: 860.0, industrialSalt: 31.5, edcCfr: 300.0, vcmCfr: 620.0, paraxylenePx: 985.0, ptaCfr: 730.0, megCfr: 512.0, benzeneFob: 855.0, polymerCatalysts: 48.0, causticSoda50: 415.0, petcokeGasifier: 105.0, thermalCoalCif: 121.0, spotLngJkm: 13.8, polyethyleneHdpe: 1010.0, polypropylenePp: 970.0, pvcCfrIndia: 785.0, polyesterFibrePsf: 905.0, polyesterYarnPoy: 1010.0, petBottleResin: 885.0, peNaphtha: 382, ppNaphtha: 342, polyesterSpread: 208.12, ethaneAdvantage: 605, integratedMargin: 361.98 } },
  { date: '2024-12', values: { brentDated: 73.8, dubaiCrude: 72.8, usWtiMidland: 70.3, arabLight: 74.6, venezuelanMerey: 57.9, naphthaCfrJapan: 635.0, usEthaneFob: 148.0, propaneSaudiCp: 640.0, butaneSaudiCp: 635.0, ethyleneCfr: 865.0, industrialSalt: 31.8, edcCfr: 302.0, vcmCfr: 622.0, paraxylenePx: 990.0, ptaCfr: 735.0, megCfr: 515.0, benzeneFob: 860.0, polymerCatalysts: 48.0, causticSoda50: 418.0, petcokeGasifier: 106.0, thermalCoalCif: 122.0, spotLngJkm: 14.2, polyethyleneHdpe: 1015.0, polypropylenePp: 975.0, pvcCfrIndia: 790.0, polyesterFibrePsf: 910.0, polyesterYarnPoy: 1015.0, petBottleResin: 890.0, peNaphtha: 380, ppNaphtha: 340, polyesterSpread: 207.8, ethaneAdvantage: 608.75, integratedMargin: 361.26 } },
  { date: '2025-01', values: { brentDated: 77.5, dubaiCrude: 76.3, usWtiMidland: 73.9, arabLight: 78.2, venezuelanMerey: 61.4, naphthaCfrJapan: 658.0, usEthaneFob: 155.0, propaneSaudiCp: 635.0, butaneSaudiCp: 625.0, ethyleneCfr: 885.0, industrialSalt: 31.8, edcCfr: 312.0, vcmCfr: 638.0, paraxylenePx: 1025.0, ptaCfr: 748.0, megCfr: 528.0, benzeneFob: 885.0, polymerCatalysts: 48.2, causticSoda50: 422.0, petcokeGasifier: 110.0, thermalCoalCif: 124.0, spotLngJkm: 13.5, polyethyleneHdpe: 1040.0, polypropylenePp: 995.0, pvcCfrIndia: 805.0, polyesterFibrePsf: 928.0, polyesterYarnPoy: 1035.0, petBottleResin: 905.0, peNaphtha: 382, ppNaphtha: 337, polyesterSpread: 212.2, ethaneAdvantage: 628.75, integratedMargin: 365.31 } },
  { date: '2025-02', values: { brentDated: 79.8, dubaiCrude: 78.5, usWtiMidland: 76.1, arabLight: 80.4, venezuelanMerey: 63.8, naphthaCfrJapan: 678.0, usEthaneFob: 160.0, propaneSaudiCp: 630.0, butaneSaudiCp: 620.0, ethyleneCfr: 910.0, industrialSalt: 31.8, edcCfr: 320.0, vcmCfr: 650.0, paraxylenePx: 1060.0, ptaCfr: 765.0, megCfr: 540.0, benzeneFob: 915.0, polymerCatalysts: 48.2, causticSoda50: 428.0, petcokeGasifier: 114.0, thermalCoalCif: 127.0, spotLngJkm: 12.8, polyethyleneHdpe: 1068.0, polypropylenePp: 1025.0, pvcCfrIndia: 820.0, polyesterFibrePsf: 948.0, polyesterYarnPoy: 1058.0, petBottleResin: 925.0, peNaphtha: 390, ppNaphtha: 347, polyesterSpread: 216.5, ethaneAdvantage: 647.5, integratedMargin: 374.5 } },
  { date: '2025-03', values: { brentDated: 81.5, dubaiCrude: 80.2, usWtiMidland: 77.8, arabLight: 82.1, venezuelanMerey: 65.2, naphthaCfrJapan: 695.0, usEthaneFob: 158.0, propaneSaudiCp: 615.0, butaneSaudiCp: 605.0, ethyleneCfr: 925.0, industrialSalt: 32.0, edcCfr: 325.0, vcmCfr: 660.0, paraxylenePx: 1085.0, ptaCfr: 780.0, megCfr: 550.0, benzeneFob: 935.0, polymerCatalysts: 48.2, causticSoda50: 432.0, petcokeGasifier: 116.0, thermalCoalCif: 129.0, spotLngJkm: 12.2, polyethyleneHdpe: 1085.0, polypropylenePp: 1042.0, pvcCfrIndia: 835.0, polyesterFibrePsf: 965.0, polyesterYarnPoy: 1075.0, petBottleResin: 940.0, peNaphtha: 390, ppNaphtha: 347, polyesterSpread: 217.2, ethaneAdvantage: 671.25, integratedMargin: 378.24 } },
  { date: '2025-04', values: { brentDated: 79.2, dubaiCrude: 78.0, usWtiMidland: 75.5, arabLight: 79.8, venezuelanMerey: 63.2, naphthaCfrJapan: 672.0, usEthaneFob: 152.0, propaneSaudiCp: 595.0, butaneSaudiCp: 585.0, ethyleneCfr: 900.0, industrialSalt: 32.0, edcCfr: 318.0, vcmCfr: 645.0, paraxylenePx: 1050.0, ptaCfr: 760.0, megCfr: 538.0, benzeneFob: 905.0, polymerCatalysts: 48.2, causticSoda50: 426.0, petcokeGasifier: 113.0, thermalCoalCif: 126.0, spotLngJkm: 11.6, polyethyleneHdpe: 1060.0, polypropylenePp: 1018.0, pvcCfrIndia: 818.0, polyesterFibrePsf: 945.0, polyesterYarnPoy: 1050.0, petBottleResin: 920.0, peNaphtha: 388, ppNaphtha: 346, polyesterSpread: 213.48, ethaneAdvantage: 650, integratedMargin: 373.17 } },
  { date: '2025-05', values: { brentDated: 76.5, dubaiCrude: 75.3, usWtiMidland: 72.8, arabLight: 77.1, venezuelanMerey: 60.8, naphthaCfrJapan: 650.0, usEthaneFob: 148.0, propaneSaudiCp: 580.0, butaneSaudiCp: 570.0, ethyleneCfr: 880.0, industrialSalt: 32.0, edcCfr: 310.0, vcmCfr: 635.0, paraxylenePx: 1020.0, ptaCfr: 742.0, megCfr: 526.0, benzeneFob: 875.0, polymerCatalysts: 48.2, causticSoda50: 420.0, petcokeGasifier: 110.0, thermalCoalCif: 124.0, spotLngJkm: 11.2, polyethyleneHdpe: 1035.0, polypropylenePp: 990.0, pvcCfrIndia: 800.0, polyesterFibrePsf: 925.0, polyesterYarnPoy: 1030.0, petBottleResin: 900.0, peNaphtha: 385, ppNaphtha: 340, polyesterSpread: 213.04, ethaneAdvantage: 627.5, integratedMargin: 367.14 } },
  { date: '2025-06', values: { brentDated: 78.0, dubaiCrude: 76.8, usWtiMidland: 74.4, arabLight: 78.6, venezuelanMerey: 62.1, naphthaCfrJapan: 662.0, usEthaneFob: 152.0, propaneSaudiCp: 585.0, butaneSaudiCp: 575.0, ethyleneCfr: 892.0, industrialSalt: 32.0, edcCfr: 314.0, vcmCfr: 640.0, paraxylenePx: 1035.0, ptaCfr: 752.0, megCfr: 532.0, benzeneFob: 890.0, polymerCatalysts: 48.2, causticSoda50: 424.0, petcokeGasifier: 112.0, thermalCoalCif: 125.0, spotLngJkm: 11.5, polyethyleneHdpe: 1048.0, polypropylenePp: 1005.0, pvcCfrIndia: 808.0, polyesterFibrePsf: 935.0, polyesterYarnPoy: 1040.0, petBottleResin: 910.0, peNaphtha: 386, ppNaphtha: 343, polyesterSpread: 212.4, ethaneAdvantage: 637.5, integratedMargin: 369.58 } },
  { date: '2025-07', values: { brentDated: 75.2, dubaiCrude: 74.0, usWtiMidland: 71.7, arabLight: 75.8, venezuelanMerey: 59.6, naphthaCfrJapan: 640.0, usEthaneFob: 145.0, propaneSaudiCp: 575.0, butaneSaudiCp: 565.0, ethyleneCfr: 872.0, industrialSalt: 31.8, edcCfr: 306.0, vcmCfr: 626.0, paraxylenePx: 1002.0, ptaCfr: 732.0, megCfr: 520.0, benzeneFob: 865.0, polymerCatalysts: 48.0, causticSoda50: 418.0, petcokeGasifier: 108.0, thermalCoalCif: 122.0, spotLngJkm: 11.8, polyethyleneHdpe: 1025.0, polypropylenePp: 982.0, pvcCfrIndia: 788.0, polyesterFibrePsf: 915.0, polyesterYarnPoy: 1020.0, petBottleResin: 890.0, peNaphtha: 385, ppNaphtha: 342, polyesterSpread: 213.68, ethaneAdvantage: 618.75, integratedMargin: 366.48 } },
  { date: '2025-08', values: { brentDated: 74.8, dubaiCrude: 73.6, usWtiMidland: 71.2, arabLight: 75.4, venezuelanMerey: 59.2, naphthaCfrJapan: 636.0, usEthaneFob: 148.0, propaneSaudiCp: 580.0, butaneSaudiCp: 570.0, ethyleneCfr: 868.0, industrialSalt: 31.8, edcCfr: 304.0, vcmCfr: 622.0, paraxylenePx: 995.0, ptaCfr: 728.0, megCfr: 516.0, benzeneFob: 858.0, polymerCatalysts: 48.0, causticSoda50: 415.0, petcokeGasifier: 107.0, thermalCoalCif: 121.0, spotLngJkm: 12.0, polyethyleneHdpe: 1018.0, polypropylenePp: 975.0, pvcCfrIndia: 782.0, polyesterFibrePsf: 908.0, polyesterYarnPoy: 1012.0, petBottleResin: 884.0, peNaphtha: 382, ppNaphtha: 339, polyesterSpread: 210.48, ethaneAdvantage: 610, integratedMargin: 362.57 } },
  { date: '2025-09', values: { brentDated: 75.8, dubaiCrude: 74.6, usWtiMidland: 72.1, arabLight: 76.4, venezuelanMerey: 60.1, naphthaCfrJapan: 642.0, usEthaneFob: 150.0, propaneSaudiCp: 585.0, butaneSaudiCp: 572.0, ethyleneCfr: 872.0, industrialSalt: 31.8, edcCfr: 308.0, vcmCfr: 628.0, paraxylenePx: 1002.0, ptaCfr: 734.0, megCfr: 520.0, benzeneFob: 862.0, polymerCatalysts: 48.0, causticSoda50: 418.0, petcokeGasifier: 109.0, thermalCoalCif: 123.0, spotLngJkm: 12.4, polyethyleneHdpe: 1022.0, polypropylenePp: 978.0, pvcCfrIndia: 790.0, polyesterFibrePsf: 912.0, polyesterYarnPoy: 1016.0, petBottleResin: 888.0, peNaphtha: 380, ppNaphtha: 336, polyesterSpread: 207.96, ethaneAdvantage: 615, integratedMargin: 361.24 } },
  { date: '2025-10', values: { brentDated: 76.5, dubaiCrude: 75.2, usWtiMidland: 72.8, arabLight: 77.1, venezuelanMerey: 60.8, naphthaCfrJapan: 645.0, usEthaneFob: 152.3, propaneSaudiCp: 590.0, butaneSaudiCp: 575.0, ethyleneCfr: 875.0, industrialSalt: 31.5, edcCfr: 310.0, vcmCfr: 630.0, paraxylenePx: 1006.2, ptaCfr: 738.0, megCfr: 522.0, benzeneFob: 840.0, polymerCatalysts: 48.0, causticSoda50: 420.0, petcokeGasifier: 110.0, thermalCoalCif: 124.0, spotLngJkm: 12.8, polyethyleneHdpe: 1025.0, polypropylenePp: 980.0, pvcCfrIndia: 795.0, polyesterFibrePsf: 915.0, polyesterYarnPoy: 1020.0, petBottleResin: 890.0, peNaphtha: 380, ppNaphtha: 335, polyesterSpread: 207.84, ethaneAdvantage: 615.88, integratedMargin: 361.09 } },
  { date: '2025-11', values: { brentDated: 74.2, dubaiCrude: 73.1, usWtiMidland: 70.6, arabLight: 74.9, venezuelanMerey: 58.5, naphthaCfrJapan: 632.0, usEthaneFob: 156.3, propaneSaudiCp: 605.0, butaneSaudiCp: 590.0, ethyleneCfr: 860.0, industrialSalt: 31.5, edcCfr: 305.0, vcmCfr: 622.0, paraxylenePx: 985.92, ptaCfr: 725.0, megCfr: 518.0, benzeneFob: 825.0, polymerCatalysts: 48.0, causticSoda50: 415.0, petcokeGasifier: 108.0, thermalCoalCif: 122.0, spotLngJkm: 13.5, polyethyleneHdpe: 1010.0, polypropylenePp: 965.0, pvcCfrIndia: 785.0, polyesterFibrePsf: 900.0, polyesterYarnPoy: 1005.0, petBottleResin: 875.0, peNaphtha: 378, ppNaphtha: 333, polyesterSpread: 205.38, ethaneAdvantage: 594.63, integratedMargin: 356.09 } },
  { date: '2025-12', values: { brentDated: 73.1, dubaiCrude: 72.0, usWtiMidland: 69.5, arabLight: 73.8, venezuelanMerey: 57.2, naphthaCfrJapan: 622.0, usEthaneFob: 161.0, propaneSaudiCp: 615.0, butaneSaudiCp: 600.0, ethyleneCfr: 850.0, industrialSalt: 31.8, edcCfr: 298.0, vcmCfr: 615.0, paraxylenePx: 970.32, ptaCfr: 718.0, megCfr: 512.0, benzeneFob: 815.0, polymerCatalysts: 48.2, causticSoda50: 410.0, petcokeGasifier: 106.0, thermalCoalCif: 120.0, spotLngJkm: 14.2, polyethyleneHdpe: 1005.0, polypropylenePp: 960.0, pvcCfrIndia: 775.0, polyesterFibrePsf: 890.0, polyesterYarnPoy: 995.0, petBottleResin: 865.0, peNaphtha: 383, ppNaphtha: 338, polyesterSpread: 203.44, ethaneAdvantage: 576.25, integratedMargin: 355.85 } },
  { date: '2026-01', values: { brentDated: 78.4, dubaiCrude: 77.2, usWtiMidland: 74.8, arabLight: 79.1, venezuelanMerey: 62.4, naphthaCfrJapan: 668.0, usEthaneFob: 171.0, propaneSaudiCp: 625.0, butaneSaudiCp: 610.0, ethyleneCfr: 895.0, industrialSalt: 32.0, edcCfr: 318.0, vcmCfr: 642.0, paraxylenePx: 1042.08, ptaCfr: 755.0, megCfr: 535.0, benzeneFob: 865.0, polymerCatalysts: 48.2, causticSoda50: 425.0, petcokeGasifier: 114.0, thermalCoalCif: 126.0, spotLngJkm: 13.9, polyethyleneHdpe: 1050.0, polypropylenePp: 1005.0, pvcCfrIndia: 810.0, polyesterFibrePsf: 935.0, polyesterYarnPoy: 1045.0, petBottleResin: 910.0, peNaphtha: 382, ppNaphtha: 337, polyesterSpread: 213.8, ethaneAdvantage: 621.25, integratedMargin: 364.59 } },
  { date: '2026-02', values: { brentDated: 81.2, dubaiCrude: 80.0, usWtiMidland: 77.5, arabLight: 81.9, venezuelanMerey: 65.1, naphthaCfrJapan: 692.0, usEthaneFob: 175.0, propaneSaudiCp: 630.0, butaneSaudiCp: 615.0, ethyleneCfr: 925.0, industrialSalt: 32.0, edcCfr: 325.0, vcmCfr: 658.0, paraxylenePx: 1079.52, ptaCfr: 778.0, megCfr: 548.0, benzeneFob: 895.0, polymerCatalysts: 48.5, causticSoda50: 435.0, petcokeGasifier: 118.0, thermalCoalCif: 130.0, spotLngJkm: 13.2, polyethyleneHdpe: 1085.0, polypropylenePp: 1040.0, pvcCfrIndia: 830.0, polyesterFibrePsf: 965.0, polyesterYarnPoy: 1075.0, petBottleResin: 940.0, peNaphtha: 393, ppNaphtha: 348, polyesterSpread: 219.6, ethaneAdvantage: 646.25, integratedMargin: 376.39 } },
  { date: '2026-03', values: { brentDated: 82.9, dubaiCrude: 81.6, usWtiMidland: 79.2, arabLight: 83.5, venezuelanMerey: 66.8, naphthaCfrJapan: 708.0, usEthaneFob: 172.4, propaneSaudiCp: 615.0, butaneSaudiCp: 600.0, ethyleneCfr: 940.0, industrialSalt: 32.2, edcCfr: 330.0, vcmCfr: 668.0, paraxylenePx: 1104.48, ptaCfr: 792.0, megCfr: 556.0, benzeneFob: 910.0, polymerCatalysts: 48.5, causticSoda50: 440.0, petcokeGasifier: 120.0, thermalCoalCif: 132.0, spotLngJkm: 12.5, polyethyleneHdpe: 1105.0, polypropylenePp: 1060.0, pvcCfrIndia: 845.0, polyesterFibrePsf: 980.0, polyesterYarnPoy: 1095.0, petBottleResin: 955.0, peNaphtha: 397, ppNaphtha: 352, polyesterSpread: 224.84, ethaneAdvantage: 669.5, integratedMargin: 383.59 } },
  { date: '2026-04', values: { brentDated: 80.5, dubaiCrude: 79.3, usWtiMidland: 76.9, arabLight: 81.2, venezuelanMerey: 64.5, naphthaCfrJapan: 685.0, usEthaneFob: 163.7, propaneSaudiCp: 595.0, butaneSaudiCp: 580.0, ethyleneCfr: 915.0, industrialSalt: 32.2, edcCfr: 322.0, vcmCfr: 652.0, paraxylenePx: 1068.6, ptaCfr: 772.0, megCfr: 545.0, benzeneFob: 885.0, polymerCatalysts: 48.5, causticSoda50: 432.0, petcokeGasifier: 116.0, thermalCoalCif: 128.0, spotLngJkm: 11.9, polyethyleneHdpe: 1075.0, polypropylenePp: 1030.0, pvcCfrIndia: 825.0, polyesterFibrePsf: 955.0, polyesterYarnPoy: 1065.0, petBottleResin: 930.0, peNaphtha: 390, ppNaphtha: 345, polyesterSpread: 215.78, ethaneAdvantage: 651.63, integratedMargin: 374.44 } },
  { date: '2026-05', values: { brentDated: 77.8, dubaiCrude: 76.5, usWtiMidland: 74.2, arabLight: 78.4, venezuelanMerey: 62.0, naphthaCfrJapan: 660.0, usEthaneFob: 155.0, propaneSaudiCp: 580.0, butaneSaudiCp: 565.0, ethyleneCfr: 890.0, industrialSalt: 32.0, edcCfr: 312.0, vcmCfr: 638.0, paraxylenePx: 1029.6, ptaCfr: 750.0, megCfr: 532.0, benzeneFob: 855.0, polymerCatalysts: 48.3, causticSoda50: 424.0, petcokeGasifier: 112.0, thermalCoalCif: 125.0, spotLngJkm: 11.4, polyethyleneHdpe: 1045.0, polypropylenePp: 1000.0, pvcCfrIndia: 805.0, polyesterFibrePsf: 930.0, polyesterYarnPoy: 1035.0, petBottleResin: 905.0, peNaphtha: 385, ppNaphtha: 340, polyesterSpread: 209.12, ethaneAdvantage: 631.25, integratedMargin: 366.72 } },
  { date: '2026-06', values: { brentDated: 79.3, dubaiCrude: 78.1, usWtiMidland: 75.7, arabLight: 80.0, venezuelanMerey: 63.6, naphthaCfrJapan: 672.0, usEthaneFob: 159.7, propaneSaudiCp: 585.0, butaneSaudiCp: 570.0, ethyleneCfr: 905.0, industrialSalt: 32.0, edcCfr: 316.0, vcmCfr: 645.0, paraxylenePx: 1048.32, ptaCfr: 762.0, megCfr: 540.0, benzeneFob: 870.0, polymerCatalysts: 48.3, causticSoda50: 428.0, petcokeGasifier: 115.0, thermalCoalCif: 127.0, spotLngJkm: 11.8, polyethyleneHdpe: 1060.0, polypropylenePp: 1015.0, pvcCfrIndia: 815.0, polyesterFibrePsf: 945.0, polyesterYarnPoy: 1050.0, petBottleResin: 920.0, peNaphtha: 388, ppNaphtha: 343, polyesterSpread: 211.08, ethaneAdvantage: 640.38, integratedMargin: 370.38 } },
  { date: '2026-07', values: { brentDated: 76.2, dubaiCrude: 75.0, usWtiMidland: 72.6, arabLight: 76.8, venezuelanMerey: 60.5, naphthaCfrJapan: 648.0, usEthaneFob: 150.3, propaneSaudiCp: 575.0, butaneSaudiCp: 560.0, ethyleneCfr: 880.0, industrialSalt: 31.8, edcCfr: 308.0, vcmCfr: 628.0, paraxylenePx: 1010.88, ptaCfr: 740.0, megCfr: 526.0, benzeneFob: 845.0, polymerCatalysts: 48.2, causticSoda50: 418.0, petcokeGasifier: 111.0, thermalCoalCif: 123.0, spotLngJkm: 12.1, polyethyleneHdpe: 1035.0, polypropylenePp: 990.0, pvcCfrIndia: 790.0, polyesterFibrePsf: 920.0, polyesterYarnPoy: 1025.0, petBottleResin: 895.0, peNaphtha: 387, ppNaphtha: 342, polyesterSpread: 209.76, ethaneAdvantage: 622.13, integratedMargin: 366.71 } },
  { date: '2026-08', values: { brentDated: 96.17, dubaiCrude: 74.2, usWtiMidland: 71.9, arabLight: 76.0, venezuelanMerey: 59.8, naphthaCfrJapan: 833.5, usEthaneFob: 159.88, propaneSaudiCp: 580.0, butaneSaudiCp: 565.0, ethyleneCfr: 865.23, industrialSalt: 31.8, edcCfr: 305.0, vcmCfr: 620.0, paraxylenePx: 998.4, ptaCfr: 732.0, megCfr: 520.0, benzeneFob: 835.0, polymerCatalysts: 48.2, causticSoda50: 412.0, petcokeGasifier: 109.0, thermalCoalCif: 121.0, spotLngJkm: 12.3, polyethyleneHdpe: 1025.0, polypropylenePp: 985.0, pvcCfrIndia: 785.0, polyesterFibrePsf: 910.0, polyesterYarnPoy: 1015.0, petBottleResin: 885.0, peNaphtha: 191.5, ppNaphtha: 151.5, polyesterSpread: 208.68, ethaneAdvantage: 842.03, integratedMargin: 283.37 } },
  { date: '2026-09', values: { brentDated: 97.42, dubaiCrude: 73.6, usWtiMidland: 71.3, arabLight: 75.5, venezuelanMerey: 59.2, naphthaCfrJapan: 816.0, usEthaneFob: 157.0, propaneSaudiCp: 595.0, butaneSaudiCp: 580.0, ethyleneCfr: 886.0, industrialSalt: 32.0, edcCfr: 315.0, vcmCfr: 635.0, paraxylenePx: 1017.12, ptaCfr: 745.0, megCfr: 530.0, benzeneFob: 850.0, polymerCatalysts: 48.5, causticSoda50: 420.0, petcokeGasifier: 112.0, thermalCoalCif: 124.0, spotLngJkm: 12.6, polyethyleneHdpe: 1040.0, polypropylenePp: 995.0, pvcCfrIndia: 795.0, polyesterFibrePsf: 925.0, polyesterYarnPoy: 1030.0, petBottleResin: 900.0, peNaphtha: 224, ppNaphtha: 179, polyesterSpread: 209.1, ethaneAdvantage: 823.75, integratedMargin: 298.99 } },
];
export interface FeedstockSpecRow {
  material: string;
  category: string;
  benchmark: string;
  pricingBasis: string;
  spotPriceLabel: string;
  rilNode: string;
  strategicRole: string;
}

export const FEEDSTOCK_SPEC_SHEET: FeedstockSpecRow[] = [
  { material: 'Dated Brent Crude', category: 'Upstream Feedstock', benchmark: 'North Sea (Dated Brent 38° API)', pricingBasis: '$/bbl (FOB Sullom Voe)', spotPriceLabel: '97.42', rilNode: 'Jamnagar DTA & SEZ Complex', strategicRole: 'Global sweet pricing marker; benchmark for light sweet blend optimization' },
  { material: 'Dubai / Oman Crude', category: 'Upstream Feedstock', benchmark: 'Middle East Medium Sour (31-32° API)', pricingBasis: '$/bbl (FOB Mina Al Fahal)', spotPriceLabel: '73.6', rilNode: 'Jamnagar Crude Distillation Units (CDU)', strategicRole: 'Primary baseline marker for Asian sour refining margins and CDU economics' },
  { material: 'Venezuelan Merey 16', category: 'Upstream Feedstock', benchmark: 'Latin America Extra-Heavy Sour (16° API)', pricingBasis: '$/bbl (FOB Jose Terminal)', spotPriceLabel: '59.2', rilNode: 'Jamnagar Coker & Hydrocracker Complex', strategicRole: 'High-margin discounted heavy feed; leveraged via world\'s largest coker capacity' },
  { material: 'US Ethane (Mont Belvieu)', category: 'Cracker Feedstock', benchmark: 'US Gulf Coast Fractionators (Purity >95%)', pricingBasis: '$/MT (Enterprise Mont Belvieu FOB)', spotPriceLabel: '157.0', rilNode: 'Dahej, Hazira & Nagothane Crackers', strategicRole: 'Imported via 6 dedicated VLECs; structural 40-50% cash cost moat vs naphtha' },
  { material: 'Naphtha (Light Paraffinic)', category: 'Cracker Feedstock', benchmark: 'Asian Open Spec (CFR Japan)', pricingBasis: '$/MT (CFR Far East)', spotPriceLabel: '816.0', rilNode: 'Jamnagar ROGC & Hazira Naphtha Cracker', strategicRole: 'Primary liquid feed for olefins (ethylene, propylene) and aromatics (PX, benzene)' },
  { material: 'Propane & Butane (LPG)', category: 'Cracker Feedstock', benchmark: 'Saudi Aramco Contract Price (CP)', pricingBasis: '$/MT (FOB Ras Tanura)', spotPriceLabel: '595.0', rilNode: 'Hazira & Dahej Flexible Crackers', strategicRole: 'Seasonal co-cracking alternate yielding high propylene & balancing ethylene cost' },
  { material: 'Industrial Solar / Rock Salt', category: 'Chlor-Alkali Input', benchmark: 'Gujarat / Rann of Kutch (NaCl >98%)', pricingBasis: '$/MT (Delivered Dahej Ex-Works)', spotPriceLabel: '32.0', rilNode: 'Dahej Chlor-Alkali & Chlorine Plant', strategicRole: 'Captive brine generation for membrane chlor-alkali cells; chlorine feeds PVC chain' },
  { material: 'Ethylene Dichloride (EDC)', category: 'Vinyl Intermediate', benchmark: 'US Gulf Coast / Middle East CFR', pricingBasis: '$/MT (CFR Nhava Sheva / Hazira)', spotPriceLabel: '315.0', rilNode: 'Dahej & Hazira Vinyl Chloride Units', strategicRole: 'Supplementary feedstock balancing captive ethylene for Vinyl Chloride Monomer (VCM)' },
  { material: 'Paraxylene (PX)', category: 'Polyester Precursor', benchmark: 'Asian Contract Price (CFR Taiwan/China)', pricingBasis: '$/MT (CFR NE Asia / Captive Jamnagar)', spotPriceLabel: '1017.0', rilNode: 'Hazira, Patalganga & Dahej PTA Units', strategicRole: 'World\'s 2nd largest PX capacity; 100% captively integrated into PTA production' },
  { material: 'Purified Terephthalic Acid (PTA)', category: 'Polyester Monomer', benchmark: 'Domestic Western India / CFR China', pricingBasis: '$/MT (Delivered Silvassa & Hazira)', spotPriceLabel: '745.0', rilNode: 'Hazira, Silvassa & Vadodara Polyester Mills', strategicRole: 'Core monomer for polyester filament yarn (POY), staple fibre (PSF) and PET resin' },
  { material: 'Monoethylene Glycol (MEG)', category: 'Polyester Co-Monomer', benchmark: 'CFR China / Jamnagar ROGC', pricingBasis: '$/MT (CFR Nhava Sheva / Captive)', spotPriceLabel: '530.0', rilNode: 'Hazira & Dahej Polymer Synthesis', strategicRole: 'Co-reactant (with PTA) in continuous polymerization for polyester fiber & PET packaging' },
  { material: 'Jamnagar Petcoke & Coal', category: 'Utilities & Energy', benchmark: 'Captive Jamnagar Coker Petcoke & CIF Coal', pricingBasis: '$/MT (Internal Fuel Equivalent)', spotPriceLabel: '112.0', rilNode: 'Jamnagar Gasifiers & Captive Power Co-gen', strategicRole: 'Captive gasification replaces expensive imported LNG with syngas for hydrogen & power' },
  { material: 'Ethylene (CFR)', category: 'Cracker Olefins / Precursor', benchmark: 'Asian Marker (CFR NE Asia/SEA)', pricingBasis: '$/MT (CFR Far East)', spotPriceLabel: '886.0', rilNode: 'Hazira, Dahej & Nagothane Polymer Units', strategicRole: 'Core building block for PE, PVC & MEG; integrated steam cracking optimizes downstream chain margins' },
];

export interface LiveBenchmarkTick {
  benchmark: string;
  basis: string;
  price: string;
  unit: string;
  changePct: number | null;
  indicator: string;
}

export const LIVE_BENCHMARK_TICKER: LiveBenchmarkTick[] = [
  { benchmark: 'Ethylene (CFR)', basis: 'Asian Marker (CFR Far East)', price: '886', unit: '$/t', changePct: 0.024005, indicator: '▲ +2.4%' },
  { benchmark: 'Ethane (FOB)', basis: 'US Mont Belvieu FOB', price: '157', unit: '$/t', changePct: -0.018014, indicator: '▼ -1.8%' },
  { benchmark: 'Naphtha (CFR)', basis: 'Asian Open Spec (CFR Japan)', price: '816', unit: '$/t', changePct: -0.020996, indicator: '▼ -2.1%' },
  { benchmark: 'Brent Crude', basis: 'Dated Brent (North Sea)', price: '97.42', unit: '$/bbl', changePct: 0.012998, indicator: '▲ +1.3%' },
  { benchmark: 'Ethylene - Naphtha Spread', basis: 'Steam Cracker Olefin Margin', price: '70', unit: '$/t', changePct: 0.085784, indicator: '▲ Spread: $70/t' },
  { benchmark: 'Naphtha - Ethane Advantage', basis: 'RIL US Ethane Import Advantage', price: '659', unit: '$/t', changePct: 0.807598, indicator: '▲ Moat: $659/t' },
  { benchmark: 'Cracker Feed Basket Avg', basis: 'Blended Feed Marker (Ethane/Naphtha)', price: '486.5', unit: '$/t', changePct: -0.020516, indicator: '▼ Lower Feed Cost' },
  { benchmark: 'Live Data Stream Status', basis: 'Automated Spot Feeds Connected', price: '4 Active Tickers', unit: 'Real-Time', changePct: null, indicator: '● LIVE SYNCHRONIZED' },
];
export interface FeedstockColumnStats {
  key: string;
  label: string;
  unit: string;
  group: string;
  latest: number;
  previous: number;
  momPct: number;
  ltmAvg: number;
  ltmMin: number;
  ltmMax: number;
  y3Avg: number;
  y3Min: number;
  y3Max: number;
}

export function getColumnStats(key: string): FeedstockColumnStats {
  const col = FEEDSTOCK_COLUMNS.find((c) => c.key === key)!;
  const y3 = FEEDSTOCK_MONTHLY.map((r) => r.values[key]);
  const ltm = y3.slice(-12);
  const latest = y3[y3.length - 1];
  const previous = y3[y3.length - 2];
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  return {
    key,
    label: col.label,
    unit: col.unit,
    group: col.group,
    latest,
    previous,
    momPct: ((latest - previous) / previous) * 100,
    ltmAvg: avg(ltm),
    ltmMin: Math.min(...ltm),
    ltmMax: Math.max(...ltm),
    y3Avg: avg(y3),
    y3Min: Math.min(...y3),
    y3Max: Math.max(...y3),
  };
}

export function getColumnsByGroup(group: string): FeedstockColumnDef[] {
  return FEEDSTOCK_COLUMNS.filter((c) => c.group === group);
}

export function getMonthlyByGroup(group: string, months = 14): { date: string; values: Record<string, number> }[] {
  const keys = getColumnsByGroup(group).map((c) => c.key);
  return FEEDSTOCK_MONTHLY.slice(-months).map((row) => ({
    date: row.date,
    values: Object.fromEntries(keys.map((k) => [k, row.values[k]])),
  }));
}
