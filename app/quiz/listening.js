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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useQuiz } from '../../context/QuizContext';
import { useAuth } from '../../context/AuthContext';
import { getAudioUrl, saveQuizProgress } from '../../lib/api';
import QuizOption from '../../components/QuizOption';
import AudioPlayer from '../../components/AudioPlayer';

export default function ListeningQuizScreen() {
  const router = useRouter();
  const { form } = useLocalSearchParams();
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
    if (!questions || questions.length === 0 || type !== 'listening') {
      router.replace('/(tabs)/listening');
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
      saveQuizProgress({ userId: user.id, quizType: 'listening', formNumber, currentIndex, answers: newAnswers });
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
      {/* ── Standardized Header ── */}
      <View style={{ overflow: 'hidden', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <LinearGradient
          colors={colors.gradientListening}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={[styles.headerBackBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
            >
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.headerTitleBlock}>
              <Text style={[styles.headerEyebrow, { fontFamily: 'Cairo_700Bold' }]}>
                LISTENING QUEST
              </Text>
              <Text style={[styles.headerTitle, { fontFamily: 'Cairo_800ExtraBold' }]} numberOfLines={1}>
                Form {formNumber}
              </Text>
            </View>

            <View style={[styles.headerIconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="headset" size={24} color="#ffffff" />
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressMeta}>
              <Text style={[styles.progressLabel, { fontFamily: 'Cairo_700Bold' }]}>
                Progress {currentIndex + 1}/{totalQuestions}
              </Text>
              <Text style={[styles.progressPct, { fontFamily: 'Cairo_800ExtraBold' }]}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
            <View
              style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.25)' }]}
              onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
            >
              <Animated.View style={[styles.progressFill, { width: progressAnim, backgroundColor: '#ffffff' }]} />
            </View>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 + bottomInset }]}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          key={currentIndex}
          from={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          <View style={styles.questionHeader}>
            <View style={[styles.qBadge, { backgroundColor: colors.accentSoft }]}>
              <Text style={[styles.qBadgeText, { color: colors.accent, fontFamily: 'Cairo_800ExtraBold' }]}>
                QUESTION {currentIndex + 1}
              </Text>
            </View>
            <Text style={[styles.questionTitle, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>
              Listen carefully and select the best answer.
            </Text>
          </View>

          <View style={styles.audioWrapper}>
            <AudioPlayer audioUrl={getAudioUrl(currentQuestion.audiofile)} />
          </View>

          <View style={styles.pickHeader}>
            <Ionicons name="list" size={18} color={colors.textSecondary} />
            <Text style={[styles.pickLabel, { color: colors.textSecondary, fontFamily: 'Cairo_700Bold' }]}>
              CHOOSE ONE OPTION:
            </Text>
          </View>

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

      {/* ── Fixed Bottom Navigation ── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(20, bottomInset + 10) }]}>
        <LinearGradient
          colors={isDark ? ['transparent', 'rgba(13,13,20,0.95)'] : ['transparent', 'rgba(238,240,251,0.95)']}
          style={styles.bottomGradient}
        />
        <View style={styles.bottomRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePrev}
            disabled={currentIndex === 0}
            style={[
              styles.navBtn,
              { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 2 },
              currentIndex === 0 && { opacity: 0.4 },
            ]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
            <Text style={[styles.navBtnText, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>
              BACK
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNext}
            style={[styles.navBtn, { backgroundColor: colors.accent }]}
          >
            <Text style={[styles.navBtnText, { color: '#ffffff', fontFamily: 'Cairo_800ExtraBold' }]}>
              {isLastQuestion ? 'FINISH' : answered ? 'NEXT' : 'SKIP'}
            </Text>
            <Ionicons
              name={isLastQuestion ? 'checkmark-circle' : 'arrow-forward'}
              size={22}
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
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  headerTopRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24,
  },
  headerBackBtn: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitleBlock: { flex: 1 },
  headerEyebrow: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5, marginBottom: 2,
  },
  headerTitle: { fontSize: 24, color: '#ffffff' },
  headerIconBadge: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  progressSection: { gap: 10 },
  progressMeta: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  progressLabel: { fontSize: 14, color: 'rgba(255,255,255,0.85)' },
  progressPct: { fontSize: 16, color: '#ffffff' },
  progressTrack: {
    height: 12, borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 6 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 24 },
  questionHeader: { marginBottom: 24 },
  qBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 8, marginBottom: 12,
  },
  qBadgeText: { fontSize: 12, letterSpacing: 1 },
  questionTitle: { fontSize: 20, lineHeight: 30 },
  audioWrapper: { marginBottom: 24 },
  pickHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  pickLabel: { fontSize: 12, letterSpacing: 1 },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingTop: 30,
  },
  bottomGradient: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1,
  },
  bottomRow: { flexDirection: 'row', gap: 12 },
  navBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 18, borderRadius: 20, gap: 10,
    elevation: 8, shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
  },
  navBtnText: { fontSize: 16, letterSpacing: 1 },
});
