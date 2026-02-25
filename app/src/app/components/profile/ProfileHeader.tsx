import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Image, Pressable } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../services/firebase';
import AppText from '../../common/AppText';
import { useTheme } from '../../context/ThemeContext';
import type { User } from '../../types/models';

const BANNER_HEIGHT = 120;
const AVATAR_SIZE = 84;

export default function ProfileHeader({ user }: { user: User }) {
  const { theme } = useTheme();

  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [bannerBase64, setBannerBase64] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [favoriteMusic, setFavoriteMusic] = useState('');

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const ref = doc(db, 'users', uid);

    const unsubscribe = onSnapshot(ref, async (snap) => {
      if (!snap.exists()) {
        await setDoc(ref, {
          displayName: user.displayName ?? '',
          favoriteMusic: user.favoriteMusic ?? '',
          avatarUrl: null,
          bannerUrl: null,
        });
        return;
      }

      const data = snap.data();
      if (!data) return;

      setDisplayName(data.displayName ?? '');
      setFavoriteMusic(data.favoriteMusic ?? '');
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data = snap.data();
      if (!data) return;

      if (data.avatarUrl) setAvatarBase64(data.avatarUrl);
      if (data.bannerUrl) setBannerBase64(data.bannerUrl);
    };

    loadImages();
  }, [user]);

  const pickImage = async (type: 'avatar' | 'banner') => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.5,
    });

    if (result.didCancel || !result.assets?.length) return;

    const base64 = result.assets[0].base64;
    if (!base64) return;

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const ref = doc(db, 'users', uid);

    if (type === 'avatar') {
      setAvatarBase64(base64);
      await setDoc(ref, { avatarUrl: base64 }, { merge: true });
    } else {
      setBannerBase64(base64);
      await setDoc(ref, { bannerUrl: base64 }, { merge: true });
    }
  };

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <Pressable onPress={() => pickImage('banner')}>
        <View
          style={{
            height: BANNER_HEIGHT,
            backgroundColor: theme.colors.card,
            overflow: 'hidden',
          }}
        >
          {bannerBase64 && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${bannerBase64}` }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          )}
        </View>
      </Pressable>

      <View
        style={{
          marginTop: -AVATAR_SIZE / 2,
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 18,
          marginHorizontal: 16,
          padding: 16,
          paddingTop: AVATAR_SIZE / 2 + 12,
        }}
      >
        <Pressable onPress={() => pickImage('avatar')}>
          <View
            style={{
              position: 'absolute',
              top: -AVATAR_SIZE / 2,
              left: 8,
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              borderRadius: AVATAR_SIZE / 2,
              borderWidth: 2,
              borderColor: theme.colors.border,
              overflow: 'hidden',
              backgroundColor: theme.colors.border,
            }}
          >
            {avatarBase64 && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${avatarBase64}` }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            )}
          </View>
        </Pressable>

        <View style={{ marginLeft: AVATAR_SIZE + 24, gap: 6 }}>
          <AppText style={{ fontSize: 20, fontWeight: '900' }}>
            {displayName}
          </AppText>
          <AppText style={{ color: theme.colors.mutedText }}>
            Favorite music: {favoriteMusic}
          </AppText>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 24,
          paddingHorizontal: 24,
          paddingVertical: 14,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
        }}
      />
    </Animated.View>
  );
}