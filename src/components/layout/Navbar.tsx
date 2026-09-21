'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Sparkles, 
  Bell, 
  ShieldCheck
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import RelianceLogo from '@/components/common/RelianceLogo';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export default function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8 max-w-[1600px] mx-auto">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            {/* Official Reliance Industries Logo */}
            <RelianceLogo size="sm" variant="badge" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-neutral-900 dark:text-white text-base font-mono">
                  RIL Intelligence OS
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-[#D4BA7B] border border-amber-500/30">
                  O2C
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium hidden sm:block font-mono">
                Petrochemicals & Cracker Digital Twin
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Search Command Bar */}
        <div className="flex-1 max-w-lg mx-6 hidden md:block">
          <button
            onClick={onOpenCommandPalette}
            type="button"
            className="w-full h-10 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 text-left flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
              <span className="truncate">
                Search meetings, documents, forecasts, or ask AI...
              </span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-xs bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Tools & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile search */}
          <button
            onClick={onOpenCommandPalette}
            className="p-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* AI Copilot Shortcut */}
          <Link
            href="/ai"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all border ${
              pathname === '/ai'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-[#D4BA7B]'
                : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#BFA161]" />
            <span className="hidden sm:inline">AI Copilot</span>
          </Link>

          {/* Alerts Counter */}
          <Link
            href="/alerts"
            className="relative p-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
            title="System Alerts"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#09090B]" />
          </Link>

          {/* Executive Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-neutral-900 dark:text-white">Leadership</span>
          </div>

          {/* Light / Dark Theme Toggle */}
          <div className="pl-1 border-l border-neutral-200 dark:border-neutral-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
