import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

let Audio;
try {
  Audio = require('expo-av').Audio;
} catch (e) {
  Audio = null;
}

const RING_SIZE = 64;
const RING_STROKE = 4;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;

export default function AudioPlayer({ audioUrl, onPlaybackStatusUpdate }) {
  const { colors } = useTheme();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState(null);
  const autoplayTimer = useRef(null);
  const soundRef = useRef(null);

  // Unload on unmount
  useEffect(() => {
    return () => {
      clearTimeout(autoplayTimer.current);
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  // Reset + autoplay whenever audioUrl changes
  useEffect(() => {
    clearTimeout(autoplayTimer.current);
    setPosition(0);
    setDuration(0);
    setIsPlaying(false);
    setError(null);

    if (soundRef.current) {
      soundRef.current.unloadAsync();
      soundRef.current = null;
      setSound(null);
    }

    autoplayTimer.current = setTimeout(() => {
      triggerPlay();
    }, 2000);

    return () => clearTimeout(autoplayTimer.current);
  }, [audioUrl]);

  const loadSound = async () => {
    if (!Audio) {
      setError('Audio not available.');
      return null;
    }
    try {
      setIsLoading(true);
      setError(null);

      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        (status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            setPosition(status.positionMillis || 0);
            setDuration(status.durationMillis || 0);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setPosition(0);
            }
          }
          onPlaybackStatusUpdate?.(status);
        }
      );

      soundRef.current = newSound;
      setSound(newSound);
      setIsLoading(false);
      return newSound;
    } catch (e) {
      setError('Failed to load audio.');
      setIsLoading(false);
      return null;
    }
  };

  const triggerPlay = async () => {
    try {
      let s = soundRef.current;
      if (!s) s = await loadSound();
      if (s) await s.playAsync();
    } catch (e) {
      setError('Playback error. Please try again.');
    }
  };

  const handlePlayPause = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const s = soundRef.current;
      if (!s) {
        await triggerPlay();
        return;
      }
      if (isPlaying) {
        await s.pauseAsync();
      } else {
        await s.playAsync();
      }
    } catch (e) {
      setError('Playback error. Please try again.');
    }
  };

  const handleReplay = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const s = soundRef.current;
      if (s) {
        await s.setPositionAsync(0);
        await s.playAsync();
      }
    } catch (e) {
      setError('Playback error. Please try again.');
    }
  };

  const formatTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const strokeDashoffset = RING_CIRC * (1 - progress);

  const statusLabel = isLoading ? 'Loading...'
    : error ? error
    : isPlaying ? 'Playing'
    : position > 0 ? 'Paused'
    : 'Ready';

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Decorative note icon */}
      <View style={styles.noteIcon}>
        <Ionicons name="musical-notes" size={18} color={colors.accent} />
      </View>

      <View style={styles.inner}>
        {/* Ring play button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePlayPause}
          disabled={isLoading}
          style={styles.ringWrap}
        >
          <Svg width={RING_SIZE} height={RING_SIZE} style={StyleSheet.absoluteFill}>
            <Circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R}
              stroke={colors.border} strokeWidth={RING_STROKE} fill="none"
            />
            <Circle
              cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R}
              stroke={colors.accent} strokeWidth={RING_STROKE} fill="none"
              strokeDasharray={`${RING_CIRC} ${RING_CIRC}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>

          <View style={[styles.ringInner, { backgroundColor: colors.accent }]}>
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={22}
                color="#ffffff"
                style={!isPlaying && { marginLeft: 2 }}
              />
            )}
          </View>
        </TouchableOpacity>

        {position > 0 && !isPlaying && (
          <TouchableOpacity activeOpacity={0.85} onPress={handleReplay} style={styles.replayButton}>
            <Ionicons name="reload" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              {formatTime(position)}
            </Text>
            <Text style={[styles.statusText, { color: colors.accent, fontFamily: 'Inter_600SemiBold' }]}>
              {statusLabel}
            </Text>
            <Text style={[styles.timeText, { color: colors.textSecondary, fontFamily: 'Inter_400Regular' }]}>
              {formatTime(duration)}
            </Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${progress * 100}%` }]} />
            <View style={[styles.progressGlow, { backgroundColor: colors.accent, opacity: 0.2, width: `${progress * 100}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 10, elevation: 3,
    position: 'relative', overflow: 'hidden',
  },
  noteIcon: { position: 'absolute', top: 12, right: 14, opacity: 0.35 },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 16 },

  ringWrap: {
    width: RING_SIZE, height: RING_SIZE,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  ringInner: {
    width: RING_SIZE - RING_STROKE * 2 - 8,
    height: RING_SIZE - RING_STROKE * 2 - 8,
    borderRadius: (RING_SIZE - RING_STROKE * 2 - 8) / 2,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 6, elevation: 4,
  },
  replayButton: { padding: 4 },

  info: { flex: 1 },
  timeRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  timeText: { fontSize: 12 },
  statusText: { fontSize: 12 },

  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  progressGlow: { position: 'absolute', height: 10, borderRadius: 5, top: -3 },
});
