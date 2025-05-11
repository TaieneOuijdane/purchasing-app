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
  isInitialized: boolean;
}

// Définir l'interface pour le contexte d'authentification
export interface AuthContextProps extends AuthState {
  login: (email: string, password: string, remember: boolean) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Provider qui fournira le contexte à toute l'application
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {  
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    isAdmin: false,
    isInitialized: false,
  });

  useEffect(() => {    
    const checkAuthStatus = async () => {
      
      try {
        const token = localStorage.getItem('token');
        // Vérifier si le token est valide et récupérer les données de l'utilisateur
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        if (!token) {
          setState({
            user: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,
            isAdmin: false,
            isInitialized: true,
          });
          return;
        }
        
        if (tokenExpiry) {
          const now = new Date();
          const expiry = new Date(tokenExpiry);
                  
          if (now >= expiry) {
            authService.clearAuthData();
            setState({
              user: null,
              isLoading: false,
              error: 'Session expirée',
              isAuthenticated: false,
              isAdmin: false,
              isInitialized: true,
            });
            return;
          }
        }
        setState(prev => {
          return { ...prev, isLoading: true };
        });
        
        try {
          const { valid, expired } = await authService.validateToken();

          if (!valid) {
            authService.clearAuthData();
            setState({
              user: null,
              isLoading: false,
              error: expired ? 'Session expirée' : null,
              isAuthenticated: false,
              isAdmin: false,
              isInitialized: true,
            });
            return;
          }
          const userData = await authService.getCurrentUser();
          setState({
            user: userData,
            isLoading: false,
            error: null,
            isAuthenticated: true,
            isAdmin: userData.roles.includes('ROLE_ADMIN'),
            isInitialized: true,
          });
        } catch (error) {
          authService.clearAuthData();
          setState({
            user: null,
            isLoading: false,
            error: (error as Error).message,
            isAuthenticated: false,
            isAdmin: false,
            isInitialized: true,
          });
        }
      } catch (outerError) {
        console.error('Outer try-catch error:', outerError);
      }
    };

    checkAuthStatus();    
  }, []);

  const login = async (email: string, password: string, remember: boolean = false): Promise<User> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.login({ email, password });
      
      const expirationDate = new Date();
      
      if (remember) {
        expirationDate.setDate(expirationDate.getDate() + 1);
      } else {
        expirationDate.setHours(expirationDate.getHours() + 3);
      }
    
      localStorage.setItem('token', response.token);
      localStorage.setItem('tokenExpiry', expirationDate.toISOString());
      localStorage.setItem('remember', remember.toString());

      setState({
        user: response.user,
        isLoading: false,
        error: null,
        isAuthenticated: true,
        isAdmin: response.user.roles.includes('ROLE_ADMIN'),
        isInitialized: true,
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
      setState({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        isAdmin: false,
        isInitialized: true,
      });
    } catch (error) {
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