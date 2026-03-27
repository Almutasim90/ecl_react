import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const ThemeContext = createContext({ colorScheme: 'light', isDark: false });

/**
 * Core Brand Identity: Indigo Premium
 * We are moving to a unified color scheme to ensure a strong, identical identity.
 * Primary Accent: Indigo (#6366f1)
 */

export const darkColors = {
  background: '#141416',
  surface: '#1e1e24',
  surfaceAlt: '#25252d',

  text: '#f1f5f9',
  textSecondary: '#8b95a8',

  border: '#30303c',

  // Unified Brand Primary — lighter indigo so it pops on dark bg
  accent: '#818cf8',
  accentDark: '#6366f1',
  accentSoft: 'rgba(129,140,248,0.16)',
  accentIcon: 'rgba(129,140,248,0.22)',

  // Indigo variations — stepped lighter for dark readability
  listeningAccent: '#a5b4fc',
  readingAccent: '#818cf8',
  grammarAccent: '#6366f1',

  success: '#14b8a6',
  successSoft: 'rgba(20,184,166,0.14)',
  error: '#f87171',
  errorSoft: 'rgba(248,113,113,0.13)',
  warning: '#fbbf24',

  // Unified Gradients
  gradientHero: ['#4f46e5', '#6366f1', '#818cf8'],
  gradientListening: ['#4f46e5', '#6366f1', '#818cf8'],
  gradientReading: ['#4f46e5', '#6366f1', '#818cf8'],
  gradientGrammar: ['#4f46e5', '#6366f1', '#818cf8'],
};

export const lightColors = {
  background: '#f1f5f9',
  surface: '#ffffff',
  surfaceAlt: '#f8fafc',

  text: '#0f172a',
  textSecondary: '#475569',

  border: '#e2e8f0',

  // Unified Brand Primary
  accent: '#4f46e5',
  accentDark: '#3730a3',
  accentSoft: 'rgba(79,70,229,0.08)',
  accentIcon: 'rgba(79,70,229,0.12)',

  listeningAccent: '#4f46e5',
  readingAccent: '#4f46e5',
  grammarAccent: '#4f46e5',

  success: '#047857',
  successSoft: 'rgba(4,120,87,0.12)',
  error: '#dc2626',
  errorSoft: 'rgba(220,38,38,0.08)',
  warning: '#d97706',

  gradientHero: ['#4338ca', '#4f46e5', '#6366f1'],
  gradientListening: ['#4338ca', '#4f46e5', '#6366f1'],
  gradientReading: ['#4338ca', '#4f46e5', '#6366f1'],
  gradientGrammar: ['#4338ca', '#4f46e5', '#6366f1'],
};

export function ThemeProvider({ children }) {
  const systemScheme = useRNColorScheme();
  const [themeMode, setThemeMode] = useState('light');

  const colorScheme = themeMode === 'system' ? (systemScheme || 'light') : themeMode;
  const isDark = colorScheme === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const setTheme = useCallback((mode) => setThemeMode(mode), []);
  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeContext.Provider value={{ colorScheme, isDark, colors, themeMode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
