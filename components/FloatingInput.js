import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LABELS = {
  email: 'Email',
  password: 'Password',
  name: 'Full Name',
  confirmPassword: 'Confirm Password',
};

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

  const hasValue = value && value.length > 0;
  const floating = focused || hasValue;

  const label = LABELS[labelKey] || labelKey;

  const borderColor = focused
    ? isDark ? '#8b5cf6' : '#7c3aed'
    : isDark ? '#334155' : '#cbd5e1';
  const labelColor = floating
    ? isDark ? '#8b5cf6' : '#7c3aed'
    : isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? '#1e293b' : '#ffffff';
  const inputText = isDark ? '#f1f5f9' : '#0f172a';
  const placeholder = isDark ? '#64748b' : '#94a3b8';

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.label,
          floating && styles.labelFloating,
          { color: labelColor, fontFamily: floating ? 'Inter_500Medium' : 'Inter_400Regular' },
        ]}
      >
        {label}
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
            fontFamily: 'Inter_400Regular',
          },
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
  input: {
    height: 56,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 20,
    fontSize: 16,
  },
});
