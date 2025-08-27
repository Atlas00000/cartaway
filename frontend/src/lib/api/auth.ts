import { api } from './client';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  RefreshTokenRequest, 
  User 
} from '@/lib/types/api';

// Authentication API endpoints
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login/', credentials);
    return response;
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register/', userData);
    return response;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await api.post<{ access: string }>('/auth/refresh/', {
      refresh: refreshToken,
    });
    return response;
  },

  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/profile/');
    return response;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/auth/profile/', userData);
    return response;
  },

  // Logout (client-side only, since JWT is stateless)
  logout: () => {
    // Remove tokens from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },
};

// Token management utilities
export const tokenUtils = {
  // Store tokens in localStorage
  storeTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  },

  // Get access token
  getAccessToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token');
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  },

  // Store user data
  storeUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  // Get user data
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  // Clear all auth data
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  },
};

