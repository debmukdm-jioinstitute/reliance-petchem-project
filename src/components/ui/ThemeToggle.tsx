'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-[#BFA161]"
    >
      {/* Sun icon for light mode */}
      <Sun
        className={`w-5 h-5 text-amber-600 transition-all duration-300 transform ${
          isDark
            ? 'scale-0 -rotate-90 opacity-0 absolute'
            : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      {/* Moon icon for dark mode */}
      <Moon
        className={`w-5 h-5 text-neutral-200 group-hover:text-[#D4BA7B] transition-all duration-300 transform ${
          isDark
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 rotate-90 opacity-0 absolute'
        }`}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
