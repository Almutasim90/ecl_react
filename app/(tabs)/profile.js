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
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: 110 },
        ]}
      >
        {/* ── Profile hero card ── */}
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 16 }}
          style={styles.heroWrap}
        >
          <LinearGradient
            colors={colors.gradientProfile}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroBlob1} />
            <View style={styles.heroBlob2} />
            <View style={styles.heroBlob3} />

            <MotiView
              from={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 14, delay: 100 }}
              style={styles.avatarWrap}
            >
              <View style={styles.avatarRing}>
                <View style={styles.avatar}>
                  <Text style={[styles.avatarLetter, { fontFamily: 'Inter_600SemiBold' }]}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.roleBadge}>
                <Ionicons name="school" size={11} color="#fff" />
              </View>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 320, delay: 180 }}
            >
              <Text style={[styles.heroName, { fontFamily: 'Inter_600SemiBold' }]}>
                {displayName}
              </Text>
              <View style={styles.emailRow}>
                <Ionicons name="mail-outline" size={13} color="rgba(255,255,255,0.7)" />
                <Text style={[styles.heroEmail, { fontFamily: 'Inter_400Regular' }]}>
                  {displayEmail}
                </Text>
              </View>
            </MotiView>

            <MotiView
              from={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 14, delay: 260 }}
              style={styles.memberPill}
            >
              <Text style={[styles.memberBrand, { fontFamily: 'Inter_600SemiBold' }]}>ECL</Text>
              <View style={styles.pillDivider} />
              <Ionicons name="star" size={11} color="#fbbf24" />
              <Text style={[styles.memberRole, { fontFamily: 'Inter_400Regular' }]}>Student</Text>
            </MotiView>
          </LinearGradient>
        </MotiView>

        {/* ── My Progress ── */}
        {user && (
          <>
            <SectionHeader label="My Progress" color={colors.textSecondary} />
            <MotiView
              from={{ opacity: 0, translateX: -14 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 340, delay: 280 }}
              style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              {/* Stats Row */}
              <View style={progressStyles.statsRow}>
                <View style={[progressStyles.statChip, { backgroundColor: colors.accentSoft }]}>
                  <Text style={[progressStyles.statNum, { color: colors.accent, fontFamily: 'Inter_600SemiBold' }]}>
                    {totalAttempts}
                  </Text>
                  <Text style={[progressStyles.statLabel, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                    Total
                  </Text>
                </View>
                <View style={[progressStyles.statChip, { backgroundColor: 'rgba(99,102,241,0.1)' }]}>
                  <Ionicons name="headset-outline" size={13} color="#6366f1" style={{ marginBottom: 2 }} />
                  <Text style={[progressStyles.statNum, { color: '#6366f1', fontFamily: 'Inter_600SemiBold' }]}>
                    {bestListening > 0 ? `${bestListening}%` : '—'}
                  </Text>
                  <Text style={[progressStyles.statLabel, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                    Best Listening
                  </Text>
                </View>
                <View style={[progressStyles.statChip, { backgroundColor: 'rgba(20,184,166,0.1)' }]}>
                  <Ionicons name="book-outline" size={13} color="#14b8a6" style={{ marginBottom: 2 }} />
                  <Text style={[progressStyles.statNum, { color: '#14b8a6', fontFamily: 'Inter_600SemiBold' }]}>
                    {bestReading > 0 ? `${bestReading}%` : '—'}
                  </Text>
                  <Text style={[progressStyles.statLabel, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                    Best Reading
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={[progressStyles.divider, { backgroundColor: colors.border }]} />

              {/* Recent Attempts */}
              {progressLoading ? (
                <View style={progressStyles.loadingWrap}>
                  <ActivityIndicator size="small" color={colors.accent} />
                </View>
              ) : recentAttempts.length === 0 ? (
                <View style={progressStyles.emptyWrap}>
                  <Ionicons name="stats-chart-outline" size={28} color={colors.textSecondary} />
                  <Text style={[progressStyles.emptyText, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                    No quizzes completed yet
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
                      <View style={progressStyles.attemptRow}>
                        <View style={[
                          progressStyles.attemptIcon,
                          { backgroundColor: isListening ? 'rgba(99,102,241,0.12)' : 'rgba(20,184,166,0.12)' },
                        ]}>
                          <Ionicons
                            name={isListening ? 'headset-outline' : 'book-outline'}
                            size={17}
                            color={isListening ? '#6366f1' : '#14b8a6'}
                          />
                        </View>
                        <View style={progressStyles.attemptInfo}>
                          <Text style={[progressStyles.attemptTitle, { color: colors.text, fontFamily: 'Inter_500Medium' }]}>
                            {isListening ? 'Listening' : 'Reading'} · Form {attempt.form_number}
                          </Text>
                          <Text style={[progressStyles.attemptDate, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                            {date} · {attempt.score}/{attempt.total_questions} correct
                          </Text>
                        </View>
                        <View style={[
                          progressStyles.percentBadge,
                          { backgroundColor: passed ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)' },
                        ]}>
                          <Text style={[
                            progressStyles.percentText,
                            { color: passed ? '#10b981' : '#ef4444', fontFamily: 'Inter_600SemiBold' },
                          ]}>
                            {attempt.percentage}%
                          </Text>
                        </View>
                      </View>
                      {!isLast && <View style={[progressStyles.divider, { backgroundColor: colors.border }]} />}
                    </View>
                  );
                })
              )}
            </MotiView>
          </>
        )}

        {/* ── Preferences ── */}
        <SectionHeader label="Preferences" color={colors.textSecondary} />

        <MotiView
          from={{ opacity: 0, translateX: -14 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 340, delay: 300 }}
          style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
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
              <View style={[styles.menuIconWrap, { backgroundColor: colors.accentIcon }]}>
                <Ionicons name="contrast" size={19} color={colors.accent} />
              </View>
              <View>
                <Text style={[styles.menuLabel, { color: colors.text, fontFamily: 'Inter_500Medium' }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.menuSub, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                  {isDark ? 'On — switch to light' : 'Off — switch to dark'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleTheme();
              }}
              trackColor={{ false: colors.border, true: colors.accentSoft }}
              thumbColor={isDark ? colors.accent : colors.surface}
            />
          </TouchableOpacity>
        </MotiView>

        {/* ── Support ── */}
        <SectionHeader label="Support" color={colors.textSecondary} />

        <MotiView
          from={{ opacity: 0, translateX: -14 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 340, delay: 360 }}
          style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <MenuItem
            icon="help-circle"
            iconBg="rgba(20,184,166,0.12)"
            iconColor="#14b8a6"
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
            iconBg="rgba(249,115,22,0.12)"
            iconColor="#f97316"
            label="Terms & Conditions"
            sub="Read our policies"
            textColor={colors.text}
            subtextColor={colors.textSecondary}
            onPress={() => {}}
          />
        </MotiView>

        {/* ── Logout ── */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 340, delay: 420 }}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleLogout}
            style={[styles.logoutBtn, { borderColor: colors.errorSoft }]}
          >
            <View style={[styles.logoutIconWrap, { backgroundColor: colors.errorSoft }]}>
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
          <Text style={[styles.versionText, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
            ECL · Version {APP_VERSION}
          </Text>
        </MotiView>
      </ScrollView>
    </View>
  );
}

// ── Sub-components ───────────────────────────────────────────────

function SectionHeader({ label, color }) {
  return (
    <Text style={[sectionStyles.label, { color, fontFamily: 'Inter_400Regular' }]}>
      {label.toUpperCase()}
    </Text>
  );
}

const sectionStyles = StyleSheet.create({
  label: {
    fontSize: 11, letterSpacing: 1.3,
    marginBottom: 10, marginTop: 20, paddingHorizontal: 4,
  },
});

function MenuItem({ icon, iconBg, iconColor, label, sub, textColor, subtextColor, onPress, showDivider, borderColor }) {
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
          <View style={[menuStyles.iconWrap, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={19} color={iconColor} />
          </View>
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
        <Ionicons name="chevron-forward" size={18} color={subtextColor} />
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
    paddingHorizontal: 16, paddingVertical: 14,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconWrap: {
    width: 40, height: 40, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
  },
  label: { fontSize: 15 },
  sub: { fontSize: 12, marginTop: 1 },
  divider: { height: 1, marginHorizontal: 16 },
});

// ── Main styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  heroWrap: {
    borderRadius: 24, overflow: 'hidden', marginBottom: 4,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28, shadowRadius: 16, elevation: 8,
  },
  heroGradient: {
    paddingVertical: 32, paddingHorizontal: 24,
    alignItems: 'center', overflow: 'hidden', position: 'relative',
  },
  heroBlob1: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50, right: -30,
  },
  heroBlob2: {
    position: 'absolute',
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -25, left: -15,
  },
  heroBlob3: {
    position: 'absolute',
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: 24, left: 32,
  },
  avatarWrap: { marginBottom: 16, position: 'relative' },
  avatarRing: {
    padding: 4, borderRadius: 60,
    borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarLetter: { fontSize: 38, color: '#7c3aed' },
  roleBadge: {
    position: 'absolute', bottom: 6, right: 6,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#7c3aed',
    borderWidth: 2.5, borderColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  heroName: { fontSize: 24, color: '#ffffff', textAlign: 'center', marginBottom: 6 },
  emailRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 5, justifyContent: 'center', marginBottom: 16,
  },
  heroEmail: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  memberPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
  },
  memberBrand: { fontSize: 12, color: '#ffffff', letterSpacing: 2 },
  pillDivider: {
    width: 1, height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 2,
  },
  memberRole: { fontSize: 12, color: '#ffffff' },

  menuCard: {
    borderRadius: 16, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  menuRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  menuIconWrap: {
    width: 40, height: 40, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
  },
  menuLabel: { fontSize: 15 },
  menuSub: { fontSize: 12, marginTop: 1 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
    paddingVertical: 15, borderRadius: 16, borderWidth: 1, marginTop: 20,
  },
  logoutIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  logoutText: { fontSize: 16 },

  versionWrap: { alignItems: 'center', marginTop: 24 },
  versionText: { fontSize: 12 },
});

const progressStyles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 2,
  },
  statNum: { fontSize: 18 },
  statLabel: { fontSize: 10, textAlign: 'center' },
  divider: { height: 1, marginHorizontal: 16 },
  loadingWrap: { paddingVertical: 24, alignItems: 'center' },
  emptyWrap: {
    paddingVertical: 28,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: { fontSize: 13 },
  attemptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  attemptIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attemptInfo: { flex: 1 },
  attemptTitle: { fontSize: 14 },
  attemptDate: { fontSize: 12, marginTop: 2 },
  percentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  percentText: { fontSize: 14 },
});
