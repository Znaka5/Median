import React from 'react';
import { View } from 'react-native';
import Screen from '../../common/Screen';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../../navigation/FeedStack';

type Props = NativeStackScreenProps<FeedStackParamList, 'PostDetails'>;

export default function PostDetailsScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { posts, deletePost } = usePosts();
  const post = posts.find(p => p.id === route.params.postId);

  if (!post) {
    return (
      <Screen>
        <View style={{ padding: 16 }}>
          <AppText>Post not found.</AppText>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ padding: 16, gap: 12 }}>
        <AppText style={{ fontSize: 20, fontWeight: '900' }}>{post.title}</AppText>
        <AppText style={{ opacity: 0.9 }}>{post.body}</AppText>
        <AppText style={{ color: theme.colors.mutedText }}>
          @{post.authorName} • {new Date(post.createdAtISO).toLocaleString()}
        </AppText>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <AppButton
            label="Edit"
            onPress={() => navigation.navigate('EditPost', { postId: post.id })}
            style={{ flex: 1 }}
          />
        </View>

        <AppButton
          label="Delete"
          variant="danger"
          onPress={async () => {
            await deletePost(post.id);
            navigation.goBack();
          }}
        />
      </View>
    </Screen>
  );
}