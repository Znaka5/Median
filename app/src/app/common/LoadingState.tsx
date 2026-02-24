import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppText from './AppText';
import Screen from './Screen';
import { useTheme } from '../context/ThemeContext';

export default function LoadingState({ label }: { label?: string }) {
  const { theme } = useTheme();
  return (
    <Screen>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <ActivityIndicator />
        <AppText style={{ color: theme.colors.mutedText }}>{label ?? 'Loading...'}</AppText>
      </View>
    </Screen>
  );
}