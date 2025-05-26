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
    Fredoka: require('../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf')
  });
  const loggedIn = false;

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!loggedIn ?
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
        :
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      }
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}