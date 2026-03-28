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
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../context/ThemeContext';
import { useResponsive } from '../../utils/useResponsive';
import { useAuth } from '../../context/AuthContext';
import LiquidGlassBackground from '../../components/LiquidGlassBackground';
import FloatingInput from '../../components/FloatingInput';
import SocialAuthButtons from '../../components/SocialAuthButtons';

export default function LoginScreen() {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [error, setError]             = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const insets                        = useSafeAreaInsets();
  const router                        = useRouter();
  const { isDark, colors }            = useTheme();
  const { width, height, isTablet, cardMaxWidth, horizontalPadding } = useResponsive();
  const { signIn, signInAsGuest, signInWithGoogle, signInWithApple, isLoading } = useAuth();
  const { redirect }                  = useLocalSearchParams();

  const loading    = isLoading || localLoading;
  const isCompact  = height < 700;

  // ── Responsive sizing ─────────────────────────────────────────────────────
  const badgeSize   = isTablet ? 82 : isCompact ? 58 : 70;
  const badgeRadius = isTablet ? 26 : isCompact ? 18 : 22;
  const iconSize    = isTablet ? 40 : isCompact ? 26 : 32;
  const nameSize    = isTablet ? 30 : isCompact ? 21 : 26;
  const taglineSize = isTablet ? 14 : isCompact ? 12 : 13;
  const badgeGap    = isCompact ? 10 : 13;

  const cardPadH    = isTablet ? 32 : isCompact ? 20 : 26;
  const cardPadV    = isTablet ? 26 : isCompact ? 16 : 22;
  const titleSize   = isTablet ? 24 : isCompact ? 18 : 22;
  const titleGap    = isCompact ? 12 : 16;

  const topPad      = Math.max(insets.top, 16) + (isCompact ? 6 : 12);
  const bottomPad   = Math.max(insets.bottom, 12) + 6;
  const logoGap     = isCompact ? 12 : 16;
  // ─────────────────────────────────────────────────────────────────────────

  const resolveRedirect = () => {
    const t = typeof redirect === 'string' ? redirect : null;
    return t?.startsWith('/') ? t : '/(tabs)';
  };

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');
    setLocalLoading(true);
    const result = await signIn(email, password);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(resolveRedirect());
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(result.error || 'Login failed');
    }
    setLocalLoading(false);
  };

  const handleGoogleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');
    setLocalLoading(true);
    const result = await signInWithGoogle();
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(resolveRedirect());
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (result.error !== 'Authentication cancelled') setError('Google sign in failed. Please try again.');
    }
    setLocalLoading(false);
  };

  const handleAppleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');
    setLocalLoading(true);
    const result = await signInWithApple();
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace(resolveRedirect());
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (result.error !== 'Authentication cancelled') setError('Apple sign in failed. Please try again.');
    }
    setLocalLoading(false);
  };

  const handleGuestLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    signInAsGuest();
    router.replace(resolveRedirect());
  };

  return (
    <View style={styles.screen}>
      <LiquidGlassBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingHorizontal: horizontalPadding, paddingTop: topPad, paddingBottom: bottomPad },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── Logo ──────────────────────────────────────────────────────── */}
          <MotiView
            from={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 150 }}
            style={[styles.logoSection, { marginBottom: logoGap }]}
          >
            <LinearGradient
              colors={colors.gradientHero}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.badge, {
                width: badgeSize, height: badgeSize, borderRadius: badgeRadius,
                marginBottom: badgeGap,
              }]}
            >
              <Ionicons name="school" size={iconSize} color="#fff" />
            </LinearGradient>

            <Text style={[styles.appName, {
              fontFamily: 'Poppins_800ExtraBold',
              fontSize: nameSize,
              color: colors.text,
            }]}>
              ECL QUEST
            </Text>
            <Text style={[styles.tagline, {
              fontFamily: 'Poppins_600SemiBold',
              fontSize: taglineSize,
              color: colors.textSecondary,
            }]}>
              Level up your English today
            </Text>
          </MotiView>

          {/* ── Card ──────────────────────────────────────────────────────── */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 280 }}
            style={[styles.cardWrap, { maxWidth: cardMaxWidth }]}
          >
            <BlurView
              intensity={isDark ? 30 : 65}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.card, {
                borderColor: colors.border,
                paddingHorizontal: cardPadH,
                paddingVertical: cardPadV,
              }]}
            >
              <Text style={[styles.title, {
                color: colors.text,
                fontFamily: 'Poppins_800ExtraBold',
                fontSize: titleSize,
                marginBottom: titleGap,
              }]}>
                Welcome Back
              </Text>

              <FloatingInput
                labelKey="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FloatingInput
                labelKey="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <AnimatePresence>
                {error ? (
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 28 }}
                    exit={{ opacity: 0, height: 0 }}
                    style={styles.errorRow}
                  >
                    <Ionicons name="alert-circle" size={14} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error, fontFamily: 'Poppins_600SemiBold' }]}>
                      {error}
                    </Text>
                  </MotiView>
                ) : null}
              </AnimatePresence>

              {/* Sign In */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleLogin}
                disabled={loading}
                style={[styles.signInBtn, { marginTop: isCompact ? 8 : 12 }]}
              >
                <LinearGradient
                  colors={colors.gradientHero}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.signInGradient, { paddingVertical: isCompact ? 13 : 15 }]}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={[styles.signInText, { fontFamily: 'Poppins_800ExtraBold', fontSize: isCompact ? 15 : 17 }]}>
                      SIGN IN
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Guest */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleGuestLogin}
                style={[styles.guestBtn, { marginTop: isCompact ? 6 : 8 }]}
              >
                <Text style={[styles.guestText, {
                  color: colors.signInText,
                  fontFamily: 'Poppins_700Bold',
                  fontSize: isCompact ? 13 : 14,
                }]}>
                  Continue as Guest
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={[styles.divRow, { marginTop: isCompact ? 10 : 14 }]}>
                <View style={[styles.divLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.divLabel, {
                  color: colors.textSecondary,

                  marginBottom:4,
                  fontFamily: 'Poppins_700Bold',
                  fontSize: isCompact ? 10 : 11,
                }]}>
                  OR CONTINUE WITH
                </Text>
                <View style={[styles.divLine, { backgroundColor: colors.border }]} />
              </View>

              {/* Social */}
              <SocialAuthButtons onGoogle={handleGoogleLogin} onApple={handleAppleLogin} />

              {/* Footer */}
              <View style={[styles.footerRow, { marginTop: isCompact ? 8 : 12 , paddingTop:8}]}>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                  <Text style={[styles.footerLink, { color: colors.accent, fontFamily: 'Poppins_700Bold', marginBottom:8 }]}>
                    Create Account
                  </Text>
                </TouchableOpacity>
                <View style={[styles.dot, { backgroundColor: colors.border }]} />
                <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                  <Text style={[styles.footerLink, { color: colors.textSecondary, fontFamily: 'Poppins_600SemiBold' }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </MotiView>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1 },
  kav:        { flex: 1 },
  scroll:     { flexGrow: 1, justifyContent: 'center' },

  // Logo
  logoSection: { alignItems: 'center' },
  badge: {
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#5b21b6', shadowOpacity: 0.4, shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }, elevation: 10,
  },
  appName:  { letterSpacing: 1.5 },
  tagline:  { marginTop: 2, opacity: 0.85 },

  // Card
  cardWrap: {
    width: '100%', alignSelf: 'center',
    borderRadius: 32, overflow: 'hidden',
    elevation: 14, shadowOpacity: 0.2, shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
  },
  card: { borderRadius: 32, borderWidth: 1.5 },
  title: { textAlign: 'center' },

  // Error
  errorRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 6, justifyContent: 'center',
    marginBottom: 4, overflow: 'hidden',
  },
  errorText: { fontSize: 12 },

  // Sign In
  signInBtn: {
    borderRadius: 16, overflow: 'hidden',
    elevation: 6, shadowColor: '#5b21b6',
    shadowOpacity: 0.38, shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  signInGradient: { alignItems: 'center', justifyContent: 'center' },
  signInText:     { color: '#fff', letterSpacing: 1.5 },

  // Guest
  guestBtn:  { alignItems: 'center', paddingVertical: 6 },
  guestText: { textDecorationLine: 'underline' },

  // Divider
  divRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  divLine:  { flex: 1, height: 1.5, opacity: 0.4 },
  divLabel: { letterSpacing: 0.8 },

  // Footer
  footerRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 12,
  },
  footerLink: { fontSize: 13 },
  dot: { width: 4, height: 4, borderRadius: 2 },
});
