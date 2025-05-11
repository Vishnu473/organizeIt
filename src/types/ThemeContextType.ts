import type { ReactNode } from "react";

export interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  systemTheme: 'light' | 'dark';
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: ThemeMode;
    storageKey?: string;
  }
  