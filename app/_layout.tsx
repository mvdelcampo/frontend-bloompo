import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Fredoka: require('../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf'),
    Baloo2: require('../assets/fonts/Baloo2-VariableFont_wght.ttf'),
    Baloo2Bold: require('../assets/fonts/Baloo2-Bold.ttf'),
    Baloo2ExtraBold: require('../assets/fonts/Baloo2-ExtraBold.ttf')
  });
  const loggedIn = false;

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!loggedIn ?
        <Stack screenOptions={{ headerTitle: '', headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false, title: ''}} />
        </Stack>
        :
        <Stack screenOptions={{ headerTitle: '', headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ gestureEnabled: true}} />
          <Stack.Screen name="+not-found" />
        </Stack>
      }
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}