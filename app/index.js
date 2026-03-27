import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const SPLASH_DURATION_MS = 2500;

export default function SplashScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isInitialized) {
        if (isAuthenticated) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      }
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router, isAuthenticated, isInitialized]);

  const bg = isDark ? '#0f172a' : '#f5f3ff';
  const textColor = isDark ? '#f1f5f9' : '#1e1b4b';
  const accentColor = '#7c3aed';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* Background decoration circles */}
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.07 }}
        transition={{ type: 'timing', duration: 1500 }}
        style={[styles.bgCircle, styles.bgCircle1, { backgroundColor: accentColor }]}
      />
      <MotiView
        from={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.04 }}
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
          <Ionicons name="school" size={40} color="#ffffff" />
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
        <Text style={[styles.logoText, { color: textColor, fontFamily: 'Poppins_700Bold' }]}>
          ECL
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
        <Text style={[styles.tagline, { color: isDark ? '#64748b' : '#7c3aed', fontFamily: 'Poppins_600SemiBold' }]}>
          English Comprehension Learning
        </Text>
      </MotiView>

      {/* Loading indicator */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 400, delay: 1200 }}
        style={[styles.loaderWrap, { backgroundColor: isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.15)' }]}
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
    shadowColor: '#7c3aed',
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
    fontSize: 52,
    letterSpacing: 6,
  },
  taglineWrap: {
    marginTop: 12,
    paddingHorizontal: 40,
  },
  tagline: {
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loaderWrap: {
    position: 'absolute',
    bottom: 80,
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  loaderBar: {
    height: '100%',
    borderRadius: 2,
  },
});
