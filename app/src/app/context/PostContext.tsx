import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import type { Post } from '../types/models';

type PostsCtx = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const PostsContext = createContext<PostsCtx | null>(null);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const snapshot = await getDocs(collection(db, 'posts'));

      const userId = auth.currentUser?.uid;

      const loadedPosts: Post[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          title: data.title ?? '',
          body: data.body ?? '',
          authorId: data.authorId ?? '',
          authorName: data.authorName ?? '',
          createdAtISO: data.createdAt?.toDate?.().toISOString?.() ?? '',
          likedByMe: data.likedBy?.includes?.(userId) ?? false,
        };
      });

      setPosts(loadedPosts);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const value = useMemo(
    () => ({
      posts,
      isLoading,
      error,
      refresh: fetchPosts,
    }),
    [posts, isLoading, error]
  );

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}