import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
});

// User profile schema
export const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
});

// Address schema
export const addressSchema = z.object({
  line1: z.string().min(1, 'Address line 1 is required'),
  line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

// Product review schema
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment must be less than 1000 characters'),
});

// Cart item schema
export const addToCartSchema = z.object({
  product: z.number().positive('Product ID is required'),
  variant: z.number().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// Checkout schema
export const checkoutSchema = z.object({
  billing_address: addressSchema,
  shipping_address: addressSchema,
  shipping_method: z.number().positive('Shipping method is required'),
  payment_method: z.string().min(1, 'Payment method is required'),
  notes: z.string().optional(),
});

// Search and filter schemas
export const productFilterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  in_stock: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_bestseller: z.boolean().optional(),
  ordering: z.enum(['price', '-price', 'name', '-name', 'created_at', '-created_at']).optional(),
  page: z.number().min(1).optional(),
});

// Notification preference schema
export const notificationPreferenceSchema = z.object({
  email_notifications: z.boolean(),
  order_updates: z.boolean(),
  price_alerts: z.boolean(),
  stock_alerts: z.boolean(),
  marketing_emails: z.boolean(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type AddToCartFormData = z.infer<typeof addToCartSchema>;
export type UpdateCartItemFormData = z.infer<typeof updateCartItemSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ProductFilterFormData = z.infer<typeof productFilterSchema>;
export type NotificationPreferenceFormData = z.infer<typeof notificationPreferenceSchema>;

