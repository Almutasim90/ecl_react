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
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useResponsive } from '../../utils/useResponsive';
import { useAuth } from '../../context/AuthContext';
import LiquidGlassBackground from '../../components/LiquidGlassBackground';
import FloatingInput from '../../components/FloatingInput';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const { cardMaxWidth, horizontalPadding, cardPadding } = useResponsive();
  const { resetPassword, isLoading } = useAuth();

  const loading = isLoading || localLoading;
  const accentColor = colors.accent;
  const cardBg = isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.9)';
  const textColor = colors.text;
  const subtextColor = colors.textSecondary;
  const resetBtnColors = colors.gradientHero;

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');
    setLocalLoading(true);
    const result = await resetPassword(email);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess(true);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      let errorMessage = result.error;
      if (result.error?.includes('not found')) {
        errorMessage = 'Email address not registered';
      }
      setError(errorMessage);
    }
    setLocalLoading(false);
  };

  if (success) {
    return (
      <View style={styles.screen}>
        <LiquidGlassBackground />
        <View style={[styles.keyboard, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]}
            showsVerticalScrollIndicator={false}
          >
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={[styles.card, { backgroundColor: cardBg, maxWidth: cardMaxWidth, padding: cardPadding, borderColor: colors.border, borderWidth: 1 }]}
            >
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 200 }}
                style={[styles.iconContainer, { backgroundColor: '#10b98120' }]}
              >
                <Ionicons name="checkmark-circle" size={64} color="#10b981" />
              </MotiView>

              <Text style={[styles.title, { color: textColor, fontFamily: 'Poppins_700Bold' }]}>
                Email Sent!
              </Text>
              <Text style={[styles.subtitle, { color: subtextColor, fontFamily: 'Poppins_400Regular' }]}>
                We have sent a password reset link to your email. Please check your inbox.
              </Text>
              <Text style={[styles.emailText, { color: textColor, fontFamily: 'Poppins_600SemiBold' }]}>
                {email}
              </Text>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.replace('/(auth)/login')}
                style={styles.resetBtn}
              >
                <LinearGradient
                  colors={resetBtnColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.resetBtnGradient}
                >
                  <Text style={[styles.resetBtnText, { fontFamily: 'Poppins_700Bold' }]}>
                    BACK TO LOGIN
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleResetPassword} disabled={loading} style={styles.resendBtn}>
                <Text style={[styles.resendText, { color: accentColor, fontFamily: 'Poppins_600SemiBold' }]}>
                  {"Didn't receive it? Resend"}
                </Text>
              </TouchableOpacity>
            </MotiView>
          </ScrollView>
        </View>
      </View>
    );
  }

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
            transition={{ type: 'timing', duration: 400, delay: 100 }}
            style={[styles.card, { backgroundColor: cardBg, maxWidth: cardMaxWidth, padding: cardPadding, borderColor: colors.border, borderWidth: 1 }]}
          >
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color={textColor} />
            </TouchableOpacity>

            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 200 }}
              style={[styles.iconContainer, { backgroundColor: isDark ? '#4c1d9520' : '#7c3aed15' }]}
            >
              <Ionicons name="lock-open-outline" size={48} color={accentColor} />
            </MotiView>

            <Text style={[styles.title, { color: textColor, fontFamily: 'Poppins_700Bold' }]}>
              Forgot Password?
            </Text>
            <Text style={[styles.subtitle, { color: subtextColor, fontFamily: 'Poppins_400Regular' }]}>
              {"Don't worry! Enter your email and we'll send you a link to reset your password."}
            </Text>

            <FloatingInput
              labelKey="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
            />

            {error ? (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 200 }}
              >
                <Text style={[styles.errorText, { color: colors.error, fontFamily: 'Poppins_400Regular' }]}>{error}</Text>
              </MotiView>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleResetPassword}
              disabled={loading}
              style={styles.resetBtn}
            >
              <LinearGradient
                colors={resetBtnColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.resetBtnGradient, loading && { opacity: 0.8 }]}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={[styles.resetBtnText, { fontFamily: 'Poppins_700Bold' }]}>
                    SEND RESET LINK
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style={styles.backToLoginBtn}>
              <Ionicons name="arrow-back" size={18} color={accentColor} style={{ marginRight: 6 }} />
              <Text style={[styles.backToLoginText, { color: accentColor, fontFamily: 'Poppins_600SemiBold' }]}>
                Back to Login
              </Text>
            </TouchableOpacity>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  keyboard: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 32 },
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
  backButton: { position: 'absolute', top: 16, left: 16, zIndex: 10, padding: 8 },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  title: { fontSize: 24, marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 24, lineHeight: 22, paddingHorizontal: 8 },
  emailText: { fontSize: 15, textAlign: 'center', marginBottom: 32 },
  errorText: { fontSize: 13, marginBottom: 16, textAlign: 'center' },
  resetBtn: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  resetBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: { fontSize: 17, color: '#ffffff', letterSpacing: 1.2 },
  backToLoginBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  backToLoginText: { fontSize: 15 },
  resendBtn: { alignItems: 'center', paddingVertical: 8 },
  resendText: { fontSize: 14 },
});
