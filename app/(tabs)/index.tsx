import { Alert, Platform, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { getFeedPosts } from '@/services/api';
import * as SecureStore from 'expo-secure-store';
import { getHabitIcon } from '@/constants/habitIcons';


export default function HomeScreen() {

  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  type Post = {
    id: string;
    username: string;
    userPhoto: any;
    postPhoto: string;
    habitName: string;
    habitIcon: string;
    postDate: string;
    likes: string[];
    dislikes: string[];
    userLike: boolean;
    userDislike: boolean;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFeedPosts();
        const data = response.data;

        //console.log(response.data);
        const mapped = data.map((post: any, index: number) => ({
          id: `${post.username}-${post.postDate}-${index}`,
          ...post,
        }));

        setPosts(mapped);

      } catch (e) {
        console.error(e);
        setError('Error al obtener los posts');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
            ...post,
            userLike: !post.userLike,
            userDislike: false,
            likes: post.userLike
              ? post.likes?.filter((u) => u !== '1')
              : [...(post.likes ?? []), '1'],
            dislikes: post.dislikes?.filter((u) => u !== '1'),
          }
          : post
      )
    );
  };

  const handleDislike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
            ...post,
            userDislike: !post.userDislike,
            userLike: false,
            dislikes: post.userDislike
              ? post.dislikes?.filter((u) => u !== '1')
              : [...(post.dislikes ?? []), '1'],
            likes: post.likes?.filter((u) => u !== '1'),
          }
          : post
      )
    );
  };

  const { top } = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Condicional para loading */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          // Condicional para error
          <View style={styles.centered}>
            <Text>{error}</Text>
          </View>
        ) : (
          // Vista principal cuando todo está bien
          <>
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
                    <Image source={item.userPhoto
                      ? { uri: item.userPhoto }
                      : require('../../assets/images/icon.png')} style={styles.avatar} />
                    <Text style={styles.username}>{item.username ?? 'Username'}</Text>
                  </View>

                  <Image source={{ uri: item.postPhoto }} style={styles.postImage} resizeMode="cover" />

                  <View style={styles.habitSection}>
                    <View style={styles.habitRow}>
                      <Image source={getHabitIcon(item.habitIcon ?? 'gymlogo.png')} style={styles.habitIcon} />
                      <Text style={styles.habitName}>{item.habitName ?? 'Habito'}</Text>
                      <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={() => handleLike(item.id)} style={styles.reactionButton}>
                          <IconSymbol
                            name={item.userLike ? 'hand.thumbsup.fill' : 'hand.thumbsup'}
                            size={26}
                            color='grey'
                          />
                          <Text style={styles.reactionCount}>{item.likes?.length ?? 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDislike(item.id)} style={styles.reactionButton} >
                          <IconSymbol
                            name={item.userDislike ? 'hand.thumbsdown.fill' : 'hand.thumbsdown'}
                            size={26}
                            color='grey'
                          />
                          <Text style={styles.reactionCount}>{item.dislikes?.length ?? 0}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
          </>
        )}
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
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  reactionCount: {
    marginLeft: 4,
    fontSize: 14,
  },
});
