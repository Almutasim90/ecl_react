import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../context/I18nContext';

const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
const FONT_MEDIUM = { en: 'Inter_500Medium', ar: 'Cairo_600SemiBold' };

export default function BusinessCard({ business, index = 0, horizontal = false }) {
  const router = useRouter();
  const { isDark } = useTheme();
  const { isRTL } = useI18n();
  const fontKey = isRTL ? 'ar' : 'en';

  const cardBg = isDark ? 'rgba(30,41,59,0.95)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/business/${business.id}`);
  };

  const containerStyle = horizontal ? styles.horizontalContainer : styles.verticalContainer;
  const cardStyle = styles.card;
  const imageStyle = horizontal ? styles.imageHorizontal : styles.imageVertical;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: index * 50 }}
      style={horizontal ? styles.horizontalWrapper : styles.verticalWrapper}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={[containerStyle, cardStyle, { backgroundColor: cardBg, borderColor }]}
      >
        {/* Image */}
        <View style={imageStyle}>
          <Image
            source={{ uri: business.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {business.featured && (
            <View style={[styles.featuredBadge, isRTL && { left: undefined, right: 12 }]}>
              <Ionicons name="star" size={12} color="#ffffff" />
              <Text style={[styles.featuredText, { fontFamily: FONT_MEDIUM[fontKey] }]}>
                {isRTL ? 'مميز' : 'Featured'}
              </Text>
            </View>
          )}
          {business.verified && (
            <View style={[styles.verifiedBadge, isRTL && { right: undefined, left: 12 }]}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Category */}
          <Text
            style={[
              styles.title,
              { color: textColor, fontFamily: FONT_TITLE[fontKey] },
              isRTL && styles.textRTL,
            ]}
            numberOfLines={1}
          >
            {isRTL ? business.nameAr : business.name}
          </Text>

          <Text
            style={[
              styles.category,
              { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
              isRTL && styles.textRTL,
            ]}
            numberOfLines={1}
          >
            {isRTL ? business.categoryAr : business.category}
          </Text>

          {/* Rating & Distance */}
          <View style={[styles.meta, isRTL && styles.metaRTL]}>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text
                style={[
                  styles.ratingText,
                  { color: textColor, fontFamily: FONT_MEDIUM[fontKey] },
                ]}
              >
                {business.rating}
              </Text>
              <Text
                style={[
                  styles.reviewCount,
                  { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
                ]}
              >
                ({business.reviewCount})
              </Text>
            </View>

            <View style={styles.distance}>
              <Ionicons name="location" size={14} color="#2563eb" />
              <Text
                style={[
                  styles.distanceText,
                  { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
                ]}
              >
                {business.distance}
              </Text>
            </View>
          </View>

          {/* Status */}
          <View style={[styles.status, isRTL && styles.statusRTL]}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: business.isOpen ? '#10b981' : '#ef4444' },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: business.isOpen ? '#10b981' : '#ef4444', fontFamily: FONT_MEDIUM[fontKey] },
              ]}
            >
              {business.isOpen
                ? isRTL
                  ? 'مفتوح الآن'
                  : 'Open Now'
                : isRTL
                ? 'مغلق'
                : 'Closed'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  horizontalWrapper: {
    marginRight: 16,
  },
  verticalWrapper: {
    width: '100%',
  },
  horizontalContainer: {
    width: 300,
  },
  verticalContainer: {
    marginBottom: 16,
    marginHorizontal: 24,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageVertical: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  imageHorizontal: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredText: {
    color: '#ffffff',
    fontSize: 11,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    padding: 18,
  },
  title: {
    fontSize: 19,
    marginBottom: 6,
  },
  category: {
    fontSize: 15,
    marginBottom: 14,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaRTL: {
    flexDirection: 'row-reverse',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
  },
  reviewCount: {
    fontSize: 12,
  },
  distance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusRTL: {
    flexDirection: 'row-reverse',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
