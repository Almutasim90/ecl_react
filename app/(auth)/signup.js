import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { useResponsive } from '../../utils/useResponsive';
import { useAuth } from '../../context/AuthContext';
import LiquidGlassBackground from '../../components/LiquidGlassBackground';
import FloatingInput from '../../components/FloatingInput';
import SocialAuthButtons from '../../components/SocialAuthButtons';

/** Typography: Cairo for Arabic, Inter for English. */
const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
const FONT_BOLD = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };

const ENTER_DELAY = 100;
const ENTER_DURATION = 400;

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const { cardMaxWidth, horizontalPadding, cardPadding } = useResponsive();
  const { signUp, signInWithGoogle, signInWithApple, isLoading } = useAuth();
  const { redirect } = useLocalSearchParams();
  const fontKey = isRTL ? 'ar' : 'en';

  const resolveRedirect = () => {
    const target = typeof redirect === 'string' ? redirect : null;
    if (target && target.startsWith('/')) {
      return target;
    }
    return '/(tabs)';
  };

  const loading = isLoading || localLoading;

  const handleSignup = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(isRTL ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError(isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');
    setLocalLoading(true);

    const result = await signUp(email, password, name);

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      if (result.needsEmailConfirmation) {
        // Navigate to email verification screen
        router.replace({
          pathname: '/(auth)/verify-email',
          params: { email: email, redirect: resolveRedirect() }
        });
      } else {
        // Auto-login successful
        router.replace(resolveRedirect());
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Translate common error messages
      let errorMessage = result.error;
      if (result.error?.includes('already registered')) {
        errorMessage = isRTL ? 'هذا البريد الإلكتروني مسجل بالفعل' : 'This email is already registered';
      } else if (result.error?.includes('Password')) {
        errorMessage = isRTL ? 'كلمة المرور ضعيفة جداً' : 'Password is too weak';
      }
      setError(errorMessage);
    }

    setLocalLoading(false);
  };

  const handleGoogleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');
    setLocalLoading(true);
    
    const result = await signInWithGoogle();
    
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(resolveRedirect());
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (result.error !== 'Authentication cancelled') {
        setError(isRTL ? 'فشل تسجيل الدخول بـ Google' : 'Google sign in failed');
      }
    }
    
    setLocalLoading(false);
  };

  const handleAppleSignIn = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');
    setLocalLoading(true);
    
    const result = await signInWithApple();
    
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(resolveRedirect());
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (result.error !== 'Authentication cancelled') {
        setError(isRTL ? 'فشل تسجيل الدخول بـ Apple' : 'Apple sign in failed');
      }
    }
    
    setLocalLoading(false);
  };

  const cardBg = isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.9)';
  const dividerColor = isDark ? '#475569' : '#cbd5e1';
  const loginColor = isDark ? '#60a5fa' : '#2563eb';
  const signupBtnColors = isDark ? ['#3b82f6', '#2563eb'] : ['#2563eb', '#1d4ed8'];

  return (
    <View style={styles.screen}>
      <LiquidGlassBackground />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.keyboard, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
              type: 'timing',
              duration: ENTER_DURATION,
              delay: ENTER_DELAY,
            }}
            style={[
              styles.card,
              { backgroundColor: cardBg, maxWidth: cardMaxWidth, padding: cardPadding },
            ]}
          >
            <Text
              style={[
                styles.title,
                { color: isDark ? '#f1f5f9' : '#0f172a', fontFamily: FONT_TITLE[fontKey] },
                isRTL && styles.titleRTL,
              ]}
            >
              {t('signUp')}
            </Text>

            <FloatingInput
              labelKey="name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
            <FloatingInput
              labelKey="email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
            />
            <FloatingInput
              labelKey="password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password-new"
            />
            <FloatingInput
              labelKey="confirmPassword"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="password-new"
            />

            {error ? (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 200 }}
              >
                <Text style={[styles.errorText, { color: '#ef4444', fontFamily: FONT_BODY[fontKey] }]}>
                  {error}
                </Text>
              </MotiView>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSignup}
              disabled={loading}
              style={styles.signupBtn}
            >
              <LinearGradient
                colors={signupBtnColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.signupBtnGradient, loading && styles.signupBtnLoading]}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={[styles.signupBtnText, { fontFamily: FONT_BOLD[fontKey] }]}>
                    {t('signUp')}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={[styles.loginRow, isRTL && styles.loginRowRTL]}>
              <Text
                style={[
                  styles.loginHint,
                  { color: isDark ? '#94a3b8' : '#64748b', fontFamily: FONT_BODY[fontKey] },
                  isRTL && styles.textRTL,
                ]}
              >
                {isRTL ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => {
                Haptics.selectionAsync();
                router.push('/(auth)/login');
              }}>
                <Text
                  style={[
                    styles.loginLink,
                    { color: loginColor, fontFamily: FONT_BOLD[fontKey] },
                    isRTL && styles.textRTL,
                  ]}
                >
                  {t('login')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.dividerRow, isRTL && styles.dividerRowRTL]}>
              <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
              <Text
                style={[
                  styles.dividerText,
                  { color: isDark ? '#94a3b8' : '#64748b', fontFamily: FONT_BODY[fontKey] },
                  isRTL && styles.textRTL,
                ]}
              >
                {t('orContinueWith')}
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
            </View>

            <SocialAuthButtons onGoogle={handleGoogleSignIn} onApple={handleAppleSignIn} />
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  card: {
    borderRadius: 32,
    width: '100%',
    alignSelf: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  title: {
    fontSize: 28,
    marginBottom: 28,
    textAlign: 'center',
  },
  titleRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  errorText: {
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  signupBtn: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  signupBtnGradient: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  signupBtnLoading: {
    backgroundColor: '#1d4ed8',
  },
  signupBtnText: {
    fontSize: 17,
    color: '#ffffff',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  loginRowRTL: {
    flexDirection: 'row-reverse',
  },
  loginHint: {
    fontSize: 15,
  },
  loginLink: {
    fontSize: 15,
  },
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  dividerRowRTL: {
    flexDirection: 'row-reverse',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
  },
});
