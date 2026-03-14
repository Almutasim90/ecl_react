import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

const FONT_MEDIUM = { en: 'Inter_500Medium', ar: 'Cairo_600SemiBold' };

export default function CategoryChip({ category, selected = false, onPress, index = 0 }) {
  const { isDark } = useTheme();
  const { isRTL } = useI18n();
  const fontKey = isRTL ? 'ar' : 'en';

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(category);
  };

  const bgColor = selected
    ? category.color
    : isDark
    ? 'rgba(30,41,59,0.85)'
    : '#f1f5f9';

  const textColor = selected ? '#ffffff' : isDark ? '#f1f5f9' : '#0f172a';
  const iconColor = selected ? '#ffffff' : category.color;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300, delay: index * 30 }}
      style={[styles.chipWrapper, isRTL && { marginRight: 0, marginLeft: 10 }]}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={[
          styles.chip,
          { backgroundColor: bgColor },
          selected && styles.chipSelected,
          isRTL && { flexDirection: 'row-reverse' },
        ]}
      >
        <Ionicons name={category.icon} size={20} color={iconColor} />
        <Text
          style={[
            styles.chipText,
            { color: textColor, fontFamily: FONT_MEDIUM[fontKey] },
            isRTL && styles.textRTL,
          ]}
        >
          {isRTL ? category.nameAr : category.name}
        </Text>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  chipWrapper: {
    marginRight: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  chipSelected: {
    elevation: 4,
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  chipText: {
    fontSize: 15,
  },
  textRTL: {
    writingDirection: 'rtl',
    textAlign: 'right',
  },
});
