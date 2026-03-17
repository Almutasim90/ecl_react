import '../global.css';
import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import {
  useFonts,
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { QuizProvider } from '../context/QuizContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Fallback timeout for web - show app even if fonts fail
  const [fontTimeout, setFontTimeout] = useState(false);

  useEffect(() => {
    // On web, set a timeout to show app even if fonts fail to load
    if (Platform.OS === 'web') {
      const timer = setTimeout(() => {
        setFontTimeout(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError || fontTimeout) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, fontTimeout]);

  // Show app if fonts loaded, or on error/timeout (with system fonts fallback)
  const shouldRender = fontsLoaded || fontError || fontTimeout;

  if (!shouldRender) {
    return null;
  }

  return (
    <GluestackUIProvider config={config}>
      <ThemeProvider>
        <AuthProvider>
          <QuizProvider>
            <StatusBar style="auto" />
            <Slot />
          </QuizProvider>
        </AuthProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
