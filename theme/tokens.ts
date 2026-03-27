// @/theme/tokens.ts
// ECL Design System — Single source of truth
// Import this everywhere. Never hardcode values in components.

// ─── Spacing ─────────────────────────────────────────────────────────────────

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenH: 20,       // horizontal screen padding
  tabBarClear: 110,  // bottom padding to clear tab bar
  quizNavBar: 24,    // quiz nav bar padding
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const radius = {
  sm: 14,
  md: 20,
  lg: 28,
  xl: 32,
  full: 9999,
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const font = {
  regular:   'Poppins_400Regular',
  semiBold:  'Poppins_600SemiBold',
  bold:      'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
} as const;

export const fontSize = {
  scoreHero:    72,  // Score number on results screen
  brandTitle:   32,  // Brand name, score total
  heroHeading:  26,  // Screen main title
  cardTitle:    22,  // Featured card title, section titles
  sectionTitle: 20,  // Quiz header, section titles
  button:       18,  // Button text, stat values
  body:         16,  // Question text, option text, body labels
  label:        15,  // Review question, button labels
  meta:         14,  // Progress %, question number, meta text
  caption:      13,  // Hero subtitle, form card meta, state text
  badge:        12,  // Badge text, pill text, level badge
  eyebrow:      11,  // Eyebrow labels, chip labels
  subLabel:     10,  // Activity sub labels
} as const;

// ─── Colors ───────────────────────────────────────────────────────────────────

const lightColors = {
  background:   '#f1f5f9',
  surface:      '#ffffff',
  surfaceAlt:   '#f8fafc',
  text:         '#0f172a',
  textSecondary:'#475569',
  border:       '#e2e8f0',
  accent:       '#4f46e5',
  accentDark:   '#3730a3',
  accentSoft:   'rgba(79,70,229,0.08)',
  listeningAccent: '#4f46e5',
  readingAccent:   '#4f46e5',
  grammarAccent:   '#4f46e5',
  success:      '#047857',
  successSoft:  'rgba(4,120,87,0.12)',
  error:        '#dc2626',
  errorSoft:    'rgba(220,38,38,0.08)',
  warning:      '#d97706',
} as const;

const darkColors = {
  background:   '#141416',
  surface:      '#1e1e24',
  surfaceAlt:   '#25252d',
  text:         '#f1f5f9',
  textSecondary:'#8b95a8',
  border:       '#30303c',
  accent:       '#818cf8',
  accentDark:   '#6366f1',
  accentSoft:   'rgba(129,140,248,0.16)',
  listeningAccent: '#a5b4fc',
  readingAccent:   '#818cf8',
  grammarAccent:   '#6366f1',
  success:      '#14b8a6',
  successSoft:  'rgba(20,184,166,0.14)',
  error:        '#f87171',
  errorSoft:    'rgba(248,113,113,0.13)',
  warning:      '#fbbf24',
} as const;

export type ColorTokens = typeof lightColors;

export const colors = {
  light: lightColors,
  dark:  darkColors,
} as const;

// ─── Gradients ────────────────────────────────────────────────────────────────

export const gradients = {
  homeHero: {
    light: ['#4338ca', '#5b21b6', '#7c3aed'] as string[],
    dark:  ['#1a0840', '#2e1065', '#1e1b4b'] as string[],
  },
  profileHero: {
    light: ['#4338ca', '#5b21b6', '#7c3aed'] as string[],
    dark:  ['#1a0840', '#2e1065', '#1e1b4b'] as string[],
  },
  avatarButton: ['#5b21b6', '#7c3aed'] as string[],
  profileAvatar: ['#f97316', '#fb923c'] as string[],
  activityGuide: ['#4f46e5', '#7c3aed', '#a855f7'] as string[],
  activityQuest: ['#0f766e', '#0d9488', '#2dd4bf'] as string[],
  featuredCard: {
    light: ['#ffffff', '#f5f3ff'] as string[],
    dark:  ['#1e293b', '#0f172a'] as string[],
  },
  category: {
    light: ['#4338ca', '#4f46e5', '#6366f1'] as string[],
    dark:  ['#4f46e5', '#6366f1', '#818cf8'] as string[],
  },
} as const;

// ─── Category Static Colors (never themed) ───────────────────────────────────

export const categoryColors = {
  Listening: '#7c3aed',
  Reading:   '#0891b2',
  Grammar:   '#059669',
  Guide:     '#d97706',
  Quest:     '#dc2626',
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────

export const shadow = {
  card: {
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 3,
    },
    dark: {
      // No shadow in dark mode — use border only
      shadowColor: 'transparent',
      shadowOpacity: 0,
      elevation: 0,
    },
  },
} as const;
