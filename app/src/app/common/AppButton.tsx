import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../context/ThemeContext';

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'ghost';
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  const bg =
    variant === 'primary' ? theme.colors.primary : variant === 'danger' ? theme.colors.danger : 'transparent';
  const border = variant === 'ghost' ? theme.colors.border : 'transparent';
  const textColor = variant === 'ghost' ? theme.colors.text : theme.colors.primaryText;

  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 12,
        backgroundColor: bg,
        borderWidth: variant === 'ghost' ? 1 : 0,
        borderColor: border,
        alignItems: 'center',
        ...style,
      }}
    >
      <AppText style={{ color: textColor, fontWeight: '700' }}>{label}</AppText>
    </Pressable>
  );
}
