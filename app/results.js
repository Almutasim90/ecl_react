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
  const { isDark } = useTheme();
  const { user } = useAuth();
  const {
    type,
    formNumber,
    questions,
    answers,
    calculateScore,
    resetQuiz,
  } = useQuiz();

  const bgColor = isDark ? '#0f172a' : '#f5f3ff';
  const cardBg = isDark ? 'rgba(30,41,59,0.9)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#1e1b4b';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';

  const score = useMemo(() => calculateScore(), [questions, answers]);
  const total = questions.length;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const savedRef = useRef(false);
  useEffect(() => {
    if (savedRef.current || !user || !questions || questions.length === 0) return;
    savedRef.current = true;
    console.log('[Results] Saving quiz result for user:', user.id);
    saveQuizResult({
      userId: user.id,
      quizType: type,
      formNumber,
      score,
      totalQuestions: total,
      percentage,
    }).then(({ error }) => {
      if (error) {
        console.error('[Results] Save failed:', error.message);
      } else {
        console.log('[Results] Saved successfully');
        deleteQuizProgress(user.id, type, formNumber);
      }
    });
  }, [user]);

  const getGradeInfo = () => {
    if (percentage >= 70) return { label: 'Passed', color: '#10b981', gradients: ['#059669', '#10b981'], icon: 'checkmark-circle' };
    if (percentage >= 50) return { label: 'Almost', color: '#f59e0b', gradients: ['#d97706', '#f59e0b'], icon: 'alert-circle' };
    return { label: 'Try Again', color: '#ef4444', gradients: ['#dc2626', '#ef4444'], icon: 'close-circle' };
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
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <View style={styles.centered}>
          <Text style={[styles.emptyText, { color: subtextColor }]}>No results to show.</Text>
          <TouchableOpacity onPress={handleHome} style={styles.homeBtn}>
            <Text style={[styles.homeBtnText, { color: '#7c3aed' }]}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
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

            <Ionicons name={grade.icon} size={48} color="#ffffff" style={styles.gradeIcon} />

            <Text style={[styles.gradeLabel, { fontFamily: 'Inter_600SemiBold' }]}>
              {grade.label}
            </Text>

            <View style={styles.scoreRow}>
              <Text style={[styles.scoreNum, { fontFamily: 'Inter_600SemiBold' }]}>
                {score}
              </Text>
              <Text style={[styles.scoreTotal, { fontFamily: 'Inter_400Regular' }]}>
                /{total}
              </Text>
            </View>

            <Text style={[styles.percentText, { fontFamily: 'Inter_600SemiBold' }]}>
              {percentage}%
            </Text>

            <View style={styles.formBadge}>
              <Ionicons
                name={type === 'listening' ? 'headset' : type === 'grammar' ? 'language' : 'book'}
                size={14}
                color="#ffffff"
              />
              <Text style={[styles.formBadgeText, { fontFamily: 'Inter_400Regular' }]}>
                {type === 'listening' ? 'Listening' : type === 'grammar' ? 'Grammar' : 'Reading'} · Form {formNumber}
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
            style={[styles.actionBtn, styles.tryAgainBtn]}
          >
            <Ionicons name="refresh" size={18} color="#7c3aed" />
            <Text style={[styles.tryAgainText, { fontFamily: 'Inter_600SemiBold' }]}>
              Try Again
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleHome}
            style={[styles.actionBtn, { backgroundColor: '#7c3aed' }]}
          >
            <Ionicons name="home" size={18} color="#ffffff" />
            <Text style={[styles.homeText, { fontFamily: 'Inter_600SemiBold' }]}>
              Home
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* Review Section */}
        <Text style={[styles.sectionTitle, { color: textColor, fontFamily: 'Inter_600SemiBold' }]}>
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
              <View style={[styles.reviewCard, { backgroundColor: cardBg }]}>
                {/* Left status bar */}
                <View style={[
                  styles.reviewStatusBar,
                  { backgroundColor: isCorrect ? '#10b981' : '#ef4444' }
                ]} />

                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={[styles.reviewQnum, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
                      Q{idx + 1}
                    </Text>
                    <View style={[
                      styles.reviewBadge,
                      { backgroundColor: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }
                    ]}>
                      <Ionicons
                        name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                        size={14}
                        color={isCorrect ? '#10b981' : '#ef4444'}
                      />
                      <Text style={[
                        styles.reviewBadgeText,
                        { color: isCorrect ? '#10b981' : '#ef4444', fontFamily: 'Inter_600SemiBold' }
                      ]}>
                        {isCorrect ? 'Correct' : 'Wrong'}
                      </Text>
                    </View>
                  </View>

                  {q.questiontext ? (
                    <Text style={[styles.reviewQuestion, { color: textColor, fontFamily: 'Inter_400Regular' }]} numberOfLines={2}>
                      {q.questiontext}
                    </Text>
                  ) : (
                    <Text style={[styles.reviewQuestion, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
                      Audio question {idx + 1}
                    </Text>
                  )}

                  <View style={styles.reviewAnswerRow}>
                    <View style={[styles.answerChip, { backgroundColor: isCorrect ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }]}>
                      <Text style={[styles.answerChipLabel, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
                        Your answer:
                      </Text>
                      <Text style={[styles.answerChipValue, { color: isCorrect ? '#10b981' : '#ef4444', fontFamily: 'Inter_600SemiBold' }]}>
                        {userLetter}
                      </Text>
                    </View>
                    {!isCorrect && (
                      <View style={[styles.answerChip, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                        <Text style={[styles.answerChipLabel, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
                          Correct:
                        </Text>
                        <Text style={[styles.answerChipValue, { color: '#10b981', fontFamily: 'Inter_600SemiBold' }]}>
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
  homeBtnText: { fontSize: 16, fontWeight: '600' },
  heroContainer: {
    margin: 20,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -60,
    right: -40,
  },
  heroDecor2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -50,
    left: -30,
  },
  gradeIcon: { marginBottom: 8 },
  gradeLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  scoreNum: { fontSize: 64, color: '#ffffff', lineHeight: 72 },
  scoreTotal: { fontSize: 32, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  percentText: { fontSize: 24, color: 'rgba(255,255,255,0.9)', marginBottom: 16 },
  formBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  formBadgeText: { fontSize: 13, color: '#ffffff' },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 28,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  tryAgainBtn: {
    borderWidth: 2,
    borderColor: '#7c3aed',
    backgroundColor: 'transparent',
  },
  tryAgainText: { fontSize: 15, color: '#7c3aed' },
  homeText: { fontSize: 15, color: '#ffffff' },
  sectionTitle: {
    fontSize: 18,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  reviewCard: {
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  reviewStatusBar: {
    width: 4,
    flexShrink: 0,
  },
  reviewContent: {
    flex: 1,
    padding: 14,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewQnum: { fontSize: 13 },
  reviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  reviewBadgeText: { fontSize: 12 },
  reviewQuestion: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewAnswerRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  answerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  answerChipLabel: { fontSize: 12 },
  answerChipValue: { fontSize: 14 },
});
