import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const ThemeContext = createContext({ colorScheme: 'light', isDark: false });

// ── Dark theme — Indigo-Premium: deep indigo-tinted darks, vibrant accent ─────
export const darkColors = {
  // Backgrounds — deep indigo-black, not flat zinc
  background: '#0d0d14',
  surface: '#14141f',
  surfaceAlt: '#1c1c2e',

  // Text — warm white with slight indigo cast
  text: '#ededf5',
  textSecondary: '#8a8aa8',

  // Border — indigo-tinted
  border: '#1c1c2e',

  // Accent — Indigo-400, the brand identity color
  accent: '#818cf8',
  accentDark: '#6366f1',
  accentSoft: 'rgba(129,140,248,0.12)',
  accentIcon: 'rgba(129,140,248,0.18)',

  // Semantic category colors
  listeningAccent: '#a78bfa',   // Violet-400
  readingAccent: '#60a5fa',     // Blue-400
  grammarAccent: '#4ade80',     // Green-400

  // Status
  success: '#34d399',
  successSoft: 'rgba(52,211,153,0.12)',
  error: '#f87171',
  errorSoft: 'rgba(248,113,113,0.12)',
  warning: '#fbbf24',

  // Gradient presets — rich, saturated, premium
  gradientHero: ['#1a1040', '#312e81', '#4338ca'],
  gradientListening: ['#2d1b69', '#5b21b6', '#7c3aed'],
  gradientReading: ['#0c2340', '#1e40af', '#2563eb'],
  gradientGrammar: ['#052e16', '#14532d', '#16a34a'],
  gradientProfile: ['#12122a', '#1a1a3e', '#0d0d1a'],
};

// ── Light theme — Lavender bg + white cards for strong visual hierarchy ───────
export const lightColors = {
  // Backgrounds — lavender-tinted page, pure white cards
  background: '#eef0fb',   // Soft indigo-lavender page background
  surface: '#ffffff',      // Pure white cards — strong contrast against bg
  surfaceAlt: '#f0f0fa',   // Slightly tinted for nested elements

  // Text — deep indigo-black, strong contrast
  text: '#0f0f1a',
  textSecondary: '#5a5a80',

  // Border — clear, defined edges
  border: 'rgba(79,70,229,0.14)',

  // Accent — Indigo-600, brand identity
  accent: '#4f46e5',
  accentDark: '#3730a3',
  accentSoft: 'rgba(79,70,229,0.10)',
  accentIcon: 'rgba(79,70,229,0.14)',

  // Semantic category colors
  listeningAccent: '#7c3aed',   // Violet-600
  readingAccent: '#2563eb',     // Blue-600
  grammarAccent: '#16a34a',     // Green-600

  // Status
  success: '#059669',
  successSoft: 'rgba(5,150,105,0.12)',
  error: '#dc2626',
  errorSoft: 'rgba(220,38,38,0.10)',
  warning: '#d97706',

  // Gradient presets
  gradientHero: ['#4338ca', '#6366f1', '#818cf8'],
  gradientListening: ['#5b21b6', '#7c3aed', '#8b5cf6'],
  gradientReading: ['#1d4ed8', '#3b82f6', '#60a5fa'],
  gradientGrammar: ['#15803d', '#22c55e', '#4ade80'],
  gradientProfile: ['#4338ca', '#6366f1', '#818cf8'],
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
