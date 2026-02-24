import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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

const SESSION_STORAGE_KEY = 'examapp.session';
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // Restore session on app start
  useEffect(() => {
    (async () => {
      try {
        const storedSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

        if (storedSession) {
          const parsedSession = JSON.parse(storedSession) as {
            user: User;
            token: string;
          };

          setCurrentUser(parsedSession.user);
          setAuthToken(parsedSession.token);
        }
      } finally {
        setIsBootstrapping(false);
      }
    })();
  }, []);

  // Persist session helper
  const persistSession = async (
    session: { user: User; token: string } | null
  ) => {
    if (!session) {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }

    await AsyncStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(session)
    );
  };

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
        displayName: email.split('@')[0] ?? 'User',
        favoriteMusic: 'Lo-fi / Synthwave',
      };

      const token = await firebaseUser.getIdToken();

      setCurrentUser(appUser);
      setAuthToken(token);

      await persistSession({
        user: appUser,
        token,
      });

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

      await persistSession({
        user: appUser,
        token,
      });

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

  // LOGOUT
  const logout = async () => {
    await signOut(auth);

    setCurrentUser(null);
    setAuthToken(null);

    await persistSession(null);
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

// Hook
export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return authContext;
}