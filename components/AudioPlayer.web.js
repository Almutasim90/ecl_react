/**
 * Web-specific AudioPlayer.
 * Uses native HTMLAudioElement — expo-av has no reliable web support.
 * No autoplay: browsers block audio playback before a user gesture.
 * Expo bundler automatically picks this file on web, AudioPlayer.js on native.
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const RING_SIZE = 64;
const RING_STROKE = 4;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_R;

export default function AudioPlayer({ audioUrl, onPlaybackStatusUpdate }) {
  const { isDark } = useTheme();
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState(null);

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const subtextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#ede9fe';
  const accentColor = '#7c3aed';
  const ringTrackColor = isDark ? '#334155' : '#e2e8f0';

  // Destroy current audio instance and reset state when question changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
    setError(null);
    setIsLoading(false);
  }, [audioUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const getAudio = () => {
    if (audioRef.current) return audioRef.current;

    const audio = new window.Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = audioUrl;
    audio.preload = 'auto';

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration * 1000);
    });
    audio.addEventListener('timeupdate', () => {
      setPosition(audio.currentTime * 1000);
      onPlaybackStatusUpdate?.({
        isLoaded: true,
        isPlaying: !audio.paused,
        positionMillis: audio.currentTime * 1000,
        durationMillis: audio.duration * 1000,
      });
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setPosition(0);
    });
    audio.addEventListener('waiting', () => setIsLoading(true));
    audio.addEventListener('canplay', () => setIsLoading(false));
    audio.addEventListener('error', () => {
      setError('Could not load audio file.');
      setIsLoading(false);
      setIsPlaying(false);
    });

    audioRef.current = audio;
    return audio;
  };

  const handlePlayPause = async () => {
    setError(null);
    try {
      const audio = getAudio();
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
      }
    } catch (e) {
      // AbortError or NotAllowedError from browser policy
      setError('Tap play to start audio.');
      setIsLoading(false);
    }
  };

  const fmt = (ms) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? Math.min(position / duration, 1) : 0;
  const strokeDashoffset = RING_CIRC * (1 - progress);

  const statusLabel = isLoading
    ? 'Loading...'
    : error
    ? 'Error'
    : isPlaying
    ? 'Playing'
    : position > 0
    ? 'Paused'
    : 'Tap to play';

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      <View style={styles.noteIcon}>
        <Ionicons name="musical-notes" size={18} color={accentColor} />
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
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_R}
              stroke={ringTrackColor}
              strokeWidth={RING_STROKE}
              fill="none"
            />
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_R}
              stroke={accentColor}
              strokeWidth={RING_STROKE}
              fill="none"
              strokeDasharray={`${RING_CIRC} ${RING_CIRC}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={[styles.ringInner, { backgroundColor: accentColor }]}>
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

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: subtextColor, fontFamily: 'Cairo_600SemiBold' }]}>
              {fmt(position)}
            </Text>
            <Text style={[styles.statusText, { color: error ? '#ef4444' : accentColor, fontFamily: 'Cairo_700Bold' }]}>
              {statusLabel}
            </Text>
            <Text style={[styles.timeText, { color: subtextColor, fontFamily: 'Cairo_600SemiBold' }]}>
              {fmt(duration)}
            </Text>
          </View>

          <View style={[styles.progressTrack, { backgroundColor: ringTrackColor }]}>
            <View style={[styles.progressFill, { backgroundColor: accentColor, width: `${progress * 100}%` }]} />
            <View style={[styles.progressGlow, { backgroundColor: accentColor, opacity: 0.2, width: `${progress * 100}%` }]} />
          </View>

          {error && (
            <Text style={[styles.errorText, { fontFamily: 'Cairo_600SemiBold' }]}>
              {error}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  noteIcon: {
    position: 'absolute',
    top: 12,
    right: 14,
    opacity: 0.35,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  ringInner: {
    width: RING_SIZE - RING_STROKE * 2 - 8,
    height: RING_SIZE - RING_STROKE * 2 - 8,
    borderRadius: (RING_SIZE - RING_STROKE * 2 - 8) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  info: { flex: 1 },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: { fontSize: 12 },
  statusText: { fontSize: 12 },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  progressGlow: {
    position: 'absolute',
    height: 10,
    borderRadius: 5,
    top: -3,
  },
  errorText: {
    fontSize: 11,
    color: '#ef4444',
    marginTop: 6,
  },
});
