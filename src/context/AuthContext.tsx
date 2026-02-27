import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

const USER_KEY = '@shopease_user';

GoogleSignin.configure({
  webClientId: '583646362089-n4o8q0ptigl3c8f51sdgr3i1vratpjja.apps.googleusercontent.com',
  offlineAccess: true,
  scopes: ['profile', 'email'],
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null as any);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        const info = (currentUser as any).data?.user ?? (currentUser as any).user ?? currentUser;
        const userData: User = {
          id: info.id ?? '',
          name: info.name ?? null,
          email: info.email ?? '',
          photo: info.photo ?? null,
        };
        setUser(userData);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      }
    } catch (error) {
      console.log('Error checking current user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (response.data) {
        const userData: User = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          photo: response.data.user.photo,
        };
        setUser(userData);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.log('Sign in error:', error);
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.log('Google sign out error:', error);
    }
    setUser(null);
    await AsyncStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
