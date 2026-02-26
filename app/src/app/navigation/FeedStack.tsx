import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FeedScreen from '../screens/feed/FeedScreen';
import PostDetailsScreen from '../screens/feed/PostDetailsScreen';
import EditPostScreen from '../screens/feed/EditPostScreen';
import CreatePostScreen from '../screens/feed/CreatePostScreen';
import { useTheme } from '../context/ThemeContext';
import { PostsProvider } from '../context/PostContext';

export type FeedStackParamList = {
  Feed: undefined;
  PostDetails: { postId: string };
  EditPost: { postId: string };
  CreatePost: undefined;
};

const Stack = createNativeStackNavigator<FeedStackParamList>();

export default function FeedStack() {
  const { theme } = useTheme();

  return (
    <PostsProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.bg },
          headerTintColor: theme.colors.mutedText,
          contentStyle: { backgroundColor: theme.colors.bg },
        }}
      >
        <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Boards' }} />
        <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
        <Stack.Screen name="EditPost" component={EditPostScreen} />
        <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      </Stack.Navigator>
    </PostsProvider>
  );
}