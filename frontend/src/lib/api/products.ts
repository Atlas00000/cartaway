import apiClient from './client';
import { Product, Category, PaginatedResponse } from '@/lib/types/api';

export const productsApi = {
  // Get featured products
  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiClient.get('/products/', {
        params: {
          featured: true,
          limit: 6
        }
      });
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  // Get all products with pagination
  getProducts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
    featured?: boolean;
    bestseller?: boolean;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get('/products/', { params });
    return response.data;
  },

  // Get single product by ID or slug
  getProduct: async (identifier: string | number): Promise<Product> => {
    const response = await apiClient.get(`/products/${identifier}/`);
    return response.data;
  },

  // Get categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await apiClient.get('/categories/');
      return response.data.results || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get category by ID or slug
  getCategory: async (identifier: string | number): Promise<Category> => {
    const response = await apiClient.get(`/categories/${identifier}/`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (
    categoryId: number | string,
    params?: {
      page?: number;
      limit?: number;
      sort_by?: string;
    }
  ): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get(`/categories/${categoryId}/products/`, { params });
    return response.data;
  },

  // Search products
  searchProducts: async (query: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get('/products/search/', {
      params: { q: query, ...params }
    });
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (productId: number, params?: {
    page?: number;
    limit?: number;
    sort_by?: string;
  }) => {
    const response = await apiClient.get(`/products/${productId}/reviews/`, { params });
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (productId: number) => {
    const response = await apiClient.post('/wishlist/add/', { product: productId });
    return response.data;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId: number) => {
    const response = await apiClient.delete(`/wishlist/remove/${productId}/`);
    return response.data;
  },

  // Get wishlist
  getWishlist: async () => {
    const response = await apiClient.get('/wishlist/');
    return response.data;
  }
};
