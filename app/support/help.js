import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import LiquidGlassBackground from '../../components/LiquidGlassBackground';

export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const faqs = [
    {
      question: 'How do I start my learning journey?',
      answer: 'Go to the Quest tab in the bottom navigation. Follow the S-curved path and tap on the glowing node to start your current level. Levels are unlocked sequentially as you progress.',
    },
    {
      question: "What is the 'Daily Challenge'?",
      answer: "Every day, you can tap the glowing Dice icon on the Quest Map to play a special mini-game like Grammar Snake or Scramble. These challenges are a fun way to earn bonus XP and sharpen your reflexes.",
    },
    {
      question: 'How do I track my progress?',
      answer: 'Your journey is visually tracked on the Quest Map. Green nodes represent completed levels, glowing nodes are your current target, and locked nodes are gray. You can also see your total XP and Level in the header.',
    },
    {
      question: 'Can I practice specific skills?',
      answer: 'Absolutely! While the Quest Map provides a guided path, you can use the Listening, Reading, and Grammar tabs to focus on specific skills at any time.',
    },
    {
      question: 'How do I change app settings?',
      answer: 'Visit the Profile tab and tap the Settings gear icon. There you can toggle Dark Mode, change language, and manage your account.',
    },
  ];

  const contactOptions = [
    {
      icon: 'mail-outline',
      title: 'Email Support',
      subtitle: 'almazidi21@gmail.com',
      action: () => Linking.openURL('mailto:almazidi21@gmail.com'),
    },
    {
      icon: 'logo-whatsapp',
      title: 'WhatsApp Chat',
      subtitle: '+968 99364644',
      action: () => Linking.openURL('whatsapp://send?phone=+96899364644'),
    },
    {
      icon: 'call-outline',
      title: 'Call Us',
      subtitle: 'Available 24/7',
      action: () => Linking.openURL('tel:+96899364644'),
    },
  ];

  return (
    <View style={styles.container}>
      <LiquidGlassBackground />
      <Stack.Screen options={{ headerShown: false }} />

      {/* Premium Header */}
      <View style={{ overflow: 'hidden', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <LinearGradient
          colors={colors.gradientHero}
          style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { fontFamily: 'Poppins_800ExtraBold' }]}>
              Help & Support
            </Text>
            <View style={{ width: 44 }} />
          </View>

          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles.heroContent}
          >
            <View style={styles.heroIconWrap}>
               <Ionicons name="help-buoy" size={40} color="#fff" />
            </View>
            <Text style={styles.heroText}>How can we help you today?</Text>
          </MotiView>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 + insets.bottom }]}
      >
        {/* FAQ Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
          Frequently Asked Questions
        </Text>

        {faqs.map((faq, idx) => (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setExpandedFaq(expandedFaq === idx ? null : idx);
            }}
            style={styles.faqCardWrap}
          >
            <BlurView
              intensity={isDark ? 20 : 50}
              tint={isDark ? 'dark' : 'light'}
              style={[styles.faqCard, { borderColor: colors.border }]}
            >
              <View style={styles.faqHeader}>
                <Text style={[styles.faqQuestion, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
                  {faq.question}
                </Text>
                <Ionicons
                  name={expandedFaq === idx ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.accent}
                />
              </View>
              <AnimatePresence>
                {expandedFaq === idx && (
                  <MotiView
                    from={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'timing', duration: 250 }}
                  >
                    <Text style={[styles.faqAnswer, { color: colors.textSecondary, borderTopColor: colors.border }]}>
                      {faq.answer}
                    </Text>
                  </MotiView>
                )}
              </AnimatePresence>
            </BlurView>
          </TouchableOpacity>
        ))}

        {/* Contact Section */}
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'Poppins_700Bold', marginTop: 30 }]}>
          Contact Us
        </Text>

        <View style={styles.contactContainer}>
          {contactOptions.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                option.action();
              }}
              style={styles.contactCardWrap}
            >
              <BlurView
                intensity={isDark ? 20 : 40}
                tint={isDark ? 'dark' : 'light'}
                style={[styles.contactCard, { borderColor: colors.border }]}
              >
                <View style={[styles.contactIcon, { backgroundColor: colors.accentSoft }]}>
                  <Ionicons name={option.icon} size={24} color={colors.accent} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactTitle, { color: colors.text, fontFamily: 'Poppins_700Bold' }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>
                    {option.subtitle}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.border} />
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 15 },
  headerTitle: { fontSize: 22, color: '#fff' },
  heroContent: { alignItems: 'center', marginTop: 10 },
  heroIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  heroText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 30 },
  sectionTitle: { fontSize: 18, marginBottom: 16 },
  faqCardWrap: { marginBottom: 12, borderRadius: 20, overflow: 'hidden' },
  faqCard: { padding: 18, borderWidth: 1, borderRadius: 20 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, flex: 1, paddingRight: 10 },
  faqAnswer: { fontSize: 14, lineHeight: 22, marginTop: 15, paddingTop: 15, borderTopWidth: 1 },
  contactContainer: { gap: 12 },
  contactCardWrap: { borderRadius: 20, overflow: 'hidden' },
  contactCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderRadius: 20 },
  contactIcon: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  contactInfo: { flex: 1, marginLeft: 15 },
  contactTitle: { fontSize: 16, marginBottom: 2 },
  contactSubtitle: { fontSize: 13, opacity: 0.8 },
});
