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
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const { cardMaxWidth, horizontalPadding, cardPadding } = useResponsive();
  const { signIn, signInWithGoogle, signInWithApple, isLoading } = useAuth();
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

  const handleLogin = async () => {
    if (!email || !password) {
      setError(isRTL ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(isRTL ? 'يرجى إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');
    setLocalLoading(true);
    
    const result = await signIn(email, password);
    
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(resolveRedirect());
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Translate common error messages
      let errorMessage = result.error;
      if (result.error?.includes('Invalid login credentials')) {
        errorMessage = isRTL ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password';
      } else if (result.error?.includes('Email not confirmed')) {
        errorMessage = isRTL ? 'يرجى تأكيد بريدك الإلكتروني أولاً' : 'Please confirm your email first';
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
  const signUpColor = isDark ? '#60a5fa' : '#2563eb';
  
  const loginBtnColors = isDark ? ['#3b82f6', '#2563eb'] : ['#2563eb', '#1d4ed8'];

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
              {t('login')}
            </Text>

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
              autoComplete="password"
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

            {/* Forgot Password Link */}
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => {
                Haptics.selectionAsync();
                router.push('/(auth)/forgot-password');
              }}
              style={[styles.forgotPasswordBtn, isRTL && styles.forgotPasswordBtnRTL]}
            >
              <Text
                style={[
                  styles.forgotPasswordText,
                  { color: signUpColor, fontFamily: FONT_BODY[fontKey] },
                ]}
              >
                {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
              style={styles.loginBtn}
            >
              <LinearGradient
                colors={loginBtnColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.loginBtnGradient, loading && styles.loginBtnLoading]}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={[styles.loginBtnText, { fontFamily: FONT_BOLD[fontKey] }]}>
                    {t('login')}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={[styles.signUpRow, isRTL && styles.signUpRowRTL]}>
              <Text
                style={[
                  styles.signUpHint,
                  { color: isDark ? '#94a3b8' : '#64748b', fontFamily: FONT_BODY[fontKey] },
                  isRTL && styles.textRTL,
                ]}
              >
                {isRTL ? 'ليس لديك حساب؟ ' : "Don't have an account? "}
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => {
                Haptics.selectionAsync();
                router.push('/(auth)/signup');
              }}>
                  <Text
                    style={[
                      styles.signUpLink,
                      { color: signUpColor, fontFamily: FONT_BOLD[fontKey] },
                      isRTL && styles.textRTL,
                    ]}
                  >
                    {t('signUp')}
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
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    marginTop: -8,
  },
  forgotPasswordBtnRTL: {
    alignSelf: 'flex-start',
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginBtn: {
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
  loginBtnGradient: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  loginBtnLoading: {
    backgroundColor: '#1d4ed8',
  },
  loginBtnText: {
    fontSize: 17,
    color: '#ffffff',
  },
  errorText: {
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  signUpRowRTL: {
    flexDirection: 'row-reverse',
  },
  signUpHint: {
    fontSize: 15,
  },
  signUpLink: {
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
