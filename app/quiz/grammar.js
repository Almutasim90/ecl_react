import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useQuiz } from '../../context/QuizContext';
import { useAuth } from '../../context/AuthContext';
import { saveQuizProgress } from '../../lib/api';
import QuizOption from '../../components/QuizOption';

export default function GrammarQuizScreen() {
  const router = useRouter();
  const { form, typeName } = useLocalSearchParams();
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
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;

  const answered = currentAnswer !== undefined && currentAnswer !== null;

  useEffect(() => {
    if (!questions || questions.length === 0 || type !== 'grammar') {
      router.replace('/(tabs)/grammar');
    }
  }, []);

  useEffect(() => {
    if (isComplete) router.replace('/results');
  }, [isComplete]);

  const progress = currentQuestion ? (currentIndex + 1) / totalQuestions : 0;

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
      saveQuizProgress({ userId: user.id, quizType: 'grammar', formNumber, currentIndex, answers: newAnswers });
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={[styles.backBtn, { backgroundColor: colors.surfaceAlt }]}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.topCenter}>
          <Text style={[styles.formLabel, { color: colors.grammarAccent, fontFamily: 'Inter_600SemiBold' }]}>
            {typeName || `Form ${formNumber}`}
          </Text>
          <Text style={[styles.questionCounter, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
            {currentIndex + 1} / {totalQuestions}
          </Text>
        </View>

        <View style={[styles.grammarBadge, { backgroundColor: `${colors.grammarAccent}1a` }]}>
          <Ionicons name="language" size={18} color={colors.grammarAccent} />
        </View>
      </View>

      {/* Progress bar */}
      <View
        style={[styles.progressTrack, { backgroundColor: colors.border }]}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          style={[styles.progressFill, { backgroundColor: colors.grammarAccent, width: progressAnim }]}
        />
        <View style={[styles.progressGlow, { backgroundColor: colors.grammarAccent, opacity: 0.25, width: progressAnim }]} />
      </View>

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
            <Text style={[styles.questionNum, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              Question {currentIndex + 1} of {totalQuestions}
            </Text>
          </View>

          {/* Question text card */}
          <View style={[styles.questionCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.questionDecorBar, { backgroundColor: colors.grammarAccent }]} />
            <Text style={[styles.questionText, { color: colors.text, fontFamily: 'Inter_500Medium' }]}>
              {currentQuestion.questiontext}
            </Text>
          </View>

          <Text style={[styles.pickLabel, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
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
            <Text style={[styles.navBtnText, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNext}
            style={[styles.navBtn, { backgroundColor: colors.grammarAccent }]}
          >
            <Text style={[styles.navBtnText, { color: '#ffffff', fontFamily: 'Inter_600SemiBold' }]}>
              {isLastQuestion ? 'Finish' : answered ? 'Next' : 'Skip'}
            </Text>
            <Ionicons
              name={isLastQuestion ? 'checkmark-circle' : 'arrow-forward'}
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  topCenter: { flex: 1, alignItems: 'center' },
  formLabel: { fontSize: 15 },
  questionCounter: { fontSize: 13, marginTop: 2 },
  grammarBadge: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  progressTrack: {
    height: 10, marginHorizontal: 20, marginTop: 20,
    borderRadius: 5, overflow: 'hidden', marginBottom: 8,
  },
  progressFill: { height: 10, borderRadius: 2 },
  progressGlow: { position: 'absolute', height: 10, borderRadius: 5, top: -3 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  questionHeader: { marginBottom: 12 },
  questionNum: { fontSize: 13 },
  questionCard: {
    borderRadius: 16, padding: 16, paddingLeft: 20, marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
    flexDirection: 'row', gap: 14,
    position: 'relative', overflow: 'hidden',
  },
  questionDecorBar: { width: 4, borderRadius: 2, minHeight: 40, flexShrink: 0 },
  questionText: { flex: 1, fontSize: 16, lineHeight: 26 },
  pickLabel: { fontSize: 13, marginBottom: 10 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 12,
  },
  bottomRow: { flexDirection: 'row', gap: 10 },
  navBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 16, borderRadius: 16, gap: 8,
  },
  navBtnText: { fontSize: 16 },
});
