import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useQuiz } from '../../context/QuizContext';
import { fetchGrammarQuestions, getFormList, grammarTypeFromRow, fetchQuizProgress } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import FormCard from '../../components/FormCard';

export default function GrammarScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { startQuiz } = useQuiz();
  const { user } = useAuth();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [query, setQuery] = useState('');

  const totalQuestions = forms.reduce((s, f) => s + f.questions.length, 0);

  const filteredForms = query.trim()
    ? forms.filter((f) => {
        const q = query.trim().toLowerCase();
        const asNum = String(f.formNumber);
        const asFull = `form ${f.formNumber}`;
        const asTitle = (f.title || '').toLowerCase();
        return asFull.includes(q) || asNum.includes(q) || asTitle.includes(q);
      })
    : forms;

  useEffect(() => {
    async function load() {
      try {
        const questions = await fetchGrammarQuestions();
        setForms(getFormList(questions));
      } catch (e) {
        console.warn('[Grammar] load failed:', e?.message ?? e);
        setError('Failed to load grammar questions. Please check your connection.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      fetchQuizProgress(user.id, 'grammar').then(({ data }) => {
        const map = {};
        data.forEach((p) => { map[p.form_number] = p; });
        setProgressMap(map);
      });
    }, [user])
  );

  const handleRandomPress = () => {
    const allQuestions = forms.flatMap((f) => f.questions);
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 30);
    startQuiz({ type: 'grammar', formNumber: 0, questions: selected });
    router.push({ pathname: '/quiz/grammar', params: { form: 0, typeName: 'Random Practice' } });
  };

  const handleFormPress = (formNumber, questions) => {
    const typeName = grammarTypeFromRow(questions[0] || {});
    const saved = progressMap[formNumber];
    if (saved) {
      const resumeIndex = Math.min(Object.keys(saved.answers).length, questions.length - 1);
      startQuiz({ type: 'grammar', formNumber, questions, currentIndex: resumeIndex, answers: saved.answers });
    } else {
      startQuiz({ type: 'grammar', formNumber, questions });
    }
    router.push({ pathname: '/quiz/grammar', params: { form: formNumber, typeName } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <MotiView
        from={{ opacity: 0, translateY: -12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 18 }}
      >
        <LinearGradient
          colors={colors.gradientGrammar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroGradient, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.heroBlob1} />
          <View style={styles.heroBlob2} />

          <View style={styles.heroRow}>
            <View style={styles.heroTextBlock}>
              <Text style={[styles.heroEyebrow, { fontFamily: 'Poppins_700Bold' }]}>
                ECL Practice
              </Text>
              <Text style={[styles.heroTitle, { fontFamily: 'Poppins_800ExtraBold' }]}>
                Grammar Quiz
              </Text>
              <Text style={[styles.heroSub, { fontFamily: 'Poppins_600SemiBold' }]}>
                Master rules, usage & structure
              </Text>
            </View>
            <View style={styles.heroIconWrap}>
              <Ionicons name="language" size={36} color="#ffffff" />
            </View>
          </View>

          {!loading && forms.length > 0 && (
            <>
              <View style={styles.pillsRow}>
                <View style={styles.pill}>
                  <Ionicons name="layers-outline" size={13} color="rgba(255,255,255,0.85)" />
                  <Text style={[styles.pillText, { fontFamily: 'Poppins_600SemiBold' }]}>
                    {forms.length} Forms
                  </Text>
                </View>
                <View style={styles.pillDot} />
                <View style={styles.pill}>
                  <Ionicons name="help-circle-outline" size={13} color="rgba(255,255,255,0.85)" />
                  <Text style={[styles.pillText, { fontFamily: 'Poppins_600SemiBold' }]}>
                    {totalQuestions} Questions
                  </Text>
                </View>
              </View>

              <View style={styles.searchBar}>
                <Ionicons name="search" size={16} color="rgba(255,255,255,0.65)" />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search by title or form number..."
                  placeholderTextColor="rgba(255,255,255,0.40)"
                  style={[styles.searchInput, { fontFamily: 'Poppins_400Regular' }]}
                  keyboardType="default"
                  returnKeyType="search"
                  clearButtonMode="never"
                />
                {query.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setQuery('')}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close-circle" size={17} color="rgba(255,255,255,0.75)" />
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </LinearGradient>
      </MotiView>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.grammarAccent} size="large" />
          <Text style={[styles.stateText, { color: colors.textSecondary, fontFamily: 'Poppins_400Regular' }]}>
            Loading forms...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={52} color={colors.textSecondary} />
          <Text style={[styles.stateText, { color: colors.textSecondary, fontFamily: 'Poppins_400Regular' }]}>
            {error}
          </Text>
        </View>
      ) : forms.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="language-outline" size={52} color={colors.textSecondary} />
          <Text style={[styles.stateText, { color: colors.textSecondary, fontFamily: 'Poppins_400Regular' }]}>
            No grammar forms available.
          </Text>
          <Text style={[styles.stateHint, { color: colors.textSecondary, fontFamily: 'Poppins_400Regular' }]}>
            Add rows to grammarquestions in Supabase (GrammarType, questiontext, options).
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        >
          {!query.trim() && (
            <>
              {/* Grammar Guide card */}
              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', damping: 18, delay: 40 }}
              >
                <TouchableOpacity
                  activeOpacity={0.78}
                  onPress={() => router.push('/learn/grammar')}
                  style={[styles.randomCard, { backgroundColor: colors.surface, borderColor: colors.accent }]}
                >
                  <LinearGradient
                    colors={colors.gradientHero}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.randomBadge}
                  >
                    <Ionicons name="book-outline" size={22} color="#ffffff" />
                  </LinearGradient>
                  <View style={styles.randomInfo}>
                    <Text style={[styles.randomTitle, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
                      Grammar Guide
                    </Text>
                    <Text style={[styles.randomSub, { color: colors.textSecondary, fontFamily: 'Poppins_400Regular' }]}>
                      Learn before you practice
                    </Text>
                  </View>
                  <View style={[styles.randomPlay, { backgroundColor: `${colors.accent}18` }]}>
                    <Ionicons name="chevron-forward" size={16} color={colors.accent} />
                  </View>
                </TouchableOpacity>
              </MotiView>
            </>
          )}

          {!query.trim() && (
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'spring', damping: 18 }}
            >
              <TouchableOpacity
                activeOpacity={0.78}
                onPress={handleRandomPress}
                style={[styles.randomCard, { backgroundColor: colors.surface, borderColor: colors.grammarAccent }]}
              >
                <LinearGradient
                  colors={colors.gradientGrammar}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.randomBadge}
                >
                  <Ionicons name="shuffle" size={22} color="#ffffff" />
                </LinearGradient>
                <View style={styles.randomInfo}>
                  <Text style={[styles.randomTitle, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
                    Random Practice
                  </Text>
                  <Text style={[styles.randomSub, { color: colors.textSecondary, fontFamily: 'Poppins_400Regular' }]}>
                    30 questions from all forms
                  </Text>
                </View>
                <View style={[styles.randomPlay, { backgroundColor: `${colors.grammarAccent}18` }]}>
                  <Ionicons name="play" size={16} color={colors.grammarAccent} style={{ marginLeft: 2 }} />
                </View>
              </TouchableOpacity>
            </MotiView>
          )}

          <Text style={[styles.listLabel, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
            {query.trim()
              ? `${filteredForms.length} of ${forms.length} forms found`
              : `${forms.length} FORM${forms.length !== 1 ? 'S' : ''} AVAILABLE`}
          </Text>

          {filteredForms.length === 0 ? (
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 16 }}
              style={[styles.noResults, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.noResultsIcon, { backgroundColor: `${colors.grammarAccent}18` }]}>
                <Ionicons name="search" size={28} color={colors.grammarAccent} />
              </View>
              <Text style={[styles.noResultsTitle, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
                No forms found
              </Text>
              <Text style={[styles.noResultsSub, { color: colors.textSecondary, fontFamily: 'Poppins_400Regular' }]}>
                No form matches "{query}"
              </Text>
              <TouchableOpacity
                onPress={() => setQuery('')}
                style={[styles.clearBtn, { backgroundColor: `${colors.grammarAccent}18` }]}
              >
                <Text style={[styles.clearBtnText, { color: colors.grammarAccent, fontFamily: 'Poppins_700Bold' }]}>
                  Clear search
                </Text>
              </TouchableOpacity>
            </MotiView>
          ) : (
            filteredForms.map((form, idx) => (
              <FormCard
                key={form.formNumber}
                formNumber={form.formNumber}
                title={form.title}
                questionCount={form.questions.length}
                type="grammar"
                index={idx}
                progress={progressMap[form.formNumber] || null}
                onPress={() => handleFormPress(form.formNumber, form.questions)}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroGradient: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBlob1: {
    position: 'absolute',
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60, right: -40,
  },
  heroBlob2: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -30, left: 20,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroTextBlock: { flex: 1, gap: 3 },
  heroEyebrow: {
    fontSize: 11, color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase', letterSpacing: 1.5,
  },
  heroTitle: { fontSize: 26, color: '#ffffff' },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  heroIconWrap: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', marginLeft: 16,
  },
  pillsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  pillText: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  pillDot: {
    width: 4, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
  },
  searchInput: {
    flex: 1, color: '#ffffff', fontSize: 14,
    padding: 0, margin: 0,
  },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 32, gap: 14,
  },
  stateText: { fontSize: 14, textAlign: 'center', lineHeight: 21 },
  stateHint: { fontSize: 12, textAlign: 'center', lineHeight: 18, opacity: 0.7 },
  list: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 110 },
  listLabel: { fontSize: 11, letterSpacing: 1.0, marginBottom: 16 },
  noResults: {
    alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24,
    borderRadius: 20, borderWidth: 1, gap: 10, marginTop: 8,
  },
  noResultsIcon: {
    width: 60, height: 60, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  noResultsTitle: { fontSize: 16 },
  noResultsSub: { fontSize: 13, textAlign: 'center' },
  clearBtn: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 12, marginTop: 6 },
  clearBtnText: { fontSize: 14 },
  randomCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 18, borderWidth: 1.5,
    overflow: 'hidden', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
  },
  randomBadge: {
    width: 68, alignSelf: 'stretch',
    justifyContent: 'center', alignItems: 'center',
  },
  randomInfo: { flex: 1, paddingVertical: 16, paddingHorizontal: 14, gap: 3 },
  randomTitle: { fontSize: 16 },
  randomSub: { fontSize: 13 },
  randomPlay: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
});
