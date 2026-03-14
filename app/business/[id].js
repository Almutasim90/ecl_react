import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Share,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { useFavorites } from '../../context/FavoritesContext';
import { getBusinessById, REVIEWS, BUSINESS_HOURS } from '../../data/mockData';
import BusinessMap from '../../components/BusinessMap';

const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
const FONT_MEDIUM = { en: 'Inter_500Medium', ar: 'Cairo_600SemiBold' };

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { isRTL } = useI18n();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fontKey = isRTL ? 'ar' : 'en';

  const business = getBusinessById(id);
  const businessReviews = REVIEWS.filter((r) => r.businessId === id);
  const saved = isFavorite(id);

  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? 'rgba(30,41,59,0.95)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#1e293b' : '#e2e8f0';

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(id);
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `Check out ${business.name} on Daleel+!`,
        title: business.name,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (business.contact?.phone) {
      Linking.openURL(`tel:${business.contact.phone}`);
    }
  };

  const handleWhatsApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (business.contact?.whatsapp) {
      const url = `whatsapp://send?phone=${business.contact.whatsapp.replace(/\D/g, '')}`;
      Linking.openURL(url);
    }
  };

  const handleInstagram = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (business.contact?.instagram) {
      const username = business.contact.instagram.replace('@', '');
      Linking.openURL(`https://instagram.com/${username}`);
    }
  };

  const handleWebsite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (business.contact?.website) {
      const url = business.contact.website.startsWith('http')
        ? business.contact.website
        : `https://${business.contact.website}`;
      Linking.openURL(url);
    }
  };

  if (!business) {
    return (
      <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: textColor, fontFamily: FONT_TITLE[fontKey] }]}>
            {isRTL ? 'لم يتم العثور على المكان' : 'Business not found'}
          </Text>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: '#2563eb', fontFamily: FONT_MEDIUM[fontKey] }]}>
              {isRTL ? 'رجوع' : 'Go Back'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const getDayName = (day) => {
    const days = {
      en: {
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday',
      },
      ar: {
        monday: 'الاثنين',
        tuesday: 'الثلاثاء',
        wednesday: 'الأربعاء',
        thursday: 'الخميس',
        friday: 'الجمعة',
        saturday: 'السبت',
        sunday: 'الأحد',
      },
    };
    return days[fontKey][day];
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: business.image }} style={styles.heroImage} />
          <View style={[styles.heroOverlay, { paddingTop: insets.top }]}>
            <View style={[styles.heroHeader, isRTL && styles.heroHeaderRTL]}>
              <TouchableOpacity
                onPress={handleBack}
                style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
              >
                <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={24} color="#ffffff" />
              </TouchableOpacity>
              <View style={[styles.heroActions, isRTL && styles.heroActionsRTL]}>
                <TouchableOpacity
                  onPress={handleShare}
                  style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
                >
                  <Ionicons name="share-outline" size={22} color="#ffffff" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleFavorite}
                  style={[styles.iconButton, { backgroundColor: 'rgba(0,0,0,0.4)' }]}
                >
                  <Ionicons
                    name={saved ? 'heart' : 'heart-outline'}
                    size={22}
                    color={saved ? '#ef4444' : '#ffffff'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {business.featured && (
            <View style={[styles.featuredBadge, isRTL && { left: undefined, right: 16 }]}>
              <Ionicons name="star" size={12} color="#ffffff" />
              <Text style={[styles.featuredText, { fontFamily: FONT_MEDIUM[fontKey] }]}>
                {isRTL ? 'مميز' : 'Featured'}
              </Text>
            </View>
          )}
        </View>

        {/* Content */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={[styles.content, { backgroundColor: bgColor }]}
        >
          {/* Title & Category */}
          <View style={[styles.titleRow, isRTL && styles.titleRowRTL]}>
            <View style={styles.titleWrap}>
              <Text
                style={[
                  styles.businessName,
                  { color: textColor, fontFamily: FONT_TITLE[fontKey] },
                  isRTL && styles.textRTL,
                ]}
              >
                {isRTL ? business.nameAr : business.name}
              </Text>
              <Text
                style={[
                  styles.businessCategory,
                  { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
                  isRTL && styles.textRTL,
                ]}
              >
                {isRTL ? business.categoryAr : business.category}
              </Text>
            </View>
            {business.verified && (
              <View style={[styles.verifiedBadge, isRTL && { marginLeft: 0, marginRight: 12 }]}>
                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              </View>
            )}
          </View>

          {/* Rating & Status */}
          <View style={[styles.metaRow, isRTL && styles.metaRowRTL]}>
            <View style={styles.rating}>
              <Ionicons name="star" size={18} color="#fbbf24" />
              <Text style={[styles.ratingText, { color: textColor, fontFamily: FONT_MEDIUM[fontKey] }]}>
                {business.rating}
              </Text>
              <Text style={[styles.reviewCount, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }]}>
                ({business.reviewCount} {isRTL ? 'تقييم' : 'reviews'})
              </Text>
            </View>
            <View style={styles.status}>
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

          {/* Address */}
          <View style={[styles.infoRow, { borderColor }, isRTL && styles.infoRowRTL]}>
            <Ionicons name="location" size={20} color="#2563eb" />
            <View style={styles.infoContent}>
              <Text
                style={[
                  styles.infoText,
                  { color: textColor, fontFamily: FONT_BODY[fontKey] },
                  isRTL && styles.textRTL,
                ]}
              >
                {isRTL ? business.addressAr : business.address}
              </Text>
              <Text
                style={[
                  styles.infoSubtext,
                  { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
                  isRTL && styles.textRTL,
                ]}
              >
                {business.distance} {isRTL ? 'من موقعك' : 'from your location'}
              </Text>
            </View>
          </View>

          {/* Contact Buttons */}
          <View style={styles.contactButtons}>
            {business.contact?.phone && (
              <TouchableOpacity
                onPress={handleCall}
                style={[styles.contactBtn, { backgroundColor: '#2563eb' }]}
              >
                <Ionicons name="call" size={20} color="#ffffff" />
                <Text style={[styles.contactBtnText, { fontFamily: FONT_MEDIUM[fontKey] }]}>
                  {isRTL ? 'اتصال' : 'Call'}
                </Text>
              </TouchableOpacity>
            )}
            {business.contact?.whatsapp && (
              <TouchableOpacity
                onPress={handleWhatsApp}
                style={[styles.contactBtn, { backgroundColor: '#25d366' }]}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#ffffff" />
                <Text style={[styles.contactBtnText, { fontFamily: FONT_MEDIUM[fontKey] }]}>
                  WhatsApp
                </Text>
              </TouchableOpacity>
            )}
            {business.contact?.instagram && (
              <TouchableOpacity
                onPress={handleInstagram}
                style={[styles.contactBtn, { backgroundColor: '#e4405f' }]}
              >
                <Ionicons name="logo-instagram" size={20} color="#ffffff" />
              </TouchableOpacity>
            )}
            {business.contact?.website && (
              <TouchableOpacity
                onPress={handleWebsite}
                style={[styles.contactBtn, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}
              >
                <Ionicons name="globe" size={20} color={isDark ? '#f1f5f9' : '#0f172a'} />
              </TouchableOpacity>
            )}
          </View>

          {/* Location Map */}
          {business.coordinates && (
            <BusinessMap
              business={business}
              isDark={isDark}
              isRTL={isRTL}
              fontKey={fontKey}
              textColor={textColor}
              subtextColor={subtextColor}
              cardBg={cardBg}
              borderColor={borderColor}
            />
          )}

          {/* Business Hours */}
          <View style={[styles.section, { borderColor }]}>
            <Text
              style={[
                styles.sectionTitle,
                { color: textColor, fontFamily: FONT_TITLE[fontKey] },
                isRTL && styles.textRTL,
              ]}
            >
              {isRTL ? 'ساعات العمل' : 'Business Hours'}
            </Text>
            <View style={[styles.hoursContainer, { backgroundColor: cardBg, borderColor }]}>
              {Object.entries(BUSINESS_HOURS).map(([day, hours]) => (
                <View key={day} style={[styles.hourRow, isRTL && styles.hourRowRTL]}>
                  <Text
                    style={[
                      styles.dayName,
                      { color: textColor, fontFamily: FONT_MEDIUM[fontKey], textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {getDayName(day)}
                  </Text>
                  <Text
                    style={[
                      styles.hourTime,
                      { color: hours.closed ? '#ef4444' : subtextColor, fontFamily: FONT_BODY[fontKey], textAlign: isRTL ? 'right' : 'left' },
                    ]}
                  >
                    {hours.closed ? (isRTL ? 'مغلق' : 'Closed') : `${hours.open} - ${hours.close}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reviews */}
          <View style={[styles.section, { borderColor }]}>
            <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: textColor, fontFamily: FONT_TITLE[fontKey] },
                  isRTL && styles.textRTL,
                ]}
              >
                {isRTL ? 'التقييمات' : 'Reviews'}
              </Text>
              <Text style={[styles.reviewsCount, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }]}>
                ({business.reviewCount})
              </Text>
            </View>

            {businessReviews.length > 0 ? (
              businessReviews.map((review, idx) => (
                <MotiView
                  key={review.id}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 300, delay: idx * 50 }}
                  style={[styles.reviewCard, { backgroundColor: cardBg, borderColor }]}
                >
                  <View style={[styles.reviewHeader, isRTL && styles.reviewHeaderRTL]}>
                    <View style={styles.reviewerAvatar}>
                      <Text style={[styles.reviewerInitial, { fontFamily: FONT_MEDIUM[fontKey] }]}>
                        {review.userName.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.reviewerInfo}>
                      <Text
                        style={[
                          styles.reviewerName,
                          { color: textColor, fontFamily: FONT_MEDIUM[fontKey] },
                        ]}
                      >
                        {review.userName}
                      </Text>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < review.rating ? 'star' : 'star-outline'}
                            size={14}
                            color="#fbbf24"
                          />
                        ))}
                        <Text
                          style={[
                            styles.reviewDate,
                            { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
                            isRTL && { marginLeft: 0, marginRight: 8 },
                          ]}
                        >
                          {review.date}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.reviewComment,
                      { color: textColor, fontFamily: FONT_BODY[fontKey] },
                      isRTL && styles.textRTL,
                    ]}
                  >
                    {isRTL ? review.commentAr : review.comment}
                  </Text>
                  <View style={[styles.reviewFooter, isRTL && styles.reviewFooterRTL]}>
                    <TouchableOpacity style={styles.helpfulBtn}>
                      <Ionicons name="thumbs-up-outline" size={16} color={subtextColor} />
                      <Text
                        style={[styles.helpfulText, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }]}
                      >
                        {isRTL ? `مفيد (${review.helpful})` : `Helpful (${review.helpful})`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </MotiView>
              ))
            ) : (
              <View style={[styles.noReviews, { backgroundColor: cardBg, borderColor }]}>
                <Ionicons name="chatbubble-outline" size={32} color={subtextColor} />
                <Text
                  style={[
                    styles.noReviewsText,
                    { color: subtextColor, fontFamily: FONT_BODY[fontKey] },
                  ]}
                >
                  {isRTL ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.writeReviewBtn, { borderColor: '#2563eb' }, isRTL && { flexDirection: 'row-reverse' }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Ionicons name="create-outline" size={20} color="#2563eb" />
              <Text style={[styles.writeReviewText, { color: '#2563eb', fontFamily: FONT_MEDIUM[fontKey] }]}>
                {isRTL ? 'اكتب تقييم' : 'Write a Review'}
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 16,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
  },
  heroActionsRTL: {
    flexDirection: 'row-reverse',
  },
  featuredBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  featuredText: {
    color: '#ffffff',
    fontSize: 13,
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleRowRTL: {
    flexDirection: 'row-reverse',
  },
  titleWrap: {
    flex: 1,
  },
  businessName: {
    fontSize: 26,
    marginBottom: 4,
  },
  businessCategory: {
    fontSize: 15,
  },
  verifiedBadge: {
    marginLeft: 12,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaRowRTL: {
    flexDirection: 'row-reverse',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
  },
  reviewCount: {
    fontSize: 14,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    gap: 12,
  },
  infoRowRTL: {
    flexDirection: 'row-reverse',
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 13,
  },
  contactButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
    marginBottom: 8,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactBtnText: {
    color: '#ffffff',
    fontSize: 15,
  },
  section: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  reviewsCount: {
    fontSize: 15,
    marginBottom: 16,
  },
  hoursContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  hourRowRTL: {
    flexDirection: 'row-reverse',
  },
  dayName: {
    fontSize: 14,
  },
  hourTime: {
    fontSize: 14,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  reviewHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  reviewerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewerInitial: {
    color: '#ffffff',
    fontSize: 18,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 15,
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  reviewDate: {
    fontSize: 12,
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
  },
  reviewFooterRTL: {
    flexDirection: 'row-reverse',
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  helpfulText: {
    fontSize: 13,
  },
  noReviews: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  noReviewsText: {
    marginTop: 8,
    fontSize: 14,
  },
  writeReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    gap: 8,
    marginTop: 8,
  },
  writeReviewText: {
    fontSize: 15,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
