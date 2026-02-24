import React from 'react';
import { FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppText from '../../common/AppText';
import { useTheme } from '../../context/ThemeContext';
import type { Post } from '../../types/models';
import type { FeedStackParamList } from '../../navigation/FeedStack';

export default function PostsGrid({
  posts,
  refreshing,
  onRefresh,
}: {
  posts: Post[];
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  const { theme } = useTheme();

  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParamList>>();

  return (
    <FlatList
      style={{ flex: 1 }} // ⭐ fills the space given by parent
      data={posts}
      numColumns={3}
      keyExtractor={(p) => p.id}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={{ gap: 10 }}
      contentContainerStyle={{
        gap: 10,
        paddingTop: 12,
        paddingBottom: 20,
      }}
      refreshing={refreshing}
      onRefresh={onRefresh}
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            navigation.navigate('PostDetails', { postId: item.id })
          }
          style={{
            flex: 1,
            aspectRatio: 1,
            borderRadius: 14,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: 10,
            justifyContent: 'space-between',
          }}
        >
          <AppText numberOfLines={2} style={{ fontWeight: '800', fontSize: 12 }}>
            {item.title}
          </AppText>

          <AppText
            style={{ color: theme.colors.mutedText, fontSize: 11 }}
            numberOfLines={1}
          >
            {new Date(item.createdAtISO).toLocaleDateString()}
          </AppText>
        </Pressable>
      )}
    />
  );
}