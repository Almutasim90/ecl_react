import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

const GOOGLE_BG = '#ffffff';
const GOOGLE_BORDER = '#dadce0';
const GOOGLE_TEXT = '#3c4043';
const APPLE_BG_LIGHT = '#000000';
const APPLE_BG_DARK = '#ffffff';
const APPLE_TEXT_LIGHT = '#ffffff';
const APPLE_TEXT_DARK = '#000000';

export default function SocialAuthButtons({ onGoogle, onApple }) {
  const { isDark } = useTheme();

  const handlePress = (fn) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    fn?.();
  };

  const appleBg = isDark ? APPLE_BG_DARK : APPLE_BG_LIGHT;
  const appleText = isDark ? APPLE_TEXT_DARK : APPLE_TEXT_LIGHT;

  return (
    <View style={styles.row}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handlePress(onGoogle)}
        style={[
          styles.btn,
          styles.googleBtn,
          isDark && styles.googleBtnDark,
        ]}
      >
        <Text style={styles.googleIcon}>G</Text>
        <Text style={[styles.btnLabel, { fontFamily: 'Inter_600SemiBold', color: isDark ? '#e2e8f0' : GOOGLE_TEXT }]}>
          Google
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handlePress(onApple)}
        style={[styles.btn, { backgroundColor: appleBg }]}
      >
        <Text style={[styles.appleIcon, { color: appleText }]}></Text>
        <Text style={[styles.btnLabel, { fontFamily: 'Inter_600SemiBold', color: appleText }]}>
          Apple
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  googleBtn: {
    backgroundColor: GOOGLE_BG,
    borderWidth: 1.5,
    borderColor: GOOGLE_BORDER,
  },
  googleBtnDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  googleIcon: {
    fontSize: 18,
    color: '#4285F4',
  },
  appleIcon: {
    fontSize: 20,
  },
  btnLabel: {
    fontSize: 15,
  },
});
