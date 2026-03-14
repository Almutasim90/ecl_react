import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { searchBusinesses, CATEGORIES, FEATURED_BUSINESSES, NEARBY_BUSINESSES } from '../../data/mockData';

const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
const FONT_BOLD = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();
  const { isRTL } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fontKey = isRTL ? 'ar' : 'en';

  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? 'rgba(30,41,59,0.95)' : '#ffffff';
  const inputBg = isDark ? 'rgba(30,41,59,0.8)' : '#f1f5f9';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';

  // Get all businesses
  const allBusinesses = [...FEATURED_BUSINESSES, ...NEARBY_BUSINESSES];

  // Filter based on search and category
  const getFilteredResults = () => {
    let results = allBusinesses;
    
    if (searchQuery.length > 0) {
      results = searchBusinesses(searchQuery);
    }
    
    if (selectedCategory) {
      results = results.filter(item => item.category === selectedCategory.name);
    }
    
    return results;
  };

  const filteredResults = getFilteredResults();
  const showResults = searchQuery.length > 0 || selectedCategory;

  const handleCategorySelect = (category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(selectedCategory?.id === category.id ? null : category);
  };

  const handleBusinessPress = (business) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/business/${business.id}`);
  };

  const clearFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top }]}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={[styles.searchInputContainer, { backgroundColor: inputBg, borderColor }, isRTL && { flexDirection: 'row-reverse' }]}
        >
          <Ionicons name="search" size={20} color={subtextColor} style={{ marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }} />
          <TextInput
            style={[styles.searchInput, { color: textColor, fontFamily: FONT_BODY[fontKey], textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={isRTL ? 'ابحث عن مكان...' : 'Search for a place...'}
            placeholderTextColor={subtextColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={subtextColor} />
            </TouchableOpacity>
          )}
        </MotiView>
      </View>

      {/* Category Chips */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory?.id === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                activeOpacity={0.7}
                onPress={() => handleCategorySelect(category)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? category.color : isDark ? '#1e293b' : '#f1f5f9',
                    borderColor: isSelected ? category.color : borderColor,
                  },
                ]}
              >
                <Ionicons
                  name={category.icon}
                  size={16}
                  color={isSelected ? '#ffffff' : category.color}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    {
                      color: isSelected ? '#ffffff' : textColor,
                      fontFamily: FONT_BODY[fontKey],
                    },
                  ]}
                >
                  {isRTL ? category.nameAr : category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Results or Empty State */}
        {!showResults ? (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            style={styles.emptyState}
          >
            <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <Ionicons name="search" size={48} color={subtextColor} />
            </View>
            <Text style={[styles.emptyTitle, { color: textColor, fontFamily: FONT_TITLE[fontKey] }]}>
              {isRTL ? 'ابحث عن أماكن' : 'Search for Places'}
            </Text>
            <Text style={[styles.emptyDesc, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }]}>
              {isRTL ? 'ابحث باسم المكان أو اختر فئة' : 'Search by name or select a category'}
            </Text>
          </MotiView>
        ) : filteredResults.length === 0 ? (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 400 }}
            style={styles.emptyState}
          >
            <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
              <Ionicons name="alert-circle" size={48} color={subtextColor} />
            </View>
            <Text style={[styles.emptyTitle, { color: textColor, fontFamily: FONT_TITLE[fontKey] }]}>
              {isRTL ? 'لا توجد نتائج' : 'No Results Found'}
            </Text>
            <Text style={[styles.emptyDesc, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }]}>
              {isRTL ? 'جرب البحث عن شيء آخر' : 'Try searching for something else'}
            </Text>
            <TouchableOpacity onPress={clearFilters} style={styles.clearBtn}>
              <Text style={[styles.clearBtnText, { fontFamily: FONT_BOLD[fontKey] }]}>
                {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
              </Text>
            </TouchableOpacity>
          </MotiView>
        ) : (
          <View>
            <View style={[styles.resultsHeader, isRTL && styles.resultsHeaderRTL]}>
              <Text style={[styles.resultsTitle, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }]}>
                {isRTL ? `${filteredResults.length} نتيجة` : `${filteredResults.length} Results`}
              </Text>
              {(searchQuery || selectedCategory) && (
                <TouchableOpacity onPress={clearFilters}>
                  <Text style={[styles.clearText, { color: '#2563eb', fontFamily: FONT_BODY[fontKey] }]}>
                    {isRTL ? 'مسح' : 'Clear'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {filteredResults.map((item, idx) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300, delay: idx * 40 }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleBusinessPress(item)}
                  style={[styles.resultCard, { backgroundColor: cardBg, borderColor }, isRTL && { flexDirection: 'row-reverse' }]}
                >
                  <Image source={{ uri: item.image }} style={styles.resultImage} />
                  <View style={[styles.resultContent, isRTL && { marginLeft: 0, marginRight: 14 }]}>
                    <Text
                      style={[
                        styles.resultName,
                        { color: textColor, fontFamily: FONT_BOLD[fontKey] },
                        isRTL && styles.textRTL,
                      ]}
                      numberOfLines={1}
                    >
                      {isRTL ? item.nameAr : item.name}
                    </Text>
                    <Text
                      style={[
                        styles.resultCategory,
                        { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
                        isRTL && styles.textRTL,
                      ]}
                    >
                      {isRTL ? item.categoryAr : item.category}
                    </Text>
                    <View style={[styles.resultMeta, isRTL && styles.resultMetaRTL]}>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#fbbf24" />
                        <Text style={[styles.ratingText, { color: textColor, fontFamily: FONT_BOLD[fontKey] }]}>
                          {item.rating}
                        </Text>
                      </View>
                      <View style={styles.distanceContainer}>
                        <Ionicons name="location" size={14} color="#2563eb" />
                        <Text style={[styles.distanceText, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }]}>
                          {item.distance}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: item.isOpen ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: item.isOpen ? '#10b981' : '#ef4444' },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: item.isOpen ? '#10b981' : '#ef4444', fontFamily: FONT_BODY[fontKey] },
                          ]}
                        >
                          {item.isOpen ? (isRTL ? 'مفتوح' : 'Open') : (isRTL ? 'مغلق' : 'Closed')}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons
                    name={isRTL ? 'chevron-back' : 'chevron-forward'}
                    size={20}
                    color={subtextColor}
                  />
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 2,
  },
  categoriesContainer: {
    paddingBottom: 8,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    textAlign: 'center',
  },
  clearBtn: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2563eb',
    borderRadius: 12,
  },
  clearBtnText: {
    color: '#ffffff',
    fontSize: 15,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  resultsHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  resultsTitle: {
    fontSize: 14,
  },
  clearText: {
    fontSize: 14,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  resultImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  resultContent: {
    flex: 1,
    marginLeft: 14,
  },
  resultName: {
    fontSize: 16,
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 13,
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultMetaRTL: {
    flexDirection: 'row-reverse',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
