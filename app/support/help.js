import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';


const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
const FONT_MEDIUM = { en: 'Inter_500Medium', ar: 'Cairo_600SemiBold' };

export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  
  const isRTL = false;
  const fontKey = 'en';
  const [expandedFaq, setExpandedFaq] = useState(null);

  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? 'rgba(30,41,59,0.95)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const faqs = [
    {
      question: {
        en: 'How do I search for businesses?',
        ar: 'كيف أبحث عن الأعمال التجارية؟',
      },
      answer: {
        en: 'Use the search tab at the bottom of the screen. You can search by business name, category, or location. Use filters to narrow down your results.',
        ar: 'استخدم علامة تبويب البحث في أسفل الشاشة. يمكنك البحث باسم النشاط التجاري أو الفئة أو الموقع. استخدم الفلاتر لتضييق نتائج البحث.',
      },
    },
    {
      question: {
        en: 'How do I save my favorite places?',
        ar: 'كيف أحفظ أماكني المفضلة؟',
      },
      answer: {
        en: 'Tap the heart icon on any business card or detail page to save it to your favorites. Access your saved places from your profile.',
        ar: 'اضغط على أيقونة القلب في أي بطاقة عمل أو صفحة تفاصيل لحفظها في المفضلة. يمكنك الوصول إلى الأماكن المحفوظة من ملفك الشخصي.',
      },
    },
    {
      question: {
        en: 'How do I contact a business?',
        ar: 'كيف أتواصل مع نشاط تجاري؟',
      },
      answer: {
        en: 'Open the business detail page and use the contact buttons: Call, WhatsApp, Instagram, or Website. You can also get directions to visit in person.',
        ar: 'افتح صفحة تفاصيل النشاط التجاري واستخدم أزرار التواصل: اتصال، واتساب، انستقرام، أو الموقع الإلكتروني. يمكنك أيضًا الحصول على الاتجاهات للزيارة شخصيًا.',
      },
    },
    {
      question: {
        en: 'How do I change the app language?',
        ar: 'كيف أغير لغة التطبيق؟',
      },
      answer: {
        en: 'Go to Profile > Settings > Language and select your preferred language (English or Arabic).',
        ar: 'انتقل إلى الملف الشخصي > الإعدادات > اللغة واختر لغتك المفضلة (الإنجليزية أو العربية).',
      },
    },
    {
      question: {
        en: 'How do I write a review?',
        ar: 'كيف أكتب تقييمًا؟',
      },
      answer: {
        en: 'Open any business detail page and scroll to the Reviews section. Tap "Write a Review" to share your experience.',
        ar: 'افتح أي صفحة تفاصيل نشاط تجاري وانتقل إلى قسم التقييمات. اضغط على "اكتب تقييم" لمشاركة تجربتك.',
      },
    },
  ];

  const contactOptions = [
    {
      icon: 'mail',
      title: { en: 'Email Us', ar: 'راسلنا' },
      subtitle: { en: 'support@daleelplus.ae', ar: 'support@daleelplus.ae' },
      action: () => Linking.openURL('mailto:support@daleelplus.ae'),
    },
    {
      icon: 'logo-whatsapp',
      title: { en: 'WhatsApp', ar: 'واتساب' },
      subtitle: { en: '+971 50 123 4567', ar: '+971 50 123 4567' },
      action: () => Linking.openURL('whatsapp://send?phone=971501234567'),
    },
    {
      icon: 'call',
      title: { en: 'Call Us', ar: 'اتصل بنا' },
      subtitle: { en: '+971 4 123 4567', ar: '+971 4 123 4567' },
      action: () => Linking.openURL('tel:+97141234567'),
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
        <Text style={[styles.headerTitle, { color: textColor, fontFamily: FONT_TITLE[fontKey] }]}>
          {isRTL ? 'المساعدة والدعم' : 'Help & Support'}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={[styles.heroSection, { backgroundColor: '#2563eb' }]}
        >
          <View style={styles.heroIcon}>
            <Ionicons name="help-buoy" size={40} color="#ffffff" />
          </View>
          <Text style={[styles.heroTitle, { fontFamily: FONT_TITLE[fontKey] }]}>
            {isRTL ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
          </Text>
          <Text style={[styles.heroSubtitle, { fontFamily: FONT_BODY[fontKey] }]}>
            {isRTL 
              ? 'نحن هنا لمساعدتك على مدار الساعة طوال أيام الأسبوع'
              : 'We are here to help you 24/7'}
          </Text>
        </MotiView>

        {/* FAQ Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: textColor, fontFamily: FONT_TITLE[fontKey] }, isRTL && styles.textRTL]}>
            {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </Text>
          
          {faqs.map((faq, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setExpandedFaq(expandedFaq === idx ? null : idx);
              }}
              style={[styles.faqItem, { backgroundColor: cardBg, borderColor }]}
            >
              <View style={[styles.faqHeader, isRTL && styles.faqHeaderRTL]}>
                <Text style={[styles.faqQuestion, { color: textColor, fontFamily: FONT_MEDIUM[fontKey], marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }, isRTL && styles.textRTL]}>
                  {faq.question[isRTL ? 'ar' : 'en']}
                </Text>
                <Ionicons
                  name={expandedFaq === idx ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={subtextColor}
                />
              </View>
              {expandedFaq === idx && (
                <MotiView
                  from={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ type: 'timing', duration: 200 }}
                >
                  <Text style={[styles.faqAnswer, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }, isRTL && styles.textRTL]}>
                    {faq.answer[isRTL ? 'ar' : 'en']}
                  </Text>
                </MotiView>
              )}
            </TouchableOpacity>
          ))}
        </MotiView>

        {/* Contact Section */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: textColor, fontFamily: FONT_TITLE[fontKey] }, isRTL && styles.textRTL]}>
            {isRTL ? 'تواصل معنا' : 'Contact Us'}
          </Text>
          
          {contactOptions.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                option.action();
              }}
              style={[styles.contactItem, { backgroundColor: cardBg, borderColor }, isRTL && styles.contactItemRTL]}
            >
              <View style={[styles.contactIcon, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}>
                <Ionicons name={option.icon} size={24} color="#2563eb" />
              </View>
              <View style={[styles.contactInfo, isRTL && styles.contactInfoRTL]}>
                <Text style={[styles.contactTitle, { color: textColor, fontFamily: FONT_MEDIUM[fontKey] }, isRTL && styles.textRTL]}>
                  {option.title[isRTL ? 'ar' : 'en']}
                </Text>
                <Text style={[styles.contactSubtitle, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }]}>
                  {option.subtitle[isRTL ? 'ar' : 'en']}
                </Text>
              </View>
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={20}
                color={subtextColor}
              />
            </TouchableOpacity>
          ))}
        </MotiView>
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  heroSection: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  faqItem: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  faqQuestion: {
    fontSize: 15,
    flex: 1,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  contactItemRTL: {
    flexDirection: 'row-reverse',
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 14,
  },
  contactInfoRTL: {
    marginLeft: 0,
    marginRight: 14,
    alignItems: 'flex-end',
  },
  contactTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 14,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
