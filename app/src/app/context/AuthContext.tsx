import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../services/firebase';
import type { User } from '../types/models';

type AuthState = {
  user: User | null;
  token: string | null;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();

        const appUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName:
            firebaseUser.displayName ??
            firebaseUser.email?.split('@')[0] ??
            'User',
          favoriteMusic: 'Lo-fi / Synthwave',
        };

        setCurrentUser(appUser);
        setAuthToken(token);
      } else {
        setCurrentUser(null);
        setAuthToken(null);
      }

      setIsBootstrapping(false);
    });

    return unsubscribe;
  }, []);

  // LOGIN
  const login = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = credential.user;

      const appUser: User = {
        id: firebaseUser.uid,
        email,
      };

      const token = await firebaseUser.getIdToken();

      setCurrentUser(appUser);
      setAuthToken(token);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email');
      }
      if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email');
      }
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many attempts. Try later.');
      }

      throw new Error('Login failed');
    }
  };

  // REGISTER
  const register = async (email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = credential.user;

      const appUser: User = {
        id: firebaseUser.uid,
        email,
        displayName: email.split('@')[0] ?? 'User',
        favoriteMusic: 'Lo-fi / Synthwave',
      };

      const token = await firebaseUser.getIdToken();

      setCurrentUser(appUser);
      setAuthToken(token);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already registered');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak');
      }

      throw new Error('Registration failed');
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const contextValue = useMemo(
    () => ({
      user: currentUser,
      token: authToken,
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [currentUser, authToken, isBootstrapping]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return authContext;
}