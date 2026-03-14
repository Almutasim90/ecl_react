import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

const { width } = Dimensions.get('window');

const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };
const FONT_BOLD = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark } = useTheme();
  const { isRTL } = useI18n();
  const { user, profile, signOut } = useAuth();
  const { getFavoritesCount } = useFavorites();
  const fontKey = isRTL ? 'ar' : 'en';

  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const cardBg = isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.9)';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // For web compatibility, use a simple confirm instead of Alert
    const confirmed = typeof window !== 'undefined' && window.confirm
      ? window.confirm(isRTL ? 'هل تريد تسجيل الخروج من التطبيق؟' : 'Are you sure you want to logout?')
      : true;
    
    if (confirmed) {
      const result = await signOut();
      if (result.success) {
        router.replace('/(auth)/login');
      }
    }
  };

  const menuItems = [
    { icon: 'bookmark', label: isRTL ? 'المفضلة' : 'Saved Places', subtitle: isRTL ? 'الأماكن المحفوظة' : 'Your favorite spots', color: '#8b5cf6', action: () => router.push('/saved') },
    { icon: 'settings', label: isRTL ? 'الإعدادات' : 'Settings', subtitle: isRTL ? 'تخصيص التطبيق' : 'Customize your app', color: '#6366f1', action: () => router.push('/settings') },
    { icon: 'help-circle', label: isRTL ? 'المساعدة' : 'Help & Support', subtitle: isRTL ? 'احصل على المساعدة' : 'Get help anytime', color: '#14b8a6', action: () => {} },
    { icon: 'document-text', label: isRTL ? 'الشروط' : 'Terms & Conditions', subtitle: isRTL ? 'السياسات والشروط' : 'Read our policies', color: '#f97316', action: () => {} },
  ];

  // Gradient colors based on theme
  const gradientColors = isDark 
    ? ['#1e3a8a', '#3b82f6', '#60a5fa'] 
    : ['#2563eb', '#3b82f6', '#60a5fa'];

  return (
    <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top, paddingBottom: 90 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header with Gradient - Matches App Identity */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.profileCardWrapper}
        >
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            {/* Decorative circles matching app identity */}
            <View style={[styles.decorCircle, styles.decorCircle1]} />
            <View style={[styles.decorCircle, styles.decorCircle2]} />
            <View style={[styles.decorCircle, styles.decorCircle3]} />
            
            {/* Edit Profile Button */}
            <TouchableOpacity 
              style={styles.editButton}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>

            {/* Avatar with Location Icon Badge - Brand Identity */}
            <MotiView
              from={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 100 }}
              style={styles.avatarContainer}
            >
              <View style={styles.avatarRing}>
                <View style={styles.avatar}>
                  <Text style={[styles.avatarText, { fontFamily: FONT_BOLD[fontKey] }]}>
                    {(profile?.full_name || user?.email)?.charAt(0).toUpperCase() || 'G'}
                  </Text>
                </View>
              </View>
              {/* Location Icon Badge - Brand Identity */}
              <View style={styles.brandBadge}>
                <Ionicons name="location" size={12} color="#fff" />
              </View>
            </MotiView>

            {/* User Info */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 300, delay: 200 }}
            >
              <Text style={[styles.userName, { fontFamily: FONT_TITLE[fontKey] }]}>
                {profile?.full_name || user?.user_metadata?.full_name || (isRTL ? 'ضيف' : 'Guest')}
              </Text>
              <View style={[styles.emailContainer, isRTL && { flexDirection: 'row-reverse' }]}>
                <Ionicons name="mail-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={[styles.userEmail, { fontFamily: FONT_BODY[fontKey] }]}>
                  {user?.email || (isRTL ? 'تسجيل الدخول للوصول' : 'Login to access')}
                </Text>
              </View>
            </MotiView>

            {/* Member badge with Daleel+ branding */}
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 300 }}
              style={styles.memberBadge}
            >
              <Text style={[styles.brandText, { fontFamily: FONT_BOLD[fontKey] }]}>
                Daleel<Text style={styles.brandPlus}>+</Text>
              </Text>
              <View style={styles.badgeDivider} />
              <Ionicons name="star" size={12} color="#fbbf24" />
              <Text style={[styles.memberText, { fontFamily: FONT_BODY[fontKey] }]}>
                {isRTL ? 'عضو متميز' : 'Premium'}
              </Text>
            </MotiView>
          </LinearGradient>
        </MotiView>

        {/* Stats Section with Icons */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 150 }}
          style={styles.statsContainer}
        >
          {[
            { icon: 'location', count: '24', label: isRTL ? 'الزيارات' : 'Visits', color: '#10b981' },
            { icon: 'heart', count: String(getFavoritesCount()), label: isRTL ? 'المفضلة' : 'Favorites', color: '#ef4444' },
            { icon: 'star', count: '12', label: isRTL ? 'التقييمات' : 'Reviews', color: '#f59e0b' },
          ].map((stat, idx) => (
            <MotiView
              key={idx}
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 200 + idx * 80 }}
            >
              <TouchableOpacity 
                activeOpacity={0.85}
                style={[styles.statItem, { backgroundColor: cardBg }]}
              >
                <View style={[styles.statIconWrapper, { backgroundColor: `${stat.color}15` }]}>
                  <Ionicons name={stat.icon} size={18} color={stat.color} />
                </View>
                <Text style={[styles.statCount, { color: textColor, fontFamily: FONT_BOLD[fontKey] }]}>
                  {stat.count}
                </Text>
                <Text style={[styles.statLabel, { color: subtextColor, fontFamily: FONT_BODY[fontKey] }]}>
                  {stat.label}
                </Text>
              </TouchableOpacity>
            </MotiView>
          ))}
        </MotiView>

        {/* Section Title */}
        <View style={styles.sectionTitleContainer}>
          <Text style={[styles.sectionTitle, { color: subtextColor, fontFamily: FONT_BODY[fontKey], textAlign: isRTL ? 'right' : 'left' }]}>
            {isRTL ? 'القائمة الرئيسية' : 'Quick Actions'}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, idx) => (
            <MotiView
              key={idx}
              from={{ opacity: 0, translateX: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 400, delay: 350 + idx * 50 }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  item.action();
                }}
                style={[styles.menuItem, { backgroundColor: cardBg }]}
              >
                <View style={[styles.menuItemLeft, isRTL && styles.menuItemLeftRTL]}>
                  <View style={[styles.menuIconWrapper, { backgroundColor: `${item.color || '#2563eb'}15` }]}>
                    <Ionicons name={item.icon} size={20} color={item.color || '#2563eb'} />
                  </View>
                  <View>
                    <Text style={[styles.menuItemLabel, { color: textColor, fontFamily: FONT_BODY[fontKey], textAlign: isRTL ? 'right' : 'left' }]}>
                      {item.label}
                    </Text>
                    {item.subtitle && (
                      <Text style={[styles.menuItemSubtitle, { color: subtextColor, fontFamily: FONT_BODY[fontKey], textAlign: isRTL ? 'right' : 'left' }]}>
                        {item.subtitle}
                      </Text>
                    )}
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

        {/* Logout Button */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 400 }}
          style={styles.logoutButtonContainer}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLogout}
            style={[styles.logoutButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
          >
            <Ionicons name="log-out" size={20} color="#ef4444" style={{ marginRight: isRTL ? 0 : 10, marginLeft: isRTL ? 10 : 0 }} />
            <Text style={[styles.logoutText, { color: '#ef4444', fontFamily: FONT_BOLD[fontKey] }]}>
              {isRTL ? 'تسجيل الخروج' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 16,
  },
  profileCardWrapper: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  profileGradient: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  decorCircle1: {
    width: 150,
    height: 150,
    top: -50,
    right: -30,
  },
  decorCircle2: {
    width: 100,
    height: 100,
    bottom: -20,
    left: -20,
  },
  decorCircle3: {
    width: 60,
    height: 60,
    top: 20,
    left: 30,
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatarRing: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#2563eb',
  },
  brandBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2563eb',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 26,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  brandText: {
    fontSize: 12,
    color: '#ffffff',
  },
  brandPlus: {
    color: '#fbbf24',
  },
  badgeDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  memberText: {
    fontSize: 12,
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  statItem: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  statIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statCount: {
    fontSize: 22,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitleContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemLeftRTL: {
    flexDirection: 'row-reverse',
  },
  menuIconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
  },
  menuItemSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  logoutButtonContainer: {
    marginTop: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    fontSize: 16,
  },
});
