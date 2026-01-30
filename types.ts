
export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
  sku: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface SalesData {
  month: string;
  revenue: number;
  profit: number;
}

export interface CategoryData {
  name: string;
  value: number;
}

export type ViewType = 'dashboard' | 'inventory' | 'analytics' | 'settings';
