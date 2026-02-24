import React, { useEffect, useRef } from 'react';
import { Animated, View, Image } from 'react-native';
import AppText from '../../common/AppText';
import { useTheme } from '../../context/ThemeContext';
import type { User } from '../../types/models';

const BANNER_HEIGHT = 120;
const AVATAR_SIZE = 84;

export default function ProfileHeader({ user }: { user: User }) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(opacity, { toValue: 1, duration: 420, useNativeDriver: true }).start();
  }, [opacity, scale]);

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      
      <View
        style={{
          height: BANNER_HEIGHT,
          backgroundColor: theme.colors.card,
        }}
      />
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
        <View
          style={{
            position: 'absolute',
            top: -AVATAR_SIZE / 2,
            left: 16,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            borderWidth: 2,
            borderColor: theme.colors.border,
            overflow: 'hidden',
            backgroundColor: theme.colors.border,
          }}
        >
          {user.avatarUrl && (
            <Image
              source={{ uri: user.avatarUrl }}
              style={{ width: '100%', height: '100%' }}
            />
          )}
        </View>

        {/* User Info */}
        <View style={{ marginLeft: AVATAR_SIZE + 16, gap: 6 }}>
          <AppText style={{ fontSize: 20, fontWeight: '900' }}>
            {user.displayName}
          </AppText>

          <AppText style={{ color: theme.colors.mutedText }}>
            Favorite music: {user.favoriteMusic}
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
      >
      </View>
    </Animated.View>
  );
}