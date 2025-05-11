import api from './api';
import type { Order, OrderCreationData, OrderUpdateData } from '../types';

const transformProductOrders = (productOrders: any) => {
  if (!productOrders) return [];
  
  if (Array.isArray(productOrders)) {
    return productOrders;
  }
  
  if (typeof productOrders === 'object') {
    return Object.values(productOrders);
  }
  
  return [];
};

const transformOrder = (order: any): Order => ({
  id: order.id,
  orderNumber: order.orderNumber || '',
  orderDate: order.orderDate || new Date().toISOString(),
  status: order.status || 'pending',
  totalAmount: order.totalAmount || '0',
  notes: order.notes || null,
  productOrders: transformProductOrders(order.productOrders),
  customer: order.customer || null,
  isActive: order.isActive !== undefined ? order.isActive : true,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt
});

const transformApiResponse = (data: any): Order[] => {
  if (data && data.member && Array.isArray(data.member)) {
    return data.member.map(transformOrder);
  }
  
  if (data && data['hydra:member'] && Array.isArray(data['hydra:member'])) {
    return data['hydra:member'].map(transformOrder);
  }
  
  // Si la réponse est un tableau de commandes
  if (Array.isArray(data)) {
    return data.map(transformOrder);
  }
  
  // Si c'est une commande unique
  if (data && data.id) {
    return [transformOrder(data)];
  }
  
  // Si la réponse est d'un format inattendu, retourner un tableau vide
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
      if (!orders || orders.length === 0) {
        throw new Error(`Order with ID ${id} not found`);
      }
      
      return orders[0];
    } catch (error) {
      throw error;
    }
  },
  
  // créer une commande
  async createOrder(orderData: OrderCreationData): Promise<Order> {
    try {
      
      const response = await api.post<any>('/orders', orderData);
      
      const orders = transformApiResponse(response.data);
      return orders[0];
    } catch (error) {
      throw error;
    }
  },
  
  // modifier une commande
  async updateOrder(id: number, orderData: OrderUpdateData): Promise<Order> {
    try {
      const response = await api.put<any>(`/orders/${id}`, orderData);
      const orders = transformApiResponse(response.data);
      
      if (!orders || orders.length === 0) {
        throw new Error(`Failed to update order with ID ${id}`);
      }
      
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