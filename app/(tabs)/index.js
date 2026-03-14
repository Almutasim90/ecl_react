import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import BusinessCard from '../../components/BusinessCard';
import CategoryChip from '../../components/CategoryChip';
import { CATEGORIES, FEATURED_BUSINESSES, NEARBY_BUSINESSES } from '../../data/mockData';

const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
const FONT_BOLD = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();
  const { isRTL } = useI18n();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fontKey = isRTL ? 'ar' : 'en';

  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.9)';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isRTL ? 'صباح الخير' : 'Good Morning';
    if (hour < 18) return isRTL ? 'مساء الخير' : 'Good Afternoon';
    return isRTL ? 'مساء الخير' : 'Good Evening';
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(selectedCategory?.id === category.id ? null : category);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Enhanced Header with User Welcome */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.header}
        >
          <View style={[styles.headerContent, isRTL && styles.headerContentRTL]}>
            {/* User Info Section */}
            <View style={[styles.userSection, isRTL && styles.userSectionRTL]}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(tabs)/profile');
                }}
              >
                <LinearGradient
                  colors={isDark ? ['#3b82f6', '#2563eb'] : ['#2563eb', '#1d4ed8']}
                  style={styles.avatarSmall}
                >
                  <Text style={[styles.avatarSmallText, { fontFamily: FONT_BOLD[fontKey] }]}>
                    {user?.name?.charAt(0).toUpperCase() || 'G'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.greetingSection}>
                <Text style={[styles.greetingSmall, { color: subtextColor, fontFamily: FONT_BODY[fontKey], textAlign: isRTL ? 'right' : 'left' }]}>
                  {getGreeting()}
                </Text>
                <Text style={[styles.userName, { color: textColor, fontFamily: FONT_TITLE[fontKey], textAlign: isRTL ? 'right' : 'left' }]}>
                  {user?.name || (isRTL ? 'ضيف' : 'Guest')}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={[styles.headerActions, isRTL && styles.headerActionsRTL]}>
              <TouchableOpacity 
                style={[styles.iconButton, { backgroundColor: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(37,99,235,0.1)' }]}
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Ionicons name="notifications-outline" size={22} color={isDark ? '#60a5fa' : '#2563eb'} />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Welcome Message Card - Matches App Identity */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 150 }}
          >
            <LinearGradient
              colors={isDark ? ['#1e3a8a', '#3b82f6'] : ['#2563eb', '#3b82f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeCard}
            >
              {/* Decorative elements matching splash screen */}
              <View style={[styles.welcomeDecor, styles.welcomeDecor1]} />
              <View style={[styles.welcomeDecor, styles.welcomeDecor2]} />
              <View style={[styles.welcomeDecor, styles.welcomeDecor3]} />
              
              <View style={[styles.welcomeContent, isRTL && { flexDirection: 'row-reverse' }]}>
                {/* Brand Icon - Location Pin */}
                <View style={[styles.brandIconContainer, isRTL && { marginRight: 0, marginLeft: 14 }]}>
                  <View style={styles.brandIcon}>
                    <Ionicons name="location" size={28} color="#2563eb" />
                  </View>
                </View>

                <View style={styles.welcomeTextSection}>
                  <View style={styles.brandHeader}>
                    <Text style={[styles.brandName, { fontFamily: FONT_BOLD[fontKey], textAlign: isRTL ? 'right' : 'left' }]}>
                      Daleel<Text style={styles.brandPlus}>+</Text>
                    </Text>
                  </View>
                  <Text style={[styles.welcomeTitle, { fontFamily: FONT_TITLE[fontKey], textAlign: isRTL ? 'right' : 'left' }]}>
                    {isRTL ? 'استكشف أفضل الأماكن' : 'Explore Best Places'}
                  </Text>
                  <Text style={[styles.welcomeSubtitle, { fontFamily: FONT_BODY[fontKey], textAlign: isRTL ? 'right' : 'left' }]}>
                    {isRTL ? 'اكتشف المطاعم والمقاهي والمزيد حولك' : 'Discover restaurants, cafes & more around you'}
                  </Text>
                </View>
              </View>

              {/* Search Bar Style Button */}
              <TouchableOpacity
                style={[styles.searchButton, isRTL && { flexDirection: 'row-reverse' }]}
                activeOpacity={0.9}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push('/(tabs)/search');
                }}
              >
                <Ionicons name="search" size={18} color="#64748b" />
                <Text style={[styles.searchPlaceholder, { fontFamily: FONT_BODY[fontKey], textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'ابحث عن مطعم، مقهى...' : 'Search restaurants, cafes...'}
                </Text>
                <View style={styles.searchArrow}>
                  <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={14} color="#fff" />
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </MotiView>
        </MotiView>

        {/* Categories */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
        >
          <Text style={[styles.sectionTitle, { color: textColor, fontFamily: FONT_TITLE[fontKey], textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'الفئات' : 'Categories'}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.categoriesScroll, isRTL && { paddingLeft: 8, paddingRight: 20 }]}
          >
            {CATEGORIES.map((category, idx) => (
              <CategoryChip
                key={category.id}
                category={category}
                selected={selectedCategory?.id === category.id}
                onPress={handleCategoryPress}
                index={idx}
              />
            ))}
          </ScrollView>
        </MotiView>

        {/* Featured Businesses */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
        >
          <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
            <Text style={[styles.sectionTitle, { color: textColor, fontFamily: FONT_TITLE[fontKey] }]}>
              {isRTL ? 'مميز' : 'Featured'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Text style={[styles.seeAll, { color: '#2563eb', fontFamily: FONT_BODY[fontKey] }]}>
                {isRTL ? 'عرض الكل' : 'See All'}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.businessesScroll, isRTL && { paddingLeft: 8, paddingRight: 20 }]}
          >
            {FEATURED_BUSINESSES.map((business, idx) => (
              <BusinessCard key={business.id} business={business} index={idx} horizontal />
            ))}
          </ScrollView>
        </MotiView>

        {/* Nearby Businesses */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
        >
          <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
            <Text style={[styles.sectionTitle, { color: textColor, fontFamily: FONT_TITLE[fontKey] }]}>
              {isRTL ? 'قريب منك' : 'Nearby'}
            </Text>
          </View>
          {NEARBY_BUSINESSES.map((business, idx) => (
            <BusinessCard key={business.id} business={business} index={idx} />
          ))}
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContentRTL: {
    flexDirection: 'row-reverse',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userSectionRTL: {
    flexDirection: 'row-reverse',
  },
  avatarSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarSmallText: {
    fontSize: 20,
    color: '#ffffff',
  },
  greetingSection: {
    gap: 2,
  },
  greetingSmall: {
    fontSize: 13,
  },
  userName: {
    fontSize: 18,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerActionsRTL: {
    flexDirection: 'row-reverse',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: '#ffffff',
  },
  welcomeCard: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  welcomeDecor: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  welcomeDecor1: {
    width: 150,
    height: 150,
    top: -50,
    right: -30,
  },
  welcomeDecor2: {
    width: 100,
    height: 100,
    bottom: -40,
    left: -30,
  },
  welcomeDecor3: {
    width: 60,
    height: 60,
    top: 60,
    right: 60,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  brandIconContainer: {
    marginRight: 14,
  },
  brandIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTextSection: {
    flex: 1,
  },
  brandHeader: {
    marginBottom: 4,
  },
  brandName: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 0.5,
  },
  brandPlus: {
    color: '#fbbf24',
  },
  welcomeTitle: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: '#94a3b8',
  },
  searchArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  seeAll: {
    fontSize: 14,
  },
  categoriesScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  businessesScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingBottom: 20,
    flexDirection: 'row',
  },
});
