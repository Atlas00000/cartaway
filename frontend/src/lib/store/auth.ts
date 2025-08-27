import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types/api';
import { authApi, tokenUtils } from '@/lib/api/auth';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Initialize auth state from localStorage
      initialize: () => {
        const user = tokenUtils.getUser();
        const isAuthenticated = tokenUtils.isAuthenticated();
        
        set({
          user,
          isAuthenticated,
          isLoading: false,
        });
      },

      // Login action
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.login({ email, password });
          
          // Store tokens and user data
          tokenUtils.storeTokens(response.access, response.refresh);
          tokenUtils.storeUser(response.user);

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
          });
          throw error;
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.register(userData);
          
          // Store tokens and user data
          tokenUtils.storeTokens(response.access, response.refresh);
          tokenUtils.storeUser(response.user);

          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed',
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        authApi.logout();
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Get user profile
      getProfile: async () => {
        set({ isLoading: true, error: null });

        try {
          const user = await authApi.getProfile();
          tokenUtils.storeUser(user);

          set({
            user,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to get profile',
          });
          
          // If profile fetch fails, user might be logged out
          if (error.status_code === 401) {
            get().logout();
          }
        }
      },

      // Update user profile
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });

        try {
          const updatedUser = await authApi.updateProfile(userData);
          tokenUtils.storeUser(updatedUser);

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update profile',
          });
          throw error;
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      // Only persist user data, not loading states
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

