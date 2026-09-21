'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { MARKET_COMMODITIES } from '@/data/knowledgeStore';
import { MarketCommodity } from '@/data/types';

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
}

interface MarketSpreads {
  ethyleneEthane: number;
  ethyleneNaphtha: number;
}

interface MarketContextType {
  commodities: MarketCommodity[];
  spreads: MarketSpreads;
  rssHeadlines: RSSItem[];
  lastSyncTime: string;
  isSyncing: boolean;
  refreshPrices: () => Promise<void>;
  getCommodity: (id: string) => MarketCommodity | undefined;
}

const defaultSpreads: MarketSpreads = {
  ethyleneEthane: 729,
  ethyleneNaphtha: 70,
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export function MarketProvider({ children }: { children: React.ReactNode }) {
  const [commodities, setCommodities] = useState<MarketCommodity[]>(MARKET_COMMODITIES);
  const [spreads, setSpreads] = useState<MarketSpreads>(defaultSpreads);
  const [rssHeadlines, setRssHeadlines] = useState<RSSItem[]>([
    {
      title: 'Cracker Feedstock Economics: Ethane advantage widens amidst Brent crude shifts',
      link: 'https://www.indianchemicalnews.com',
      pubDate: new Date().toLocaleDateString(),
    },
    {
      title: 'Indian Petrochemicals: Dahej and Jamnagar ethane infrastructure operational updates',
      link: 'https://www.indianchemicalnews.com',
      pubDate: new Date().toLocaleDateString(),
    },
  ]);
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
      const cachedTime = localStorage.getItem('ril-live-synctime');
      if (cached) setCommodities(JSON.parse(cached));
      if (cachedSpreads) setSpreads(JSON.parse(cachedSpreads));
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
