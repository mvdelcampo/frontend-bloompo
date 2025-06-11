import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        title: ''
      }}
    >
      <Stack.Screen name="login" options={{ title: 'Iniciar sesión', headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Registrarse', headerShown: false}} />
      <Stack.Screen name="add-photo" options={{ title: 'Agregar foto', headerShown: false, gestureEnabled: false }} />
    </Stack>
    
  );
}
