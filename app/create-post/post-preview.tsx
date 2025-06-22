import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, SafeAreaView, Alert } from 'react-native';
import { Colors } from "@/constants/Colors";
import * as SecureStore from 'expo-secure-store';
import { getUserHabits, createPost } from '@/services/api';
import { getHabitIcon } from '@/constants/habitIcons';

export default function PostPreview() {
  const { imageUri } = useLocalSearchParams();
  const router = useRouter();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);

  type Habit = {
    id: string,
    name: string,
    icon: string,
    color: string
  };


  useEffect(() => {
    const getHabitsByUser = async () => {
      try {
        const response = await getUserHabits();
         const mapped = response.data.habits.map((habit: any, index: number) => ({
          id: `${habit.name}-${index}`,
          name: habit.name,
          icon: habit.icon,
          color: habit.color
        }));
        setHabits(mapped);
      } catch (error) {
        console.error('Error al obtener hábitos del usuario:', error);
        Alert.alert('Error', 'No se pudieron cargar los hábitos.');
      }
    };

    getHabitsByUser();
  }, []);

  const handleShare = async () => {

    if (!selectedHabit || !imageUri) {
      Alert.alert('Error', 'Faltan datos para compartir el post.');
      return;
    }


    if (!selectedHabit) {
      Alert.alert('Error', 'No se encontró el hábito seleccionado.');
      return;
    }

    const formData = new FormData();
    const rawUri = Array.isArray(imageUri) ? imageUri[0] : imageUri;
    const filename = rawUri.split('/').pop()!;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('post_photo', {
    uri: rawUri,
    name: filename,
    type,
    } as any);

    formData.append('habitName', selectedHabit.name);
    console.log(formData);

    try {
      await createPost(formData);


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
