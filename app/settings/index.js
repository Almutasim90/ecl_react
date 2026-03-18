import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useI18n } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';

const SettingsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { isDark, colors, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text, fontFamily: 'Inter_600SemiBold' }]}>
          {t('settings')}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
      >
        {/* General */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
            {t('general')}
          </Text>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.navigate('Language')}
          >
            <Text style={[styles.optionText, { color: colors.text, fontFamily: 'Inter_400Regular' }]}>
              {t('language')}
            </Text>
            <Text style={[styles.optionValue, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              English
            </Text>
          </TouchableOpacity>

          <View style={[styles.option, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.optionText, { color: colors.text, fontFamily: 'Inter_400Regular' }]}>
              {t('dark_mode')}
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.accentSoft }}
              thumbColor={isDark ? colors.accent : colors.surface}
            />
          </View>

          <View style={[styles.option, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.optionText, { color: colors.text, fontFamily: 'Inter_400Regular' }]}>
              {t('notifications')}
            </Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.accentSoft }}
              thumbColor={notifications ? colors.accent : colors.surface}
            />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
            {t('account')}
          </Text>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.navigate('Profile')}
          >
            <Text style={[styles.optionText, { color: colors.text, fontFamily: 'Inter_400Regular' }]}>
              {t('profile')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
            {t('support')}
          </Text>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.navigate('Help')}
          >
            <Text style={[styles.optionText, { color: colors.text, fontFamily: 'Inter_400Regular' }]}>
              {t('help_support')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => router.navigate('About')}
          >
            <Text style={[styles.optionText, { color: colors.text, fontFamily: 'Inter_400Regular' }]}>
              {t('about')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 44, height: 44,
    justifyContent: 'center', alignItems: 'center',
  },
  headerPlaceholder: { width: 44 },
  title: { fontSize: 28 },
  scrollContent: {},
  section: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 11, fontWeight: '600',
    textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1.3,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionText: { fontSize: 16 },
  optionValue: { fontSize: 14 },
});

export default SettingsScreen;
