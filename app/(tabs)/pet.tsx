import { View, Text, Image, FlatList, Dimensions, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function PetScreen() {
  const petsData = [
    {
      id: '1',
      name: 'Bloompi',
      group: 'Fitness Team',
      image: require('../../assets/images/bloompo.png'),
      health: 7, // valor de 0 a 10
    },
    {
      id: '2',
      name: 'Pipi',
      group: 'El mejor equipo',
      image: require('../../assets/images/bloompo-sad.png'),
      health: 3, // valor de 0 a 10
    },

    // ...otros grupos/mascotas
  ];

  const screenWidth = Dimensions.get('window').width;

  const renderPet = ({ item }: any) => (
    <View style={[styles.petContainer, { width: screenWidth }]}>
      <Text style={styles.petName}>{item.name}</Text>
      <Text style={styles.groupName}>{item.group}</Text>
      <Image source={item.image} style={styles.petImage} />

      <View style={styles.healthBarBackground}>
        <View style={[styles.healthBarFill, {
          width: `${item.health * 10}%`,
          backgroundColor: item.health > 5 ? '#10B981' : '#F59E0B',
        }]} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.storeContainer}>
          <Text>Coins</Text>
          <Text>Store</Text>
        </View>

        {/* Feed */}
        <FlatList
          data={petsData}
          horizontal
          pagingEnabled
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.feedContainer}
          showsHorizontalScrollIndicator={false}
          renderItem={renderPet}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#BFE8FF',
  },
  container: {
    flex: 1,
  },
  storeContainer: {
    alignItems: 'flex-end',
    paddingRight: 10
  },
  feedContainer: {
    // paddingBottom: 24,
  },
  postContainer: {
    marginBottom: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  coinsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  coinIcon: {
    marginLeft: 2,
  },
  petContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petName: {
    fontSize: 26,
    fontWeight: '600',
    // marginBottom: 6,
    color: '#1F2937',
  },
  groupName: {
    fontSize: 18,
    color: '#6B7280',
    //marginBottom: 16,
  },
  petImage: {
    width: 370,
    height: 370,
    resizeMode: 'contain',
  },
  healthBarBackground: {
    height: 14,
    width: 200,
    borderRadius: 7,
    backgroundColor: '#E5E7EB',
    marginTop: 16,
    overflow: 'hidden',
  },
  healthBarFill: {
    height: 14,
    borderRadius: 7,
  },
});