import React from 'react';
import { TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Screen from '../../common/Screen';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';

type Form = { title: string; body: string };

export default function CreatePostScreen() {
  const { theme } = useTheme();
  const { createPost } = usePosts();
  const { control, handleSubmit, reset } = useForm<Form>({ defaultValues: { title: '', body: '' } });

  return (
    <Screen>
      <View style={{ padding: 16, gap: 12 }}>
        <AppText style={{ fontWeight: '900' }}>Create Post</AppText>

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
              style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 12, color: theme.colors.text }}
            />
          )}
        />

        <AppText>Body</AppText>
        <Controller
          control={control}
          name="body"
          rules={{ required: true, minLength: 10 }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Write..."
              placeholderTextColor={theme.colors.mutedText}
              multiline
              style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 12, minHeight: 140, color: theme.colors.text }}
            />
          )}
        />

        <AppButton
          label="Publish"
          onPress={handleSubmit(async d => {
            await createPost(d);
            reset();
          })}
        />
      </View>
    </Screen>
  );
}
