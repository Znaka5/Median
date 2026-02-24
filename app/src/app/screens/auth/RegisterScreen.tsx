import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Screen from '../../common/Screen';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import AnimatedHeader from '../../common/AnimatedHeader';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

type Form = { email: string; password: string; confirm: string };

export default function RegisterScreen() {
  const { theme } = useTheme();
  const { register } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: { email: '', password: '', confirm: '' },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: Form) => {
    try {
      setSubmitError(null);
      await register(data.email, data.password);
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
          title="Create account"
          subtitle="Register to enter the app"
        />

        <View style={{ padding: 16, gap: 12 }}>

          {/* EMAIL */}
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
                    {errors.email.message}
                  </AppText>
                )}
              </>
            )}
          />

          {/* PASSWORD */}
          <AppText>Password</AppText>
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password required',
              minLength: {
                value: 6,
                message: 'Minimum 6 characters',
              },
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  placeholder="min 6 chars"
                  placeholderTextColor={theme.colors.mutedText}
                  style={[
                    inputStyle,
                    { borderColor: errors.password ? 'red' : theme.colors.border },
                  ]}
                />
                {errors.password && (
                  <AppText style={{ color: 'red' }}>
                    {errors.password.message}
                  </AppText>
                )}
              </>
            )}
          />

          {/* CONFIRM PASSWORD */}
          <AppText>Confirm password</AppText>
          <Controller
            control={control}
            name="confirm"
            rules={{
              required: 'Please confirm password',
              validate: value =>
                value === passwordValue || 'Passwords do not match',
            }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  placeholder="repeat password"
                  placeholderTextColor={theme.colors.mutedText}
                  style={[
                    inputStyle,
                    { borderColor: errors.confirm ? 'red' : theme.colors.border },
                  ]}
                />
                {errors.confirm && (
                  <AppText style={{ color: 'red' }}>
                    {errors.confirm.message}
                  </AppText>
                )}
              </>
            )}
          />

          {/* FIREBASE ERROR */}
          {submitError && (
            <AppText style={{ color: 'red', textAlign: 'center' }}>
              {submitError}
            </AppText>
          )}

          <AppButton label="Register" onPress={handleSubmit(onSubmit)} />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}