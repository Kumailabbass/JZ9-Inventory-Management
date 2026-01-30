
import { Product, SalesData, CategoryData } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'MacBook Pro M3', category: 'Electronics', stock: 12, price: 2499, status: 'In Stock', lastUpdated: '2024-05-20', sku: 'MBP-M3-001' },
  { id: '2', name: 'iPhone 15 Pro', category: 'Electronics', stock: 4, price: 999, status: 'Low Stock', lastUpdated: '2024-05-18', sku: 'IP15-P-002' },
  { id: '3', name: 'Logitech MX Master 3S', category: 'Accessories', stock: 45, price: 99, status: 'In Stock', lastUpdated: '2024-05-15', sku: 'LOG-MX-003' },
  { id: '4', name: 'Dell UltraSharp 27"', category: 'Electronics', stock: 8, price: 599, status: 'In Stock', lastUpdated: '2024-05-10', sku: 'DEL-US-004' },
  { id: '5', name: 'Herman Miller Aeron', category: 'Furniture', stock: 2, price: 1495, status: 'Low Stock', lastUpdated: '2024-05-12', sku: 'HM-AE-005' },
  { id: '6', name: 'Keychron K2 V2', category: 'Accessories', stock: 0, price: 89, status: 'Out of Stock', lastUpdated: '2024-05-21', sku: 'KC-K2-006' },
  { id: '7', name: 'Sony WH-1000XM5', category: 'Electronics', stock: 25, price: 399, status: 'In Stock', lastUpdated: '2024-05-19', sku: 'SNY-XM5-007' },
  { id: '8', name: 'Standing Desk Pro', category: 'Furniture', stock: 15, price: 799, status: 'In Stock', lastUpdated: '2024-05-08', sku: 'SD-PRO-008' },
];

export const SALES_TREND_DATA: SalesData[] = [
  { month: 'Jan', revenue: 4500, profit: 2100 },
  { month: 'Feb', revenue: 5200, profit: 2400 },
  { month: 'Mar', revenue: 4800, profit: 2200 },
  { month: 'Apr', revenue: 6100, profit: 3100 },
  { month: 'May', revenue: 5900, profit: 2900 },
  { month: 'Jun', revenue: 7200, profit: 3800 },
];

export const CATEGORY_DISTRIBUTION: CategoryData[] = [
  { name: 'Electronics', value: 45 },
  { name: 'Accessories', value: 30 },
  { name: 'Furniture', value: 25 },
];
