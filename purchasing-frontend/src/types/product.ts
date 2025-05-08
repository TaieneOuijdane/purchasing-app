export interface Product {
    id?: number;
    name: string;
    description?: string | null;
    price: string;
    sku: string;
    stock: number;
    image?: string | null;
    isActive: boolean;
    category: number | Category;
    createdAt?: string;
  }
  
  export interface Category {
    id?: number;
    name: string;
    description?: string | null;
  }