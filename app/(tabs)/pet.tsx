import {ImageBackground, View, Text, Image, FlatList, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';


export default function PetScreen() {
  const petsData = [
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

  type Pet = {
    id: string;
    name: string;
    group: string;
    image: any;
    health: number;
  };

  const screenWidth = Dimensions.get('window').width;
  const [currentHealth, setCurrentHealth] = useState(petsData[0].health);
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0].item as Pet;
      const index = petsData.findIndex(p => p.id === visibleItem.id);
      setCurrentHealth(visibleItem.health);
      setCurrentIndex(index);
    }
  });

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

  const renderPet = ({ item }: { item: Pet }) => (
    <View style={[styles.petContainer, { width: screenWidth * 0.8 }]}> {/* centrado dentro del contenedor */}
      <Image source={item.image} style={styles.petImage} />
      <Text style={styles.petName}>{item.name}</Text>
      <Text style={styles.groupName}>{item.group}</Text>
    </View>
  );

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
              <Text style={styles.coinAmount}>350</Text>
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
