import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function FormCard({ formNumber, questionCount, type, onPress, index = 0 }) {
  const { isDark } = useTheme();
  const isListening = type === 'listening';

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const borderColor = isDark ? '#334155' : '#ede9fe';
  const textColor = isDark ? '#f1f5f9' : '#1e1b4b';
  const subtextColor = isDark ? '#94a3b8' : '#6b7280';
  const accentColor = isListening ? '#7c3aed' : '#4f46e5';
  const badgeColors = isListening
    ? ['#7c3aed', '#5b21b6']
    : ['#4f46e5', '#3730a3'];

  // Listening: avg 1.5 min/question — Reading: avg 1 min/question
  const estimatedMinutes = isListening
    ? Math.round(questionCount * 1.5)
    : questionCount;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 14 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 20, delay: index * 65 }}
    >
      <TouchableOpacity
        activeOpacity={0.78}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress?.();
        }}
        style={[styles.card, { backgroundColor: cardBg, borderColor }]}
      >
        {/* Gradient number badge */}
        <LinearGradient
          colors={badgeColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badge}
        >
          <View style={styles.badgeDecor} />
          <Text style={[styles.badgeNum, { fontFamily: 'Inter_600SemiBold' }]}>
            {String(formNumber).padStart(2, '0')}
          </Text>
          <Ionicons
            name={isListening ? 'headset' : 'book'}
            size={15}
            color="rgba(255,255,255,0.6)"
          />
        </LinearGradient>

        {/* Info */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor, fontFamily: 'Inter_600SemiBold' }]}>
            Form {formNumber}
          </Text>
          <View style={styles.metaRow}>
            <Ionicons name="help-circle-outline" size={13} color={subtextColor} />
            <Text style={[styles.metaText, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
              {questionCount} questions
            </Text>
            <View style={[styles.dot, { backgroundColor: subtextColor }]} />
            <Ionicons name="time-outline" size={13} color={subtextColor} />
            <Text style={[styles.metaText, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
              ~{estimatedMinutes} min
            </Text>
          </View>
        </View>

        {/* Play CTA */}
        <View style={[styles.playBtn, { backgroundColor: `${accentColor}18` }]}>
          <Ionicons name="play" size={16} color={accentColor} style={{ marginLeft: 2 }} />
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  badge: {
    width: 68,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  badgeDecor: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.09)',
    top: -18,
    right: -18,
  },
  badgeNum: {
    fontSize: 22,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  title: { fontSize: 16, marginBottom: 5 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'nowrap',
  },
  metaText: { fontSize: 12 },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    opacity: 0.45,
    marginHorizontal: 2,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
});
