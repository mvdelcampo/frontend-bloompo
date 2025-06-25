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
	KeyboardAvoidingView,
	Keyboard,
	TouchableWithoutFeedback
} from "react-native";

import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { useState, useEffect } from "react";
import {
	getGroup,
	editGroup,
	sendInvitation,
	deleteFriend,
	deleteGroup
} from "../../services/api";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

type EditableGroup = {
	name: string;
	color: string;
	pet_name: string;
	members: string[];
};

const groupsColors = [
	Colors.mintGreen,
	Colors.strongBlue,
	Colors.babyBlue,
	Colors.lightBlue,
	Colors.pinkCoral,
	Colors.red,
	Colors.strongPeach,
	Colors.bloompoYellow,
	//Colors.bloompoYellowSaturated,
];

export default function EditGroupScreen() {
	const router = useRouter();
	const { groupId } = useLocalSearchParams();
	const [selectedGroup, setSelectedGroup] = useState<EditableGroup>();
	const [selectedGroupId, setSelectedGroupId] = useState("");
	const [email, setEmail] = useState("");
	const [friends, setFriends] = useState<string[]>([]);
	const [groupName, setGroupName] = useState("");
	const [petName, setPetName] = useState("");
	const [selectedColor, setSelectedColor] = useState("");
	const [originalFriends, setOriginalFriends] = useState<string[]>([]);


	useEffect(() => {
		const fetchData = async () => {
			try {
				let id: string | undefined;
				if (Array.isArray(groupId)) {
					id = groupId[0];
				} else {
					id = groupId;
				}

				if (typeof id === "string") {
					console.log("id", id)
					setSelectedGroupId(id); // actualizo estado
					const response = await getGroup(id);
					const group: EditableGroup = {
						name: response.data.name,
						color: response.data.color,
						pet_name: response.data.pet_name,
						members: response.data.members.map(
							(member: { mail: string }) => member.mail
						),
					};
					setSelectedGroup(group);
					setFriends(group.members);
					setOriginalFriends([...group.members]); // esta se conserva igual
					setGroupName(group.name);
					setPetName(group.pet_name);
					setSelectedColor(group.color);
				}
			} catch (error) {
				console.error(
					"Error al cargar los datos del grupo al editar: ",
					error
				);
			}
		};
		fetchData();
	}, [groupId]);

	const addFriend = () => {
		if (email.trim() !== "" && !friends.includes(email.trim())) {
			setFriends([...friends, email.trim()]);
			setEmail("");
		}
	};

	const removeFriend = (email: string) => {
		setFriends(friends.filter((f) => f !== email));
	};

	const handleDeleteGroup = async () => {
		try {
			await deleteGroup({ groupId: selectedGroupId });
			router.back();
		} catch (error) {
			console.log("Ha ocurrido un error eliminando el grupo");
			Alert.alert("Error", "Ocurrió un error al eliminar el grupo. Vuelve a intentarlo")
		}
	}

	const handleSaveGroup = async () => {
		if (!groupName || !petName || !selectedColor) {
			Alert.alert(
				"Error",
				"Tenés que completar todos los campos para Guardar"
			);
			return;
		}

		try {
			const groupData = {
				_id: selectedGroupId,
				name: groupName,
				color: selectedColor,
				pet_name: petName,
			};

			const response = await editGroup(groupData);
			if (response.status == 200) {
				console.log("Grupo editado:", response.data);

				const added = friends.filter((f) => !originalFriends.includes(f));
				const removed = originalFriends.filter((f) => !friends.includes(f));

				for (const email of added ?? []) {
					try {
						await sendInvitation({
							friendEmail: email,
							groupId: selectedGroupId,
						});
					} catch (invitationError: any) {
						//console.error(
						//	`Error al invitar a ${email}:`,
						//	invitationError
						//
						if (invitationError.response?.status === 404) {
							Alert.alert("Error", `No se encontró ningún usuario con el correo ${email}. Verificá si lo escribiste bien.`);
						} else {
							console.error(`Error al invitar a ${email}:`, invitationError);
							Alert.alert("Error", `Ocurrió un error al invitar a ${email}. Intentá nuevamente.`);
						}

					}
				}

				for (const email of removed ?? []) {
					try {
						await deleteFriend({
							friendEmail: email,
							groupId: selectedGroupId,
						});
					} catch (invitationError) {
						console.error(
							`Error al eliminar a ${email}:`,
							invitationError
						);
					}
				}

				router.back();
			} else {
				Alert.alert(
					"Error",
					"Ocurrió un error al editar el grupo. Vuelve a intentarlo."
				);
			}
		} catch (error) {
			console.error("Error al editar grupo:", error);
		}
	};

	return (
		<>
			<Stack.Screen
				options={{
					title: "Editar grupo",
					headerShown: true,
					headerTintColor: "black",
					headerBackTitle: "Atrás",
				}}
			/>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}>
					<View style={styles.container}>
						<View style={styles.header}>
							<Text style={styles.title}>Editar grupo</Text>
							<TouchableOpacity
								style={styles.deleteIcon}
								onPress={() => {
									Alert.alert(
										'¿Estás seguro que querés eliminar este grupo?',
										'Esta acción no se puede deshacer.',
										[
											{
												text: 'Cancelar',
												style: 'cancel',
											},
											{
												text: 'Eliminar',
												onPress: () => handleDeleteGroup(),
												style: 'destructive',
											},
										],
										{ cancelable: true }
									);
								}}
							>
								<IconSymbol
									name="trash"
									size={26}
									color={Colors.darkGrey}
								/>
							</TouchableOpacity>
						</View>

						<View style={styles.base}>
							<Text style={styles.label}>Nombre:</Text>
							<TextInput
								style={styles.input}
								value={groupName}
								onChangeText={setGroupName}
							/>
							<Text style={styles.label}>Color:</Text>

							<View style={styles.colorsRow}>
								{groupsColors.map((color, index) => (
									<TouchableOpacity
										key={index}
										style={[
											styles.colorsCircle,
											{ backgroundColor: color },
											color === selectedColor &&
											styles.selectedColorCircle,
										]}
										onPress={() => {
											setSelectedColor(color);
										}}
									/>
								))}
							</View>

							<Text style={styles.label}>Miembros del grupo:</Text>

							<View style={styles.emailInputContainer}>
								<View style={styles.tagsContainer}>
									{friends.map((friend, index) => (
										<View key={index} style={styles.tag}>
											<Text style={styles.tagText}>
												{friend}
											</Text>
											<TouchableOpacity
												onPress={() => removeFriend(friend)}
											>
												<Text style={styles.tagRemove}>
													X
												</Text>
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

							<Text style={styles.label}>
								Nombre de la mascota grupal:
							</Text>
							<TextInput
								style={styles.input}
								placeholder="Milo"
								value={petName}
								onChangeText={setPetName}
							/>

							<TouchableOpacity
								style={styles.button1}
								onPress={handleSaveGroup}
							>
								<Text style={styles.buttonText}>
									Guardar
								</Text>
							</TouchableOpacity>

						</View>
					</View>

			</KeyboardAvoidingView>


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
		justifyContent: "center", // centra el título
		width: "100%",
		position: "relative",
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
		width: "90%",
		height: "88%",
		backgroundColor: Colors.wingsBloompo,
		borderRadius: 16,
		justifyContent: "center",
		paddingTop: 5,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 5, // sombra para android
	},
	colorsRow: {
		flexDirection: "row",
		marginTop: 2,
		flexWrap: "wrap", // Esto permite que los elementos pasen a la siguiente línea
		justifyContent: "center", // Centra los elementos horizontalmente
		width: "100%", // Ocupa todo el ancho disponible
		maxWidth: 190, // Establece un ancho máximo para forzar el salto de línea
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
		width: "60%",
		height: "8%",
		textAlign: "center",
		fontSize: 16,
		marginVertical: 4,
	},
	label: {
		marginBottom: 5,
		marginTop: 10,
		color: Colors.darkGrey, // marrón oscuro
		fontSize: 18,
		fontWeight: "700",
	},
	button1: {
		backgroundColor: Colors.bloompoYellow,
		borderRadius: 10,
		padding: 6,
		paddingHorizontal: 15,
		margin: 12,
		marginBottom: 10,
		marginTop: 10,
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
	selectedColorCircle: {
		borderWidth: 4,
		borderColor: Colors.darkGrey,
	},
	deleteIcon: {
		position: "absolute",
		top: 15,
		right: 25,
		zIndex: 10,
	},
});
