import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../components/profile/ProfileScreen';
import ProfileSettingsScreen from '../components/profile/ProfileSettingsScreen';
import PostDetailsScreen from '../screens/feed/PostDetailsScreen';
import { useTheme } from '../context/ThemeContext';

export type ProfileStackParamList = {
  ProfileHome: { userId?: string } | undefined;
  ProfileSettings: undefined;
  PostDetails: { postId: string };
  ChangeUsername: undefined;
  ChangeEmail: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.bg },
        headerTintColor: theme.colors.mutedText,
        contentStyle: { backgroundColor: theme.colors.bg },
      }}
    >
      <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{ title: 'Settings' }} />

      <Stack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: 'Details' }} />
    </Stack.Navigator>
  );
}