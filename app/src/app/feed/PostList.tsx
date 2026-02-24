import React from 'react';
import { FlatList, View } from 'react-native';
import type { Post } from '../types/models';
import PostCard from './PostCard';

export default function PostList({
  posts,
  onOpen,
  onLike,
  refreshing,
  onRefresh,
}: {
  posts: Post[];
  onOpen: (id: string) => void;
  onLike: (id: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
}) {
  return (
    <FlatList
      contentContainerStyle={{ padding: 16, gap: 12 }}
      data={posts}
      keyExtractor={p => p.id}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      refreshing={refreshing}
      onRefresh={onRefresh} // Pull-to-refresh
      renderItem={({ item }) => (
        <PostCard post={item} onOpen={() => onOpen(item.id)} onLike={() => onLike(item.id)} />
      )}
    />
  );
}
