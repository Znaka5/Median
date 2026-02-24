import React from 'react';
import { View } from 'react-native';
import Screen from '../../common/Screen';
import AnimatedHeader from '../../common/AnimatedHeader';
import ThemePickerSheet from '../../common/ThemePickerSheet';

export default function ProfileSettingsScreen() {
  return (
    <Screen>
      <AnimatedHeader title="Profile Settings" subtitle="Personal settings" />
      <View>
        <ThemePickerSheet />
      </View>
    </Screen>
  );
}
