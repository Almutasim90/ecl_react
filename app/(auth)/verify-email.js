import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useResponsive } from '../../utils/useResponsive';
import { useAuth } from '../../context/AuthContext';
import LiquidGlassBackground from '../../components/LiquidGlassBackground';

const OTP_LENGTH = 6;

export default function VerifyEmailScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email || '';
  const redirect = params.redirect;
  const { isDark } = useTheme();
  const { cardMaxWidth, horizontalPadding, cardPadding } = useResponsive();
  const { verifyOTP, signInWithOTP, isLoading } = useAuth();

  const resolveRedirect = () => {
    const target = typeof redirect === 'string' ? redirect : null;
    if (target && target.startsWith('/')) return target;
    return '/(tabs)';
  };

  const loading = isLoading || localLoading;
  const accentColor = '#7c3aed';
  const cardBg = isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.9)';
  const inputBg = isDark ? '#1e293b' : '#f1f5f9';
  const inputBorder = isDark ? '#475569' : '#e2e8f0';
  const textColor = isDark ? '#f1f5f9' : '#1e1b4b';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const verifyBtnColors = isDark ? ['#8b5cf6', '#7c3aed'] : ['#7c3aed', '#6d28d9'];

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (value, index) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    if (value.length > 1) {
      const digits = value.slice(0, OTP_LENGTH).split('');
      digits.forEach((digit, i) => { if (i < OTP_LENGTH) newOtp[i] = digit; });
      setOtp(newOtp);
      const lastFilledIndex = Math.min(digits.length - 1, OTP_LENGTH - 1);
      inputRefs.current[lastFilledIndex]?.focus();
      return;
    }
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== OTP_LENGTH) {
      setError('Please enter the complete verification code');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setError('');
    setLocalLoading(true);
    const result = await verifyOTP(email, otpCode);
    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSuccess('Verification successful!');
      setTimeout(() => router.replace(resolveRedirect()), 1000);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      let errorMessage = result.error;
      if (result.error?.includes('expired') || result.error?.includes('invalid')) {
        errorMessage = 'Invalid or expired verification code';
      }
      setError(errorMessage);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    setLocalLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError('');
    setLocalLoading(true);
    const result = await signInWithOTP(email);
    if (result.success) {
      setSuccess('New code sent');
      setResendTimer(60);
      setCanResend(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to send code');
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
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 100 }}
            style={[styles.card, { backgroundColor: cardBg, maxWidth: cardMaxWidth, padding: cardPadding }]}
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
              <Ionicons name="mail-outline" size={48} color={accentColor} />
            </MotiView>

            <Text style={[styles.title, { color: textColor, fontFamily: 'Inter_600SemiBold' }]}>
              Verify Your Email
            </Text>
            <Text style={[styles.subtitle, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
              {"We've sent a 6-digit verification code to"}
            </Text>
            <Text style={[styles.emailText, { color: textColor, fontFamily: 'Inter_600SemiBold' }]}>
              {email}
            </Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    {
                      backgroundColor: inputBg,
                      borderColor: digit ? accentColor : inputBorder,
                      color: textColor,
                      fontFamily: 'Inter_600SemiBold',
                    },
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {error ? (
              <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 200 }}>
                <Text style={[styles.errorText, { fontFamily: 'Inter_400Regular' }]}>{error}</Text>
              </MotiView>
            ) : null}

            {success ? (
              <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 200 }}>
                <Text style={[styles.successText, { fontFamily: 'Inter_400Regular' }]}>{success}</Text>
              </MotiView>
            ) : null}

            <TouchableOpacity activeOpacity={0.85} onPress={handleVerify} disabled={loading} style={styles.verifyBtn}>
              <LinearGradient
                colors={verifyBtnColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.verifyBtnGradient, loading && { opacity: 0.8 }]}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={[styles.verifyBtnText, { fontFamily: 'Inter_600SemiBold' }]}>Verify</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={[styles.resendHint, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
                {"Didn't receive the code? "}
              </Text>
              <TouchableOpacity onPress={handleResend} disabled={!canResend || loading}>
                <Text style={[styles.resendLink, { color: canResend ? accentColor : subtextColor, fontFamily: 'Inter_600SemiBold' }]}>
                  {canResend ? 'Resend' : `Resend in ${resendTimer}s`}
                </Text>
              </TouchableOpacity>
            </View>
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
  subtitle: { fontSize: 15, textAlign: 'center', marginBottom: 4 },
  emailText: { fontSize: 15, textAlign: 'center', marginBottom: 32 },
  otpContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    textAlign: 'center',
    fontSize: 24,
  },
  errorText: { fontSize: 13, marginBottom: 16, textAlign: 'center', color: '#ef4444' },
  successText: { fontSize: 13, marginBottom: 16, textAlign: 'center', color: '#10b981' },
  verifyBtn: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  verifyBtnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  verifyBtnText: { fontSize: 17, color: '#ffffff' },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' },
  resendHint: { fontSize: 14 },
  resendLink: { fontSize: 14 },
});
