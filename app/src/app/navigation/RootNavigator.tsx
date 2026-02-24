import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingState from '../common/LoadingState';

export default function RootNavigator() {
  const { token, isBootstrapping } = useAuth();
  const { theme } = useTheme();

  if (isBootstrapping) {
    return <LoadingState label="Bootstrapping session..." />;
  }

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.bg
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {token ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}