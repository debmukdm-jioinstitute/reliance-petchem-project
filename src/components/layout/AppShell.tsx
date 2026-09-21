'use client';

import React, { useState, createContext, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, X, Home, ChevronRight, Compass } from 'lucide-react';
import Navbar from './Navbar';
import MarketTickerStrip from './MarketTickerStrip';
import Sidebar from './Sidebar';
import CommandPaletteModal from '../common/CommandPaletteModal';
import AuditTrailModal from '../common/AuditTrailModal';

interface IntelligenceContextType {
  openAuditModal: (auditId?: string) => void;
  openCommandPalette: () => void;
}

const IntelligenceContext = createContext<IntelligenceContextType>({
  openAuditModal: () => {},
  openCommandPalette: () => {},
});

export const useIntelligence = () => useContext(IntelligenceContext);

// Map common pathnames to readable title names
const PATH_TITLES: Record<string, string> = {
  '/simulation': 'SCADA Simulation & Digital Twin',
  '/economics': 'Cracker Value Chain Economics',
  '/optimization': 'LP Feedstock Optimizer',
  '/risk-sentinel': 'Price Risk Sentinel',
  '/market': 'Market Intelligence & Spreads',
  '/operations': 'Cracker Logistics & VLEC Fleet',
  '/scenarios': 'Dual Simulation & Monte Carlo',
  '/forecasts': 'Price Forecasts & TimesFM',
  '/executive': 'Executive Briefing (60s)',
  '/settings': 'System Settings',
  '/ai': 'AI Copilot Studio',
  '/alerts': 'Active System Alerts',
  '/financial': 'Financial Realization',
  '/documents': 'Institutional Knowledge Base',
  '/competitive-intelligence': 'Peer & Competitive Radar',
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [auditId, setAuditId] = useState<string | null>(null);

  const isSubpage = pathname !== '/';
  const pageTitle = PATH_TITLES[pathname] || (pathname ? pathname.replace('/', '').replace(/-/g, ' ').toUpperCase() : 'Module');

  // ESC shortcut to return to home if on subpage and modals are closed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSubpage && !isCmdKOpen && !auditId) {
        router.push('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSubpage, isCmdKOpen, auditId, router]);

  const openAuditModal = (id?: string) => {
    setAuditId(id || 'audit-01');
  };

  const openCommandPalette = () => {
    setIsCmdKOpen(true);
  };

  return (
    <IntelligenceContext.Provider value={{ openAuditModal, openCommandPalette }}>
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors duration-200 font-sans">
        {/* Top Executive Navbar with Theme Toggle */}
        <Navbar onOpenCommandPalette={openCommandPalette} />

        {/* Real-time Ticker Strip */}
        <MarketTickerStrip />

        {/* Main Body with Sidebar + Main Viewport */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#09090B] p-4 lg:p-7 pb-24 transition-colors duration-200">
            {/* SITEWIDE SUBPAGE NAVIGATION & GO-BACK / CLOSE BAR */}
            {isSubpage && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3.5 sm:px-5 rounded-2xl bg-white/90 dark:bg-[#121218]/90 border border-black/[0.06] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-xl animate-fadeIn">
                {/* Left: Breadcrumbs + Back to Home */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-black dark:hover:bg-neutral-100 transition-all shadow-xs group"
                    title="Return to Home Dashboard (Shortcut: ESC)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Home</span>
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    <Link href="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1">
                      <Home className="w-3.5 h-3.5" />
                      <span>Home</span>
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                      {pageTitle}
                    </span>
                  </div>
                </div>

                {/* Right: Explicit X / Close Button */}
                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-white/10 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 border border-neutral-200/80 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition-all group"
                    title="Close module and return to Home (ESC)"
                  >
                    <span>Close</span>
                    <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                    <kbd className="hidden sm:inline-block text-[10px] bg-white dark:bg-neutral-800 text-neutral-500 px-1 py-0.2 rounded border border-neutral-200 dark:border-neutral-700">
                      ESC
                    </kbd>
                  </Link>
                </div>
              </div>
            )}

            {children}

            {/* FLOATING QUICK-RETURN BUTTON (ON SUBPAGES FOR FAST ACCESS) */}
            {isSubpage && (
              <div className="fixed bottom-6 right-6 z-40">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-900/95 dark:bg-white/95 text-white dark:text-neutral-900 shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs font-bold border border-white/20 dark:border-black/20 backdrop-blur-md"
                  title="Return to Home Dashboard"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Home</span>
                  <X className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                </Link>
              </div>
            )}
          </main>
        </div>

        {/* Global Command Palette Modal */}
        <CommandPaletteModal
          isOpen={isCmdKOpen}
          onClose={() => setIsCmdKOpen(false)}
        />

        {/* Audit Inspector Modal */}
        <AuditTrailModal
          auditId={auditId}
          onClose={() => setAuditId(null)}
        />
      </div>
    </IntelligenceContext.Provider>
  );
}
