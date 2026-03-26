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
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useResponsive } from '../../utils/useResponsive';
import { useAuth } from '../../context/AuthContext';
import LiquidGlassBackground from '../../components/LiquidGlassBackground';
import FloatingInput from '../../components/FloatingInput';
import SocialAuthButtons from '../../components/SocialAuthButtons';

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
  const { isDark, colors } = useTheme();
  const { cardMaxWidth, horizontalPadding, cardPadding } = useResponsive();
  const { signUp, signInWithGoogle, signInWithApple, isLoading } = useAuth();
  const { redirect } = useLocalSearchParams();

  const resolveRedirect = () => {
    const target = typeof redirect === 'string' ? redirect : null;
    if (target && target.startsWith('/')) return target;
    return '/(tabs)';
  };

  const loading = isLoading || localLoading;
  const accentColor = colors.accent;
  const cardBg = isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.9)';
  const dividerColor = colors.border;
  const linkColor = colors.accent;
  const signupBtnColors = colors.gradientHero;

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');
    setLocalLoading(true);
    const result = await signUp(email, password, name);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (result.needsEmailConfirmation) {
        router.replace({
          pathname: '/(auth)/verify-email',
          params: { email: email, redirect: resolveRedirect() },
        });
      } else {
        router.replace(resolveRedirect());
      }
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      let errorMessage = result.error;
      if (result.error?.includes('already registered')) {
        errorMessage = 'This email is already registered';
      } else if (result.error?.includes('Password')) {
        errorMessage = 'Password is too weak';
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
        setError('Google sign in failed');
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
        setError('Apple sign in failed');
      }
    }
    setLocalLoading(false);
  };

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
          {/* App Branding */}
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600, delay: 50 }}
            style={styles.brandRow}
          >
            <View style={[styles.brandIcon, { backgroundColor: accentColor }]}>
              <Ionicons name="school" size={22} color="#ffffff" />
            </View>
            <Text style={[styles.brandName, { color: colors.text, fontFamily: 'Cairo_700Bold' }]}>
              ECL QUEST
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: ENTER_DURATION, delay: ENTER_DELAY }}
            style={[styles.card, { backgroundColor: cardBg, maxWidth: cardMaxWidth, padding: cardPadding, borderColor: colors.border, borderWidth: 1 }]}
          >
            <Text style={[styles.title, { color: colors.text, fontFamily: 'Cairo_700Bold' }]}>
              Create Account
            </Text>

            <FloatingInput labelKey="Full Name" value={name} onChangeText={setName} autoCapitalize="words" />
            <FloatingInput
              labelKey="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
            />
            <FloatingInput
              labelKey="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password-new"
            />
            <FloatingInput
              labelKey="Confirm Password"
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
                <Text style={[styles.errorText, { color: colors.error, fontFamily: 'Cairo_400Regular' }]}>
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
                  <Text style={[styles.signupBtnText, { fontFamily: 'Cairo_700Bold' }]}>
                    SIGN UP
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={[styles.loginHint, { color: colors.textSecondary, fontFamily: 'Cairo_400Regular' }]}>
                {'Already have an account? '}
              </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => {
                Haptics.selectionAsync();
                router.push('/(auth)/login');
              }}>
                <Text style={[styles.loginLink, { color: linkColor, fontFamily: 'Cairo_600SemiBold' }]}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.dividerRow, { marginBottom: 12 }]}>
              <View style={[styles.dividerLine, { backgroundColor: dividerColor }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
                OR CONTINUE WITH
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
  screen: { flex: 1 },
  keyboard: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 32,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  brandName: { fontSize: 28, letterSpacing: 2 },
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
  title: { fontSize: 26, marginBottom: 28, textAlign: 'center' },
  signupBtn: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  signupBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupBtnLoading: { opacity: 0.8 },
  signupBtnText: { fontSize: 18, color: '#ffffff', letterSpacing: 1.2 },
  errorText: { fontSize: 13, marginBottom: 12, textAlign: 'center' },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  loginHint: { fontSize: 15 },
  loginLink: { fontSize: 15 },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1.5, opacity: 0.3 },
  dividerText: { fontSize: 12, letterSpacing: 1 },
});
