'use client';

import React from 'react';
import Image from 'next/image';

interface RelianceLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showMotto?: boolean;
  className?: string;
  variant?: 'badge' | 'plain';
}

export default function RelianceLogo({
  size = 'md',
  showMotto = false,
  className = '',
  variant = 'badge'
}: RelianceLogoProps) {
  const heightClasses = {
    xs: 'h-7',
    sm: 'h-9',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div 
        className={`relative flex items-center justify-center rounded-xl p-1 transition-all ${
          variant === 'badge'
            ? 'bg-white shadow-xs border border-neutral-200/90 dark:border-neutral-700/80'
            : ''
        }`}
      >
        <img
          src="/images/reliance-logo.png"
          alt="Reliance Industries Limited"
          className={`${heightClasses[size]} w-auto object-contain`}
        />
      </div>
      {showMotto && (
        <div className="flex flex-col">
          <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            Reliance Industries
          </span>
          <span className="text-xs font-serif italic font-bold text-[#8F7640] dark:text-[#D4BA7B]">
            Growth is Life
          </span>
        </div>
      )}
    </div>
  );
}
