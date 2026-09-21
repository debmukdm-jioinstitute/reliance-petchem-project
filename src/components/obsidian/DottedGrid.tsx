'use client';

import React from 'react';

interface DottedGridProps {
  children?: React.ReactNode;
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
}

export default function DottedGrid({
  children,
  className = '',
  dotColor = 'currentColor',
  dotSize = 1.5,
  gap = 24,
}: DottedGridProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background SVG dots */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08] dark:opacity-[0.15] text-neutral-900 dark:text-neutral-100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dotted-grid-pattern"
            width={gap}
            height={gap}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={gap / 2} cy={gap / 2} r={dotSize} fill={dotColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotted-grid-pattern)" />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
