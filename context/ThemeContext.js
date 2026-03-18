import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const ThemeContext = createContext({ colorScheme: 'light', isDark: false });

// ── Dark theme — deep purple-black, warm violet tones ───────────
export const darkColors = {
  // Backgrounds
  background:      '#0e0b18',  // Deep purple-black (not cold blue)
  surface:         '#1a1630',  // Card surface
  surfaceAlt:      '#231e3c',  // Elevated panels / modals

  // Text
  text:            '#f0ecff',  // Warm violet-tinted white
  textSecondary:   '#9b8ec4',  // Muted lavender (warm, not cold slate)

  // Borders
  border:          '#2c2554',  // Dark violet border

  // Accent (lighter violet for dark-bg contrast)
  accent:          '#a78bfa',  // Violet 400
  accentDark:      '#8b5cf6',  // Violet 500
  accentSoft:      'rgba(167,139,250,0.15)',
  accentIcon:      'rgba(167,139,250,0.18)',

  // Status
  success:         '#10b981',
  successSoft:     'rgba(16,185,129,0.15)',
  error:           '#f87171',
  errorSoft:       'rgba(248,113,113,0.15)',
  warning:         '#fbbf24',

  // Gradient presets
  gradientHero:      ['#3b1f7a', '#5b21b6'],
  gradientListening: ['#2e1065', '#4c1d95'],
  gradientReading:   ['#1e1b4b', '#3730a3'],
  gradientProfile:   ['#2d1b6e', '#4c1d95', '#7c3aed'],
};

// ── Light theme — soft violet wash, clean & bright ──────────────
export const lightColors = {
  // Backgrounds
  background:      '#f6f4ff',  // Soft violet-wash (brand cohesion)
  surface:         '#ffffff',  // Clean white cards
  surfaceAlt:      '#ede9fe',  // Violet 100, subtle areas

  // Text
  text:            '#1e1042',  // Deep violet-black (branded, not pure #000)
  textSecondary:   '#6b5f8a',  // Warm muted purple-gray

  // Borders
  border:          '#ddd6fe',  // Violet 200 (clearly branded)

  // Accent
  accent:          '#7c3aed',  // Violet 600 — brand color
  accentDark:      '#6d28d9',  // Violet 700
  accentSoft:      'rgba(124,58,237,0.10)',
  accentIcon:      'rgba(124,58,237,0.12)',

  // Status
  success:         '#059669',
  successSoft:     'rgba(5,150,105,0.10)',
  error:           '#dc2626',
  errorSoft:       'rgba(220,38,38,0.10)',
  warning:         '#d97706',

  // Gradient presets
  gradientHero:      ['#6d28d9', '#7c3aed'],
  gradientListening: ['#6d28d9', '#7c3aed'],
  gradientReading:   ['#4338ca', '#4f46e5'],
  gradientProfile:   ['#6d28d9', '#7c3aed', '#a78bfa'],
};

export function ThemeProvider({ children }) {
  const systemScheme = useRNColorScheme();
  const [themeMode, setThemeMode] = useState('light'); // 'light' | 'dark' | 'system'

  const getActualTheme = () => {
    if (themeMode === 'system') return systemScheme || 'light';
    return themeMode;
  };

  const colorScheme = getActualTheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const setTheme = useCallback((mode) => {
    setThemeMode(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      return isDark ? 'light' : 'dark';
    });
  }, [isDark]);

  return (
    <ThemeContext.Provider
      value={{ colorScheme, isDark, colors, themeMode, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
