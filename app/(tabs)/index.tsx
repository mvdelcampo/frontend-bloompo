import { Animated, Easing, Alert, Platform, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, SafeAreaView, ActivityIndicator, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { getFeedPosts, addLikes, deletePost } from '@/services/api';
import * as SecureStore from 'expo-secure-store';
import { getHabitIcon } from '@/constants/habitIcons';


export default function HomeScreen() {

  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  type Post = {
    id: string;
    ownerUserId: string;
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
    const fetchUserId = async () => {
      const id = await SecureStore.getItemAsync('userId');
      console.log(id);
      setUserId(id);
    };
    fetchUserId();
  }, []);

  const rotateAnim = useState(new Animated.Value(0))[0];
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    if (loading) {
      spin.start();
    } else {
      spin.stop();
    }
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFeedPosts();
        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
          setPosts([]);
          return;
        }
        console.log(Object.keys(response.data[0]));
        const mapped = data.map((post: any, index: number) => ({
          id: `${post.username}-${post.postDate}-${index}`,
          ownerUserId: post.id,
          username: post.username,
          userPhoto: post.userPhoto,
          postPhoto: post.postPhoto,
          habitName: post.habitName,
          habitIcon: post.habitIcon,
          postDate: post.postDate,
          likes: post.likes,
          dislikes: post.dislikes,
          userLike: post.userLike,
          userDislike: post.userDislike
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

  const handleLike = async (postId: string) => {
    if (!userId) {
      Alert.alert("Error", "No se encontró el usuario.");
      return;
    }
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
            ...post,
            userLike: !post.userLike,
            userDislike: false,
            likes: post.userLike
              ? post.likes?.filter((u) => u !== userId)
              : [...(post.likes ?? []), userId],
            dislikes: post.dislikes?.filter((u) => u !== userId),
          }
          : post
      )
    );
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    try {
      console.log({
        postOwnerUserId: post.ownerUserId,
        habitName: post.habitName,
        postDate: post.postDate,
        like: !post.userLike,
        dislike: false
      });
      await addLikes({
        postOwnerUserId: post.ownerUserId,
        habitName: post.habitName,
        postDate: post.postDate,
        like: !post.userLike,
        dislike: false,
      });
    } catch (err) {
      console.error("Error enviando like:", err);
      Alert.alert("Error", "No se pudo registrar el like.");
    }
  };

  const handleDislike = async (postId: string) => {
    if (!userId) {
      Alert.alert("Error", "No se encontró el usuario.");
      return;
    }
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
            ...post,
            userDislike: !post.userDislike,
            userLike: false,
            dislikes: post.userDislike
              ? post.dislikes?.filter((u) => u !== userId)
              : [...(post.dislikes ?? []), userId],
            likes: post.likes?.filter((u) => u !== userId),
          }
          : post
      )
    );
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      await addLikes({
        postOwnerUserId: post.ownerUserId,
        habitName: post.habitName,
        postDate: post.postDate,
        like: false,
        dislike: !post.userDislike,
      });
    } catch (err) {
      console.error("Error enviando dislike:", err);
      Alert.alert("Error", "No se pudo registrar el dislike.");
    }
  };

  const handleDeletePost = async () => {
    const postToDelete = posts.find(p => p.id === selectedPostId);
    if (!postToDelete) return;

    try {
      await deletePost({
        habitName: postToDelete.habitName,
        postDate: postToDelete.postDate
      });

      setPosts((prev) => prev.filter(p => p.id !== selectedPostId));
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Error al eliminar el post:", err);
      Alert.alert("Error", "No se pudo eliminar el post.");
    }
  };

  const { top } = useSafeAreaInsets();

  const getTimeAgo = (postDateStr: string): string => {
    const postDate = new Date(postDateStr);
    const now = new Date();
    const diffMs = now.getTime() - postDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 24) {
      return `Hace ${diffHours} horas`;
    }
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} días`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
        {/* Condicional para loading */}
        {loading ? (
          <View style={styles.centered}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
              <Animated.Image
                source={require('../../assets/images/bloompo-cowboy.png')}
                style={[styles.rotatingImage, { transform: [{ rotate: spin }] }]}
              />
            </View>
          </View>
        ) : error ? (
          // Condicional para error
          <View style={styles.centered}>
            <Text>{error}</Text>
          </View>
        ) : posts.length === 0 ? (
          // Condicional para no hay posts
          <View style={styles.centered}>
            <Text style={styles.emptyText}>¡Ups! No hay posts nuevas :(</Text>
            <Image
              source={require('../../assets/images/bloompo-sad.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
          </View>
        ) :

          (
            // Vista principal cuando todo está bien
            <>
              {/* Header */}



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
                        : require('../../assets/images/avatar_placeholder.png')} style={styles.avatar} />
                      <Text style={styles.username}>{item.username ?? 'Username'}</Text>
                      {item.ownerUserId === userId && (
                        <TouchableOpacity
                          style={styles.moreButton}
                          onPress={() => {
                            setSelectedPostId(item.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Text style={{ fontSize: 22, marginLeft: 'auto' }}>⋮</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <Image source={{ uri: item.postPhoto }} style={styles.postImage} resizeMode="cover" />

                    <View style={styles.habitSection}>
                      <View style={styles.habitRow}>
                        <Image source={getHabitIcon(item.habitIcon)} style={styles.habitIcon} />
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
                      <Text style={styles.timeAgo}>{getTimeAgo(item.postDate)}</Text>
                    </View>
                  </View>
                )}
              />
              <Modal
                visible={showDeleteModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={{ marginBottom: 16 }}>¿Eliminar este post?</Text>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={handleDeletePost}
                    >
                      <Text style={{ color: 'white' }}>Eliminar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setShowDeleteModal(false)}>
                      <Text style={{ color: 'gray', marginTop: 10 }}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
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
  moreButton: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },

  modalButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  rotatingImage: {
    position: 'absolute',
    width: 80,
    height: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
    color: '#444',
  },
  emptyImage: {
    width: 150,
    height: 150,
    opacity: 0.7,
  },
  timeAgo: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    marginLeft: 2,
  },
});
