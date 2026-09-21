'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  ArrowLeft,
  X,
  Globe2
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export default function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const pathname = usePathname();
  const isSubpage = pathname !== '/';

  const navTabs = [
    { label: 'Ask', href: '/', isActive: pathname === '/' || pathname === '/ai' },
    { label: 'Markets', href: '/market', isActive: pathname.startsWith('/market') },
    { label: 'Research', href: '/documents', isActive: pathname.startsWith('/documents') },
    { label: 'Meetings', href: '/meetings', isActive: pathname.startsWith('/meetings') },
    { label: 'Models', href: '/simulation', isActive: pathname === '/simulation' || pathname === '/scenarios' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 dark:bg-[#09090B]/90 backdrop-blur-xl border-b border-black/[0.04] dark:border-white/10 transition-colors duration-200">
      <div className="flex items-center justify-between h-18 px-4 sm:px-6 lg:px-8 max-w-[1680px] mx-auto gap-4">
        
        {/* Left: Brand Identity with Wireframe Globe Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-3 group" title="Return to Home Dashboard">
            {/* Wireframe Globe Icon */}
            <div className="w-10 h-10 rounded-full border border-black/80 dark:border-white/80 flex items-center justify-center relative overflow-hidden bg-white dark:bg-black shadow-xs group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current text-black dark:text-white fill-none stroke-[1.5]">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-neutral-900 dark:text-white text-sm sm:text-base font-sans uppercase">
                  MARKET INTELLIGENCE
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium tracking-tight">
                Global Signals. Smarter Decisions.
              </p>
            </div>
          </Link>

          {/* Sitewide Go Back Button right in header when on a subpage */}
          {isSubpage && (
            <Link
              href="/"
              className="ml-3 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-black dark:hover:bg-neutral-100 transition-all shadow-xs group"
              title="Return to Home Dashboard (ESC)"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Home</span>
              <X className="w-3.5 h-3.5 ml-0.5 opacity-60" />
            </Link>
          )}
        </div>

        {/* Center: Reference Pill-Shaped Navigation Tabs */}
        <nav className="hidden md:flex items-center p-1 rounded-full bg-[#EAE6DF]/60 dark:bg-neutral-900/60 border border-black/[0.04] dark:border-white/10 backdrop-blur-md">
          {navTabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                tab.isActive
                  ? 'bg-[#1E1E22] text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.03]'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        {/* Right: Search Pill & User Avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Input Bar (Matches reference pill style) */}
          <div className="relative hidden sm:block">
            <button
              onClick={onOpenCommandPalette}
              type="button"
              className="h-10 pl-10 pr-4 rounded-full bg-[#EFECE6]/80 dark:bg-neutral-900/80 border border-black/[0.04] dark:border-neutral-800 hover:border-black/15 text-left flex items-center justify-between text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 transition-all w-52 lg:w-64 group shadow-2xs"
            >
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors" />
              <span className="truncate">Search anything...</span>
            </button>
          </div>

          {/* Mobile search icon */}
          <button
            onClick={onOpenCommandPalette}
            className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-neutral-800 sm:hidden"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <div className="pl-1">
            <ThemeToggle />
          </div>

          {/* User Avatar Circle "DM" in warm cognac matching reference image */}
          <div 
            className="w-10 h-10 rounded-full bg-[#A48360] text-white flex items-center justify-center font-bold text-xs shadow-xs border border-white/40 cursor-pointer hover:opacity-95 transition-opacity"
            title="Debabrata (DM) • Executive Account"
          >
            DM
          </div>
        </div>

      </div>
    </header>
  );
}
