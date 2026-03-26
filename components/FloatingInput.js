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
  const { isDark, colors } = useTheme();

  const hasValue = value && value.length > 0;
  const floating = focused || hasValue;

  const label = LABELS[labelKey] || labelKey;

  const borderColor = focused ? colors.accent : colors.border;
  const labelColor = floating ? colors.accent : colors.textSecondary;
  const inputBg = colors.surface;
  const inputText = colors.text;
  const placeholder = colors.textSecondary;

  return (
    <View style={styles.wrap}>
      <Text
        style={[
          styles.label,
          floating && styles.labelFloating,
          { color: labelColor, fontFamily: floating ? 'Cairo_700Bold' : 'Cairo_600SemiBold' },
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
            fontFamily: 'Cairo_600SemiBold',
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
