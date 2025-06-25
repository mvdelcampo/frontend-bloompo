import { Image } from "expo-image";
import {
	SafeAreaView,
	TextInput,
	Platform,
	StyleSheet,
	View,
	Text,
	Button,
	TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { editUser } from "@/services/api";
import * as FileSystem from "expo-file-system";

export default function AddPhotoScreen() {
	const router = useRouter();

	const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

	const handleUploadPhoto = async () => {
		if (!selectedImage) return;

		const uriParts = selectedImage.split(".");
		const fileType = uriParts[uriParts.length - 1];

		const formData = new FormData();
		formData.append("photo", {
			uri: selectedImage,
			name: `photo.${fileType}`,
			type: `image/${fileType}`,
		} as any);

		try {
			const response = await editUser(formData);
			if (response.status !== 200) {
				throw new Error("Error al actualizar el usuario");
			}
			//console.log("Usuario actualizado:", response.data);
			router.replace("/(tabs)");
		} catch (err) {
			console.error("Error al subir foto:", err);
			alert("Hubo un problema al subir la foto.");
		}
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.appName}>BLOOMPO</Text>
					<Image
						source={require("../../assets/icons/bloompo-icon.png")}
						style={styles.headerIcon}
						resizeMode="contain"
					/>
				</View>

				<Text style={styles.title}>
					¿Deseas agregar una foto de perfil? (opcional)
				</Text>
				<View style={styles.base}>
					<View style={styles.imageOptions}>
						<TouchableOpacity
							onPress={pickImageFromLibrary}
							style={styles.button3}
						>
							<Text style={styles.buttonText}>Abrir galería</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={takePhoto}
							style={styles.button3}
						>
							<Text style={styles.buttonText}>Tomar foto</Text>
						</TouchableOpacity>
					</View>

					{selectedImage && (
						<>
							<Image
								source={{ uri: selectedImage }}
								style={styles.image}
							/>
							<TouchableOpacity
								style={styles.button2}
								onPress={handleUploadPhoto}
							>
								<Text style={styles.buttonText}>Continuar</Text>
							</TouchableOpacity>
						</>
					)}
					<TouchableOpacity
						style={styles.button1}
						onPress={() => router.replace("/(tabs)")}
					>
						<Text style={styles.buttonText}>Omitir</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: Colors.backgroundWhite,
	},
	container: {
		flex: 1,
		paddingHorizontal: 20,
		paddingTop: 10, // deja el texto arriba, separado del borde
		backgroundColor: Colors.backgroundWhite,
		justifyContent: "flex-start", // alineamos todo arriba
		alignItems: "center",
	},
	imageOptions: {
		flexDirection: "column",
		gap: 10,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	headerIcon: {
		width: 80,
		height: 80,
	},
	appName: {
		color: Colors.lettersBloompo,
		fontSize: 48,
		fontWeight: "bold",
		fontFamily: "Baloo2ExtraBold",
	},
	title: {
		color: Colors.lettersBloompo,
		fontSize: 20,
		fontWeight: "bold",
		fontFamily: "Fredoka",
		alignContent: "center",
		textAlign: "center",
		margin: 20,
		marginTop: 50,
	},
	subtitle: {
		color: Colors.lettersBloompo,
		fontSize: 14,
		fontFamily: "Fredoka",
		textAlign: "center",
	},
	image: {
		width: 120,
		height: 120,
		borderRadius: 10,
		margin: 10,
	},
	base: {
		flexGrow: 1, // crece con el contenido
		position: "relative",
		width: "85%",
		minHeight: 250, // altura mínima para cuando no hay imagen
		maxHeight: 325, // limitar para que no se pase
		backgroundColor: Colors.wingsBloompo,
		borderRadius: 16,
		padding: 16,
		justifyContent: "space-evenly", // mejor distribución
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5, // sombra para android
	},
	label: {
		color: Colors.lettersBloompo, // marrón oscuro
		fontSize: 20,
		fontWeight: "700",
		fontFamily: "Fredoka",
		marginBottom: 10,
	},
	button1: {
		backgroundColor: Colors.bloompoYellow,
		borderRadius: 10,
		padding: 6,
		paddingHorizontal: 15,
		marginTop: 10,
	},
	button2: {
		backgroundColor: Colors.bloompoYellowSaturated,
		borderRadius: 10,
		padding: 6,
		paddingHorizontal: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	button3: {
		backgroundColor: Colors.lightPeach,
		borderRadius: 10,
		padding: 6,
		paddingHorizontal: 25,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: Colors.lettersBloompo,
		fontSize: 18,
		fontWeight: "700",
	},
});
