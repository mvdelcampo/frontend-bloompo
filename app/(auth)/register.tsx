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

export default function RegisterScreen() {
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
                    Crea hábitos. Cuida a tu mascota. Conéctate con amigos.
                </Text>
                <Text style={styles.subtitle}>
                    Empieza tu viaje de crecimiento personal y grupal creando
                    pequeños desafíos. Sube pruebas, gana monedas, recibe apoyo
                    de tu grupo y ve cómo tu mascota virtual florece contigo.
                </Text>
          <View style={styles.base}>
    
            <Text style={styles.label}>Nombre de usuario</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="mperez"
            />
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
                    <Text style={styles.label}>Repita su contraseña</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="***************"
                    />
                    <Text style={styles.label}>¿Quieres agregar una foto de perfil?</Text>
            
                    <TouchableOpacity
                        style={styles.button1}
                        onPress={() => {
                            console.log("Register pressed");
                        }}
                    >
                        <Text style={styles.buttonText}>Crear cuenta</Text>
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
        fontFamily: "Fredoka",
    },
    title: {
        color: Colors.lettersBloompo,
        fontSize: 18,
        fontWeight: "bold",
        fontFamily: "Fredoka",
        alignContent: "center",
        textAlign: "center",
    },
    subtitle: {
        color: Colors.lettersBloompo,
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
        position: "absolute",
        bottom: "5%", // aproximadamente en mitad de la imagen
        width: "85%",
        height: "60%",
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
        paddingHorizontal: 30,
        fontSize: 16,
        marginVertical: 8,
    },
    label: {
        color: Colors.lettersBloompo, // marrón oscuro
        fontSize: 16,
        fontWeight: "700",
        fontFamily: "Fredoka",
    },
    button1: {
        backgroundColor: Colors.bloompoYellow,
        borderRadius: 10,
        padding: 6,
        paddingHorizontal: 15,
        margin: 12,
    },
    buttonText: {
        color: Colors.lettersBloompo,
        fontSize: 16,
        fontWeight: "700",
    },
});
