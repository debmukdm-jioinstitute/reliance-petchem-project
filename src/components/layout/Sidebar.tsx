'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Globe2,
  BarChart2,
  Ship,
  TrendingUp,
  ClipboardList,
  Settings
} from 'lucide-react';

interface NavItem {
  id: string;
  name: string;
  href: string;
  icon: React.ElementType;
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
    id: 'supply-chain',
    name: 'Supply Chain',
    href: '/operations',
    icon: Ship,
  },
  {
    id: 'scenario-analysis',
    name: 'Scenario Analysis',
    href: '/scenarios',
    icon: TrendingUp,
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

  return (
    <aside className="w-56 lg:w-60 shrink-0 select-none flex flex-col justify-between p-3.5 bg-white dark:bg-[#121217] rounded-3xl border border-black/[0.05] dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] h-fit min-h-[calc(100vh-2rem)] sticky top-4">
      {/* Top Section: Brand Identity */}
      <div>
        <Link href="/" className="flex flex-col items-center text-center group pt-2 pb-5 border-b border-neutral-100 dark:border-neutral-800/80">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
            <img
              src="/images/reliance-logo.png"
              alt="Reliance Industries Limited"
              className="h-12 w-auto object-contain"
            />
          </div>
          <span className="font-serif text-[21px] font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            Reliance
          </span>
          <span className="text-[10px] tracking-wider text-neutral-500 dark:text-neutral-400 font-sans uppercase font-medium mt-0.5">
            Industries Limited
          </span>
        </Link>

        {/* Navigation List */}
        <nav className="mt-4 space-y-1">
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
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all ${
                  isActive
                    ? 'bg-[#EFE9DD] dark:bg-[#2A2620] text-[#3B2F21] dark:text-[#EAE0D0] font-bold shadow-2xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 font-medium'
                }`}
              >
                <IconComponent
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#3B2F21] dark:text-[#EAE0D0]'
                      : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
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
  );
}
