'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Crown,
  Briefcase,
  TrendingUp,
  LineChart,
  SlidersHorizontal,
  DollarSign,
  Cpu,
  AlertTriangle,
  Settings,
  Activity,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Maximize2,
  Minimize2,
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
    id: 'home',
    code: '00',
    name: 'Home Dashboard',
    href: '/',
    icon: LayoutDashboard,
    badge: 'Overview',
  },
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

const DEFAULT_WIDTH = 340; // Default width where every title and badge is completely visible with 0 cuts
const MIN_WIDTH = 220;
const MAX_WIDTH = 580;

export default function Sidebar() {
  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = useState<number>(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLElement>(null);

  // Load saved preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ril-sidebar-width');
      if (saved) {
        const val = parseInt(saved, 10);
        if (!isNaN(val) && val >= MIN_WIDTH && val <= MAX_WIDTH) {
          setSidebarWidth(val);
        }
      }
      const savedCollapsed = localStorage.getItem('ril-sidebar-collapsed');
      if (savedCollapsed === 'true') {
        setIsCollapsed(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Drag-to-resize listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX));
      setSidebarWidth(newWidth);
      if (isCollapsed) setIsCollapsed(false);
      try {
        localStorage.setItem('ril-sidebar-width', newWidth.toString());
      } catch {
        // ignore
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, isCollapsed]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('ril-sidebar-collapsed', next ? 'true' : 'false');
      } catch {
        // ignore
      }
      return next;
    });
  };

  const adjustWidth = (delta: number) => {
    setIsCollapsed(false);
    setSidebarWidth(prev => {
      const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, prev + delta));
      try {
        localStorage.setItem('ril-sidebar-width', next.toString());
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetWidth = () => {
    setIsCollapsed(false);
    setSidebarWidth(DEFAULT_WIDTH);
    try {
      localStorage.setItem('ril-sidebar-width', DEFAULT_WIDTH.toString());
      localStorage.setItem('ril-sidebar-collapsed', 'false');
    } catch {
      // ignore
    }
  };

  const actualWidth = isCollapsed ? 76 : sidebarWidth;

  return (
    <aside
      ref={sidebarRef}
      style={{ width: `${actualWidth}px` }}
      className={`relative h-[calc(100vh-4.5rem)] bg-[#FAF8F5]/95 dark:bg-[#0D0D11] border-r border-black/[0.06] dark:border-neutral-800 flex flex-col shrink-0 select-none transition-[width] ${
        isDragging ? 'transition-none' : 'duration-200'
      }`}
    >
      {/* Top Header: Brand + Collapse/Expand Toggle */}
      <div className="p-3 sm:px-4 border-b border-black/[0.05] dark:border-neutral-800 bg-white/85 dark:bg-[#09090B] backdrop-blur-md flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <RelianceLogo size="xs" variant="badge" />
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono whitespace-nowrap block">
                Reliance O2C
              </span>
              <span className="text-[10px] text-[#8F7640] dark:text-[#D4BA7B] font-serif italic font-semibold whitespace-nowrap block">
                Growth is Life
              </span>
            </div>
          )}
        </div>

        {/* Collapse / Expand Button */}
        <button
          onClick={toggleCollapse}
          type="button"
          className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
          title={isCollapsed ? 'Expand sidebar (enlarge)' : 'Collapse sidebar (shorten)'}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Interactive Controls Sub-header: Width Adjuster & Auto-fit */}
      {!isCollapsed ? (
        <div className="px-3.5 py-1.5 border-b border-black/[0.04] dark:border-neutral-800/80 bg-[#EFECE6]/50 dark:bg-neutral-900/40 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400">
            <span>Modules</span>
            <span className="font-mono text-[#8F7640] dark:text-[#D4BA7B] text-[10px]">11</span>
          </div>

          {/* Width Enlarge / Shorten Quick Buttons */}
          <div className="flex items-center gap-1 text-neutral-500">
            <span className="font-mono text-[10px] text-neutral-400 mr-1 hidden sm:inline" title="Drag right edge to resize">
              {sidebarWidth}px
            </span>
            <button
              onClick={() => adjustWidth(-40)}
              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Shorten sidebar width (-40px)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetWidth}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold hover:bg-black/5 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Auto-fit to default width (340px) - No text cuts"
            >
              Auto
            </button>
            <button
              onClick={() => adjustWidth(40)}
              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Enlarge sidebar width (+40px)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="py-1 border-b border-black/[0.04] dark:border-neutral-800 flex justify-center">
          <button
            onClick={resetWidth}
            className="p-1 rounded hover:bg-black/5 text-neutral-400 hover:text-neutral-700 text-xs"
            title="Expand to full width"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation List - With BOTH vertical and horizontal scrolling so user can scroll left/right */}
      <nav className="flex-1 p-2.5 space-y-1 overflow-y-auto overflow-x-auto scrollbar-thin">
        {PRIMARY_NAVIGATION.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          const IconComponent = item.icon;

          if (isCollapsed) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center justify-center p-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-black/[0.06] shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-white/60'
                }`}
                title={`${item.code} ${item.name} ${item.badge ? `(${item.badge})` : ''}`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-[#8F7640] dark:text-[#D4BA7B]' : ''}`} />
              </Link>
            );
          }

          return (
            <div key={item.id} className="space-y-1">
              <Link
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-black/[0.06] dark:border-white/10 shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-white/70 dark:hover:bg-neutral-900'
                }`}
              >
                {/* Icon + Code + Title (NO TRUNCATE - FULLY VISIBLE) */}
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 group-hover:text-[#BFA161] transition-colors w-5 shrink-0">
                    {item.code}
                  </span>
                  <IconComponent
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-[#8F7640] dark:text-[#D4BA7B]'
                        : 'text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200'
                    }`}
                  />
                  <span className="whitespace-nowrap font-medium text-xs sm:text-sm">
                    {item.name}
                  </span>
                </div>

                {/* Badge (NO CUTS) */}
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-800 dark:text-[#D4BA7B] border border-amber-500/30'
                        : 'bg-[#EFECE6] dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
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
                      className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-[#D4BA7B] transition-colors py-1 whitespace-nowrap"
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
      <div className="p-3 border-t border-black/[0.05] dark:border-neutral-800 bg-white/70 dark:bg-[#09090B]">
        {!isCollapsed ? (
          <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>System Online</span>
            </span>
            <span className="font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              Reliance O2C
            </span>
          </div>
        ) : (
          <div className="flex justify-center" title="System Online">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>

      {/* DRAGGABLE RESIZE DIVIDER (DRAG LEFT / RIGHT TO SHORTEN OR ENLARGE) */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={resetWidth}
        className={`absolute top-0 -right-1 w-3 h-full cursor-col-resize z-30 group flex items-center justify-center select-none ${
          isDragging ? 'bg-[#BFA161]/40' : 'hover:bg-[#BFA161]/30'
        } transition-colors`}
        title="Drag left/right to shorten or enlarge sidebar (Double-click to reset)"
      >
        <div className={`w-[2px] h-10 rounded-full transition-all ${
          isDragging 
            ? 'bg-[#BFA161] h-20' 
            : 'bg-neutral-300 dark:bg-neutral-700 group-hover:bg-[#BFA161] group-hover:h-14'
        }`} />
      </div>

    </aside>
  );
}
