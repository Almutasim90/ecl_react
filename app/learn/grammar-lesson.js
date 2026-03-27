import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Animated, Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { getLessonContent, ROLE_COLORS } from '../../lib/grammarContent';

const { width: SCREEN_W } = Dimensions.get('window');
const COMPLETION_KEY = 'lesson_completed_v1';

// ─── Chalkboard SVG Background ───────────────────────────────────────────────
function ChalkboardFrame({ width, height }) {
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      {/* Board surface */}
      <Rect x={0} y={0} width={width} height={height} rx={16} fill="#1a3d2b" />
      {/* Wood frame */}
      <Rect x={0} y={0} width={width} height={10} rx={5} fill="#6d4c41" />
      <Rect x={0} y={height - 10} width={width} height={10} rx={5} fill="#6d4c41" />
      <Rect x={0} y={0} width={10} height={height} rx={5} fill="#6d4c41" />
      <Rect x={width - 10} y={0} width={10} height={height} rx={5} fill="#6d4c41" />
      {/* Ruled chalk lines */}
      <Path d={`M 18 ${height * 0.38} Q ${width / 2} ${height * 0.36} ${width - 18} ${height * 0.38}`}
        stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
      <Path d={`M 18 ${height * 0.62} Q ${width / 2} ${height * 0.60} ${width - 18} ${height * 0.62}`}
        stroke="rgba(255,255,255,0.07)" strokeWidth="1" fill="none" />
      {/* Chalk dust spots */}
      <Circle cx={width - 24} cy={height - 20} r={3} fill="rgba(255,255,255,0.12)" />
      <Circle cx={width - 32} cy={height - 18} r={1.5} fill="rgba(255,255,255,0.08)" />
      <Circle cx={width - 18} cy={height - 26} r={2} fill="rgba(255,255,255,0.10)" />
    </Svg>
  );
}

// ─── Pen / Writing Icon ───────────────────────────────────────────────────────
function WritingIcon({ color = '#fff', size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
        fill={color}
      />
    </Svg>
  );
}

// ─── Typewriter Hook ──────────────────────────────────────────────────────────
function useTypewriter(text, { delay = 0, speed = 38, active = true } = {}) {
  const [chars, setChars] = useState(0);
  const [cursorOn, setCursorOn] = useState(true);
  const done = chars >= text.length;

  useEffect(() => {
    if (!active) { setChars(text.length); return; }
    setChars(0);
    let writeTimer, blinkTimer;

    writeTimer = setTimeout(() => {
      let i = 0;
      const tick = setInterval(() => {
        i += 1;
        setChars(i);
        if (i >= text.length) clearInterval(tick);
      }, speed);
      return () => clearInterval(tick);
    }, delay);

    blinkTimer = setInterval(() => setCursorOn(p => !p), 520);
    return () => { clearTimeout(writeTimer); clearInterval(blinkTimer); };
  }, [text, delay, speed, active]);

  return { text: text.slice(0, chars), done, cursor: !done && cursorOn };
}

// ─── Single Chalkboard Example ────────────────────────────────────────────────
function ChalkExample({ sentence, parts, delay = 0, active = true }) {
  const { text, done, cursor } = useTypewriter(sentence, { delay, speed: 42, active });
  const boardW = SCREEN_W - 80;

  return (
    <View style={chalk.wrap}>
      <ChalkboardFrame width={boardW} height={110} />
      <View style={[chalk.inner, { width: boardW, height: 110 }]}>
        {/* Pen icon + label */}
        <View style={chalk.topRow}>
          <WritingIcon color="rgba(255,255,255,0.55)" size={14} />
          <Text style={chalk.exampleLabel}>Example</Text>
        </View>

        {/* Typewriter sentence */}
        <Text style={chalk.sentence}>
          {text}
          {cursor ? <Text style={chalk.cursor}>|</Text> : null}
        </Text>

        {/* Color-coded word chips — shown after writing done */}
        {done && parts && (
          <MotiView
            from={{ opacity: 0, translateY: 4 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 320 }}
            style={chalk.chipsRow}
          >
            {parts.map((p, i) => (
              <View
                key={i}
                style={[chalk.chip, { backgroundColor: (ROLE_COLORS[p.role] || ROLE_COLORS.default) + '30',
                  borderColor: ROLE_COLORS[p.role] || ROLE_COLORS.default }]}
              >
                <Text style={[chalk.chipWord, { color: ROLE_COLORS[p.role] || ROLE_COLORS.default }]}>
                  {p.word}
                </Text>
                <Text style={chalk.chipRole}>{p.role}</Text>
              </View>
            ))}
          </MotiView>
        )}
      </View>
    </View>
  );
}

// ─── Formula Part Chip ────────────────────────────────────────────────────────
function FormulaPart({ part, colors }) {
  if (part.role === 'connector') {
    return <Text style={[formula.plus, { color: colors.textSecondary }]}>{part.text}</Text>;
  }
  const roleColor = ROLE_COLORS[part.role] || ROLE_COLORS.default;
  return (
    <View style={[formula.part, { borderColor: roleColor, backgroundColor: roleColor + '30' }]}>
      <View style={[formula.roleTag, { backgroundColor: roleColor }]}>
        <Text style={formula.roleTagText}>{part.role.toUpperCase()}</Text>
      </View>
      <Text style={[formula.partText, { color: roleColor }]}>{part.text}</Text>
      {part.note && (
        <Text style={[formula.partNote, { color: roleColor }]}>{part.note}</Text>
      )}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function GrammarLessonScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { type, form } = useLocalSearchParams();

  const content = getLessonContent(type);
  const CARDS = ['overview', 'formula', 'examples', 'tips'];
  const [cardIndex, setCardIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const goTo = (next) => {
    const dir = next > cardIndex ? 1 : -1;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -dir * 18, duration: 120, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
    ]).start();
    setCardIndex(next);
  };

  const markDone = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(COMPLETION_KEY);
      const list = raw ? JSON.parse(raw) : [];
      if (!list.includes(type)) {
        await AsyncStorage.setItem(COMPLETION_KEY, JSON.stringify([...list, type]));
      }
    } catch {}
    router.back();
  }, [type]);

  const cardLabel = ['Overview', 'Formula', 'Examples', 'Tips & Mistakes'];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      {/* ── Header ── */}
      <LinearGradient
        colors={isDark ? ['#1a0840', '#2e1065', '#1e1b4b'] : ['#4338ca', '#5b21b6', '#7c3aed']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 14 }]}
      >
        <View style={styles.headerBlob1} />
        <View style={styles.headerBlob2} />

        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerEyebrow}>GRAMMAR GUIDE</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>{type}</Text>
          </View>

          <View style={[styles.headerIcon, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            <Ionicons name={content.icon || 'book'} size={20} color="#fff" />
          </View>
        </View>

        {/* Step indicator */}
        <View style={styles.stepsRow}>
          {CARDS.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goTo(i)} style={styles.stepTouch}>
              <View style={[
                styles.stepDot,
                i === cardIndex && styles.stepDotActive,
                i < cardIndex && styles.stepDotDone,
              ]} />
            </TouchableOpacity>
          ))}
          <Text style={styles.stepLabel}>{cardLabel[cardIndex]}</Text>
        </View>
      </LinearGradient>

      {/* ── Card Content ── */}
      <Animated.View style={[styles.cardArea, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        >

          {/* ══ CARD 0: Overview ══ */}
          {cardIndex === 0 && (
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300 }}>

              {/* Hook banner */}
              <View style={[styles.hookCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.hookAccent, { backgroundColor: colors.accent }]} />
                <View style={styles.hookBody}>
                  <Text style={[styles.hookLabel, { color: colors.accent }]}>WHAT IS IT?</Text>
                  <Text style={[styles.hookText, { color: colors.text }]}>{content.hook}</Text>
                </View>
                <Text style={styles.hookEmoji}>💡</Text>
              </View>

              {/* When to use */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>When do we use it?</Text>
              {[
                'To describe habits and routines',
                'To state facts and general truths',
                'For scheduled / timetabled events',
              ].map((item, i) => (
                <MotiView key={i}
                  from={{ opacity: 0, translateX: -12 }} animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'timing', duration: 260, delay: 80 * i }}
                >
                  <View style={[styles.usageRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.usageDot, { backgroundColor: colors.accent }]} />
                    <Text style={[styles.usageText, { color: colors.text }]}>{item}</Text>
                  </View>
                </MotiView>
              ))}

              {/* Signal words */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Signal words</Text>
              <View style={styles.signalRow}>
                {['always', 'usually', 'often', 'sometimes', 'never', 'every day', 'on Mondays'].map((w) => (
                  <View key={w} style={[styles.signalChip, { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}>
                    <Text style={[styles.signalText, { color: colors.accent }]}>{w}</Text>
                  </View>
                ))}
              </View>
            </MotiView>
          )}

          {/* ══ CARD 1: Formula ══ */}
          {cardIndex === 1 && (
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300 }}>

              {/* Label */}
              <View style={styles.formulaLabelRow}>
                <View style={[styles.formulaLabelBadge, { backgroundColor: colors.accentSoft }]}>
                  <Ionicons name="git-merge-outline" size={14} color={colors.accent} />
                  <Text style={[styles.formulaLabelText, { color: colors.accent }]}>
                    {content.ruleFormula?.label?.toUpperCase() || 'STRUCTURE'}
                  </Text>
                </View>
              </View>

              {/* Formula parts card */}
              <View style={[styles.formulaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {/* Subtle tinted top strip */}
                <View style={[styles.formulaCardStrip, { backgroundColor: colors.accent + '18' }]} />
                <View style={styles.formulaPartsRow}>
                  {content.ruleFormula?.parts?.map((part, i) => (
                    <FormulaPart key={i} part={part} colors={colors} />
                  ))}
                </View>
              </View>

              {/* Color guide */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Color Guide</Text>
              <View style={styles.legendGrid}>
                {Object.entries(ROLE_COLORS).filter(([k]) => k !== 'default').map(([role, color]) => (
                  <View key={role} style={[styles.legendItem, { backgroundColor: color + '28', borderColor: color + 'aa' }]}>
                    <View style={[styles.legendDot, { backgroundColor: color }]} />
                    <Text style={[styles.legendLabel, { color }]}>{role}</Text>
                  </View>
                ))}
              </View>

              {/* Negative form note */}
              <View style={[styles.noteCard, { backgroundColor: colors.errorSoft, borderColor: colors.error }]}>
                <Ionicons name="information-circle" size={18} color={colors.error} />
                <Text style={[styles.noteText, { color: colors.text }]}>
                  <Text style={{ fontFamily: 'Poppins_700Bold' }}>Negative: </Text>
                  Subject + <Text style={{ color: colors.error, fontFamily: 'Poppins_700Bold' }}>do not / does not</Text> + verb (base)
                </Text>
              </View>
            </MotiView>
          )}

          {/* ══ CARD 2: Examples ══ */}
          {cardIndex === 2 && (
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300 }}>

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Live examples</Text>
              <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
                Watch each sentence being written — then see how it breaks down.
              </Text>

              {/* Chalkboard examples */}
              {content.examples?.slice(0, 2).map((ex, i) => (
                <ChalkExample
                  key={i}
                  sentence={ex.sentence}
                  parts={ex.parts}
                  delay={i === 0 ? 300 : 0}
                  active={i === 0}
                />
              ))}

              {/* Extra named examples */}
              <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>More examples</Text>
              {[
                { s: 'Ali reads his story every night.', role: 'Ali = subject, reads = verb (+s for he)' },
                { s: 'Sara does not like cold weather.', role: 'does not = negative auxiliary' },
                { s: 'The sun rises in the east.', role: 'A general truth — always true' },
                { s: 'Do they play football on Fridays?', role: 'Question form with "Do"' },
              ].map((ex, i) => (
                <MotiView key={i}
                  from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'timing', duration: 250, delay: 60 * i }}
                >
                  <View style={[styles.namedExample, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.namedBullet, { backgroundColor: colors.accent }]}>
                      <WritingIcon color="#fff" size={12} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.namedSentence, { color: colors.text }]}>{ex.s}</Text>
                      <Text style={[styles.namedNote, { color: colors.textSecondary }]}>{ex.role}</Text>
                    </View>
                  </View>
                </MotiView>
              ))}
            </MotiView>
          )}

          {/* ══ CARD 3: Tips ══ */}
          {cardIndex === 3 && (
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300 }}>

              {/* Pro tip */}
              <View style={[styles.tipCard, { backgroundColor: colors.successSoft, borderColor: colors.success }]}>
                <View style={styles.tipHeader}>
                  <Ionicons name="bulb" size={20} color={colors.success} />
                  <Text style={[styles.tipTitle, { color: colors.success }]}>Pro Tip</Text>
                </View>
                <Text style={[styles.tipBody, { color: colors.text }]}>{content.tip}</Text>
              </View>

              {/* Common mistake */}
              <View style={[styles.tipCard, { backgroundColor: colors.errorSoft, borderColor: colors.error, marginTop: 16 }]}>
                <View style={styles.tipHeader}>
                  <Ionicons name="warning" size={20} color={colors.error} />
                  <Text style={[styles.tipTitle, { color: colors.error }]}>Common Mistake</Text>
                </View>
                <Text style={[styles.tipBody, { color: colors.text }]}>{content.commonMistake}</Text>
              </View>

              {/* Quick summary */}
              <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Quick Summary</Text>
              {[
                { icon: 'checkmark-circle', color: colors.success, text: 'Use base verb for I / You / We / They' },
                { icon: 'checkmark-circle', color: colors.success, text: 'Add -s or -es for He / She / It' },
                { icon: 'close-circle', color: colors.error, text: 'Never add -s after "do not / does not"' },
              ].map((item, i) => (
                <View key={i} style={[styles.summaryRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                  <Text style={[styles.summaryText, { color: colors.text }]}>{item.text}</Text>
                </View>
              ))}

              {/* Mark complete */}
              <TouchableOpacity
                onPress={markDone}
                activeOpacity={0.85}
                style={styles.doneBtn}
              >
                <LinearGradient
                  colors={isDark ? ['#1a0840', '#2e1065', '#1e1b4b'] : ['#4338ca', '#5b21b6', '#7c3aed']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.doneBtnGrad}
                >
                  <Ionicons name="checkmark-done" size={20} color="#fff" />
                  <Text style={styles.doneBtnText}>Mark as Complete</Text>
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          )}

        </ScrollView>
      </Animated.View>

      {/* ── Bottom Navigation ── */}
      <View style={[styles.navBar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          onPress={() => cardIndex > 0 && goTo(cardIndex - 1)}
          style={[styles.navBtn, { borderColor: colors.border, opacity: cardIndex === 0 ? 0.3 : 1 }]}
          disabled={cardIndex === 0}
        >
          <Ionicons name="arrow-back" size={18} color={colors.text} />
          <Text style={[styles.navBtnText, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>

        <Text style={[styles.navCount, { color: colors.textSecondary }]}>
          {cardIndex + 1} / {CARDS.length}
        </Text>

        <TouchableOpacity
          onPress={() => cardIndex < CARDS.length - 1 ? goTo(cardIndex + 1) : markDone()}
          style={[styles.navBtnPrimary, { backgroundColor: colors.accent }]}
        >
          <Text style={styles.navBtnPrimaryText}>
            {cardIndex === CARDS.length - 1 ? 'Finish' : 'Next'}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

// ─── Chalk Styles ─────────────────────────────────────────────────────────────
const chalk = StyleSheet.create({
  wrap: {
    marginBottom: 20,
    alignSelf: 'center',
    width: SCREEN_W - 80,
    height: 110,
  },
  inner: {
    position: 'absolute', top: 0, left: 0,
    padding: 14,
    justifyContent: 'space-between',
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  exampleLabel: {
    fontSize: 10, color: 'rgba(255,255,255,0.5)',
    fontFamily: 'Poppins_600SemiBold', letterSpacing: 1.2,
  },
  sentence: {
    fontSize: 15, color: '#e8f5e9',
    fontFamily: 'Poppins_600SemiBold',
    lineHeight: 22,
  },
  cursor: { color: 'rgba(232,245,233,0.9)' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 4 },
  chip: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: 5, borderWidth: 1,
    alignItems: 'center',
  },
  chipWord: { fontSize: 10, fontFamily: 'Poppins_700Bold' },
  chipRole: { fontSize: 8, color: 'rgba(255,255,255,0.45)', fontFamily: 'Poppins_400Regular' },
});

// ─── Formula Styles ───────────────────────────────────────────────────────────
const formula = StyleSheet.create({
  plus: {
    fontSize: 22, fontFamily: 'Poppins_700Bold',
    paddingHorizontal: 4, alignSelf: 'center',
  },
  part: {
    borderWidth: 2, borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 10,
    alignItems: 'center', minWidth: 80,
    gap: 4,
  },
  roleTag: {
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 4, alignSelf: 'center',
  },
  roleTagText: {
    fontSize: 8, color: '#fff',
    fontFamily: 'Poppins_700Bold', letterSpacing: 0.8,
  },
  partText: { fontSize: 14, fontFamily: 'Poppins_800ExtraBold', textAlign: 'center' },
  partNote: { fontSize: 10, fontFamily: 'Poppins_400Regular', textAlign: 'center', opacity: 0.85, lineHeight: 14 },
});

// ─── Main Styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: { paddingHorizontal: 24, paddingBottom: 20, position: 'relative' },
  headerBlob1: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -50, right: -30,
  },
  headerBlob2: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)', bottom: -20, left: 30,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1 },
  headerEyebrow: {
    fontSize: 10, color: 'rgba(255,255,255,0.6)',
    fontFamily: 'Poppins_700Bold', letterSpacing: 1.5,
  },
  headerTitle: { fontSize: 18, color: '#fff', fontFamily: 'Poppins_800ExtraBold' },
  headerIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  stepsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepTouch: { padding: 4 },
  stepDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  stepDotActive: { backgroundColor: '#fff', width: 22, borderRadius: 4 },
  stepDotDone: { backgroundColor: 'rgba(255,255,255,0.6)' },
  stepLabel: {
    marginLeft: 8, fontSize: 11, color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Poppins_600SemiBold',
  },

  // Content
  cardArea: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 14, fontFamily: 'Poppins_800ExtraBold', marginBottom: 12, marginTop: 4 },
  sectionSub: { fontSize: 12, fontFamily: 'Poppins_400Regular', marginBottom: 16, marginTop: -8, lineHeight: 18 },

  // Overview card
  hookCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, borderWidth: 1.5,
    marginBottom: 20, overflow: 'hidden',
  },
  hookAccent: { width: 5, alignSelf: 'stretch' },
  hookBody: { flex: 1, padding: 14, gap: 4 },
  hookLabel: { fontSize: 10, fontFamily: 'Poppins_700Bold', letterSpacing: 1 },
  hookText: { fontSize: 14, fontFamily: 'Poppins_600SemiBold', lineHeight: 22 },
  hookEmoji: { fontSize: 28, paddingRight: 14 },

  usageRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 1,
    padding: 12, gap: 12, marginBottom: 8,
  },
  usageDot: { width: 8, height: 8, borderRadius: 4 },
  usageText: { flex: 1, fontSize: 13, fontFamily: 'Poppins_600SemiBold' },

  signalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  signalChip: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1.5,
  },
  signalText: { fontSize: 12, fontFamily: 'Poppins_600SemiBold' },

  // Formula label
  formulaLabelRow: { marginBottom: 14 },
  formulaLabelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10,
  },
  formulaLabelText: { fontSize: 11, fontFamily: 'Poppins_800ExtraBold', letterSpacing: 1 },

  // Formula card
  formulaCard: {
    borderRadius: 18, borderWidth: 2,
    marginBottom: 20, overflow: 'hidden',
  },
  formulaCardStrip: { height: 6, width: '100%' },
  formulaPartsRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10, alignItems: 'flex-start',
    padding: 16,
  },

  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  legendItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 10, borderWidth: 1.5,
  },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12, fontFamily: 'Poppins_700Bold', textTransform: 'capitalize' },

  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 10, padding: 14,
    borderRadius: 12, borderWidth: 1.5,
  },
  noteText: { flex: 1, fontSize: 13, fontFamily: 'Poppins_400Regular', lineHeight: 20 },

  // Named examples
  namedExample: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 12, padding: 12,
    borderRadius: 12, borderWidth: 1, marginBottom: 10,
  },
  namedBullet: {
    width: 28, height: 28, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  namedSentence: { fontSize: 13, fontFamily: 'Poppins_600SemiBold', lineHeight: 20 },
  namedNote: { fontSize: 11, fontFamily: 'Poppins_400Regular', marginTop: 3, lineHeight: 16 },

  // Tips
  tipCard: { borderRadius: 14, borderWidth: 1.5, padding: 16 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  tipTitle: { fontSize: 13, fontFamily: 'Poppins_800ExtraBold' },
  tipBody: { fontSize: 13, fontFamily: 'Poppins_400Regular', lineHeight: 20 },

  summaryRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, padding: 12,
    borderRadius: 10, borderWidth: 1, marginBottom: 8,
  },
  summaryText: { flex: 1, fontSize: 13, fontFamily: 'Poppins_600SemiBold' },

  doneBtn: { marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  doneBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16,
  },
  doneBtnText: { fontSize: 15, color: '#fff', fontFamily: 'Poppins_800ExtraBold' },

  // Bottom nav
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 14,
    borderTopWidth: 1,
  },
  navBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 12, borderWidth: 1.5, minWidth: 90,
  },
  navBtnText: { fontSize: 13, fontFamily: 'Poppins_700Bold' },
  navCount: { fontSize: 12, fontFamily: 'Poppins_600SemiBold' },
  navBtnPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 10, paddingHorizontal: 16,
    borderRadius: 12, minWidth: 90, justifyContent: 'center',
  },
  navBtnPrimaryText: { fontSize: 13, color: '#fff', fontFamily: 'Poppins_700Bold' },
});
