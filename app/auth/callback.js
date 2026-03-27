import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    // On web: Supabase detects the session from the URL hash/params via
    // detectSessionInUrl. We listen for the SIGNED_IN event rather than
    // calling getSession() immediately (which races against URL parsing).
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        subscription.unsubscribe();
        router.replace('/(tabs)');
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        subscription.unsubscribe();
        router.replace('/(auth)/login');
      }
    });

    // Fallback: if already have a session (native deep-link callback)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        subscription.unsubscribe();
        router.replace('/(tabs)');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.accent} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
