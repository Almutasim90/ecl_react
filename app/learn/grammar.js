import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { fetchGrammarQuestions, getFormList } from '../../lib/api';
import { getLessonContent } from '../../lib/grammarContent';

const COMPLETION_KEY = 'lesson_completed_v1';

// Predefined section groupings (order matters)
const SECTIONS = [
  {
    id: 'present',
    title: 'Present Tenses',
    subtitle: 'Habits, facts, ongoing actions & recent results',
    icon: 'sunny',
    topics: [
      'Present Simple',
      'Present Continuous',
      'Present Perfect',
      'Present Perfect Continuous',
    ],
  },
  {
    id: 'past',
    title: 'Past Tenses',
    subtitle: 'Completed actions, ongoing past actions & earlier pasts',
    icon: 'time',
    topics: [
      'Past Simple',
      'Past Continuous',
      'Past Perfect',
    ],
  },
  {
    id: 'future',
    title: 'Future Tenses',
    subtitle: 'Predictions, plans & actions in progress ahead',
    icon: 'rocket',
    topics: [
      'Future Simple',
      'Future Continuous',
    ],
  },
  {
    id: 'modal',
    title: 'Modal & Conditionals',
    subtitle: 'Possibility, permission, and hypotheticals',
    icon: 'git-branch',
    topics: ['Modal Verbs', 'Conditionals'],
  },
  {
    id: 'other',
    title: 'Other Topics',
    subtitle: 'Essential grammar building blocks',
    icon: 'library',
    topics: ['Passive Voice', 'Articles', 'Prepositions', 'Reported Speech', 'Comparatives'],
  },
];

export default function GrammarLearnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchGrammarQuestions()
      .then((questions) => {
        setForms(getFormList(questions));
      })
      .catch(() => {
        setError('Failed to load topics. Please check your connection.');
      })
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem(COMPLETION_KEY).then((raw) => {
        setCompleted(raw ? JSON.parse(raw) : []);
      }).catch(() => {});
    }, [])
  );

  const handleTopicPress = (form) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/learn/grammar-lesson',
      params: { type: form.title, form: form.formNumber },
    });
  };

  // Build a lookup: title -> form object
  const formsByTitle = {};
  forms.forEach((f) => { formsByTitle[f.title] = f; });

  const query = search.trim().toLowerCase();

  // In search mode: flat filtered list across all topics
  const searchResults = query
    ? forms.filter((f) => f.title.toLowerCase().includes(query))
    : null;

  const completedCount = completed.length;
  const totalCount = forms.length;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Hero Header ── */}
      <View style={{ overflow: 'hidden', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <LinearGradient
          colors={colors.gradientHero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.heroTopRow}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={24} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.heroTextBlock}>
              <Text style={[styles.heroEyebrow, { fontFamily: 'Poppins_700Bold' }]}>
                GRAMMAR GUIDE
              </Text>
              <Text style={[styles.heroTitle, { fontFamily: 'Poppins_800ExtraBold' }]}>
                Master Topics
              </Text>
            </View>

            <View style={styles.heroIconBadge}>
              <Ionicons name="book" size={24} color="#ffffff" />
            </View>
          </View>

          {/* Progress bar */}
          {!loading && totalCount > 0 && (
            <View style={styles.heroProgress}>
              <View style={styles.heroProgressMeta}>
                <Text style={[styles.heroProgressLabel, { fontFamily: 'Poppins_600SemiBold' }]}>
                  {completedCount} of {totalCount} completed
                </Text>
                <Text style={[styles.heroProgressPct, { fontFamily: 'Poppins_800ExtraBold' }]}>
                  {Math.round((completedCount / totalCount) * 100)}%
                </Text>
              </View>
              <View style={styles.heroProgressTrack}>
                <View
                  style={[
                    styles.heroProgressFill,
                    { width: `${(completedCount / totalCount) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Search bar */}
          <View style={[styles.searchBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)' }]}>
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.8)" />
            <TextInput
              style={[styles.searchInput, { fontFamily: 'Poppins_600SemiBold', color: '#ffffff' }]}
              placeholder="Search topics..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* ── Content ── */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={[styles.stateText, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
            Loading topics...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline" size={64} color={colors.textSecondary} />
          <Text style={[styles.stateText, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
            {error}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 120 }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Search results (flat list) ── */}
          {searchResults ? (
            searchResults.length === 0 ? (
              <View style={styles.emptySearch}>
                <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
                  No topics found for "{search}"
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.searchResultLabel, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
                  {searchResults.length} RESULT{searchResults.length !== 1 ? 'S' : ''}
                </Text>
                {searchResults.map((form, idx) => (
                  <TopicCard
                    key={form.formNumber}
                    form={form}
                    idx={idx}
                    isDone={completed.includes(form.title)}
                    colors={colors}
                    onPress={() => handleTopicPress(form)}
                  />
                ))}
              </>
            )
          ) : (
            /* ── Sectioned list ── */
            SECTIONS.map((section) => {
              const sectionForms = section.topics
                .map((t) => formsByTitle[t])
                .filter(Boolean);

              if (sectionForms.length === 0) return null;

              const doneInSection = sectionForms.filter((f) => completed.includes(f.title)).length;

              return (
                <View key={section.id} style={styles.section}>
                  {/* Big Section Title */}
                  <View style={styles.sectionHeader}>
                    <View style={[styles.sectionIconWrap, { backgroundColor: colors.accentSoft }]}>
                      <Ionicons name={section.icon} size={20} color={colors.accent} />
                    </View>
                    <View style={styles.sectionTitleBlock}>
                      <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
                        {section.title}
                      </Text>
                      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary, fontFamily: 'Poppins_600SemiBold' }]}>
                        {section.subtitle}
                      </Text>
                    </View>
                    <View style={[styles.sectionCountBadge, { backgroundColor: colors.accentSoft }]}>
                      <Text style={[styles.sectionCountText, { color: colors.accent, fontFamily: 'Poppins_800ExtraBold' }]}>
                        {doneInSection}/{sectionForms.length}
                      </Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View style={[styles.sectionDivider, { backgroundColor: colors.border }]} />

                  {/* Topic cards */}
                  {sectionForms.map((form, idx) => (
                    <TopicCard
                      key={form.formNumber}
                      form={form}
                      idx={idx}
                      isDone={completed.includes(form.title)}
                      colors={colors}
                      onPress={() => handleTopicPress(form)}
                    />
                  ))}
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </View>
  );
}

function TopicCard({ form, idx, isDone, colors, onPress }) {
  const lessonContent = getLessonContent(form.title);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', delay: 60 * idx, damping: 18 }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[
          styles.topicCard,
          {
            backgroundColor: colors.surface,
            borderColor: isDone ? colors.success : colors.border,
            borderWidth: isDone ? 2 : 1.5,
          },
        ]}
      >
        <LinearGradient
          colors={isDone ? [colors.success, colors.success] : colors.gradientHero}
          style={styles.topicBadge}
        >
          <Ionicons name={lessonContent.icon} size={26} color="#ffffff" />
        </LinearGradient>

        <View style={styles.topicInfo}>
          <Text style={[styles.topicTitle, { color: colors.text, fontFamily: 'Poppins_800ExtraBold' }]}>
            {form.title}
          </Text>
          <View style={styles.metaRow}>
            <View style={[styles.metaPill, { backgroundColor: colors.accentSoft }]}>
              <Text style={[styles.metaText, { color: colors.accent, fontFamily: 'Poppins_700Bold' }]}>
                {form.questions.length} QUESTIONS
              </Text>
            </View>
            {isDone && (
              <View style={[styles.metaPill, { backgroundColor: colors.success + '22' }]}>
                <Text style={[styles.metaText, { color: colors.success, fontFamily: 'Poppins_700Bold' }]}>
                  COMPLETED
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.topicRight}>
          {isDone ? (
            <View style={[styles.actionCircle, { backgroundColor: colors.success }]}>
              <Ionicons name="checkmark" size={18} color="#ffffff" />
            </View>
          ) : (
            <View style={[styles.actionCircle, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="chevron-forward" size={20} color={colors.accent} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Hero
  hero: { paddingHorizontal: 24, paddingBottom: 28 },
  heroTopRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  backBtn: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  heroTextBlock: { flex: 1 },
  heroEyebrow: { fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: 1.5, marginBottom: 2 },
  heroTitle: { fontSize: 28, color: '#ffffff' },
  heroIconBadge: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },

  // Hero progress
  heroProgress: { marginBottom: 16, gap: 8 },
  heroProgressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  heroProgressLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  heroProgressPct: { fontSize: 13, color: '#ffffff' },
  heroProgressTrack: {
    height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  heroProgressFill: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.9)' },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, paddingHorizontal: 14, height: 48, gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 0 },

  // States
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, gap: 16 },
  stateText: { fontSize: 16, textAlign: 'center' },
  emptySearch: { alignItems: 'center', paddingTop: 60, gap: 16 },
  emptyText: { fontSize: 15, textAlign: 'center' },
  searchResultLabel: { fontSize: 11, letterSpacing: 1.5, marginBottom: 16 },

  // List
  list: { paddingHorizontal: 20, paddingTop: 28 },

  // Section
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  sectionIconWrap: {
    width: 44, height: 44, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  sectionTitleBlock: { flex: 1 },
  sectionTitle: { fontSize: 22, letterSpacing: 0.2, lineHeight: 28 },
  sectionSubtitle: { fontSize: 12, marginTop: 2 },
  sectionCountBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10,
  },
  sectionCountText: { fontSize: 13 },
  sectionDivider: { height: 1.5, borderRadius: 1, marginBottom: 14 },

  // Topic card
  topicCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 20, marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 10,
  },
  topicBadge: {
    width: 68, alignSelf: 'stretch',
    justifyContent: 'center', alignItems: 'center',
  },
  topicInfo: { flex: 1, paddingVertical: 18, paddingHorizontal: 16, gap: 8 },
  topicTitle: { fontSize: 16, letterSpacing: 0.2 },
  metaRow: { flexDirection: 'row', gap: 8 },
  metaPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  metaText: { fontSize: 10, letterSpacing: 0.5 },
  topicRight: { paddingRight: 18 },
  actionCircle: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
});
