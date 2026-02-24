import React from 'react';
import { Pressable, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

export default function LikeButton({ liked, onToggle }: { liked: boolean; onToggle: () => void }) {
  const { theme } = useTheme();
  return (
    <Pressable onPress={onToggle} hitSlop={10}>
      <View style={{ padding: 6, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border }}>
        <Icon
          name={liked ? 'thumb-up' : 'thumb-up-outline'}
          size={18}
          color={liked ? theme.colors.primary : theme.colors.mutedText}
        />
      </View>
    </Pressable>
  );
}
