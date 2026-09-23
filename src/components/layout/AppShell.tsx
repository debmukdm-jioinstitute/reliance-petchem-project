'use client';

import React, { useState, createContext, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
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

const PATH_TITLES: Record<string, string> = {
  '/dashboard': 'Intelligence Dashboard',
  '/simulation': 'Feed-Mix Margin Calculator',
  '/economics': 'Cracker Value Chain Economics',
  '/optimization': 'LP Feedstock Optimizer',
  '/risk-sentinel': 'Energy Price Risk & Shock Sentinel',
  '/feedstock-tracker': 'O2C Feedstock & Petrochemical Tracker',
  '/operations': 'Cracker Logistics & VLEC Fleet',
  '/scenarios': 'Dual Simulation & Monte Carlo',
  '/forecasts': 'Price Forecasts & TimesFM',
  '/settings': 'System Settings',
  '/ai': 'AI Copilot Studio',
  '/alerts': 'Active System Alerts',
  '/financial': 'Financial Realization',
  '/competitive-intelligence': 'Peer & Competitive Radar',
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [auditId, setAuditId] = useState<string | null>(null);

  const isSubpage = pathname !== '/' && pathname !== '/dashboard' && pathname !== '/risk-sentinel';
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
      <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 font-sans p-2 sm:p-4 lg:p-5 flex flex-col transition-colors duration-200 overflow-x-hidden">
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 lg:gap-5 flex-1 w-full max-w-[1720px] mx-auto items-start">
          {/* Left Sidebar (Mobile Top Header + Drawer & Desktop Sticky Sidebar) */}
          <Sidebar />

          {/* Right Main Content Viewport */}
          <main className="flex-1 min-w-0 w-full overflow-hidden">
            {/* Optional Breadcrumb for nested module pages */}
            {isSubpage && (
              <div className="mb-3 sm:mb-4 flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white dark:bg-[#121217] border border-black/[0.05] dark:border-white/10 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-neutral-500 dark:text-neutral-400 min-w-0">
                  <Link href="/dashboard" className="hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1 shrink-0">
                    <Home className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                  <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
                  <span className="font-semibold text-neutral-900 dark:text-white truncate">
                    {pageTitle}
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[11px] sm:text-xs font-semibold transition-all shrink-0 ml-auto"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Dashboard</span>
                </Link>
              </div>
            )}

            {children}
          </main>
        </div>

        {/* Global Modals */}
        <CommandPaletteModal
          isOpen={isCmdKOpen}
          onClose={() => setIsCmdKOpen(false)}
        />
        <AuditTrailModal
          auditId={auditId}
          onClose={() => setAuditId(null)}
        />
      </div>
    </IntelligenceContext.Provider>
  );
}
