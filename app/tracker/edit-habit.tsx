import {
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { useState } from "react";

const groupsColors = [
    Colors.strongPeach,
    Colors.bloompoYellow,
    Colors.mintGreen,
    Colors.pinkCoral,
    Colors.bloompoYellowSaturated,
    Colors.babyBlue,
    Colors.strongBlue,
];

export default function CreateGroupScreen() {
    const [email, setEmail] = useState("");
    const [friends, setFriends] = useState<string[]>([]);

    const addFriend = () => {
        if (email.trim() !== "" && !friends.includes(email.trim())) {
            setFriends([...friends, email.trim()]);
            setEmail("");
        }
    };

    const removeFriend = (email: string) => {
        setFriends(friends.filter((f) => f !== email));
    };

    const handleSaveGroup = () => {
        // TODO logica
        // Si es exitosa:
        console.log("save group");
        //router.replace('/(tabs)/tracker');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Editar hábito</Text>
                <View style={styles.base}>
                    <Text style={styles.label}>Nombre:</Text>
                    <TextInput style={styles.input} placeholder="Mi grupo" />
                    <Text style={styles.label}>Color:</Text>

                    <View style={styles.colorsRow}>
                        {groupsColors.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.colorsCircle,
                                    { backgroundColor: color },
                                ]}
                                onPress={() => {
                                    console.log("Color seleccionado:", color);
                                }}
                            />
                        ))}
                    </View>

                    <Text style={styles.label}>Integrantes:</Text>

                    <View style={styles.emailInputContainer}>
                        <View style={styles.tagsContainer}>
                            {friends.map((friend, index) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>{friend}</Text>
                                    <TouchableOpacity
                                        onPress={() => removeFriend(friend)}
                                    >
                                        <Text style={styles.tagRemove}>X</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                            <View style={styles.inputWithButton}>
                                <TextInput
                                    placeholder="Escribe su correo electrónico"
                                    value={email}
                                    onChangeText={setEmail}
                                    onSubmitEditing={addFriend}
                                    style={styles.tagInput}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity onPress={addFriend}>
                                    <Text style={styles.addSign}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.button1}
                        onPress={handleSaveGroup}
                    >
                        <Text style={styles.buttonText}>Guardar</Text>
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
        paddingHorizontal: 10,
        padding: 20, // deja el texto arriba, separado del borde
        backgroundColor: Colors.backgroundWhite,
        justifyContent: "center", // alineamos todo arriba
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        color: Colors.darkGrey,
        fontSize: 30,
        fontWeight: "bold",
        alignContent: "flex-start",
        textAlign: "center",
        margin: 10,
        justifyContent: "flex-start",
    },
    headerIcon: {
        width: 80,
        height: 80,
    },

    base: {
        position: "relative",
        width: "85%",
        height: "85%",
        backgroundColor: Colors.wingsBloompo,
        borderRadius: 16,
        justifyContent: "flex-start",
        paddingTop: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // sombra para android
    },
    colorsRow: {
        flexDirection: "row",
        marginTop: 8,
    },
    colorsCircle: {
        width: 30,
        height: 30,
        borderRadius: 30,
        marginTop: 4,
        marginBottom: 4,
        marginHorizontal: 5,
        borderColor: Colors.darkGrey,
        borderWidth: 2,
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
        marginBottom: 4,
        marginTop: 12,
        color: Colors.darkGrey, // marrón oscuro
        fontSize: 20,
        fontWeight: "700",
        fontFamily: "Fredoka",
    },
    button1: {
        backgroundColor: Colors.bloompoYellow,
        borderRadius: 10,
        padding: 6,
        paddingHorizontal: 15,
        margin: 12,
        marginBottom: 20,
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
    buttonAdd: {
        marginTop: 10,
        backgroundColor: Colors.mintGreen,
        borderRadius: 20,
        alignItems: "center",
        width: 30,
        height: 30,
        textAlign: "center",
    },
    buttonDelete: {
        marginTop: 10,
        backgroundColor: Colors.red,
        borderRadius: 20,
        alignItems: "center",
        textAlign: "center",
        width: 30,
        height: 30,
    },
    friendItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Colors.darkGrey,
    },
    text: {
        color: Colors.darkGrey,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 14,
        marginTop: 5,
        marginRight: 5,
    },
    emailInputContainer: {
        width: "100%",
        marginVertical: 8,
        paddingHorizontal: 20,
    },

    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        backgroundColor: Colors.backgroundWhite,
        borderRadius: 10,
        padding: 8,
        marginTop: 8,
    },

    tag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.lightPeach,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 4,
    },

    tagText: {
        color: Colors.darkGrey,
        marginRight: 6,
    },

    tagRemove: {
        color: Colors.darkGrey,
        fontWeight: "bold",
    },

    tagInput: {
        minWidth: 100,
        flexGrow: 1,
        fontSize: 16,
        padding: 4,
    },
    inputWithButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    addSign: {
        color: Colors.darkGrey,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 26,
        alignSelf: "center",
    },
});
