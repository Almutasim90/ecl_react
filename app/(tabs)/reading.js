import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useQuiz } from '../../context/QuizContext';
import { fetchReadingQuestions, getFormList } from '../../lib/api';
import FormCard from '../../components/FormCard';

export default function ReadingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { startQuiz } = useQuiz();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bg = isDark ? '#0f172a' : '#f5f3ff';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';

  const totalQuestions = forms.reduce((s, f) => s + f.questions.length, 0);

  useEffect(() => {
    async function load() {
      try {
        const questions = await fetchReadingQuestions();
        setForms(getFormList(questions));
      } catch (e) {
        setError('Failed to load reading questions. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleFormPress = (formNumber, questions) => {
    startQuiz({ type: 'reading', formNumber, questions });
    router.push({ pathname: '/quiz/reading', params: { form: formNumber } });
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {/* ── Gradient hero header (indigo for reading) ── */}
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 18 }}
      >
        <LinearGradient
          colors={isDark ? ['#1e1b4b', '#3730a3'] : ['#4338ca', '#4f46e5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroGradient, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />

          <View style={styles.heroRow}>
            <View style={styles.heroTextBlock}>
              <Text style={[styles.heroEyebrow, { fontFamily: 'Inter_400Regular' }]}>
                ECL Practice
              </Text>
              <Text style={[styles.heroTitle, { fontFamily: 'Inter_600SemiBold' }]}>
                Reading Quiz
              </Text>
              <Text style={[styles.heroSub, { fontFamily: 'Inter_400Regular' }]}>
                Build your text comprehension skills
              </Text>
            </View>
            <View style={styles.heroIconWrap}>
              <Ionicons name="book" size={34} color="#ffffff" />
            </View>
          </View>

          {/* Stats pills */}
          {!loading && forms.length > 0 && (
            <View style={styles.pillsRow}>
              <View style={styles.pill}>
                <Ionicons name="layers-outline" size={13} color="rgba(255,255,255,0.85)" />
                <Text style={[styles.pillText, { fontFamily: 'Inter_400Regular' }]}>
                  {forms.length} Forms
                </Text>
              </View>
              <View style={styles.pillDot} />
              <View style={styles.pill}>
                <Ionicons name="help-circle-outline" size={13} color="rgba(255,255,255,0.85)" />
                <Text style={[styles.pillText, { fontFamily: 'Inter_400Regular' }]}>
                  {totalQuestions} Questions
                </Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </MotiView>

      {/* ── Content ── */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color="#4f46e5" size="large" />
          <Text style={[styles.stateText, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
            Loading forms...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={52} color={subtextColor} />
          <Text style={[styles.stateText, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
            {error}
          </Text>
        </View>
      ) : forms.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="book-outline" size={52} color={subtextColor} />
          <Text style={[styles.stateText, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
            No reading forms available.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          <Text style={[styles.listLabel, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
            {forms.length} FORM{forms.length !== 1 ? 'S' : ''} AVAILABLE
          </Text>
          {forms.map((form, idx) => (
            <FormCard
              key={form.formNumber}
              formNumber={form.formNumber}
              questionCount={form.questions.length}
              type="reading"
              index={idx}
              onPress={() => handleFormPress(form.formNumber, form.questions)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  heroGradient: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBlob1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -40,
  },
  heroBlob2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -30,
    left: 20,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroTextBlock: { flex: 1, gap: 3 },
  heroEyebrow: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 26,
    color: '#ffffff',
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  pillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  pillDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  stateText: { fontSize: 14, textAlign: 'center', lineHeight: 21 },

  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 110,
  },
  listLabel: {
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
});
