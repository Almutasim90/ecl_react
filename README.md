# Daleel+ (دليل+)

Premium mobile app built with **React Native (Expo)** and the **New Architecture** enabled. UI/UX focused: gluestack-ui, NativeWind, Moti/Reanimated, Cairo & Inter fonts, dark/light mode, RTL/LTR.

## Tech stack

- **UI:** gluestack-ui (design system)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Animations:** React Native Reanimated, Moti
- **Fonts:** Cairo (Arabic), Inter (English)
- **Effects:** Expo Blur (glassmorphism), Expo Haptics
- **Navigation:** Expo Router (file-based, native stack)

## Features

- **Splash → Auth:** Splash with Moti scale/pulse logo, then redirect to login
- **Auth screen:** Centered login card, floating labels (Email/Password), primary gradient Login button, Sign Up link, “Or continue with” + Google/Apple buttons
- **Liquid glass background:** Blurred shapes; **parallax on phone tilt** (expo-sensors Accelerometer when available), or subtle time-based motion as fallback
- **Dark/Light mode:** Follows system (`userInterfaceStyle: "automatic"`)
- **RTL/LTR:** i18n context (en/ar); switching locale flips layout (RTL requires app reload)
- **Typography scale:** **Cairo** for all Arabic text (labels, buttons, title, divider); **Inter** for English; RTL line-height and alignment
- **Responsiveness:** Flex layout with `useResponsive()`; tablet breakpoint (≥600px) and wide (≥840px) for larger card max-width and padding; content reflows on foldables/tablets
- **Modern touches:** 24px/32px rounded corners, elevation/shadows, high contrast

## Setup

```bash
npm install
# If install fails with peer dependency conflicts (e.g. react/react-dom):
npm install --legacy-peer-deps
```

If Expo reports that a dependency "doesn't seem to be installed", run `npm install --legacy-peer-deps` so all packages (including expo-splash-screen) are installed.

**Required libraries for browser (web) rendering:**  
`react-dom`, `react-native-web`, `react-native-worklets`, `babel-preset-expo` — all are now in `package.json`. If you see "Cannot find module" for any of these, run `npx expo install <package> -- --legacy-peer-deps`.

## Run

**Mobile (Expo Go):**
```bash
npm start
# Then: press a for Android, i for iOS, or scan QR with Expo Go
```

**Browser (see app in Chrome instead of JSON):**
```bash
npm run web
# Or: npx expo start --web --port 8085
# Then open http://localhost:8085 in Chrome
```

**Note:** Node 20+ is recommended. On **Node 18** the app may still run thanks to patches in `node_modules/metro-config` (Windows `file://` URL for config loading; `availableParallelism` and `toReversed` fallbacks). On **Windows**, Metro config loading uses a patched path so the app starts correctly.

### global.css and NativeWind

- **`global.css`** in the project root must contain exactly:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- It is imported in **`app/_layout.js`** (`import '../global.css'`).
- **`metro.config.js`** passes `input: path.resolve(__dirname, 'global.css')` to `withNativeWind()`.
- **`tailwind.config.js`** uses `presets: [require('nativewind/preset')]` and `content` pointing at `./app/**` and `./components/**`.

## Project structure

```
app/
  _layout.js       # Root: fonts, GluestackUIProvider, ThemeProvider, I18nProvider
  index.js         # Splash (Moti logo) → redirect to /(auth)/login
  (auth)/
    _layout.js     # Stack, no header
    login.js       # Login UI (glass background, card, inputs, social)
components/
  LiquidGlassBackground.js   # Blur + tilt parallax (Accelerometer) or time-based fallback
  FloatingInput.js           # Cairo/Inter by locale, floating labels, RTL
  SocialAuthButtons.js       # Google/Apple, Cairo/Inter, haptics
utils/
  useResponsive.js           # Breakpoints, cardMaxWidth, padding for tablets
context/
  ThemeContext.js   # useColorScheme (dark/light)
  I18nContext.js    # locale (en/ar), isRTL, t()
global.css         # Tailwind directives
tailwind.config.js
metro.config.js    # withNativeWind
babel.config.js    # nativewind/babel, expo-router/babel, reanimated/plugin
```

## i18n & RTL

- **Locale:** `useI18n()` → `locale`, `setLocale('en' | 'ar')`, `t(key)`.
- **RTL:** When switching to Arabic, `I18nManager.forceRTL(true)` is called; a full app reload is required for layout to flip (e.g. via `expo-updates` or dev reload).

No backend or database; frontend UI/UX only.
