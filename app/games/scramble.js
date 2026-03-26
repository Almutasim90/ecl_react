import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView, AnimatePresence } from 'moti';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const CHALLENGES = [
  {
    sentence: "She has been working here since 2010.",
    words: ["She", "has", "been", "working", "here", "since", "2010."]
  },
  {
    sentence: "Would you mind closing the door?",
    words: ["Would", "you", "mind", "closing", "the", "door?"]
  },
  {
    sentence: "I am looking forward to meeting you.",
    words: ["I", "am", "looking", "forward", "to", "meeting", "you."]
  }
];

export default function ScrambleGame() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [level, setLevel] = useState(0);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [selectedWords, setSelectedWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize level
  useEffect(() => {
    startLevel(0);
  }, []);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isGameOver && !isSuccess) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsGameOver(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [timeLeft, isGameOver, isSuccess]);

  const startLevel = (idx) => {
    const levelData = CHALLENGES[idx];
    // Shuffle words
    const shuffled = [...levelData.words].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
    setSelectedWords([]);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsSuccess(false);
  };

  const handleWordPress = (word, index) => {
    if (isGameOver || isSuccess) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    // Remove from shuffled
    const newShuffled = [...shuffledWords];
    newShuffled.splice(index, 1);
    setShuffledWords(newShuffled);

    // Check if sentence is complete
    if (newShuffled.length === 0) {
      const result = newSelected.join(' ');
      if (result === CHALLENGES[level].sentence) {
        handleLevelComplete();
      } else {
        handleWrongAnswer();
      }
    }
  };

  const handleLevelComplete = () => {
    setIsSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      if (level < CHALLENGES.length - 1) {
        setLevel(level + 1);
        startLevel(level + 1);
      } else {
        // Game fully complete
        Alert.alert("Bravo!", "You mastered all challenges.");
        router.canGoBack() ? router.back() : router.replace('/(tabs)/quest');
      }
    }, 1500);
  };

  const handleWrongAnswer = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    // Visual shake or reset
    setTimeout(() => {
      startLevel(level);
    }, 500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Header */}
      <LinearGradient
        colors={colors.gradientHero}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/quest')} style={styles.backBtn}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.levelText}>Challenge {level + 1}</Text>
          <View style={styles.timerBadge}>
             <Ionicons name="timer-outline" size={18} color="#fff" />
             <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressTrack}>
          <MotiView
            animate={{ width: `${(timeLeft / 30) * 100}%` }}
            transition={{ type: 'timing', duration: 1000 }}
            style={[styles.progressFill, { backgroundColor: timeLeft < 10 ? '#ef4444' : '#10b981' }]}
          />
        </View>
      </LinearGradient>

      <View style={styles.gameBody}>
        <Text style={[styles.instruction, { color: colors.textSecondary }]}>
          Tap the words in the correct order:
        </Text>

        {/* Selected Words Area (The Result) */}
        <View style={[styles.resultArea, { borderColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fff' }]}>
          <View style={styles.wordRow}>
            {selectedWords.map((word, i) => (
              <MotiView
                key={`selected-${i}`}
                from={{ opacity: 0, scale: 0.5, translateY: 20 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                style={[styles.wordChip, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.wordTextSelected}>{word}</Text>
              </MotiView>
            ))}
          </View>
          {selectedWords.length === 0 && (
            <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>Your sentence will appear here...</Text>
          )}
        </View>

        {/* Shuffled Words Area (The Options) */}
        <View style={styles.optionsArea}>
          <AnimatePresence>
            <View style={styles.wordRow}>
              {shuffledWords.map((word, i) => (
                <MotiView
                  key={`option-${word}-${i}`}
                  from={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: 'spring' }}
                >
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleWordPress(word, i)}
                    style={[styles.optionChip, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <Text style={[styles.wordText, { color: colors.text }]}>{word}</Text>
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </AnimatePresence>
        </View>
      </View>

      {/* Success/Failure Overlays */}
      {isSuccess && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.overlay}
        >
          <View style={styles.overlayContent}>
            <Ionicons name="checkmark-circle" size={80} color="#10b981" />
            <Text style={styles.overlayTitle}>Perfect!</Text>
          </View>
        </MotiView>
      )}

      {isGameOver && (
        <View style={styles.overlay}>
          <View style={styles.overlayContent}>
            <Ionicons name="alert-circle" size={80} color="#ef4444" />
            <Text style={styles.overlayTitle}>Time's Up!</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={() => startLevel(level)}>
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  levelText: { color: '#fff', fontSize: 20, fontWeight: '700', fontFamily: 'Cairo_700Bold' },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  timerText: { color: '#fff', fontWeight: '700' },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%' },
  gameBody: { flex: 1, padding: 20, paddingTop: 30 },
  instruction: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  resultArea: {
    minHeight: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  placeholderText: { opacity: 0.5, fontStyle: 'italic' },
  optionsArea: { flex: 1, justifyContent: 'center' },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  wordChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, elevation: 3 },
  wordTextSelected: { color: '#fff', fontWeight: '600', fontSize: 16 },
  optionChip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 15, borderWidth: 1, elevation: 2, shadowOpacity: 0.1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  wordText: { fontWeight: '600', fontSize: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  overlayContent: { alignItems: 'center', gap: 20 },
  overlayTitle: { color: '#fff', fontSize: 32, fontWeight: '800' },
  retryBtn: { backgroundColor: '#7c3aed', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30 },
  retryText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
