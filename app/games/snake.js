/**
 * English Survival Challenge
 * Rapid-fire English questions — Grammar, Vocabulary & Sentence Completion.
 * 3 lives · 10-second timer per question · streak multiplier · score system.
 * Accessible via Quest → Daily Challenge (route stays /games/snake for compatibility).
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const MAX_LIVES   = 3;
const TIME_LIMIT  = 10;
const GAME_SIZE   = 10; // questions per game session

// ─── Question Bank ────────────────────────────────────────────────────────────
const QUESTION_BANK = [
  // Grammar
  { q: 'She ___ to school every day.', category: 'Grammar', options: ['go', 'goes', 'gone', 'going'], correct: 1 },
  { q: 'They have ___ the report already.', category: 'Grammar', options: ['finish', 'finishing', 'finished', 'finishes'], correct: 2 },
  { q: 'If I ___ you, I would apologize.', category: 'Grammar', options: ['am', 'was', 'were', 'be'], correct: 2 },
  { q: 'He is the ___ student in the class.', category: 'Grammar', options: ['smarter', 'smartest', 'more smart', 'smart'], correct: 1 },
  { q: 'We have lived here ___ 2010.', category: 'Grammar', options: ['for', 'since', 'at', 'during'], correct: 1 },
  { q: 'Neither John nor Mary ___ available.', category: 'Grammar', options: ['are', 'is', 'were', 'being'], correct: 1 },
  { q: 'She asked me where I ___.', category: 'Grammar', options: ['lived', 'live', 'living', 'lives'], correct: 0 },
  { q: 'By next year, she ___ her degree.', category: 'Grammar', options: ['finishes', 'has finished', 'will have finished', 'would finish'], correct: 2 },
  { q: 'The children are used to ___ late.', category: 'Grammar', options: ['stay', 'stayed', 'staying', 'stays'], correct: 2 },
  { q: '___ she works hard, she always fails.', category: 'Grammar', options: ['Although', 'Because', 'Since', 'So'], correct: 0 },
  // Vocabulary
  { q: "What does 'eloquent' mean?", category: 'Vocabulary', options: ['Well-spoken', 'Angry', 'Confused', 'Silent'], correct: 0 },
  { q: "A synonym for 'begin' is:", category: 'Vocabulary', options: ['End', 'Pause', 'Stop', 'Start'], correct: 3 },
  { q: "What does 'brief' mean?", category: 'Vocabulary', options: ['Long', 'Short', 'Loud', 'Heavy'], correct: 1 },
  { q: "Opposite of 'ancient':", category: 'Vocabulary', options: ['Old', 'Tiny', 'Modern', 'Brave'], correct: 2 },
  { q: "What does 'observe' mean?", category: 'Vocabulary', options: ['Ignore', 'Forget', 'Speak', 'Watch'], correct: 3 },
  { q: "A synonym for 'happy':", category: 'Vocabulary', options: ['Joyful', 'Sad', 'Angry', 'Tired'], correct: 0 },
  { q: "What does 'enormous' mean?", category: 'Vocabulary', options: ['Tiny', 'Very large', 'Quiet', 'Fast'], correct: 1 },
  { q: "Opposite of 'frequently':", category: 'Vocabulary', options: ['Often', 'Usually', 'Rarely', 'Always'], correct: 2 },
  // Sentence Completion
  { q: "I'm looking forward ___ meeting you.", category: 'Sentence', options: ['for', 'of', 'to', 'at'], correct: 2 },
  { q: 'He succeeded ___ passing the exam.', category: 'Sentence', options: ['in', 'on', 'at', 'for'], correct: 0 },
  { q: 'She apologized ___ being late.', category: 'Sentence', options: ['to', 'of', 'for', 'at'], correct: 2 },
  { q: 'Would you mind ___ the window?', category: 'Sentence', options: ['close', 'closed', 'closing', 'to close'], correct: 2 },
  { q: "She's been learning English ___ three years.", category: 'Sentence', options: ['since', 'for', 'during', 'from'], correct: 1 },
  { q: 'I wish I ___ speak French fluently.', category: 'Sentence', options: ['will', 'would', 'could', 'should'], correct: 2 },
  { q: "He's the kind of person ___ never gives up.", category: 'Sentence', options: ['which', 'what', 'who', 'whose'], correct: 2 },
];

const CATEGORY_COLOR = {
  Grammar:    '#4ade80',
  Vocabulary: '#60a5fa',
  Sentence:   '#a78bfa',
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function EnglishSurvivalChallenge() {
  const router  = useRouter();
  const insets  = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [questions,       setQuestions]       = useState(() => shuffle(QUESTION_BANK).slice(0, GAME_SIZE));
  const [qIndex,          setQIndex]          = useState(0);
  const [lives,           setLives]           = useState(MAX_LIVES);
  const [score,           setScore]           = useState(0);
  const [streak,          setStreak]          = useState(0);
  const [timeLeft,        setTimeLeft]        = useState(TIME_LIMIT);
  const [selected,        setSelected]        = useState(null); // option index or null
  const [phase,           setPhase]           = useState('playing'); // playing | result | gameover | victory
  const [timeUp,          setTimeUp]          = useState(false);

  const timerRef = useRef(null);

  const currentQ = questions[qIndex];

  // ── Timer ──────────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(TIME_LIMIT);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [stopTimer]);

  // When timeLeft hits 0 and we're still playing
  useEffect(() => {
    if (timeLeft === 0 && phase === 'playing') {
      handleTimeUp();
    }
  }, [timeLeft, phase]);

  // Start timer on each new question
  useEffect(() => {
    if (phase === 'playing') startTimer();
    return stopTimer;
  }, [qIndex, phase]);

  // ── Answer logic ──────────────────────────────────────────────────────────
  const handleTimeUp = () => {
    stopTimer();
    setTimeUp(true);
    setSelected(-1); // -1 = no answer
    const newLives = lives - 1;
    setLives(newLives);
    setStreak(0);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setPhase('result');
    scheduleNext(newLives);
  };

  const handleAnswer = (optIndex) => {
    if (phase !== 'playing') return;
    stopTimer();
    setSelected(optIndex);
    setTimeUp(false);

    const isCorrect = optIndex === currentQ.correct;

    if (isCorrect) {
      const newStreak = streak + 1;
      const bonus     = newStreak >= 3 ? 5 : 0;
      const timeBonus = timeLeft >= 7 ? 5 : 0;
      setScore((s) => s + 10 + bonus + timeBonus);
      setStreak(newStreak);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    setPhase('result');
    scheduleNext(isCorrect ? lives : lives - 1);
  };

  const scheduleNext = (remainingLives) => {
    setTimeout(() => {
      const nextIndex = qIndex + 1;
      if (remainingLives <= 0) {
        setPhase('gameover');
      } else if (nextIndex >= questions.length) {
        setPhase('victory');
      } else {
        setQIndex(nextIndex);
        setSelected(null);
        setTimeUp(false);
        setPhase('playing');
      }
    }, 1200);
  };

  const resetGame = () => {
    stopTimer();
    setQuestions(shuffle(QUESTION_BANK).slice(0, GAME_SIZE));
    setQIndex(0);
    setLives(MAX_LIVES);
    setScore(0);
    setStreak(0);
    setTimeLeft(TIME_LIMIT);
    setSelected(null);
    setTimeUp(false);
    setPhase('playing');
  };

  // ── Option styling ─────────────────────────────────────────────────────────
  const getOptionStyle = (optIndex) => {
    if (phase !== 'result' || (selected === null && !timeUp)) return 'default';
    if (optIndex === currentQ.correct) return 'correct';
    if (optIndex === selected) return 'wrong';
    return 'default';
  };

  const optionBg = (state) => {
    if (state === 'correct') return '#16a34a';
    if (state === 'wrong')   return '#dc2626';
    return colors.surface;
  };

  const optionBorder = (state) => {
    if (state === 'correct') return '#4ade80';
    if (state === 'wrong')   return '#ef4444';
    return colors.border;
  };

  // ── Timer bar color ────────────────────────────────────────────────────────
  const timerColor = timeLeft <= 3 ? '#ef4444' : timeLeft <= 6 ? '#f59e0b' : '#4ade80';
  const timerPct   = (timeLeft / TIME_LIMIT) * 100;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* ── Gradient Header ── */}
      <LinearGradient
        colors={colors.gradientHero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 14 }]}
      >
        <View style={styles.headerBlob1} />
        <View style={styles.headerBlob2} />

        <View style={styles.headerRow}>
          {/* Back */}
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/quest')} style={styles.headerBtn}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.headerCenter}>
            <Text style={[styles.headerEyebrow, { fontFamily: 'Cairo_600SemiBold' }]}>Daily Challenge</Text>
            <Text style={[styles.headerTitle, { fontFamily: 'Cairo_800ExtraBold' }]}>English Survival</Text>
          </View>

          {/* Score */}
          <View style={styles.scorePill}>
            <Ionicons name="star" size={13} color="#fbbf24" />
            <Text style={[styles.scoreText, { fontFamily: 'Cairo_800ExtraBold' }]}>{score}</Text>
          </View>
        </View>

        {/* Lives + Streak */}
        <View style={styles.statusRow}>
          <View style={styles.livesRow}>
            {[...Array(MAX_LIVES)].map((_, i) => (
              <Ionicons
                key={i}
                name={i < lives ? 'heart' : 'heart-outline'}
                size={22}
                color={i < lives ? '#ef4444' : 'rgba(255,255,255,0.3)'}
              />
            ))}
          </View>

          <View style={styles.progressPill}>
            <Text style={[styles.progressText, { fontFamily: 'Cairo_700Bold' }]}>
              {qIndex + 1} / {questions.length}
            </Text>
          </View>

          {streak >= 2 && (
            <MotiView
              from={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
              style={styles.streakBadge}
            >
              <Text style={[styles.streakText, { fontFamily: 'Cairo_800ExtraBold' }]}>🔥 ×{streak}</Text>
            </MotiView>
          )}
        </View>

        {/* Timer bar */}
        <View style={styles.timerTrack}>
          <MotiView
            animate={{ width: `${timerPct}%` }}
            transition={{ type: 'timing', duration: 1000 }}
            style={[styles.timerFill, { backgroundColor: timerColor }]}
          />
        </View>
      </LinearGradient>

      {/* ── Question Area ── */}
      <View style={styles.body}>
        <AnimatePresence>
          <MotiView
            key={qIndex}
            from={{ opacity: 0, translateX: 40 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: -40 }}
            transition={{ type: 'timing', duration: 260 }}
            style={styles.questionBlock}
          >
            {/* Category badge */}
            <View style={[styles.categoryBadge, { backgroundColor: `${CATEGORY_COLOR[currentQ.category]}22`, borderColor: `${CATEGORY_COLOR[currentQ.category]}55` }]}>
              <View style={[styles.categoryDot, { backgroundColor: CATEGORY_COLOR[currentQ.category] }]} />
              <Text style={[styles.categoryText, { color: CATEGORY_COLOR[currentQ.category], fontFamily: 'Cairo_700Bold' }]}>
                {currentQ.category}
              </Text>
            </View>

            {/* Question card */}
            <View style={[styles.questionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.qDecorBar, { backgroundColor: CATEGORY_COLOR[currentQ.category] }]} />
              <Text style={[styles.questionText, { color: colors.text, fontFamily: 'Cairo_700Bold' }]}>
                {currentQ.q}
              </Text>
            </View>

            {/* Time-up message */}
            {timeUp && phase === 'result' && (
              <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.timeUpBadge}
              >
                <Text style={[styles.timeUpText, { fontFamily: 'Cairo_800ExtraBold' }]}>⏱ Time's up!</Text>
              </MotiView>
            )}
          </MotiView>
        </AnimatePresence>

        {/* ── Options grid ── */}
        <View style={styles.optionsGrid}>
          {currentQ.options.map((opt, i) => {
            const state = getOptionStyle(i);
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.8}
                disabled={phase !== 'playing'}
                onPress={() => handleAnswer(i)}
                style={[
                  styles.optionBtn,
                  {
                    backgroundColor: optionBg(state),
                    borderColor: optionBorder(state),
                    borderWidth: state !== 'default' ? 2 : 1.5,
                  },
                ]}
              >
                <View style={[styles.optionIndex, { backgroundColor: state !== 'default' ? 'rgba(255,255,255,0.2)' : colors.surfaceAlt }]}>
                  <Text style={[styles.optionIndexText, { color: state !== 'default' ? '#fff' : colors.textSecondary, fontFamily: 'Cairo_800ExtraBold' }]}>
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    { color: state !== 'default' ? '#ffffff' : colors.text, fontFamily: 'Cairo_700Bold' },
                  ]}
                  numberOfLines={2}
                >
                  {opt}
                </Text>
                {state === 'correct' && <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.optionIcon} />}
                {state === 'wrong'   && <Ionicons name="close-circle"     size={20} color="#fff" style={styles.optionIcon} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Game Over overlay ── */}
      {phase === 'gameover' && (
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.overlay}>
          <MotiView
            from={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 100 }}
            style={[styles.overlayCard, { backgroundColor: colors.surface }]}
          >
            <Text style={styles.overlayEmoji}>💔</Text>
            <Text style={[styles.overlayTitle, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>Out of Lives!</Text>
            <Text style={[styles.overlaySub, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
              You answered {qIndex} of {questions.length} questions
            </Text>
            <View style={[styles.overlayScore, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name="star" size={18} color="#fbbf24" />
              <Text style={[styles.overlayScoreText, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>{score} pts</Text>
            </View>
            <TouchableOpacity style={styles.retryBtn} onPress={resetGame}>
              <LinearGradient colors={colors.gradientHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.retryGrad}>
                <Ionicons name="refresh" size={18} color="#fff" />
                <Text style={[styles.retryText, { fontFamily: 'Cairo_800ExtraBold' }]}>Try Again</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/quest')} style={styles.exitLink}>
              <Text style={[styles.exitLinkText, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>Exit</Text>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      )}

      {/* ── Victory overlay ── */}
      {phase === 'victory' && (
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.overlay}>
          <MotiView
            from={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 100 }}
            style={[styles.overlayCard, { backgroundColor: colors.surface }]}
          >
            <Text style={styles.overlayEmoji}>🏆</Text>
            <Text style={[styles.overlayTitle, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>Challenge Complete!</Text>
            <Text style={[styles.overlaySub, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
              You survived all {questions.length} questions
            </Text>
            <View style={[styles.overlayScore, { backgroundColor: colors.surfaceAlt }]}>
              <Ionicons name="star" size={18} color="#fbbf24" />
              <Text style={[styles.overlayScoreText, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>{score} pts</Text>
            </View>
            <TouchableOpacity style={styles.retryBtn} onPress={resetGame}>
              <LinearGradient colors={colors.gradientHero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.retryGrad}>
                <Ionicons name="refresh" size={18} color="#fff" />
                <Text style={[styles.retryText, { fontFamily: 'Cairo_800ExtraBold' }]}>Play Again</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/quest')} style={styles.exitLink}>
              <Text style={[styles.exitLinkText, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>Back to Quest</Text>
            </TouchableOpacity>
          </MotiView>
        </MotiView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: { paddingHorizontal: 20, paddingBottom: 18, overflow: 'hidden', position: 'relative' },
  headerBlob1: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.05)', top: -50, right: -30 },
  headerBlob2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.04)', bottom: -20, left: 30 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  headerBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1 },
  headerEyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1.2 },
  headerTitle: { fontSize: 18, color: '#ffffff', marginTop: 1 },
  scorePill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.25)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  scoreText: { color: '#fff', fontSize: 15 },

  // Status
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  livesRow: { flexDirection: 'row', gap: 4 },
  progressPill: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  progressText: { fontSize: 12, color: '#ffffff' },
  streakBadge: { backgroundColor: 'rgba(245,158,11,0.25)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  streakText: { fontSize: 12, color: '#fbbf24' },

  // Timer
  timerTrack: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  timerFill: { height: 6, borderRadius: 3 },

  // Body
  body: { flex: 1, padding: 20, justifyContent: 'space-between' },
  questionBlock: { flex: 1, justifyContent: 'flex-start' },

  categoryBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, marginBottom: 14 },
  categoryDot: { width: 7, height: 7, borderRadius: 3.5 },
  categoryText: { fontSize: 12 },

  questionCard: {
    borderRadius: 18, borderWidth: 1.5, flexDirection: 'row', gap: 14,
    padding: 18, paddingLeft: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  qDecorBar: { width: 4, borderRadius: 2, minHeight: 36, flexShrink: 0 },
  questionText: { flex: 1, fontSize: 17, lineHeight: 26 },

  timeUpBadge: { alignSelf: 'center', marginTop: 12, backgroundColor: 'rgba(239,68,68,0.12)', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 7 },
  timeUpText: { color: '#ef4444', fontSize: 14 },

  // Options
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 16 },
  optionBtn: {
    width: (width - 52) / 2,
    borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  optionIndex: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  optionIndexText: { fontSize: 13 },
  optionText: { flex: 1, fontSize: 14, lineHeight: 20 },
  optionIcon: { flexShrink: 0 },

  // Overlays
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', zIndex: 20, padding: 24 },
  overlayCard: { width: '100%', borderRadius: 28, padding: 32, alignItems: 'center', gap: 12 },
  overlayEmoji: { fontSize: 60 },
  overlayTitle: { fontSize: 24, textAlign: 'center' },
  overlaySub: { fontSize: 14, textAlign: 'center', opacity: 0.75 },
  overlayScore: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 16, marginTop: 4 },
  overlayScoreText: { fontSize: 22 },
  retryBtn: { width: '100%', borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  retryGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  retryText: { color: '#fff', fontSize: 16 },
  exitLink: { paddingVertical: 8 },
  exitLinkText: { fontSize: 14 },
});
