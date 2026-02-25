import React, { useState } from 'react';
import { View, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import Screen from '../../common/Screen';
import AppButton from '../../common/AppButton';
import ProfileHeader from './ProfileHeader';
import ProfileTabs, { ProfileTabKey } from './ProfileTabs';
import PostsGrid from './PostsGrid';
import AppText from '../../common/AppText';
import { useAuth } from '../../context/AuthContext';
import { usePosts } from '../../context/PostContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/ProfileStack';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const { posts } = usePosts();
  const [tab, setTab] = useState<ProfileTabKey>('posts');

  if (!user) return null;

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={{ padding: 16, gap: 12 }}>
            <ProfileHeader user={user} />
            <ProfileTabs active={tab} onChange={setTab} />
          </View>

          {tab === 'posts' ? (
            <PostsGrid posts={posts.slice(0, 12)} />
          ) : (
            <View style={{ padding: 16, gap: 12 }}>
              <AppText style={{ fontWeight: '900' }}>About</AppText>
              <AppText>
                Controll options here.
              </AppText>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                <AppButton
                  label="Settings"
                  variant="ghost"
                  onPress={() => navigation.navigate('ProfileSettings')}
                  style={{ flex: 1 }}
                />
                <AppButton
                  label="Logout"
                  variant="danger"
                  onPress={() => logout()}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}