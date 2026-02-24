import React from 'react';
import { Pressable, View } from 'react-native';
import AppText from '../../common/AppText';
import { useTheme } from '../../context/ThemeContext';

export type ProfileTabKey = 'posts' | 'about';

export default function ProfileTabs({
  active,
  onChange,
}: {
  active: ProfileTabKey;
  onChange: (t: ProfileTabKey) => void;
}) {
  const { theme } = useTheme();

  const Tab = ({ k, label }: { k: ProfileTabKey; label: string }) => {
    const selected = active === k;
    return (
      <Pressable
        onPress={() => onChange(k)}
        style={{
          flex: 1,
          paddingVertical: 10,
          borderRadius: 14,
          backgroundColor: selected ? theme.colors.primary : 'transparent',
          borderWidth: selected ? 0 : 1,
          borderColor: theme.colors.border,
          alignItems: 'center',
        }}
      >
        <AppText style={{ fontWeight: '800', color: selected ? theme.colors.primaryText : theme.colors.text }}>
          {label}
        </AppText>
      </Pressable>
    );
  };

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      <Tab k="posts" label="Posts" />
      <Tab k="about" label="About" />
    </View>
  );
}
