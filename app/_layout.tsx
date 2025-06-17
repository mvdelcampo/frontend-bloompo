import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';

export const storeToken = async (token: string) => {
  try {
    await SecureStore.setItemAsync('jwtToken', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const getToken = async () => {
  try {
    return await SecureStore.getItemAsync('jwtToken');
  } catch (error) {
    console.error('Error getting token:', error);
  }
};

export const deleteToken = async () => {
  try {
    await SecureStore.deleteItemAsync('jwtToken');
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};

export const storeData = async (username: string) => {
  try {
    await SecureStore.setItemAsync('username', username)
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const getData = async () => {
  try {
    const username = await SecureStore.getItemAsync('username');
    return { username: username };
  } catch (error) {
    console.error('Error getting data:', error);
    return { username: ''};
  }
};

export const deleteData = async () => {
  try {
    await SecureStore.deleteItemAsync('username');
  } catch (error) {
    console.error('Error deleting data:', error);
  }
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Fredoka: require('../assets/fonts/Fredoka-VariableFont_wdth,wght.ttf'),
    Baloo2: require('../assets/fonts/Baloo2-VariableFont_wght.ttf'),
    Baloo2Bold: require('../assets/fonts/Baloo2-Bold.ttf'),
    Baloo2ExtraBold: require('../assets/fonts/Baloo2-ExtraBold.ttf')
  });
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
        const checkToken = async () => {
            try {
                const token =await getToken();
                if (token) {
                    // Token exists, navigate to the main page
                    setIsLoggedIn(true);
                } else {
                    // No token, login page
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.log('Error retrieving token:', error);
                setIsLoggedIn(false);
            }
        };
        checkToken();
    }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!isLoggedIn ?
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

