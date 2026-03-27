import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useQuiz } from '../../context/QuizContext';
import { useAuth } from '../../context/AuthContext';
import { saveQuizProgress } from '../../lib/api';
import QuizOption from '../../components/QuizOption';

export default function ReadingQuizScreen() {
  const router = useRouter();

  const { colors } = useTheme();
  const {
    type,
    formNumber,
    questions,
    currentIndex,
    currentQuestion,
    currentAnswer,
    answers,
    totalQuestions,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    isComplete,
  } = useQuiz();

  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [trackWidth, setTrackWidth] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const bottomInset = insets.bottom;

  const answered = currentAnswer !== undefined && currentAnswer !== null;

  useEffect(() => {
    if (!questions || questions.length === 0 || type !== 'reading') {
      router.replace('/(tabs)/reading');
    }
  }, []);

  useEffect(() => {
    if (isComplete) router.replace('/results');
  }, [isComplete]);

  const progress = currentQuestion ? currentIndex / totalQuestions : 0;

  useEffect(() => {
    if (trackWidth > 0) {
      Animated.timing(progressAnim, {
        toValue: progress * trackWidth,
        duration: 450,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, trackWidth]);

  if (!currentQuestion) return null;

  const options = [
    { number: 1, text: currentQuestion.optiona },
    { number: 2, text: currentQuestion.optionb },
    { number: 3, text: currentQuestion.optionc },
    { number: 4, text: currentQuestion.optiond },
  ];

  const getOptionState = (optionNumber) => {
    if (!answered) return 'default';
    const correct = currentQuestion.correctoption;
    if (optionNumber === correct) return 'correct';
    if (optionNumber === currentAnswer) return 'wrong';
    return 'default';
  };

  const handleAnswer = (optionNumber) => {
    if (answered) return;
    answerQuestion(currentQuestion.qno, optionNumber);
    if (user) {
      const newAnswers = { ...answers, [currentQuestion.qno]: optionNumber };
      saveQuizProgress({ userId: user.id, quizType: 'reading', formNumber, currentIndex, answers: newAnswers });
    }
  };

  const handlePrev = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    prevQuestion();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentIndex === totalQuestions - 1) {
      finishQuiz();
    } else {
      nextQuestion();
    }
  };

  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={colors.gradientReading}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 14 }]}
      >
        <View style={styles.headerBlob1} />
        <View style={styles.headerBlob2} />

        <View style={styles.headerTopRow}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
            style={styles.headerBackBtn}
          >
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerTitleBlock}>
            <Text style={[styles.headerEyebrow, { fontFamily: 'Poppins_700Bold' }]}>
              READING QUIZ
            </Text>
            <Text style={[styles.headerTitle, { fontFamily: 'Poppins_800ExtraBold' }]} numberOfLines={1}>
              Form {formNumber}
            </Text>
          </View>

          <View style={styles.headerIconBadge}>
            <Ionicons name="book" size={20} color="#ffffff" />
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressMeta}>
            <Text style={[styles.progressLabel, { fontFamily: 'Poppins_600SemiBold' }]}>
              Question {currentIndex + 1} of {totalQuestions}
            </Text>
            <Text style={[styles.progressPct, { fontFamily: 'Poppins_800ExtraBold' }]}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
          <View
            style={styles.progressTrack}
            onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          >
            <Animated.View style={[styles.progressFill, { width: progressAnim }]} />
            <Animated.View style={[styles.progressGlow, { width: progressAnim }]} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 + bottomInset }]}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          key={currentIndex}
          from={{ opacity: 0, translateX: 30 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          <View style={styles.questionHeader}>
            <Text style={[styles.questionNum, { color: colors.textSecondary, fontFamily: 'Poppins_800ExtraBold' }]}>
              Question {currentIndex + 1} of {totalQuestions}
            </Text>
          </View>

          {/* Question text card */}
          <View style={[styles.questionCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.questionDecorBar, { backgroundColor: colors.accent }]} />
            <Text style={[styles.questionText, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
              {currentQuestion.questiontext}
            </Text>
          </View>

          <Text style={[styles.pickLabel, { color: colors.textSecondary, fontFamily: 'Poppins_800ExtraBold' }]}>
            Choose one answer:
          </Text>

          {options.map((opt) => (
            <QuizOption
              key={opt.number}
              optionNumber={opt.number}
              text={opt.text || ''}
              state={getOptionState(opt.number)}
              onPress={() => handleAnswer(opt.number)}
              disabled={answered}
            />
          ))}
        </MotiView>
      </ScrollView>

      {/* Bottom navigation */}
      <View style={[styles.bottomBar, { paddingBottom: 16 + bottomInset }]}>
        <View style={styles.bottomRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePrev}
            disabled={currentIndex === 0}
            style={[
              styles.navBtn,
              { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1.5 },
              currentIndex === 0 && { opacity: 0.35 },
            ]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
            <Text style={[styles.navBtnText, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
              PREVIOUS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNext}
            style={[styles.navBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={[styles.navBtnText, { color: '#ffffff', fontFamily: 'Poppins_800ExtraBold' }]}>
              {isLastQuestion ? 'FINISH' : answered ? 'NEXT' : 'SKIP'}
            </Text>
            <Ionicons
              name={isLastQuestion ? 'checkmark-circle' : 'arrow-forward'}
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  headerBlob1: {
    position: 'absolute', width: 170, height: 170, borderRadius: 85,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -50, right: -30,
  },
  headerBlob2: {
    position: 'absolute', width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: 30,
  },
  headerTopRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24,
  },
  headerBackBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitleBlock: { flex: 1 },
  headerEyebrow: {
    fontSize: 11, color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 3,
  },
  headerTitle: { fontSize: 20, color: '#ffffff' },
  headerIconBadge: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  progressSection: { gap: 10 },
  progressMeta: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  progressLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  progressPct: { fontSize: 14, color: '#ffffff' },
  progressTrack: {
    height: 10, borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  progressFill: { height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.95)' },
  progressGlow: {
    position: 'absolute', height: 10, borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.35)', top: 0,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  questionHeader: { marginBottom: 12 },
  questionNum: { fontSize: 12 },
  questionCard: {
    borderRadius: 16, padding: 16, paddingLeft: 20, marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    flexDirection: 'row', gap: 14,
    position: 'relative', overflow: 'hidden',
  },
  questionDecorBar: { width: 4, borderRadius: 2, minHeight: 40, flexShrink: 0 },
  questionText: { flex: 1, fontSize: 14, lineHeight: 22 },
  pickLabel: { fontSize: 12, marginBottom: 8 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 16,
    backgroundColor: 'transparent',
  },
  bottomRow: { flexDirection: 'row', gap: 12 },
  navBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 18, borderRadius: 18, gap: 10,
    elevation: 4, shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  navBtnText: { fontSize: 16, letterSpacing: 1 },
});
