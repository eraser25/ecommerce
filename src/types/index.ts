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
  image?: string;
  marketplaces: string[];
  brand?: string;
  platformId?: string;
  platformType?: 'woocommerce' | 'trendyol';
  parentId?: string | null;
  lastUpdated?: string;
}

export interface UpdateProductPayload {
  name?: string;
  sku?: string;
  category?: string;
  price?: number;
  stock?: number;
  status?: 'active' | 'passive';
  brand?: string;
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
  platformType?: 'woocommerce' | 'trendyol';
}

export interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
}

// Marketplace Types
export interface Marketplace {
  id: string;
  name: string;
  type: 'woocommerce' | 'trendyol';
  status: 'connected' | 'disconnected';
  isActive: boolean;
  lastSync?: string;
  ordersToday: number;
  productsSynced: number;
  apiUrl?: string;
  apiKey?: string;
  apiSecret?: string;
  supplierId?: string;
}

// API Status
export interface ApiStatus {
  status: 'running' | 'offline';
  message: string;
  error?: boolean;
  time?: string;
}

// Label & Invoice
export interface LabelResponse extends ApiResponse<null> {
  labelUrl?: string;
  html?: string;
}

export interface InvoiceResponse extends ApiResponse<null> {
  invoiceUrl?: string;
  html?: string;
}

// Sync Response
export interface SyncResponse extends ApiResponse<null> {
  count?: number;
}
