'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { Loader } from 'lucide-react';

interface FirebaseProviderProps {
  children: ReactNode;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export interface UserHookResult {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

const FullscreenLoader = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <Loader className="h-12 w-12 animate-spin text-primary" />
  </div>
);


export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    user: User | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Initialize Firebase services once
  const services = useMemo(() => initializeFirebase(), []);

  useEffect(() => {
    if (!services.auth) {
      setAuthState({ user: null, isLoading: false, error: new Error("Auth service not available.") });
      return;
    }
    
    const unsubscribe = onAuthStateChanged(
      services.auth,
      (firebaseUser) => {
        if (firebaseUser) {
          // User is signed in.
          setAuthState({ user: firebaseUser, isLoading: false, error: null });
        } else {
          // User is signed out, so attempt to sign them in anonymously.
          signInAnonymously(services.auth).catch((error) => {
             console.error("FirebaseProvider: Anonymous sign-in failed:", error);
             setAuthState({ user: null, isLoading: false, error });
          });
        }
      },
      (error) => {
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setAuthState({ user: null, isLoading: false, error });
      }
    );
    
    return () => unsubscribe();
  }, [services.auth]);

  const contextValue = useMemo((): FirebaseContextState => {
    // Only provide the services if authentication is complete and successful
    const servicesAvailable = !authState.isLoading && !!authState.user;
    
    return {
      firebaseApp: servicesAvailable ? services.firebaseApp : null,
      firestore: servicesAvailable ? services.firestore : null,
      auth: servicesAvailable ? services.auth : null,
      user: authState.user,
      isUserLoading: authState.isLoading,
      userError: authState.error,
    };
  }, [services, authState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {contextValue.isUserLoading ? <FullscreenLoader /> : children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  // If services are not available yet (still loading), throw an error.
  // This is stricter and safer. The provider should show a loader.
  if (!context.firebaseApp || !context.firestore || !context.auth) {
    // This case should ideally not be hit if the provider shows a loader,
    // but it's a good safeguard.
    throw new Error('Firebase services are not available. This is likely due to an initialization or authentication error.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T & {__memo?: boolean} {
  const memoized = useMemo(factory, deps);
  if (typeof memoized === 'object' && memoized !== null) {
    (memoized as any).__memo = true;
  }
  return memoized as T & {__memo?: boolean};
}

export const useUser = (): UserHookResult => {
  const context = useContext(FirebaseContext);
   if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider.');
  }
  const { user, isUserLoading, userError } = context;
  return { user, isUserLoading, userError };
};
