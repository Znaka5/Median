import React from 'react';
import { View } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { useTheme } from '../context/ThemeContext';
import type { ThemeName } from '../types/models';

const options: { key: ThemeName; label: string }[] = [
  { key: 'systemDark', label: 'Dark' },
  { key: 'systemLight', label: 'Light' },
  { key: 'freshMint', label: 'Fresh Mint' },
  { key: 'fineRoyal', label: 'Fine Royal' },
  { key: 'purpleHaze', label: 'Purple Haze' },
  { key: 'hackTheSystem', label: 'Hack The System' },
];

export default function ThemePickerSheet() {
  const { themeName, setThemeName } = useTheme();

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <AppText style={{ fontWeight: '900', fontSize: 16 }}>Theme</AppText>
      <View style={{ gap: 10 }}>
        {options.map(o => (
          <AppButton
            key={o.key}
            label={themeName === o.key ? `✓ ${o.label}` : o.label}
            variant={themeName === o.key ? 'primary' : 'ghost'}
            onPress={() => setThemeName(o.key)}
          />
        ))}
      </View>
    </View>
  );
}
