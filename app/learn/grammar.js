import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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

export default function GrammarLearnScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    fetchGrammarQuestions()
      .then((questions) => {
        setForms(getFormList(questions));
      })
      .catch((e) => {
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

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* ── Stunning Hero Header ── */}
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
              style={[styles.backBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
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

            <View style={[styles.heroIconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="book" size={24} color="#ffffff" />
            </View>
          </View>

          <Text style={[styles.heroSub, { fontFamily: 'Poppins_600SemiBold' }]}>
            Dive deep into English rules with our interactive guides. Complete lessons to unlock practice tests.
          </Text>
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
        >
          <View style={styles.listHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontFamily: 'Poppins_800ExtraBold' }]}>
              {forms.length} CATEGORIES
            </Text>
            <Ionicons name="filter" size={16} color={colors.textSecondary} />
          </View>

          {forms.map((form, idx) => {
            const lessonContent = getLessonContent(form.title);
            const isDone = completed.includes(form.title);

            return (
              <MotiView
                key={form.formNumber}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'spring', delay: 100 * idx, damping: 18 }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleTopicPress(form)}
                  style={[
                    styles.topicCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: isDone ? colors.success : colors.border,
                      borderWidth: isDone ? 2 : 1.5,
                    },
                  ]}
                >
                  {/* Category Indicator */}
                  <LinearGradient
                    colors={isDone ? [colors.success, colors.success] : colors.gradientHero}
                    style={styles.topicBadge}
                  >
                    <Ionicons name={lessonContent.icon} size={28} color="#ffffff" />
                  </LinearGradient>

                  {/* Info */}
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
                      <View style={[styles.metaPill, { backgroundColor: colors.background }]}>
                        <Text style={[styles.metaText, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
                          5 CARDS
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right Action */}
                  <View style={styles.topicRight}>
                    {isDone ? (
                      <View style={[styles.doneCircle, { backgroundColor: colors.success }]}>
                        <Ionicons name="checkmark" size={18} color="#ffffff" />
                      </View>
                    ) : (
                      <View style={[styles.playCircle, { backgroundColor: colors.accentSoft }]}>
                        <Ionicons name="chevron-forward" size={20} color={colors.accent} />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </MotiView>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  heroTopRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20,
  },
  backBtn: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  heroTextBlock: { flex: 1 },
  heroEyebrow: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5, marginBottom: 2,
  },
  heroTitle: { fontSize: 28, color: '#ffffff' },
  heroIconBadge: {
    width: 48, height: 48, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  heroSub: {
    fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 24,
  },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 32, gap: 16,
  },
  stateText: { fontSize: 16, textAlign: 'center' },
  list: { paddingHorizontal: 24, paddingTop: 24 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionLabel: {
    fontSize: 12, letterSpacing: 1.5,
  },
  topicCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 24,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12,
  },
  topicBadge: {
    width: 72, alignSelf: 'stretch',
    justifyContent: 'center', alignItems: 'center',
  },
  topicInfo: {
    flex: 1, paddingVertical: 20, paddingHorizontal: 16, gap: 8,
  },
  topicTitle: { fontSize: 17, letterSpacing: 0.3 },
  metaRow: { flexDirection: 'row', gap: 8 },
  metaPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  metaText: { fontSize: 10, letterSpacing: 0.5 },
  topicRight: {
    paddingRight: 20,
  },
  doneCircle: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  playCircle: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
});
