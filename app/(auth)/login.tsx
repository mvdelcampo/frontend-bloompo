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

export default function LoginScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.appName}>BLOOMPO</Text>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={require("@/assets/images/bloompo.png")}
                    />
                </View>
                <View style={styles.base}>
                    <Text style={styles.label}>Correo electrónico</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="hello@example"
            />
            <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="***************"
            />
        <TouchableOpacity
            style={styles.button1}
            onPress={() => console.log("Iniciar sesión")}
        >
            <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.button2}
            onPress={() => console.log("Registrarse")}
        >
            <Text style={styles.buttonText}>¿No tienes una cuenta aún?</Text>
        </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.backgroundBloompo,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 50, // deja el texto arriba, separado del borde
        backgroundColor: Colors.backgroundBloompo,
        justifyContent: "flex-start", // alineamos todo arriba
        alignItems: "center",
    },
    appName: {
        color: Colors.lettersBloompo,
        fontSize: 48,
        fontWeight: "bold",
        fontFamily: "Fredoka",
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
  input: {
        padding: 10,
        backgroundColor: Colors.backgroundWhite, // fondo blanco
        borderRadius: 10, // bordes redondeados
        paddingHorizontal: 30,
        fontSize: 16,
        marginVertical: 8,
    },
    label: {
      marginBottom: 2,
      marginTop: 4,
        color: Colors.lettersBloompo, // marrón oscuro
        fontSize: 20,
        fontWeight: "700",
        fontFamily: "Fredoka",
  },
  button1: {
    backgroundColor: Colors.bloompoYellowSaturated,
    borderRadius: 10,
    padding: 6,
    paddingHorizontal: 15,
    margin: 12
  },
  button2: {
    backgroundColor: Colors.bloompoYellow,
    borderRadius: 10,
    padding: 6,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: Colors.lettersBloompo,
    fontSize: 16,
    fontWeight: "600",
  }
});
