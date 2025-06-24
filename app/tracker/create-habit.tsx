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
import { router, Stack } from "expo-router";
import { addGroupToHabit, createHabit, getUserGroups } from "@/services/api";

const icons = {
	// TODO usar lo de Vale?
	gym: require("@/assets/icons/gymlogo.png"),
	art: require("@/assets/icons/artlogo.png"),
	healthy: require("@/assets/icons/healthylogo.png"),
	meditate: require("@/assets/icons/meditatelogo.png"),
	read: require("@/assets/icons/reedlogo.png"),
	sleep: require("@/assets/icons/sleeplogo.png"),
	walk: require("@/assets/icons/walklogo.png"),
	water: require("@/assets/icons/waterlogo.png"),
};

type Group = {
	id: string;
	name: string;
	color: string;
	selected: boolean;
};

export default function CreateHabitScreen() {
	const [name, setName] = useState("");
	const [selectedIcon, setSelectedIcon] = useState("");
	const [frequency, setFrequency] = useState(1);
	const [groups, setGroups] = useState<Group[]>([]);
	const [selectedGroupsIds, setSelectedGroupsIds] = useState<string[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const responseGroups = await getUserGroups();
				const data = responseGroups.data.groups.map((group: any) => ({
					id: group.id,
					name: group.name,
					color: group.color,
					selected: false, // Inicialmente no está seleccionado
				}));
				setGroups(data);
			} catch (error) {
				console.error("Error al cargar grupos:", error);
			}
		};
		fetchData();
	}, []);

	const handlePressGroup = (group: Group) => {
		if (!group) return;
		if (group.selected) {
			// Si el grupo ya está seleccionado, lo deseleccionamos
			setGroups(
				groups.map((g) =>
					g.id === group.id ? { ...g, selected: false } : g
				)
			);
			removeGroup(group.id);
		} else {
			// Si el grupo no está seleccionado, lo seleccionamos
			setGroups(
				groups.map((g) =>
					g.id === group.id ? { ...g, selected: true } : g
				)
			);
			addGroup(group.id);
		}
	};

	const addGroup = (groupId: string) => {
		if (!selectedGroupsIds.includes(groupId)) {
			setSelectedGroupsIds([...selectedGroupsIds, groupId]);
		}
	};

	const removeGroup = (groupId: string) => {
		setSelectedGroupsIds(selectedGroupsIds.filter((g) => g !== groupId));
	};

	const increment = () => {
		if (frequency < 7) setFrequency((prev) => prev + 1);
	};

	const decrement = () => {
		if (frequency > 1) setFrequency((prev) => prev - 1);
	};

	const handleSaveHabit = async () => {
		if (!name || !selectedIcon || !frequency) {
			Alert.alert(
				"Error",
				"Tenés que completar todos los campos para Guardar"
			);
			return;
		}

		try {
			const habitData = {
				habit: {
					name: name,
					icon: selectedIcon,
					frequency: frequency,
					color: "no color",
				},
			};
			console.log(habitData);
			console.log("selectedGroupsIds:", selectedGroupsIds);

			const response = await createHabit(habitData);
			if (response.status == 201 || response.status == 200) {
				//console.log("Habito creado:", response.data);

				// si no se selecciona ningun grupo, no se asocia a ninguno, pero queda guardado como del usuario
				for (let i = 0; i < selectedGroupsIds.length; i++) {
					try {
						await addGroupToHabit({
							habitName: name,
							newGroupId: selectedGroupsIds[i],
						});
					} catch (error) {
						console.error(
							`Error al agregar habito a grupo ${selectedGroupsIds[i]}:`,
							error
						);
					}
				}
				Alert.alert("Éxito", "Hábito creado exitosamente!");
				router.back();
			}
		} catch (error) {
			// console.error("Error al crear hábito:", error);
			if (
				typeof error === "object" &&
				error !== null &&
				"response" in error &&
				typeof (error as any).response === "object"
			) {
				console.log((error as any).response?.data);
				Alert.alert(
					"Error",
					(error as any).response?.data.error
				);	
			}
		}
	};

	return (
		<>
			<Stack.Screen
				options={{
					title: "Crear hábito",
					headerShown: true,
					headerTintColor: "black",
					headerBackTitle: "Atrás",
				}}
			/>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					<Text style={styles.title}>Crear hábito</Text>
					<View style={styles.base}>
						<Text style={styles.label}>Nombre:</Text>
						<TextInput
							style={styles.input}
							placeholder="Mi hábito"
							value={name}
							onChangeText={setName}
						/>
						<Text style={styles.label}>Elige un ícono:</Text>

						<View style={styles.iconsRow}>
							{Object.entries(icons).map(([key, source]) => (
								<TouchableOpacity
									key={key}
									style={[
										styles.iconCircle,
										key === selectedIcon &&
											styles.selectedIcon,
									]}
									onPress={() => {
										setSelectedIcon(key);
									}}
								>
									<Image
										source={source}
										style={styles.iconImage}
									/>
								</TouchableOpacity>
							))}
						</View>

						<Text style={styles.label}>
							¡Agrega tu hábito a un grupo!
						</Text>
						<Text style={styles.label2}>
							(opcional: si no lo haces se guardará como hábito
							personal)
						</Text>

						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							style={{ maxHeight: 100, marginHorizontal: 10 }}
						>
							{groups.map((item, index) => (
								<TouchableOpacity
									key={index}
									onPress={() => handlePressGroup(item)}
								>
									<View
										key={index}
										style={[
											styles.box,
											{
												backgroundColor: item.color,
											},
											item.selected
												? styles.selectedBox
												: {},
											,
										]}
									>
										<Text style={styles.groupName}>
											{item.name}
										</Text>
									</View>
								</TouchableOpacity>
							))}
						</ScrollView>
						<Text style={styles.label}>Frecuencia semanal:</Text>
						<View style={styles.selector}>
							<TouchableOpacity
								onPress={decrement}
								style={styles.buttonFreq}
							>
								<Text style={styles.sign}>−</Text>
							</TouchableOpacity>
							<Text style={styles.frequency}>{frequency}</Text>
							<TouchableOpacity
								onPress={increment}
								style={styles.buttonFreq}
							>
								<Text style={styles.sign}>+</Text>
							</TouchableOpacity>
						</View>
						<TouchableOpacity
							style={styles.button1}
							onPress={handleSaveHabit}
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
		backgroundColor: Colors.backgroundWhite,
		justifyContent: "flex-start", // alineamos todo arriba
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
		height: "88%",
		backgroundColor: Colors.wingsBloompo,
		borderRadius: 16,
		justifyContent: "flex-start",
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
		width: "60%",
		height: "8%",
		fontSize: 16,
		marginVertical: 8,
		textAlign: "center",
	},
	label: {
		marginVertical: 4,
		color: Colors.darkGrey, // marrón oscuro
		fontSize: 18,
		fontWeight: "700",
		fontFamily: "Fredoka",
	},
	label2: {
		marginBottom: 2,
		color: Colors.darkGrey, // marrón oscuro
		fontSize: 16,
		fontWeight: "600",
		fontFamily: "Fredoka",
		textAlign: "center",
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
		width: 80,
		height: 40,
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
