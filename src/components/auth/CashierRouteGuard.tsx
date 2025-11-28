
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader } from 'lucide-react';

export function CashierRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return; // Wait until authentication state is loaded
    }

    if (!user) {
      // Not logged in, redirect to login page
      router.replace('/login');
      return;
    } 
    
    const isAuthorized = user.role === 'cashier' || user.role === 'admin';
    if (!isAuthorized) {
      // Logged in, but not authorized for cashier view, redirect to home
      router.replace('/'); 
    }
  }, [user, isLoading, router]);

  // Show loading screen while verifying auth state or if user is not yet loaded/authorized
  if (isLoading || !user || !(user.role === 'cashier' || user.role === 'admin')) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
