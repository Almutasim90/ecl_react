import React, { useEffect, useState } from 'react';
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

const PARALLAX_FACTOR = 18;
const FALLBACK_DURATION = 8000;

function useWindowDimensions() {
  const [dims, setDims] = useState(() => Dimensions.get('window'));
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', setDims);
    return () => sub?.remove?.();
  }, []);
  return dims;
}

export default function LiquidGlassBackground() {
  const { width } = useWindowDimensions();
  const { isDark } = useTheme();
  const offset1 = useSharedValue(0);
  const offset2 = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const useTiltMode = useSharedValue(0);

  useEffect(() => {
    let subscription;
    const init = async () => {
      try {
        const { Accelerometer } = await import('expo-sensors');
        const available = await Accelerometer.isAvailableAsync();
        if (available) {
          Accelerometer.setUpdateInterval(100);
          subscription = Accelerometer.addListener((data) => {
            tiltX.value = data.x * PARALLAX_FACTOR;
            tiltY.value = data.y * PARALLAX_FACTOR;
          });
          useTiltMode.value = 1;
          return;
        }
      } catch (_) {}
      useTiltMode.value = 0;
      offset1.value = withRepeat(
        withTiming(1, { duration: FALLBACK_DURATION, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
      offset2.value = withRepeat(
        withTiming(1, { duration: FALLBACK_DURATION + 2000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    };
    init();
    return () => {
      subscription?.remove?.();
    };
  }, []);

  const blob1Style = useAnimatedStyle(() => {
    'worklet';
    const fallbackX = interpolate(offset1.value, [0, 1], [0, 30]);
    const fallbackY = interpolate(offset1.value, [0, 1], [0, -20]);
    return {
      transform: [
        { translateX: useTiltMode.value * tiltX.value + (1 - useTiltMode.value) * fallbackX },
        { translateY: useTiltMode.value * tiltY.value + (1 - useTiltMode.value) * fallbackY },
      ],
    };
  });

  const blob2Style = useAnimatedStyle(() => {
    'worklet';
    const fallbackX = interpolate(offset2.value, [0, 1], [0, -25]);
    const fallbackY = interpolate(offset2.value, [0, 1], [0, 25]);
    return {
      transform: [
        { translateX: useTiltMode.value * (-tiltX.value * 0.7) + (1 - useTiltMode.value) * fallbackX },
        { translateY: useTiltMode.value * (-tiltY.value * 0.7) + (1 - useTiltMode.value) * fallbackY },
      ],
    };
  });

  const tint = isDark ? 'dark' : 'light';
  const intensity = isDark ? 60 : 50;
  const blob1Size = width * 0.7;
  const blob2Size = width * 0.6;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.gradientBase, isDark && styles.gradientBaseDark]} />
      <Animated.View
        style={[
          styles.blob,
          styles.blob1,
          { width: blob1Size, height: blob1Size, top: -width * 0.2, right: -width * 0.15 },
          blob1Style,
        ]}
      >
        <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View
        style={[
          styles.blob,
          styles.blob2,
          { width: blob2Size, height: blob2Size, bottom: -width * 0.15, left: -width * 0.2 },
          blob2Style,
        ]}
      >
        <BlurView intensity={intensity} tint={tint} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#e2e8f0',
  },
  gradientBaseDark: {
    backgroundColor: '#0f172a',
  },
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  blob1: {
    opacity: 0.6,
  },
  blob2: {
    opacity: 0.5,
  },
});
