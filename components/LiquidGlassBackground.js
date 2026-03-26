import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Blob Configuration
const BLOBS = [
  { id: 1, color: '#818cf8', size: width * 0.8, initialPos: { top: -width * 0.2, right: -width * 0.1 }, duration: 7000 },
  { id: 2, color: '#c084fc', size: width * 0.7, initialPos: { bottom: height * 0.1, left: -width * 0.2 }, duration: 9000 },
  { id: 3, color: '#60a5fa', size: width * 0.5, initialPos: { top: height * 0.3, left: width * 0.2 }, duration: 11000 },
  { id: 4, color: '#4ade80', size: width * 0.4, initialPos: { bottom: -width * 0.1, right: width * 0.1 }, duration: 8000 },
];

export default function LiquidGlassBackground() {
  const { isDark, colors } = useTheme();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Deep Background Gradient */}
      <LinearGradient
        colors={isDark ? ['#0d0d14', '#14141f'] : ['#f8fafc', '#e2e8f0']}
        style={StyleSheet.absoluteFill}
      />

      {/* Animated Liquid Blobs */}
      {BLOBS.map((blob) => (
        <Blob key={blob.id} config={blob} />
      ))}

      {/* Glass Frost Layer */}
      <BlurView
        intensity={Platform.OS === 'ios' ? 40 : 80}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle Overlay to bind colors */}
      <View style={[
        StyleSheet.absoluteFill,
        { backgroundColor: isDark ? 'rgba(13, 13, 20, 0.4)' : 'rgba(255, 255, 255, 0.2)' }
      ]} />
    </View>
  );
}

function Blob({ config }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: config.duration,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [-20, 20]);
    const translateY = interpolate(progress.value, [0, 1], [30, -30]);
    const scale = interpolate(progress.value, [0, 1], [1, 1.15]);
    const rotate = interpolate(progress.value, [0, 1], [0, 15]);

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.blob,
        {
          width: config.size,
          height: config.size,
          backgroundColor: config.color,
          borderRadius: config.size / 2,
          opacity: 0.35,
          ...config.initialPos,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    filter: Platform.OS === 'web' ? 'blur(60px)' : undefined, // Web support for blur
  },
});
