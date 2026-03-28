import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
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
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

const RING_SIZE = 64;
const RING_STROKE = 4;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;

const AudioPlayer = forwardRef(function AudioPlayer({ audioUrl, onPlaybackStatusUpdate }, ref) {
  const { colors } = useTheme();
  const player = useAudioPlayer(audioUrl ? { uri: audioUrl } : null);
  const status = useAudioPlayerStatus(player);
  const autoplayTimer = useRef(null);
  const [error, setError] = useState(null);

  // Expose stop() so parent screens can kill audio on blur
  useImperativeHandle(ref, () => ({
    stop: async () => {
      clearTimeout(autoplayTimer.current);
      try {
        player.pause();
        player.seekTo(0);
      } catch {}
    },
  }));

  // Set audio mode once on mount (iOS silent mode support)
  useEffect(() => {
    if (Platform.OS !== 'web') {
      setAudioModeAsync({ playsInSilentModeIOS: true }).catch(() => {});
    }
  }, []);

  // Reset + autoplay whenever audioUrl changes
  useEffect(() => {
    clearTimeout(autoplayTimer.current);
    setError(null);

    // Pause immediately so any retained shouldPlay state doesn't auto-start the new source
    try { player.pause(); } catch {}

    if (!audioUrl) return;

    autoplayTimer.current = setTimeout(() => {
      try { player.play(); } catch {}
    }, 2000);

    return () => {
      clearTimeout(autoplayTimer.current);
      try { player.pause(); } catch {}
    };
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(autoplayTimer.current);
    };
  }, []);

  // Notify parent of status updates
  useEffect(() => {
    onPlaybackStatusUpdate?.(status);
  }, [status]);

  // expo-audio times are in seconds — convert to ms for display
  const positionMs = (status.currentTime || 0) * 1000;
  const durationMs = (status.duration || 0) * 1000;
  const isPlaying = status.playing ?? false;
  const isLoading = !status.isLoaded;

  const handlePlayPause = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    } catch {
      setError('Playback error. Please try again.');
    }
  };

  const handleReplay = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      player.seekTo(0);
      player.play();
    } catch {
      setError('Playback error. Please try again.');
    }
  };

  const formatTime = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = durationMs > 0 ? Math.min(positionMs / durationMs, 1) : 0;
  const strokeDashoffset = RING_CIRC * (1 - progress);

  const statusLabel = isLoading ? 'Loading...'
    : error ? error
      : isPlaying ? 'Playing'
        : positionMs > 0 ? 'Paused'
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

        {positionMs > 0 && !isPlaying && (
          <TouchableOpacity activeOpacity={0.85} onPress={handleReplay} style={styles.replayButton}>
            <Ionicons name="reload" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
              {formatTime(positionMs)}
            </Text>
            <Text style={[styles.statusText, { color: colors.accent, fontFamily: 'Poppins_700Bold' }]}>
              {statusLabel}
            </Text>
            <Text style={[styles.timeText, { color: colors.textSecondary, fontFamily: 'Poppins_700Bold' }]}>
              {formatTime(durationMs)}
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
});

export default AudioPlayer;

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
    shadowColor: '#818cf8',
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
