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
}

export interface ProductOrder {
  id?: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product: number | Product;
}