'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import CardSpotlight from './CardSpotlight';

interface ObsidianMetricBoxProps {
  title: string;
  value: string;
  subtitle?: string;
  badgeText?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  href?: string;
  unit?: string;
  highlight?: boolean;
}

export default function ObsidianMetricBox({
  title,
  value,
  subtitle,
  badgeText,
  trend,
  trendValue,
  href,
  unit,
  highlight = false,
}: ObsidianMetricBoxProps) {
  const content = (
    <CardSpotlight
      className={`p-6 transition-all duration-200 ${
        highlight
          ? 'border-[#BFA161]/50 dark:border-[#BFA161]/40 bg-amber-500/5 dark:bg-[#BFA161]/5'
          : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        {/* Metric Title - clean & visible */}
        <span className="text-sm font-semibold tracking-wide uppercase text-neutral-700 dark:text-neutral-300">
          {title}
        </span>

        {/* Optional Badge */}
        {badgeText && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            {badgeText}
          </span>
        )}
      </div>

      {/* Main Big Number - Increased font size & bold high visibility */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-neutral-900 dark:text-neutral-50">
          {value}
        </span>
        {unit && (
          <span className="text-sm sm:text-base font-semibold text-neutral-600 dark:text-neutral-400">
            {unit}
          </span>
        )}
      </div>

      {/* Trend and Subtitle */}
      <div className="flex items-center justify-between text-sm pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
        {subtitle && (
          <span className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-1">
            {subtitle}
          </span>
        )}

        {trendValue && (
          <div
            className={`flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded ${
              trend === 'up'
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50'
                : trend === 'down'
                ? 'text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/50'
                : 'text-neutral-700 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800'
            }`}
          >
            {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
            {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </CardSpotlight>
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
