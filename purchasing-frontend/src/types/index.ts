export interface User {
    id?: number;
    email: string;
    roles: string[];
    password?: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
}
  
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
  
export interface LoginCredentials {
    email: string;
    password: string;
}
  
export interface AuthResponse {
    token: string;
    user: User;
}
  
export * from './product';
export * from './order';