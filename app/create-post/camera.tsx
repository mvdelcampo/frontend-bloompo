import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { type CameraCapturedPicture } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function CameraScreen() {
    const router = useRouter();

    // Referencia a la cámara
    const cameraRef = useRef<CameraView>(null);

    // Permisos
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
    const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

    // Última foto
    const [lastPhotoUri, setLastPhotoUri] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            if (!cameraPermission?.granted) await requestCameraPermission();
            if (!microphonePermission?.granted) await requestMicrophonePermission();
            if (!mediaPermission?.granted) await requestMediaPermission();

            if (mediaPermission?.granted) {
                const assets = await MediaLibrary.getAssetsAsync({
                    mediaType: 'photo',
                    sortBy: 'creationTime',
                    first: 1,
                });
                if (assets.assets.length > 0) {
                    setLastPhotoUri(assets.assets[0].uri);
                }
            }
        })();
    }, []);

    const takePhoto = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({});
            console.log('Foto tomada:', photo.uri);
            router.push({
                pathname: '/create-post/post-preview',
                params: { imageUri: photo.uri }, // o result.assets[0].uri
            });
        }
    };

    const pickFromGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            console.log('Imagen seleccionada:', result.assets[0].uri);
           router.push({
                pathname: '/create-post/post-preview',
                params: { imageUri: result.assets[0].uri}, // o result.assets[0].uri
            });
        }
    };

    // Si no hay permisos
    if (!cameraPermission?.granted || !mediaPermission?.granted) {
        return (
            <View style={styles.centered}>
                <Text>Se necesitan permisos para usar la cámara y galería.</Text>
                <TouchableOpacity onPress={requestCameraPermission}>
                    <Text>Solicitar permisos</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} ref={cameraRef} facing="back" />

            <View style={styles.controls}>
                {/* Miniatura de galería */}
                <TouchableOpacity onPress={pickFromGallery}>
                    {lastPhotoUri ? (
                        <Image source={{ uri: lastPhotoUri }} style={styles.thumbnail} />
                    ) : (
                        <View style={[styles.thumbnail, styles.placeholder]} />
                    )}
                </TouchableOpacity>

                {/* Botón para sacar foto */}
                <TouchableOpacity onPress={takePhoto} style={styles.captureButton} />
                <View style={{ width: 60 }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    controls: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    placeholder: {
        backgroundColor: '#ccc',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        borderWidth: 4,
        borderColor: '#000',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
