import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { fetchListeningQuestions, fetchReadingQuestions, getFormList } from '../../lib/api';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user, profile } = useAuth();

  const [listeningForms, setListeningForms] = useState([]);
  const [readingForms, setReadingForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [lq, rq] = await Promise.all([
          fetchListeningQuestions(),
          fetchReadingQuestions(),
        ]);
        setListeningForms(getFormList(lq));
        setReadingForms(getFormList(rq));
      } catch (e) {
        console.warn('Failed to load stats:', e.message);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const greetingIcon = hour < 12 ? '☀️' : hour < 18 ? '⛅' : '🌙';
  const userName = profile?.full_name || user?.user_metadata?.full_name || 'Student';

  const totalListeningQs = listeningForms.reduce((s, f) => s + f.questions.length, 0);
  const totalReadingQs = readingForms.reduce((s, f) => s + f.questions.length, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 24, paddingBottom: 120 }]}
      >
        {/* ── Header ── */}
        <MotiView
          from={{ opacity: 0, translateY: -16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <Text style={[styles.greetingText, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              {greetingIcon}  {greeting}
            </Text>
            <Text style={[styles.userName, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
              {userName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(tabs)/profile');
            }}
            activeOpacity={0.85}
            style={[styles.avatar, { backgroundColor: colors.accent }]}
          >
            <Text style={[styles.avatarLetter, { fontFamily: 'Inter_600SemiBold' }]}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* ── Hero card ── */}
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 16, delay: 80 }}
          style={styles.heroWrap}
        >
          <LinearGradient
            colors={colors.gradientHero}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroBlob1} />
            <View style={styles.heroBlob2} />
            <View style={styles.heroContent}>
              <View style={styles.heroLeft}>
                <Text style={[styles.heroEyebrow, { fontFamily: 'Inter_400Regular' }]}>
                  Daily Practice
                </Text>
                <Text style={[styles.heroTitle, { fontFamily: 'Inter_600SemiBold' }]}>
                  Ready to{'\n'}practice today?
                </Text>
                <Text style={[styles.heroSub, { fontFamily: 'Inter_400Regular' }]}>
                  Listening &amp; Reading{'\n'}comprehension forms
                </Text>
              </View>
              <View style={styles.heroRight}>
                <View style={styles.heroIconCircle}>
                  <Ionicons name="school" size={32} color={colors.accent} />
                </View>
              </View>
            </View>
          </LinearGradient>
        </MotiView>

        {/* ── Section: Start a Quiz ── */}
        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
            Start a Quiz
          </Text>
        </View>

        <View style={styles.quizRow}>
          {/* Listening card */}
          <MotiView
            from={{ opacity: 0, translateX: -16 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 380, delay: 200 }}
            style={styles.quizCardWrap}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/(tabs)/listening');
              }}
              style={styles.quizCard}
            >
              <LinearGradient
                colors={['#7c3aed', '#5b21b6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quizGradient}
              >
                <View style={styles.quizDecor} />
                <View style={[styles.quizIconBg, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                  <Ionicons name="headset" size={28} color="#ffffff" />
                </View>
                <Text style={[styles.quizLabel, { fontFamily: 'Inter_600SemiBold' }]}>
                  Listening
                </Text>
                <Text style={[styles.quizCaption, { fontFamily: 'Inter_400Regular' }]}>
                  Audio comprehension
                </Text>
                {!loading && (
                  <View style={styles.quizMeta}>
                    <Text style={[styles.quizMetaText, { fontFamily: 'Inter_400Regular' }]}>
                      {listeningForms.length} forms · {totalListeningQs} Qs
                    </Text>
                  </View>
                )}
                <View style={styles.quizArrow}>
                  <Ionicons name="arrow-forward" size={16} color="#7c3aed" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          {/* Reading card */}
          <MotiView
            from={{ opacity: 0, translateX: 16 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: 380, delay: 260 }}
            style={styles.quizCardWrap}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/(tabs)/reading');
              }}
              style={styles.quizCard}
            >
              <LinearGradient
                colors={['#4f46e5', '#3730a3']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quizGradient}
              >
                <View style={styles.quizDecor} />
                <View style={[styles.quizIconBg, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                  <Ionicons name="book" size={28} color="#ffffff" />
                </View>
                <Text style={[styles.quizLabel, { fontFamily: 'Inter_600SemiBold' }]}>
                  Reading
                </Text>
                <Text style={[styles.quizCaption, { fontFamily: 'Inter_400Regular' }]}>
                  Text comprehension
                </Text>
                {!loading && (
                  <View style={styles.quizMeta}>
                    <Text style={[styles.quizMetaText, { fontFamily: 'Inter_400Regular' }]}>
                      {readingForms.length} forms · {totalReadingQs} Qs
                    </Text>
                  </View>
                )}
                <View style={styles.quizArrow}>
                  <Ionicons name="arrow-forward" size={16} color="#4f46e5" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </View>

        {/* ── Stats strip ── */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 380, delay: 320 }}
          style={[styles.statsStrip, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          {loading ? (
            <ActivityIndicator color={colors.accent} size="small" style={{ paddingVertical: 14 }} />
          ) : (
            <>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: colors.accentIcon }]}>
                  <Ionicons name="headset" size={18} color={colors.accent} />
                </View>
                <Text style={[styles.statNum, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
                  {listeningForms.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                  Listening
                </Text>
              </View>

              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: 'rgba(79,70,229,0.12)' }]}>
                  <Ionicons name="book" size={18} color="#4f46e5" />
                </View>
                <Text style={[styles.statNum, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
                  {readingForms.length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                  Reading
                </Text>
              </View>

              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: colors.accentIcon }]}>
                  <Ionicons name="help-circle" size={18} color={colors.accent} />
                </View>
                <Text style={[styles.statNum, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
                  {totalListeningQs + totalReadingQs}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
                  Questions
                </Text>
              </View>
            </>
          )}
        </MotiView>

        {/* ── Tip card ── */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 380, delay: 380 }}
          style={[styles.tipCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <View style={[styles.tipIconBg, { backgroundColor: colors.accentIcon }]}>
            <Ionicons name="bulb-outline" size={22} color={colors.accent} />
          </View>
          <View style={styles.tipText}>
            <Text style={[styles.tipTitle, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
              Exam Tip
            </Text>
            <Text style={[styles.tipBody, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              Listen to each audio clip at least twice before selecting your answer.
            </Text>
          </View>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: { gap: 2 },
  greetingText: { fontSize: 13 },
  userName: { fontSize: 22, marginTop: 2 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: { color: '#fff', fontSize: 20 },

  heroWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  hero: { borderRadius: 24, overflow: 'hidden', padding: 24 },
  heroBlob1: {
    position: 'absolute',
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -40, right: -30,
  },
  heroBlob2: {
    position: 'absolute',
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -20, left: 10,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroLeft: { flex: 1, gap: 4 },
  heroEyebrow: {
    fontSize: 12, color: 'rgba(255,255,255,0.65)',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4,
  },
  heroTitle: { fontSize: 24, color: '#ffffff', lineHeight: 32, marginBottom: 8 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 19 },
  heroRight: { marginLeft: 16 },
  heroIconCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: '#ffffff',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },

  sectionRow: { marginBottom: 14 },
  sectionTitle: { fontSize: 18 },

  quizRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  quizCardWrap: { flex: 1 },
  quizCard: {
    borderRadius: 20, overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22, shadowRadius: 10, elevation: 5,
  },
  quizGradient: {
    padding: 18, borderRadius: 20, minHeight: 180,
    overflow: 'hidden', position: 'relative', justifyContent: 'flex-start',
  },
  quizDecor: {
    position: 'absolute',
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -28, right: -28,
  },
  quizIconBg: {
    width: 52, height: 52, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  quizLabel: { fontSize: 17, color: '#ffffff', marginBottom: 3 },
  quizCaption: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 12 },
  quizMeta: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
    alignSelf: 'flex-start', marginBottom: 10,
  },
  quizMetaText: { fontSize: 11, color: 'rgba(255,255,255,0.9)' },
  quizArrow: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center', alignItems: 'center',
  },

  statsStrip: {
    flexDirection: 'row', borderRadius: 18, borderWidth: 1,
    padding: 16, marginBottom: 16,
    justifyContent: 'space-around', alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statItem: { alignItems: 'center', gap: 4, flex: 1 },
  statIcon: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  statNum: { fontSize: 22 },
  statLabel: { fontSize: 12 },
  statDivider: { width: 1, height: 48 },

  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    borderRadius: 16, borderWidth: 1, padding: 16, gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  tipIconBg: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  tipText: { flex: 1, gap: 4 },
  tipTitle: { fontSize: 14 },
  tipBody: { fontSize: 13, lineHeight: 19 },
});
