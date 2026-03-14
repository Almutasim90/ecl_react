import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { useAuth } from '../context/AuthContext';

const SPLASH_DURATION_MS = 2500;

export default function SplashScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { isRTL } = useI18n();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    // Wait for auth to be initialized and splash duration to complete
    const timer = setTimeout(() => {
      if (isInitialized) {
        if (isAuthenticated) {
          // User is logged in, go to main app
          router.replace('/(tabs)');
        } else {
          // User is not logged in, go to login
          router.replace('/(auth)/login');
        }
      }
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router, isAuthenticated, isInitialized]);

  // If auth initialized before splash duration, wait for splash
  // If splash duration passed but auth not initialized, this effect will handle it
  useEffect(() => {
    if (isInitialized) {
      // Auth is ready, the other effect will handle navigation
    }
  }, [isInitialized]);

  const bg = isDark ? '#0f172a' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const accentColor = '#2563eb';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Background decoration circles */}
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.05 }}
        transition={{ type: 'timing', duration: 1500 }}
        style={[styles.bgCircle, styles.bgCircle1, { backgroundColor: accentColor }]}
      />
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.03 }}
        transition={{ type: 'timing', duration: 1800, delay: 200 }}
        style={[styles.bgCircle, styles.bgCircle2, { backgroundColor: accentColor }]}
      />

      {/* Logo Icon */}
      <MotiView
        from={{ scale: 0, rotate: '-45deg' }}
        animate={{ scale: 1, rotate: '0deg' }}
        transition={{
          type: 'spring',
          damping: 12,
          stiffness: 100,
          delay: 200,
        }}
        style={styles.iconWrap}
      >
        <View style={[styles.iconBg, { backgroundColor: accentColor }]}>
          <Ionicons name="location" size={40} color="#ffffff" />
        </View>
      </MotiView>

      {/* Logo Text */}
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
          type: 'timing',
          duration: 800,
          delay: 500,
        }}
        style={styles.logoWrap}
      >
        <Text
          style={[
            styles.logoText,
            { color: textColor },
            isRTL && styles.logoRTL,
          ]}
        >
          Daleel<Text style={{ color: accentColor }}>+</Text>
        </Text>
        <Text
          style={[
            styles.logoSub,
            { color: textColor },
            isRTL && styles.logoRTL,
          ]}
        >
          دليل<Text style={{ color: accentColor }}>+</Text>
        </Text>
      </MotiView>

      {/* Tagline */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 600,
          delay: 1000,
        }}
        style={styles.taglineWrap}
      >
        <Text style={[styles.tagline, { color: isDark ? '#64748b' : '#94a3b8' }]}>
          {isRTL ? 'اكتشف أفضل الأماكن' : 'Discover the best places'}
        </Text>
      </MotiView>

      {/* Loading indicator */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 400, delay: 1200 }}
        style={styles.loaderWrap}
      >
        <MotiView
          from={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{
            type: 'timing',
            duration: 1200,
            delay: 1300,
          }}
          style={[styles.loaderBar, { backgroundColor: accentColor }]}
        />
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 9999,
  },
  bgCircle1: {
    width: 400,
    height: 400,
    top: -100,
    right: -100,
  },
  bgCircle2: {
    width: 300,
    height: 300,
    bottom: -50,
    left: -50,
  },
  iconWrap: {
    marginBottom: 20,
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 42,
    letterSpacing: -0.5,
  },
  logoSub: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 32,
    marginTop: 2,
  },
  logoRTL: {
    writingDirection: 'rtl',
  },
  taglineWrap: {
    marginTop: 12,
  },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  loaderWrap: {
    position: 'absolute',
    bottom: 80,
    width: 60,
    height: 4,
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderBar: {
    height: '100%',
    borderRadius: 2,
  },
});
