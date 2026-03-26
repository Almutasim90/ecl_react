import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

export default function FormCard({ formNumber, questionCount, type, onPress, index = 0, progress = null }) {
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
          progress && { borderWidth: 1.5 },
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
          <Text style={[styles.badgeNum, { fontFamily: 'Inter_600SemiBold' }]}>
            {String(formNumber).padStart(2, '0')}
          </Text>
          <Ionicons
            name={isListening ? 'headset' : isGrammar ? 'language' : 'book'}
            size={15}
            color="rgba(255,255,255,0.6)"
          />
        </LinearGradient>

        {/* Info */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
              Form {formNumber}
            </Text>
            {progress && (
              <View style={[styles.resumeBadge, { backgroundColor: `${accentColor}18` }]}>
                <Ionicons name="time-outline" size={11} color={accentColor} />
                <Text style={[styles.resumeText, { color: accentColor, fontFamily: 'Inter_600SemiBold' }]}>
                  {answeredCount}/{questionCount}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.metaRow}>
            <Ionicons name="help-circle-outline" size={13} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              {questionCount} questions
            </Text>
            <View style={[styles.dot, { backgroundColor: colors.textSecondary }]} />
            <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
            <Text style={[styles.metaText, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              ~{estimatedMinutes} min
            </Text>
          </View>
          {progress && (
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { backgroundColor: accentColor, width: `${progressPct * 100}%` }]} />
            </View>
          )}
        </View>

        {/* CTA icon */}
        <View style={[styles.playBtn, { backgroundColor: `${accentColor}18` }]}>
          <Ionicons
            name={progress ? 'arrow-forward-circle' : 'play'}
            size={progress ? 22 : 16}
            color={accentColor}
            style={!progress && { marginLeft: 2 }}
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
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.09)',
    top: -18, right: -18,
  },
  badgeNum: { fontSize: 22, color: '#ffffff', letterSpacing: 0.5 },
  content: { flex: 1, paddingVertical: 14, paddingHorizontal: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  title: { fontSize: 16 },
  resumeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
  },
  resumeText: { fontSize: 11 },
  metaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'nowrap',
  },
  metaText: { fontSize: 12 },
  dot: { width: 3, height: 3, borderRadius: 1.5, opacity: 0.45, marginHorizontal: 2 },
  progressTrack: {
    height: 3, borderRadius: 2, marginTop: 8, overflow: 'hidden',
  },
  progressFill: { height: 3, borderRadius: 2 },
  playBtn: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
});
