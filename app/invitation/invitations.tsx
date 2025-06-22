import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { getUserInvitations, acceptInvitation } from '@/services/api';


export default function InvitationScreen() {

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  type Invitation = {
    id: string;
    username: string;
    groupName: string;
    userPhoto: string;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserInvitations();
        const data = response.data.id_pending_groups;
        console.log(data)
        const mapped = data.map((invitation: any, index: number) => ({
          id: invitation._id,
          username: 'Juan',
          groupName: invitation.name,
          userPhoto: ''
        }));

        setInvitations(mapped);
      } catch (e) {
        console.error(e);
        setError('Error al obtener invitaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInvitationResponse = async (groupId: string, accepted: boolean) => {
    try {
       await acceptInvitation({
         groupId,
         accepted,
       });
      console.log('Invitation responded');
      // Filtramos la invitación respondida para ocultarla del listado
      setInvitations((prev) => prev.filter((inv) => inv.id !== groupId));
    } catch (err) {
      console.error('Error al responder invitación:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }


  return (
    <>
      <Stack.Screen options={{ title: 'Invitaciones', headerShown: true, headerTintColor: 'black', }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <FlatList
            data={invitations}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.invitationContainer}>
                <Image source={typeof item.userPhoto === 'string' ? { uri: item.userPhoto } : item.userPhoto} style={styles.avatar} />

                <View style={styles.invitationContent}>
                  <Text style={styles.username}>{item.username} te ha invitado</Text>
                  <Text style={styles.groupName}>{item.groupName}</Text>
                </View>

                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => handleInvitationResponse(item.id, true)}>
                    <IconSymbol name="checkmark.circle" size={28} color="green" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleInvitationResponse(item.id, false)}>
                    <IconSymbol name="xmark.circle" size={28} color="red" />
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
