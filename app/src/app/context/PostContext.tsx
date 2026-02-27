import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

import { auth, db } from '../../services/firebase';
import type { Post } from '../types/models';

type PostsCtx = {
  posts: Post[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createPost: (data: { title: string; body: string; publishDate: Date }) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  updatePost: (postId: string, data: { title: string; body: string }) => Promise<void>;
  deleteComment: (postId: string, comment: any) => Promise<void>;
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
          createdAtISO:
            data.createdAt?.toDate?.().toISOString?.() ?? '',
          likedByMe: data.likedBy?.includes?.(userId) ?? false,
          comments: data.comments ?? []
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

  const createPost = async (data: {
    title: string;
    body: string;
    publishDate: Date;
  }) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    await addDoc(collection(db, 'posts'), {
      title: data.title,
      body: data.body,
      authorId: user.uid,
      authorName: user.displayName ?? user.email ?? '',
      publishDate: data.publishDate,
      createdAt: serverTimestamp(),
      likedBy: [],
      comments: []
    });

    await fetchPosts();
  };

  const deletePost = async (postId: string) => {
    await deleteDoc(doc(db, 'posts', postId));
    await fetchPosts();
  };

  const updatePost = async (
    postId: string,
    data: { title: string; body: string }
  ) => {
    await updateDoc(doc(db, 'posts', postId), {
      title: data.title,
      body: data.body,
    });

    await fetchPosts();
  };

  const deleteComment = async (
    postId: string,
    commentToDelete: any
  ) => {
    const targetPost = posts.find(p => p.id === postId);
    if (!targetPost) return;

    const updated = (targetPost.comments ?? []).filter(
      c =>
        !(
          c.text === commentToDelete.text &&
          c.authorName === commentToDelete.authorName &&
          c.createdAt === commentToDelete.createdAt
        )
    );

    await updateDoc(doc(db, 'posts', postId), {
      comments: updated,
    });

    await fetchPosts();
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
      createPost,
      deletePost,
      updatePost,
      deleteComment
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