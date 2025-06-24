import React, { useEffect, useState } from 'react';
import { Animated, Easing, ActivityIndicator, View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Alert, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserData, editUser } from '@/services/api';
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';


export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const rotateAnim = useState(new Animated.Value(0))[0];
  const router = useRouter();

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  type User = {
    id: string,
    mail: string,
    username: string,
    coins: number,
    photo: string,
    photoBase64: string
  };

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted === false) {
      alert("Se necesita permiso para acceder a la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      "Cambiar foto de perfil",
      "Selecciona una opción:",
      [
        {
          text: "Abrir galería",
          onPress: pickImageFromLibrary,
        },
        {
          text: "Tomar foto",
          onPress: takePhoto,
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = new FormData();
      updatedData.append("username", editedUsername);
      updatedData.append("mail", editedEmail);

      if (selectedImage) {
        const uriParts = selectedImage.split(".");
        const fileType = uriParts[uriParts.length - 1];
        updatedData.append("photo", {
          uri: selectedImage,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await editUser(updatedData);
      if (response.status === 200) {
        setUser(response.data);
        setIsEditing(false);
      } else {
        Alert.alert("Error", "No se pudo actualizar el perfil.");
      }
    } catch (err) {
      console.error("Error al guardar:", err);
      Alert.alert("Error", "Hubo un problema al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      await SecureStore.deleteItemAsync('userId');
      router.replace('/(auth)');
    } catch (err) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  useEffect(() => {
    const spinning = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    if (loading) {
      spinning.start();
    } else {
      spinning.stop();
    }

    return () => spinning.stop();
  }, [loading]);



  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      try {
        const response = await getUserData();
        setUser(response.data);
        console.log(Object.keys(response.data));
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        Alert.alert('Error', 'No se pudo cargar usuario.');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
          <Animated.Image
            source={require('../../assets/images/bloompo-cowboy.png')}
            style={[styles.rotatingImage, { transform: [{ rotate: spin }] }]}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.container}>

        {loading && (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
            <Animated.Image
              source={require('../../assets/images/bloompo-cowboy.png')}
              style={[styles.rotatingImage, { transform: [{ rotate: spin }] }]}
            />
          </View>
        )}


        {isEditing ? (
          <>
            <TouchableOpacity onPress={handleChangePhoto}>
              <Text style={{ color: Colors.darkGrey, textAlign: 'center', marginBottom: 20, fontWeight: "500" }}>
                Cambiar foto de perfil
              </Text>
              <Image
                source={{ uri: selectedImage || user?.photoBase64 }}
                style={styles.avatar}
              />

            </TouchableOpacity>
            <Text style={styles.label}>Nombre de usuario</Text>
            <TextInput
              style={styles.input}
              value={editedUsername}
              onChangeText={setEditedUsername}
              placeholder="example"
            />
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input}
              value={editedEmail}
              onChangeText={setEditedEmail}
              placeholder="hello@example"
            />
            <TouchableOpacity style={styles.button1} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2} onPress={() => setIsEditing(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image source={user?.photoBase64 ?
              { uri: user?.photoBase64 }
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

            <TouchableOpacity style={styles.editButton}
              onPress={() => {
                setIsEditing(true);
                if (user) {
                  setEditedUsername(user.username);
                  setEditedEmail(user.mail);
                }
              }}>
              <Text style={styles.editButtonText}>Editar perfil</Text>

            </TouchableOpacity>
            <TouchableOpacity style={[styles.editButton, styles.logoutButton]} onPress={handleLogout}>
              <Text style={[styles.editButtonText, { color: '#444' }]}>Cerrar sesión</Text>
            </TouchableOpacity>

          </>

        )}
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
    paddingTop: 50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: "center",
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
    backgroundColor: Colors.bloompoYellow,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // sombra para android
  },
  editButtonText: {
    fontSize: 16,
    color: Colors.darkGrey,
    fontWeight: "700"
  },
  input: {
    padding: 6,
    backgroundColor: Colors.backgroundWhite, // fondo blanco
    borderRadius: 10, // bordes redondeados
    width: "80%",
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
  },
  button1: {
    backgroundColor: Colors.bloompoYellowSaturated,
    borderRadius: 10,
    padding: 6,
    paddingHorizontal: 40,
    margin: 12,
    textAlign: "center",
    alignItems: "center",
    marginVertical: 15,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // sombra para android
  },
  button2: {
    backgroundColor: Colors.bloompoYellow,
    borderRadius: 10,
    padding: 6,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2, // sombra para android

  },
  buttonText: {
    color: Colors.darkGrey,
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    marginTop: 4,
    color: Colors.darkGrey,
    fontSize: 16,
    fontWeight: "700",
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  rotatingImage: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  logoutButton: {
    backgroundColor: '#ccc', 
    marginTop: 20 
  }
});
