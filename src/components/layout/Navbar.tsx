'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Sparkles, 
  Bell, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  Sliders,
  ChevronDown,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export default function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080B10]/95 backdrop-blur-md border-b border-[#1A2232]">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Reliance stylized gold glyph */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4BA7B] to-[#8F7640] p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-[#0E141F] rounded-[7px] flex items-center justify-center">
                <span className="font-bold text-[#D4BA7B] text-sm tracking-tighter">R</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-[#F8FAFC] text-sm uppercase">
                  RIL Intelligence OS
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#BFA161]/15 text-[#D4BA7B] border border-[#BFA161]/30">
                  O2C PROD
                </span>
              </div>
              <p className="text-[10px] text-[#94A3B8] tracking-normal font-light hidden sm:block">
                AI-Powered Market, Project & Scenario Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Google-like Quick Command Bar */}
        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <button
            onClick={onOpenCommandPalette}
            className="w-full h-9 px-3 rounded-lg bg-[#0E141F] border border-[#1E2738] hover:border-[#BFA161]/50 text-left flex items-center justify-between text-xs text-[#64748B] transition-all group shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#BFA161] transition-colors" />
              <span className="truncate group-hover:text-[#94A3B8] transition-colors">
                Search meetings, documents, assets, forecasts, or ask AI...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-[#161F30] text-[#94A3B8] px-1.5 py-0.5 rounded border border-[#242F44]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Tools & Role Context */}
        <div className="flex items-center gap-3">
          {/* Mobile search trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#121824] md:hidden"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* AI Copilot Shortcut */}
          <Link
            href="/ai"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              pathname === '/ai'
                ? 'bg-[#BFA161]/20 border-[#BFA161] text-[#D4BA7B]'
                : 'bg-[#0E141F] border-[#1E2738] text-[#94A3B8] hover:text-white hover:border-[#BFA161]/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#BFA161]" />
            <span className="hidden sm:inline">AI Copilot</span>
          </Link>

          {/* Alerts Counter */}
          <Link
            href="/alerts"
            className="relative p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#121824] transition-colors border border-transparent hover:border-[#1E2738]"
            title="System Alerts & Shocks"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F43F5E] animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F43F5E]" />
          </Link>

          {/* Executive Role Switcher Badge */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-[#1E2738]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121824] border border-[#242F44] text-[11px] text-[#94A3B8]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="font-medium text-[#F8FAFC]">Executive Board</span>
              <span className="text-[#64748B]">•</span>
              <span className="text-[#BFA161]">Jio Inst / RIL</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
