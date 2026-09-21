'use client';

import React, { createContext, useContext, useEffect } from 'react';

// This dashboard is light-theme only (cream/white). Dark mode has been
// retired: this provider exists only to guarantee the <html> element carries
// the "light" class and never "dark", including for visitors who still have
// an old "dark" preference saved in localStorage from before the switch.

interface ThemeContextType {
  theme: 'light';
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'light' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    try {
      localStorage.removeItem('ril-theme');
    } catch {
      // ignore
    }
  }, []);

  return <ThemeContext.Provider value={{ theme: 'light' }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
