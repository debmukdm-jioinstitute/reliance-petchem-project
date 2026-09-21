'use client';

import React, { useState, createContext, useContext } from 'react';
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

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [auditId, setAuditId] = useState<string | null>(null);

  const openAuditModal = (id?: string) => {
    setAuditId(id || 'audit-01');
  };

  const openCommandPalette = () => {
    setIsCmdKOpen(true);
  };

  return (
    <IntelligenceContext.Provider value={{ openAuditModal, openCommandPalette }}>
      <div className="min-h-screen flex flex-col bg-[#080B10] text-[#F8FAFC]">
        {/* Top Executive Navbar */}
        <Navbar onOpenCommandPalette={openCommandPalette} />

        {/* Real-time Bloomberg-style Ticker Strip */}
        <MarketTickerStrip />

        {/* Main Body with Sidebar + Main Viewport */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main className="flex-1 overflow-y-auto bg-[#080B10] p-4 lg:p-6 pb-20">
            {children}
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
