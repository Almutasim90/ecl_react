import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function TabsLayout() {
  const { isDark } = useTheme();
  const { isInitialized } = useAuth();
  const insets = useSafeAreaInsets();
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const activeColor = '#7c3aed';
  const inactiveColor = isDark ? '#94a3b8' : '#64748b';

  const androidBottom = insets.bottom;

  if (!isInitialized) {
    return null;
  }

  // Auth is optional - guests can access the app
  // Only redirect if explicitly not initialized
  // Uncomment below to force login:
  // if (!isAuthenticated) {
  //   return <Redirect href={{ pathname: '/(auth)/login', params: { redirect: pathname } }} />;
  // }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: bgColor,
          borderTopColor: isDark ? '#1e293b' : '#e2e8f0',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : androidBottom + 8,
          paddingTop: 10,
          height: Platform.OS === 'ios' ? 85 : 60 + androidBottom,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="listening"
        options={{
          title: 'Listening',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'headset' : 'headset-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reading"
        options={{
          title: 'Reading',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tabs>
  );
}
