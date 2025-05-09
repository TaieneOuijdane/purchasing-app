import api from './api';
import type { Product, Category } from '../types';

export interface ProductCreationData {
  name: string;
  description?: string | null;
  price: string;
  sku: string;
  stock: number;
  image?: string | null;
  isActive: boolean;
  category: number | string; 
}
  
export interface ProductUpdateData {
  name?: string;
  description?: string | null;
  price?: string;
  sku?: string;
  stock?: number;
  image?: string | null;
  isActive?: boolean;
    category?: number | string;  
}

// Fonction pour transformer la réponse de l'API
const transformApiResponse = (data: any): Product[] => {
  // Si la réponse est au format hydra/API Platform avec "member"
  if (data && data['hydra:member'] && Array.isArray(data['hydra:member'])) {
    return data['hydra:member'].map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      sku: product.sku,
      stock: product.stock,
      image: product.image || null,
      isActive: product.isActive !== undefined ? product.isActive : true,
      category: product.category, 
      createdAt: product.createdAt
    }));
  }
  
  // Si la réponse est au format API Platform standard "member"
  if (data && data['member'] && Array.isArray(data['member'])) {
    return data['member'].map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      sku: product.sku,
      stock: product.stock,
      image: product.image || null,
      isActive: product.isActive !== undefined ? product.isActive : true,
      category: product.category,  
      createdAt: product.createdAt
    }));
  }
  // Si la réponse est un tableau de produits
  if (Array.isArray(data)) {
    return data.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      sku: product.sku,
      stock: product.stock,
      image: product.image,
      isActive: product.isActive,
      category: product.category,
      createdAt: product.createdAt
    }));
  }

  // Si c'est un produit unique
  if (data && data.id) {
    return [{
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      sku: data.sku,
      stock: data.stock,
      image: data.image,
      isActive: data.isActive,
      category: data.category,
      createdAt: data.createdAt
    }];
  }

  // Si la réponse est d'un format inattendu, retourner un tableau vide
  console.error('Format de réponse API inattendu:', data);
  return [];
};

// Transforme un objet Product pour l'envoi à l'API
const prepareProductForApi = (product: ProductCreationData | ProductUpdateData): any => {
  const preparedProduct = { ...product };
  
  if (typeof preparedProduct.category === 'number' || 
      (typeof preparedProduct.category === 'string' && !preparedProduct.category.startsWith('/api/'))) {
    const categoryId = typeof preparedProduct.category === 'string' 
      ? parseInt(preparedProduct.category) 
      : preparedProduct.category;
      
    if (!isNaN(categoryId as number)) {
      preparedProduct.category = `/api/categories/${categoryId}`;
    }
  }
  
  return preparedProduct;
};

export const productService = {
  // récupérer tous les produits
  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get<any>('/products');
      return transformApiResponse(response.data);
    } catch (error) {
      throw error;
    }
  },

  // récupérer le produit par ID
  async getProduct(id: number): Promise<Product> {
    try {
      const response = await api.get<any>(`/products/${id}`);
      const products = transformApiResponse(response.data);
      return products[0];
    } catch (error) {
      throw error;
    }
  },

  // Créer un nouveau produit
  async createProduct(productData: ProductCreationData): Promise<Product> {
    try {
      const preparedData = prepareProductForApi(productData);
      const response = await api.post<any>('/products', preparedData, {
        headers: {
          'Content-Type': 'application/ld+json',
        }
      });
      const products = transformApiResponse(response.data);
      return products[0];
    } catch (error) {
      throw error;
    }
  },

  // Modifier un produit
  async updateProduct(id: number, productData: ProductUpdateData): Promise<Product> {
    try {
      const preparedData = prepareProductForApi(productData);
      const response = await api.patch<any>(`/products/${id}`, preparedData, {
        headers: {
          'Content-Type': 'application/merge-patch+json',
        }
      });
      const products = transformApiResponse(response.data);
      return products[0];
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un produit
  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default productService;