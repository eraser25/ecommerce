export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'unpaid' | 'partial' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  marketplace: string;
  createdAt: string;
  shippingAddress?: string;
  phone?: string;
  trackingCode?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: string[];
  brand?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  minStockWarning?: number;
  status: 'active' | 'passive' | 'draft';
  images: string[];
  variants?: ProductVariant[];
  marketplaces: string[]; // ['woocommerce', 'trendyol', etc]
  updatedAt: string;
  dimensions?: {
    weight?: number;
    desi?: number;
    width?: number;
    height?: number;
    length?: number;
  };
}

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  price?: number;
  discountPrice?: number;
  stock: number;
  image?: string;
  options: {
    name: string; // Renk, Beden, etc.
    value: string;
  }[];
}

export interface MarketplaceConfig {
  id: string;
  type: 'woocommerce' | 'trendyol' | 'hepsiburada' | 'n11' | 'amazon' | 'ciceksepeti';
  name: string;
  apiKey: string;
  apiSecret?: string;
  storeId?: string;
  url?: string;
  isActive: boolean;
  lastSync?: string;
  status: 'connected' | 'error' | 'disconnected';
}

export interface DashboardStats {
  totalSales: number;
  dailySales: number;
  monthlyRevenue: number;
  orderCount: number;
  pendingOrders: number;
  lowStockItems: number;
  topProducts: {
    id: string;
    name: string;
    sales: number;
    image?: string;
  }[];
  performance: {
    date: string;
    sales: number;
    orders: number;
  }[];
}
