import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet,
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
import { spacing, font, fontSize, gradients, radius, shadow, categoryColors } from '@/theme/tokens';

// ── Category chip data ────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'listening', label: 'Listening', emoji: '🎧', bg: categoryColors.Listening, route: '/(tabs)/listening' },
  { id: 'reading',   label: 'Reading',   emoji: '📖', bg: categoryColors.Reading,   route: '/(tabs)/reading' },
  { id: 'grammar',   label: 'Grammar',   emoji: '✏️', bg: categoryColors.Grammar,   route: '/(tabs)/grammar' },
  { id: 'learn',     label: 'Guide',     emoji: '💡', bg: categoryColors.Guide,     route: '/learn/grammar' },
  { id: 'quest',     label: 'Quest',     emoji: '🎮', bg: categoryColors.Quest,     route: '/(tabs)/quest' },
];

// ── Activity card data ────────────────────────────────────────────────────
const ACTIVITIES = [
  {
    id: 'guide',
    title: 'Grammar Guide',
    sub: 'Interactive lessons',
    emoji: '📚',
    badge: 'NEW',
    route: '/learn/grammar',
  },
  {
    id: 'quest',
    title: 'Daily Quest',
    sub: 'Games & challenges',
    emoji: '🏆',
    badge: 'HOT',
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

  const cardShadow = isDark ? shadow.card.dark : shadow.card.light;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      {/* ── Hero gradient background ── */}
      <LinearGradient
        colors={isDark ? gradients.homeHero.dark : gradients.homeHero.light}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.heroBg, { height: insets.top + 280 }]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing.md + 2, paddingBottom: insets.bottom + spacing.tabBarClear },
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
            <Text style={[styles.greetingLine, { fontFamily: font.bold }]}>
              {greetingEmoji}  {greeting}
            </Text>
            <Text style={[styles.userName, { fontFamily: font.extraBold }]}>
              {userName} 👋
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleNav('/(tabs)/profile')}
            activeOpacity={0.85}
            style={styles.avatarRing}
          >
            <LinearGradient colors={gradients.avatarButton} style={styles.avatarBtn}>
              <Text style={[styles.avatarLetter, { fontFamily: font.extraBold }]}>
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
            style={[styles.featuredCard, cardShadow]}
          >
            <LinearGradient
              colors={isDark ? gradients.featuredCard.dark : gradients.featuredCard.light}
              style={[styles.featuredInner, { borderColor: isDark ? colors.border : 'rgba(124,58,237,0.12)' }]}
            >
              <View style={styles.featuredDecor1} />
              <View style={styles.featuredDecor2} />

              <View style={styles.featuredLeft}>
                <View style={[styles.featuredBadge, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.featuredBadgeText, { fontFamily: font.extraBold }]}>
                    🔥 TODAY'S CHALLENGE
                  </Text>
                </View>
                <Text style={[styles.featuredTitle, { color: colors.text, fontFamily: font.extraBold }]}>
                  Start your{'\n'}daily practice!
                </Text>
                <View style={styles.featuredMeta}>
                  <View style={styles.featuredStat}>
                    <Ionicons name="help-circle" size={13} color={colors.accent} />
                    <Text style={[styles.featuredStatText, { color: colors.textSecondary, fontFamily: font.bold }]}>
                      {loading ? '…' : `${total} Questions`}
                    </Text>
                  </View>
                  <View style={[styles.featuredStatDot, { backgroundColor: colors.border }]} />
                  <View style={styles.featuredStat}>
                    <Ionicons name="layers" size={13} color={colors.accent} />
                    <Text style={[styles.featuredStatText, { color: colors.textSecondary, fontFamily: font.bold }]}>
                      3 Topics
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.featuredEmojiWrap}>
                <Text style={styles.featuredEmoji}>🎓</Text>
                <View style={[styles.startPill, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.startPillText, { fontFamily: font.extraBold }]}>
                    START
                  </Text>
                  <Ionicons name="arrow-forward" size={12} color="#fff" />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        {/* ── Content Section ── */}
        <View style={[styles.cardSection, { backgroundColor: colors.background }]}>

          {/* ── Practice Categories ── */}
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: font.extraBold }]}>
              Practice
            </Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary, fontFamily: font.bold }]}>
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
                  <Text style={[styles.chipLabel, { color: colors.text, fontFamily: font.bold }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </ScrollView>

          {/* ── More Activities ── */}
          <View style={styles.sectionRow2}>
            <Text style={[styles.sectionTitle2, { color: colors.text, fontFamily: font.extraBold }]}>
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
                  style={[
                    styles.activityCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    cardShadow,
                  ]}
                >
                  <View style={styles.activityContent}>
                    <View style={[styles.activityBadge, { backgroundColor: colors.accentSoft }]}>
                      <Text style={[styles.activityBadgeText, { color: colors.accent, fontFamily: font.extraBold }]}>
                        {act.badge}
                      </Text>
                    </View>
                    <Text style={styles.activityEmoji}>{act.emoji}</Text>
                    <Text style={[styles.activityTitle, { color: colors.text, fontFamily: font.extraBold }]}>
                      {act.title}
                    </Text>
                    <Text style={[styles.activitySub, { color: colors.textSecondary, fontFamily: font.bold }]}>
                      {act.sub}
                    </Text>
                    <View style={[styles.activityArrow, { backgroundColor: colors.accentSoft }]}>
                      <Ionicons name="arrow-forward" size={14} color={colors.accent} />
                    </View>
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>

          {/* ── Question Bank Stats ── */}
          {!loading && total > 0 && (
            <MotiView
              from={{ opacity: 0, translateY: 14 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 16, delay: 200 }}
              style={[
                styles.statsCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
                cardShadow,
              ]}
            >
              <View style={styles.statsHeader}>
                <View style={[styles.statsAccentBar, { backgroundColor: colors.accent }]} />
                <Text style={[styles.statsTitle, { color: colors.text, fontFamily: font.extraBold }]}>
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
      <Text style={[styles.statCount, { color: colors.text, fontFamily: font.extraBold }]}>
        {count}
      </Text>
      <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: font.bold }]}>
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

  heroBg: { position: 'absolute', top: 0, left: 0, right: 0 },

  scroll: { paddingHorizontal: spacing.screenH },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.lg - 2,
  },
  greetingCol: { gap: spacing.xs / 2 },
  greetingLine: { fontSize: fontSize.label, color: 'rgba(255,255,255,0.75)' },
  userName: { fontSize: fontSize.heroHeading, color: '#ffffff' },
  avatarRing: {
    borderRadius: radius.xl / 2,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.35)',
    padding: spacing.xs / 2,
  },
  avatarBtn: {
    width: 46, height: 46,
    borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: { fontSize: fontSize.heroHeading, color: '#ffffff' },

  // Featured card
  featuredCard: {
    borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.md - 1,
  },
  featuredInner: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.lg - 2, borderRadius: radius.lg,
    borderWidth: 1.5, overflow: 'hidden',
  },
  featuredDecor1: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -70, right: -50,
  },
  featuredDecor2: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, left: 20,
  },
  featuredLeft: { flex: 1, gap: spacing.sm },
  featuredBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs,
    borderRadius: spacing.sm,
  },
  featuredBadgeText: { fontSize: fontSize.meta, color: '#fff', letterSpacing: 0.8, paddingBottom: spacing.lg - 2 },
  featuredTitle: { fontSize: fontSize.cardTitle, lineHeight: fontSize.cardTitle, marginBottom: spacing.sm + 4, paddingBottom: spacing.lg - 2 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  featuredStat: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  featuredStatText: { fontSize: fontSize.eyebrow },
  featuredStatDot: { width: 3, height: 3, borderRadius: 1.5 },
  featuredEmojiWrap: { alignItems: 'center', gap: spacing.sm + 4 },
  featuredEmoji: { fontSize: 54 },
  startPill: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingHorizontal: spacing.md - 2, paddingVertical: spacing.sm,
    borderRadius: spacing.xl / 2,
  },
  startPillText: { fontSize: fontSize.badge, color: '#fff', letterSpacing: 0.8 },

  // Section headers
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'baseline', marginBottom: spacing.md - 2,
  },
  sectionTitle: { fontSize: fontSize.sectionTitle },
  sectionSub: { fontSize: fontSize.meta, paddingBottom: spacing.sm + 4, paddingTop: spacing.sm + 4 },

  // Category chips
  chipsScroll: {
    paddingRight: spacing.screenH, gap: spacing.md - 2,
    marginBottom: spacing.xs + 2, paddingBottom: spacing.sm,
  },
  chip: { alignItems: 'center', gap: spacing.sm },
  chipIconWrap: {
    width: 62, height: 62, borderRadius: spacing.md + 4,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.3,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  chipEmoji: { fontSize: 28 },
  chipLabel: { fontSize: fontSize.eyebrow, textAlign: 'center' },

  // Content section
  cardSection: {
    marginHorizontal: -spacing.screenH, paddingHorizontal: spacing.screenH,
    marginTop: spacing.md, paddingTop: 35,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
  },
  sectionRow2: { marginBottom: spacing.md - 2 },
  sectionTitle2: { fontSize: fontSize.sectionTitle },

  // Activity cards
  activitiesRow: { flexDirection: 'row', gap: spacing.sm + 2, marginBottom: spacing.md + 4, justifyContent: 'center' },
  activityWrap: { flex: 1 },
  activityCard: {
    borderRadius: radius.md + 2, overflow: 'hidden', borderWidth: 1.5,
  },
  activityContent: {
    paddingTop: spacing.md - 2, paddingBottom: spacing.md - 2, paddingHorizontal: spacing.md - 2,
    minHeight: 148,
    alignItems: 'center', justifyContent: 'center',
  },
  activityBadge: {
    alignSelf: 'center',
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs - 1,
    borderRadius: spacing.xs + 2, marginBottom: spacing.xs + 2,
  },
  activityBadgeText: { fontSize: fontSize.eyebrow - 2, letterSpacing: 1 },
  activityEmoji: { fontSize: 34, marginBottom: spacing.xs + 2, textAlign: 'center' },
  activityTitle: { fontSize: fontSize.meta, marginBottom: spacing.xs / 2, textAlign: 'center' },
  activitySub: { fontSize: fontSize.subLabel, textAlign: 'center' },
  activityArrow: {
    marginTop: spacing.sm + 2,
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },

  // Stats card
  statsCard: {
    borderRadius: radius.lg - 4, borderWidth: 1.5,
    padding: spacing.md + 4, marginBottom: spacing.md,
  },
  statsHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 2, marginBottom: spacing.md + 2 },
  statsAccentBar: { width: 4, height: 20, borderRadius: spacing.xs / 2 },
  statsTitle: { fontSize: fontSize.button },
  statsRow: { flexDirection: 'row', gap: spacing.sm },
  statCell: { flex: 1, alignItems: 'center', gap: spacing.xs + 2 },
  statIconWrap: {
    width: 48, height: 48, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  statEmoji: { fontSize: 26 },
  statCount: { fontSize: fontSize.sectionTitle },
  statLabel: { fontSize: fontSize.body },
  statBar: { width: '80%', height: 6, borderRadius: spacing.xs / 2, overflow: 'hidden' },
  statBarFill: { height: 6, borderRadius: spacing.xs / 2 },
});
