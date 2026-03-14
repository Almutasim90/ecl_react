import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

/** Typography: Cairo for Arabic (RTL), Inter for English. Ensures correct line-height for RTL. */
const FONT_LABEL = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
const FONT_LABEL_FLOATING = { en: 'Inter_500Medium', ar: 'Cairo_600SemiBold' };
const FONT_INPUT = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };

export default function FloatingInput({
  labelKey,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const { isDark } = useTheme();
  const { t, isRTL, locale } = useI18n();

  const hasValue = value && value.length > 0;
  const floating = focused || hasValue;
  const fontKey = isRTL ? 'ar' : 'en';

  const borderColor = focused
    ? isDark ? '#3b82f6' : '#2563eb'
    : isDark ? '#334155' : '#cbd5e1';
  const labelColor = floating
    ? isDark ? '#3b82f6' : '#2563eb'
    : isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#1e293b' : '#ffffff';
  const inputText = isDark ? '#f1f5f9' : '#0f172a';
  const placeholder = isDark ? '#64748b' : '#94a3b8';

  return (
    <View style={[styles.wrap, isRTL && styles.wrapRTL]}>
      <Text
        style={[
          styles.label,
          floating && styles.labelFloating,
          floating && isRTL && styles.labelFloatingRTL,
          { color: labelColor, fontFamily: floating ? FONT_LABEL_FLOATING[fontKey] : FONT_LABEL[fontKey] },
          isRTL && !floating && styles.labelRTL,
          isRTL && styles.labelRTLLineHeight,
        ]}
      >
        {t(labelKey)}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={placeholder}
        style={[
          styles.input,
          {
            borderColor,
            backgroundColor: inputBg,
            color: inputText,
            fontFamily: FONT_INPUT[fontKey],
          },
          isRTL && styles.inputRTL,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 20,
    position: 'relative',
  },
  wrapRTL: {
    // RTL direction handled via text alignment
  },
  label: {
    position: 'absolute',
    left: 16,
    top: 18,
    fontSize: 16,
    zIndex: 1,
  },
  labelFloating: {
    top: -10,
    left: 12,
    fontSize: 12,
    backgroundColor: 'transparent',
  },
  labelRTL: {
    left: undefined,
    right: 16,
  },
  labelFloatingRTL: {
    right: 12,
    left: undefined,
  },
  labelRTLLineHeight: {
    lineHeight: 22,
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    fontSize: 16,
  },
  inputRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
