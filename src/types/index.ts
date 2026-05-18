/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'passive';
  image: string;
  marketplaces: string[];
  brand: string;
  platformId?: string;
  platformType?: string;
  parentId?: string | null;
  lastUpdated?: string;
}

export interface ProductInput {
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status?: 'active' | 'passive';
  image?: string;
  brand?: string;
  marketplaces?: string[];
}

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid';
  marketplace: string;
  createdAt: string;
  shippingAddress?: string;
  phone?: string;
  platformId?: string;
  platformType?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
}

// Marketplace Types
export interface Marketplace {
  id: string;
  type: 'woocommerce' | 'trendyol' | 'other';
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  isActive: boolean;
  ordersToday?: number;
  productsSynced?: number;
  apiUrl?: string;
  apiKey?: string;
  apiSecret?: string;
  supplierId?: string;
}

// Status Types
export interface ServerStatus {
  status: 'running' | 'error';
  message: string;
  time?: string;
  error?: boolean;
}

// Hook Response Types
export interface UseFetchResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UseFetchMutationResponse<T, R> {
  mutate: (data: T) => Promise<R>;
  loading: boolean;
  error: Error | null;
}

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
}
