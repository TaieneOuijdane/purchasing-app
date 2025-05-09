import api from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  // Login user
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/login_check', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user data
  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/authenticated');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {    
      // Suppression du token
      localStorage.removeItem('token');
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  },

  // Validate token
  async validateToken(): Promise<{ valid: boolean }> {
    try {
      await this.getCurrentUser();
      return { valid: true };
    } catch (error) {
      return { valid: false };
    }
  }
};