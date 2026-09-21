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
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface NavItem {
  id: string;
  code: string;
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
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
    badgeColor: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
  },
  {
    id: 'executive',
    code: '02',
    name: 'Executive Intelligence',
    href: '/executive',
    icon: Crown,
    badge: '60s Brief',
    badgeColor: 'bg-[#BFA161]/20 text-[#D4BA7B] border-[#BFA161]/40',
    subItems: [
      { name: 'Executive Brief', href: '/executive#brief' },
      { name: 'Today\'s Signals', href: '/executive#signals' },
      { name: 'Leadership Attention', href: '/executive#attention' }
    ]
  },
  {
    id: 'meetings',
    code: '03',
    name: 'Meetings & MoM',
    href: '/meetings',
    icon: Users,
    badge: '2 Ingested',
    badgeColor: 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40',
    subItems: [
      { name: 'Meeting 1 (06 Jul 2026)', href: '/meetings/meeting-1' },
      { name: 'Meeting 2 (Hanoz Alignment)', href: '/meetings/meeting-2' }
    ]
  },
  {
    id: 'project',
    code: '04',
    name: 'Project Management',
    href: '/project',
    icon: Briefcase,
    subItems: [
      { name: 'Workstreams', href: '/project#workstreams' },
      { name: 'Capex Deployment', href: '/project/capex' },
      { name: 'Milestones & Timeline', href: '/project#timeline' }
    ]
  },
  {
    id: 'market',
    code: '05',
    name: 'Market Intelligence',
    href: '/market',
    icon: TrendingUp,
    badge: 'Bloomberg',
    badgeColor: 'bg-[#BFA161]/20 text-[#D4BA7B] border-[#BFA161]/40',
    subItems: [
      { name: 'Cracker Value Chain', href: '/market?tab=cracker' },
      { name: 'Feedstocks (Ethane/Naphtha)', href: '/market?tab=feedstocks' },
      { name: 'Products (Ethylene/Propylene)', href: '/market?tab=products' },
      { name: 'FX & Energy', href: '/market?tab=energy' }
    ]
  },
  {
    id: 'forecasts',
    code: '06',
    name: 'Forecasting Engine',
    href: '/forecasts',
    icon: LineChart,
    badge: 'TimesFM',
    badgeColor: 'bg-[#818CF8]/20 text-[#A5B4FC] border-[#818CF8]/40',
    subItems: [
      { name: 'Multi-Model Ensemble', href: '/forecasts#ensemble' },
      { name: 'Backtest Validation', href: '/forecasts#backtest' }
    ]
  },
  {
    id: 'scenarios',
    code: '07',
    name: 'Scenario Engine',
    href: '/scenarios',
    icon: SlidersHorizontal,
    badge: 'Waterfall',
    badgeColor: 'bg-[#F59E0B]/20 text-[#FBBF24] border-[#F59E0B]/40',
    subItems: [
      { name: 'Scenario Builder', href: '/scenarios' },
      { name: 'Monte Carlo (10k)', href: '/scenarios/monte-carlo' }
    ]
  },
  {
    id: 'financial',
    code: '08',
    name: 'Financial Model',
    href: '/financial',
    icon: DollarSign,
    badge: 'NPV / IRR',
    badgeColor: 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40',
    subItems: [
      { name: 'DCF Asset Matrix', href: '/financial' },
      { name: 'Assumption Register', href: '/financial#assumptions' }
    ]
  },
  {
    id: 'operations',
    code: '09',
    name: 'Cracker Operations',
    href: '/operations',
    icon: Cpu,
    subItems: [
      { name: 'Switching Dynamics', href: '/operations#switching' },
      { name: 'VLEC Fleet (6+3)', href: '/operations#vlec' }
    ]
  },
  {
    id: 'competitive-intelligence',
    code: '10',
    name: 'Competitive Intel',
    href: '/competitive-intelligence',
    icon: Globe2,
    subItems: [
      { name: 'Global O2C Benchmark', href: '/competitive-intelligence#matrix' },
      { name: 'Global Oversupply', href: '/competitive-intelligence#oversupply' }
    ]
  },
  {
    id: 'ai-research',
    code: '11',
    name: 'AI Research & Literature',
    href: '/ai-research',
    icon: BookOpen,
    subItems: [
      { name: 'ACS Omega Olefin Yields', href: '/ai-research#acs' },
      { name: 'RL Procurement', href: '/ai-research#rl' }
    ]
  },
  {
    id: 'documents',
    code: '12',
    name: 'Document Intelligence',
    href: '/documents',
    icon: FileText,
    badge: '5 Grounded',
    badgeColor: 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/40'
  },
  {
    id: 'data',
    code: '13',
    name: 'Data Layer & Quality',
    href: '/data',
    icon: Database
  },
  {
    id: 'alerts',
    code: '14',
    name: 'Alerts & Market Shocks',
    href: '/alerts',
    icon: AlertTriangle,
    badge: '3 Active',
    badgeColor: 'bg-[#F43F5E]/20 text-[#FB7185] border-[#F43F5E]/40'
  },
  {
    id: 'actions',
    code: '15',
    name: 'Action Center',
    href: '/actions',
    icon: CheckSquare
  },
  {
    id: 'knowledge-graph',
    code: '16',
    name: 'Knowledge Graph',
    href: '/knowledge-graph',
    icon: Share2,
    badge: 'Palantir',
    badgeColor: 'bg-[#BFA161]/20 text-[#D4BA7B] border-[#BFA161]/40'
  },
  {
    id: 'ai',
    code: '17',
    name: 'AI Copilot & Agents',
    href: '/ai',
    icon: Sparkles,
    badge: '8 Agents',
    badgeColor: 'bg-[#BFA161]/20 text-[#D4BA7B] border-[#BFA161]/40'
  },
  {
    id: 'settings',
    code: '18',
    name: 'Settings & Models',
    href: '/settings',
    icon: Settings
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-[calc(100vh-3.5rem)] bg-[#0A0E17] border-r border-[#1A2232] flex flex-col shrink-0 overflow-y-auto select-none">
      <div className="p-3 border-b border-[#1A2232] bg-[#080B10]/50">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-[#64748B] flex items-center justify-between">
          <span>Navigation Architecture</span>
          <span className="font-mono text-[#BFA161]">18 Modules</span>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {PRIMARY_NAVIGATION.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          const IconComponent = item.icon;

          return (
            <div key={item.id} className="space-y-0.5">
              <Link
                href={item.href}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#151D2C] text-[#F8FAFC] border-l-2 border-[#BFA161] shadow-sm'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#101622]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-[10px] text-[#64748B] group-hover:text-[#BFA161] transition-colors w-4">
                    {item.code}
                  </span>
                  <IconComponent
                    className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#BFA161]'
                        : 'text-[#64748B] group-hover:text-[#94A3B8]'
                    }`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${
                      item.badgeColor || 'bg-[#161F30] text-[#94A3B8] border-[#242F44]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>

              {/* Nested Sub-navigation if route is active */}
              {isActive && item.subItems && (
                <div className="ml-7 pl-2.5 border-l border-[#1E2738] py-1 space-y-0.5">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      className="block text-[11px] text-[#64748B] hover:text-[#D4BA7B] transition-colors py-0.5 truncate"
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
      <div className="p-3 border-t border-[#1A2232] bg-[#080B10]/80">
        <div className="flex items-center justify-between text-[10px] text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Models Synced
          </span>
          <span className="font-mono text-[#94A3B8]">BGE-M3 + TimesFM</span>
        </div>
      </div>
    </aside>
  );
}
