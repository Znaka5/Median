import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function AppText(props: TextProps) {
  const { theme } = useTheme();
  return <Text {...props} style={[{ color: theme.colors.text }, props.style]} />;
}
