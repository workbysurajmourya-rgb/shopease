import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';

type ThemeMode = 'light' | 'dark';

type Theme = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  rating: string;
  shadow: string;
  card: string;
  statusBar: 'dark-content' | 'light-content';
  tabBar: string;
  skeleton: string;
  skeletonHighlight: string;
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext({
  theme: COLORS.light,
  isDark: false,
  toggleTheme: () => {},
});

const THEME_KEY = '@shopease_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') {
        setMode(saved);
      }
    } catch {}
  };

  const toggleTheme = useCallback(async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    try {
      await AsyncStorage.setItem(THEME_KEY, newMode);
    } catch {}
  }, [mode]);

  const value: ThemeContextType = {
    theme: mode === 'light' ? COLORS.light : COLORS.dark,
    isDark: mode === 'dark',
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
