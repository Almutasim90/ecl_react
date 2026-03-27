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
import { spacing, radius, font, fontSize } from '@/theme/tokens';

const { width: SCREEN_W } = Dimensions.get('window');
const COMPLETION_KEY = 'lesson_completed_v1';

// ─── Chalkboard SVG Background ───────────────────────────────────────────────
function ChalkboardFrame({ width, height, colors }) {
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      {/* Board surface */}
      <Rect x={0} y={0} width={width} height={height} rx={radius.sm} fill={colors.chalkboard} />
      {/* Wood frame */}
      <Rect x={0} y={0} width={width} height={spacing.sm} rx={spacing.xs} fill={colors.chalkWood} />
      <Rect x={0} y={height - spacing.sm} width={width} height={spacing.sm} rx={spacing.xs} fill={colors.chalkWood} />
      <Rect x={0} y={0} width={spacing.sm} height={height} rx={spacing.xs} fill={colors.chalkWood} />
      <Rect x={width - spacing.sm} y={0} width={spacing.sm} height={height} rx={spacing.xs} fill={colors.chalkWood} />
      {/* Ruled chalk lines */}
      <Path d={`M 18 ${height * 0.38} Q ${width / 2} ${height * 0.36} ${width - 18} ${height * 0.38}`}
        stroke={colors.chalkLine} strokeWidth={1} fill="none" />
      <Path d={`M 18 ${height * 0.62} Q ${width / 2} ${height * 0.60} ${width - 18} ${height * 0.62}`}
        stroke={colors.chalkLine} strokeWidth={1} fill="none" />
      {/* Chalk dust spots */}
      <Circle cx={width - 24} cy={height - 20} r={3} fill={colors.chalkDustStrong} />
      <Circle cx={width - 32} cy={height - 18} r={1.5} fill={colors.chalkDustSoft} />
      <Circle cx={width - 18} cy={height - 26} r={2} fill={colors.chalkDust} />
    </Svg>
  );
}

// ─── Pen / Writing Icon ───────────────────────────────────────────────────────
function WritingIcon({ color, size = 18 }) {
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
function ChalkExample({ sentence, parts, delay = 0, active = true, colors }) {
  const { text, done, cursor } = useTypewriter(sentence, { delay, speed: 42, active });
  const boardW = SCREEN_W - (spacing.xxl + spacing.lg + spacing.sm);

  return (
    <View style={chalk.wrap}>
      <ChalkboardFrame
        width={boardW}
        height={spacing.xxl + spacing.md + spacing.sm + spacing.sm + spacing.xs}
        colors={colors}
      />
      <View
        style={[
          chalk.inner,
          { width: boardW, height: spacing.xxl + spacing.md + spacing.sm + spacing.sm + spacing.xs },
        ]}
      >
        {/* Pen icon + label */}
        <View style={chalk.topRow}>
          <WritingIcon color={colors.chalkLabel} size={spacing.sm + spacing.xs} />
          <Text style={[chalk.exampleLabel, { color: colors.chalkLabel }]}>Example</Text>
        </View>

        {/* Typewriter sentence */}
        <Text style={[chalk.sentence, { color: colors.chalkText }]}>
          {text}
          {cursor ? <Text style={[chalk.cursor, { color: colors.chalkTextMuted }]}>|</Text> : null}
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
                <Text style={[chalk.chipRole, { color: colors.chalkChipRole }]}>{p.role}</Text>
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
        <Text style={[formula.roleTagText, { color: colors.onAccent }]}>{part.role.toUpperCase()}</Text>
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
  const CARDS = ['overview', 'formula', 'examples', 'practice', 'tips'];
  const [cardIndex, setCardIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
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

  useEffect(() => {
    AsyncStorage.getItem(COMPLETION_KEY)
      .then((raw) => {
        const list = raw ? JSON.parse(raw) : [];
        setIsCompleted(list.includes(type));
      })
      .catch(() => {});
  }, [type]);

  const markCompleteAndExit = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(COMPLETION_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const nextList = list.includes(type) ? list : [...list, type];
      await AsyncStorage.setItem(COMPLETION_KEY, JSON.stringify(nextList));
      setIsCompleted(true);
    } catch {}
    router.back();
  }, [type]);

  const cardLabel = ['Overview', 'Formula', 'Examples', 'Practice', 'Tips & Mistakes'];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      {/* ── Header ── */}
        <LinearGradient
          colors={colors.gradientHero}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + spacing.md }]}
        >
          <View style={[styles.headerBlob1, { backgroundColor: colors.heroGlowStrong }]} />
          <View style={[styles.headerBlob2, { backgroundColor: colors.heroGlowSoft }]} />

        <View style={styles.headerRow}>
           <TouchableOpacity
             onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }}
             style={[styles.backBtn, { backgroundColor: colors.heroBackBg }]}
           >
            <Ionicons name="arrow-back" size={20} color={colors.onHero} />
           </TouchableOpacity>

          <View style={styles.headerCenter}>
             <Text style={[styles.headerEyebrow, { color: colors.onHeroSoft }]}>GRAMMAR GUIDE</Text>
             <Text style={[styles.headerTitle, { color: colors.onHero }]} numberOfLines={1}>{type}</Text>
           </View>

           <View style={[styles.headerIcon, { backgroundColor: colors.heroIconBg }]}>
            <Ionicons name={content.icon || 'book'} size={20} color={colors.onHero} />
           </View>
        </View>

        {/* Step indicator */}
          <View style={styles.stepsRow}>
            {CARDS.map((_, i) => (
              <TouchableOpacity key={i} onPress={() => goTo(i)} style={styles.stepTouch}>
                <View style={[
                  styles.stepDot,
                  { backgroundColor: colors.heroStepIdle },
                  i === cardIndex && { backgroundColor: colors.onHero, width: spacing.md + spacing.xs },
                  i < cardIndex && { backgroundColor: colors.heroStepDone },
                ]} />
              </TouchableOpacity>
            ))}
            <Text style={[styles.stepLabel, { color: colors.onHeroMuted }]}>{cardLabel[cardIndex]}</Text>
          </View>
      </LinearGradient>

      {/* ── Card Content ── */}
      <Animated.View style={[styles.cardArea, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.tabBarClear }]}
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

              {content.quickLesson?.steps?.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Lesson</Text>
                  <View style={[styles.quickLessonCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {content.quickLesson.steps.map((step, i) => (
                      <View key={step.title} style={styles.quickLessonRow}>
                        <View style={[styles.quickLessonBadge, { backgroundColor: colors.accentSoft }]}>
                          <Text style={[styles.quickLessonBadgeText, { color: colors.accent }]}>{i + 1}</Text>
                        </View>
                        <View style={styles.quickLessonBody}>
                          <Text style={[styles.quickLessonTitle, { color: colors.text }]}>{step.title}</Text>
                          <Text style={[styles.quickLessonText, { color: colors.textSecondary }]}>{step.text}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* When to use */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>When do we use it?</Text>
              {content.whenToUse?.map((item, i) => (
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

              {content.whenNotToUse?.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>When NOT to use it</Text>
                  {content.whenNotToUse.map((item, i) => (
                    <MotiView key={i}
                      from={{ opacity: 0, translateX: -12 }} animate={{ opacity: 1, translateX: 0 }}
                      transition={{ type: 'timing', duration: 260, delay: 80 * i }}
                    >
                      <View style={[styles.usageRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <View style={[styles.usageDot, { backgroundColor: colors.error }]} />
                        <Text style={[styles.usageText, { color: colors.text }]}>{item}</Text>
                      </View>
                    </MotiView>
                  ))}
                </>
              )}

              {/* Signal words */}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Signal words</Text>
              <View style={styles.signalRow}>
                {content.signalWords?.map((w) => (
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

              {content.structureNote && (
                <View
                  style={[
                    styles.noteCard,
                    {
                      backgroundColor: content.structureNoteTone === 'warning'
                        ? colors.warning + '1a'
                        : colors.errorSoft,
                      borderColor: content.structureNoteTone === 'warning'
                        ? colors.warning
                        : colors.error,
                    },
                  ]}
                >
                  <Ionicons
                    name="information-circle"
                    size={18}
                    color={content.structureNoteTone === 'warning' ? colors.warning : colors.error}
                  />
                  <Text style={[styles.noteText, { color: colors.text }]}>
                    {content.structureNote}
                  </Text>
                </View>
              )}
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
                  colors={colors}
                />
              ))}

              {/* Extra named examples */}
              <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>More examples</Text>
              {content.extraExamples?.map((ex, i) => (
                <MotiView key={i}
                  from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'timing', duration: 250, delay: 60 * i }}
                >
                  <View style={[styles.namedExample, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={[styles.namedBullet, { backgroundColor: colors.accent }]}>
                      <WritingIcon color={colors.surface} size={spacing.xs + spacing.sm} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.namedSentence, { color: colors.text }]}>{ex.sentence}</Text>
                      <Text style={[styles.namedNote, { color: colors.textSecondary }]}>{ex.note}</Text>
                    </View>
                  </View>
                </MotiView>
              ))}
            </MotiView>
          )}

          {/* ══ CARD 3: Practice ══ */}
          {cardIndex === 3 && (
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300 }}>

              {content.microPractice && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Practice</Text>
                  <View style={[styles.practiceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.practiceHeader}>
                      <Ionicons name="hammer" size={20} color={colors.accent} />
                      <Text style={[styles.practiceTitle, { color: colors.text }]}>{content.microPractice.prompt}</Text>
                    </View>
                    <View style={[styles.practiceBox, { backgroundColor: colors.errorSoft, borderColor: colors.error }]}>
                      <Text style={[styles.practiceLabel, { color: colors.error }]}>Wrong</Text>
                      <Text style={[styles.practiceText, { color: colors.text }]}>{content.microPractice.item.wrong}</Text>
                    </View>
                    <View style={[styles.practiceBox, { backgroundColor: colors.successSoft, borderColor: colors.success }]}>
                      <Text style={[styles.practiceLabel, { color: colors.success }]}>Correct</Text>
                      <Text style={[styles.practiceText, { color: colors.text }]}>{content.microPractice.item.right}</Text>
                    </View>
                    <View style={[styles.practiceWhy, { backgroundColor: colors.accentSoft }]}>
                      <Ionicons name="help-circle" size={16} color={colors.accent} />
                      <Text style={[styles.practiceWhyText, { color: colors.text }]}>{content.microPractice.item.why}</Text>
                    </View>
                  </View>
                </>
              )}

              {content.contrast && (
                <>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Contrast</Text>
                  <View style={[styles.contrastCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.contrastTitle, { color: colors.text }]}>{content.contrast.title}</Text>
                    <Text style={[styles.contrastNote, { color: colors.textSecondary }]}>{content.contrast.note}</Text>
                    {content.contrast.pair?.map((line) => (
                      <View key={line} style={[styles.contrastRow, { borderColor: colors.border }]}>
                        <Ionicons name="git-compare" size={16} color={colors.accent} />
                        <Text style={[styles.contrastText, { color: colors.text }]}>{line}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

            </MotiView>
          )}

          {/* ══ CARD 4: Tips ══ */}
          {cardIndex === 4 && (
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
              {content.quickSummary?.map((item, i) => {
                const isError = item.tone === 'error';
                return (
                  <View key={i} style={[styles.summaryRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <Ionicons
                      name={isError ? 'close-circle' : 'checkmark-circle'}
                      size={18}
                      color={isError ? colors.error : colors.success}
                    />
                    <Text style={[styles.summaryText, { color: colors.text }]}>{item.text}</Text>
                  </View>
                );
              })}

              {/* Mark complete */}
              <TouchableOpacity
                onPress={markCompleteAndExit}
                activeOpacity={0.85}
                style={styles.doneBtn}
              >
                <LinearGradient
                  colors={colors.gradientHero}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.doneBtnGrad}
                >
                  <Ionicons name="checkmark-done" size={20} color={colors.onAccent} />
                  <Text style={[styles.doneBtnText, { color: colors.onAccent }]}
                  >
                    {isCompleted ? 'Completed' : 'Finish & Return'}
                  </Text>
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
          onPress={() => cardIndex < CARDS.length - 1 ? goTo(cardIndex + 1) : markCompleteAndExit()}
             style={[styles.navBtnPrimary, { backgroundColor: colors.accent }]}
           >
             <Text style={[styles.navBtnPrimaryText, { color: colors.onAccent }]}>
               {cardIndex === CARDS.length - 1 ? 'Finish' : 'Next'}
             </Text>
             <Ionicons name="arrow-forward" size={18} color={colors.onAccent} />
           </TouchableOpacity>
      </View>

    </View>
  );
}

// ─── Chalk Styles ─────────────────────────────────────────────────────────────
const chalk = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
    alignSelf: 'center',
    width: SCREEN_W - (spacing.xxl + spacing.lg + spacing.sm),
    height: spacing.xxl + spacing.md + spacing.sm + spacing.sm + spacing.xs,
  },
  inner: {
    position: 'absolute', top: 0, left: 0,
    padding: spacing.sm + spacing.xs,
    justifyContent: 'space-between',
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  exampleLabel: {
    fontSize: fontSize.subLabel,
    fontFamily: font.semiBold,
    letterSpacing: 1.2,
  },
  sentence: {
    fontSize: fontSize.label,
    fontFamily: font.semiBold,
    lineHeight: 22,
  },
  cursor: {},
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs + 1, marginTop: spacing.xs },
  chip: {
    paddingHorizontal: spacing.xs + 3, paddingVertical: 2,
    borderRadius: spacing.xs + 1, borderWidth: 1,
    alignItems: 'center',
  },
  chipWord: { fontSize: fontSize.subLabel, fontFamily: font.bold },
  chipRole: { fontSize: 8, fontFamily: font.regular },
});

// ─── Formula Styles ───────────────────────────────────────────────────────────
const formula = StyleSheet.create({
  plus: {
    fontSize: fontSize.cardTitle,
    fontFamily: font.bold,
    paddingHorizontal: spacing.xs,
    alignSelf: 'center',
  },
  part: {
    borderWidth: 2,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + spacing.xs,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center', minWidth: 80,
    gap: spacing.xs,
  },
  roleTag: {
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: spacing.xs,
    alignSelf: 'center',
  },
   roleTagText: {
     fontSize: 8,
     fontFamily: font.bold, letterSpacing: 0.8,
   },
  partText: { fontSize: fontSize.meta, fontFamily: font.extraBold, textAlign: 'center' },
  partNote: { fontSize: fontSize.subLabel, fontFamily: font.regular, textAlign: 'center', opacity: 0.85, lineHeight: 14 },
});

// ─── Main Styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, position: 'relative' },
  headerBlob1: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    top: -50, right: -30,
  },
  headerBlob2: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    bottom: -20, left: 30,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + spacing.xs, marginBottom: spacing.md + 2 },
  backBtn: {
    width: 44, height: 44, borderRadius: radius.sm,
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1 },
  headerEyebrow: {
    fontSize: fontSize.eyebrow,
    fontFamily: font.bold, letterSpacing: 1.5,
  },
  headerTitle: { fontSize: fontSize.button, fontFamily: font.extraBold },
  headerIcon: {
    width: 44, height: 44, borderRadius: radius.sm,
    justifyContent: 'center', alignItems: 'center',
  },
  stepsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  stepTouch: { padding: spacing.xs },
  stepDot: {
    width: spacing.xs * 2, height: spacing.xs * 2, borderRadius: spacing.xs,
  },
  stepDotActive: { width: 22, borderRadius: spacing.xs },
  stepDotDone: {},
  stepLabel: {
    marginLeft: spacing.xs + 2, fontSize: fontSize.eyebrow,
    fontFamily: font.semiBold,
  },

  // Content
  cardArea: { flex: 1 },
  scroll: { paddingHorizontal: spacing.screenH, paddingTop: spacing.md },
  sectionTitle: { fontSize: fontSize.meta, fontFamily: font.extraBold, marginBottom: spacing.sm + spacing.xs, marginTop: spacing.xs },
  sectionSub: { fontSize: fontSize.caption, fontFamily: font.regular, marginBottom: spacing.md, marginTop: -spacing.xs - 2, lineHeight: 18 },

  // Overview card
  hookCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: radius.sm, borderWidth: 1.5,
    marginBottom: spacing.md, overflow: 'hidden',
  },
  hookAccent: { width: 5, alignSelf: 'stretch' },
  hookBody: { flex: 1, padding: spacing.sm + spacing.xs, gap: spacing.xs },
  hookLabel: { fontSize: fontSize.subLabel, fontFamily: font.bold, letterSpacing: 1 },
  hookText: { fontSize: fontSize.meta, fontFamily: font.semiBold, lineHeight: 22 },
  hookEmoji: { fontSize: 28, paddingRight: spacing.sm + spacing.xs },

  usageRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: radius.sm, borderWidth: 1,
    padding: spacing.sm + spacing.xs, gap: spacing.sm + spacing.xs, marginBottom: spacing.xs + 2,
  },
  usageDot: { width: spacing.xs * 2, height: spacing.xs * 2, borderRadius: spacing.xs },
  usageText: { flex: 1, fontSize: fontSize.caption, fontFamily: font.semiBold },

  signalRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs + 2 },
  signalChip: {
    paddingHorizontal: spacing.sm + 2, paddingVertical: spacing.xs + 1,
    borderRadius: radius.full, borderWidth: 1.5,
  },
  signalText: { fontSize: fontSize.badge, fontFamily: font.semiBold },

  quickLessonCard: {
    borderRadius: radius.sm,
    borderWidth: 1.5,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  quickLessonRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  quickLessonBadge: {
    width: spacing.lg,
    height: spacing.lg,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLessonBadgeText: { fontSize: fontSize.badge, fontFamily: font.bold },
  quickLessonBody: { flex: 1, gap: spacing.xs },
  quickLessonTitle: { fontSize: fontSize.meta, fontFamily: font.bold },
  quickLessonText: { fontSize: fontSize.caption, fontFamily: font.regular, lineHeight: 18 },

  // Formula label
  formulaLabelRow: { marginBottom: spacing.sm + spacing.xs },
  formulaLabelBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + spacing.xs, paddingVertical: spacing.xs + 2,
    borderRadius: spacing.sm + 2,
  },
  formulaLabelText: { fontSize: fontSize.eyebrow, fontFamily: font.extraBold, letterSpacing: 1 },

  // Formula card
  formulaCard: {
    borderRadius: radius.md, borderWidth: 2,
    marginBottom: spacing.md, overflow: 'hidden',
  },
  formulaCardStrip: { height: 6, width: '100%' },
  formulaPartsRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.sm + 2, alignItems: 'flex-start',
    padding: spacing.md,
  },

  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs + 2, marginBottom: spacing.md },
  legendItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: spacing.sm + spacing.xs, paddingVertical: spacing.xs + 2,
    borderRadius: spacing.sm + 2, borderWidth: 1.5,
  },
  legendDot: { width: spacing.xs * 2, height: spacing.xs * 2, borderRadius: spacing.xs },
  legendLabel: { fontSize: fontSize.badge, fontFamily: font.bold, textTransform: 'capitalize' },

  noteCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: spacing.sm + 2, padding: spacing.sm + spacing.xs,
    borderRadius: radius.sm, borderWidth: 1.5,
  },
  noteText: { flex: 1, fontSize: fontSize.caption, fontFamily: font.regular, lineHeight: 20 },

  // Named examples
  namedExample: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: spacing.sm + spacing.xs, padding: spacing.sm + spacing.xs,
    borderRadius: radius.sm, borderWidth: 1, marginBottom: spacing.xs + 2,
  },
  namedBullet: {
    width: spacing.lg + spacing.xs, height: spacing.lg + spacing.xs, borderRadius: radius.sm,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  namedSentence: { fontSize: fontSize.caption, fontFamily: font.semiBold, lineHeight: 20 },
  namedNote: { fontSize: fontSize.eyebrow, fontFamily: font.regular, marginTop: spacing.xs - 1, lineHeight: 16 },

  // Tips
  tipCard: { borderRadius: radius.sm, borderWidth: 1.5, padding: spacing.md },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2, marginBottom: spacing.xs + 2 },
  tipTitle: { fontSize: fontSize.caption, fontFamily: font.extraBold },
  tipBody: { fontSize: fontSize.caption, fontFamily: font.regular, lineHeight: 20 },

  summaryRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: spacing.sm + 2, padding: spacing.sm + spacing.xs,
    borderRadius: radius.sm, borderWidth: 1, marginBottom: spacing.xs + 2,
  },
  summaryText: { flex: 1, fontSize: fontSize.caption, fontFamily: font.semiBold },

  doneBtn: { marginTop: spacing.lg, borderRadius: radius.md, overflow: 'hidden' },
  doneBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm + 2, paddingVertical: spacing.md,
    minHeight: 52,
  },
  doneBtnText: { fontSize: fontSize.label, fontFamily: font.extraBold },

  // Bottom nav
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.screenH, paddingTop: spacing.sm + spacing.xs,
    borderTopWidth: 1,
  },
  navBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2,
    paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.md,
    borderRadius: radius.sm, borderWidth: 1.5, minWidth: 90,
    minHeight: 44,
    justifyContent: 'center',
  },
  navBtnText: { fontSize: fontSize.caption, fontFamily: font.bold },
  navCount: { fontSize: fontSize.badge, fontFamily: font.semiBold },
  navBtnPrimary: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2,
    paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.md,
    borderRadius: radius.sm, minWidth: 90, justifyContent: 'center',
    minHeight: 44,
  },
  navBtnPrimaryText: { fontSize: fontSize.caption, fontFamily: font.bold },

  // Practice card
  practiceCard: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  practiceHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  practiceTitle: { fontSize: fontSize.meta, fontFamily: font.bold },
  practiceBox: {
    borderRadius: radius.sm,
    borderWidth: 1.5,
    padding: spacing.sm + spacing.xs,
    gap: spacing.xs,
  },
  practiceLabel: { fontSize: fontSize.subLabel, fontFamily: font.bold, letterSpacing: 0.6 },
  practiceText: { fontSize: fontSize.caption, fontFamily: font.semiBold },
  practiceWhy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    borderRadius: radius.sm,
    padding: spacing.sm + spacing.xs,
  },
  practiceWhyText: { flex: 1, fontSize: fontSize.caption, fontFamily: font.regular },

  // Contrast card
  contrastCard: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: spacing.md,
    gap: spacing.sm,
  },
  contrastTitle: { fontSize: fontSize.meta, fontFamily: font.bold },
  contrastNote: { fontSize: fontSize.caption, fontFamily: font.regular, lineHeight: 18 },
  contrastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    padding: spacing.sm + spacing.xs,
  },
  contrastText: { flex: 1, fontSize: fontSize.caption, fontFamily: font.semiBold },
});
