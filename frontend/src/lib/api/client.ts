import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API wrapper functions
export const api = {
  // Products
  getProducts: async (params?: any) => {
    const response = await apiClient.get('/products/', { params });
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await apiClient.get('/products/', { 
      params: { featured: true, limit: 6 } 
    });
    return response.data;
  },

  getBestsellers: async () => {
    const response = await apiClient.get('/products/bestsellers/');
    return response.data;
  },

  getProduct: async (id: string) => {
    const response = await apiClient.get(`/products/${id}/`);
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await apiClient.get('/categories/');
    return response.data;
  },

  getCategoryProducts: async (categoryId: string) => {
    const response = await apiClient.get(`/categories/${categoryId}/products/`);
    return response.data;
  },

  // Auth
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login/', credentials);
    return response.data;
  },

  register: async (userData: any) => {
    const response = await apiClient.post('/auth/register/', userData);
    return response.data;
  },

  // Cart
  getCart: async () => {
    const response = await apiClient.get('/cart/');
    return response.data;
  },

  addToCart: async (productId: number, quantity: number) => {
    const response = await apiClient.post('/cart/', { product_id: productId, quantity });
    return response.data;
  },

  // Orders
  createOrder: async (orderData: any) => {
    const response = await apiClient.post('/orders/', orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await apiClient.get('/orders/');
    return response.data;
  },
};

export default apiClient;
