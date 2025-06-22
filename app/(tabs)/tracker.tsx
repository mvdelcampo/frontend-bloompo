import { Image } from "expo-image";
import {
	Platform,
	SafeAreaView,
	StyleSheet,
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import {
	getUserGroups,
	getGroupRanking,
	getHabitsFromGroup,
} from "../../services/api";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

type Group = {
	id: string;
	name: string;
	color: string;
};

type RankingItem = {
	username: string;
	photo: string;
	score: number;
};

type Habit = {
	name: string;
	icon: string;
	frequency: number;
	weekly_counter: number[];
	username: string;
	photo: string;
};
const daysLabels = ["L", "M", "X", "J", "V", "S", "D"];

// const groupsColors = [
// 	Colors.strongPeach,
// 	Colors.bloompoYellow,
// 	Colors.mintGreen,
// 	Colors.pinkCoral,
// 	Colors.bloompoYellowSaturated,
// 	Colors.babyBlue,
// 	Colors.strongBlue,
// 	Colors.strongPeach,
// ];
// const groupsNames = [
// 	"Telematicos",
// 	"GYMbros",
// 	"Panas",
// 	"Grupo 4",
// 	"Grupo 5",
// 	"Grupo 6",
// 	"Grupo 7",
// ];
// const habits = [
// 	{
// 		name: "Hábito 1",
// 		frequency: 5,
// 		daysCompleted: {
// 			L: false,
// 			M: true,
// 			X: false,
// 			J: true,
// 			V: false,
// 			S: false,
// 			D: false,
// 		},
// 		userPhoto: require("../../assets/images/gymhabit.jpg"),
// 	},
// 	{
// 		name: "Hábito 2",
// 		frequency: 3,
// 		daysCompleted: {
// 			L: true,
// 			M: false,
// 			X: true,
// 			J: false,
// 			V: true,
// 			S: false,
// 			D: false,
// 		},
// 		userPhoto: require("../../assets/images/gymhabit.jpg"),
// 	},
// 	{
// 		name: "Hábito 3",
// 		frequency: 7,
// 		daysCompleted: {
// 			L: true,
// 			M: true,
// 			X: true,
// 			J: true,
// 			V: true,
// 			S: false,
// 			D: false,
// 		},
// 		userPhoto: require("../../assets/images/gymhabit.jpg"),
// 	},
// ];

// const ranking = [
// 	{
// 		name: "Usuario1",
// 		score: 100,
// 		userPhoto: require("../../assets/images/gymhabit.jpg"),
// 	},
// 	{
// 		name: "Usuario2",
// 		score: 90,
// 		userPhoto: require("../../assets/images/gymhabit.jpg"),
// 	},
// 	{
// 		name: "Usuario3",
// 		score: 80,
// 		userPhoto: require("../../assets/images/gymhabit.jpg"),
// 	},
// 	{
// 		name: "Usuario4",
// 		score: 70,
// 		userPhoto: require("../../assets/images/gymhabit.jpg"),
// 	},
// 	{
// 		name: "Usuario5",
// 		score: 60,
// 		userPhoto: require("../../assets/images/gymhabit.jpg"),
// 	},
// ];

export default function TrackerScreen() {
	const router = useRouter();
	const [selectedGroupId, setSelectedGroupId] = useState("");
	const [groups, setGroups] = useState<Group[]>([]);
	const [ranking, setRanking] = useState<RankingItem[]>([]);
	const [habits, setHabits] = useState<Habit[]>([]);

	const handlePressGroup = (groupId: string) => {
		console.log(`Grupo seleccionado: ${groupId}`);
		setSelectedGroupId(groupId);
	};

	useEffect(() => {
		const fetchData = async () => {
			
			try {
				const responseGroups = await getUserGroups();
				setGroups(responseGroups.data);
				
			} catch (error) {
				console.error("Error al cargar grupos:", error);
			}

			try {
				const responseRanking = await getGroupRanking(selectedGroupId);
				setRanking(responseRanking.data.slice(0, 5));
			} catch (error) {
				console.error("Error al cargar ranking:", error);
			}

			try {
				const responseHabits = await getHabitsFromGroup(
					selectedGroupId
				);
				const flatHabits = responseHabits.data.habits.map(
					(habit: any) => ({
						name: habit.name, // name, icon, frequency, weekly_counter
						icon: habit.icon,
						frequency: habit.frequency,
						weekly_counter: habit.weekly_counter,
						username: responseHabits.data.username,
						photo: responseHabits.data.photo,
					})
				);

				setHabits(flatHabits);
			} catch (error) {
				console.error("Error al cargar habitos:", error);
			}
		};
		fetchData();
	}, []);

	return (
		<>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					{/* Groups */}
					<View style={styles.groupsSection}>
						<View style={styles.header}>
							<Text style={styles.sectionText}>Grupos</Text>
							<View style={styles.headerRight}>
								<TouchableOpacity
									style={styles.headerActionIcon}
									onPress={() =>
										router.push({ pathname: "/tracker/edit-group", params: { groupId: selectedGroupId } })
									}
								>
									<IconSymbol
										name="pencil"
										size={26}
										color="black"
									/>
								</TouchableOpacity>

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
									onPress={() =>
										handlePressGroup(item.id)
									}
								>
									<View
										key={index}
										style={[
											styles.box,
											{
												backgroundColor: item.color
											},
										]}
									>
										<Text style={styles.text}>{item.name}</Text>
									</View>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>

					{/* Ranking */}
					<View style={styles.rankingSection}>
						<Text style={styles.sectionText}>Ranking</Text>
						<View style={styles.rankingContainer}>
							<FlatList
								data={ranking}
								keyExtractor={(item, index) => index.toString()}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={({ item, index }) => (
									<>
										<View style={styles.rankItem}>
											<Text style={styles.rank}>
												#{index + 1}
											</Text>
											<Image
												source={item.photo}
												style={styles.avatar}
											/>
											<Text style={styles.text}>
												{item.username}
											</Text>
											<Text style={styles.text}>
												{item.score} pts
											</Text>
										</View>
									</>
								)}
							/>
						</View>
					</View>

					{/* Button create habit */}
					<TouchableOpacity
						style={styles.button1}
						onPress={() => router.push("/tracker/create-habit")}
					>
						<IconSymbol name="plus" size={24} color="black" />
						<Text style={styles.buttonText}>Crear hábito</Text>
					</TouchableOpacity>

					{/* Selected group habits */}
					<View style={styles.habitsSection}>
						<Text style={styles.sectionText}>Hábitos</Text>
						<FlatList
							data={habits}
							keyExtractor={(item, index) => index.toString()}
							renderItem={({ item }) => (
								<View style={styles.card}>
									<View style={styles.habitHeader}>
										<Image
											source={item.photo}
											style={styles.avatar}
										/>
										<Text style={styles.habitTitle}>
											{item.name}
										</Text>
									</View>
									<View style={styles.habitCompletion}>
										<View style={styles.daysContainer}>
											<View style={styles.daysRow}>
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
												item.weekly_counter.filter(d => d === 1).length
											}{" "}
											/ {item.frequency}
										</Text>
									</View>
								</View>
							)}
						></FlatList>
					</View>
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
		justifyContent: "space-around",
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
		marginTop: 10,
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
		height: "70%",
		justifyContent: "space-around",
		borderRadius: 20,
		margin: 10,
		paddingHorizontal: 10,
	},
	rankItem: {
		flexDirection: "column",
		gap: 1,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 3,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "flex-end",
		marginHorizontal: 10,
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
	headerIcon: {
		width: 28,
		height: 28,
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
	text2: {
		color: Colors.darkGrey,
		fontSize: 16,
		fontWeight: "600",
		fontFamily: "Fredoka",
		paddingLeft: 25,
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
