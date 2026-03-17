import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const APP_VERSION = '1.0.0';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();

  const bg = isDark ? '#0f172a' : '#f5f3ff';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#1e1b4b';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#ede9fe';

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Student';
  const displayEmail = user?.email || 'Not signed in';

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const confirmed =
      typeof window !== 'undefined' && window.confirm
        ? window.confirm('Are you sure you want to logout?')
        : true;
    if (confirmed) {
      const result = await signOut();
      if (result.success) {
        router.replace('/(auth)/login');
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: 110 },
        ]}
      >
        {/* ── Profile hero card ── */}
        <MotiView
          from={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 16 }}
          style={styles.heroWrap}
        >
          <LinearGradient
            colors={isDark ? ['#3b1f7a', '#5b21b6', '#7c3aed'] : ['#6d28d9', '#7c3aed', '#a78bfa']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroBlob1} />
            <View style={styles.heroBlob2} />
            <View style={styles.heroBlob3} />

            {/* Avatar */}
            <MotiView
              from={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 14, delay: 100 }}
              style={styles.avatarWrap}
            >
              <View style={styles.avatarRing}>
                <View style={styles.avatar}>
                  <Text style={[styles.avatarLetter, { fontFamily: 'Inter_600SemiBold' }]}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.roleBadge}>
                <Ionicons name="school" size={11} color="#fff" />
              </View>
            </MotiView>

            {/* Name + email */}
            <MotiView
              from={{ opacity: 0, translateY: 8 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 320, delay: 180 }}
            >
              <Text style={[styles.heroName, { fontFamily: 'Inter_600SemiBold' }]}>
                {displayName}
              </Text>
              <View style={styles.emailRow}>
                <Ionicons name="mail-outline" size={13} color="rgba(255,255,255,0.7)" />
                <Text style={[styles.heroEmail, { fontFamily: 'Inter_400Regular' }]}>
                  {displayEmail}
                </Text>
              </View>
            </MotiView>

            {/* Membership pill */}
            <MotiView
              from={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 14, delay: 260 }}
              style={styles.memberPill}
            >
              <Text style={[styles.memberBrand, { fontFamily: 'Inter_600SemiBold' }]}>ECL</Text>
              <View style={styles.pillDivider} />
              <Ionicons name="star" size={11} color="#fbbf24" />
              <Text style={[styles.memberRole, { fontFamily: 'Inter_400Regular' }]}>Student</Text>
            </MotiView>
          </LinearGradient>
        </MotiView>

        {/* ── Preferences section ── */}
        <SectionHeader label="Preferences" subtextColor={subtextColor} />

        <MotiView
          from={{ opacity: 0, translateX: -14 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 340, delay: 300 }}
          style={[styles.menuCard, { backgroundColor: cardBg, borderColor }]}
        >
          {/* Dark mode — uses Switch, not chevron */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleTheme();
            }}
            style={styles.menuRow}
          >
            <View style={styles.menuRowLeft}>
              <View style={[styles.menuIconWrap, { backgroundColor: 'rgba(124,58,237,0.12)' }]}>
                <Ionicons name="contrast" size={19} color="#7c3aed" />
              </View>
              <View>
                <Text style={[styles.menuLabel, { color: textColor, fontFamily: 'Inter_500Medium' }]}>
                  Dark Mode
                </Text>
                <Text style={[styles.menuSub, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
                  {isDark ? 'On — switch to light' : 'Off — switch to dark'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleTheme();
              }}
              trackColor={{ false: '#e2e8f0', true: 'rgba(124,58,237,0.5)' }}
              thumbColor={isDark ? '#7c3aed' : '#f1f5f9'}
            />
          </TouchableOpacity>
        </MotiView>

        {/* ── Support section ── */}
        <SectionHeader label="Support" subtextColor={subtextColor} />

        <MotiView
          from={{ opacity: 0, translateX: -14 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 340, delay: 360 }}
          style={[styles.menuCard, { backgroundColor: cardBg, borderColor }]}
        >
          <MenuItem
            icon="help-circle"
            iconBg="rgba(20,184,166,0.12)"
            iconColor="#14b8a6"
            label="Help & Support"
            sub="FAQs and contact"
            textColor={textColor}
            subtextColor={subtextColor}
            onPress={() => router.push('/support/help')}
            showDivider
            borderColor={borderColor}
          />
          <MenuItem
            icon="document-text"
            iconBg="rgba(249,115,22,0.12)"
            iconColor="#f97316"
            label="Terms & Conditions"
            sub="Read our policies"
            textColor={textColor}
            subtextColor={subtextColor}
            onPress={() => {}}
          />
        </MotiView>

        {/* ── Logout ── */}
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 340, delay: 420 }}
        >
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleLogout}
            style={[styles.logoutBtn, { borderColor: 'rgba(239,68,68,0.3)' }]}
          >
            <View style={[styles.logoutIconWrap, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            </View>
            <Text style={[styles.logoutText, { fontFamily: 'Inter_600SemiBold' }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* ── Version footer ── */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 400, delay: 480 }}
          style={styles.versionWrap}
        >
          <Text style={[styles.versionText, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
            ECL · Version {APP_VERSION}
          </Text>
        </MotiView>
      </ScrollView>
    </View>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function SectionHeader({ label, subtextColor }) {
  return (
    <Text style={[sectionStyles.label, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
      {label.toUpperCase()}
    </Text>
  );
}

const sectionStyles = StyleSheet.create({
  label: {
    fontSize: 11,
    letterSpacing: 1.3,
    marginBottom: 10,
    marginTop: 20,
    paddingHorizontal: 4,
  },
});

function MenuItem({ icon, iconBg, iconColor, label, sub, textColor, subtextColor, onPress, showDivider, borderColor }) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress?.();
        }}
        style={menuStyles.row}
      >
        <View style={menuStyles.left}>
          <View style={[menuStyles.iconWrap, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={19} color={iconColor} />
          </View>
          <View>
            <Text style={[menuStyles.label, { color: textColor, fontFamily: 'Inter_500Medium' }]}>
              {label}
            </Text>
            {sub && (
              <Text style={[menuStyles.sub, { color: subtextColor, fontFamily: 'Inter_400Regular' }]}>
                {sub}
              </Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={subtextColor} />
      </TouchableOpacity>
      {showDivider && (
        <View style={[menuStyles.divider, { backgroundColor: borderColor }]} />
      )}
    </>
  );
}

const menuStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: { fontSize: 15 },
  sub: { fontSize: 12, marginTop: 1 },
  divider: { height: 1, marginHorizontal: 16 },
});

// ── Main styles ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  // Hero card
  heroWrap: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 4,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  heroGradient: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroBlob1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    right: -30,
  },
  heroBlob2: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -25,
    left: -15,
  },
  heroBlob3: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: 24,
    left: 32,
  },
  avatarWrap: {
    marginBottom: 16,
    position: 'relative',
  },
  avatarRing: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: { fontSize: 38, color: '#7c3aed' },
  roleBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7c3aed',
    borderWidth: 2.5,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroName: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroEmail: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  memberPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  memberBrand: { fontSize: 12, color: '#ffffff', letterSpacing: 2 },
  pillDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
  },
  memberRole: { fontSize: 12, color: '#ffffff' },

  // Menu card
  menuCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: { fontSize: 15 },
  menuSub: { fontSize: 12, marginTop: 1 },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 20,
  },
  logoutIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: { fontSize: 16, color: '#ef4444' },

  // Version
  versionWrap: {
    alignItems: 'center',
    marginTop: 24,
  },
  versionText: { fontSize: 12 },
});
