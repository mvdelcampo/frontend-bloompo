import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const user = {
    username: 'valen_habits',
    fullName: 'Valentina González',
    email: 'valen@example.com',
    level: 3,
    coins: 250,
    profileImage: require('@/assets/images/gymhabit.jpg'), // imagen local o reemplazá por una URL
  };

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <Image source={user.profileImage} style={styles.avatar} />

        <Text style={styles.username}>@{user.username}</Text>
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.level}</Text>
            <Text style={styles.statLabel}>Nivel</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{user.coins}</Text>
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
