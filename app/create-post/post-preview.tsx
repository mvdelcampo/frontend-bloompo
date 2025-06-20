import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, SafeAreaView, Alert } from 'react-native';
import { Colors } from "@/constants/Colors";
import * as SecureStore from 'expo-secure-store';
import { getUserHabits, createPost } from '@/services/api';
import { getHabitIcon } from '@/constants/habitIcons';


const dummyHabits = [
  { id: '1', name: 'Ir al gym', icon: require('../../assets/icons/gymlogo.png') },
  { id: '2', name: 'Leer 20 pag', icon: require('../../assets/icons/gymlogo.png') },
  { id: '3', name: 'Meditar antes de dormir', icon: require('../../assets/icons/gymlogo.png') },
];

export default function PostPreview() {
  const { imageUri } = useLocalSearchParams();
  const router = useRouter();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  type Habit = {
    id: string,
    name: string,
    icon: string,
    color: string
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await SecureStore.getItemAsync('userId');
        if (!id) {
          Alert.alert('Error', 'No se pudo recuperar el usuario.');
        }
        setUserId(id);
      } catch (err) {
        console.error('Error recuperando userId:', err);
        Alert.alert('Error', 'Hubo un problema al acceder al usuario.');
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const getHabitsByUser = async () => {
      if (!userId) return;

      try {
        const response = await getUserHabits(userId);
        console.log(response.data.habits);
        setHabits(response.data.habits);
      } catch (error) {
        console.error('Error al obtener hábitos del usuario:', error);
        Alert.alert('Error', 'No se pudieron cargar los hábitos.');
      }
    };

    getHabitsByUser();
  }, [userId]);

  const handleShare = async () => {
    console.log('Imagen:', imageUri);
    console.log('Hábito seleccionado:', selectedHabit?.name);
    if (!selectedHabit || !imageUri || !userId) {
      Alert.alert('Error', 'Faltan datos para compartir el post.');
      return;
    }

    if (!selectedHabit) {
      Alert.alert('Error', 'No se encontró el hábito seleccionado.');
      return;
    }

    try {
      await createPost({
        userId,
        habitName: selectedHabit.name,
        post_photo: imageUri as string,
      });

      Alert.alert('Éxito', 'Post compartido correctamente.');
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error al compartir el post:', err);
      Alert.alert('Error', 'No se pudo compartir el post.');
    }
    router.replace('/(tabs)'); // Volver a home
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Nueva Publicación</Text>

        <Image source={{ uri: imageUri as string }} style={styles.image} />

        <View style={styles.habitList}>
          {habits.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setSelectedHabit(item)}
              style={[
                styles.habitButton,
                selectedHabit === item && styles.habitButtonSelected,
              ]}
            >
              <Image source={getHabitIcon(item.icon)} style={styles.habitIcon} />
              <Text style={styles.habitText}>
                {item.name.length > 20 ? item.name.slice(0, 17) + '…' : item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[
          styles.shareButton,
          !selectedHabit ? styles.shareButtonDisabled : styles.shareButtonEnabled,
        ]} onPress={handleShare} disabled={!selectedHabit}>
          <Text style={styles.shareText}>Compartir</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'center'
  },
  image: {
    width: '70%',
    alignSelf: 'center',
    height: 300,
    borderRadius: 10,
    marginBottom: 30
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  habitList: {
    gap: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  habitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    maxWidth: '48%', // o 150 si preferís valor fijo
    flexGrow: 1,
  },
  habitButtonSelected: {
    backgroundColor: '#72B4F9',
  },
  habitIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  habitText: {
    fontSize: 16,
    fontWeight: '500',
    flexShrink: 1,
  },
  shareButton: {
    marginTop: 40,
    backgroundColor: Colors.bloompoYellowSaturated,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    opacity: 1,
  },
  shareButtonEnabled: {
    backgroundColor: Colors.bloompoYellowSaturated,
  },
  shareButtonDisabled: {
    backgroundColor: Colors.lightGrey,
  },
  shareText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
