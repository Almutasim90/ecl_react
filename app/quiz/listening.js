import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
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

  const { colors, isDark } = useTheme();
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
  const audioRef = useRef(null);

  // Kill audio immediately when leaving the screen (tab switch, swipe back, etc.)
  useFocusEffect(
    useCallback(() => {
      return () => {
        audioRef.current?.stop();
      };
    }, [])
  );

  // Android hardware back button — stop audio before popping the screen
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      audioRef.current?.stop();
      return false; // let the default back navigation proceed
    });
    return () => subscription.remove();
  }, []);

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
    audioRef.current?.stop();
    prevQuestion();
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    audioRef.current?.stop();
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
        colors={colors.gradientListening}
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
              audioRef.current?.stop();
              router.back();
            }}
            style={styles.headerBackBtn}
          >
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.headerTitleBlock}>
            <Text style={[styles.headerEyebrow, { fontFamily: 'Poppins_700Bold' }]}>
              LISTENING QUIZ
            </Text>
            <Text style={[styles.headerTitle, { fontFamily: 'Poppins_800ExtraBold' }]} numberOfLines={1}>
              Form {formNumber}
            </Text>
          </View>

          <View style={styles.headerIconBadge}>
            <Ionicons name="headset" size={20} color="#ffffff" />
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
              <Text style={[styles.qBadgeText, { color: colors.accent, fontFamily: 'Poppins_800ExtraBold' }]}>
                QUESTION {currentIndex + 1}
              </Text>
            </View>
            <Text style={[styles.questionTitle, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
              Listen carefully and select the best answer.
            </Text>
          </View>

          <View style={styles.audioWrapper}>
            <AudioPlayer ref={audioRef} audioUrl={getAudioUrl(currentQuestion.audiofile)} />
          </View>

          <View style={styles.pickHeader}>
            <Ionicons name="list" size={18} color={colors.textSecondary} />
            <Text style={[styles.pickLabel, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
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
            <Text style={[styles.navBtnText, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
              BACK
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
    paddingHorizontal: 24, paddingBottom: 28,
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
  scrollContent: { paddingHorizontal: 24, paddingTop: 24 },
  questionHeader: { marginBottom: 24 },
  qBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 8, marginBottom: 12,
  },
  qBadgeText: { fontSize: 12, letterSpacing: 1 },
  questionTitle: { fontSize: 14, lineHeight: 22 },
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
