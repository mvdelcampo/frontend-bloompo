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

// TODO ranking

const groupsColors = [
  Colors.strongPeach,
	Colors.bloompoYellow,
	Colors.mintGreen,
	Colors.pinkCoral,
	Colors.bloompoYellowSaturated,
	Colors.babyBlue,
	Colors.lightBlue,
	Colors.lightPeach,
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

export default function TrackerScreen() {
	const handlePressGroup = (group: string) => {
		console.log(`Grupo seleccionado: ${group}`);
		// TODO cambiar de grupo y actualizar lo que se muestra
	};

	return (
		<>
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.container}>
					{/* Header */}
					<View style={styles.headerLeft}>
						<Text style={styles.headerTitle}>Bloompo</Text>
						<Image
							source={require("../../assets/icons/bloompo-icon.png")}
							style={styles.headerIcon}
							resizeMode="contain"
						/>
					</View>
					<View style={styles.header}></View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={{ maxHeight: 100 }}
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
													index % groupsColors.length
												],
										},
									]}
								>
									<Text style={styles.text}>{name}</Text>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
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
		paddingHorizontal: 20,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 16,
	},
	headerLeft: {
		flexDirection: "row",
		alignItems: "center",
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
	box: {
		width: 80,
		height: 50,
		marginRight: 10,
		borderRadius: 8,
		alignContent: "center",
		justifyContent: "center",
	},
	text: {
		color: Colors.darkGrey,
		fontWeight: "bold",
		textAlign: "center",
		fontSize: 12,
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
