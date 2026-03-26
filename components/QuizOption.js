import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

/**
 * states: 'default' | 'selected' | 'correct' | 'wrong'
 */
export default function QuizOption({ optionNumber, text, state = 'default', onPress, disabled = false }) {
  const { colors } = useTheme();
  const letter = OPTION_LETTERS[optionNumber - 1] || String(optionNumber);

  const getColors = () => {
    switch (state) {
      case 'selected':
        return {
          border: colors.accent,
          bg: colors.accentSoft,
          letterBg: colors.accent,
          letterColor: '#ffffff',
          text: colors.text,
        };
      case 'correct':
        return {
          border: colors.success,
          bg: colors.successSoft,
          letterBg: colors.success,
          letterColor: '#ffffff',
          text: colors.text,
        };
      case 'wrong':
        return {
          border: colors.error,
          bg: colors.errorSoft,
          letterBg: colors.error,
          letterColor: '#ffffff',
          text: colors.text,
        };
      default:
        return {
          border: colors.border,
          bg: colors.surface,
          letterBg: colors.surfaceAlt,
          letterColor: colors.textSecondary,
          text: colors.text,
        };
    }
  };

  const c = getColors();

  const getStatusIcon = () => {
    if (state === 'correct') return <Ionicons name="checkmark-circle" size={20} color={colors.success} />;
    if (state === 'wrong') return <Ionicons name="close-circle" size={20} color={colors.error} />;
    return null;
  };

  return (
    <MotiView
      animate={{ scale: state === 'selected' ? 1.01 : 1 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.75}
        onPress={() => {
          if (!disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress?.();
          }
        }}
        style={[
          styles.option,
          {
            borderColor: c.border,
            backgroundColor: c.bg,
            borderWidth: state === 'default' ? 1.5 : 2,
          },
        ]}
      >
        <View style={[styles.letterBadge, { backgroundColor: c.letterBg }]}>
          <Text style={[styles.letter, { color: c.letterColor, fontFamily: 'Inter_600SemiBold' }]}>
            {letter}
          </Text>
        </View>

        <Text
          style={[styles.optionText, { color: c.text, fontFamily: 'Inter_400Regular' }]}
          numberOfLines={3}
        >
          {text}
        </Text>

        <View style={styles.statusIcon}>{getStatusIcon()}</View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  letterBadge: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  letter: { fontSize: 14, letterSpacing: 0.3 },
  optionText: { flex: 1, fontSize: 15, lineHeight: 22 },
  statusIcon: { width: 20, flexShrink: 0 },
});
