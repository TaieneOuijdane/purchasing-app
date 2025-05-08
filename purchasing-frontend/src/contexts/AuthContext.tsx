import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Définir l'interface pour le contexte d'authentification
export interface AuthContextProps extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

// Créer le contexte avec une valeur par défaut
export const AuthContext = createContext<AuthContextProps | null>(null);

// Props pour le provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider qui fournira le contexte à toute l'application
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // État local pour stocker les informations d'authentification
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
    isAuthenticated: false,
    isAdmin: false,
  });

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkAuthStatus = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Vérifier si le token est valide et récupérer les données de l'utilisateur
          const userData = await authService.getCurrentUser();
          setState({
            user: userData,
            isLoading: false,
            error: null,
            isAuthenticated: true,
            isAdmin: userData.roles.includes('ROLE_ADMIN'),
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification', error);
        localStorage.removeItem('token');
        setState({
          user: null,
          isLoading: false,
          error: (error as Error).message,
          isAuthenticated: false,
          isAdmin: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.token);
      
      setState({
        user: response.user,
        isLoading: false,
        error: null,
        isAuthenticated: true,
        isAdmin: response.user.roles.includes('ROLE_ADMIN'),
      });
      
      return response.user;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: (error as Error).message,
        isAuthenticated: false,
        isAdmin: false,
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      setState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      throw error;
    }
  };

  const value: AuthContextProps = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};