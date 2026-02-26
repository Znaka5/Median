import React, { useLayoutEffect, useMemo, useState, useEffect } from 'react';
import Screen from '../../common/Screen';
import PostList from '../../feed/PostList';
import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pressable, View } from 'react-native';
import AppText from '../../common/AppText';

import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../../services/firebase';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../../navigation/FeedStack';

type Props = NativeStackScreenProps<FeedStackParamList, 'Feed'>;
type FilterType = 'recent' | 'liked' | 'oldest';

export default function FeedScreen({ navigation }: Props) {
  const { posts, refresh, isLoading } = usePosts();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [filter, setFilter] = useState<FilterType>('recent');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('CreatePost')} hitSlop={10}>
          <Icon name="plus-box" size={22} color={theme.colors.primary} />
        </Pressable>
      ),
    });
  }, [navigation, theme.colors.primary]);

  useEffect(() => {
    if (user) refresh();
  }, [user]);

  // 🔥 LIKE HANDLER (required by PostList)
  const handleLike = async (id: string) => {
    const uid = user?.id;
    if (!uid) return;

    const post = posts.find(p => p.id === id);
    if (!post) return;

    const ref = doc(db, 'posts', id);

    await updateDoc(ref, {
      likedBy: post.likedByMe
        ? arrayRemove(uid)
        : arrayUnion(uid),
    });

    refresh(); // reload posts
  };

  const filteredPosts = useMemo(() => {
    switch (filter) {
      case 'liked':
        return posts.filter(p => p.likedByMe);

      case 'oldest':
        return [...posts].sort(
          (a, b) =>
            new Date(a.createdAtISO).getTime() -
            new Date(b.createdAtISO).getTime()
        );

      case 'recent':
      default:
        return [...posts].sort(
          (a, b) =>
            new Date(b.createdAtISO).getTime() -
            new Date(a.createdAtISO).getTime()
        );
    }
  }, [posts, filter]);

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: 6,
        }}
      >
        {(['recent', 'liked', 'oldest'] as FilterType[]).map(type => (
          <Pressable key={type} onPress={() => setFilter(type)}>
            <AppText
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor:
                  filter === type ? theme.colors.card : 'transparent',
                fontWeight: filter === type ? '800' : '400',
              }}
            >
              {type[0].toUpperCase() + type.slice(1)}
            </AppText>
          </Pressable>
        ))}
      </View>

      <PostList
        posts={filteredPosts}
        onOpen={(id) =>
          navigation.navigate('PostDetails', { postId: id })
        }
        onLike={handleLike}   // ⭐ REQUIRED
        refreshing={isLoading}
        onRefresh={refresh}
      />
    </Screen>
  );
}