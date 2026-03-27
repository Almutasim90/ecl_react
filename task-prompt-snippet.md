# ECL Per-Task Prompt Snippet
# Paste this at the START of any Claude Code task prompt.
# Keep it short — CLAUDE.md handles the full rules.

---

**ECL Design System is active.**
- All colors → `colors.<token>` from `useTheme()`
- All spacing → `spacing.*` from `@/theme/tokens`
- All font sizes → `fontSize.*` from `@/theme/tokens`
- All font families → `font.*` from `@/theme/tokens`
- Gradients → `gradients.*` via `expo-linear-gradient`
- Touch targets → minimum 44×44px on all interactive elements
- Dark mode → verify styles work for BOTH light and dark before finishing
- No hardcoded hex, no raw numbers for spacing or font size

See `CLAUDE.md` for full rules and component patterns.
