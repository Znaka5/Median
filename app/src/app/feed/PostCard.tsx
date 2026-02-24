import React from 'react';
import { Pressable, View } from 'react-native';
import AppText from '../common/AppText';
import LikeButton from './LikeButton';
import { useTheme } from '../context/ThemeContext';
import type { Post } from '../types/models';

export default function PostCard({
  post,
  onOpen,
  onLike,
}: {
  post: Post;
  onOpen: () => void;
  onLike: () => void;
}) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onOpen}
      style={{
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <AppText style={{ fontWeight: '900' }}>{post.title}</AppText>
          <AppText style={{ opacity: 0.8, marginTop: 4 }} numberOfLines={2}>
            {post.body}
          </AppText>
          <AppText style={{ marginTop: 8, color: theme.colors.mutedText }}>
            @{post.authorName} • {new Date(post.createdAtISO).toLocaleString()}
          </AppText>
        </View>
        <LikeButton liked={post.likedByMe} onToggle={onLike} />
      </View>
    </Pressable>
  );
}
