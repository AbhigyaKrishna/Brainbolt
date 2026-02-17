"use client";

import { create } from "zustand";
import type { User } from "@/types";
import { authApi } from "@/lib/api-client";
import {
  getAuthToken,
  setAuthToken,
  deleteAuthToken,
  getUserData,
  setUserData,
  deleteUserData,
} from "@/lib/cookies";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  setUser: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,

  initializeAuth: () => {
    // Load auth state from cookies on initialization
    const token = getAuthToken();
    const user = getUserData();

    if (token && user) {
      set({
        user,
        token,
        isAuthenticated: true,
        isInitialized: true,
      });
    } else {
      set({ isInitialized: true });
    }
  },

  setUser: (user, token) => {
    // Store in cookies
    setAuthToken(token);
    setUserData(user);

    set({
      user,
      token,
      isAuthenticated: true,
      error: null,
    });
  },

  logout: () => {
    // Clear cookies
    deleteAuthToken();
    deleteUserData();

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

      clearError: () => set({ error: null }),

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login({ username, password });
      const user = await authApi.getCurrentUser(response.access_token);
      
      // Store in cookies
      setAuthToken(response.access_token);
      setUserData(user);
      
      set({
        user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register({ username, email, password });
      const user = await authApi.getCurrentUser(response.access_token);
      
      // Store in cookies
      setAuthToken(response.access_token);
      setUserData(user);
      
      set({
        user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  getCurrentUser: async () => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser(token);
      
      // Update user data in cookies
      setUserData(user);
      
      set({ user, isLoading: false });
    } catch (error) {
      // Token is invalid, clear auth state
      get().logout();
      set({ isLoading: false });
    }
  },
}));
