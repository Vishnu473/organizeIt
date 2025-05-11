import { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeContextType, ThemeMode, ThemeProviderProps } from '../types/ThemeContextType';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = 'theme-preference',
}: ThemeProviderProps) => {
  // Get initial theme from localStorage or default to system
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(storageKey);
      return (storedTheme as ThemeMode) || defaultTheme;
    }
    return defaultTheme;
  });

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const resolvedTheme = theme === 'system' ? systemTheme : theme;
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);
    
    localStorage.setItem(storageKey, theme);
  }, [theme, systemTheme, storageKey]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    systemTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};