import type { Product } from './product';

interface UserReference {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Order {
  id?: number;
  orderNumber: string;
  orderDate: string;
  status: string;
  totalAmount: string;
  notes?: string | null;
  isActive: boolean;
  customer: number | UserReference;
  productOrders?: ProductOrder[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductOrder {
  id?: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product: number | Product;
}

export interface OrderCreationData {
  productOrders: Array<{
    product: string; 
    quantity: number;
  }>;
  notes?: string;
  status?: string;
}

export interface OrderUpdateData {
  productOrders?: Array<{
    product: string;
    quantity: number;
  }>;
  notes?: string;
  status?: string;
}