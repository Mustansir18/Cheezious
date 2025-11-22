'use client';

import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <OrderProvider>
          <CartProvider>{children}</CartProvider>
        </OrderProvider>
      </main>
    </div>
  );
}
