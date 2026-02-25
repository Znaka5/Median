import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Screen from '../../common/Screen';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import AnimatedHeader from '../../common/AnimatedHeader';
import { useTheme } from '../../context/ThemeContext';
import { getAuth, sendPasswordResetEmail, confirmPasswordReset } from 'firebase/auth';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;
type Form = { email: string; };

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const auth = getAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: Form) => {
    try {
      setSubmitError(null);
      setSuccess(null);

      await sendPasswordResetEmail(auth, data.email);

      setSuccess('Password reset email sent. Check your inbox.');
    } catch (e: any) {
      setSubmitError(e.message);
    }
  };

  const inputStyle = {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: theme.colors.text,
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <AnimatedHeader
          title="Reset Password"
          subtitle="Enter your email to reset"
        />

        <View style={{ padding: 16, gap: 12 }}>

          <AppText>Email</AppText>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Invalid email',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="you@email.com"
                  placeholderTextColor={theme.colors.mutedText}
                  style={[
                    inputStyle,
                    { borderColor: errors.email ? 'red' : theme.colors.border },
                  ]}
                />
                {errors.email && (
                  <AppText style={{ color: 'red' }}>
                    {String(errors.email.message)}
                  </AppText>
                )}
              </>
            )}
          />

          {submitError && (
            <AppText style={{ color: 'red', textAlign: 'center' }}>
              {submitError}
            </AppText>
          )}

          {success && (
            <AppText style={{ color: theme.colors.primary, textAlign: 'center' }}>
              {success}
            </AppText>
          )}

          <AppButton label="Send Reset Email" onPress={handleSubmit(onSubmit)} />

          <AppButton
            label="Back to Login"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}