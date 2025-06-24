import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserData } from '@/services/api';


export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User|null>(null);
  
    type User = {
      id: string,
      mail: string,
      username: string,
      coins: number,
      photo: string,
      photoBase64: string
    };

  useEffect(() => {
      const getUser = async () => {
        try {
          const response = await getUserData();
          setUser(response.data);
          console.log(Object.keys(response.data));
        } catch (error) {
          console.error('Error al obtener usuario:', error);
          Alert.alert('Error', 'No se pudo cargar usuario.');
        }
      };
  
      getUser();
    }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <Image source={user?.photoBase64 ? 
          {uri: user?.photoBase64} 
          : require('../../assets/images/avatar_placeholder.png')} style={styles.avatar} />
        <Text style={styles.username}>@{user?.username}</Text>
        <Text style={styles.email}>{user?.mail}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user?.coins}</Text>
            <Text style={styles.statLabel}>Puntaje</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user?.coins}</Text>
            <Text style={styles.statLabel}>Monedas</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  stat: {
    alignItems: 'center',
    marginHorizontal: 30,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#555',
  },
  editButton: {
    backgroundColor: '#A7D397',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  editButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});
