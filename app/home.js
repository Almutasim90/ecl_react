import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';
import { useResponsive } from '../utils/useResponsive';

const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
const FONT_BOLD = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { t, isRTL } = useI18n();
  const { horizontalPadding } = useResponsive();
  const fontKey = isRTL ? 'ar' : 'en';

  const guidePosts = [
    {
      id: '1',
      title: isRTL ? 'الدليل الشامل' : 'Comprehensive Guide',
      category: isRTL ? 'السفر' : 'Travel',
      views: '2.5K',
    },
    {
      id: '2',
      title: isRTL ? 'نصائح مفيدة' : 'Helpful Tips',
      category: isRTL ? 'الصحة' : 'Health',
      views: '1.8K',
    },
    {
      id: '3',
      title: isRTL ? 'طرق جديدة' : 'New Methods',
      category: isRTL ? 'التعليم' : 'Education',
      views: '3.2K',
    },
  ];

  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const accentColor = '#2563eb';

  const renderPost = ({ item }) => (
    <MotiView
      from={{ opacity: 0, translateX: isRTL ? -20 : 20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => Haptics.selectionAsync()}
        style={[
          styles.postCard,
          {
            backgroundColor: cardBg,
            borderColor: isDark ? '#334155' : '#e2e8f0',
          },
        ]}
      >
        <View style={[styles.postHeader, isRTL && styles.postHeaderRTL]}>
          <View style={styles.postTitleWrap}>
            <Text
              style={[
                styles.postTitle,
                { color: textColor, fontFamily: FONT_BOLD[fontKey], textAlign: isRTL ? 'right' : 'left' },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              style={[
                styles.postCategory,
                { color: accentColor, fontFamily: FONT_BODY[fontKey], textAlign: isRTL ? 'right' : 'left' },
              ]}
            >
              {item.category}
            </Text>
          </View>
          <View
            style={[
              styles.viewsBadge,
              { backgroundColor: isDark ? '#334155' : '#f1f5f9' },
              isRTL && { marginLeft: 0, marginRight: 12 },
            ]}
          >
            <Text
              style={[
                styles.viewsText,
                { color: textColor, fontFamily: FONT_BODY[fontKey] },
              ]}
            >
              {item.views}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <Text
            style={[
              styles.headerTitle,
              { color: textColor, fontFamily: FONT_BOLD[fontKey] },
              isRTL && styles.headerTitleRTL,
            ]}
          >
            {isRTL ? 'مرحباً بك' : 'Welcome'}
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: textSecondary, fontFamily: FONT_BODY[fontKey] },
              isRTL && styles.headerSubtitleRTL,
            ]}
          >
            {isRTL
              ? 'استكشف أحدث الأدلة والنصائح'
              : 'Explore latest guides and tips'}
          </Text>
        </MotiView>

        <View
          style={[
            styles.searchBar,
            { backgroundColor: cardBg, borderColor: isDark ? '#334155' : '#e2e8f0' },
          ]}
        >
          <Text style={{ color: textSecondary, fontFamily: FONT_BODY[fontKey], textAlign: isRTL ? 'right' : 'left' }}>
            {isRTL ? '🔍 ابحث...' : '🔍 Search...'}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
            <Text
              style={[
                styles.sectionTitle,
                { color: textColor, fontFamily: FONT_BOLD[fontKey] },
                isRTL && styles.sectionTitleRTL,
              ]}
            >
              {isRTL ? 'الأدلة الشهيرة' : 'Popular Guides'}
            </Text>
            <Link href="/" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[styles.seeAll, { color: accentColor, fontFamily: FONT_BODY[fontKey] }]}>
                  {isRTL ? 'عرض الكل' : 'See All'}
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          <FlatList
            data={guidePosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          />
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: textColor, fontFamily: FONT_BOLD[fontKey] },
              isRTL && styles.sectionTitleRTL,
            ]}
          >
            {isRTL ? 'التصنيفات' : 'Categories'}
          </Text>
          <View style={[styles.categoriesGrid, isRTL && styles.categoriesGridRTL]}>
            {['🚀', '📚', '💡', '🎯'].map((emoji, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={[
                  styles.categoryCard,
                  { backgroundColor: cardBg, borderColor: isDark ? '#334155' : '#e2e8f0' },
                ]}
              >
                <Text style={styles.categoryEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View
        style={[
          styles.bottomNav,
          { backgroundColor: cardBg, borderColor: isDark ? '#334155' : '#e2e8f0', paddingBottom: insets.bottom + 12 },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.navItem}
          onPress={() => Haptics.selectionAsync()}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, { color: accentColor, fontFamily: FONT_BODY[fontKey] }]}>
            {isRTL ? 'الرئيسية' : 'Home'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.navItem}
          onPress={() => Haptics.selectionAsync()}
        >
          <Text style={styles.navIcon}>🔍</Text>
          <Text style={[styles.navLabel, { color: textSecondary, fontFamily: FONT_BODY[fontKey] }]}>
            {isRTL ? 'ابحث' : 'Search'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.navItem}
          onPress={() => Haptics.selectionAsync()}
        >
          <Text style={styles.navIcon}>❤️</Text>
          <Text style={[styles.navLabel, { color: textSecondary, fontFamily: FONT_BODY[fontKey] }]}>
            {isRTL ? 'المفضلة' : 'Saved'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.navItem}
          onPress={() => Haptics.selectionAsync()}
        >
          <Text style={styles.navIcon}>👤</Text>
          <Text style={[styles.navLabel, { color: textSecondary, fontFamily: FONT_BODY[fontKey] }]}>
            {isRTL ? 'الملف' : 'Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    marginBottom: 8,
  },
  headerTitleRTL: {
    textAlign: 'right',
  },
  headerSubtitle: {
    fontSize: 15,
  },
  headerSubtitleRTL: {
    textAlign: 'right',
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  sectionTitle: {
    fontSize: 18,
  },
  sectionTitleRTL: {
    textAlign: 'right',
  },
  seeAll: {
    fontSize: 14,
  },
  postCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  postTitleWrap: {
    flex: 1,
  },
  postTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  postCategory: {
    fontSize: 12,
  },
  viewsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 12,
  },
  viewsText: {
    fontSize: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  categoriesGridRTL: {
    flexDirection: 'row-reverse',
  },
  categoryCard: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  categoryEmoji: {
    fontSize: 32,
  },
  bottomSpace: {
    height: 100,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
  },
});
