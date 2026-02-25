import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { updateEmail, EmailAuthProvider, reauthenticateWithCredential, User } from 'firebase/auth';
import { db, auth } from '../../../services/firebase';
import Screen from '../../common/Screen';
import AppText from '../../common/AppText';
import AppButton from '../../common/AppButton';
import AnimatedHeader from '../../common/AnimatedHeader';
import ThemePickerSheet from '../../common/ThemePickerSheet';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

type UsernameForm = { username: string };
type EmailForm = { email: string; currentPassword: string };
type MusicForm = { favoriteMusic: string };

export default function ProfileSettingsScreen() {
  const { theme } = useTheme();

  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuccess, setUsernameSuccess] = useState<string | null>(null);

  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  const [musicLoading, setMusicLoading] = useState(false);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [musicSuccess, setMusicSuccess] = useState<string | null>(null);

  // Username form
  const {
    control: usernameControl,
    handleSubmit: handleUsernameSubmit,
    formState: { errors: usernameErrors },
  } = useForm<UsernameForm>({
    defaultValues: { username: '' },
  });

  const onSubmitUsername = async (data: UsernameForm) => {
    setUsernameError(null);
    setUsernameSuccess(null);
    setUsernameLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      const currentData = snap.exists() ? snap.data() : {};
      await setDoc(ref, { ...currentData, displayName: data.username.trim() }, { merge: true });
      setUsernameSuccess('Username updated successfully.');
    } catch (err: any) {
      setUsernameError(err.message || 'Unable to update username.');
    } finally {
      setUsernameLoading(false);
    }
  };

  // Email form
  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({
    defaultValues: { email: '', currentPassword: '' },
  });

  const onSubmitEmail = async (data: EmailForm) => {
    setEmailError(null);
    setEmailSuccess(null);
    setEmailLoading(true);
    try {
      const user = auth.currentUser as User;
      if (!user || !user.email) throw new Error('User not authenticated');

      const credential = EmailAuthProvider.credential(user.email, data.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updateEmail(user, data.email.trim());

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      const currentData = snap.exists() ? snap.data() : {};
      await setDoc(ref, { ...currentData, email: data.email.trim() }, { merge: true });

      setEmailSuccess('Email updated successfully. Verification sent.');
    } catch (err: any) {
      switch (err.code) {
        case 'auth/wrong-password':
          setEmailError('Incorrect current password.');
          break;
        case 'auth/requires-recent-login':
          setEmailError('Please log in again to continue.');
          break;
        case 'auth/email-already-in-use':
          setEmailError('Email already in use.');
          break;
        case 'auth/invalid-email':
          setEmailError('Invalid email format.');
          break;
        case 'auth/operation-not-allowed':
          setEmailError('Email/password sign-in is disabled.');
          break;
        case 'auth/network-request-failed':
          setEmailError('Network error. Check connection.');
          break;
        default:
          setEmailError(err.message || 'Unable to update email.');
      }
    } finally {
      setEmailLoading(false);
    }
  };

  // Favorite music form
  const {
    control: musicControl,
    handleSubmit: handleMusicSubmit,
    formState: { errors: musicErrors },
  } = useForm<MusicForm>({
    defaultValues: { favoriteMusic: '' },
  });

  const onSubmitMusic = async (data: MusicForm) => {
    setMusicError(null);
    setMusicSuccess(null);
    setMusicLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      const currentData = snap.exists() ? snap.data() : {};
      await setDoc(ref, { ...currentData, favoriteMusic: data.favoriteMusic.trim() }, { merge: true });
      setMusicSuccess('Favorite music updated successfully.');
    } catch (err: any) {
      setMusicError(err.message || 'Unable to update favorite music.');
    } finally {
      setMusicLoading(false);
    }
  };

  const inputStyle = {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.card,
  };

  const separator = (
    <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 20 }} />
  );

  return (
    <Screen>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
            <AnimatedHeader title="Profile Settings" subtitle="Personal settings" />

            <View style={{ padding: 20 }}>
              <AppText style={{ fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Theme</AppText>
              <ThemePickerSheet />
            </View>

            {separator}

            {/* Username */}
            <View style={{ paddingHorizontal: 20 }}>
              <AppText style={{ fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Change Username</AppText>
              <Controller
                control={usernameControl}
                name="username"
                rules={{ required: 'Username is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter new username"
                    placeholderTextColor={theme.colors.mutedText}
                    style={[inputStyle, { borderColor: usernameErrors.username ? theme.colors.primary : theme.colors.border }]}
                  />
                )}
              />
              {usernameErrors.username && <AppText style={{ color: theme.colors.primary, fontSize: 13 }}>{usernameErrors.username.message}</AppText>}
              {usernameError && <AppText style={{ color: theme.colors.primary, textAlign: 'center' }}>{usernameError}</AppText>}
              {usernameSuccess && <AppText style={{ color: theme.colors.primary, textAlign: 'center' }}>{usernameSuccess}</AppText>}
              <View style={{ marginTop: 12 }}>
                <AppButton label={usernameLoading ? 'Updating...' : 'Update Username'} onPress={handleUsernameSubmit(onSubmitUsername)} />
              </View>
            </View>

            {separator}

            {/* Email */}
            <View style={{ paddingHorizontal: 20 }}>
              <AppText style={{ fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Change Email</AppText>
              <Controller
                control={emailControl}
                name="email"
                rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' } }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    placeholder="New email"
                    placeholderTextColor={theme.colors.mutedText}
                    style={[inputStyle, { borderColor: emailErrors.email ? theme.colors.primary : theme.colors.border }]}
                  />
                )}
              />
              <Controller
                control={emailControl}
                name="currentPassword"
                rules={{ required: 'Current password is required for verification' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    placeholder="Current password"
                    placeholderTextColor={theme.colors.mutedText}
                    style={[inputStyle, { borderColor: emailErrors.currentPassword ? theme.colors.primary : theme.colors.border, marginTop: 8 }]}
                  />
                )}
              />
              {emailErrors.email && <AppText style={{ color: theme.colors.primary, fontSize: 13 }}>{emailErrors.email.message}</AppText>}
              {emailErrors.currentPassword && <AppText style={{ color: theme.colors.primary, fontSize: 13 }}>{emailErrors.currentPassword.message}</AppText>}
              {emailError && <AppText style={{ color: theme.colors.primary, textAlign: 'center' }}>{emailError}</AppText>}
              {emailSuccess && <AppText style={{ color: theme.colors.primary, textAlign: 'center' }}>{emailSuccess}</AppText>}
              <View style={{ marginTop: 12 }}>
                <AppButton label={emailLoading ? 'Updating...' : 'Update Email'} onPress={handleEmailSubmit(onSubmitEmail)} />
                {emailLoading && <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: 8 }} />}
              </View>
            </View>

            {separator}

            {/* Favorite Music */}
            <View style={{ paddingHorizontal: 20 }}>
              <AppText style={{ fontWeight: '700', fontSize: 16, marginBottom: 10 }}>Favorite Music</AppText>
              <Controller
                control={musicControl}
                name="favoriteMusic"
                rules={{ required: 'Favorite music is required' }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your favorite music"
                    placeholderTextColor={theme.colors.mutedText}
                    style={[inputStyle, { borderColor: musicErrors.favoriteMusic ? theme.colors.primary : theme.colors.border }]}
                  />
                )}
              />
              {musicErrors.favoriteMusic && <AppText style={{ color: theme.colors.primary, fontSize: 13 }}>{musicErrors.favoriteMusic.message}</AppText>}
              {musicError && <AppText style={{ color: theme.colors.primary, textAlign: 'center' }}>{musicError}</AppText>}
              {musicSuccess && <AppText style={{ color: theme.colors.primary, textAlign: 'center' }}>{musicSuccess}</AppText>}
              <View style={{ marginTop: 12 }}>
                <AppButton label={musicLoading ? 'Updating...' : 'Update Favorite Music'} onPress={handleMusicSubmit(onSubmitMusic)} />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Screen>
  );
}