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
    if (state === 'correct') return <Ionicons name="checkmark-circle" size={22} color={colors.success} />;
    if (state === 'wrong') return <Ionicons name="close-circle" size={22} color={colors.error} />;
    return null;
  };

  return (
    <MotiView
      animate={{ scale: state === 'selected' ? 1.02 : 1 }}
      transition={{ type: 'spring', damping: 15 }}
    >
      <TouchableOpacity
        activeOpacity={disabled ? 1 : 0.75}
        onPress={() => {
          if (!disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress?.();
          }
        }}
        style={[
          styles.option,
          {
            borderColor: c.border,
            backgroundColor: c.bg,
            borderWidth: state === 'default' ? 1.5 : 2.5,
          },
        ]}
      >
        <View style={[styles.letterBadge, { backgroundColor: c.letterBg }]}>
          <Text style={[styles.letter, { color: c.letterColor, fontFamily: 'Cairo_800ExtraBold' }]}>
            {letter}
          </Text>
        </View>

        <Text
          style={[styles.optionText, { color: c.text, fontFamily: 'Cairo_800ExtraBold' }]}
          numberOfLines={4}
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
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  letterBadge: {
    width: 42, height: 42, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  letter: { fontSize: 18, letterSpacing: 0.5 },
  optionText: { flex: 1, fontSize: 16, lineHeight: 24 },
  statusIcon: { width: 26, alignItems: 'center', justifyContent: 'center' },
});
