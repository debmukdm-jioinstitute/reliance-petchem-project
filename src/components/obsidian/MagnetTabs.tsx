'use client';

import React from 'react';

interface TabItem {
  id: string;
  label: string;
  count?: number | string;
}

interface MagnetTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function MagnetTabs({
  tabs,
  activeTab,
  onChange,
  className = '',
}: MagnetTabsProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            type="button"
            className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 select-none ${
              isActive
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm border border-neutral-200/80 dark:border-neutral-700'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-mono font-medium ${
                  isActive
                    ? 'bg-[#BFA161]/20 text-[#8F7640] dark:text-[#D4BA7B]'
                    : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
