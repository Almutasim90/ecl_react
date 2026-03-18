import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { I18nManager, Platform } from 'react-native';

const locales = { en: 'en', ar: 'ar' };
const isRTLByLocale = { en: false, ar: true };

const I18nContext = createContext({
  locale: 'en',
  isRTL: false,
  setLocale: () => {},
  t: (key) => key,
});

const translations = {
  en: {
    // Auth
    login: 'Login',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    name: 'Full Name',
    confirmPassword: 'Confirm Password',
    orContinueWith: 'Or continue with',
    google: 'Google',
    apple: 'Apple',
    
    // Settings
    settings: 'Settings',
    general: 'General',
    account: 'Account',
    support: 'Support',
    profile: 'Profile',
    language: 'Language',
    dark_mode: 'Dark Mode',
    notifications: 'Notifications',
    help_support: 'Help & Support',
    about: 'About',
  },
  ar: {
    // Auth
    login: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    name: 'الاسم الكامل',
    confirmPassword: 'تأكيد كلمة المرور',
    orContinueWith: 'أو تابع باستخدام',
    google: 'جوجل',
    apple: 'آبل',
    
    // Settings
    settings: 'الإعدادات',
    general: 'عام',
    account: 'الحساب',
    support: 'الدعم',
    profile: 'الملف الشخصي',
    language: 'اللغة',
    dark_mode: 'الوضع الداكن',
    notifications: 'الإشعارات',
    help_support: 'المساعدة والدعم',
    about: 'حول',
  },
};

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState('en');
  const isRTL = isRTLByLocale[locale];

  // Apply RTL direction to document for web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
  }, [isRTL, locale]);

  const setLocale = useCallback((newLocale) => {
    if (locales[newLocale]) {
      // For native platforms, force RTL change
      if (Platform.OS !== 'web' && isRTLByLocale[newLocale] !== I18nManager.isRTL) {
        I18nManager.forceRTL(isRTLByLocale[newLocale]);
        I18nManager.allowRTL(isRTLByLocale[newLocale]);
      }
      setLocaleState(newLocale);
      return Platform.OS !== 'web' && isRTLByLocale[newLocale] !== I18nManager.isRTL;
    }
    return false;
  }, []);

  const t = useCallback(
    (key) => translations[locale][key] ?? translations.en[key] ?? key,
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, isRTL, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
