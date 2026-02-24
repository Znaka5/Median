import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PostsProvider } from './context/PostContext';
import RootNavigator from './navigation/RootNavigator';

function Inner() {
  const { theme, themeName } = useTheme();
  const isDark = themeName === 'systemDark' || themeName === 'purpleHaze' || themeName === 'hackTheSystem' || themeName === 'fineRoyal';

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </>
  );
}

export default function AppRoot() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PostsProvider>
            <Inner />
          </PostsProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
