import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const ThemeContext = createContext({ colorScheme: 'light', isDark: false });

/**
 * Core Brand Identity: Indigo Premium
 * We are moving to a unified color scheme to ensure a strong, identical identity.
 * Primary Accent: Indigo (#6366f1)
 */

export const darkColors = {
  background: '#0a0a0f',
  surface: '#12121f',
  surfaceAlt: '#1a1a2e',

  text: '#f8fafc',
  textSecondary: '#94a3b8',

  border: '#1e1e38',

  // Unified Brand Primary
  accent: '#6366f1',
  accentDark: '#4f46e5',
  accentSoft: 'rgba(99,102,241,0.12)',
  accentIcon: 'rgba(99,102,241,0.2)',

  // Semantic category colors - unified to Indigo variations for identity
  listeningAccent: '#818cf8',
  readingAccent: '#6366f1',
  grammarAccent: '#4f46e5',

  success: '#10b981',
  successSoft: 'rgba(16,185,129,0.12)',
  error: '#ef4444',
  errorSoft: 'rgba(239,68,68,0.12)',
  warning: '#f59e0b',

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

  success: '#059669',
  successSoft: 'rgba(5,150,105,0.08)',
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
