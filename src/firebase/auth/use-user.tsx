"use client";
import {
  useUser as useFirebaseUser, // aliased to avoid name collision
  UserHookResult,
} from '@/firebase/provider';

// This hook now simply exposes the user state from the central provider.
export const useUser = (): UserHookResult => {
  const userState = useFirebaseUser();
  return userState;
};
