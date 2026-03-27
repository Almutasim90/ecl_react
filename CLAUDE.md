p# ECL Mobile App — Claude Code Design Rules

You are a Senior React Native / Expo developer working on **ECL**, an English learning app.
Always follow every rule in this file. No exceptions.

---

## 1. Stack & Imports

- **Framework**: React Native + Expo (Expo Router v6)
- **Fonts**: `@expo-google-fonts/poppins` — always loaded via `useFonts`
- **Theme**: Always import from `@/theme/tokens` — never hardcode colors, font sizes, or spacing
- **Icons**: Use `@expo/vector-icons` (Ionicons preferred)
- **Gradients**: Use `expo-linear-gradient` — never simulate gradients with backgrounds

---

## 2. Theme Usage

- Call `useTheme()` (or `useColorScheme`) at the top of every component to get `colors`
- Always use `colors.<token>` — never raw hex values in component files
- Dark and Light modes must both be tested mentally before writing any style

---

## 3. Typography Rules

Import font constants from `@/theme/tokens`:

| Constant              | Weight    | Size range usage         |
|-----------------------|-----------|--------------------------|
| `font.regular`        | 400       | Body, placeholders       |
| `font.semiBold`       | 600       | Subtitles, pill labels   |
| `font.bold`           | 700       | Section labels, eyebrows |
| `font.extraBold`      | 800       | Headings, card titles, buttons |

**Font size must come from `fontSize.*` tokens — never a raw number.**

---

## 4. Spacing Rules

All spacing must use `spacing.*` tokens from `@/theme/tokens`:

- `spacing.xs` = 4
- `spacing.sm` = 8
- `spacing.md` = 16
- `spacing.lg` = 24
- `spacing.xl` = 32
- `spacing.xxl` = 48

Screen horizontal padding: always `spacing.screenH` (20px).
Bottom scroll clearance: always `spacing.tabBarClear` (110px).

---

## 5. Border Radius

Use `radius.*` tokens:

- `radius.sm` = 14
- `radius.md` = 20
- `radius.lg` = 28
- `radius.xl` = 32

---

## 6. Touch Targets

Every tappable element must be **at least 44×44px**.
Use `minHeight: 44, minWidth: 44` + `justifyContent: 'center', alignItems: 'center'`.

---

## 7. Component Patterns

### Cards
- Background: `colors.surface`
- Border: `1px solid colors.border`
- Shadow (light): `{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }`
- Shadow (dark): none (use border only)

### Buttons (Primary)
- Background: `colors.accent` gradient via LinearGradient
- Text: white, `font.extraBold`, `fontSize.button` (18px)
- Border radius: `radius.md`
- Min height: 52px

### QuizOption States
| State    | Border         | Background           |
|----------|----------------|----------------------|
| Default  | colors.border  | colors.surface       |
| Selected | colors.accent  | colors.accentSoft    |
| Correct  | colors.success | colors.successSoft   |
| Wrong    | colors.error   | colors.errorSoft     |

### Category Chips (static colors — do NOT theme these)
- Listening: `#7c3aed`
- Reading: `#0891b2`
- Grammar: `#059669`
- Guide: `#d97706`
- Quest: `#dc2626`

---

## 8. Gradients

Never use solid colors where a gradient is specified. Use `expo-linear-gradient`.

| Location       | Light                              | Dark                               |
|----------------|------------------------------------|------------------------------------|
| Home hero      | `['#4338ca','#5b21b6','#7c3aed']`  | `['#1a0840','#2e1065','#1e1b4b']`  |
| Profile hero   | `['#4338ca','#5b21b6','#7c3aed']`  | `['#1a0840','#2e1065','#1e1b4b']`  |
| Avatar button  | `['#5b21b6','#7c3aed']`            | same                               |
| Profile avatar | `['#f97316','#fb923c']`            | same                               |
| Guide activity | `['#4f46e5','#7c3aed','#a855f7']`  | same                               |
| Quest activity | `['#0f766e','#0d9488','#2dd4bf']`  | same                               |

---

## 9. Code Style

- 2-space indentation
- Functional components only, no class components
- `StyleSheet.create()` at the bottom of every file
- Name styles descriptively: `container`, `heroCard`, `optionSelected` — not `view1`, `box`
- Split large screens into sub-components if over ~150 lines

---

## 10. Dark / Light Mode Checklist

Before finishing any screen, verify:
- [ ] All text is readable in both modes
- [ ] No hardcoded `#fff` or `#000` — use `colors.text` / `colors.background`
- [ ] Shadows are suppressed in dark mode
- [ ] Gradient variants are correctly switched

---

> This file is the single source of truth for ECL's UI. If in doubt, check `@/theme/tokens.ts` first.
