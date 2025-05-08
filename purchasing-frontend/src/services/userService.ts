import api from './api';
import type { User } from '../types';

export interface UserCreationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
}

export interface UserUpdateData {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  isActive?: boolean;
}

export const userService = {
  // Get all users (admin only)
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID (admin or self)
  async getUser(id: number): Promise<User> {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new user (admin only)
  async createUser(userData: UserCreationData): Promise<User> {
    try {
      const response = await api.post<User>('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user (admin or self)
  async updateUser(id: number, userData: UserUpdateData): Promise<User> {
    try {
      const response = await api.put<User>(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user (admin only)
  async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  }
};