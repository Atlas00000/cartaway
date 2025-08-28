// Product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  compare_price?: string;
  cost_price?: string;
  sku: string;
  barcode?: string;
  weight?: string;
  dimensions?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  is_active: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  category: Category;
  primary_image?: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  parent?: Category;
  is_active: boolean;
  children: Category[];
  product_count: number;
  created_at: string;
}

// User types
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  is_verified: boolean;
  date_joined: string;
}

// Order types
export interface Order {
  id: number;
  order_number: string;
  user: User;
  status: string;
  total_amount: string;
  subtotal: string;
  tax_amount: string;
  shipping_amount: string;
  created_at: string;
  updated_at: string;
}

// Cart types
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  total_price: string;
}

export interface Cart {
  id: number;
  user: User;
  items: CartItem[];
  total_amount: string;
  item_count: number;
}

// Auth types
export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: User;
}

// API Response types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Blog types
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author: string;
  published_at: string;
  tags: string[];
}

// Service types
export interface Service {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  image?: string;
  is_active: boolean;
}

// Stats types
export interface Stats {
  total_products: number;
  total_orders: number;
  total_users: number;
  total_revenue: string;
}
