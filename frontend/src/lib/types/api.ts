// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

// Pagination Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RefreshTokenRequest {
  refresh: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  category: Category;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  is_in_stock: boolean;
  is_low_stock: boolean;
  discount_percentage: number;
  rating?: number;
  review_count?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: ProductReview[];
}

export interface ProductImage {
  id: number;
  product: number;
  image: string;
  alt_text?: string;
  is_primary: boolean;
  order: number;
}

export interface ProductVariant {
  id: number;
  product: number;
  name: string;
  sku?: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: Category;
  children: Category[];
  product_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Cart Types
export interface Cart {
  id: number;
  user: number;
  is_active: boolean;
  items: CartItem[];
  total_items: number;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number;
  cart: number;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product: number;
  variant?: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Wishlist Types
export interface Wishlist {
  id: number;
  user: number;
  product: Product;
  created_at: string;
}

// Order Types
export interface Order {
  id: number;
  order_number: string;
  user: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone?: string;
  billing_address: Address;
  shipping_address: Address;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_method?: string;
  payment_transaction_id?: string;
  payment_date?: string;
  shipping_method?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  notes?: string;
  ip_address?: string;
  user_agent?: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order: number;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total_price: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

// Checkout Types
export interface CheckoutRequest {
  billing_address: Address;
  shipping_address: Address;
  shipping_method: number;
  payment_method: string;
  notes?: string;
}

// Review Types
export interface ProductReview {
  id: number;
  product: number;
  user: User;
  rating: number;
  title: string;
  comment: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  rating: number;
  title: string;
  comment: string;
}

// Notification Types
export interface Notification {
  id: number;
  user: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type NotificationType = 
  | 'order'
  | 'price_alert'
  | 'stock_alert'
  | 'system';

export interface NotificationPreference {
  id: number;
  user: number;
  email_notifications: boolean;
  order_updates: boolean;
  price_alerts: boolean;
  stock_alerts: boolean;
  marketing_emails: boolean;
}

// Shipping Types
export interface ShippingMethod {
  id: number;
  name: string;
  description: string;
  price: number;
  estimated_days: number;
  is_active: boolean;
}

export interface TaxRate {
  id: number;
  name: string;
  rate: number;
  country: string;
  state?: string;
  is_active: boolean;
}

// Admin Types
export interface AdminDashboard {
  total_orders: number;
  total_revenue: number;
  total_products: number;
  total_users: number;
  recent_orders: Order[];
  low_stock_products: Product[];
}

// Error Types
export interface ApiError {
  error: string;
  message: string;
  status_code: number;
  details?: Record<string, any>;
}

