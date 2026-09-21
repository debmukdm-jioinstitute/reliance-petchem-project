'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ArrowFillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export default function ArrowFillButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ArrowFillButtonProps) {
  const baseStyles =
    'group relative inline-flex items-center justify-between gap-3 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer overflow-hidden select-none focus:outline-none focus:ring-2 focus:ring-[#BFA161]';

  const variants = {
    primary:
      'bg-neutral-900 text-white hover:bg-black dark:bg-[#BFA161] dark:text-neutral-950 dark:hover:bg-[#D4BA7B] shadow-sm',
    secondary:
      'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700',
    outline:
      'bg-transparent text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900/50',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
      <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white/10 dark:bg-black/10 group-hover:translate-x-1 transition-transform duration-200">
        <ArrowRight className="w-3.5 h-3.5" />
      </span>
    </button>
  );
}
