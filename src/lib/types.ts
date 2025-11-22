
export type Branch = {
  id: string;
  name: string;
  location: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageId: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageId: string;
};

export type OrderType = 'Dine-In' | 'Take Away';

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export type Order = {
    id: string; // Will be a client-generated UUID
    orderNumber: string;
    branchId: string;
    orderDate: string; // ISO string
    orderType: OrderType;
    status: OrderStatus;
    totalAmount: number;
    items: OrderItem[];
};

export type OrderItem = {
    id: string; // Will be a client-generated UUID
    orderId: string;
    menuItemId: string;
    quantity: number;
    itemPrice: number;
    name: string;
};

export type PlacedOrder = {
    orderId: string;
    orderNumber: string;
    total: number;
    branchName: string;
    orderType: OrderType;
}
