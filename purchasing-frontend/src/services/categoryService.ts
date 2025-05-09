import api from './api';
import type { Category } from '../types';

export interface CategoryCreationData {
  name: string;
  description?: string | null;
}

export interface CategoryUpdateData {
  name?: string;
  description?: string | null;
}

// Fonction pour transformer la réponse de l'API
const transformApiResponse = (data: any): Category[] => {
  // Si la réponse est au format hydra/API Platform avec "member"
  if (data && data['member'] && Array.isArray(data['member'])) {
    return data['member'].map((category: any) => ({
      id: category.id,
      name: category.name,
      description: category.description
    }));
  }
  
  // Si la réponse est au format API Platform standard "member"
  if (data && data['hydra:member'] && Array.isArray(data['hydra:member'])) {
    return data['hydra:member'].map((category: any) => ({
      id: category.id,
      name: category.name,
      description: category.description
    }));
  }
  
  // Si la réponse est un tableau de categories
  if (Array.isArray(data)) {
    return data.map((category: any) => ({
      id: category.id,
      name: category.name,
      description: category.description
    }));
  }
  
  // Si c'est une catg unique
  if (data && data.id) {
    return [{
      id: data.id,
      name: data.name,
      description: data.description
    }];
  }
  
  // Si la réponse est d'un format inattendu, retourner un tableau vide
  console.error('Format de réponse API inattendu:', data);
  return [];
};

export const categoryService = {
  // récupérer toutes les catégories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<any>('/categories');
      return transformApiResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  // récupérer categorie par id
  async getCategory(id: number): Promise<Category> {
    try {
      const response = await api.get<any>(`/categories/${id}`);
      const categories = transformApiResponse(response.data);
      return categories[0];
    } catch (error) {
      throw error;
    }
  },

  // Créer une catégorie
  async createCategory(categoryData: CategoryCreationData): Promise<Category> {
    try {
      console.log('Création de catégorie avec:', categoryData);
      
      const response = await api.post<any>('/categories', categoryData);
      console.log('Réponse reçue:', response);
      
      const categories = transformApiResponse(response.data);
      return categories[0];
    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw error;
    }
  },

  // Modifier une catégorie
  async updateCategory(id: number, categoryData: CategoryUpdateData): Promise<Category> {
    try {
      const response = await api.put<any>(`/categories/${id}`, categoryData);
      const categories = transformApiResponse(response.data);
      return categories[0];
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une catégorie
  async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/categories/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default categoryService;