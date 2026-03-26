import React, { useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { saveQuizResult, deleteQuizProgress } from '../lib/api';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function ResultsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const {
    type,
    formNumber,
    questions,
    answers,
    calculateScore,
    resetQuiz,
  } = useQuiz();

  const score = useMemo(() => calculateScore(), [questions, answers]);
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const savedRef = useRef(false);
  useEffect(() => {
    if (savedRef.current || !user || !questions || questions.length === 0) return;
    savedRef.current = true;
    saveQuizResult({
      userId: user.id,
      quizType: type,
      formNumber,
      score,
      totalQuestions: total,
      percentage,
    }).then(({ error }) => {
      if (!error) {
        deleteQuizProgress(user.id, type, formNumber);
      }
    });
  }, [user]);

  const getGradeInfo = () => {
    if (percentage >= 70) return { label: 'EXCELLENT', color: colors.success, gradients: colors.gradientHero, icon: 'trophy' };
    if (percentage >= 50) return { label: 'GOOD EFFORT', color: colors.warning, gradients: colors.gradientReading, icon: 'ribbon' };
    return { label: 'KEEP LEARNING', color: colors.error, gradients: ['#ef4444', '#dc2626'], icon: 'school' };
  };

  const grade = getGradeInfo();

  const handleTryAgain = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    resetQuiz();
    if (type === 'listening') {
      router.replace('/(tabs)/listening');
    } else if (type === 'grammar') {
      router.replace('/(tabs)/grammar');
    } else {
      router.replace('/(tabs)/reading');
    }
  };

  const handleHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    resetQuiz();
    router.replace('/(tabs)');
  };

  if (!questions || questions.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: 'Cairo_700Bold' }]}>No results to show.</Text>
          <TouchableOpacity onPress={handleHome} style={styles.homeBtn}>
            <Text style={[styles.homeBtnText, { color: colors.accent, fontFamily: 'Cairo_800ExtraBold' }]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Score Hero */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.heroContainer}
        >
          <LinearGradient
            colors={grade.gradients}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroDecor1} />
            <View style={styles.heroDecor2} />

            <Ionicons name={grade.icon} size={54} color="#ffffff" style={styles.gradeIcon} />

            <Text style={[styles.gradeLabel, { fontFamily: 'Cairo_800ExtraBold' }]}>
              {grade.label}
            </Text>

            <View style={styles.scoreRow}>
              <Text style={[styles.scoreNum, { fontFamily: 'Cairo_800ExtraBold' }]}>
                {score}
              </Text>
              <Text style={[styles.scoreTotal, { fontFamily: 'Cairo_700Bold' }]}>
                /{total}
              </Text>
            </View>

            <Text style={[styles.percentText, { fontFamily: 'Cairo_800ExtraBold' }]}>
              {percentage}%
            </Text>

            <View style={styles.formBadge}>
              <Ionicons
                name={type === 'listening' ? 'headset' : type === 'grammar' ? 'language' : 'book'}
                size={16}
                color="#ffffff"
              />
              <Text style={[styles.formBadgeText, { fontFamily: 'Cairo_700Bold' }]}>
                {type.toUpperCase()} · FORM {formNumber}
              </Text>
            </View>
          </LinearGradient>
        </MotiView>

        {/* Action Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={styles.actionsRow}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleTryAgain}
            style={[styles.actionBtn, styles.tryAgainBtn, { borderColor: colors.accent }]}
          >
            <Ionicons name="refresh" size={20} color={colors.accent} />
            <Text style={[styles.tryAgainText, { color: colors.accent, fontFamily: 'Cairo_800ExtraBold' }]}>
              TRY AGAIN
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleHome}
            style={[styles.actionBtn, { backgroundColor: colors.accent }]}
          >
            <Ionicons name="home" size={20} color="#ffffff" />
            <Text style={[styles.homeText, { fontFamily: 'Cairo_800ExtraBold' }]}>
              HOME
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* Review Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>
          Review Answers
        </Text>

        {questions.map((q, idx) => {
          const userAnswer = answers[q.qno];
          const isCorrect = userAnswer === q.correctoption;
          const correctLetter = OPTION_LETTERS[q.correctoption - 1] || String(q.correctoption);
          const userLetter = userAnswer ? (OPTION_LETTERS[userAnswer - 1] || String(userAnswer)) : '—';

          return (
            <MotiView
              key={q.qno}
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 300 + idx * 40 }}
            >
              <View style={[styles.reviewCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
                {/* Left status bar */}
                <View style={[
                  styles.reviewStatusBar,
                  { backgroundColor: isCorrect ? colors.success : colors.error }
                ]} />

                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewQnum, { color: colors.textSecondary, fontFamily: 'Cairo_700Bold' }]}>
                      QUESTION {idx + 1}
                    </Text>
                    <View style={[
                      styles.reviewBadge,
                      { backgroundColor: isCorrect ? colors.successSoft : colors.errorSoft }
                    ]}>
                      <Ionicons
                        name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                        size={16}
                        color={isCorrect ? colors.success : colors.error}
                      />
                      <Text style={[
                        styles.reviewBadgeText,
                        { color: isCorrect ? colors.success : colors.error, fontFamily: 'Cairo_800ExtraBold' }
                      ]}>
                        {isCorrect ? 'CORRECT' : 'WRONG'}
                      </Text>
                    </View>
                  </View>

                  {q.questiontext ? (
                    <Text style={[styles.reviewQuestion, { color: colors.text, fontFamily: 'Cairo_700Bold' }]} numberOfLines={3}>
                      {q.questiontext}
                    </Text>
                  ) : (
                    <Text style={[styles.reviewQuestion, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
                      Audio question
                    </Text>
                  )}

                  <View style={styles.reviewAnswerRow}>
                    <View style={[styles.answerChip, { backgroundColor: isCorrect ? colors.successSoft : colors.errorSoft }]}>
                      <Text style={[styles.answerChipLabel, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
                        YOURS:
                      </Text>
                      <Text style={[styles.answerChipValue, { color: isCorrect ? colors.success : colors.error, fontFamily: 'Cairo_800ExtraBold' }]}>
                        {userLetter}
                      </Text>
                    </View>
                    {!isCorrect && (
                      <View style={[styles.answerChip, { backgroundColor: colors.successSoft }]}>
                        <Text style={[styles.answerChipLabel, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
                          CORRECT:
                        </Text>
                        <Text style={[styles.answerChipValue, { color: colors.success, fontFamily: 'Cairo_800ExtraBold' }]}>
                          {correctLetter}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </MotiView>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, marginBottom: 16 },
  homeBtn: { padding: 12 },
  homeBtnText: { fontSize: 18 },
  heroContainer: {
    margin: 20,
    borderRadius: 32,
    overflow: 'hidden',
    elevation: 8,
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  hero: {
    padding: 32,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroDecor1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -60,
    right: -40,
  },
  heroDecor2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -50,
    left: -30,
  },
  gradeIcon: { marginBottom: 12 },
  gradeLabel: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  scoreNum: { fontSize: 72, color: '#ffffff', lineHeight: 80 },
  scoreTotal: { fontSize: 32, color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  percentText: { fontSize: 28, color: '#ffffff', marginBottom: 20 },
  formBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  formBadgeText: { fontSize: 12, color: '#ffffff', letterSpacing: 0.5 },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 18,
    gap: 10,
    elevation: 4,
  },
  tryAgainBtn: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  tryAgainText: { fontSize: 15, letterSpacing: 0.5 },
  homeText: { fontSize: 15, color: '#ffffff', letterSpacing: 0.5 },
  sectionTitle: {
    fontSize: 22,
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  reviewCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    elevation: 2,
  },
  reviewStatusBar: {
    width: 6,
    flexShrink: 0,
  },
  reviewContent: {
    flex: 1,
    padding: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewQnum: { fontSize: 12, letterSpacing: 0.5 },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  reviewBadgeText: { fontSize: 11, letterSpacing: 0.5 },
  reviewQuestion: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewAnswerRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  answerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  answerChipLabel: { fontSize: 11 },
  answerChipValue: { fontSize: 15 },
});
