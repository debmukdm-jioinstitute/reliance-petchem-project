'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { MARKET_COMMODITIES } from '@/data/knowledgeStore';
import { MarketCommodity, NewsWireItem } from '@/data/types';

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  source?: string;
}

interface MarketSpreads {
  ethyleneEthane: number;
  ethyleneNaphtha: number;
}

interface MarketContextType {
  commodities: MarketCommodity[];
  spreads: MarketSpreads;
  rssHeadlines: RSSItem[];
  newsWire: NewsWireItem[];
  lastSyncTime: string;
  isSyncing: boolean;
  refreshPrices: () => Promise<void>;
  getCommodity: (id: string) => MarketCommodity | undefined;
}

const defaultSpreads: MarketSpreads = {
  ethyleneEthane: 729,
  ethyleneNaphtha: 70,
};

const DEFAULT_NEWS_WIRE: NewsWireItem[] = [
  {
    id: 'news-init-1',
    title: 'Elcogen and Metrosert strike multi-year deal to expand solid oxide technology testing',
    link: 'https://www.indianchemicalnews.com/hydrogen/elcogen-and-metrosert-strike-multi-year-deal-to-expand-solid-oxide-technology-testing-31979',
    source: 'Indian Chemical News',
    pubDate: '22 Sep 2026',
    category: 'PETCHEM',
    impactTag: 'Clean Hydrogen',
    imageUrl: '/images/green-hydrogen-tank.jpg',
  },
  {
    id: 'news-init-2',
    title: "Moeve launches €1 billion first phase of Europe's largest green hydrogen facility",
    link: 'https://www.indianchemicalnews.com/hydrogen/moeve-launches-1-billion-first-phase-of-europes-largest-green-hydrogen-facility-31980',
    source: 'Indian Chemical News',
    pubDate: '22 Sep 2026',
    category: 'ENERGY',
    impactTag: 'Energy Transition',
    imageUrl: '/images/wind-turbine-plant.jpg',
  },
  {
    id: 'news-init-3',
    title: 'OPEC+ signals possible output adjustment amid rising geopolitical tensions',
    link: 'https://oilprice.com',
    source: 'OilPrice Global',
    pubDate: '22 Sep 2026',
    category: 'ENERGY',
    impactTag: 'Crude Shock',
    imageUrl: '/images/oil-pumpjack-sunset.jpg',
  },
  {
    id: 'news-init-4',
    title: 'From Jio to O2C: Why Ambani still sees energy driving Reliance growth',
    link: 'https://www.business-standard.com',
    source: 'Business Standard',
    pubDate: '22 Sep 2026',
    category: 'RELIANCE',
    impactTag: 'RIL O2C Impact',
    imageUrl: '/images/refinery-plant.jpg',
  },
];

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [commodities, setCommodities] = useState<MarketCommodity[]>(MARKET_COMMODITIES);
  const [spreads, setSpreads] = useState<MarketSpreads>(defaultSpreads);
  const [newsWire, setNewsWire] = useState<NewsWireItem[]>(DEFAULT_NEWS_WIRE);
  const [rssHeadlines, setRssHeadlines] = useState<RSSItem[]>(
    DEFAULT_NEWS_WIRE.map(n => ({ title: n.title, link: n.link, pubDate: n.pubDate, source: n.source }))
  );
  const [lastSyncTime, setLastSyncTime] = useState<string>('Live Synced');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchLivePrices = useCallback(async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/prices');
      if (!res.ok) throw new Error('Failed to fetch live prices');
      const data = await res.json();

      if (data.status === 'success' && data.commodities) {
        setCommodities(data.commodities);
        if (data.spreads) setSpreads(data.spreads);
        if (data.newsWire && data.newsWire.length > 0) {
          setNewsWire(data.newsWire);
        }
        if (data.rssHeadlines && data.rssHeadlines.length > 0) {
          setRssHeadlines(data.rssHeadlines);
        }
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSyncTime(`${timeStr} IST`);

        // Cache in localStorage
        try {
          localStorage.setItem('ril-live-commodities', JSON.stringify(data.commodities));
          localStorage.setItem('ril-live-spreads', JSON.stringify(data.spreads));
          if (data.newsWire) {
            localStorage.setItem('ril-live-newswire', JSON.stringify(data.newsWire));
          }
          localStorage.setItem('ril-live-synctime', `${timeStr} IST`);
        } catch (e) {
          // ignore localStorage error
        }
      }
    } catch (err) {
      console.warn('Using existing commodity quotes:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    // Load from cache first for instant render
    try {
      const cached = localStorage.getItem('ril-live-commodities');
      const cachedSpreads = localStorage.getItem('ril-live-spreads');
      const cachedNews = localStorage.getItem('ril-live-newswire');
      const cachedTime = localStorage.getItem('ril-live-synctime');
      if (cached) setCommodities(JSON.parse(cached));
      if (cachedSpreads) setSpreads(JSON.parse(cachedSpreads));
      if (cachedNews) setNewsWire(JSON.parse(cachedNews));
      if (cachedTime) setLastSyncTime(cachedTime);
    } catch (e) {
      // ignore
    }

    // Fetch live
    fetchLivePrices();

    // Auto poll every 60 seconds
    const interval = setInterval(fetchLivePrices, 60000);
    return () => clearInterval(interval);
  }, [fetchLivePrices]);

  const getCommodity = useCallback(
    (id: string) => {
      return commodities.find((c) => c.id === id || c.id === `comm-${id}` || c.symbol.toLowerCase() === id.toLowerCase());
    },
    [commodities]
  );

  return (
    <MarketContext.Provider
      value={{
        commodities,
        spreads,
        rssHeadlines,
        newsWire,
        lastSyncTime,
        isSyncing,
        refreshPrices: fetchLivePrices,
        getCommodity,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const context = useContext(MarketContext);
  if (!context) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
}
