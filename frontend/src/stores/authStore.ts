import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { User, AuthResponse } from '../../../shared/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  setAuthHeader: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await axios.post<AuthResponse>('/api/auth/login', {
            email,
            password,
          });

          const { user, token } = response.data;
          
          set({ user, token, isAuthenticated: true });
          get().setAuthHeader();
        } catch (error) {
          throw error;
        }
      },

      register: async (email: string, password: string, name?: string) => {
        try {
          const response = await axios.post<AuthResponse>('/api/auth/register', {
            email,
            password,
            name,
          });

          const { user, token } = response.data;
          
          set({ user, token, isAuthenticated: true });
          get().setAuthHeader();
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete axios.defaults.headers.common['Authorization'];
      },

      setAuthHeader: () => {
        const token = get().token;
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.setAuthHeader();
        }
      },
    }
  )
);