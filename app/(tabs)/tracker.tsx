import { Image } from "react-native";
import {
	Platform,
	SafeAreaView,
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	Alert
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import {
	getUserGroups,
	getGroupRanking,
	getHabitsFromGroup,
	getHabitsFromUser,
	deleteHabit
} from "../../services/api";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

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
};

type RankingItem = {
	username: string;
	photo: string;
	photoInBase64: string;
	score: number;
};

type Habit = {
	name: string;
	icon: string;
	frequency: number;
	weekly_counter: number[];
	username: string;
	photo: string;
	photoInBase64: string;
};

type MyHabit = {
	_id: string;
	name: string;
	score?: number;
	icon?: string;
	color?: string;
	frequency?: number;
	weekly_counter: number[];
	id_groups?: string[];
};
const daysLabels = ["L", "M", "X", "J", "V", "S", "D"];

export default function TrackerScreen() {
	const router = useRouter();
	const [selectedGroupId, setSelectedGroupId] = useState("1"); // grupo por defecto YO
	const yo: Group = {
		id: "1",
		name: "Yo",
		color: Colors.lightPeach,
	};
	const [groups, setGroups] = useState<Group[]>([yo]);
	const [ranking, setRanking] = useState<RankingItem[]>([]);
	const [habits, setHabits] = useState<Habit[]>([]);
	const [myHabits, setMyHabits] = useState<MyHabit[]>([]);

	const handlePressGroup = (groupId: string) => {
		//console.log(`Grupo seleccionado: ${groupId}`);
		setSelectedGroupId(groupId);
	};

	const handleDeleteHabit = async (habitName: string) => {
		try {
			await deleteHabit({ habitName: habitName });
			try {
				const responseHabits = await getHabitsFromUser();
				//console.log(responseHabits.data);
				setMyHabits(responseHabits.data.habits || []);
			} catch (error) {
				console.error("Error al recargar mis habitos:", error);
			}
		} catch (error) {
			console.log("Ha ocurrido un error eliminando el hábito");
			Alert.alert("Error", "Ocurrió un error al eliminar el hábito. Vuelve a intentarlo")
		}
	}

	// Cargar grupos y hábitos al iniciar
	useFocusEffect(
		useCallback(() => {
		const fetchData = async () => {
			try {
				const responseGroups = await getUserGroups();
				setGroups([yo, ...responseGroups.data.groups]);
			} catch (error) {
				console.error("Error al cargar grupos:", error);
			}

			if (selectedGroupId === "1") {
				try {
					const responseHabits = await getHabitsFromUser();
					//console.log(responseHabits.data);
					setMyHabits(responseHabits.data.habits || []);
				} catch (error) {
					console.error("Error al cargar mis habitos:", error);
				}
			} else {
				try {
					const responseRanking = await getGroupRanking(
						selectedGroupId
					);
					setRanking(responseRanking.data.slice(0, 5) || []);
					//console.log("ranking", responseRanking.data);
				} catch (error) {
					console.error("Error al cargar ranking:", error);
				}

				try {
					const responseHabits = await getHabitsFromGroup(
						selectedGroupId
					);
					//console.log(responseHabits.data);
					const flatHabits = responseHabits.data.flatMap(
						(user: any) => {
							//console.log("Foto del usuario:", user.photoInBase64);
							return user.habits.map((habit: any) => ({
								name: habit.name,
								icon: habit.icon,
								frequency: habit.frequency,
								weekly_counter: habit.weekly_counter,
								username: user.username,
								photo: user.photo,
								photoInBase64: user.photoInBase64,
							}));
						}
					);
					setHabits(flatHabits || []);
				} catch (error) {
					console.error("Error al cargar habitos:", error);
				}
			}
		};
		fetchData();
		}, [selectedGroupId])
	);

	return (
		<>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					{/* Groups */}
					<View style={styles.groupsSection}>
						<View style={styles.header}>
							<Text style={styles.sectionText}>Grupos</Text>
							<View style={styles.headerRight}>
								{selectedGroupId !== "1" && (
									<TouchableOpacity
										style={styles.headerActionIcon}
										onPress={() => {
											router.push(
												`/tracker/edit-group?groupId=${selectedGroupId}`
											);
										}}
									>
										<IconSymbol
											name="pencil"
											size={26}
											color="black"
										/>
									</TouchableOpacity>
								)}

								<TouchableOpacity
									onPress={() =>
										router.push("/tracker/create-group")
									}
								>
									<IconSymbol
										name="plus.circle"
										size={26}
										color="black"
									/>
								</TouchableOpacity>
							</View>
						</View>

						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							style={{ maxHeight: 100, marginHorizontal: 10 }}
						>
							{groups.map((item, index) => (
								<TouchableOpacity
									key={index}
									onPress={() => handlePressGroup(item.id)}
								>
									<View
										key={index}
										style={[
											styles.box,
											{
												backgroundColor: item.color,
											},
											item.id === selectedGroupId &&
											styles.selectedBox,
										]}
									>
										<Text style={styles.groupName}>
											{item.name}
										</Text>
									</View>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>

					{/* Ranking */}
					{selectedGroupId !== "1" && (
						<View style={styles.rankingSection}>
							<Text style={styles.sectionText}>Ranking</Text>
							<View style={styles.rankingContainer}>
								<FlatList
									data={ranking}
									keyExtractor={(item, index) =>
										index.toString()
									}
									horizontal
									showsHorizontalScrollIndicator={false}
									renderItem={({ item, index }) => (
										<View style={styles.rankItem}>
											<Text style={styles.rank}>
												#{index + 1}
											</Text>
											<Image
												source={
													item.photoInBase64
														? {
															uri: item.photoInBase64,
														}
														: require("../../assets/icons/bloompo-icon.png")
												}
												style={styles.avatar}
											/>
											<Text style={styles.text}>
												{item.username}
											</Text>
											<Text style={styles.text}>
												{item.score} pts
											</Text>
										</View>
									)}
								/>
							</View>
						</View>
					)}

					{/* Button create habit */}
					<TouchableOpacity
						style={styles.button1}
						onPress={() => router.push("/tracker/create-habit")}
					>
						<IconSymbol name="plus" size={24} color="black" />
						<Text style={styles.buttonText}>Crear hábito</Text>
					</TouchableOpacity>

					{/* Selected group habits */}
					{selectedGroupId === "1" ? (
						<View style={styles.habitsSection}>
							<Text style={styles.sectionText}>Mis hábitos</Text>
							{myHabits?.length === 0 ? (
								<Text style={styles.text3}>
									No has cargado hábitos aún.
								</Text>
							) : (
								<FlatList
									data={myHabits}
									keyExtractor={(item, index) =>
										index.toString()
									}
									renderItem={({ item }) => (
										<View style={styles.card}>
											<View style={styles.habitHeader}>
												<Image
													source={
														icons[
														item.icon as keyof typeof icons
														]
													}
													style={styles.habitIcon}
													resizeMode="contain"
												/>
												<Text style={styles.habitTitle}>
													{item.name}
												</Text>
												<TouchableOpacity
													style={styles.headerRight}
													onPress={() => {
														Alert.alert(
															'¿Estás seguro que querés eliminar este hábito?',
															'Esta acción no se puede deshacer.',
															[
																{
																	text: 'Cancelar',
																	style: 'cancel',
																},
																{
																	text: 'Eliminar',
																	onPress: () => handleDeleteHabit(item.name),
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
														color= {Colors.mediumGrey}
													/>
												</TouchableOpacity>
											</View>
											<View
												style={styles.habitCompletion}
											>
												<View
													style={styles.daysContainer}
												>
													<View
														style={styles.daysRow}
													>
														{daysLabels.map(
															(day, index) => (
																<View
																	key={day}
																	style={{
																		alignItems:
																			"center",
																		marginHorizontal: 4,
																	}}
																>
																	<Text
																		style={
																			styles.dayLabel
																		}
																	>
																		{day}
																	</Text>
																	<View
																		style={[
																			styles.dayCircle,
																			{
																				backgroundColor:
																					item.weekly_counter &&
																						item
																							.weekly_counter[
																						index
																						] ===
																						1
																						? Colors.strongPeach
																						: Colors.lightGrey,
																			},
																		]}
																	/>
																</View>
															)
														)}
													</View>
												</View>
												<Text style={styles.text2}>
													{
														(
															item.weekly_counter ||
															Array(7).fill(0)
														).filter((d) => d === 1)
															.length
													}{" "}
													/ {item.frequency}
												</Text>
											</View>
										</View>
									)}
								/>
							)}
						</View>
					) : (
						<View style={styles.habitsSection}>
							<Text style={styles.sectionText}>Hábitos</Text>
							{habits?.length === 0 ? (
								<>
									<Text style={styles.text3}>
										Nadie ha cargado hábitos aún.
									</Text>
									<Text style={styles.text3}>
										¡Sé el primero!
									</Text>
								</>
							) : (
								<FlatList
									data={habits}
									keyExtractor={(item, index) =>
										index.toString()
									}
									renderItem={({ item }) => (
										<View style={styles.card}>
											<View style={styles.habitHeader}>
												<Image
													source={
														item.photoInBase64
															? {
																uri: item.photoInBase64,
															}
															: require("../../assets/icons/bloompo-icon.png")
													}
													style={styles.avatar}
												/>
												<Image
													source={
														icons[
														item.icon as keyof typeof icons
														]
													}
													style={styles.habitIcon}
													resizeMode="contain"
												/>
												<Text style={styles.habitTitle}>
													{item.name}
												</Text>
											</View>
											<View
												style={styles.habitCompletion}
											>
												<View
													style={styles.daysContainer}
												>
													<View
														style={styles.daysRow}
													>
														{daysLabels.map(
															(day, index) => (
																<View
																	key={day}
																	style={{
																		alignItems:
																			"center",
																		marginHorizontal: 4,
																	}}
																>
																	<Text
																		style={
																			styles.dayLabel
																		}
																	>
																		{day}
																	</Text>
																	<View
																		style={[
																			styles.dayCircle,
																			{
																				backgroundColor:
																					item.weekly_counter &&
																						item
																							.weekly_counter[
																						index
																						] ===
																						1
																						? Colors.strongPeach
																						: Colors.lightGrey,
																			},
																		]}
																	/>
																</View>
															)
														)}
													</View>
												</View>
												<Text style={styles.text2}>
													{
														(
															item.weekly_counter ||
															Array(7).fill(0)
														).filter((d) => d === 1)
															.length
													}{" "}
													/ {item.frequency}
												</Text>
											</View>
										</View>
									)}
								/>
							)}
						</View>
					)}
				</View>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: "#fff",
	},
	container: {
		flex: 1,
		paddingVertical: 15,
		paddingHorizontal: 10,
		//justifyContent: "space-around",
	},
	rankingContainer: {
		marginVertical: 10,
		alignItems: "center",
		flex: 1,
		justifyContent: "space-around",
	},
	groupsSection: {
		backgroundColor: Colors.superLightGrey,
		width: "95%",
		height: "19%",
		justifyContent: "space-around",
		borderRadius: 20,
		margin: 10,
	},
	sectionText: {
		color: Colors.mediumGrey,
		fontSize: 18,
		textAlign: "left",
		marginLeft: 15,
		marginTop: 8,
		marginBottom: 5,
		fontWeight: "bold",
	},
	rankingSection: {
		backgroundColor: Colors.superLightGrey,
		width: "95%",
		height: "22%",
		justifyContent: "space-around",
		borderRadius: 20,
		margin: 10,
	},
	habitsSection: {
		backgroundColor: Colors.superLightGrey,
		width: "95%",
		height: "60%",

		borderRadius: 20,
		margin: 10,
		paddingHorizontal: 10,
	},
	rankItem: {
		flexDirection: "column",
		gap: 1,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 3,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "flex-end",
		marginHorizontal: 15,
		justifyContent: "flex-end"
	},
	headerActionIcon: {
		marginRight: 12,
	},
	headerTitle: {
		fontSize: 28,
		fontStyle: "italic",
		fontWeight: "bold",
		marginRight: 5,
	},
	habitIcon: {
		width: 36,
		height: 36,
		marginRight: 10,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 5,
	},
	box: {
		margin: 5,
		width: 80,
		height: 45,
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
	title: {
		color: Colors.darkGrey,
		fontSize: 16,
		fontWeight: "bold",
		fontFamily: "Fredoka",
		alignContent: "center",
		textAlign: "center",
	},
	rank: {
		color: Colors.darkGrey,
		fontSize: 16,
		fontWeight: "bold",
		fontFamily: "Fredoka",
		alignContent: "center",
		textAlign: "center",
	},
	text: {
		color: Colors.darkGrey,
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 12,
		marginRight: 5,
	},
	groupName: {
		color: Colors.darkGrey,
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 12,
	},
	text2: {
		color: Colors.darkGrey,
		fontSize: 16,
		fontWeight: "600",
		fontFamily: "Fredoka",
		paddingLeft: 25,
	},
	text3: {
		color: Colors.mediumGrey,
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 16,
		marginTop: 20,
	},
	card: {
		backgroundColor: Colors.wingsBloompo,
		borderRadius: 16,
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5, // sombra para android
		marginBottom: 15,
		margin: 3,
	},
	habitTitle: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 4,
		flex: 1
	},
	daysRow: {
		flexDirection: "row",
		marginTop: 4,
	},
	avatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		marginRight: 8,
	},
	habitHeader: {
		paddingVertical: 10,
		flexDirection: "row",
		width: "100%",
		alignItems: "center",
		justifyContent: "flex-start",
		paddingLeft: 20,
	},
	habitCompletion: {
		padding: 10,
		flexDirection: "row",
		backgroundColor: Colors.lightPeach,
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
		width: "100%",
		alignSelf: "stretch",
		alignItems: "center",
		justifyContent: "center",
	},
	dayLabel: {
		color: Colors.darkGrey,
		fontSize: 16,
		textAlign: "center",
		width: 25,
		fontFamily: "Fredoka",
	},

	dayCircle: {
		width: 15,
		height: 15,
		borderRadius: 10,
		marginTop: 4,
		marginBottom: 4,
		marginHorizontal: 5,
	},

	daysContainer: {
		alignItems: "center",
	},
	button1: {
		width: "50%",
		height: "8%",
		backgroundColor: Colors.bloompoYellow,
		borderRadius: 20,
		padding: 5,
		margin: 5,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		flexDirection: "row",
		gap: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2, // sombra para android
	},
	buttonText: {
		color: Colors.darkGrey,
		fontSize: 16,
		fontWeight: "700",
	},
});
