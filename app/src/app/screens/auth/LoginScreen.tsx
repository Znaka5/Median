import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Screen from '../../common/Screen';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import AnimatedHeader from '../../common/AnimatedHeader';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type Form = { email: string; password: string };

export default function LoginScreen({ navigation }: Props) {
  // 🔥 ALL HOOKS AT TOP — no conditions
  const { theme } = useTheme();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: { email: '', password: '' },
  });

  // 🔥 handler (not a hook)
  const onSubmit = async (data: Form) => {
    try {
      setSubmitError(null);
      await login(data.email, data.password);
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
        <AnimatedHeader title="Welcome back" subtitle="Login to continue" />

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
                    {String(errors.email.message)}
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
                    {String(errors.password.message)}
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

          <AppButton label="Login" onPress={handleSubmit(onSubmit)} />

          <AppButton
            label="Create account"
            variant="ghost"
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}