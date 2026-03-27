import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { useQuiz } from '../../context/QuizContext';
import { fetchGrammarQuestions } from '../../lib/api';
import { getLessonContent, ROLE_COLORS } from '../../lib/grammarContent';

const { width: SCREEN_W } = Dimensions.get('window');
const TOTAL_CARDS = 5;
const COMPLETION_KEY = 'lesson_completed_v1';

export default function GrammarLessonScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { startQuiz } = useQuiz();
  const { type, form } = useLocalSearchParams();

  const formNumber = Number(form);
  const content = getLessonContent(type);

  // ── Card navigation state ──────────────────────────────────────────────────
  const [cardIndex, setCardIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [direction, setDirection] = useState(1);

  // ── Mini quiz state ────────────────────────────────────────────────────────
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [startVisible, setStartVisible] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);

  // ── Tip card flip (Reanimated) ─────────────────────────────────────────────
  const flipVal = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const frontStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flipVal.value, [0, 0.5, 1], [1, 0, 0], Extrapolation.CLAMP),
    transform: [{ rotateY: `${interpolate(flipVal.value, [0, 1], [0, 180], Extrapolation.CLAMP)}deg` }],
  }));

  const backStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flipVal.value, [0, 0.5, 1], [0, 0, 1], Extrapolation.CLAMP),
    transform: [{ rotateY: `${interpolate(flipVal.value, [0, 1], [180, 360], Extrapolation.CLAMP)}deg` }],
  }));

  // ── Wrong answer shake (Reanimated) ───────────────────────────────────────
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  // ── Underline draw-in (React Native Animated) ─────────────────────────────
  const underlineW = useRef(new Animated.Value(0)).current;

  // ── Chip tap state for rule card ──────────────────────────────────────────
  const [tappedChip, setTappedChip] = useState(null);

  // ── Start button fade ──────────────────────────────────────────────────────
  const startOpacity = useRef(new Animated.Value(0)).current;

  // ── Load quiz questions ────────────────────────────────────────────────────
  useEffect(() => {
    fetchGrammarQuestions().then((questions) => {
      const forForm = questions.filter((q) => q.formnumber === formNumber);
      setQuizQuestions(forForm);
      if (forForm.length > 0) {
        const pick = forForm[Math.floor(Math.random() * forForm.length)];
        setQuizQuestion(pick);
      }
    }).catch(() => {});
  }, [formNumber]);

  // ── Reset per-card state when card changes ────────────────────────────────
  useEffect(() => {
    setTappedChip(null);
    setIsFlipped(false);
    flipVal.value = 0;

    if (cardIndex === 2) {
      underlineW.setValue(0);
      Animated.timing(underlineW, {
        toValue: 1,
        duration: 700,
        delay: 400,
        useNativeDriver: false,
      }).start();
    }

    if (cardIndex === 4) {
      setSelectedOption(null);
      setQuizAnswered(false);
      setStartVisible(false);
      startOpacity.setValue(0);
    }
  }, [cardIndex, animKey]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goTo = useCallback((idx, dir) => {
    if (idx < 0 || idx >= TOTAL_CARDS) return;
    setDirection(dir);
    setAnimKey((k) => k + 1);
    setCardIndex(idx);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleTap = (x) => {
    const isLeft = x < SCREEN_W * 0.3;
    if (isLeft) {
      goTo(cardIndex - 1, -1);
    } else {
      goTo(cardIndex + 1, 1);
    }
  };

  const handleFlip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const target = isFlipped ? 0 : 1;
    flipVal.value = withTiming(target, { duration: 400 });
    setIsFlipped(!isFlipped);
  };

  const handleQuizAnswer = (optNum) => {
    if (quizAnswered) return;
    setSelectedOption(optNum);
    setQuizAnswered(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const correct = quizQuestion?.correctoption;
    if (optNum === correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => {
        setStartVisible(true);
        Animated.timing(startOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 600);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  };

  const handleStartPractice = async () => {
    setStartLoading(true);
    try {
      const raw = await AsyncStorage.getItem(COMPLETION_KEY);
      const completed = raw ? JSON.parse(raw) : [];
      if (!completed.includes(type)) {
        await AsyncStorage.setItem(COMPLETION_KEY, JSON.stringify([...completed, type]));
      }
    } catch (_) {}

    try {
      startQuiz({ type: 'grammar', formNumber, questions: quizQuestions });
      router.replace({ pathname: '/quiz/grammar', params: { form: formNumber, typeName: type } });
    } catch (_) {
      setStartLoading(false);
    }
  };

  const renderDots = () => (
    <View style={styles.dotsRow}>
      {Array.from({ length: TOTAL_CARDS }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === cardIndex ? { backgroundColor: '#ffffff', width: 24 } : { backgroundColor: 'rgba(255,255,255,0.35)' },
          ]}
        />
      ))}
    </View>
  );

  const renderIntro = () => (
    <View style={styles.cardContent}>
      <MotiView
        from={{ opacity: 0, scale: 0.6, translateY: 20 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: 'spring', delay: 100, damping: 14 }}
        style={styles.introIconWrap}
      >
        <LinearGradient
          colors={colors.gradientHero}
          style={styles.introIconGrad}
        >
          <Ionicons name={content.icon} size={64} color="#ffffff" />
        </LinearGradient>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 18 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', delay: 220, duration: 380 }}
        style={{ alignItems: 'center' }}
      >
        <Text style={[styles.introEyebrow, { color: colors.accent, fontFamily: 'Poppins_700Bold' }]}>
          GRAMMAR GUIDE
        </Text>
        <Text style={[styles.introTitle, { color: '#ffffff', fontFamily: 'Poppins_800ExtraBold' }]}>
          {type}
        </Text>
        <Text style={[styles.introHook, { color: 'rgba(255,255,255,0.85)', fontFamily: 'Poppins_600SemiBold' }]}>
          {content.hook}
        </Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', delay: 600, duration: 400 }}
        style={styles.introFooter}
      >
        <Text style={[styles.introFooterText, { color: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins_600SemiBold' }]}>
          5 Cards · Tap right to continue
        </Text>
        <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.6)" />
      </MotiView>
    </View>
  );

  const renderRule = () => {
    const { parts, label } = content.ruleFormula;
    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.ruleScroll}>
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          <Text style={[styles.cardEyebrow, { color: colors.accent, fontFamily: 'Poppins_700Bold' }]}>
            THE FORMULA
          </Text>
          <Text style={[styles.cardTitle, { color: '#ffffff', fontFamily: 'Poppins_800ExtraBold' }]}>
            {label}
          </Text>
        </MotiView>

        <View style={styles.chipsRow}>
          {parts.map((part, i) => {
            const chipColor = ROLE_COLORS[part.role] || colors.accent;
            const isConnector = part.role === 'connector';
            return (
              <MotiView
                key={i}
                from={{ opacity: 0, scale: 0.7, translateY: 10 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{ type: 'spring', delay: 80 * i, damping: 14 }}
              >
                {isConnector ? (
                  <Text style={[styles.connectorText, { color: '#ffffff', fontFamily: 'Poppins_800ExtraBold' }]}>
                    {part.text}
                  </Text>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => {
                      if (part.note) {
                        setTappedChip(tappedChip === i ? null : i);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }
                    }}
                    style={[
                      styles.chip,
                      { backgroundColor: chipColor + '33', borderColor: chipColor },
                      tappedChip === i && { backgroundColor: chipColor + '66' },
                    ]}
                  >
                    <Text style={[styles.chipLabel, { color: '#ffffff', fontFamily: 'Poppins_700Bold' }]}>
                      {part.text}
                    </Text>
                    <Text style={[styles.chipRole, { color: '#ffffff', opacity: 0.8, fontFamily: 'Poppins_600SemiBold' }]}>
                      {part.role.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                )}
              </MotiView>
            );
          })}
        </View>

        {tappedChip !== null && parts[tappedChip]?.note && (
          <MotiView
            from={{ opacity: 0, translateY: 8, scale: 0.96 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 16 }}
            style={[styles.noteCard, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }]}
          >
            <Ionicons name="information-circle" size={20} color={colors.accent} />
            <Text style={[styles.noteText, { color: '#ffffff', fontFamily: 'Poppins_600SemiBold' }]}>
              {parts[tappedChip].note}
            </Text>
          </MotiView>
        )}

        {tappedChip === null && (
          <Text style={[styles.tapHint, { color: 'rgba(255,255,255,0.5)', fontFamily: 'Poppins_600SemiBold' }]}>
            TAP A CHIP TO LEARN MORE
          </Text>
        )}
      </ScrollView>
    );
  };

  const renderExamples = () => (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.examplesScroll}>
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
      >
        <Text style={[styles.cardEyebrow, { color: colors.accent, fontFamily: 'Poppins_700Bold' }]}>
          REAL EXAMPLES
        </Text>
        <Text style={[styles.cardTitle, { color: '#ffffff', fontFamily: 'Poppins_800ExtraBold' }]}>
          Context is Key
        </Text>
      </MotiView>

      {content.examples.map((ex, exIdx) => (
        <View key={exIdx} style={styles.exampleBlock}>
          <View style={styles.exampleWordsRow}>
            {ex.parts.map((part, pIdx) => {
              const chipColor = ROLE_COLORS[part.role] || colors.accent;
              return (
                <MotiView
                  key={pIdx}
                  from={{ opacity: 0, scale: 0.5, translateY: 12 }}
                  animate={{ opacity: 1, scale: 1, translateY: 0 }}
                  transition={{ type: 'spring', delay: exIdx * 200 + pIdx * 70, damping: 14 }}
                >
                  <View style={[styles.wordChip, { backgroundColor: chipColor + '33', borderColor: chipColor + '66' }]}>
                    <Text style={[styles.wordChipText, { color: '#ffffff', fontFamily: 'Poppins_700Bold' }]}>
                      {part.word}
                    </Text>
                    <Text style={[styles.wordChipRole, { color: '#ffffff', opacity: 0.7, fontFamily: 'Poppins_600SemiBold' }]}>
                      {part.role.toUpperCase()}
                    </Text>
                  </View>
                </MotiView>
              );
            })}
          </View>

          <View style={styles.sentenceRow}>
            <Text style={[styles.sentenceText, { color: '#ffffff', fontFamily: 'Poppins_700Bold' }]}>
              "{ex.sentence}"
            </Text>
            {exIdx === 0 && (
              <View style={styles.underlineTrack}>
                <Animated.View
                  style={[
                    styles.underlineFill,
                    {
                      backgroundColor: colors.accent,
                      width: underlineW.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
                    },
                  ]}
                />
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderTip = () => (
    <View style={styles.cardContent}>
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
      >
        <Text style={[styles.cardEyebrow, { color: colors.accent, fontFamily: 'Poppins_700Bold' }]}>
          LEARNING HACK
        </Text>
        <Text style={[styles.cardTitle, { color: '#ffffff', fontFamily: 'Poppins_800ExtraBold' }]}>
          Avoid the Trap
        </Text>
      </MotiView>

      <TouchableOpacity activeOpacity={0.9} onPress={handleFlip} style={styles.flipOuter}>
        <Reanimated.View style={[styles.flipFace, styles.flipFront, frontStyle, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }]}>
          <Ionicons name="bulb" size={48} color={colors.warning} style={{ marginBottom: 20 }} />
          <Text style={[styles.flipLabel, { color: colors.warning, fontFamily: 'Poppins_800ExtraBold' }]}>
            PRO TIP
          </Text>
          <Text style={[styles.flipBody, { color: '#ffffff', fontFamily: 'Poppins_700Bold' }]}>
            {content.tip}
          </Text>
          <View style={styles.flipHint}>
            <Ionicons name="sync" size={16} color="rgba(255,255,255,0.5)" />
            <Text style={[styles.flipHintText, { color: 'rgba(255,255,255,0.5)', fontFamily: 'Poppins_600SemiBold' }]}>
              TAP TO FLIP
            </Text>
          </View>
        </Reanimated.View>

        <Reanimated.View style={[styles.flipFace, styles.flipBack, backStyle, { backgroundColor: colors.errorSoft, borderColor: colors.error }]}>
          <Ionicons name="warning" size={48} color={colors.error} style={{ marginBottom: 20 }} />
          <Text style={[styles.flipLabel, { color: colors.error, fontFamily: 'Poppins_800ExtraBold' }]}>
            COMMON MISTAKE
          </Text>
          <Text style={[styles.flipBody, { color: '#ffffff', fontFamily: 'Poppins_700Bold' }]}>
            {content.commonMistake}
          </Text>
          <View style={styles.flipHint}>
            <Ionicons name="sync" size={16} color="rgba(255,255,255,0.5)" />
            <Text style={[styles.flipHintText, { color: 'rgba(255,255,255,0.5)', fontFamily: 'Poppins_600SemiBold' }]}>
              TAP TO FLIP BACK
            </Text>
          </View>
        </Reanimated.View>
      </TouchableOpacity>
    </View>
  );

  const renderMiniQuiz = () => {
    if (!quizQuestion) {
      return (
        <View style={[styles.cardContent, { justifyContent: 'center' }]}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={[styles.loadingText, { color: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins_600SemiBold' }]}>
            Preparing challenge...
          </Text>
        </View>
      );
    }

    const opts = [
      { num: 1, text: quizQuestion.optiona },
      { num: 2, text: quizQuestion.optionb },
      { num: 3, text: quizQuestion.optionc },
      { num: 4, text: quizQuestion.optiond },
    ];

    const correct = quizQuestion.correctoption;

    return (
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.quizScroll}>
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          <Text style={[styles.cardEyebrow, { color: colors.accent, fontFamily: 'Poppins_700Bold' }]}>
            FINAL CHALLENGE
          </Text>
          <Text style={[styles.cardTitle, { color: '#ffffff', fontFamily: 'Poppins_800ExtraBold' }]}>
            Are you ready?
          </Text>
        </MotiView>

        <Reanimated.View style={shakeStyle}>
          <View style={[styles.quizQuestionCard, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={[styles.quizQuestion, { color: '#ffffff', fontFamily: 'Poppins_700Bold' }]}>
              {quizQuestion.questiontext}
            </Text>
          </View>
        </Reanimated.View>

        <View style={styles.quizOptions}>
          {opts.map((opt, i) => {
            let bg = 'rgba(255,255,255,0.08)';
            let border = 'rgba(255,255,255,0.15)';
            let textColor = '#ffffff';

            if (quizAnswered) {
              if (opt.num === correct) {
                bg = colors.successSoft;
                border = colors.success;
                textColor = colors.success;
              } else if (opt.num === selectedOption) {
                bg = colors.errorSoft;
                border = colors.error;
                textColor = colors.error;
              }
            }

            return (
              <MotiView
                key={opt.num}
                from={{ opacity: 0, translateX: 30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', delay: 80 * i, duration: 280 }}
              >
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => handleQuizAnswer(opt.num)}
                  disabled={quizAnswered}
                  style={[styles.quizOpt, { backgroundColor: bg, borderColor: border }]}
                >
                  <View style={[styles.quizOptNum, { backgroundColor: border + '33' }]}>
                    <Text style={[styles.quizOptNumText, { color: textColor, fontFamily: 'Poppins_800ExtraBold' }]}>
                      {String.fromCharCode(64 + opt.num)}
                    </Text>
                  </View>
                  <Text style={[styles.quizOptText, { color: textColor, fontFamily: 'Poppins_700Bold' }]}>
                    {opt.text}
                  </Text>
                  {quizAnswered && opt.num === correct && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                  )}
                  {quizAnswered && opt.num === selectedOption && opt.num !== correct && (
                    <Ionicons name="close-circle" size={24} color={colors.error} />
                  )}
                </TouchableOpacity>
              </MotiView>
            );
          })}
        </View>

        {startVisible && (
          <Animated.View style={{ opacity: startOpacity, marginTop: 24 }}>
            <MotiView
              from={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 14 }}
            >
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={handleStartPractice}
                disabled={startLoading}
                style={styles.startBtn}
              >
                <LinearGradient
                  colors={colors.gradientHero}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.startGrad}
                >
                  {startLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={[styles.startText, { fontFamily: 'Poppins_800ExtraBold' }]}>
                        START PRACTICE TEST
                      </Text>
                      <Ionicons name="play" size={20} color="#ffffff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          </Animated.View>
        )}

        {quizAnswered && !startVisible && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.tryAgainRow}
          >
            <Text style={[styles.tryAgainLabel, { color: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins_600SemiBold' }]}>
              NOT QUITE — TRY AGAIN
            </Text>
            <TouchableOpacity onPress={() => {
              setSelectedOption(null);
              setQuizAnswered(false);
              setStartVisible(false);
              startOpacity.setValue(0);
              shakeX.value = 0;
            }} style={styles.retryBtn}>
              <Ionicons name="refresh" size={18} color={colors.accent} />
              <Text style={[styles.retryBtnText, { color: colors.accent, fontFamily: 'Poppins_800ExtraBold' }]}>
                RETRY
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}
      </ScrollView>
    );
  };

  const renderCard = () => {
    switch (cardIndex) {
      case 0: return renderIntro();
      case 1: return renderRule();
      case 2: return renderExamples();
      case 3: return renderTip();
      case 4: return renderMiniQuiz();
      default: return null;
    }
  };

  const cardGradients = [
    [colors.surfaceAlt, colors.background],
    [colors.surfaceAlt, colors.background],
    [colors.surfaceAlt, colors.background],
    [colors.surfaceAlt, colors.background],
    [colors.surfaceAlt, colors.background],
  ];

  return (
    <View style={[styles.screen, { backgroundColor: isDark ? '#0a0a0f' : colors.background }]}>
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#0a0a0f'] : ['#4338ca', '#4f46e5']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
          style={styles.closeBtn}
        >
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>

        {renderDots()}

        <View style={[styles.closeBtn, { opacity: 0 }]} />
      </View>

      {/* Story progress bar */}
      <View style={styles.storyBar}>
        {Array.from({ length: TOTAL_CARDS }).map((_, i) => (
          <View key={i} style={[styles.storySegment, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            {i < cardIndex && (
              <View style={[styles.storyFill, { backgroundColor: '#ffffff' }]} />
            )}
            {i === cardIndex && (
              <MotiView
                from={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ type: 'timing', duration: 8000 }}
                style={[styles.storyFill, { backgroundColor: '#ffffff' }]}
              />
            )}
          </View>
        ))}
      </View>

      {/* Card content with tap zones */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={(e) => {
          if (cardIndex === 3) return;
          handleTap(e.nativeEvent.locationX);
        }}
        style={styles.tapZone}
      >
        <MotiView
          key={animKey}
          from={{ opacity: 0, translateX: direction * 60 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 250 }}
          style={styles.cardWrap}
        >
          {renderCard()}
        </MotiView>
      </TouchableOpacity>

      {/* Bottom nav */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity
          onPress={() => goTo(cardIndex - 1, -1)}
          disabled={cardIndex === 0}
          style={[styles.navBtn, { opacity: cardIndex === 0 ? 0 : 1 }]}
        >
          <Ionicons name="chevron-back" size={20} color="#ffffff" />
          <Text style={[styles.navBtnText, { color: '#ffffff', fontFamily: 'Poppins_700Bold' }]}>
            BACK
          </Text>
        </TouchableOpacity>

        <View style={styles.navCenter}>
          <Text style={[styles.navCardNum, { color: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins_800ExtraBold' }]}>
            {cardIndex + 1} / {TOTAL_CARDS}
          </Text>
        </View>

        {cardIndex < TOTAL_CARDS - 1 ? (
          <TouchableOpacity
            onPress={() => goTo(cardIndex + 1, 1)}
            style={styles.navBtn}
          >
            <Text style={[styles.navBtnText, { color: '#ffffff', fontFamily: 'Poppins_700Bold' }]}>
              NEXT
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <View style={[styles.navBtn, { opacity: 0 }]} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  closeBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
  },
  storyBar: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 6,
    marginBottom: 12,
  },
  storySegment: {
    flex: 1, height: 4, borderRadius: 2,
    overflow: 'hidden',
  },
  storyFill: {
    height: '100%', borderRadius: 2,
  },
  tapZone: {
    flex: 1,
    paddingHorizontal: 24,
  },
  cardWrap: { flex: 1 },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  cardEyebrow: {
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 32,
    marginBottom: 28,
  },
  introIconWrap: {
    marginBottom: 32,
  },
  introIconGrad: {
    width: 120, height: 120, borderRadius: 36,
    justifyContent: 'center', alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  introEyebrow: {
    fontSize: 14,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 42,
    textAlign: 'center',
    marginBottom: 16,
  },
  introHook: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  introFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 48,
  },
  introFooterText: { fontSize: 14, letterSpacing: 0.5 },
  ruleScroll: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 24,
  },
  chip: {
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 90,
  },
  chipLabel: { fontSize: 16 },
  chipRole: { fontSize: 10, letterSpacing: 1, marginTop: 4 },
  connectorText: {
    fontSize: 28,
    lineHeight: 56,
    paddingHorizontal: 6,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 18,
    marginTop: 8,
    marginBottom: 16,
  },
  noteText: { fontSize: 15, lineHeight: 24, flex: 1 },
  tapHint: { fontSize: 12, textAlign: 'center', marginTop: 12, letterSpacing: 1 },
  examplesScroll: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  exampleBlock: {
    marginBottom: 32,
  },
  exampleWordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  wordChip: {
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  wordChipText: { fontSize: 15 },
  wordChipRole: { fontSize: 9, letterSpacing: 1, marginTop: 4 },
  sentenceRow: {
    gap: 8,
  },
  sentenceText: {
    fontSize: 20,
    lineHeight: 30,
  },
  underlineTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: 4,
  },
  underlineFill: {
    height: 4,
    borderRadius: 2,
  },
  flipOuter: {
    width: '100%',
    height: 280,
    marginTop: 12,
  },
  flipFace: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    borderWidth: 2,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  flipLabel: {
    fontSize: 14,
    letterSpacing: 2,
    marginBottom: 16,
  },
  flipBody: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
  },
  flipHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  flipHintText: { fontSize: 12, letterSpacing: 1 },
  quizScroll: {
    paddingTop: 24,
    paddingBottom: 48,
  },
  quizQuestionCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 24,
    marginBottom: 24,
  },
  quizQuestion: { fontSize: 18, lineHeight: 28 },
  quizOptions: { gap: 12 },
  quizOpt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 18,
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  quizOptNum: {
    width: 32, height: 32, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  quizOptNumText: { fontSize: 15 },
  quizOptText: { fontSize: 16, flex: 1, lineHeight: 24 },
  loadingText: { marginTop: 20, fontSize: 16, textAlign: 'center' },
  startBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  startGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  startText: { color: '#ffffff', fontSize: 18, letterSpacing: 1 },
  tryAgainRow: {
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  tryAgainLabel: { fontSize: 12, letterSpacing: 1 },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12
  },
  retryBtnText: { fontSize: 14, letterSpacing: 1 },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  navBtnText: { fontSize: 14, letterSpacing: 1 },
  navCenter: { flex: 1, alignItems: 'center' },
  navCardNum: { fontSize: 14, letterSpacing: 1 },
});
