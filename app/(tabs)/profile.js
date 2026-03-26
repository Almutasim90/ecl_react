import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { fetchUserProgress } from '../../lib/api';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();

  const [attempts, setAttempts] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Guest Student';
  const displayEmail = user?.email || 'No email provided';
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!user) { setProgressLoading(false); return; }
    fetchUserProgress(user.id).then(data => {
      setAttempts(data || []);
      setProgressLoading(false);
    });
  }, [user]);

  const totalAttempts = attempts.length;
  const bestListening = attempts.filter(a => a.quiz_type === 'listening')
    .reduce((best, a) => Math.max(best, a.percentage), 0);
  const bestReading = attempts.filter(a => a.quiz_type === 'reading')
    .reduce((best, a) => Math.max(best, a.percentage), 0);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await signOut();
    if (result.success) router.replace('/(auth)/login');
  };

  return (
    <View style={[styles.root, { backgroundColor: isDark ? '#0d0d14' : '#eef0fb' }]}>

      {/* Gradient hero background */}
      <LinearGradient
        colors={isDark
          ? ['#1a0840', '#2e1065', '#1e1b4b']
          : ['#4338ca', '#5b21b6', '#7c3aed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroBg, { height: insets.top + 240 }]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 110 }]}
      >

        {/* ── Avatar + Name ── */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 16 }}
          style={styles.heroSection}
        >
          {/* Avatar ring */}
          <View style={styles.avatarOuter}>
            <LinearGradient colors={['#f97316', '#fb923c']} style={styles.avatarGrad}>
              <Text style={[styles.avatarLetter, { fontFamily: 'Cairo_800ExtraBold' }]}>
                {initial}
              </Text>
            </LinearGradient>
          </View>

          <Text style={[styles.heroName, { fontFamily: 'Cairo_800ExtraBold' }]}>
            {displayName}
          </Text>
          <Text style={[styles.heroEmail, { fontFamily: 'Cairo_600SemiBold' }]}>
            {displayEmail}
          </Text>

          {/* Level badge */}
          <View style={styles.levelBadge}>
            <Ionicons name="star" size={12} color="#fbbf24" />
            <Text style={[styles.levelText, { fontFamily: 'Cairo_700Bold' }]}>
              {totalAttempts >= 20 ? 'Advanced' : totalAttempts >= 10 ? 'Intermediate' : 'Beginner'}
            </Text>
          </View>
        </MotiView>

        {/* ── White card section ── */}
        <View style={[styles.cardSection, { backgroundColor: isDark ? '#0d0d14' : '#eef0fb' }]}>

          {/* Stats row */}
          <MotiView
            from={{ opacity: 0, translateY: 14 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 16, delay: 80 }}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>
              Your Stats
            </Text>
            <View style={styles.statsRow}>
              <StatBox
                label="Quizzes"
                value={totalAttempts}
                emoji="🏆"
                color="#fbbf24"
              />
              <StatBox
                label="Listening"
                value={`${bestListening}%`}
                emoji="🎧"
                color={colors.listeningAccent}
              />
              <StatBox
                label="Reading"
                value={`${bestReading}%`}
                emoji="📖"
                color={colors.readingAccent}
              />
            </View>
          </MotiView>

          {/* Settings */}
          <MotiView
            from={{ opacity: 0, translateY: 14 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 16, delay: 140 }}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>
              Settings
            </Text>

            <MenuButton
              label="Dark Mode"
              icon={isDark ? 'moon' : 'sunny'}
              value={isDark ? 'On' : 'Off'}
              onPress={toggleTheme}
            />
            <MenuButton
              label="Help & Support"
              icon="help-circle-outline"
              onPress={() => router.push('/support/help')}
            />
            <MenuButton
              label="Sign Out"
              icon="log-out-outline"
              danger
              onPress={handleLogout}
            />
          </MotiView>

        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({ label, value, emoji, color }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.statBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={[styles.statValue, { color, fontFamily: 'Cairo_800ExtraBold' }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: 'Cairo_700Bold' }]}>
        {label}
      </Text>
    </View>
  );
}

function MenuButton({ label, icon, onPress, value, danger }) {
  const { colors } = useTheme();
  const labelColor = danger ? '#ef4444' : colors.text;
  const iconColor  = danger ? '#ef4444' : colors.accent;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => { onPress?.(); }}
      style={[styles.menuRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={[styles.menuIconWrap, { backgroundColor: (danger ? '#ef4444' : colors.accent) + '18' }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.menuLabel, { color: labelColor, fontFamily: 'Cairo_700Bold' }]}>
        {label}
      </Text>
      <View style={styles.menuRight}>
        {value && (
          <Text style={[styles.menuValue, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
            {value}
          </Text>
        )}
        <Ionicons name="chevron-forward" size={18} color={colors.border} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  heroBg: { position: 'absolute', top: 0, left: 0, right: 0 },

  scroll: { paddingHorizontal: 20 },

  // Hero section (on gradient)
  heroSection: { alignItems: 'center', marginBottom: 28 },
  avatarOuter: {
    borderRadius: 46, borderWidth: 3, borderColor: 'rgba(255,255,255,0.35)',
    padding: 3, marginBottom: 14,
    elevation: 10, shadowColor: '#f97316', shadowOpacity: 0.4,
    shadowRadius: 14, shadowOffset: { width: 0, height: 5 },
  },
  avatarGrad: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { fontSize: 34, color: '#ffffff' },
  heroName: { fontSize: 22, color: '#ffffff', marginBottom: 4 },
  heroEmail: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 10 },
  levelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  levelText: { fontSize: 12, color: '#fbbf24' },

  // Content section
  cardSection: {
    marginHorizontal: -20, paddingHorizontal: 20,
    paddingTop: 28,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
  },

  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, marginBottom: 16 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: {
    flex: 1, paddingVertical: 18, paddingHorizontal: 10,
    borderRadius: 20, borderWidth: 1.5,
    alignItems: 'center', gap: 4,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
  },
  statEmoji: { fontSize: 24, marginBottom: 2 },
  statValue: { fontSize: 18 },
  statLabel: { fontSize: 10, textTransform: 'uppercase', textAlign: 'center', letterSpacing: 0.5 },

  // Menu rows
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 18, borderWidth: 1.5, marginBottom: 10,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  menuIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15 },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  menuValue: { fontSize: 13 },
});
