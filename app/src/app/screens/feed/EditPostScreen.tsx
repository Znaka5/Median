import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Screen from '../../common/Screen';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../../navigation/FeedStack';

type Props = NativeStackScreenProps<
  FeedStackParamList,
  'EditPost'
>;

type Form = {
  title: string;
  body: string;
};

export default function EditPostScreen({
  route,
  navigation,
}: Props) {
  const { theme } = useTheme();
  const { posts, updatePost } = usePosts();

  const post = posts.find(
    p => p.id === route.params.postId
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {
      title: post?.title ?? '',
      body: post?.body ?? '',
    },
  });

  const [submitError, setSubmitError] =
    useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!post) {
    return (
      <Screen>
        <View style={{ padding: 16 }}>
          <AppText>Post not found.</AppText>
        </View>
      </Screen>
    );
  }

  const onSubmit = async (data: Form) => {
    try {
      setSubmitError(null);
      setSaving(true);

      await updatePost(post.id, data);

      navigation.goBack();
    } catch (e: any) {
      setSubmitError(
        e?.message || 'Failed to update post'
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <View style={{ padding: 16, gap: 12 }}>
        <AppText style={{ fontWeight: '900' }}>
          Edit
        </AppText>

        <AppText>Title</AppText>
        <Controller
          control={control}
          name="title"
          rules={{ required: true, minLength: 3 }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Title"
              placeholderTextColor={theme.colors.mutedText}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 12,
                padding: 12,
                color: theme.colors.text,
              }}
            />
          )}
        />
        {errors.title && (
          <AppText style={{ color: 'red' }}>
            Title must be at least 3 characters
          </AppText>
        )}

        <AppText>Body</AppText>
        <Controller
          control={control}
          name="body"
          rules={{ required: true, minLength: 10 }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Body..."
              multiline
              placeholderTextColor={theme.colors.mutedText}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 12,
                padding: 12,
                minHeight: 120,
                color: theme.colors.text,
              }}
            />
          )}
        />
        {errors.body && (
          <AppText style={{ color: 'red' }}>
            Body must be at least 10 characters
          </AppText>
        )}

        <AppButton
          label={saving ? 'Saving...' : 'Save'}
          onPress={handleSubmit(onSubmit)}
        />

        {submitError && (
          <AppText style={{ color: 'red' }}>
            {submitError}
          </AppText>
        )}
      </View>
    </Screen>
  );
}