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
    Alert,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { addGroupToHabit, createHabit, getUserGroups } from "@/services/api";
import { habitIcons } from "@/constants/habitIcons";

type Group = {
    id: string;
    name: string;
    color: string;
    selected: boolean;
};

export default function EditHabitScreen() {
    const { habitName: habitNameParam, habitGroups: habitGroupsParam } = useLocalSearchParams();
    const [userGroupsToShow, setUserGroupsToShow] = useState<Group[]>([]);
    //const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
    const [selectedGroupsIds, setSelectedGroupsIds] = useState<string[]>([]);

    const habitGroupIds = Array.isArray(habitGroupsParam)
        ? habitGroupsParam
        : habitGroupsParam
            ? [habitGroupsParam]
            : [];

    const habitName = Array.isArray(habitNameParam)
        ? habitNameParam[0] // tomá el primer valor si es un array
        : habitNameParam ?? "";


    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseGroups = await getUserGroups();
                const data = responseGroups.data.groups.map((group: any) => ({
                    id: group.id,
                    name: group.name,
                    color: group.color,
                    selected: false,
                }));
                const dataToShow = data.filter((g: Group) => !habitGroupIds.includes(g.id))
                setUserGroupsToShow(dataToShow);
            } catch (error) {
                console.error("Error al cargar grupos:", error);
            }
        };
        fetchData();
    }, []);


    const handlePressGroup = (groupId: string) => {

        setUserGroupsToShow((prevGroups) =>
            prevGroups.map((group) =>
                group.id === groupId
                    ? { ...group, selected: !group.selected }
                    : group
            )
        );

        setSelectedGroupsIds((prevSelected) =>
            prevSelected.includes(groupId)
                ? prevSelected.filter((id) => id !== groupId)
                : [...prevSelected, groupId]
        );
    };


    const handleAddGroupToHabit = async () => {
        //console.log(selectedGroupsIds)

        if (selectedGroupsIds.length === 0) {
            Alert.alert("Error", "No seleccionaste ningún grupo");
        } else {
            for (let i = 0; i < selectedGroupsIds.length; i++) {
                try {
                    const response = await addGroupToHabit({
                        habitName: habitName,
                        newGroupId: selectedGroupsIds[i],
                    });
                    console.log(response.data)
                } catch (error) {
                    console.error(
                        `Error al agregar habito a grupo ${selectedGroupsIds[i]}:`,
                        error
                    );
                    Alert.alert("Error", "Ocurrió un error al asociar el hábito al grupo. Vuelve a intentarlo.")
                }
            }
            Alert.alert("Éxito", "Hábito asociado al grupo exitosamente!");
            router.back();
        }


    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Editar hábito",
                    headerShown: true,
                    headerTintColor: "black",
                    headerBackTitle: "Atrás",
                }}
            />
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.title}>Asociá un grupo al hábito</Text>
                    <View style={styles.base}>
                        <Text style={styles.label}>Nombre del hábito:</Text>
                        <TextInput
                            style={styles.input}
                            value={habitName}
                            editable={false}
                        />

                        <Text style={styles.label2}>
                            Seleccioná los grupos a los que querés asociar este hábito:
                        </Text>


                        <FlatList
                            data={userGroupsToShow}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handlePressGroup(item.id)}>
                                    <View
                                        style={[
                                            styles.box,
                                            { backgroundColor: item.color },
                                            item.selected && styles.selectedBox,
                                        ]}
                                    >
                                        <Text style={styles.groupName}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.button1}
                            onPress={handleAddGroupToHabit}
                        >
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>
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
        paddingVertical: 40,
        backgroundColor: Colors.backgroundWhite,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        color: Colors.darkGrey,
        fontSize: 25,
        fontWeight: "bold",
        alignContent: "flex-start",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 10,
        justifyContent: "flex-start",
    },
    headerIcon: {
        width: 80,
        height: 80,
    },

    base: {
        position: "relative",
        width: "85%",
        height: "70%",
        backgroundColor: Colors.wingsBloompo,
        borderRadius: 16,
        justifyContent: "center",
        paddingTop: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // sombra para android
    },
    iconsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 10,
        marginBottom: 10,
    },
    iconCircle: {
        width: 55,
        height: 55,
        borderRadius: 30,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    iconImage: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    },
    input: {
        padding: 10,
        backgroundColor: Colors.backgroundWhite, // fondo blanco
        borderRadius: 10, // bordes redondeados
        width: "65%",
        height: "10%",
        fontSize: 16,
        marginVertical: 8,
        textAlign: "center",
    },
    label: {
        marginVertical: 4,
        color: Colors.darkGrey, // marrón oscuro
        fontSize: 18,
        fontWeight: "700",
        alignSelf: "center"
    },
    label2: {
        marginVertical: 10,
        color: Colors.darkGrey, // marrón oscuro
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        alignSelf: "center",
        paddingHorizontal: 12,
    },
    button1: {
        backgroundColor: Colors.bloompoYellow,
        borderRadius: 10,
        padding: 6,
        paddingHorizontal: 15,
        margin: 12,
        marginTop: 12,
        marginBottom: 15,
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
    box: {
        marginTop: 8,
        marginBottom: 8,
        margin: 5,
        width: 90,
        height: 50,
        borderRadius: 8,
        alignContent: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // sombra para android
    },
    selectedBox: {
        borderWidth: 2,
        borderColor: Colors.mediumGrey,
        shadowOpacity: 0,
    },
    selectedIcon: {
        borderWidth: 2,
        borderColor: Colors.mediumGrey,
    },
    groupName: {
        color: Colors.darkGrey,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 12,
    },
    selector: {
        flexDirection: "row",
        backgroundColor: "#FFF5EE",
        borderRadius: 25,
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginVertical: 6,
    },
    buttonFreq: {
        paddingHorizontal: 10,
    },
    sign: {
        fontSize: 24,
        color: "#333",
    },
    frequency: {
        fontSize: 20,
        fontWeight: "bold",
        marginHorizontal: 10,
    },
});
