import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';

export default function TermsScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { isRTL } = useI18n();
  const fontKey = isRTL ? 'ar' : 'en';
  const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
  const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
  const FONT_MEDIUM = { en: 'Inter_500Medium', ar: 'Cairo_600SemiBold' };

  const sections = [
    {
      title: { en: '1. Acceptance of Terms', ar: '1. قبول الشروط' },
      content: {
        en: 'By accessing and using the Daleel+ application, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use this application.',
        ar: 'من خلال الوصول إلى تطبيق دليل+ واستخدامه، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يجب عليك عدم استخدام هذا التطبيق.'
      }
    },
    {
      title: { en: '2. Description of Service', ar: '2. وصف الخدمة' },
      content: {
        en: 'Daleel+ is a premium business directory application that provides users with comprehensive information about local businesses, including contact details, locations, operating hours, and customer reviews. The service is provided "as is" and we reserve the right to modify or discontinue any feature at any time.',
        ar: 'دليل+ هو تطبيق دليل أعمال متميز يوفر للمستخدمين معلومات شاملة حول الشركات المحلية، بما في ذلك تفاصيل الاتصال والمواقع وساعات العمل وتقييمات العملاء. يتم تقديم الخدمة "كما هي" ونحتفظ بالحق في تعديل أو إيقاف أي ميزة في أي وقت.'
      }
    },
    {
      title: { en: '3. User Accounts', ar: '3. حسابات المستخدمين' },
      content: {
        en: 'To access certain features of Daleel+, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account.',
        ar: 'للوصول إلى ميزات معينة في دليل+، قد يُطلب منك إنشاء حساب. أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك وعن جميع الأنشطة التي تحدث تحت حسابك. يجب عليك تقديم معلومات دقيقة وكاملة عند إنشاء حسابك.'
      }
    },
    {
      title: { en: '4. User Conduct', ar: '4. سلوك المستخدم' },
      content: {
        en: 'You agree not to use Daleel+ for any unlawful purpose or in any way that could damage, disable, or impair the service. You may not attempt to gain unauthorized access to any part of the application, or use automated means to access the service without our express permission.',
        ar: 'أنت توافق على عدم استخدام دليل+ لأي غرض غير قانوني أو بأي طريقة قد تضر أو تعطل أو تضعف الخدمة. لا يجوز لك محاولة الحصول على وصول غير مصرح به إلى أي جزء من التطبيق، أو استخدام وسائل آلية للوصول إلى الخدمة دون إذننا الصريح.'
      }
    },
    {
      title: { en: '5. Business Listings', ar: '5. قوائم الأعمال' },
      content: {
        en: 'While we strive to ensure the accuracy of business information displayed in Daleel+, we cannot guarantee that all information is current or error-free. Business owners are responsible for keeping their listing information updated. Users should verify important details directly with businesses.',
        ar: 'بينما نسعى جاهدين لضمان دقة معلومات الأعمال المعروضة في دليل+، لا يمكننا ضمان أن جميع المعلومات حالية أو خالية من الأخطاء. أصحاب الأعمال مسؤولون عن تحديث معلومات قوائمهم. يجب على المستخدمين التحقق من التفاصيل المهمة مباشرة مع الشركات.'
      }
    },
    {
      title: { en: '6. Intellectual Property', ar: '6. الملكية الفكرية' },
      content: {
        en: 'All content, features, and functionality of Daleel+ including but not limited to text, graphics, logos, icons, images, and software are the exclusive property of Daleel+ and are protected by international copyright, trademark, and other intellectual property laws.',
        ar: 'جميع المحتويات والميزات والوظائف الخاصة بدليل+ بما في ذلك على سبيل المثال لا الحصر النصوص والرسومات والشعارات والأيقونات والصور والبرامج هي ملكية حصرية لدليل+ ومحمية بموجب قوانين حقوق النشر والعلامات التجارية والملكية الفكرية الدولية.'
      }
    },
    {
      title: { en: '7. Privacy Policy', ar: '7. سياسة الخصوصية' },
      content: {
        en: 'Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using Daleel+, you consent to the collection and use of your information as described in our Privacy Policy.',
        ar: 'خصوصيتك مهمة بالنسبة لنا. توضح سياسة الخصوصية الخاصة بنا كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها. باستخدام دليل+، فإنك توافق على جمع واستخدام معلوماتك كما هو موضح في سياسة الخصوصية الخاصة بنا.'
      }
    },
    {
      title: { en: '8. Limitation of Liability', ar: '8. تحديد المسؤولية' },
      content: {
        en: 'Daleel+ and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service. Our total liability shall not exceed the amount paid by you, if any, for accessing the service.',
        ar: 'لن تكون دليل+ والشركات التابعة لها مسؤولة عن أي أضرار غير مباشرة أو عرضية أو خاصة أو تبعية أو عقابية ناتجة عن استخدامك أو عدم قدرتك على استخدام الخدمة. لن تتجاوز مسؤوليتنا الإجمالية المبلغ الذي دفعته، إن وجد، للوصول إلى الخدمة.'
      }
    },
    {
      title: { en: '9. Changes to Terms', ar: '9. تغييرات الشروط' },
      content: {
        en: 'We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the application. Your continued use of Daleel+ after any changes indicates your acceptance of the modified terms.',
        ar: 'نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. ستصبح التغييرات سارية المفعول فور نشرها في التطبيق. يشير استمرارك في استخدام دليل+ بعد أي تغييرات إلى قبولك للشروط المعدلة.'
      }
    },
    {
      title: { en: '10. Contact Information', ar: '10. معلومات الاتصال' },
      content: {
        en: 'If you have any questions about these Terms and Conditions, please contact us at:\n\nEmail: legal@daleelplus.com\nPhone: +971 4 123 4567\nAddress: Dubai, United Arab Emirates',
        ar: 'إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا على:\n\nالبريد الإلكتروني: legal@daleelplus.com\nالهاتف: +971 4 123 4567\nالعنوان: دبي، الإمارات العربية المتحدة'
      }
    },
  ];

  const lastUpdated = {
    en: 'Last Updated: January 2024',
    ar: 'آخر تحديث: يناير 2024'
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }, isRTL && styles.headerRTL]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name={isRTL ? "chevron-forward" : "chevron-back"}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[
          styles.headerTitle,
          { color: colors.text, fontFamily: FONT_TITLE[fontKey] },
        ]}>
          {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={[styles.heroSection, { backgroundColor: colors.surface }]}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons name="document-text" size={40} color={colors.primary} />
          </View>
          <Text style={[
            styles.heroTitle,
            { color: colors.text, fontFamily: FONT_TITLE[fontKey] },
            isRTL && styles.textRTL,
          ]}>
            {isRTL ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </Text>
          <Text style={[
            styles.heroSubtitle,
            { color: colors.textSecondary, fontFamily: FONT_BODY[fontKey] },
            isRTL && styles.textRTL,
          ]}>
            {isRTL 
              ? 'يرجى قراءة هذه الشروط بعناية قبل استخدام التطبيق'
              : 'Please read these terms carefully before using the app'}
          </Text>
          <Text style={[
            styles.lastUpdated,
            { color: colors.primary, fontFamily: FONT_MEDIUM[fontKey] },
            isRTL && styles.textRTL,
          ]}>
            {lastUpdated[isRTL ? 'ar' : 'en']}
          </Text>
        </MotiView>

        {/* Terms Sections */}
        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 400, delay: index * 50 }}
              style={[styles.sectionCard, { backgroundColor: colors.surface }]}
            >
              <Text style={[
                styles.sectionTitle,
                { color: colors.text, fontFamily: FONT_TITLE[fontKey] },
                isRTL && styles.textRTL,
              ]}>
                {section.title[isRTL ? 'ar' : 'en']}
              </Text>
              <Text style={[
                styles.sectionContent,
                { color: colors.textSecondary, fontFamily: FONT_BODY[fontKey] },
                isRTL && styles.textRTL,
              ]}>
                {section.content[isRTL ? 'ar' : 'en']}
              </Text>
            </MotiView>
          ))}
        </View>

        {/* Agreement Notice */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 500, delay: 600 }}
          style={[styles.agreementNotice, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }, isRTL && { flexDirection: 'row-reverse' }]}
        >
          <Ionicons name="checkmark-circle" size={24} color={colors.primary} style={{ marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }} />
          <Text style={[
            styles.agreementText,
            { color: colors.text, fontFamily: FONT_BODY[fontKey] },
            isRTL && styles.textRTL,
          ]}>
            {isRTL 
              ? 'باستخدامك لتطبيق دليل+، فإنك توافق على هذه الشروط والأحكام'
              : 'By using Daleel+, you agree to these Terms and Conditions'}
          </Text>
        </MotiView>

        {/* Footer spacing */}
        <View style={styles.footerSpace} />
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: 8,
  },
  backButtonRTL: {
    transform: [{ scaleX: 1 }],
  },
  headerTitle: {
    fontSize: 18,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  heroSection: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  sectionsContainer: {
    gap: 12,
  },
  sectionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 22,
  },
  agreementNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  agreementText: {
    flex: 1,
    fontSize: 14,
  },
  footerSpace: {
    height: 40,
  },
});
