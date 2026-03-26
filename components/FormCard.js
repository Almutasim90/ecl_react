import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function FormCard({ formNumber, title, questionCount, type, onPress, index = 0, progress = null }) {
  const { colors } = useTheme();
  const isListening = type === 'listening';
  const isGrammar = type === 'grammar';

  const accentColor = isListening ? colors.listeningAccent : isGrammar ? colors.grammarAccent : colors.readingAccent;
  const badgeColors = isListening ? colors.gradientListening : isGrammar ? colors.gradientGrammar : colors.gradientReading;
  const estimatedMinutes = isListening ? Math.round(questionCount * 1.5) : questionCount;

  const answeredCount = progress ? Object.keys(progress.answers).length : 0;
  const progressPct = progress ? answeredCount / questionCount : 0;

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
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: progress ? accentColor : colors.border },
          progress && { borderWidth: 2 },
        ]}
      >
        {/* Gradient number badge */}
        <LinearGradient
          colors={badgeColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.badge}
        >
          <View style={styles.badgeDecor} />
          <Text style={[styles.badgeNum, { fontFamily: 'Cairo_800ExtraBold' }]}>
            {String(formNumber).padStart(2, '0')}
          </Text>
          <Ionicons
            name={isListening ? 'headset' : isGrammar ? 'language' : 'book'}
            size={16}
            color="rgba(255,255,255,0.7)"
          />
        </LinearGradient>

        {/* Info */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text, fontFamily: 'Cairo_800ExtraBold' }]}>
              {title || `Form ${formNumber}`}
            </Text>
            {progress && (
              <View style={[styles.resumeBadge, { backgroundColor: `${accentColor}18` }]}>
                <Ionicons name="time" size={12} color={accentColor} />
                <Text style={[styles.resumeText, { color: accentColor, fontFamily: 'Cairo_800ExtraBold' }]}>
                  {answeredCount}/{questionCount}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="help-circle" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary, fontFamily: 'Cairo_700Bold' }]}>
              {questionCount} Questions
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
            <Ionicons name="timer" size={14} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary, fontFamily: 'Cairo_700Bold' }]}>
              {estimatedMinutes}m
            </Text>
          </View>
          {progress && (
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { backgroundColor: accentColor, width: `${progressPct * 100}%` }]} />
            </View>
          )}
        </View>

        {/* CTA icon */}
        <View style={[styles.playBtn, { backgroundColor: `${accentColor}12`, borderColor: `${accentColor}20`, borderWidth: 1 }]}>
          <Ionicons
            name={progress ? 'chevron-forward-circle' : 'play-circle'}
            size={28}
            color={accentColor}
          />
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  badge: {
    width: 72,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  badgeDecor: {
    position: 'absolute',
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -20, right: -20,
  },
  badgeNum: { fontSize: 24, color: '#ffffff' },
  content: { flex: 1, paddingVertical: 16, paddingHorizontal: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  title: { fontSize: 17 },
  resumeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  resumeText: { fontSize: 12 },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  metaText: { fontSize: 13 },
  dot: { width: 4, height: 4, borderRadius: 2, opacity: 0.4, marginHorizontal: 4 },
  progressTrack: {
    height: 6, borderRadius: 3, marginTop: 12, overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3 },
  playBtn: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
});
