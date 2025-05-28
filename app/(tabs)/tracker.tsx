import { Image } from 'expo-image';
import { Platform, SafeAreaView, StyleSheet, View, Text } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';


export default function TrackerScreen() {
  return (
    <>
    <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerLeft}>
                  <Text style={styles.headerTitle}>Bloompo</Text>
                  <Image
                    source={require('../../assets/icons/bloompo-icon.png')}
                    style={styles.headerIcon}
                    resizeMode="contain"
                  />
                </View>
        <View style={styles.header}>
          
        </View>
      </View>
      </SafeAreaView>
    </>
    
  );
}

const styles = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginRight: 5,
  },
  headerIcon: {
    width: 28,
    height: 28,
  },
});
