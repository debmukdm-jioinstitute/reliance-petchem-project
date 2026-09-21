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
} from 'lucide-react';

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
    id: 'overview',
    code: '01',
    name: 'Overview',
    href: '/',
    icon: LayoutDashboard,
    badge: 'LIVE',
  },
  {
    id: 'executive',
    code: '02',
    name: 'Executive Briefing',
    href: '/executive',
    icon: Crown,
    badge: '60s',
    subItems: [
      { name: 'Executive Summary', href: '/executive#brief' },
      { name: 'Today\'s Signals', href: '/executive#signals' },
      { name: 'Leadership Priority', href: '/executive#attention' }
    ]
  },
  {
    id: 'meetings',
    code: '03',
    name: 'Meeting Minutes',
    href: '/meetings',
    icon: Users,
    badge: '2 Notes',
    subItems: [
      { name: 'Rajesh Rawal (Meeting 1)', href: '/meetings/meeting-1' },
      { name: 'Hanoz & Adepu (Meeting 2)', href: '/meetings/meeting-2' }
    ]
  },
  {
    id: 'project',
    code: '04',
    name: 'Project Roadmap',
    href: '/project',
    icon: Briefcase,
    subItems: [
      { name: '5 Core Workstreams', href: '/project#workstreams' },
      { name: 'Dahej Expansion Capex', href: '/project/capex' },
      { name: 'Key Milestones', href: '/project#timeline' }
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
      { name: 'Cracker Value Chain', href: '/market?tab=cracker' },
      { name: 'Ethane & Naphtha Spreads', href: '/market?tab=feedstocks' },
      { name: 'Ethylene & Propylene Prices', href: '/market?tab=products' },
    ]
  },
  {
    id: 'forecasts',
    code: '06',
    name: 'Price Forecasts',
    href: '/forecasts',
    icon: LineChart,
    badge: '4 Models',
    subItems: [
      { name: 'Feedstock Price Paths', href: '/forecasts?asset=ethane' },
      { name: 'Model Accuracy (MAE/MAPE)', href: '/forecasts?tab=accuracy' }
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
      { name: '10,000-Run Monte Carlo', href: '/scenarios/monte-carlo' },
    ]
  },
  {
    id: 'financial',
    code: '08',
    name: 'Financial Model',
    href: '/financial',
    icon: DollarSign,
    subItems: [
      { name: 'RIL Asset DCF Valuation', href: '/financial#valuation' },
      { name: 'Dahej Expansion ROI', href: '/financial#expansion' }
    ]
  },
  {
    id: 'operations',
    code: '09',
    name: 'Cracker Operations',
    href: '/operations',
    icon: Cpu,
    badge: 'Flexible',
    subItems: [
      { name: 'Feedstock Switching', href: '/operations#switching' },
      { name: 'VLEC Ships & Dahej Pipe', href: '/operations#logistics' }
    ]
  },
  {
    id: 'competitive-intelligence',
    code: '10',
    name: 'Competitor Benchmark',
    href: '/competitive-intelligence',
    icon: Globe2,
    subItems: [
      { name: 'Global Cracker Peers', href: '/competitive-intelligence#matrix' },
      { name: 'Global Oversupply Risk', href: '/competitive-intelligence#oversupply' }
    ]
  },
  {
    id: 'ai-research',
    code: '11',
    name: 'Industry Research',
    href: '/ai-research',
    icon: BookOpen,
  },
  {
    id: 'documents',
    code: '12',
    name: 'Source Documents',
    href: '/documents',
    icon: FileText,
  },
  {
    id: 'data',
    code: '13',
    name: 'Data Center',
    href: '/data',
    icon: Database,
  },
  {
    id: 'alerts',
    code: '14',
    name: 'Alerts & Shocks',
    href: '/alerts',
    icon: AlertTriangle,
  },
  {
    id: 'actions',
    code: '15',
    name: 'Action Items',
    href: '/actions',
    icon: CheckSquare
  },
  {
    id: 'knowledge-graph',
    code: '16',
    name: 'Knowledge Graph',
    href: '/knowledge-graph',
    icon: Share2,
  },
  {
    id: 'ai',
    code: '17',
    name: 'AI Copilot',
    href: '/ai',
    icon: Sparkles,
  },
  {
    id: 'settings',
    code: '18',
    name: 'Settings',
    href: '/settings',
    icon: Settings
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-68 h-[calc(100vh-4rem)] bg-neutral-50 dark:bg-[#0D0D11] border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0 overflow-y-auto select-none transition-colors duration-200">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-[#09090B]/50">
        <div className="text-xs uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
          <span>Modules</span>
          <span className="font-mono text-[#8F7640] dark:text-[#D4BA7B] text-xs font-semibold">18 Sections</span>
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
