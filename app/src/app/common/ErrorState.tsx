import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';

export default function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <AppText style={{ fontWeight: '800' }}>Error</AppText>
      <AppText>{message}</AppText>
      {onRetry ? <AppButton label="Retry" onPress={onRetry} /> : null}
    </View>
  );
}
