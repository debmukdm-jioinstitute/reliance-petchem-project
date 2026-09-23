'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Globe2,
  BarChart2,
  Ship,
  TrendingUp,
  Settings,
  Menu,
  X,
  Zap,
  Brain,
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    id: 'risk-radar',
    name: 'Risk Radar',
    href: '/risk-sentinel',
    icon: Globe2,
  },
  {
    id: 'price-monitor',
    name: 'Price Monitor',
    href: '/market',
    icon: BarChart2,
  },
  {
    id: 'feedstock-tracker',
    name: 'Feedstock Tracker',
    href: '/feedstock-tracker',
    icon: Database,
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain',
    href: '/operations',
    icon: Ship,
  },
  {
    id: 'scenario-analysis',
    name: 'Monte Carlo & Scenarios',
    href: '/scenarios',
    icon: TrendingUp,
    badge: '10K',
  },
  {
    id: 'ai-copilot',
    name: 'AI Copilot',
    href: '/ai',
    icon: Brain,
    badge: 'AI',
  },
  {
    id: 'settings',
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const renderNavLinks = () => (
    <nav className="space-y-1.5">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/dashboard'
            ? pathname === '/dashboard' || pathname === '/'
            : pathname === item.href || pathname.startsWith(item.href + '/');

        const IconComponent = item.icon;

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`group flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm transition-all duration-200 ${
              isActive
                ? 'bg-[#EFE9DD] dark:bg-[#2A2620] text-[#3B2F21] dark:text-[#EAE0D0] font-bold shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/80 dark:hover:bg-neutral-800/70 font-medium'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <IconComponent
                className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive
                    ? 'text-[#3B2F21] dark:text-[#EAE0D0]'
                    : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </div>
            {item.badge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 ${
                isActive
                  ? 'bg-amber-600/20 text-amber-800 dark:text-amber-300'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
              }`}>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Top Header Navigation Bar (Shown on < md screen) */}
      <div className="w-full md:hidden flex items-center justify-between p-3.5 bg-white/90 dark:bg-[#121217]/90 backdrop-blur-xl rounded-2xl border border-black/[0.05] dark:border-white/10 shadow-xs mb-3 sticky top-2 z-40">
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/images/reliance-logo.png"
            alt="Reliance Industries"
            className="h-8 w-auto object-contain"
          />
          <div>
            <span className="font-serif text-base font-bold text-neutral-900 dark:text-white leading-none block">
              Reliance
            </span>
            <span className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
              Intelligence
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/20"
          >
            <Zap className="w-3 h-3" />
            <span>Dashboard</span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-between bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white dark:bg-[#121217] p-5 shadow-2xl flex flex-col justify-between border-r border-black/10 dark:border-white/10 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                  <img
                    src="/images/reliance-logo.png"
                    alt="Reliance Industries"
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <span className="font-serif text-lg font-bold text-neutral-900 dark:text-white leading-tight block">
                      Reliance
                    </span>
                    <span className="text-[10px] tracking-wider text-emerald-600 dark:text-emerald-400 font-bold uppercase block">
                      Petchem Analytics
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Drawer Navigation Links */}
              {renderNavLinks()}
            </div>

            {/* Mobile Footer Card */}
            <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
              <Link
                href="/scenarios/monte-carlo"
                onClick={() => setMobileOpen(false)}
                className="block p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Monte Carlo Engine</span>
                  <ChevronRight className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Run 10,000 statistical iterations across feedstock parameters.
                </p>
              </Link>
            </div>
          </div>
          
          {/* Backdrop Click area */}
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Desktop Sticky Sidebar (Shown on md: flex screens and above) */}
      <aside className="hidden md:flex w-56 lg:w-60 shrink-0 select-none flex-col justify-between p-3.5 bg-white dark:bg-[#121217] rounded-3xl border border-black/[0.05] dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] h-fit min-h-[calc(100vh-2rem)] sticky top-4 transition-all duration-300">
        {/* Top Section: Brand Identity */}
        <div>
          <Link href="/" className="flex flex-col items-center text-center group pt-2 pb-5 border-b border-neutral-100 dark:border-neutral-800/80">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1 group-hover:scale-105 transition-transform duration-300">
              <img
                src="/images/reliance-logo.png"
                alt="Reliance Industries Limited"
                className="h-12 w-auto object-contain"
              />
            </div>
            <span className="font-serif text-[21px] font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
              Reliance
            </span>
            <span className="text-[10px] tracking-wider text-emerald-600 dark:text-emerald-400 font-sans uppercase font-bold mt-0.5">
              Industries Limited
            </span>
          </Link>

          {/* Navigation List */}
          <div className="mt-4">
            {renderNavLinks()}
          </div>
        </div>

        {/* Bottom Refinery Tagline Card */}
        <div className="pt-4 mt-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xs border border-black/[0.04] dark:border-white/10 aspect-[4/3] group bg-neutral-100 dark:bg-neutral-800">
            <img
              src="/images/refinery-plant.jpg"
              alt="Petrochemical Cracker & Refinery Complex"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-3">
              <p className="text-white text-xs font-semibold leading-tight drop-shadow-sm">
                Energy<br />
                <span className="text-[11px] font-normal text-neutral-200">
                  for a stronger tomorrow
                </span>
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

