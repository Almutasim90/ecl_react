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
  const { isDark } = useTheme();
  const letter = OPTION_LETTERS[optionNumber - 1] || String(optionNumber);

  const getColors = () => {
    switch (state) {
      case 'selected':
        return {
          border: '#7c3aed',
          bg: isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)',
          letterBg: '#7c3aed',
          letterColor: '#ffffff',
          text: isDark ? '#f1f5f9' : '#1e1b4b',
        };
      case 'correct':
        return {
          border: '#10b981',
          bg: isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)',
          letterBg: '#10b981',
          letterColor: '#ffffff',
          text: isDark ? '#f1f5f9' : '#1e1b4b',
        };
      case 'wrong':
        return {
          border: '#ef4444',
          bg: isDark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)',
          letterBg: '#ef4444',
          letterColor: '#ffffff',
          text: isDark ? '#f1f5f9' : '#1e1b4b',
        };
      default:
        return {
          border: isDark ? '#334155' : '#e2e8f0',
          bg: isDark ? 'rgba(30,41,59,0.5)' : '#ffffff',
          letterBg: isDark ? '#1e293b' : '#f1f5f9',
          letterColor: isDark ? '#94a3b8' : '#64748b',
          text: isDark ? '#f1f5f9' : '#1e1b4b',
        };
    }
  };

  const colors = getColors();

  const getStatusIcon = () => {
    if (state === 'correct') return <Ionicons name="checkmark-circle" size={20} color="#10b981" />;
    if (state === 'wrong') return <Ionicons name="close-circle" size={20} color="#ef4444" />;
    return null;
  };

  return (
    <MotiView
      animate={{
        scale: state === 'selected' ? 1.01 : 1,
      }}
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
            borderColor: colors.border,
            backgroundColor: colors.bg,
            borderWidth: state === 'default' ? 1.5 : 2,
          },
        ]}
      >
        <View style={[styles.letterBadge, { backgroundColor: colors.letterBg }]}>
          <Text style={[styles.letter, { color: colors.letterColor, fontFamily: 'Inter_600SemiBold' }]}>
            {letter}
          </Text>
        </View>

        <Text
          style={[
            styles.optionText,
            { color: colors.text, fontFamily: 'Inter_400Regular' },
          ]}
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
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  letter: { fontSize: 15 },
  optionText: { flex: 1, fontSize: 15, lineHeight: 22 },
  statusIcon: { width: 20, flexShrink: 0 },
});
