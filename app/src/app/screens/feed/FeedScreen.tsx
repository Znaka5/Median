import React, { useLayoutEffect } from 'react';
import Screen from '../../common/Screen';
import PostList from '../../feed/PostList';
import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../../navigation/FeedStack';

type Props = NativeStackScreenProps<FeedStackParamList, 'Feed'>;

export default function FeedScreen({ navigation }: Props) {
  const { posts, refresh, isLoading, toggleLike } = usePosts();
  const { theme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('CreatePost')} hitSlop={10}>
          <Icon name="plus-box" size={22} color={theme.colors.primary} />
        </Pressable>
      ),
    });
  }, [navigation, theme.colors.primary]);

  return (
    <Screen>
      <PostList
        posts={posts}
        onOpen={(id) => navigation.navigate('PostDetails', { postId: id })}
        onLike={(id) => toggleLike(id)}
        refreshing={isLoading}
        onRefresh={refresh}
      />
    </Screen>
  );
}