import type { Branch, MenuItem } from './types';
import branchesData from '@/config/branches.json';

export const branches: Branch[] = branchesData.branches;

export const menuItems: MenuItem[] = [
  // Deals
  {
    id: 'deal-1',
    name: 'Somewhat Amazing Deal 1',
    description: '1 Small Pizza & 345ml Drink.',
    price: 550,
    category: 'Deals',
    imageId: 'pizza-small',
  },
  {
    id: 'deal-2',
    name: 'Somewhat Amazing Deal 2',
    description: '1 Regular Pizza & 2 345ml Drinks.',
    price: 1350,
    category: 'Deals',
    imageId: 'pizza-regular',
  },
  {
    id: 'deal-3',
    name: 'Midnight Deal 1',
    description: '1 Small Pizza, 1 Zinger Burger.',
    price: 899,
    category: 'Deals',
    imageId: 'deal-1',
  },

  // Starters
  {
    id: 'starter-1',
    name: 'Cheezy Sticks',
    description: '4 Pcs of bread stuffed with cheese.',
    price: 550,
    category: 'Starters',
    imageId: 'side-1', // Needs a better image
  },
  {
    id: 'starter-2',
    name: 'Oven Baked Wings',
    description: '6 Pcs of delicious oven baked wings tossed in sauce of your choice.',
    price: 490,
    category: 'Starters',
    imageId: 'deal-2', // Needs a better image
  },
  
  // Pizzas
  {
    id: 'pizza-1',
    name: 'Chicken Tikka',
    description: 'A classically delicious combination of chicken tikka and onions.',
    price: 990,
    category: 'Pizzas',
    imageId: 'pizza-1',
  },
  {
    id: 'pizza-2',
    name: 'Chicken Fajita',
    description: 'An authentic taste of fajita variant marinated chicken, onion, green peppers with a layer of cheese.',
    price: 990,
    category: 'Pizzas',
    imageId: 'pizza-2',
  },
  {
    id: 'pizza-3',
    name: 'Cheezious Special',
    description: 'A mouth watering combination of 3 types of meat with all veggies and a double layer of cheese.',
    price: 1150,
    category: 'Pizzas',
    imageId: 'pizza-3',
  },

  // Burgers
  {
    id: 'b1',
    name: 'Zinger Burger',
    description: 'Crispy chicken fillet, tangy mayo, and fresh lettuce in a soft bun.',
    price: 490,
    category: 'Burgers',
    imageId: 'burger-2',
  },
  {
    id: 'b2',
    name: 'Patty Burger',
    description: 'A juicy chicken patty grilled to perfection, topped with our secret sauce.',
    price: 390,
    category: 'Burgers',
    imageId: 'burger-1',
  },

  // Sides
  {
    id: 's1',
    name: 'French Fries',
    description: 'Crispy golden fries served with our special dip sauce.',
    price: 350,
    category: 'Sides',
    imageId: 'side-1',
  },

  // Drinks
  {
    id: 'd1',
    name: 'Soft Drink',
    description: '345ml Can',
    price: 100,
    category: 'Drinks',
    imageId: 'drink-1',
  },
  {
    id: 'd2',
    name: 'Mineral Water',
    description: '500ml Bottle',
    price: 80,
    category: 'Drinks',
    imageId: 'drink-2',
  },
];
