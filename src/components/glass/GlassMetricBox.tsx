'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import GlassCard3D from './GlassCard3D';

import PriceInfoIcon from '@/components/common/PriceInfoIcon';

interface GlassMetricBoxProps {
  title: string;
  value: string;
  subtitle?: string;
  badgeText?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  unit?: string;
  href?: string;
  highlight?: boolean;
  commodityId?: string;
  showInfoIcon?: boolean;
}

export default function GlassMetricBox({
  title,
  value,
  subtitle,
  badgeText,
  trend,
  trendValue,
  unit,
  href,
  highlight = false,
  commodityId,
  showInfoIcon = true,
}: GlassMetricBoxProps) {
  const content = (
    <GlassCard3D
      className={`p-6 md:p-7 ${
        highlight
          ? 'border-amber-500/40 dark:border-[#BFA161]/40 bg-amber-500/[0.04] dark:bg-[#BFA161]/[0.08]'
          : ''
      }`}
      glowColor={highlight ? 'rgba(191, 161, 97, 0.35)' : 'rgba(255, 255, 255, 0.2)'}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        {/* Title and small i information icon */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-neutral-600 dark:text-neutral-400 truncate">
            {title}
          </span>
          {showInfoIcon && (
            <PriceInfoIcon
              commodityId={commodityId || title}
              currentPrice={value}
              unit={unit}
              size="xs"
              className="shrink-0"
            />
          )}
        </div>

        {/* Badge */}
        {badgeText && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100/90 dark:bg-white/10 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/15 backdrop-blur-md shadow-xs shrink-0">
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Metric Value - Large 3D bold font */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-white drop-shadow-xs">
          {value}
        </span>
        {unit && (
          <span className="text-base sm:text-lg font-bold text-neutral-500 dark:text-neutral-400">
            {unit}
          </span>
        )}
      </div>

      {/* Footer / Trend */}
      <div className="flex items-center justify-between text-sm pt-3 border-t border-neutral-200/60 dark:border-white/10">
        {subtitle && (
          <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium line-clamp-1">
            {subtitle}
          </span>
        )}

        {trendValue && (
          <div
            className={`flex items-center gap-1 font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md border ${
              trend === 'up'
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                : trend === 'down'
                ? 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/30'
                : 'text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-white/10 border-neutral-200 dark:border-white/15'
            }`}
          >
            {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
            {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </GlassCard3D>
  );

  if (href) {
    return (
      <Link href={href} className="block group">
        {content}
      </Link>
    );
  }

  return content;
}
