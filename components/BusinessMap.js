import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

const FONT_TITLE = { en: 'Inter_600SemiBold', ar: 'Cairo_600SemiBold' };
const FONT_BODY = { en: 'Inter_400Regular', ar: 'Cairo_400Regular' };

export default function BusinessMap({ 
  business, 
  isDark, 
  isRTL, 
  fontKey,
  textColor,
  subtextColor,
  cardBg,
  borderColor,
}) {
  const { coordinates, name, nameAr, address, addressAr } = business;
  
  if (!coordinates) {
    return null;
  }

  const displayName = isRTL ? nameAr : name;
  const displayAddress = isRTL ? addressAr : address;

  // Open location in external maps app
  const openInMaps = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const { latitude, longitude } = coordinates;
    const label = encodeURIComponent(displayName);
    
    // Different URL schemes for different platforms
    let url;
    if (Platform.OS === 'ios') {
      // Apple Maps
      url = `maps:0,0?q=${label}@${latitude},${longitude}`;
    } else if (Platform.OS === 'android') {
      // Google Maps on Android
      url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
    } else {
      // Web - Open Google Maps in browser
      url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }
    
    Linking.openURL(url).catch(() => {
      // Fallback to Google Maps web URL
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
    });
  };

  // Open directions in maps app
  const openDirections = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const { latitude, longitude } = coordinates;
    
    let url;
    if (Platform.OS === 'ios') {
      url = `maps:0,0?daddr=${latitude},${longitude}`;
    } else if (Platform.OS === 'android') {
      url = `google.navigation:q=${latitude},${longitude}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`);
    });
  };

  // Static Map Preview using OpenStreetMap tiles
  const StaticMapPreview = () => {
    const zoom = 15;
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.longitude - 0.008}%2C${coordinates.latitude - 0.005}%2C${coordinates.longitude + 0.008}%2C${coordinates.latitude + 0.005}&layer=mapnik&marker=${coordinates.latitude}%2C${coordinates.longitude}`;
    
    if (Platform.OS === 'web') {
      return (
        <View style={styles.mapWrapper}>
          <iframe
            title="Business Location"
            width="100%"
            height="180"
            frameBorder="0"
            scrolling="no"
            style={{ borderRadius: 0 }}
            src={mapUrl}
          />
        </View>
      );
    }

    // For native, show a static image placeholder with tap to open maps
    return (
      <TouchableOpacity 
        style={styles.mapPlaceholder}
        activeOpacity={0.9}
        onPress={openInMaps}
      >
        <View style={styles.mapPlaceholderContent}>
          <View style={styles.mapIconCircle}>
            <Ionicons name="map" size={32} color="#2563eb" />
          </View>
          <Text style={[styles.mapPlaceholderText, { color: textColor, fontFamily: FONT_BODY[fontKey] }]}>
            {isRTL ? 'اضغط لعرض الموقع على الخريطة' : 'Tap to view on map'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400 }}
      style={[styles.container, { borderColor }]}
    >
      <Text
        style={[
          styles.sectionTitle,
          { color: textColor, fontFamily: FONT_TITLE[fontKey] },
          isRTL && styles.textRTL,
        ]}
      >
        {isRTL ? 'الموقع' : 'Location'}
      </Text>

      <View style={[styles.mapContainer, { backgroundColor: cardBg, borderColor }]}>
        <StaticMapPreview />
        
        {/* Address Info */}
        <View style={[styles.addressContainer, isRTL && styles.addressContainerRTL]}>
          <View style={styles.addressIcon}>
            <Ionicons name="location" size={18} color="#2563eb" />
          </View>
          <View style={styles.addressContent}>
            <Text
              style={[
                styles.addressText,
                { color: textColor, fontFamily: FONT_BODY[fontKey] },
                isRTL && styles.textRTL,
              ]}
              numberOfLines={2}
            >
              {displayAddress}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={[styles.actionButtons, isRTL && styles.actionButtonsRTL]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#2563eb' }]}
            activeOpacity={0.8}
            onPress={openDirections}
          >
            <Ionicons name="navigate" size={18} color="#ffffff" />
            <Text style={[styles.actionButtonText, { fontFamily: FONT_BODY[fontKey] }]}>
              {isRTL ? 'الاتجاهات' : 'Directions'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: isDark ? '#334155' : '#f1f5f9' }]}
            activeOpacity={0.8}
            onPress={openInMaps}
          >
            <Ionicons name="open-outline" size={18} color={isDark ? '#f1f5f9' : '#0f172a'} />
            <Text 
              style={[
                styles.actionButtonText, 
                { fontFamily: FONT_BODY[fontKey], color: isDark ? '#f1f5f9' : '#0f172a' }
              ]}
            >
              {isRTL ? 'فتح الخريطة' : 'Open Map'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: '600',
  },
  mapContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  mapWrapper: {
    height: 180,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderContent: {
    alignItems: 'center',
    gap: 12,
  },
  mapIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 14,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    gap: 12,
  },
  addressContainerRTL: {
    flexDirection: 'row-reverse',
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContent: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 4,
    gap: 12,
  },
  actionButtonsRTL: {
    flexDirection: 'row-reverse',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
