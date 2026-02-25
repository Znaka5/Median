import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeName } from '../types/models';
import { themes } from '../theme/themes';

type ThemeCtx = {
  themeName: ThemeName;
  theme: typeof themes[ThemeName];
  setThemeName: (name: ThemeName) => void;
};

const STORAGE_KEY = 'APP_THEME';

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>('systemDark');

  // Load persisted theme on mount
  useEffect(() => {
    (async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTheme && themes[storedTheme as ThemeName]) {
          setThemeNameState(storedTheme as ThemeName);
        }
      } catch (err) {
        console.warn('Failed to load theme from storage', err);
      }
    })();
  }, []);

  // Setter that persists theme
  const setThemeName = async (name: ThemeName) => {
    try {
      setThemeNameState(name);
      await AsyncStorage.setItem(STORAGE_KEY, name);
    } catch (err) {
      console.warn('Failed to save theme to storage', err);
    }
  };

  const value = useMemo(() => ({ themeName, theme: themes[themeName], setThemeName }), [themeName]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}