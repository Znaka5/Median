import React from 'react';
import { ScrollView, View, Pressable, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppText from '../../common/AppText';
import { useTheme } from '../../context/ThemeContext';
import type { Post } from '../../types/models';
import type { FeedStackParamList } from '../../navigation/FeedStack';

export default function PostsGrid({
  posts,
  refreshing,
  onRefresh,
}: {
  posts: Post[];
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  const { theme } = useTheme();

  const navigation =
    useNavigation<NativeStackNavigationProp<FeedStackParamList>>();

  const rows = [];
  for (let i = 0; i < posts.length; i += 3) {
    rows.push(posts.slice(i, i + 3));
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 12,
        paddingBottom: 20,
        gap: 10,
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
    >
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: 'row',
            gap: 10,
            paddingHorizontal: 10,
          }}
        >
          {row.map((item) => (
            <Pressable
              key={item.id}
              onPress={() =>
                navigation.navigate('PostDetails', { postId: item.id })
              }
              style={{
                flex: 1,
                aspectRatio: 1,
                borderRadius: 14,
                backgroundColor: theme.colors.card,
                borderWidth: 1,
                borderColor: theme.colors.border,
                padding: 10,
                justifyContent: 'space-between',
              }}
            >
              <AppText
                numberOfLines={2}
                style={{ fontWeight: '800', fontSize: 12 }}
              >
                {item.title}
              </AppText>

              <AppText
                style={{ color: theme.colors.mutedText, fontSize: 11 }}
                numberOfLines={1}
              >
                {new Date(item.createdAtISO).toLocaleDateString()}
              </AppText>
            </Pressable>
          ))}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={{ flex: 1 }} />
            ))}
        </View>
      ))}
    </ScrollView>
  );
}