import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from './firebase';

export async function getAllPosts(userId?: string) {
  const snapshot = await getDocs(collection(db, 'posts'));

  const posts = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data();

      let likedByMe = false;

      if (userId) {
        const likeRef = doc(db, 'posts', docSnap.id, 'likes', userId);
        const likeSnap = await getDoc(likeRef);
        likedByMe = likeSnap.exists();
      }

      return {
        id: docSnap.id,
        ...data,
        likedByMe,
      };
    })
  );

  return posts;
}


export async function toggleLikePost(postId: string, userId: string) {
  const postRef = doc(db, 'posts', postId);
  const likeRef = doc(db, 'posts', postId, 'likes', userId);

  const likeSnap = await getDoc(likeRef);

  if (likeSnap.exists()) {
    await deleteDoc(likeRef);

    await updateDoc(postRef, {
      likesCount: increment(-1),
    });

    return false;
  } else {
    await setDoc(likeRef, {
      createdAt: serverTimestamp(),
    });

    await updateDoc(postRef, {
      likesCount: increment(1),
    });

    return true;
  }
}