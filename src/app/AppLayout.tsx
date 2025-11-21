'use client';

import { CartProvider } from '@/context/CartContext';
import { useUser } from '@/firebase';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Ensure user is signed in anonymously
  useUser();

  return <CartProvider>{children}</CartProvider>;
}
