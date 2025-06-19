import { Alert, ImageBackground, View, Text, Image, FlatList, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState, useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getUserPets, getUserScore } from '@/services/api';
import * as SecureStore from 'expo-secure-store';

export default function PetScreen() {
  const [petsData, setPetsData] = useState<Pet[]>([]);
  const [coins, setCoins] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentHealth, setCurrentHealth] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);


  type Pet = {
    id: string;
    group_name: string;
    pet_name: string;
    pet_status: 'happy' | 'sad';
  };

  const screenWidth = Dimensions.get('window').width;

  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0].item as Pet;
      const index = petsData.findIndex(p => p.id === visibleItem.id);
      const health = visibleItem.pet_status === 'happy' ? 10 : 4;
      setCurrentHealth(health);
      setCurrentIndex(index);
    }
  });

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await SecureStore.getItemAsync('userId');
        if (!id) {
          Alert.alert('Error', 'No se pudo recuperar el usuario.');
        }
        setUserId(id);
      } catch (err) {
        console.error('Error recuperando userId:', err);
        Alert.alert('Error', 'Hubo un problema al acceder al usuario.');
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const [petsResponse, scoreResponse] = await Promise.all([
          getUserPets(userId),
          getUserScore(userId),
        ]);

        const pets = petsResponse.data;
        const score = scoreResponse.data;

        setPetsData(pets);
        setCoins(score?.score || 0);

        if (pets.length > 0) {
          setCurrentHealth(pets[0].pet_status === 'happy' ? 10 : 4);
        }
      } catch (error) {
        console.error('Error al obtener mascotas o monedas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const mockPetsData = [
    {
      id: '1',
      name: 'Bloompi',
      group: 'Fitness Team',
      image: require('../../assets/images/bloompo.png'),
      health: 7,
    },
    {
      id: '2',
      name: 'Pipi',
      group: 'El mejor equipo',
      image: require('../../assets/images/bloompo-sad.png'),
      health: 3,
    },
  ];

  const mockCoins = 200;
  const scrollToPrev = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const scrollToNext = () => {
    if (currentIndex < petsData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const renderPet = ({ item }: { item: Pet }) => {
    const imageSource =
      item.pet_status === 'happy'
        ? require('../../assets/images/bloompo.png')
        : require('../../assets/images/bloompo-sad.png');

    return (
      <View style={[styles.petContainer, { width: screenWidth * 0.8 }]}>
        <Image source={imageSource} style={styles.petImage} />
        <Text style={styles.petName}>{item.pet_name}</Text>
        <Text style={styles.groupName}>{item.group_name}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/images/Happy-background.png')} // o donde tengas tu imagen
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.topBarContainer}>
            <View style={styles.healthWrapper}>
              <View style={styles.healthBarVerticalBackground}>
                <View
                  style={[
                    styles.healthBarVerticalFill,
                    {
                      height: `${currentHealth * 10}%`,
                      backgroundColor: currentHealth > 5 ? '#10B981' : '#F59E0B',
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.rightColumn}>
              <View style={styles.coinDisplay}>
                <IconSymbol name="dollarsign.circle.fill" size={20} color={Colors.bloompoYellowSaturated} />
                <Text style={styles.coinAmount}>{coins}</Text>
              </View>
              <TouchableOpacity style={styles.storeIcon}>
                <IconSymbol name="storefront" size={60} color={'red'} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.centerContainer}>
            <TouchableOpacity onPress={scrollToPrev}>
              <Ionicons name="chevron-back" size={36} color="white" />
            </TouchableOpacity>

            <FlatList
              ref={flatListRef}
              data={petsData}
              horizontal
              pagingEnabled
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              renderItem={renderPet}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewabilityConfig}
              contentContainerStyle={styles.flatListInnerContainer}
            />

            <TouchableOpacity onPress={scrollToNext}>
              <Ionicons name="chevron-forward" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
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
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  coinsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsContainer: {
    backgroundColor: Colors.strongBlue,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  coinsText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  flatListInnerContainer: {
    alignItems: 'center',
  },
  petContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  petName: {
    fontSize: 26,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 10,
  },
  groupName: {
    fontSize: 18,
    color: '#6B7280',
  },
  petImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  healthWrapper: {
    height: 120,
    width: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 7,
    overflow: 'hidden',
  },
  healthBarVerticalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  healthBarVerticalFill: {
    width: 16,
    borderRadius: 7,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: 8, // si tu versión lo soporta
  },

  storeIcon: {
    marginTop: 6,
  },
  coinDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6B8596', // gris azulado
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    gap: 6, // si tu versión lo soporta
  },
  coinAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
