import React, { createContext, useContext, useMemo, useState } from 'react';
import type { ThemeName } from '../types/models';
import { themes } from '../theme/themes';

type ThemeCtx = {
  themeName: ThemeName;
  theme: typeof themes[ThemeName];
  setThemeName: (name: ThemeName) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('systemDark');

  const value = useMemo(
    () => ({ themeName, theme: themes[themeName], setThemeName }),
    [themeName]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
