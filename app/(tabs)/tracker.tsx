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

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const groupsColors = [
	Colors.strongPeach,
	Colors.bloompoYellow,
	Colors.mintGreen,
	Colors.pinkCoral,
	Colors.bloompoYellowSaturated,
	Colors.babyBlue,
	Colors.strongBlue,
	Colors.strongPeach,
];
const groupsNames = [
	"Telematicos",
	"GYMbros",
	"Panas",
	"Grupo 4",
	"Grupo 5",
	"Grupo 6",
	"Grupo 7",
];
const habits = [
	{
		name: "Hábito 1",
		frequency: 5,
		daysCompleted: {
			L: false,
			M: true,
			X: false,
			J: true,
			V: false,
			S: false,
			D: false,
		},
		userPhoto: require("../../assets/images/gymhabit.jpg"),
	},
	{
		name: "Hábito 2",
		frequency: 3,
		daysCompleted: {
			L: true,
			M: false,
			X: true,
			J: false,
			V: true,
			S: false,
			D: false,
		},
		userPhoto: require("../../assets/images/gymhabit.jpg"),
	},
	{
		name: "Hábito 3",
		frequency: 7,
		daysCompleted: {
			L: true,
			M: true,
			X: true,
			J: true,
			V: true,
			S: false,
			D: false,
		},
		userPhoto: require("../../assets/images/gymhabit.jpg"),
	},
];

const ranking = [
	{
		name: "Usuario1",
		score: 100,
		userPhoto: require("../../assets/images/gymhabit.jpg"),
	},
	{
		name: "Usuario2",
		score: 90,
		userPhoto: require("../../assets/images/gymhabit.jpg"),
	},
	{
		name: "Usuario3",
		score: 80,
		userPhoto: require("../../assets/images/gymhabit.jpg"),
	},
	{
		name: "Usuario4",
		score: 70,
		userPhoto: require("../../assets/images/gymhabit.jpg"),
	},
	{
		name: "Usuario5",
		score: 60,
		userPhoto: require("../../assets/images/gymhabit.jpg"),
	},
];

export default function TrackerScreen() {
	const router = useRouter();

	const handlePressGroup = (group: string) => {
		console.log(`Grupo seleccionado: ${group}`);
		// TODO cambiar de grupo y actualizar lo que se muestra
	};

	return (
		<>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					{/* Groups */}
					<View style={styles.section}>
						<View style={styles.header}>
							<Text style={styles.sectionText}>Grupos</Text>
							<View style={styles.headerRight}>
								<TouchableOpacity
									style={styles.headerActionIcon}
									onPress={() =>
										router.push("/tracker/edit-group")
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
							{groupsNames.map((name, index) => (
								<TouchableOpacity
									key={index}
									onPress={() => handlePressGroup(name)}
								>
									<View
										key={index}
										style={[
											styles.box,
											{
												backgroundColor:
													groupsColors[
														index %
															groupsColors.length
													],
											},
										]}
									>
										<Text style={styles.text}>{name}</Text>
									</View>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>

					{/* Ranking */}
					<View style={styles.section}>
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
												source={item.userPhoto}
												style={styles.avatar}
											/>
											<Text style={styles.text}>
												{item.name}
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
											source={item.userPhoto}
											style={styles.avatar}
										/>
										<Text style={styles.habitTitle}>
											{item.name}
										</Text>
									</View>
									<View style={styles.habitCompletion}>
										<View style={styles.daysContainer}>
											<View style={styles.daysRow}>
												{Object.keys(
													item.daysCompleted
												).map((day) => (
													<Text
														key={day}
														style={styles.dayLabel}
													>
														{day}
													</Text>
												))}
											</View>
											<View style={styles.daysRow}>
												{Object.values(
													item.daysCompleted
												).map((completed, index) => (
													<View
														key={index}
														style={[
															styles.dayCircle,
															{
																backgroundColor:
																	completed
																		? Colors.strongPeach
																		: Colors.lightGrey,
															},
														]}
													/>
												))}
											</View>
										</View>

										<Text style={styles.text2}>
											{
												Object.values(
													item.daysCompleted
												).filter(Boolean).length
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
		paddingHorizontal: 20,
		justifyContent: "space-around",
	},
	rankingContainer: {
		marginVertical: 10,
		alignItems: "center",
	},
	section: {
		backgroundColor: Colors.superLightGrey,
		width: "100%",
		height: "20%",
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
		fontWeight: "bold",
	},
	habitsSection: {
		backgroundColor: Colors.superLightGrey,
		width: "100%",
		height: "70%",
		justifyContent: "space-around",
		borderRadius: 20,
		margin: 10,
	},
	rankItem: {
		flexDirection: "column",
		gap: 1,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 2,
	},
	headerRight: {
		flexDirection: "row",
		alignItems: "flex-end",
		margin: 10,
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
		width: 80,
		height: 50,
		marginRight: 10,
		borderRadius: 8,
		alignContent: "center",
		justifyContent: "center",
	},
	title: {
		color: Colors.lettersBloompo,
		fontSize: 16,
		fontWeight: "bold",
		fontFamily: "Fredoka",
		alignContent: "center",
		textAlign: "center",
	},
	rank: {
		color: Colors.lettersBloompo,
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
		color: Colors.lettersBloompo,
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
		color: Colors.lettersBloompo,
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
});
