import type { Branch, MenuItem } from './types';
import branchesData from '@/config/branches.json';

export const branches: Branch[] = branchesData.branches;

export const menuItems: MenuItem[] = [
  // Deals
  {
    id: 'deal-1',
    name: 'Somewhat Amazing 1',
    description: 'A perfect combo for two: 2 Zinger-style burgers, 1 regular fries, and 2 regular drinks.',
    price: 1250,
    category: 'Deals',
    imageId: 'deal-1',
  },
  {
    id: 'deal-2',
    name: 'Somewhat Amazing 2',
    description: 'A feast for two: 2 Zinger-style burgers, 2 pieces of crispy fried chicken, 1 large fries, and 2 regular drinks.',
    price: 1750,
    category: 'Deals',
    imageId: 'deal-2',
  },
  {
    id: 'deal-3',
    name: 'Somewhat Amazing 3',
    description: 'Great for sharing: 3 Zinger-style burgers, 1 large fries, and a 1-liter drink.',
    price: 1890,
    category: 'Deals',
    imageId: 'deal-3',
  },
  {
    id: 'deal-4',
    name: 'Somewhat Amazing 4',
    description: 'The ultimate combo: 3 Zinger-style burgers, 3 pieces of crispy fried chicken, and a 1-liter drink.',
    price: 2150,
    category: 'Deals',
    imageId: 'deal-4',
  },

  // Pizzas
  {
    id: 'p-small',
    name: 'Small Pizza Deal',
    description: 'One 6" personal pan pizza with your choice of topping and 1 regular drink.',
    price: 750,
    category: 'Pizzas',
    imageId: 'pizza-small',
  },
  {
    id: 'p-reg',
    name: 'Regular Pizza Deal',
    description: 'One 9" regular pizza with your choice of toppings and 2 regular drinks.',
    price: 1450,
    category: 'Pizzas',
    imageId: 'pizza-regular',
  },
  {
    id: 'p-large',
    name: 'Large Pizza Deal',
    description: 'One 12" large pizza with your choice of toppings and a 1-liter drink.',
    price: 1990,
    category: 'Pizzas',
    imageId: 'pizza-large',
  },

  // Burgers
  {
    id: 'b1',
    name: 'The Cheezious Classic',
    description: 'Our signature juicy beef patty with special sauce, fresh lettuce, cheese, pickles, and onions on a sesame seed bun.',
    price: 899,
    category: 'Burgers',
    imageId: 'burger-1',
  },
  {
    id: 'b2',
    name: 'Zesty Chicken Burger',
    description: 'A crispy breaded chicken fillet topped with a zesty mayo, crisp lettuce, and fresh tomatoes.',
    price: 799,
    category: 'Burgers',
    imageId: 'burger-2',
  },

  // Sides
  {
    id: 's1',
    name: 'Golden Fries',
    description: 'Perfectly crispy, golden-brown french fries, lightly salted.',
    price: 349,
    category: 'Sides',
    imageId: 'side-1',
  },
  {
    id: 's2',
    name: 'Fried Chicken Piece',
    description: 'One piece of our signature crispy and juicy fried chicken.',
    price: 250,
    category: 'Sides',
    imageId: 'deal-2'
  },


  // Drinks
  {
    id: 'd1',
    name: 'Soft Drink (Regular)',
    description: '345ml can of your favorite soft drink.',
    price: 100,
    category: 'Drinks',
    imageId: 'drink-1',
  },
  {
    id: 'd2',
    name: 'Soft Drink (1 Liter)',
    description: '1-liter bottle of your favorite soft drink.',
    price: 190,
    category: 'Drinks',
    imageId: 'drink-liter',
  },
  {
    id: 'd3',
    name: 'Soft Drink (1.5 Liter)',
    description: '1.5-liter bottle of your favorite soft drink.',
    price: 220,
    category: 'Drinks',
    imageId: 'drink-liter',
  },
  {
    id: 'd4',
    name: 'Mineral Water (Small)',
    description: 'A small bottle of refreshing mineral water.',
    price: 60,
    category: 'Drinks',
    imageId: 'drink-2',
  },
  {
    id: 'd5',
    name: 'Juice',
    description: 'A small carton of fruit juice.',
    price: 60,
    category: 'Drinks',
    imageId: 'juice-small',
  },
];
