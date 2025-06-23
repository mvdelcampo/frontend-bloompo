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
	Alert,
	KeyboardAvoidingView,
	ScrollView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { register } from "../../services/api";
import { useState } from "react";

export default function RegisterScreen() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");

	const handleRegister = async () => {
		try {
			const response = await register({ mail, password, username });
			if (response.status == 201) {
				router.push("/(auth)/add-photo");
				Alert.alert("Éxito", "Cuenta creada exitosamente.");
			} else if (response.status == 400) {
				Alert.alert("Error", response.data.error); // TODO ver si sale bien el mensaje
			} else if (response.status == 500) {
				Alert.alert(
					"Error",
					"Ha ocurrido un error al crear la cuenta. Vuelve a intentarlo"
				);
			}
		} catch (error) {
			console.error("Error al registrar:", error);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
		>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "flex-start",
					alignItems: "center",
				}}
				keyboardShouldPersistTaps="handled"
			>
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
							Crea hábitos. Cuida a tu mascota. Conéctate con
							amigos.
						</Text>
						<Text style={styles.subtitle}>
							Empieza tu viaje de crecimiento personal y grupal
							creando pequeños desafíos. Sube pruebas, gana
							monedas, recibe apoyo de tu grupo y ve cómo tu
							mascota virtual florece contigo.
						</Text>
						<View style={styles.base}>
							<Text style={styles.label}>Nombre de usuario</Text>
							<TextInput
								style={styles.input}
								placeholder="mperez"
								value={username}
								onChangeText={setUsername}
							/>
							<Text style={styles.label}>Correo electrónico</Text>
							<TextInput
								style={styles.input}
								placeholder="hello@example"
								value={mail}
								onChangeText={setMail}
							/>
							<Text style={styles.label}>Contraseña</Text>
							<TextInput
								style={styles.input}
								placeholder="***************"
								value={password}
								onChangeText={setPassword}
								secureTextEntry={true}
							/>
							<Text style={styles.label}>
								Repita su contraseña
							</Text>
							<TextInput
								style={styles.input}
								placeholder="***************"
								secureTextEntry={true}
							/>
							<TouchableOpacity
								style={styles.button1}
								onPress={handleRegister}
							>
								<Text style={styles.buttonText}>
									Crear cuenta
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</SafeAreaView>
			</ScrollView>
		</KeyboardAvoidingView>
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
		color: Colors.darkGrey,
		fontSize: 48,
		fontWeight: "bold",
		fontFamily: "Baloo2ExtraBold",
	},
	title: {
		color: Colors.darkGrey,
		fontSize: 18,
		fontWeight: "bold",
		fontFamily: "Fredoka",
		alignContent: "center",
		textAlign: "center",
	},
	subtitle: {
		color: Colors.darkGrey,
		fontSize: 14,
		fontFamily: "Fredoka",
		textAlign: "center",
	},
	imageContainer: {
		width: "100%",
		height: 300,
		position: "relative", // para que el base se posicione relativo a esta vista
		alignItems: "center",
		justifyContent: "center",
	},
	image: {
		width: "100%",
		height: "100%",
		resizeMode: "contain",
	},
	base: {
		position: "relative",
		width: "85%",
		height: "62%",
		marginTop: 20,
		backgroundColor: Colors.wingsBloompo,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5, // sombra para android
	},
	input: {
		padding: 6,
		backgroundColor: Colors.backgroundWhite, // fondo blanco
		borderRadius: 10, // bordes redondeados
		width: "80%",
		textAlign: "center",
		fontSize: 16,
		marginVertical: 8,
	},
	label: {
		color: Colors.darkGrey, // marrón oscuro
		fontSize: 18,
		fontWeight: "700",
		fontFamily: "Fredoka",
	},
	button1: {
		backgroundColor: Colors.bloompoYellow,
		borderRadius: 10,
		padding: 6,
		paddingHorizontal: 15,
		margin: 12,
		width: "70%",
		textAlign: "center",
		alignItems: "center",
	},
	buttonText: {
		color: Colors.darkGrey,
		fontSize: 20,
		fontWeight: "700",
	},
});
