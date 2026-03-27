// @/theme/useTheme.ts
// Usage: const { colors, isDark } = useTheme();

import { useColorScheme } from 'react-native';
import { colors as colorTokens, type ColorTokens } from './tokens';

export function useTheme(): { colors: ColorTokens; isDark: boolean } {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return {
    colors: isDark ? colorTokens.dark : colorTokens.light,
    isDark,
  };
}
