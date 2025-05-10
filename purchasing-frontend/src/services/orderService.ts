import api from './api';
import type { Order, OrderCreationData, OrderUpdateData } from '../types';

// Fonction utilitaire pour transformer la réponse de l'API
const transformApiResponse = (data: any): Order[] => {
  // Si la réponse est au format hydra/API Platform avec "member"
  if (data && data['hydra:member'] && Array.isArray(data['hydra:member'])) {
    return data['hydra:member'].map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber || '',
      orderDate: order.orderDate || new Date().toISOString(),
      status: order.status || 'pending',
      totalAmount: order.totalAmount || '0',
      notes: order.notes || null,
      productOrders: order.productOrders || [],
      customer: order.customer || null,
      isActive: order.isActive !== undefined ? order.isActive : true,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
  }
  
  // Si la réponse est un tableau de commandes
  if (Array.isArray(data)) {
    return data.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber || '',
      orderDate: order.orderDate || new Date().toISOString(),
      status: order.status || 'pending',
      totalAmount: order.totalAmount || '0',
      notes: order.notes || null,
      productOrders: order.productOrders || [],
      customer: order.customer || null,
      isActive: order.isActive !== undefined ? order.isActive : true,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));
  }
  
  // Si c'est une commande unique
  if (data && data.id) {
    return [{
      id: data.id,
      orderNumber: data.orderNumber || '',
      orderDate: data.orderDate || new Date().toISOString(),
      status: data.status || 'pending',
      totalAmount: data.totalAmount || '0',
      notes: data.notes || null,
      productOrders: data.productOrders || [],
      customer: data.customer || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    }];
  }
  
  // Si la réponse est d'un format inattendu, retourner un tableau vide
  console.error('Format de réponse API inattendu:', data);
  return [];
};

export const orderService = {
  // récupérer toutes les commandess
  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get<any>('/orders');
      return transformApiResponse(response.data);
    } catch (error) {
      throw error;
    }
  },
  
  // récupérer une seule commande
  async getOrder(id: number): Promise<Order> {
    try {
      const response = await api.get<any>(`/orders/${id}`);
      const orders = transformApiResponse(response.data);
      return orders[0];
    } catch (error) {
      throw error;
    }
  },
  
  // créer une commande
  async createOrder(orderData: OrderCreationData): Promise<Order> {
    try {
      console.log('Création de commande avec:', orderData);
      
      const response = await api.post<any>('/orders', orderData);
      console.log('Réponse reçue:', response);
      
      const orders = transformApiResponse(response.data);
      return orders[0];
    } catch (error) {
      console.error('Erreur détaillée:', error);
      throw error;
    }
  },
  
  // modifier une commande
  async updateOrder(id: number, orderData: OrderUpdateData): Promise<Order> {
    try {
      const response = await api.put<any>(`/orders/${id}`, orderData);
      const orders = transformApiResponse(response.data);
      return orders[0];
    } catch (error) {
      throw error;
    }
  },
  
  // supprimer une commande
  async deleteOrder(id: string): Promise<void> {
    try {
      await api.delete(`/orders/${id}`);
    } catch (error) {
      throw error;
    }
  },
  
  // modifier le statut de la commande
  async updateOrderStatus(id: number, status: string): Promise<Order> {
    try {
      const response = await api.patch<any>(`/orders/${id}`, { status });
      const orders = transformApiResponse(response.data);
      return orders[0];
    } catch (error) {
      throw error;
    }
  }
};