import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { fetchQuizQuestionCounts } from '../../lib/api';

// ── Category chip data ────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'listening', label: 'Listening', emoji: '🎧', bg: '#7c3aed', route: '/(tabs)/listening' },
  { id: 'reading',   label: 'Reading',   emoji: '📖', bg: '#0891b2', route: '/(tabs)/reading' },
  { id: 'grammar',   label: 'Grammar',   emoji: '✏️', bg: '#059669', route: '/(tabs)/grammar' },
  { id: 'learn',     label: 'Guide',     emoji: '💡', bg: '#d97706', route: '/learn/grammar' },
  { id: 'quest',     label: 'Quest',     emoji: '🎮', bg: '#dc2626', route: '/(tabs)/quest' },
];

// ── Activity card data ────────────────────────────────────────────────────
const ACTIVITIES = [
  {
    id: 'guide',
    title: 'Grammar Guide',
    sub: 'Interactive lessons',
    emoji: '📚',
    badge: 'NEW',
    gradients: ['#4f46e5', '#7c3aed', '#a855f7'],
    route: '/learn/grammar',
  },
  {
    id: 'quest',
    title: 'Daily Quest',
    sub: 'Games & challenges',
    emoji: '🏆',
    badge: 'HOT',
    gradients: ['#0f766e', '#0d9488', '#2dd4bf'],
    route: '/(tabs)/quest',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user, profile } = useAuth();
  const [counts, setCounts] = useState({ listening: 0, reading: 0, grammar: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizQuestionCounts()
      .then(setCounts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const greetingEmoji = hour < 12 ? '☀️' : hour < 18 ? '⛅' : '🌙';
  const userName = profile?.full_name || user?.user_metadata?.full_name || 'Guest';
  const initial = userName.charAt(0).toUpperCase();
  const total = counts.listening + counts.reading + counts.grammar;

  const handleNav = (route) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(route);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      {/* ── Full-page gradient hero background ── */}
      <LinearGradient
        colors={isDark
          ? ['#1a0840', '#2e1065', '#1e1b4b']
          : ['#4338ca', '#5b21b6', '#7c3aed']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroBg, { height: insets.top + 280 }]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 110 },
        ]}
      >

        {/* ── Header ── */}
        <MotiView
          from={{ opacity: 0, translateY: -14 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          style={styles.header}
        >
          <View style={styles.greetingCol}>
            <Text style={[styles.greetingLine, { fontFamily: 'Poppins_700Bold' }]}>
              {greetingEmoji}  {greeting}
            </Text>
            <Text style={[styles.userName, { fontFamily: 'Poppins_800ExtraBold' }]}>
              {userName} 👋
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleNav('/(tabs)/profile')}
            activeOpacity={0.85}
            style={styles.avatarRing}
          >
            <LinearGradient colors={['#5b21b6', '#7c3aed']} style={styles.avatarBtn}>
              <Text style={[styles.avatarLetter, { fontFamily: 'Poppins_800ExtraBold' }]}>
                {initial}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        {/* ── Featured Practice Card ── */}
        <MotiView
          from={{ opacity: 0, scale: 0.94, translateY: 12 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 16, delay: 70 }}
        >
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => handleNav('/(tabs)/listening')}
            style={styles.featuredCard}
          >
            {/* Solid white card on blue hero — high contrast */}
            <LinearGradient
              colors={isDark ? ['#1e293b', '#0f172a'] : ['#ffffff', '#f5f3ff']}
              style={styles.featuredInner}
            >
              <View style={styles.featuredDecor1} />
              <View style={styles.featuredDecor2} />

              <View style={styles.featuredLeft}>
                <View style={styles.featuredBadge}>
                  <Text style={[styles.featuredBadgeText, { fontFamily: 'Poppins_800ExtraBold' }]}>
                    🔥 TODAY'S CHALLENGE
                  </Text>
                </View>
                <Text style={[styles.featuredTitle, { color: isDark ? '#f1f5f9' : '#0f172a', fontFamily: 'Poppins_800ExtraBold', paddingTop:22 }]}>
                  Start your{'\n'}daily practice!
                </Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.featuredStat}>
                    <Ionicons name="help-circle" size={13} color="#7c3aed" />
                    <Text style={[styles.featuredStatText, { color: isDark ? '#94a3b8' : '#475569', fontFamily: 'Poppins_700Bold' }]}>
                      {loading ? '…' : `${total} Questions`}
                    </Text>
                  </View>
                  <View style={[styles.featuredStatDot, { backgroundColor: isDark ? '#334155' : '#cbd5e1' }]} />
                  <View style={styles.featuredStat}>
                    <Ionicons name="layers" size={13} color="#7c3aed" />
                    <Text style={[styles.featuredStatText, { color: isDark ? '#94a3b8' : '#475569', fontFamily: 'Poppins_700Bold' }]}>
                      3 Topics
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.featuredEmojiWrap}>
                <Text style={styles.featuredEmoji}>🎓</Text>
                <View style={styles.startPill}>
                  <Text style={[styles.startPillText, { fontFamily: 'Poppins_800ExtraBold' }]}>
                    START
                  </Text>
                  <Ionicons name="arrow-forward" size={12} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        {/* ── Quiz Cards Row ── */}
        <View style={[styles.cardSection, { backgroundColor: colors.background }]}>

          {/* ── Quiz Categories ── */}
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
              Practice
            </Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
              Choose a topic
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {CATEGORIES.map((cat, i) => (
              <MotiView
                key={cat.id}
                from={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: 80 + i * 60, damping: 14 }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleNav(cat.route)}
                  style={styles.chip}
                >
                  <View style={[styles.chipIconWrap, { backgroundColor: cat.bg }]}>
                    <Text style={styles.chipEmoji}>{cat.emoji}</Text>
                  </View>
                  <Text style={[styles.chipLabel, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </ScrollView>

          {/* ── Activity cards ── */}
          <View style={styles.sectionRow2}>
            <Text style={[styles.sectionTitle2, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
              More Activities
            </Text>
          </View>

          <View style={styles.activitiesRow}>
            {ACTIVITIES.map((act, i) => (
              <MotiView
                key={act.id}
                from={{ opacity: 0, translateY: 16 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', damping: 16, delay: 80 + i * 80 }}
                style={styles.activityWrap}
              >
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => handleNav(act.route)}
                  style={[styles.activityCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                >
                  <View style={styles.activityGrad}>
                    <View style={[styles.activityBadge, { backgroundColor: colors.border }]}>
                      <Text style={[styles.activityBadgeText, { color: colors.textSecondary, fontFamily: 'Poppins_800ExtraBold' }]}>
                        {act.badge}
                      </Text>
                    </View>
                    <Text style={styles.activityEmoji}>{act.emoji}</Text>
                    <Text style={[styles.activityTitle, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
                      {act.title}
                    </Text>
                    <Text style={[styles.activitySub, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
                      {act.sub}
                    </Text>
                    <View style={[styles.activityArrow, { backgroundColor: colors.border }]}>
                      <Ionicons name="arrow-forward" size={14} color={colors.textSecondary} />
                    </View>
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>

          {/* ── Stats overview ── */}
          {!loading && total > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 14 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 16, delay: 200 }}
              style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.statsHeader}>
                <View style={[styles.statsAccentBar, { backgroundColor: colors.accent }]} />
                <Text style={[styles.statsTitle, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
                  Question Bank
                </Text>
              </View>
              <View style={styles.statsRow}>
                <StatCell
                  emoji="🎧"
                  label="Listening"
                  count={counts.listening}
                  color={colors.listeningAccent}
                  pct={total > 0 ? Math.round(counts.listening / total * 100) : 0}
                />
                <StatCell
                  emoji="📖"
                  label="Reading"
                  count={counts.reading}
                  color={colors.readingAccent}
                  pct={total > 0 ? Math.round(counts.reading / total * 100) : 0}
                />
                <StatCell
                  emoji="✏️"
                  label="Grammar"
                  count={counts.grammar}
                  color={colors.grammarAccent}
                  pct={total > 0 ? Math.round(counts.grammar / total * 100) : 0}
                />
              </View>
            </MotiView>
          )}

        </View>

      </ScrollView>
    </View>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCell({ emoji, label, count, color, pct }) {
  const { colors } = useTheme();
  return (
    <View style={styles.statCell}>
      <View style={[styles.statIconWrap, { backgroundColor: color + '18' }]}>
        <Text style={styles.statEmoji}>{emoji}</Text>
      </View>
      <Text style={[styles.statCount, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
        {count}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
        {label}
      </Text>
      <View style={[styles.statBar, { backgroundColor: colors.border }]}>
        <View style={[styles.statBarFill, { backgroundColor: color, width: `${pct}%` }]} />
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  heroBg: {
    position: 'absolute', top: 0, left: 0, right: 0,
  },

  scroll: { paddingHorizontal: 20 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 22,
  },
  greetingCol: { gap: 1 },
  greetingLine: { fontSize: 15, color: 'rgba(255,255,255,0.75)' },
  userName: { fontSize: 26, color: '#ffffff' },
  avatarRing: {
    borderRadius: 26, borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.35)',
    padding: 2,
    elevation: 8,
    shadowColor: '#7c3aed', shadowOpacity: 0.45,
    shadowRadius: 14, shadowOffset: { width: 0, height: 4 },
  },
  avatarBtn: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { fontSize: 26, color: '#ffffff' },

  // Featured card
  featuredCard: {
    borderRadius: 26, overflow: 'hidden', marginBottom: 15,
    elevation: 12,
    shadowColor: '#000', shadowOpacity: 0.35,
    shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
  },
  featuredInner: {
    flexDirection: 'row', alignItems: 'center',
    padding: 22, borderRadius: 26,
    borderWidth: 1.5, borderColor: 'rgba(37,99,235,0.15)',
    overflow: 'hidden',
  },
  featuredDecor1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -70, right: -50,
  },
  featuredDecor2: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, left: 20,
  },
  featuredLeft: { flex: 1, gap: 8 },
  featuredBadge: {
    backgroundColor: '#7c3aed',
    alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8,
  },
  featuredBadgeText: { fontSize: 14, color: '#fff', letterSpacing: 0.8 , paddingBottom:22},
  featuredTitle: { fontSize: 22, lineHeight: 22, marginBottom:12, paddingBottom:22 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featuredStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  featuredStatText: { fontSize: 11 },
  featuredStatDot: {
    width: 3, height: 3, borderRadius: 1.5,
  },
  featuredEmojiWrap: { alignItems: 'center', gap: 12 },
  featuredEmoji: { fontSize: 54 },
  startPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20,
  },
  startPillText: { fontSize: 12, color: '#fff', letterSpacing: 0.8 },

  // Section headers
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'baseline', marginBottom: 14,
  },
  sectionTitle: { fontSize: 20 },
  sectionSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)' , alignItems: 'center', justifyContent: 'center', gap: 2, paddingBottom:12, paddingTop:12 },

  // Category chips (horizontal scroll)
  chipsScroll: {
    paddingRight: 20, gap: 14, marginBottom: 6,
    paddingBottom: 8,
  },
  chip: { alignItems: 'center', gap: 8 },
  chipIconWrap: {
    width: 62, height: 62, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.3,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  chipEmoji: { fontSize: 28 },
  chipLabel: { fontSize: 11, textAlign: 'center' },

  // Transition to content area
  cardSection: {
    marginHorizontal: -20, paddingHorizontal: 20,
    marginTop: 20, paddingTop: 35,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
  },
  sectionRow2: { marginBottom: 14 },
  sectionTitle2: { fontSize: 20 },

  // Quiz cards (3-col)
  quizRow: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  quizCardWrap: { flex: 1 , alignItems:'center'},
  quizCardGrad: {
    borderRadius: 22, paddingTop: 16, paddingBottom: 14,
    paddingHorizontal: 30, minHeight: 100,
    justifyContent: 'center', overflow: 'hidden',
  },
  quizCardDecor: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)', top: -25, right: -25,
  },
  quizCardEmoji: { fontSize: 30, marginBottom: 4 },
  quizCardCount: { fontSize: 22, color: '#ffffff' },
  quizCardQs: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: -2 },
  quizCardFooter: { marginTop: 8 },
  quizCardTitle: { fontSize: 13, color: '#ffffff' },

  // Activity cards (2-col)
  activitiesRow: { flexDirection: 'row', gap: 10, marginBottom: 20, justifyContent: 'center' },
  activityWrap: { flex: 1 },
  activityCard: {
    borderRadius: 22, overflow: 'hidden', borderWidth: 1.5,
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.08,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
  },
  activityGrad: {
    paddingTop: 14, paddingBottom: 14, paddingHorizontal: 14,
    minHeight: 148, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  activityDecor: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.08)', top: -35, right: -28,
  },
  activityBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 6,
  },
  activityBadgeText: { fontSize: 9, color: '#fff', letterSpacing: 1 },
  activityEmoji: { fontSize: 34, marginBottom: 6, textAlign: 'center' },
  activityTitle: { fontSize: 14, color: '#ffffff', marginBottom: 2, textAlign: 'center' },
  activitySub: { fontSize: 10, color: 'rgba(255,255,255,0.72)', textAlign: 'center' },
  activityArrow: {
    marginTop: 10,
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Stats card
  statsCard: {
    borderRadius: 24, borderWidth: 1.5, padding: 20, marginBottom: 16,
    elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10,
  },
  statsHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  statsAccentBar: { width: 4, height: 20, borderRadius: 2 },
  statsTitle: { fontSize: 18 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCell: { flex: 1, alignItems: 'center', gap: 6 },
  statIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  statEmoji: { fontSize: 26 },
  statCount: { fontSize: 20 },
  statLabel: { fontSize: 16 },
  statBar: {
    width: '80%', height: 6, borderRadius: 4, overflow: 'hidden',
  },
  statBarFill: { height: 6, borderRadius: 4 },
});
