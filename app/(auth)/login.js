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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { cardMaxWidth, horizontalPadding } = useResponsive();
  const { signIn, signInAsGuest, isLoading } = useAuth();
  const { redirect } = useLocalSearchParams();

  const resolveRedirect = () => {
    const target = typeof redirect === 'string' ? redirect : null;
    if (target && target.startsWith('/')) return target;
    return '/(tabs)';
  };

  const loading = isLoading || localLoading;

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
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
      setError(result.error || 'Login failed');
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <MotiView
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 200 }}
            style={styles.logoContainer}
          >
            <LinearGradient
              colors={colors.gradientHero}
              style={styles.logoGradient}
            >
              <Ionicons name="school" size={42} color="#fff" />
            </LinearGradient>
            <Text style={[styles.appName, { color: colors.text, fontFamily: 'Cairo_700Bold' }]}>
              ECL QUEST
            </Text>
            <Text style={[styles.appTagline, { color: colors.textSecondary, fontFamily: 'Cairo_400Regular' }]}>
              Level up your English today
            </Text>
          </MotiView>

          {/* Frosted Glass Login Card */}
          <MotiView
            from={{ opacity: 0, translateY: 40 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: 400 }}
            style={[styles.cardContainer, { maxWidth: cardMaxWidth }]}
          >
            <BlurView
              intensity={isDark ? 30 : 70}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.glassCard, { borderColor: colors.border }]}
            >
              <Text style={[styles.title, { color: colors.text, fontFamily: 'Cairo_700Bold' }]}>
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
                {error && (
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 35 }}
                    exit={{ opacity: 0, height: 0 }}
                    style={styles.errorContainer}
                  >
                    <Ionicons name="alert-circle" size={16} color={colors.error} />
                    <Text style={[styles.errorText, { color: colors.error, fontFamily: 'Cairo_400Regular' }]}>
                      {error}
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleLogin}
                disabled={loading}
                style={styles.loginBtn}
              >
                <LinearGradient
                  colors={colors.gradientHero}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loginBtnGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={[styles.loginBtnText, { fontFamily: 'Cairo_700Bold' }]}>SIGN IN</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleGuestLogin}
                style={styles.guestBtn}
              >
                <Text style={[styles.guestBtnText, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
                  Continue as Guest
                </Text>
              </TouchableOpacity>

              <View style={styles.footerRow}>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                  <Text style={[styles.footerLink, { color: colors.accent, fontFamily: 'Cairo_600SemiBold' }]}>
                    Create Account
                  </Text>
                </TouchableOpacity>
                <View style={[styles.dot, { backgroundColor: colors.border }]} />
                <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                  <Text style={[styles.footerLink, { color: colors.textSecondary, fontFamily: 'Cairo_400Regular' }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </MotiView>

          {/* Social Login */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 600 }}
            style={styles.socialSection}
          >
            <View style={styles.dividerRow}>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
                OR CONTINUE WITH
              </Text>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
            </View>

            <SocialAuthButtons />
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboard: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoGradient: {
    width: 86,
    height: 86,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  appName: { fontSize: 32, letterSpacing: 1 },
  appTagline: { fontSize: 16, marginTop: 2, opacity: 0.8 },
  cardContainer: {
    width: '100%',
    alignSelf: 'center',
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 12,
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  glassCard: {
    padding: 30,
    borderRadius: 32,
    borderWidth: 1.5,
  },
  title: { fontSize: 26, textAlign: 'center', marginBottom: 30 },
  errorContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 12 },
  errorText: { fontSize: 14 },
  loginBtn: {
    marginTop: 20,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  loginBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtnText: { color: '#fff', fontSize: 18, letterSpacing: 1.5 },
  guestBtn: {
    marginTop: 15,
    paddingVertical: 10,
    alignItems: 'center',
  },
  guestBtnText: { fontSize: 16, textDecorationLine: 'underline' },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 15,
  },
  footerLink: { fontSize: 14 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  socialSection: { marginTop: 40 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 25 },
  line: { flex: 1, height: 1.5, opacity: 0.4 },
  dividerText: { fontSize: 12, letterSpacing: 1 },
});
