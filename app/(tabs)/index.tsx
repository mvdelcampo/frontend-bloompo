import { Platform, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { getFeedPosts } from '@/services/api';

export default function HomeScreen() {

  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userId, setUserId] = useState<string>('1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mockPosts = [
    {
      id: '1',
      username: 'cami_rutina',
      userPhoto: require('../../assets/images/gymhabit.jpg'),
      postPhoto: require('../../assets/images/gymhabit.jpg'),
      habitName: 'Gimnasio',
      habitIcon: require('../../assets/icons/gymlogo.png'),
    },
    {
      id: '2',
      username: 'juan_habits',
      userPhoto: require('../../assets/images/gymhabit.jpg'),
      postPhoto: require('../../assets/images/gymhabit.jpg'),
      habitName: 'Gimnasio',
      habitIcon: require('../../assets/icons/gymlogo.png'),
    },
    {
      id: '3',
      username: 'cami_rutina',
      userPhoto: require('../../assets/images/gymhabit.jpg'),
      postPhoto: require('../../assets/images/gymhabit.jpg'),
      habitName: 'Gimnasio',
      habitIcon: require('../../assets/icons/gymlogo.png'),
    },
  ];

  type Post = {
    id: string;
    username: string;
    userPhoto: any;
    postPhoto: string;
    habitName: string;
    habitIcon: any;
    postDate?: string;
    likes?: string[];
    dislikes?: string[];
    userLike?: boolean;
    userDislike?: boolean;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* const response = await getFeedPosts(userId);
         const data = response.data;
 
         const mapped = data.map((post: any, index: number) => ({
           id: `${post.username}-${post.postDate}-${index}`,
           ...post,
         }));
         
         setPosts(mapped);*/

        setPosts(mockPosts);
      } catch (e) {
        //console.error(e);
        //setError('Error al obtener los posts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>BLOOMPO</Text>
            <Image
              source={require('../../assets/icons/bloompo-icon.png')}
              style={styles.headerIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => router.push("/invitation/invitations")} style={styles.headerActionIcon}>
              <IconSymbol name="bell" size={26} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/create-post/camera")}>
              <IconSymbol name="plus.circle" size={26} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Feed */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.feedContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.postContainer}>
              <View style={styles.userRow}>
                <Image source={item.userPhoto} style={styles.avatar} />
                <Text style={styles.username}>{item.username}</Text>
              </View>

              <Image source={typeof item.postPhoto === 'string' ? { uri: item.postPhoto } : item.postPhoto} style={styles.postImage} resizeMode="cover" />

              <View style={styles.habitSection}>
                <View style={styles.habitRow}>
                  <Image source={item.habitIcon} style={styles.habitIcon} />
                  <Text style={styles.habitName}>{item.habitName}</Text>
                  <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={() => console.log('Like')} >
                      <IconSymbol name="hand.thumbsup" size={26} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log('Dislike')} >
                      <IconSymbol name="hand.thumbsdown" size={26} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    fontWeight: 'heavy',
    fontFamily: "Baloo2Bold",
    marginRight: 5,
  },
  headerIcon: {
    width: 28,
    height: 28,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionIcon: {
    marginRight: 12,
  },
  feedContainer: {
    paddingBottom: 24,
  },
  postContainer: {
    marginBottom: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    fontWeight: '600',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 400,
    borderRadius: 5,
  },
  habitSection: {
    paddingTop: 8,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  habitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8
  },
  button: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6B7280',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonLeft: {
    marginRight: 6,
  },
  buttonRight: {
    marginLeft: 6,
  },
  buttonText: {
    color: '#6B7280',
    fontWeight: '600',
  },
});
