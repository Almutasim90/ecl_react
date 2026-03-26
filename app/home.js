import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

const TOPICS = [
  {
    id: 'grammar',
    title: 'Grammar Rules',
    desc: 'Master tenses, articles & more',
    emoji: '✏️',
    accent: '#4338ca',
    route: '/(tabs)/grammar',
  },
  {
    id: 'listening',
    title: 'Listening Skills',
    desc: 'Train your ear with real audio',
    emoji: '🎧',
    accent: '#7c3aed',
    route: '/(tabs)/listening',
  },
  {
    id: 'reading',
    title: 'Reading Comprehension',
    desc: 'Boost speed & understanding',
    emoji: '📖',
    accent: '#0369a1',
    route: '/(tabs)/reading',
  },
  {
    id: 'guide',
    title: 'Grammar Guide',
    desc: 'Interactive story-style lessons',
    emoji: '📚',
    accent: '#059669',
    route: '/learn/grammar',
  },
];

const TIPS = [
  { id: '1', icon: 'bulb-outline',            color: '#4338ca', text: 'Practice 15 min daily for best retention.' },
  { id: '2', icon: 'headset-outline',          color: '#7c3aed', text: 'Listening first helps pronunciation naturally.' },
  { id: '3', icon: 'checkmark-circle-outline', color: '#059669', text: 'Review wrong answers — mistakes teach most.' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const nav = (route) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(route);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>

      {/* ── Gradient header ── */}
      <LinearGradient
        colors={isDark ? ['#1e1b4b', '#2e1065'] : ['#4338ca', '#6d28d9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerInner}>
          <View style={styles.headerText}>
            <Text style={[styles.headerEye, { fontFamily: 'Cairo_700Bold' }]}>
              English Learning
            </Text>
            <Text style={[styles.headerTitle, { fontFamily: 'Cairo_800ExtraBold' }]}>
              Explore Topics
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Ionicons name="compass" size={22} color="#fff" />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        {/* ── Topic cards ── */}
        <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>
          Pick a Skill
        </Text>

        {TOPICS.map((topic, i) => (
          <MotiView
            key={topic.id}
            from={{ opacity: 0, translateX: -16 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'spring', damping: 18, delay: i * 65 }}
          >
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={() => nav(topic.route)}
              style={[styles.topicCard, {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }]}
            >
              {/* Colored icon box */}
              <View style={[styles.topicIcon, { backgroundColor: topic.accent + (isDark ? '30' : '15') }]}>
                <Text style={styles.topicEmoji}>{topic.emoji}</Text>
              </View>

              <View style={styles.topicBody}>
                <Text style={[styles.topicTitle, { color: colors.text, fontFamily: 'Cairo_700Bold' }]}>
                  {topic.title}
                </Text>
                <Text style={[styles.topicDesc, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
                  {topic.desc}
                </Text>
              </View>

              <View style={[styles.topicArrow, { backgroundColor: topic.accent + (isDark ? '25' : '12') }]}>
                <Ionicons name="chevron-forward" size={15} color={topic.accent} />
              </View>
            </TouchableOpacity>
          </MotiView>
        ))}

        {/* ── Study tips ── */}
        <Text style={[styles.sectionLabel, { color: colors.text, fontFamily: 'Cairo_800ExtraBold', marginTop: 10 }]}>
          Study Tips
        </Text>

        {TIPS.map((tip, i) => (
          <MotiView
            key={tip.id}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 18, delay: 260 + i * 70 }}
          >
            <View style={[styles.tipRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.tipIcon, { backgroundColor: tip.color + (isDark ? '30' : '15') }]}>
                <Ionicons name={tip.icon} size={20} color={tip.color} />
              </View>
              <Text style={[styles.tipText, { color: colors.textSecondary, fontFamily: 'Cairo_600SemiBold' }]}>
                {tip.text}
              </Text>
            </View>
          </MotiView>
        ))}

        {/* ── CTA banner ── */}
        <MotiView
          from={{ opacity: 0, translateY: 14 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 16, delay: 480 }}
        >
          <TouchableOpacity activeOpacity={0.85} onPress={() => nav('/learn/grammar')}>
            <LinearGradient
              colors={['#312e81', '#4338ca', '#6366f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.ctaBanner}
            >
              <View style={styles.ctaGlow} />
              <View style={styles.ctaLeft}>
                <View style={styles.ctaBadgePill}>
                  <Text style={[styles.ctaBadgeText, { fontFamily: 'Cairo_800ExtraBold' }]}>NEW</Text>
                </View>
                <Text style={[styles.ctaTitle, { fontFamily: 'Cairo_800ExtraBold' }]}>
                  Grammar Guide
                </Text>
                <Text style={[styles.ctaSub, { fontFamily: 'Cairo_600SemiBold' }]}>
                  Learn with interactive lessons
                </Text>
              </View>
              <Text style={styles.ctaEmoji}>📚</Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // Header
  header: {
    paddingHorizontal: 22,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: { gap: 2 },
  headerEye: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1,
  },
  headerTitle: { fontSize: 24, color: '#ffffff' },
  headerIcon: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Scroll content
  scroll: { paddingHorizontal: 18, paddingTop: 24 },

  sectionLabel: { fontSize: 17, marginBottom: 14 },

  // Topic cards
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 11,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  topicIcon: {
    width: 50, height: 50, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  topicEmoji: { fontSize: 24 },
  topicBody: { flex: 1, gap: 3 },
  topicTitle: { fontSize: 15 },
  topicDesc: { fontSize: 12 },
  topicArrow: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },

  // Tips
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  tipIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  tipText: { flex: 1, fontSize: 13, lineHeight: 20 },

  // CTA banner
  ctaBanner: {
    borderRadius: 22,
    paddingVertical: 22,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#4338ca',
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  ctaGlow: {
    position: 'absolute',
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -40, right: -20,
  },
  ctaLeft: { gap: 5 },
  ctaBadgePill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'flex-start',
    paddingHorizontal: 9, paddingVertical: 3,
    borderRadius: 8,
  },
  ctaBadgeText: { fontSize: 10, color: '#c7d2fe', letterSpacing: 0.8 },
  ctaTitle: { fontSize: 19, color: '#ffffff' },
  ctaSub: { fontSize: 12, color: 'rgba(255,255,255,0.72)' },
  ctaEmoji: { fontSize: 46 },
});
