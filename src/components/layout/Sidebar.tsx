'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Crown,
  Users,
  Briefcase,
  TrendingUp,
  LineChart,
  SlidersHorizontal,
  DollarSign,
  Cpu,
  Globe2,
  BookOpen,
  FileText,
  Database,
  AlertTriangle,
  CheckSquare,
  Share2,
  Sparkles,
  Settings,
  Activity,
} from 'lucide-react';
import RelianceLogo from '@/components/common/RelianceLogo';

interface NavItem {
  id: string;
  code: string;
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  subItems?: { name: string; href: string }[];
}

const PRIMARY_NAVIGATION: NavItem[] = [
  {
    id: 'simulation',
    code: '01',
    name: 'SCADA Simulation',
    href: '/simulation',
    icon: Activity,
    badge: 'DCS MIMIC',
    subItems: [
      { name: 'Cracker Digital Twin', href: '/simulation' },
      { name: 'Radiant Coils & Furnace', href: '/simulation#furnace' },
      { name: 'Fractionation Train', href: '/simulation#splitters' }
    ]
  },
  {
    id: 'economics',
    code: '02',
    name: 'Cracker Economics',
    href: '/economics',
    icon: DollarSign,
    badge: 'Waterfall',
    subItems: [
      { name: 'Input Import Costs', href: '/economics#inputs' },
      { name: 'Processing & Fuel OPEX', href: '/economics#processing' },
      { name: 'Product Realization', href: '/economics#outputs' },
      { name: 'Net EBITDA Estimation', href: '/economics#profit' }
    ]
  },
  {
    id: 'optimization',
    code: '03',
    name: 'LP Feedstock Optimizer',
    href: '/optimization',
    icon: Cpu,
    badge: '5 Complexes',
    subItems: [
      { name: 'Jamnagar ROGC (1.4 MT)', href: '/optimization#jamnagar' },
      { name: 'Dahej Dual Feed (1.1 MT)', href: '/optimization#dahej' },
      { name: 'Hazira & Nagothane', href: '/optimization#hazira' },
      { name: 'Sub-Day Switch Timeline', href: '/optimization#switching' }
    ]
  },
  {
    id: 'risk-sentinel',
    code: '04',
    name: 'Price Risk Sentinel',
    href: '/risk-sentinel',
    icon: AlertTriangle,
    badge: 'AI Radar',
    subItems: [
      { name: 'Oil Spike Threat', href: '/risk-sentinel#oil' },
      { name: 'US Ethane Disruption', href: '/risk-sentinel#ethane' },
      { name: 'Shipping Surcharges', href: '/risk-sentinel#freight' },
      { name: 'Live Chemical News Wire', href: '/risk-sentinel#news' }
    ]
  },
  {
    id: 'market',
    code: '05',
    name: 'Market Intelligence',
    href: '/market',
    icon: TrendingUp,
    badge: 'Real-time',
    subItems: [
      { name: 'Ethylene Real-Time Price', href: '/market?tab=products&item=ethylene' },
      { name: 'Feedstock Spreads', href: '/market?tab=feedstocks' },
      { name: 'Cracker Value Chain', href: '/market?tab=cracker' }
    ]
  },
  {
    id: 'operations',
    code: '06',
    name: 'Cracker Logistics',
    href: '/operations',
    icon: Briefcase,
    badge: 'VLEC Fleet',
    subItems: [
      { name: 'Feedstock Switching', href: '/operations#switching' },
      { name: 'VLEC Ships & Dahej Pipe', href: '/operations#logistics' }
    ]
  },
  {
    id: 'scenarios',
    code: '07',
    name: 'Dual Simulation',
    href: '/scenarios',
    icon: SlidersHorizontal,
    badge: '10k Runs',
    subItems: [
      { name: 'Interactive Scenarios', href: '/scenarios' },
      { name: '10,000-Run Monte Carlo', href: '/scenarios/monte-carlo' }
    ]
  },
  {
    id: 'forecasts',
    code: '08',
    name: 'Price Forecasts',
    href: '/forecasts',
    icon: LineChart,
    badge: '4 Models'
  },
  {
    id: 'executive',
    code: '09',
    name: 'Executive Briefing',
    href: '/executive',
    icon: Crown,
    badge: '60s'
  },
  {
    id: 'settings',
    code: '10',
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-68 h-[calc(100vh-4rem)] bg-neutral-50 dark:bg-[#0D0D11] border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0 overflow-y-auto select-none transition-colors duration-200">
      {/* Reliance Brand Header */}
      <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#09090B]">
        <div className="flex items-center gap-2.5">
          <RelianceLogo size="xs" variant="badge" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono truncate block">
              Reliance O2C
            </span>
            <span className="text-[10px] text-[#8F7640] dark:text-[#D4BA7B] font-serif italic font-semibold block">
              Growth is Life
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100/50 dark:bg-neutral-900/40">
        <div className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
          <span>Control Modules</span>
          <span className="font-mono text-[#8F7640] dark:text-[#D4BA7B] text-[10px] font-semibold">10 Units</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {PRIMARY_NAVIGATION.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          const IconComponent = item.icon;

          return (
            <div key={item.id} className="space-y-1">
              <Link
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-900 dark:text-white border-l-4 border-[#BFA161] shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 group-hover:text-[#BFA161] transition-colors w-5">
                    {item.code}
                  </span>
                  <IconComponent
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#8F7640] dark:text-[#D4BA7B]'
                        : 'text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-xs font-mono font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-800 dark:text-[#D4BA7B] border border-amber-500/30'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>

              {/* Nested Sub-navigation if active */}
              {isActive && item.subItems && (
                <div className="ml-8 pl-3 border-l-2 border-neutral-300 dark:border-neutral-800 py-1 space-y-1">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-[#D4BA7B] transition-colors py-1 truncate"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#09090B]">
        <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            System Live
          </span>
          <span className="font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Reliance O2C
          </span>
        </div>
      </div>
    </aside>
  );
}
