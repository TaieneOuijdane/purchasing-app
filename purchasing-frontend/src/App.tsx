import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Créer des pages temporaires pour les routes manquantes
const TempHomePage = () => <div className="p-8"><h1 className="text-2xl font-bold">Page d'accueil</h1></div>;
const TempProductsPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Page des produits</h1></div>;
const TempOrdersPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Page des commandes</h1></div>;
const TempAdminPage = () => <div className="p-8"><h1 className="text-2xl font-bold">Page d'administration</h1></div>;
const TempProfilePage = () => <div className="p-8"><h1 className="text-2xl font-bold">Page de profil</h1></div>;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public pages */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected pages */}
            <Route path="/" element={<ProtectedRoute element={<TempHomePage />} />} />
            <Route path="/products" element={<ProtectedRoute element={<TempProductsPage />} />} />
            <Route path="/orders" element={<ProtectedRoute element={<TempOrdersPage />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<TempProfilePage />} />} />
            
            {/* Admin pages */}
            <Route path="/admin" element={<AdminRoute element={<TempAdminPage />} />} />
            
            {/* Redirections & Page 404 */}
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;