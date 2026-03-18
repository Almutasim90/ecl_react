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

const FONT_TITLE  = { en: 'Inter_600SemiBold',  ar: 'Cairo_600SemiBold' };
const FONT_BODY   = { en: 'Inter_400Regular',   ar: 'Cairo_400Regular' };
const FONT_MEDIUM = { en: 'Inter_500Medium',    ar: 'Cairo_600SemiBold' };

export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const isRTL = false;
  const fontKey = 'en';
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const faqs = [
    {
      question: { en: 'How do I start an English quiz?', ar: 'كيف أبدأ اختباراً إنجليزياً؟' },
      answer: {
        en: 'Navigate to the Quiz tab from the bottom navigation bar. Choose from Reading, Listening, or other quiz types to begin practicing your English skills.',
        ar: 'انتقل إلى علامة التبويب الاختبار من شريط التنقل السفلي. اختر من أنواع الاختبارات المختلفة لبدء تدريب مهاراتك الإنجليزية.',
      },
    },
    {
      question: { en: 'How do I track my learning progress?', ar: 'كيف أتتبع تقدمي في التعلم؟' },
      answer: {
        en: 'Your progress is automatically saved. Check your profile to view completed quizzes, scores, and learning statistics.',
        ar: 'يتم حفظ تقدمك تلقائيًا. تحقق من ملفك الشخصي لعرض الاختبارات المكتملة والدرجات والإحصائيات.',
      },
    },
    {
      question: { en: 'What types of English quizzes are available?', ar: 'ما أنواع الاختبارات الإنجليزية المتاحة؟' },
      answer: {
        en: 'ECL offers Reading comprehension, Listening exercises, Grammar tests, and Vocabulary quizzes to help you improve all aspects of English.',
        ar: 'تقدم ECL مهام فهم القراءة، وتمارين الاستماع، واختبارات القواعد، واختبارات المفردات لمساعدتك على تحسين جميع جوانب اللغة الإنجليزية.',
      },
    },
    {
      question: { en: 'How do I change the app language?', ar: 'كيف أغير لغة التطبيق؟' },
      answer: {
        en: 'Go to Settings > Language and select your preferred language (English or Arabic).',
        ar: 'انتقل إلى الإعدادات > اللغة واختر لغتك المفضلة (الإنجليزية أو العربية).',
      },
    },
    {
      question: { en: 'How do I enable dark mode?', ar: 'كيف أفعّل الوضع الداكن؟' },
      answer: {
        en: 'Go to Settings and toggle the Dark Mode switch to enable or disable dark theme.',
        ar: 'انتقل إلى الإعدادات وقم بتفعيل خيار الوضع الداكن أو إلغائه.',
      },
    },
  ];

  const contactOptions = [
    {
      icon: 'mail',
      title: { en: 'Email Us', ar: 'راسلنا' },
      subtitle: { en: 'support@ecl-learn.com', ar: 'support@ecl-learn.com' },
      action: () => Linking.openURL('mailto:support@ecl-learn.com'),
    },
    {
      icon: 'logo-whatsapp',
      title: { en: 'WhatsApp', ar: 'واتساب' },
      subtitle: { en: '+1 234 567 890', ar: '+1 234 567 890' },
      action: () => Linking.openURL('whatsapp://send?phone=1234567890'),
    },
    {
      icon: 'call',
      title: { en: 'Call Us', ar: 'اتصل بنا' },
      subtitle: { en: '+1 234 567 890', ar: '+1 234 567 890' },
      action: () => Linking.openURL('tel:+1234567890'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
          <Ionicons
            name={isRTL ? 'chevron-forward' : 'chevron-back'}
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: FONT_TITLE[fontKey] }]}>
          {isRTL ? 'المساعدة والدعم' : 'Help & Support'}
        </Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
      >
        {/* Hero */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={[styles.heroSection, { backgroundColor: colors.accent }]}
        >
          <View style={[styles.heroIcon, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="help-buoy" size={40} color="#ffffff" />
          </View>
          <Text style={[styles.heroTitle, { fontFamily: FONT_TITLE[fontKey] }]}>
            {isRTL ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
          </Text>
          <Text style={[styles.heroSubtitle, { fontFamily: FONT_BODY[fontKey] }]}>
            {isRTL ? 'نحن هنا لمساعدتك على مدار الساعة طوال أيام الأسبوع' : 'We are here to help you 24/7'}
          </Text>
        </MotiView>

        {/* FAQ */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: FONT_TITLE[fontKey] }, isRTL && styles.textRTL]}>
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
              style={[styles.faqItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={[styles.faqHeader, isRTL && styles.faqHeaderRTL]}>
                <Text style={[
                  styles.faqQuestion,
                  { color: colors.text, fontFamily: FONT_MEDIUM[fontKey], marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 },
                  isRTL && styles.textRTL,
                ]}>
                  {faq.question[isRTL ? 'ar' : 'en']}
                </Text>
                <Ionicons
                  name={expandedFaq === idx ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textSecondary}
                />
              </View>
              {expandedFaq === idx && (
                <MotiView
                  from={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ type: 'timing', duration: 200 }}
                >
                  <Text style={[
                    styles.faqAnswer,
                    { color: colors.textSecondary, fontFamily: FONT_BODY[fontKey], borderTopColor: colors.border },
                    isRTL && styles.textRTL,
                  ]}>
                    {faq.answer[isRTL ? 'ar' : 'en']}
                  </Text>
                </MotiView>
              )}
            </TouchableOpacity>
          ))}
        </MotiView>

        {/* Contact */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: FONT_TITLE[fontKey] }, isRTL && styles.textRTL]}>
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
              style={[styles.contactItem, { backgroundColor: colors.surface, borderColor: colors.border }, isRTL && styles.contactItemRTL]}
            >
              <View style={[styles.contactIcon, { backgroundColor: colors.accentIcon }]}>
                <Ionicons name={option.icon} size={24} color={colors.accent} />
              </View>
              <View style={[styles.contactInfo, isRTL && styles.contactInfoRTL]}>
                <Text style={[styles.contactTitle, { color: colors.text, fontFamily: FONT_MEDIUM[fontKey] }, isRTL && styles.textRTL]}>
                  {option.title[isRTL ? 'ar' : 'en']}
                </Text>
                <Text style={[styles.contactSubtitle, { color: colors.textSecondary, fontFamily: FONT_BODY[fontKey] }]}>
                  {option.subtitle[isRTL ? 'ar' : 'en']}
                </Text>
              </View>
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  headerRTL: { flexDirection: 'row-reverse' },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20 },
  headerPlaceholder: { width: 44 },
  scrollContent: { paddingHorizontal: 16 },

  heroSection: { borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24 },
  heroIcon: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  heroTitle: { fontSize: 22, color: '#ffffff', marginBottom: 8, textAlign: 'center' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, marginBottom: 16 },

  faqItem: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12 },
  faqHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  faqHeaderRTL: { flexDirection: 'row-reverse' },
  faqQuestion: { fontSize: 15, flex: 1 },
  faqAnswer: {
    fontSize: 14, lineHeight: 22, marginTop: 12,
    paddingTop: 12, borderTopWidth: 1,
  },

  contactItem: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12,
  },
  contactItemRTL: { flexDirection: 'row-reverse' },
  contactIcon: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  contactInfo: { flex: 1, marginLeft: 14 },
  contactInfoRTL: { marginLeft: 0, marginRight: 14, alignItems: 'flex-end' },
  contactTitle: { fontSize: 16, marginBottom: 2 },
  contactSubtitle: { fontSize: 14 },

  textRTL: { textAlign: 'right', writingDirection: 'rtl' },
});
