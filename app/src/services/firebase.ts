import { initializeApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCjzUZ0-WiDkwLMAg9fdCz3yXzptXDjdso",
  authDomain: "median-1ad0b.firebaseapp.com",
  projectId: "median-1ad0b",
  storageBucket: "median-1ad0b.firebasestorage.app",
  messagingSenderId: "918168874860",
  appId: "1:918168874860:web:bb61dc049ab04974e2cd49",
  measurementId: "G-R4FLV9BS2M"
};

const app = initializeApp(firebaseConfig);

export const auth = firebaseAuth.initializeAuth(app, {
  persistence: (firebaseAuth as any).getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);