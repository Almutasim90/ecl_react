import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const ThemeContext = createContext({ colorScheme: 'light', isDark: false });

// Dark theme colors
export const darkColors = {
  background: '#0f172a',
  surface: '#1e293b',
  surfaceElevated: 'rgba(30,41,59,0.95)',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  border: '#334155',
  accent: '#3b82f6',
  accentLight: '#60a5fa',
};

// Light theme colors
export const lightColors = {
  background: '#ffffff',
  surface: '#f8fafc',
  surfaceElevated: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  accent: '#2563eb',
  accentLight: '#3b82f6',
};

export function ThemeProvider({ children }) {
  const systemScheme = useRNColorScheme();
  // Default to light theme for better UX
  const [themeMode, setThemeMode] = useState('light'); // 'light', 'dark', 'system'
  
  // Calculate actual theme based on mode
  const getActualTheme = () => {
    if (themeMode === 'system') {
      return systemScheme || 'light';
    }
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
      // If system, switch to opposite of current
      return isDark ? 'light' : 'dark';
    });
  }, [isDark]);

  return (
    <ThemeContext.Provider 
      value={{ 
        colorScheme, 
        isDark, 
        colors,
        themeMode,
        setTheme,
        toggleTheme,
      }}
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
