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
import QuizOption from '../../components/QuizOption';

export default function ReadingQuizScreen() {
  const router = useRouter();
  const { form } = useLocalSearchParams();
  const { isDark } = useTheme();
  const {
    type,
    formNumber,
    questions,
    currentIndex,
    currentQuestion,
    currentAnswer,
    totalQuestions,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    finishQuiz,
    isComplete,
  } = useQuiz();

  const insets = useSafeAreaInsets();
  const bgColor = isDark ? '#0f172a' : '#f5f3ff';
  const cardBg = isDark ? 'rgba(30,41,59,0.9)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#1e1b4b';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const accentColor = '#7c3aed';

  const [trackWidth, setTrackWidth] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const bottomInset = Platform.OS === 'android' ? insets.bottom : 0;

  useEffect(() => {
    if (!questions || questions.length === 0 || type !== 'reading') {
      router.replace('/(tabs)/reading');
    }
  }, []);

  useEffect(() => {
    if (isComplete) {
      router.replace('/results');
    }
  }, [isComplete]);

  if (!currentQuestion) return null;

  const options = [
    { number: 1, text: currentQuestion.optiona },
    { number: 2, text: currentQuestion.optionb },
    { number: 3, text: currentQuestion.optionc },
    { number: 4, text: currentQuestion.optiond },
  ];

  const getOptionState = (optionNumber) => {
    if (currentAnswer === undefined || currentAnswer === null) return 'default';
    const correct = currentQuestion.correctoption;
    if (optionNumber === correct) return 'correct';
    if (optionNumber === currentAnswer) return 'wrong';
    return 'default';
  };

  const progress = (currentIndex + 1) / totalQuestions;

  useEffect(() => {
    if (trackWidth > 0) {
      Animated.timing(progressAnim, {
        toValue: progress * trackWidth,
        duration: 450,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, trackWidth]);

  const handleAnswer = (optionNumber) => {
    if (currentAnswer !== undefined && currentAnswer !== null) return;
    answerQuestion(currentQuestion.qno, optionNumber);
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
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={[styles.backBtn, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}
        >
          <Ionicons name="arrow-back" size={20} color={textColor} />
        </TouchableOpacity>

        <View style={styles.topCenter}>
          <Text style={[styles.formLabel, { color: accentColor, fontFamily: 'Inter_600SemiBold' }]}>
            Form {formNumber}
          </Text>
          <Text style={[styles.questionCounter, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
            {currentIndex + 1} / {totalQuestions}
          </Text>
        </View>

        <View style={[styles.bookBadge, { backgroundColor: 'rgba(124,58,237,0.12)' }]}>
          <Ionicons name="book" size={18} color={accentColor} />
        </View>
      </View>

      {/* Progress bar */}
      <View
        style={[styles.progressTrack, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          style={[styles.progressFill, { backgroundColor: accentColor, width: progressAnim }]}
        />
        <View style={[styles.progressGlow, { backgroundColor: accentColor, opacity: 0.25, width: progressAnim }]} />
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
          {/* Question Header */}
          <View style={styles.questionHeader}>
            <Text style={[styles.questionNum, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
              Question {currentIndex + 1} of {totalQuestions}
            </Text>
          </View>

          {/* Question Text Card */}
          <View style={[styles.questionCard, { backgroundColor: cardBg }]}>
            <View style={[styles.questionDecorBar, { backgroundColor: accentColor }]} />
            <Text style={[styles.questionText, { color: textColor, fontFamily: 'Inter_500Medium' }]}>
              {currentQuestion.questiontext}
            </Text>
          </View>

          {/* Options */}
          <Text style={[styles.pickLabel, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
            Choose one answer:
          </Text>

          {options.map((opt) => (
            <QuizOption
              key={opt.number}
              optionNumber={opt.number}
              text={opt.text || ''}
              state={getOptionState(opt.number)}
              onPress={() => handleAnswer(opt.number)}
              disabled={currentAnswer !== undefined && currentAnswer !== null}
            />
          ))}
        </MotiView>
      </ScrollView>

      {/* Bottom navigation */}
      <View style={[styles.bottomBar, { paddingBottom: 16 + bottomInset }]}>
        <View style={styles.bottomRow}>
          {currentIndex > 0 ? (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handlePrev}
              style={[styles.prevBtn, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}
            >
              <Ionicons name="arrow-back" size={20} color={subtextColor} />
              <Text style={[styles.prevText, { color: subtextColor, fontFamily: 'Inter_600SemiBold' }]}>
                Previous
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.prevPlaceholder} />
          )}

          <TouchableOpacity
            activeOpacity={currentAnswer !== undefined && currentAnswer !== null ? 0.85 : 1}
            disabled={currentAnswer === undefined || currentAnswer === null}
            onPress={handleNext}
            style={[
              styles.nextBtn,
              {
                backgroundColor:
                  currentAnswer !== undefined && currentAnswer !== null
                    ? accentColor
                    : isDark ? '#1e293b' : '#e2e8f0',
              },
            ]}
          >
            <Text
              style={[
                styles.nextText,
                {
                  color:
                    currentAnswer !== undefined && currentAnswer !== null ? '#ffffff' : subtextColor,
                  fontFamily: 'Inter_600SemiBold',
                },
              ]}
            >
              {isLastQuestion ? 'Finish Quiz' : 'Next'}
            </Text>
            <Ionicons
              name={isLastQuestion ? 'checkmark-circle' : 'arrow-forward'}
              size={20}
              color={currentAnswer !== undefined && currentAnswer !== null ? '#ffffff' : subtextColor}
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
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCenter: { flex: 1, alignItems: 'center' },
  formLabel: { fontSize: 15 },
  questionCounter: { fontSize: 13, marginTop: 2 },
  bookBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTrack: {
    height: 4,
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: { height: 4, borderRadius: 2 },
  progressGlow: { position: 'absolute', height: 10, borderRadius: 5, top: -3 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  questionHeader: { marginBottom: 12 },
  questionNum: { fontSize: 13 },
  questionCard: {
    borderRadius: 16,
    padding: 16,
    paddingLeft: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    gap: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  questionDecorBar: {
    width: 4,
    borderRadius: 2,
    minHeight: 40,
    flexShrink: 0,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
  },
  pickLabel: {
    fontSize: 13,
    marginBottom: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 10,
  },
  prevBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 6,
  },
  prevText: { fontSize: 15 },
  prevPlaceholder: { flex: 0, width: 0 },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  nextText: { fontSize: 16 },
});
