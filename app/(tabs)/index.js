import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { fetchQuizQuestionCounts } from '../../lib/api';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { user, profile } = useAuth();
  const [questionCounts, setQuestionCounts] = useState({ listening: 0, reading: 0, grammar: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const counts = await fetchQuizQuestionCounts();
        setQuestionCounts(counts);
      } catch (e) {
        console.warn('Failed to load stats:', e.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const greetingIcon = hour < 12 ? '☀️' : hour < 18 ? '⛅' : '🌙';
  const userName = profile?.full_name || user?.user_metadata?.full_name || 'Student';

  const totalListeningQs = questionCounts.listening;
  const totalReadingQs = questionCounts.reading;
  const totalGrammarQs = questionCounts.grammar;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24 }]}
      >
        {/* ── Header ── */}
        <MotiView
          from={{ opacity: 0, translateY: -16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          style={styles.headerRow}
        >
          <View style={styles.greetingBlock}>
            <Text style={[styles.greetingLine, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              {greetingIcon}  {greeting}
            </Text>
            <Text style={[styles.userName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
              {userName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/profile');
            }}
            activeOpacity={0.85}
            style={[styles.avatarBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={[styles.avatarLetter, { color: '#ffffff', fontFamily: 'Inter_600SemiBold' }]}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* ── Hero card ── */}
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 16, delay: 80 }}
          style={[styles.heroWrap, { shadowColor: colors.accent }]}
        >
          <LinearGradient
            colors={colors.gradientHero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroGlow1} />
            <View style={styles.heroGlow2} />
            <View style={styles.heroInner}>
              <View style={styles.heroText}>
                <View style={styles.heroBadge}>
                  <Text style={[styles.heroBadgeText, { fontFamily: 'Inter_600SemiBold' }]}>
                    Daily Practice
                  </Text>
                </View>
                <Text style={[styles.heroTitle, { fontFamily: 'Inter_600SemiBold' }]}>
                  Ready to{'\n'}level up?
                </Text>
                <Text style={[styles.heroSub, { fontFamily: 'Inter_400Regular' }]}>
                  Master listening, reading & grammar today.
                </Text>
              </View>
              <View style={styles.heroIcon}>
                <Ionicons name="school" size={34} color="#ffffff" />
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* ── Section header ── */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 150 }}
          style={styles.sectionRow}
        >
          <View style={[styles.sectionAccentBar, { backgroundColor: colors.accent }]} />
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
            Start Your Quiz
          </Text>
        </MotiView>

        {/* ── Quiz cards (three columns) — counts from DB ── */}
        <View style={styles.cardRowThree}>
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 200 }}
            style={styles.cardWrapThree}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/(tabs)/listening');
              }}
              style={styles.cardTouch}
            >
              <LinearGradient
                colors={colors.gradientListening}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradientThree}
              >
                <View style={styles.cardRingSmall} />
                <View style={styles.cardIconWrapThree}>
                  <Ionicons name="headset" size={22} color="#ffffff" />
                </View>
                <View style={styles.cardBottomThree}>
                  <Text style={[styles.cardTitleThree, { fontFamily: 'Inter_600SemiBold' }]}>Listening</Text>
                  <Text style={[styles.cardSubThree, { fontFamily: 'Inter_400Regular' }]}>Audio</Text>
                  {!loading && (
                    <View style={styles.cardBadgeThree}>
                      <Text style={[styles.cardBadgeTextThree, { fontFamily: 'Inter_600SemiBold' }]}>
                        {totalListeningQs} Qs
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 260 }}
            style={styles.cardWrapThree}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/(tabs)/reading');
              }}
              style={styles.cardTouch}
            >
              <LinearGradient
                colors={colors.gradientReading}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradientThree}
              >
                <View style={styles.cardRingSmall} />
                <View style={styles.cardIconWrapThree}>
                  <Ionicons name="book" size={22} color="#ffffff" />
                </View>
                <View style={styles.cardBottomThree}>
                  <Text style={[styles.cardTitleThree, { fontFamily: 'Inter_600SemiBold' }]}>Reading</Text>
                  <Text style={[styles.cardSubThree, { fontFamily: 'Inter_400Regular' }]}>Texts</Text>
                  {!loading && (
                    <View style={styles.cardBadgeThree}>
                      <Text style={[styles.cardBadgeTextThree, { fontFamily: 'Inter_600SemiBold' }]}>
                        {totalReadingQs} Qs
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 320 }}
            style={styles.cardWrapThree}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/(tabs)/grammar');
              }}
              style={styles.cardTouch}
            >
              <LinearGradient
                colors={colors.gradientGrammar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradientThree}
              >
                <View style={styles.cardRingSmall} />
                <View style={styles.cardIconWrapThree}>
                  <Ionicons name="language" size={22} color="#ffffff" />
                </View>
                <View style={styles.cardBottomThree}>
                  <Text style={[styles.cardTitleThree, { fontFamily: 'Inter_600SemiBold' }]}>Grammar</Text>
                  <Text style={[styles.cardSubThree, { fontFamily: 'Inter_400Regular' }]}>Usage</Text>
                  {!loading && (
                    <View style={styles.cardBadgeThree}>
                      <Text style={[styles.cardBadgeTextThree, { fontFamily: 'Inter_600SemiBold' }]}>
                        {totalGrammarQs} Qs
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </View>

        {/* ── Stats strip ── */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 380, delay: 320 }}
          style={[styles.statsStrip, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          {loading ? (
            <ActivityIndicator color={colors.accent} size="small" style={styles.statsLoader} />
          ) : (
            <>
              <StatCell
                icon="headset"
                value={totalListeningQs}
                label="Listen"
                iconBg={colors.accentSoft}
                iconColor={colors.listeningAccent}
                textColor={colors.text}
                subColor={colors.textSecondary}
              />
              <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
              <StatCell
                icon="book"
                value={totalReadingQs}
                label="Read"
                iconBg={isDark ? 'rgba(96,165,250,0.12)' : 'rgba(37,99,235,0.08)'}
                iconColor={colors.readingAccent}
                textColor={colors.text}
                subColor={colors.textSecondary}
              />
              <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
              <StatCell
                icon="language"
                value={totalGrammarQs}
                label="Grammar"
                iconBg={isDark ? 'rgba(74,222,128,0.12)' : 'rgba(22,163,74,0.08)'}
                iconColor={colors.grammarAccent}
                textColor={colors.text}
                subColor={colors.textSecondary}
              />
              <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
              <StatCell
                icon="help-circle"
                value={totalListeningQs + totalReadingQs + totalGrammarQs}
                label="Total Qs"
                iconBg={colors.accentIcon}
                iconColor={colors.accent}
                textColor={colors.text}
                subColor={colors.textSecondary}
              />
            </>
          )}
        </MotiView>

        {/* ── Chart: Quiz Distribution ── */}
        {!loading && (totalListeningQs + totalReadingQs + totalGrammarQs) > 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 16, delay: 370 }}
            style={[styles.chartCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            {/* Subtle gradient top glow */}
            <LinearGradient
              colors={isDark
                ? ['rgba(129,140,248,0.10)', 'rgba(129,140,248,0.00)']
                : ['rgba(79,70,229,0.07)', 'rgba(79,70,229,0.00)']}
              style={styles.chartTopGlow}
            />

            {/* Header */}
            <View style={styles.chartHeader}>
              <View style={styles.chartTitleRow}>
                <View style={[styles.chartAccentBar, { backgroundColor: colors.accent }]} />
                <Text style={[styles.chartTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
                  Quiz Overview
                </Text>
              </View>
              <View style={[styles.chartBadge, { backgroundColor: colors.accentSoft }]}>
                <View style={[styles.chartBadgeDot, { backgroundColor: colors.accent }]} />
                <Text style={[styles.chartBadgeText, { color: colors.accent, fontFamily: 'Inter_600SemiBold' }]}>
                  {totalListeningQs + totalReadingQs + totalGrammarQs} questions
                </Text>
              </View>
            </View>

            {/* Donut + Legend */}
            <View style={styles.chartBody}>
              <DonutChart
                listeningTotal={totalListeningQs}
                readingTotal={totalReadingQs}
                grammarTotal={totalGrammarQs}
                listeningColor={colors.listeningAccent}
                readingColor={colors.readingAccent}
                grammarColor={colors.grammarAccent}
                trackColor={isDark ? colors.surfaceAlt : '#e4e4f8'}
                textColor={colors.text}
                subColor={colors.textSecondary}
              />
              <View style={styles.chartLegend}>
                <LegendItem
                  color={colors.listeningAccent}
                  label="Listening"
                  count={totalListeningQs}
                  pct={Math.round(totalListeningQs / (totalListeningQs + totalReadingQs + totalGrammarQs) * 100)}
                  trackBg={isDark ? 'rgba(167,139,250,0.14)' : 'rgba(124,58,237,0.09)'}
                  textColor={colors.text}
                  subColor={colors.textSecondary}
                />
                <LegendItem
                  color={colors.readingAccent}
                  label="Reading"
                  count={totalReadingQs}
                  pct={Math.round(totalReadingQs / (totalListeningQs + totalReadingQs + totalGrammarQs) * 100)}
                  trackBg={isDark ? 'rgba(96,165,250,0.14)' : 'rgba(37,99,235,0.09)'}
                  textColor={colors.text}
                  subColor={colors.textSecondary}
                />
                <LegendItem
                  color={colors.grammarAccent}
                  label="Grammar"
                  count={totalGrammarQs}
                  pct={Math.round(totalGrammarQs / (totalListeningQs + totalReadingQs + totalGrammarQs) * 100) || 0}
                  trackBg={isDark ? 'rgba(74,222,128,0.14)' : 'rgba(22,163,74,0.09)'}
                  textColor={colors.text}
                  subColor={colors.textSecondary}
                />
              </View>
            </View>
          </MotiView>
        )}

        {/* ── Tip card ── */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
          style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[
            styles.tipIcon,
            { backgroundColor: isDark ? 'rgba(251,191,36,0.15)' : 'rgba(217,119,6,0.10)' },
          ]}>
            <Ionicons name="bulb" size={22} color="#fbbf24" />
          </View>
          <View style={styles.tipText}>
            <Text style={[styles.tipTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
              Expert Tip
            </Text>
            <Text style={[styles.tipBody, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              Listen to each audio clip at least twice before selecting your answer to boost retention.
            </Text>
          </View>
        </MotiView>
      </ScrollView>
    </View>
  );
}

function StatCell({ icon, value, label, iconBg, iconColor, textColor, subColor }) {
  return (
    <View style={styles.statCell}>
      <View style={[styles.statIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[styles.statValue, { color: textColor, fontFamily: 'Inter_600SemiBold' }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: subColor, fontFamily: 'Inter_400Regular' }]}>{label}</Text>
    </View>
  );
}

function DonutChart({ listeningTotal, readingTotal, grammarTotal = 0, listeningColor, readingColor, grammarColor, trackColor, textColor, subColor }) {
  const SIZE = 164;
  const STROKE = 20;
  const R = (SIZE - STROKE) / 2;
  const CIRC = 2 * Math.PI * R;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const total = listeningTotal + readingTotal + grammarTotal;

  // Animated progress value: 0 → 1
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (total === 0) return;
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [total]);

  if (total === 0) {
    return (
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={cx} cy={cy} r={R} fill="none" stroke={trackColor} strokeWidth={STROKE} />
      </Svg>
    );
  }

  const lisPct = listeningTotal / total;
  const rdPct  = readingTotal / total;
  const grPct  = grammarTotal / total;
  const GAP_DEG = 6;
  const lisArc = Math.max(0, CIRC * lisPct - (CIRC * GAP_DEG / 360));
  const rdArc  = Math.max(0, CIRC * rdPct - (CIRC * GAP_DEG / 360));
  const grArc  = grammarTotal > 0 ? Math.max(0, CIRC * grPct - (CIRC * GAP_DEG / 360)) : 0;
  const lisDeg = 360 * lisPct;
  const rdDeg  = 360 * rdPct;

  const lisOffset = progress.interpolate({
    inputRange:  [0, 1],
    outputRange: [CIRC, CIRC - lisArc],
  });
  const rdOffset = progress.interpolate({
    inputRange:  [0, 0.2, 1],
    outputRange: [CIRC, CIRC, CIRC - rdArc],
  });
  const grOffset = progress.interpolate({
    inputRange:  [0, 0.4, 1],
    outputRange: [CIRC, CIRC, CIRC - grArc],
  });

  return (
    <Svg width={SIZE} height={SIZE}>
      {/* Background track */}
      <Circle cx={cx} cy={cy} r={R} fill="none" stroke={trackColor} strokeWidth={STROKE} strokeLinecap="butt" />

      {/* Listening arc */}
      <AnimatedCircle
        cx={cx} cy={cy} r={R}
        fill="none"
        stroke={listeningColor}
        strokeWidth={STROKE}
        strokeDasharray={`${CIRC} ${CIRC}`}
        strokeDashoffset={lisOffset}
        strokeLinecap="round"
        transform={`rotate(-90, ${cx}, ${cy})`}
      />

      {/* Reading arc */}
      <AnimatedCircle
        cx={cx} cy={cy} r={R}
        fill="none"
        stroke={readingColor}
        strokeWidth={STROKE}
        strokeDasharray={`${CIRC} ${CIRC}`}
        strokeDashoffset={rdOffset}
        strokeLinecap="round"
        transform={`rotate(${-90 + lisDeg + GAP_DEG}, ${cx}, ${cy})`}
      />

      {/* Grammar arc */}
      {grammarTotal > 0 && (
        <AnimatedCircle
          cx={cx} cy={cy} r={R}
          fill="none"
          stroke={grammarColor}
          strokeWidth={STROKE}
          strokeDasharray={`${CIRC} ${CIRC}`}
          strokeDashoffset={grOffset}
          strokeLinecap="round"
          transform={`rotate(${-90 + lisDeg + rdDeg + GAP_DEG * 2}, ${cx}, ${cy})`}
        />
      )}

      {/* Center labels */}
      <SvgText x={cx} y={cy - 6} textAnchor="middle" fontSize="28" fontFamily="Inter_600SemiBold" fill={textColor}>
        {total}
      </SvgText>
      <SvgText x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fontFamily="Inter_400Regular" fill={subColor}>
        questions
      </SvgText>
    </Svg>
  );
}

function LegendItem({ color, label, count, pct, trackBg, textColor, subColor }) {
  return (
    <View style={legendStyles.item}>
      <View style={legendStyles.topRow}>
        <View style={[legendStyles.dot, { backgroundColor: color }]} />
        <Text style={[legendStyles.label, { color: textColor, fontFamily: 'Inter_500Medium' }]}>{label}</Text>
        <Text style={[legendStyles.pct, { color, fontFamily: 'Inter_600SemiBold' }]}>{pct}%</Text>
      </View>
      <View style={[legendStyles.track, { backgroundColor: trackBg }]}>
        <View style={[legendStyles.fill, { backgroundColor: color, width: `${pct}%` }]} />
      </View>
      <Text style={[legendStyles.count, { color: subColor, fontFamily: 'Inter_400Regular' }]}>
        {count} questions
      </Text>
    </View>
  );
}

const legendStyles = StyleSheet.create({
  item: { gap: 6 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 9, height: 9, borderRadius: 4.5 },
  label: { flex: 1, fontSize: 13 },
  pct: { fontSize: 17 },
  track: { height: 7, borderRadius: 4, overflow: 'hidden' },
  fill: { height: 7, borderRadius: 4 },
  count: { fontSize: 11, opacity: 0.8 },
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },

  // Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greetingBlock: { gap: 2 },
  greetingLine: { fontSize: 13 },
  userName: { fontSize: 26, letterSpacing: -0.5 },
  avatarBtn: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#818cf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  avatarLetter: { fontSize: 18 },

  // Hero
  heroWrap: {
    borderRadius: 28, overflow: 'hidden', marginBottom: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },
  heroGradient: { padding: 24, paddingBottom: 28, overflow: 'hidden' },
  heroGlow1: {
    position: 'absolute', width: 220, height: 220, borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.08)', top: -70, right: -60,
  },
  heroGlow2: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -30, left: -20,
  },
  heroInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroText: { flex: 1, paddingRight: 16 },
  heroBadge: {
    backgroundColor: 'rgba(0,0,0,0.22)', alignSelf: 'flex-start',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12,
  },
  heroBadgeText: { fontSize: 10, color: 'rgba(255,255,255,0.9)', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroTitle: { fontSize: 30, lineHeight: 36, color: '#ffffff', letterSpacing: -0.5, marginBottom: 8 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 19 },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },

  // Section header
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, marginTop: 4 },
  sectionAccentBar: { width: 3, height: 18, borderRadius: 2 },
  sectionTitle: { fontSize: 19, letterSpacing: -0.3 },

  // Action cards (three quiz types)
  cardRowThree: {
    flexDirection: 'row', gap: 8, marginBottom: 20,
    alignItems: 'stretch',
  },
  cardWrapThree: { flex: 1, minWidth: 0 },
  cardTouch: { borderRadius: 24, overflow: 'hidden' },
  cardGradientThree: {
    padding: 12, minHeight: 156, justifyContent: 'space-between',
    overflow: 'hidden', position: 'relative',
  },
  cardRingSmall: {
    position: 'absolute', width: 72, height: 72, borderRadius: 36,
    borderWidth: 10, borderColor: 'rgba(255,255,255,0.08)',
    top: -18, right: -18,
  },
  cardIconWrapThree: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardBottomThree: { gap: 2, marginTop: 6 },
  cardTitleThree: { fontSize: 14, color: '#ffffff', letterSpacing: -0.2 },
  cardSubThree: { fontSize: 10, color: 'rgba(255,255,255,0.68)', marginBottom: 4 },
  cardBadgeThree: {
    backgroundColor: 'rgba(0,0,0,0.22)', alignSelf: 'flex-start',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
  },
  cardBadgeTextThree: { fontSize: 10, color: 'rgba(255,255,255,0.95)' },

  // Stats strip
  statsStrip: {
    flexDirection: 'row', borderRadius: 22, paddingVertical: 18, paddingHorizontal: 8,
    marginBottom: 14, alignItems: 'center', justifyContent: 'space-around',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  statsLoader: { paddingVertical: 16 },
  statCell: { flex: 1, alignItems: 'center', gap: 4 },
  statIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  statValue: { fontSize: 20, letterSpacing: -0.5 },
  statLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, opacity: 0.7 },
  statsDivider: { width: 1, height: 44, borderRadius: 1, opacity: 0.5 },

  // Chart card
  chartCard: {
    borderRadius: 24, borderWidth: 1, marginBottom: 14, overflow: 'hidden',
    shadowColor: '#818cf8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10, shadowRadius: 14, elevation: 4,
  },
  chartTopGlow: { position: 'absolute', top: 0, left: 0, right: 0, height: 90 },
  chartHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4,
  },
  chartTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  chartAccentBar: { width: 3, height: 16, borderRadius: 2 },
  chartTitle: { fontSize: 17, letterSpacing: -0.2 },
  chartBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  chartBadgeDot: { width: 6, height: 6, borderRadius: 3 },
  chartBadgeText: { fontSize: 12 },
  chartBody: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingBottom: 20, paddingTop: 4, gap: 4,
  },
  chartLegend: { flex: 1, gap: 18, paddingLeft: 4 },

  // Tip card
  tipCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 20,
    padding: 18, gap: 14, borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  tipIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tipText: { flex: 1, gap: 4 },
  tipTitle: { fontSize: 14, letterSpacing: -0.2 },
  tipBody: { fontSize: 13, lineHeight: 19, opacity: 0.9 },
});
