import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Stack } from 'expo-router';

export default function InvitationScreen() {

  const invitations = [
    {
      id: '1',
      username: 'cami_rutina',
      userPhoto: require('../../assets/images/gymhabit.jpg'),
      groupName: 'Corredores 2025'
    },
    {
      id: '2',
      username: 'juancho',
      userPhoto: require('../../assets/images/gymhabit.jpg'),
      groupName: 'Lectura Grupo Martes'
    },
  ];


  return (
     <>
    <Stack.Screen options={{ title: 'Invitaciones', headerShown:true, headerTintColor: 'black', }} />
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={invitations}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
             <View style={styles.invitationContainer}>
              <Image source={item.userPhoto} style={styles.avatar} />
              
              <View style={styles.invitationContent}>
                <Text style={styles.username}>{item.username} te ha invitado</Text>
                <Text style={styles.groupName}>{item.groupName}</Text>
              </View>

              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => console.log('Accept')}>
                  <IconSymbol name="checkmark.circle" size={28} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Reject')}>
                  <IconSymbol name="xmark.circle" size={28} color="green" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
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
    paddingHorizontal: 30,
    paddingTop: 20
  },
  invitationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  invitationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  groupName: {
    fontSize: 14,
    color: '#6B7280',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Si no te funciona 'gap', usá marginRight en los iconos
  },
  
 
});
