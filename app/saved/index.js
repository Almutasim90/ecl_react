import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { useFavorites } from '../../context/FavoritesContext';
import { FEATURED_BUSINESSES, NEARBY_BUSINESSES } from '../../data/mockData';
import BusinessCard from '../../components/BusinessCard';

const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };

export default function SavedPlacesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { isRTL } = useI18n();
  const { favorites } = useFavorites();
  const fontKey = isRTL ? 'ar' : 'en';

  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';

  const allBusinesses = [...FEATURED_BUSINESSES, ...NEARBY_BUSINESSES];
  const savedBusinesses = allBusinesses.filter((b) => favorites.includes(b.id));

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

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
          {isRTL ? 'المفضلة' : 'Saved Places'}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {savedBusinesses.length > 0 ? (
          <>
            <Text
              style={[
                styles.resultsCount,
                { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
                isRTL && styles.textRTL,
              ]}
            >
              {isRTL
                ? `${savedBusinesses.length} أماكن محفوظة`
                : `${savedBusinesses.length} saved places`}
            </Text>
            {savedBusinesses.map((business, idx) => (
              <BusinessCard key={business.id} business={business} index={idx} />
            ))}
          </>
        ) : (
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            style={styles.emptyState}
          >
            <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <Ionicons name="heart-outline" size={48} color={subtextColor} />
            </View>
            <Text
              style={[
                styles.emptyTitle,
                { color: textColor, fontFamily: FONT_TITLE[fontKey] },
              ]}
            >
              {isRTL ? 'لا توجد أماكن محفوظة' : 'No Saved Places'}
            </Text>
            <Text
              style={[
                styles.emptyDescription,
                { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
                isRTL && styles.textRTL,
              ]}
            >
              {isRTL
                ? 'اضغط على أيقونة القلب لحفظ الأماكن المفضلة لديك'
                : 'Tap the heart icon to save your favorite places'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)');
              }}
              style={styles.exploreBtn}
            >
              <Text style={[styles.exploreBtnText, { fontFamily: FONT_TITLE[fontKey] }]}>
                {isRTL ? 'استكشف الأماكن' : 'Explore Places'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        )}
      </ScrollView>
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
    paddingBottom: 40,
  },
  resultsCount: {
    fontSize: 14,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  exploreBtnText: {
    color: '#ffffff',
    fontSize: 16,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
