import { Image } from "expo-image";
import { useRouter } from "expo-router";
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
import { login } from "../../services/api";
import { useState } from "react";
import { storeData, storeToken } from "../_layout";

export default function LoginScreen() {
	const router = useRouter();
	const [mail, setMail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		try {
			const response = await login({ mail, password });
			if (response.status == 200) {
				console.log("Login exitoso:", response.data.message);

				console.log("token: ", response.data.token);
				console.log("userId: ", response.data.userId);

				await storeToken(response.data.token);
				await storeData(response.data.userId);

				router.replace("/(tabs)"); // Redirige al layout de tabs
			} else if (response.status == 401) {
				Alert.alert("Error", response.data.error); // TODO ver mensaje
			}
		} catch (error: any) {
			if (error?.response && error.response.status === 401) {
				Alert.alert(
					"Error",
						"Los datos ingresados no son correctos. Vuelve a intentarlo"
				);
			} else {
				Alert.alert(
					"Error",
					"Ocurrió un error inesperado al iniciar sesión. Vuelve a intentarlo"
				);
				
			}
			console.error("Error login:", error);
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
		>
			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				<SafeAreaView style={styles.safeArea}>
					<View style={styles.container}>
						<View style={styles.header}>
							<Text style={styles.appName}>BLOOMPO</Text>
						</View>

						<View style={styles.imageContainer}>
							<Image
								style={styles.image}
								source={require("@/assets/images/bloompo.png")}
							/>
						</View>
						<View style={styles.baseFixed}>
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
							<TouchableOpacity
								style={styles.button1}
								onPress={handleLogin}
							>
								<Text style={styles.buttonText}>
									Iniciar sesión
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.button2}
								onPress={() => router.push("/(auth)/register")}
							>
								<Text style={styles.buttonText}>
									¿No tienes cuenta aún?
								</Text>
								<Text style={styles.buttonText}>
									¡Regístrate!
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
		paddingTop: 50, // deja el texto arriba, separado del borde
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
		fontFamily: "Baloo2ExtraBold",
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
		position: "absolute",
		bottom: "10%", // aproximadamente en mitad de la imagen
		width: "85%",
		height: "50%",
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
	baseFixed: {
		width: "85%",
		backgroundColor: Colors.wingsBloompo,
		borderRadius: 16,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5,
		padding: 20,
		marginVertical: 0,
		marginTop: -150, // para que se superponga un poco a la imagen
	},
	input: {
		padding: 10,
		backgroundColor: Colors.backgroundWhite, // fondo blanco
		borderRadius: 10, // bordes redondeados
		width: "90%",
		textAlign: "center",
		fontSize: 16,
		marginVertical: 8,
	},
	label: {
		marginBottom: 2,
		marginTop: 4,
		color: Colors.darkGrey, // marrón oscuro
		fontSize: 20,
		fontWeight: "700",
		fontFamily: "Fredoka",
	},
	button1: {
		backgroundColor: Colors.bloompoYellowSaturated,
		borderRadius: 10,
		padding: 6,
		paddingHorizontal: 15,
		margin: 12,
		width: "70%",
		textAlign: "center",
		alignItems: "center",
	},
	button2: {
		backgroundColor: Colors.bloompoYellow,
		borderRadius: 10,
		padding: 6,
		paddingHorizontal: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: Colors.darkGrey,
		fontSize: 18,
		fontWeight: "700",
	},
});
