import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { fetchUserProgress } from '../../lib/api';

const APP_VERSION = '1.0.0';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Student';
  const displayEmail = user?.email || 'Not signed in';
  const listeningColor = colors.listeningAccent;
  const readingColor = colors.readingAccent;

  const [attempts, setAttempts] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProgressLoading(true);
    fetchUserProgress(user.id).then(({ data }) => {
      setAttempts(data || []);
      setProgressLoading(false);
    });
  }, [user]);

  const totalAttempts = attempts.length;
  const bestListening = attempts
    .filter(a => a.quiz_type === 'listening')
    .reduce((best, a) => Math.max(best, a.percentage), 0);
  const bestReading = attempts
    .filter(a => a.quiz_type === 'reading')
    .reduce((best, a) => Math.max(best, a.percentage), 0);
  const recentAttempts = attempts.slice(0, 5);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const confirmed =
      typeof window !== 'undefined' && window.confirm
        ? window.confirm('Are you sure you want to logout?')
        : true;
    if (confirmed) {
      const result = await signOut();
      if (result.success) router.replace('/(auth)/login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 110 }]}
      >
        {/* ── Hero card ── */}
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 16 }}
          style={styles.heroWrap}
        >
          <LinearGradient
            colors={colors.gradientHero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Decorative glows */}
            <View style={styles.heroGlow1} />
            <View style={styles.heroGlow2} />
            <View style={styles.heroGlow3} />

            {/* Avatar */}
            <MotiView
              from={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 14, delay: 100 }}
              style={styles.avatarWrap}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.08)']}
                style={styles.avatarRing}
              >
                <View style={styles.avatar}>
                  <Text style={[styles.avatarLetter, { color: colors.accent, fontFamily: 'Inter_600SemiBold' }]}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </LinearGradient>
              <View style={[styles.roleBadge, { backgroundColor: colors.accent }]}>
                <Ionicons name="school" size={10} color="#fff" />
              </View>
            </MotiView>

            {/* Name & Email */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 320, delay: 180 }}
              style={styles.heroInfo}
            >
              <Text style={[styles.heroName, { fontFamily: 'Inter_600SemiBold' }]}>
                {displayName}
              </Text>
              <View style={styles.emailRow}>
                <Ionicons name="mail-outline" size={13} color="rgba(255,255,255,0.65)" />
                <Text style={[styles.heroEmail, { fontFamily: 'Inter_400Regular' }]}>
                  {displayEmail}
                </Text>
              </View>
            </MotiView>

            {/* Member pill */}
            <MotiView
              from={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 14, delay: 260 }}
              style={styles.memberPill}
            >
              <View style={styles.memberDot} />
              <Text style={[styles.memberBrand, { fontFamily: 'Inter_600SemiBold' }]}>ECL</Text>
              <View style={styles.pillDivider} />
              <Ionicons name="star" size={10} color="#fbbf24" />
              <Text style={[styles.memberRole, { fontFamily: 'Inter_400Regular' }]}>Student</Text>
            </MotiView>
          </LinearGradient>
        </MotiView>

        {/* ── My Progress ── */}
        {user && (
          <>
            <SectionHeader label="My Progress" accent={colors.accent} textColor={colors.text} />

            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 340, delay: 280 }}
            >
              {/* Stats row */}
              <View style={styles.statsRow}>
                <StatCard
                  value={String(totalAttempts)}
                  label="Total Quizzes"
                  icon="trophy"
                  gradient={isDark
                    ? ['#1e1b4b', '#312e81']
                    : ['#4338ca', '#6366f1']}
                />
                <StatCard
                  value={bestListening > 0 ? `${bestListening}%` : '—'}
                  label="Best Listening"
                  icon="headset"
                  gradient={isDark
                    ? ['#2d1b50', '#5b21b6']
                    : ['#5b21b6', '#8b5cf6']}
                />
                <StatCard
                  value={bestReading > 0 ? `${bestReading}%` : '—'}
                  label="Best Reading"
                  icon="book"
                  gradient={isDark
                    ? ['#0c2040', '#1e40af']
                    : ['#1d4ed8', '#3b82f6']}
                />
              </View>

              {/* Recent attempts */}
              <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {/* Colored header strip */}
                <LinearGradient
                  colors={isDark
                    ? ['rgba(129,140,248,0.12)', 'rgba(129,140,248,0.00)']
                    : ['rgba(67,56,202,0.08)', 'rgba(67,56,202,0.00)']}
                  style={styles.cardHeaderStrip}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <View style={[styles.cardHeaderDot, { backgroundColor: colors.accent }]} />
                      <Text style={[styles.cardHeaderTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
                        Recent Attempts
                      </Text>
                    </View>
                    {recentAttempts.length > 0 && (
                      <View style={[styles.cardHeaderBadge, { backgroundColor: colors.accentSoft }]}>
                        <Text style={[styles.cardHeaderBadgeText, { color: colors.accent, fontFamily: 'Inter_600SemiBold' }]}>
                          {recentAttempts.length}
                        </Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
                <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

                {progressLoading ? (
                  <View style={styles.loadingWrap}>
                    <ActivityIndicator size="small" color={colors.accent} />
                  </View>
                ) : recentAttempts.length === 0 ? (
                  <View style={styles.emptyWrap}>
                    <View style={[styles.emptyIcon, { backgroundColor: colors.accentSoft }]}>
                      <Ionicons name="stats-chart-outline" size={26} color={colors.accent} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
                      No attempts yet
                    </Text>
                    <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                      Complete a quiz to see your progress here
                    </Text>
                  </View>
                ) : (
                  recentAttempts.map((attempt, idx) => {
                    const isLast = idx === recentAttempts.length - 1;
                    const isListening = attempt.quiz_type === 'listening';
                    const passed = attempt.percentage >= 70;
                    const date = new Date(attempt.completed_at).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric',
                    });
                    return (
                      <View key={attempt.id}>
                        <View style={styles.attemptRow}>
                          <View style={[
                            styles.attemptIcon,
                            {
                              backgroundColor: isListening
                                ? (isDark ? 'rgba(167,139,250,0.14)' : 'rgba(124,58,237,0.08)')
                                : (isDark ? 'rgba(96,165,250,0.14)' : 'rgba(37,99,235,0.08)')
                            },
                          ]}>
                            <Ionicons
                              name={isListening ? 'headset' : 'book'}
                              size={18}
                              color={isListening ? listeningColor : readingColor}
                            />
                          </View>
                          <View style={styles.attemptInfo}>
                            <Text style={[styles.attemptTitle, { color: colors.text, fontFamily: 'Inter_500Medium' }]}>
                              {isListening ? 'Listening' : 'Reading'} · Form {attempt.form_number}
                            </Text>
                            <Text style={[styles.attemptDate, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                              {date} · {attempt.score}/{attempt.total_questions} correct
                            </Text>
                          </View>
                          <LinearGradient
                            colors={passed
                              ? ['rgba(52,211,153,0.18)', 'rgba(52,211,153,0.08)']
                              : ['rgba(248,113,113,0.18)', 'rgba(248,113,113,0.08)']}
                            style={styles.percentBadge}
                          >
                            <Text style={[
                              styles.percentText,
                              { color: passed ? colors.success : colors.error, fontFamily: 'Inter_600SemiBold' },
                            ]}>
                              {attempt.percentage}%
                            </Text>
                          </LinearGradient>
                        </View>
                        {!isLast && <View style={[styles.cardDivider, { backgroundColor: colors.border, marginHorizontal: 16 }]} />}
                      </View>
                    );
                  })
                )}
              </View>
            </MotiView>
          </>
        )}

        {/* ── Preferences ── */}
        <SectionHeader label="Preferences" accent={colors.accent} textColor={colors.text} />

        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 340, delay: 300 }}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleTheme();
            }}
            style={styles.menuRow}
          >
            <View style={styles.menuRowLeft}>
              <LinearGradient
                colors={isDark ? ['#2d2760', '#3d3580'] : ['#a5b4fc', '#818cf8']}
                style={styles.menuIconWrap}
              >
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={isDark ? colors.accent : '#ffffff'} />
              </LinearGradient>
              <View>
                <Text style={[styles.menuLabel, { color: colors.text, fontFamily: 'Inter_500Medium' }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.menuSub, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                  {isDark ? 'Currently dark' : 'Currently light'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleTheme();
              }}
              trackColor={{ false: colors.surfaceAlt, true: colors.accentSoft }}
              thumbColor={isDark ? colors.accent : '#000000ff'}
            />
          </TouchableOpacity>
        </MotiView>

        {/* ── Support ── */}
        <SectionHeader label="Support" accent={colors.accent} textColor={colors.text} />

        <MotiView
          from={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 340, delay: 360 }}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <MenuItem
            icon="help-circle"
            gradient={isDark ? ['#1a3a4a', '#0c2a3a'] : ['#60a5fa', '#3b82f6']}
            iconColor={isDark ? readingColor : '#ffffff'}
            label="Help & Support"
            sub="FAQs and contact"
            textColor={colors.text}
            subtextColor={colors.textSecondary}
            borderColor={colors.border}
            onPress={() => router.push('/support/help')}
            showDivider
          />
          <MenuItem
            icon="document-text"
            gradient={isDark ? ['#3a2010', '#2a1808'] : ['#fb923c', '#f97316']}
            iconColor={isDark ? '#f97316' : '#ffffff'}
            label="Terms & Conditions"
            sub="Read our policies"
            textColor={colors.text}
            subtextColor={colors.textSecondary}
            onPress={() => { }}
          />
        </MotiView>

        {/* ── Sign Out ── */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 340, delay: 420 }}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleLogout}
            style={[styles.logoutBtn, {
              backgroundColor: isDark ? 'rgba(248,113,113,0.10)' : 'rgba(220,38,38,0.07)',
              borderColor: isDark ? 'rgba(248,113,113,0.28)' : 'rgba(220,38,38,0.22)',
            }]}
          >
            <View style={[styles.logoutIconWrap, {
              backgroundColor: isDark ? 'rgba(248,113,113,0.20)' : 'rgba(220,38,38,0.14)',
            }]}>
              <Ionicons name="log-out-outline" size={20} color={colors.error} />
            </View>
            <Text style={[styles.logoutText, { color: colors.error, fontFamily: 'Inter_600SemiBold' }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* ── Version ── */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 480 }}
          style={styles.versionWrap}
        >
          <View style={[styles.versionPill, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.versionDot, { backgroundColor: colors.accent }]} />
            <Text style={[styles.versionText, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              ECL App · v{APP_VERSION}
            </Text>
          </View>
        </MotiView>
      </ScrollView>
    </View>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function SectionHeader({ label, accent, textColor }) {
  return (
    <View style={sectionStyles.row}>
      <View style={[sectionStyles.bar, { backgroundColor: accent }]} />
      <Text style={[sectionStyles.label, { color: textColor, fontFamily: 'Inter_600SemiBold' }]}>
        {label}
      </Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, marginBottom: 12 },
  bar: { width: 3, height: 16, borderRadius: 2 },
  label: { fontSize: 16, letterSpacing: -0.2 },
});

function StatCard({ value, label, icon, gradient }) {
  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={statStyles.card}
    >
      {/* Decorative ring */}
      <View style={statStyles.cardRing} />
      <View style={statStyles.iconWrap}>
        <Ionicons name={icon} size={18} color="rgba(255,255,255,0.95)" />
      </View>
      <Text style={[statStyles.value, { fontFamily: 'Inter_600SemiBold' }]}>
        {value}
      </Text>
      <Text style={[statStyles.label, { fontFamily: 'Inter_400Regular' }]}>
        {label}
      </Text>
    </LinearGradient>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1, alignItems: 'center', paddingVertical: 18, paddingHorizontal: 8,
    borderRadius: 20, gap: 6, overflow: 'hidden', position: 'relative',
    shadowColor: '#4338ca',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28, shadowRadius: 10, elevation: 5,
  },
  cardRing: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    borderWidth: 10, borderColor: 'rgba(255,255,255,0.10)',
    top: -20, right: -20,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center', justifyContent: 'center',
  },
  value: { fontSize: 20, letterSpacing: -0.5, color: '#ffffff' },
  label: { fontSize: 10, textAlign: 'center', lineHeight: 14, color: 'rgba(255,255,255,0.80)' },
});

function MenuItem({ icon, gradient, iconColor, label, sub, textColor, subtextColor, onPress, showDivider, borderColor }) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress?.();
        }}
        style={menuStyles.row}
      >
        <View style={menuStyles.left}>
          <LinearGradient colors={gradient} style={menuStyles.iconWrap}>
            <Ionicons name={icon} size={19} color={iconColor} />
          </LinearGradient>
          <View>
            <Text style={[menuStyles.label, { color: textColor, fontFamily: 'Inter_500Medium' }]}>
              {label}
            </Text>
            {sub && (
              <Text style={[menuStyles.sub, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
                {sub}
              </Text>
            )}
          </View>
        </View>
        <View style={[menuStyles.chevronWrap, { backgroundColor: 'rgba(128,128,128,0.08)' }]}>
          <Ionicons name="chevron-forward" size={15} color={subtextColor} />
        </View>
      </TouchableOpacity>
      {showDivider && (
        <View style={[menuStyles.divider, { backgroundColor: borderColor }]} />
      )}
    </>
  );
}

const menuStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconWrap: {
    width: 42, height: 42, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
  },
  label: { fontSize: 15 },
  sub: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginHorizontal: 16 },
  chevronWrap: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
});

// ── Main styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  // Hero
  heroWrap: {
    borderRadius: 28, overflow: 'hidden', marginBottom: 4,
    shadowColor: '#818cf8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35, shadowRadius: 20, elevation: 10,
  },
  heroGradient: {
    paddingVertical: 36, paddingHorizontal: 24,
    alignItems: 'center', overflow: 'hidden', position: 'relative',
  },
  heroGlow1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)', top: -60, right: -40,
  },
  heroGlow2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, left: -20,
  },
  heroGlow3: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)', top: 20, left: 20,
  },

  // Avatar
  avatarWrap: { marginBottom: 18, position: 'relative' },
  avatarRing: {
    padding: 4, borderRadius: 62,
  },
  avatar: {
    width: 92, height: 92, borderRadius: 46,
    backgroundColor: 'rgba(255,255,255,0.96)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarLetter: { fontSize: 40 },
  roleBadge: {
    position: 'absolute', bottom: 4, right: 4,
    width: 26, height: 26, borderRadius: 13,
    borderWidth: 2.5, borderColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },

  // Hero text
  heroInfo: { alignItems: 'center', marginBottom: 16 },
  heroName: { fontSize: 26, color: '#ffffff', letterSpacing: -0.5, marginBottom: 6 },
  emailRow: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  heroEmail: { fontSize: 13, color: 'rgba(255,255,255,0.72)' },

  // Member pill
  memberPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
  },
  memberDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ade80' },
  memberBrand: { fontSize: 12, color: '#ffffff', letterSpacing: 2 },
  pillDivider: {
    width: 1, height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 2,
  },
  memberRole: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },

  // Stats row
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },

  // Card (generic)
  card: {
    borderRadius: 20, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    marginBottom: 0,
  },
  cardHeaderStrip: { paddingBottom: 2 },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardHeaderDot: { width: 8, height: 8, borderRadius: 4 },
  cardHeaderTitle: { fontSize: 15 },
  cardHeaderBadge: {
    paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8,
  },
  cardHeaderBadgeText: { fontSize: 12 },
  cardDivider: { height: 1 },

  // Attempt rows
  attemptRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 13, gap: 12,
  },
  attemptIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  attemptInfo: { flex: 1 },
  attemptTitle: { fontSize: 14 },
  attemptDate: { fontSize: 12, marginTop: 2 },
  percentBadge: {
    paddingHorizontal: 11, paddingVertical: 5, borderRadius: 10,
  },
  percentText: { fontSize: 14 },

  // Empty state
  loadingWrap: { paddingVertical: 28, alignItems: 'center' },
  emptyWrap: { paddingVertical: 32, alignItems: 'center', gap: 10 },
  emptyIcon: {
    width: 56, height: 56, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  emptyTitle: { fontSize: 15 },
  emptyText: { fontSize: 13, textAlign: 'center', lineHeight: 18, paddingHorizontal: 24 },

  // Menu rows
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
  },
  menuRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  menuIconWrap: {
    width: 42, height: 42, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { fontSize: 15 },
  menuSub: { fontSize: 12, marginTop: 2 },

  // Logout
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 18, borderWidth: 1.5, marginTop: 20,
  },
  logoutIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  logoutText: { fontSize: 16 },

  // Version
  versionWrap: { alignItems: 'center', marginTop: 24, marginBottom: 8 },
  versionPill: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1,
  },
  versionDot: { width: 6, height: 6, borderRadius: 3 },
  versionText: { fontSize: 12 },
});
