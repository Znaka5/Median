import React, { useState } from 'react';
import { TextInput, View, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useForm, Controller } from 'react-hook-form';

import Screen from '../../common/Screen';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';

import { usePosts } from '../../context/PostContext';
import { useTheme } from '../../context/ThemeContext';

type Form = {
  title: string;
  body: string;
  publishDate: Date;
};

export default function CreatePostScreen() {
  const { theme } = useTheme();
  const { createPost } = usePosts();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: {
      title: '',
      body: '',
      publishDate: new Date(),
    },
  });

  const [showDate, setShowDate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const today = new Date();

  const minDate = new Date();
  minDate.setDate(today.getDate() - 7);

  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  const onSubmit = async (data: Form) => {
    try {
      setSubmitError(null);
      setSubmitting(true);

      const diffDays =
        Math.abs(
          (data.publishDate.getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        );

      if (diffDays > 7) {
        setSubmitError('Date must be within ±7 days');
        return;
      }

      await createPost(data);

      reset(); // clear form
    } catch (e: any) {
      setSubmitError(
        e?.message || 'Failed to publish post. Try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <View style={{ padding: 16, gap: 12 }}>
        <AppText style={{ fontWeight: '900' }}>
          Create Post
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
              placeholder="Write..."
              multiline
              placeholderTextColor={theme.colors.mutedText}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: 12,
                padding: 12,
                minHeight: 140,
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

        <AppText>Publish Date</AppText>
        <Controller
          control={control}
          name="publishDate"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Pressable
                onPress={() => setShowDate(true)}
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <AppText>{value.toDateString()}</AppText>
              </Pressable>

              {showDate && (
                <DateTimePicker
                  value={value}
                  mode="date"
                  display="default"
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  onChange={(event, selectedDate) => {
                    setShowDate(false);

                    if (event.type === 'dismissed') return;
                    if (selectedDate) onChange(selectedDate);
                  }}
                />
              )}
            </View>
          )}
        />
        <AppButton
          label={submitting ? 'Publishing...' : 'Publish'}
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