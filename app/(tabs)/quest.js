import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock data for levels
const LEVELS = [
  { id: 1, title: 'Basics 1', type: 'grammar', status: 'completed', icon: 'school', route: '/quiz/grammar?form=1' },
  { id: 2, title: 'Daily Life', type: 'listening', status: 'current', icon: 'headset', route: '/quiz/listening?form=1' },
  { id: 3, title: 'Small Talk', type: 'grammar', status: 'locked', icon: 'chatbubbles', route: '/quiz/grammar?form=2' },
  { id: 4, title: 'Reading Fun', type: 'reading', status: 'locked', icon: 'book', route: '/quiz/reading?form=1' },
  { id: 5, title: 'Travel Prep', type: 'listening', status: 'locked', icon: 'airplane', route: '/quiz/listening?form=2' },
  { id: 6, title: 'Business', type: 'grammar', status: 'locked', icon: 'briefcase', route: '/quiz/grammar?form=3' },
  { id: 7, title: 'Advanced', type: 'reading', status: 'locked', icon: 'trophy', route: '/quiz/reading?form=2' },
];

export default function QuestScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const renderPath = () => {
    return LEVELS.map((level, index) => {
      // S-curve logic: center, then left, then right, then left...
      let side = 'center';
      if (index > 0) {
        side = index % 2 === 0 ? 'right' : 'left';
      }

      let translateX = 0;
      if (side === 'left') translateX = -width * 0.22;
      if (side === 'right') translateX = width * 0.22;

      const isLocked = level.status === 'locked';
      const isCurrent = level.status === 'current';
      const isCompleted = level.status === 'completed';

      return (
        <View key={level.id} style={styles.nodeContainer}>
          {index !== 0 && (
            <View style={[
              styles.connector,
              {
                backgroundColor: isCompleted ? colors.success : colors.border,
                left: side === 'center' ? '50%' : side === 'right' ? '70%' : '30%',
                transform: [{ rotate: side === 'right' ? '15deg' : side === 'left' ? '-15deg' : '0deg' }]
              }
            ]} />
          )}

          <MotiView
            from={{ opacity: 0, scale: 0.5, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ type: 'spring', delay: index * 100 }}
            style={{ transform: [{ translateX }] }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (isLocked) {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                } else {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  router.push(level.route);
                }
              }}
              style={[
                styles.node,
                {
                  backgroundColor: isLocked ? colors.surfaceAlt : colors.surface,
                  borderColor: isCurrent ? colors.accent : isCompleted ? colors.success : colors.border,
                  borderWidth: isCurrent ? 4 : 2,
                  shadowColor: isCurrent ? colors.accent : '#000',
                  shadowOpacity: isCurrent ? 0.3 : 0.1,
                },
              ]}
            >
              {isCurrent && (
                <MotiView
                  from={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: 1.4, opacity: 0 }}
                  transition={{ loop: true, duration: 2000, type: 'timing' }}
                  style={[styles.pulseRing, { borderColor: colors.accent }]}
                />
              )}

              <View style={[
                styles.iconCircle,
                { backgroundColor: isLocked ? colors.border : isCompleted ? colors.successSoft : colors.accentSoft }
              ]}>
                <Ionicons
                  name={level.icon}
                  size={30}
                  color={isLocked ? colors.textSecondary : isCompleted ? colors.success : colors.accent}
                />
              </View>

              {isLocked && (
                <View style={styles.lockBadge}>
                  <Ionicons name="lock-closed" size={12} color="#ffffff" />
                </View>
              )}

              {isCompleted && (
                <View style={[styles.checkBadge, { backgroundColor: colors.success }]}>
                  <Ionicons name="checkmark" size={12} color="#ffffff" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.labelContainer}>
               <Text style={[
                styles.nodeLabel,
                { color: isLocked ? colors.textSecondary : colors.text, fontFamily: 'Cairo_700Bold' }
              ]}>
                {level.title}
              </Text>
            </View>
          </MotiView>
        </View>
      );
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Header */}
      <View style={{ overflow: 'hidden', borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}>
        <LinearGradient
          colors={colors.gradientHero}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={[styles.headerTitle, { fontFamily: 'Cairo_800ExtraBold' }]}>Quest Map</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="flash" size={14} color="#fbbf24" />
                  <Text style={[styles.statText, { fontFamily: 'Cairo_700Bold' }]}>Level 4</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Ionicons name="star" size={14} color="#60a5fa" />
                  <Text style={[styles.statText, { fontFamily: 'Cairo_700Bold' }]}>1,240 XP</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.dailyRoll}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                router.push('/games/snake');
              }}
            >
              <MotiView
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ loop: true, duration: 2000 }}
                style={styles.rollInner}
              >
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  style={styles.rollGradient}
                >
                  <Ionicons name="flash" size={28} color="#ffffff" />
                </LinearGradient>
              </MotiView>
              <Text style={[styles.rollText, { color: '#ffffff', fontFamily: 'Cairo_800ExtraBold' }]}>SURVIVE!</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {renderPath()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    color: '#ffffff',
    letterSpacing: -1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#ffffff',
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 10,
  },
  dailyRoll: {
    alignItems: 'center',
  },
  rollInner: {
    elevation: 8,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowColor: '#f59e0b',
  },
  rollGradient: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rollText: {
    fontSize: 9,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingTop: 60,
    alignItems: 'center',
  },
  nodeContainer: {
    alignItems: 'center',
    marginBottom: 60,
    width: '100%',
  },
  connector: {
    width: 8,
    height: 70,
    position: 'absolute',
    top: -65,
    borderRadius: 4,
    zIndex: -1,
  },
  node: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#475569',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  labelContainer: {
    position: 'absolute',
    top: 100,
    width: 150,
    alignItems: 'center',
  },
  nodeLabel: {
    fontSize: 15,
    textAlign: 'center',
  },
});
