import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCjzUZ0-WiDkwLMAg9fdCz3yXzptXDjdso",
  authDomain: "median-1ad0b.firebaseapp.com",
  projectId: "median-1ad0b",
  storageBucket: "median-1ad0b.firebasestorage.app",
  messagingSenderId: "918168874860",
  appId: "1:918168874860:web:bb61dc049ab04974e2cd49",
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);