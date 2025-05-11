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
      this.clearAuthData();
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  },

  // Validate token
  async validateToken(): Promise<{ valid: boolean; expired?: boolean }> {
    try {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      
      if (tokenExpiry) {
        const now = new Date();
        const expiry = new Date(tokenExpiry);
        
        if (now >= expiry) {
          return { valid: false, expired: true };
        }
      }
      
      await this.getCurrentUser();
      return { valid: true };
    } catch (error) {
      return { valid: false, expired: false };
    }
  },

  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('remember');
  }
};