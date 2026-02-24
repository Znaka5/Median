import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Post } from '../types/models';

type PostsCtx = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;          // hook placeholder
  createPost: (p: Pick<Post, 'title' | 'body'>) => Promise<void>;
  updatePost: (id: string, patch: Partial<Pick<Post, 'title' | 'body'>>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  toggleLike: (id: string) => void;
};

const PostsContext = createContext<PostsCtx | null>(null);

const seedPosts = (): Post[] =>
  Array.from({ length: 12 }).map((_, i) => ({
    id: `p_${i + 1}`,
    authorId: 'u_seed',
    authorName: 'Seeder',
    title: `Post #${i + 1}`,
    body: 'Backbone content. Replace with real API later.',
    createdAtISO: new Date(Date.now() - i * 3600_000).toISOString(),
    likedByMe: false,
  }));

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(seedPosts());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    // Placeholder for API fetch + pull-to-refresh
    setIsLoading(true);
    setError(null);
    try {
      await new Promise<void>(r => setTimeout(r, 400));
      setPosts(prev => [...prev]); // no-op, replace with real GET
    } catch (e) {
      setError('Failed to refresh (placeholder).');
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (p: Pick<Post, 'title' | 'body'>) => {
    // Placeholder for POST
    const created: Post = {
      id: 'p_' + Math.random().toString(16).slice(2),
      authorId: 'u_me',
      authorName: 'Me',
      title: p.title,
      body: p.body,
      createdAtISO: new Date().toISOString(),
      likedByMe: false,
    };
    setPosts(prev => [created, ...prev]);
  };

  const updatePost = async (id: string, patch: Partial<Pick<Post, 'title' | 'body'>>) => {
    // Placeholder for PUT/PATCH
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, ...patch } : p)));
  };

  const deletePost = async (id: string) => {
    // Placeholder for DELETE
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, likedByMe: !p.likedByMe } : p)));
  };

  const value = useMemo(
    () => ({ posts, isLoading, error, refresh, createPost, updatePost, deletePost, toggleLike }),
    [posts, isLoading, error]
  );

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}