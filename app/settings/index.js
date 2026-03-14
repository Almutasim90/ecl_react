import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';

const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
const FONT_MEDIUM = { en: 'Inter_500Medium', ar: 'Cairo_600SemiBold' };

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark, themeMode, setTheme, colors } = useTheme();
  const { isRTL, locale, setLocale } = useI18n();
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const fontKey = isRTL ? 'ar' : 'en';

  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? 'rgba(30,41,59,0.95)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const modalBg = isDark ? '#1e293b' : '#ffffff';

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleThemeSelect = (mode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTheme(mode);
    setShowThemeModal(false);
  };

  const handleLanguageSelect = (newLocale) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLocale(newLocale);
    setShowLanguageModal(false);
  };

  const getThemeModeLabel = () => {
    if (themeMode === 'light') return isRTL ? 'فاتح' : 'Light';
    if (themeMode === 'dark') return isRTL ? 'داكن' : 'Dark';
    return isRTL ? 'تلقائي' : 'Auto';
  };

  const themeOptions = [
    { label: isRTL ? 'فاتح' : 'Light', value: 'light', icon: 'sunny' },
    { label: isRTL ? 'داكن' : 'Dark', value: 'dark', icon: 'moon' },
    { label: isRTL ? 'تلقائي (النظام)' : 'Auto (System)', value: 'system', icon: 'phone-portrait-outline' },
  ];

  const languageOptions = [
    { label: 'English', value: 'en', flag: '🇺🇸' },
    { label: 'العربية', value: 'ar', flag: '🇸🇦' },
  ];

  const settingsSections = [
    {
      title: isRTL ? 'المظهر' : 'Appearance',
      items: [
        {
          icon: isDark ? 'moon' : 'sunny',
          label: isRTL ? 'المظهر' : 'Theme',
          value: getThemeModeLabel(),
          type: 'button',
          onPress: () => setShowThemeModal(true),
          iconColor: isDark ? '#fbbf24' : '#f59e0b',
        },
        {
          icon: 'language',
          label: isRTL ? 'اللغة' : 'Language',
          value: locale === 'en' ? 'English' : 'العربية',
          type: 'button',
          onPress: () => setShowLanguageModal(true),
        },
      ],
    },
    {
      title: isRTL ? 'العامة' : 'General',
      items: [
        {
          icon: 'notifications-outline',
          label: isRTL ? 'الإشعارات' : 'Notifications',
          type: 'switch',
          value: notifications,
          onToggle: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setNotifications(!notifications);
          },
        },
        {
          icon: 'location-outline',
          label: isRTL ? 'خدمات الموقع' : 'Location Services',
          type: 'switch',
          value: locationServices,
          onToggle: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setLocationServices(!locationServices);
          },
        },
      ],
    },
    {
      title: isRTL ? 'الدعم' : 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          label: isRTL ? 'المساعدة والدعم' : 'Help & Support',
          type: 'link',
          onPress: () => router.push('/support/help'),
        },
        {
          icon: 'chatbubble-outline',
          label: isRTL ? 'اتصل بنا' : 'Contact Us',
          type: 'link',
          onPress: () => {},
        },
        {
          icon: 'star-outline',
          label: isRTL ? 'قيم التطبيق' : 'Rate App',
          type: 'link',
          onPress: () => {},
        },
      ],
    },
    {
      title: isRTL ? 'القانونية' : 'Legal',
      items: [
        {
          icon: 'document-text-outline',
          label: isRTL ? 'الشروط والأحكام' : 'Terms & Conditions',
          type: 'link',
          onPress: () => router.push('/support/terms'),
        },
        {
          icon: 'shield-checkmark-outline',
          label: isRTL ? 'سياسة الخصوصية' : 'Privacy Policy',
          type: 'link',
          onPress: () => {},
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons
            name={isRTL ? 'chevron-forward' : 'chevron-back'}
            size={28}
            color={textColor}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: textColor, fontFamily: FONT_TITLE[fontKey] },
          ]}
        >
          {isRTL ? 'الإعدادات' : 'Settings'}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {settingsSections.map((section, sectionIdx) => (
          <MotiView
            key={sectionIdx}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: sectionIdx * 100 }}
            style={styles.section}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: subtextColor, fontFamily: FONT_MEDIUM[fontKey] },
                isRTL && styles.textRTL,
                isRTL && { marginLeft: 0, marginRight: 4 },
              ]}
            >
              {section.title}
            </Text>
            <View style={[styles.sectionContent, { backgroundColor: cardBg, borderColor }]}>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity
                  key={itemIdx}
                  activeOpacity={item.type === 'switch' ? 1 : 0.7}
                  onPress={item.type !== 'switch' ? item.onPress : undefined}
                  style={[
                    styles.settingItem,
                    isRTL && styles.settingItemRTL,
                    itemIdx < section.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor },
                  ]}
                >
                  <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}>
                      <Ionicons name={item.icon} size={20} color={item.iconColor || '#2563eb'} />
                    </View>
                    <Text
                      style={[
                        styles.settingLabel,
                        { color: textColor, fontFamily: FONT_BODY[fontKey] },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  <View style={styles.settingRight}>
                    {item.type === 'switch' ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: borderColor, true: '#2563eb' }}
                        thumbColor="#ffffff"
                      />
                    ) : item.type === 'button' ? (
                      <View style={[styles.valueRow, isRTL && styles.valueRowRTL]}>
                        <Text
                          style={[
                            styles.settingValue,
                            { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
                          ]}
                        >
                          {item.value}
                        </Text>
                        <Ionicons
                          name={isRTL ? 'chevron-back' : 'chevron-forward'}
                          size={20}
                          color={subtextColor}
                        />
                      </View>
                    ) : (
                      <Ionicons
                        name={isRTL ? 'chevron-back' : 'chevron-forward'}
                        size={20}
                        color={subtextColor}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </MotiView>
        ))}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }]}>
            Daleel+ v1.0.0
          </Text>
        </View>
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowThemeModal(false)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: modalBg }]} onPress={e => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: textColor, fontFamily: FONT_TITLE[fontKey] }]}>
              {isRTL ? 'اختر المظهر' : 'Choose Theme'}
            </Text>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  { borderColor },
                  themeMode === option.value && styles.modalOptionSelected,
                  themeMode === option.value && { borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)' },
                ]}
                onPress={() => handleThemeSelect(option.value)}
              >
                <View style={styles.modalOptionLeft}>
                  <View style={[styles.optionIcon, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}>
                    <Ionicons 
                      name={option.icon} 
                      size={20} 
                      color={themeMode === option.value ? '#2563eb' : subtextColor} 
                    />
                  </View>
                  <Text style={[
                    styles.modalOptionText, 
                    { color: textColor, fontFamily: FONT_BODY[fontKey] },
                    themeMode === option.value && { color: '#2563eb', fontFamily: FONT_MEDIUM[fontKey] }
                  ]}>
                    {option.label}
                  </Text>
                </View>
                {themeMode === option.value && (
                  <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={[styles.modalCloseBtnText, { color: textColor, fontFamily: FONT_MEDIUM[fontKey] }]}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowLanguageModal(false)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: modalBg }]} onPress={e => e.stopPropagation()}>
            <Text style={[styles.modalTitle, { color: textColor, fontFamily: FONT_TITLE[fontKey] }]}>
              {isRTL ? 'اختر اللغة' : 'Choose Language'}
            </Text>
            {languageOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.modalOption,
                  { borderColor },
                  locale === option.value && styles.modalOptionSelected,
                  locale === option.value && { borderColor: '#2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)' },
                ]}
                onPress={() => handleLanguageSelect(option.value)}
              >
                <View style={styles.modalOptionLeft}>
                  <Text style={styles.flagEmoji}>{option.flag}</Text>
                  <Text style={[
                    styles.modalOptionText, 
                    { color: textColor, fontFamily: option.value === 'ar' ? 'Cairo_400Regular' : 'Inter_400Regular' },
                    locale === option.value && { color: '#2563eb', fontFamily: option.value === 'ar' ? 'Cairo_600SemiBold' : 'Inter_600SemiBold' }
                  ]}>
                    {option.label}
                  </Text>
                </View>
                {locale === option.value && (
                  <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalCloseBtn, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={[styles.modalCloseBtnText, { color: textColor, fontFamily: FONT_MEDIUM[fontKey] }]}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
  },
  headerPlaceholder: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingItemRTL: {
    flexDirection: 'row-reverse',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLeftRTL: {
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueRowRTL: {
    flexDirection: 'row-reverse',
  },
  settingValue: {
    fontSize: 15,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 13,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 12,
  },
  modalOptionSelected: {
    borderWidth: 2,
  },
  modalOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
  },
  flagEmoji: {
    fontSize: 28,
  },
  modalCloseBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalCloseBtnText: {
    fontSize: 16,
  },
});
