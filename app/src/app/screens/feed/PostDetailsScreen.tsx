import React, { useState } from 'react';
import { View, TextInput, ScrollView, Pressable } from 'react-native';
import Screen from '../../common/Screen';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';

import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../services/firebase';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../../navigation/FeedStack';

type Props = NativeStackScreenProps<FeedStackParamList, 'PostDetails'>;

export default function PostDetailsScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { posts, deletePost, refresh } = usePosts();
  const { user } = useAuth();

  const post = posts.find(p => p.id === route.params.postId);

  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  if (!post) {
    return (
      <Screen>
        <View style={{ padding: 16 }}>
          <AppText>Post not found.</AppText>
        </View>
      </Screen>
    );
  }

  const isOwner = user?.id === post.authorId;

  const addComment = async () => {
    try {
      setError(null);

      if (!comment.trim()) {
        setError('Comment cannot be empty');
        return;
      }

      setPosting(true);

      await updateDoc(doc(db, 'posts', post.id), {
        comments: arrayUnion({
          text: comment,
          authorId: user?.id ?? '',
          authorName: user?.displayName || user?.email || 'User',
          createdAt: new Date().toISOString(),
        }),
      });

      setComment('');
      await refresh();
    } catch {
      setError('Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const deleteComment = async (commentToDelete: any) => {
    const original = post.comments ?? [];

    const updated = original.filter(
      c =>
        !(
          c.text === commentToDelete.text &&
          c.authorName === commentToDelete.authorName &&
          c.createdAt === commentToDelete.createdAt
        )
    );

    await updateDoc(doc(db, 'posts', post.id), {
      comments: updated,
    });

    await refresh();
  };

  const comments = [...(post.comments ?? [])].sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return (
    <Screen>
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <AppText style={{ fontSize: 20, fontWeight: '900' }}>
          {post.title}
        </AppText>

        <AppText style={{ opacity: 0.9 }}>
          {post.body}
        </AppText>

        <AppText style={{ color: theme.colors.mutedText }}>
          @{post.authorName} • {new Date(post.createdAtISO).toLocaleString()}
        </AppText>

        {isOwner && (
          <>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <AppButton
                label="Edit"
                onPress={() =>
                  navigation.navigate('EditPost', { postId: post.id })
                }
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
          </>
        )}

        <View style={{ marginTop: 20, gap: 8 }}>
          <AppText style={{ fontWeight: '800' }}>
            Add Comment
          </AppText>

          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Write a comment..."
            multiline
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 12,
              padding: 10,
              minHeight: 80,
              color: theme.colors.text,
            }}
          />

          <AppButton
            label={posting ? 'Posting...' : 'Post'}
            onPress={addComment}
          />

          {error && (
            <AppText style={{ color: 'red' }}>
              {error}
            </AppText>
          )}
        </View>

        <ScrollView
          style={{ marginTop: 20, flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {comments.map((c: any, i: number) => {
            const canDelete =
              user?.id === c.authorId || isOwner;

            return (
              <View
                key={i}
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 12,
                  padding: 10,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <AppText style={{ fontWeight: '700' }}>
                    {c.authorName}
                  </AppText>

                  {canDelete && (
                    <Pressable onPress={() => deleteComment(c)}>
                      <AppText style={{ color: 'red' }}>
                        Delete
                      </AppText>
                    </Pressable>
                  )}
                </View>

                <AppText>{c.text}</AppText>

                <AppText style={{ color: theme.colors.mutedText }}>
                  {new Date(c.createdAt).toLocaleString()}
                </AppText>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </Screen>
  );
}