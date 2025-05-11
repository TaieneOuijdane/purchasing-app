// src/services/userService.ts
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

// Fonction utilitaire pour transformer la réponse de l'API
const transformApiResponse = (data: any): User[] => {
  // Si la réponse est au format hydra/API Platform avec "member"
  if (data && data.member && Array.isArray(data.member)) {
    return data.member.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles || [],
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt
    }));
  }
  
  // Si la réponse est déjà un tableau d'utilisateurs
  if (Array.isArray(data)) {
    return data.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles || [],
      isActive: user.isActive !== undefined ? user.isActive : true,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt
    }));
  }
  
  // Si la réponse est d'un format inattendu, retourner un tableau vide
  console.error('Format de réponse API inattendu:', data);
  return [];
};

export const userService = {
  // Get all users (admin only)
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get<any>('/users');
      return transformApiResponse(response.data);
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
      // Utiliser PATCH au lieu de PUT
      const response = await api.patch<User>(`/users/${id}`, userData, {
        headers: {
          'Content-Type': 'application/merge-patch+json',  // Format spécial pour PATCH avec API Platform
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user (admin only)
  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default userService;